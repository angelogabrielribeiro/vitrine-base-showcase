import { createFileRoute, Outlet, Link, useRouterState, useNavigate, redirect } from "@tanstack/react-router";
import { getStore } from "@/config/stores";
import { repo } from "@/services/local-repository";
import { useHydrated } from "@/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Store, AlertTriangle, CalendarDays, Scissors, Users } from "lucide-react";
import { useEffect } from "react";
import { seedAllStores } from "@/services/local-repository";

export const Route = createFileRoute("/demo/$storeSlug/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrated = useHydrated();
  const navigate = useNavigate();

  useEffect(() => {
    seedAllStores();
  }, []);

  const isLogin = pathname.endsWith("/admin/login");
  const session = hydrated ? repo.getSession(storeSlug) : undefined;

  useEffect(() => {
    if (!hydrated) return;
    if (!isLogin && (!session || session.kind !== "admin")) {
      navigate({ to: "/demo/$storeSlug/admin/login", params: { storeSlug } });
    }
  }, [hydrated, isLogin, session, navigate, storeSlug]);

  if (isLogin) return <Outlet />;

  if (!hydrated || !session || session.kind !== "admin") {
    return <div className="p-10 text-sm text-muted-foreground">Verificando sessão...</div>;
  }

  const isBarber = store.niche === "barber";
  const items = [
    { to: "/demo/$storeSlug/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    ...(isBarber
      ? ([
          { to: "/demo/$storeSlug/admin/agendamentos", icon: CalendarDays, label: "Agendamentos", exact: false },
          { to: "/demo/$storeSlug/admin/servicos", icon: Scissors, label: "Serviços", exact: false },
          { to: "/demo/$storeSlug/admin/profissionais", icon: Users, label: "Profissionais", exact: false },
        ] as const)
      : ([] as const)),
    { to: "/demo/$storeSlug/admin/produtos", icon: Package, label: "Produtos", exact: false },
    { to: "/demo/$storeSlug/admin/pedidos", icon: ShoppingCart, label: "Pedidos", exact: false },
    { to: "/demo/$storeSlug/admin/configuracoes", icon: Settings, label: "Configurações", exact: false },
  ] as const;

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="border-b border-border bg-card p-4 md:w-60 md:border-b-0 md:border-r">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Admin</div>
              <div className="font-display text-lg font-semibold">{store.name}</div>
            </div>
          </div>
          <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
            {items.map((it) => {
              const active = it.exact ? pathname === `/demo/${storeSlug}/admin` : pathname.startsWith(it.to.replace("$storeSlug", storeSlug));
              return (
                <Link
                  key={it.label}
                  to={it.to}
                  params={{ storeSlug }}
                  className={
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium " +
                    (active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted")
                  }
                >
                  <it.icon className="h-4 w-4" />
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 hidden space-y-2 md:block">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/demo/$storeSlug" params={{ storeSlug }}><Store className="mr-2 h-4 w-4" />Ver loja</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                repo.setSession(undefined);
                navigate({ to: "/demo/$storeSlug/admin/login", params: { storeSlug } });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />Sair
            </Button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="border-b border-border bg-amber-500/10 px-4 py-2 text-xs text-amber-900">
            <div className="mx-auto flex max-w-6xl items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Painel demonstrativo — as alterações ficam somente no seu navegador.</span>
            </div>
          </div>
          <main className="mx-auto max-w-6xl p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
