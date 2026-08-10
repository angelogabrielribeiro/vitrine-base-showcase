import { lazy, Suspense, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Flame, Layers3, MousePointer2, Sparkles } from "lucide-react";
import { useAdaptiveQuality } from "@/hooks/use-adaptive-quality";
import { useInView } from "@/hooks/use-in-view";

const BrasaBurgerCanvas = lazy(() => import("@/components/storefront/brasa-burger-scene"));

const PHASES = [
  {
    kicker: "01 · Fechado",
    title: "Primeiro você vê a mordida.",
    body: "Um burger inteiro, quente e direto. Continue rolando para abrir o que normalmente fica escondido.",
  },
  {
    kicker: "02 · Estrutura",
    title: "Cada camada entra por um motivo.",
    body: "Pão brioche, frescor, cheddar e carne deixam de ser uma pilha e viram uma composição que você consegue enxergar.",
  },
  {
    kicker: "03 · Fogo",
    title: "O centro da Brasa aparece.",
    body: "O blend de 180 g ganha espaço, o queijo se solta e a montagem vira uma visão explodida guiada pelo scroll.",
  },
  {
    kicker: "04 · Assinatura",
    title: "Tudo aberto. Nada sobrando.",
    body: "A visão termina inteira dentro da tela: base, carne, cheddar, frescor e brioche separados com espaço suficiente para ler cada camada.",
  },
] as const;

function phaseFromProgress(value: number) {
  if (value < 0.2) return 0;
  if (value < 0.42) return 1;
  if (value < 0.64) return 2;
  return 3;
}

export function BrasaBurgerStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: sceneGateRef, inView: sceneReady } = useInView<HTMLDivElement>({
    amount: 0,
    rootMargin: "120% 0px",
    once: false,
  });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const burgerProgress = useTransform(scrollYProgress, [0.06, 0.68], [0, 1], { clamp: true });
  const reduceMotion = useReducedMotion();
  const adaptive = useAdaptiveQuality();
  const [phaseIndex, setPhaseIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = phaseFromProgress(value);
    setPhaseIndex((current) => (current === next ? current : next));
  });

  const phase = PHASES[phaseIndex] ?? PHASES[0];
  const canRender3D = adaptive.tier !== "off";
  const compact = adaptive.isMobile;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="brasa-burger-story-title"
      className="relative h-[158svh] border-y border-orange-200/10 bg-[#0d0806] sm:h-[168svh] lg:h-[172svh]"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,rgba(241,90,36,.18),transparent_32%),radial-gradient(circle_at_42%_88%,rgba(255,155,65,.08),transparent_38%),linear-gradient(140deg,#0b0705_0%,#160b06_48%,#0c0806_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:54px_54px]"
        />
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_24px_rgba(251,146,60,.75)]"
          style={{ scaleX: burgerProgress }}
        />

        <div
          ref={sceneGateRef}
          className="absolute inset-x-0 bottom-0 top-[31%] sm:top-[25%] lg:inset-0 lg:left-[34%]"
        >
          {sceneReady && canRender3D ? (
            <Suspense fallback={<BurgerLoading reduced={Boolean(reduceMotion)} />}>
              <BrasaBurgerCanvas
                progress={burgerProgress}
                compact={compact}
                reduced={Boolean(reduceMotion)}
                dpr={Math.min(adaptive.dpr, adaptive.isMobile ? 1.25 : 1.6)}
                antialias={!adaptive.isMobile}
              />
            </Suspense>
          ) : (
            <BurgerLoading reduced={Boolean(reduceMotion)} />
          )}
        </div>

        <div className="pointer-events-none relative z-10 mx-auto grid h-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-12">
          <div className="self-start pt-5 sm:pt-8 lg:self-center lg:pt-0">
            <div className="inline-flex items-center gap-2 border border-orange-300/20 bg-black/30 px-3 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-orange-300 backdrop-blur-xl">
              <Layers3 className="h-3.5 w-3.5" />
              Raio-X da Brasa
            </div>

            <h2
              id="brasa-burger-story-title"
              className="mt-4 max-w-[8ch] font-display text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.82] tracking-[-0.04em] text-[#fff6e7] sm:mt-6"
            >
              Desmonte a mordida.
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={phase.kicker}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 max-w-lg sm:mt-7"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-orange-400 sm:text-[10px]">
                  {phase.kicker}
                </p>
                <p className="mt-2 max-w-[16ch] font-display text-2xl uppercase leading-[0.95] text-white sm:mt-3 sm:text-4xl">
                  {phase.title}
                </p>
                <p className="mt-3 max-w-md text-xs leading-6 text-orange-50/58 sm:mt-4 sm:text-base sm:leading-7">
                  {phase.body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 hidden max-w-md grid-cols-5 gap-2 lg:grid">
              {["Base", "Blend", "Cheddar", "Frescor", "Brioche"].map((label, index) => (
                <motion.div
                  key={label}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: phaseIndex >= Math.min(index, 3) ? -4 : 0,
                          borderColor:
                            phaseIndex >= Math.min(index, 3)
                              ? "rgba(251,146,60,.42)"
                              : "rgba(255,255,255,.08)",
                        }
                  }
                  className="border border-white/10 bg-black/20 px-2 py-3 text-center text-[8px] font-black uppercase tracking-[0.12em] text-white/48 backdrop-blur"
                >
                  {label}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="self-end pb-9 text-right lg:self-center lg:pb-0">
            <div className="ml-auto hidden w-fit items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-orange-100/36 sm:inline-flex">
              <MousePointer2 className="h-3.5 w-3.5 text-orange-400" />
              Mouse inclina · scroll desmonta
            </div>
          </div>
        </div>

        <div className="absolute inset-x-5 bottom-4 z-20 flex items-center gap-3 sm:inset-x-8 sm:bottom-5 lg:inset-x-12">
          <span className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-orange-200/52 sm:text-[9px]">
            <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
            Brasa em camadas
          </span>
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-[#f15a24] to-[#ffb25b]"
              style={{ scaleX: burgerProgress }}
            />
          </div>
          <span className="hidden items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 sm:inline-flex">
            <Sparkles className="h-3 w-3 text-orange-400" />
            100% dentro da cena
          </span>
        </div>
      </div>
    </section>
  );
}

function BurgerLoading({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <motion.div
        animate={reduced ? undefined : { rotate: 360, scale: [0.96, 1.04, 0.96] }}
        transition={{
          rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          scale: { duration: 3.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        className="relative h-[42vh] w-[42vh] max-h-[27rem] max-w-[27rem] rounded-full border border-orange-300/20 bg-[radial-gradient(circle,rgba(241,90,36,.2),transparent_68%)]"
      >
        <div className="absolute inset-[16%] rounded-full border border-orange-300/15" />
        <div className="absolute inset-[31%] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute inset-0 grid place-items-center text-[8px] font-black uppercase tracking-[0.28em] text-orange-200/45">
          aquecendo 3D
        </div>
      </motion.div>
    </div>
  );
}
