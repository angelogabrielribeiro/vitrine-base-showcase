import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outputDir = "artifacts/ui-validation";
const report = {
  baseUrl,
  startedAt: new Date().toISOString(),
  checks: [],
  warnings: [],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function createPage(browser, options, label) {
  const context = await browser.newContext(options);

  if (options.viewport.width >= 1024 && options.reducedMotion !== "reduce") {
    await context.addInitScript(() => {
      const nativeMatchMedia = window.matchMedia.bind(window);
      window.matchMedia = (query) => {
        const result = nativeMatchMedia(query);
        const matches =
          query === "(hover: hover) and (pointer: fine)"
            ? true
            : query === "(pointer: coarse)"
              ? false
              : result.matches;
        return {
          matches,
          media: result.media,
          onchange: result.onchange,
          addListener: result.addListener.bind(result),
          removeListener: result.removeListener.bind(result),
          addEventListener: result.addEventListener.bind(result),
          removeEventListener: result.removeEventListener.bind(result),
          dispatchEvent: result.dispatchEvent.bind(result),
        };
      };
      Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: 8 });
      Object.defineProperty(navigator, "deviceMemory", { configurable: true, value: 8 });
    });
  }

  const page = await context.newPage();
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console.error: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    if (!request.url().startsWith(baseUrl)) {
      report.warnings.push(`${label}: recurso externo não carregou: ${request.url()}`);
    }
  });
  return { context, page, runtimeErrors };
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    if (document.fonts?.ready) await document.fonts.ready;
    const pending = [...document.images].filter((image) => {
      if (image.complete) return false;
      const rect = image.getBoundingClientRect();
      return image.loading !== "lazy" || rect.top < innerHeight * 2;
    });
    await Promise.race([
      Promise.all(
        pending.map(
          (image) =>
            new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            }),
        ),
      ),
      new Promise((resolve) => window.setTimeout(resolve, 5_000)),
    ]);
  });
  await page.waitForTimeout(650);
}

async function assertNoOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert(
    Math.max(metrics.document, metrics.body) <= metrics.viewport + 2,
    `${label}: overflow horizontal ${JSON.stringify(metrics)}`,
  );
  return metrics;
}

async function assertImagesLoaded(locator, expected, label) {
  const images = locator.locator("img");
  await images.evaluateAll(async (elements) => {
    for (const image of elements) {
      image.loading = "eager";
      image.scrollIntoView({ block: "nearest", inline: "center" });
      await Promise.race([
        image.decode().catch(() => undefined),
        new Promise((resolve) => window.setTimeout(resolve, 2_500)),
      ]);
    }
  });
  const state = await images.evaluateAll((elements) => ({
    total: elements.length,
    loaded: elements.filter((image) => image.complete && image.naturalWidth > 0).length,
  }));
  assert(state.total === expected, `${label}: quantidade de imagens inesperada ${state.total}`);
  assert(
    state.loaded === expected,
    `${label}: ${expected - state.loaded} imagem(ns) não carregaram`,
  );
  return state;
}

