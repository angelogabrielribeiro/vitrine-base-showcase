import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Flame, Layers3, MousePointer2, Sparkles } from "lucide-react";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

const BURGER_LAYERS = [
  {
    key: "bottom",
    label: "Base",
    src: "https://v3b.fal.media/files/b/0aa5b9a0/Qx-bWKmP021LefLh3ViAl_8CMLkq2hB5tQTy1ZLgy2R.png",
    closedY: 116,
    openY: 176,
    openX: -4,
    openRotate: -1.2,
    depth: -12,
    zIndex: 10,
  },
  {
    key: "patty",
    label: "Blend",
    src: "https://v3b.fal.media/files/b/0aa5b99f/ZH1l075aBM_oDvwREea9e_ip9W6DFnkPUm4Mz-Tref_.png",
    closedY: 62,
    openY: 82,
    openX: 6,
    openRotate: 1.3,
    depth: 4,
    zIndex: 20,
  },
  {
    key: "cheese",
    label: "Cheddar",
    src: "https://v3b.fal.media/files/b/0aa5b98c/GfT34S2gzsk2zXgBofAr8_HFBKOHiKy9H93bfuW0TPK.png",
    closedY: 18,
    openY: 0,
    openX: -8,
    openRotate: -2.2,
    depth: 18,
    zIndex: 30,
  },
  {
    key: "greens",
    label: "Frescor",
    src: "https://v3b.fal.media/files/b/0aa5b98c/GSNF9d8Qh5gUBTDYTLuUh_vchTMr2kmHJT4Q0AIWKCO.png",
    closedY: -30,
    openY: -88,
    openX: 7,
    openRotate: 1.8,
    depth: 30,
    zIndex: 40,
  },
  {
    key: "top",
    label: "Brioche",
    src: "https://v3b.fal.media/files/b/0aa5b98b/9hR0QNSNdsz6KArQieq___UOVKK7esieHIXgT7A2rsP.png",
    closedY: -104,
    openY: -190,
    openX: -3,
    openRotate: -1.1,
    depth: 44,
    zIndex: 50,
  },
] as const;

const PHASES = [
  {
    kicker: "01 · Fechado",
    title: "Primeiro você vê a mordida.",
    body: "O burger entra montado e ocupa a cena como uma peça de campanha, não como um modelo de jogo.",
  },
  {
    kicker: "02 · Estrutura",
    title: "A montagem começa a respirar.",
    body: "Cada camada ganha espaço sem perder o alinhamento: brioche, frescor, cheddar, blend e base.",
  },
  {
    kicker: "03 · Fogo",
    title: "O centro da Brasa aparece.",
    body: "O blend e o cheddar viram o foco enquanto o scroll abre a composição e mantém tudo dentro do enquadramento.",
  },
  {
    kicker: "04 · Assinatura",
    title: "Tudo aberto. Nada sobrando.",
    body: "A animação termina inteira na tela e segura a visão final antes de entregar a próxima seção.",
  },
] as const;

function phaseFromProgress(value: number) {
  if (value < 0.2) return 0;
  if (value < 0.43) return 1;
  if (value < 0.66) return 2;
  return 3;
}

