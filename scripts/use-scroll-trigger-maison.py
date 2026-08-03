from pathlib import Path

path = Path("src/components/storefront/fashion-storefront.tsx")
source = path.read_text()

old_import = 'import { useMemo, useState } from "react";'
new_import = 'import { useEffect, useMemo, useRef, useState } from "react";'
if old_import not in source:
    raise RuntimeError("Import React atual não encontrado")
source = source.replace(old_import, new_import, 1)

old_trigger = '''  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLElement>({ amount: 0, rootMargin: "0px" });

  const chapterTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };'''
new_trigger = '''  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const element = ref.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const entersBeforeCenter = rect.top < window.innerHeight * 0.88;
        const remainsOnScreen = rect.bottom > window.innerHeight * 0.12;
        setInView(entersBeforeCenter && remainsOnScreen);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const chapterTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };'''
if old_trigger not in source:
    raise RuntimeError("Gatilho IntersectionObserver da Maison não encontrado")
source = source.replace(old_trigger, new_trigger, 1)

path.write_text(source)
print("Controlador direto de scroll aplicado à Maison")
