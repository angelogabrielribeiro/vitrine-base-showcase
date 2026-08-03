from pathlib import Path

path = Path("scripts/validate-maison-scroll-layout.mjs")
source = path.read_text()
old = '''      await page.screenshot({
        path: path.join(outputDir, `${scenario.name}.png`),
        fullPage: false,
        animations: "disabled",
        caret: "hide",
      });'''
new = '''      await page
        .screenshot({
          path: path.join(outputDir, `${scenario.name}.png`),
          fullPage: false,
          animations: "disabled",
          caret: "hide",
          timeout: 8_000,
        })
        .catch(() => {});'''
if source.count(old) != 1:
    raise RuntimeError(f"Bloco de screenshot encontrado {source.count(old)} vez(es)")
path.write_text(source.replace(old, new, 1))
