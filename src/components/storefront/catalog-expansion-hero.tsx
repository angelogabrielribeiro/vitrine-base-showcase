import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowLeft, Sparkles } from "lucide-react";
import { useRef } from "react";
import type { Product, StoreConfig } from "@/types/commerce";
import { SafeImage } from "@/components/storefront/safe-image";
import { commerceSurface } from "@/components/storefront/commerce-surface";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { brl } from "@/lib/format";

const BACKGROUNDS = {
  fashion:
    "radial-gradient(circle at 78% 18%, rgba(212,154,167,.3), transparent 30%), linear-gradient(130deg,#1d0d15,#4a192b 55%,#25131d)",
  barber:
    "radial-gradient(circle at 75% 22%, rgba(244,200,102,.18), transparent 30%), linear-gradient(130deg,#050607,#17130d 55%,#090a0b)",
  restaurant:
    "radial-gradient(circle at 75% 22%, rgba(255,100,43,.3), transparent 30%), linear-gradient(130deg,#120704,#431305 55%,#160b06)",
  electronics:
    "radial-gradient(circle at 75% 22%, rgba(103,232,249,.22), transparent 30%), linear-gradient(130deg,#02040c,#071a3d 55%,#050714)",
} as const;

export function CatalogExpansionHero({
  store,
  products,
  categoryName,
}: {
  store: StoreConfig;
  products: Product[];
  categoryName?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { capabilities } = useCinematicMotion();
  const reduced =
    prefersReduced ||
    (capabilities.hydrated &&
      (capabilities.coarsePointer || capabilities.quality === "economy"));
  const surface = commerceSurface(store.niche);
  const lead = products[0];
  const title = categoryName ?? surface.catalogTitle;
  const words = title.split(" ");
  const split = Math.max(1, Math.ceil(words.length / 2));
  const lineOne = words.slice(0, split).join(" ");
  const lineTwo = words.slice(split).join(" ");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const mediaScale = useTransform(scrollYProgress, [0, 0.72, 1], [0.62, 1, 1.05]);
  const mediaRadius = useTransform(scrollYProgress, [0, 0.72], [42, 0]);
  const mediaY = useTransform(scrollYProgress, [0, 0.72, 1], [58, 0, -14]);
  const leftX = useTransform(scrollYProgress, [0, 0.72], [0, -260]);
  const rightX = useTransform(scrollYProgress, [0, 0.72], [0, 260]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.2, 0.72, 0.92], [0, 1, 1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.72], [0.52, 0.18]);

  return (
    <section
      ref={ref}
      data-testid="catalog-expansion-hero"
      className={`relative border-b border-white/12 text-white ${reduced ? "min-h-[calc(100svh-4rem)]" : "min-h-[185svh]"}`}
      style={{ background: BACKGROUNDS[store.niche] }}
    >
      <div className={reduced ? "relative h-[calc(100svh-4rem)] overflow-hidden" : "sticky top-[4.5rem] h-[calc(100svh-4.5rem)] overflow-hidden"}>
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />

        {lead && (
          <motion.div
            className="absolute inset-[8%] overflow-hidden border border-white/18 shadow-[0_42px_120px_rgba(0,0,0,.55)] sm:inset-[11%_18%]"
            style={
              reduced
                ? { borderRadius: 0 }
                : { scale: mediaScale, borderRadius: mediaRadius, y: mediaY }
            }
          >
            <SafeImage
              src={lead.images[0]}
              alt=""
              className="h-full w-full object-cover saturate-[1.08]"
            />
            <motion.div
              className="absolute inset-0 bg-black"
              style={reduced ? { opacity: 0.28 } : { opacity: overlayOpacity }}
            />
          </motion.div>
        )}

        {lead && (
          <motion.aside
            data-testid="catalog-feature-context"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.58 }}
            className="absolute bottom-7 left-5 z-30 w-[calc(100%_-_2.5rem)] border border-white/20 bg-black/58 p-4 text-white shadow-2xl backdrop-blur-xl sm:bottom-10 sm:left-auto sm:right-8 sm:w-[22rem] sm:p-5 lg:right-12"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-[8px] font-bold uppercase tracking-[0.3em] ${surface.eyebrow}`}>
                  Destaque com contexto · {lead.category}
                </p>
                <h2 className="mt-2 font-sans text-xl font-semibold leading-tight">{lead.name}</h2>
              </div>
              <strong className="shrink-0 text-sm">{brl(lead.salePrice ?? lead.price)}</strong>
            </div>
            <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/60">{lead.description}</p>
            <Link
              to="/demo/$storeSlug/produto/$productSlug"
              params={{ storeSlug: store.slug, productSlug: lead.slug }}
              className="mt-4 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.24em] text-white transition hover:text-current"
            >
              Ver produto <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.aside>
        )}

        <motion.div
          className="relative z-10 mx-auto flex h-full max-w-[100rem] flex-col justify-between px-5 py-8 sm:px-8 lg:px-12"
          style={reduced ? undefined : { opacity: copyOpacity }}
        >
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/demo/$storeSlug"
              params={{ storeSlug: store.slug }}
              className="group inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.28em] text-white/64"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Voltar à experiência
            </Link>
            <span className="hidden text-[9px] font-bold uppercase tracking-[0.32em] text-white/52 sm:block">
              {String(products.length).padStart(2, "0")} objetos ativos
            </span>
          </div>

          <div className="my-auto text-center">
            <p className={`text-[10px] font-bold uppercase tracking-[0.42em] ${surface.eyebrow}`}>
              <Sparkles className="mr-2 inline h-4 w-4" />
              {categoryName ?? surface.catalogKicker}
            </p>
            <h1
              className={`mx-auto mt-6 max-w-[14ch] text-[clamp(3.7rem,10vw,9rem)] font-semibold leading-[0.78] tracking-[-0.07em] ${
                store.niche === "fashion" ? "font-sans" : "font-display"
              }`}
            >
              <motion.span className="block" style={reduced ? undefined : { x: leftX }}>
                {lineOne}
              </motion.span>
              {lineTwo && (
                <motion.span
                  className={`block ${surface.eyebrow}`}
                  style={reduced ? undefined : { x: rightX }}
                >
                  {lineTwo}
                </motion.span>
              )}
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/64 sm:text-base">
              {categoryName
                ? `Uma seleção de ${products.length} peças que reage à sua navegação.`
                : surface.catalogCopy}
            </p>
          </div>

          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-wrap justify-center gap-2">
              {surface.proof.map((item, index) => (
                <span
                  key={item}
                  className="rounded-full border border-white/18 bg-black/25 px-4 py-2 text-[8px] font-bold uppercase tracking-[0.22em] text-white/72 backdrop-blur"
                >
                  {index === 0 ? "✦" : index === 1 ? "◎" : "↗"} {item}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.28em] text-white/42">
              <ArrowDown className="h-4 w-4 animate-bounce motion-reduce:animate-none" /> Role para
              abrir o acervo
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
