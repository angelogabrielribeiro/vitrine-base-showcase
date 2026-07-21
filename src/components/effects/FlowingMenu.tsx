import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

export type FlowingItem = {
  label: string;
  images: string[]; // 2–4 imagens que compõem a faixa animada
  storeSlug: string;
  categorySlug: string;
};

/**
 * FlowingMenu — linhas editoriais grandes. Ao hover/foco entra pela borda
 * mais próxima uma faixa com nome + imagens repetidos. No touch, o primeiro
 * toque revela; o CTA "Ver categoria" navega. Usa TanStack Link.
 */
export function FlowingMenu({ items }: { items: FlowingItem[] }) {
  return (
    <nav className="fm-root divide-y divide-white/10 border-y border-white/10">
      {items.map((it) => (
        <FlowingRow key={it.categorySlug} item={it} />
      ))}
    </nav>
  );
}

function FlowingRow({ item }: { item: FlowingItem }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false); // touch fallback

  useEffect(() => {
    const row = rowRef.current;
    const marquee = marqueeRef.current;
    if (!row || !marquee) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.set(marquee, { yPercent: 100, autoAlpha: 1 });
      let ioActive = true;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) ioActive = e.isIntersecting;
        },
        { threshold: 0.05 },
      );
      io.observe(row);

      const enterFrom = (e: PointerEvent | FocusEvent) => {
        if (!ioActive) return;
        const rect = row.getBoundingClientRect();
        let fromTop = true;
        if ("clientY" in e && typeof (e as PointerEvent).clientY === "number") {
          const y = (e as PointerEvent).clientY - rect.top;
          fromTop = y < rect.height / 2;
        }
        gsap.fromTo(
          marquee,
          { yPercent: fromTop ? -100 : 100 },
          { yPercent: 0, duration: reduce ? 0 : 0.55, ease: "power3.out", overwrite: true },
        );
      };
      const leaveTo = (e: PointerEvent | FocusEvent) => {
        const rect = row.getBoundingClientRect();
        let toTop = true;
        if ("clientY" in e && typeof (e as PointerEvent).clientY === "number") {
          const y = (e as PointerEvent).clientY - rect.top;
          toTop = y < rect.height / 2;
        }
        gsap.to(marquee, {
          yPercent: toTop ? -100 : 100,
          duration: reduce ? 0 : 0.45,
          ease: "power3.in",
          overwrite: true,
        });
      };

      row.addEventListener("pointerenter", enterFrom as EventListener);
      row.addEventListener("pointerleave", leaveTo as EventListener);
      row.addEventListener("focusin", enterFrom as EventListener);
      row.addEventListener("focusout", leaveTo as EventListener);
      return () => {
        row.removeEventListener("pointerenter", enterFrom as EventListener);
        row.removeEventListener("pointerleave", leaveTo as EventListener);
        row.removeEventListener("focusin", enterFrom as EventListener);
        row.removeEventListener("focusout", leaveTo as EventListener);
        io.disconnect();
      };
    }, row);
    return () => ctx.revert();
  }, []);

  const strip = Array.from({ length: 4 }).flatMap((_, k) =>
    item.images.map((img, i) => ({ key: `${k}-${i}`, img })),
  );

  return (
    <div
      ref={rowRef}
      className="fm-row group relative overflow-hidden bg-transparent"
      onClick={() => setRevealed(true)}
    >
      <Link
        to="/demo/$storeSlug/categoria/$categorySlug"
        params={{ storeSlug: item.storeSlug, categorySlug: item.categorySlug }}
        className="fm-link relative z-10 flex items-center justify-between gap-6 px-6 py-6 text-white sm:px-10 sm:py-10"
      >
        <span className="font-display text-4xl leading-none tracking-tight sm:text-6xl md:text-7xl">
          {item.label}
        </span>
        <span className="hidden text-[10px] uppercase tracking-[0.4em] text-white/60 sm:inline">
          Ver categoria →
        </span>
      </Link>
      <div
        ref={marqueeRef}
        aria-hidden
        className={
          "fm-marquee pointer-events-none absolute inset-0 z-20 flex items-center overflow-hidden bg-amber-200 text-neutral-900 " +
          (revealed ? "sm:opacity-100" : "")
        }
      >
        <div className="fm-track flex min-w-max animate-[fm-scroll_18s_linear_infinite] items-center gap-8 px-6">
          {strip.map((s) => (
            <span key={s.key} className="flex items-center gap-8">
              <span className="font-display text-4xl italic sm:text-6xl md:text-7xl">
                {item.label}
              </span>
              <img
                src={s.img}
                alt=""
                className="h-16 w-24 flex-none rounded-sm object-cover sm:h-20 sm:w-32"
                loading="lazy"
              />
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fm-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .fm-row .fm-link:focus-visible { outline: 2px solid #fde68a; outline-offset: -6px; }
      `}</style>
    </div>
  );
}
