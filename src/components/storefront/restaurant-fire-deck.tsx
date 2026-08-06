import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Flame, Gauge, Hand } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { Product, StoreConfig } from "@/types/commerce";
import { brl } from "@/lib/format";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { useInView, sequenceDelay } from "@/hooks/use-in-view";

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
  const heat = useTransform(scrollYProgress, [0, 0.32, 0.68, 1], [0.2, 0.46, 0.4, 0.3]);
  const stageScale = useTransform(scrollYProgress, [0, 0.36, 1], [0.97, 1, 1.015]);
  const isCompact =
    capabilities.hydrated &&
    (capabilities.coarsePointer || capabilities.quality === "economy");

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!items.length) return;

    let next = 0;
    if (items.length === 2) next = value >= 0.3 ? 1 : 0;
    if (items.length >= 3) next = value < 0.16 ? 0 : value < 0.4 ? 1 : 2;
    setActive((current) => (current === next ? current : next));
  });

  if (!items.length) return null;

  if (reduced || isCompact) {
    return (
      <section
        data-testid="restaurant-fire-deck"
        className="relative isolate overflow-hidden border-y border-orange-300/15 bg-[#140804] px-5 py-14 text-white sm:px-8 sm:py-16"
      >
        <div className="pointer-events-none absolute inset-x-0 top-24 -z-0 h-32 opacity-85 sm:top-20 sm:h-40">
          <FireRibbon reduced={reduced} compact />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-orange-300">
            Fogo sob comando
          </p>
          <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(2.6rem,10vw,3.5rem)] uppercase leading-[0.88]">
            Três desejos. Nenhum espaço morto.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-orange-50/70">
            Role, toque e escolha. Cada desejo entra em cena com calor próprio.
          </p>

          <div className="mt-28 space-y-5 sm:mt-32">
            {items.map((product, index) => (
              <FireScene
                key={product.id}
                product={product}
                storeSlug={store.slug}
                index={index}
                reduced={reduced}
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
      className="relative h-[132svh] border-y border-orange-300/15 bg-[#120603] text-white"
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
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-56 opacity-90">
          <FireRibbon reduced={reduced} />
        </div>

        <div className="relative mx-auto grid h-full max-w-[94rem] items-center gap-8 px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-12">
          <div className="relative z-30">
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-orange-300">
              <Flame className="mr-2 inline h-4 w-4" /> Câmara de desejo · 0{active + 1}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: -24, filter: "blur(7px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 16, filter: "blur(5px)" }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
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
            </AnimatePresence>

            <div className="mt-7 flex items-center gap-3">
              {items.map((product, index) => {
                const targetProgress = items.length === 3 ? [0.05, 0.25, 0.52][index] : index * 0.34;
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
                    className={`h-1.5 transition-all duration-300 ${index === active ? "w-16 bg-orange-300" : "w-7 bg-white/20"}`}
                  />
                );
              })}
              <span className="ml-2 inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.24em] text-white/42">
                <Hand className="h-3.5 w-3.5" /> role para atiçar
              </span>
            </div>
          </div>

          <motion.div
            className="relative z-10 h-[62vh] min-h-[29rem] max-h-[43rem]"
            style={{ scale: stageScale }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={current.id}
                initial={{ opacity: 0, x: 72, scale: 0.95, rotateY: -5, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -54, scale: 0.97, rotateY: 4, filter: "blur(6px)" }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-[7%_17%] overflow-hidden border border-orange-200/25 bg-black shadow-[0_42px_110px_rgba(0,0,0,.68)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.img
                  src={current.images[0]}
                  alt={current.name}
                  className="h-full w-full object-cover"
                  initial={{ scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120603] via-transparent to-orange-200/[0.05]" />
                <motion.div
                  aria-hidden
                  className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-orange-200/20 to-transparent blur-xl"
                  animate={{ x: ["0%", "420%"] }}
                  transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.8, ease: "easeInOut" }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-orange-300">
                      Brasa 0{active + 1}
                    </p>
                    <p className="mt-2 max-w-[14ch] font-display text-3xl uppercase leading-none">
                      {current.name}
                    </p>
                  </div>
                  <strong className="text-lg text-orange-100">
                    {brl(current.salePrice ?? current.price)}
                  </strong>
                </div>
              </motion.article>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FireScene({
  product,
  storeSlug,
  index,
  reduced,
}: {
  product: Product;
  storeSlug: string;
  index: number;
  reduced: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.3, once: false });
  const delay = sequenceDelay(index);

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 22, scale: 0.985 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: reduced ? 1 : 0, y: reduced ? 0 : 22, scale: reduced ? 1 : 0.985 }
      }
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay }}
      whileTap={reduced ? undefined : { scale: 0.985 }}
      className="relative isolate overflow-hidden border border-orange-300/20 bg-[#1a0d07] shadow-[0_24px_60px_-42px_rgba(255,91,31,.9)]"
    >
      {!reduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 border border-transparent"
          animate={
            inView
              ? {
                  boxShadow: [
                    "inset 0 0 0 1px rgba(251,146,60,.12), 0 18px 42px -34px rgba(234,88,12,.3)",
                    "inset 0 0 0 1px rgba(253,186,116,.34), 0 22px 56px -34px rgba(234,88,12,.62)",
                    "inset 0 0 0 1px rgba(251,146,60,.12), 0 18px 42px -34px rgba(234,88,12,.3)",
                  ],
                }
              : { boxShadow: "inset 0 0 0 1px rgba(251,146,60,.08)" }
          }
          transition={{ duration: 3.2, repeat: inView ? Number.POSITIVE_INFINITY : 0, delay }}
        />
      )}
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover"
          animate={reduced || !inView ? { scale: 1 } : { scale: [1, 1.035, 1] }}
          transition={{ duration: 5.4, repeat: inView ? Number.POSITIVE_INFINITY : 0, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140804] via-transparent to-transparent" />
        <motion.span
          aria-hidden
          className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-orange-100/16 to-transparent blur-xl"
          animate={reduced || !inView ? undefined : { x: ["0%", "330%"] }}
          transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1.1, ease: "easeInOut" }}
        />
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

