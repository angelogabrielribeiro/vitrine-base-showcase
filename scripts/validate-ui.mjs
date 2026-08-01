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

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    assert(!hasHorizontalOverflow, `${name}: foi detectado overflow horizontal`);

    await page.screenshot({ path: `${outputDir}/${name}-top.png`, fullPage: false });

    const section = page.getByTestId("scroll-expand-showcase");
    const frame = page.getByTestId("scroll-expand-frame");
    await section.waitFor({ state: "visible" });

    const sectionMetrics = await section.evaluate((element) => ({
      top: element.getBoundingClientRect().top + window.scrollY,
      height: element.getBoundingClientRect().height,
    }));

    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), sectionMetrics.top);
    await page.waitForTimeout(600);

    const startBox = await frame.boundingBox();
    assert(startBox, `${name}: o frame expansível não possui área visível no início`);
    const startScroll = await page.evaluate(() => window.scrollY);

    await page.evaluate(
      ({ top, height }) =>
        window.scrollTo({
          top: top + height * 0.72,
          behavior: "instant",
        }),
      sectionMetrics,
    );
    await page.waitForTimeout(900);

    const endBox = await frame.boundingBox();
    assert(endBox, `${name}: o frame expansível desapareceu durante a rolagem`);
    const endScroll = await page.evaluate(() => window.scrollY);
    assert(endScroll > startScroll + 100, `${name}: a página não permitiu rolagem normal`);

    const motionState = await section.evaluate((element) => {
      const stickyLayer = element.firstElementChild;
      return {
        stickyPosition: stickyLayer ? getComputedStyle(stickyLayer).position : null,
        prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        hasScrollInstruction: element.textContent?.includes("Role para ampliar") ?? false,
      };
    });

    if (reducedMotion === "reduce") {
      assert(
        motionState.prefersReducedMotion,
        `${name}: a preferência por movimento reduzido não foi aplicada`,
      );
      assert(
        motionState.stickyPosition !== "sticky",
        `${name}: o modo reduzido manteve a seção presa`,
      );
      assert(
        !motionState.hasScrollInstruction,
        `${name}: o modo reduzido ainda pede rolagem para animar`,
      );
    } else {
      assert(
        motionState.stickyPosition === "sticky",
        `${name}: a camada principal deixou de ser sticky`,
      );
      const widthGrowth = endBox.width - startBox.width;
      const heightGrowth = endBox.height - startBox.height;
      assert(
        widthGrowth > 20 || heightGrowth > 40,
        `${name}: a expansão não ocorreu (largura ${widthGrowth.toFixed(1)}px, altura ${heightGrowth.toFixed(1)}px)`,
      );
    }

    const showcaseImages = await section.locator("img").evaluateAll((images) => ({
      total: images.length,
      loaded: images.filter((image) => image.complete && image.naturalWidth > 0).length,
    }));

    await page.screenshot({ path: `${outputDir}/${name}-showcase.png`, fullPage: false });

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
      motionState,
      showcaseImages,
    });
  } finally {
    await context.close();
  }
}

async function validateNotFound(browser) {
  const { context, page, runtimeErrors } = await createPage(
    browser,
    { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    "404",
  );

  try {
    const response = await page.goto(`${baseUrl}/rota-inexistente-validacao`, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    const httpStatus = response?.status();
    assert(
      httpStatus === 404 || httpStatus === 200,
      `404: resposta HTTP inesperada ${httpStatus ?? "sem status"}`,
    );
    await waitForStablePage(page);

    await page.getByRole("heading", { name: "404" }).waitFor({ state: "visible" });
    assert(
      await page.getByRole("link", { name: /Voltar ao início/i }).isVisible(),
      "404: o retorno ao início não está visível",
    );
    assert(
      await page.getByRole("link", { name: /Ver demonstrações/i }).isVisible(),
      "404: o acesso às demonstrações não está visível",
    );

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    assert(!hasHorizontalOverflow, "404: foi detectado overflow horizontal");
    assert(runtimeErrors.length === 0, `404: erros de runtime: ${runtimeErrors.join(" | ")}`);

    await page.screenshot({ path: `${outputDir}/404-desktop.png`, fullPage: false });
    report.checks.push({ name: "404", status: "passed", httpStatus });
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
  await validateNotFound(browser);
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
