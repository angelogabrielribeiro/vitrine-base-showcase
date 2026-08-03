from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise RuntimeError(f"Trecho não encontrado: {label}")
    return text.replace(old, new, 1)


fashion_path = ROOT / "src/components/storefront/fashion-storefront.tsx"
fashion = fashion_path.read_text()

chapter = r'''function FashionChapter({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.08, 0.82, 0.98], [0.3, 1, 1, 0.24]);
  const imageScale = useTransform(scrollYProgress, [0, 0.28, 0.78, 1], [1.015, 1, 1, 1.01]);
  const imageY = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [14, 0, 0, -8]);
  const copyY = useTransform(scrollYProgress, [0.02, 0.18, 0.82, 0.96], [34, 0, 0, -24]);
  const copyOpacity = useTransform(scrollYProgress, [0.02, 0.16, 0.84, 0.97], [0, 1, 1, 0.16]);
  const lineScale = useTransform(scrollYProgress, [0.06, 0.84], [0, 1]);

  const mobileTransition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      ref={ref}
      data-testid="fashion-chapter"
      className="relative border-t border-[#ead1c8]/12 bg-[#25131d] py-16 lg:min-h-[145svh] lg:py-0"
    >
      <div className="relative overflow-hidden lg:sticky lg:top-[4.5rem] lg:h-[calc(100svh-4.5rem)]">
        <div className="absolute inset-y-0 left-5 hidden w-px bg-[#ead1c8]/16 lg:block">
          <motion.div
            className="h-full w-px origin-top bg-[#c99a55] shadow-[0_0_20px_rgba(201,154,85,.52)]"
            style={reduceMotion ? { scaleY: 1 } : { scaleY: lineScale }}
          />
        </div>

        <div
          data-fashion-chapter-layout
          className="relative mx-auto grid h-auto max-w-[96rem] items-center gap-9 px-5 sm:px-8 lg:h-full lg:grid-cols-2 lg:gap-16 lg:px-16"
        >
          <motion.figure
            data-testid="fashion-chapter-media"
            initial={reduceMotion || isDesktop ? false : { opacity: 0, y: 30, scale: 0.985 }}
            whileInView={
              reduceMotion || isDesktop ? undefined : { opacity: 1, y: 0, scale: 1 }
            }
            viewport={{ once: false, amount: 0.3, margin: "0px 0px -12% 0px" }}
            transition={mobileTransition}
            style={
              reduceMotion || !isDesktop
                ? undefined
                : { opacity: sceneOpacity, scale: imageScale, y: imageY }
            }
            className={`relative mx-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden border border-[#ead1c8]/18 bg-[#3d1828] p-2 shadow-[0_28px_80px_rgba(15,4,10,.34)] ${
              index % 2 === 0 ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <img
              src={chapter.image}
              alt={chapter.title}
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full w-full bg-[#3d1828] object-contain"
              style={{ objectPosition: chapter.objectPosition }}
            />
            <span className="pointer-events-none absolute inset-2 bg-[linear-gradient(to_top,rgba(37,19,29,.24),transparent_44%)]" />
            <figcaption className="absolute bottom-5 left-5 text-[9px] font-bold uppercase tracking-[0.28em] text-[#f7eee8]/58">
              Cena {chapter.number} · {chapter.eyebrow}
            </figcaption>
          </motion.figure>

          <motion.div
            data-testid="fashion-chapter-copy"
            initial={reduceMotion || isDesktop ? false : { opacity: 0, x: index % 2 === 0 ? -24 : 24, y: 18 }}
            whileInView={
              reduceMotion || isDesktop ? undefined : { opacity: 1, x: 0, y: 0 }
            }
            viewport={{ once: false, amount: 0.36, margin: "0px 0px -10% 0px" }}
            transition={{ ...mobileTransition, delay: reduceMotion ? 0 : 0.08 }}
            style={
              reduceMotion || !isDesktop ? undefined : { opacity: copyOpacity, y: copyY }
            }
            className={`max-w-2xl ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
          >
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.34em] text-[#d8ad72]">
              <span>{chapter.number}</span>
              <span className="h-px w-12 bg-[#d8ad72]/55" />
              <span>{chapter.eyebrow}</span>
            </div>
            <h2 className="mt-6 max-w-[14ch] hyphens-auto break-words font-display text-[clamp(2.5rem,7vw,6.6rem)] font-medium leading-[0.92] tracking-[-0.055em] text-[#f7eee8] sm:leading-[0.86]">
              {chapter.title}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#f7eee8]/70 sm:text-lg sm:leading-8">
              {chapter.body}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {chapter.notes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-[#ead1c8]/20 bg-[#301622]/65 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ead1c8]/76 backdrop-blur-xl"
                >
                  {note}
                </span>
              ))}
            </div>
            <p className="mt-7 hidden items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/38 lg:inline-flex">
              <MousePointer2 className="h-4 w-4 text-[#c99a55]" /> Continue rolando para atravessar
              o editorial
            </p>
          </motion.div>
        </div>

        <span className="pointer-events-none absolute bottom-4 right-6 hidden font-display text-[16vw] leading-none text-[#ead1c8]/[0.025] lg:block">
          {chapter.number}
        </span>
      </div>
    </section>
  );
}'''

