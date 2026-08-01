import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useRef } from "react";

export type ScrollExpandShowcaseItem = {
  title: string;
  subtitle: string;
  image: string;
};

type ScrollExpandShowcaseProps = {
  items: ScrollExpandShowcaseItem[];
  targetId?: string;
};

export function ScrollExpandShowcase({
  items,
  targetId = "demonstracoes",
}: ScrollExpandShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const visibleItems = items.slice(0, 4);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const frameWidth = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    ["min(88vw, 48rem)", "96vw", "100vw"],
  );
  const frameHeight = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    ["min(56svh, 34rem)", "78svh", "calc(100svh - 4rem)"],
  );
  const frameRadius = useTransform(scrollYProgress, [0, 0.82], ["2rem", "0rem"]);
  const frameShadow = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["0 35px 100px rgba(0,0,0,.42)", "0 0 0 rgba(0,0,0,0)"],
  );
  const introOpacity = useTransform(scrollYProgress, [0, 0.48, 0.66], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.66], [0, -72]);
  const revealOpacity = useTransform(scrollYProgress, [0.56, 0.8], [0, 1]);
  const revealY = useTransform(scrollYProgress, [0.56, 0.8], [32, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.62, 0.28]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="showcase-title"
      className={
        reduceMotion
          ? "relative overflow-hidden border-y border-white/10 bg-[#050a10]"
          : "relative min-h-[175svh] overflow-clip border-y border-white/10 bg-[#050a10] md:min-h-[195svh]"
      }
    >
      <div
        className={
          reduceMotion
            ? "relative mx-auto flex max-w-6xl items-center justify-center px-4 py-20"
            : "sticky top-16 flex h-[calc(100svh-4rem)] items-center justify-center overflow-hidden"
        }
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,191,36,0.14),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.12),transparent_35%)]"
        />

        <motion.div
          className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900"
          style={
            reduceMotion
              ? undefined
              : {
                  width: frameWidth,
                  height: frameHeight,
                  borderRadius: frameRadius,
                  boxShadow: frameShadow,
                }
          }
        >
          <div
            className={
              reduceMotion
                ? "grid min-h-[34rem] w-[min(92vw,72rem)] grid-cols-2"
                : "grid h-full w-full grid-cols-2"
            }
          >
            {visibleItems.map((item) => (
              <div key={item.title} className="group relative min-h-40 overflow-hidden">
                <motion.img
                  src={item.image}
                  alt={`Prévia visual de ${item.title}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  style={reduceMotion ? undefined : { scale: imageScale }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                    {item.subtitle}
                  </p>
                  <p className="mt-1 font-display text-lg text-white sm:text-3xl">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black"
            style={reduceMotion ? { opacity: 0.34 } : { opacity: overlayOpacity }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5 text-center"
            style={reduceMotion ? undefined : { opacity: introOpacity, y: introY }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
                Explore a experiência
              </p>
              <h2
                id="showcase-title"
                className="mx-auto mt-5 max-w-5xl font-display text-4xl font-light leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-8xl"
              >
                Quatro operações. Quatro experiências construídas com intenção.
              </h2>
              {!reduceMotion && (
                <p className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white/72">
                  Role para ampliar <ArrowDown className="h-4 w-4 animate-bounce" />
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-0 z-20 flex justify-center p-5 sm:p-8"
            style={reduceMotion ? undefined : { opacity: revealOpacity, y: revealY }}
          >
            <a
              href={`#${targetId}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/55 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-cyan-200/50 hover:bg-cyan-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
            >
              Ver cada projeto em detalhes <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
