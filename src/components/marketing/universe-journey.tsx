import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { ArrowRight, Check, MousePointer2 } from "lucide-react";
import { useRef } from "react";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { UNIVERSES, type Universe } from "@/components/marketing/universe-data";

type UniverseJourneyProps = {
  proposalUrl: string;
};

function CapabilitySignal({
  universe,
  style,
}: {
  universe: Universe;
  style?: MotionStyle;
}) {
  return (
    <motion.ul className="grid gap-2 sm:grid-cols-2" style={style}>
      {universe.capabilities.map((capability, index) => (
        <motion.li
          key={capability.kind}
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
          className="flex min-h-16 gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur-xl"
        >
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border"
            style={{ borderColor: universe.accent + "55", color: universe.accent }}
          >
            <capability.icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
              {capability.label}
            </span>
            <span className="mt-1 block text-[11px] leading-4 text-white/55">
              {capability.detail}
            </span>
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function StaticChapter({ universe }: { universe: Universe }) {
  return (
    <article
      data-testid="universe-chapter-static"
      className="relative isolate overflow-hidden border-b border-white/10 px-5 py-20 text-white sm:px-8"
      style={{
        background:
          "linear-gradient(145deg, #08090c 0%, " + universe.accent + "24 52%, #050608 100%)",
      }}
    >
      <div className="mx-auto grid max-w-[90rem] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p
            className="text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: universe.accent }}
          >
            Capítulo {universe.number} · {universe.label}
          </p>
          <h3 className="mt-5 font-display text-5xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-7xl">
            {universe.name}
          </h3>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/65">{universe.solution}</p>
          <div className="mt-8">
            <CapabilitySignal universe={universe} />
          </div>
          <Link
            to="/demo/$storeSlug"
            params={{ storeSlug: universe.slug }}
            className="vb-button-primary mt-8 inline-flex min-h-12 items-center gap-2 px-5 py-3"
          >
            Entrar neste universo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-black/30 p-2">
          <img
            src={universe.image}
            alt={"Atmosfera visual de " + universe.name}
            className="aspect-[4/3] h-full w-full rounded-[1.55rem] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </article>
  );
}

function ImmersiveChapter({ universe, index }: { universe: Universe; index: number }) {
  const chapterRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start start", "end end"],
  });
  const sceneOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.78, 0.94, 1],
    [0.18, 1, 1, 0.4, 0],
  );
  const imageScale = useTransform(scrollYProgress, [0, 0.22, 0.72, 1], [1.16, 1.04, 1.02, 1.1]);
  const imageX = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 1],
    [index % 2 === 0 ? -34 : 34, 0, 0, index % 2 === 0 ? 18 : -18],
  );
  const copyX = useTransform(
    scrollYProgress,
    [0.08, 0.26, 0.7, 0.9],
    [index % 2 === 0 ? -46 : 46, 0, 0, index % 2 === 0 ? 30 : -30],
  );
  const copyOpacity = useTransform(scrollYProgress, [0.08, 0.22, 0.72, 0.9], [0, 1, 1, 0]);
  const energyScale = useTransform(scrollYProgress, [0, 0.16, 0.82, 1], [0, 1, 1, 0]);
  const capabilityOpacity = useTransform(scrollYProgress, [0.18, 0.32, 0.68, 0.84], [0, 1, 1, 0]);
  const capabilityY = useTransform(scrollYProgress, [0.18, 0.36, 0.7, 0.88], [20, 0, 0, -14]);
  const materialOpacity = useTransform(scrollYProgress, [0.05, 0.28, 0.74, 0.96], [0, 0.8, 0.8, 0]);
  const numberScale = useTransform(scrollYProgress, [0, 0.32, 0.78, 1], [0.72, 1, 1, 1.18]);
  const stageProgress = useTransform(scrollYProgress, [0.08, 0.88], ["0%", "100%"]);

  return (
    <section
      ref={chapterRef}
      data-testid="universe-chapter"
      className="relative min-h-[210svh] border-b border-white/10 bg-vb-deep sm:min-h-[225svh]"
      aria-labelledby={"universe-title-" + universe.slug}
    >
      <div data-testid="universe-chapter-sticky" className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ opacity: sceneOpacity }}>
          <motion.img
            data-testid="universe-chapter-image"
            src={universe.image}
            alt=""
            aria-hidden="true"
            loading={index === 0 ? "eager" : "lazy"}
            className="h-full w-full object-cover"
            style={{ scale: imageScale, x: imageX }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/55 to-black/15 lg:from-black/90 lg:via-black/45 lg:to-black/25" />
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle at " +
                (index % 2 === 0 ? "78%" : "22%") +
                " 48%, " +
                universe.accent +
                "55, transparent 46%)",
            }}
          />
          <motion.div
            className="absolute inset-0 opacity-45"
            style={{
              opacity: materialOpacity,
              backgroundImage:
                "repeating-linear-gradient(" +
                (28 + index * 17) +
                "deg, transparent 0 38px, " +
                universe.accent +
                "20 39px, transparent 40px 78px)",
            }}
          />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="absolute right-[-4vw] top-1/2 select-none font-display text-[38vw] font-semibold leading-none text-white/[0.035]"
          style={{ scale: numberScale, y: "-50%" }}
        >
          {universe.number}
        </motion.div>

        <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-white/10 lg:block">
          <motion.div
            className="h-full w-px origin-top shadow-[0_0_24px_currentColor]"
            style={{ scaleY: energyScale, background: universe.accent, color: universe.accent }}
          />
        </div>

        <div className="relative mx-auto flex h-full max-w-[90rem] items-center px-5 py-10 sm:px-8 lg:px-12">
          <motion.div
            className="w-full max-w-3xl"
            style={{ opacity: copyOpacity, x: copyX }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: universe.accent }}
              >
                Capítulo {universe.number}
              </span>
              <span className="h-px w-10 bg-white/20" aria-hidden="true" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/42">
                {universe.material}
              </span>
            </div>

            <h3
              id={"universe-title-" + universe.slug}
              className="mt-5 font-display text-[clamp(3.2rem,8vw,8rem)] font-semibold leading-[0.84] tracking-[-0.065em] text-white"
            >
              {universe.name}
            </h3>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
              {universe.solution}
            </p>

            <div className="mt-8 max-w-2xl">
              <CapabilitySignal universe={universe} style={{ opacity: capabilityOpacity, y: capabilityY }} />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/demo/$storeSlug"
                params={{ storeSlug: universe.slug }}
                className="vb-button-primary inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3"
              >
                Jogar dentro de {universe.name}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <span className="inline-flex min-h-12 items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.16em] text-white/42">
                <MousePointer2 className="h-4 w-4" style={{ color: universe.accent }} />
                Continue rolando para transformar a cena
              </span>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex items-center gap-4 sm:inset-x-8 lg:inset-x-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            {universe.number}/04
          </span>
          <div className="h-px flex-1 overflow-hidden bg-white/12">
            <motion.div
              className="h-full origin-left"
              style={{ width: stageProgress, background: universe.accent }}
            />
          </div>
          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-white/35 sm:inline">
            entrada · exploração · saída
          </span>
        </div>
      </div>
    </section>
  );
}

