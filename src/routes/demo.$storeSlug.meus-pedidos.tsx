import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, History, LogIn, PackageSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStore } from "@/config/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { useRepo } from "@/hooks/use-repo";
import { useTrackingClock } from "@/hooks/use-tracking-clock";
import { brl } from "@/lib/format";
import { getEffectiveOrderStatus, orderStatusLabel } from "@/lib/order-tracking";

export const Route = createFileRoute("/demo/$storeSlug/meus-pedidos")({
  component: MyOrdersPage,
});

function MyOrdersPage() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const hydrated = useHydrated();
  const now = useTrackingClock(store.niche === "restaurant", 1_000);
  const orders = hydrated ? repo.listOrders(storeSlug) : [];

  return (
    <div className="mx-auto min-h-[70vh] max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <ShieldCheck className="h-4 w-4" />
            Sem conta obrigatória
          </div>
          <h1 className="font-display mt-3 text-4xl font-semibold">Meus pedidos</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pedidos feitos neste dispositivo aparecem aqui automaticamente. Comprar e acompanhar não
            exige cadastro.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/demo/$storeSlug/login" params={{ storeSlug }}>
            <LogIn className="mr-2 h-4 w-4" />
            Entrar para sincronizar
          </Link>
        </Button>
      </div>

      {!hydrated ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">
          Carregando pedidos...
        </div>
      ) : orders.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Nenhum pedido neste dispositivo</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Assim que você concluir uma compra, o acompanhamento aparecerá aqui sem precisar criar
            uma conta.
          </p>
          <Button asChild className="mt-6">
            <Link
              to="/demo/$storeSlug/produtos"
              params={{ storeSlug }}
              search={{ q: "", cat: "", sort: "" }}
            >
              Ver produtos
            </Link>
          </Button>
        </section>
      ) : (
        <div className="mt-10 space-y-3">
          {orders.map((order) => {
            const status = getEffectiveOrderStatus(order, now || Date.now());
            return (
              <Link
                key={order.id}
                to="/demo/$storeSlug/pedido-confirmado/$orderId"
                params={{ storeSlug, orderId: order.id }}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-lg sm:flex-row sm:items-center"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <History className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold">{order.number}</span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {orderStatusLabel(status)}
                    </span>
                    {store.niche === "restaurant" &&
                      status !== "cancelado" &&
                      status !== "reembolsado" && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                          atualização automática
                        </span>
                      )}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("pt-BR")} · {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "itens"}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <strong>{brl(order.total)}</strong>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-border bg-muted/30 p-5">
        <h2 className="font-semibold">Para que serve a conta?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Apenas para sincronizar histórico, endereços e agendamentos entre aparelhos. Ela é uma
          conveniência, não uma barreira para comprar.
        </p>
      </section>
    </div>
  );
}
