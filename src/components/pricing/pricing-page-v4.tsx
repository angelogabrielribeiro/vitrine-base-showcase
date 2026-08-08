import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
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

type CardData = {
  name: string;
  price: string;
  description: string;
  features: string[];
  prefix?: string;
  badge?: string;
};

const CREATION: CardData[] = [
  {
    name: "Essencial",
    price: "1.190",
    description: "Site profissional, animado e responsivo para uma operação mais enxuta.",
    features: [
      "Direção visual adaptada ao negócio",
      "Animações e microinterações",
      "Celular + computador",
      "Domínio .com.br por 1 ano",
      "Publicação e configuração inicial",
      "Google Analytics 4 + Google Search Console",
      "Medição de visitas, origem do tráfego e cliques principais",
      "WhatsApp, formulários e catálogo conforme o escopo",
      "SEO técnico essencial",
      "Até 2 rodadas de ajustes",
    ],
  },
  {
    name: "Recomendado",
    price: "1.590",
    badge: "Mais escolhido",
    description: "Mais profundidade visual, conteúdo e jornada comercial para vender melhor.",
    features: [
      "Tudo do Essencial",
      "Mais páginas, seções e produtos",
      "Animações e experiência mais elaboradas",
      "Carrinho e checkout externo conforme o escopo",
      "Eventos de conversão principais conforme o projeto",
      "Estrutura orientada para conversão",
      "Integrações essenciais previstas em proposta",
      "Até 3 rodadas de ajustes",
    ],
  },
  {
    name: "Premium",
    prefix: "A partir de",
    price: "2.190",
    description: "Para projetos com sistema, agenda, painel, contas ou regras próprias de operação.",
    features: [
      "Tudo do Recomendado",
      "Agendamento e regras personalizadas",
      "Painel administrativo quando necessário",
      "Contas, histórico e perfis de acesso",
      "Múltiplos profissionais ou unidades",
      "Mensuração avançada e integrações de conversão previstas em escopo",
      "Automações e integrações adicionais",
      "Componentes e interações exclusivas",
    ],
  },
];

