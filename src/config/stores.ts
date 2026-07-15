import type { StoreConfig } from "@/types/commerce";

export const STORES: StoreConfig[] = [
  {
    id: "moda",
    slug: "moda",
    name: "Maison Belle",
    tagline: "Moda feminina contemporânea",
    description:
      "Coleções autorais em tecidos nobres, com peças curadas para o dia a dia sofisticado.",
    niche: "fashion",
    logoText: "Maison Belle",
    theme: {
      background: "oklch(0.985 0.006 85)",
      foreground: "oklch(0.22 0.02 60)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.22 0.02 60)",
      primary: "oklch(0.32 0.03 45)",
      primaryForeground: "oklch(0.985 0.006 85)",
      secondary: "oklch(0.94 0.015 80)",
      secondaryForeground: "oklch(0.28 0.03 55)",
      muted: "oklch(0.94 0.012 80)",
      mutedForeground: "oklch(0.5 0.02 60)",
      accent: "oklch(0.78 0.05 55)",
      accentForeground: "oklch(0.22 0.02 60)",
      border: "oklch(0.9 0.012 80)",
      ring: "oklch(0.62 0.04 55)",
      radius: "0.5rem",
    },
    fonts: {
      display: '"Cormorant Garamond", serif',
      body: '"Inter", sans-serif',
      linkHref:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap",
    },
    cardStyle: "editorial",
    whatsapp: "5511988887777",
    instagram: "@maisonbelle",
    address: "Rua Oscar Freire, 1200 — Jardins, São Paulo/SP",
    hours: [
      { label: "Seg a Sex", value: "10h — 20h" },
      { label: "Sábado", value: "10h — 18h" },
      { label: "Domingo", value: "Fechado" },
    ],
    fulfillment: { pickup: true, localDelivery: false, shipping: true },
    deliveryFee: 24.9,
    minOrder: 0,
    categories: [
      { slug: "vestidos", name: "Vestidos" },
      { slug: "conjuntos", name: "Conjuntos" },
      { slug: "blusas", name: "Blusas" },
      { slug: "calcas", name: "Calças" },
      { slug: "bolsas", name: "Bolsas" },
      { slug: "acessorios", name: "Acessórios" },
    ],
    banners: [
      {
        title: "Coleção Alta Primavera",
        subtitle: "Tons neutros, tecidos naturais e caimento impecável.",
        ctaLabel: "Ver coleção",
        ctaHref: "produtos",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    benefits: [
      { title: "Frete para todo Brasil", description: "Envios em até 48h úteis.", icon: "truck" },
      { title: "Trocas fáceis", description: "Até 30 dias sem burocracia.", icon: "refresh" },
      { title: "Peças exclusivas", description: "Produção limitada e autoral.", icon: "sparkles" },
    ],
    faq: [
      { q: "Qual o prazo de troca?", a: "Você tem até 30 dias corridos para trocar sua peça." },
      { q: "Vocês enviam para todo o Brasil?", a: "Sim, enviamos via transportadora e Correios." },
      { q: "Como saber meu tamanho?", a: "Cada produto tem uma tabela de medidas detalhada." },
    ],
    messages: {
      heroKicker: "NOVA COLEÇÃO",
      heroTitle: "Sofisticação em cada detalhe",
      heroSubtitle:
        "Peças autorais em tecidos nobres, pensadas para mulheres que valorizam presença e conforto.",
      heroCta: "Explorar coleção",
      aboutTitle: "Feito para durar, pensado para encantar",
      aboutBody:
        "A Maison Belle nasceu para vestir mulheres que amam moda com propósito. Cada peça é desenvolvida em pequenos lotes, com atenção artesanal.",
    },
    checkout: {
      payments: ["pix", "credit", "debit"],
      allowCoupon: true,
      marketingConsentDefault: false,
    },
  },
  {
    id: "barbearia",
    slug: "barbearia",
    name: "Barber Noir",
    tagline: "Barbearia premium & grooming",
    description:
      "Cortes clássicos, barba desenhada e ritual de grooming em um ambiente sofisticado.",
    niche: "barber",
    logoText: "BARBER NOIR",
    theme: {
      background: "oklch(0.14 0.01 250)",
      foreground: "oklch(0.96 0.01 90)",
      card: "oklch(0.19 0.012 250)",
      cardForeground: "oklch(0.96 0.01 90)",
      primary: "oklch(0.78 0.14 85)",
      primaryForeground: "oklch(0.15 0.01 250)",
      secondary: "oklch(0.24 0.015 250)",
      secondaryForeground: "oklch(0.96 0.01 90)",
      muted: "oklch(0.22 0.012 250)",
      mutedForeground: "oklch(0.7 0.015 90)",
      accent: "oklch(0.72 0.12 60)",
      accentForeground: "oklch(0.15 0.01 250)",
      border: "oklch(0.28 0.015 250)",
      ring: "oklch(0.78 0.14 85)",
      radius: "0.375rem",
    },
    fonts: {
      display: '"Bebas Neue", sans-serif',
      body: '"Inter", sans-serif',
      linkHref:
        "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap",
    },
    cardStyle: "editorial",
    whatsapp: "5511977776666",
    instagram: "@barbernoir",
    address: "Rua Augusta, 2100 — Consolação, São Paulo/SP",
    hours: [
      { label: "Ter a Sex", value: "10h — 21h" },
      { label: "Sábado", value: "9h — 19h" },
      { label: "Dom e Seg", value: "Fechado" },
    ],
    fulfillment: { pickup: true, localDelivery: false, shipping: true },
    deliveryFee: 19.9,
    minOrder: 0,
    categories: [
      { slug: "barba", name: "Barba" },
      { slug: "cabelo", name: "Cabelo" },
      { slug: "pos-barba", name: "Pós-barba" },
      { slug: "acessorios", name: "Acessórios" },
      { slug: "kits", name: "Kits" },
    ],
    banners: [
      {
        title: "Ritual completo Barber Noir",
        subtitle: "Corte + barba + toalha quente. A experiência definitiva.",
        ctaLabel: "Agendar agora",
        ctaHref: "agendar",
        image:
          "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    benefits: [
      { title: "Barbeiros premiados", description: "Time de referência na cidade.", icon: "sparkles" },
      { title: "Agendamento online", description: "Escolha serviço, horário e profissional.", icon: "gift" },
      { title: "Grooming exclusivo", description: "Produtos autorais assinados pela casa.", icon: "truck" },
    ],
    faq: [
      { q: "Preciso agendar?", a: "Recomendamos agendar. Atendimentos sem agenda ficam por ordem de chegada." },
      { q: "Posso remarcar?", a: "Sim, até 2h antes do horário reservado, sem custo." },
      { q: "Quanto tempo dura o ritual completo?", a: "Cerca de 1h15, incluindo lavagem, corte, barba e finalização." },
    ],
    messages: {
      heroKicker: "DESDE 2014 · SÃO PAULO",
      heroTitle: "Barbearia clássica com alma contemporânea.",
      heroSubtitle:
        "Ambiente reservado, barbeiros premiados e um portfólio de grooming pensado para o homem que valoriza cada detalhe.",
      heroCta: "Agendar horário",
      aboutTitle: "Um refúgio para o homem moderno",
      aboutBody:
        "Na Barber Noir cada visita é um ritual. Do café ao pós-barba, cuidamos de cada etapa para você sair renovado.",
    },
    checkout: {
      payments: ["pix", "credit", "debit"],
      allowCoupon: true,
      marketingConsentDefault: false,
    },
  },
  {
    id: "restaurante",
    slug: "restaurante",
    name: "Brasa Urbana",
    tagline: "Hamburgueria & grelhados",
    description: "Blends selecionados, cortes na brasa e clássicos que abraçam.",
    niche: "restaurant",
    logoText: "Brasa Urbana",
    theme: {
      background: "oklch(0.16 0.02 40)",
      foreground: "oklch(0.96 0.015 80)",
      card: "oklch(0.22 0.02 40)",
      cardForeground: "oklch(0.96 0.015 80)",
      primary: "oklch(0.68 0.18 40)",
      primaryForeground: "oklch(0.14 0.02 40)",
      secondary: "oklch(0.26 0.03 40)",
      secondaryForeground: "oklch(0.96 0.015 80)",
      muted: "oklch(0.24 0.02 40)",
      mutedForeground: "oklch(0.72 0.02 60)",
      accent: "oklch(0.75 0.16 70)",
      accentForeground: "oklch(0.14 0.02 40)",
      border: "oklch(0.3 0.02 40)",
      ring: "oklch(0.68 0.18 40)",
      radius: "1.25rem",
    },
    fonts: {
      display: '"Anton", sans-serif',
      body: '"Inter", sans-serif',
      linkHref:
        "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap",
    },
    cardStyle: "warm",
    whatsapp: "5511966665555",
    instagram: "@brasaurbana",
    address: "Alameda das Brasas, 42 — Pinheiros, São Paulo/SP",
    hours: [
      { label: "Ter a Qui", value: "18h — 23h" },
      { label: "Sex e Sáb", value: "18h — 00h" },
      { label: "Domingo", value: "18h — 22h" },
    ],
    fulfillment: { pickup: true, localDelivery: true, shipping: false },
    deliveryFee: 9.9,
    minOrder: 30,
    categories: [
      { slug: "entradas", name: "Entradas" },
      { slug: "hamburgueres", name: "Hambúrgueres" },
      { slug: "pratos", name: "Pratos" },
      { slug: "bebidas", name: "Bebidas" },
      { slug: "sobremesas", name: "Sobremesas" },
    ],
    banners: [
      {
        title: "Combo da casa",
        subtitle: "Burger duplo + fritas rústicas + chopp artesanal.",
        ctaLabel: "Peça agora",
        ctaHref: "categoria/hamburgueres",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    benefits: [
      { title: "Delivery rápido", description: "Média de 40 min na sua porta.", icon: "truck" },
      { title: "Ingredientes frescos", description: "Feito todo dia, do jeito certo.", icon: "sparkles" },
      { title: "Pedidos personalizados", description: "Do ponto ao molho, do seu jeito.", icon: "gift" },
    ],
    faq: [
      { q: "Qual o horário de entrega?", a: "Entregamos durante todo o horário de funcionamento." },
      { q: "Posso retirar no local?", a: "Sim, é só escolher a opção retirada no checkout." },
      { q: "Aceitam reserva?", a: "Sim, entre em contato pelo WhatsApp." },
    ],
    messages: {
      heroKicker: "NA BRASA, COMO TEM QUE SER",
      heroTitle: "Fogo alto, sabor de verdade",
      heroSubtitle: "Blends próprios, cortes selecionados e clássicos que ninguém resiste.",
      heroCta: "Ver cardápio",
      aboutTitle: "Sobre a Brasa Urbana",
      aboutBody:
        "Somos apaixonados por carne bem-feita. Selecionamos cortes, moemos nossos blends e cuidamos de cada detalhe da chapa até a mesa.",
    },
    checkout: {
      payments: ["pix", "credit", "debit", "cash"],
      allowCoupon: true,
      marketingConsentDefault: false,
    },
  },
];

export function getStore(slug: string): StoreConfig | undefined {
  return STORES.find((s) => s.slug === slug);
}

export function requireStore(slug: string): StoreConfig {
  const s = getStore(slug);
  if (!s) throw new Error(`Loja não encontrada: ${slug}`);
  return s;
}
