import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Home, LayoutGrid, MapPin } from "lucide-react";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

const routeNodes = [
  { label: "Início", className: "left-[8%] top-[18%]" },
  { label: "Demos", className: "right-[8%] top-[22%]" },
  { label: "Planos", className: "bottom-[16%] left-[15%]" },
  { label: "Painel", className: "bottom-[13%] right-[12%]" },
];

export function NotFoundPage() {
  const { capabilities } = useCinematicMotion();
  const reduceMotion = capabilities.hydrated && capabilities.reducedMotion;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070a] px-4 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.12),transparent_30%),radial-gradient(circle_at_82%_24%,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.1),transparent_36%)]"
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col py-6 sm:py-8">
        <Link
          to="/"
          className="self-start font-semibold tracking-[0.22em] text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
        >
          VITRINE BASE
        </Link>

        <section
          aria-labelledby="not-found-title"
          className="my-auto grid items-center gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="max-w-xl">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200"
            >
              Rota não encontrada
            </motion.p>
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 font-display text-[clamp(5.5rem,18vw,11rem)] font-light leading-[0.78] tracking-[-0.08em] text-white"
            >
              404
            </motion.h1>
            <h2
              id="not-found-title"
              className="mt-8 max-w-lg font-display text-3xl font-light tracking-[-0.04em] text-white sm:text-5xl"
            >
              Esta página saiu da rota, mas o projeto continua logo ali.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/62">
              O endereço pode ter mudado ou não existir. Volte para a página principal ou explore as
              demonstrações da Vitrine Base.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
              >
                <Home className="h-4 w-4" aria-hidden="true" /> Voltar ao início
              </Link>
              <a
                href="/#demonstracoes"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.045] px-6 py-3 text-sm font-semibold text-white transition hover:border-amber-300/40 hover:bg-amber-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
              >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" /> Ver demonstrações
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-amber-300/10 via-transparent to-cyan-300/15 blur-3xl"
            />
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/35 backdrop-blur-xl">
              <svg
                className="absolute inset-0 h-full w-full opacity-45"
                viewBox="0 0 600 600"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M100 150C180 70 255 230 325 145C405 45 495 120 500 205C505 300 370 290 360 390C350 500 190 515 120 430C55 350 170 285 100 150Z"
                  stroke="url(#route-gradient)"
                  strokeWidth="3"
                  strokeDasharray="12 14"
                />
                <defs>
                  <linearGradient id="route-gradient" x1="80" y1="90" x2="520" y2="500">
                    <stop stopColor="#fcd34d" />
                    <stop offset="1" stopColor="#67e8f9" />
                  </linearGradient>
                </defs>
              </svg>

              {routeNodes.map((node, index) => (
                <motion.div
                  key={node.label}
                  className={`absolute ${node.className} rounded-full border border-white/15 bg-black/55 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/72 backdrop-blur-md`}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: [0, index % 2 === 0 ? -6 : 6, 0],
                          opacity: [0.72, 1, 0.72],
                        }
                  }
                  transition={{
                    duration: 4 + index * 0.45,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {node.label}
                </motion.div>
              ))}

              <motion.div
                className="absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-200/25 bg-[#071018]/90 shadow-[0_0_65px_rgba(34,211,238,0.18)]"
                animate={reduceMotion ? undefined : { rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Compass className="h-16 w-16 text-cyan-200" strokeWidth={1.2} aria-hidden="true" />
              </motion.div>

              <motion.div
                className="absolute left-[53%] top-[28%] text-amber-300"
                animate={reduceMotion ? undefined : { y: [0, -10, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <MapPin
                  className="h-9 w-9 drop-shadow-[0_0_18px_rgba(251,191,36,.45)]"
                  aria-hidden="true"
                />
              </motion.div>

              <div className="absolute inset-x-0 bottom-8 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs text-white/55 backdrop-blur-md">
                  <ArrowLeft className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                  Escolha uma rota segura para continuar
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