fashion, replaced = re.subn(
    r"function FashionChapter\(.*?\n\}\n\nfunction AtelierConsole",
    chapter + "\n\nfunction AtelierConsole",
    fashion,
    count=1,
    flags=re.S,
)
if replaced != 1:
    raise RuntimeError("Não foi possível substituir FashionChapter")

fashion = replace_once(
    fashion,
    '<div className="relative h-[32rem]" style={{ perspective: "1200px" }}>',
    '<div\n            data-testid="fashion-atelier-rail"\n            className="relative h-[32rem]"\n            style={{ perspective: "1200px" }}\n          >',
    "trilho do atelier",
)
fashion = replace_once(
    fashion,
    'className="h-full w-full object-cover"\n                  />\n                  <div className="absolute inset-0 bg-gradient-to-t from-[#25131d]/86 via-transparent to-transparent" />',
    'className="h-full w-full bg-[#3d1828] object-contain p-1.5"\n                  />\n                  <div className="absolute inset-0 bg-gradient-to-t from-[#25131d]/72 via-transparent to-transparent" />',
    "imagem do atelier",
)
fashion = replace_once(
    fashion,
    '            <div className="mt-6 flex flex-wrap gap-2">\n              {store.categories.map((item) => (',
    '            <div className="mt-6 flex flex-wrap gap-2">\n              {store.categories.map((item) => (',
    "categorias do atelier",
)
fashion = replace_once(
    fashion,
    '            </div>\n          </div>\n        </div>\n\n        <div className="mt-16 grid min-h-[36rem] gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">',
    '            </div>\n            <p\n              data-testid="fashion-atelier-swipe-hint"\n              className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ead1c8]/55 lg:hidden"\n            >\n              <ArrowRight className="h-3.5 w-3.5 text-[#d8ad72]" /> Deslize para explorar a arara\n            </p>\n          </div>\n        </div>\n\n        <div className="mt-12 grid min-h-[36rem] gap-10 sm:mt-16 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">',
    "dica de arraste",
)
fashion = replace_once(
    fashion,
    '<section className="bg-[#f5eee8] px-5 py-24 sm:px-8 sm:py-32">\n        <div className="mx-auto max-w-[84rem]">',
    '<section\n        data-testid="fashion-selection"\n        className="relative overflow-hidden bg-[#d9b5b1] px-5 py-20 sm:px-8 sm:py-24"\n      >\n        <div\n          aria-hidden\n          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#4a192b]/58 to-transparent"\n        />\n        <div className="relative mx-auto max-w-[84rem]">',
    "seção clara",
)

fashion_path.write_text(fashion)

