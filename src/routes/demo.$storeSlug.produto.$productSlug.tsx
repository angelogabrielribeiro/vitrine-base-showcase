import { createFileRoute, notFound } from "@tanstack/react-router";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { PremiumProductDetail } from "@/components/storefront/premium-product-detail";

export const Route = createFileRoute("/demo/$storeSlug/produto/$productSlug")({
  component: ProductPage,
});

function ProductPage() {
  const { storeSlug, productSlug } = Route.useParams();
  const store = getStore(storeSlug);
  const repo = useRepo();
  const product = repo.getProduct(storeSlug, productSlug);

  if (!store || !product) throw notFound();

  const activeProducts = repo.listProducts(storeSlug).filter((item) => item.active);
  const preferredRelatedIds = new Set(product.relatedIds ?? []);
  const related = activeProducts
    .filter((item) => item.id !== product.id)
    .sort((a, b) => {
      const aScore =
        (preferredRelatedIds.has(a.id) ? 4 : 0) + (a.category === product.category ? 2 : 0);
      const bScore =
        (preferredRelatedIds.has(b.id) ? 4 : 0) + (b.category === product.category ? 2 : 0);
      return bScore - aScore;
    })
    .slice(0, 4);

  return <PremiumProductDetail store={store} product={product} related={related} />;
}
