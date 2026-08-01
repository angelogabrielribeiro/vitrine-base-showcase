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

async function readAnimationLayers(intro, reveal) {
  return {
    intro: await intro.evaluate((element) => {
      const style = getComputedStyle(element);
      return { opacity: Number(style.opacity), visibility: style.visibility };
    }),
    reveal: await reveal.evaluate((element) => {
      const style = getComputedStyle(element);
      return { opacity: Number(style.opacity), visibility: style.visibility };
    }),
  };
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
    const intro = page.getByTestId("scroll-expand-intro");
    const reveal = page.getByTestId("scroll-expand-reveal");
    await section.waitFor({ state: "visible" });

    const sectionMetrics = await section.evaluate((element) => ({
      top: element.getBoundingClientRect().top + window.scrollY,
      height: element.getBoundingClientRect().height,
      viewportHeight: window.innerHeight,
    }));

    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), sectionMetrics.top);
    await page.waitForTimeout(600);

    const startBox = await frame.boundingBox();
    assert(startBox, `${name}: o frame expansível não possui área visível no início`);
    const startScroll = await page.evaluate(() => window.scrollY);
    const activeScrollRange = Math.max(sectionMetrics.height - sectionMetrics.viewportHeight, 1);

    let endBox = null;
    let endScroll = startScroll;
    let animationLayers = await readAnimationLayers(intro, reveal);
    let selectedProgress = 0;

    if (reducedMotion === "reduce") {
      const targetScroll = sectionMetrics.top + Math.max(sectionMetrics.height * 0.72, 320);
      await page.evaluate(
        (top) => window.scrollTo({ top, behavior: "instant" }),
        targetScroll,
      );
      await page.waitForTimeout(900);
      endBox = await frame.boundingBox();
      endScroll = await page.evaluate(() => window.scrollY);
      animationLayers = await readAnimationLayers(intro, reveal);
    } else {
      for (const progress of [0.82, 0.9, 0.95, 0.98, 0.995]) {
        const targetScroll = sectionMetrics.top + activeScrollRange * progress;
        await page.evaluate(
          (top) => window.scrollTo({ top, behavior: "instant" }),
          targetScroll,
        );
        await page.waitForTimeout(650);

        endBox = await frame.boundingBox();
        endScroll = await page.evaluate(() => window.scrollY);
        animationLayers = await readAnimationLayers(intro, reveal);
        selectedProgress = progress;

        if (
          animationLayers.intro.opacity <= 0.05 &&
          animationLayers.reveal.opacity >= 0.9 &&
          animationLayers.reveal.visibility !== "hidden"
        ) {
          break;
        }
      }
    }

    assert(endBox, `${name}: o frame expansível desapareceu durante a rolagem`);
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
      assert(
        endBox.y >= 60 && endBox.y <= 68,
        `${name}: o frame saiu da faixa sticky durante a medição (y=${endBox.y.toFixed(1)}px)`,
      );
      const widthGrowth = endBox.width - startBox.width;
      const heightGrowth = endBox.height - startBox.height;
      assert(
        widthGrowth > 20 || heightGrowth > 40,
        `${name}: a expansão não ocorreu (largura ${widthGrowth.toFixed(1)}px, altura ${heightGrowth.toFixed(1)}px)`,
      );
      assert(
        animationLayers.intro.opacity <= 0.05,
        `${name}: o título inicial não desapareceu dentro da faixa sticky (opacidade ${animationLayers.intro.opacity}, progresso testado ${selectedProgress})`,
      );
      assert(
        animationLayers.reveal.opacity >= 0.9 && animationLayers.reveal.visibility !== "hidden",
        `${name}: o CTA final não apareceu corretamente (opacidade ${animationLayers.reveal.opacity}, progresso testado ${selectedProgress})`,
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
      selectedProgress,
      motionState,
      animationLayers,
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

    await page.screenshot({ path: `${outputDir}/404-desktop.png`, fullPage: false });

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
      `404: erros de runtime: ${unexpectedRuntimeErrors.join(" | ")}`,
    );

    report.checks.push({
      name: "404",
      status: "passed",
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