const RECURRING: CardData[] = [
  {
    name: "Vitrine sem sistema",
    price: "0",
    description: "Para site, catálogo ou cardápio que não precisa guardar pedidos, contas ou agenda em banco próprio.",
    features: [
      "Sem mensalidade técnica",
      "Hospedagem estática adequada ao escopo",
      "Não depende de banco gratuito sujeito a pausa",
      "Google Analytics e Search Console continuam disponíveis",
      "Venda por WhatsApp ou checkout externo",
      "Após o 1º ano, cliente renova apenas o domínio",
      "Alterações futuras: R$ 150/h",
    ],
  },
  {
    name: "Operação",
    price: "249",
    description: "Infraestrutura para projetos que realmente dependem de banco, login, painel, pedidos salvos ou agenda própria.",
    features: [
      "Backend e banco em plano de produção",
      "Autenticação quando houver contas",
      "Backups e retenção de produção",
      "Políticas de acesso e segredos protegidos",
      "Monitoramento básico da infraestrutura",
      "Medição de tráfego e conversões continua ativa",
      "Renovação anual do .com.br enquanto ativo",
    ],
  },
  {
    name: "Operação + Suporte",
    price: "349",
    badge: "Mais prático",
    description: "Infraestrutura cuidada + uma franquia mensal pequena para não pagar ajuste avulso toda vez.",
    features: [
      "Tudo do plano Operação",
      "1 hora mensal para pequenos ajustes e conteúdo",
      "Leitura mensal simples de tráfego e conversões",
      "Prioridade sobre demandas avulsas",
      "Correções de defeitos da implementação não consomem a hora",
      "Relato simples do que foi alterado",
    ],
  },
  {
    name: "Operação + Evolução",
    price: "499",
    description: "Para negócios que mudam ofertas, conteúdo e operação com frequência.",
    features: [
      "Tudo do Operação + Suporte",
      "2 horas mensais para ajustes e evolução",
      "Prioridade maior na fila",
      "Revisão mensal de pontos técnicos, comerciais e de conversão",
      "Horas excedentes somente com aprovação prévia",
    ],
  },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Price({ value }: { value: string }) {
  return (
    <div className="font-display text-5xl font-semibold tracking-[-0.05em]">
      <span className="mr-2 text-base text-white/45">R$</span>{value}
    </div>
  );
}

function Card({ data, recurring = false }: { data: CardData; recurring?: boolean }) {
  return (
    <article className="relative flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20">
      {data.badge && (
        <span className="absolute right-5 top-5 rounded-full bg-cyan-300 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-950">
          {data.badge}
        </span>
      )}
      <h3 className="pr-24 font-display text-3xl font-semibold tracking-[-0.04em]">{data.name}</h3>
      <p className="mt-4 min-h-[76px] text-sm leading-6 text-white/55">{data.description}</p>
      <div className="my-6 border-y border-white/10 py-5">
        {data.prefix && <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-white/40">{data.prefix}</p>}
        <Price value={data.price} />
        <p className="mt-2 text-xs text-white/40">{recurring ? "por mês" : "50% no início · 50% antes da publicação"}</p>
      </div>
      <ul className="space-y-3 text-sm leading-6 text-white/70">
        {data.features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <Check className="mt-1 h-4 w-4 shrink-0 text-amber-300" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function PricingPageV4() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#05070a] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070a]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" className="font-semibold tracking-[0.2em] text-amber-300">VITRINE BASE</Link>
          <a href={PROPOSAL_URL} target="_blank" rel="noreferrer" className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-semibold text-cyan-100">
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10 px-4 py-24 sm:py-32">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.14),transparent_35%),radial-gradient(circle_at_80%_75%,rgba(251,191,36,.1),transparent_32%)]" />
          <div className="relative mx-auto max-w-5xl text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-white/48"><ArrowLeft className="h-4 w-4" />Voltar às demonstrações</Link>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">Preço claro · infraestrutura só quando precisa</p>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              Site vitrine pode ficar sem mensalidade. Sistema com dados usa infraestrutura de produção.
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/60">
              Criação e infraestrutura são coisas diferentes. Você só paga backend recorrente quando o projeto realmente depende dele para funcionar.
            </p>
          </div>
        </section>

        <section id="criacao" className="px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">Criação</p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Todos são profissionais, responsivos e animados.</h2>
                <p className="mt-5 text-sm leading-7 text-white/55">O que muda é a profundidade visual e a complexidade da operação. Google Analytics 4 e Search Console já entram na base para medir visitas, origem do tráfego e ações importantes.</p>
              </div>
            </Reveal>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {CREATION.map((plan, index) => <Reveal key={plan.name} delay={index * 0.06}><Card data={plan} /></Reveal>)}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#081019] px-4 py-16">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {[
              { icon: Globe2, title: "Domínio incluído", text: "Um .com.br disponível por 1 ano entra em qualquer plano de criação." },
              { icon: Database, title: "Banco só quando precisa", text: "Pedidos, contas, agenda e painel usam backend de produção. Site vitrine não." },
              { icon: CircleDollarSign, title: "Mensuração incluída", text: "Google Analytics 4 e Search Console ajudam a acompanhar visitantes, origem do tráfego, buscas e ações importantes sem aumentar o preço de criação." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <item.icon className="h-5 w-5 text-amber-300" />
                <h3 className="mt-5 font-display text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/52">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pos-entrega" className="px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="max-w-4xl">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-200">Depois da publicação</p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Sem sistema: R$ 0. Com sistema: infraestrutura a partir de R$ 249/mês.</h2>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/55">Os planos maiores somam suporte, leitura de desempenho e horas de evolução. A infraestrutura base continua a mesma.</p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {RECURRING.map((option, index) => <Reveal key={option.name} delay={index * 0.05}><Card data={option} recurring /></Reveal>)}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#071018] px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-200">Segurança</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Operação real não depende de free tier.</h2>
              <p className="mt-5 text-sm leading-7 text-white/55">Quando houver dados privados, login ou painel, usamos backend de produção, políticas de acesso e segredos fora do navegador. Dados brutos de cartão não ficam armazenados pela Vitrine Base.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                { icon: LockKeyhole, title: "Acesso protegido", text: "Cada usuário acessa somente o que sua permissão permite." },
                { icon: ShieldCheck, title: "Credenciais protegidas", text: "Chaves administrativas e segredos ficam fora do frontend." },
                { icon: Database, title: "Dados persistidos", text: "Pedidos e agenda ficam no backend; cartão e CVV ficam com o gateway de pagamento." },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                  <item.icon className="h-5 w-5 text-cyan-200" />
                  <h3 className="mt-5 font-display text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/52">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-24">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
              <Wrench className="h-5 w-5 text-amber-300" />
              <h3 className="mt-5 font-display text-3xl">Suporte avulso continua existindo</h3>
              <p className="mt-3 text-sm leading-7 text-white/55">Quem tem uma vitrine de R$ 0/mês pode pedir alterações por R$ 150/h. Funcionalidades novas recebem orçamento próprio.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
              <Clock3 className="h-5 w-5 text-amber-300" />
              <h3 className="mt-5 font-display text-3xl">Custos externos não são escondidos</h3>
              <p className="mt-3 text-sm leading-7 text-white/55">Gateway de pagamento, API paga, mensagens, e-mail profissional ou consumo acima do previsto só entram quando o projeto realmente usar esses serviços.</p>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 text-center">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 sm:p-12">
            <Sparkles className="mx-auto h-5 w-5 text-amber-300" />
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Primeiro entendemos o negócio. Depois escolhemos a estrutura certa.</h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={PROPOSAL_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950">
                Conversar pelo WhatsApp <MessageCircle className="h-4 w-4" />
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white/70">
                Ver Instagram <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}