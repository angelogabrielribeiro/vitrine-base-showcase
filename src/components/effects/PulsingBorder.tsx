import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Contorno pulsante sutil. Use apenas em destaques. */
export function PulsingBorder({
  children,
  color = "rgba(251,191,36,0.6)",
  radius = "1rem",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  radius?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative ${className}`} style={{ borderRadius: radius }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[2px]"
        style={{
          borderRadius: `calc(${radius} + 2px)`,
          boxShadow: `0 0 0 1px ${color}, 0 0 24px ${color}`,
          animation: reduce ? undefined : "vb-pulse 2.6s ease-in-out infinite",
          opacity: 0.9,
        }}
      />
      <div className="relative" style={{ borderRadius: radius }}>
        {children}
      </div>
      <style>{`
        @keyframes vb-pulse {
          0%,100% { opacity: .55; transform: scale(1); }
          50%     { opacity: 1; transform: scale(1.01); }
        }
      `}</style>
    </div>
  );
}