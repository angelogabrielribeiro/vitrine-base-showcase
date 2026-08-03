import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useRef } from "react";
import {
  CalendarDays,
  Home,
  MessageCircle,
  ShoppingBag,
  User2,
  UtensilsCrossed,
  X,
  Scissors,
  ShoppingBasket,
} from "lucide-react";
import type { StoreConfig } from "@/types/commerce";
import { useCart } from "@/hooks/use-cart";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMobileMenuState } from "@/components/storefront/mobile-menu-state";

/**
 * Menu flutuante mobile inspirado no comportamento "Liquid Morph":
 * cápsula que morfa em painel. Não aparece em rotas /admin.
 * Se `hide` for true, o botão fica oculto (usar na etapa final do checkout).
 */
export function LiquidMobileMenu({ store, hide = false }: { store: StoreConfig; hide?: boolean }) {
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const previousPathname = useRef<string | null>(null);
  const { count } = useCart(store.slug);
  const hydrated = useHydrated();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { menuOpen: open, setMenuOpen: setOpen } = useMobileMenuState();

  /**
   * Atualiza o estado React e o estado visual do FAB na mesma chamada.
   * O ajuste direto no DOM é um fallback transitório para o intervalo entre
   * o evento de toque e o commit do React — os atributos finais continuam
   * sendo controlados pelo componente WhatsappFab.
   */
  const updateOpen = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (typeof document === "undefined") return;

      const root = document.documentElement;
      if (next) root.dataset.mobileMenuOpen = "true";
      else delete root.dataset.mobileMenuOpen;

      const fab = document.querySelector<HTMLAnchorElement>(
        'a[data-whatsapp-fab][aria-label="Falar no WhatsApp"]',
      );
      if (!fab) return;

      if (next) {
        fab.setAttribute("aria-hidden", "true");
        fab.setAttribute("tabindex", "-1");
        fab.style.pointerEvents = "none";
        fab.style.visibility = "hidden";
        fab.style.opacity = "0";
      } else {
        fab.removeAttribute("aria-hidden");
        fab.removeAttribute("tabindex");
        fab.style.removeProperty("pointer-events");
        fab.style.removeProperty("visibility");
        fab.style.removeProperty("opacity");
      }
    },
    [setOpen],
  );

  // Fecha apenas quando a rota realmente muda. O efeito inicial não disputa
  // com o primeiro toque no botão em páginas que ainda estão hidratando.
  useEffect(() => {
    if (previousPathname.current === null) {
      previousPathname.current = pathname;
      return;
    }
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    updateOpen(false);
  }, [pathname, updateOpen]);

  useEffect(
    () => () => {
      if (typeof document === "undefined") return;
      delete document.documentElement.dataset.mobileMenuOpen;
      const fab = document.querySelector<HTMLAnchorElement>('a[data-whatsapp-fab]');
      fab?.removeAttribute("aria-hidden");
      fab?.removeAttribute("tabindex");
      fab?.style.removeProperty("pointer-events");
      fab?.style.removeProperty("visibility");
      fab?.style.removeProperty("opacity");
    },
    [],
  );

  // Escape + toque/clique fora.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") updateOpen(false);
    };
    const onDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        updateOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, updateOpen]);

  useEffect(() => {
    if (open) firstItemRef.current?.focus();
  }, [open]);

  if (hide) return null;

  const isBarber = store.niche === "barber";
  const isRestaurant = store.niche === "restaurant";
  const listingLabel = isBarber ? "Produtos" : isRestaurant ? "Cardápio" : "Produtos";
  const ListingIcon = isBarber ? Scissors : isRestaurant ? UtensilsCrossed : ShoppingBasket;

  return (
    <div
      ref={containerRef}
      data-mobile-menu-open={open ? "true" : "false"}
      className="fixed inset-x-0 bottom-4 z-50 mx-auto flex justify-center px-4 md:hidden print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="liquid-shell relative overflow-hidden bg-primary text-primary-foreground shadow-2xl shadow-primary/30 ring-1 ring-primary/20 transition-all duration-500 ease-[cubic-bezier(.5,1.4,.4,1)]"
        data-open={open}
        aria-hidden={undefined}
      >
        <div className="liquid-blob" aria-hidden />
        {!open ? (
          isBarber ? (
            <div className="relative flex items-stretch">
              <Link
                to="/demo/$storeSlug/agendar"
                params={{ storeSlug: store.slug }}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-foreground/15">
                  <CalendarDays className="h-3.5 w-3.5" />
                </span>
                <span>Agendar</span>
              </Link>
              <span aria-hidden className="my-2 w-px bg-primary-foreground/25" />
              <button
                type="button"
                aria-expanded={false}
                aria-controls={panelId}
                onClick={() => updateOpen(true)}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-foreground/15">
                  <ListingIcon className="h-3.5 w-3.5" />
                </span>
                <span>Menu</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-expanded={false}
              aria-controls={panelId}
              onClick={() => updateOpen(true)}
              className="relative flex items-center gap-2 px-5 py-3 text-sm font-semibold"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-foreground/15">
                <ListingIcon className="h-3.5 w-3.5" />
              </span>
              <span>Menu</span>
              {hydrated && count > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-foreground px-1 text-[10px] font-bold text-primary">
                  {count}
                </span>
              )}
            </button>
          )
        ) : (
          <div
            id={panelId}
            role="menu"
            aria-label="Menu principal"
            className="relative flex w-[min(92vw,22rem)] flex-col p-3"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
                {store.logoText}
              </div>
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => updateOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <MenuLink
              innerRef={firstItemRef}
              to="/demo/$storeSlug"
              params={{ storeSlug: store.slug }}
              icon={<Home className="h-4 w-4" />}
              label="Início"
            />
            <MenuLink
              to="/demo/$storeSlug/produtos"
              params={{ storeSlug: store.slug }}
              search={{ q: "", cat: "", sort: "" }}
              icon={<ListingIcon className="h-4 w-4" />}
              label={listingLabel}
            />
            {isBarber ? (
              <MenuLink
                to="/demo/$storeSlug/agendar"
                params={{ storeSlug: store.slug }}
                icon={<CalendarDays className="h-4 w-4" />}
                label="Agendar horário"
              />
            ) : (
              <MenuLink
                to="/demo/$storeSlug/carrinho"
                params={{ storeSlug: store.slug }}
                icon={<ShoppingBag className="h-4 w-4" />}
                label="Carrinho"
                badge={hydrated && count > 0 ? String(count) : undefined}
              />
            )}
            <MenuLink
              to="/demo/$storeSlug/meus-pedidos"
              params={{ storeSlug: store.slug }}
              icon={<User2 className="h-4 w-4" />}
              label="Meus pedidos"
            />
            <a
              role="menuitem"
              href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-3 py-2.5 text-sm font-medium hover:bg-primary-foreground/20"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        )}
      </div>

      <style>{`
        .liquid-shell {
          border-radius: 999px;
        }
        .liquid-shell[data-open="true"] {
          border-radius: 28px;
        }
        .liquid-blob {
          position: absolute;
          inset: -30% -20%;
          background: radial-gradient(closest-side, color-mix(in oklab, white 25%, transparent), transparent 70%);
          filter: blur(20px);
          opacity: .55;
          pointer-events: none;
          animation: liquid-drift 8s ease-in-out infinite alternate;
        }
        @keyframes liquid-drift {
          from { transform: translate3d(-6%, -4%, 0) scale(1); }
          to   { transform: translate3d(8%, 6%, 0) scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .liquid-shell, .liquid-blob { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}

// Menu link genérico com tipos frouxos por variação de rotas.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MenuLink({ innerRef, to, params, search, icon, label, badge }: any) {
  return (
    <Link
      ref={innerRef}
      role="menuitem"
      to={to}
      params={params}
      search={search}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none hover:bg-primary-foreground/10 focus-visible:bg-primary-foreground/15"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-foreground/10">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-foreground px-1 text-[10px] font-bold text-primary">
          {badge}
        </span>
      )}
    </Link>
  );
}
