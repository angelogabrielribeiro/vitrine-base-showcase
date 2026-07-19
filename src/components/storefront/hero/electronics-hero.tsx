import { Link } from "@tanstack/react-router";
import { ArrowRight, Cpu, Zap, ShieldCheck } from "lucide-react";
import type { NicheHeroProps } from "./niche-hero";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/format";
import { SectionReveal, Stagger, StaggerItem, MOTION } from "@/components/motion/primitives";
import { motion, useReducedMotion } from "framer-motion";

/**
 * NovaCore — palco técnico, produto em profundidade, hotspots de specs,
 * gradiente elétrico controlado. Movimento rápido e preciso.
 */
export function ElectronicsHero({ store, spotlight, featured }: NicheHeroProps) {
  const reduce = useReducedMotion();
  const hero = spotlight?.kind === "product" ? spotlight.product : featured[0] ?? null;
  const heroImage = hero?.images[0] ?? store.banners[0]?.image ?? "";
  const price = hero ? hero.salePrice ?? hero.price : undefined;

  return (
    <section className="relative isolate overflow-hidden bg-[#080b18] text-neutral-100">
      {/* Grid tech */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,150,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)",
        }}
      />
      {/* Glow elétrico */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 20%, rgba(56,189,248,0.22), transparent 60%), radial-gradient(50% 50% at 20% 80%, rgba(168,85,247,0.18), transparent 65%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-12 items-center gap-8 px-6 py-16 sm:py-24">
        {/* Coluna texto */}
        <div className="col-span-12 lg:col-span-6">
          <SectionReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
              <Cpu className="h-3 w-3" /> {store.messages.heroKicker}
            </div>
          </SectionReveal>
          <h1 className="mt-6 text-[clamp(2.75rem,7vw,5rem)] font-bold leading-[1.02] tracking-tight text-white">
            <SectionReveal>
              <span className="block">{store.messages.heroTitle}</span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <span
                className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent"
              >
                {store.tagline}
              </span>
            </SectionReveal>
          </h1>
          <SectionReveal delay={0.2}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">
              {store.messages.heroSubtitle}
            </p>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-md bg-white px-7 py-6 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-950 hover:bg-neutral-100"
              >
                <Link to="/demo/$storeSlug/produtos" params={{ storeSlug: store.slug }} search={{ q: "", cat: "", sort: "" }}>
                  {store.messages.heroCta} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {hero && (
                <Link
                  to="/demo/$storeSlug/produto/$productSlug"
                  params={{ storeSlug: store.slug, productSlug: hero.slug }}
                  className="text-xs uppercase tracking-[0.3em] text-cyan-200 hover:text-white"
                >
                  Ver {hero.name} →
                </Link>
              )}
            </div>
          </SectionReveal>

          {/* Faixa de destaques neutros */}
          <Stagger className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <StaggerItem>
              <SpecPill icon={<Cpu className="h-3.5 w-3.5" />} label="Catálogo técnico" />
            </StaggerItem>
            <StaggerItem>
              <SpecPill icon={<Zap className="h-3.5 w-3.5" />} label="Lançamentos" />
            </StaggerItem>
            <StaggerItem>
              <SpecPill icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Curadoria NovaCore" />
            </StaggerItem>
          </Stagger>
        </div>

        {/* Produto em palco */}
        <div className="relative col-span-12 lg:col-span-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            {/* Palco */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-[2rem]"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(56,189,248,0.18)), radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.15), transparent 60%)",
              }}
            />
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 24, rotateX: 12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, ease: MOTION.ease }}
              className="relative h-full w-full [transform-style:preserve-3d]"
            >
              <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-[#0b1024] p-3 shadow-[0_40px_120px_-30px_rgba(56,189,248,0.4)]">
                <img
                  src={heroImage}
                  alt={hero?.name ?? store.name}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full rounded-[1.5rem] object-cover"
                />
              </div>

              {/* Hotspots com dados reais */}
              {hero && (
                <>
                  <SpecTag
                    className="left-[-10%] top-[18%]"
                    label="Modelo"
                    value={hero.name}
                    delay={0.4}
                  />
                  {price != null && (
                    <SpecTag
                      className="left-[-8%] bottom-[8%]"
                      label="A partir de"
                      value={brl(price)}
                      delay={0.7}
                      accent
                    />
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-neutral-300">
      <span className="grid h-7 w-7 place-items-center rounded-md border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
        {icon}
      </span>
      {label}
    </div>
  );
}

function SpecTag({
  label,
  value,
  className,
  delay = 0,
  accent = false,
}: {
  label: string;
  value: string;
  className?: string;
  delay?: number;
  accent?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: MOTION.ease }}
      className={
        "absolute hidden min-w-[140px] rounded-lg border p-3 backdrop-blur-md sm:block " +
        (accent
          ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100 shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)]"
          : "border-white/15 bg-white/[0.06] text-neutral-100") +
        " " +
        (className ?? "")
      }
    >
      <div className="text-[10px] uppercase tracking-[0.3em] opacity-70">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </motion.div>
  );
}