card_path = ROOT / "src/components/storefront/product-card-editorial.tsx"
card = card_path.read_text()
card = replace_once(
    card,
    'const { ref: cardRef, inView } = useInView<HTMLAnchorElement>({ amount: 0.58 });',
    'const { ref: cardRef, inView } = useInView<HTMLAnchorElement>({ amount: 0.35 });',
    "threshold do card editorial",
)
card = replace_once(
    card,
    '  const inStock =',
    '  const ambientActive = !reduce && capabilities.hydrated && inView;\n  const inStock =',
    "estado ambiente do card",
)
card = replace_once(
    card,
    '      data-mobile-active={String(mobileActive)}\n      style=',
    '      data-mobile-active={String(mobileActive)}\n      data-in-view={String(ambientActive)}\n      style=',
    "atributo in-view do card",
)
card = replace_once(
    card,
    '        .ep-card-frame { transition: box-shadow 600ms ease; }',
    '        .ep-card-frame { transition: box-shadow 420ms ease; }\n        .ep-card[data-in-view="true"] .ep-card-frame { animation: ep-glow-pulse 3.4s ease-in-out var(--ep-seq-delay, 0s) infinite; }',
    "animação ambiente desktop",
)
card = replace_once(
    card,
    '          .ep-card:hover .ep-meta, .ep-card:focus-visible .ep-meta { transform: translateY(-4px); }\n        }',
    '          .ep-card:hover .ep-meta, .ep-card:focus-visible .ep-meta { transform: translateY(-4px); }\n          .ep-card:hover .ep-card-frame, .ep-card:focus-visible .ep-card-frame {\n            animation-play-state: paused;\n            box-shadow: 0 18px 42px -26px rgba(139,49,80,0.34), 0 0 0 1px rgba(201,154,85,0.16);\n          }\n          .ep-card:not(:hover):not(:focus-visible) .ep-reveal { clip-path: inset(100% 0 0 0); }\n          .ep-card:not(:hover):not(:focus-visible) .ep-grad { opacity: 0; }\n          .ep-card:not(:hover):not(:focus-visible) .ep-cta { opacity: 0; transform: translateY(10px); }\n        }',
    "reset de hover",
)
card = replace_once(
    card,
    '        .ep-card[data-mobile-active="true"] .ep-card-frame {\n          animation: ep-glow-pulse 2.6s ease-in-out var(--ep-seq-delay, 0s) infinite;\n        }',
    '        .ep-card[data-mobile-active="true"] .ep-card-frame {\n          animation-duration: 3.4s;\n        }',
    "pulso mobile",
)
card = replace_once(
    card,
    '          0%, 100% { box-shadow: 0 0 0 rgba(139,49,80,0); }\n          50% { box-shadow: 0 0 22px rgba(139,49,80,0.29), 0 0 8px rgba(201,154,85,0.19); }',
    '          0%, 100% { box-shadow: 0 8px 22px -22px rgba(139,49,80,0.12); }\n          50% { box-shadow: 0 14px 32px -20px rgba(139,49,80,0.24), 0 0 6px rgba(201,154,85,0.12); }',
    "intensidade do brilho",
)
card = replace_once(
    card,
    '          .ep-card[data-mobile-active="true"] .ep-card-frame { animation: none; }',
    '          .ep-card[data-mobile-active="true"] .ep-card-frame, .ep-card[data-in-view="true"] .ep-card-frame { animation: none; }',
    "redução de movimento",
)
card_path.write_text(card)

