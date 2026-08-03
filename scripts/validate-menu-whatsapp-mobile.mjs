import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outputDir = "artifacts/menu-whatsapp-mobile";
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
  { name: "360x800", width: 360, height: 800 },
  { name: "392x850", width: 392, height: 850 },
  { name: "430x932", width: 430, height: 932 },
];

const stores = [
  { name: "maison", slug: "moda" },
  { name: "novacore", slug: "eletronicos" },
  { name: "barber", slug: "barbearia" },
  { name: "brasa", slug: "restaurante" },
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

try {
  for (const viewport of viewports) {
    for (const store of stores) {
      const label = `${store.name}-${viewport.name}`;
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
        const response = await page.goto(`${baseUrl}/demo/${store.slug}`, {
          waitUntil: "domcontentloaded",
          timeout: 90_000,
        });
        assert(response?.ok(), `${label}: HTTP ${response?.status()}`);
        await page.waitForFunction(
          () => document.documentElement.dataset.cinematicReady === "true",
          undefined,
          { timeout: 30_000 },
        );

        const menuButton = page.getByRole("button", { name: /Menu/i }).last();
        const fab = page.locator(
          'a[data-whatsapp-fab][aria-label="Falar no WhatsApp"]',
        );
        await menuButton.waitFor({ state: "visible", timeout: 15_000 });
        await fab.waitFor({ state: "visible", timeout: 15_000 });

        await menuButton.click();
        const panel = page.getByRole("menu", { name: "Menu principal" });
        await panel.waitFor({ state: "visible", timeout: 5_000 });
        await page.waitForTimeout(700);
        assert(await panel.isVisible(), `${label}: menu fechou sozinho`);

        const hidden = await fab.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            display: style.display,
            pointerEvents: style.pointerEvents,
            ariaHidden: element.getAttribute("aria-hidden"),
            tabIndex: element.getAttribute("tabindex"),
            rootState: document.documentElement.dataset.mobileMenuOpen,
          };
        });
        assert(
          hidden.display === "none",
          `${label}: WhatsApp continua ocupando a tela`,
        );
        assert(
          hidden.pointerEvents === "none",
          `${label}: WhatsApp continua interceptando toque`,
        );
        assert(
          hidden.ariaHidden === "true",
          `${label}: WhatsApp não foi ocultado para leitor de tela`,
        );
        assert(hidden.tabIndex === "-1", `${label}: WhatsApp continua focável`);
        assert(
          hidden.rootState === "true",
          `${label}: estado global do menu não foi sincronizado`,
        );

        await page.getByRole("button", { name: "Fechar menu" }).click();
        await panel.waitFor({ state: "detached", timeout: 5_000 });
        await page.waitForTimeout(300);

        const restored = await fab.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            display: style.display,
            pointerEvents: style.pointerEvents,
            opacity: Number(style.opacity),
            ariaHidden: element.getAttribute("aria-hidden"),
            tabIndex: element.getAttribute("tabindex"),
            rootState: document.documentElement.dataset.mobileMenuOpen,
          };
        });
        assert(restored.display !== "none", `${label}: WhatsApp não reapareceu`);
        assert(
          restored.pointerEvents !== "none",
          `${label}: WhatsApp não recuperou o toque`,
        );
        assert(
          restored.opacity > 0.9,
          `${label}: WhatsApp reapareceu transparente`,
        );
        assert(
          restored.ariaHidden !== "true",
          `${label}: aria-hidden não foi restaurado`,
        );
        assert(
          restored.tabIndex !== "-1",
          `${label}: foco não foi restaurado`,
        );
        assert(
          restored.rootState === undefined,
          `${label}: estado global ficou preso`,
        );
        assert(
          runtimeErrors.length === 0,
          `${label}: erros de runtime: ${runtimeErrors.join(" | ")}`,
        );

        report.scenarios.push({ label, hidden, restored, status: "passed" });
        await page.screenshot({
          path: path.join(outputDir, `${label}.png`),
          animations: "disabled",
          caret: "hide",
        });
      } catch (error) {
        report.errors.push({ label, message: error.message, runtimeErrors });
        await page
          .screenshot({
            path: path.join(outputDir, `${label}-failure.png`),
            animations: "disabled",
            caret: "hide",
          })
          .catch(() => {});
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}

report.status = report.errors.length === 0 ? "passed" : "failed";
fs.writeFileSync(
  path.join(outputDir, "report.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));

if (report.errors.length > 0) {
  throw new Error(
    `Falha em ${report.errors.length} cenário(s) de menu/WhatsApp`,
  );
}
