// Tipos centrais da plataforma white-label.
// Toda página deve tipar seus dados por aqui.

export type StoreNiche = "fashion" | "barber" | "restaurant";

export interface StoreConfig {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  niche: StoreNiche;
  logoText: string;
  theme: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    ring: string;
    radius: string;
  };
  fonts: {
    display: string;
    body: string;
    linkHref?: string;
  };
  cardStyle: "soft" | "editorial" | "warm";
  whatsapp: string; // sem formatação: 5511999999999
  instagram: string;
  address: string;
  hours: { label: string; value: string }[];
  fulfillment: {
    pickup: boolean;
    localDelivery: boolean;
    shipping: boolean;
  };
  deliveryFee: number;
  minOrder: number;
  categories: { slug: string; name: string; icon?: string }[];
  banners: { title: string; subtitle: string; ctaLabel: string; ctaHref: string; image: string }[];
  benefits: { title: string; description: string; icon: string }[];
  faq: { q: string; a: string }[];
  messages: {
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    aboutTitle: string;
    aboutBody: string;
  };
  checkout: {
    payments: PaymentMethod[];
    allowCoupon: boolean;
    marketingConsentDefault: boolean;
  };
  /** Item destacado no Spotlight da home. Produto (por padrão) ou serviço (barbearia). */
  spotlightItemId?: string;
  /** Abrir WhatsApp obrigatoriamente após checkout/agendamento. */
  whatsappRequiredAfterCheckout: boolean;
}

export type PaymentMethod = "pix" | "credit" | "debit" | "cash";

export interface ProductVariantOption {
  name: string; // "Tamanho", "Cor", "Ponto"
  values: string[];
}

export interface ProductVariant {
  id: string;
  attributes: Record<string, string>; // { Tamanho: "M", Cor: "Preto" }
  stock: number;
  priceDelta?: number;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  max?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // category slug
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  active: boolean;
  featured?: boolean;
  unit?: string; // "kg", "un", "500ml"
  stock: number; // se sem variantes
  variantOptions?: ProductVariantOption[];
  variants?: ProductVariant[];
  addons?: ProductAddon[];
  allowNotes?: boolean;
  relatedIds?: string[];
  tags?: string[];
}

export interface CartItem {
  key: string; // hash produto+variante+addons
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  variantId?: string;
  variantLabel?: string;
  addons?: { id: string; name: string; price: number }[];
  notes?: string;
  maxStock: number;
}

export type OrderStatus =
  | "novo"
  | "pago"
  | "preparo"
  | "pronto"
  | "saiu"
  | "enviado"
  | "entregue"
  | "cancelado"
  | "reembolsado";

export interface Order {
  id: string;
  number: string;
  storeSlug: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customer: {
    name: string;
    whatsapp: string;
    email?: string;
  };
  fulfillment: {
    type: "pickup" | "local" | "shipping";
    address?: {
      cep?: string;
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
    };
    notes?: string;
  };
  payment: {
    method: PaymentMethod;
    change?: number; // troco em dinheiro
  };
  consents: {
    terms: boolean;
    marketing: boolean;
  };
  demo: true;
}

export interface DemoSession {
  kind: "customer" | "admin";
  storeSlug: string;
  label: string;
  createdAt: string;
  demo: true;
}

// ============= Barbearia — serviços, profissionais e agendamentos =============

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  image?: string;
  active: boolean;
  featured?: boolean;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  active: boolean;
  /** Ids de serviços que executa. Vazio = executa todos. */
  serviceIds?: string[];
  /** 0=Dom .. 6=Sáb. Default: seg-sáb. */
  workingDays?: number[];
  workStart?: string; // "09:00"
  workEnd?: string; // "19:00"
}

export type AppointmentStatus =
  | "pendente"
  | "confirmado"
  | "concluido"
  | "cancelado"
  | "faltou";

export interface Appointment {
  id: string;
  number: string;
  storeSlug: string;
  createdAt: string;
  status: AppointmentStatus;
  serviceId: string;
  serviceName: string;
  price: number;
  durationMinutes: number;
  professionalId: string;
  professionalName: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** HH:mm 24h */
  time: string;
  customer: {
    name: string;
    whatsapp: string;
    email?: string;
  };
  notes?: string;
  consents: { terms: boolean; marketing: boolean };
  demo: true;
}
