import type { StoreConfig, Order, Appointment } from "@/types/commerce";
import { brl } from "@/lib/format";

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

/**
 * Mensagem enviada ao WhatsApp da LOJA após checkout.
 * Somente loja, nº do pedido, itens/quantidade e total. Sem dados sensíveis.
 */
export function waOrderSummaryToStore(store: StoreConfig, order: Order): string {
  const lines = [
    `Olá, ${store.name}!`,
    `Novo pedido ${order.number} (demo):`,
    ...order.items.map((i) => `• ${i.quantity}× ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""}`),
    `Total: ${brl(order.total)}`,
    "Aguardando confirmação de contato pelo aplicativo.",
  ];
  return lines.join("\n");
}

/**
 * Mensagem enviada ao WhatsApp da LOJA após agendamento.
 * Somente loja, nº, serviço, profissional, data e horário. Sem dados sensíveis.
 */
export function waAppointmentSummaryToStore(store: StoreConfig, appt: Appointment): string {
  const dateHuman = new Date(appt.date + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  return [
    `Olá, ${store.name}!`,
    `Novo agendamento ${appt.number} (demo):`,
    `• Serviço: ${appt.serviceName} (${appt.durationMinutes}min)`,
    `• Profissional: ${appt.professionalName}`,
    `• Data: ${dateHuman} às ${appt.time}`,
    "Aguardando confirmação de contato pelo aplicativo.",
  ].join("\n");
}

const PENDING_PREFIX = "vitrine:wa-pending:";
export function markWhatsappPending(refId: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PENDING_PREFIX + refId, "1");
  } catch {}
}
export function consumeWhatsappPending(refId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const has = sessionStorage.getItem(PENDING_PREFIX + refId) === "1";
    if (has) sessionStorage.removeItem(PENDING_PREFIX + refId);
    return has;
  } catch {
    return false;
  }
}
