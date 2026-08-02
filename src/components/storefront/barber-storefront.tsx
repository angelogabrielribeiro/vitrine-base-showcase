import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Gift,
  Truck,
  RefreshCcw,
  X,
} from "lucide-react";
import type { StoreConfig, Product, Service, Professional } from "@/types/commerce";
import { BarberHero } from "@/components/storefront/hero/barber-hero";
import { SectionReveal, Stagger, StaggerItem, MOTION } from "@/components/motion/primitives";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { brl } from "@/lib/format";
import { SafeImage } from "@/components/storefront/safe-image";
import { ProductCard } from "@/components/storefront/product-card";
import { barberServiceFallback, BARBER_PROFESSIONAL_FALLBACK } from "@/lib/barber-media";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { NicheScrollOdyssey } from "@/components/storefront/niche-scroll-odyssey";
import { StoreInstitutional } from "@/components/storefront/store-institutional";
import { useInView, sequenceDelay } from "@/hooks/use-in-view";
import { useAdaptiveQuality } from "@/hooks/use-adaptive-quality";

const ICONS: Record<string, typeof Sparkles> = {
  truck: Truck,
  refresh: RefreshCcw,
  sparkles: Sparkles,
  gift: Gift,
};

interface Props {
  store: StoreConfig;
  services: Service[];
  professionals: Professional[];
  products: Product[];
}

/**
 * BarberStorefront — home cinematográfica dedicada à Barber Noir.
 * Substitui o template genérico após o hero. Densidade controlada,
 * sem seções gigantes, respeitando prefers-reduced-motion e teclado.
 */
