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

/**
 * Qualidade adaptativa das cenas 3D/WebGL.
 * No mobile o 3D CONTINUA ativo, apenas com DPR e geometria reduzidos.
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
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const webgl = detectWebgl();
      const tier: QualityTier = !webgl || reduceMotion ? "off" : isMobile ? "low" : "high";
      const dpr = tier === "high" ? Math.min(window.devicePixelRatio || 1, 2) : 1.4;
      setState({ tier, dpr, isMobile, reduceMotion, webgl });
    };
    compute();
    const mq = window.matchMedia("(max-width: 767px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", compute);
    rm.addEventListener("change", compute);
    return () => {
      mq.removeEventListener("change", compute);
      rm.removeEventListener("change", compute);
    };
  }, []);

  return state;
}
