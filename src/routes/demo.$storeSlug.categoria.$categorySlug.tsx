import { createFileRoute } from "@tanstack/react-router";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { PremiumCatalogPage } from "@/components/storefront/premium-catalog-page";

export const Route = createFileRoute("/demo/$storeSlug/categoria/$categorySlug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { storeSlug, categorySlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const cat = store.categories.find((c) => c.slug === categorySlug);
  const repo = useRepo();
  const products = repo
    .listProducts(storeSlug)
    .filter((p) => p.active && p.category === categorySlug);

  return (
    <PremiumCatalogPage
      store={store}
      products={products}
      categoryName={cat?.name ?? categorySlug}
    />
  );
}
