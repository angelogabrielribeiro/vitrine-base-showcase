import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, MessageCircle } from "lucide-react";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { brl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  waOrderFollowup,
  waOrderSummaryToStore,
  whatsappUrl,
  consumeWhatsappPending,
} from "@/lib/whatsapp";
import { useHydrated } from "@/hooks/use-hydrated";
import { useEffect, useState } from "react";
import { OrderTrackingPanel } from "@/components/orders/order-tracking-panel";

export const Route = createFileRoute("/demo/$storeSlug/pedido-confirmado/$orderId")({
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const { storeSlug, orderId } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const hydrated = useHydrated();
  const order = repo.getOrder(storeSlug, orderId);
  const [waPending, setWaPending] = useState(false);
  useEffect(() => {
    if (hydrated) setWaPending(consumeWhatsappPending(orderId));
  }, [hydrated, orderId]);

  if (!hydrated) return <div className="mx-auto max-w-2xl px-4 py-10">Carregando...</div>;

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Pedido não encontrado</h1>
        <Button asChild className="mt-6">
          <Link to="/demo/$storeSlug" params={{ storeSlug }}>
            Voltar à loja
          </Link>
        </Button>
      </div>
    );
  }

  const fulfillmentLabel =
    order.fulfillment.type === "pickup"
      ? "Retirada no local"
      : order.fulfillment.type === "local"
        ? "Entrega local"
        : "Envio";

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="font-display mt-4 text-3xl font-semibold">Pedido confirmado!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {store.niche === "restaurant"
            ? "Você já pode acompanhar o preparo sem criar uma conta."
            : "Recebemos seu pedido em modo demonstrativo."}
        </p>
        <p className="mt-4 text-lg font-mono">{order.number}</p>
      </div>

      {store.niche === "restaurant" && <OrderTrackingPanel order={order} />}

      <section className="mt-8 rounded-[var(--radius)] border border-border bg-card p-5">
        <h2 className="font-semibold">Itens</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {order.items.map((i) => (
            <li key={i.key} className="flex justify-between gap-3">
              <span>
                {i.quantity}× {i.name}
                {i.variantLabel ? ` (${i.variantLabel})` : ""}
              </span>
              <span>{brl(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{brl(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Entrega</dt>
            <dd>{brl(order.deliveryFee)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <dt>Desconto</dt>
              <dd>−{brl(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{brl(order.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-4 grid gap-4 rounded-[var(--radius)] border border-border bg-card p-5 sm:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Recebimento
          </div>
          <div className="mt-1 text-sm">{fulfillmentLabel}</div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Pagamento
          </div>
          <div className="mt-1 text-sm capitalize">
            {order.payment.method} · <span className="text-emerald-600">aprovado (demo)</span>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-[var(--radius)] border border-border bg-card p-5">
        <h2 className="font-semibold">
          {store.niche === "restaurant" ? "Acompanhamento sem conta" : "Próximos passos"}
        </h2>
        {store.whatsappRequiredAfterCheckout && waPending && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p>
              <strong>Abra o WhatsApp para concluir o contato.</strong> A janela automática pode ter
              sido bloqueada pelo navegador — toque no botão abaixo para abrir a conversa com a
              mensagem pronta.
            </p>
          </div>
        )}
        {store.whatsappRequiredAfterCheckout && (
          <p className="mt-3 text-xs text-muted-foreground">
            O WhatsApp será aberto com a mensagem pronta; confirme o envio no aplicativo.
          </p>
        )}
        {store.niche === "restaurant" ? (
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• A tela acima atualiza sozinha — não precisa recarregar.</li>
            <li>• Nenhuma conta é necessária para acompanhar neste dispositivo.</li>
            <li>• Guarde o número {order.number} para falar com a Brasa Urbana.</li>
          </ul>
        ) : (
          <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>A loja entrará em contato pelo WhatsApp para confirmar detalhes.</li>
            <li>Você receberá atualizações do status do pedido.</li>
            <li>Guarde o número {order.number} para referência.</li>
          </ol>
        )}
        <Button asChild className="mt-5 w-full bg-green-500 text-white hover:bg-green-600">
          <a
            href={
              store.whatsappRequiredAfterCheckout
                ? whatsappUrl(store.whatsapp, waOrderSummaryToStore(store, order))
                : waOrderFollowup(store, order.number)
            }
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {store.whatsappRequiredAfterCheckout
              ? "Abrir WhatsApp com a mensagem pronta"
              : "Falar com a loja sobre este pedido"}
          </a>
        </Button>
        <Button asChild variant="outline" className="mt-2 w-full">
          <Link to="/demo/$storeSlug" params={{ storeSlug }}>
            Voltar para a loja
          </Link>
        </Button>
      </section>
    </div>
  );
}