export function UniverseJourney({ proposalUrl }: UniverseJourneyProps) {
  const { capabilities } = useCinematicMotion();
  const desktopReduced =
    capabilities.hydrated &&
    (capabilities.reducedMotion || capabilities.coarsePointer || capabilities.quality === "economy");
  const mobileReduced = capabilities.hydrated && capabilities.reducedMotion;

  return (
    <section
      id="experiencia"
      data-testid="universe-storytelling"
      className="relative scroll-mt-20 bg-vb-deep text-white"
    >
      <div className="relative mx-auto max-w-[90rem] px-5 py-24 text-center sm:px-8 sm:py-32 lg:px-12">
        <p className="vb-kicker">Uma jornada, não uma grade</p>
        <h2 className="mx-auto mt-6 max-w-6xl font-display text-5xl font-semibold leading-[0.88] tracking-[-0.06em] sm:text-7xl lg:text-[7.2rem]">
          Quatro operações.
          <span className="block text-vb-gold">Quatro leis de movimento.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/58">
          Cada capítulo segura a cena tempo suficiente para você perceber como identidade, conteúdo
          e operação mudam juntos.
        </p>
      </div>

      <div aria-label="Capítulos dos quatro universos" className="lg:hidden">
        {UNIVERSES.map((universe, index) =>
          mobileReduced ? (
            <StaticChapter key={universe.slug} universe={universe} />
          ) : (
            <ImmersiveChapter key={universe.slug} universe={universe} index={index} />
          ),
        )}
      </div>

      <div
        data-testid="universe-journey"
        aria-label="Capítulos dos quatro universos"
        className="hidden lg:block"
      >
        {UNIVERSES.map((universe, index) =>
          desktopReduced ? (
            <StaticChapter key={universe.slug} universe={universe} />
          ) : (
            <ImmersiveChapter key={universe.slug} universe={universe} index={index} />
          ),
        )}
      </div>

      <div className="relative overflow-hidden border-b border-white/10 px-5 py-24 text-center sm:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-35"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, #65dde944, transparent 42%), radial-gradient(circle at 20% 100%, #d58c9a33, transparent 36%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl">
          <Check className="mx-auto h-6 w-6 text-vb-gold" aria-hidden="true" />
          <h3 className="mt-6 font-display text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
            A tecnologia é a base. A experiência é feita para o negócio.
          </h3>
          <a
            href={proposalUrl}
            target="_blank"
            rel="noreferrer"
            className="vb-button-primary mt-9 inline-flex min-h-14 items-center gap-3 px-7 py-4"
          >
            Desenhar meu universo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
