import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import mobileVitrineCss from "../mobile-vitrine-overrides.css?url";
import { CinematicMotionProvider } from "../components/motion/cinematic-motion-system";
import { NotFoundPage } from "../components/system/not-found-page";
import { StoreThemeBootstrapScript } from "../components/storefront/store-theme";
import { Toaster } from "../components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocorreu um erro inesperado. Tente novamente; se o problema continuar, volte para a página
          inicial.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vitrine Base | Sites e webapps para negócios locais" },
      {
        name: "description",
        content:
          "Sites e operações digitais personalizadas para lojas, restaurantes, barbearias e negócios locais.",
      },
      { name: "author", content: "Vitrine Base" },
      { property: "og:title", content: "Vitrine Base | Sites e webapps para negócios locais" },
      {
        property: "og:description",
        content:
          "Conheça demonstrações, planos de criação e manutenção para transformar a presença digital do seu negócio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Syne:wght@500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: mobileVitrineCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <StoreThemeBootstrapScript />
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <span aria-hidden="true" className="sr-only">
          Vitrine Base — experiência comercial interativa
        </span>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CinematicMotionProvider>
        <Outlet />
        <Toaster position="top-center" richColors closeButton duration={2800} />
        <GlobalInteractionStyles />
      </CinematicMotionProvider>
    </QueryClientProvider>
  );
}

function GlobalInteractionStyles() {
  return (
    <style>{`
      button:has(.lucide-shopping-bag):not(:disabled) {
        transform-origin: center;
        transition: transform 160ms cubic-bezier(.22,1,.36,1), filter 160ms ease;
        -webkit-tap-highlight-color: transparent;
      }
      button:has(.lucide-shopping-bag):not(:disabled):active {
        transform: scale(.965);
        filter: brightness(1.14);
      }
      @media (prefers-reduced-motion: reduce) {
        button:has(.lucide-shopping-bag):not(:disabled) {
          transition: none !important;
        }
      }
    `}</style>
  );
}
