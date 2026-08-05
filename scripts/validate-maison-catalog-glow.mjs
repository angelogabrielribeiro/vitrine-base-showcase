import fs from "node:fs";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outputDir = "artifacts/maison-catalog-glow";
fs.mkdirSync(outputDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function animationState(frame) {
  return frame.evaluate((element) => {
    const animation = element.getAnimations().find((item) => item.animationName === "premium-frame-breathe");
    return {
      animationName: getComputedStyle(element).animationName,
      playState: animation?.playState ?? getComputedStyle(element).animationPlayState,
      currentTime: Number(animation?.currentTime ?? 0),
      boxShadow: getComputedStyle(element).boxShadow,
      brightness: getComputedStyle(element).filter,
    };
  });
}

const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
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
  });

  const page = await context.newPage();
  const response = await page.goto(`${baseUrl}/demo/moda/produtos`, {
    waitUntil: "networkidle",
    timeout: 90_000,
  });
  assert(response?.ok(), `Maison respondeu com status ${response?.status()}`);

  const card = page.locator('.premium-product-card[data-niche="fashion"]').first();
  const frame = card.locator(".premium-product-frame");
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const beforeHover = await animationState(frame);
  assert(
    beforeHover.animationName.includes("premium-frame-breathe"),
    `Maison não usa premium-frame-breathe: ${beforeHover.animationName}`,
  );
  assert(beforeHover.playState === "running", `Glow Maison inicia ${beforeHover.playState}`);

  await card.hover();
  await page.waitForTimeout(450);
  const duringHover = await animationState(frame);
  assert(duringHover.playState === "running", `Glow Maison parou no hover: ${duringHover.playState}`);
  assert(
    duringHover.currentTime > beforeHover.currentTime,
    `Glow Maison não avançou durante hover: ${beforeHover.currentTime} -> ${duringHover.currentTime}`,
  );

  await page.mouse.move(10, 10);
  await page.waitForTimeout(850);
  const afterExit = await animationState(frame);
  const stillHovered = await card.evaluate((element) => element.matches(":hover"));
  assert(!stillHovered, "Cursor ainda é considerado sobre o card");
  assert(afterExit.playState === "running", `Glow Maison congelou após saída: ${afterExit.playState}`);
  assert(
    afterExit.currentTime > duringHover.currentTime,
    `Glow Maison congelou no frame ${duringHover.currentTime}: terminou em ${afterExit.currentTime}`,
  );

  await page.waitForTimeout(650);
  const later = await animationState(frame);
  assert(later.playState === "running", `Glow Maison parou depois da saída: ${later.playState}`);
  assert(
    later.currentTime > afterExit.currentTime,
    `Glow Maison deixou de pulsar depois da saída: ${afterExit.currentTime} -> ${later.currentTime}`,
  );

  await page.screenshot({
    path: `${outputDir}/maison-after-hover-exit.png`,
    fullPage: false,
  });

  for (const slug of ["barbearia", "restaurante", "eletronicos"]) {
    await page.goto(`${baseUrl}/demo/${slug}/produtos`, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    const otherFrame = page.locator(".premium-product-frame").first();
    await otherFrame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const state = await animationState(otherFrame);
    assert(
      state.playState === "paused",
      `${slug}: animação automática foi ativada indevidamente (${state.playState})`,
    );
  }

  fs.writeFileSync(
    `${outputDir}/report.json`,
    JSON.stringify({ beforeHover, duringHover, afterExit, later, status: "passed" }, null, 2),
  );
  await context.close();
} finally {
  await browser.close();
}
