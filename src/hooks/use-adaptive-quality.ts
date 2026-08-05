import { useEffect, useState } from "react";

export type QualityTier = "off" | "low" | "high";

export interface AdaptiveQuality {
  /** "off" apenas sem WebGL real ou prefers-reduced-motion */
  tier: QualityTier;
  /** devicePixelRatio limitado por tier */
  dpr: number;
  isMobile: boolean;
  reduceMotion: boolean;
  webgl: boolean;
}

function detectWebgl() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

function detectHandheld() {
  if (typeof window === "undefined") return false;

  const narrowViewport = window.matchMedia("(max-width: 767px)").matches;
  const coarsePointer = window.matchMedia("(any-pointer: coarse)").matches;
  const touchDevice = navigator.maxTouchPoints > 1;
  const shortScreenEdge = Math.min(window.screen.width, window.screen.height);
  const compactTouchScreen = touchDevice && shortScreenEdge <= 900;
  const userAgentMobile = Boolean(
    (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile,
  );

  return narrowViewport || userAgentMobile || (coarsePointer && compactTouchScreen);
}

/**
 * Qualidade adaptativa das cenas 3D/WebGL.
 * Celulares continuam no tier reduzido mesmo quando o navegador solicita a
 * versão desktop, evitando múltiplos canvases pesados e falhas de renderização.
 */
export function useAdaptiveQuality(): AdaptiveQuality {
  const [state, setState] = useState<AdaptiveQuality>({
    tier: "low",
    dpr: 1,
    isMobile: false,
    reduceMotion: false,
    webgl: true,
  });

  useEffect(() => {
    const compute = () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = detectHandheld();
      const webgl = detectWebgl();
      const tier: QualityTier = !webgl || reduceMotion ? "off" : isMobile ? "low" : "high";
      const dpr = tier === "high" ? Math.min(window.devicePixelRatio || 1, 1.8) : 1.2;
      setState({ tier, dpr, isMobile, reduceMotion, webgl });
    };

    compute();
    const viewport = window.matchMedia("(max-width: 767px)");
    const pointer = window.matchMedia("(any-pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    viewport.addEventListener("change", compute);
    pointer.addEventListener("change", compute);
    reducedMotion.addEventListener("change", compute);
    window.addEventListener("resize", compute, { passive: true });

    return () => {
      viewport.removeEventListener("change", compute);
      pointer.removeEventListener("change", compute);
      reducedMotion.removeEventListener("change", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return state;
}
