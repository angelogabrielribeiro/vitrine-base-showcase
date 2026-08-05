import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/commerce";
import { brl } from "@/lib/format";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { useInView, sequenceDelay } from "@/hooks/use-in-view";

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
  index = 0,
}: {
  product: Product;
  storeSlug: string;
  aspect?: "portrait" | "square";
  index?: number;
}) {
  const reduce = useReducedMotion();
  const { ref: cardRef, inView } = useInView<HTMLAnchorElement>({ amount: 0.35 });
  const { capabilities } = useCinematicMotion();
  const mobileActive =
    !reduce &&
    capabilities.hydrated &&
    capabilities.coarsePointer &&
    capabilities.quality !== "static" &&
    inView;
  const ambientActive = !reduce && capabilities.hydrated && inView;
  const inStock =
    product.variants && product.variants.length
      ? product.variants.some((v) => v.stock > 0)
      : product.stock > 0;
  const primary = product.images[0];
  const secondary = product.images[1];
  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-[4/5]";

  return (
    <Link
      ref={cardRef}
      to="/demo/$storeSlug/produto/$productSlug"
      params={{ storeSlug, productSlug: product.slug }}
      data-mobile-active={String(mobileActive)}
      data-in-view={String(ambientActive)}
      style={{ "--ep-seq-delay": `${sequenceDelay(index)}s` } as CSSProperties}
      className="ep-card group relative block focus:outline-none focus-visible:outline-none focus-visible:[&_.ep-card-frame]:ring-2 focus-visible:[&_.ep-card-frame]:ring-neutral-900 focus-visible:[&_.ep-card-frame]:ring-offset-2 focus-visible:[&_.ep-card-frame]:ring-offset-neutral-50"
    >
      <motion.div
        className={"ep-card-frame relative w-full overflow-hidden bg-neutral-100 " + aspectClass}
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
          <div
            aria-hidden
            className="ep-reveal pointer-events-none absolute inset-0 overflow-hidden"
          >
            <img src={secondary} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        )}

        <span
          aria-hidden
          className="ep-grad pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 55%, transparent)",
          }}
        />

        {!reduce && (
          <span aria-hidden className="pointer-events-none absolute inset-0">
            <span className="ep-line ep-line-t" />
            <span className="ep-line ep-line-r" />
            <span className="ep-line ep-line-b" />
            <span className="ep-line ep-line-l" />
          </span>
        )}

        <span
          aria-hidden
          className="ep-cta pointer-events-none absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white opacity-0"
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
              <div className="text-sm font-semibold text-neutral-900">{brl(product.salePrice)}</div>
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
        .ep-card-frame { transition: filter 260ms ease, box-shadow 420ms ease; }
        .ep-card[data-in-view="true"] .ep-card-frame { animation: ep-glow-pulse 3.4s ease-in-out var(--ep-seq-delay, 0s) infinite; }
        @media (hover: hover) {
          .ep-card:hover .ep-img-primary, .ep-card:focus-visible .ep-img-primary { transform: scale(1.02); }
          .ep-card:hover .ep-reveal, .ep-card:focus-visible .ep-reveal { clip-path: inset(0 0 0 0); }
          .ep-card:hover .ep-grad, .ep-card:focus-visible .ep-grad { opacity: 1; }
          .ep-card:hover .ep-cta, .ep-card:focus-visible .ep-cta { opacity: 1; transform: translateY(0); }
          .ep-card:hover .ep-meta, .ep-card:focus-visible .ep-meta { transform: translateY(-4px); }
          .ep-card:hover .ep-card-frame, .ep-card:focus-visible .ep-card-frame {
            filter: brightness(1.015) drop-shadow(0 12px 22px rgba(91,24,48,0.18));
          }
          .ep-card:not(:hover):not(:focus-visible) .ep-card-frame { filter: none; }
          .ep-card:not(:hover):not(:focus-visible) .ep-reveal { clip-path: inset(100% 0 0 0); }
          .ep-card:not(:hover):not(:focus-visible) .ep-grad { opacity: 0; }
          .ep-card:not(:hover):not(:focus-visible) .ep-cta { opacity: 0; transform: translateY(10px); }
        }
        /* Sequência automática ao entrar na viewport (mobile/touch): sweep de luz vinho/rosé/cobre + glow pulsante, sem branco. */
        .ep-card[data-mobile-active="true"] .ep-card-frame {
          animation-duration: 3.4s;
        }
        .ep-card[data-mobile-active="true"] .ep-img-primary { transform: scale(1.015); }
        .ep-card[data-mobile-active="true"] .ep-reveal { clip-path: inset(0 0 0 0); }
        .ep-card[data-mobile-active="true"] .ep-grad { opacity: 1; }
        .ep-card[data-mobile-active="true"] .ep-cta { opacity: 1; transform: translateY(0); }
        .ep-card[data-mobile-active="true"] .ep-meta { transform: translateY(-4px); }
        @keyframes ep-glow-pulse {
          0%, 100% { box-shadow: 0 8px 22px -22px rgba(139,49,80,0.12); }
          50% { box-shadow: 0 14px 32px -20px rgba(139,49,80,0.24), 0 0 6px rgba(201,154,85,0.12); }
        }
        .ep-line { position: absolute; background: linear-gradient(90deg, rgba(139,49,80,0.7), rgba(201,154,85,0.75), rgba(212,154,167,0.7)); transition: transform 550ms cubic-bezier(0.22,1,0.36,1); }
        .ep-line-t { top: 8px; left: 8px; right: 8px; height: 1.5px; transform: scaleX(0); transform-origin: left; }
        .ep-line-b { bottom: 8px; left: 8px; right: 8px; height: 1.5px; transform: scaleX(0); transform-origin: right; }
        .ep-line-l { left: 8px; top: 8px; bottom: 8px; width: 1.5px; transform: scaleY(0); transform-origin: top; }
        .ep-line-r { right: 8px; top: 8px; bottom: 8px; width: 1.5px; transform: scaleY(0); transform-origin: bottom; }
        @media (hover: hover) {
          .ep-card:hover .ep-line-t, .ep-card:focus-visible .ep-line-t,
          .ep-card:hover .ep-line-b, .ep-card:focus-visible .ep-line-b { transform: scaleX(1); }
          .ep-card:hover .ep-line-l, .ep-card:focus-visible .ep-line-l,
          .ep-card:hover .ep-line-r, .ep-card:focus-visible .ep-line-r { transform: scaleY(1); }
        }
        .ep-card[data-mobile-active="true"] .ep-line-t,
        .ep-card[data-mobile-active="true"] .ep-line-b {
          transform: scaleX(1);
          transition-delay: var(--ep-seq-delay, 0s);
        }
        .ep-card[data-mobile-active="true"] .ep-line-l,
        .ep-card[data-mobile-active="true"] .ep-line-r {
          transform: scaleY(1);
          transition-delay: var(--ep-seq-delay, 0s);
        }
        @media (hover: none) {
          .ep-card:active { transform: scale(.985); }
          .ep-card { transition: transform 180ms ease; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ep-card .ep-img-primary, .ep-card .ep-reveal, .ep-card .ep-grad, .ep-card .ep-cta, .ep-card .ep-meta { transition: none !important; transform: none !important; }
          .ep-card .ep-line { display: none; }
          .ep-card[data-mobile-active="true"] .ep-card-frame, .ep-card[data-in-view="true"] .ep-card-frame { animation: none; }
        }
      `}</style>
    </Link>
  );
}
