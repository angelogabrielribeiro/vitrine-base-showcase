import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/types/commerce";
import { brl } from "@/lib/format";

/**
 * Card editorial para Maison Belle: revela imagem com máscara, cross-fade
 * entre 1ª e 2ª imagem no hover, tipografia serif. Mantém navegação
 * padrão da rota de produto.
 */
export function EditorialProductCard({
  product,
  storeSlug,
  aspect = "portrait",
}: {
  product: Product;
  storeSlug: string;
  aspect?: "portrait" | "tall" | "square";
}) {
  const reduce = useReducedMotion();
  const inStock =
    product.variants && product.variants.length
      ? product.variants.some((v) => v.stock > 0)
      : product.stock > 0;
  const primary = product.images[0];
  const secondary = product.images[1] ?? product.images[0];
  const aspectClass =
    aspect === "tall" ? "aspect-[3/5]" : aspect === "square" ? "aspect-square" : "aspect-[4/5]";
  return (
    <Link
      to="/demo/$storeSlug/produto/$productSlug"
      params={{ storeSlug, productSlug: product.slug }}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
    >
      <motion.div
        className={"relative w-full overflow-hidden bg-neutral-100 " + aspectClass}
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={primary}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <img
          src={secondary}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 ease-out group-hover:opacity-100"
        />
        {product.salePrice && inStock && (
          <span className="absolute left-3 top-3 bg-amber-200 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-900">
            Oferta
          </span>
        )}
        {!inStock && (
          <span className="absolute left-3 top-3 bg-neutral-900/80 px-2 py-1 text-[10px] uppercase tracking-widest text-white">
            Esgotado
          </span>
        )}
      </motion.div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg leading-tight text-neutral-900">{product.name}</h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            {product.category}
          </p>
        </div>
        <div className="text-right">
          {product.salePrice ? (
            <>
              <div className="text-sm font-semibold text-neutral-900">{brl(product.salePrice)}</div>
              <div className="text-xs text-neutral-400 line-through">{brl(product.price)}</div>
            </>
          ) : (
            <div className="text-sm font-semibold text-neutral-900">{brl(product.price)}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
