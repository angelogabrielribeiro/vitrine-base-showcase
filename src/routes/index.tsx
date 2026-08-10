import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
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
import { UniverseShowroomHero } from "@/components/marketing/universe-showroom-hero";
import { UniverseJourney } from "@/components/marketing/universe-journey";
import { OfferConfigurator } from "@/components/marketing/offer-configurator";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { STORES } from "@/config/stores";
import { DEMO_NOTICE } from "@/lib/demo-mode";
import { whatsappUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAV Digital — Vitrine Base | Experiências digitais" },
      {
        name: "description",
        content:
          "Vitrine Base, o showcase da SAV Digital: experiências de sites e sistemas com identidade, movimento e estrutura comercial para negócios locais.",
      },
      {
        property: "og:title",
        content: "SAV Digital apresenta Vitrine Base — Sites que o cliente sente antes de entender",
      },
      {
        property: "og:description",
        content:
          "Explore quatro experiências demonstrativas criadas pela SAV Digital e veja como design, catálogo, pedidos, agenda e painel podem trabalhar juntos.",
      },
    ],
  }),
  component: Index,
});

const PROPOSAL_URL = whatsappUrl(
  "5511987201816",
  "Olá! Vi a Vitrine Base da SAV Digital e quero entender como seria um site para o meu negócio.",
);
const SAV_INSTAGRAM_URL = "https://www.instagram.com/savdigital.br/";
const SAV_EMAIL = "comercial.savdigital@gmail.com";

const NICHE_ICON: Record<string, typeof ShoppingBag> = {
  fashion: ShoppingBag,
  barber: Scissors,
  restaurant: Utensils,
  electronics: Cpu,
};

const DEMO_VALUE: Record<
  string,
  {
    problem: string;
    solution: string;
    highlight: string;
    accent: string;
    glow: string;
    number: string;
  }
> = {
  moda: {
    problem: "Coleções espalhadas entre posts, destaques e mensagens.",
    solution: "Uma vitrine editorial que transforma produto, composição e compra em uma jornada.",
    highlight: "Moda e varejo",
    accent: "text-[#d58c9a]",
    glow: "from-[#d58c9a]/28 via-transparent to-vb-gold/16",
    number: "01",
  },
  barbearia: {
    problem: "Agenda dependente de trocas manuais de mensagens.",
    solution: "Serviços, profissionais e horários organizados para o cliente reservar sozinho.",
    highlight: "Serviços e agenda",
    accent: "text-vb-gold",
    glow: "from-vb-gold/28 via-transparent to-[#8a6d36]/18",
    number: "02",
  },
  restaurante: {
    problem: "Cardápio, adicionais e pedidos difíceis de conferir.",
    solution: "Uma experiência quente e direta para escolher, personalizar e finalizar o pedido.",
    highlight: "Pedidos locais",
    accent: "text-[#ff7448]",
    glow: "from-[#ff7448]/28 via-transparent to-vb-gold/14",
    number: "03",
  },
  eletronicos: {
    problem: "Produtos técnicos apresentados sem hierarquia ou contexto.",
    solution: "Categorias, detalhes e compra organizados em um ambiente digital de alta precisão.",
    highlight: "Catálogo técnico",
    accent: "text-vb-cyan",
    glow: "from-vb-cyan/26 via-transparent to-vb-violet/25",
    number: "04",
  },
};

const PROCESS = [
  {
    step: "01",
    title: "Diagnóstico",
    description: "Entendemos o negócio, a rotina, o público e o objetivo comercial prioritário.",
  },
  {
    step: "02",
    title: "Direção",
    description:
      "Definimos identidade, narrativa, funcionalidades, investimento e prazo antes de iniciar.",
  },
  {
    step: "03",
    title: "Construção",
    description:
      "Design, conteúdo, movimento e fluxos são desenvolvidos como uma experiência única.",
  },
  {
    step: "04",
    title: "Validação",
    description: "Testamos desktop, mobile e operação; só publicamos depois da sua aprovação.",
  },
];

