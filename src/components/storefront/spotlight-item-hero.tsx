import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, Sparkles, Clock } from "lucide-react";
import type { Product, Service, StoreConfig } from "@/types/commerce";
import { brl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { PulsingBorder } from "@/components/effects/PulsingBorder";

type SpotlightItem =
  | { kind: "product"; product: Product }
  | { kind: "service"; service: Service; image: string };

interface Props {
  store: StoreConfig;
  item: SpotlightItem;
}

/**
 * Palco premium com item destacado.
 * - Parallax leve seguindo o cursor no desktop (rAF).
 * - Partículas em DOM/CSS.
 * - Mobile: composição estática.
 * - Reduced motion: totalmente estático.
 */
export function SpotlightItemHero({ store, item }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqDesktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const update = () => setEnabled(!mqReduce.matches && mqDesktop.matches);
    update();
    mqReduce.addEventListener?.("change", update);
    mqDesktop.addEventListener?.("change", update);
    return () => {
      mqReduce.removeEventListener?.("change", update);
      mqDesktop.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const stage = stageRef.current;
    const img = imageRef.current;
    if (!stage || !img) return;

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      target.current.x = Math.max(-1, Math.min(1, nx));
      target.current.y = Math.max(-1, Math.min(1, ny));
    };
    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      const rx = current.current.y * -6;
      const ry = current.current.x * 8;
      const tx = current.current.x * 10;
      const ty = current.current.y * 8;
      img.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      rafRef.current = requestAnimationFrame(loop);
    };

    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      img.style.transform = "";
    };
  }, [enabled]);

  const title = item.kind === "product" ? item.product.name : item.service.name;
  const description =
    item.kind === "product" ? item.product.description : item.service.description;
  const price = item.kind === "product" ? item.product.salePrice ?? item.product.price : item.service.price;
  const image =
    item.kind === "product"
      ? item.product.images[0]
      : item.service.image ?? "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80";

  const cta =
    item.kind === "product" ? (
      <Button asChild size="lg" className="mt-6">
        <Link
          to="/demo/$storeSlug/produto/$productSlug"
          params={{ storeSlug: store.slug, productSlug: item.product.slug }}
        >
          Ver detalhes <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    ) : (
      <Button asChild size="lg" className="mt-6">
        <Link to="/demo/$storeSlug/agendar" params={{ storeSlug: store.slug }}>
          <CalendarDays className="mr-2 h-4 w-4" /> Agendar agora
        </Link>
      </Button>
    );

  return (
    <section
      ref={stageRef}
      aria-label="Destaque"
      className="relative isolate overflow-hidden border-b border-border/60 bg-background"
    >
      {/* fundo com brilho */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 55%), radial-gradient(ellipse at 80% 90%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
        }}
      />
      {/* partículas leves */}
      <Particles />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-14 sm:py-20 md:grid-cols-2">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3 w-3" /> Destaque
          </div>
          <h2 className="font-display mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
            {truncate(description, 180)}
          </p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{brl(price)}</span>
            {item.kind === "service" && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {item.service.durationMinutes} min
              </span>
            )}
          </div>
          {cta}
        </div>

        <div
          className="relative mx-auto grid aspect-square w-full max-w-md place-items-center [perspective:1000px]"
          style={{ contain: "layout paint" }}
        >
          <PulsingBorder className="h-full w-full rounded-[calc(var(--radius)*3)]">
            <div
              ref={imageRef}
              className="h-full w-full will-change-transform [transform-style:preserve-3d]"
              style={{ transition: enabled ? "none" : "transform 0.4s ease" }}
            >
              <img
                src={image}
                alt={title}
                width={640}
                height={640}
                loading="eager"
                decoding="async"
                className="h-full w-full rounded-[calc(var(--radius)*3)] object-cover shadow-2xl"
                style={{ aspectRatio: "1 / 1" }}
              />
            </div>
          </PulsingBorder>
        </div>
      </div>
    </section>
  );
}

function truncate(s: string, n: number) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

function Particles() {
  // 14 pontos decorativos animados via CSS
  const dots = Array.from({ length: 14 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const size = 3 + ((i * 7) % 6);
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const dur = 6 + (i % 5);
        const delay = -(i * 0.7);
        return (
          <span
            key={i}
            className="spot-dot absolute rounded-full bg-primary/40"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes spot-float {
          0%,100% { transform: translateY(0px); opacity: 0.35; }
          50% { transform: translateY(-14px); opacity: 0.9; }
        }
        .spot-dot { animation-name: spot-float; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .spot-dot { animation: none !important; }
        }
      `}</style>
    </div>
  );
}