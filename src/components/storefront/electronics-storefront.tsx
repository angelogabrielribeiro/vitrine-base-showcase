import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BatteryCharging,
  Box,
  Check,
  Cpu,
  CreditCard,
  FlaskConical,
  Gauge,
  Headphones,
  Laptop,
  Radio,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Watch,
  Zap,
} from "lucide-react";
import { motion, type PanInfo, useReducedMotion } from "framer-motion";
import type { Product, StoreConfig } from "@/types/commerce";
import { brl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TechnologyShader } from "./technology-shader";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { ElectronicsCircuitStory } from "@/components/storefront/electronics-circuit-story";

type ElectronicsStorefrontProps = {
  store: StoreConfig;
  products: Product[];
  featured: Product[];
};

const CATEGORY_ICONS = {
  smartphones: Smartphone,
  computadores: Laptop,
  gamer: Cpu,
  audio: Headphones,
  wearables: Watch,
  acessorios: Box,
} as const;

const LAB_TESTS = [
  {
    code: "NC/01",
    title: "Carga sustentada",
    body: "CPU, GPU e térmicas medidas sob uso contínuo — não apenas em picos de benchmark.",
    icon: Gauge,
    metric: "120 min",
  },
  {
    code: "NC/02",
    title: "Autonomia real",
    body: "Ciclos mistos de produtividade, mídia e standby com brilho calibrado.",
    icon: BatteryCharging,
    metric: "3 ciclos",
  },
  {
    code: "NC/03",
    title: "Sinal e latência",
    body: "Wi‑Fi, Bluetooth e resposta periférica avaliados em ambientes congestionados.",
    icon: Radio,
    metric: "< 12 ms",
  },
];

const SIGNALS = [
  "Performance verificada",
  "Garantia NovaCore",
  "Setup assistido",
  "Envio expresso",
  "Curadoria 2026",
];

export function ElectronicsStorefront({ store, products, featured }: ElectronicsStorefrontProps) {
  const activeProducts = products.filter((product) => product.active);
  const showcase = (featured.length ? featured : activeProducts).slice(0, 6);

  return (
    <div className="overflow-hidden bg-[#050714] text-white">
      <NovaHero store={store} product={showcase[0] ?? activeProducts[0]} />
      <ElectronicsCircuitStory store={store} products={showcase} />
      <SignalRail />
      <CategoryCommand store={store} />
      <ProductFan store={store} products={showcase} />
      <SystemsGrid store={store} products={activeProducts.slice(0, 8)} />
      <LabSection store={store} />
      <TrustStrip store={store} />
      <ClosingSection store={store} />
    </div>
  );
}

