import type { StoreConfig } from "@/types/commerce";

export function whatsappUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
export function waStore(store: StoreConfig, message: string) {
  return whatsappUrl(store.whatsapp, message);
}
export function waProductInquiry(store: StoreConfig, productName: string) {
  return waStore(store, `Olá! Tenho uma dúvida sobre "${productName}" da ${store.name}.`);
}
export function waOrderFollowup(store: StoreConfig, orderNumber: string) {
  return waStore(store, `Olá, ${store.name}! Fiz o pedido ${orderNumber} e gostaria de acompanhar.`);
}
export function waCustomerFromAdmin(store: StoreConfig, customerWa: string, orderNumber: string) {
  return whatsappUrl(
    customerWa,
    `Olá! Aqui é da ${store.name}. Entrando em contato sobre o pedido ${orderNumber}.`,
  );
}
