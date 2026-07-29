import { useRef, useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Cpu, Flame, Scissors, Sparkles } from "lucide-react";
import type { Product, StoreNiche } from "@/types/commerce";
import { brl } from "@/lib/format";
import { SafeImage } from "@/components/storefront/safe-image";
import { barberCategoryFallback } from "@/lib/barber-media";

const NICHE_BY_SLUG: Record<string, StoreNiche> = {
  moda: "fashion",
  barbearia: "barber",
  restaurante: "restaurant",
  eletronicos: "electronics",
};

const CARD_COPY: Record<
  StoreNiche,
  { code: string; cta: string; icon: typeof Sparkles; frame: string; meta: string; accent: string }
> = {
  fashion: {
    code: "MB atelier",
    cta: "Descobrir peça",
    icon: Sparkles,
    frame: "bg-[#e9e1d8] border-[#2a201d]/15",
    meta: "text-[#211c19]",
    accent: "text-[#8f5548]",
  },
  barber: {
    code: "BN grooming",
    cta: "Abrir ritual",
    icon: Scissors,
    frame: "bg-[#111114] border-[#d9b166]/20",
    meta: "text-[#f4efe5]",
    accent: "text-[#d9b166]",
  },
  restaurant: {
    code: "BU fire order",
    cta: "Abrir desejo",
    icon: Flame,
    frame: "bg-[#25130c] border-[#ff6b2c]/20",
    meta: "text-[#fff4e8]",
    accent: "text-[#ff7b3f]",
  },
  electronics: {
    code: "NC specimen",
    cta: "Ver sistema",
    icon: Cpu,
    frame: "bg-[#080c1c] border-cyan-200/15",
    meta: "text-white",
    accent: "text-cyan-200",
  },
};

