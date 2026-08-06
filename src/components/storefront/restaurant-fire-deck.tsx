import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Flame, Gauge, Hand } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import type { Product, StoreConfig } from "@/types/commerce";
import { brl } from "@/lib/format";
import {
  CursorParallax,
  useCinematicMotion,
} from "@/components/motion/cinematic-motion-system";
import { useInView, sequenceDelay } from "@/hooks/use-in-view";
import { useAdaptiveQuality } from "@/hooks/use-adaptive-quality";

export function RestaurantFireDeck({
  store,
  products,
}: {
  store: StoreConfig;
  products: Product[];
}) {
  const items = products.filter((product) => product.active).slice(0, 3);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = Boolean(useReducedMotion());
  const { capabilities } = useCinematicMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const stageScale = useTransform(scrollYProgress, [0, 0.38, 0.78, 1], [0.94, 1, 1.015, 1.02]);
  const heat = useTransform(scrollYProgress, [0, 0.34, 0.76, 1], [0.18, 0.46, 0.42, 0.34]);
  const isCompact =
    capabilities.hydrated &&
    (capabilities.coarsePointer || capabilities.quality === "economy");

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!items.length) return;

    let next = 0;
    if (items.length === 2) next = value >= 0.44 ? 1 : 0;
    if (items.length >= 3) next = value < 0.26 ? 0 : value < 0.54 ? 1 : 2;
    setActive((current) => (current === next ? current : next));
  });

  if (!items.length) return null;

  if (reduced || isCompact) {
    return (
      <section
        data-testid="restaurant-fire-deck"
        className="overflow-hidden border-y border-orange-300/15 bg-[#140804] px-5 py-14 text-white sm:px-8 sm:py-16"
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-orange-300">
            Fogo sob comando
          </p>
          <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(2.6rem,10vw,3.5rem)] uppercase leading-[0.88]">
            Três desejos. Nenhum espaço morto.
          </h2>

          <div className="mt-8 space-y-5">
            {items.map((product, index) => (
              <FireScene
                key={product.id}
                product={product}
                storeSlug={store.slug}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const current = items[active] ?? items[0];

  return (
    <section
      ref={sectionRef}
      data-testid="restaurant-fire-deck"
      className="relative h-[152svh] border-y border-orange-300/15 bg-[#120603] text-white"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: heat,
            backgroundImage:
              "radial-gradient(circle at 66% 60%, rgba(255,91,31,.58), transparent 29%), radial-gradient(circle at 28% 86%, rgba(255,184,55,.25), transparent 27%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:58px_58px]" />
        <FireField />

        <div className="relative mx-auto grid h-full max-w-[94rem] items-center gap-8 px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-12">
          <div className="relative z-30">
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-orange-300">
              <Flame className="mr-2 inline h-4 w-4" /> Câmara de desejo · 0{active + 1}
            </p>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: -28, filter: "blur(7px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="mt-4 max-w-[15ch] font-display text-[clamp(2.6rem,5.2vw,5.5rem)] uppercase leading-[0.86] tracking-[-0.03em]">
                {current.name}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-orange-50/78">
                {current.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <strong className="text-3xl text-orange-200">
                  {brl(current.salePrice ?? current.price)}
                </strong>
                <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.26em] text-orange-200/70">
                  <Gauge className="h-4 w-4" /> calor {38 + active * 19}%
                </span>
              </div>
              <Link
                to="/demo/$storeSlug/produto/$productSlug"
                params={{ storeSlug: store.slug, productSlug: current.slug }}
                className="mt-6 inline-flex min-h-13 items-center gap-3 border border-orange-300/35 bg-orange-500 px-6 text-[10px] font-bold uppercase tracking-[0.24em] text-[#160703] transition hover:bg-orange-300"
              >
                Abrir pedido <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="mt-7 flex items-center gap-3">
              {items.map((product, index) => {
                const targetProgress = items.length === 3 ? [0.08, 0.36, 0.68][index] : index * 0.5;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      const top = sectionRef.current?.offsetTop ?? 0;
                      const travel = Math.max(
                        0,
                        (sectionRef.current?.offsetHeight ?? 0) - window.innerHeight,
                      );
                      window.scrollTo({
                        top: top + travel * targetProgress,
                        behavior: "smooth",
                      });
                    }}
                    aria-label={`Mostrar ${product.name}`}
                    aria-pressed={index === active}
                    className={`h-1.5 transition-all duration-500 ${index === active ? "w-16 bg-orange-300" : "w-7 bg-white/20"}`}
                  />
                );
              })}
              <span className="ml-2 inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.24em] text-white/42">
                <Hand className="h-3.5 w-3.5" /> role para atiçar
              </span>
            </div>
          </div>

          <CursorParallax
            className="relative z-10 h-[64vh] min-h-[30rem] max-h-[44rem]"
            strengthX={12}
            strengthY={8}
          >
            <motion.div
              className="absolute inset-0"
              style={{ scale: stageScale, transformStyle: "preserve-3d" }}
            >
              {items.map((product, index) => {
                const offset = index - active;
                const isActive = index === active;
                return (
                  <motion.article
                    key={product.id}
                    animate={{
                      x: offset * 74,
                      y: Math.abs(offset) * 18,
                      rotateY: offset * -8,
                      rotateZ: offset * 1.5,
                      scale: isActive ? 1 : 0.82,
                      opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.36,
                      filter: isActive ? "brightness(1) saturate(1.04)" : "brightness(.48)",
                    }}
                    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-[7%_17%] overflow-hidden border border-orange-200/20 bg-black shadow-[0_42px_110px_rgba(0,0,0,.68)]"
                    style={{
                      zIndex: isActive ? 20 : 10 - Math.abs(offset),
                      pointerEvents: isActive ? "auto" : "none",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120603] via-transparent to-orange-200/[0.05]" />
                    <div
                      className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
                    >
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-orange-300">
                          Brasa 0{index + 1}
                        </p>
                        <p className="mt-2 max-w-[14ch] font-display text-3xl uppercase leading-none">
                          {product.name}
                        </p>
                      </div>
                      <strong className="text-lg text-orange-100">
                        {brl(product.salePrice ?? product.price)}
                      </strong>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </CursorParallax>
        </div>
      </div>
    </section>
  );
}

function FireScene({
  product,
  storeSlug,
  index,
}: {
  product: Product;
  storeSlug: string;
  index: number;
}) {
  const reduce = Boolean(useReducedMotion());
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.32, once: false });
  const delay = sequenceDelay(index);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: reduce ? 1 : 0, y: reduce ? 0 : 22 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], delay }}
      className="relative isolate overflow-hidden border border-orange-300/20 bg-[#1a0d07]"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 border border-transparent"
        animate={
          reduce
            ? undefined
            : inView
              ? {
                  boxShadow: [
                    "0 0 0 1px rgba(217,119,6,0.18)",
                    "0 0 0 1px rgba(251,146,60,0.42), 0 18px 46px -30px rgba(220,38,38,0.55)",
                    "0 0 0 1px rgba(217,119,6,0.18)",
                  ],
                }
              : { boxShadow: "0 0 0 1px rgba(217,119,6,0.08)" }
        }
        transition={{ duration: 3, repeat: inView ? Number.POSITIVE_INFINITY : 0, delay }}
      />
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140804] via-transparent to-transparent" />
        <p className="absolute left-4 top-4 z-10 text-[9px] font-bold uppercase tracking-[0.3em] text-orange-300">
          Brasa 0{index + 1}
        </p>
      </div>
      <div className="relative z-10 p-5">
        <h3 className="max-w-[16ch] font-display text-2xl uppercase leading-[0.94]">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 max-w-md text-xs leading-6 text-orange-50/72">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <strong className="text-lg text-orange-200">
            {brl(product.salePrice ?? product.price)}
          </strong>
          <Link
            to="/demo/$storeSlug/produto/$productSlug"
            params={{ storeSlug, productSlug: product.slug }}
            className="inline-flex min-h-11 items-center gap-2 border border-orange-300/35 bg-orange-500 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#160703] transition hover:bg-orange-300"
          >
            Pedir <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

