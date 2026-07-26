import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { Product } from "@/types/commerce";
import { brl } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/storefront/safe-image";
import { barberCategoryFallback } from "@/lib/barber-media";

export function ProductCard({ product, storeSlug }: { product: Product; storeSlug: string }) {
  const inStock =
    product.variants && product.variants.length
      ? product.variants.some((v) => v.stock > 0)
      : product.stock > 0;

  if (storeSlug === "moda") {
    return <FashionProductCard product={product} storeSlug={storeSlug} inStock={inStock} />;
  }

  if (storeSlug === "barbearia") {
    return <BarberProductCard product={product} storeSlug={storeSlug} inStock={inStock} />;
  }

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

/* -------------------------------------------------------------------------- */
/* Barber Noir — card premium com tilt local, spotlight dourado e borda anim. */
/* -------------------------------------------------------------------------- */
function BarberProductCard({
  product,
  storeSlug,
  inStock,
}: {
  product: Product;
  storeSlug: string;
  inStock: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [tf, setTf] = useState("perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)");
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const fallback = barberCategoryFallback(product.category);

  const canTilt =
    !reduce &&
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!canTilt) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    const rx = -(ny - 0.5) * 3; // ±1.5deg
    const ry = (nx - 0.5) * 3;
    setTf(
      `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-5px)`,
    );
    setPos({ x: nx * 100, y: ny * 100 });
  };

  const onEnter = () => setHover(true);
  const onLeave = () => {
    setHover(false);
    setTf("perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)");
  };

  return (
    <Link
      ref={ref}
      to="/demo/$storeSlug/produto/$productSlug"
      params={{ storeSlug, productSlug: product.slug }}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="bpc-card group relative block outline-none"
      style={{
        transform: tf,
        transition: "transform 520ms cubic-bezier(0.22,1,0.36,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-neutral-800 bg-neutral-900">
        <SafeImage
          src={product.images[0]}
          fallbackSrc={fallback}
          alt={product.name}
          fallbackLabel={product.name}
          loading="lazy"
          className="bpc-img absolute inset-0 h-full w-full object-cover"
        />

        {/* Spotlight dourado seguindo o cursor */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background: `radial-gradient(220px circle at ${pos.x}% ${pos.y}%, rgba(217,177,102,0.28), transparent 60%)`,
            mixBlendMode: "screen",
          }}
        />

        {/* Gradiente inferior para legibilidade e categoria */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,12,0.85), rgba(10,10,12,0.35) 55%, transparent)",
          }}
        />

        {/* Borda dourada fina animada */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(217,177,102,0.55)",
          }}
        />

        {/* Categoria + CTA revelados sobre a foto */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-3 opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <span className="text-[9px] uppercase tracking-[0.35em] text-amber-200/90">
            {product.category}
          </span>
          <span className="bpc-cta inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-white">
            Ver detalhes
            <ArrowRight className="bpc-arrow h-3 w-3" />
          </span>
        </div>

        {product.salePrice && inStock && (
          <span className="absolute left-2 top-2 z-10 bg-amber-300 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-950">
            Oferta
          </span>
        )}
        {!inStock && (
          <span className="absolute left-2 top-2 z-10 bg-neutral-950/80 px-2 py-1 text-[10px] uppercase tracking-widest text-amber-200">
            Esgotado
          </span>
        )}
      </div>

      {/* Meta sempre legível — nome e preço não dependem de hover */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-100">{product.name}</h3>
        <div className="text-right">
          {product.salePrice ? (
            <>
              <div className="font-display text-sm text-amber-200">{brl(product.salePrice)}</div>
              <div className="text-[11px] text-neutral-500 line-through">{brl(product.price)}</div>
            </>
          ) : (
            <div className="font-display text-sm text-amber-200">{brl(product.price)}</div>
          )}
          {product.unit && <div className="text-[10px] text-neutral-500">/{product.unit}</div>}
        </div>
      </div>

      {!inStock && (
        <Badge variant="secondary" className="mt-2 rounded-none bg-neutral-800 text-neutral-300">
          Esgotado
        </Badge>
      )}

      <style>{`
        .bpc-card .bpc-img { transform: scale(1); transition: transform 520ms cubic-bezier(0.22,1,0.36,1); }
        .bpc-card:hover .bpc-img, .bpc-card:focus-visible .bpc-img { transform: scale(1.035); }
        .bpc-card .bpc-arrow { transition: transform 480ms cubic-bezier(0.22,1,0.36,1); }
        .bpc-card:hover .bpc-arrow, .bpc-card:focus-visible .bpc-arrow { transform: translateX(3px); }
        .bpc-card:focus-visible { outline: 2px solid rgba(217,177,102,0.7); outline-offset: 4px; }
        @media (prefers-reduced-motion: reduce) {
          .bpc-card { transform: none !important; transition: none !important; }
          .bpc-card .bpc-img { transform: none !important; transition: none !important; }
          .bpc-card .bpc-arrow { transition: none !important; transform: none !important; }
        }
        @media (hover: none) {
          .bpc-card { transform: none !important; }
        }
      `}</style>
    </Link>
  );
}

/**
 * Variante compacta editorial usada nas listagens/categorias da Maison Belle.
 * Reveal vertical da 2ª imagem, gradiente inferior, contorno fino e CTA "Ver peça".
 */
