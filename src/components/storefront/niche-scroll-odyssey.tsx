import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MousePointer2 } from "lucide-react";
import { useRef } from "react";
import type { StoreNiche } from "@/types/commerce";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

export type OdysseyScene = {
  number: string;
  kicker: string;
  title: string;
  copy: string;
  image: string;
  metric: string;
};

const COLORS: Record<StoreNiche, { shell: string; accent: string; line: string }> = {
  fashion: { shell: "bg-[#25131d]", accent: "text-[#d49aa7]", line: "bg-[#c99a55]" },
  barber: { shell: "bg-[#08090a]", accent: "text-[#f4c866]", line: "bg-[#f4c866]" },
  restaurant: { shell: "bg-[#160b06]", accent: "text-[#ff7b3f]", line: "bg-[#ff642b]" },
  electronics: { shell: "bg-[#050714]", accent: "text-cyan-200", line: "bg-cyan-300" },
};

function OdysseyChapter({
  scene,
  index,
  niche,
}: {
  scene: OdysseyScene;
  index: number;
  niche: StoreNiche;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const imageScale = useTransform(scrollYProgress, [0, 0.28, 0.76, 1], [0.72, 1.04, 1, 1.14]);
  const imageX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.74, 1],
    [index % 2 === 0 ? 180 : -180, 0, 0, index % 2 === 0 ? -80 : 80],
  );
  const imageRotate = useTransform(
    scrollYProgress,
    [0, 0.32, 0.74, 1],
    [index % 2 === 0 ? 22 : -22, 0, 0, index % 2 === 0 ? -8 : 8],
  );
  const copyY = useTransform(scrollYProgress, [0.08, 0.25, 0.72, 0.9], [52, 0, 0, -36]);
  const copyOpacity = useTransform(scrollYProgress, [0.08, 0.24, 0.72, 0.9], [0, 1, 1, 0]);
  const progress = useTransform(scrollYProgress, [0.08, 0.88], [0, 1]);
  const color = COLORS[niche];

  return (
    <section ref={ref} data-testid="odyssey-scene" className="relative min-h-[190svh]">
      <div className="sticky top-[4.5rem] h-[calc(100svh-4.5rem)] overflow-hidden">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto grid h-full max-w-[100rem] items-center gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:px-14">
          <motion.div
            className={`relative z-10 ${index % 2 === 1 ? "lg:order-2" : ""}`}
            style={reduced ? undefined : { opacity: copyOpacity, y: copyY }}
          >
            <div className={`text-[10px] font-bold uppercase tracking-[0.36em] ${color.accent}`}>
              Ato {scene.number} · {scene.kicker}
            </div>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(3.4rem,8vw,7.8rem)] leading-[0.82] tracking-[-0.06em] text-white">
              {scene.title}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/62 sm:text-lg">
              {scene.copy}
            </p>
            <div className="mt-9 flex items-center gap-5">
              <span className={`h-px w-16 ${color.line}`} />
              <span className={`text-xs font-bold uppercase tracking-[0.24em] ${color.accent}`}>
                {scene.metric}
              </span>
            </div>
            <p className="mt-8 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-white/35">
              <MousePointer2 className="h-4 w-4" /> Role para dirigir a cena
            </p>
          </motion.div>

          <div
            className={`relative h-[54vh] min-h-[25rem] ${index % 2 === 1 ? "lg:order-1" : ""}`}
            style={{ perspective: "1400px" }}
          >
            <motion.div
              className="absolute inset-[6%] overflow-hidden border border-white/15 bg-black/35 shadow-[0_45px_120px_rgba(0,0,0,.55)]"
              style={
                reduced
                  ? undefined
                  : {
                      scale: imageScale,
                      x: imageX,
                      rotateY: imageRotate,
                      transformStyle: "preserve-3d",
                    }
              }
            >
              <img src={scene.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-white/[0.04]" />
              <span className="absolute bottom-5 left-5 text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">
                {scene.kicker} / {scene.number}
              </span>
            </motion.div>
            <motion.div
              className={`absolute bottom-0 left-0 h-px w-full origin-left ${color.line}`}
              style={reduced ? { scaleX: 1 } : { scaleX: progress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function NicheScrollOdyssey({
  niche,
  eyebrow,
  title,
  scenes,
}: {
  niche: StoreNiche;
  eyebrow: string;
  title: string;
  scenes: OdysseyScene[];
}) {
  const color = COLORS[niche];
  const { capabilities } = useCinematicMotion();
  const compact =
    capabilities.hydrated &&
    (capabilities.coarsePointer || capabilities.quality === "economy");
  if (!scenes.length) return null;

  if (compact) {
    return (
      <section data-testid="niche-scroll-odyssey" className={`${color.shell} px-5 py-16 text-white`}>
        <p className={`text-[10px] font-bold uppercase tracking-[0.38em] ${color.accent}`}>
          {eyebrow}
        </p>
        <h2 className="mt-5 font-display text-5xl leading-[0.84] tracking-[-0.055em]">
          {title}
        </h2>
        <div className="-mx-5 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5 [scrollbar-width:none]">
          {scenes.slice(0, 3).map((scene) => (
            <article
              key={`${scene.number}-${scene.title}`}
              data-testid="odyssey-scene"
              className="relative w-[82vw] max-w-sm shrink-0 snap-center overflow-hidden border border-white/12 bg-black/35"
            >
              <img src={scene.image} alt="" className="aspect-[4/5] w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className={`text-[9px] font-bold uppercase tracking-[0.28em] ${color.accent}`}>
                  Ato {scene.number} · {scene.kicker}
                </p>
                <h3 className="mt-2 font-display text-3xl leading-none">{scene.title}</h3>
                <p className="mt-3 text-xs leading-5 text-white/62">{scene.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section data-testid="niche-scroll-odyssey" className={`${color.shell} text-white`}>
      <div className="mx-auto flex min-h-[72svh] max-w-[92rem] flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
        <p className={`text-[10px] font-bold uppercase tracking-[0.4em] ${color.accent}`}>
          {eyebrow}
        </p>
        <h2 className="mt-6 max-w-6xl font-display text-[clamp(3.7rem,9vw,9rem)] leading-[0.8] tracking-[-0.065em]">
          {title}
        </h2>
        <p className="mt-8 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-white/38">
          <ArrowDown className="h-4 w-4 animate-bounce motion-reduce:animate-none" /> Três atos
          guiados por você
        </p>
      </div>
      {scenes.slice(0, 3).map((scene, index) => (
        <OdysseyChapter
          key={`${scene.number}-${scene.title}`}
          scene={scene}
          index={index}
          niche={niche}
        />
      ))}
    </section>
  );
}
