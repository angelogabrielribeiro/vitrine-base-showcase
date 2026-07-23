import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/commerce";
import { brl } from "@/lib/format";

/**
 * Card editorial da Maison Belle.
 * Hover/foco desktop: 2ª imagem sobe por máscara vertical, gradiente
 * inferior aparece, contorno fino se desenha, CTA "Ver peça" emerge e
 * bloco de texto sobe levemente. Tudo neutralizado sob prefers-reduced-motion.
 */
export function EditorialProductCard({
  product,
  storeSlug,
  aspect = "portrait",
}: {
  product: Product;
  storeSlug: string;
  aspect?: "portrait" | "square";
}) {
  const reduce = useReducedMotion();
  const inStock =
    product.variants && product.variants.length
      ? product.variants.some((v) => v.stock > 0)
      : product.stock > 0;
  const primary = product.images[0];
  const secondary = product.images[1];
  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-[4/5]";

  return (
    <Link
      to="/demo/$storeSlug/produto/$productSlug"
      params={{ storeSlug, productSlug: product.slug }}
      className="ep-card group relative block focus:outline-none focus-visible:outline-none"
    >
      <motion.div
        className={"relative w-full overflow-hidden bg-neutral-100 " + aspectClass}
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={primary}
          alt={product.name}
          loading="lazy"
          className={
            "ep-img-primary absolute inset-0 h-full w-full object-cover " +
            (reduce ? "" : "transition-transform duration-[550ms] ease-out")
          }
        />

        {secondary && !reduce && (
          <div aria-hidden className="ep-reveal pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
            <img src={secondary} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        )}

        <span
          aria-hidden
          className="ep-grad pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/2 opacity-0 md:block"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 55%, transparent)",
          }}
        />

        {!reduce && (
          <span aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
            <span className="ep-line ep-line-t" />
            <span className="ep-line ep-line-r" />
            <span className="ep-line ep-line-b" />
            <span className="ep-line ep-line-l" />
          </span>
        )}

        <span
          aria-hidden
          className="ep-cta pointer-events-none absolute inset-x-0 bottom-4 z-10 hidden items-center justify-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white opacity-0 md:flex"
        >
          Ver peça
          <ArrowRight className="h-3 w-3" />
        </span>

        {product.salePrice && inStock && (
          <span className="absolute left-3 top-3 z-10 bg-amber-200 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-900">
            Oferta
          </span>
        )}
        {!inStock && (
          <span className="absolute left-3 top-3 z-10 bg-neutral-900/80 px-2 py-1 text-[10px] uppercase tracking-widest text-white">
            Esgotado
          </span>
        )}
      </motion.div>

      <div className="ep-meta mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display truncate text-base leading-tight text-neutral-900">
            {product.name}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            {product.category}
          </p>
        </div>
        <div className="text-right">
          {product.salePrice ? (
            <>
              <div className="text-sm font-semibold text-neutral-900">
                {brl(product.salePrice)}
              </div>
              <div className="text-xs text-neutral-400 line-through">{brl(product.price)}</div>
            </>
          ) : (
            <div className="text-sm font-semibold text-neutral-900">{brl(product.price)}</div>
          )}
        </div>
      </div>

      <style>{`
        .ep-card .ep-reveal { clip-path: inset(100% 0 0 0); transition: clip-path 550ms cubic-bezier(0.22,1,0.36,1); }
        .ep-card .ep-grad { transition: opacity 500ms ease; }
        .ep-card .ep-cta { transform: translateY(10px); transition: opacity 500ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1); }
        .ep-card .ep-meta { transition: transform 500ms cubic-bezier(0.22,1,0.36,1); }
        .ep-card .ep-img-primary { transform: scale(1); }
        @media (hover: hover) {
          .ep-card:hover .ep-img-primary, .ep-card:focus-visible .ep-img-primary { transform: scale(1.025); }
          .ep-card:hover .ep-reveal, .ep-card:focus-visible .ep-reveal { clip-path: inset(0 0 0 0); }
          .ep-card:hover .ep-grad, .ep-card:focus-visible .ep-grad { opacity: 1; }
          .ep-card:hover .ep-cta, .ep-card:focus-visible .ep-cta { opacity: 1; transform: translateY(0); }
          .ep-card:hover .ep-meta, .ep-card:focus-visible .ep-meta { transform: translateY(-4px); }
        }
        .ep-line { position: absolute; background: rgba(255,255,255,0.85); transition: transform 550ms cubic-bezier(0.22,1,0.36,1); }
        .ep-line-t { top: 8px; left: 8px; right: 8px; height: 1px; transform: scaleX(0); transform-origin: left; }
        .ep-line-b { bottom: 8px; left: 8px; right: 8px; height: 1px; transform: scaleX(0); transform-origin: right; }
        .ep-line-l { left: 8px; top: 8px; bottom: 8px; width: 1px; transform: scaleY(0); transform-origin: top; }
        .ep-line-r { right: 8px; top: 8px; bottom: 8px; width: 1px; transform: scaleY(0); transform-origin: bottom; }
        @media (hover: hover) {
          .ep-card:hover .ep-line-t, .ep-card:focus-visible .ep-line-t,
          .ep-card:hover .ep-line-b, .ep-card:focus-visible .ep-line-b { transform: scaleX(1); }
          .ep-card:hover .ep-line-l, .ep-card:focus-visible .ep-line-l,
          .ep-card:hover .ep-line-r, .ep-card:focus-visible .ep-line-r { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ep-card .ep-img-primary, .ep-card .ep-reveal, .ep-card .ep-grad, .ep-card .ep-cta, .ep-card .ep-meta { transition: none !important; transform: none !important; }
          .ep-card .ep-line { display: none; }
        }
      `}</style>
    </Link>
  );
}