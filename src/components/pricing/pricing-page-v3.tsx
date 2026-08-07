import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock3,
  Globe2,
  Instagram,
  MessageCircle,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";

const INSTAGRAM_URL = "https://www.instagram.com/angelo.sem.acento/";
const PROPOSAL_URL = whatsappUrl(
  "5511987201816",
  "Olá, Angelo! Vi os planos da Vitrine Base e quero conversar sobre um projeto para o meu negócio.",
);

type Plan = {
  name: string;
  eyebrow: string;
  price: string;
  description: string;
  features: string[];
  prefix?: string;
  popular?: boolean;
};

type CarePlan = {
  name: string;
  price: string;
  hours: string;
  description: string;
  features: string[];
  popular?: boolean;
};

const CREATION_PLANS: Plan[] = [
  {
    name: "Essencial",
    eyebrow: "Presença profissional completa",
    price: "1.190",
    description:
      "Para negócios que precisam sair do improviso com uma presença profissional, responsiva e pronta para converter contato em oportunidade.",
    features: [
      "Direção visual adaptada ao negócio",
      "Site responsivo para celular e computador",
      "Domínio .com.br por 1 ano incluído",
      "Configuração e publicação do projeto",
      "WhatsApp e chamadas para ação integradas",
      "Catálogo ou painel básico quando fizer parte do escopo",
      "SEO técnico essencial e indexação básica",
      "Até 2 rodadas de ajustes",
    ],
  },
  {
    name: "Recomendado",
    eyebrow: "A escolha para vender e operar melhor",
    price: "1.590",
    popular: true,
    description:
      "Para transformar o site em parte da operação: mais conteúdo, mais controle e uma experiência visual com maior profundidade.",
    features: [
      "Tudo do plano Essencial",
      "Domínio .com.br por 1 ano incluído",
      "Mais páginas, seções e volume de catálogo",
      "Personalização visual e movimento aprofundados",
      "Painel, pedidos, checkout ou fluxos comerciais conforme o projeto",
      "Estrutura de conteúdo orientada para conversão",
      "Integrações essenciais previstas em proposta",
      "Até 3 rodadas de ajustes",
    ],
  },
  {
    name: "Premium",
    eyebrow: "Operação e experiência sob medida",
    prefix: "A partir de",
    price: "2.190",
    description:
      "Para negócios com regras próprias, agenda, equipes, múltiplas unidades ou integrações que exigem desenvolvimento dedicado.",
    features: [
      "Tudo do plano Recomendado",
      "Domínio .com.br por 1 ano incluído",
      "Agendamento e regras personalizadas",
      "Múltiplos profissionais, unidades ou perfis de acesso",
      "Integrações e automações adicionais previstas em escopo",
      "Componentes, interações e movimentos exclusivos",
      "Fluxos administrativos mais completos",
      "Proposta fechada conforme a complexidade real",
    ],
  },
];

const CARE_OPTIONS: CarePlan[] = [
  {
    name: "Sem assinatura",
    price: "0",
    hours: "Sem franquia mensal",
    description:
      "O site continua sendo seu. Você não é obrigado a contratar manutenção recorrente depois da entrega.",
    features: [
      "Sem mensalidade com a Vitrine Base",
      "Suporte e alterações sob demanda por R$ 150/h",
      "Primeiro ano do domínio já incluído na criação",
      "Renovação do domínio passa ao cliente a partir do 2º ano",
      "Custos externos necessários continuam no nome do cliente",
    ],
  },
  {
    name: "Base",
    price: "149",
    hours: "1 hora por mês",
    description: "Para manter o site acompanhado sem transformar suporte em uma nova preocupação.",
    features: [
      "Manutenção técnica e acompanhamento",
      "Monitoramento e backups quando aplicáveis",
      "Pequenos ajustes dentro da franquia mensal",
      "Renovação anual do domínio .com.br incluída enquanto o plano estiver ativo",
      "Atendimento em horário comercial",
    ],
  },
  {
    name: "Evolução",
    price: "249",
    hours: "2 horas por mês",
    popular: true,
    description:
      "Para negócios que atualizam conteúdo, ofertas e operação com frequência e querem acompanhamento próximo.",
    features: [
      "Tudo do plano Base",
      "2 horas mensais para ajustes e conteúdo",
      "Prioridade sobre solicitações avulsas",
      "Revisão mensal de utilização e pontos de atenção",
      "Renovação anual do domínio .com.br incluída enquanto o plano estiver ativo",
    ],
  },
  {
    name: "Prioridade",
    price: "399",
    hours: "4 horas por mês",
    description:
      "Para operações que dependem mais do site e precisam de evolução recorrente e resposta mais rápida.",
    features: [
      "Tudo do plano Evolução",
      "4 horas mensais para suporte e evolução",
      "Fila prioritária em horário comercial",
      "Revisão proativa de pontos técnicos e comerciais",
      "Renovação anual do domínio .com.br incluída enquanto o plano estiver ativo",
    ],
  },
];

