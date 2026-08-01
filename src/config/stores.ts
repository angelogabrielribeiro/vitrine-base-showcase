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
      background: "oklch(0.955 0.018 58)",
      foreground: "oklch(0.23 0.035 350)",
      card: "oklch(0.93 0.026 48)",
      cardForeground: "oklch(0.23 0.035 350)",
      primary: "oklch(0.38 0.13 355)",
      primaryForeground: "oklch(0.96 0.018 58)",
      secondary: "oklch(0.84 0.055 25)",
      secondaryForeground: "oklch(0.28 0.07 350)",
      muted: "oklch(0.88 0.035 45)",
      mutedForeground: "oklch(0.47 0.045 350)",
      accent: "oklch(0.7 0.1 70)",
      accentForeground: "oklch(0.23 0.035 350)",
      border: "oklch(0.79 0.04 42)",
      ring: "oklch(0.62 0.12 55)",
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
    whatsappRequiredAfterCheckout: true,
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
    whatsappRequiredAfterCheckout: true,
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
    whatsappRequiredAfterCheckout: true,
    checkout: {
      payments: ["pix", "credit", "debit", "cash"],
      allowCoupon: true,
      marketingConsentDefault: false,
    },
  },
  {
    id: "eletronicos",
    slug: "eletronicos",
    name: "NovaCore Electronics",
    tagline: "Tecnologia de alta performance",
    description:
      "Curadoria premium de eletrônicos, gaming e áudio com garantia estendida e envio expresso.",
    niche: "electronics",
    logoText: "NOVACORE",
    theme: {
      background: "oklch(0.14 0.02 265)",
      foreground: "oklch(0.97 0.01 260)",
      card: "oklch(0.19 0.025 265)",
      cardForeground: "oklch(0.97 0.01 260)",
      primary: "oklch(0.72 0.19 245)",
      primaryForeground: "oklch(0.12 0.02 265)",
      secondary: "oklch(0.24 0.03 265)",
      secondaryForeground: "oklch(0.97 0.01 260)",
      muted: "oklch(0.22 0.025 265)",
      mutedForeground: "oklch(0.72 0.03 260)",
      accent: "oklch(0.78 0.18 300)",
      accentForeground: "oklch(0.12 0.02 265)",
      border: "oklch(0.3 0.03 265)",
      ring: "oklch(0.72 0.19 245)",
      radius: "0.9rem",
    },
    fonts: {
      display: '"Space Grotesk", sans-serif',
      body: '"Inter", sans-serif',
      linkHref:
        "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap",
    },
    cardStyle: "editorial",
    whatsapp: "5511955554444",
    instagram: "@novacore.tech",
    address: "Av. Paulista, 1500 — Bela Vista, São Paulo/SP",
    hours: [
      { label: "Seg a Sex", value: "09h — 21h" },
      { label: "Sábado", value: "10h — 20h" },
      { label: "Domingo", value: "12h — 18h" },
    ],
    fulfillment: { pickup: true, localDelivery: false, shipping: true },
    deliveryFee: 0,
    minOrder: 0,
    categories: [
      { slug: "smartphones", name: "Smartphones" },
      { slug: "computadores", name: "Computadores" },
      { slug: "gamer", name: "Gamer" },
      { slug: "audio", name: "Áudio" },
      { slug: "wearables", name: "Wearables" },
      { slug: "acessorios", name: "Acessórios" },
    ],
    banners: [
      {
        title: "NovaCore X Series",
        subtitle: "Performance que redefine o padrão. Reserve agora.",
        ctaLabel: "Explorar",
        ctaHref: "produtos",
        image:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    benefits: [
      { title: "Frete expresso grátis", description: "Entregas em 24h nas capitais.", icon: "truck" },
      { title: "Garantia estendida", description: "12 meses de cobertura NovaCore.", icon: "sparkles" },
      { title: "Parcelamento em 12x", description: "Sem juros no cartão.", icon: "gift" },
    ],
    faq: [
      { q: "A garantia cobre defeito de fabricação?", a: "Sim, cobertura total por 12 meses." },
      { q: "Qual o prazo de entrega?", a: "Expresso 24h nas capitais e até 5 dias úteis nas demais regiões." },
      { q: "Posso retirar na loja?", a: "Sim, retirada express em até 2 horas após o pedido." },
    ],
    messages: {
      heroKicker: "NEXT GEN · 2026",
      heroTitle: "Tecnologia sem compromissos.",
      heroSubtitle:
        "Curadoria absoluta de smartphones, notebooks, gaming e áudio — com performance verificada e suporte especialista.",
      heroCta: "Explorar catálogo",
      aboutTitle: "Feito para quem exige o máximo",
      aboutBody:
        "NovaCore seleciona apenas dispositivos que passam por bancada de testes própria. Nada entra no catálogo sem entregar o que promete.",
    },
    whatsappRequiredAfterCheckout: true,
    checkout: {
      payments: ["pix", "credit", "debit"],
      allowCoupon: true,
      marketingConsentDefault: false,
    },
  },
];

export function getStore(slug: string): StoreConfig | undefined {
  const base = STORES.find((s) => s.slug === slug);
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(`vitrine:${slug}:config`);
    if (raw) {
      const persisted = JSON.parse(raw) as StoreConfig;
      // Mescla: preserva chaves estáticas ausentes na versão persistida.
      return { ...(base ?? persisted), ...persisted };
    }
  } catch {
    // ignora e cai no fallback estático
  }
  return base;
}

export function requireStore(slug: string): StoreConfig {
  const s = getStore(slug);
  if (!s) throw new Error(`Loja não encontrada: ${slug}`);
  return s;
}