async function validateHome(browser, config) {
  const { name, viewport, reducedMotion } = config;
  const { context, page, runtimeErrors } = await createPage(
    browser,
    { viewport, reducedMotion, deviceScaleFactor: 1 },
    name,
  );

  try {
    const response = await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90_000 });
    assert(response?.ok(), `${name}: homepage respondeu com status ${response?.status()}`);
    await page.locator("main#conteudo").waitFor({ state: "visible" });
    await settle(page);

    const overflow = await assertNoOverflow(page, name);
    assert(
      (await page.locator('a[href^="https://wa.me/"]').count()) >= 2,
      `${name}: CTAs de WhatsApp não encontrados`,
    );
    assert(
      await page
        .getByRole("link", { name: /Planos/i })
        .first()
        .isVisible(),
      `${name}: acesso aos planos não está visível`,
    );

    const showroomCards = page.locator("[data-showroom-card]");
    const activeCards = page.locator('[data-showroom-card][data-active="true"]');
    const passiveCards = page.locator('[data-showroom-card][data-active="false"]');
    assert((await showroomCards.count()) === 4, `${name}: showroom não contém quatro universos`);
    assert((await activeCards.count()) === 1, `${name}: showroom precisa de um universo ativo`);
    const showroomImages = await assertImagesLoaded(showroomCards, 4, name);

    let firstTapActivated = null;
    if (viewport.width < 1024) {
      const inactiveIndex = await showroomCards.evaluateAll((cards) =>
        cards.findIndex((card) => card.getAttribute("data-active") === "false"),
      );
      assert(inactiveIndex >= 0, `${name}: nenhum card inativo disponível para testar o foco`);
      const targetCard = showroomCards.nth(inactiveIndex);
      const beforeUrl = page.url();
      await targetCard.dispatchEvent("click");
      await page.waitForTimeout(700);
      firstTapActivated =
        page.url() === beforeUrl && (await targetCard.getAttribute("data-active")) === "true";
      assert(firstTapActivated, `${name}: primeiro toque não focou o card antes de navegar`);

      const duplicateJourney = page.getByTestId("universe-journey");
      if ((await duplicateJourney.count()) > 0) {
        assert(
          !(await duplicateJourney.isVisible()),
          `${name}: seleção duplicada de vitrines continua visível no mobile`,
        );
      }
    } else {
      const activeTransform = await activeCards.evaluate(
        (element) => getComputedStyle(element).transform,
      );
      const passiveTransform = await passiveCards
        .first()
        .evaluate((element) => getComputedStyle(element).transform);
      assert(
        activeTransform !== passiveTransform,
        `${name}: showroom desktop perdeu a composição em profundidade`,
      );
    }

    await page.screenshot({ path: `${outputDir}/${name}-top.png`, fullPage: false });

    const configurator = page.getByTestId("offer-configurator");
    await configurator.evaluate((element) =>
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 40 }),
    );
    await page.waitForTimeout(700);
    await configurator.waitFor({ state: "visible" });

    const goalButtons = configurator.getByTestId("offer-goal");
    const planButtons = configurator.getByTestId("offer-plan");
    assert((await goalButtons.count()) === 4, `${name}: objetivos do configurador incompletos`);
    assert((await planButtons.count()) === 3, `${name}: níveis de escopo incompletos`);
    await goalButtons.nth(1).click();
    assert(
      (await goalButtons.nth(1).getAttribute("aria-pressed")) === "true",
      `${name}: objetivo não alterou o configurador`,
    );
    await planButtons.nth(0).click();
    assert(
      (await planButtons.nth(0).getAttribute("aria-pressed")) === "true",
      `${name}: escopo não alterou o configurador`,
    );

    await page.screenshot({ path: `${outputDir}/${name}-showcase.png`, fullPage: false });
    await configurator.screenshot({ path: `${outputDir}/${name}-configurator.png` });
    assert(runtimeErrors.length === 0, `${name}: erros de runtime: ${runtimeErrors.join(" | ")}`);

    report.checks.push({
      name,
      status: "passed",
      viewport,
      reducedMotion,
      overflow,
      showroomImages,
      firstTapActivated,
      configuratorGoals: await goalButtons.count(),
      configuratorPlans: await planButtons.count(),
    });
  } finally {
    await context.close();
  }
}

