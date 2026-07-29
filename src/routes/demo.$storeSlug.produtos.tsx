import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo } from "react";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { PremiumCatalogPage } from "@/components/storefront/premium-catalog-page";

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
      list = list.filter(
        (p) => p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t),
      );
    }
    if (sort === "price-asc")
      list = [...list].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    else if (sort === "price-desc")
      list = [...list].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [all, q, cat, sort]);

  const setSearch = (patch: Partial<{ q: string; cat: string; sort: string }>) => {
    navigate({ to: ".", search: { q, cat, sort, ...patch } });
  };

  return (
    <PremiumCatalogPage
      store={store}
      products={filtered}
      q={q}
      cat={cat}
      sort={sort}
      onSearchChange={setSearch}
    />
  );
}
