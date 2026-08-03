import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, User, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StoreConfig } from "@/types/commerce";
import { useCart } from "@/hooks/use-cart";
import { useHydrated } from "@/hooks/use-hydrated";
import { StoreSwitcher } from "./store-switcher";

export function StoreHeader({ store }: { store: StoreConfig }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartPulse, setCartPulse] = useState(0);
  const previousCount = useRef<number | null>(null);
  const { count } = useCart(store.slug);
  const hydrated = useHydrated();
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (previousCount.current === null) {
      previousCount.current = count;
      return;
    }
    if (previousCount.current !== count) {
      previousCount.current = count;
      setCartPulse((value) => value + 1);
    }
  }, [count, hydrated]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/demo/$storeSlug/produtos",
      params: { storeSlug: store.slug },
      search: { q: query, cat: "", sort: "" },
    });
  };

  const immersiveFashion = store.niche === "fashion";

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        immersiveFashion
          ? "border-[#d49aa7]/18 bg-[#180c12]/95 text-[#f7eee8] [&_.text-muted-foreground]:!text-[#d7bbc2] [&_input]:border-[#d49aa7]/25 [&_input]:bg-[#28121b] [&_input]:text-[#f7eee8] [&_input]:placeholder:text-[#b9929c] [&_button:hover]:bg-white/10"
          : "border-border/60 bg-background/95"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
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
                suppressHydrationWarning
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar"
                className="h-9 w-56 pl-8"
                aria-label="Buscar"
                style={{ caretColor: "auto" }}
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
          <Button asChild variant="ghost" size="icon" aria-label="Meus pedidos">
            <Link to="/demo/$storeSlug/meus-pedidos" params={{ storeSlug: store.slug }}>
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Carrinho">
            <Link to="/demo/$storeSlug/carrinho" params={{ storeSlug: store.slug }}>
              <motion.span
                key={`cart-${cartPulse}`}
                className="inline-flex"
                initial={false}
                animate={
                  cartPulse > 0 && !reduceMotion
                    ? {
                        rotate: [0, -14, 12, -7, 0],
                        scale: [1, 1.24, 0.94, 1.08, 1],
                      }
                    : undefined
                }
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <ShoppingBag className="h-5 w-5" />
              </motion.span>
              {hydrated && count > 0 && (
                <motion.span
                  key={`cart-count-${count}-${cartPulse}`}
                  initial={reduceMotion ? false : { scale: 0.45, opacity: 0, y: 4 }}
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { scale: [1, 1.32, 1], opacity: 1, y: 0 }
                  }
                  transition={{ duration: 0.42, ease: "easeOut" }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                >
                  {count}
                </motion.span>
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
                suppressHydrationWarning
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos"
                className="pl-8"
                style={{ caretColor: "auto" }}
                autoFocus
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
