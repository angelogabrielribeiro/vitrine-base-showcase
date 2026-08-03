import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outputDir = "artifacts/maison-scroll-layout";
fs.mkdirSync(outputDir, { recursive: true });

const scenarios = [
  { name: "mobile-360x800", width: 360, height: 800, mobile: true },
  { name: "mobile-392x850", width: 392, height: 850, mobile: true },
  { name: "mobile-430x932", width: 430, height: 932, mobile: true },
  { name: "desktop-1440x900", width: 1440, height: 900, mobile: false },
];

const report = { scenarios: [], errors: [] };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForFunction(
    () => document.documentElement.dataset.cinematicReady === "true",
    undefined,
    { timeout: 30_000 },
  );
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(700);
}

async function noHorizontalOverflow(page, label) {
  const width = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert(
    Math.max(width.document, width.body) <= width.viewport + 2,
    `${label}: overflow horizontal ${JSON.stringify(width)}`,
  );
  return width;
}

async function inspectChapters(page, scenario) {
  const chapters = page.getByTestId("fashion-chapter");
  assert((await chapters.count()) === 3, `${scenario.name}: capítulos editoriais incompletos`);

  const metrics = await chapters.evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      const media = node.querySelector('[data-testid="fashion-chapter-media"]');
      const image = media?.querySelector("img");
      const mediaRect = media?.getBoundingClientRect();
      return {
        height: rect.height,
        mediaHeight: mediaRect?.height ?? 0,
        mediaWidth: mediaRect?.width ?? 0,
        objectFit: image ? getComputedStyle(image).objectFit : "missing",
      };
    }),
  );

  for (const [index, item] of metrics.entries()) {
    assert(item.objectFit === "contain", `${scenario.name}: imagem ${index + 1} ainda usa crop`);
    assert(
      item.mediaWidth <= scenario.width - (scenario.mobile ? 24 : 80),
      `${scenario.name}: mídia ${index + 1} extrapola a viewport`,
    );
    if (scenario.mobile) {
      assert(
        item.height <= scenario.height * 1.38,
        `${scenario.name}: capítulo ${index + 1} alto demais (${Math.round(item.height)}px)`,
      );
      assert(
        item.mediaHeight <= scenario.height * 0.69,
        `${scenario.name}: imagem ${index + 1} domina a tela (${Math.round(item.mediaHeight)}px)`,
      );
    } else {
      assert(
        item.height <= scenario.height * 1.5,
        `${scenario.name}: capítulo ${index + 1} mantém espaço excessivo (${Math.round(item.height)}px)`,
      );
      assert(
        item.mediaHeight <= scenario.height * 0.78,
        `${scenario.name}: imagem ${index + 1} grande demais (${Math.round(item.mediaHeight)}px)`,
      );
    }
  }

  const target = chapters.nth(1);
  const copy = target.getByTestId("fashion-chapter-copy");
  const targetBox = await target.boundingBox();
  assert(targetBox, `${scenario.name}: capítulo de teste sem posição`);

  if (scenario.mobile) {
    await page.evaluate(
      ({ top, height }) =>
        window.scrollTo({ top: Math.max(0, top - height * 0.95), behavior: "instant" }),
      { top: targetBox.y, height: scenario.height },
    );
    await page.waitForTimeout(120);
    const before = Number(await copy.evaluate((node) => getComputedStyle(node).opacity));
    await page.evaluate(
      ({ top, height }) =>
        window.scrollTo({ top: Math.max(0, top - height * 0.18), behavior: "instant" }),
      { top: targetBox.y, height: scenario.height },
    );
    await page.waitForTimeout(850);
    const after = await copy.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        opacity: Number(getComputedStyle(node).opacity),
        visible: rect.top < innerHeight && rect.bottom > 0,
      };
    });
    assert(before < 0.5, `${scenario.name}: storytelling já nasce totalmente revelado (${before})`);
    assert(
      after.visible && after.opacity > 0.82,
      `${scenario.name}: storytelling não conclui enquanto visível`,
    );
  } else {
    await page.evaluate(
      (top) => window.scrollTo({ top: top + 5, behavior: "instant" }),
      targetBox.y,
    );
    await page.waitForTimeout(180);
    const before = Number(await copy.evaluate((node) => getComputedStyle(node).opacity));
    await page.evaluate(
      ({ top, height }) => window.scrollTo({ top: top + height * 0.26, behavior: "instant" }),
      { top: targetBox.y, height: targetBox.height },
    );
    await page.waitForTimeout(260);
    const after = Number(await copy.evaluate((node) => getComputedStyle(node).opacity));
    assert(
      after > before + 0.35,
      `${scenario.name}: progresso do storytelling não responde ao scroll`,
    );
  }

  return metrics;
}

async function inspectAtelierMobile(page, scenario) {
  const rail = page.getByTestId("fashion-atelier-rail");
  await rail.scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  const state = await rail.evaluate((node) => {
    const first = node.firstElementChild;
    const image = first?.querySelector("img");
    const rect = node.getBoundingClientRect();
    const cardRect = first?.getBoundingClientRect();
    const style = getComputedStyle(node);
    return {
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth,
      left: rect.left,
      right: rect.right,
      cardWidth: cardRect?.width ?? 0,
      touchAction: style.touchAction,
      objectFit: image ? getComputedStyle(image).objectFit : "missing",
    };
  });
  assert(state.scrollWidth > state.clientWidth, `${scenario.name}: arara deixou de ser navegável`);
  assert(
    state.left >= -2 && state.right <= scenario.width + 2,
    `${scenario.name}: trilho da arara extrapola a tela`,
  );
  assert(
    state.cardWidth < scenario.width - 24,
    `${scenario.name}: card da arara ocupa/corta a tela inteira`,
  );
  assert(
    state.touchAction.includes("pan-x") && state.touchAction.includes("pan-y"),
    `${scenario.name}: gesto da arara bloqueia um eixo`,
  );
  assert(state.objectFit === "contain", `${scenario.name}: vestido continua cortado na arara`);
  assert(
    await page.getByTestId("fashion-atelier-swipe-hint").isVisible(),
    `${scenario.name}: falta indicação de arraste`,
  );
  return state;
}

