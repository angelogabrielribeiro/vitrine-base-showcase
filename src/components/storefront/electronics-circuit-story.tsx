import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Cpu, ScanLine, ShieldCheck, Zap } from "lucide-react";
import { useRef, useState } from "react";
import type { Product, StoreConfig } from "@/types/commerce";
import { brl } from "@/lib/format";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

export function ElectronicsCircuitStory({
  store,
  products,
}: {
  store: StoreConfig;
  products: Product[];
}) {
  const items = products.filter((product) => product.active).slice(0, 3);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { capabilities } = useCinematicMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const scanY = useTransform(scrollYProgress, [0, 1], ["8%", "92%"]);
  const coreRotate = useTransform(scrollYProgress, [0, 1], [-7, 8]);
  const coreScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.88, 1.03, 0.94],
  );
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
  const current = items[active] ?? items[0];

  if (reduced || isCompact) {
    return (
      <section
        data-testid="electronics-circuit-story"
        className="border-y border-cyan-200/15 bg-[#030611] px-5 py-16 text-white"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-cyan-200">
          Diagnóstico portátil
        </p>
        <h2 className="mt-4 text-5xl font-semibold uppercase leading-[0.84] tracking-[-0.055em]">
          Uma bancada que cabe no toque.
        </h2>
        <div className="mt-10 grid gap-3">
          {items.map((product, index) => (
            <Link
              key={product.id}
              to="/demo/$storeSlug/produto/$productSlug"
              params={{ storeSlug: store.slug, productSlug: product.slug }}
              className="grid grid-cols-[6rem_1fr] items-center gap-4 border border-cyan-200/15 bg-cyan-200/[0.035] p-3"
            >
              <img
                src={product.images[0]}
                alt=""
                className="aspect-square w-full object-cover"
              />
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-cyan-200/65">
                  Módulo 0{index + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                <p className="mt-2 text-sm font-bold text-cyan-200">
                  {brl(product.salePrice ?? product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      data-testid="electronics-circuit-story"
      className="relative h-[162svh] border-y border-cyan-200/15 bg-[#030611] text-white"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <CircuitBackdrop />
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 z-20 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_24px_rgba(103,232,249,.95)]"
          style={{ top: scanY }}
        />

        <div className="relative mx-auto grid h-full max-w-[96rem] items-center gap-10 px-6 lg:grid-cols-[.7fr_1.3fr] lg:px-12">
          <div className="relative z-30">
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-cyan-200">
              <ScanLine className="mr-2 inline h-4 w-4" /> Leitura de sistema /
              0{active + 1}
            </p>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 24, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mt-4 text-[clamp(3rem,5vw,5.2rem)] font-semibold uppercase leading-[0.84] tracking-[-0.055em]">
                {current.name}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300/74">
                {current.description}
              </p>
              <div className="mt-5 grid max-w-lg grid-cols-3 gap-px bg-cyan-200/15">
                {[
                  [Zap, `${82 + active * 6}%`, "performance"],
                  [Cpu, `${12 - active * 2} ms`, "resposta"],
                  [ShieldCheck, "12 meses", "cobertura"],
                ].map(([Icon, value, label]) => {
                  const MetricIcon = Icon as typeof Zap;
                  return (
                    <div key={String(label)} className="bg-[#050918] p-4">
                      <MetricIcon className="h-4 w-4 text-cyan-200" />
                      <strong className="mt-4 block text-lg">
                        {String(value)}
                      </strong>
                      <span className="mt-1 block text-[8px] uppercase tracking-[0.22em] text-slate-500">
                        {String(label)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Link
                to="/demo/$storeSlug/produto/$productSlug"
                params={{ storeSlug: store.slug, productSlug: current.slug }}
                className="mt-6 inline-flex min-h-13 items-center gap-3 bg-cyan-300 px-6 text-[10px] font-bold uppercase tracking-[0.26em] text-[#030611] transition hover:bg-white"
              >
                Abrir diagnóstico <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <div className="relative h-[68vh] min-h-[32rem] [perspective:1500px]">
            <motion.div
              className="absolute inset-[8%_16%] overflow-hidden border border-cyan-200/25 bg-[#060a18] shadow-[0_50px_150px_rgba(0,0,0,.8)]"
              style={{
                rotateY: coreRotate,
                scale: coreScale,
                transformStyle: "preserve-3d",
              }}
            >
              <motion.img
                key={current.id}
                src={current.images[0]}
                alt=""
                initial={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.6 }}
                className="h-full w-full object-cover saturate-[.82]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-transparent to-cyan-300/[0.06]" />
            </motion.div>

            {items.map((product, index) => {
              const offset = index - active;
              return (
                <motion.button
                  key={product.id}
                  type="button"
                  onClick={() => setActive(index)}
                  animate={{
                    x: offset < 0 ? -80 : offset > 0 ? 80 : 0,
                    y: (index - 1) * 118,
                    rotateY: offset * 16,
                    opacity: index === active ? 1 : 0.52,
                  }}
                  transition={{ duration: 0.5 }}
                  className={`absolute right-0 top-1/2 z-30 w-56 border p-4 text-left backdrop-blur-xl ${index === active ? "border-cyan-200/60 bg-cyan-200/10" : "border-white/10 bg-[#050714]/70"}`}
                >
                  <span className="text-[8px] font-bold uppercase tracking-[0.28em] text-cyan-200/65">
                    Node 0{index + 1}
                  </span>
                  <strong className="mt-2 block text-sm">{product.name}</strong>
                  <span className="mt-2 block text-xs text-cyan-200">
                    {brl(product.salePrice ?? product.price)}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CircuitBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-25"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="circuit-grid"
          width="72"
          height="72"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 36h26l10-10h36M36 0v24l12 12v36"
            fill="none"
            stroke="#67e8f9"
            strokeWidth="0.7"
          />
          <circle cx="36" cy="36" r="2.5" fill="#8b5cf6" />
        </pattern>
        <radialGradient id="circuit-light">
          <stop offset="0" stopColor="#2563eb" stopOpacity=".55" />
          <stop offset="1" stopColor="#02040c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-grid)" />
      <circle cx="1040" cy="420" r="360" fill="url(#circuit-light)" />
    </svg>
  );
}
