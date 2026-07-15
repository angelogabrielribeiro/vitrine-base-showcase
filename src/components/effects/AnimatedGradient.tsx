import { useReducedMotion } from "framer-motion";

/**
 * Fundo com gradiente orgânico animado usando apenas CSS.
 * Sem WebGL/Canvas. Respeita reduced motion.
 */
export function AnimatedGradient({
  className = "",
  colors = ["#f59e0b", "#7c3aed", "#0ea5e9"],
  intensity = 0.35,
}: {
  className?: string;
  colors?: [string, string, string] | string[];
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  const [c1, c2, c3] = colors;
  const alpha = Math.max(0, Math.min(1, intensity));
  const style: React.CSSProperties = {
    background: `
      radial-gradient(60% 60% at 15% 20%, ${withAlpha(c1, alpha)} 0%, transparent 60%),
      radial-gradient(55% 55% at 85% 30%, ${withAlpha(c2, alpha)} 0%, transparent 60%),
      radial-gradient(65% 65% at 50% 90%, ${withAlpha(c3, alpha)} 0%, transparent 60%)
    `,
    animation: reduce ? undefined : "vb-drift 18s ease-in-out infinite alternate",
    willChange: "transform, opacity",
  };
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`} style={style}>
      <style>{`
        @keyframes vb-drift {
          0%   { transform: translate3d(0,0,0) scale(1); opacity: .85; }
          50%  { transform: translate3d(-2%, 2%, 0) scale(1.05); opacity: 1; }
          100% { transform: translate3d(2%, -1%, 0) scale(1.02); opacity: .9; }
        }
      `}</style>
    </div>
  );
}

function withAlpha(hex: string, a: number): string {
  if (hex.startsWith("rgb")) return hex;
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}