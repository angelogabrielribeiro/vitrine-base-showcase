import { STORES, getStore } from "@/config/stores";
import {
  DEMO_PRODUCTS_BY_STORE,
  DEMO_SERVICES_BY_STORE,
  DEMO_PROFESSIONALS_BY_STORE,
} from "@/data/demo-data";
import type {
  CartItem,
  DemoSession,
  Order,
  OrderStatus,
  Product,
  StoreConfig,
  Service,
  Professional,
  Appointment,
  AppointmentStatus,
} from "@/types/commerce";
import type { CommerceRepository } from "./commerce-repository";

const isBrowser = () => typeof window !== "undefined";
const key = (slug: string, part: string) => `vitrine:${slug}:${part}`;
const SESSION_KEY = "vitrine:session";

/**
 * Migração versionada de mídia da Barber Noir.
 *
 * Atualiza APENAS `images` de produtos e `image` de serviços conhecidos
 * (match por id/slug), preservando preços, estoques, variantes, carrinho,
 * pedidos, agendamentos, sessão e edições administrativas. Roda uma única
 * vez por versão, no browser. Nunca limpa outras chaves.
 */
const BARBER_MEDIA_VERSION_KEY = "vitrine:barbearia:media-version";
const BARBER_MEDIA_VERSION = 2;
let barberMediaMigrated = false;

function migrateBarberMediaIfNeeded(): void {
  if (!isBrowser() || barberMediaMigrated) return;
  try {
    const current = Number(
      localStorage.getItem(BARBER_MEDIA_VERSION_KEY) ?? "0",
    );
    if (current >= BARBER_MEDIA_VERSION) {
      barberMediaMigrated = true;
      return;
    }

    const rawProducts = localStorage.getItem(key("barbearia", "products"));
    if (rawProducts) {
      const stored = JSON.parse(rawProducts) as Product[];
      const seed = DEMO_PRODUCTS_BY_STORE["barbearia"] ?? [];
      const byId = new Map(seed.map((p) => [p.id, p]));
      const bySlug = new Map(seed.map((p) => [p.slug, p]));
      const updated = stored.map((p) => {
        const s = byId.get(p.id) ?? bySlug.get(p.slug);
        if (!s) return p;
        return { ...p, images: [...s.images] };
      });
      localStorage.setItem(key("barbearia", "products"), JSON.stringify(updated));
    }

    const rawServices = localStorage.getItem(key("barbearia", "services"));
    if (rawServices) {
      const stored = JSON.parse(rawServices) as Service[];
      const seed = DEMO_SERVICES_BY_STORE["barbearia"] ?? [];
      const byId = new Map(seed.map((s) => [s.id, s]));
      const bySlug = new Map(seed.map((s) => [s.slug, s]));
      const updated = stored.map((s) => {
        const src = byId.get(s.id) ?? bySlug.get(s.slug);
        if (!src) return s;
        return { ...s, image: src.image };
      });
      localStorage.setItem(key("barbearia", "services"), JSON.stringify(updated));
    }

    localStorage.setItem(BARBER_MEDIA_VERSION_KEY, String(BARBER_MEDIA_VERSION));
    barberMediaMigrated = true;
  } catch {
    // Migração é best-effort; qualquer erro não deve quebrar o app.
  }
}

function readJSON<T>(k: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(k: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(k, JSON.stringify(value));
  } catch {}
}

const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}

function seedIfNeeded(slug: string) {
  if (!isBrowser()) return;
  const products = readJSON<Product[] | null>(key(slug, "products"), null);
  if (!products) {
    const seed = DEMO_PRODUCTS_BY_STORE[slug] ?? [];
    writeJSON(key(slug, "products"), seed);
  }
  const cfg = readJSON<StoreConfig | null>(key(slug, "config"), null);
  if (!cfg) {
    const found = getStore(slug);
    if (found) writeJSON(key(slug, "config"), found);
  }
  const services = readJSON<Service[] | null>(key(slug, "services"), null);
  if (!services) {
    writeJSON(key(slug, "services"), DEMO_SERVICES_BY_STORE[slug] ?? []);
  }
  const pros = readJSON<Professional[] | null>(key(slug, "professionals"), null);
  if (!pros) {
    writeJSON(key(slug, "professionals"), DEMO_PROFESSIONALS_BY_STORE[slug] ?? []);
  }
  if (slug === "barbearia") migrateBarberMediaIfNeeded();
}

