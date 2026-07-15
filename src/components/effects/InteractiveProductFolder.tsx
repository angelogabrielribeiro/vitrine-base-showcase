import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

export interface FolderItem {
  title: string;
  subtitle?: string;
  image: string;
}

/**
 * Pasta interativa: imagens empilhadas em leque que abre em galeria ao clicar/tocar.
 * Sem WebGL. Touch-safe (funciona por clique).
 */
export function InteractiveProductFolder({
  items,
  label = "Galeria",
}: {
  items: FolderItem[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const stack = items.slice(0, 5);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group relative block h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-amber-300/40"
        aria-expanded={open}
      >
        <div className="relative mx-auto h-40 w-full max-w-xs">
          {stack.map((it, i) => {
            const offset = i - (stack.length - 1) / 2;
            const rotate = open ? 0 : offset * 6;
            const translateX = open ? offset * 62 : offset * 10;
            const translateY = open ? 0 : Math.abs(offset) * 4;
            return (
              <motion.div
                key={it.title + i}
                initial={false}
                animate={reduce ? {} : { rotate, x: translateX, y: translateY }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="absolute left-1/2 top-0 h-40 w-28 -translate-x-1/2 overflow-hidden rounded-xl border border-white/15 shadow-xl"
                style={{ zIndex: 10 + i }}
              >
                <img src={it.image} alt={it.title} className="h-full w-full object-cover" loading="lazy" />
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-300">{label}</div>
            <div className="text-sm text-neutral-300">
              {open ? "Toque para fechar" : "Toque para explorar"}
            </div>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-300">
            {items.length}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3"
          >
            {items.map((it) => (
              <li key={it.title} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
                <div className="aspect-square w-full overflow-hidden">
                  <img src={it.image} alt={it.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-2 text-xs">
                  <div className="truncate font-medium">{it.title}</div>
                  {it.subtitle && <div className="truncate text-neutral-400">{it.subtitle}</div>}
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}