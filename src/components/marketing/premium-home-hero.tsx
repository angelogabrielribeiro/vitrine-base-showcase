import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight, BadgeCheck, Check, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CursorParallax } from "@/components/motion/cinematic-motion-system";

export type PremiumHeroItem = {
  title: string;
  subtitle: string;
  image: string;
  href?: string;
};

type PremiumHomeHeroProps = {
  items: PremiumHeroItem[];
  proposalUrl: string;
  reducedMotion: boolean;
  demoNotice: string;
};

const CARD_POSITIONS = [
  "left-[4%] top-[7%] w-[54%] -rotate-[8deg]",
  "right-[2%] top-[19%] w-[52%] rotate-[7deg]",
  "bottom-[5%] left-[12%] w-[48%] rotate-[4deg]",
  "bottom-[2%] right-[4%] w-[46%] -rotate-[5deg]",
];

export function PremiumHomeHero({
  items,
  proposalUrl,
  reducedMotion,
  demoNotice,
}: PremiumHomeHeroProps) {
  const visibleItems = items.slice(0, 4);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [touchCapable, setTouchCapable] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [pressedCard, setPressedCard] = useState<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setTouchCapable(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!touchCapable || activeCard === null) return;
    const closeWhenOutside = (event: PointerEvent) => {
      if (!cardsRef.current?.contains(event.target as Node)) setActiveCard(null);
    };
    document.addEventListener("pointerdown", closeWhenOutside);
    return () => document.removeEventListener("pointerdown", closeWhenOutside);
  }, [activeCard, touchCapable]);

  return (
    <section
      id="inicio"
      className="vb-hero-shell relative isolate scroll-mt-20 overflow-hidden border-b border-white/10"
    >
      <div aria-hidden="true" className="vb-pointer-aura absolute inset-0" />
      <div aria-hidden="true" className="vb-noise absolute inset-0 opacity-35" />
      <div aria-hidden="true" className="vb-hero-grid absolute inset-0" />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-[90rem] gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12">
        <div className="relative z-20 max-w-4xl">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="vb-kicker">Design + tecnologia para negócios locais</span>
            <span className="h-px w-12 bg-vb-gold/60" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              Estratégia · experiência · operação
            </span>
          </motion.div>

          <div className="mt-7 overflow-hidden">
            <motion.h1
              initial={reducedMotion ? false : { y: "105%", rotate: 1.5 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-display text-[clamp(3.35rem,7vw,7.6rem)] font-semibold leading-[0.86] tracking-[-0.065em] text-vb-ivory"
            >
              Sites que o cliente sente
              <span className="block text-vb-gold">antes de entender.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.72,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 max-w-2xl text-base leading-8 text-white/66 sm:text-lg"
          >
            Criamos experiências digitais com identidade, movimento e ferramentas reais para vender,
            atender e organizar a operação. Não é uma troca de cores em template: cada negócio ganha
            uma presença própria.
          </motion.p>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.68,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <motion.a
              href={proposalUrl}
              target="_blank"
              rel="noreferrer"
              whileHover={reducedMotion ? undefined : { scale: 1.025, y: -2 }}
              whileTap={reducedMotion ? undefined : { scale: 0.975 }}
              className="vb-button-primary group inline-flex min-h-14 items-center justify-center gap-3 px-7 py-4"
            >
              Quero um site assim
              <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6" />
            </motion.a>
            <motion.a
              href="#experiencia"
              whileHover={reducedMotion ? undefined : { x: 3 }}
              whileTap={reducedMotion ? undefined : { scale: 0.985 }}
              className="vb-button-secondary group inline-flex min-h-14 items-center justify-center gap-3 px-7 py-4"
            >
              Entrar nas experiências
              <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
            </motion.a>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-white/54"
          >
            {[
              "Identidade visual própria",
              "Motion adaptativo por dispositivo",
              "Fluxos e painel conforme o escopo",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-vb-gold" aria-hidden="true" />
                {item}
              </span>
            ))}
          </motion.div>

          <details className="mt-8 max-w-xl border-t border-white/10 pt-4 text-sm text-white/55">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vb-cyan">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-vb-gold" aria-hidden="true" />O que é
                demonstrativo aqui?
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-vb-cyan">Abrir</span>
            </summary>
            <p className="pb-2 pt-3 leading-6">{demoNotice}</p>
          </details>
        </div>

        <motion.div
          ref={cardsRef}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.94, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 min-h-[31rem] lg:min-h-[43rem]"
        >
          <CursorParallax className="absolute inset-0" strengthX={18} strengthY={14}>
            <div className="absolute inset-[8%] rounded-[42%] border border-vb-cyan/20 bg-vb-cyan/[0.035] shadow-[0_0_100px_rgba(101,221,233,0.13)]" />
            <div className="absolute inset-[18%] rotate-12 rounded-[38%] border border-vb-violet/25" />

            {visibleItems.map((item, index) => {
              const touchActive = touchCapable && activeCard === index;
              const touchPressed = touchCapable && pressedCard === index;

              return (
                <motion.article
                  key={item.title}
                  data-testid="hero-portal-card"
                  data-touch-active={touchActive ? "true" : "false"}
                  tabIndex={0}
                  aria-label={`${item.title}. ${touchActive ? "Detalhes revelados" : "Toque para revelar detalhes"}.`}
                  onPointerDown={() => {
                    if (!touchCapable) return;
                    setPressedCard(index);
                    setActiveCard((current) => (current === index ? null : index));
                  }}
                  onPointerUp={() => setPressedCard(null)}
                  onPointerCancel={() => setPressedCard(null)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    setActiveCard((current) => (current === index ? null : index));
                  }}
                  animate={
                    reducedMotion
                      ? undefined
                      : touchPressed
                        ? { y: 2, scale: 0.975 }
                        : {
                            y: [0, index % 2 === 0 ? -9 : 10, 0],
                            rotateZ: [0, index % 2 === 0 ? 1.2 : -1.1, 0],
                            scale: touchActive ? 1.035 : 1,
                          }
                  }
                  transition={
                    touchPressed
                      ? { duration: 0.18 }
                      : {
                          duration: touchActive ? 0.42 : 5.4 + index * 0.65,
                          repeat: touchActive ? 0 : Infinity,
                          ease: "easeInOut",
                          delay: touchActive ? 0 : index * 0.35,
                        }
                  }
                  className={`group absolute touch-manipulation overflow-hidden rounded-[1.6rem] border bg-black/45 p-2 shadow-2xl shadow-black/45 backdrop-blur-xl outline-none transition-[border-color,box-shadow] duration-500 focus-visible:ring-2 focus-visible:ring-vb-cyan ${touchActive ? "border-vb-gold/65 shadow-vb-gold/20" : "border-white/15"} ${CARD_POSITIONS[index]}`}
                  style={{ zIndex: touchActive ? 35 : 10 + index }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.15rem]">
                    <img
                      src={item.image}
                      alt={`Prévia de ${item.title}`}
                      className={`h-full w-full object-cover transition duration-700 ${touchActive ? "scale-105" : "group-hover:scale-105"}`}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-white/5" />
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 bg-gradient-to-br from-vb-gold/0 via-transparent to-vb-cyan/0 transition duration-500 ${touchActive ? "from-vb-gold/22 to-vb-cyan/18" : "group-hover:from-vb-gold/10 group-hover:to-vb-cyan/10"}`}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-vb-gold">
                        {item.subtitle}
                      </p>
                      <p className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
                        {item.title}
                      </p>
                      {touchCapable && (
                        <p
                          className={`mt-2 text-[9px] font-bold uppercase tracking-[0.16em] transition ${touchActive ? "text-white/70" : "text-white/42"}`}
                        >
                          {touchActive ? "Experiência pronta para abrir" : "Toque para explorar"}
                        </p>
                      )}
                    </div>

                    <motion.a
                      href={item.href ?? "#demonstracoes"}
                      aria-label={`Abrir ${item.title}`}
                      tabIndex={touchActive ? 0 : -1}
                      onPointerDown={(event) => event.stopPropagation()}
                      animate={{
                        opacity: touchActive ? 1 : 0,
                        y: touchActive ? 0 : 10,
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`absolute right-3 top-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-xl ${touchActive ? "pointer-events-auto" : "pointer-events-none"}`}
                    >
                      Abrir <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </motion.a>
                  </div>
                </motion.article>
              );
            })}

            <div className="absolute left-1/2 top-1/2 z-30 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-vb-gold/30 bg-black/70 shadow-[0_0_70px_rgba(216,174,87,0.22)] backdrop-blur-xl">
              <div className="absolute inset-2 animate-[spin_18s_linear_infinite] rounded-full border border-dashed border-white/25 motion-reduce:animate-none" />
              <span className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-vb-ivory">
                Explore
              </span>
            </div>
          </CursorParallax>

          <a
            href="#demonstracoes"
            className="absolute bottom-0 right-0 z-40 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/55 transition hover:text-vb-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vb-gold"
          >
            Ver os quatro projetos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 items-center gap-3 pb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/35 lg:flex"
      >
        <span className="h-px w-10 bg-white/20" />
        Role para atravessar os universos
        <span className="h-px w-10 bg-white/20" />
      </div>
    </section>
  );
}
