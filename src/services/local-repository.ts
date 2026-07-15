import { STORES, getStore } from "@/config/stores";
import { DEMO_PRODUCTS_BY_STORE } from "@/data/demo-data";
import type {
  CartItem,
  DemoSession,
  Order,
  OrderStatus,
  Product,
  StoreConfig,
} from "@/types/commerce";
import type { CommerceRepository } from "./commerce-repository";

const isBrowser = () => typeof window !== "undefined";
const key = (slug: string, part: string) => `vitrine:${slug}:${part}`;
const SESSION_KEY = "vitrine:session";

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
};

export const repo: CommerceRepository = localRepository;

export function seedAllStores() {
  if (!isBrowser()) return;
  for (const s of STORES) seedIfNeeded(s.slug);
}
