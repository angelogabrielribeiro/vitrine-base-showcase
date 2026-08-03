from pathlib import Path

path = Path("src/components/storefront/fashion-storefront.tsx")
source = path.read_text()

replacements = [
    (
        'import { useEffect, useMemo, useRef, useState } from "react";',
        'import { useMemo, useState } from "react";',
        "imports React",
    ),
    (
        '''  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
''',
        '''  const reduceMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLElement>({ amount: 0.16, rootMargin: "0px" });
''',
        "controlador da seção",
    ),
    (
        '''            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={reduceMotion ? undefined : { scaleY: 1 }}
            viewport={{ once: false, amount: 0.24 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}''',
        '''            initial={false}
            animate={{ scaleY: reduceMotion || inView ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}''',
        "linha editorial",
    ),
    (
        '''            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.99 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{
              once: false,
              amount: isDesktop ? 0.2 : 0.16,
              margin: "0px 0px -4% 0px",
            }}
            transition={chapterTransition}''',
        '''            initial={false}
            animate={
              reduceMotion || inView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 24, scale: 0.99 }
            }
            transition={chapterTransition}''',
        "mídia editorial",
    ),
    (
        '''            initial={reduceMotion ? false : { opacity: 0, x: index % 2 === 0 ? -20 : 20, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
            viewport={{
              once: false,
              amount: isDesktop ? 0.18 : 0.1,
              margin: "0px 0px -2% 0px",
            }}
            transition={{ ...chapterTransition, delay: reduceMotion ? 0 : 0.05 }}''',
        '''            initial={false}
            animate={
              reduceMotion || inView
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: index % 2 === 0 ? -20 : 20, y: 14 }
            }
            transition={{ ...chapterTransition, delay: reduceMotion ? 0 : 0.05 }}''',
        "texto editorial",
    ),
]

for old, new, label in replacements:
    if old not in source:
        raise RuntimeError(f"Trecho não encontrado: {label}")
    source = source.replace(old, new, 1)

path.write_text(source)
print("Gatilho único por seção aplicado à Maison")
