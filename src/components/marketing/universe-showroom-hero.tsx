import { Link } from "@tanstack/react-router";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Hand, MessageCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { UNIVERSES, universeHref, type Universe } from "@/components/marketing/universe-data";

const STEP = 360 / UNIVERSES.length;

type UniverseShowroomHeroProps = {
  proposalUrl: string;
  demoNotice: string;
  onActiveChange?: (universe: Universe) => void;
};

function normalizeIndex(rotation: number) {
  const raw = Math.round(-rotation / STEP) % UNIVERSES.length;
  return (raw + UNIVERSES.length) % UNIVERSES.length;
}

function UniversePanel({
  universe,
  index,
  rotation,
  radius,
  active,
  onSelect,
  reduced,
}: {
  universe: Universe;
  index: number;
  rotation: ReturnType<typeof useMotionValue<number>>;
  radius: number;
  active: boolean;
  onSelect: () => void;
  reduced: boolean;
}) {
  const angle = useTransform(rotation, (r) => r + index * STEP);
  const depth = useTransform(rotation, (r) => Math.cos(((r + index * STEP) * Math.PI) / 180));
  const opacity = useTransform(depth, (c) => 0.24 + 0.76 * Math.max(0, (c + 1) / 2) ** 2.2);
  const blur = useTransform(depth, (c) => `blur(${(Math.max(0, 1 - (c + 1) / 2) * 5).toFixed(2)}px)`);
  const lift = useTransform(depth, (c) => -18 * Math.max(0, c));
  const transform = useMotionTemplate`rotateY(${angle}deg) translateZ(${radius}px)`;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`${universe.name} — ${universe.label}`}
      aria-current={active ? "true" : undefined}
      className="absolute left-1/2 top-1/2 h-[62%] w-[58%] max-w-[22rem] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vb-gold sm:w-[46%]"
      style={{ transform, opacity, filter: reduced ? undefined : blur, transformStyle: "preserve-3d" }}
      whileTap={{ scale: 0.965 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-[1.75rem] border bg-black/50 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl"
        style={{
          y: reduced ? 0 : lift,
          borderColor: active ? `${universe.accent}88` : "rgba(255,255,255,0.12)",
          boxShadow: active ? `0 40px 120px -40px ${universe.accent}` : undefined,
        }}
        animate={
          reduced
            ? undefined
            : { rotateZ: [0, index % 2 === 0 ? 0.9 : -0.9, 0], y: [0, index % 2 === 0 ? -7 : 7, 0] }
        }
        transition={{
          duration: 6.2 + index * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.4,
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.3rem]">
          <img
            src={universe.image}
            alt={`Prévia da demonstração ${universe.name}`}
            loading={index === 0 ? "eager" : "lazy"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />
          <div
            aria-hidden="true"
            className="absolute inset-0 mix-blend-screen transition-opacity duration-700"
            style={{
              opacity: active ? 0.5 : 0.16,
              background: `radial-gradient(circle at 30% 100%, ${universe.accent}55, transparent 62%)`,
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
            <p className="mt-1 text-[11px] leading-4 text-white/60">{universe.tagline}</p>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

export function UniverseShowroomHero({
  proposalUrl,
  demoNotice,
  onActiveChange,
}: UniverseShowroomHeroProps) {
  const { capabilities } = useCinematicMotion();
  const reduced = capabilities.hydrated && capabilities.reducedMotion;
  const rotation = useMotionValue(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(300);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [explored, setExplored] = useState(false);
  const idleRef = useRef(0);
  const active = UNIVERSES[activeIndex];

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const measure = () => {
      const width = element.clientWidth;
      setRadius(Math.min(Math.max(width * 0.44, 170), 420));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const unsubscribe = rotation.on("change", (value) => {
      const next = normalizeIndex(value);
      setActiveIndex((current) => (current === next ? current : next));
    });
    return unsubscribe;
  }, [rotation]);

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  // Movimento ambiental: a constelação continua girando sem scroll e sem mouse.
  useEffect(() => {
    if (reduced || !capabilities.hydrated) return;
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const delta = Math.min(now - last, 64);
      last = now;
      if (!dragging && !document.hidden && idleRef.current < now) {
        rotation.set(rotation.get() - (delta / 1000) * 5.2);
      }
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [capabilities.hydrated, dragging, reduced, rotation]);

  const goTo = useCallback(
    (index: number) => {
      const current = rotation.get();
      const target = -index * STEP;
      const wrapped = target + Math.round((current - target) / 360) * 360;
      idleRef.current = performance.now() + 4200;
      setExplored(true);
      animate(rotation, wrapped, { type: "spring", stiffness: 90, damping: 18, mass: 0.9 });
    },
    [rotation],
  );

  const step = useCallback(
    (direction: number) => goTo((activeIndex + direction + UNIVERSES.length) % UNIVERSES.length),
    [activeIndex, goTo],
  );

  const dragState = useRef({ id: -1, x: 0, moved: 0 });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    dragState.current = { id: event.pointerId, x: event.clientX, moved: 0 };
    setDragging(true);
    setExplored(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current.id !== event.pointerId) return;
    const dx = event.clientX - dragState.current.x;
    dragState.current.x = event.clientX;
    dragState.current.moved += Math.abs(dx);
    rotation.set(rotation.get() + dx * 0.32);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current.id !== event.pointerId) return;
    dragState.current.id = -1;
    setDragging(false);
    idleRef.current = performance.now() + 3600;
    if (dragState.current.moved > 14) goTo(normalizeIndex(rotation.get()));
  };

  const glow = useMotionTemplate`radial-gradient(circle at calc(50% + ${useTransform(
    rotation,
    (r) => Math.sin((r * Math.PI) / 180) * 14,
  )}%) 46%, ${active.accent}2e, transparent 58%)`;

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
        style={reduced ? undefined : { backgroundImage: glow }}
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-[90rem] gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-12">
        <div className="relative z-20 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="vb-kicker">Showroom de quatro universos</span>
            <span className="h-px w-10 bg-vb-gold/60" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Explore antes de entrar
            </span>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.9rem,6vw,6.4rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-vb-ivory">
            Sites que o cliente sente
            <span className="block" style={{ color: active.accent }}>
              antes de entender.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/64">
            Gire a constelação, escolha um universo e veja o que ele já sabe fazer: vitrine,
            catálogo, pedido, agenda, painel e atendimento no WhatsApp.
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 rounded-[1.5rem] border border-white/12 bg-black/35 p-5 backdrop-blur-xl sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.24em]"
                    style={{ color: active.accent }}
                  >
                    Universo ativo {active.number}
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-white">
                    {active.name}
                  </p>
                </div>
                <span className="hidden text-right text-[11px] leading-4 text-white/45 sm:block">
                  {active.material}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/70">{active.solution}</p>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
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
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.26, delay: 0.05 + index * 0.05 }}
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

        <div className="relative z-10">
          <div
            ref={stageRef}
            role="group"
            tabIndex={0}
            aria-label="Showroom tridimensional dos universos. Use as setas para trocar."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                step(1);
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                step(-1);
              }
            }}
            className="relative h-[26rem] w-full select-none rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vb-gold sm:h-[32rem] lg:h-[38rem]"
            style={{
              perspective: reduced ? undefined : "1200px",
              touchAction: "pan-y",
              cursor: dragging ? "grabbing" : "grab",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-[14%] rounded-full border border-white/10"
              style={{ boxShadow: `0 0 140px -40px ${active.accent}` }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-[22%] rounded-full border border-dashed border-white/15"
              animate={reduced ? undefined : { rotate: 360 }}
              transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
            />

            {reduced ? (
              <div className="grid h-full grid-cols-2 gap-3 p-2">
                {UNIVERSES.map((universe) => (
                  <Link
                    key={universe.slug}
                    to="/demo/$storeSlug"
                    params={{ storeSlug: universe.slug }}
                    className="relative overflow-hidden rounded-2xl border border-white/12"
                  >
                    <img
                      src={universe.image}
                      alt={`Prévia da demonstração ${universe.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 p-3 font-display text-lg text-white">
                      {universe.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
                aria-hidden={false}
              >
                {UNIVERSES.map((universe, index) => (
                  <UniversePanel
                    key={universe.slug}
                    universe={universe}
                    index={index}
                    rotation={rotation}
                    radius={radius}
                    active={index === activeIndex}
                    reduced={reduced}
                    onSelect={() => goTo(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Universo anterior"
                className="vb-button-glass grid h-11 w-11 place-items-center rounded-full"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Próximo universo"
                className="vb-button-glass grid h-11 w-11 place-items-center rounded-full"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="ml-2 flex items-center gap-2">
                {UNIVERSES.map((universe, index) => (
                  <button
                    key={universe.slug}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Ir para ${universe.name}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    className="h-9 w-9 rounded-full"
                  >
                    <span
                      className="mx-auto block h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: index === activeIndex ? "1.6rem" : "0.625rem",
                        background:
                          index === activeIndex ? universe.accent : "rgba(255,255,255,0.22)",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
              <Hand className="h-4 w-4" style={{ color: active.accent }} aria-hidden="true" />
              {explored ? active.gesture : "Arraste, toque ou use as setas"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}