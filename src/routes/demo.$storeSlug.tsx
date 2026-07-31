import {
  createFileRoute,
  Outlet,
  notFound,
  Link,
  useRouterState,
  redirect,
} from "@tanstack/react-router";
import { getStore } from "@/config/stores";
import { StoreThemeStyle, themeScopeClass } from "@/components/storefront/store-theme";
import { StoreHeader } from "@/components/storefront/store-header";
import { StoreFooter } from "@/components/storefront/store-footer";
import { WhatsappFab } from "@/components/storefront/whatsapp-fab";
import { DemoBanner } from "@/components/storefront/demo-banner";
import { LiquidMobileMenu } from "@/components/storefront/liquid-mobile-menu";
import { useEffect } from "react";
import { seedAllStores } from "@/services/local-repository";
import { useRepo } from "@/hooks/use-repo";

export const Route = createFileRoute("/demo/$storeSlug")({
  beforeLoad: ({ params }) => {
    // Redirect legado: /demo/mercado[/...] -> /demo/barbearia
    if (params.storeSlug === "mercado") {
      throw redirect({ to: "/demo/$storeSlug", params: { storeSlug: "barbearia" } });
    }
    if (!getStore(params.storeSlug)) throw notFound();
  },
  head: ({ params }) => {
    const s = getStore(params.storeSlug);
    if (!s) return {};
    return {
      meta: [
        { title: `${s.name} — ${s.tagline}` },
        { name: "description", content: s.description },
        { property: "og:title", content: s.name },
        { property: "og:description", content: s.description },
      ],
      links: s.fonts.linkHref ? [{ rel: "stylesheet", href: s.fonts.linkHref }] : [],
    };
  },
  component: StoreLayout,
  notFoundComponent: StoreNotFound,
});

function StoreLayout() {
  const { storeSlug } = Route.useParams();
  const repo = useRepo();
  const store = repo.getConfig(storeSlug) ?? getStore(storeSlug)!;

  useEffect(() => {
    seedAllStores();
  }, []);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.includes(`/demo/${storeSlug}/admin`);
  if (isAdmin) {
    return (
      <div className={themeScopeClass(store.slug) + " min-h-screen"}>
        <StoreThemeStyle store={store} />
        <Outlet />
      </div>
    );
  }

  // Esconde o menu flutuante no formulário final do checkout para não cobrir o botão.
  const hideFloatingMenu = pathname.endsWith(`/demo/${storeSlug}/checkout`);
  return (
    <div className={themeScopeClass(store.slug) + " min-h-screen"}>
      <StoreThemeStyle store={store} />
      <DemoBanner />
      <StoreHeader store={store} />
      <main>
        <Outlet />
      </main>
      <StoreFooter store={store} />
      <WhatsappFab store={store} />
      <LiquidMobileMenu store={store} hide={hideFloatingMenu} />
    </div>
  );
}

function StoreNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">Loja não encontrada</h1>
        <p className="mt-2 text-muted-foreground">
          A loja demonstrativa que você tentou abrir não existe.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Voltar para a Central
        </Link>
      </div>
    </div>
  );
}
