import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { StoreConfig } from "@/types/commerce";
import { useCart } from "@/hooks/use-cart";
import { useHydrated } from "@/hooks/use-hydrated";
import { StoreSwitcher } from "./store-switcher";

export function StoreHeader({ store }: { store: StoreConfig }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count } = useCart(store.slug);
  const hydrated = useHydrated();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/demo/$storeSlug/produtos",
      params: { storeSlug: store.slug },
      search: { q: query, cat: "", sort: "" },
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="mt-8 flex flex-col gap-2">
              <Link to="/demo/$storeSlug" params={{ storeSlug: store.slug }} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                Início
              </Link>
              {store.niche === "barber" && (
                <Link
                  to="/demo/$storeSlug/agendar"
                  params={{ storeSlug: store.slug }}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
                >
                  Agendar horário
                </Link>
              )}
              <Link
                to="/demo/$storeSlug/produtos"
                params={{ storeSlug: store.slug }}
                search={{ q: "", cat: "", sort: "" }}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Todos os produtos
              </Link>
              <div className="mt-4 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Categorias
              </div>
              {store.categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/demo/$storeSlug/categoria/$categorySlug"
                  params={{ storeSlug: store.slug, categorySlug: c.slug }}
                  className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          to="/demo/$storeSlug"
          params={{ storeSlug: store.slug }}
          className="font-display text-xl font-semibold tracking-tight"
        >
          {store.logoText}
        </Link>

        <nav className="ml-6 hidden items-center gap-4 text-sm md:flex">
          {store.niche === "barber" && (
            <Link
              to="/demo/$storeSlug/agendar"
              params={{ storeSlug: store.slug }}
              className="font-semibold text-primary hover:underline"
            >
              Agendar
            </Link>
          )}
          <Link
            to="/demo/$storeSlug/produtos"
            params={{ storeSlug: store.slug }}
            search={{ q: "", cat: "", sort: "" }}
            className="hover:text-primary"
          >
            Produtos
          </Link>
          {store.categories.slice(0, 4).map((c) => (
            <Link
              key={c.slug}
              to="/demo/$storeSlug/categoria/$categorySlug"
              params={{ storeSlug: store.slug, categorySlug: c.slug }}
              className="text-muted-foreground hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <form onSubmit={submit} className="hidden md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar"
                className="h-9 w-56 pl-8"
                aria-label="Buscar"
              />
            </div>
          </form>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Buscar"
          >
            {open ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>
          <StoreSwitcher currentSlug={store.slug} />
          <Button asChild variant="ghost" size="icon" aria-label="Entrar">
            <Link to="/demo/$storeSlug/login" params={{ storeSlug: store.slug }}>
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Carrinho">
            <Link to="/demo/$storeSlug/carrinho" params={{ storeSlug: store.slug }}>
              <ShoppingBag className="h-5 w-5" />
              {hydrated && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 px-4 py-3 md:hidden">
          <form onSubmit={submit}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos"
                className="pl-8"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
