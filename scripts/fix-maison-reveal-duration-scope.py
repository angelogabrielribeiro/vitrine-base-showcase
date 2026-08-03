from pathlib import Path

path = Path("scripts/validate-maison-scroll-layout.mjs")
source = path.read_text()
old = '''      targetVisibleRatio: visibleHeight / targetRect.height,
      revealDuration,
'''
new = '''      targetVisibleRatio: visibleHeight / targetRect.height,
'''
if source.count(old) != 1:
    raise RuntimeError(f"Trecho esperado encontrado {source.count(old)} vez(es)")
path.write_text(source.replace(old, new, 1))
print("Escopo de revealDuration corrigido")
