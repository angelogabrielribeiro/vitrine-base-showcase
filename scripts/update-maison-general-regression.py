from pathlib import Path

path = Path("scripts/validate-ui.mjs")
source = path.read_text()
old = '''      assert(
        chapterBox.height > viewport.height * 1.7,
        `${label}: capítulo desktop não sustenta a cena longa`,
      );'''
new = '''      assert(
        chapterBox.height >= viewport.height * 1.2 && chapterBox.height <= viewport.height * 1.5,
        `${label}: capítulo desktop saiu do intervalo editorial compacto`,
      );'''
if source.count(old) != 1:
    raise RuntimeError(f"Expectativa antiga encontrada {source.count(old)} vez(es)")
path.write_text(source.replace(old, new, 1))