cursor_path = ROOT / "src/components/storefront/store-cursor-shader.tsx"
cursor = cursor_path.read_text()
cursor = replace_once(
    cursor,
    'const PALETTES: Record<StoreNiche, { a: string; b: string; fallback: string }> = {\n  fashion: { a: "#d49aa7", b: "#c99a55", fallback: "rgba(212,154,167,.24)" },\n  barber: { a: "#f4c866", b: "#a86b23", fallback: "rgba(244,200,102,.2)" },\n  restaurant: { a: "#ff642b", b: "#ffbd4a", fallback: "rgba(255,100,43,.22)" },\n  electronics: { a: "#67e8f9", b: "#8b5cf6", fallback: "rgba(103,232,249,.22)" },\n};',
    'const PALETTES: Record<\n  StoreNiche,\n  { a: string; b: string; fallback: string; falloff: number; fallbackSize: number }\n> = {\n  fashion: {\n    a: "#d49aa7",\n    b: "#c99a55",\n    fallback: "rgba(212,154,167,.24)",\n    falloff: 11.9,\n    fallbackSize: 5.4,\n  },\n  barber: {\n    a: "#f4c866",\n    b: "#a86b23",\n    fallback: "rgba(244,200,102,.2)",\n    falloff: 10.8,\n    fallbackSize: 6,\n  },\n  restaurant: {\n    a: "#ff642b",\n    b: "#ffbd4a",\n    fallback: "rgba(255,100,43,.22)",\n    falloff: 10.8,\n    fallbackSize: 6,\n  },\n  electronics: {\n    a: "#67e8f9",\n    b: "#8b5cf6",\n    fallback: "rgba(103,232,249,.22)",\n    falloff: 10.8,\n    fallbackSize: 6,\n  },\n};',
    "configuração do cursor",
)
cursor = replace_once(
    cursor,
    '      uniform float velocity;\n      uniform vec3 colorA;',
    '      uniform float velocity;\n      uniform float falloff;\n      uniform vec3 colorA;',
    "uniform falloff",
)
cursor = replace_once(
    cursor,
    '        float halo = exp(-distanceToPointer * (10.8 - velocity * 1.2));',
    '        float halo = exp(-distanceToPointer * (falloff - velocity * 1.2));',
    "falloff do shader",
)
cursor = replace_once(
    cursor,
    '      velocity: { value: 0 },\n      colorA:',
    '      velocity: { value: 0 },\n      falloff: { value: palette.falloff },\n      colorA:',
    "valor do falloff",
)
cursor = replace_once(
    cursor,
    '    palette.a,\n    palette.b,',
    '    palette.a,\n    palette.b,\n    palette.falloff,',
    "dependência falloff",
)
cursor = replace_once(
    cursor,
    '        className="absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"\n        style={{\n          left:',
    '        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"\n        style={{\n          width: `${palette.fallbackSize}rem`,\n          height: `${palette.fallbackSize}rem`,\n          left:',
    "tamanho fallback",
)
cursor_path.write_text(cursor)

css_path = ROOT / "src/mobile-vitrine-overrides.css"
css = css_path.read_text()
maison_css = r'''  /* Maison Belle: capítulos compactos e animados; imagem inteira dentro da moldura. */
  [data-testid="fashion-chapter"] {
    min-height: 0 !important;
  }

  [data-testid="fashion-chapter"] [data-fashion-chapter-layout] {
    gap: 1.75rem !important;
  }

  [data-testid="fashion-chapter-media"] {
    max-height: min(66svh, 34rem);
  }

  [data-testid="fashion-chapter-media"] img {
    object-fit: contain !important;
    background: #3d1828;
  }

  [data-testid="fashion-chapter"] h2 {
    max-width: 12ch !important;
    font-size: clamp(2.25rem, 11vw, 3.4rem) !important;
    line-height: 0.94 !important;
    letter-spacing: -0.045em !important;
  }

  [data-testid="fashion-chapter-copy"] p {
    max-width: 36ch !important;
  }

  /* A arara é um trilho horizontal contido, com gesto nos dois eixos e próxima peça aparente. */
  [data-testid="fashion-atelier"] [class*="mt-12"][class*="min-h"] {
    min-height: 0 !important;
    gap: 2rem !important;
  }

  [data-testid="fashion-atelier-rail"] {
    display: flex !important;
    width: 100% !important;
    height: auto !important;
    gap: 1rem;
    overflow-x: auto !important;
    overscroll-behavior-inline: contain;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 0.25rem;
    scrollbar-width: none;
    touch-action: pan-x pan-y;
    perspective: none !important;
    padding: 0.5rem max(1rem, 12vw) 1rem 0.25rem;
  }

  [data-testid="fashion-atelier-rail"]::-webkit-scrollbar {
    display: none;
  }

  [data-testid="fashion-atelier-rail"] > div {
    position: relative !important;
    inset: auto !important;
    width: min(76vw, 18.5rem) !important;
    height: auto !important;
    aspect-ratio: 4 / 5;
    flex: 0 0 auto;
    scroll-snap-align: start;
    opacity: 1 !important;
    transform: none !important;
  }

  [data-testid="fashion-atelier-rail"] img {
    object-fit: contain !important;
    object-position: center !important;
  }

  [data-testid="fashion-atelier"] [class*="border-l"] {
    border-left: 0 !important;
    padding-left: 0 !important;
  }

'''
css, replaced = re.subn(
    r'  /\* Maison Belle:.*?(?=  /\* NovaCore:)',
    maison_css,
    css,
    count=1,
    flags=re.S,
)
if replaced != 1:
    raise RuntimeError("Não foi possível substituir overrides mobile da Maison")
css_path.write_text(css)

print("Patch Maison Belle aplicado com sucesso")
