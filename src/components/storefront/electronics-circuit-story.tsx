import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  BatteryCharging,
  Cpu,
  Gauge,
  Layers3,
  Radio,
  ScanLine,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Product, StoreConfig } from "@/types/commerce";
import { brl } from "@/lib/format";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { NovaCoreSpatialCore } from "@/components/storefront/novacore-spatial-core";

const METRIC_ICONS = [Gauge, Cpu, BatteryCharging] as const;

export function ElectronicsCircuitStory({
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
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });
  const scanX = useTransform(smoothProgress, [0, 1], ["5%", "95%"]);
  const deckRotateY = useTransform(smoothProgress, [0, 0.5, 1], [-7, 5, -3]);
  const deckRotateX = useTransform(smoothProgress, [0, 0.5, 1], [4, -2, 2]);
  const deckY = useTransform(smoothProgress, [0, 0.5, 1], [24, -12, 8]);
  const compact =
    capabilities.hydrated &&
    (capabilities.coarsePointer || capabilities.quality === "economy");

  const categoryNames = useMemo(
    () => new Map(store.categories.map((category) => [category.slug, category.name])),
    [store.categories],
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value < 0.31 ? 0 : value < 0.66 ? 1 : 2;
    setActive((current) => (current === next ? current : next));
  });

  if (!items.length) return null;

  if (reduced || compact) {
    return (
      <section
        data-testid="electronics-circuit-story"
        className="relative overflow-hidden border-y border-cyan-200/15 bg-[#02040c] px-5 py-18 text-white"
      >
        <NovaCoreSpatialCore className="absolute inset-0 opacity-60" compact />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-cyan-200">
            Arquitetura em camadas
          </p>
          <h2 className="mt-4 max-w-2xl text-5xl font-semibold uppercase leading-[0.84] tracking-[-0.055em]">
            Abra o sistema. Entenda o desempenho.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
            Cada módulo revela produto, função, métrica e contexto comercial sem bloquear a rolagem.
          </p>

          <div className="mt-10 grid gap-5">
            {items.map((product, index) => (
              <article
                key={product.id}
                className="relative overflow-hidden border border-cyan-200/20 bg-[#050918]/88 p-3 backdrop-blur-xl"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,.22),transparent_50%),#030611]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-contain p-5"
                  />
                  <div className="absolute left-4 top-4 border border-cyan-200/20 bg-[#02040c]/80 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.28em] text-cyan-100">
                    Module 0{index + 1}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[8px] uppercase tracking-[0.3em] text-cyan-200/65">
                    {categoryNames.get(product.category) ?? product.category}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{product.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <strong className="text-lg text-cyan-100">
                      {brl(product.salePrice ?? product.price)}
                    </strong>
                    <Link
                      to="/demo/$storeSlug/produto/$productSlug"
                      params={{ storeSlug: store.slug, productSlug: product.slug }}
                      className="inline-flex min-h-11 items-center gap-2 bg-cyan-300 px-4 text-[9px] font-bold uppercase tracking-[0.22em] text-[#02040c]"
                    >
                      Ver sistema <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const current = items[active] ?? items[0];
  const metrics = buildMetrics(current, active);

  return (
    <section
      ref={sectionRef}
      data-testid="electronics-circuit-story"
      className="relative h-[245svh] border-y border-cyan-200/15 bg-[#02040c] text-white"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] min-h-[660px] overflow-hidden">
        <NovaCoreSpatialCore className="absolute inset-0" activeIndex={active} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,12,.96)_0%,rgba(2,4,12,.82)_38%,rgba(2,4,12,.14)_70%,rgba(2,4,12,.72)_100%)]" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 z-20 w-px bg-gradient-to-b from-transparent via-cyan-200 to-transparent shadow-[0_0_28px_rgba(103,232,249,.95)]"
          style={{ left: scanX }}
        />

        <div className="relative mx-auto grid h-full max-w-[96rem] grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] items-center gap-12 px-10 xl:px-16">
          <div className="relative z-30 max-w-xl">
            <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.38em] text-cyan-200">
              <ScanLine className="h-4 w-4" /> Deconstruction protocol / 0{active + 1}
            </div>

            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mt-8 text-[9px] uppercase tracking-[0.32em] text-violet-200/70">
                {categoryNames.get(current.category) ?? current.category}
              </p>
              <h2 className="mt-3 text-[clamp(3.6rem,6vw,6.7rem)] font-semibold uppercase leading-[0.79] tracking-[-0.065em]">
                {current.name}
              </h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
                {current.description}
              </p>
            </motion.div>

            <div className="mt-7 grid grid-cols-3 gap-px border border-cyan-200/15 bg-cyan-200/15">
              {metrics.map((metric, index) => {
                const Icon = METRIC_ICONS[index] ?? Radio;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.08 }}
                    className="bg-[#040817]/88 p-4 backdrop-blur"
                  >
                    <Icon className="h-4 w-4 text-cyan-200" />
                    <strong className="mt-4 block text-lg text-white">{metric.value}</strong>
                    <span className="mt-1 block text-[8px] uppercase tracking-[0.22em] text-slate-500">
                      {metric.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-7 flex items-center gap-4">
              <Link
                to="/demo/$storeSlug/produto/$productSlug"
                params={{ storeSlug: store.slug, productSlug: current.slug }}
                className="inline-flex min-h-13 items-center gap-3 bg-cyan-300 px-6 text-[10px] font-bold uppercase tracking-[0.26em] text-[#02040c] transition hover:bg-white"
              >
                Abrir especificações <ArrowRight className="h-4 w-4" />
              </Link>
              <strong className="text-lg text-cyan-100">
                {brl(current.salePrice ?? current.price)}
              </strong>
            </div>

            <div className="mt-9 flex gap-2">
              {items.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Mostrar ${product.name}`}
                  className={
                    "group flex items-center gap-2 border px-3 py-2 text-[8px] font-bold uppercase tracking-[0.24em] transition " +
                    (index === active
                      ? "border-cyan-200/60 bg-cyan-200/10 text-cyan-100"
                      : "border-white/10 bg-[#02040c]/50 text-slate-500 hover:border-white/30 hover:text-white")
                  }
                >
                  <span
                    className={
                      "h-1.5 w-1.5 rotate-45 " +
                      (index === active ? "bg-cyan-200 shadow-[0_0_12px_#67e8f9]" : "bg-slate-700")
                    }
                  />
                  0{index + 1}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            className="relative z-20 h-[74vh] min-h-[560px] [perspective:1700px]"
            style={{ rotateY: deckRotateY, rotateX: deckRotateX, y: deckY }}
          >
            <ExplodedProductDeck product={current} activeIndex={active} />
          </motion.div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 text-[8px] font-bold uppercase tracking-[0.3em] text-slate-500">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-200/60" />
          Role para desmontar o próximo sistema
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-200/60" />
        </div>
      </div>
    </section>
  );
}

function ExplodedProductDeck({
  product,
  activeIndex,
}: {
  product: Product;
  activeIndex: number;
}) {
  const layerOffsets = [
    { x: -92, y: -58, z: -110, rotate: -5 },
    { x: 82, y: 56, z: -70, rotate: 5 },
  ];

  return (
    <div className="absolute inset-0 [transform-style:preserve-3d]">
      <div className="absolute inset-[8%_12%] rounded-[2rem] border border-cyan-200/15 bg-cyan-200/[0.035] shadow-[0_0_100px_rgba(37,99,235,.14)] [transform:translateZ(-170px)]" />
      <div className="absolute inset-[12%_8%] rounded-[2rem] border border-violet-200/12 [transform:translateZ(-230px)_rotate(6deg)]" />

      {layerOffsets.map((layer, index) => (
        <motion.div
          key={`${product.id}-layer-${index}`}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: 0.48, x: layer.x, y: layer.y }}
          transition={{ duration: 0.72, delay: 0.12 + index * 0.08 }}
          className="absolute inset-[17%_19%] overflow-hidden rounded-[1.6rem] border border-cyan-200/20 bg-[#050918]/70 p-3 backdrop-blur-xl"
          style={{ transform: `translateZ(${layer.z}px) rotate(${layer.rotate}deg)` }}
        >
          <img
            src={product.images[0]}
            alt=""
            className="h-full w-full object-contain opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(103,232,249,.12),transparent)]" />
        </motion.div>
      ))}

      <motion.div
        key={product.id}
        initial={{ opacity: 0, scale: 0.88, rotateY: -16, filter: "blur(14px)" }}
        animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-[12%_16%] overflow-hidden rounded-[2rem] border border-cyan-200/35 bg-[radial-gradient(circle_at_50%_42%,rgba(37,99,235,.24),transparent_55%),rgba(3,6,17,.9)] p-5 shadow-[0_50px_140px_rgba(0,0,0,.75),0_0_80px_rgba(34,211,238,.13)] backdrop-blur-xl [transform:translateZ(70px)]"
      >
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-contain p-8 drop-shadow-[0_34px_44px_rgba(0,0,0,.55)]"
          animate={{ y: [0, -8, 0], rotate: [0, 0.7, 0] }}
          transition={{ duration: 5.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(103,232,249,.16)_48%,transparent_66%)]" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-8 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_22px_rgba(103,232,249,.95)]"
          animate={{ top: ["14%", "86%", "14%"] }}
          transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="absolute left-5 top-5 flex items-center gap-2 border border-cyan-200/20 bg-[#02040c]/78 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.28em] text-cyan-100 backdrop-blur">
          <Layers3 className="h-3.5 w-3.5" /> Live object / 0{activeIndex + 1}
        </div>
      </motion.div>

      <SpecNode
        className="left-[2%] top-[15%]"
        icon={Zap}
        label="Power channel"
        value={`${82 + activeIndex * 6}%`}
        delay={0.12}
      />
      <SpecNode
        className="right-[1%] top-[26%]"
        icon={Cpu}
        label="Response"
        value={`${12 - activeIndex * 2} ms`}
        delay={0.2}
      />
      <SpecNode
        className="bottom-[16%] left-[5%]"
        icon={ShieldCheck}
        label="Coverage"
        value="12 meses"
        delay={0.28}
      />
      <SpecNode
        className="bottom-[8%] right-[5%]"
        icon={Radio}
        label="Signal"
        value="Estável"
        delay={0.36}
      />
    </div>
  );
}

function SpecNode({
  className,
  icon: Icon,
  label,
  value,
  delay,
}: {
  className: string;
  icon: typeof Zap;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.45 }}
      className={`absolute z-30 min-w-36 border border-cyan-200/25 bg-[#02040c]/86 p-3 backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-2 text-cyan-200">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[7px] font-bold uppercase tracking-[0.24em] text-slate-500">
          {label}
        </span>
      </div>
      <strong className="mt-2 block text-sm text-white">{value}</strong>
      <span className="absolute -right-8 top-1/2 h-px w-8 bg-gradient-to-r from-cyan-200/70 to-transparent" />
    </motion.div>
  );
}

function buildMetrics(product: Product, index: number) {
  const stockLabel = product.stock > 0 ? `${product.stock} un.` : "Sob consulta";
  return [
    { value: `${88 + index * 4}%`, label: "performance" },
    { value: `${10 - index * 2} ms`, label: "resposta" },
    { value: stockLabel, label: "disponibilidade" },
  ];
}
