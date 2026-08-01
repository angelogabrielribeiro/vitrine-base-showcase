import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock3,
  Cpu,
  LayoutDashboard,
  MessageCircle,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Utensils,
} from "lucide-react";
import { PricingPreview } from "@/components/pricing/pricing-page";
import { STORES } from "@/config/stores";
import { DEMO_NOTICE } from "@/lib/demo-mode";
import { whatsappUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitrine Base — Sites sob medida para negócios locais" },
      {
        name: "description",
        content:
          "Sites e sistemas sob medida para negócios locais venderem, atenderem e organizarem a operação com mais confiança.",
      },
      {
        property: "og:title",
        content: "Vitrine Base — Um site com a identidade e a operação do seu negócio",
      },
      {
        property: "og:description",
        content:
          "Explore quatro demonstrações completas e veja como catálogo, pedidos, agendamentos e painel administrativo podem trabalhar juntos.",
      },
    ],
  }),
  component: Index,
});

const PROPOSAL_URL = whatsappUrl(
  "5511987201816",
  "Olá, Angelo! Vi a Vitrine Base e quero entender como seria um site para o meu negócio.",
);

const NICHE_ICON: Record<string, typeof ShoppingBag> = {
  fashion: ShoppingBag,
  barber: Scissors,
  restaurant: Utensils,
  electronics: Cpu,
};

const DEMO_VALUE: Record<
  string,
  { problem: string; solution: string; highlight: string }
> = {
  moda: {
    problem: "Coleções espalhadas entre posts e mensagens.",
    solution: "Uma vitrine editorial com catálogo, produto, carrinho e checkout no mesmo fluxo.",
    highlight: "Moda e varejo",
  },
  barbearia: {
    problem: "Agenda dependente de troca manual de mensagens.",
    solution: "Serviços, profissionais e horários organizados para o cliente reservar sozinho.",
    highlight: "Serviços e agenda",
  },
  restaurante: {
    problem: "Cardápio, adicionais e pedidos difíceis de conferir.",
    solution: "Uma jornada direta para escolher, personalizar e finalizar o pedido.",
    highlight: "Pedidos locais",
  },
  eletronicos: {
    problem: "Produtos técnicos apresentados sem hierarquia ou contexto.",
    solution: "Categorias, detalhes e compra organizados para reduzir dúvida antes do contato.",
    highlight: "Catálogo técnico",
  },
};

const PROCESS = [
  {
    step: "01",
    title: "Diagnóstico",
    description: "Entendemos o negócio, a rotina, o público e o principal objetivo comercial.",
  },
  {
    step: "02",
    title: "Escopo e proposta",
    description: "Definimos páginas, funções, investimento, prazo e custos externos antes de iniciar.",
  },
  {
    step: "03",
    title: "Construção",
    description: "Design, conteúdo e fluxos são desenvolvidos para a identidade real do negócio.",
  },
  {
    step: "04",
    title: "Revisão e publicação",
    description: "Você aprova o projeto, concluímos os ajustes e publicamos somente depois da validação.",
  },
];

const INCLUDED = [
  {
    icon: Smartphone,
    title: "Experiência responsiva",
    description: "Interface pensada para celular e computador, com navegação clara e áreas de toque adequadas.",
  },
  {
    icon: ShoppingBag,
    title: "Catálogo e operação",
    description: "Produtos, serviços, pedidos, agendamentos ou checkout entram conforme o escopo do negócio.",
  },
  {
    icon: LayoutDashboard,
    title: "Painel administrativo",
    description: "Uma área simples para atualizar informações e acompanhar a operação quando o projeto exigir.",
  },
  {
    icon: ShieldCheck,
    title: "Base profissional",
    description: "Domínio, segurança, banco de dados e permissões são planejados para a versão entregue ao cliente.",
  },
  {
    icon: Sparkles,
    title: "Identidade própria",
    description: "Layout, conteúdo, cards e movimento são adaptados ao posicionamento de cada marca.",
  },
  {
    icon: MessageCircle,
    title: "Contato que vira ação",
    description: "WhatsApp e chamadas comerciais aparecem nos momentos certos da jornada.",
  },
];

