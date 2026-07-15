import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useRepo } from "@/hooks/use-repo";
import { getStore } from "@/config/stores";
import { brl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { waCustomerFromAdmin } from "@/lib/whatsapp";
import type { OrderStatus } from "@/types/commerce";
import { toast } from "sonner";

const ALL_STATUS: OrderStatus[] = ["novo", "pago", "preparo", "pronto", "saiu", "enviado", "entregue", "cancelado", "reembolsado"];

export const Route = createFileRoute("/demo/$storeSlug/admin/pedidos/$id")({
  component: OrderDetail,
});

function OrderDetail() {
  const { storeSlug, id } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const order = repo.getOrder(storeSlug, id);
  if (!order) throw notFound();

  const addr = order.fulfillment.address;
  const fulfillmentLabel = order.fulfillment.type === "pickup" ? "Retirada" : order.fulfillment.type === "local" ? "Entrega local" : "Envio";

  return (
    <div className="space-y-6">
      <Link to="/demo/$storeSlug/admin/pedidos" params={{ storeSlug }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="h-4 w-4" /> Pedidos
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">{order.number}</h1>
          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString("pt-BR")}</p>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Status</div>
            <Select value={order.status} onValueChange={(v) => { repo.updateOrderStatus(storeSlug, order.id, v as OrderStatus); toast.success("Status atualizado"); }}>
              <SelectTrigger className="mt-1 w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_STATUS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button asChild variant="outline">
            <a href={waCustomerFromAdmin(store, order.customer.whatsapp, order.number)} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-[var(--radius)] border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-semibold">Itens</h2>
          <ul className="mt-3 divide-y divide-border text-sm">
            {order.items.map((i) => (
              <li key={i.key} className="flex items-center gap-3 py-3">
                <div className="h-12 w-12 shrink-0 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${i.image})` }} />
                <div className="flex-1">
                  <div className="font-medium">{i.quantity}× {i.name}</div>
                  {i.variantLabel && <div className="text-xs text-muted-foreground">{i.variantLabel}</div>}
                  {i.addons && <div className="text-xs text-muted-foreground">+ {i.addons.map((a) => a.name).join(", ")}</div>}
                  {i.notes && <div className="text-xs italic text-muted-foreground">Obs: {i.notes}</div>}
                </div>
                <div className="font-semibold">{brl(i.unitPrice * i.quantity)}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{brl(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Entrega</dt><dd>{brl(order.deliveryFee)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Desconto</dt><dd>−{brl(order.discount)}</dd></div>}
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><dt>Total</dt><dd>{brl(order.total)}</dd></div>
          </dl>
        </section>

        <div className="space-y-4">
          <section className="rounded-[var(--radius)] border border-border bg-card p-5">
            <h2 className="font-semibold">Cliente</h2>
            <div className="mt-2 space-y-1 text-sm">
              <div>{order.customer.name}</div>
              <div className="text-muted-foreground">{order.customer.whatsapp}</div>
              {order.customer.email && <div className="text-muted-foreground">{order.customer.email}</div>}
            </div>
          </section>
          <section className="rounded-[var(--radius)] border border-border bg-card p-5">
            <h2 className="font-semibold">Entrega</h2>
            <div className="mt-2 space-y-1 text-sm">
              <div>{fulfillmentLabel}</div>
              {addr && (
                <div className="text-muted-foreground">
                  {addr.street}, {addr.number} {addr.complement}<br />
                  {addr.neighborhood} — {addr.city}<br />
                  CEP {addr.cep}
                </div>
              )}
              {order.fulfillment.notes && <div className="italic text-muted-foreground">Obs: {order.fulfillment.notes}</div>}
            </div>
          </section>
          <section className="rounded-[var(--radius)] border border-border bg-card p-5">
            <h2 className="font-semibold">Pagamento</h2>
            <div className="mt-2 text-sm capitalize">{order.payment.method}</div>
            {order.payment.change && <div className="text-xs text-muted-foreground">Troco para {brl(order.payment.change)}</div>}
          </section>
        </div>
      </div>
    </div>
  );
}
