import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  LayoutDashboard,
  MessageCircle,
  PackageSearch,
  Sparkles,
  Store,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

type OfferConfiguratorProps = {
  proposalUrl: string;
};

type Goal = {
  id: string;
  label: string;
  question: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  recommendedPlan: number;
  extra: string;
};

type Plan = {
  name: string;
  eyebrow: string;
  price: string;
  prefix?: string;
  description: string;
  features: string[];
};

const GOALS: Goal[] = [
  {
    id: "vender",
    label: "Vender online",
    question: "Quero transformar produto em pedido",
    description: "Vitrine, catálogo, carrinho e atendimento organizados numa jornada de compra.",
    icon: Store,
    accent: "#d58c9a",
    recommendedPlan: 1,
    extra: "Catálogo, checkout e painel entram no centro da experiência.",
  },
  {
    id: "agendar",
    label: "Organizar agenda",
    question: "Quero reduzir mensagens manuais",
    description: "Serviços, profissionais e horários apresentados para o cliente reservar sozinho.",
    icon: CalendarDays,
    accent: "#d8ae57",
    recommendedPlan: 2,
    extra: "Agenda, regras personalizadas e confirmação ganham prioridade.",
  },
  {
    id: "marca",
    label: "Elevar a marca",
    question: "Quero uma presença impossível de confundir",
    description: "Direção visual, conteúdo e movimento próprios para posicionar o negócio.",
    icon: Sparkles,
    accent: "#9275f5",
    recommendedPlan: 1,
    extra: "Identidade, narrativa e componentes exclusivos conduzem o projeto.",
  },
  {
    id: "operacao",
    label: "Integrar operação",
    question: "Quero vender, atender e controlar no mesmo lugar",
    description: "Site, fluxos comerciais e painel pensados como uma única ferramenta.",
    icon: LayoutDashboard,
    accent: "#65dde9",
    recommendedPlan: 2,
    extra: "Painel, permissões e integrações adicionais formam o núcleo.",
  },
];

const PLANS: Plan[] = [
  {
    name: "Essencial",
    eyebrow: "Começar com estrutura",
    price: "1.190",
    description:
      "Para uma operação direta, com uma unidade, catálogo menor e tudo o que precisa para funcionar bem.",
    features: [
      "Identidade visual adaptada ao negócio",
      "Site responsivo para celular e computador",
      "Google Analytics 4 + Google Search Console",
      "Medição de visitas, origem do tráfego e cliques principais",
      "Painel e catálogo quando aplicáveis",
      "WhatsApp, pedidos e pagamento conforme escopo",
      "Até 2 rodadas de ajustes",
    ],
  },
  {
    name: "Recomendado",
    eyebrow: "Equilíbrio para crescer",
    price: "1.590",
    description:
      "Mais profundidade visual, conteúdo e controle para transformar o site em uma operação comercial completa.",
    features: [
      "Tudo do plano Essencial",
      "Mais páginas, seções e produtos",
      "Personalização visual aprofundada",
      "Eventos principais de conversão configurados conforme o projeto",
      "Painel e fluxos mais completos",
      "Até 3 rodadas de ajustes",
    ],
  },
  {
    name: "Premium",
    eyebrow: "Operações avançadas",
    prefix: "A partir de",
    price: "2.190",
    description:
      "Para múltiplas unidades, agendamento próprio, perfis de acesso e integrações que exigem projeto dedicado.",
    features: [
      "Tudo do plano Recomendado",
      "Múltiplas unidades ou profissionais",
      "Agendamento e regras personalizadas",
      "Perfis de acesso e integrações adicionais",
      "Mensuração avançada e integrações de conversão previstas em escopo",
      "Componentes e movimento exclusivos",
    ],
  },
];

const CORE_ICONS = [Store, PackageSearch, MessageCircle, LayoutDashboard];

