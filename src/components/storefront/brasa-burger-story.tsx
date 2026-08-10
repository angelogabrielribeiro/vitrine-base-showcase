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
    openY: 255,
    openX: -34,
    openRotate: -7.5,
    openScale: 0.96,
    depth: -54,
    parallaxX: 8,
    parallaxY: 5,
    zIndex: 10,
  },
  {
    key: "patty",
    label: "Blend",
    src: "https://v3b.fal.media/files/b/0aa5b99f/ZH1l075aBM_oDvwREea9e_ip9W6DFnkPUm4Mz-Tref_.png",
    closedY: 62,
    openY: 112,
    openX: 34,
    openRotate: 6.5,
    openScale: 1.03,
    depth: 10,
    parallaxX: 7,
    parallaxY: 5,
    zIndex: 20,
  },
  {
    key: "cheese",
    label: "Cheddar",
    src: "https://v3b.fal.media/files/b/0aa5baef/UiSDYUW--EtWWZi10ZON2_result.png",
    closedY: 18,
    openY: -12,
    openX: -40,
    openRotate: -8.5,
    openScale: 1.08,
    depth: 34,
    parallaxX: 10,
    parallaxY: 7,
    zIndex: 30,
  },
  {
    key: "greens",
    label: "Frescor",
    src: "https://v3b.fal.media/files/b/0aa5b98c/GSNF9d8Qh5gUBTDYTLuUh_vchTMr2kmHJT4Q0AIWKCO.png",
    closedY: -30,
    openY: -120,
    openX: 36,
    openRotate: 7.5,
    openScale: 1.04,
    depth: 54,
    parallaxX: 12,
    parallaxY: 8,
    zIndex: 40,
  },
  {
    key: "top",
    label: "Brioche",
    src: "https://v3b.fal.media/files/b/0aa5b98b/9hR0QNSNdsz6KArQieq___UOVKK7esieHIXgT7A2rsP.png",
    closedY: -104,
    openY: -255,
    openX: -30,
    openRotate: -7.5,
    openScale: 1.07,
    depth: 78,
    parallaxX: 15,
    parallaxY: 10,
    zIndex: 50,
  },
] as const;

const PHASES = [
  {
    kicker: "01 · Fechado",
    title: "Primeiro você vê a mordida.",
    body: "O burger entra montado, pesado e inteiro. O começo segura a tensão antes de abrir a estrutura.",
  },
  {
    kicker: "02 · Pressão",
    title: "As camadas começam a escapar.",
    body: "O primeiro movimento ainda é controlado, mas cada ingrediente já ganha direção, profundidade e espaço próprio.",
  },
  {
    kicker: "03 · Explosão",
    title: "Agora a Brasa se desmonta de verdade.",
    body: "Brioche, frescor, cheddar, blend e base se afastam com força. A câmera recua enquanto a montagem abre para manter o exploded view inteiro no quadro.",
  },
  {
    kicker: "04 · Assinatura",
    title: "Tudo aberto. Tudo no quadro.",
    body: "A composição segura o exploded view completo por alguns instantes e entrega a próxima seção sem um corredor vazio depois da cena.",
  },
] as const;

