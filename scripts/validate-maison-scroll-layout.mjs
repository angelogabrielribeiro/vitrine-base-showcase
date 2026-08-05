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
  const targetDocumentTop = await target.evaluate(
    (node) => node.getBoundingClientRect().top + window.scrollY,
  );

  await page.evaluate(
    ({ top, height }) =>
      window.scrollTo({
        top: Math.max(0, top - height * 1.05),
        behavior: "instant",
      }),
    { top: targetDocumentTop, height: scenario.height },
  );
  await page.waitForTimeout(160);
  const before = Number(await copy.evaluate((node) => getComputedStyle(node).opacity));

  await target.evaluate((node) => {
    node.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
  });
  const revealStartedAt = Date.now();
  await page.waitForFunction(
    () => {
      const chapter = document.querySelectorAll('[data-testid="fashion-chapter"]')[1];
      const copyNode = chapter?.querySelector('[data-testid="fashion-chapter-copy"]');
      if (!chapter || !copyNode) return false;

      const targetRect = chapter.getBoundingClientRect();
      const copyRect = copyNode.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(targetRect.bottom, innerHeight) - Math.max(targetRect.top, 0),
      );
      const targetVisibleRatio = visibleHeight / targetRect.height;
      const copyVisible = copyRect.top < innerHeight && copyRect.bottom > 0;
      const opacity = Number(getComputedStyle(copyNode).opacity);
      return targetVisibleRatio >= 0.45 && copyVisible && opacity > 0.82;
    },
    undefined,
    { timeout: scenario.mobile ? 1_700 : 3_000, polling: "raf" },
  );
  const revealDuration = Date.now() - revealStartedAt;
  const after = await target.evaluate((node) => {
    const targetRect = node.getBoundingClientRect();
    const copyNode = node.querySelector('[data-testid="fashion-chapter-copy"]');
    const copyRect = copyNode?.getBoundingClientRect();
    const visibleHeight = Math.max(
      0,
      Math.min(targetRect.bottom, innerHeight) - Math.max(targetRect.top, 0),
    );
    return {
      opacity: copyNode ? Number(getComputedStyle(copyNode).opacity) : 0,
      copyVisible: Boolean(copyRect && copyRect.top < innerHeight && copyRect.bottom > 0),
      targetVisibleRatio: visibleHeight / targetRect.height,
    };
  });
  assert(before < 0.5, `${scenario.name}: storytelling já nasce totalmente revelado (${before})`);
  assert(
    after.targetVisibleRatio >= 0.45,
    `${scenario.name}: capítulo não foi centralizado (${after.targetVisibleRatio})`,
  );
  assert(
    after.copyVisible && after.opacity > 0.82,
    `${scenario.name}: storytelling não conclui enquanto visível (${after.opacity})`,
  );
  assert(
    revealDuration >= 650,
    `${scenario.name}: storytelling continua rápido demais (${revealDuration}ms)`,
  );
  assert(
    revealDuration <= (scenario.mobile ? 1_650 : 2_500),
    `${scenario.name}: storytelling demorou demais para concluir (${revealDuration}ms)`,
  );

  return { metrics, revealDuration };
}

async function readAtelierState(rail) {
  return rail.evaluate((node) => {
    const cards = Array.from(node.children);
    const first = cards[0];
    const second = cards[1];
    const image = first?.querySelector("img");
    const rect = node.getBoundingClientRect();
    const firstRect = first?.getBoundingClientRect();
    const secondRect = second?.getBoundingClientRect();
    const style = getComputedStyle(node);
    return {
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth,
      scrollLeft: node.scrollLeft,
      left: rect.left,
      right: rect.right,
      firstLeft: firstRect?.left ?? 0,
      firstRight: firstRect?.right ?? 0,
      firstWidth: firstRect?.width ?? 0,
      secondLeft: secondRect?.left ?? Number.POSITIVE_INFINITY,
      secondRight: secondRect?.right ?? Number.POSITIVE_INFINITY,
      touchAction: style.touchAction,
      objectFit: image ? getComputedStyle(image).objectFit : "missing",
    };
  });
}

function assertAtelierFraming(state, scenario, phase) {
  assert(state.scrollWidth > state.clientWidth, `${scenario.name}/${phase}: arara deixou de ser navegável`);
  assert(
    state.left >= -2 && state.right <= scenario.width + 2,
    `${scenario.name}/${phase}: trilho da arara extrapola a tela`,
  );
  assert(state.scrollLeft <= 2, `${scenario.name}/${phase}: trilho inicia deslocado (${state.scrollLeft}px)`);
  assert(
    state.firstLeft >= state.left - 2 && state.firstRight <= state.right + 2,
    `${scenario.name}/${phase}: primeiro card está cortado (${state.firstLeft}–${state.firstRight}; trilho ${state.left}–${state.right})`,
  );
  assert(
    state.firstWidth < state.clientWidth - 16,
    `${scenario.name}/${phase}: primeiro card não deixa prévia do próximo`,
  );
  assert(
    state.secondLeft < state.right - 4 && state.secondRight > state.right,
    `${scenario.name}/${phase}: próximo card não aparece parcialmente`,
  );
  assert(
    state.touchAction.includes("pan-x") && state.touchAction.includes("pan-y"),
    `${scenario.name}/${phase}: gesto da arara bloqueia um eixo`,
  );
  assert(state.objectFit === "contain", `${scenario.name}/${phase}: imagem continua cortada na arara`);
}