const FLAME_SPECS = [
  { left: 3, width: 46, height: 150, duration: 1.9, delay: -0.2, drift: -10, rotate: -8 },
  { left: 12, width: 34, height: 112, duration: 1.45, delay: -0.8, drift: 9, rotate: 7 },
  { left: 20, width: 54, height: 172, duration: 2.2, delay: -1.1, drift: -13, rotate: -5 },
  { left: 31, width: 38, height: 126, duration: 1.58, delay: -0.45, drift: 8, rotate: 8 },
  { left: 40, width: 48, height: 158, duration: 2.05, delay: -1.35, drift: -9, rotate: -7 },
  { left: 50, width: 36, height: 118, duration: 1.52, delay: -0.62, drift: 11, rotate: 6 },
  { left: 59, width: 52, height: 166, duration: 2.12, delay: -0.96, drift: -12, rotate: -6 },
  { left: 70, width: 35, height: 108, duration: 1.4, delay: -1.5, drift: 8, rotate: 8 },
  { left: 78, width: 48, height: 150, duration: 1.94, delay: -0.32, drift: -10, rotate: -7 },
  { left: 89, width: 36, height: 120, duration: 1.48, delay: -0.72, drift: 9, rotate: 6 },
];

/** Chama procedural orgânica, formada por gotas sobrepostas em vez de polígonos rígidos. */
function FireField() {
  const { tier, isMobile } = useAdaptiveQuality();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.08 });

  if (tier === "off") return null;

  const specs = isMobile || tier === "low" ? FLAME_SPECS.slice(0, 5) : FLAME_SPECS;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-52 overflow-hidden opacity-75"
    >
      <div className="absolute inset-x-[4%] bottom-[-2rem] h-24 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,225,145,.9)_0%,rgba(255,119,29,.48)_44%,rgba(173,33,12,.14)_68%,transparent_78%)] blur-xl" />
      {specs.map((flame, index) => (
        <span
          key={`${flame.left}-${index}`}
          className="brasa-organic-flame absolute bottom-[-4.6rem]"
          style={
            {
              left: `${flame.left}%`,
              width: `${flame.width}px`,
              height: `${flame.height}px`,
              animationDuration: `${flame.duration}s`,
              animationDelay: `${flame.delay}s`,
              animationPlayState: inView ? "running" : "paused",
              "--flame-drift": `${flame.drift}px`,
              "--flame-rotate": `${flame.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
      <style>{`
        .brasa-organic-flame {
          transform-origin: 50% 100%;
          border-radius: 68% 32% 62% 38% / 78% 74% 26% 22%;
          background:
            radial-gradient(ellipse at 50% 72%, rgba(255,246,190,.96) 0 17%, rgba(255,182,55,.9) 31%, rgba(255,91,31,.82) 58%, rgba(170,24,10,.28) 75%, transparent 82%),
            linear-gradient(to top, rgba(199,34,13,.72), rgba(255,138,31,.82) 56%, rgba(255,226,130,.7));
          filter: blur(1.8px) drop-shadow(0 0 12px rgba(255,95,24,.42));
          mix-blend-mode: screen;
          animation: brasa-flame-breathe ease-in-out infinite alternate;
        }
        .brasa-organic-flame::after {
          position: absolute;
          inset: 28% 26% 4%;
          content: "";
          border-radius: 72% 28% 62% 38% / 80% 74% 26% 20%;
          background: radial-gradient(ellipse at 50% 72%, rgba(255,255,225,.98), rgba(255,205,86,.86) 42%, rgba(255,100,28,.12) 76%, transparent 80%);
          filter: blur(1px);
        }
        @keyframes brasa-flame-breathe {
          0% {
            transform: translate3d(0, 20px, 0) rotate(calc(var(--flame-rotate) - 4deg)) scaleX(.82) scaleY(.88);
            opacity: .48;
          }
          42% {
            transform: translate3d(calc(var(--flame-drift) * .35), -4px, 0) rotate(var(--flame-rotate)) scaleX(1.06) scaleY(1.04);
            opacity: .94;
          }
          100% {
            transform: translate3d(var(--flame-drift), -34px, 0) rotate(calc(var(--flame-rotate) + 5deg)) scaleX(.9) scaleY(1.2);
            opacity: .7;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .brasa-organic-flame { animation: none; opacity: .66; }
        }
      `}</style>
    </div>
  );
}