export const localRepository: CommerceRepository = {
  getConfig(slug) {
    seedIfNeeded(slug);
    return readJSON<StoreConfig | undefined>(key(slug, "config"), getStore(slug));
  },
  saveConfig(config) {
    writeJSON(key(config.slug, "config"), config);
    emit();
  },
  listProducts(slug) {
    seedIfNeeded(slug);
    return readJSON<Product[]>(key(slug, "products"), DEMO_PRODUCTS_BY_STORE[slug] ?? []);
  },
  getProduct(slug, productSlug) {
    return this.listProducts(slug).find((p) => p.slug === productSlug);
  },
  getProductById(slug, id) {
    return this.listProducts(slug).find((p) => p.id === id);
  },
  saveProduct(slug, product) {
    const all = this.listProducts(slug);
    const idx = all.findIndex((p) => p.id === product.id);
    if (idx >= 0) all[idx] = product;
    else all.unshift(product);
    writeJSON(key(slug, "products"), all);
    emit();
  },
  saveProducts(slug, products) {
    if (!products.length) return;
    const all = this.listProducts(slug);
    for (const p of products) {
      const idx = all.findIndex((x) => x.id === p.id);
      if (idx >= 0) all[idx] = p;
      else all.unshift(p);
    }
    writeJSON(key(slug, "products"), all);
    emit();
  },
  deleteProduct(slug, id) {
    const all = this.listProducts(slug).filter((p) => p.id !== id);
    writeJSON(key(slug, "products"), all);
    emit();
  },
  getCart(slug) {
    return readJSON<CartItem[]>(key(slug, "cart"), []);
  },
  saveCart(slug, cart) {
    writeJSON(key(slug, "cart"), cart);
    emit();
  },
  clearCart(slug) {
    writeJSON(key(slug, "cart"), []);
    emit();
  },
  listOrders(slug) {
    return readJSON<Order[]>(key(slug, "orders"), []);
  },
  getOrder(slug, id) {
    return this.listOrders(slug).find((o) => o.id === id);
  },
  createOrder(slug, order) {
    const all = this.listOrders(slug);
    all.unshift(order);
    writeJSON(key(slug, "orders"), all);
    emit();
  },
  updateOrderStatus(slug, id, status) {
    const all = this.listOrders(slug).map((o) => (o.id === id ? { ...o, status } : o));
    writeJSON(key(slug, "orders"), all);
    emit();
  },
  getSession(slug) {
    const s = readJSON<DemoSession | undefined>(SESSION_KEY, undefined);
    if (!s) return undefined;
    if (s.storeSlug !== slug) return undefined;
    return s;
  },
  setSession(session) {
    if (!session) {
      if (isBrowser()) localStorage.removeItem(SESSION_KEY);
    } else {
      writeJSON(SESSION_KEY, session);
    }
    emit();
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  listServices(slug) {
    seedIfNeeded(slug);
    return readJSON<Service[]>(key(slug, "services"), DEMO_SERVICES_BY_STORE[slug] ?? []);
  },
  getService(slug, id) {
    return this.listServices(slug).find((s) => s.id === id);
  },
  saveService(slug, service) {
    const all = this.listServices(slug);
    const idx = all.findIndex((s) => s.id === service.id);
    if (idx >= 0) all[idx] = service;
    else all.unshift(service);
    writeJSON(key(slug, "services"), all);
    emit();
  },
  deleteService(slug, id) {
    const all = this.listServices(slug).filter((s) => s.id !== id);
    writeJSON(key(slug, "services"), all);
    emit();
  },
  listProfessionals(slug) {
    seedIfNeeded(slug);
    return readJSON<Professional[]>(
      key(slug, "professionals"),
      DEMO_PROFESSIONALS_BY_STORE[slug] ?? [],
    );
  },
  getProfessional(slug, id) {
    return this.listProfessionals(slug).find((p) => p.id === id);
  },
  saveProfessional(slug, professional) {
    const all = this.listProfessionals(slug);
    const idx = all.findIndex((p) => p.id === professional.id);
    if (idx >= 0) all[idx] = professional;
    else all.unshift(professional);
    writeJSON(key(slug, "professionals"), all);
    emit();
  },
  deleteProfessional(slug, id) {
    const all = this.listProfessionals(slug).filter((p) => p.id !== id);
    writeJSON(key(slug, "professionals"), all);
    emit();
  },
  listAppointments(slug) {
    return readJSON<Appointment[]>(key(slug, "appointments"), []);
  },
  getAppointment(slug, id) {
    return this.listAppointments(slug).find((a) => a.id === id);
  },
  createAppointment(slug, appointment) {
    const all = this.listAppointments(slug);
    all.unshift(appointment);
    writeJSON(key(slug, "appointments"), all);
    emit();
  },
  updateAppointmentStatus(slug, id, status: AppointmentStatus) {
    const all = this.listAppointments(slug).map((a) =>
      a.id === id ? { ...a, status } : a,
    );
    writeJSON(key(slug, "appointments"), all);
    emit();
  },
};

export const repo: CommerceRepository = localRepository;

export function seedAllStores() {
  if (!isBrowser()) return;
  for (const s of STORES) seedIfNeeded(s.slug);
}
