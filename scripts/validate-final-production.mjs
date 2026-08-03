import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const output = "artifacts/final-production-2";
fs.mkdirSync(output, { recursive: true });

const viewports = [
  { name: "360x800", width: 360, height: 800 },
  { name: "392x850", width: 392, height: 850 },
  { name: "430x932", width: 430, height: 932 },
];

const stores = [
  { key: "maison", slug: "moda" },
  { key: "barber", slug: "barbearia" },
  { key: "brasa", slug: "restaurante" },
  { key: "novacore", slug: "eletronicos" },
];

const report = {
  startedAt: new Date().toISOString(),
  mobile: [],
  desktop: {},
  errors: [],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function collectCriticalErrors(page, label) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(`${label}: pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (/hydration|server rendered html|did not match|uncaught|referenceerror|typeerror/i.test(text)) {
      errors.push(`${label}: console.error: ${text}`);
    }
  });
  return errors;
}

async function settle(page) {
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
  await page.waitForTimeout(700);
}

async function open(page, route) {
  const response = await page.goto(new URL(route, baseUrl).toString(), {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  assert(response?.ok(), `${route}: HTTP ${response?.status()}`);
  await settle(page);
}

async function assertNoOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  assert(
    metrics.scrollWidth <= metrics.innerWidth + 1,
    `${label}: overflow horizontal ${metrics.scrollWidth}px > ${metrics.innerWidth}px`,
  );
  return metrics;
}

async function assertVisibleHeadingsInside(page, label) {
  const violations = await page.locator("h1,h2,h3").evaluateAll((headings) =>
    headings
      .filter((heading) => {
        const style = getComputedStyle(heading);
        const rect = heading.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      })
      .map((heading) => {
        const rect = heading.getBoundingClientRect();
        return {
          text: heading.textContent?.trim().replace(/\s+/g, " ").slice(0, 80),
          left: rect.left,
          right: rect.right,
          width: innerWidth,
        };
      })
      .filter((item) => item.left < -1 || item.right > item.width + 1),
  );
  assert(violations.length === 0, `${label}: títulos fora da viewport ${JSON.stringify(violations)}`);
}

async function assertMenuAndWhatsapp(page, label) {
  const menuButton = page
    .locator('button[aria-controls][aria-expanded="false"]')
    .filter({ hasText: /Menu/i })
    .last();
  await menuButton.waitFor({ state: "visible", timeout: 15_000 });
  const fab = page.locator('a[data-whatsapp-fab][aria-label="Falar no WhatsApp"]');
  await fab.waitFor({ state: "attached", timeout: 15_000 });

  await menuButton.click();
  const panel = page.getByRole("menu", { name: "Menu principal" });
  await panel.waitFor({ state: "visible", timeout: 5_000 });
  await page.waitForTimeout(800);
  assert(await panel.isVisible(), `${label}: menu fechou sozinho depois de abrir`);

  const hidden = await fab.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      ariaHidden: element.getAttribute("aria-hidden"),
      tabIndex: element.getAttribute("tabindex"),
      pointerEvents: style.pointerEvents,
      visibility: style.visibility,
      opacity: Number(style.opacity),
      rootState: document.documentElement.dataset.mobileMenuOpen,
    };
  });
  assert(hidden.ariaHidden === "true", `${label}: FAB sem aria-hidden=true`);
  assert(hidden.tabIndex === "-1", `${label}: FAB permanece focável`);
  assert(hidden.pointerEvents === "none", `${label}: FAB ainda intercepta toque`);
  assert(hidden.visibility === "hidden", `${label}: FAB ainda visível`);
  assert(hidden.opacity <= 0.01, `${label}: FAB ainda opaco (${hidden.opacity})`);
  assert(hidden.rootState === "true", `${label}: shell não registrou menu aberto`);

  await page.getByRole("button", { name: "Fechar menu" }).click();
  await panel.waitFor({ state: "detached", timeout: 5_000 });
  await page.waitForTimeout(250);
  const restored = await fab.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      ariaHidden: element.getAttribute("aria-hidden"),
      tabIndex: element.getAttribute("tabindex"),
      pointerEvents: style.pointerEvents,
      visibility: style.visibility,
      opacity: Number(style.opacity),
    };
  });
  assert(restored.ariaHidden !== "true", `${label}: FAB não restaurou aria-hidden`);
  assert(restored.tabIndex !== "-1", `${label}: FAB não restaurou foco`);
  assert(restored.pointerEvents !== "none", `${label}: FAB não restaurou toque`);
  assert(restored.visibility !== "hidden", `${label}: FAB não reapareceu`);
  assert(restored.opacity > 0.5, `${label}: FAB não restaurou opacidade`);

  return { hidden, restored };
}

async function assertAutomaticCardMotion(page, label) {
  const card = page.locator(".premium-product-card").first();
  await card.waitFor({ state: "visible", timeout: 15_000 });
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const animation = await card.locator(".premium-product-frame").evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      name: style.animationName,
      playState: style.animationPlayState,
      duration: style.animationDuration,
    };
  });
  assert(animation.name !== "none", `${label}: card sem animação ambiente`);
  assert(animation.playState === "running", `${label}: card depende de clique/long press`);
  return animation;
}

async function assertCatalog(page, store, label) {
  await open(page, `/demo/${store.slug}/produtos`);
  await assertNoOverflow(page, `${label}-catalog`);
  await assertVisibleHeadingsInside(page, `${label}-catalog`);

  const hero = page.getByTestId("catalog-expansion-hero");
  const heroBox = await hero.boundingBox();
  assert(heroBox, `${label}: hero de catálogo ausente`);
  assert(heroBox.height <= 910, `${label}: hero de catálogo alto demais (${heroBox.height}px)`);

  const feature = page.getByTestId("catalog-feature-context");
  const media = hero.locator("img").first();
  if ((await feature.count()) && (await media.count())) {
    const overlap = await page.evaluate(
      ({ feature, media }) => {
        const a = feature.getBoundingClientRect();
        const b = media.getBoundingClientRect();
        const intersection = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        return { intersection, featureTop: a.top, mediaBottom: b.bottom };
      },
      { feature: await feature.elementHandle(), media: await media.elementHandle() },
    );
    assert(overlap.intersection < 4, `${label}: painel contextual sobrepõe a imagem`);
  }

  const motion = await assertAutomaticCardMotion(page, `${label}-catalog`);
  return { heroHeight: heroBox.height, motion };
}

async function assertFooterAccessible(page, label) {
  const footer = page.locator("footer").last();
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  const result = await footer.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const x = Math.min(innerWidth - 2, Math.max(1, rect.left + rect.width / 2));
    const y = Math.min(innerHeight - 2, Math.max(1, rect.top + Math.min(rect.height / 2, 32)));
    const hit = document.elementFromPoint(x, y);
    const style = getComputedStyle(element);
    return {
      hitInside: Boolean(hit && element.contains(hit)),
      hitTag: hit?.tagName,
      zIndex: style.zIndex,
      paddingBottom: style.paddingBottom,
    };
  });
  assert(result.hitInside, `${label}: conteúdo final coberto por ${result.hitTag ?? "overlay"}`);
  return result;
}

async function runMobile(browser) {
  for (const viewport of viewports) {
    for (const store of stores) {
      const label = `${store.key}-${viewport.name}`;
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      const criticalErrors = collectCriticalErrors(page, label);
      try {
        await open(page, `/demo/${store.slug}`);
        const overflow = await assertNoOverflow(page, label);
        await assertVisibleHeadingsInside(page, label);
        const menu = await assertMenuAndWhatsapp(page, label);
        const canvas =
          store.key === "novacore"
            ? await page.locator("canvas").first().waitFor({ state: "visible", timeout: 20_000 }).then(() => page.locator("canvas").count())
            : undefined;
        const catalog = await assertCatalog(page, store, label);
        assert(criticalErrors.length === 0, `${label}: erros críticos ${criticalErrors.join(" | ")}`);
        report.mobile.push({ label, overflow, menu, canvas, catalog, status: "passed" });
        await page.screenshot({
          path: path.join(output, `${label}.png`),
          fullPage: false,
          animations: "disabled",
          caret: "hide",
          timeout: 60_000,
        });
      } catch (error) {
        report.errors.push({ label, message: error.message, runtime: criticalErrors });
        await page
          .screenshot({
            path: path.join(output, `${label}-failure.png`),
            fullPage: false,
            animations: "disabled",
            caret: "hide",
            timeout: 60_000,
          })
          .catch(() => {});
      } finally {
        await context.close();
      }
    }

    const label = `home-${viewport.name}`;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const criticalErrors = collectCriticalErrors(page, label);
    try {
      await open(page, "/");
      const overflow = await assertNoOverflow(page, label);
      await assertVisibleHeadingsInside(page, label);
      const footer = await assertFooterAccessible(page, label);
      assert(criticalErrors.length === 0, `${label}: erros críticos ${criticalErrors.join(" | ")}`);
      report.mobile.push({ label, overflow, footer, status: "passed" });
    } catch (error) {
      report.errors.push({ label, message: error.message, runtime: criticalErrors });
    } finally {
      await context.close();
    }
  }
}

async function runDesktopNova(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const criticalErrors = collectCriticalErrors(page, "novacore-desktop");
  try {
    await open(page, "/demo/eletronicos");
    const overflow = await assertNoOverflow(page, "novacore-desktop");
    const canvasCount = await page.locator("canvas").count();
    assert(canvasCount >= 1, "novacore-desktop: canvas WebGL ausente");

    const heading = page.getByRole("heading", { name: /Escolha uma constelação/i });
    const section = heading.locator("xpath=ancestor::section[1]");
    await section.scrollIntoViewIfNeeded();
    await page.mouse.move(1080, 450);
    const buttons = section.getByRole("button");
    const count = await buttons.count();
    assert(count >= 4, `novacore-desktop: somente ${count} categorias`);
    const firstActive = await buttons.evaluateAll((items) =>
      items.findIndex((item) => item.className.includes("border-cyan-200")),
    );
    assert(firstActive >= 0, "novacore-desktop: categoria ativa não identificada");
    const target = (firstActive + 1) % count;
    await buttons.nth(target).click();
    await page.waitForTimeout(500);
    const nextActive = await buttons.evaluateAll((items) =>
      items.findIndex((item) => item.className.includes("border-cyan-200")),
    );
    assert(nextActive === target, `novacore-desktop: categoria não mudou (${firstActive} -> ${nextActive}, alvo ${target})`);
    assert(criticalErrors.length === 0, `novacore-desktop: erros críticos ${criticalErrors.join(" | ")}`);
    report.desktop = { overflow, canvasCount, categoryBefore: firstActive, categoryAfter: nextActive, status: "passed" };
  } catch (error) {
    report.errors.push({ label: "novacore-desktop", message: error.message, runtime: criticalErrors });
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--disable-gpu-sandbox",
    "--disable-dev-shm-usage",
  ],
});

try {
  await runMobile(browser);
  await runDesktopNova(browser);
} finally {
  await browser.close();
}

report.finishedAt = new Date().toISOString();
report.status = report.errors.length === 0 ? "passed" : "failed";
fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

if (report.errors.length > 0) {
  throw new Error(`Validação final falhou em ${report.errors.length} cenário(s)`);
}
