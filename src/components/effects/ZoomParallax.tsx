import { useEffect, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import {
  useCinematicMotion,
  useInertialScrollProgress,
} from "@/components/motion/cinematic-motion-system";

export type ZoomImage = {
  src: string;
  alt?: string;
  className: string; // absolute positioning + size (Tailwind)
  scale: number; // final zoom factor
};

/**
 * ZoomParallax editorial — 7 camadas com escalas distintas ao longo de um
 * scroll sticky de ~280vh. Mobile simplificado. reduced-motion vira composição
 * estática. Sem dependência de Lenis.
 */
export function ZoomParallax({
  images,
  title,
  eyebrow,
  caption,
}: {
  images: ZoomImage[];
  title?: string;
  eyebrow?: string;
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { capabilities } = useCinematicMotion();
  const reduce = capabilities.reducedMotion || capabilities.quality === "static";
  const scrollYProgress = useInertialScrollProgress(ref, {
    offset: ["start start", "end end"],
  });
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setIsDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const maxScale = isDesktop ? 4.5 : 2.35;
  const sectionHeight = isDesktop ? "200vh" : "190svh";

  if (reduce) {
    return (
      <section className="relative bg-neutral-950 text-neutral-50" aria-label={title ?? "Campanha"}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-24 sm:grid-cols-3">
          {images.slice(0, 6).map((im, i) => (
            <img
              key={i}
              src={im.src}
              alt={im.alt ?? ""}
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative bg-neutral-950 text-neutral-50"
      style={{ height: sectionHeight }}
      aria-label={title ?? "Campanha"}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {images.map((im, i) => (
          <ZoomLayer
            key={i}
            image={{ ...im, scale: Math.min(im.scale, maxScale) }}
            progress={scrollYProgress}
            index={i}
            isDesktop={isDesktop}
          />
        ))}
        {/* Overlay para legibilidade do título */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-neutral-950/70 via-neutral-950/30 to-neutral-950/70" />
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          {eyebrow && (
            <span className="text-[10px] uppercase tracking-[0.5em] text-white/85 drop-shadow">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="font-display mt-4 max-w-[12ch] text-4xl leading-[0.92] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.65)] sm:text-6xl md:text-7xl">
              {title}
            </h2>
          )}
          {caption && <p className="mt-4 max-w-md text-sm text-white/80">{caption}</p>}
          <span className="mt-7 text-[9px] uppercase tracking-[0.35em] text-white/55 md:hidden">
            Role para atravessar a campanha
          </span>
        </div>
      </div>
    </section>
  );
}

const MOBILE_LAYOUT = [
  "left-1/2 top-[48%] h-[42vh] w-[68vw] -translate-x-1/2 -translate-y-1/2",
  "-left-[14%] top-[8%] h-[28vh] w-[48vw]",
  "-right-[13%] top-[12%] h-[26vh] w-[46vw]",
  "left-[2%] bottom-[7%] h-[26vh] w-[44vw]",
  "right-[1%] bottom-[9%] h-[28vh] w-[46vw]",
];

function ZoomLayer({
  image,
  progress,
  index,
  isDesktop,
}: {
  image: ZoomImage;
  progress: MotionValue<number>;
  index: number;
  isDesktop: boolean;
}) {
  const direction = index % 2 === 0 ? 1 : -1;
  const scale = useTransform(
    progress,
    [0, 0.72, 1],
    isDesktop ? [1, Math.min(image.scale, 2.4), image.scale] : [0.78, 1.2, image.scale],
  );
  const x = useTransform(progress, [0, 1], [isDesktop ? 0 : direction * 32, 0]);
  const y = useTransform(progress, [0, 1], [isDesktop ? 0 : 56 + index * 7, isDesktop ? 0 : -34]);
  const rotate = useTransform(progress, [0, 1], [isDesktop ? 0 : direction * 7, 0]);
  return (
    <motion.div
      className={
        "absolute flex items-center justify-center will-change-transform " +
        (isDesktop ? image.className : MOBILE_LAYOUT[index % MOBILE_LAYOUT.length])
      }
      style={{ scale, x, y, rotate }}
    >
      <div className="h-full w-full overflow-hidden shadow-[0_26px_80px_-28px_rgba(0,0,0,.95)] ring-1 ring-white/10">
        <img
          src={image.src}
          alt={image.alt ?? ""}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </motion.div>
  );
}
