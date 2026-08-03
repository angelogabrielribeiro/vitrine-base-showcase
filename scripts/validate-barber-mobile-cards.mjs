import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outputDir = "artifacts/barber-mobile-cards";
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "360x800", width: 360, height: 800 },
  { name: "392x850", width: 392, height: 850 },
  { name: "430x932", width: 430, height: 932 },
];

const report = { scenarios: [], errors: [] };
const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--disable-dev-shm-usage",
  ],
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function centerInViewport(locator, delay = 900) {
  await locator.evaluate((element) => {
    element.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
  });
  await locator.page().waitForTimeout(delay);
}

try {
  for (const viewport of viewports) {
    const label = `barber-${viewport.name}`;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    try {
      const response = await page.goto(`${baseUrl}/demo/barbearia`, {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
      assert(response?.ok(), `${label}: HTTP ${response?.status()}`);
      await page.waitForFunction(
        () => document.documentElement.dataset.cinematicReady === "true",
        undefined,
        { timeout: 30_000 },
      );
      await page.waitForTimeout(500);

      const width = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
      }));
      assert(
        width.document <= width.viewport + 1,
        `${label}: overflow horizontal do documento (${width.document} > ${width.viewport})`,
      );

      const servicesSection = page
        .getByRole("heading", { name: "O que se pratica aqui" })
        .locator("xpath=ancestor::section[1]");
      const serviceRows = servicesSection.locator("li");
      assert((await serviceRows.count()) >= 3, `${label}: carta de serviços incompleta`);
      const serviceTarget = serviceRows.nth(1);
      await centerInViewport(serviceTarget);
      const serviceState = await serviceTarget.evaluate((element) => {
        const link = element.querySelector("a");
        const rect = element.getBoundingClientRect();
        const ambient = link ? getComputedStyle(link, "::before") : null;
        return {
          active: element.getAttribute("data-active"),
          ambientAnimation: ambient?.animationName ?? "none",
          ambientPlayState: ambient?.animationPlayState ?? "paused",
          ambientOpacity: ambient ? Number(ambient.opacity) : 0,
          visibleRatio:
            Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0)) / rect.height,
        };
      });
      assert(serviceState.visibleRatio >= 0.6, `${label}: serviço não foi centralizado pelo teste`);
      assert(
        serviceState.ambientAnimation === "barber-service-ambient",
        `${label}: serviço sem pulso ambiente automático`,
      );
      assert(
        serviceState.ambientPlayState === "running",
        `${label}: pulso do serviço depende de toque`,
      );
      assert(serviceState.ambientOpacity > 0, `${label}: pulso do serviço está invisível`);

      const ritualSection = page
        .getByRole("heading", { name: "Três atos, uma cadeira" })
        .locator("xpath=ancestor::section[1]");
      const ritualRail = ritualSection.locator('[class*="snap-x"][class*="overflow-x-auto"]');
      const ritualCard = ritualRail.locator(":scope > div").first();
      await centerInViewport(ritualCard);
      const ritualState = await ritualCard.evaluate((element) => ({
        lit: element.getAttribute("data-lit"),
        shadow: getComputedStyle(element).boxShadow,
      }));
      assert(ritualState.lit === "true", `${label}: card do ritual não acendeu no scroll`);
      assert(ritualState.shadow !== "none", `${label}: card do ritual sem glow automático`);
      const ritualRailState = await ritualRail.evaluate((element) => ({
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        touchAction: getComputedStyle(element).touchAction,
      }));
      assert(
        ritualRailState.scrollWidth > ritualRailState.clientWidth,
        `${label}: trilho do ritual deixou de ser navegável`,
      );
      assert(
        ritualRailState.touchAction.includes("pan-x") &&
          ritualRailState.touchAction.includes("pan-y"),
        `${label}: trilho bloqueia um dos eixos de navegação`,
      );

      const atmosphereSection = page
        .getByRole("heading", { name: "Atmosfera Barber Noir" })
        .locator("xpath=ancestor::section[1]");
      const atmosphereCard = atmosphereSection.locator("figure").nth(1);
      await centerInViewport(atmosphereCard);
      const atmosphereState = await atmosphereCard.evaluate((element) => {
        const image = element.querySelector("img");
        const cardStyle = getComputedStyle(element);
        const imageStyle = image ? getComputedStyle(image) : null;
        const scanStyle = getComputedStyle(element, "::after");
        return {
          lit: element.getAttribute("data-lit"),
          shadow: cardStyle.boxShadow,
          ambientAnimation: cardStyle.animationName,
          ambientPlayState: cardStyle.animationPlayState,
          imageAnimation: imageStyle?.animationName ?? "none",
          imagePlayState: imageStyle?.animationPlayState ?? "paused",
          scan: scanStyle.animationName,
          scanPlayState: scanStyle.animationPlayState,
        };
      });
      assert(
        atmosphereState.ambientAnimation === "barber-atmosphere-ambient",
        `${label}: quadro de atmosfera sem respiração dourada`,
      );
      assert(
        atmosphereState.ambientPlayState === "running",
        `${label}: glow da atmosfera depende de toque`,
      );
      assert(atmosphereState.shadow !== "none", `${label}: atmosfera sem profundidade`);
      assert(
        atmosphereState.imageAnimation === "barber-atmosphere-image" &&
          atmosphereState.imagePlayState === "running",
        `${label}: imagem da atmosfera permanece estática`,
      );
      assert(
        atmosphereState.scan === "barber-mobile-scan" &&
          atmosphereState.scanPlayState === "running",
        `${label}: varredura dourada não está ativa`,
      );

      const groomingSection = page
        .getByRole("heading", { name: "Leve o ritual para casa" })
        .locator("xpath=ancestor::section[1]");
      const productCard = groomingSection
        .locator('.premium-product-card[data-niche="barber"]')
        .first();
      await centerInViewport(productCard, 1_100);
      const productState = await productCard.evaluate((element) => {
        const frame = element.querySelector(".premium-product-frame");
        const glow = element.querySelector(".product-attention-glow");
        const rect = element.getBoundingClientRect();
        const glowStyle = glow ? getComputedStyle(glow) : null;
        return {
          mobileActive: element.getAttribute("data-mobile-active"),
          inView: element.getAttribute("data-in-view"),
          animationName: frame ? getComputedStyle(frame).animationName : "none",
          animationPlayState: frame ? getComputedStyle(frame).animationPlayState : "paused",
          glowAnimationName: glowStyle?.animationName ?? "none",
          glowPlayState: glowStyle?.animationPlayState ?? "paused",
          glowOpacity: glowStyle ? Number(glowStyle.opacity) : 0,
          visibleRatio:
            Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0)) / rect.height,
        };
      });
      assert(productState.visibleRatio > 0.4, `${label}: produto não ficou visível no scroll`);
      assert(
        productState.animationName === "premium-frame-breathe" &&
          productState.animationPlayState === "running",
        `${label}: borda do produto não anima automaticamente`,
      );
      assert(
        productState.glowAnimationName === "barber-product-ambient" &&
          productState.glowPlayState === "running",
        `${label}: glow do produto ainda depende de clique ou long press`,
      );
      assert(productState.glowOpacity > 0.04, `${label}: glow ambiente do produto está invisível`);
      assert(
        runtimeErrors.length === 0,
        `${label}: erros de runtime: ${runtimeErrors.join(" | ")}`,
      );

      const scenario = {
        label,
        width,
        serviceState,
        ritualState,
        ritualRailState,
        atmosphereState,
        productState,
        status: "passed",
      };
      report.scenarios.push(scenario);
      await page.screenshot({
        path: path.join(outputDir, `${label}.png`),
        fullPage: false,
        animations: "disabled",
        caret: "hide",
        timeout: 60_000,
      });
    } catch (error) {
      report.errors.push({ label, message: error.message, runtimeErrors });
      await page
        .screenshot({
          path: path.join(outputDir, `${label}-failure.png`),
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
} finally {
  await browser.close();
}

report.status = report.errors.length === 0 ? "passed" : "failed";
fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

if (report.errors.length > 0) {
  throw new Error(`Falha em ${report.errors.length} cenário(s) da Barber Noir mobile`);
}