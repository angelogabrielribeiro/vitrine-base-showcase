import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Hook único de animação "in-view" para toda a aplicação.
 * Mobile-first: dispara automaticamente quando o elemento entra na viewport,
 * sem depender de hover, clique ou long press.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(options?: {
  amount?: number;
  once?: boolean;
  rootMargin?: string;
}): { ref: RefObject<T | null>; inView: boolean } {
  const { amount = 0.25, once = false, rootMargin = "0px 0px -10% 0px" } = options ?? {};
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: amount, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount, once, rootMargin]);

  return { ref, inView };
}

/** Atraso sequencial (segundos) para listas animadas em cascata. */
export function sequenceDelay(index: number, step = 0.09, max = 0.72) {
  return Math.min(index * step, max);
}
