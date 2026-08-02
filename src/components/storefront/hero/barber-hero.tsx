import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import type { NicheHeroProps } from "./niche-hero";
import { Button } from "@/components/ui/button";
import {
  SectionReveal,
  WordReveal,
  Stagger,
  StaggerItem,
  MOTION,
} from "@/components/motion/primitives";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { useAdaptiveQuality } from "@/hooks/use-adaptive-quality";

/**
 * Barber Noir — cinematográfico, ritual e ambiente.
 * CTA principal único = "Agendar horário". Produto/serviço é ambiente, não protagonista.
 *
 * Desktop: profundidade por scroll e luz responsiva ao cursor.
 * Mobile: reveal e profundidade são conduzidos pelo scroll, sem long press.
 */
export function BarberHero({ store }: NicheHeroProps) {
  const banner = store.banners[0];
  const reduce = useReducedMotion();
  const { isMobile } = useAdaptiveQuality();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, isMobile || reduce ? 0 : 90]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, isMobile || reduce ? 0 : 40]);

  const sweepX = useMotionValue(50);
  const sweepY = useMotionValue(35);
  const sweepBackground = useTransform(
    [sweepX, sweepY],
    ([x, y]: number[]) =>
      `radial-gradient(480px circle at ${x}% ${y}%, rgba(217,178,89,0.13), transparent 65%)`,
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (isMobile || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    sweepX.set(((event.clientX - rect.left) / rect.width) * 100);
    sweepY.set(((event.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative isolate min-h-[92vh] overflow-hidden bg-neutral-950 text-neutral-100"
    >
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <motion.div
          initial={reduce ? undefined : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: MOTION.ease }}
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${banner?.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/50" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 mix-blend-soft-light"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 68px, rgba(255,255,255,0.05) 68px 69px)",
          }}
        />
        {!isMobile && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden mix-blend-soft-light lg:block"
            style={{ background: sweepBackground }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </motion.div>

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-6 text-[10px] uppercase tracking-[0.4em] text-amber-200/80">
        <span className="inline-flex items-center gap-2">
          <span className="h-px w-8 bg-amber-200/60" />
          {store.messages.heroKicker}
        </span>
        <span className="hidden items-center gap-2 sm:inline-flex">
          <MapPin className="h-3 w-3" /> {store.address.split("—")[1]?.trim() ?? "São Paulo"}
        </span>
      </div>

      <motion.div
        style={{ y: contentY }}
        className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-end gap-8 px-6 pb-28 pt-24 sm:gap-10 sm:pb-24"
      >
        <div className="max-w-[26ch] sm:max-w-3xl">
          <h1 className="font-display text-[clamp(2.6rem,12vw,7rem)] font-normal uppercase leading-[0.92] tracking-tight text-white">
            <WordReveal text={store.messages.heroTitle} className="block" />
          </h1>
          <SectionReveal delay={0.2}>
            <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-neutral-300 sm:mt-8 sm:max-w-xl sm:text-lg">
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
      </motion.div>
    </section>
  );
}