const EXTERNAL_COSTS = [
  "Taxas do gateway ou meio de pagamento escolhido",
  "E-mail profissional pago, quando contratado",
  "APIs, serviços de mensagens e licenças pagas escolhidas pelo cliente",
  "Hospedagem, banco de dados ou consumo acima de faixas gratuitas quando o projeto exigir",
  "Domínios especiais ou extensões cujo valor supere o .com.br incluído",
];

function Price({ value }: { value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1 font-display tracking-[-0.05em]">
      <span className="text-base font-semibold tracking-normal text-white/50">R$</span>
      <span>{value}</span>
    </span>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProposalButton({ label = "Solicitar proposta" }: { label?: string }) {
  return (
    <a
      href={PROPOSAL_URL}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
    >
      {label}<MessageCircle className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function CreationCard({ plan, index }: { plan: Plan; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "relative flex min-h-[620px] flex-col overflow-hidden rounded-[1.75rem] border p-6",
        plan.popular
          ? "border-cyan-300/40 bg-cyan-300/[0.075] shadow-[0_28px_90px_rgba(34,211,238,.12)]"
          : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      {plan.popular && <span className="absolute right-5 top-5 rounded-full bg-cyan-300 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-950">Mais equilibrado</span>}
      <p className="pr-24 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/75">{plan.eyebrow}</p>
      <h3 className="mt-4 font-display text-4xl font-light">{plan.name}</h3>
      <p className="mt-4 min-h-[88px] text-sm leading-7 text-white/58">{plan.description}</p>
      <div className="my-6 border-y border-white/10 py-6">
        {plan.prefix && <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/42">{plan.prefix}</p>}
        <div className="text-5xl"><Price value={plan.price} /></div>
        <p className="mt-2 text-xs text-white/42">50% para iniciar · 50% antes da publicação</p>
      </div>
      <ul className="space-y-3 text-sm leading-6 text-white/72">
        {plan.features.map((feature) => <li key={feature} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-cyan-200" /><span>{feature}</span></li>)}
      </ul>
      <div className="mt-auto pt-7"><ProposalButton label={`Conversar sobre o ${plan.name}`} /></div>
    </motion.article>
  );
}

function CareCard({ plan, index }: { plan: CarePlan; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      whileHover={reduce ? undefined : { y: -5 }}
      transition={{ duration: 0.48, delay: index * 0.06 }}
      className={[
        "relative flex flex-col rounded-3xl border p-6",
        plan.popular
          ? "border-amber-300/40 bg-amber-300/[0.07] shadow-[0_24px_70px_rgba(251,191,36,.09)]"
          : "border-white/10 bg-white/[0.035]",
      ].join(" ")}
    >
      {plan.popular && <span className="absolute right-5 top-5 rounded-full border border-amber-200/25 bg-amber-300/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-200">Recomendado</span>}
      <h3 className="pr-20 font-display text-3xl font-light">{plan.name}</h3>
      <p className="mt-3 min-h-[88px] text-sm leading-6 text-white/55">{plan.description}</p>
      <div className="my-5 border-y border-white/10 py-5">
        <div className="text-4xl"><Price value={plan.price} /></div>
        <p className="mt-1 text-xs text-white/42">por mês</p>
        <span className="mt-3 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/62">{plan.hours}</span>
      </div>
      <ul className="space-y-3 text-sm leading-6 text-white/68">
        {plan.features.map((feature) => <li key={feature} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-amber-300" /><span>{feature}</span></li>)}
      </ul>
    </motion.article>
  );
}

export function PricingPageV3() {
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen overflow-x-clip bg-[#05070a] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070a]/88 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" className="font-semibold tracking-[0.22em] text-amber-300">VITRINE BASE</Link>
          <nav className="hidden items-center gap-6 text-xs text-white/55 sm:flex" aria-label="Planos">
            <a href="#criacao" className="transition hover:text-white">Criação</a>
            <a href="#manutencao" className="transition hover:text-white">Pós-entrega</a>
            <a href="#extras" className="transition hover:text-white">Custos extras</a>
          </nav>
          <a href={PROPOSAL_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/15">Falar no WhatsApp<MessageCircle className="h-4 w-4" /></a>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10 px-4 py-24 sm:py-32">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            animate={reduce ? undefined : { opacity: [0.6, 1, 0.6], scale: [1, 1.04, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "radial-gradient(circle at 18% 25%,rgba(34,211,238,.15),transparent 34%),radial-gradient(circle at 82% 72%,rgba(251,191,36,.11),transparent 32%)" }}
          />
          <div className="mx-auto max-w-5xl text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-white/48 hover:text-white/80"><ArrowLeft className="h-4 w-4" />Voltar às demonstrações</Link>
            <p className="mt-12 text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">Projeto completo · preço claro · sem mensalidade obrigatória</p>
            <h1 className="mx-auto mt-6 max-w-5xl font-display text-5xl font-light leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-[6rem]">Você paga pela construção. Depois escolhe como quer ser acompanhado.</h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">Domínio .com.br do primeiro ano, configuração e publicação entram no projeto. A manutenção mensal é uma escolha, não uma condição para receber o site.</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#criacao" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">Comparar projetos<ArrowRight className="h-4 w-4" /></a>
              <ProposalButton label="Conversar sobre meu projeto" />
            </div>
          </div>
        </section>

        <section id="criacao" className="scroll-mt-24 px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">Criação</p><h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-6xl">A diferença está na complexidade, não em entregar um site pela metade.</h2><p className="mt-5 text-sm leading-7 text-white/55 sm:text-base">Todos os níveis incluem direção visual, responsividade, publicação e o primeiro ano de domínio .com.br. O escopo define profundidade, volume e integrações.</p></div></Reveal>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">{CREATION_PLANS.map((plan, index) => <CreationCard key={plan.name} plan={plan} index={index} />)}</div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#081019] px-4 py-16">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {[
              { icon: Globe2, title: "Domínio incluído", text: "Um .com.br disponível por 1 ano entra em qualquer plano de criação." },
              { icon: ShieldCheck, title: "Sem venda casada", text: "Manutenção recorrente não é obrigatória para manter a propriedade do projeto." },
              { icon: CircleDollarSign, title: "Extra só quando é extra", text: "Serviços pagos de terceiros são informados antes e contratados apenas quando necessários." },
            ].map((item, index) => <Reveal key={item.title} delay={index * 0.07}><div className="h-full rounded-2xl border border-white/10 bg-white/[0.035] p-6"><item.icon className="h-5 w-5 text-amber-300" /><h3 className="mt-5 font-display text-2xl">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/52">{item.text}</p></div></Reveal>)}
          </div>
        </section>

        <section id="manutencao" className="scroll-mt-24 px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-200">Depois da publicação</p><h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-6xl">Assinatura opcional. Escolha recorrência pela conveniência, não por obrigação.</h2></div><p className="max-w-md text-sm leading-7 text-white/55">Sem assinatura, alterações são cobradas sob demanda. Nos planos mensais, a franquia não acumula e correções de defeitos da implementação não consomem horas.</p></div></Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{CARE_OPTIONS.map((plan, index) => <CareCard key={plan.name} plan={plan} index={index} />)}</div>
            <div className="mt-7 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:grid-cols-3">
              <div className="flex gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><div><h3 className="font-semibold">Blocos de 15 minutos</h3><p className="mt-1 text-sm leading-6 text-white/50">O relatório mostra somente o tempo efetivamente trabalhado.</p></div></div>
              <div className="flex gap-3"><Wrench className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><div><h3 className="font-semibold">R$ 150 por hora excedente ou avulsa</h3><p className="mt-1 text-sm leading-6 text-white/50">Qualquer excedente é executado somente depois da aprovação.</p></div></div>
              <div className="flex gap-3"><ServerCog className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><div><h3 className="font-semibold">Novas funcionalidades são projeto</h3><p className="mt-1 text-sm leading-6 text-white/50">A franquia cobre suporte e ajustes; módulos novos recebem escopo próprio.</p></div></div>
            </div>
          </div>
        </section>

        <section id="extras" className="scroll-mt-24 border-y border-white/10 bg-[#071018] px-4 py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
            <Reveal><p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">O que pode ficar fora do valor</p><h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-5xl">Só custo externo que realmente depende da escolha ou do consumo do cliente.</h2><p className="mt-5 text-sm leading-7 text-white/55">A Vitrine Base inclui o trabalho de configurar e integrar o que estiver no escopo. Quando um fornecedor cobra licença, tarifa ou consumo recorrente, isso é informado antes da aprovação e, sempre que possível, fica na conta do próprio cliente.</p></Reveal>
            <Reveal delay={0.08}><div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"><ul className="space-y-4 text-sm leading-7 text-white/68">{EXTERNAL_COSTS.map((item) => <li key={item} className="flex gap-3"><Sparkles className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />{item}</li>)}</ul><div className="mt-7 rounded-2xl border border-amber-300/20 bg-amber-300/[0.055] p-5 text-sm leading-6 text-amber-50/78"><strong className="block text-amber-200">Domínio comum não entra nessa lista.</strong>O primeiro ano de um domínio .com.br disponível já está incluído no preço de criação. Extensões premium ou nomes com custo especial têm somente a diferença informada ao cliente.</div></div></Reveal>
          </div>
        </section>

        <section className="px-4 py-24 text-center"><div className="mx-auto max-w-4xl"><p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-200">Próximo passo</p><h2 className="mt-4 font-display text-4xl font-light tracking-[-0.045em] sm:text-6xl">Escolha o tamanho do projeto. A assinatura vem depois — somente se fizer sentido.</h2><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">Antes de começar, páginas, produtos, integrações, prazo e qualquer custo externo ficam registrados na proposta. Sem surpresa depois da entrega.</p><div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><ProposalButton label="Solicitar proposta pelo WhatsApp" /><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/[0.08] hover:text-white">Ver projetos no Instagram<Instagram className="h-4 w-4" /></a></div></div></section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-xs text-white/38"><div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>Vitrine Base · sites e webapps para negócios locais</span><span>Valores finais dependem do escopo aprovado em proposta.</span></div></footer>
    </div>
  );
}
