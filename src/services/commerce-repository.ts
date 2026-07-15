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

export interface CommerceRepository {
  getConfig(slug: string): StoreConfig | undefined;
  saveConfig(config: StoreConfig): void;
  listProducts(slug: string): Product[];
  getProduct(slug: string, productSlug: string): Product | undefined;
  getProductById(slug: string, id: string): Product | undefined;
  saveProduct(slug: string, product: Product): void;
  saveProducts(slug: string, products: Product[]): void;
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
  // Barbearia — serviços, profissionais e agendamentos
  listServices(slug: string): Service[];
  getService(slug: string, id: string): Service | undefined;
  saveService(slug: string, service: Service): void;
  deleteService(slug: string, id: string): void;
  listProfessionals(slug: string): Professional[];
  getProfessional(slug: string, id: string): Professional | undefined;
  saveProfessional(slug: string, professional: Professional): void;
  deleteProfessional(slug: string, id: string): void;
  listAppointments(slug: string): Appointment[];
  getAppointment(slug: string, id: string): Appointment | undefined;
  createAppointment(slug: string, appointment: Appointment): void;
  updateAppointmentStatus(slug: string, id: string, status: AppointmentStatus): void;
}
