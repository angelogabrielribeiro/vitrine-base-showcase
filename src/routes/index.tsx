import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  Utensils,
  Scissors,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Smartphone,
  LayoutDashboard,
  CalendarDays,
  Cpu,
  BadgeCheck,
  Clock3,
  Search,
  TrendingUp,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { STORES } from "@/config/stores";
import { DEMO_LABEL } from "@/lib/demo-mode";
import { AnimatedGradient } from "@/components/effects/AnimatedGradient";
import { PulsingBorder } from "@/components/effects/PulsingBorder";
import { InteractiveTiltCard } from "@/components/effects/InteractiveTiltCard";
import { InteractiveProductFolder } from "@/components/effects/InteractiveProductFolder";
import { PricingPreview } from "@/components/pricing/pricing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitrine Base — Sites que ajudam o negócio a vender e operar melhor" },
      {
        name: "description",
        content:
          "Sites e webapps para gerar confiança, organizar pedidos e agendamentos e transformar visitas em oportunidades para negócios locais.",
      },
      {
        property: "og:title",
        content: "Vitrine Base — Presença que gera confiança. Operação que ajuda a vender.",
      },
      {
        property: "og:description",
        content:
          "Demonstrações de lojas, restaurantes e serviços com catálogo, pedidos, agendamento e painel administrativo.",
      },
    ],
  }),
  component: Index,
});

const NICHE_ICON: Record<string, typeof ShoppingBag> = {
  fashion: ShoppingBag,
  barber: Scissors,
  restaurant: Utensils,
  electronics: Cpu,
};

const FEATURES = [
  { icon: Smartphone, title: "Loja virtual responsiva", desc: "Mobile-first, rápida e acessível." },
  {
    icon: ShoppingBag,
    title: "Produtos e estoque",
    desc: "Catálogo com variantes, adicionais e imagens.",
  },
  {
    icon: CalendarDays,
    title: "Agendamento online",
    desc: "Serviço, profissional, data e horário.",
  },
  {
    icon: ShieldCheck,
    title: "Checkout completo",
    desc: "Pix, cartão, dinheiro e cupom demonstrativo.",
  },
  {
    icon: Sparkles,
    title: "Painel administrativo",
    desc: "Produtos, pedidos e configurações em tempo real.",
  },
  {
    icon: MessageCircle,
    title: "Integração WhatsApp",
    desc: "Contato e pós-venda direto pelo aplicativo.",
  },
];

const BUSINESS_OUTCOMES = [
  {
    icon: Clock3,
    pain: "Atendimento preso no WhatsApp",
    outcome: "Catálogo e informações disponíveis sem depender de resposta imediata.",
    proof: "Preço, opções, horários e políticas ficam claros antes do contato.",
  },
  {
    icon: BadgeCheck,
    pain: "Cliente inseguro para comprar",
    outcome: "Marca, domínio, políticas e jornada profissional no mesmo lugar.",
    proof: "Mais sinais de confiança antes do pedido, pagamento ou agendamento.",
  },
  {
    icon: TrendingUp,
    pain: "Interesse que não vira ação",
    outcome: "Menos atrito para pedir, comprar, agendar ou chamar no WhatsApp.",
    proof: "Checkout sem conta obrigatória e chamadas claras para a próxima etapa.",
  },
  {
    icon: RefreshCw,
    pain: "Pedidos e agenda desorganizados",
    outcome: "Painel central para acompanhar a operação e atualizar o cliente.",
    proof: "Produtos, pedidos, agendamentos e status reunidos em um fluxo.",
  },
  {
    icon: Search,
    pain: "Dependência total das redes sociais",
    outcome: "Uma base própria para Google, campanhas, conteúdo e indicações.",
    proof: "O site vira o destino oficial da marca, sem substituir Instagram e WhatsApp.",
  },
  {
    icon: BarChart3,
    pain: "Não saber se o digital dá retorno",
    outcome: "Metas e eventos definidos para acompanhar o que realmente importa.",
    proof: "Cliques, pedidos, agendamentos e abandono podem ser medidos no projeto final.",
  },
];

