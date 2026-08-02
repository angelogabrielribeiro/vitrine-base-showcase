import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileText,
  HelpCircle,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { StoreConfig } from "@/types/commerce";
import { useInView, sequenceDelay } from "@/hooks/use-in-view";
import { waStore } from "@/lib/whatsapp";

type Tone = {
  section: string;
  kicker: string;
  title: string;
  body: string;
  card: string;
  edge: string;
  accent: string;
};

const TONES: Record<StoreConfig["niche"], Tone> = {
  fashion: {
    section: "bg-[#f6ece6] text-[#33161f]",
    kicker: "text-[#9d5566]",
    title: "font-display",
    body: "text-[#33161f]/70",
    card: "border-[#c98f9d]/35 bg-[#fbf4f0]",
    edge: "rgba(157,85,102,.55)",
    accent: "text-[#8d4356]",
  },
  barber: {
    section: "bg-[#0a0b0c] text-[#f4efe3]",
    kicker: "text-[#d8b25f]",
    title: "font-display",
    body: "text-[#f4efe3]/62",
    card: "border-[#d8b25f]/22 bg-[#121314]",
    edge: "rgba(216,178,95,.5)",
    accent: "text-[#d8b25f]",
  },
  restaurant: {
    section: "bg-[#160805] text-[#fff2e4]",
    kicker: "text-[#f2a24a]",
    title: "font-display",
    body: "text-[#fff2e4]/64",
    card: "border-[#e2762c]/25 bg-[#1e0b06]",
    edge: "rgba(232,124,38,.55)",
    accent: "text-[#f2a24a]",
  },
  electronics: {
    section: "bg-[#04070f] text-[#eaf3ff]",
    kicker: "text-[#59d6f5]",
    title: "font-display",
    body: "text-[#eaf3ff]/62",
    card: "border-[#59d6f5]/22 bg-[#070d1a]",
    edge: "rgba(89,214,245,.5)",
    accent: "text-[#59d6f5]",
  },
};

const ABOUT: Record<StoreConfig["niche"], { kicker: string; title: string; body: string[] }> = {
  fashion: {
    kicker: "Quem somos",
    title: "Alfaiataria de autor, feita para durar",
    body: [
      "A Maison Belle nasceu de um ateliê pequeno e obstinado: poucas peças por coleção, tecidos escolhidos a dedo e caimento ajustado no corpo real.",
      "Atendemos por agendamento na loja e também online, com curadoria pessoal por WhatsApp para acertar tamanho e combinação antes da compra.",
    ],
  },
  barber: {
    kicker: "Sobre a casa",
    title: "Barbearia clássica com método próprio",
    body: [
      "A Barber Noir é um espaço de ritual: cadeira reclinável, toalha quente, navalha e tempo suficiente para fazer bem feito.",
      "Trabalhamos com horário marcado para que ninguém espere, e indicamos em cada atendimento como manter o corte em casa.",
    ],
  },
  restaurant: {
    kicker: "Nossa história",
    title: "Fogo alto, brasa constante, receita da casa",
    body: [
      "A Brasa Urbana começou numa churrasqueira de quintal e virou cozinha de bairro: carnes maturadas na casa, pães assados no dia e molhos feitos na hora.",
      "Trabalhamos com retirada, entrega no bairro e pedidos pelo WhatsApp, sempre com a mesma brasa acesa do início ao fim do serviço.",
    ],
  },
  electronics: {
    kicker: "Sobre a NovaCore",
    title: "Especialistas em configuração, não só em venda",
    body: [
      "A NovaCore Electronics monta, testa e documenta cada setup antes de entregar: nada sai da bancada sem checklist de estabilidade.",
      "Nosso time ajuda a escolher o equipamento pelo uso real — trabalho, estúdio ou jogo — e acompanha a instalação depois da entrega.",
    ],
  },
};

interface LinkDef {
  label: string;
  desc: string;
  icon: typeof Truck;
  to?: string;
  href?: string;
}