function FashionProductCard({
  product,
  storeSlug,
  inStock,
}: {
  product: Product;
  storeSlug: string;
  inStock: boolean;
}) {
  const primary = product.images[0];
  const secondary = product.images[1];
  return (
    <Link
      to="/demo/$storeSlug/produto/$productSlug"
      params={{ storeSlug, productSlug: product.slug }}
      className="epc-card group relative block focus:outline-none focus-visible:outline-none focus-visible:[&_.epc-frame]:ring-2 focus-visible:[&_.epc-frame]:ring-neutral-900 focus-visible:[&_.epc-frame]:ring-offset-2 focus-visible:[&_.epc-frame]:ring-offset-neutral-50"
    >
      <div className="epc-frame relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <img
          src={primary}
          alt={product.name}
          loading="lazy"
          className="epc-primary absolute inset-0 h-full w-full object-cover"
        />
        {secondary && (
          <div aria-hidden className="epc-reveal pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
            <img src={secondary} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        )}
        <span
          aria-hidden
          className="epc-grad pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/2 opacity-0 md:block"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 55%, transparent)",
          }}
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
          <span className="epc-line epc-line-t" />
          <span className="epc-line epc-line-r" />
          <span className="epc-line epc-line-b" />
          <span className="epc-line epc-line-l" />
        </span>
        <span
          aria-hidden
          className="epc-cta pointer-events-none absolute inset-x-0 bottom-3 z-10 hidden items-center justify-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white opacity-0 md:flex"
        >
          Ver peça
          <ArrowRight className="h-3 w-3" />
        </span>
        {product.salePrice && inStock && (
          <span className="absolute left-2 top-2 z-10 bg-amber-200 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-900">
            Oferta
          </span>
        )}
        {!inStock && (
          <span className="absolute left-2 top-2 z-10 bg-neutral-900/80 px-2 py-1 text-[10px] uppercase tracking-widest text-white">
            Esgotado
          </span>
        )}
      </div>
      <div className="epc-meta mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display truncate text-sm leading-tight text-neutral-900">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            {product.category}
          </p>
        </div>
        <div className="text-right">
          {product.salePrice ? (
            <>
              <div className="text-sm font-semibold text-neutral-900">{brl(product.salePrice)}</div>
              <div className="text-[11px] text-neutral-400 line-through">{brl(product.price)}</div>
            </>
          ) : (
            <div className="text-sm font-semibold text-neutral-900">{brl(product.price)}</div>
          )}
          {product.unit && (
            <div className="text-[10px] text-neutral-500">/{product.unit}</div>
          )}
        </div>
      </div>
      <style>{`
        .epc-card .epc-reveal { clip-path: inset(100% 0 0 0); transition: clip-path 550ms cubic-bezier(0.22,1,0.36,1); }
        .epc-card .epc-primary { transform: scale(1); transition: transform 550ms cubic-bezier(0.22,1,0.36,1); }
        .epc-card .epc-grad { transition: opacity 500ms ease; }
        .epc-card .epc-cta { transform: translateY(10px); transition: opacity 500ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1); }
        .epc-card .epc-meta { transition: transform 500ms cubic-bezier(0.22,1,0.36,1); }
        @media (hover: hover) {
          .epc-card:hover .epc-primary, .epc-card:focus-visible .epc-primary { transform: scale(1.025); }
          .epc-card:hover .epc-reveal, .epc-card:focus-visible .epc-reveal { clip-path: inset(0 0 0 0); }
          .epc-card:hover .epc-grad, .epc-card:focus-visible .epc-grad { opacity: 1; }
          .epc-card:hover .epc-cta, .epc-card:focus-visible .epc-cta { opacity: 1; transform: translateY(0); }
          .epc-card:hover .epc-meta, .epc-card:focus-visible .epc-meta { transform: translateY(-3px); }
        }
        .epc-line { position: absolute; background: rgba(255,255,255,0.85); transition: transform 550ms cubic-bezier(0.22,1,0.36,1); }
        .epc-line-t { top: 6px; left: 6px; right: 6px; height: 1px; transform: scaleX(0); transform-origin: left; }
        .epc-line-b { bottom: 6px; left: 6px; right: 6px; height: 1px; transform: scaleX(0); transform-origin: right; }
        .epc-line-l { left: 6px; top: 6px; bottom: 6px; width: 1px; transform: scaleY(0); transform-origin: top; }
        .epc-line-r { right: 6px; top: 6px; bottom: 6px; width: 1px; transform: scaleY(0); transform-origin: bottom; }
        @media (hover: hover) {
          .epc-card:hover .epc-line-t, .epc-card:focus-visible .epc-line-t,
          .epc-card:hover .epc-line-b, .epc-card:focus-visible .epc-line-b { transform: scaleX(1); }
          .epc-card:hover .epc-line-l, .epc-card:focus-visible .epc-line-l,
          .epc-card:hover .epc-line-r, .epc-card:focus-visible .epc-line-r { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .epc-card .epc-primary, .epc-card .epc-reveal, .epc-card .epc-grad, .epc-card .epc-cta, .epc-card .epc-meta { transition: none !important; transform: none !important; }
          .epc-card .epc-line { display: none; }
        }
      `}</style>
    </Link>
  );
}