async function inspectSelection(page, scenario) {
  const selection = page.getByTestId("fashion-selection");
  await selection.scrollIntoViewIfNeeded();
  const background = await selection.evaluate((node) => getComputedStyle(node).backgroundColor);
  const channels =
    background
      .match(/\d+(?:\.\d+)?/g)
      ?.slice(0, 3)
      .map(Number) ?? [];
  assert(channels.length === 3, `${scenario.name}: fundo da seleção não pôde ser lido`);
  assert(
    Math.max(...channels) < 235,
    `${scenario.name}: seção clara continua estourada (${background})`,
  );
  return background;
}

async function inspectDesktopCardAndCursor(page, scenario) {
  const selection = page.getByTestId("fashion-selection");
  const card = selection.locator(".ep-card").first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  assert(
    (await card.getAttribute("data-in-view")) === "true",
    `${scenario.name}: card não ativa ao entrar na tela`,
  );

  const frame = card.locator(".ep-card-frame");
  const ambient = await frame.evaluate((node) => ({
    animationName: getComputedStyle(node).animationName,
    playState: getComputedStyle(node).animationPlayState,
  }));
  assert(ambient.animationName === "ep-glow-pulse", `${scenario.name}: card sem brilho automático`);
  assert(ambient.playState === "running", `${scenario.name}: brilho automático pausado`);

  await card.hover();
  await page.waitForTimeout(220);
  const reveal = card.locator(".ep-reveal");
  if (await reveal.count()) {
    const during = await reveal.evaluate((node) => getComputedStyle(node).clipPath);
    assert(during.includes("0px"), `${scenario.name}: hover não revela a segunda imagem`);
    await page.mouse.move(4, 4);
    await page.waitForTimeout(700);
    const after = await card.evaluate((node) => {
      const revealNode = node.querySelector(".ep-reveal");
      const cta = node.querySelector(".ep-cta");
      const frameNode = node.querySelector(".ep-card-frame");
      return {
        clipPath: revealNode ? getComputedStyle(revealNode).clipPath : "missing",
        ctaOpacity: cta ? Number(getComputedStyle(cta).opacity) : 0,
        playState: frameNode ? getComputedStyle(frameNode).animationPlayState : "missing",
      };
    });
    assert(
      !after.clipPath.includes("inset(0px"),
      `${scenario.name}: imagem ficou presa após o hover`,
    );
    assert(after.ctaOpacity < 0.12, `${scenario.name}: CTA ficou preso após o hover`);
    assert(after.playState === "running", `${scenario.name}: brilho não retomou após o hover`);
  }

  const cursorSize = await page
    .getByTestId("store-cursor-shader")
    .locator("span")
    .evaluate((node) => {
      const style = getComputedStyle(node);
      return { width: Number.parseFloat(style.width), height: Number.parseFloat(style.height) };
    });
  assert(
    cursorSize.width >= 82 && cursorSize.width <= 89,
    `${scenario.name}: halo Maison não reduziu cerca de 10% (${cursorSize.width}px)`,
  );
  assert(
    Math.abs(cursorSize.width - cursorSize.height) < 1,
    `${scenario.name}: halo do cursor deformado`,
  );

  return { ambient, cursorSize };
}

const browser = await chromium.launch({
  headless: true,
  args: [
    "--disable-dev-shm-usage",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});

try {
  for (const scenario of scenarios) {
    const context = await browser.newContext({
      viewport: { width: scenario.width, height: scenario.height },
      isMobile: scenario.mobile,
      hasTouch: scenario.mobile,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    try {
      const response = await page.goto(`${baseUrl}/demo/moda`, {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
      assert(response?.ok(), `${scenario.name}: HTTP ${response?.status()}`);
      await settle(page);
      const width = await noHorizontalOverflow(page, scenario.name);
      const chapters = await inspectChapters(page, scenario);
      const atelier = scenario.mobile ? await inspectAtelierMobile(page, scenario) : null;
      const selection = await inspectSelection(page, scenario);
      const desktop = scenario.mobile ? null : await inspectDesktopCardAndCursor(page, scenario);
      assert(
        runtimeErrors.length === 0,
        `${scenario.name}: erros de runtime ${runtimeErrors.join(" | ")}`,
      );

      await page.screenshot({
        path: path.join(outputDir, `${scenario.name}.png`),
        fullPage: false,
        animations: "disabled",
        caret: "hide",
      });
      report.scenarios.push({
        name: scenario.name,
        width,
        chapters,
        atelier,
        selection,
        desktop,
        status: "passed",
      });
    } catch (error) {
      report.errors.push({ name: scenario.name, message: error.message, runtimeErrors });
      await page
        .screenshot({
          path: path.join(outputDir, `${scenario.name}-failure.png`),
          fullPage: false,
        })
        .catch(() => {});
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}

fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

if (report.errors.length) {
  throw new Error(`Validação Maison falhou em ${report.errors.length} cenário(s)`);
}
