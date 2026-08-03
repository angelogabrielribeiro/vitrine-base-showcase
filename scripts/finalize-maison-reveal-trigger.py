from pathlib import Path

source_path = Path("src/components/storefront/fashion-storefront.tsx")
test_path = Path("scripts/validate-maison-scroll-layout.mjs")

source = source_path.read_text()
old_source = 'const { ref, inView } = useInView<HTMLElement>({ amount: 0.16, rootMargin: "0px" });'
new_source = 'const { ref, inView } = useInView<HTMLElement>({ amount: 0, rootMargin: "0px" });'
if old_source not in source:
    raise RuntimeError("Gatilho atual da Maison não encontrado")
source_path.write_text(source.replace(old_source, new_source, 1))

test = test_path.read_text()
old_test = 'top: Math.max(0, top - height * 0.88),'
new_test = 'top: Math.max(0, top - height * 1.05),'
if old_test not in test:
    raise RuntimeError("Posicionamento inicial do teste Maison não encontrado")
test_path.write_text(test.replace(old_test, new_test, 1))

print("Gatilho final da revelação Maison aplicado")