function NovaHero({ store, product }: { store: StoreConfig; product?: Product }) {
  const reduceMotion = useReducedMotion();
  const { capabilities } = useCinematicMotion();
  const price = product ? (product.salePrice ?? product.price) : undefined;

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 sm:min-h-[780px]">
      <TechnologyShader className="absolute inset-0 opacity-90" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(104,184,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(104,184,255,.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent 92%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,#050714_0%,rgba(5,7,20,.92)_35%,rgba(5,7,20,.25)_72%,#050714_100%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 sm:flex sm:min-h-[780px] sm:flex-col sm:px-8 sm:pb-14 sm:pt-16 lg:px-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[10px] uppercase tracking-[0.32em] text-cyan-100/70">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,.9)]" />
            System online
          </span>
          <span className="hidden sm:block">NovaCore interface / 26.7</span>
          <span>São Paulo · BR</span>
        </div>

        <div className="grid gap-10 py-10 sm:flex-1 sm:items-center sm:gap-12 sm:py-14 lg:grid-cols-[1.08fr_.92fr]">
          <div className="relative z-10">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 border border-cyan-300/25 bg-cyan-300/[0.07] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-100"
            >
              <ScanLine className="h-3.5 w-3.5" />
              {store.messages.heroKicker}
            </motion.div>

            <h1 className="mt-7 max-w-full text-[clamp(3rem,14vw,8.7rem)] font-semibold uppercase leading-[0.8] tracking-[-0.055em] sm:max-w-4xl sm:tracking-[-0.075em]">
              {["Engineered", "for what's", "next."].map((line, index) => (
                <motion.span
                  key={line}
                  initial={reduceMotion ? false : { opacity: 0, y: 55, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.08 + index * 0.09, duration: 0.72 }}
                  className={
                    "block " +
                    (index === 2
                      ? "bg-gradient-to-r from-cyan-200 via-blue-400 to-violet-400 bg-clip-text text-transparent"
                      : "text-white")
                  }
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.55 }}
              className="mt-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              Dispositivos selecionados por desempenho real. Um catálogo para quem enxerga
              tecnologia como ferramenta — não como decoração.
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.55 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Button
                asChild
                size="lg"
                className="h-14 rounded-none bg-cyan-300 px-7 text-[11px] font-bold uppercase tracking-[0.28em] text-[#050714] hover:bg-white"
              >
                <Link
                  to="/demo/$storeSlug/produtos"
                  params={{ storeSlug: store.slug }}
                  search={{ q: "", cat: "", sort: "" }}
                >
                  Explorar sistemas <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href="#showroom"
                className="inline-flex h-14 items-center border border-white/20 bg-white/[0.04] px-7 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
              >
                Abrir showroom
              </a>
            </motion.div>
          </div>

          {product && (
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : capabilities.coarsePointer
                    ? { opacity: 0, y: 36, scale: 0.96 }
                    : { opacity: 0, x: 50, rotateY: -12 }
              }
              animate={{ opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1 }}
              transition={{ delay: 0.22, duration: 0.85 }}
              className="relative mx-auto w-full max-w-[min(100%,520px)] [perspective:1200px]"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-full bg-blue-500/20 blur-[70px] sm:-inset-12 sm:blur-[100px]"
              />
              <div className="relative border border-cyan-200/20 bg-[#090d20]/75 p-3 shadow-[0_60px_130px_-55px_rgba(56,189,248,.8)] backdrop-blur-xl">
                <div className="absolute left-6 top-6 z-10 flex items-center gap-2 bg-[#050714]/80 px-3 py-2 text-[9px] uppercase tracking-[0.3em] text-cyan-100 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Live specimen
                </div>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="eager"
                  className="aspect-[4/5] w-full object-cover saturate-[0.82]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 bg-[linear-gradient(115deg,transparent_35%,rgba(103,232,249,.14)_50%,transparent_65%)]"
                />
                <div className="grid grid-cols-1 items-end gap-3 border-t border-white/10 bg-[#070a18] p-5 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.32em] text-cyan-200/65">
                      Flagship selection
                    </div>
                    <div className="mt-2 text-xl font-semibold">{product.name}</div>
                  </div>
                  {price != null && (
                    <div className="text-left sm:text-right">
                      <div className="text-[9px] uppercase tracking-[0.24em] text-slate-500">
                        A partir de
                      </div>
                      <div className="mt-1 text-lg font-semibold text-cyan-200">{brl(price)}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute right-2 top-1/3 z-20 flex items-center gap-2 border border-cyan-300/70 bg-[#050714]/95 px-3 py-2.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-cyan-50 shadow-[0_12px_40px_-12px_rgba(34,211,238,.9)] backdrop-blur-md sm:-right-4">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 border border-violet-300 bg-violet-400/30 shadow-[0_0_12px_rgba(196,181,253,.85)]"
                />
                Curadoria NC
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
          {[
            ["24H", "envio expresso"],
            ["12X", "sem juros"],
            ["100%", "performance verificada"],
          ].map(([value, label]) => (
            <div key={label} className="flex items-end gap-3 bg-[#060918]/90 px-5 py-4">
              <strong className="text-2xl font-semibold text-white">{value}</strong>
              <span className="pb-1 text-[9px] uppercase tracking-[0.25em] text-slate-400">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignalRail() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden border-b border-white/10 bg-cyan-300 py-3 text-[#050714]">
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 20, ease: "linear", repeat: Number.POSITIVE_INFINITY }
        }
        className="flex w-max items-center"
      >
        {[...SIGNALS, ...SIGNALS].map((signal, index) => (
          <div
            key={`${signal}-${index}`}
            className="flex items-center gap-6 px-6 text-[10px] font-bold uppercase tracking-[0.32em]"
          >
            {signal}
            <span className="h-1.5 w-1.5 rotate-45 bg-[#050714]" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function CategoryCommand({ store }: { store: StoreConfig }) {
  return (
    <section className="relative border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.38em] text-cyan-200/70">
              Select interface
            </div>
            <h2 className="mt-3 max-w-sm text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.04em] sm:text-5xl">
              Escolha seu próximo sistema.
            </h2>
          </div>
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {store.categories.map((category, index) => {
              const Icon = CATEGORY_ICONS[category.slug as keyof typeof CATEGORY_ICONS] ?? Sparkles;
              return (
                <Link
                  key={category.slug}
                  to="/demo/$storeSlug/categoria/$categorySlug"
                  params={{ storeSlug: store.slug, categorySlug: category.slug }}
                  className="group relative min-h-40 overflow-hidden bg-[#080b1a] p-5 transition duration-500 hover:bg-[#0c1430] active:scale-[0.985] active:bg-[#0c1430]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500">
                      NC/{String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon className="h-5 w-5 text-cyan-200/70 transition group-hover:scale-110 group-hover:text-cyan-200" />
                  </div>
                  <div className="mt-14 flex items-end justify-between gap-4">
                    <span className="text-sm font-semibold uppercase tracking-[0.16em]">
                      {category.name}
                    </span>
                    <ArrowRight className="h-4 w-4 -translate-x-2 text-cyan-200 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan-300 to-violet-400 transition duration-500 group-hover:scale-x-100" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductFan({ store, products }: { store: StoreConfig; products: Product[] }) {
  const reduceMotion = useReducedMotion();
  const { capabilities } = useCinematicMotion();
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const items = products.slice(0, 5);
  const current = items[active];

  useEffect(() => {
    if (reduceMotion || hovering || items.length < 2) return;
    const interval = window.setInterval(() => {
      setActive((value) => (value + 1) % items.length);
    }, 3600);
    return () => window.clearInterval(interval);
  }, [hovering, items.length, reduceMotion]);

  const categoryName = useMemo(
    () => new Map(store.categories.map((category) => [category.slug, category.name])),
    [store.categories],
  );

  if (!current) return null;

  const selectRelative = (delta: number) => {
    setActive((value) => (value + delta + items.length) % items.length);
  };
  const fanStep = capabilities.coarsePointer ? 58 : 92;

  return (
    <section id="showroom" className="relative border-b border-white/10 bg-[#070a17]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(circle at 70% 40%, rgba(91,33,182,.35), transparent 30%), radial-gradient(circle at 25% 55%, rgba(8,145,178,.25), transparent 32%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.74fr_1.26fr] lg:items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.38em] text-violet-200/70">
              Interactive showroom
            </div>
            <h2 className="mt-3 text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.045em] sm:text-6xl">
              Tecnologia para tocar.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">
              Arraste, compare e encontre o sistema certo. Cada produto aqui representa uma
              categoria de performance da NovaCore.
            </p>

            <div className="mt-9 border-l border-cyan-300/40 pl-5">
              <div className="text-[9px] uppercase tracking-[0.3em] text-cyan-200/65">
                {categoryName.get(current.category) ?? current.category}
              </div>
              <motion.div
                key={current.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              >
                <h3 className="text-2xl font-semibold">{current.name}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">
                  {current.description}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <strong className="text-xl text-cyan-200">
                    {brl(current.salePrice ?? current.price)}
                  </strong>
                  {current.salePrice && (
                    <span className="text-xs text-slate-600 line-through">
                      {brl(current.price)}
                    </span>
                  )}
                </div>
                <Link
                  to="/demo/$storeSlug/produto/$productSlug"
                  params={{ storeSlug: store.slug, productSlug: current.slug }}
                  className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:text-cyan-200"
                >
                  Abrir especificações <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>

          <div
            className="relative min-h-[460px] overflow-hidden sm:min-h-[540px]"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <div className="absolute inset-x-0 bottom-10 mx-auto h-28 w-2/3 rounded-full bg-blue-500/20 blur-[70px]" />
            <div className="absolute inset-0 flex items-center justify-center [perspective:1300px]">
              {items.map((product, index) => {
                const rawOffset = index - active;
                const wrappedOffset =
                  Math.abs(rawOffset) > items.length / 2
                    ? rawOffset > 0
                      ? rawOffset - items.length
                      : rawOffset + items.length
                    : rawOffset;
                const distance = Math.abs(wrappedOffset);
                const isActive = wrappedOffset === 0;
                if (distance > 2) return null;

                return (
                  <motion.article
                    key={product.id}
                    drag={isActive && !reduceMotion ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.16}
                    onDragEnd={(_event, info: PanInfo) => {
                      if (info.offset.x > 90 || info.velocity.x > 600) selectRelative(-1);
                      if (info.offset.x < -90 || info.velocity.x < -600) selectRelative(1);
                    }}
                    onClick={() => setActive(index)}
                    initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                    animate={{
                      opacity: isActive ? 1 : 0.42,
                      x: wrappedOffset * fanStep,
                      y: distance * (capabilities.coarsePointer ? 16 : 22),
                      rotateZ: wrappedOffset * (capabilities.coarsePointer ? 5 : 7),
                      rotateY: wrappedOffset * -7,
                      scale: isActive ? 1 : 0.9,
                    }}
                    transition={{ type: "spring", stiffness: 230, damping: 27 }}
                    style={{ zIndex: 20 - distance }}
                    className={
                      "absolute w-[min(78vw,430px)] cursor-pointer overflow-hidden border bg-[#090d20] shadow-2xl " +
                      (isActive
                        ? "border-cyan-200/40 shadow-cyan-950/60"
                        : "border-white/10 saturate-50")
                    }
                  >
                    {isActive && !reduceMotion && (
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-30 border border-cyan-200/70"
                        animate={{
                          opacity: [0.35, 0.9, 0.35],
                          boxShadow: [
                            "inset 0 0 0 rgba(103,232,249,0), 0 0 0 rgba(103,232,249,0)",
                            "inset 0 0 24px rgba(103,232,249,.12), 0 0 32px rgba(103,232,249,.3)",
                            "inset 0 0 0 rgba(103,232,249,0), 0 0 0 rgba(103,232,249,0)",
                          ],
                        }}
                        transition={{
                          duration: 2.8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading={isActive ? "eager" : "lazy"}
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060814] via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 border border-white/15 bg-[#050714]/70 px-2.5 py-1.5 text-[8px] uppercase tracking-[0.3em] text-cyan-100 backdrop-blur">
                        NC specimen {String(index + 1).padStart(2, "0")}
                      </div>
                      {product.salePrice && (
                        <div className="absolute right-4 top-4 bg-cyan-300 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.24em] text-[#050714]">
                          Oferta
                        </div>
                      )}
                    </div>
                    <div className="border-t border-white/10 p-5">
                      <div className="text-[8px] uppercase tracking-[0.32em] text-violet-200/65">
                        {categoryName.get(product.category) ?? product.category}
                      </div>
                      <div className="mt-2 text-lg font-semibold">{product.name}</div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2">
              {items.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Mostrar ${product.name}`}
                  className={
                    "h-1 transition-all " +
                    (active === index ? "w-10 bg-cyan-300" : "w-4 bg-white/20 hover:bg-white/50")
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SystemsGrid({ store, products }: { store: StoreConfig; products: Product[] }) {
  const reduceMotion = useReducedMotion();
  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.38em] text-cyan-200/70">
              Curated systems
            </div>
            <h2 className="mt-3 text-4xl font-semibold uppercase tracking-[-0.04em] sm:text-5xl">
              Hardware em foco.
            </h2>
          </div>
          <Link
            to="/demo/$storeSlug/produtos"
            params={{ storeSlug: store.slug }}
            search={{ q: "", cat: "", sort: "" }}
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-100 hover:text-white"
          >
            Ver catálogo completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to="/demo/$storeSlug/produto/$productSlug"
              params={{ storeSlug: store.slug, productSlug: product.slug }}
              className="group relative bg-[#070a18] p-3 transition active:scale-[0.985]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#0a0f24]">
                <motion.div
                  className="h-full w-full"
                  whileInView={reduceMotion ? undefined : { scale: 1.035 }}
                  viewport={{ amount: 0.68 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045] group-hover:saturate-125"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a18] via-transparent to-transparent opacity-80" />
                <div className="absolute left-3 top-3 text-[8px] uppercase tracking-[0.3em] text-white/60">
                  NC/{String(index + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="px-2 pb-4 pt-5">
                <div className="text-[8px] uppercase tracking-[0.28em] text-cyan-200/60">
                  {product.category}
                </div>
                <h3 className="mt-2 min-h-12 text-base font-semibold leading-tight">
                  {product.name}
                </h3>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <strong className="text-sm text-white">
                    {brl(product.salePrice ?? product.price)}
                  </strong>
                  <ArrowRight className="h-4 w-4 -translate-x-2 text-cyan-200 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cyan-300 transition duration-500 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LabSection({ store }: { store: StoreConfig }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#080c1e]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(103,232,249,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(circle at 70% 50%, black, transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-24 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.38em] text-violet-200/70">
            <FlaskConical className="h-4 w-4" /> NovaCore Lab
          </div>
          <h2 className="mt-4 text-5xl font-semibold uppercase leading-[0.87] tracking-[-0.05em] sm:text-6xl">
            Nada entra sem provar.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-400">
            {store.messages.aboutBody} A etiqueta NovaCore é consequência de teste, comparação e uso
            real.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-3 text-[9px] uppercase tracking-[0.28em] text-cyan-100">
            <ShieldCheck className="h-4 w-4" /> Protocolo de curadoria ativo
          </div>
        </div>

        <div className="grid gap-3">
          {LAB_TESTS.map((test, index) => {
            const Icon = test.icon;
            return (
              <motion.article
                key={test.code}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group grid gap-5 border border-white/10 bg-[#060918]/80 p-5 backdrop-blur sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <div className="grid h-12 w-12 place-items-center border border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-[0.32em] text-violet-200/60">
                    {test.code}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">{test.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{test.body}</p>
                </div>
                <div className="text-2xl font-semibold text-cyan-100">{test.metric}</div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrustStrip({ store }: { store: StoreConfig }) {
  const icons = [Truck, ShieldCheck, CreditCard];
  return (
    <section className="border-b border-white/10 bg-[#050714]">
      <div className="mx-auto grid max-w-7xl gap-px bg-white/10 sm:grid-cols-3">
        {store.benefits.map((benefit, index) => {
          const Icon = icons[index] ?? Zap;
          return (
            <div key={benefit.title} className="flex gap-4 bg-[#050714] px-6 py-8">
              <Icon className="h-5 w-5 shrink-0 text-cyan-200" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.17em]">
                  {benefit.title}
                </div>
                <div className="mt-2 text-xs leading-relaxed text-slate-500">
                  {benefit.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ClosingSection({ store }: { store: StoreConfig }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_100%,rgba(34,211,238,.16),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,.16),transparent_34%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-24 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
        <div>
          <div className="text-[10px] uppercase tracking-[0.38em] text-cyan-200/70">
            Support interface
          </div>
          <h2 className="mt-4 max-w-2xl text-5xl font-semibold uppercase leading-[0.88] tracking-[-0.05em] sm:text-7xl">
            Seu próximo upgrade começa aqui.
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-slate-400">
            Compare, escolha e finalize. A NovaCore cuida da configuração, garantia e entrega.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-none bg-white px-7 text-[10px] font-bold uppercase tracking-[0.28em] text-[#050714] hover:bg-cyan-200"
            >
              <Link
                to="/demo/$storeSlug/produtos"
                params={{ storeSlug: store.slug }}
                search={{ q: "", cat: "", sort: "" }}
              >
                Acessar catálogo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <a
              href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Olá, ${store.name}! Quero ajuda para escolher meu próximo dispositivo.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center border border-white/15 px-7 text-[10px] font-semibold uppercase tracking-[0.28em] transition hover:border-cyan-300/50 hover:text-cyan-200"
            >
              Falar com especialista
            </a>
          </div>

          <div className="mt-10 grid gap-2 text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:grid-cols-2">
            {[
              "Curadoria técnica",
              "Garantia estendida",
              "Retirada express",
              "Suporte especialista",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-200" /> {item}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="border border-white/10 bg-[#070a18]/80 p-6 backdrop-blur">
            <div className="text-[9px] uppercase tracking-[0.34em] text-violet-200/65">
              Perguntas frequentes
            </div>
            <Accordion type="single" collapsible className="mt-4">
              {store.faq.map((item, index) => (
                <AccordionItem key={item.q} value={`nova-${index}`} className="border-white/10">
                  <AccordionTrigger className="text-left text-sm text-slate-200 hover:text-cyan-200">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-400">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="border border-white/10 bg-white/[0.03] p-5">
              <div className="text-[8px] uppercase tracking-[0.28em] text-slate-500">Local</div>
              <div className="mt-2 text-xs leading-relaxed text-slate-300">{store.address}</div>
            </div>
            <div className="border border-white/10 bg-white/[0.03] p-5">
              <div className="text-[8px] uppercase tracking-[0.28em] text-slate-500">Status</div>
              <div className="mt-2 inline-flex items-center gap-2 text-xs text-cyan-100">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Atendimento online
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
