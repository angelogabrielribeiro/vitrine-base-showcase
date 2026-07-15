import { useCallback, useMemo } from "react";
import { useRepo } from "./use-repo";
import type { Product, ProductVariant } from "@/types/commerce";

function itemKey(productId: string, variantId?: string, addonIds: string[] = [], notes?: string) {
  return [productId, variantId ?? "-", [...addonIds].sort().join("+"), notes?.trim() ?? ""].join("|");
}

export function useCart(storeSlug: string) {
  const repo = useRepo();
  const items = repo.getCart(storeSlug);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  );
  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);

  const add = useCallback(
    (opts: {
      product: Product;
      quantity?: number;
      variant?: ProductVariant;
      addons?: { id: string; name: string; price: number }[];
      notes?: string;
    }) => {
      const { product, quantity = 1, variant, addons = [], notes } = opts;
      const basePrice = product.salePrice ?? product.price;
      const variantDelta = variant?.priceDelta ?? 0;
      const addonTotal = addons.reduce((s, a) => s + a.price, 0);
      const unitPrice = basePrice + variantDelta + addonTotal;
      const maxStock = variant ? variant.stock : product.stock;
      const k = itemKey(product.id, variant?.id, addons.map((a) => a.id), notes);
      const cart = repo.getCart(storeSlug);
      const idx = cart.findIndex((i) => i.key === k);
      const variantLabel = variant
        ? Object.values(variant.attributes).join(" / ")
        : undefined;
      if (idx >= 0) {
        const next = Math.min(cart[idx].quantity + quantity, maxStock || 99);
        cart[idx] = { ...cart[idx], quantity: next };
      } else {
        cart.unshift({
          key: k,
          productId: product.id,
          name: product.name,
          image: product.images[0] ?? "",
          unitPrice,
          quantity: Math.min(quantity, maxStock || 99),
          variantId: variant?.id,
          variantLabel,
          addons: addons.length ? addons : undefined,
          notes: notes?.trim() || undefined,
          maxStock: maxStock || 99,
        });
      }
      repo.saveCart(storeSlug, cart);
    },
    [repo, storeSlug],
  );

  const setQuantity = useCallback(
    (key: string, quantity: number) => {
      const cart = repo.getCart(storeSlug).map((i) =>
        i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock || 99)) } : i,
      );
      repo.saveCart(storeSlug, cart);
    },
    [repo, storeSlug],
  );

  const remove = useCallback(
    (key: string) => {
      repo.saveCart(storeSlug, repo.getCart(storeSlug).filter((i) => i.key !== key));
    },
    [repo, storeSlug],
  );

  const clear = useCallback(() => repo.clearCart(storeSlug), [repo, storeSlug]);

  return { items, subtotal, count, add, setQuantity, remove, clear };
}
