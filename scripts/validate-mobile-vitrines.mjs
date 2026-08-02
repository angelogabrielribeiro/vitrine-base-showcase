import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const artifactRoot = path.resolve("artifacts/mobile-vitrines");
const screenshotDir = path.join(artifactRoot, "screenshots");
const videoDir = path.join(artifactRoot, "videos");
fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

const routes = [
  ["home", "/"],
  ["maison", "/demo/moda"],
  ["barber", "/demo/barbearia"],
  ["brasa", "/demo/restaurante"],
  ["novacore", "/demo/eletronicos"],
];

const viewports = [
  { name: "360x800", width: 360, height: 800 },
  { name: "392x850", width: 392, height: 850 },
  { name: "430x932", width: 430, height: 932 },
];

const report = { mobile: [], desktop: [], errors: [] };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(900);
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            }),
        ),
    );
  });
}

async function assertNoHorizontalOverflow(page, label) {
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

async function assertHeadingsInsideViewport(page, label) {
  const issues = await page.locator("h1, h2, h3").evaluateAll((headings) =>
    headings
      .filter((heading) => {
        const style = getComputedStyle(heading);
        const rect = heading.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 2 && rect.height > 2;
      })
      .map((heading) => {
        const rect = heading.getBoundingClientRect();
        return {
          text: heading.textContent?.trim().replace(/\s+/g, " ").slice(0, 90),
          left: rect.left,
          right: rect.right,
          width: rect.width,
        };
      })
      .filter((heading) => heading.left < -2 || heading.right > window.innerWidth + 2),
  );
  assert(issues.length === 0, `${label}: títulos fora da viewport ${JSON.stringify(issues)}`);
}

async function assertMenuHidesWhatsapp(page, label) {
  const menuButton = page.getByRole("button", { name: /^Menu$/ }).first();
  if (!(await menuButton.isVisible().catch(() => false))) return { tested: false };

  const fab = page.locator('a[aria-label="Falar no WhatsApp"]').first();
  assert(await fab.isVisible(), `${label}: FAB do WhatsApp não aparece antes de abrir o menu`);
  await menuButton.click();
  await page.waitForTimeout(450);

  const hiddenState = await fab.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      ariaHidden: element.getAttribute("aria-hidden"),
      opacity: Number(style.opacity),
      pointerEvents: style.pointerEvents,
      tabIndex: element.getAttribute("tabindex"),
    };
  });
  assert(hiddenState.ariaHidden === "true", `${label}: WhatsApp sem aria-hidden no menu aberto`);
  assert(hiddenState.pointerEvents === "none", `${label}: WhatsApp ainda intercepta toque`);
  assert(hiddenState.opacity <= 0.05, `${label}: WhatsApp ainda visível (${hiddenState.opacity})`);

  await page.getByRole("button", { name: /Fechar menu/i }).click();
  await page.waitForTimeout(450);
  const restored = await fab.evaluate((element) => {
    const style = getComputedStyle(element);
    return { ariaHidden: element.getAttribute("aria-hidden"), opacity: Number(style.opacity) };
  });
  assert(restored.ariaHidden !== "true" && restored.opacity >= 0.8, `${label}: WhatsApp não voltou ao fechar o menu`);
  return { tested: true, hiddenState, restored };
}

async function collectMotionSnapshot(page) {
  return page.evaluate(() => {
    const candidates = [...document.querySelectorAll("main article, main [data-active], main [data-in-view], main section")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < innerHeight && rect.width > 20 && rect.height > 20;
      })
      .slice(0, 18);
    return candidates.map((element, index) => {
      const style = getComputedStyle(element);
      return {
        index,
        transform: style.transform,
        boxShadow: style.boxShadow,
        opacity: style.opacity,
        animationName: style.animationName,
        animationPlayState: style.animationPlayState,
      };
    });
  });
}

async function assertAutomaticMotion(page, label) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const positions = [0.18, 0.38, 0.58, 0.78];
  let animated = false;

  for (const ratio of positions) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.max(0, height * ratio));
    await page.waitForTimeout(500);
    const before = await collectMotionSnapshot(page);
    await page.waitForTimeout(1100);
    const after = await collectMotionSnapshot(page);
    const runningCss = before.some(
      (item) => item.animationName !== "none" && item.animationPlayState !== "paused",
    );
    const changed = before.some((item, index) => {
      const next = after[index];
      return Boolean(
        next &&
          (item.transform !== next.transform ||
            item.boxShadow !== next.boxShadow ||
            item.opacity !== next.opacity),
      );
    });
    if (runningCss || changed) {
      animated = true;
      break;
    }
  }

  assert(animated, `${label}: nenhuma animação automática detectada durante scroll normal`);
  return animated;
}

async function assertNovaCoreCanvas(page, label) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  let visibleCanvas = 0;
  for (let ratio = 0; ratio <= 1; ratio += 0.1) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), height * ratio);
    await page.waitForTimeout(320);
    visibleCanvas = await page.locator("canvas").evaluateAll((canvases) =>
      canvases.filter((canvas) => {
        const rect = canvas.getBoundingClientRect();
        const style = getComputedStyle(canvas);
        return (
          rect.width > 20 &&
          rect.height > 20 &&
          rect.bottom > 0 &&
          rect.top < innerHeight &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) > 0.05
        );
      }).length,
    );
    if (visibleCanvas > 0) break;
  }
  assert(visibleCanvas > 0, `${label}: NovaCore sem Canvas/WebGL visível no mobile`);
  return visibleCanvas;
}