async function inspectAtelierMobile(page, scenario) {
  const rail = page.getByTestId("fashion-atelier-rail");
  await rail.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const initial = await readAtelierState(rail);
  assertAtelierFraming(initial, scenario, "inicial");

  await rail.evaluate((node) => {
    node.scrollLeft = Math.min(node.scrollWidth - node.clientWidth, node.clientWidth * 0.72);
  });
  await page.waitForTimeout(180);
  assert(
    (await rail.evaluate((node) => node.scrollLeft)) > 10,
    `${scenario.name}: trilho não respondeu ao arraste simulado`,
  );

  const categories = page.getByTestId("fashion-category");
  assert((await categories.count()) > 1, `${scenario.name}: categorias insuficientes para testar reset`);
  await categories.nth(1).click();
  await page.waitForTimeout(500);

  const resetRail = page.getByTestId("fashion-atelier-rail");
  const afterCategory = await readAtelierState(resetRail);
  assertAtelierFraming(afterCategory, scenario, "após troca de categoria");

  assert(
    await page.getByTestId("fashion-atelier-swipe-hint").isVisible(),
    `${scenario.name}: falta indicação de arraste`,
  );
  return { initial, afterCategory };
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
  const cards = selection.locator(".ep-card");
  await cards.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  assert((await cards.count()) >= 4, `${scenario.name}: cards insuficientes para validar glow`);

  const ambientStates = await cards.evaluateAll((nodes) =>
    nodes.map((node) => {
      const ambient = node.querySelector(".ep-ambient-glow");
      if (!ambient) return { animationName: "missing", playState: "missing" };
      const style = getComputedStyle(ambient);
      const animation = ambient.getAnimations()[0];
      return {
        animationName: style.animationName,
        playState: animation?.playState ?? style.animationPlayState,
      };
    }),
  );
  assert(
    ambientStates.every((state) => state.animationName === "ep-ambient-pulse"),
    `${scenario.name}: nem todos os cards têm glow automático ${JSON.stringify(ambientStates)}`,
  );
  assert(
    ambientStates.every((state) => state.playState === "running"),
    `${scenario.name}: algum glow automático está parado ${JSON.stringify(ambientStates)}`,
  );

  const card = cards.first();
  const ambient = card.locator(".ep-ambient-glow");
  const beforeTime = await ambient.evaluate((node) => node.getAnimations()[0]?.currentTime ?? 0);

  await card.hover();
  await page.waitForTimeout(220);
  const reveal = card.locator(".ep-reveal");
  if (await reveal.count()) {
    const during = await reveal.evaluate((node) => getComputedStyle(node).clipPath);
    assert(during.includes("0px"), `${scenario.name}: hover não revela a segunda imagem`);
  }

  await page.mouse.move(4, 4);
  await page.waitForTimeout(750);
  const after = await card.evaluate((node) => {
    const revealNode = node.querySelector(".ep-reveal");
    const cta = node.querySelector(".ep-cta");
    const frameNode = node.querySelector(".ep-card-frame");
    const ambientNode = node.querySelector(".ep-ambient-glow");
    const ambientAnimation = ambientNode?.getAnimations()[0];
    return {
      clipPath: revealNode ? getComputedStyle(revealNode).clipPath : "missing",
      ctaOpacity: cta ? Number(getComputedStyle(cta).opacity) : 0,
      frameShadow: frameNode ? getComputedStyle(frameNode).boxShadow : "missing",
      ambientPlayState:
        ambientAnimation?.playState ??
        (ambientNode ? getComputedStyle(ambientNode).animationPlayState : "missing"),
      ambientTime: Number(ambientAnimation?.currentTime ?? 0),
    };
  });
  if (await reveal.count()) {
    assert(
      !after.clipPath.includes("inset(0px"),
      `${scenario.name}: imagem ficou presa após o hover`,
    );
  }
  assert(after.ctaOpacity < 0.12, `${scenario.name}: CTA ficou preso após o hover`);
  assert(
    after.frameShadow === "none",
    `${scenario.name}: frame ficou congelado após o hover (${after.frameShadow})`,
  );
  assert(after.ambientPlayState === "running", `${scenario.name}: glow parou após o hover`);
  assert(
    after.ambientTime > Number(beforeTime),
    `${scenario.name}: glow não avançou durante/depois do hover`,
  );

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

  return { ambientStates, hoverExit: after, cursorSize };
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

      await page
        .screenshot({
          path: path.join(outputDir, `${scenario.name}.png`),
          fullPage: false,
          animations: "disabled",
          caret: "hide",
          timeout: 8_000,
        })
        .catch(() => {});
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