async function validateFashion(browser, config) {
  const { name, viewport } = config;
  const label = `fashion-${name}`;
  const { context, page, runtimeErrors } = await createPage(
    browser,
    { viewport, reducedMotion: "no-preference", deviceScaleFactor: 1 },
    label,
  );

  try {
    const response = await page.goto(`${baseUrl}/demo/moda`, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    assert(response?.ok(), `${label}: resposta HTTP ${response?.status()}`);
    await settle(page);

    const hero = page.getByTestId("fashion-hero");
    await page.getByTestId("fashion-storefront").waitFor({ state: "visible" });
    await hero.waitFor({ state: "visible" });
    await hero.screenshot({ path: `${outputDir}/${label}-hero.png` });

    const lookCards = hero.getByTestId("fashion-look-card");
    assert((await lookCards.count()) >= 3, `${label}: provador possui menos de três looks`);
    const pressedBefore = await lookCards.evaluateAll((cards) =>
      cards.findIndex((card) => card.getAttribute("aria-pressed") === "true"),
    );
    await hero.getByRole("button", { name: /ximo look/i }).click();
    await page.waitForTimeout(850);
    const pressedAfter = await lookCards.evaluateAll((cards) =>
      cards.findIndex((card) => card.getAttribute("aria-pressed") === "true"),
    );
    assert(pressedAfter !== pressedBefore, `${label}: provador não respondeu ao comando`);

    const chapters = page.getByTestId("fashion-chapter");
    assert((await chapters.count()) === 3, `${label}: storytelling não possui três capítulos`);
    const firstChapter = chapters.first();
    const chapterBox = await firstChapter.boundingBox();
    assert(chapterBox, `${label}: primeiro capítulo não possui dimensões`);
    const sticky = firstChapter.locator(":scope > div.sticky");
    const stickyPosition =
      (await sticky.count()) > 0
        ? await sticky.evaluate((element) => getComputedStyle(element).position)
        : "missing";

    if (viewport.width < 768) {
      assert(
        chapterBox.height > viewport.height * 0.78,
        `${label}: capítulo mobile ficou curto e sem respiro`,
      );
      assert(stickyPosition !== "sticky", `${label}: capítulo mobile continua prendendo a tela`);
      const imageFit = await firstChapter
        .locator("img")
        .first()
        .evaluate((element) => getComputedStyle(element).objectFit);
      assert(imageFit === "contain", `${label}: imagem mobile continua cortada`);
    } else {
      assert(
        chapterBox.height >= viewport.height * 1.2 && chapterBox.height <= viewport.height * 1.5,
        `${label}: capítulo desktop saiu do intervalo editorial compacto`,
      );
      assert(stickyPosition === "sticky", `${label}: storytelling desktop perdeu o sticky`);
    }

    const atelier = page.getByTestId("fashion-atelier");
    await atelier.evaluate((element) =>
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 40 }),
    );
    await page.waitForTimeout(600);
    const categories = atelier.getByTestId("fashion-category");
    assert((await categories.count()) >= 4, `${label}: faltam categorias no atelier`);
    await categories.nth(1).click();
    assert(
      (await categories.nth(1).getAttribute("aria-pressed")) === "true",
      `${label}: curadoria não mudou de categoria`,
    );
    await atelier.screenshot({ path: `${outputDir}/${label}-atelier.png` });

    const overflow = await assertNoOverflow(page, label);
    assert(runtimeErrors.length === 0, `${label}: erros de runtime: ${runtimeErrors.join(" | ")}`);
    report.checks.push({
      name: label,
      status: "passed",
      viewport,
      overflow,
      pressedBefore,
      pressedAfter,
      chapters: await chapters.count(),
      categories: await categories.count(),
      stickyPosition,
    });
  } finally {
    await context.close();
  }
}

async function validateNotFound(browser, config) {
  const { name, viewport } = config;
  const label = `404-${name}`;
  const { context, page, runtimeErrors } = await createPage(
    browser,
    { viewport, deviceScaleFactor: 1 },
    label,
  );

  try {
    const response = await page.goto(`${baseUrl}/rota-inexistente-validacao-${name}`, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    const httpStatus = response?.status();
    assert(httpStatus === 404 || httpStatus === 200, `${label}: status HTTP ${httpStatus}`);
    await settle(page);
    await page.getByRole("heading", { name: "404" }).waitFor({ state: "visible" });
    assert(
      await page.getByRole("link", { name: /Voltar ao início/i }).isVisible(),
      `${label}: retorno ao início não está visível`,
    );
    assert(
      await page.getByRole("link", { name: /Ver demonstrações/i }).isVisible(),
      `${label}: acesso às demonstrações não está visível`,
    );
    const overflow = await assertNoOverflow(page, label);
    await page.screenshot({ path: `${outputDir}/${label}.png`, fullPage: false });

    const unexpectedErrors = runtimeErrors.filter(
      (error) =>
        !(
          httpStatus === 404 &&
          error.startsWith(
            "console.error: Failed to load resource: the server responded with a status of 404",
          )
        ),
    );
    assert(unexpectedErrors.length === 0, `${label}: ${unexpectedErrors.join(" | ")}`);
    report.checks.push({ name: label, status: "passed", viewport, httpStatus, overflow });
  } finally {
    await context.close();
  }
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  await validateHome(browser, {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  await validateHome(browser, {
    name: "mobile",
    viewport: { width: 390, height: 844 },
    reducedMotion: "no-preference",
  });
  await validateHome(browser, {
    name: "reduced-motion",
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  await validateHome(browser, {
    name: "reduced-motion-mobile",
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await validateFashion(browser, {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
  });
  await validateFashion(browser, {
    name: "mobile",
    viewport: { width: 390, height: 844 },
  });
  await validateNotFound(browser, {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
  });
  await validateNotFound(browser, {
    name: "mobile",
    viewport: { width: 390, height: 844 },
  });
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await writeFile(`${outputDir}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
