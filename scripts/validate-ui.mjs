import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

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

function boxesOverlap(first, second) {
  return !(
    first.x + first.width <= second.x ||
    second.x + second.width <= first.x ||
    first.y + first.height <= second.y ||
    second.y + second.height <= first.y
  );
}

async function createPage(browser, options, label) {
  const context = await browser.newContext(options);

  if (options.viewport.width >= 768 && options.reducedMotion !== "reduce") {
    await context.addInitScript(() => {
      const nativeMatchMedia = window.matchMedia.bind(window);
      window.matchMedia = (query) => {
        const result = nativeMatchMedia(query);
        const forcedMatch =
          query === "(hover: hover) and (pointer: fine)"
            ? true
            : query === "(pointer: coarse)"
              ? false
              : result.matches;

        return {
          matches: forcedMatch,
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

  page.on("pageerror", (error) => {
    runtimeErrors.push(`pageerror: ${error.message}`);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(`console.error: ${message.text()}`);
    }
  });

  page.on("requestfailed", (request) => {
    const url = request.url();
    if (!url.startsWith(baseUrl)) {
      report.warnings.push(`${label}: recurso externo não carregou: ${url}`);
    }
  });

  return { context, page, runtimeErrors };
}

async function waitForStablePage(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(500);
}

async function readLayerState(locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      opacity: Number(style.opacity),
      visibility: style.visibility,
    };
  });
}

async function assertNoCtaLabelOverlap(reveal, labels, name) {
  const ctaBox = await reveal.getByRole("link").boundingBox();
  assert(ctaBox, `${name}: o CTA final não possui área visível`);

  const labelBoxes = await labels.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      };
    }),
  );

  const overlappingLabel = labelBoxes.findIndex((labelBox) => boxesOverlap(ctaBox, labelBox));
  assert(
    overlappingLabel === -1,
    `${name}: o CTA final cobre o texto do card ${overlappingLabel + 1}`,
  );
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
    assert(response?.ok(), `${name}: a homepage respondeu com status ${response?.status()}`);
    await page.locator("main#conteudo").waitFor({ state: "visible" });
    await waitForStablePage(page);

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
    });

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    assert(!hasHorizontalOverflow, `${name}: foi detectado overflow horizontal`);

    const whatsappLinks = page.locator('a[href^="https://wa.me/"]');
    assert(
      (await whatsappLinks.count()) >= 2,
      `${name}: os CTAs de WhatsApp não foram encontrados`,
    );
    assert(
      await page
        .getByRole("link", { name: /Planos/i })
        .first()
        .isVisible(),
      `${name}: o acesso aos planos não está visível`,
    );

    await page.screenshot({ path: `${outputDir}/${name}-top.png`, fullPage: false });

    const journey = page.getByTestId("universe-journey");
    const configurator = page.getByTestId("offer-configurator");
    await journey.waitFor({ state: "visible" });

    const journeyImageLocators = journey.locator("img");
    const journeyImageCount = await journeyImageLocators.count();
    for (let index = 0; index < journeyImageCount; index += 1) {
      const image = journeyImageLocators.nth(index);
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(async (element) => {
        if (!element.complete) {
          await new Promise((resolve) => {
            element.addEventListener("load", resolve, { once: true });
            element.addEventListener("error", resolve, { once: true });
          });
        }
        await element.decode?.().catch(() => undefined);
      });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const journeyMetrics = await journey.evaluate((element) => ({
      top: element.getBoundingClientRect().top + window.scrollY,
      height: element.getBoundingClientRect().height,
      viewportHeight: window.innerHeight,
    }));
    const journeyImages = await journey.locator("img").evaluateAll((images) => ({
      total: images.length,
      loaded: images.filter((image) => image.complete && image.naturalWidth > 0).length,
    }));
    assert(journeyImages.total === 4, `${name}: a jornada não contém os quatro universos`);
    assert(journeyImages.loaded === 4, `${name}: nem todas as imagens da jornada carregaram`);

    let startScroll = await page.evaluate(() => window.scrollY);
    let endScroll = startScroll;
    let stickyPosition = "static";
    let imageTransformChanged = false;

    if (reducedMotion === "reduce") {
      const staticChapters = page.getByTestId("universe-chapter-static");
      assert((await staticChapters.count()) === 4, `${name}: fallback estático incompleto`);
      assert(
        (await page.getByTestId("universe-chapter-sticky").count()) === 0,
        `${name}: o modo reduzido manteve capítulos presos`,
      );
      await page.evaluate((top) => window.scrollTo(0, top), journeyMetrics.top);
      await page.waitForTimeout(650);
      await page.screenshot({ path: `${outputDir}/${name}-showcase.png`, fullPage: false });
      const targetScroll = journeyMetrics.top + Math.max(journeyMetrics.height * 0.6, 420);
      await page.evaluate((top) => window.scrollTo(0, top), targetScroll);
      await page.waitForTimeout(650);
      endScroll = await page.evaluate(() => window.scrollY);
      assert(endScroll > startScroll + 100, `${name}: a página não permitiu rolagem normal`);
    } else {
      const chapters = page.getByTestId("universe-chapter");
      assert((await chapters.count()) === 4, `${name}: faltam capítulos imersivos`);
      assert(
        journeyMetrics.height > journeyMetrics.viewportHeight * 8,
        `${name}: a jornada não possui percurso suficiente`,
      );

      const firstChapter = chapters.nth(0);
      const firstMetrics = await firstChapter.evaluate((element) => ({
        top: element.getBoundingClientRect().top + window.scrollY,
        height: element.getBoundingClientRect().height,
        viewportHeight: window.innerHeight,
      }));
      assert(
        firstMetrics.height > firstMetrics.viewportHeight * 1.8,
        `${name}: o primeiro capítulo ficou curto demais`,
      );

      const sticky = firstChapter.getByTestId("universe-chapter-sticky");
      stickyPosition = await sticky.evaluate((element) => getComputedStyle(element).position);
      assert(stickyPosition === "sticky", `${name}: o capítulo principal deixou de ser sticky`);

      const image = firstChapter.getByTestId("universe-chapter-image");
      await page.evaluate((top) => window.scrollTo(0, top), firstMetrics.top + 10);
      await page.waitForTimeout(650);
      startScroll = await page.evaluate(() => window.scrollY);
      const startTransform = await image.evaluate((element) => getComputedStyle(element).transform);

      const activeRange = Math.max(firstMetrics.height - firstMetrics.viewportHeight, 1);
      await page.evaluate((top) => window.scrollTo(0, top), firstMetrics.top + activeRange * 0.58);
      await page.waitForTimeout(850);
      endScroll = await page.evaluate(() => window.scrollY);
      const middleTransform = await image.evaluate(
        (element) => getComputedStyle(element).transform,
      );
      imageTransformChanged = startTransform !== middleTransform;

      assert(endScroll > startScroll + 100, `${name}: a página não permitiu rolagem normal`);
      assert(imageTransformChanged, `${name}: a imagem não respondeu ao progresso do capítulo`);
      await page.screenshot({ path: `${outputDir}/${name}-showcase.png`, fullPage: false });
    }

    await configurator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const goalButtons = configurator.getByTestId("offer-goal");
    const planButtons = configurator.getByTestId("offer-plan");
    assert((await goalButtons.count()) === 4, `${name}: objetivos do configurador incompletos`);
    assert((await planButtons.count()) === 3, `${name}: níveis de escopo incompletos`);

    const secondGoal = goalButtons.nth(1);
    await secondGoal.click();
    assert(
      (await secondGoal.getAttribute("aria-pressed")) === "true",
      `${name}: o objetivo não alterou o configurador`,
    );
    const firstPlan = planButtons.nth(0);
    await firstPlan.click();
    assert(
      (await firstPlan.getAttribute("aria-pressed")) === "true",
      `${name}: o escopo não alterou o configurador`,
    );

    assert(runtimeErrors.length === 0, `${name}: erros de runtime: ${runtimeErrors.join(" | ")}`);

    await configurator.screenshot({ path: `${outputDir}/${name}-configurator.png` });

    report.checks.push({
      name,
      status: "passed",
      viewport,
      reducedMotion,
      journeyMetrics,
      journeyImages,
      startScroll,
      endScroll,
      stickyPosition,
      imageTransformChanged,
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
    await page.goto(`${baseUrl}/demo/moda`, { waitUntil: "networkidle", timeout: 90_000 });
    await waitForStablePage(page);

    const storefront = page.getByTestId("fashion-storefront");
    const hero = page.getByTestId("fashion-hero");
    await storefront.waitFor({ state: "visible" });
    await hero.waitFor({ state: "visible" });
    await hero.screenshot({ path: `${outputDir}/${label}-hero.png` });

    const lookCards = hero.getByTestId("fashion-look-card");
    const lookCount = await lookCards.count();
    assert(lookCount >= 3, `${label}: o provador possui menos de tres looks`);
    const pressedBefore = await lookCards.evaluateAll((cards) =>
      cards.findIndex((card) => card.getAttribute("aria-pressed") === "true"),
    );
    await hero.getByRole("button", { name: /ximo look/i }).click();
    await page.waitForTimeout(850);
    const pressedAfter = await lookCards.evaluateAll((cards) =>
      cards.findIndex((card) => card.getAttribute("aria-pressed") === "true"),
    );
    assert(pressedAfter !== pressedBefore, `${label}: o provador nao respondeu ao comando`);

    const chapters = page.getByTestId("fashion-chapter");
    assert((await chapters.count()) === 3, `${label}: a jornada nao possui tres capitulos`);
    const firstChapter = chapters.first();
    const chapterBox = await firstChapter.boundingBox();
    assert(chapterBox, `${label}: o primeiro capitulo nao possui dimensoes`);
    assert(
      chapterBox.height > viewport.height * 1.7,
      `${label}: o capitulo nao sustenta uma cena longa`,
    );

    const atelier = page.getByTestId("fashion-atelier");
    await atelier.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const categories = atelier.getByTestId("fashion-category");
    assert((await categories.count()) >= 4, `${label}: faltam categorias no atelier`);
    const secondCategory = categories.nth(1);
    await secondCategory.click();
    assert(
      (await secondCategory.getAttribute("aria-pressed")) === "true",
      `${label}: a curadoria nao mudou de categoria`,
    );
    await atelier.screenshot({ path: `${outputDir}/${label}-atelier.png` });

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    assert(!hasHorizontalOverflow, `${label}: foi detectado overflow horizontal`);
    assert(runtimeErrors.length === 0, `${label}: erros de runtime: ${runtimeErrors.join(" | ")}`);

    report.checks.push({
      name: label,
      status: "passed",
      viewport,
      lookCount,
      pressedBefore,
      pressedAfter,
      chapters: await chapters.count(),
      categories: await categories.count(),
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
    assert(
      httpStatus === 404 || httpStatus === 200,
      `${label}: resposta HTTP inesperada ${httpStatus ?? "sem status"}`,
    );
    await waitForStablePage(page);

    await page.getByRole("heading", { name: "404" }).waitFor({ state: "visible" });
    const homeLink = page.getByRole("link", { name: /Voltar ao início/i });
    const demosLink = page.getByRole("link", { name: /Ver demonstrações/i });
    assert(await homeLink.isVisible(), `${label}: o retorno ao início não está visível`);
    assert(await demosLink.isVisible(), `${label}: o acesso às demonstrações não está visível`);
    assert(
      (await homeLink.getAttribute("href")) === "/",
      `${label}: o retorno aponta para rota errada`,
    );
    assert(
      (await demosLink.getAttribute("href")) === "/#demonstracoes",
      `${label}: o acesso às demonstrações aponta para rota errada`,
    );

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    assert(!hasHorizontalOverflow, `${label}: foi detectado overflow horizontal`);
    await page.screenshot({ path: `${outputDir}/${label}.png`, fullPage: false });

    const unexpectedRuntimeErrors = runtimeErrors.filter(
      (error) =>
        !(
          httpStatus === 404 &&
          error.startsWith(
            "console.error: Failed to load resource: the server responded with a status of 404",
          )
        ),
    );
    assert(
      unexpectedRuntimeErrors.length === 0,
      `${label}: erros de runtime: ${unexpectedRuntimeErrors.join(" | ")}`,
    );

    report.checks.push({
      name: label,
      status: "passed",
      viewport,
      httpStatus,
      ignoredExpectedConsoleMessages: runtimeErrors.length - unexpectedRuntimeErrors.length,
    });
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
