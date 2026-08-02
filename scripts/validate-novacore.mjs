import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const route = new URL("/demo/eletronicos", baseUrl).toString();
const output = path.resolve("artifacts/novacore-validation");
const videoDir = path.join(output, "video");
fs.mkdirSync(videoDir, { recursive: true });

const report = {
  route,
  startedAt: new Date().toISOString(),
  desktop: {},
  mobile: {},
  errors: [],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForInterface(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForFunction(
    () => document.documentElement.dataset.cinematicReady === "true",
    undefined,
    { timeout: 30_000 },
  );
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(900);
}

function collectRuntimeErrors(page, label) {
  page.on("pageerror", (error) => report.errors.push(`${label}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") {
      report.errors.push(`${label}: console.error: ${message.text()}`);
    }
  });
}

async function sectionFromHeading(page, name) {
  const heading = page.getByRole("heading", { name }).first();
  await heading.waitFor({ state: "attached", timeout: 30_000 });
  return heading.locator("xpath=ancestor::section[1]");
}

async function assertNoOverflow(page, label) {
  const result = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert(
    Math.max(result.document, result.body) <= result.viewport + 2,
    `${label}: overflow horizontal ${JSON.stringify(result)}`,
  );
  return result;
}

async function assertHeadingsInside(page, label) {
  const failures = await page.locator("h1, h2, h3").evaluateAll((headings) =>
    headings
      .filter((heading) => {
        const style = getComputedStyle(heading);
        const rect = heading.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 2;
      })
      .map((heading) => {
        const rect = heading.getBoundingClientRect();
        return {
          text: heading.textContent?.trim().replace(/\s+/g, " ").slice(0, 100),
          left: rect.left,
          right: rect.right,
        };
      })
      .filter((heading) => heading.left < -2 || heading.right > innerWidth + 2),
  );
  assert(failures.length === 0, `${label}: títulos fora da viewport ${JSON.stringify(failures)}`);
}

async function waitForCanvas(page, label) {
  const canvas = page.locator("canvas").first();
  await canvas.waitFor({ state: "visible", timeout: 30_000 });
  const visible = await page.locator("canvas").evaluateAll((canvases) =>
    canvases.filter((item) => {
      const rect = item.getBoundingClientRect();
      const style = getComputedStyle(item);
      return rect.width > 20 && rect.height > 20 && style.display !== "none" && Number(style.opacity) > 0.05;
    }).length,
  );
  assert(visible >= 1, `${label}: nenhum canvas WebGL visível`);
  return visible;
}

async function assertBorderTrace(page, label) {
  const categories = await sectionFromHeading(page, /Escolha uma constelação/i);
  await categories.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const trace = categories.locator('span[class*="border-cyan-200"]').first();
  await trace.waitFor({ state: "attached", timeout: 15_000 });
  const before = await trace.evaluate((element) => getComputedStyle(element).clipPath);
  await page.waitForTimeout(900);
  const after = await trace.evaluate((element) => getComputedStyle(element).clipPath);
  assert(before !== after, `${label}: borda ciano não percorre automaticamente o painel`);
  return { before, after };
}

async function scrollJourney(page, step, pause) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(pause);
  }
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(550);
}

async function validateDesktop(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } },
  });
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

  const page = await context.newPage();
  collectRuntimeErrors(page, "desktop");
  try {
    const response = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 90_000 });
    assert(response?.ok(), `Desktop respondeu com ${response?.status()}`);
    await waitForInterface(page);

    const quality = await page.locator("html").getAttribute("data-motion-quality");
    assert(quality !== "off", `Qualidade desktop desativada: ${quality}`);
    const canvases = await waitForCanvas(page, "desktop");
    const overflow = await assertNoOverflow(page, "desktop");
    await assertHeadingsInside(page, "desktop");

    const hero = await sectionFromHeading(page, /The future\s*is not flat/i);
    await hero.screenshot({ path: path.join(output, "desktop-01-hero.png") });
    await page.mouse.move(1120, 390);
    await page.waitForTimeout(650);
    await hero.screenshot({ path: path.join(output, "desktop-02-hero-reactive.png") });

    const story = page.getByTestId("electronics-circuit-story");
    const metrics = await story.evaluate((element) => ({
      top: element.getBoundingClientRect().top + window.scrollY,
      height: element.getBoundingClientRect().height,
    }));
    await page.evaluate(
      ({ top, height }) => window.scrollTo({ top: top + Math.max(0, height - innerHeight) * 0.52, behavior: "instant" }),
      metrics,
    );
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(output, "desktop-03-story.png") });

    const categories = await sectionFromHeading(page, /Escolha uma constelação/i);
    await categories.scrollIntoViewIfNeeded();
    const categoryButtons = categories.getByRole("button");
    assert((await categoryButtons.count()) >= 4, "Categorias NovaCore incompletas");
    const firstActive = await categoryButtons.evaluateAll((buttons) =>
      buttons.findIndex((button) => button.className.includes("border-cyan-200")),
    );
    await categoryButtons.nth(2).click();
    await page.waitForTimeout(650);
    const nextActive = await categoryButtons.evaluateAll((buttons) =>
      buttons.findIndex((button) => button.className.includes("border-cyan-200")),
    );
    assert(firstActive !== nextActive, "Seleção de categoria não alterou a cena");
    const borderTrace = await assertBorderTrace(page, "desktop");
    await page.screenshot({ path: path.join(output, "desktop-04-category-orbits.png") });

    const showroom = page.locator("#showroom");
    await showroom.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    const orbitButtons = showroom.locator('button[aria-label^="Trazer "]');
    const orbitCount = await orbitButtons.count();
    assert(orbitCount >= 4, `Showroom com somente ${orbitCount} nós`);
    const heading = showroom.locator("h3").first();
    const beforeProduct = (await heading.textContent())?.trim();
    await orbitButtons.nth(Math.min(2, orbitCount - 1)).click();
    await page.waitForTimeout(750);
    const afterProduct = (await heading.textContent())?.trim();
    assert(beforeProduct !== afterProduct, "Showroom não trocou o produto central");
    await page.screenshot({ path: path.join(output, "desktop-05-showroom.png") });

    const systems = await sectionFromHeading(page, /Hardware que responde/i);
    await systems.scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    const cards = systems.locator("article");
    const cardCount = await cards.count();
    assert(cardCount >= 4, `Somente ${cardCount} cards de produto`);
    const firstCard = cards.first();
    const cardBox = await firstCard.boundingBox();
    assert(cardBox, "Card sem área interativa");
    await page.mouse.move(cardBox.x + cardBox.width * 0.78, cardBox.y + cardBox.height * 0.32);
    await page.waitForTimeout(600);
    const cardTransform = await firstCard.evaluate((element) => getComputedStyle(element).transform);
    assert(cardTransform !== "none", "Card desktop não reage em profundidade");
    await page.screenshot({ path: path.join(output, "desktop-06-product-cards.png") });

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await scrollJourney(page, 520, 75);
    await page.screenshot({ path: path.join(output, "desktop-07-full.png"), fullPage: true });

    report.desktop = {
      quality,
      canvases,
      overflow,
      categoryButtons: await categoryButtons.count(),
      borderTrace,
      orbitButtons: orbitCount,
      productBefore: beforeProduct,
      productAfter: afterProduct,
      cards: cardCount,
      cardTransform,
    };
  } finally {
    await context.close();
  }
}

async function validateMobile(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    recordVideo: { dir: videoDir, size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  collectRuntimeErrors(page, "mobile");
  try {
    const response = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 90_000 });
    assert(response?.ok(), `Mobile respondeu com ${response?.status()}`);
    await waitForInterface(page);

    const quality = await page.locator("html").getAttribute("data-motion-quality");
    assert(quality !== "off", `Qualidade mobile desativada: ${quality}`);
    const canvases = await waitForCanvas(page, "mobile");
    const overflow = await assertNoOverflow(page, "mobile");
    await assertHeadingsInside(page, "mobile");

    const hero = await sectionFromHeading(page, /The future\s*is not flat/i);
    await hero.screenshot({ path: path.join(output, "mobile-01-hero.png") });

    const story = page.getByTestId("electronics-circuit-story");
    await story.scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    assert((await story.locator(".sticky").count()) === 0, "Story mobile manteve sticky pesado");
    await page.screenshot({ path: path.join(output, "mobile-02-story.png") });

    const categories = await sectionFromHeading(page, /Escolha uma constelação/i);
    await categories.scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    const buttons = categories.getByRole("button");
    assert((await buttons.count()) >= 4, "Categorias mobile incompletas");
    const beforeActive = await buttons.evaluateAll((items) =>
      items.findIndex((button) => button.className.includes("border-cyan-200")),
    );
    await buttons.nth(3).click();
    await page.waitForTimeout(600);
    const afterActive = await buttons.evaluateAll((items) =>
      items.findIndex((button) => button.className.includes("border-cyan-200")),
    );
    assert(beforeActive !== afterActive, "Categoria mobile não altera a cena");
    const borderTrace = await assertBorderTrace(page, "mobile");
    await page.screenshot({ path: path.join(output, "mobile-03-categories.png") });

    const showroom = page.locator("#showroom");
    await showroom.scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    await page.screenshot({ path: path.join(output, "mobile-04-showroom.png") });

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await scrollJourney(page, 360, 65);
    await assertNoOverflow(page, "mobile-after-scroll");
    await assertHeadingsInside(page, "mobile-after-scroll");
    await page.screenshot({ path: path.join(output, "mobile-05-full.png"), fullPage: true });

    report.mobile = {
      quality,
      canvases,
      overflow,
      categoryButtons: await buttons.count(),
      borderTrace,
    };
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-angle=swiftshader-webgl",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--disable-dev-shm-usage",
  ],
});

try {
  await validateDesktop(browser);
  await validateMobile(browser);
  assert(report.errors.length === 0, `Erros de runtime: ${report.errors.join(" | ")}`);
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.failure = error instanceof Error ? error.stack ?? error.message : String(error);
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}
