import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type StoryKind = "network" | "hardware" | "finance" | "tax";

type Props = {
  kind: StoryKind;
  eyebrow: string;
  title: string;
  copy: string;
  accent: string;
};

export function StoryScene({ kind, eyebrow, title, copy, accent }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const shift = useTransform(scrollYProgress, [0, .5, 1], [42, 0, -34]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 6]);

  return (
    <section ref={ref} className={`story-scene story-${kind}`} style={{ "--accent": accent } as React.CSSProperties}>
      <div className="story-copy">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      <motion.div className="story-visual" style={{ y: shift, rotate }}>
        {kind === "network" && <NetworkVisual />}
        {kind === "hardware" && <HardwareVisual />}
        {kind === "finance" && <FinanceVisual />}
        {kind === "tax" && <TaxVisual />}
      </motion.div>
    </section>
  );
}

function NetworkVisual() {
  return <div className="network-visual">{Array.from({ length: 17 }).map((_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}<div className="network-core">diagnóstico</div></div>;
}

function HardwareVisual() {
  return <div className="hardware-stack"><div className="board board-a">entrada</div><div className="board board-b">processo</div><div className="board board-c">saída</div><div className="hardware-axis" /></div>;
}

function FinanceVisual() {
  return <div className="finance-flow">{[28, 61, 44, 82, 68, 91].map((h, i) => <span key={i} style={{ height: `${h}%`, "--i": i } as React.CSSProperties} />)}<div className="finance-line" /></div>;
}

function TaxVisual() {
  return <div className="tax-grid">{Array.from({ length: 12 }).map((_, i) => <div key={i} className={i > 6 ? "resolved" : ""}><small>{String(i + 1).padStart(2, "0")}</small><strong>{i > 6 ? "OK" : "…"}</strong></div>)}</div>;
}