const OUTER_FLAMES = [
  "M0 240 L0 188 C70 198 92 112 156 176 C218 230 252 76 318 156 C374 224 428 98 494 168 C558 230 612 62 684 150 C752 226 806 92 874 158 C942 224 1004 70 1072 150 C1140 222 1208 92 1276 162 C1344 224 1404 74 1472 154 C1512 200 1562 184 1600 176 L1600 240 Z",
  "M0 240 L0 178 C68 220 108 84 170 158 C230 226 276 112 338 174 C400 230 452 64 520 146 C584 224 640 104 708 166 C774 228 830 70 900 148 C970 224 1022 112 1090 166 C1158 224 1212 62 1284 146 C1352 224 1410 106 1480 164 C1526 202 1568 184 1600 170 L1600 240 Z",
  "M0 240 L0 184 C62 210 104 104 166 170 C228 228 268 70 336 150 C398 226 454 104 522 166 C586 228 636 72 704 150 C772 226 824 106 892 166 C958 226 1012 64 1082 146 C1150 224 1206 100 1274 162 C1340 226 1394 72 1466 150 C1512 204 1560 190 1600 174 L1600 240 Z",
];

const INNER_FLAMES = [
  "M0 240 L0 216 C86 222 116 154 178 204 C244 248 278 132 342 194 C408 246 456 146 520 202 C586 246 640 122 708 190 C774 246 830 148 896 202 C962 246 1018 128 1086 190 C1152 246 1208 150 1276 204 C1344 246 1402 132 1470 194 C1518 226 1560 218 1600 210 L1600 240 Z",
  "M0 240 L0 210 C80 234 122 132 184 190 C250 246 292 160 354 206 C420 248 468 126 534 188 C600 246 652 156 718 206 C784 248 838 132 906 190 C972 246 1026 158 1094 204 C1160 248 1214 126 1282 188 C1350 246 1408 158 1474 202 C1524 228 1564 218 1600 208 L1600 240 Z",
  "M0 240 L0 214 C84 228 120 148 182 198 C248 246 286 126 352 188 C418 246 466 154 532 204 C598 248 650 130 716 190 C782 246 836 156 904 204 C970 248 1024 124 1092 188 C1158 246 1212 154 1280 202 C1348 246 1404 128 1472 190 C1520 228 1562 220 1600 210 L1600 240 Z",
];

function FireRibbon({ reduced, compact = false }: { reduced: boolean; compact?: boolean }) {
  const id = useId().replace(/:/g, "");
  const outerGradient = `brasa-outer-${id}`;
  const innerGradient = `brasa-inner-${id}`;
  const glowFilter = `brasa-glow-${id}`;

  return (
    <svg
      viewBox="0 0 1600 240"
      preserveAspectRatio="none"
      className="h-full w-full overflow-visible"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={outerGradient} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="#7f1d0d" stopOpacity="0.88" />
          <stop offset="40%" stopColor="#ea580c" stopOpacity="0.9" />
          <stop offset="74%" stopColor="#fb923c" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={innerGradient} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.92" />
          <stop offset="58%" stopColor="#fbbf24" stopOpacity="0.86" />
          <stop offset="100%" stopColor="#fff7cc" stopOpacity="0.2" />
        </linearGradient>
        <filter id={glowFilter} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation={compact ? "4" : "5.5"} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="800" cy="230" rx="760" ry="52" fill="#f97316" opacity="0.2" filter={`url(#${glowFilter})`} />
      <motion.path
        d={OUTER_FLAMES[0]}
        fill={`url(#${outerGradient})`}
        filter={`url(#${glowFilter})`}
        animate={reduced ? undefined : { d: OUTER_FLAMES, opacity: [0.72, 0.92, 0.78] }}
        transition={{ duration: compact ? 3.1 : 2.7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.path
        d={INNER_FLAMES[0]}
        fill={`url(#${innerGradient})`}
        animate={reduced ? undefined : { d: INNER_FLAMES, opacity: [0.72, 0.9, 0.76] }}
        transition={{ duration: compact ? 2.5 : 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </svg>
  );
}
