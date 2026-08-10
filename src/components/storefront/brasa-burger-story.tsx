import { lazy, Suspense, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Flame, Layers3, MousePointer2, Sparkles } from "lucide-react";
import { useAdaptiveQuality } from "@/hooks/use-adaptive-quality";

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
    title: "Não é só montar. É equilibrar.",
    body: "Textura, calor, gordura, frescor e crocância separados na tela antes de voltarem a fazer sentido na mordida.",
  },
] as const;

function phaseFromProgress(value: number) {
  if (value < 0.25) return 0;
  if (value < 0.5) return 1;
  if (value < 0.76) return 2;
  return 3;
}

export function BrasaBurgerStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const reduceMotion = useReducedMotion();
  const adaptive = useAdaptiveQuality();
  const [phaseIndex, setPhaseIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = phaseFromProgress(value);
    setPhaseIndex((current) => (current === next ? current : next));
  });

  const phase = PHASES[phaseIndex];
  const canRender3D = adaptive.tier !== "off";
  const compact = adaptive.isMobile;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="brasa-burger-story-title"
      className="relative min-h-[225svh] border-y border-orange-200/10 bg-[#0d0806]"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] min-h-[620px] overflow-hidden">
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
          style={{ scaleX: scrollYProgress }}
        />

        <div className="absolute inset-0 lg:left-[34%]">
          {canRender3D ? (
            <Suspense fallback={null}>
              <BrasaBurgerCanvas
                progress={scrollYProgress}
                compact={compact}
                reduced={Boolean(reduceMotion)}
                dpr={adaptive.dpr}
                antialias={!adaptive.isMobile}
              />
            </Suspense>
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative h-[52vh] w-[52vh] max-h-[34rem] max-w-[34rem] rounded-full border border-orange-300/20 bg-[radial-gradient(circle,rgba(241,90,36,.18),transparent_68%)]">
                <div className="absolute inset-[16%] rounded-full border border-orange-300/15" />
                <div className="absolute inset-[31%] rounded-full bg-orange-500/10 blur-3xl" />
              </div>
            </div>
          )}
        </div>

        <div className="pointer-events-none relative z-10 mx-auto grid h-full max-w-7xl px-5 py-8 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-12">
          <div className="self-start pt-8 sm:pt-12 lg:self-center lg:pt-0">
            <div className="inline-flex items-center gap-2 border border-orange-300/20 bg-black/30 px-3 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-orange-300 backdrop-blur-xl">
              <Layers3 className="h-3.5 w-3.5" />
              Raio-X da Brasa
            </div>

            <h2
              id="brasa-burger-story-title"
              className="mt-6 max-w-[8ch] font-display text-[clamp(3.6rem,8vw,7.4rem)] uppercase leading-[0.82] tracking-[-0.04em] text-[#fff6e7]"
            >
              Desmonte a mordida.
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={phase.kicker}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 max-w-lg"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
                  {phase.kicker}
                </p>
                <p className="mt-3 font-display text-3xl uppercase leading-[0.95] text-white sm:text-4xl">
                  {phase.title}
                </p>
                <p className="mt-4 max-w-md text-sm leading-7 text-orange-50/58 sm:text-base">
                  {phase.body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 hidden max-w-md grid-cols-5 gap-2 lg:grid">
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

          <div className="self-end pb-5 text-right lg:self-center lg:pb-0">
            <div className="ml-auto hidden w-fit items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-orange-100/36 sm:inline-flex">
              <MousePointer2 className="h-3.5 w-3.5 text-orange-400" />
              Mouse inclina · scroll desmonta
            </div>
          </div>
        </div>

        <div className="absolute inset-x-5 bottom-5 z-20 flex items-center gap-4 sm:inset-x-8 lg:inset-x-12">
          <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.22em] text-orange-200/52">
            <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
            Brasa em camadas
          </span>
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-[#f15a24] to-[#ffb25b]"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <span className="hidden items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 sm:inline-flex">
            <Sparkles className="h-3 w-3 text-orange-400" />
            continue rolando
          </span>
        </div>
      </div>
    </section>
  );
}
