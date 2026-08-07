import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock3,
  Database,
  Globe2,
  Instagram,
  LockKeyhole,
  MessageCircle,
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

type RecurringOption = {
  name: string;
  price: string;
  label: string;
  description: string;
  features: string[];
  popular?: boolean;
};

const CREATION_PLANS: Plan[] = [
  {
    name: "Essencial",
    eyebrow: "Site profissional, animado e enxuto",
    price: "1.190",
    description:
      "Para negócios que precisam de uma presença forte, responsiva e viva, sem pagar por um sistema que ainda não precisam.",
    features: [
      "Direção visual adaptada ao negócio",
      "Site responsivo para celular e computador",
      "Animações, microinterações e movimento no scroll",
      "Domínio .com.br por 1 ano incluído",
      "Publicação e configuração inicial",
      "WhatsApp, formulários, catálogo e links de pagamento quando fizer sentido",
      "SEO técnico essencial e indexação básica",
      "Até 2 rodadas de ajustes",
    ],
  },
  {
    name: "Recomendado",
    eyebrow: "Mais profundidade para vender melhor",
    price: "1.590",
    popular: true,
    description:
      "Para marcas que querem mais conteúdo, mais movimento e uma jornada comercial mais completa sem perder velocidade no mobile.",
    features: [
      "Tudo do plano Essencial",
      "Mais páginas, seções e volume de catálogo",
      "Animações e experiência visual mais elaboradas",
      "Carrinho, checkout externo e fluxos comerciais conforme o escopo",
      "Estrutura de conteúdo orientada para conversão",
      "Integrações essenciais previstas em proposta",
      "Até 3 rodadas de ajustes",
      "Se houver pedidos persistidos, painel, login ou agenda própria, entra infraestrutura operacional",
    ],
  },
  {
    name: "Premium",
    eyebrow: "Sistema e experiência sob medida",
    prefix: "A partir de",
    price: "2.190",
    description:
      "Para operações com agenda própria, painel, contas, múltiplos profissionais, unidades ou integrações que exigem backend dedicado.",
    features: [
      "Tudo do plano Recomendado",
      "Agendamento e regras personalizadas",
      "Painel administrativo e dados persistidos quando previstos",
      "Contas, histórico ou perfis de acesso quando necessários",
      "Múltiplos profissionais, unidades ou permissões",
      "Integrações e automações adicionais previstas em escopo",
      "Componentes, interações e movimentos exclusivos",
      "Infraestrutura operacional mensal quando houver backend ativo",
    ],
  },
];

const RECURRING_OPTIONS: RecurringOption[] = [
  {
    name: "Vitrine sem sistema",
    price: "0",
    label: "por mês",
    description:
      "Para site institucional, catálogo, cardápio ou vitrine que não precisa guardar pedidos, contas ou agenda em banco próprio.",
    features: [
      "Sem mensalidade técnica com a Vitrine Base",
      "Site permanece publicado em hospedagem estática adequada ao escopo",
      "Não depende de banco gratuito sujeito a pausa",
      "Compra pode seguir por WhatsApp ou checkout externo",
      "Após o 1º ano, o cliente renova apenas o domínio",
      "Alterações futuras sob demanda por R$ 150/h",
    ],
  },
  {
    name: "Operação",
    price: "179",
    label: "por mês",
    description:
      "Obrigatório somente quando o projeto usa banco de dados, login, painel, pedidos persistidos ou agendamento próprio.",
    features: [
      "Backend e banco de dados em plano de produção",
      "Autenticação quando o projeto usar contas",
      "Backups e retenção compatíveis com produção",
      "Políticas de acesso, segredos e proteção do backend",
      "Monitoramento básico da infraestrutura",
      "Renovação anual do domínio .com.br incluída enquanto ativo",
    ],
  },
  {
    name: "Operação + Suporte",
    price: "279",
    label: "por mês",
    popular: true,
    description:
      "Para quem quer a infraestrutura cuidada e uma pequena franquia mensal para ajustes sem abrir chamado avulso toda vez.",
    features: [
      "Tudo do plano Operação",
      "1 hora mensal para pequenos ajustes e conteúdo",
      "Atendimento prioritário em relação a demandas avulsas",
      "Correções de defeitos da implementação não consomem a franquia",
      "Relato simples do que foi alterado no período",
    ],
  },
  {
    name: "Operação + Evolução",
    price: "399",
    label: "por mês",
    description:
      "Para negócios que mudam ofertas, conteúdo e operação com frequência e querem evolução contínua do projeto.",
    features: [
      "Tudo do plano Operação + Suporte",
      "2 horas mensais para ajustes e evolução",
      "Prioridade maior na fila",
      "Revisão mensal de pontos técnicos e comerciais",
      "Horas excedentes somente com aprovação prévia",
    ],
  },
];

