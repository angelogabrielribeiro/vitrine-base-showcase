import { createFileRoute, Link } from "@tanstack/react-router";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { brl } from "@/lib/format";
import { Package, ShoppingCart, DollarSign, AlertOctagon } from "lucide-react";

export const Route = createFileRoute("/demo/$storeSlug/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const products = repo.listProducts(storeSlug);
  const orders = repo.listOrders(storeSlug);
  const active = products.filter((p) => p.active).length;
  const lowStock = products.filter((p) => {
    if (!p.active) return false;
    if (p.variants && p.variants.length) {
      return p.variants.every((v) => v.stock < 3);
    }
    return p.stock < 3;
  }).length;
  const paid = orders.filter((o) => o.status !== "cancelado" && o.status !== "reembolsado");
  const revenue = paid.reduce((s, o) => s + o.total, 0);

  const cards = [
    { label: "Produtos", value: products.length, sub: `${active} ativos`, Icon: Package },
    { label: "Pedidos", value: orders.length, sub: `${paid.length} válidos`, Icon: ShoppingCart },
    { label: "Vendido (demo)", value: brl(revenue), sub: "somatório dos pedidos", Icon: DollarSign },
    { label: "Estoque baixo", value: lowStock, sub: "produtos com < 3 unidades", Icon: AlertOctagon },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da loja {store.name}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-[var(--radius)] border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
              <c.Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-2xl font-semibold">{c.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{c.sub}</div>
          </div>
        ))}
      </div>

      <section className="rounded-[var(--radius)] border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Pedidos recentes</h2>
          <Link to="/demo/$storeSlug/admin/pedidos" params={{ storeSlug }} className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Nenhum pedido ainda. Simule uma compra na loja.</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3">
                <div>
                  <Link to="/demo/$storeSlug/admin/pedidos/$id" params={{ storeSlug, id: o.id }} className="font-mono text-primary hover:underline">
                    {o.number}
                  </Link>
                  <div className="text-xs text-muted-foreground">{o.customer.name} · {new Date(o.createdAt).toLocaleString("pt-BR")}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{brl(o.total)}</div>
                  <div className="text-xs text-muted-foreground capitalize">{o.status}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
