import { createFileRoute, Link } from "@tanstack/react-router";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { brl } from "@/lib/format";
import { Package, ShoppingCart, DollarSign, AlertOctagon, CalendarDays, CalendarClock, Scissors } from "lucide-react";

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

  const isBarber = store.niche === "barber";
  const appointments = isBarber ? repo.listAppointments(storeSlug) : [];
  const services = isBarber ? repo.listServices(storeSlug) : [];
  const todayISO = new Date().toISOString().slice(0, 10);
  const todaysAppts = appointments.filter((a) => a.date === todayISO && a.status !== "cancelado");
  const upcoming = appointments
    .filter((a) => a.date >= todayISO && a.status !== "cancelado" && a.status !== "concluido")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const bookingRevenue = appointments.filter((a) => a.status !== "cancelado").reduce((s, a) => s + a.price, 0);

  const cards = isBarber
    ? [
        { label: "Agend. hoje", value: todaysAppts.length, sub: `${upcoming.length} próximos`, Icon: CalendarDays },
        { label: "Serviços ativos", value: services.filter((s) => s.active).length, sub: `${services.length} totais`, Icon: Scissors },
        { label: "Receita agendada", value: brl(bookingRevenue + revenue), sub: "serviços + produtos", Icon: DollarSign },
        { label: "Pedidos", value: orders.length, sub: `${paid.length} válidos`, Icon: ShoppingCart },
      ]
    : [
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

      {isBarber && (
        <section className="rounded-[var(--radius)] border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2"><CalendarClock className="h-4 w-4" /> Próximos agendamentos</h2>
            <Link to="/demo/$storeSlug/admin/agendamentos" params={{ storeSlug }} className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum agendamento. Simule uma reserva em <span className="font-mono">/agendar</span>.
            </p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {upcoming.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-mono text-primary">{a.number}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.customer.name} · {a.serviceName} · {a.professionalName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {new Date(a.date + "T00:00:00").toLocaleDateString("pt-BR")} · {a.time}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">{a.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

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
