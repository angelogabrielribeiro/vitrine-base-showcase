import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import type { NicheHeroProps } from "./niche-hero";
import { Button } from "@/components/ui/button";
import { SectionReveal, WordReveal, Stagger, StaggerItem, MOTION } from "@/components/motion/primitives";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Barber Noir — cinematográfico, ritual e ambiente.
 * CTA principal único = "Agendar horário". Produto/serviço é ambiente, não protagonista.
 */
export function BarberHero({ store }: NicheHeroProps) {
  const banner = store.banners[0];
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Imagem de fundo cinematográfica */}
      <div className="absolute inset-0">
        <motion.div
          initial={reduce ? undefined : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: MOTION.ease }}
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${banner?.image})` }}
        />
        {/* Gradiente vertical */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/50" />
        {/* Ranhuras de luz — sem partículas */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 mix-blend-soft-light"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 68px, rgba(255,255,255,0.05) 68px 69px)",
          }}
        />
        {/* Vinheta */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>

      {/* Barra topo */}
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-6 text-[10px] uppercase tracking-[0.4em] text-amber-200/80">
        <span className="inline-flex items-center gap-2">
          <span className="h-px w-8 bg-amber-200/60" />
          {store.messages.heroKicker}
        </span>
        <span className="hidden items-center gap-2 sm:inline-flex">
          <MapPin className="h-3 w-3" /> {store.address.split("—")[1]?.trim() ?? "São Paulo"}
        </span>
      </div>

      {/* Conteúdo hero */}
      <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-end gap-10 px-6 pb-24 pt-24">
        <div className="max-w-3xl">
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] font-normal uppercase leading-[0.9] tracking-tight text-white">
            <WordReveal text={store.messages.heroTitle} className="block" />
          </h1>
          <SectionReveal delay={0.2}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              {store.messages.heroSubtitle}
            </p>
          </SectionReveal>
        </div>

        <Stagger className="flex flex-wrap items-center gap-4" delay={0.3}>
          <StaggerItem>
            <Button
              asChild
              size="lg"
              className="rounded-none bg-amber-300 px-8 py-6 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-950 hover:bg-amber-200"
            >
              <Link to="/demo/$storeSlug/agendar" params={{ storeSlug: store.slug }}>
                <CalendarDays className="mr-2 h-4 w-4" /> Agendar horário
              </Link>
            </Button>
          </StaggerItem>
          <StaggerItem>
            <Link
              to="/demo/$storeSlug/produtos"
              params={{ storeSlug: store.slug }}
              search={{ q: "", cat: "", sort: "" }}
              className="inline-flex items-center gap-2 border-b border-neutral-500 pb-1 text-xs uppercase tracking-[0.35em] text-neutral-300 transition hover:border-amber-300 hover:text-amber-200"
            >
              Grooming da casa
            </Link>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}