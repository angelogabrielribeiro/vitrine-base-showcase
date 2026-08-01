import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

export type ScrollExpandShowcaseItem = {
  title: string;
  subtitle: string;
  image: string;
};

type ScrollExpandShowcaseProps = {
  items: ScrollExpandShowcaseItem[];
  targetId?: string;
};

type SceneLayerProps = {
  item: ScrollExpandShowcaseItem;
  index: number;
  opacity: MotionValue<number>;
  sceneProgress: MotionValue<number>;
};

const SCENE_ACCENTS = [
  "from-[#d58c9a]/30 via-transparent to-[#e6c477]/20",
  "from-[#d8ae57]/30 via-transparent to-[#8a6d36]/20",
  "from-[#ff7448]/30 via-transparent to-[#e6c477]/16",
  "from-[#65dde9]/28 via-transparent to-[#9275f5]/28",
];

function SceneLayer({ item, index, opacity, sceneProgress }: SceneLayerProps) {
  const scale = useTransform(
    sceneProgress,
    [0, 0.18, 0.78, 1],
    [1.13 + index * 0.01, 1.1 + index * 0.008, 1.035, 1.01],
  );
  const x = useTransform(
    sceneProgress,
    [0, 0.22, 0.82, 1],
    [index % 2 === 0 ? -28 : 28, index % 2 === 0 ? -18 : 18, 0, 0],
  );
  const y = useTransform(sceneProgress, [0, 0.24, 0.78, 1], [26, 12, -6, -10]);
  const labelY = useTransform(sceneProgress, [0, 0.2, 0.76, 1], [28, 0, 0, -8]);
  const labelOpacity = useTransform(
    sceneProgress,
    [0, 0.16, 0.78, 1],
    [0, 1, 1, index === 3 ? 1 : 0.82],
  );
  const accentOpacity = useTransform(
    sceneProgress,
    [0, 0.25, 0.74, 1],
    [0.18, 0.65, 0.82, 0.48],
  );

  return (
    <motion.article
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
      <motion.img
        src={item.image}
        alt={`PrÃ©via visual de ${item.title}`}
        loading={index === 0 ? "eager" : "lazy"}
        className="h-full w-full object-cover will-change-transform"
        style={{ scale, x, y }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/25" />
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${SCENE_ACCENTS[index]} mix-blend-screen`}
        style={{ opacity: accentOpacity }}
      />
      <div aria-hidden="true" className="vb-scene-vignette absolute inset-0" />

      <motion.div
        data-testid="scroll-expand-card-label"
        className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 lg:p-12"
        style={{ y: labelY, opacity: labelOpacity }}
      >
        <div className="flex max-w-4xl items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-vb-gold sm:text-xs">
              Universo {String(index + 1).padStart(2, "0")} Â· {item.subtitle}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
              {item.title}
            </p>
          </div>
          <span className="hidden h-16 w-16 shrink-0 place-items-center rounded-full border border-white/20 bg-black/30 font-display text-lg text-white/70 backdrop-blur-xl sm:grid">
            0{index + 1}
          </span>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function ScrollExpandShowcase({
  items,
  targetId = "demonstracoes",
}: ScrollExpandShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { capabilities } = useCinematicMotion();
  const reduceMotion = capabilities.hydrated && capabilities.reducedMotion;
  const visibleItems = items.slice(0, 4);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const frameWidth = useTransform(
    scrollYProgress,
    [0, 0.78, 1],
    ["min(88vw, 48rem)", "96vw", "100vw"],
  );
  const frameHeight = useTransform(
    scrollYProgress,
    [0, 0.78, 1],
    ["min(56svh, 34rem)", "78svh", "calc(100svh - 4rem)"],
  );
  const frameRadius = useTransform(
    scrollYProgress,
    [0, 0.86, 1],
    ["2rem", "0rem", "0rem"],
  );
  const frameShadow = useTransform(
    scrollYProgress,
    [0, 0.82, 1],
    [
      "0 35px 100px rgba(0,0,0,.52)",
      "0 0 0 rgba(0,0,0,0)",
      "0 0 0 rgba(0,0,0,0)",
    ],
  );
  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.11, 0.2, 1],
    [1, 1, 0, 0],
  );
  const introY = useTransform(
    scrollYProgress,
    [0, 0.11, 0.2, 1],
    [0, 0, -56, -56],
  );
  const revealOpacity = useTransform(
    scrollYProgress,
    [0, 0.84, 0.94, 1],
    [0, 0, 1, 1],
  );
  const revealY = useTransform(
    scrollYProgress,
    [0, 0.84, 0.94, 1],
    [32, 32, 0, 0],
  );
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.76, 1],
    [0.7, 0.46, 0.18, 0.12],
  );
  const portalScale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.8, 1],
    [0.6, 0.78, 1.18, 1.38],
  );
  const portalOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.76, 1],
    [0.25, 0.72, 0.26, 0],
  );
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Cada cena recebe uma faixa prÃ³pria para separar entrada, permanÃªncia e saÃ­da.
  // A seÃ§Ã£o mais alta no mobile transforma pequenos gestos em mudanÃ§as graduais,
  // sem capturar wheel/touch nem alterar a rolagem nativa.
  const sceneProgresses = [
    useTransform(scrollYProgress, [0, 0.24], [0, 1]),
    useTransform(scrollYProgress, [0.18, 0.44], [0, 1]),
    useTransform(scrollYProgress, [0.38, 0.64], [0, 1]),
    useTransform(scrollYProgress, [0.58, 0.9], [0, 1]),
  ];
  const sceneOpacities = [
    useTransform(scrollYProgress, [0, 0.17, 0.24], [1, 1, 0]),
    useTransform(scrollYProgress, [0.18, 0.25, 0.37, 0.44], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [0.38, 0.45, 0.57, 0.64], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [0.58, 0.67, 1], [0, 1, 1]),
  ];

  return (
    <section
      id="experiencia"
      ref={sectionRef}
      data-testid="scroll-expand-showcase"
      aria-labelledby={
        reduceMotion ? "showcase-title-static" : "showcase-title"
      }
      className={
        reduceMotion
          ? "relative overflow-hidden border-y border-white/10 bg-vb-deep"
          : "relative min-h-[480svh] overflow-clip border-y border-white/10 bg-vb-deep sm:min-h-[420svh] md:min-h-[320svh] lg:min-h-[300svh]"
      }
    >
      <div
        data-testid="scroll-expand-sticky"
        className={
          reduceMotion
            ? "relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-16 sm:py-24"
            : "sticky top-16 flex h-[calc(100svh-4rem)] items-center justify-center overflow-hidden"
        }
      >
        <div
          aria-hidden="true"
          className="vb-pointer-aura pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden="true"
          className="vb-noise pointer-events-none absolute inset-0 opacity-25"
        />

        {reduceMotion && (
          <div
            data-testid="scroll-expand-static-heading"
            className="relative z-10 mb-8 max-w-5xl text-center sm:mb-12"
          >
            <p className="vb-kicker">Quatro universos digitais</p>
            <h2
              id="showcase-title-static"
              className="mt-5 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] text-vb-ivory sm:text-6xl"
            >
              A operaÃ§Ã£o muda. O cenÃ¡rio, o ritmo e a linguagem mudam junto.
            </h2>
          </div>
        )}

        <motion.div
          data-testid="scroll-expand-frame"
          className="relative isolate w-full overflow-hidden rounded-[2rem] border border-white/10 bg-vb-canvas"
          style={
            reduceMotion
              ? { maxWidth: "80rem" }
              : {
                  width: frameWidth,
                  height: frameHeight,
                  borderRadius: frameRadius,
                  boxShadow: frameShadow,
                }
          }
        >
          {reduceMotion ? (
            <div className="grid min-h-[40rem] w-full grid-cols-1 sm:grid-cols-2">
              {visibleItems.map((item) => (
                <article
                  key={item.title}
                  className="relative min-h-72 overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={`PrÃ©via visual de ${item.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                  <div
                    data-testid="scroll-expand-card-label"
                    className="absolute inset-x-0 bottom-0 p-5 sm:p-7"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-vb-gold">
                      {item.subtitle}
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-white sm:text-4xl">
                      {item.title}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0">
              {visibleItems.map((item, index) => (
                <SceneLayer
                  key={item.title}
                  item={item}
                  index={index}
                  opacity={sceneOpacities[index]}
                  sceneProgress={sceneProgresses[index]}
                />
              ))}

              <motion.div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 z-[5] aspect-square w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-vb-cyan/30 shadow-[0_0_120px_rgba(101,221,233,0.2)]"
                style={{ scale: portalScale, opacity: portalOpacity }}
              >
                <div className="absolute inset-[12%] rounded-full border border-vb-violet/35" />
                <div className="absolute inset-[24%] rounded-full border border-dashed border-vb-gold/30" />
              </motion.div>
            </div>
          )}

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-black"
            style={
              reduceMotion ? { opacity: 0.16 } : { opacity: overlayOpacity }
            }
          />

          <motion.div
            data-testid="scroll-expand-intro"
            aria-hidden={reduceMotion}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 text-center"
            style={
              reduceMotion
                ? { opacity: 0, visibility: "hidden", y: 0 }
                : { opacity: introOpacity, y: introY }
            }
          >
            <div className="max-w-6xl">
              <p className="vb-kicker">Atravesse os universos</p>
              <h2
                id="showcase-title"
                className="mx-auto mt-5 font-display text-4xl font-semibold leading-[0.9] tracking-[-0.065em] text-white sm:text-7xl lg:text-[7.4rem]"
              >
                Uma base tÃ©cnica.
                <span className="block text-vb-gold">
                  Quatro mundos sem cara de template.
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                O scroll conduz a troca de atmosfera, hierarquia e narrativa sem
                bloquear a navegaÃ§Ã£o.
              </p>
              {!reduceMotion && (
                <p className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                  Role para descobrir{" "}
                  <ArrowDown className="h-4 w-4 animate-bounce" />
                </p>
              )}
            </div>
          </motion.div>

          {!reduceMotion && (
            <div
              data-testid="scroll-expand-progress"
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-5 bottom-4 z-30 sm:inset-x-8 sm:bottom-6"
            >
              <div className="h-px overflow-hidden bg-white/18">
                <motion.div
                  className="h-full origin-left bg-gradient-to-r from-vb-gold via-vb-cyan to-vb-violet"
                  style={{ scaleX: progressScale }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[9px] font-bold uppercase tracking-[0.18em] text-white/42">
                {visibleItems.map((item, index) => (
                  <span key={item.title}>0{index + 1}</span>
                ))}
              </div>
            </div>
          )}

          <motion.div
            data-testid="scroll-expand-reveal"
            className="absolute inset-x-0 top-0 z-30 flex justify-center p-4 sm:p-6"
            style={
              reduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: revealOpacity, y: revealY }
            }
          >
            <a
              href={`#${targetId}`}
              className="vb-button-glass group inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3"
            >
              Ver cada projeto em detalhes
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

