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

    const section = page.getByTestId("scroll-expand-showcase");
    const sticky = page.getByTestId("scroll-expand-sticky");
    const frame = page.getByTestId("scroll-expand-frame");
    const intro = page.getByTestId("scroll-expand-intro");
    const reveal = page.getByTestId("scroll-expand-reveal");
    const labels = page.getByTestId("scroll-expand-card-label");
    const staticHeading = page.getByTestId("scroll-expand-static-heading");
    await section.waitFor({ state: "visible" });

    const sectionMetrics = await section.evaluate((element) => ({
      top: element.getBoundingClientRect().top + window.scrollY,
      height: element.getBoundingClientRect().height,
      viewportHeight: window.innerHeight,
    }));

    await page.evaluate((top) => window.scrollTo(0, top), sectionMetrics.top);
    await page.waitForTimeout(650);

    const startBox = await frame.boundingBox();
    assert(startBox, `${name}: o frame expansível não possui área visível no início`);
    const startScroll = await page.evaluate(() => window.scrollY);
    const startIntro = await readLayerState(intro);
    const startReveal = await readLayerState(reveal);
    const stickyPosition = await sticky.evaluate((element) => getComputedStyle(element).position);
    const hasScrollInstruction = await section.evaluate(
      (element) => element.textContent?.includes("Role para ampliar") ?? false,
    );

    let endBox = startBox;
    let endScroll = startScroll;
    let endIntro = startIntro;
    let endReveal = startReveal;

    if (reducedMotion === "reduce") {
      assert(stickyPosition !== "sticky", `${name}: o modo reduzido manteve a seção presa`);
      assert(!hasScrollInstruction, `${name}: o modo reduzido ainda pede rolagem para animar`);
      assert(await staticHeading.isVisible(), `${name}: o título estático não apareceu`);
      assert(startIntro.opacity <= 0.05, `${name}: o título animado continuou sobre os cards`);
      assert(startReveal.opacity >= 0.9, `${name}: o CTA sumiu no modo reduzido`);
      await assertNoCtaLabelOverlap(reveal, labels, name);
      await page.screenshot({ path: `${outputDir}/${name}-showcase.png`, fullPage: false });

      const targetScroll = sectionMetrics.top + Math.max(sectionMetrics.height * 0.72, 320);
      await page.evaluate((top) => window.scrollTo(0, top), targetScroll);
      await page.waitForTimeout(650);
      endScroll = await page.evaluate(() => window.scrollY);
      assert(endScroll > startScroll + 100, `${name}: a página não permitiu rolagem normal`);
    } else {
      assert(stickyPosition === "sticky", `${name}: a camada principal deixou de ser sticky`);
      assert(hasScrollInstruction, `${name}: a instrução inicial de rolagem não está visível`);

      const activeScrollRange = Math.max(sectionMetrics.height - sectionMetrics.viewportHeight, 1);
      const targetScroll = sectionMetrics.top + activeScrollRange * 0.96;
      await page.evaluate((top) => window.scrollTo(0, top), targetScroll);
      await page.waitForTimeout(850);

      endBox = await frame.boundingBox();
      assert(endBox, `${name}: o frame expansível desapareceu durante a rolagem`);
      endScroll = await page.evaluate(() => window.scrollY);
      endIntro = await readLayerState(intro);
      endReveal = await readLayerState(reveal);

      assert(endScroll > startScroll + 100, `${name}: a página não permitiu rolagem normal`);
      assert(
        endBox.y >= 60 && endBox.y <= 68,
        `${name}: o frame saiu da faixa sticky durante a expansão (y=${endBox.y.toFixed(1)}px)`,
      );
      assert(
        endBox.width - startBox.width > 20 || endBox.height - startBox.height > 40,
        `${name}: o frame não aumentou durante a rolagem`,
      );
      assert(endIntro.opacity <= 0.05, `${name}: o título inicial não desapareceu`);
      assert(endReveal.opacity >= 0.9, `${name}: o CTA final não apareceu`);
      assert(endReveal.visibility !== "hidden", `${name}: o CTA final está oculto`);
      await assertNoCtaLabelOverlap(reveal, labels, name);

      const showcaseLink = reveal.getByRole("link");
      assert(
        (await showcaseLink.getAttribute("href")) === "#demonstracoes",
        `${name}: o CTA final aponta para o destino incorreto`,
      );
      await page.screenshot({ path: `${outputDir}/${name}-showcase.png`, fullPage: false });
    }

    const showcaseImages = await section.locator("img").evaluateAll((images) => ({
      total: images.length,
      loaded: images.filter((image) => image.complete && image.naturalWidth > 0).length,
    }));
    assert(showcaseImages.total === 4, `${name}: o showcase não contém as quatro demonstrações`);
    assert(showcaseImages.loaded === 4, `${name}: nem todas as imagens do showcase carregaram`);
    assert(runtimeErrors.length === 0, `${name}: erros de runtime: ${runtimeErrors.join(" | ")}`);

    report.checks.push({
      name,
      status: "passed",
      viewport,
      reducedMotion,
      startBox,
      endBox,
      startScroll,
      endScroll,
      stickyPosition,
      startIntro,
      startReveal,
      endIntro,
      endReveal,
      showcaseImages,
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
