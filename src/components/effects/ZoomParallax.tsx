import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

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
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  if (reduce) {
    return (
      <section className="relative bg-neutral-950 text-neutral-50" aria-label={title ?? "Campanha"}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-24 sm:grid-cols-3">
          {images.slice(0, 6).map((im, i) => (
            <img key={i} src={im.src} alt={im.alt ?? ""} className="aspect-[4/5] w-full object-cover" loading="lazy" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative bg-neutral-950 text-neutral-50"
      style={{ height: "280vh" }}
      aria-label={title ?? "Campanha"}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          {eyebrow && (
            <span className="text-[10px] uppercase tracking-[0.5em] text-white/70">{eyebrow}</span>
          )}
          {title && (
            <h2 className="font-display mt-4 text-4xl leading-tight sm:text-6xl md:text-7xl">
              {title}
            </h2>
          )}
          {caption && <p className="mt-4 max-w-md text-sm text-white/70">{caption}</p>}
        </div>
        {images.map((im, i) => (
          <ZoomLayer key={i} image={im} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

function ZoomLayer({ image, progress }: { image: ZoomImage; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 1], [1, image.scale]);
  return (
    <motion.div
      className={"absolute flex items-center justify-center will-change-transform " + image.className}
      style={{ scale }}
    >
      <div className="h-full w-full overflow-hidden">
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
