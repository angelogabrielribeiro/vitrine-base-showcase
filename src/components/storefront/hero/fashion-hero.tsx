import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { NicheHeroProps } from "./niche-hero";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/format";
import { SectionReveal, WordReveal, Marquee } from "@/components/motion/primitives";
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

/**
 * Fashion — editorial, split assimétrico, tipografia serif dominante,
 * imagens revelam por máscara, marquee sutil como tagline de coleção.
 */
/**
 * Maison Belle — hero editorial vibrante em vinho/magenta.
 * Colagem de 4 imagens reais dos produtos, sempre visíveis (on-mount), com
 * parallax localizado ao mouse no desktop. Sem dependência de whileInView na
 * primeira dobra.
 */
export function FashionHero({ store, spotlight, featured }: NicheHeroProps) {
  const banner = store.banners[0];
  const pool = [
    spotlight?.kind === "product" ? spotlight.product.images[0] : undefined,
    ...featured.map((p) => p.images[0]).filter(Boolean),
    banner?.image,
  ].filter(Boolean) as string[];
  const uniq = Array.from(new Set(pool));
  const [i0, i1, i2, i3] = [0, 1, 2, 3].map(
    (i) => uniq[i % Math.max(uniq.length, 1)] ?? banner?.image ?? "",
  );
  const price =
    spotlight?.kind === "product"
      ? (spotlight.product.salePrice ?? spotlight.product.price)
      : undefined;

  const reduce = useReducedMotion();
  const { capabilities } = useCinematicMotion();
  const wrapRef = useRef<HTMLElement>(null);
  const [pt, setPt] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  const mobileY0 = useTransform(scrollYProgress, [0, 1], [28, -72]);
  const mobileY1 = useTransform(scrollYProgress, [0, 1], [52, -38]);
  const mobileY2 = useTransform(scrollYProgress, [0, 1], [70, -54]);
  const mobileY3 = useTransform(scrollYProgress, [0, 1], [44, -82]);
  const mobileX0 = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const mobileX1 = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const mobileX2 = useTransform(scrollYProgress, [0, 1], [-18, 14]);
  const mobileX3 = useTransform(scrollYProgress, [0, 1], [12, -10]);
  const mobileScale = useTransform(scrollYProgress, [0, 1], [0.94, 1.08]);

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      setPt({ x, y });
    };
    const onLeave = () => setPt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce]);

  const par = (mx: number, my: number, mobileStyle: MotionStyle) => {
    if (reduce) return undefined;
    if (capabilities.precisePointer) {
      return { transform: `translate3d(${pt.x * mx}px, ${pt.y * my}px, 0)` };
    }
    return mobileStyle;
  };

  return (
    <section
      ref={wrapRef}
      className="relative isolate overflow-hidden text-neutral-50"
      style={{
        background:
          "radial-gradient(120% 80% at 15% 10%, oklch(0.38 0.18 15) 0%, oklch(0.22 0.12 355) 45%, oklch(0.14 0.06 340) 100%)",
      }}
    >
      {/* Camadas ambiente */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-[42rem] w-[42rem] rounded-full opacity-70 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, oklch(0.62 0.22 20 / 0.55), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[36rem] w-[36rem] rounded-full opacity-70 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, oklch(0.55 0.24 340 / 0.55), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.06) 3px 4px)",
        }}
      />

      {/* Barra editorial */}
      <div className="relative mx-auto flex max-w-[110rem] items-center justify-between px-6 py-5 text-[10px] uppercase tracking-[0.4em] text-white/70">
        <span>Édition {new Date().getFullYear()}</span>
        <span className="hidden sm:inline">{store.tagline}</span>
        <span>№ 01</span>
      </div>

      <div className="relative mx-auto grid max-w-[110rem] grid-cols-12 gap-x-6 gap-y-10 px-6 pb-24 pt-6 lg:pb-32">
        {/* Coluna texto */}
        <div className="col-span-12 lg:col-span-5 lg:pt-16">
          <SectionReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-amber-200/90">
              {store.messages.heroKicker}
            </p>
          </SectionReveal>
          <h1 className="font-display mt-6 text-[clamp(2.75rem,7.4vw,6rem)] font-medium leading-[0.92] tracking-tight text-white">
            <WordReveal text={store.messages.heroTitle} as="span" className="block" />
          </h1>
          <SectionReveal delay={0.15}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-white/80">
              {store.messages.heroSubtitle}
            </p>
          </SectionReveal>
          <SectionReveal delay={0.25}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button
                asChild
                size="lg"
                className="group rounded-none bg-amber-200 px-8 py-6 text-xs uppercase tracking-[0.3em] text-neutral-900 hover:bg-white"
              >
                <Link
                  to="/demo/$storeSlug/produtos"
                  params={{ storeSlug: store.slug }}
                  search={{ q: "", cat: "", sort: "" }}
                >
                  {store.messages.heroCta}
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </Button>
              {spotlight?.kind === "product" && (
                <Link
                  to="/demo/$storeSlug/produto/$productSlug"
                  params={{ storeSlug: store.slug, productSlug: spotlight.product.slug }}
                  className="group inline-flex flex-col text-xs uppercase tracking-[0.3em] text-white/70"
                >
                  <span className="text-white">Peça destaque</span>
                  <span className="mt-1 border-b border-white/30 pb-0.5 transition group-hover:border-white">
                    {spotlight.product.name}
                    {price ? ` — ${brl(price)}` : ""}
                  </span>
                </Link>
              )}
            </div>
          </SectionReveal>
        </div>

        {/* Colagem à direita — 4 imagens sempre visíveis */}
        <div className="col-span-12 lg:col-span-7">
          <div className="relative mx-auto aspect-[5/6] w-full max-w-[46rem]">
            <CollageImage
              src={i0}
              alt={spotlight?.kind === "product" ? spotlight.product.name : store.name}
              className="absolute left-[4%] top-0 h-[78%] w-[62%] shadow-2xl shadow-black/40 ring-1 ring-white/10"
              style={par(-14, -10, { x: mobileX0, y: mobileY0, scale: mobileScale })}
              delay={0.05}
              eager
            />
            <CollageImage
              src={i1}
              alt=""
              className="absolute right-0 top-[14%] h-[50%] w-[42%] shadow-2xl shadow-black/40 ring-1 ring-white/10"
              style={par(18, 12, { x: mobileX1, y: mobileY1, scale: mobileScale })}
              delay={0.18}
              eager
            />
            <CollageImage
              src={i2}
              alt=""
              className="absolute bottom-0 left-0 h-[44%] w-[36%] shadow-2xl shadow-black/40 ring-1 ring-white/10"
              style={par(-22, 18, { x: mobileX2, y: mobileY2, scale: mobileScale })}
              delay={0.3}
              eager
            />
            <CollageImage
              src={i3}
              alt=""
              className="absolute bottom-[6%] right-[8%] hidden h-[36%] w-[30%] shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:block"
              style={par(12, -18, { x: mobileX3, y: mobileY3, scale: mobileScale })}
              delay={0.42}
              eager
            />
          </div>
        </div>
      </div>

      <div className="relative border-y border-white/10 bg-black/25 py-4 backdrop-blur-sm">
        <Marquee speed={40}>
          {[
            "Alta primavera",
            "Tecidos naturais",
            "Produção limitada",
            "Curadoria autoral",
            "Novos lançamentos",
          ].map((t) => (
            <span key={t} className="font-display text-2xl italic tracking-tight text-white/85">
              {t} <span className="mx-6 text-amber-200/70">◆</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function CollageImage({
  src,
  alt,
  className,
  style,
  delay = 0,
  eager,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: MotionStyle;
  delay?: number;
  eager?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={"overflow-hidden " + (className ?? "")}
      style={style}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0.4";
        }}
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}
