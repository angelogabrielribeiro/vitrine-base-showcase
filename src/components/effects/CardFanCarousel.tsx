import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, type PanInfo, useReducedMotion } from "framer-motion";

export type CardFanItem = {
  src: string;
  alt: string;
  href?: string;
  label?: string;
  meta?: string;
};

export function CardFanCarousel({
  items,
  accent = "#fde68a",
  autoPlayMs = 4200,
}: {
  items: CardFanItem[];
  accent?: string;
  autoPlayMs?: number;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    if (reduce || interacting || items.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [autoPlayMs, interacting, items.length, reduce]);

  if (!items.length) return null;

  const cycle = (direction: -1 | 1) => {
    setActive((current) => (current + direction + items.length) % items.length);
  };

  const onDragEnd = (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    setInteracting(false);
    if (info.offset.x > 45 || info.velocity.x > 420) cycle(-1);
    if (info.offset.x < -45 || info.velocity.x < -420) cycle(1);
  };

  return (
    <div
      className="relative w-full overflow-hidden px-3 pb-4 pt-6"
      onPointerDown={() => setInteracting(true)}
      onPointerUp={() => setInteracting(false)}
      onPointerCancel={() => setInteracting(false)}
    >
      <div className="relative mx-auto h-[25rem] w-full max-w-md [perspective:1200px]">
        <div
          aria-hidden
          className="absolute inset-x-[18%] bottom-8 h-16 rounded-full blur-3xl"
          style={{ backgroundColor: `${accent}33` }}
        />

        {items.map((item, index) => {
          const rawOffset = index - active;
          const offset =
            Math.abs(rawOffset) > items.length / 2
              ? rawOffset > 0
                ? rawOffset - items.length
                : rawOffset + items.length
              : rawOffset;
          const distance = Math.abs(offset);
          if (distance > 3) return null;
          const isActive = offset === 0;

          const card = (
            <>
              <img
                src={item.src}
                alt={item.alt}
                loading={isActive ? "eager" : "lazy"}
                draggable={false}
                className="h-full w-full object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/10"
              />
              {(item.label || item.meta) && (
                <span className="absolute inset-x-0 bottom-0 z-10 p-4 text-left text-white">
                  {item.meta && (
                    <span className="block text-[8px] font-semibold uppercase tracking-[0.3em] text-white/60">
                      {item.meta}
                    </span>
                  )}
                  {item.label && (
                    <span className="mt-1 block font-display text-xl leading-tight">
                      {item.label}
                    </span>
                  )}
                </span>
              )}
              {isActive && !reduce && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[1.55rem] border"
                  style={{ borderColor: accent }}
                  animate={{
                    opacity: [0.35, 0.9, 0.35],
                    boxShadow: [`0 0 0 ${accent}00`, `0 0 28px ${accent}55`, `0 0 0 ${accent}00`],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}
            </>
          );

          return (
            <motion.article
              key={`${item.src}-${index}`}
              drag={isActive && !reduce ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
              onClick={() => {
                if (!isActive) setActive(index);
              }}
              initial={reduce ? false : { opacity: 0, y: 70, scale: 0.72 }}
              animate={{
                x: offset * 43,
                y: distance * 14,
                rotateZ: offset * 7,
                rotateY: offset * -4,
                scale: isActive ? 1 : Math.max(0.72, 0.91 - distance * 0.07),
                opacity: isActive ? 1 : Math.max(0.24, 0.7 - distance * 0.16),
              }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 245, damping: 27, mass: 0.75 }
              }
              whileTap={reduce ? undefined : { scale: isActive ? 0.98 : 0.86 }}
              style={{ zIndex: 20 - distance, touchAction: "pan-y" }}
              className="absolute left-1/2 top-2 aspect-[3/4] w-[64vw] max-w-[15.5rem] -translate-x-1/2 cursor-grab overflow-hidden rounded-[1.55rem] bg-neutral-900 shadow-[0_24px_80px_-30px_rgba(0,0,0,.9)] active:cursor-grabbing"
            >
              {item.href && isActive ? (
                <a
                  href={item.href}
                  className="block h-full w-full"
                  aria-label={item.label ?? item.alt}
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </motion.article>
          );
        })}
      </div>

      <div className="relative z-30 mt-1 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => cycle(-1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.07] text-white backdrop-blur-md transition active:scale-90"
          aria-label="Ver card anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {items.map((item, index) => (
            <button
              key={`${item.src}-dot-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Mostrar card ${index + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: active === index ? 24 : 8,
                backgroundColor: active === index ? accent : "rgba(255,255,255,.2)",
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => cycle(1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.07] text-white backdrop-blur-md transition active:scale-90"
          aria-label="Ver próximo card"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