const EXTERNAL_COSTS = [
  "Taxas do gateway ou meio de pagamento escolhido",
  "E-mail profissional pago, quando contratado",
  "APIs, serviços de mensagens e licenças pagas escolhidas pelo cliente",
  "Consumo de infraestrutura acima dos limites previstos na proposta",
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
        "relative flex min-h-[650px] flex-col overflow-hidden rounded-[1.75rem] border p-6",
        plan.popular
          ? "border-cyan-300/40 bg-cyan-300/[0.075] shadow-[0_28px_90px_rgba(34,211,238,.12)]"
          : "border-white/10 bg-white/[0.04]",
      ].join(" ")}
    >
      {plan.popular && <span className="absolute right-5 top-5 rounded-full bg-cyan-300 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-950">Mais equilibrado</span>}
      <p className="pr-24 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/75">{plan.eyebrow}</p>
      <h3 className="mt-4 font-display text-4xl font-light">{plan.name}</h3>
      <p className="mt-4 min-h-[96px] text-sm leading-7 text-white/58">{plan.description}</p>
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

function RecurringCard({ option, index }: { option: RecurringOption; index: number }) {
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
        option.popular
          ? "border-amber-300/40 bg-amber-300/[0.07] shadow-[0_24px_70px_rgba(251,191,36,.09)]"
          : "border-white/10 bg-white/[0.035]",
      ].join(" ")}
    >
      {option.popular && <span className="absolute right-5 top-5 rounded-full border border-amber-200/25 bg-amber-300/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-200">Mais prático</span>}
      <h3 className="pr-24 font-display text-3xl font-light">{option.name}</h3>
      <p className="mt-3 min-h-[96px] text-sm leading-6 text-white/55">{option.description}</p>
      <div className="my-5 border-y border-white/10 py-5">
        <div className="text-4xl"><Price value={option.price} /></div>
        <p className="mt-1 text-xs text-white/42">{option.label}</p>
      </div>
      <ul className="space-y-3 text-sm leading-6 text-white/68">
        {option.features.map((feature) => <li key={feature} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-amber-300" /><span>{feature}</span></li>)}
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
            <a href="#pos-entrega" className="transition hover:text-white">Pós-entrega</a>
            <a href="#seguranca" className="transition hover:text-white">Segurança</a>
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
            <p className="mt-12 text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">Projeto completo · regra simples · custo previsível</p>
            <h1 className="mx-auto mt-6 max-w-5xl font-display text-5xl font-light leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-[6rem]">Site vitrine pode ficar sem mensalidade. Sistema com dados usa infraestrutura de produção.</h1>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/60 sm:text-lg">Você não paga banco de dados quando não precisa dele. Quando o projeto guarda pedidos, agenda, contas ou painel, a infraestrutura passa a fazer parte da operação — separada do preço de criação.</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#criacao" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">Comparar projetos<ArrowRight className="h-4 w-4" /></a>
              <ProposalButton label="Conversar sobre meu projeto" />
            </div>
          </div>
        </section>

        <section id="criacao" className="scroll-mt-24 px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">Criação</p><h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-6xl">Todos saem profissionais e animados. O que muda é a profundidade.</h2><p className="mt-5 text-sm leading-7 text-white/55 sm:text-base">Direção visual, responsividade, publicação e primeiro ano do domínio .com.br entram em todos. Banco, login e painel só entram quando o projeto realmente precisa.</p></div></Reveal>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">{CREATION_PLANS.map((plan, index) => <CreationCard key={plan.name} plan={plan} index={index} />)}</div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#081019] px-4 py-16">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {[
              { icon: Globe2, title: "Domínio incluído", text: "Um .com.br disponível por 1 ano entra em qualquer plano de criação." },
              { icon: Database, title: "Banco só quando precisa", text: "Site vitrine não recebe banco só para justificar mensalidade. Pedidos, contas, agenda e painel usam backend de produção." },
              { icon: CircleDollarSign, title: "Preço separado", text: "Criação é uma coisa. Infraestrutura operacional é outra. Você sabe antes de fechar se haverá custo mensal." },
            ].map((item, index) => <Reveal key={item.title} delay={index * 0.07}><div className="h-full rounded-2xl border border-white/10 bg-white/[0.035] p-6"><item.icon className="h-5 w-5 text-amber-300" /><h3 className="mt-5 font-display text-2xl">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/52">{item.text}</p></div></Reveal>)}
          </div>
        </section>

        <section id="pos-entrega" className="scroll-mt-24 px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-200">Depois da publicação</p><h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-6xl">Sem sistema, R$ 0. Com sistema, infraestrutura a partir de R$ 179/mês.</h2></div><p className="max-w-md text-sm leading-7 text-white/55">A mensalidade de infraestrutura não é manutenção disfarçada. Ela existe para manter backend, dados, autenticação e recursos operacionais em ambiente de produção.</p></div></Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{RECURRING_OPTIONS.map((option, index) => <RecurringCard key={option.name} option={option} index={index} />)}</div>
            <div className="mt-7 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:grid-cols-3">
              <div className="flex gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><div><h3 className="font-semibold">Suporte avulso: R$ 150/h</h3><p className="mt-1 text-sm leading-6 text-white/50">Quem não assina suporte mensal continua podendo pedir alterações quando precisar.</p></div></div>
              <div className="flex gap-3"><Wrench className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><div><h3 className="font-semibold">Funcionalidade nova é projeto</h3><p className="mt-1 text-sm leading-6 text-white/50">A franquia mensal cobre ajustes. Módulos novos recebem escopo próprio antes de começar.</p></div></div>
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><div><h3 className="font-semibold">Sem free tier em operação crítica</h3><p className="mt-1 text-sm leading-6 text-white/50">Projetos que dependem de banco para funcionar são colocados em infraestrutura apropriada para produção.</p></div></div>
            </div>
          </div>
        </section>

        <section id="seguranca" className="scroll-mt-24 border-y border-white/10 bg-[#071018] px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">Segurança sem complicar a compra</p><h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-6xl">O cliente pode comprar como convidado. O cartão fica com o gateway.</h2><p className="mt-5 text-sm leading-7 text-white/55 sm:text-base">Conta do comprador é conveniência, não obrigação. Quando houver login, painel ou dados privados, aplicamos regras de acesso e proteção no backend. Dados brutos de cartão não são armazenados pela Vitrine Base.</p></div></Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                { icon: LockKeyhole, title: "Acesso protegido", text: "Sessões, permissões e políticas de acesso impedem que um usuário leia dados de outro." },
                { icon: ShieldCheck, title: "Segredos fora do navegador", text: "Chaves administrativas e credenciais sensíveis ficam no servidor, nunca expostas no frontend." },
                { icon: Database, title: "Dados de operação", text: "Pedidos, agenda e contas ficam em backend próprio do projeto; cartão e CVV ficam com o provedor de pagamento." },
              ].map((item, index) => <Reveal key={item.title} delay={index * 0.07}><div className="h-full rounded-3xl border border-white/10 bg-white/[0.035] p-6"><item.icon className="h-5 w-5 text-cyan-200" /><h3 className="mt-5 font-display text-2xl">{item.title}</h3><p className="mt-3 text-sm leading-7 text-white/52">{item.text}</p></div></Reveal>)}
            </div>
          </div>
        </section>

        <section id="extras" className="scroll-mt-24 px-4 py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
            <Reveal><p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">Custos externos</p><h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-5xl">Extra só quando depende de fornecedor, escolha ou consumo real.</h2><p className="mt-5 text-sm leading-7 text-white/55">Tudo que for necessário para o projeto é explicado na proposta. Se um serviço externo cobra licença, tarifa ou excedente, isso aparece antes da aprovação.</p></Reveal>
            <Reveal delay={0.08}><div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"><ul className="space-y-4 text-sm leading-7 text-white/68">{EXTERNAL_COSTS.map((item) => <li key={item} className="flex gap-3"><Sparkles className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />{item}</li>)}</ul><div className="mt-7 rounded-2xl border border-amber-300/20 bg-amber-300/[0.055] p-5 text-sm leading-6 text-amber-50/78"><strong className="block text-amber-200">O primeiro domínio .com.br não é extra.</strong>Ele entra por 1 ano em qualquer plano de criação. Em planos operacionais ativos, a renovação anual fica incluída.</div></div></Reveal>
          </div>
        </section>

        <section className="px-4 py-24 text-center"><div className="mx-auto max-w-4xl"><p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-200">Próximo passo</p><h2 className="mt-4 font-display text-4xl font-light tracking-[-0.045em] sm:text-6xl">Primeiro definimos o que o negócio precisa. Só então decidimos se existe infraestrutura mensal.</h2><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">Assim você não paga por banco de dados num site simples e também não coloca uma operação real em infraestrutura gratuita sujeita a limitações.</p><div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><ProposalButton label="Solicitar proposta pelo WhatsApp" /><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/[0.08] hover:text-white">Ver projetos no Instagram<Instagram className="h-4 w-4" /></a></div></div></section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-xs text-white/38"><div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>Vitrine Base · sites e webapps para negócios locais</span><span>Valores finais dependem do escopo aprovado em proposta.</span></div></footer>
    </div>
  );
}