async function assertCatalogComposition(page, label) {
  const context = page.getByTestId("catalog-feature-context");
  if (!(await context.count())) return { tested: false };
  const contextBox = await context.boundingBox();
  const heading = page.getByTestId("catalog-expansion-hero").locator("h1").first();
  const headingBox = await heading.boundingBox();
  assert(contextBox && headingBox, `${label}: composição do destaque não pôde ser medida`);
  const overlap = Math.max(
    0,
    Math.min(contextBox.y + contextBox.height, headingBox.y + headingBox.height) -
      Math.max(contextBox.y, headingBox.y),
  );
  assert(overlap <= 2, `${label}: painel de produto cobre o título (${overlap}px)`);
  return { tested: true, overlap };
}

async function assertHomeShowroom(page, label) {
  const cards = page.locator("[data-showroom-card]");
  assert((await cards.count()) === 4, `${label}: showroom deve ter exatamente quatro cards`);
  const firstUrl = page.url();
  await cards.nth(1).click();
  await page.waitForTimeout(650);
  assert(page.url() === firstUrl, `${label}: primeiro toque no card inativo navegou antes de focar`);
  assert((await cards.nth(1).getAttribute("data-active")) === "true", `${label}: card tocado não foi ativado`);
}

async function assertBottomContentAccessible(page, label) {
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(400);
  const result = await page.evaluate(() => {
    const fixedBottom = [...document.querySelectorAll("body *")].filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.position === "fixed" && rect.bottom >= innerHeight - 2 && rect.height > 20;
    });
    const footer = document.querySelector("footer");
    if (!footer) return { footer: false, blocked: false, fixed: fixedBottom.length };
    const rect = footer.getBoundingClientRect();
    const x = Math.min(innerWidth - 8, Math.max(8, rect.left + rect.width / 2));
    const y = Math.min(innerHeight - 8, Math.max(8, rect.top + Math.min(rect.height / 2, 24)));
    const top = document.elementFromPoint(x, y);
    return { footer: true, blocked: Boolean(top && !footer.contains(top)), fixed: fixedBottom.length };
  });
  assert(!result.blocked, `${label}: conteúdo final coberto por navegação fixa`);
  return result;
}

async function runMobile(browser, viewport) {
  for (const [name, route] of routes) {
    const recordVideo = viewport.name === "392x850" ? { dir: videoDir, size: viewport } : undefined;
    const context = await browser.newContext({ viewport, recordVideo });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    const label = `${name}-${viewport.name}`;

    try {
      const response = await page.goto(new URL(route, baseUrl).toString(), {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
      assert(response?.ok(), `${label}: HTTP ${response?.status()}`);
      await settle(page);
      const overflow = await assertNoHorizontalOverflow(page, label);
      await assertHeadingsInsideViewport(page, label);
      const menu = name === "home" ? { tested: false } : await assertMenuHidesWhatsapp(page, label);
      const motion = await assertAutomaticMotion(page, label);
      if (name === "home") await assertHomeShowroom(page, label);
      const canvas = name === "novacore" ? await assertNovaCoreCanvas(page, label) : undefined;

      if (name !== "home") {
        const catalogUrl = new URL(`/demo/${name === "maison" ? "moda" : name === "barber" ? "barbearia" : name === "brasa" ? "restaurante" : "eletronicos"}/produtos`, baseUrl);
        await page.goto(catalogUrl.toString(), { waitUntil: "domcontentloaded", timeout: 90_000 });
        await settle(page);
        await assertNoHorizontalOverflow(page, `${label}-catalog`);
        await assertHeadingsInsideViewport(page, `${label}-catalog`);
        await assertCatalogComposition(page, `${label}-catalog`);
      }

      const bottom = await assertBottomContentAccessible(page, label);
      await page.screenshot({
        path: path.join(screenshotDir, `${label}.png`),
        fullPage: true,
      });
      assert(errors.length === 0, `${label}: erros de runtime ${errors.join(" | ")}`);
      report.mobile.push({ label, overflow, menu, motion, canvas, bottom, status: "passed" });
    } catch (error) {
      report.errors.push({ label, message: error.message, runtime: errors });
      await page.screenshot({
        path: path.join(screenshotDir, `${label}-failure.png`),
        fullPage: true,
      }).catch(() => {});
    } finally {
      await context.close();
    }
  }
}

async function runDesktop(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  for (const [name, route] of routes) {
    const label = `${name}-desktop`;
    try {
      const response = await page.goto(new URL(route, baseUrl).toString(), {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
      assert(response?.ok(), `${label}: HTTP ${response?.status()}`);
      await settle(page);
      const overflow = await assertNoHorizontalOverflow(page, label);
      await assertHeadingsInsideViewport(page, label);
      await page.screenshot({ path: path.join(screenshotDir, `${label}.png`), fullPage: false });
      report.desktop.push({ label, overflow, status: "passed" });
    } catch (error) {
      report.errors.push({ label, message: error.message });
    }
  }
  await context.close();
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
  for (const viewport of viewports) await runMobile(browser, viewport);
  await runDesktop(browser);
} finally {
  await browser.close();
}

fs.writeFileSync(path.join(artifactRoot, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

if (report.errors.length > 0) {
  throw new Error(`Validação mobile falhou em ${report.errors.length} cenário(s)`);
}
