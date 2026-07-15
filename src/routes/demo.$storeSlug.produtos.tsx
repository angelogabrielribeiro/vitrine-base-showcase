import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { ProductCard } from "@/components/storefront/product-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  cat: fallback(z.string(), "").default(""),
  sort: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/demo/$storeSlug/produtos")({
  validateSearch: zodValidator(searchSchema),
  component: ProdutosPage,
});

function ProdutosPage() {
  const { storeSlug } = Route.useParams();
  const { q, cat, sort } = Route.useSearch();
  const navigate = Route.useNavigate();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const all = repo.listProducts(storeSlug).filter((p) => p.active);

  const filtered = useMemo(() => {
    let list = all;
    if (cat) list = list.filter((p) => p.category === cat);
    if (q) {
      const t = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    else if (sort === "price-desc") list = [...list].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [all, q, cat, sort]);

  const setSearch = (patch: Partial<{ q: string; cat: string; sort: string }>) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, ...patch }) });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Todos os produtos</h1>
      <p className="text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_200px_200px]">
        <Input value={q} onChange={(e) => setSearch({ q: e.target.value })} placeholder="Buscar por nome" aria-label="Buscar" />
        <Select value={cat || "all"} onValueChange={(v) => setSearch({ cat: v === "all" ? "" : v })}>
          <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {store.categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort || "relevance"} onValueChange={(v) => setSearch({ sort: v === "relevance" ? "" : v })}>
          <SelectTrigger><SelectValue placeholder="Ordenar" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevância</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
            <SelectItem value="name">Nome A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 rounded-[var(--radius)] border border-dashed border-border p-10 text-center">
          <div className="text-lg font-medium">Nenhum produto encontrado</div>
          <p className="mt-1 text-sm text-muted-foreground">Ajuste a busca ou remova os filtros.</p>
          <Button variant="outline" className="mt-6" onClick={() => setSearch({ q: "", cat: "", sort: "" })}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} storeSlug={storeSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