function phaseFromProgress(value: number) {
  if (value < 0.18) return 0;
  if (value < 0.42) return 1;
  if (value < 0.7) return 2;
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

  const burgerProgress = useTransform(
    scrollYProgress,
    [0, 0.1, 0.22, 0.58, 0.82, 1],
    [0, 0, 0.08, 0.72, 1, 1],
    { clamp: true },
  );
  const sceneRotateY = useTransform(pointerX, [-1, 1], reduceMotion ? [0, 0] : [-7, 7]);
  const sceneRotateX = useTransform(pointerY, [-1, 1], reduceMotion ? [0, 0] : [4, -4]);
  const sceneX = useTransform(pointerX, [-1, 1], reduceMotion ? [0, 0] : [-14, 14]);
  const sceneY = useTransform(pointerY, [-1, 1], reduceMotion ? [0, 0] : [-9, 9]);
  const sceneScale = useTransform(
    burgerProgress,
    [0, 0.22, 0.52, 0.82, 1],
    [0.98, 1, 0.94, 0.82, 0.78],
  );
  const glowScale = useTransform(burgerProgress, [0, 0.5, 1], [0.82, 1.08, 1.28]);
  const glowOpacity = useTransform(burgerProgress, [0, 0.45, 1], [0.2, 0.44, 0.68]);
  const shadowScale = useTransform(burgerProgress, [0, 0.45, 1], [0.7, 0.98, 1.32]);
  const shadowOpacity = useTransform(burgerProgress, [0, 0.55, 1], [0.56, 0.4, 0.24]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = phaseFromProgress(value);
    setPhaseIndex((current) => (current === next ? current : next));
  });

  const phase = PHASES[phaseIndex] ?? PHASES[0];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="brasa-burger-story-title"
      className="relative h-[310svh] border-y border-orange-200/10 bg-[#0d0806] sm:h-[300svh] lg:h-[285svh]"
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

        <div className="absolute inset-x-0 bottom-7 top-[27%] sm:top-[23%] lg:inset-y-0 lg:left-[37%] lg:right-[2%]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-[8%] rounded-[50%] bg-[radial-gradient(circle,rgba(244,102,33,.34)_0%,rgba(244,102,33,.14)_38%,transparent_72%)] blur-3xl"
            style={{ scale: glowScale, opacity: glowOpacity }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              perspective: 1500,
              rotateX: sceneRotateX,
              rotateY: sceneRotateY,
              x: sceneX,
              y: sceneY,
              scale: sceneScale,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative h-[34rem] w-[22rem] origin-center scale-[0.68] sm:h-[38rem] sm:w-[28rem] sm:scale-[0.78] lg:h-[34rem] lg:w-[34rem] lg:scale-[0.94] xl:scale-100">
              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-[76%] h-16 w-[64%] -translate-x-1/2 rounded-[50%] bg-black/65 blur-2xl"
                style={{ scaleX: shadowScale, opacity: shadowOpacity }}
              />
              {BURGER_LAYERS.map((layer) => (
                <PhotoBurgerLayer
                  key={layer.key}
                  layer={layer}
                  progress={burgerProgress}
                  pointerX={pointerX}
                  pointerY={pointerY}
                  reduceMotion={reduceMotion}
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

type PhotoBurgerLayerProps = {
  layer: Layer;
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  reduceMotion: boolean;
};

function PhotoBurgerLayer({
  layer,
  progress,
  pointerX,
  pointerY,
  reduceMotion,
}: PhotoBurgerLayerProps) {
  const travelY = layer.openY - layer.closedY;
  const y = useTransform(
    progress,
    [0, 0.08, 0.3, 0.62, 1],
    [
      layer.closedY,
      layer.closedY + travelY * 0.02,
      layer.closedY + travelY * 0.22,
      layer.closedY + travelY * 0.74,
      layer.openY,
    ],
  );
  const x = useTransform(
    progress,
    [0, 0.08, 0.3, 0.62, 1],
    [0, layer.openX * 0.03, layer.openX * 0.24, layer.openX * 0.72, layer.openX],
  );
  const rotate = useTransform(
    progress,
    [0, 0.08, 0.3, 0.62, 1],
    [0, layer.openRotate * 0.03, layer.openRotate * 0.22, layer.openRotate * 0.72, layer.openRotate],
  );
  const z = useTransform(
    progress,
    [0, 0.08, 0.3, 0.62, 1],
    [0, layer.depth * 0.03, layer.depth * 0.24, layer.depth * 0.74, layer.depth],
  );
  const scale = useTransform(
    progress,
    [0, 0.18, 0.55, 1],
    [1, 1, 1 + (layer.openScale - 1) * 0.45, layer.openScale],
  );
  const opacity = useTransform(progress, [0, 0.04, 1], [0.98, 1, 1]);
  const pointerLayerX = useTransform(
    pointerX,
    [-1, 1],
    reduceMotion ? [0, 0] : [-layer.parallaxX, layer.parallaxX],
  );
  const pointerLayerY = useTransform(
    pointerY,
    [-1, 1],
    reduceMotion ? [0, 0] : [layer.parallaxY, -layer.parallaxY],
  );
  const pointerRotateY = useTransform(
    pointerX,
    [-1, 1],
    reduceMotion ? [0, 0] : [-layer.parallaxX * 0.18, layer.parallaxX * 0.18],
  );
  const pointerRotateX = useTransform(
    pointerY,
    [-1, 1],
    reduceMotion ? [0, 0] : [layer.parallaxY * 0.14, -layer.parallaxY * 0.14],
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[95%] -ml-[47.5%] -mt-[47.5%] select-none"
      style={{
        y,
        x,
        z,
        rotate,
        scale,
        opacity,
        zIndex: layer.zIndex,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <motion.img
        src={layer.src}
        alt=""
        draggable={false}
        decoding="async"
        className="h-full w-full object-contain [filter:drop-shadow(0_22px_28px_rgba(0,0,0,.32))]"
        style={{
          x: pointerLayerX,
          y: pointerLayerY,
          rotateX: pointerRotateX,
          rotateY: pointerRotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      />
    </motion.div>
  );
}