export function StoreInstitutional({ store }: { store: StoreConfig }) {
  const tone = TONES[store.niche];
  const about = ABOUT[store.niche];
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.15, once: true });
  const faq = store.faq.slice(0, 3);

  const links: LinkDef[] = [
    {
      label: "Trocas e devoluções",
      desc: "Prazos e como solicitar",
      icon: RefreshCcw,
      to: "/demo/$storeSlug/trocas",
    },
    {
      label: "Entrega e frete",
      desc: "Retirada, bairro e envio",
      icon: Truck,
      to: "/demo/$storeSlug/entrega",
    },
    {
      label: "Privacidade",
      desc: "Como tratamos seus dados",
      icon: ShieldCheck,
      to: "/demo/$storeSlug/privacidade",
    },
    { label: "Termos de uso", desc: "Condições da loja", icon: FileText, to: "/demo/$storeSlug/termos" },
    {
      label: "Perguntas frequentes",
      desc: "Dúvidas rápidas",
      icon: HelpCircle,
      to: "/demo/$storeSlug/faq",
    },
    {
      label: "Contato",
      desc: "Fale com a equipe",
      icon: MessageCircle,
      to: "/demo/$storeSlug/contato",
    },
  ];

  return (
    <section
      ref={ref}
      aria-labelledby={`institucional-${store.slug}`}
      className={`${tone.section} overflow-hidden px-5 py-16 sm:px-8 md:py-24`}
    >
      <div className="mx-auto max-w-6xl">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.32em] ${tone.kicker}`}>
          {about.kicker}
        </p>
        <h2
          id={`institucional-${store.slug}`}
          className={`${tone.title} mt-4 max-w-[22ch] text-[clamp(1.75rem,7vw,3.1rem)] font-semibold leading-[1.05] tracking-tight`}
        >
          {about.title}
        </h2>
        <div className={`mt-6 grid max-w-3xl gap-4 text-[0.95rem] leading-7 ${tone.body}`}>
          {about.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item, index) => {
            const Icon = item.icon;
            const inner = (
              <>
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(120% 80% at 0% 0%, ${tone.edge}, transparent 60%)`,
                    opacity: 0.14,
                  }}
                  aria-hidden
                />
                <span className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-current/20 ${tone.accent}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="relative min-w-0">
                  <span className="block truncate text-sm font-semibold">{item.label}</span>
                  <span className={`block truncate text-xs ${tone.body}`}>{item.desc}</span>
                </span>
              </>
            );
            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.5, delay: sequenceDelay(index) }}
              >
                {item.to ? (
                  <Link
                    to={item.to}
                    params={{ storeSlug: store.slug }}
                    className={`group relative flex min-h-16 items-center gap-3 overflow-hidden rounded-2xl border p-4 ${tone.card} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current`}
                  >
                    {inner}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group relative flex min-h-16 items-center gap-3 overflow-hidden rounded-2xl border p-4 ${tone.card}`}
                  >
                    {inner}
                  </a>
                )}
              </motion.li>
            );
          })}
        </ul>

        {faq.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {faq.map((f, i) => (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.5, delay: 0.3 + sequenceDelay(i) }}
                className={`rounded-2xl border p-4 ${tone.card}`}
              >
                <p className="text-sm font-semibold leading-snug">{f.q}</p>
                <p className={`mt-2 text-xs leading-6 ${tone.body}`}>{f.a}</p>
              </motion.div>
            ))}
          </div>
        )}

        <a
          href={waStore(store, `Olá, ${store.name}! Quero falar com a equipe.`)}
          target="_blank"
          rel="noreferrer"
          className={`mt-10 inline-flex min-h-12 items-center gap-2 rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.18em] ${tone.card} ${tone.accent}`}
        >
          <MessageCircle className="h-4 w-4" /> Falar com a loja
        </a>
      </div>
    </section>
  );
}
