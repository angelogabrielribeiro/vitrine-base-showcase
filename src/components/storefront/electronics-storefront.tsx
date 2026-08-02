import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BatteryCharging,
  Box,
  Check,
  ChevronRight,
  CircuitBoard,
  Cpu,
  CreditCard,
  FlaskConical,
  Gauge,
  Headphones,
  Laptop,
  Layers3,
  MousePointer2,
  Radio,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Watch,
  Zap,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Product, StoreConfig } from "@/types/commerce";
import { brl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { ElectronicsCircuitStory } from "@/components/storefront/electronics-circuit-story";
import { NovaCoreSpatialCore } from "@/components/storefront/novacore-spatial-core";

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

const SIGNALS = [
  "Performance verificada",
  "Garantia NovaCore",
  "Setup assistido",
  "Envio expresso",
  "Curadoria 2026",
  "Arquitetura em camadas",
];

const LAB_TESTS = [
  {
    code: "NC/01",
    title: "Carga sustentada",
    body: "CPU, GPU e térmicas medidas sob uso contínuo — não apenas em picos de benchmark.",
    icon: Gauge,
    metric: "120 min",
    signal: [22, 38, 28, 58, 46, 76, 62, 90, 72, 84],
  },
  {
    code: "NC/02",
    title: "Autonomia real",
    body: "Ciclos mistos de produtividade, mídia e standby com brilho calibrado.",
    icon: BatteryCharging,
    metric: "3 ciclos",
    signal: [78, 75, 71, 69, 64, 60, 55, 48, 42, 36],
  },
  {
    code: "NC/03",
    title: "Sinal e latência",
    body: "Wi‑Fi, Bluetooth e resposta periférica avaliados em ambientes congestionados.",
    icon: Radio,
    metric: "< 12 ms",
    signal: [34, 62, 42, 76, 48, 84, 56, 92, 66, 88],
  },
];

export function ElectronicsStorefront({ store, products, featured }: ElectronicsStorefrontProps) {
  const activeProducts = products.filter((product) => product.active);
  const showcase = (featured.length ? featured : activeProducts).slice(0, 6);
  const categoryNames = useMemo(
    () => new Map(store.categories.map((category) => [category.slug, category.name])),
    [store.categories],
  );

  return (
    <div className="overflow-x-clip bg-[#02040c] text-white selection:bg-cyan-300 selection:text-[#02040c]">
      <NovaHero store={store} product={showcase[0] ?? activeProducts[0]} />
      <SignalRail />
      <ElectronicsCircuitStory store={store} products={showcase} />
      <CategoryCommandDeck store={store} />
      <OrbitalShowroom store={store} products={showcase} categoryNames={categoryNames} />
      <SpatialSystemsGrid
        store={store}
        products={activeProducts.slice(0, 8)}
        categoryNames={categoryNames}
      />
      <LabSection store={store} />
      <TrustStrip store={store} />
      <ClosingSection store={store} />
    </div>
  );
}

function NovaHero({ store, product }: { store: StoreConfig; product?: Product }) {
  const reduceMotion = useReducedMotion();
  const { capabilities, pointerX, pointerY } = useCinematicMotion();
  const price = product ? (product.salePrice ?? product.price) : undefined;
  const slabRotateY = useTransform(pointerX, [-1, 1], [-8, 8]);
  const slabRotateX = useTransform(pointerY, [-1, 1], [6, -6]);
  const slabX = useTransform(pointerX, [-1, 1], [-14, 14]);
  const slabY = useTransform(pointerY, [-1, 1], [-10, 10]);

  return (
    <section className="relative isolate min-h-[760px] overflow-hidden border-b border-white/10 sm:min-h-[calc(100svh-4rem)]">
      <NovaCoreSpatialCore className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,12,.98)_0%,rgba(2,4,12,.92)_32%,rgba(2,4,12,.26)_64%,rgba(2,4,12,.72)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#02040c] to-transparent" />

      <div className="relative mx-auto flex min-h-[760px] max-w-[96rem] flex-col px-5 pb-8 pt-8 sm:min-h-[calc(100svh-4rem)] sm:px-8 sm:pt-10 xl:px-16">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[9px] font-bold uppercase tracking-[0.32em] text-cyan-100/70">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,.95)]" />
            Spatial interface online
          </span>
          <span className="hidden sm:block">NovaCore OS / build 26.8</span>
          <span>{capabilities.allow3D ? "3D realtime" : "adaptive mode"}</span>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-4 lg:py-6">
          <div className="relative z-20 max-w-3xl">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 border border-cyan-300/25 bg-cyan-300/[0.07] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.34em] text-cyan-100 backdrop-blur"
            >
              <CircuitBoard className="h-3.5 w-3.5" />
              {store.messages.heroKicker}
            </motion.div>

            <h1 className="mt-7 text-[clamp(3.8rem,10vw,9.8rem)] font-semibold uppercase leading-[0.76] tracking-[-0.075em]">
              {["The future", "is not flat."].map((line, index) => (
                <motion.span
                  key={line}
                  initial={reduceMotion ? false : { opacity: 0, y: 70, filter: "blur(16px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.08 + index * 0.12, duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    "block " +
                    (index === 1
                      ? "bg-gradient-to-r from-cyan-200 via-blue-400 to-violet-400 bg-clip-text text-transparent"
                      : "text-white")
                  }
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.58 }}
              className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg"
            >
              Entre em uma vitrine espacial onde cada dispositivo reage, se desmonta e revela por
              que merece fazer parte do seu próximo setup.
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.58 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button
                asChild
                size="lg"
                className="h-14 rounded-none bg-cyan-300 px-7 text-[10px] font-bold uppercase tracking-[0.28em] text-[#02040c] hover:bg-white"
              >
                <Link
                  to="/demo/$storeSlug/produtos"
                  params={{ storeSlug: store.slug }}
                  search={{ q: "", cat: "", sort: "" }}
                >
                  Entrar no catálogo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href="#showroom"
                className="inline-flex h-14 items-center gap-2 border border-white/20 bg-white/[0.04] px-7 text-[10px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
              >
                Explorar em 3D <MousePointer2 className="h-4 w-4" />
              </a>
            </motion.div>

            <div className="mt-9 grid max-w-xl grid-cols-3 gap-px border border-white/10 bg-white/10">
              {[
                ["24H", "envio expresso"],
                ["12X", "sem juros"],
                ["100%", "testado"],
              ].map(([value, label]) => (
                <div key={label} className="bg-[#030611]/78 px-4 py-4 backdrop-blur">
                  <strong className="block text-xl text-white">{value}</strong>
                  <span className="mt-1 block text-[7px] uppercase tracking-[0.24em] text-slate-500">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {product && (
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : capabilities.coarsePointer
                    ? { opacity: 0, y: 40, scale: 0.94 }
                    : { opacity: 0, x: 80, rotateY: -18, scale: 0.9 }
              }
              animate={{ opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto h-[min(62vh,680px)] min-h-[480px] w-full max-w-[760px] [perspective:1800px]"
            >
              <motion.div
                className="absolute inset-[8%_8%] [transform-style:preserve-3d]"
                style={
                  capabilities.precisePointer && !reduceMotion
                    ? { rotateY: slabRotateY, rotateX: slabRotateX, x: slabX, y: slabY }
                    : undefined
                }
              >
                <div className="absolute inset-[4%] rounded-[2.4rem] border border-cyan-200/15 bg-cyan-300/[0.025] [transform:translateZ(-120px)_rotate(5deg)]" />
                <div className="absolute inset-[8%] rounded-[2.2rem] border border-violet-200/15 [transform:translateZ(-70px)_rotate(-5deg)]" />
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-cyan-200/35 bg-[radial-gradient(circle_at_50%_42%,rgba(37,99,235,.28),transparent_56%),rgba(3,6,17,.82)] p-5 shadow-[0_70px_160px_rgba(0,0,0,.8),0_0_90px_rgba(34,211,238,.15)] backdrop-blur-xl [transform:translateZ(70px)]">
                  <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    loading="eager"
                    className="h-full w-full object-contain p-8 drop-shadow-[0_36px_50px_rgba(0,0,0,.62)]"
                    animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 0.8, 0] }}
                    transition={{ duration: 6.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-x-8 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_24px_rgba(103,232,249,.95)]"
                    animate={reduceMotion ? undefined : { top: ["12%", "88%", "12%"] }}
                    transition={{ duration: 6.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                  <div className="absolute left-5 top-5 flex items-center gap-2 border border-cyan-200/20 bg-[#02040c]/80 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.28em] text-cyan-100 backdrop-blur">
                    <ScanLine className="h-3.5 w-3.5" /> Flagship live object
                  </div>
                  <div className="absolute inset-x-5 bottom-5 grid gap-3 border border-white/10 bg-[#02040c]/76 p-4 backdrop-blur-xl sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.28em] text-violet-200/65">
                        Curadoria NovaCore
                      </p>
                      <h2 className="mt-2 text-lg font-semibold sm:text-xl">{product.name}</h2>
                    </div>
                    {price != null && (
                      <div className="sm:text-right">
                        <p className="text-[7px] uppercase tracking-[0.22em] text-slate-500">
                          A partir de
                        </p>
                        <strong className="mt-1 block text-lg text-cyan-100">{brl(price)}</strong>
                      </div>
                    )}
                  </div>
                </div>
                <FloatingBadge className="-left-4 top-[18%]" label="Thermal" value="Stable" />
                <FloatingBadge className="-right-3 top-[34%]" label="Response" value="08 ms" />
                <FloatingBadge className="bottom-[19%] -right-1" label="Protocol" value="NC verified" />
              </motion.div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[8px] font-bold uppercase tracking-[0.28em] text-slate-500">
          <span>Scroll to deconstruct</span>
          <span className="inline-flex items-center gap-2 text-cyan-100/70">
            <span className="h-px w-10 bg-cyan-200/50" /> interactive depth 01
          </span>
        </div>
      </div>
    </section>
  );
}

function FloatingBadge({
  className,
  label,
  value,
}: {
  className: string;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 4.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      className={`absolute z-20 border border-cyan-200/30 bg-[#02040c]/88 px-3 py-2 backdrop-blur-xl ${className}`}
    >
      <span className="block text-[7px] uppercase tracking-[0.25em] text-slate-500">{label}</span>
      <strong className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-cyan-100">
        {value}
      </strong>
    </motion.div>
  );
}

function SignalRail() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative z-10 overflow-hidden border-b border-white/10 bg-cyan-300 py-3 text-[#02040c]">
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 23, ease: "linear", repeat: Number.POSITIVE_INFINITY }
        }
        className="flex w-max items-center"
      >
        {[...SIGNALS, ...SIGNALS].map((signal, index) => (
          <div
            key={`${signal}-${index}`}
            className="flex items-center gap-6 px-6 text-[9px] font-bold uppercase tracking-[0.32em]"
          >
            {signal}
            <span className="h-1.5 w-1.5 rotate-45 bg-[#02040c]" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function CategoryCommandDeck({ store }: { store: StoreConfig }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = store.categories[active] ?? store.categories[0];
  const CurrentIcon = current
    ? (CATEGORY_ICONS[current.slug as keyof typeof CATEGORY_ICONS] ?? Sparkles)
    : Sparkles;

  useEffect(() => {
    if (reduceMotion || paused || store.categories.length < 2) return;
    const interval = window.setInterval(() => {
      setActive((value) => (value + 1) % store.categories.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, [paused, reduceMotion, store.categories.length]);

  if (!current) return null;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#030611]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(37,99,235,.18),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(124,58,237,.13),transparent_35%)]" />
      <div
        className="relative mx-auto grid max-w-[96rem] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-12 lg:py-28 xl:px-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.38em] text-cyan-200/70">
            Select interface
          </p>
          <h2 className="mt-4 max-w-lg text-5xl font-semibold uppercase leading-[0.84] tracking-[-0.055em] sm:text-7xl">
            Escolha uma constelação.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
            Cada categoria ocupa uma órbita própria. Navegue pelo sistema em vez de atravessar uma
            grade comum de departamentos.
          </p>

          <div className="mt-9 grid gap-2">
            {store.categories.map((category, index) => {
              const Icon = CATEGORY_ICONS[category.slug as keyof typeof CATEGORY_ICONS] ?? Sparkles;
              const isActive = index === active;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className={
                    "group grid min-h-14 grid-cols-[auto_1fr_auto] items-center gap-4 border px-4 text-left transition duration-500 " +
                    (isActive
                      ? "border-cyan-200/45 bg-cyan-200/[0.08] text-white"
                      : "border-white/8 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-white")
                  }
                >
                  <span className="text-[8px] font-bold uppercase tracking-[0.22em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
                    {category.name}
                  </span>
                  <Icon className={isActive ? "h-4 w-4 text-cyan-200" : "h-4 w-4"} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative min-h-[540px] [perspective:1700px]">
          <motion.div
            key={current.slug}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.82, rotateY: -18, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-[6%] [transform-style:preserve-3d]"
          >
            <motion.div
              aria-hidden="true"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 26, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-[7%] rounded-full border border-cyan-200/20"
            >
              {Array.from({ length: 8 }).map((_, index) => {
                const angle = index * 45;
                return (
                  <span
                    key={index}
                    className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-cyan-200/40 bg-[#030611] shadow-[0_0_14px_rgba(103,232,249,.3)]"
                    style={{ transform: `rotate(${angle}deg) translateY(-220px) rotate(${-angle + 45}deg)` }}
                  />
                );
              })}
            </motion.div>
            <div className="absolute inset-[16%] rounded-full border border-violet-200/20 bg-[radial-gradient(circle,rgba(37,99,235,.2),transparent_62%)]" />
            <motion.div
              animate={reduceMotion ? undefined : { rotateY: [0, 12, 0, -12, 0], rotateX: [0, -6, 0, 6, 0] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute inset-[25%] grid place-items-center rounded-[2rem] border border-cyan-200/40 bg-[#060b1b]/85 shadow-[0_30px_100px_rgba(0,0,0,.65),0_0_70px_rgba(34,211,238,.13)] backdrop-blur-xl [transform:translateZ(80px)]"
            >
              <CurrentIcon className="h-20 w-20 text-cyan-200 drop-shadow-[0_0_22px_rgba(103,232,249,.75)]" />
            </motion.div>

            <div className="absolute bottom-[10%] left-[7%] right-[7%] grid gap-4 border border-white/10 bg-[#02040c]/82 p-5 backdrop-blur-xl sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-violet-200/65">
                  Orbit / {String(active + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-3xl font-semibold uppercase tracking-[-0.03em]">
                  {current.name}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  Curadoria focada em desempenho, integração e longevidade para esta categoria.
                </p>
              </div>
              <Link
                to="/demo/$storeSlug/categoria/$categorySlug"
                params={{ storeSlug: store.slug, categorySlug: current.slug }}
                className="inline-flex min-h-12 items-center gap-3 bg-cyan-300 px-5 text-[9px] font-bold uppercase tracking-[0.24em] text-[#02040c] transition hover:bg-white"
              >
                Abrir órbita <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OrbitalShowroom({
  store,
  products,
  categoryNames,
}: {
  store: StoreConfig;
  products: Product[];
  categoryNames: Map<string, string>;
}) {
  const reduceMotion = useReducedMotion();
  const { capabilities, pointerX, pointerY } = useCinematicMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const items = products.slice(0, 5);
  const current = items[active];
  const objectRotateY = useTransform(pointerX, [-1, 1], [-7, 7]);
  const objectRotateX = useTransform(pointerY, [-1, 1], [5, -5]);

  useEffect(() => {
    if (reduceMotion || paused || items.length < 2) return;
    const interval = window.setInterval(() => {
      setActive((value) => (value + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(interval);
  }, [items.length, paused, reduceMotion]);

  if (!current) return null;

  return (
    <section id="showroom" className="relative overflow-hidden border-b border-white/10 bg-[#02040c]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,.18),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(124,58,237,.12),transparent_34%)]" />
      <div
        className="relative mx-auto max-w-[96rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28 xl:px-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.38em] text-cyan-200/70">
              Orbital showroom
            </p>
            <h2 className="mt-3 text-5xl font-semibold uppercase leading-[0.84] tracking-[-0.055em] sm:text-7xl">
              Produtos em gravidade zero.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            Selecione um nó para trazer o produto ao núcleo. A interface reorganiza toda a órbita em
            tempo real.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.18fr_.82fr] lg:items-center">
          <div className="relative min-h-[620px] overflow-hidden [perspective:1800px]">
            <div className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/15" />
            <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/15" />
            <motion.div
              aria-hidden="true"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 32, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-200/20"
            />

            {items.map((product, index) => {
              const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * 41;
              const y = Math.sin(angle) * 35;
              const isActive = index === active;
              return (
                <motion.button
                  key={product.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Trazer ${product.name} ao núcleo`}
                  animate={{
                    left: `${50 + x}%`,
                    top: `${50 + y}%`,
                    scale: isActive ? 0.72 : 1,
                    opacity: isActive ? 0 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 170, damping: 24 }}
                  className="absolute z-20 h-20 w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-cyan-200/30 bg-[#060b1b] p-1 shadow-[0_0_35px_rgba(34,211,238,.12)] transition hover:border-cyan-200/70"
                >
                  <img src={product.images[0]} alt="" className="h-full w-full rounded-full object-cover" />
                </motion.button>
              );
            })}

            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.72, rotateY: -20, filter: "blur(16px)" }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-[14%_18%] [transform-style:preserve-3d]"
              style={
                capabilities.precisePointer && !reduceMotion
                  ? { rotateY: objectRotateY, rotateX: objectRotateX }
                  : undefined
              }
            >
              <div className="absolute inset-[6%] rounded-[2rem] border border-violet-200/15 [transform:translateZ(-90px)_rotate(5deg)]" />
              <div className="absolute inset-0 overflow-hidden rounded-[2.2rem] border border-cyan-200/35 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,.26),transparent_58%),rgba(4,8,23,.88)] p-4 shadow-[0_50px_130px_rgba(0,0,0,.72),0_0_70px_rgba(34,211,238,.12)] backdrop-blur-xl [transform:translateZ(55px)]">
                <motion.img
                  src={current.images[0]}
                  alt={current.name}
                  draggable={false}
                  className="h-full w-full object-contain p-7 drop-shadow-[0_30px_45px_rgba(0,0,0,.55)]"
                  animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
                  transition={{ duration: 5.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
                <div className="absolute left-5 top-5 border border-cyan-200/20 bg-[#02040c]/78 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.28em] text-cyan-100 backdrop-blur">
                  Core object / {String(active + 1).padStart(2, "0")}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            key={`${current.id}-copy`}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="border-l border-cyan-200/35 pl-6 sm:pl-8"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-violet-200/65">
              {categoryNames.get(current.category) ?? current.category}
            </p>
            <h3 className="mt-3 text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] sm:text-5xl">
              {current.name}
            </h3>
            <p className="mt-5 text-sm leading-7 text-slate-400">{current.description}</p>

            <div className="mt-7 grid grid-cols-2 gap-px border border-white/10 bg-white/10">
              <div className="bg-[#030611] p-4">
                <p className="text-[7px] uppercase tracking-[0.24em] text-slate-500">Preço</p>
                <strong className="mt-2 block text-xl text-cyan-100">
                  {brl(current.salePrice ?? current.price)}
                </strong>
              </div>
              <div className="bg-[#030611] p-4">
                <p className="text-[7px] uppercase tracking-[0.24em] text-slate-500">Status</p>
                <strong className="mt-2 block text-sm text-white">
                  {current.stock > 0 ? `${current.stock} unidades` : "Sob consulta"}
                </strong>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/demo/$storeSlug/produto/$productSlug"
                params={{ storeSlug: store.slug, productSlug: current.slug }}
                className="inline-flex min-h-13 items-center gap-3 bg-cyan-300 px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-[#02040c] transition hover:bg-white"
              >
                Ver produto <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/demo/$storeSlug/produtos"
                params={{ storeSlug: store.slug }}
                search={{ q: "", cat: current.category, sort: "" }}
                className="inline-flex min-h-13 items-center gap-3 border border-white/15 px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-white transition hover:border-cyan-200/50 hover:text-cyan-100"
              >
                Comparar categoria
              </Link>
            </div>

            <div className="mt-8 flex gap-2">
              {items.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Mostrar ${product.name}`}
                  className={
                    "h-1.5 transition-all " +
                    (index === active ? "w-12 bg-cyan-300" : "w-5 bg-white/15 hover:bg-white/40")
                  }
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SpatialSystemsGrid({
  store,
  products,
  categoryNames,
}: {
  store: StoreConfig;
  products: Product[];
  categoryNames: Map<string, string>;
}) {
  return (
    <section className="relative border-b border-white/10 bg-[#030611]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(103,232,249,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,.035)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="relative mx-auto max-w-[96rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28 xl:px-16">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.38em] text-cyan-200/70">
              Spatial inventory
            </p>
            <h2 className="mt-3 text-5xl font-semibold uppercase leading-[0.84] tracking-[-0.055em] sm:text-7xl">
              Hardware que responde.
            </h2>
          </div>
          <Link
            to="/demo/$storeSlug/produtos"
            params={{ storeSlug: store.slug }}
            search={{ q: "", cat: "", sort: "" }}
            className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-cyan-100 transition hover:text-white"
          >
            Ver catálogo completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <SpatialProductCard
              key={product.id}
              store={store}
              product={product}
              index={index}
              categoryName={categoryNames.get(product.category) ?? product.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpatialProductCard({
  store,
  product,
  index,
  categoryName,
}: {
  store: StoreConfig;
  product: Product;
  index: number;
  categoryName: string;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-1, 1], [-9, 9]), {
    stiffness: 180,
    damping: 24,
  });
  const rotateX = useSpring(useTransform(y, [-1, 1], [8, -8]), {
    stiffness: 180,
    damping: 24,
  });
  const shineX = useTransform(x, [-1, 1], ["12%", "88%"]);
  const shineY = useTransform(y, [-1, 1], ["12%", "88%"]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1);
    y.set(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      style={reduceMotion ? undefined : { rotateY, rotateX, transformStyle: "preserve-3d" }}
      initial={reduceMotion ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay: (index % 4) * 0.06, duration: 0.55 }}
      className="group relative min-h-[480px] overflow-hidden border border-white/10 bg-[#060a18] shadow-[0_28px_80px_rgba(0,0,0,.32)] transition-colors duration-500 hover:border-cyan-200/35"
    >
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 border border-cyan-200/65"
          animate={{
            clipPath: [
              "inset(0 100% 99% 0)",
              "inset(0 0 99% 0)",
              "inset(0 0 0 99%)",
              "inset(99% 0 0 0)",
              "inset(0 99% 0 0)",
              "inset(0 100% 99% 0)",
            ],
          }}
          transition={{ duration: 5.4 + (index % 3), repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      )}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-20 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ left: shineX, top: shineY }}
      />

      <Link
        to="/demo/$storeSlug/produto/$productSlug"
        params={{ storeSlug: store.slug, productSlug: product.slug }}
        className="relative flex h-full min-h-[480px] flex-col"
      >
        <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,.2),transparent_58%),#040817] [transform:translateZ(36px)]">
          <motion.img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-7 drop-shadow-[0_24px_34px_rgba(0,0,0,.55)]"
            whileHover={reduceMotion ? undefined : { scale: 1.06, y: -7 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute left-4 top-4 text-[8px] font-bold uppercase tracking-[0.3em] text-white/60">
            NC/{String(index + 1).padStart(2, "0")}
          </div>
          {product.salePrice && (
            <div className="absolute right-4 top-4 bg-cyan-300 px-2.5 py-1.5 text-[7px] font-bold uppercase tracking-[0.24em] text-[#02040c]">
              Oferta
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#060a18] to-transparent" />
        </div>

        <div className="relative flex flex-1 flex-col p-5 [transform:translateZ(24px)]">
          <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-cyan-200/60">
            {categoryName}
          </p>
          <h3 className="mt-2 text-lg font-semibold leading-tight">{product.name}</h3>
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500 transition-colors group-hover:text-slate-300">
            {product.description}
          </p>
          <div className="mt-auto pt-5">
            <div className="flex items-end justify-between gap-3 border-t border-white/10 pt-4">
              <div>
                <p className="text-[7px] uppercase tracking-[0.22em] text-slate-600">A partir de</p>
                <strong className="mt-1 block text-base text-white">
                  {brl(product.salePrice ?? product.price)}
                </strong>
              </div>
              <span className="grid h-10 w-10 place-items-center border border-white/10 text-cyan-200 transition duration-500 group-hover:border-cyan-200/40 group-hover:bg-cyan-200 group-hover:text-[#02040c]">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function LabSection({ store }: { store: StoreConfig }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = LAB_TESTS[active] ?? LAB_TESTS[0];
  const CurrentIcon = current.icon;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#050918]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_48%,rgba(37,99,235,.2),transparent_34%),linear-gradient(rgba(103,232,249,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,.045)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
      <div className="relative mx-auto grid max-w-[96rem] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[.78fr_1.22fr] lg:px-12 lg:py-28 xl:px-16">
        <div>
          <div className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.38em] text-violet-200/70">
            <FlaskConical className="h-4 w-4" /> NovaCore Lab
          </div>
          <h2 className="mt-4 text-5xl font-semibold uppercase leading-[0.84] tracking-[-0.055em] sm:text-7xl">
            Nada entra sem provar.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
            {store.messages.aboutBody} Aqui, o teste deixa de ser rodapé e vira parte da experiência.
          </p>

          <div className="mt-9 grid gap-2">
            {LAB_TESTS.map((test, index) => {
              const Icon = test.icon;
              const isActive = index === active;
              return (
                <button
                  key={test.code}
                  type="button"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  className={
                    "grid grid-cols-[auto_1fr_auto] items-center gap-4 border p-4 text-left transition duration-500 " +
                    (isActive
                      ? "border-cyan-200/40 bg-cyan-200/[0.07]"
                      : "border-white/8 bg-[#030611]/50 hover:border-white/20")
                  }
                >
                  <span className="grid h-10 w-10 place-items-center border border-cyan-200/20 bg-cyan-200/[0.05] text-cyan-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[7px] font-bold uppercase tracking-[0.28em] text-violet-200/60">
                      {test.code}
                    </span>
                    <span className="mt-1 block text-sm font-semibold">{test.title}</span>
                  </span>
                  <ChevronRight className={isActive ? "h-4 w-4 text-cyan-200" : "h-4 w-4 text-slate-700"} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative min-h-[560px] [perspective:1700px]">
          <motion.div
            key={current.code}
            initial={reduceMotion ? false : { opacity: 0, rotateY: -14, x: 30, scale: 0.94 }}
            animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-[5%] [transform-style:preserve-3d]"
          >
            <div className="absolute inset-[4%] border border-violet-200/12 [transform:translateZ(-90px)_rotate(4deg)]" />
            <div className="absolute inset-0 overflow-hidden border border-cyan-200/30 bg-[#030611]/88 p-6 shadow-[0_45px_130px_rgba(0,0,0,.72),0_0_80px_rgba(34,211,238,.1)] backdrop-blur-xl [transform:translateZ(45px)] sm:p-8">
              <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-6">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-cyan-200/65">
                    Live diagnostic / {current.code}
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold uppercase tracking-[-0.03em]">
                    {current.title}
                  </h3>
                </div>
                <div className="grid h-14 w-14 place-items-center border border-cyan-200/20 bg-cyan-200/[0.06] text-cyan-200">
                  <CurrentIcon className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="max-w-xl text-sm leading-7 text-slate-400">{current.body}</p>
                  <div className="mt-7 grid grid-cols-3 gap-px border border-white/10 bg-white/10">
                    {[
                      ["Status", "Aprovado"],
                      ["Duração", current.metric],
                      ["Ambiente", "Controlado"],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-[#050918] p-4">
                        <span className="text-[7px] uppercase tracking-[0.22em] text-slate-600">
                          {label}
                        </span>
                        <strong className="mt-2 block text-sm text-white">{value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <strong className="text-5xl font-semibold text-cyan-100 sm:text-7xl">
                  {current.metric}
                </strong>
              </div>

              <div className="relative mt-10 h-44 overflow-hidden border border-white/10 bg-[#02040c] p-5">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(103,232,249,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,.07)_1px,transparent_1px)] bg-[size:28px_28px]" />
                <svg viewBox="0 0 900 180" className="relative h-full w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`lab-signal-${active}`} x1="0" x2="1">
                      <stop offset="0" stopColor="#67e8f9" stopOpacity=".15" />
                      <stop offset=".5" stopColor="#67e8f9" stopOpacity="1" />
                      <stop offset="1" stopColor="#a78bfa" stopOpacity=".35" />
                    </linearGradient>
                  </defs>
                  <motion.polyline
                    key={current.code}
                    fill="none"
                    stroke={`url(#lab-signal-${active})`}
                    strokeWidth="4"
                    vectorEffect="non-scaling-stroke"
                    points={current.signal
                      .map((value, index) => `${index * 100},${170 - value * 1.55}`)
                      .join(" ")}
                    initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <motion.div
                  aria-hidden="true"
                  animate={reduceMotion ? undefined : { x: ["-10%", "110%"] }}
                  transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute inset-y-0 w-px bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,.9)]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip({ store }: { store: StoreConfig }) {
  const icons = [Truck, ShieldCheck, CreditCard];
  return (
    <section className="border-b border-white/10 bg-[#02040c]">
      <div className="mx-auto grid max-w-[96rem] gap-px bg-white/10 sm:grid-cols-3">
        {store.benefits.map((benefit, index) => {
          const Icon = icons[index] ?? Zap;
          return (
            <motion.div
              key={benefit.title}
              whileHover={{ y: -4 }}
              className="group relative flex gap-4 overflow-hidden bg-[#02040c] px-6 py-8"
            >
              <motion.span
                aria-hidden="true"
                animate={{ x: ["-110%", "110%"] }}
                transition={{ duration: 5 + index, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-200/[0.06] to-transparent"
              />
              <Icon className="relative h-5 w-5 shrink-0 text-cyan-200" />
              <div className="relative">
                <div className="text-xs font-semibold uppercase tracking-[0.17em]">
                  {benefit.title}
                </div>
                <div className="mt-2 text-xs leading-relaxed text-slate-500 transition-colors group-hover:text-slate-300">
                  {benefit.description}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function ClosingSection({ store }: { store: StoreConfig }) {
  return (
    <section className="relative min-h-[760px] overflow-hidden">
      <NovaCoreSpatialCore className="absolute inset-0 opacity-75" activeIndex={2} compact />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,12,.98),rgba(2,4,12,.78)_48%,rgba(2,4,12,.38))]" />
      <div className="relative mx-auto grid min-h-[760px] max-w-[96rem] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.03fr_.97fr] lg:px-12 xl:px-16">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.38em] text-cyan-200/70">
            Final transmission
          </p>
          <h2 className="mt-4 max-w-3xl text-6xl font-semibold uppercase leading-[0.78] tracking-[-0.065em] sm:text-8xl">
            Seu próximo upgrade já está em órbita.
          </h2>
          <p className="mt-7 max-w-lg text-sm leading-7 text-slate-400">
            Compare, escolha e finalize. A NovaCore cuida da configuração, garantia e entrega sem
            quebrar a experiência.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-none bg-white px-7 text-[9px] font-bold uppercase tracking-[0.28em] text-[#02040c] hover:bg-cyan-200"
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
              className="inline-flex h-14 items-center border border-white/15 bg-[#02040c]/45 px-7 text-[9px] font-semibold uppercase tracking-[0.28em] backdrop-blur transition hover:border-cyan-300/50 hover:text-cyan-200"
            >
              Falar com especialista
            </a>
          </div>

          <div className="mt-10 grid gap-2 text-[9px] uppercase tracking-[0.22em] text-slate-500 sm:grid-cols-2">
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

        <div className="[perspective:1500px]">
          <motion.div
            initial={{ opacity: 0, rotateY: 12, x: 35 }}
            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="border border-white/10 bg-[#050918]/82 p-6 shadow-[0_38px_120px_rgba(0,0,0,.7)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="text-[8px] font-bold uppercase tracking-[0.34em] text-violet-200/65">
                Support knowledge base
              </div>
              <Layers3 className="h-4 w-4 text-cyan-200" />
            </div>
            <Accordion type="single" collapsible className="mt-3">
              {store.faq.map((item, index) => (
                <AccordionItem key={item.q} value={`nova-${index}`} className="border-white/10">
                  <AccordionTrigger className="text-left text-sm text-slate-200 hover:text-cyan-200">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-7 text-slate-400">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="border border-white/10 bg-[#02040c]/62 p-5 backdrop-blur">
              <div className="text-[7px] uppercase tracking-[0.28em] text-slate-500">Local</div>
              <div className="mt-2 text-xs leading-relaxed text-slate-300">{store.address}</div>
            </div>
            <div className="border border-white/10 bg-[#02040c]/62 p-5 backdrop-blur">
              <div className="text-[7px] uppercase tracking-[0.28em] text-slate-500">Status</div>
              <div className="mt-2 inline-flex items-center gap-2 text-xs text-cyan-100">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.85)]" />
                Atendimento online
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
