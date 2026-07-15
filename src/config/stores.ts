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
    id: "mercado",
    slug: "mercado",
    name: "Casa do Sabor",
    tagline: "Empório & mercearia artesanal",
    description: "Cafés especiais, doces caseiros, massas frescas e produtos escolhidos a dedo.",
    niche: "grocery",
    logoText: "Casa do Sabor",
    theme: {
      background: "oklch(0.97 0.02 90)",
      foreground: "oklch(0.22 0.04 150)",
      card: "oklch(0.99 0.012 90)",
      cardForeground: "oklch(0.22 0.04 150)",
      primary: "oklch(0.36 0.08 155)",
      primaryForeground: "oklch(0.98 0.02 90)",
      secondary: "oklch(0.9 0.03 95)",
      secondaryForeground: "oklch(0.26 0.05 150)",
      muted: "oklch(0.93 0.02 95)",
      mutedForeground: "oklch(0.48 0.04 130)",
      accent: "oklch(0.72 0.14 65)",
      accentForeground: "oklch(0.22 0.04 150)",
      border: "oklch(0.88 0.03 95)",
      ring: "oklch(0.55 0.1 150)",
      radius: "1rem",
    },
    fonts: {
      display: '"Fraunces", serif',
      body: '"Nunito Sans", sans-serif',
      linkHref:
        "https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Nunito+Sans:wght@400;600;700&display=swap",
    },
    cardStyle: "warm",
    whatsapp: "5511977776666",
    instagram: "@casadosabor",
    address: "Rua das Oliveiras, 85 — Vila Madalena, São Paulo/SP",
    hours: [
      { label: "Seg a Sáb", value: "8h — 20h" },
      { label: "Domingo", value: "9h — 14h" },
    ],
    fulfillment: { pickup: true, localDelivery: true, shipping: true },
    deliveryFee: 12.9,
    minOrder: 40,
    categories: [
      { slug: "cafes", name: "Cafés" },
      { slug: "doces", name: "Doces" },
      { slug: "massas", name: "Massas" },
      { slug: "molhos", name: "Molhos" },
      { slug: "bebidas", name: "Bebidas" },
      { slug: "kits", name: "Kits" },
    ],
    banners: [
      {
        title: "Cesta artesanal do mês",
        subtitle: "Selecionamos os melhores itens da estação para a sua mesa.",
        ctaLabel: "Ver kits",
        ctaHref: "categoria/kits",
        image:
          "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    benefits: [
      { title: "Entrega local no mesmo dia", description: "Pedidos até 15h saem no dia.", icon: "truck" },
      { title: "Produtores locais", description: "Curadoria feita com carinho.", icon: "sparkles" },
      { title: "Kits presenteáveis", description: "Prontos para brindar quem você ama.", icon: "gift" },
    ],
    faq: [
      { q: "Vocês entregam onde?", a: "Entrega local em toda a zona oeste de SP e envios para todo o Brasil." },
      { q: "Posso montar um kit?", a: "Sim! Fale com a gente pelo WhatsApp." },
      { q: "Como armazenar os cafés?", a: "Em pote fechado, ao abrigo de luz e calor." },
    ],
    messages: {
      heroKicker: "EMPÓRIO ARTESANAL",
      heroTitle: "Sabor de verdade, direto da nossa casa",
      heroSubtitle:
        "Uma seleção artesanal de cafés, massas e doces para transformar suas refeições em pequenos rituais.",
      heroCta: "Ver produtos",
    aboutTitle: "Uma casa cheia de sabor",
      aboutBody:
        "Trabalhamos com pequenos produtores para trazer até você os melhores ingredientes, com transparência e afeto.",
    },
    checkout: {
      payments: ["pix", "credit", "debit", "cash"],
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
