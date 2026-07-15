import { Link } from "@tanstack/react-router";
import type { Product } from "@/types/commerce";
import { brl } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product, storeSlug }: { product: Product; storeSlug: string }) {
  const inStock =
    product.variants && product.variants.length
      ? product.variants.some((v) => v.stock > 0)
      : product.stock > 0;
  return (
    <Link
      to="/demo/$storeSlug/produto/$productSlug"
      params={{ storeSlug, productSlug: product.slug }}
      className="group block"
    >
      <div className="overflow-hidden rounded-[var(--radius)] bg-muted">
        <div
          className="aspect-[4/5] w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${product.images[0]})` }}
        />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="line-clamp-1 text-sm font-medium">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          {product.salePrice ? (
            <>
              <span className="text-sm font-semibold">{brl(product.salePrice)}</span>
              <span className="text-xs text-muted-foreground line-through">{brl(product.price)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold">{brl(product.price)}</span>
          )}
          {product.unit && <span className="text-xs text-muted-foreground">/{product.unit}</span>}
        </div>
        {!inStock && (
          <Badge variant="secondary" className="mt-1">
            Esgotado
          </Badge>
        )}
        {inStock && product.salePrice && <Badge className="mt-1">Oferta</Badge>}
      </div>
    </Link>
  );
}
