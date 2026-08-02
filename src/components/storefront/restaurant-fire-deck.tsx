import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Flame, Gauge, Hand } from "lucide-react";
import { useRef, useState } from "react";
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
  const reduced = useReducedMotion();
  const { capabilities } = useCinematicMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const stageScale = useTransform(
    scrollYProgress,
    [0, 0.48, 1],
    [0.9, 1, 1.04],
  );
  const heat = useTransform(scrollYProgress, [0, 0.5, 1], [0.16, 0.48, 0.3]);
  const isCompact =
    capabilities.hydrated &&
    (capabilities.coarsePointer || capabilities.quality === "economy");

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      items.length - 1,
      Math.max(0, Math.floor(value * items.length)),
    );
    setActive((current) => (current === next ? current : next));
  });

  if (!items.length) return null;

  if (reduced || isCompact) {
    return (
      <section
        data-testid="restaurant-fire-deck"
        className="overflow-hidden border-y border-orange-300/15 bg-[#140804] px-5 py-16 text-white"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-orange-300">
          Fogo sob comando
        </p>
        <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(2.6rem,10vw,3.5rem)] uppercase leading-[0.88]">
          Três desejos. Nenhum espaço morto.
        </h2>

        <div className="mt-9 space-y-6">
          {items.map((product, index) => (
            <FireScene
              key={product.id}
              product={product}
              storeSlug={store.slug}
              index={index}
            />
          ))}
        </div>
      </section>
    );
  }

  const current = items[active] ?? items[0];

  return (
    <section
      ref={sectionRef}
      data-testid="restaurant-fire-deck"
      className="relative h-[158svh] border-y border-orange-300/15 bg-[#120603] text-white"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: heat,
            backgroundImage:
              "radial-gradient(circle at 65% 58%, rgba(255,91,31,.55), transparent 28%), radial-gradient(circle at 25% 85%, rgba(255,184,55,.22), transparent 25%)",
          }}
        />
        <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:58px_58px]" />
        <FireField />

        <div className="relative mx-auto grid h-full max-w-[94rem] items-center gap-10 px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-12">
          <div className="relative z-30">
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-orange-300">
              <Flame className="mr-2 inline h-4 w-4" /> Câmara de desejo · 0
              {active + 1}
            </p>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: -22, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.46 }}
            >
              <h2 className="mt-4 max-w-[15ch] font-display text-[clamp(2.6rem,5.2vw,5.5rem)] uppercase leading-[0.86] tracking-[-0.03em]">
                {current.name}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-orange-50/72">
                {current.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <strong className="text-3xl text-orange-200">
                  {brl(current.salePrice ?? current.price)}
                </strong>
                <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.26em] text-orange-200/60">
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
              {items.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    const top = sectionRef.current?.offsetTop ?? 0;
                    const travel =
                      (sectionRef.current?.offsetHeight ?? 0) -
                      window.innerHeight;
                    window.scrollTo({
                      top: top + travel * ((index + 0.15) / items.length),
                      behavior: "smooth",
                    });
                  }}
                  aria-label={`Mostrar ${product.name}`}
                  aria-pressed={index === active}
                  className={`h-1.5 transition-all ${index === active ? "w-16 bg-orange-300" : "w-7 bg-white/20"}`}
                />
              ))}
              <span className="ml-2 inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.24em] text-white/35">
                <Hand className="h-3.5 w-3.5" /> role para atiçar
              </span>
            </div>
          </div>

          <CursorParallax
            className="relative z-10 h-[68vh] min-h-[32rem]"
            strengthX={16}
            strengthY={10}
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
                      x: offset * 82,
                      y: Math.abs(offset) * 22,
                      rotateY: offset * -9,
                      rotateZ: offset * 2,
                      scale: isActive ? 1 : 0.8,
                      opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.42,
                      filter: isActive ? "brightness(1)" : "brightness(.5)",
                    }}
                    transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-[6%_16%] overflow-hidden border border-orange-200/20 bg-black shadow-[0_50px_130px_rgba(0,0,0,.72)]"
                    style={{
                      zIndex: isActive ? 20 : 10 - Math.abs(offset),
                      pointerEvents: isActive ? "auto" : "none",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120603] via-transparent to-orange-200/[0.06]" />
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
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.35, once: false });
  const delay = sequenceDelay(index);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className="relative isolate overflow-hidden border border-orange-300/20 bg-[#1a0d07]"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 border border-transparent"
        animate={
          inView
            ? {
                boxShadow: [
                  "0 0 0 1px rgba(217,119,6,0.18)",
                  "0 0 0 1px rgba(251,146,60,0.42), 0 18px 46px -30px rgba(220,38,38,0.55)",
                  "0 0 0 1px rgba(217,119,6,0.18)",
                ],
              }
            : { boxShadow: "0 0 0 1px rgba(217,119,6,0.08)" }
        }
        transition={{ duration: 2.6, repeat: inView ? Number.POSITIVE_INFINITY : 0, delay }}
      />
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140804] via-transparent to-transparent" />
        <p className="absolute left-4 top-4 z-10 text-[9px] font-bold uppercase tracking-[0.3em] text-orange-300">
          Brasa 0{index + 1}
        </p>
      </div>
      <div className="relative z-10 p-5">
        <h3 className="max-w-[16ch] font-display text-2xl uppercase leading-[0.94]">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 max-w-md text-xs leading-6 text-orange-50/65">
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
  { left: 4, w: 30, h: 128, dur: 1.6, delay: -0.1, drift: -6, tip: "50% 8% 62% 4% 42% 96% 58% 92%" },
  { left: 12, w: 22, h: 96, dur: 1.15, delay: -0.55, drift: 9, tip: "46% 4% 70% 10% 38% 94% 66% 88%" },
  { left: 20, w: 34, h: 150, dur: 1.85, delay: -0.9, drift: -11, tip: "54% 6% 58% 2% 46% 98% 52% 90%" },
  { left: 28, w: 20, h: 84, dur: 1.02, delay: -0.28, drift: 7, tip: "42% 10% 74% 6% 34% 92% 68% 86%" },
  { left: 36, w: 28, h: 118, dur: 1.42, delay: -1.15, drift: -8, tip: "50% 4% 64% 8% 40% 96% 60% 90%" },
  { left: 44, w: 24, h: 104, dur: 1.28, delay: -0.42, drift: 10, tip: "48% 8% 66% 4% 36% 94% 64% 92%" },
  { left: 52, w: 32, h: 140, dur: 1.7, delay: -0.72, drift: -9, tip: "52% 6% 60% 2% 44% 98% 56% 88%" },
  { left: 60, w: 22, h: 90, dur: 1.08, delay: -1.3, drift: 8, tip: "44% 10% 72% 6% 38% 92% 62% 90%" },
  { left: 68, w: 30, h: 132, dur: 1.55, delay: -0.18, drift: -10, tip: "50% 4% 58% 8% 42% 96% 58% 94%" },
  { left: 76, w: 20, h: 80, dur: 0.98, delay: -0.62, drift: 6, tip: "46% 8% 70% 4% 36% 94% 64% 88%" },
  { left: 84, w: 26, h: 112, dur: 1.35, delay: -1.02, drift: -7, tip: "48% 6% 64% 10% 40% 96% 60% 90%" },
  { left: 92, w: 24, h: 98, dur: 1.18, delay: -0.36, drift: 9, tip: "44% 4% 68% 8% 38% 98% 62% 92%" },
];