export function ProductCard({ product, storeSlug }: { product: Product; storeSlug: string }) {
  const niche = NICHE_BY_SLUG[storeSlug] ?? "electronics";
  const copy = CARD_COPY[niche];
  const Icon = copy.icon;
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [transform, setTransform] = useState(
    "perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0px)",
  );

  const inStock =
    product.variants && product.variants.length
      ? product.variants.some((variant) => variant.stock > 0)
      : product.stock > 0;

  const canTilt =
    !reduceMotion &&
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!canTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setPointer({ x: x * 100, y: y * 100 });
    setTransform(
      `perspective(1100px) rotateX(${((0.5 - y) * 5).toFixed(2)}deg) rotateY(${((x - 0.5) * 5).toFixed(2)}deg) translate3d(0,-7px,0)`,
    );
  };

  const reset = () => {
    setHovered(false);
    setTransform("perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0px)");
  };

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  return (
    <Link
      ref={ref}
      to="/demo/$storeSlug/produto/$productSlug"
      params={{ storeSlug, productSlug: product.slug }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onFocus={() => setHovered(true)}
      onBlur={reset}
      className={`premium-product-card group relative block ${copy.meta}`}
      style={{ transform }}
    >
      <div
        className={`premium-product-frame relative aspect-[4/5] overflow-hidden border ${copy.frame}`}
      >
        <SafeImage
          src={primaryImage}
          fallbackSrc={niche === "barber" ? barberCategoryFallback(product.category) : undefined}
          alt={product.name}
          fallbackLabel={product.name}
          loading="lazy"
          className="premium-product-image absolute inset-0 h-full w-full object-cover"
        />

        {niche === "fashion" && secondaryImage && (
          <div className="premium-fashion-reveal pointer-events-none absolute inset-0 hidden md:block">
            <SafeImage src={secondaryImage} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background:
              niche === "electronics"
                ? `radial-gradient(300px circle at ${pointer.x}% ${pointer.y}%, rgba(103,232,249,.28), transparent 58%)`
                : niche === "restaurant"
                  ? `radial-gradient(300px circle at ${pointer.x}% ${pointer.y}%, rgba(255,100,43,.32), transparent 62%)`
                  : niche === "barber"
                    ? `radial-gradient(260px circle at ${pointer.x}% ${pointer.y}%, rgba(217,177,102,.28), transparent 62%)`
                    : `linear-gradient(to top, rgba(42,32,29,.5), transparent 52%)`,
            mixBlendMode: niche === "fashion" ? "normal" : "screen",
          }}
        />

        {niche === "electronics" && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(103,232,249,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,.12) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                maskImage: "linear-gradient(to bottom, black, transparent 68%)",
              }}
            />
            <motion.span
              aria-hidden="true"
              animate={reduceMotion || !hovered ? undefined : { y: ["-10%", "110%"] }}
              transition={{ duration: 1.7, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-0 shadow-[0_0_18px_rgba(103,232,249,.9)] group-hover:opacity-100"
            />
          </>
        )}

        {niche === "restaurant" && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#160a05] via-[#160a05]/30 to-transparent"
          />
        )}

        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
          <span
            className={`border border-current/20 bg-black/45 px-2.5 py-1.5 text-[7px] font-semibold uppercase tracking-[0.34em] text-white backdrop-blur-md`}
          >
            {copy.code}
          </span>
          <span
            className={`grid h-9 w-9 place-items-center border border-current/20 bg-black/40 backdrop-blur-md ${copy.accent}`}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-4 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <div className="flex items-end justify-between gap-3 text-white">
            <div>
              <div className="text-[7px] uppercase tracking-[0.34em] opacity-70">
                {product.category}
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                {copy.cta}
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 transition duration-500 group-hover:rotate-45" />
          </div>
        </div>

        {product.salePrice && inStock && (
          <span
            className={`absolute bottom-3 left-3 z-20 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.22em] ${
              niche === "electronics"
                ? "bg-cyan-300 text-[#050714]"
                : niche === "restaurant"
                  ? "bg-[#ff642b] text-[#190b06]"
                  : niche === "barber"
                    ? "bg-[#d9b166] text-[#111]"
                    : "bg-[#8f5548] text-white"
            }`}
          >
            Edição especial
          </span>
        )}
        {!inStock && (
          <span className="absolute bottom-3 left-3 z-20 bg-black/75 px-2.5 py-1.5 text-[8px] uppercase tracking-[0.22em] text-white backdrop-blur">
            Indisponível
          </span>
        )}

        <span className="premium-corner premium-corner-a" />
        <span className="premium-corner premium-corner-b" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`text-[7px] font-semibold uppercase tracking-[0.32em] ${copy.accent}`}>
            {product.category}
          </div>
          <h3 className="font-display mt-1 line-clamp-2 text-base leading-tight sm:text-lg">
            {product.name}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-semibold">
            {brl(product.salePrice ?? product.price)}
            {product.unit && <span className="text-[9px] opacity-50">/{product.unit}</span>}
          </div>
          {product.salePrice && (
            <div className="mt-0.5 text-[10px] opacity-45 line-through">{brl(product.price)}</div>
          )}
        </div>
      </div>

      <div
        className={`mt-3 h-px origin-left scale-x-0 transition duration-700 group-hover:scale-x-100 ${
          niche === "electronics"
            ? "bg-cyan-200"
            : niche === "restaurant"
              ? "bg-[#ff642b]"
              : niche === "barber"
                ? "bg-[#d9b166]"
                : "bg-[#8f5548]"
        }`}
      />

      <style>{`
        .premium-product-card {
          transform-style: preserve-3d;
          transition: transform 650ms cubic-bezier(.22,1,.36,1);
          will-change: transform;
        }
        .premium-product-card .premium-product-image {
          transform: scale(1);
          transition: transform 850ms cubic-bezier(.22,1,.36,1), filter 650ms ease;
        }
        .premium-product-card:hover .premium-product-image,
        .premium-product-card:focus-visible .premium-product-image {
          transform: scale(1.065);
          filter: saturate(1.08) contrast(1.04);
        }
        .premium-fashion-reveal {
          clip-path: inset(100% 0 0 0);
          transition: clip-path 750ms cubic-bezier(.22,1,.36,1);
        }
        .premium-product-card:hover .premium-fashion-reveal,
        .premium-product-card:focus-visible .premium-fashion-reveal {
          clip-path: inset(0 0 0 0);
        }
        .premium-corner {
          position: absolute;
          width: 22px;
          height: 22px;
          opacity: 0;
          transition: opacity 450ms ease, transform 650ms cubic-bezier(.22,1,.36,1);
          z-index: 20;
        }
        .premium-corner-a {
          left: 7px;
          top: 7px;
          border-left: 1px solid currentColor;
          border-top: 1px solid currentColor;
          transform: translate(8px,8px);
        }
        .premium-corner-b {
          right: 7px;
          bottom: 7px;
          border-right: 1px solid currentColor;
          border-bottom: 1px solid currentColor;
          transform: translate(-8px,-8px);
        }
        .premium-product-card:hover .premium-corner,
        .premium-product-card:focus-visible .premium-corner {
          opacity: .75;
          transform: translate(0,0);
        }
        .premium-product-card:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 5px;
        }
        @media (hover: none), (prefers-reduced-motion: reduce) {
          .premium-product-card { transform: none !important; transition: none !important; }
          .premium-product-card .premium-product-image { transform: none !important; transition: none !important; }
          .premium-fashion-reveal { display: none !important; }
        }
      `}</style>
    </Link>
  );
}
