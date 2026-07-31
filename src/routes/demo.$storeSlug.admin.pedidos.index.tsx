import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useRepo } from "@/hooks/use-repo";
import { brl } from "@/lib/format";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/types/commerce";
import { getStore } from "@/config/stores";
import { useTrackingClock } from "@/hooks/use-tracking-clock";
import { getEffectiveOrderStatus, orderStatusLabel } from "@/lib/order-tracking";

export const Route = createFileRoute("/demo/$storeSlug/admin/pedidos/")({
  component: OrdersAdmin,
});

const ALL_STATUS: OrderStatus[] = [
  "novo",
  "pago",
  "preparo",
  "pronto",
  "saiu",
  "enviado",
  "entregue",
  "cancelado",
  "reembolsado",
];

function OrdersAdmin() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const now = useTrackingClock(store.niche === "restaurant", 1_000);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const orders = repo
    .listOrders(storeSlug)
    .map((order) => ({
      order,
      effectiveStatus: getEffectiveOrderStatus(order, now || new Date(order.createdAt).getTime()),
    }))
    .filter(({ order, effectiveStatus }) => {
      if (status !== "all" && effectiveStatus !== status) return false;
      if (q) {
        const term = q.toLowerCase();
        return (
          order.number.toLowerCase().includes(term) ||
          order.customer.name.toLowerCase().includes(term) ||
          order.customer.whatsapp.includes(term)
        );
      }
      return true;
    });

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">{orders.length} resultados</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por número, nome ou WhatsApp"
          className="w-full sm:max-w-md"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {ALL_STATUS.map((item) => (
              <SelectItem key={item} value={item}>
                {orderStatusLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 md:hidden">
        {orders.map(({ order, effectiveStatus }) => (
          <article
            key={order.id}
            className="min-w-0 rounded-[var(--radius)] border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Pedido</div>
                <div className="font-mono text-lg font-semibold">{order.number}</div>
              </div>
              <StatusBadge status={effectiveStatus} automatic={store.niche === "restaurant"} />
            </div>

            <dl className="mt-4 grid gap-3 rounded-md bg-muted/40 p-3 text-sm">
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">Cliente</dt>
                <dd className="break-words font-medium">{order.customer.name}</dd>
                <dd className="break-all text-xs text-muted-foreground">
                  {order.customer.whatsapp}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Data</dt>
                  <dd>{new Date(order.createdAt).toLocaleString("pt-BR")}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Total</dt>
                  <dd className="font-semibold">{brl(order.total)}</dd>
                </div>
              </div>
            </dl>

            <Button asChild className="mt-3 w-full">
              <Link to="/demo/$storeSlug/admin/pedidos/$id" params={{ storeSlug, id: order.id }}>
                Abrir pedido
              </Link>
            </Button>
          </article>
        ))}
        {orders.length === 0 && (
          <div className="rounded-[var(--radius)] border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nenhum pedido encontrado.
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto overscroll-x-contain rounded-[var(--radius)] border border-border bg-card md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3">Número</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Data</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(({ order, effectiveStatus }) => (
              <tr
                key={order.id}
                className="border-b border-border/60 last:border-b-0 hover:bg-muted/30"
              >
                <td className="whitespace-nowrap p-3 font-mono">
                  <Link
                    to="/demo/$storeSlug/admin/pedidos/$id"
                    params={{ storeSlug, id: order.id }}
                    className="text-primary hover:underline"
                  >
                    {order.number}
                  </Link>
                </td>
                <td className="min-w-48 p-3">
                  <div>{order.customer.name}</div>
                  <div className="text-xs text-muted-foreground">{order.customer.whatsapp}</div>
                </td>
                <td className="whitespace-nowrap p-3 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("pt-BR")}
                </td>
                <td className="whitespace-nowrap p-3">{brl(order.total)}</td>
                <td className="p-3">
                  <StatusBadge status={effectiveStatus} automatic={store.niche === "restaurant"} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status, automatic }: { status: OrderStatus; automatic: boolean }) {
  return (
    <div className="shrink-0">
      <Badge variant="secondary">{orderStatusLabel(status)}</Badge>
      {automatic && status !== "cancelado" && status !== "reembolsado" && (
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
          Automático
        </div>
      )}
    </div>
  );
}
