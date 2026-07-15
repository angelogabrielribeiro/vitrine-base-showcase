import { useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/** Tilt sutil no hover desktop. Desativa em touch e reduced motion. */
export function InteractiveTiltCard({
  children,
  className = "",
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tf, setTf] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)");
  const reduce = useReducedMotion();

  const enabled = !reduce && typeof window !== "undefined"
    && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const ry = x * max;
    const rx = -y * max;
    setTf(`perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`);
  };

  const reset = () =>
    setTf("perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)");

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      style={{
        transform: tf,
        transition: "transform 220ms ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}