export function OfferConfigurator({ proposalUrl }: OfferConfiguratorProps) {
  const { capabilities } = useCinematicMotion();
  const reduced = capabilities.hydrated && capabilities.reducedMotion;
  const [goalIndex, setGoalIndex] = useState(0);
  const [planIndex, setPlanIndex] = useState(GOALS[0].recommendedPlan);
  const [userSelectedPlan, setUserSelectedPlan] = useState(false);
  const goal = GOALS[goalIndex];
  const plan = PLANS[planIndex];

  const chooseGoal = (index: number) => {
    setGoalIndex(index);
    if (!userSelectedPlan) setPlanIndex(GOALS[index].recommendedPlan);
  };

  return (
    <section
      id="configurador"
      data-testid="offer-configurator"
      className="relative isolate overflow-hidden border-y border-white/10 bg-vb-canvas py-24 text-white sm:py-32"
      style={{ ["--offer-accent" as string]: goal.accent }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        animate={
          reduced
            ? undefined
            : {
                background: [
                  "radial-gradient(circle at 18% 20%, " +
                    goal.accent +
                    "25, transparent 36%), radial-gradient(circle at 82% 76%, #65dde919, transparent 34%)",
                  "radial-gradient(circle at 24% 28%, " +
                    goal.accent +
                    "36, transparent 40%), radial-gradient(circle at 76% 68%, #9275f524, transparent 38%)",
                  "radial-gradient(circle at 18% 20%, " +
                    goal.accent +
                    "25, transparent 36%), radial-gradient(circle at 82% 76%, #65dde919, transparent 34%)",
                ],
              }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={
          reduced
            ? {
                background:
                  "radial-gradient(circle at 20% 24%, " +
                  goal.accent +
                  "30, transparent 38%), radial-gradient(circle at 80% 72%, #65dde91f, transparent 36%)",
              }
            : undefined
        }
      />
      <div aria-hidden="true" className="vb-noise absolute inset-0 opacity-25" />

      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="vb-kicker">Monte o núcleo do projeto</p>
            <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-7xl">
              Não escolha um card.
              <span className="block" style={{ color: goal.accent }}>
                Configure uma direção.
              </span>
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/58">
            Selecione o objetivo e o nível de escopo. A interface reorganiza o projeto para mostrar
            o que passa a ser prioridade — sem inventar preço, prazo ou funcionalidade.
          </p>
        </div>

        <div className="mt-14 grid gap-6 xl:grid-cols-[0.72fr_1.08fr_0.88fr]">
          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/42">
              1 · Qual transformação?
            </p>
            <div className="mt-5 grid gap-2">
              {GOALS.map((item, index) => (
                <button
                  key={item.id}
                  data-testid="offer-goal"
                  type="button"
                  onClick={() => chooseGoal(index)}
                  aria-pressed={goalIndex === index}
                  className="group flex min-h-16 w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vb-gold"
                  style={{
                    borderColor: goalIndex === index ? item.accent + "88" : "rgba(255,255,255,.08)",
                    background: goalIndex === index ? item.accent + "18" : "rgba(255,255,255,.025)",
                  }}
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border"
                    style={{ borderColor: item.accent + "66", color: item.accent }}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{item.label}</span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-white/45">
                      {item.question}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/12 bg-black/35 p-6 shadow-2xl shadow-black/30 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(circle at 50% 48%, " + goal.accent + "40, transparent 34%)",
              }}
            />
            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.22em]"
                    style={{ color: goal.accent }}
                  >
                    Núcleo em tempo real
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={goal.id}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-5xl"
                    >
                      {goal.label}
                    </motion.h3>
                  </AnimatePresence>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.17em] text-white/45">
                  interativo
                </span>
              </div>

              <div className="relative my-8 grid min-h-[18rem] place-items-center [perspective:900px]">
                <motion.div
                  aria-hidden="true"
                  className="absolute h-56 w-56 rounded-full border border-white/12"
                  animate={reduced ? undefined : { rotateX: [62, 70, 62], rotateZ: 360 }}
                  transition={{
                    rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    rotateZ: { duration: 24, repeat: Infinity, ease: "linear" },
                  }}
                  style={{ boxShadow: "0 0 80px -20px " + goal.accent }}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute h-40 w-40 rounded-full border border-dashed"
                  animate={reduced ? undefined : { rotate: -360, scale: [0.96, 1.06, 0.96] }}
                  transition={{
                    rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  style={{ borderColor: goal.accent + "66" }}
                />
                <motion.div
                  layout
                  className="relative z-10 grid h-28 w-28 place-items-center rounded-full border bg-black/70 backdrop-blur-xl"
                  style={{
                    borderColor: goal.accent + "88",
                    boxShadow: "0 0 70px -12px " + goal.accent,
                  }}
                  animate={reduced ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <goal.icon className="h-8 w-8" style={{ color: goal.accent }} aria-hidden="true" />
                </motion.div>
                {CORE_ICONS.map((Icon, index) => (
                  <motion.span
                    key={index}
                    aria-hidden="true"
                    className="absolute grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-black/70 text-white/60 backdrop-blur-lg"
                    animate={
                      reduced
                        ? undefined
                        : {
                            x: [
                              Math.cos((index * Math.PI) / 2) * 112,
                              Math.cos((index * Math.PI) / 2 + Math.PI * 2) * 112,
                            ],
                            y: [
                              Math.sin((index * Math.PI) / 2) * 74,
                              Math.sin((index * Math.PI) / 2 + Math.PI * 2) * 74,
                            ],
                          }
                    }
                    style={
                      reduced
                        ? {
                            transform:
                              "translate(" +
                              Math.cos((index * Math.PI) / 2) * 112 +
                              "px," +
                              Math.sin((index * Math.PI) / 2) * 74 +
                              "px)",
                          }
                        : undefined
                    }
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.span>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={goal.id + plan.name}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="mt-auto rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <p className="text-sm leading-6 text-white/70">{goal.description}</p>
                  <p className="mt-3 text-xs leading-5" style={{ color: goal.accent }}>
                    {goal.extra}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/42">
              2 · Qual profundidade?
            </p>
            <div className="mt-5 flex gap-2 rounded-2xl border border-white/8 bg-black/20 p-1.5">
              {PLANS.map((item, index) => (
                <button
                  key={item.name}
                  data-testid="offer-plan"
                  type="button"
                  onClick={() => {
                    setPlanIndex(index);
                    setUserSelectedPlan(true);
                  }}
                  aria-pressed={planIndex === index}
                  className="min-h-10 flex-1 rounded-xl px-2 text-[11px] font-bold uppercase tracking-[0.1em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vb-gold"
                  style={{
                    color: planIndex === index ? "#050608" : "rgba(255,255,255,.5)",
                    background: planIndex === index ? goal.accent : "transparent",
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={plan.name}
                initial={reduced ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  {plan.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-4xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">{plan.description}</p>
                <div className="my-6 border-y border-white/10 py-5">
                  {plan.prefix && (
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                      {plan.prefix}
                    </p>
                  )}
                  <p className="mt-1 font-display text-5xl font-semibold tracking-[-0.05em]">
                    <span className="mr-2 text-base text-white/45">R$</span>
                    {plan.price}
                  </p>
                  <p className="mt-2 text-xs text-white/42">
                    50% para iniciar · 50% após aprovação, antes da publicação
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-white/70">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: goal.accent }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <a
              href={proposalUrl}
              target="_blank"
              rel="noreferrer"
              className="vb-button-primary mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 py-3"
            >
              Conversar sobre esta direção
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="mt-4 text-center text-[11px] leading-5 text-white/35">
              Prazo e composição final são definidos depois do escopo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}