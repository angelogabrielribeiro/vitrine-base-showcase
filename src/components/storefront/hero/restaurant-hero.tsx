import { Link } from "@tanstack/react-router";
import { Flame, Clock, ChevronRight } from "lucide-react";
import type { NicheHeroProps } from "./niche-hero";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/format";
import { SectionReveal, WordReveal, Stagger, StaggerItem, MOTION } from "@/components/motion/primitives";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Brasa Urbana — apetitoso, calor, velocidade, pedido.
 * CTA principal = "Pedir agora". Foto do prato dominante, camadas com gradiente de brasa.
 */
export function RestaurantHero({ store, spotlight, featured }: NicheHeroProps) {
  const reduce = useReducedMotion();
  const hero =
    spotlight?.kind === "product" ? spotlight.product : featured[0] ?? null;
  const heroImage = hero?.images[0] ?? store.banners[0]?.image ?? "";
  const price = hero ? hero.salePrice ?? hero.price : undefined;

  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 text-neutral-50">
      {/* Fundo brasa */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 30%, oklch(0.55 0.22 40 / 0.55), transparent 60%), radial-gradient(50% 50% at 15% 90%, oklch(0.65 0.19 60 / 0.35), transparent 70%), linear-gradient(180deg, oklch(0.14 0.03 40), oklch(0.09 0.02 40))",
        }}
      />
      {/* Ruído sutil */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-12 items-center gap-8 px-6 py-16 sm:py-24">
        {/* Texto */}
        <div className="col-span-12 lg:col-span-6">
          <SectionReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-300">
              <Flame className="h-3 w-3" /> {store.messages.heroKicker}
            </span>
          </SectionReveal>
          <h1 className="font-display mt-6 text-[clamp(3rem,9vw,6.5rem)] font-normal uppercase leading-[0.9] tracking-tight text-white">
            <WordReveal text={store.messages.heroTitle} className="block" />
          </h1>
          <SectionReveal delay={0.15}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">
              {store.messages.heroSubtitle}
            </p>
          </SectionReveal>

          <SectionReveal delay={0.25}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-orange-500 px-8 py-6 text-sm font-bold uppercase tracking-widest text-white shadow-[0_10px_40px_-10px_rgba(249,115,22,0.7)] hover:bg-orange-400"
              >
                <Link to="/demo/$storeSlug/produtos" params={{ storeSlug: store.slug }} search={{ q: "", cat: "", sort: "" }}>
                  Pedir agora <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Link
                to="/demo/$storeSlug/produtos"
                params={{ storeSlug: store.slug }}
                search={{ q: "", cat: "", sort: "" }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-300 transition hover:text-orange-200"
              >
                <Clock className="h-3 w-3 text-orange-300" /> Ver cardápio completo
              </Link>
            </div>
          </SectionReveal>

          {/* Combos rápidos */}
          <Stagger className="mt-10 grid grid-cols-3 gap-3 sm:gap-4" delay={0.35}>
            {store.categories.slice(0, 3).map((c) => (
              <StaggerItem key={c.slug}>
                <Link
                  to="/demo/$storeSlug/categoria/$categorySlug"
                  params={{ storeSlug: store.slug, categorySlug: c.slug }}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-orange-400/60 hover:bg-orange-500/10"
                >
                  <span className="text-xs uppercase tracking-widest text-neutral-400 group-hover:text-orange-200">
                    {c.name}
                  </span>
                  <ChevronRight className="mt-6 h-4 w-4 text-neutral-500 transition group-hover:text-orange-300 group-hover:translate-x-1" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* Prato */}
        <div className="relative col-span-12 lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-lg">
            {/* Halo de brasa */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, oklch(0.72 0.22 45 / 0.55), transparent 60%)" }}
            />
            <motion.img
              src={heroImage}
              alt={hero?.name ?? store.name}
              loading="eager"
              decoding="async"
              className="relative h-full w-full rounded-full object-cover shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
              initial={reduce ? undefined : { scale: 0.9, rotate: -6, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1, ease: MOTION.ease }}
            />
            {hero && price != null && (
              <motion.div
                initial={reduce ? undefined : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-4 right-2 max-w-[70%] rounded-2xl border border-white/10 bg-neutral-900/90 p-4 shadow-xl backdrop-blur"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-orange-300">Destaque do dia</div>
                <div className="mt-1 line-clamp-1 font-semibold">{hero.name}</div>
                <div className="mt-1 text-lg font-bold text-orange-300">{brl(price)}</div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}