export function BrasaBurgerStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { pointerX, pointerY } = useCinematicMotion();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const burgerProgress = useTransform(scrollYProgress, [0.02, 0.72], [0, 1], { clamp: true });
  const sceneRotateY = useTransform(pointerX, [-1, 1], reduceMotion ? [0, 0] : [-4.5, 4.5]);
  const sceneRotateX = useTransform(pointerY, [-1, 1], reduceMotion ? [0, 0] : [2.4, -2.4]);
  const sceneX = useTransform(pointerX, [-1, 1], reduceMotion ? [0, 0] : [-8, 8]);
  const sceneY = useTransform(pointerY, [-1, 1], reduceMotion ? [0, 0] : [-5, 5]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = phaseFromProgress(value);
    setPhaseIndex((current) => (current === next ? current : next));
  });

  const phase = PHASES[phaseIndex] ?? PHASES[0];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="brasa-burger-story-title"
      className="relative h-[158svh] border-y border-orange-200/10 bg-[#0d0806]"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,rgba(241,90,36,.2),transparent_31%),radial-gradient(circle_at_42%_88%,rgba(255,155,65,.09),transparent_38%),linear-gradient(140deg,#0b0705_0%,#160b06_48%,#0c0806_100%)]"
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

        <div className="absolute inset-x-0 bottom-8 top-[39%] sm:top-[33%] lg:inset-y-0 lg:left-[37%] lg:right-[2%]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_54%,rgba(244,102,33,.18),transparent_42%)] blur-2xl" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              perspective: 1300,
              rotateX: sceneRotateX,
              rotateY: sceneRotateY,
              x: sceneX,
              y: sceneY,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative h-[21rem] w-[21rem] origin-center scale-[0.72] sm:h-[25rem] sm:w-[25rem] sm:scale-[0.86] lg:h-[32rem] lg:w-[32rem] lg:scale-100">
              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-[73%] h-16 w-[62%] -translate-x-1/2 rounded-[50%] bg-black/65 blur-2xl"
                style={{
                  scaleX: useTransform(burgerProgress, [0, 1], [0.7, 1.08]),
                  opacity: useTransform(burgerProgress, [0, 1], [0.56, 0.34]),
                }}
              />
              {BURGER_LAYERS.map((layer) => (
                <PhotoBurgerLayer
                  key={layer.key}
                  layer={layer}
                  progress={burgerProgress}
                  pointerX={pointerX}
                  pointerY={pointerY}
                  reduced={reduceMotion}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-none relative z-10 mx-auto grid h-full max-w-7xl px-5 py-5 sm:px-8 sm:py-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-12">
          <div className="self-start pt-3 sm:pt-6 lg:self-center lg:pt-0">
            <div className="inline-flex items-center gap-2 border border-orange-300/20 bg-black/30 px-3 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-orange-300 backdrop-blur-xl">
              <Layers3 className="h-3.5 w-3.5" />
              Raio-X da Brasa
            </div>

            <h2
              id="brasa-burger-story-title"
              className="mt-4 max-w-[8ch] font-display text-[clamp(2.9rem,7.4vw,6.8rem)] uppercase leading-[0.82] tracking-[-0.04em] text-[#fff6e7] sm:mt-5"
            >
              Desmonte a mordida.
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={phase.kicker}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -9 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 max-w-lg sm:mt-6"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-orange-400 sm:text-[10px]">
                  {phase.kicker}
                </p>
                <p className="mt-2 max-w-[16ch] font-display text-2xl uppercase leading-[0.95] text-white sm:text-4xl">
                  {phase.title}
                </p>
                <p className="mt-3 max-w-md text-xs leading-6 text-orange-50/58 sm:text-sm sm:leading-7">
                  {phase.body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 hidden max-w-md grid-cols-5 gap-2 lg:grid">
              {BURGER_LAYERS.map((layer, index) => (
                <motion.div
                  key={layer.key}
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
                  {layer.label}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="self-end pb-8 text-right lg:self-center lg:pb-0">
            <div className="ml-auto hidden w-fit items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-orange-100/36 sm:inline-flex">
              <MousePointer2 className="h-3.5 w-3.5 text-orange-400" />
              Mouse dá profundidade · scroll desmonta
            </div>
          </div>
        </div>

        <div className="absolute inset-x-5 bottom-3 z-20 flex items-center gap-3 sm:inset-x-8 sm:bottom-4 lg:inset-x-12">
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
            imagem fotorealista
          </span>
        </div>
      </div>
    </section>
  );
}

type Layer = (typeof BURGER_LAYERS)[number];

function PhotoBurgerLayer({
  layer,
  progress,
  pointerX,
  pointerY,
  reduced,
}: {
  layer: Layer;
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  reduced: boolean;
}) {
  const y = useTransform(progress, [0, 1], [layer.closedY, layer.openY]);
  const x = useTransform(progress, [0, 1], [0, layer.openX]);
  const rotate = useTransform(progress, [0, 1], [0, layer.openRotate]);
  const z = useTransform(progress, [0, 1], [0, layer.depth]);
  const pointerShiftX = useTransform(pointerX, [-1, 1], reduced ? [0, 0] : [-2.4, 2.4]);
  const pointerShiftY = useTransform(pointerY, [-1, 1], reduced ? [0, 0] : [-1.6, 1.6]);
  const opacity = useTransform(progress, [0, 0.05, 1], [0.98, 1, 1]);

  return (
    <motion.img
      src={layer.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      className="pointer-events-none absolute left-1/2 top-1/2 h-auto w-[95%] -translate-x-1/2 -translate-y-1/2 select-none object-contain [filter:drop-shadow(0_20px_24px_rgba(0,0,0,.28))]"
      style={{
        y,
        x,
        z,
        rotate,
        translateX: pointerShiftX,
        translateY: pointerShiftY,
        opacity,
        zIndex: layer.zIndex,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    />
  );
}
