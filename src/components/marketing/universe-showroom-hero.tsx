import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { useAdaptiveQuality } from "@/hooks/use-adaptive-quality";
import { UNIVERSES, universeHref, type Universe } from "@/components/marketing/universe-data";

type UniverseShowroomHeroProps = {
  proposalUrl: string;
  demoNotice: string;
  onActiveChange?: (universe: Universe) => void;
};

function relativeIndex(index: number, activeIndex: number) {
  let value = index - activeIndex;
  const half = UNIVERSES.length / 2;
  if (value > half) value -= UNIVERSES.length;
  if (value < -half) value += UNIVERSES.length;
  return value;
}

export function UniverseShowroomHero({
  proposalUrl,
  demoNotice,
  onActiveChange,
}: UniverseShowroomHeroProps) {
  const { capabilities } = useCinematicMotion();
  const { tier } = useAdaptiveQuality();
  const lightweightMobile = capabilities.hydrated && capabilities.coarsePointer;
  const motionDisabled =
    capabilities.hydrated && (capabilities.reducedMotion || lightweightMobile);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const idleUntilRef = useRef(0);
  const active = UNIVERSES[activeIndex];

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  useEffect(() => {
    if (!isDesktop || motionDisabled || tier === "off") return;
    const interval = window.setInterval(() => {
      if (document.hidden || performance.now() < idleUntilRef.current) return;
      setActiveIndex((current) => (current + 1) % UNIVERSES.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, [isDesktop, motionDisabled, tier]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || isDesktop) return;

    let frame = 0;
    const measure = () => {
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      const distances = cardsRef.current.map((card) => {
        if (!card) return Number.POSITIVE_INFINITY;
        const rect = card.getBoundingClientRect();
        return Math.abs(rect.left + rect.width / 2 - center);
      });

      let nearest = 0;
      distances.forEach((distance, index) => {
        if (distance < (distances[nearest] ?? Number.POSITIVE_INFINITY)) nearest = index;
      });
      setActiveIndex((current) => (current === nearest ? current : nearest));
    };

    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [isDesktop]);

  const centerCard = useCallback(
    (index: number) => {
      idleUntilRef.current = performance.now() + 5200;
      setActiveIndex(index);
      cardsRef.current[index]?.scrollIntoView({
        behavior: lightweightMobile ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    },
    [lightweightMobile],
  );

  const step = useCallback(
    (direction: number) => {
      centerCard((activeIndex + direction + UNIVERSES.length) % UNIVERSES.length);
    },
    [activeIndex, centerCard],
  );

  return (
    <section
      id="inicio"
      className="vb-hero-shell relative isolate scroll-mt-20 overflow-hidden border-b border-white/10"
      style={{ ["--vb-universe" as string]: active.accent }}
    >
      <div aria-hidden="true" className="vb-noise absolute inset-0 opacity-30" />
      <div aria-hidden="true" className="vb-hero-grid absolute inset-0" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        animate={
          motionDisabled
            ? undefined
            : {
                backgroundImage: [
                  `radial-gradient(circle at 42% 42%, ${active.accent}18, transparent 58%)`,
                  `radial-gradient(circle at 58% 48%, ${active.accent}28, transparent 62%)`,
                  `radial-gradient(circle at 42% 42%, ${active.accent}18, transparent 58%)`,
                ],
              }
        }
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-[90rem] gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-12">
        <div className="relative z-20 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="vb-kicker">Showroom de quatro universos</span>
            <span className="h-px w-10 bg-vb-gold/60" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Deslize, explore e entre
            </span>
          </div>

          <h1 className="mt-6 max-w-[12ch] font-display text-[clamp(2.75rem,12vw,6.4rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-vb-ivory">
            Sites que o cliente sente
            <span className="block" style={{ color: active.accent }}>
              antes de entender.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/64">
            Quatro identidades, quatro formas de vender e operar. A experiência muda com a marca —
            não é o mesmo template trocando de cor.
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={motionDisabled ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={motionDisabled ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 rounded-[1.5rem] border border-white/12 bg-black/35 p-5 backdrop-blur-xl sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.24em]"
                    style={{ color: active.accent }}
                  >
                    Universo {active.number}
                  </p>
                  <p className="mt-1 truncate font-display text-2xl font-semibold text-white">
                    {active.name}
                  </p>
                </div>
                <span className="hidden max-w-32 text-right text-[11px] leading-4 text-white/45 sm:block">
                  {active.material}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/70">{active.solution}</p>

              <details className="mt-5 sm:hidden">
                <summary className="min-h-11 cursor-pointer border-y border-white/10 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  Ver recursos
                </summary>
                <ul className="mt-3 grid gap-2">
                  {active.capabilities.map((capability) => (
                    <li
                      key={capability.kind}
                      className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3"
                    >
                      <capability.icon
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: active.accent }}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/76">
                        {capability.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>

              <ul className="mt-5 hidden gap-2 sm:grid sm:grid-cols-2">
                {active.capabilities.map((capability, index) => {
                  const content = (
                    <>
                      <capability.icon
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: active.accent }}
                        aria-hidden="true"
                      />
                      <span>
                        <span className="block text-xs font-bold uppercase tracking-[0.14em] text-white/80">
                          {capability.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-4 text-white/52">
                          {capability.detail}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <motion.li
                      key={capability.kind}
                      initial={motionDisabled ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.26, delay: 0.04 + index * 0.05 }}
                    >
                      {capability.path === undefined ? (
                        <span className="flex min-h-14 gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                          {content}
                        </span>
                      ) : (
                        <Link
                          to={universeHref(active.slug, capability.path)}
                          className="flex min-h-14 gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2.5 transition hover:border-white/25 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vb-gold"
                        >
                          {content}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/demo/$storeSlug"
                  params={{ storeSlug: active.slug }}
                  className="vb-button-primary inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm"
                >
                  Abrir {active.name}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={proposalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="vb-button-secondary inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm"
                >
                  Quero algo assim
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          <details className="mt-6 max-w-xl border-t border-white/10 pt-4 text-sm text-white/55">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vb-cyan">
              O que é demonstrativo aqui?
              <span className="text-xs uppercase tracking-[0.2em] text-vb-cyan">Abrir</span>
            </summary>
            <p className="pb-2 pt-3 leading-6">{demoNotice}</p>
          </details>
        </div>

        <div className="relative z-10 min-w-0">
          <div
            ref={trackRef}
            role="group"
            aria-label="Showroom tridimensional dos universos"
            onPointerMove={(event) => {
              if (!isDesktop || event.pointerType !== "mouse") return;
              const rect = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty(
                "--showroom-x",
                `${((event.clientX - rect.left) / rect.width) * 100}%`,
              );
              event.currentTarget.style.setProperty(
                "--showroom-y",
                `${((event.clientY - rect.top) / rect.height) * 100}%`,
              );
            }}
            className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-[15vw] pb-3 [perspective:1000px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block lg:h-[38rem] lg:overflow-visible lg:px-0 lg:pb-0 lg:[perspective:1200px]"
            style={{
              background:
                "radial-gradient(circle at var(--showroom-x,50%) var(--showroom-y,45%), color-mix(in srgb, var(--vb-universe) 20%, transparent), transparent 52%)",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[12%] hidden rounded-full border border-white/10 lg:block"
              style={{ boxShadow: `0 0 112px -42px ${active.accent}` }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[20%] hidden rounded-full border border-dashed border-white/15 lg:block"
              animate={motionDisabled || tier === "off" ? undefined : { rotate: 360 }}
              transition={{
                duration: tier === "high" ? 42 : 58,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {UNIVERSES.map((universe, index) => {
              const isActive = index === activeIndex;
              const delta = relativeIndex(index, activeIndex);
              const desktopScale = Math.max(0.58, 1 - Math.abs(delta) * 0.18);
              const transform = isDesktop
                ? `translate3d(calc(-50% + ${delta * 178}px), -50%, ${-Math.abs(delta) * 150}px) rotateY(${delta * -30}deg) scale(${desktopScale})`
                : "none";

              return (
                <Link
                  key={universe.slug}
                  ref={(element) => {
                    cardsRef.current[index] = element;
                  }}
                  to="/demo/$storeSlug"
                  params={{ storeSlug: universe.slug }}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`${universe.name} — ${universe.label}`}
                  data-showroom-card
                  data-active={isActive ? "true" : "false"}
                  onClick={(event) => {
                    if (isActive) return;
                    event.preventDefault();
                    centerCard(index);
                  }}
                  onFocus={() => centerCard(index)}
                  className="group relative aspect-[3/4] w-[70vw] max-w-[19rem] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border bg-black/55 transition-[transform,opacity,border-color,box-shadow] duration-700 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vb-gold lg:absolute lg:left-1/2 lg:top-1/2 lg:h-[62%] lg:w-[50%] lg:max-w-[22rem]"
                  style={{
                    transform,
                    transformStyle: isDesktop ? "preserve-3d" : "flat",
                    opacity: isActive ? 1 : isDesktop ? Math.max(0.2, 0.72 - Math.abs(delta) * 0.2) : 0.72,
                    zIndex: 20 - Math.abs(delta),
                    borderColor: isActive ? `${universe.accent}76` : "rgba(255,255,255,0.11)",
                    boxShadow: isActive && isDesktop ? `0 30px 86px -38px ${universe.accent}` : undefined,
                  }}
                >
                  <motion.img
                    src={universe.image}
                    alt={`Prévia da demonstração ${universe.name}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                    animate={
                      motionDisabled || tier === "off"
                        ? undefined
                        : { scale: [1, 1.025, 1], y: [0, index % 2 === 0 ? -4 : 4, 0] }
                    }
                    transition={{
                      duration: 6.2 + index * 0.55,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: index * 0.35,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/24 to-transparent" />
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 mix-blend-screen"
                    animate={
                      motionDisabled || tier === "off"
                        ? { opacity: isActive ? 0.22 : 0.08 }
                        : { opacity: isActive ? [0.2, 0.42, 0.2] : [0.08, 0.17, 0.08] }
                    }
                    transition={{
                      duration: 3.8 + index * 0.4,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.32,
                    }}
                    style={{
                      background: `radial-gradient(circle at 32% 100%, ${universe.accent}66, transparent 62%)`,
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                    <p
                      className="text-[9px] font-bold uppercase tracking-[0.24em]"
                      style={{ color: universe.accent }}
                    >
                      {universe.number} · {universe.label}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
                      {universe.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-white/60">
                      {universe.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 lg:justify-between">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Universo anterior"
              className="vb-button-glass hidden h-11 w-11 place-items-center rounded-full lg:grid"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-1">
              {UNIVERSES.map((universe, index) => (
                <button
                  key={universe.slug}
                  type="button"
                  onClick={() => centerCard(index)}
                  aria-label={`Ir para ${universe.name}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className="grid h-10 w-10 place-items-center rounded-full"
                >
                  <span
                    className="block h-2 rounded-full transition-all duration-300"
                    style={{
                      width: index === activeIndex ? "1.55rem" : "0.5rem",
                      background:
                        index === activeIndex ? universe.accent : "rgba(255,255,255,0.22)",
                    }}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Próximo universo"
              className="vb-button-glass hidden h-11 w-11 place-items-center rounded-full lg:grid"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">
            <span className="lg:hidden">Deslize. Toque uma vez para focar e novamente para entrar.</span>
            <span className="hidden lg:inline">
              A cena gira sozinha. Use as setas ou escolha um universo.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