function Index() {
  const [ready, setReady] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>(STORES[0]?.slug ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("vb-preloaded") === "1") {
        setReady(true);
        return;
      }
      sessionStorage.setItem("vb-preloaded", "1");
    } catch {
      setReady(true);
      return;
    }
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const selected = useMemo(
    () => STORES.find((s) => s.slug === selectedSlug) ?? STORES[0],
    [selectedSlug],
  );

  const folderItems = useMemo(
    () =>
      STORES.flatMap((s) =>
        s.banners.map((b) => ({ title: s.name, subtitle: s.tagline, image: b.image })),
      ),
    [],
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-neutral-950"
          >
            <div className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full border-2 border-amber-300/30 border-t-amber-300 animate-spin" />
              <div className="mt-4 font-semibold tracking-[0.35em] text-amber-300 text-xs">
                VITRINE BASE
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 text-xs">
          <span className="font-semibold tracking-widest text-amber-300">VITRINE BASE</span>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/planos"
              className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/80 transition hover:border-cyan-300/40 hover:text-cyan-100"
            >
              Ver planos
            </Link>
            <span className="hidden rounded-full border border-amber-300/40 px-2 py-0.5 text-[10px] text-amber-200 sm:inline-flex">
              {DEMO_LABEL}
            </span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <AnimatedGradient colors={["#f59e0b", "#a855f7", "#0ea5e9"]} intensity={0.35} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300"
          >
            Estrutura comercial e operacional
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 text-4xl font-bold leading-tight sm:text-6xl"
          >
            Credibilidade para ser escolhido.{" "}
            <span className="text-amber-300">Operação para vender melhor.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-2xl text-base text-neutral-300 sm:text-lg"
          >
            Sites e webapps que transformam catálogo espalhado, atendimento manual e processos
            confusos em uma jornada clara para o cliente e para quem administra o negócio.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mt-7"
          >
            <Link
              to="/planos"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
            >
              Conhecer planos e valores <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Seletor interativo */}
          <div className="mt-10 flex flex-wrap gap-2">
            {STORES.map((s) => {
              const Icon = NICHE_ICON[s.niche] ?? ShoppingBag;
              const active = s.slug === selectedSlug;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setSelectedSlug(s.slug)}
                  className={
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition " +
                    (active
                      ? "border-amber-300 bg-amber-300 text-neutral-950"
                      : "border-white/15 text-neutral-200 hover:border-amber-300/50 hover:text-white")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {s.name}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
              <PulsingBorder color="rgba(251,191,36,0.55)" radius="1rem">
                <InteractiveTiltCard className="rounded-2xl">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                    <div
                      className="aspect-[16/9] w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${selected.banners[0]?.image})` }}
                    />
                    <div className="p-6">
                      <div className="text-xs uppercase tracking-widest text-amber-300">
                        {selected.tagline}
                      </div>
                      <h3 className="mt-2 font-display text-3xl">{selected.name}</h3>
                      <p className="mt-2 text-sm text-neutral-300">{selected.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          to="/demo/$storeSlug"
                          params={{ storeSlug: selected.slug }}
                          className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:brightness-95"
                        >
                          Abrir demonstração <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                          to="/demo/$storeSlug/admin"
                          params={{ storeSlug: selected.slug }}
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-neutral-100 transition hover:border-amber-300/60"
                        >
                          <LayoutDashboard className="h-4 w-4" /> Ver painel
                        </Link>
                        {selected.niche === "barber" && (
                          <Link
                            to="/demo/$storeSlug/agendar"
                            params={{ storeSlug: selected.slug }}
                            className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 px-4 py-2 text-sm text-amber-200 transition hover:bg-amber-300/10"
                          >
                            <CalendarDays className="h-4 w-4" /> Agendar
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </InteractiveTiltCard>
              </PulsingBorder>

              <InteractiveProductFolder items={folderItems} label="Galeria das lojas" />
            </div>
          )}
        </div>
      </section>

      {/* Bento das demos */}
      <section className="border-t border-white/5 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-300">Demos</div>
              <h2 className="text-2xl font-semibold sm:text-3xl">Quatro lojas, um núcleo</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-6">
            {STORES.map((s, i) => {
              const Icon = NICHE_ICON[s.niche] ?? ShoppingBag;
              const spans = i === 0 ? "sm:col-span-6 lg:col-span-3" : "sm:col-span-3 lg:col-span-3";
              return (
                <InteractiveTiltCard key={s.slug} className={"rounded-2xl " + spans}>
                  <Link
                    to="/demo/$storeSlug"
                    params={{ storeSlug: s.slug }}
                    className="group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-neutral-900"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-70 transition group-hover:scale-105 group-hover:opacity-90"
                      style={{ backgroundImage: `url(${s.banners[0]?.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="relative p-5">
                      <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-amber-300">
                        <Icon className="h-3 w-3" /> {s.tagline}
                      </div>
                      <h3 className="mt-1 font-display text-2xl">{s.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-300">{s.description}</p>
                      <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-300">
                        Abrir{" "}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </InteractiveTiltCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-cyan-200/10 bg-[#071018]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(251,191,36,0.09),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Valor para o negócio
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-light tracking-[-0.04em] text-white sm:text-6xl">
                Não é “só um site”. É menos atrito entre interesse e venda.
              </h2>
            </div>
            <div className="rounded-3xl border border-amber-200/15 bg-amber-300/[0.055] p-6">
              <p className="text-sm font-semibold text-amber-100">
                A verdade que protege o cliente
              </p>
              <p className="mt-2 text-sm leading-7 text-white/62">
                Um site sozinho não cria demanda nem garante faturamento. Ele evita desperdiçar a
                demanda que já chega, transmite confiança e cria uma base própria para Google,
                avaliações, conteúdo, mídia e relacionamento.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {BUSINESS_OUTCOMES.map((item) => (
              <article
                key={item.pain}
                className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm"
              >
                <item.icon className="h-6 w-6 text-cyan-200" aria-hidden="true" />
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                  Dor: {item.pain}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-7 text-white">{item.outcome}</h3>
                <p className="mt-3 text-sm leading-6 text-white/52">{item.proof}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-cyan-200/15 bg-cyan-300/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-cyan-100">
                Cada projeto começa com uma meta de negócio.
              </p>
              <p className="mt-1 text-sm leading-6 text-white/55">
                Exemplo: receber mais pedidos, reduzir perguntas repetidas, aumentar agendamentos ou
                melhorar a confiança antes da compra.
              </p>
            </div>
            <Link
              to="/planos"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Ver investimento <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <PricingPreview />

      {/* Features */}
      <section className="border-t border-white/5 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">O que está incluso</h2>
          <p className="mt-2 text-neutral-400">
            Um núcleo técnico compartilhado por todas as lojas, pronto para personalização.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <f.icon className="h-6 w-6 text-amber-300" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-neutral-500">
        Vitrine Base · Modelo demonstrativo · Nenhum pagamento é processado
      </footer>
    </div>
  );
}