/** Chama procedural: pontas finas e irregulares, altura/velocidade variáveis por labareda. */
function FireField() {
  const { tier, isMobile } = useAdaptiveQuality();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.1 });

  if (tier === "off") return null;

  const specs = isMobile || tier === "low" ? FLAME_SPECS.slice(0, 6) : FLAME_SPECS;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 overflow-hidden opacity-80"
    >
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(255,214,120,.85),rgba(255,120,30,.35)_55%,transparent_85%)] blur-[6px]" />
      {specs.map((f, index) => (
        <span
          key={index}
          className="fire-tongue absolute bottom-[-30%] bg-gradient-to-t from-red-600 via-orange-400 to-yellow-200"
          style={{
            left: `${f.left}%`,
            width: `${f.w}px`,
            height: `${f.h}px`,
            clipPath: `polygon(${f.tip})`,
            filter: "blur(1px)",
            mixBlendMode: "screen",
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
            animationPlayState: inView ? "running" : "paused",
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
      <style>{`
        .fire-tongue { transform-origin: 50% 100%; animation-name: fire-dance; animation-iteration-count: infinite; animation-timing-function: ease-in-out; animation-direction: alternate; }
        @keyframes fire-dance {
          0% { transform: translateY(14px) translateX(0) scaleX(.78) scaleY(.88) rotate(-4deg); opacity: .55; }
          45% { transform: translateY(-6px) translateX(calc(var(--drift) * .4)) scaleX(1.05) scaleY(1.06) rotate(2deg); opacity: .95; }
          100% { transform: translateY(-30px) translateX(var(--drift)) scaleX(.92) scaleY(1.18) rotate(6deg); opacity: .75; }
        }
        @media (prefers-reduced-motion: reduce) { .fire-tongue { animation: none; } }
      `}</style>
    </div>
  );
}