export function BarberStorefront({ store, services, professionals, products }: Props) {
  return (
    <div className="bg-neutral-950 text-neutral-100">
      <BarberHero store={store} spotlight={null} featured={[]} />
      <NicheScrollOdyssey
        niche="barber"
        eyebrow="O corte acontece em camadas"
        title="Você conduz o ritual."
        scenes={services.slice(0, 3).map((service, index) => ({
          number: String(index + 1).padStart(2, "0"),
          kicker: service.name,
          title:
            index === 0
              ? "Precisão antes do primeiro fio cair."
              : index === 1
                ? "A forma aparece enquanto você avança."
                : "O acabamento muda a presença.",
          copy: service.description,
          image: service.image ?? barberServiceFallback(service.slug),
          metric: `${service.durationMinutes} minutos · ${brl(service.price)}`,
        }))}
      />

      <TrustStrip store={store} />
      <ServicesEditorial services={services} storeSlug={store.slug} />
      <RitualSteps />
      <ProfessionalsStack professionals={professionals} />
      <ResultsEditorial services={services} />
      <GroomingGrid products={products} storeSlug={store.slug} />
      <ClosingBlock store={store} />
      <div className="pb-28 md:pb-0">
        <StoreInstitutional store={store} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Trust strip                                                                 */
/* -------------------------------------------------------------------------- */
function TrustStrip({ store }: { store: StoreConfig }) {
  return (
    <section className="border-y border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-6 sm:grid-cols-3">
        {store.benefits.map((b, i) => {
          const Icon = ICONS[b.icon] ?? Sparkles;
          return (
            <SectionReveal key={b.title} delay={i * 0.05} y={12}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-amber-300/30 bg-amber-300/5 text-amber-200">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-amber-200/80">
                    {b.title}
                  </div>
                  <div className="mt-1 text-sm text-neutral-300">{b.description}</div>
                </div>
              </div>
            </SectionReveal>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Carta de serviços — 6 linhas editoriais com reveal por hover/foco           */
/* -------------------------------------------------------------------------- */
function ServicesEditorial({ services, storeSlug }: { services: Service[]; storeSlug: string }) {
  const items = services.slice(0, 6);
  const [activeIdx, setActiveIdx] = useState(0);
  const reduce = useReducedMotion();
  const { isMobile } = useAdaptiveQuality();
  const active = items[activeIdx];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-16">
      <div className="mb-10 flex items-end justify-between gap-6 sm:mb-8">
        <div className="max-w-[22ch] sm:max-w-none">
          <div className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">
            Carta de serviços
          </div>
          <h2 className="mt-2 text-balance font-display text-[clamp(1.75rem,7vw,2.5rem)] uppercase leading-tight tracking-tight text-white sm:text-4xl">
            O que se pratica aqui
          </h2>
        </div>
        <Button
          asChild
          variant="outline"
          className="hidden rounded-none border-neutral-700 bg-transparent text-xs uppercase tracking-[0.3em] text-neutral-300 hover:bg-neutral-900 hover:text-amber-200 sm:inline-flex"
        >
          <Link to="/demo/$storeSlug/agendar" params={{ storeSlug }}>
            Agendar horário
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(300px,420px)] lg:items-start">
        <ul className="divide-y divide-neutral-800/80 border-y border-neutral-800/80">
          {items.map((s, i) => (
            <ServiceRow
              key={s.id}
              service={s}
              index={i}
              storeSlug={storeSlug}
              onActivate={() => setActiveIdx(i)}
              isActive={i === activeIdx}
              autoActivate={isMobile}
            />
          ))}
        </ul>

        {active && (
          <aside className="sticky top-24 hidden h-[460px] w-full overflow-hidden border border-neutral-800 bg-neutral-900/40 lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: MOTION.ease }}
                className="relative flex h-full flex-col"
              >
                <div className="relative h-3/5 w-full overflow-hidden bg-neutral-900">
                  <SafeImage
                    src={active.image}
                    fallbackSrc={barberServiceFallback(active.slug)}
                    alt={active.name}
                    fallbackLabel={active.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  <div className="absolute left-4 top-4 font-mono text-xs text-amber-200/80">
                    {String(activeIdx + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-tight text-white">
                      {active.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-neutral-400">
                      {active.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-neutral-400">
                      <Clock className="h-3.5 w-3.5" /> {active.durationMinutes} min
                    </span>
                    <span className="font-display text-2xl text-amber-200">
                      {brl(active.price)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </aside>
        )}
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  index,
  storeSlug,
  onActivate,
  isActive,
  autoActivate,
}: {
  service: Service;
  index: number;
  storeSlug: string;
  onActivate?: () => void;
  isActive?: boolean;
  autoActivate?: boolean;
}) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView<HTMLLIElement>({ amount: 0.6 });
  const image = service.image;

  // Mobile: acende sozinho ao entrar na viewport, em sequência com o scroll.
  // Desktop: reage a hover/foco, sem cursor simulado.
  const active = autoActivate ? inView : hovered;

  useEffect(() => {
    if (autoActivate && inView) onActivate?.();
  }, [autoActivate, inView, onActivate]);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (autoActivate) return;
        setHovered(true);
        onActivate?.();
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        setHovered(true);
        onActivate?.();
      }}
      onBlur={() => setHovered(false)}
      className="group relative"
      data-active={isActive || undefined}
    >
      <Link
        to="/demo/$storeSlug/agendar"
        params={{ storeSlug }}
        style={{ transitionDelay: autoActivate ? `${sequenceDelay(index, 0.06)}s` : undefined }}
        className="relative flex items-center gap-6 overflow-hidden px-2 py-7 outline-none transition-colors duration-300 focus-visible:bg-neutral-900/40 sm:px-4 sm:py-7 lg:py-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 overflow-hidden lg:hidden"
        >
          <motion.div
            initial={false}
            animate={
              reduce
                ? { opacity: active ? 0.4 : 0 }
                : { opacity: active ? 1 : 0, x: active ? 0 : "-4%" }
            }
            transition={{ duration: 0.45, ease: MOTION.ease }}
            className="absolute inset-0"
          >
            {image ? (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${image})` }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
          </motion.div>
        </div>

        <span className="relative z-10 w-10 shrink-0 font-mono text-xs text-amber-200/70">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0 flex-1">
            <motion.h3
              className="font-display text-2xl uppercase tracking-tight text-white sm:text-3xl"
              animate={reduce ? undefined : { x: active ? 6 : 0 }}
              transition={{ duration: 0.45, ease: MOTION.ease }}
            >
              {service.name}
            </motion.h3>
            <p className="mt-1 line-clamp-1 text-sm text-neutral-400">{service.description}</p>
          </div>

          <div className="flex items-center gap-6 text-sm text-neutral-300">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-neutral-400">
              <Clock className="h-3.5 w-3.5" /> {service.durationMinutes} min
            </span>
            <span className="font-display text-xl text-amber-200 sm:text-2xl">
              {brl(service.price)}
            </span>
          </div>
        </div>

        <motion.span
          aria-hidden
          className="relative z-10 hidden shrink-0 items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-200 sm:inline-flex"
          animate={reduce ? undefined : { x: active ? 4 : 0, opacity: active ? 1 : 0.6 }}
          transition={{ duration: 0.45, ease: MOTION.ease }}
        >
          Agendar <ChevronRight className="h-4 w-4" />
        </motion.span>
      </Link>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Ritual — 3 etapas compactas                                                 */
/* -------------------------------------------------------------------------- */
const RITUAL = [
  {
    kicker: "01 · Consulta",
    title: "Leitura do rosto",
    body: "Avaliamos estrutura, densidade e estilo antes de qualquer navalha tocar a pele.",
  },
  {
    kicker: "02 · Execução",
    title: "Corte na mão certa",
    body: "Tesoura, máquina e navalha em coreografia. Tempo protegido, sem pressa.",
  },
  {
    kicker: "03 · Finalização",
    title: "Toalha quente & finish",
    body: "Toalha quente, óleo pós-barba e um espresso para selar o ritual.",
  },
];

function RitualSteps() {
  return (
    <section className="border-y border-neutral-800/80 bg-neutral-900/40">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8">
          <div className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">O ritual</div>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">
            Três atos, uma cadeira
          </h2>
        </div>
        <Stagger className="grid gap-4 sm:grid-cols-3" step={0.08}>
          {RITUAL.map((r) => (
            <StaggerItem key={r.kicker}>
              <div className="relative h-full overflow-hidden border border-neutral-800 bg-neutral-950/60 p-6 transition hover:border-amber-300/40">
                <div className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">
                  {r.kicker}
                </div>
                <h3 className="mt-3 font-display text-2xl uppercase tracking-tight text-white">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{r.body}</p>
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-300/10 blur-2xl"
                />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Profissionais — CardStack controlado                                        */
/* -------------------------------------------------------------------------- */
function ProfessionalsStack({ professionals }: { professionals: Professional[] }) {
  const list = professionals.filter((p) => p.active).slice(0, 3);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<Professional | null>(null);
  const reduce = useReducedMotion();
  const { capabilities } = useCinematicMotion();

  const activePro = list[active];
  const firstName = activePro?.name.split(" ")[0] ?? "";
  const stackStep = capabilities.coarsePointer ? 34 : 54;

  const cycle = (direction: -1 | 1) => {
    setActive((current) => (current + direction + list.length) % list.length);
  };

  useEffect(() => {
    if (reduce || expanded || list.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % list.length);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [expanded, list.length, reduce]);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expanded]);

  if (list.length === 0) return null;

  return (
    <>
      <section className="mx-auto max-w-6xl overflow-hidden px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(320px,380px)] lg:items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">Time</div>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">
              Mãos que assinam a casa
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
              Arraste os cards, conheça cada profissional e escolha quem executa o seu horário.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-2 border-b border-amber-300/35 pb-2 text-[9px] font-bold uppercase tracking-[0.28em] text-amber-200/70">
                {String(list.length).padStart(2, "0")} profissionais ativos
              </span>
              {list.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-pressed={active === i}
                  className={
                    "border px-4 py-2 text-[11px] uppercase tracking-[0.3em] transition active:scale-95 " +
                    (active === i
                      ? "border-amber-300 bg-amber-300 text-neutral-950"
                      : "border-neutral-700 text-neutral-300 hover:border-amber-300/60 hover:text-amber-200")
                  }
                >
                  {p.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {activePro && (
              <div className="mt-8">
                <Button
                  asChild
                  className="rounded-none bg-amber-300 px-6 py-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-950 hover:bg-amber-200"
                >
                  <Link to="/demo/$storeSlug/agendar" params={{ storeSlug: "barbearia" }}>
                    <CalendarDays className="mr-2 h-4 w-4" /> Agendar com {firstName}
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="relative mx-auto h-[440px] w-[calc(100%_-_2.5rem)] max-w-[430px] pr-14 sm:h-[450px] sm:w-full">
            {list.map((p, i) => {
              const slot = (i - active + list.length) % list.length;
              const isActive = slot === 0;
              return (
                <motion.article
                  key={p.id}
                  layoutId={`barber-professional-${p.id}`}
                  drag={isActive && !reduce ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.16}
                  onDragEnd={(_event, info: PanInfo) => {
                    if (info.offset.x > 50 || info.velocity.x > 450) cycle(-1);
                    if (info.offset.x < -50 || info.velocity.x < -450) cycle(1);
                  }}
                  onClick={() => {
                    if (!isActive) setActive(i);
                  }}
                  initial={false}
                  animate={
                    reduce
                      ? { opacity: isActive ? 1 : 0.3 }
                      : {
                          x: slot * stackStep,
                          y: slot * 18,
                          rotate: slot * 2.8,
                          scale: 1 - slot * 0.055,
                          opacity: 1 - slot * 0.18,
                          filter: isActive ? "none" : "brightness(0.72)",
                        }
                  }
                  transition={{ duration: 0.5, ease: MOTION.ease }}
                  whileTap={reduce ? undefined : { scale: isActive ? 0.985 : 0.91 }}
                  style={{
                    zIndex: 30 - slot,
                    touchAction: "pan-y",
                  }}
                  className="absolute inset-0 w-full cursor-grab overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/40 active:cursor-grabbing"
                >
                  <div className="h-[64%] w-full overflow-hidden">
                    <motion.div
                      className="h-full w-full"
                      animate={
                        isActive && !reduce
                          ? {
                              scale: [1, 1.035, 1],
                              filter: ["grayscale(.15)", "grayscale(0)", "grayscale(.15)"],
                            }
                          : undefined
                      }
                      transition={{
                        duration: 6.8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <SafeImage
                        src={p.avatar}
                        fallbackSrc={BARBER_PROFESSIONAL_FALLBACK}
                        alt={p.name}
                        fallbackLabel={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  </div>
                  <div className="flex h-[36%] flex-col justify-center gap-1 border-t border-neutral-800 px-5">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-amber-200/80">
                      {p.role}
                    </div>
                    <div className="font-display text-xl uppercase tracking-tight text-white">
                      {p.name}
                    </div>
                    {p.bio && <p className="line-clamp-1 text-xs text-neutral-400">{p.bio}</p>}
                    {isActive && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setExpanded(p);
                        }}
                        className="mt-2 self-start border-b border-amber-300/45 pb-1 text-[9px] uppercase tracking-[0.28em] text-amber-200"
                      >
                        Abrir perfil
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {expanded && (
          <div className="fixed inset-0 z-[100] grid place-items-center p-4">
            <motion.button
              type="button"
              aria-label="Fechar perfil"
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(null)}
            />
            <motion.div
              layoutId={`barber-professional-${expanded.id}`}
              role="dialog"
              aria-modal="true"
              aria-label={`Perfil de ${expanded.name}`}
              className="relative z-10 flex max-h-[86svh] w-full max-w-3xl flex-col overflow-hidden border border-amber-300/25 bg-neutral-950 shadow-[0_34px_120px_-35px_rgba(251,191,36,.42)] md:flex-row"
            >
              <button
                type="button"
                onClick={() => setExpanded(null)}
                className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur"
                aria-label="Fechar perfil"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="h-64 w-full shrink-0 overflow-hidden md:h-auto md:w-1/2">
                <SafeImage
                  src={expanded.avatar}
                  fallbackSrc={BARBER_PROFESSIONAL_FALLBACK}
                  alt={expanded.name}
                  fallbackLabel={expanded.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="overflow-y-auto p-6 sm:p-8 md:w-1/2">
                <div className="text-[10px] uppercase tracking-[0.32em] text-amber-200/75">
                  {expanded.role}
                </div>
                <h3 className="mt-3 font-display text-4xl uppercase text-white">{expanded.name}</h3>
                <p className="mt-5 text-sm leading-7 text-neutral-300">
                  {expanded.bio ??
                    "Especialista da Barber Noir, com atendimento personalizado e domínio dos rituais da casa."}
                </p>
                <Button
                  asChild
                  className="mt-7 rounded-none bg-amber-300 px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-950"
                >
                  <Link to="/demo/$storeSlug/agendar" params={{ storeSlug: "barbearia" }}>
                    <CalendarDays className="mr-2 h-4 w-4" /> Agendar com{" "}
                    {expanded.name.split(" ")[0]}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Resultados — editorial com imagens de serviços já existentes                */
/* -------------------------------------------------------------------------- */
function ResultsEditorial({ services }: { services: Service[] }) {
  const shots = services.filter((s) => s.image).slice(0, 4);
  if (shots.length < 2) return null;

  return (
    <section className="border-y border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">
              Atmosfera
            </div>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">
              Atmosfera Barber Noir
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-neutral-400 sm:block">
            Um recorte visual dos serviços e da atmosfera Barber Noir.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shots.map((s, i) => (
            <SectionReveal key={s.id} delay={i * 0.06} y={12}>
              <figure className="group relative overflow-hidden border border-neutral-800">
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <SafeImage
                    src={s.image}
                    fallbackSrc={barberServiceFallback(s.slug)}
                    alt={s.name}
                    fallbackLabel={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition duration-[550ms] ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-transparent px-3 py-3 text-[10px] uppercase tracking-[0.25em] text-neutral-200">
                  <span>{s.name}</span>
                  <span className="text-amber-200/80">{s.durationMinutes}m</span>
                </figcaption>
              </figure>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Grooming — até 4 produtos                                                   */
/* -------------------------------------------------------------------------- */
function GroomingGrid({ products, storeSlug }: { products: Product[]; storeSlug: string }) {
  const list = products.filter((p) => p.active).slice(0, 4);
  if (list.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">
            Grooming da casa
          </div>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">
            Leve o ritual para casa
          </h2>
        </div>
        <Link
          to="/demo/$storeSlug/produtos"
          params={{ storeSlug }}
          search={{ q: "", cat: "", sort: "" }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-200 hover:text-amber-100"
        >
          Ver linha completa <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} storeSlug={storeSlug} />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Fechamento — história + horários + FAQ + CTA                                */
/* -------------------------------------------------------------------------- */
function ClosingBlock({ store }: { store: StoreConfig }) {
  return (
    <section className="border-t border-neutral-800/80 bg-neutral-900/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">A casa</div>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">
              {store.messages.aboutTitle}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-300">
              {store.messages.aboutBody}
            </p>

            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="border border-neutral-800 p-4">
                <dt className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-amber-200/80">
                  <MapPin className="h-3.5 w-3.5" /> Endereço
                </dt>
                <dd className="mt-2 text-sm text-neutral-200">{store.address}</dd>
              </div>
              <div className="border border-neutral-800 p-4">
                <dt className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-amber-200/80">
                  <Clock className="h-3.5 w-3.5" /> Horários
                </dt>
                <dd className="mt-2 space-y-1 text-sm text-neutral-200">
                  {store.hours.map((h) => (
                    <div key={h.label} className="flex justify-between gap-4">
                      <span className="text-neutral-400">{h.label}</span>
                      <span>{h.value}</span>
                    </div>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="rounded-none bg-amber-300 px-8 py-6 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-950 hover:bg-amber-200"
              >
                <Link to="/demo/$storeSlug/agendar" params={{ storeSlug: store.slug }}>
                  <CalendarDays className="mr-2 h-4 w-4" /> Reservar cadeira
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">
              Dúvidas frequentes
            </div>
            <h3 className="mt-2 font-display text-2xl uppercase tracking-tight text-white">
              Antes de sentar na cadeira
            </h3>
            <Accordion type="single" collapsible className="mt-4">
              {store.faq.map((f, i) => (
                <AccordionItem key={i} value={`bf${i}`} className="border-neutral-800">
                  <AccordionTrigger className="text-left text-sm text-neutral-200 hover:text-amber-200">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-400">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile sticky CTA — discreto, aparece após scroll                           */
/* -------------------------------------------------------------------------- */
// (MobileStickyCTA removido — dock unificado agora vive no LiquidMobileMenu quando niche === "barber")
