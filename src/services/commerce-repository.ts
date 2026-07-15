import type {
  CartItem,
  DemoSession,
  Order,
  OrderStatus,
  Product,
  StoreConfig,
} from "@/types/commerce";

export interface CommerceRepository {
  getConfig(slug: string): StoreConfig | undefined;
  saveConfig(config: StoreConfig): void;
  listProducts(slug: string): Product[];
  getProduct(slug: string, productSlug: string): Product | undefined;
  getProductById(slug: string, id: string): Product | undefined;
  saveProduct(slug: string, product: Product): void;
  deleteProduct(slug: string, id: string): void;
  getCart(slug: string): CartItem[];
  saveCart(slug: string, cart: CartItem[]): void;
  clearCart(slug: string): void;
  listOrders(slug: string): Order[];
  getOrder(slug: string, id: string): Order | undefined;
  createOrder(slug: string, order: Order): void;
  updateOrderStatus(slug: string, id: string, status: OrderStatus): void;
  getSession(slug: string): DemoSession | undefined;
  setSession(session: DemoSession | undefined): void;
  subscribe(fn: () => void): () => void;
}
