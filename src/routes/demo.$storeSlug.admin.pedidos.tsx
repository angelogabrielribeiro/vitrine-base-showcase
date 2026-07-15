import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useRepo } from "@/hooks/use-repo";
import { brl } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/commerce";

export const Route = createFileRoute("/demo/$storeSlug/admin/pedidos")({
  component: OrdersAdmin,
});

const ALL_STATUS: OrderStatus[] = ["novo", "pago", "preparo", "pronto", "saiu", "enviado", "entregue", "cancelado", "reembolsado"];

function OrdersAdmin() {
  const { storeSlug } = Route.useParams();
  const repo = useRepo();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const orders = repo.listOrders(storeSlug).filter((o) => {
    if (status !== "all" && o.status !== status) return false;
    if (q) {
      const t = q.toLowerCase();
      return o.number.toLowerCase().includes(t) || o.customer.name.toLowerCase().includes(t) || o.customer.whatsapp.includes(t);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">{orders.length} resultados</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por número, nome ou WhatsApp" className="max-w-md" />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {ALL_STATUS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card">
        <table className="w-full text-sm">
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
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border/60 last:border-b-0 hover:bg-muted/30">
                <td className="p-3 font-mono">
                  <Link to="/demo/$storeSlug/admin/pedidos/$id" params={{ storeSlug, id: o.id }} className="text-primary hover:underline">
                    {o.number}
                  </Link>
                </td>
                <td className="p-3">
                  <div>{o.customer.name}</div>
                  <div className="text-xs text-muted-foreground">{o.customer.whatsapp}</div>
                </td>
                <td className="p-3 text-muted-foreground">{new Date(o.createdAt).toLocaleString("pt-BR")}</td>
                <td className="p-3">{brl(o.total)}</td>
                <td className="p-3"><Badge variant="secondary" className="capitalize">{o.status}</Badge></td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">Nenhum pedido encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
