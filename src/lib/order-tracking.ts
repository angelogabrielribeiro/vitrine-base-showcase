import type { Order, OrderStatus } from "@/types/commerce";

export type TrackingStageId = "recebido" | "aceito" | "preparo" | "pronto" | "saiu" | "entregue";

export interface TrackingStage {
  id: TrackingStageId;
  label: string;
  description: string;
  offsetMs: number;
  status: OrderStatus;
}

export interface OrderTrackingSnapshot {
  stages: TrackingStage[];
  currentStage: TrackingStage;
  currentIndex: number;
  nextStage?: TrackingStage;
  nextAt?: number;
  etaAt: number;
  progress: number;
  isComplete: boolean;
  isAutomatic: boolean;
}

const RESTAURANT_DELIVERY_STAGES: TrackingStage[] = [
  {
    id: "recebido",
    label: "Pedido recebido",
    description: "Pagamento aprovado e pedido registrado.",
    offsetMs: 0,
    status: "novo",
  },
  {
    id: "aceito",
    label: "Pedido aceito",
    description: "A cozinha recebeu a comanda.",
    offsetMs: 6_000,
    status: "pago",
  },
  {
    id: "preparo",
    label: "Em preparo",
    description: "Seu pedido está sendo preparado.",
    offsetMs: 18_000,
    status: "preparo",
  },
  {
    id: "pronto",
    label: "Pronto para envio",
    description: "Pedido embalado e aguardando retirada.",
    offsetMs: 42_000,
    status: "pronto",
  },
  {
    id: "saiu",
    label: "Saiu para entrega",
    description: "O entregador está a caminho.",
    offsetMs: 60_000,
    status: "saiu",
  },
  {
    id: "entregue",
    label: "Entregue",
    description: "Pedido finalizado. Bom apetite!",
    offsetMs: 90_000,
    status: "entregue",
  },
];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  novo: "Pedido recebido",
  pago: "Pedido aceito",
  preparo: "Em preparo",
  pronto: "Pronto",
  saiu: "Saiu para entrega",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
  reembolsado: "Reembolsado",
};

function stagesFor(order: Order): TrackingStage[] {
  if (order.fulfillment.type !== "pickup") return RESTAURANT_DELIVERY_STAGES;

  return RESTAURANT_DELIVERY_STAGES.filter((stage) => stage.id !== "saiu").map((stage) => {
    if (stage.id === "pronto") {
      return {
        ...stage,
        label: "Pronto para retirada",
        description: "Seu pedido está pronto no balcão.",
      };
    }
    if (stage.id === "entregue") {
      return {
        ...stage,
        label: "Pedido retirado",
        description: "Pedido finalizado. Bom apetite!",
        offsetMs: 60_000,
      };
    }
    return stage;
  });
}

export function isAutomaticRestaurantOrder(order: Order): boolean {
  return (
    order.storeSlug === "restaurante" &&
    order.status !== "cancelado" &&
    order.status !== "reembolsado"
  );
}

export function getOrderTrackingSnapshot(order: Order, now = Date.now()): OrderTrackingSnapshot {
  const stages = stagesFor(order);
  const createdAt = new Date(order.createdAt).getTime();
  const elapsed = Math.max(0, now - createdAt);
  let currentIndex = 0;

  for (let index = 0; index < stages.length; index += 1) {
    if (elapsed >= stages[index].offsetMs) currentIndex = index;
  }

  const currentStage = stages[currentIndex];
  const nextStage = stages[currentIndex + 1];
  const progress = Math.min(100, Math.max(0, (elapsed / stages.at(-1)!.offsetMs) * 100));

  return {
    stages,
    currentStage,
    currentIndex,
    nextStage,
    nextAt: nextStage ? createdAt + nextStage.offsetMs : undefined,
    etaAt: createdAt + stages.at(-1)!.offsetMs,
    progress,
    isComplete: currentIndex === stages.length - 1,
    isAutomatic: isAutomaticRestaurantOrder(order),
  };
}

export function getEffectiveOrderStatus(order: Order, now = Date.now()): OrderStatus {
  if (!isAutomaticRestaurantOrder(order)) return order.status;
  return getOrderTrackingSnapshot(order, now).currentStage.status;
}

export function orderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}