const INCLUDED = [
  {
    icon: Smartphone,
    title: "Responsividade real",
    description: "Composição, movimento e hierarquia adaptados para celular e computador.",
  },
  {
    icon: ShoppingBag,
    title: "Operação conectada",
    description: "Catálogo, pedidos, serviços, agenda ou checkout entram conforme a necessidade.",
  },
  {
    icon: LayoutDashboard,
    title: "Controle do negócio",
    description:
      "Painel simples para atualizar conteúdo e acompanhar a operação quando necessário.",
  },
  {
    icon: ShieldCheck,
    title: "Base profissional",
    description: "Domínio, segurança, banco de dados e permissões planejados para a entrega real.",
  },
  {
    icon: Sparkles,
    title: "Identidade própria",
    description: "Layout, tipografia, cards, transições e conteúdo construídos para cada marca.",
  },
  {
    icon: MessageCircle,
    title: "Conversão com contexto",
    description:
      "Chamadas comerciais aparecem nos momentos certos, sem transformar o site em panfleto.",
  },
];

function Index() {
  const { capabilities } = useCinematicMotion();
  const reduceMotion =
    capabilities.hydrated &&
    (capabilities.reducedMotion ||
      capabilities.coarsePointer ||
      capabilities.quality === "economy");
  return (
    <div className="min-h-screen overflow-x-clip bg-vb-canvas font-sans text-vb-ivory">
      <a
        href="#conteudo"
        className="sr-only z-[80] rounded-full bg-vb-gold px-5 py-3 font-bold text-vb-deep focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ir para o conteúdo
      </a>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-vb-canvas/80 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-16 max-w-[90rem] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <a
            href="#inicio"
            aria-label="SAV Digital — Vitrine Base"
            className="group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b7fff]"
          >
            <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#5b7fff]/45 bg-[#315cff]/10 shadow-[0_0_26px_rgba(49,92,255,.08)] transition duration-500 group-hover:border-[#7b9aff]/75 group-hover:shadow-[0_0_30px_rgba(49,92,255,.28)]">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(111,145,255,.24),transparent_62%)]" />
              <span className="relative font-display text-[10px] font-black tracking-[-0.04em] text-[#8aa6ff]">
                SAV
              </span>
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-display text-[12px] font-bold tracking-[0.14em] text-white">
                SAV DIGITAL
              </span>
              <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.19em] text-white/38">
                Vitrine Base · Showcase
              </span>
            </span>
          </a>

          <nav
            className="hidden items-center gap-7 text-xs font-bold uppercase tracking-[0.17em] text-white/52 md:flex"
            aria-label="Principal"
          >
            <a href="#experiencia" className="transition hover:text-vb-gold">
              Experiência
            </a>
            <a href="#demonstracoes" className="transition hover:text-vb-gold">
              Projetos
            </a>
            <a href="#processo" className="transition hover:text-vb-gold">
              Processo
            </a>
            <Link to="/planos" className="transition hover:text-vb-gold">
              Planos
            </Link>
          </nav>

          <a
            href={PROPOSAL_URL}
            target="_blank"
            rel="noreferrer"
            className="vb-button-primary inline-flex min-h-11 items-center gap-2 px-4 py-2 text-xs"
          >
            <span className="hidden sm:inline">Falar com a SAV</span>
            <span className="sm:hidden">Falar agora</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </header>

      <main id="conteudo">
        <UniverseShowroomHero proposalUrl={PROPOSAL_URL} demoNotice={DEMO_NOTICE} />

        <section
          aria-label="Princípios da Vitrine Base"
          className="overflow-hidden border-b border-white/10 bg-vb-deep py-5"
        >
          <div className="vb-marquee flex min-w-max items-center gap-10 text-[10px] font-bold uppercase tracking-[0.28em] text-white/42 motion-reduce:translate-x-0">
            {[...Array(2)].flatMap((_, group) =>
              [
                "Identidade antes de template",
                "Movimento com função",
                "Performance adaptativa",
                "Operação conectada",
                "Clareza para converter",
              ].map((item) => (
                <span key={`${group}-${item}`} className="inline-flex items-center gap-10">
                  {item}
                  <span className="h-1.5 w-1.5 rounded-full bg-vb-gold" aria-hidden="true" />
                </span>
              )),
            )}
          </div>
        </section>

        <UniverseJourney proposalUrl={PROPOSAL_URL} />

        <section
          id="demonstracoes"
          className="relative scroll-mt-20 overflow-hidden border-b border-white/10 bg-vb-canvas"
        >
          <div aria-hidden="true" className="vb-noise absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="vb-kicker">Vitrine de projetos SAV Digital</p>
                <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.9] tracking-[-0.06em] text-vb-ivory sm:text-7xl">
                  Cada negócio merece seu próprio mundo.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-white/58 lg:justify-self-end lg:text-lg">
                A Vitrine Base reúne experiências demonstrativas criadas pela SAV Digital. A
                estrutura técnica pode ser reaproveitada com responsabilidade; o que o cliente vê,
                sente e usa nasce da identidade e da operação de cada marca.
              </p>
            </div>

            <p className="mt-8 text-sm leading-6 text-white/55 lg:hidden">
              Você já percorreu os quatro universos no showroom acima. Aqui está o detalhe de cada
              um, para computador.
            </p>

            <div className="mt-10 hidden divide-y divide-white/10 border-y border-white/10 lg:mt-20 lg:block">
              {STORES.map((store, index) => {
                const value = DEMO_VALUE[store.slug];
                const Icon = NICHE_ICON[store.niche] ?? ShoppingBag;
                const reverse = index % 2 === 1;

                return (
                  <motion.article
                    key={store.slug}
                    initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-12%" }}
                    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    className="group grid gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:items-center"
                  >
                    <div className={reverse ? "lg:order-2 lg:col-span-7" : "lg:col-span-7"}>
                      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-vb-elevated p-2 shadow-2xl shadow-black/35">
                        <div
                          aria-hidden="true"
                          className={`absolute inset-0 bg-gradient-to-br ${value?.glow} opacity-60 transition duration-700 group-hover:opacity-100`}
                        />
                        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.55rem]">
                          <img
                            src={store.banners[0]?.image}
                            alt={`Página inicial da demonstração ${store.name}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.045]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                          <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/75 backdrop-blur-xl">
                            {value?.highlight ?? store.tagline}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={reverse ? "lg:order-1 lg:col-span-5" : "lg:col-span-5"}>
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-display text-5xl font-semibold ${value?.accent ?? "text-vb-gold"}`}
                        >
                          {value?.number ?? `0${index + 1}`}
                        </span>
                        <span className="h-px flex-1 bg-white/12" />
                        <Icon
                          className={`h-5 w-5 ${value?.accent ?? "text-vb-gold"}`}
                          aria-hidden="true"
                        />
                      </div>

                      <h3 className="mt-7 font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                        {store.name}
                      </h3>
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-white/38">
                        Problema
                      </p>
                      <p className="mt-2 text-base leading-7 text-white/62">{value?.problem}</p>
                      <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-white/38">
                        Experiência criada
                      </p>
                      <p className="mt-2 text-lg leading-8 text-white/82">{value?.solution}</p>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                          to="/demo/$storeSlug"
                          params={{ storeSlug: store.slug }}
                          className="vb-button-primary group/link inline-flex min-h-12 items-center gap-2 px-5 py-3 text-sm"
                        >
                          Abrir loja
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                        <Link
                          to="/demo/$storeSlug/admin"
                          params={{ storeSlug: store.slug }}
                          className="vb-button-glass inline-flex min-h-12 items-center gap-2 px-5 py-3 text-sm"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Explorar painel
                        </Link>
                        {store.niche === "barber" && (
                          <Link
                            to="/demo/$storeSlug/agendar"
                            params={{ storeSlug: store.slug }}
                            className="vb-button-secondary inline-flex min-h-12 items-center gap-2 px-5 py-3 text-sm"
                          >
                            <CalendarDays className="h-4 w-4" />
                            Testar agendamento
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-vb-ivory text-vb-deep">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(3,4,5,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(3,4,5,.08)_1px,transparent_1px)] [background-size:64px_64px]"
          />
          <div className="relative mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8b641d]">
                  A diferença
                </p>
                <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
                  Não é colocar efeito em cima de um template.
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
                <article className="rounded-[2rem] border border-black/10 bg-white/45 p-7 backdrop-blur-sm sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/42">
                    Site comum
                  </p>
                  <ul className="mt-7 space-y-5 text-base leading-7 text-black/62">
                    {[
                      "Mesma hierarquia para qualquer nicho",
                      "Animação decorativa e sem narrativa",
                      "Interface bonita, mas desconectada da operação",
                      "Experiência idêntica em desktop e celular",
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-black/30" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="rounded-[2rem] bg-vb-deep p-7 text-vb-ivory shadow-2xl shadow-black/20 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-vb-gold">
                    Vitrine Base · SAV Digital
                  </p>
                  <ul className="mt-7 space-y-5 text-base leading-7 text-white/72">
                    {[
                      "Direção visual ligada ao posicionamento da marca",
                      "Movimento que explica, conduz e responde",
                      "Design conectado a catálogo, agenda, pedido ou venda",
                      "Qualidade adaptada à capacidade do dispositivo",
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-vb-gold" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="processo" className="scroll-mt-20 border-y border-white/10 bg-vb-deep">
          <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="vb-kicker">Da ideia à publicação</p>
                <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
                  Processo claro. Resultado sem improviso.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-white/55">
                O prazo é definido depois do escopo. O pagamento é 50% para iniciar e 50% depois da
                aprovação, antes da publicação.
              </p>
            </div>

            <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
              {PROCESS.map((item, index) => (
                <motion.article
                  key={item.step}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.58, delay: index * 0.08 }}
                  className="group relative min-h-80 overflow-hidden bg-vb-canvas p-7 sm:p-9"
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-vb-gold/0 blur-3xl transition duration-500 group-hover:bg-vb-gold/20" />
                  <span className="font-display text-5xl font-semibold text-white/12 transition group-hover:text-vb-gold/80">
                    {item.step}
                  </span>
                  <h3 className="mt-16 font-display text-3xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/55">{item.description}</p>
                  <ChevronRight className="absolute bottom-8 right-8 h-5 w-5 text-white/20 transition group-hover:translate-x-1 group-hover:text-vb-gold" />
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-vb-canvas py-8">
          <OfferConfigurator proposalUrl={PROPOSAL_URL} />
        </section>

        <section className="border-y border-white/10 bg-vb-canvas">
          <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="vb-kicker">O que pode fazer parte</p>
                <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-6xl">
                  Tecnologia suficiente para resolver. Nunca só para impressionar.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {INCLUDED.map((item, index) => (
                  <motion.article
                    key={item.title}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.5, delay: (index % 2) * 0.07 }}
                    className="group rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6 transition duration-500 hover:-translate-y-1 hover:border-vb-cyan/35 hover:bg-white/[0.06]"
                  >
                    <item.icon className="h-5 w-5 text-vb-gold transition group-hover:text-vb-cyan" />
                    <h3 className="mt-7 font-display text-2xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/52">{item.description}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-vb-deep">
          <div aria-hidden="true" className="vb-pointer-aura absolute inset-0" />
          <div aria-hidden="true" className="vb-noise absolute inset-0 opacity-30" />
          <div className="relative mx-auto flex min-h-[70svh] max-w-[90rem] flex-col items-center justify-center px-5 py-24 text-center sm:px-8 lg:px-12">
            <p className="vb-kicker">SAV Digital · Sites · Anúncios · Vendas</p>
            <h2 className="mt-6 max-w-6xl font-display text-5xl font-semibold leading-[0.88] tracking-[-0.065em] text-vb-ivory sm:text-7xl lg:text-[7rem]">
              Vamos construir uma presença que seja difícil de esquecer.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/58">
              Conte o que você vende, como atende e qual é o principal problema da operação. A SAV
              Digital parte disso para definir o projeto certo — sem funcionalidades inventadas e
              sem promessa vazia.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={PROPOSAL_URL}
                target="_blank"
                rel="noreferrer"
                className="vb-button-primary group inline-flex min-h-14 items-center justify-center gap-3 px-7 py-4"
              >
                Conversar sobre meu projeto
                <MessageCircle className="h-4 w-4 transition-transform group-hover:rotate-6" />
              </a>
              <Link
                to="/planos"
                className="vb-button-secondary inline-flex min-h-14 items-center justify-center gap-3 px-7 py-4"
              >
                Ver Planos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-vb-deep px-5 py-8 text-xs text-white/38 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-5 sm:grid-cols-[1fr_auto] sm:items-end lg:grid-cols-[1fr_auto_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#5b7fff]/40 bg-[#315cff]/10 font-display text-[9px] font-black text-[#8aa6ff]">
                SAV
              </span>
              <div>
                <p className="font-display font-semibold tracking-[0.14em] text-white/75">SAV DIGITAL</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/30">
                  Vitrine Base · Showcase
                </p>
              </div>
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-[#7898ff]/75">
              Sites que atraem. Anúncios que vendem.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] sm:justify-end lg:justify-center">
            <a
              href={SAV_INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#8aa6ff]"
            >
              @savdigital.br
            </a>
            <a href={`mailto:${SAV_EMAIL}`} className="transition hover:text-[#8aa6ff]">
              {SAV_EMAIL}
            </a>
          </div>

          <span className="sm:col-span-2 sm:text-right lg:col-span-1">
            Demonstrações locais · Nenhum pagamento real é processado
          </span>
        </div>
      </footer>
    </div>
  );
}
