import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode, type ComponentPropsWithoutRef, type ElementType } from "react";

// framer-motion v12 exige motion.create(Tag) para tags dinâmicas — evita warning "motion() is deprecated".
function useMotionTag(As: ElementType) {
  return useMemo(() => motion.create(As as any), [As]);
}

/**
 * Tokens de motion compartilhados entre nichos. Manter enxuto: só transform/opacity.
 */
export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  dur: { fast: 0.35, base: 0.6, slow: 0.9 },
  dist: { sm: 8, md: 18, lg: 36 },
};

/* ------------------------------------------------------------------ */
/* SectionReveal — anima uma seção quando entra no viewport (uma vez)  */
/* ------------------------------------------------------------------ */
export function SectionReveal({
  children,
  delay = 0,
  y = MOTION.dist.md,
  as: As = "div",
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: ElementType;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const MotionTag = useMotionTag(As);
  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: MOTION.dur.base, ease: MOTION.ease, delay }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger — container + item                                          */
/* ------------------------------------------------------------------ */
export function Stagger({
  children,
  className,
  step = 0.07,
  delay = 0,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: reduce
            ? { staggerChildren: 0 }
            : { staggerChildren: step, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: MOTION.ease } },
};

export function StaggerItem({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const MotionTag = useMotionTag(As);
  return (
    <MotionTag className={className} variants={staggerItemVariants}>
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* WordReveal — split visual em palavras, texto real permanece intacto */
/* ------------------------------------------------------------------ */
export function WordReveal({
  text,
  className,
  as: As = "span",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(/\s+/);
  if (reduce) {
    const Tag = As as any;
    return <Tag className={className}>{text}</Tag>;
  }
  const MotionTag = useMotionTag(As);
  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.05, delayChildren: delay } },
      }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-baseline"
          style={{ marginRight: "0.25em" }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration: 0.7, ease: MOTION.ease } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* ParallaxMedia — deslocamento vertical suave conforme scroll         */
/* ------------------------------------------------------------------ */
export function ParallaxMedia({
  children,
  offset = 40,
  className,
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ImageReveal — máscara clip-path                                     */
/* ------------------------------------------------------------------ */
export function ImageReveal({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const reduce = useReducedMotion();
  // Eager/first-fold: anima on-mount e nunca esconde a imagem se o IO falhar.
  // Below-fold: whileInView com fallback de opacidade (nunca clip-path total, que deixaria oculto se o gatilho falhar).
  const commonAnim = reduce
    ? { initial: { opacity: 1 } as const, animate: { opacity: 1 } as const }
    : eager
    ? {
        initial: { opacity: 0.001, scale: 1.06 } as const,
        animate: { opacity: 1, scale: 1 } as const,
      }
    : {
        initial: { opacity: 0.001, scale: 1.06 } as const,
        whileInView: { opacity: 1, scale: 1 } as const,
        viewport: { once: true, amount: 0.2 } as const,
      };
  return (
    <div className={"relative overflow-hidden " + (className ?? "")}>
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={"h-full w-full object-cover " + (imgClassName ?? "")}
        {...commonAnim}
        transition={{ duration: 1.05, ease: MOTION.ease }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MagneticCTA — leve atração ao cursor (desktop, pointer fine)        */
/* ------------------------------------------------------------------ */
export function MagneticCTA({
  children,
  strength = 0.25,
  className,
  ...rest
}: { children: ReactNode; strength?: number } & ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqDesktop = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(!mqReduce.matches && mqDesktop.matches);
    update();
    mqReduce.addEventListener?.("change", update);
    mqDesktop.addEventListener?.("change", update);
    return () => {
      mqReduce.removeEventListener?.("change", update);
      mqDesktop.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    };
    const onLeave = () => {
      el.style.transform = "translate3d(0,0,0)";
    };
    const parent = el.parentElement ?? el;
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      el.style.transform = "";
    };
  }, [enabled, strength]);

  return (
    <div
      ref={ref}
      {...rest}
      className={className}
      style={{ transition: enabled ? "transform 0.35s cubic-bezier(.22,1,.36,1)" : undefined, ...(rest.style ?? {}) }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee — ticker horizontal pausável, sem duplicação semântica      */
/* ------------------------------------------------------------------ */
export function Marquee({
  children,
  speed = 40,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={"group relative flex overflow-hidden " + (className ?? "")}
      style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}
    >
      <div
        className="flex shrink-0 items-center gap-10 whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused]"
        style={
          reduce
            ? undefined
            : { animation: `vb-marquee ${speed}s linear infinite` }
        }
      >
        {children}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 items-center gap-10 whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused]"
        style={
          reduce
            ? undefined
            : { animation: `vb-marquee ${speed}s linear infinite` }
        }
      >
        {children}
      </div>
      <style>{`
        @keyframes vb-marquee {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(-100%,0,0); }
        }
      `}</style>
    </div>
  );
}