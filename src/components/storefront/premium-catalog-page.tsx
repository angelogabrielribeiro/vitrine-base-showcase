import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Grid3X3, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import type { Product, StoreConfig } from "@/types/commerce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/storefront/product-card";
import { SafeImage } from "@/components/storefront/safe-image";
import { commerceSurface } from "@/components/storefront/commerce-surface";

interface PremiumCatalogPageProps {
  store: StoreConfig;
  products: Product[];
  q?: string;
  cat?: string;
  sort?: string;
  categoryName?: string;
  onSearchChange?: (patch: Partial<{ q: string; cat: string; sort: string }>) => void;
}

export function PremiumCatalogPage({
  store,
  products,
  q = "",
  cat = "",
  sort = "",
  categoryName,
  onSearchChange,
}: PremiumCatalogPageProps) {
  const surface = commerceSurface(store.niche);
  const reduceMotion = useReducedMotion();
  const lead = products[0];
  const isCategory = Boolean(categoryName);

  return (
    <main className={`relative isolate min-h-screen overflow-hidden ${surface.shell}`}>
      <AmbientLayer niche={store.niche} />

      <section className={`relative border-b ${surface.border}`}>
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/demo/$storeSlug"
              params={{ storeSlug: store.slug }}
              className={`group inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] ${surface.muted}`}
            >
              <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
              Voltar à experiência
            </Link>
            <div
              className={`hidden text-[9px] uppercase tracking-[0.34em] sm:block ${surface.muted}`}
            >
              {String(products.length).padStart(2, "0")} objetos disponíveis
            </div>
          </div>

          <div className="mt-12 grid items-end gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={`inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.4em] ${surface.eyebrow}`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isCategory ? `${categoryName} / selection` : surface.catalogKicker}
              </div>
              <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.88] tracking-[-0.045em] sm:text-7xl lg:text-[5.7rem]">
                {isCategory ? categoryName : surface.catalogTitle}
              </h1>
              <p className={`mt-7 max-w-2xl text-sm leading-7 sm:text-base ${surface.muted}`}>
                {isCategory
                  ? `${products.length} ${products.length === 1 ? "peça selecionada" : "peças selecionadas"} para esta categoria.`
                  : surface.catalogCopy}
              </p>
            </motion.div>

            {lead && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`relative hidden min-h-56 overflow-hidden border lg:block ${surface.border} ${surface.panel}`}
              >
                <SafeImage
                  src={lead.images[0]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className={`text-[8px] uppercase tracking-[0.36em] ${surface.eyebrow}`}>
                    Lead object
                  </div>
                  <div className="mt-2 max-w-xs text-xl font-semibold text-white">{lead.name}</div>
                </div>
                <span className="absolute right-4 top-4 h-2 w-2 animate-pulse rounded-full bg-current text-cyan-200" />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className={`relative border-b ${surface.border} ${surface.panel} backdrop-blur-xl`}>
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <Link
              to="/demo/$storeSlug/produtos"
              params={{ storeSlug: store.slug }}
              search={{ q: "", cat: "", sort: "" }}
              className={`shrink-0 border px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.25em] transition ${
                !cat && !isCategory
                  ? `${surface.accent} text-black`
                  : `${surface.border} ${surface.outlineButton}`
              }`}
            >
              Todos
            </Link>
            {store.categories.map((category) => (
              <Link
                key={category.slug}
                to="/demo/$storeSlug/categoria/$categorySlug"
                params={{ storeSlug: store.slug, categorySlug: category.slug }}
                className={`shrink-0 border px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.25em] transition ${
                  categoryName === category.name || cat === category.slug
                    ? `${surface.accent} text-black`
                    : `${surface.border} ${surface.outlineButton}`
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        {onSearchChange && (
          <div className={`mb-10 grid gap-px border bg-current/10 ${surface.border}`}>
            <div className={`grid gap-px lg:grid-cols-[1fr_230px_230px] ${surface.panel}`}>
              <label className={`relative flex items-center ${surface.panelStrong}`}>
                <Search className={`absolute left-5 h-4 w-4 ${surface.muted}`} />
                <Input
                  value={q}
                  onChange={(event) => onSearchChange({ q: event.target.value })}
                  placeholder="Buscar no acervo"
                  aria-label="Buscar"
                  className="h-16 rounded-none border-0 bg-transparent pl-13 text-sm shadow-none focus-visible:ring-0"
                />
              </label>
              <div className={`flex items-center gap-3 px-5 ${surface.panelStrong}`}>
                <Grid3X3 className={`h-4 w-4 ${surface.muted}`} />
                <Select
                  value={cat || "all"}
                  onValueChange={(value) => onSearchChange({ cat: value === "all" ? "" : value })}
                >
                  <SelectTrigger className="h-16 flex-1 rounded-none border-0 bg-transparent px-0 shadow-none focus:ring-0">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas categorias</SelectItem>
                    {store.categories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={`flex items-center gap-3 px-5 ${surface.panelStrong}`}>
                <SlidersHorizontal className={`h-4 w-4 ${surface.muted}`} />
                <Select
                  value={sort || "relevance"}
                  onValueChange={(value) =>
                    onSearchChange({ sort: value === "relevance" ? "" : value })
                  }
                >
                  <SelectTrigger className="h-16 flex-1 rounded-none border-0 bg-transparent px-0 shadow-none focus:ring-0">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Curadoria</SelectItem>
                    <SelectItem value="price-asc">Menor preço</SelectItem>
                    <SelectItem value="price-desc">Maior preço</SelectItem>
                    <SelectItem value="name">Nome A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <div className={`text-[9px] uppercase tracking-[0.34em] ${surface.eyebrow}`}>
              {isCategory ? "Category sequence" : "Current selection"}
            </div>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">
              {products.length ? "Objetos em evidência" : "Nada encontrado"}
            </h2>
          </div>
          <div
            className={`hidden items-center gap-2 text-[9px] uppercase tracking-[0.28em] sm:flex ${surface.muted}`}
          >
            Role para explorar <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {products.length === 0 ? (
          <div className={`border p-12 text-center ${surface.border} ${surface.panel}`}>
            <div className="font-display text-3xl">Nenhum resultado nesta frequência.</div>
            <p className={`mt-3 text-sm ${surface.muted}`}>
              Ajuste os filtros para abrir outra seleção.
            </p>
            {onSearchChange && (
              <button
                type="button"
                onClick={() => onSearchChange({ q: "", cat: "", sort: "" })}
                className={`mt-7 border px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] transition ${surface.outlineButton}`}
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduceMotion ? 0 : 0.055 } },
            }}
            className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} storeSlug={store.slug} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <section className={`relative border-t ${surface.border}`}>
        <div className="mx-auto grid max-w-7xl gap-px sm:grid-cols-3">
          {surface.proof.map((item, index) => (
            <div key={item} className={`flex items-center gap-4 px-6 py-7 ${surface.panel}`}>
              <span className={`text-[9px] font-semibold ${surface.eyebrow}`}>0{index + 1}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em]">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function AmbientLayer({ niche }: { niche: StoreConfig["niche"] }) {
  if (niche === "fashion") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 8%, rgba(143,85,72,.16), transparent 28%), linear-gradient(rgba(42,32,29,.035) 1px, transparent 1px)",
          backgroundSize: "auto, 100% 42px",
        }}
      />
    );
  }
  if (niche === "restaurant") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 78% 4%, rgba(255,100,43,.23), transparent 24%), radial-gradient(circle at 8% 45%, rgba(173,55,18,.14), transparent 28%)",
        }}
      />
    );
  }
  if (niche === "barber") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "linear-gradient(115deg, transparent 40%, rgba(217,177,102,.07), transparent 68%), radial-gradient(circle at 70% 0%, rgba(217,177,102,.1), transparent 24%)",
        }}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-50"
      style={{
        backgroundImage:
          "linear-gradient(rgba(103,232,249,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,.06) 1px, transparent 1px), radial-gradient(circle at 76% 4%, rgba(59,130,246,.25), transparent 30%)",
        backgroundSize: "42px 42px, 42px 42px, auto",
      }}
    />
  );
}