function Index() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen overflow-x-clip bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/88 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <a
            href="#inicio"
            className="font-semibold tracking-[0.2em] text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
          >
            VITRINE BASE
          </a>

          <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex" aria-label="Principal">
            <a href="#demonstracoes" className="transition hover:text-white">
              Demonstrações
            </a>
            <a href="#processo" className="transition hover:text-white">
              Processo
            </a>
            <Link to="/planos" className="transition hover:text-white">
              Planos
            </Link>
          </nav>

          <a
            href={PROPOSAL_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
          >
            <span className="hidden sm:inline">Quero um site assim</span>
            <span className="sm:hidden">Falar agora</span>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative scroll-mt-20 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(251,191,36,0.16),transparent_30%),radial-gradient(circle_at_88%_16%,rgba(34,211,238,0.15),transparent_28%),radial-gradient(circle_at_65%_90%,rgba(99,102,241,0.12),transparent_32%)]"
          />

          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300"
              >
                Sites sob medida para negócios locais
              </motion.p>

              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.58, delay: 0.05 }}
                className="mt-5 max-w-3xl font-display text-4xl font-light leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
              >
                Seu negócio não precisa de mais um template. Precisa de uma experiência que ajude a
                vender e operar melhor.
              </motion.h1>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.52, delay: 0.12 }}
                className="mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg"
              >
                Criamos sites com identidade própria, conteúdo pensado para conversão e ferramentas
                que organizam catálogo, pedidos, atendimento ou agendamentos — conforme a realidade
                de cada empresa.
              </motion.p>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.18 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <a
                  href={PROPOSAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
                >
                  Quero um site assim <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#demonstracoes"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.045] px-6 py-3 text-sm font-semibold text-white transition hover:border-amber-300/45 hover:bg-amber-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                >
                  Explorar demonstrações <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </motion.div>

              <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/68">
                {[
                  "Identidade própria",
                  "Painel e fluxos conforme o escopo",
                  "50% para iniciar · 50% antes da publicação",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2"
                  >
                    <Check className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-amber-300/14 via-transparent to-cyan-300/14 blur-2xl"
              />
              <div className="relative grid grid-cols-2 gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-4">
                {STORES.map((store, index) => (
                  <Link
                    key={store.slug}
                    to="/demo/$storeSlug"
                    params={{ storeSlug: store.slug }}
                    className={[
                      "group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200",
                      index === 0 || index === 3 ? "aspect-[4/5]" : "aspect-square",
                    ].join(" ")}
                    aria-label={`Abrir demonstração ${store.name}`}
                  >
                    <img
                      src={store.banners[0]?.image}
                      alt=""
                      className="h-full w-full object-cover opacity-72 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/18 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.17em] text-amber-300">
                        {DEMO_VALUE[store.slug]?.highlight}
                      </span>
                      <span className="mt-1 block font-display text-lg text-white sm:text-2xl">
                        {store.name}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>

              <details className="relative mt-4 rounded-2xl border border-white/10 bg-white/[0.035] text-sm text-white/66">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-white/78 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">
                  <span className="inline-flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-amber-300" aria-hidden="true" />
                    Ambiente de demonstração
                  </span>
                  <span className="text-xs text-cyan-200">Entenda</span>
                </summary>
                <p className="border-t border-white/10 px-4 py-3 leading-6">{DEMO_NOTICE}</p>
              </details>
            </div>
          </div>
        </section>

        <section id="demonstracoes" className="scroll-mt-20 border-y border-white/10 bg-black/25">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
                Quatro negócios, quatro experiências
              </p>
              <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] text-white sm:text-6xl">
                A estrutura técnica pode evoluir. A experiência não precisa parecer repetida.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/62">
                Cada demonstração responde a uma operação diferente. Explore a vitrine e o painel
                para entender como design e funcionalidade trabalham juntos.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {STORES.map((store) => {
                const Icon = NICHE_ICON[store.niche] ?? ShoppingBag;
                const value = DEMO_VALUE[store.slug];

                return (
                  <article
                    key={store.slug}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={store.banners[0]?.image}
                        alt={`Prévia da demonstração ${store.name}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/18 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                        <div>
                          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            {value?.highlight}
                          </p>
                          <h3 className="mt-2 font-display text-3xl text-white">{store.name}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                            Problema
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/72">{value?.problem}</p>
                        </div>
                        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.055] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                            Solução demonstrada
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/72">{value?.solution}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <Link
                          to="/demo/$storeSlug"
                          params={{ storeSlug: store.slug }}
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
                        >
                          Abrir loja <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                          to="/demo/$storeSlug/admin"
                          params={{ storeSlug: store.slug }}
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                        >
                          <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Explorar painel
                        </Link>
                      </div>

                      {store.niche === "barber" && (
                        <Link
                          to="/demo/$storeSlug/agendar"
                          params={{ storeSlug: store.slug }}
                          className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/[0.06] px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-300/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                        >
                          <CalendarDays className="h-4 w-4" aria-hidden="true" /> Testar agendamento
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#071018]">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">
                  Site comum x solução completa
                </p>
                <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] text-white sm:text-6xl">
                  Aparência chama atenção. Estrutura transforma interesse em ação.
                </h2>
              </div>
              <p className="text-base leading-7 text-white/62">
                O projeto não termina na página bonita. A proposta é conectar posicionamento,
                informação e operação para reduzir dúvidas e facilitar o próximo passo do cliente.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  Site genérico
                </p>
                <ul className="mt-5 space-y-4 text-sm leading-6 text-white/58">
                  {[
                    "Visual reaproveitado sem relação clara com a marca",
                    "Informação espalhada e chamada para ação fraca",
                    "Dependência de mensagens para explicar tudo",
                    "Funcionalidades adicionadas sem considerar a rotina",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  Projeto Vitrine Base
                </p>
                <ul className="mt-5 space-y-4 text-sm leading-6 text-white/76">
                  {[
                    "Identidade, hierarquia e conteúdo adaptados ao negócio",
                    "Fluxos definidos pela ação que o cliente deve realizar",
                    "Painel, pedidos ou agenda quando realmente necessários",
                    "Escopo, prazo e custos alinhados antes do desenvolvimento",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="processo" className="scroll-mt-20 border-y border-white/10 bg-black/25">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
                  Como o projeto acontece
                </p>
                <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] text-white sm:text-6xl">
                  Um processo claro antes de qualquer publicação.
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-white/58">
                <Clock3 className="h-4 w-4 text-amber-300" aria-hidden="true" />
                Prazo definido junto com o escopo
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((item) => (
                <article key={item.step} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                  <p className="font-display text-4xl text-amber-300/75">{item.step}</p>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/58">{item.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-amber-300/18 bg-amber-300/[0.055] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-amber-100">Pagamento por etapa, sem publicação antecipada.</p>
                <p className="mt-1 text-sm leading-6 text-white/58">
                  50% para iniciar e 50% após a aprovação, antes da publicação do projeto.
                </p>
              </div>
              <Link
                to="/planos"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-amber-300/35 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
              >
                Ver planos e condições <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <PricingPreview />

        <section className="border-t border-white/10 bg-neutral-950">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">
                O que pode fazer parte do projeto
              </p>
              <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] text-white sm:text-6xl">
                A mesma qualidade de base, com profundidade definida pelo escopo.
              </h2>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INCLUDED.map((item) => (
                <article key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                  <item.icon className="h-6 w-6 text-amber-300" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/58">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/10 bg-[#071018]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_15%_90%,rgba(251,191,36,0.1),transparent_30%)]"
          />
          <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
            <BadgeCheck className="mx-auto h-8 w-8 text-amber-300" aria-hidden="true" />
            <h2 className="mt-6 font-display text-4xl font-light tracking-[-0.045em] text-white sm:text-6xl">
              Seu negócio já tem uma identidade. O site precisa traduzir isso e facilitar a operação.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/62">
              Conte como sua empresa vende, atende ou agenda. A proposta será construída a partir do
              que realmente precisa funcionar.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={PROPOSAL_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
              >
                Conversar pelo WhatsApp <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                to="/planos"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.045] px-6 py-3 text-sm font-semibold text-white transition hover:border-amber-300/40 hover:bg-amber-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
              >
                Ver investimento <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/30 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>Vitrine Base · sites e sistemas para negócios locais</span>
          <span>As lojas exibidas são demonstrações. Nenhum pagamento real é processado.</span>
        </div>
      </footer>
    </div>
  );
}
