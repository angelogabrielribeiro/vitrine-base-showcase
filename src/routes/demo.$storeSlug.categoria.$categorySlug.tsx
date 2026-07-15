import { createFileRoute, Link } from "@tanstack/react-router";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { ProductCard } from "@/components/storefront/product-card";

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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-xs text-muted-foreground">
        <Link to="/demo/$storeSlug" params={{ storeSlug }} className="hover:underline">Início</Link>
        {" / "}
        <span>Categorias</span>
        {" / "}
        <span className="text-foreground">{cat?.name ?? categorySlug}</span>
      </div>
      <h1 className="font-display mt-2 text-3xl font-semibold">{cat?.name ?? "Categoria"}</h1>
      <p className="text-sm text-muted-foreground">
        {products.length} {products.length === 1 ? "produto" : "produtos"}
      </p>

      {products.length === 0 ? (
        <div className="mt-16 rounded-[var(--radius)] border border-dashed border-border p-10 text-center">
          <div className="text-lg font-medium">Categoria vazia</div>
          <p className="mt-1 text-sm text-muted-foreground">Nenhum produto disponível nesta categoria.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} storeSlug={storeSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
