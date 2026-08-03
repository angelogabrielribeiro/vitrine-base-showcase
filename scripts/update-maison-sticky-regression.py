from pathlib import Path

path = Path("scripts/validate-ui.mjs")
source = path.read_text()
old = '    const sticky = firstChapter.locator(":scope > div.sticky");'
new = '    const sticky = firstChapter.locator(":scope > div").first();'
if source.count(old) != 1:
    raise RuntimeError(f"Seletor antigo encontrado {source.count(old)} vez(es)")
path.write_text(source.replace(old, new, 1))
