import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Flame, Gauge, Hand } from "lucide-react";
import { useRef, useState } from "react";
import type { Product, StoreConfig } from "@/types/commerce";
import { brl } from "@/lib/format";
import {
  CursorParallax,
  useCinematicMotion,
} from "@/components/motion/cinematic-motion-system";

export function RestaurantFireDeck({
  store,
  products,
}: {
  store: StoreConfig;
  products: Product[];
}) {
  const items = products.filter((product) => product.active).slice(0, 3);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { capabilities } = useCinematicMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const stageScale = useTransform(
    scrollYProgress,
    [0, 0.48, 1],
    [0.9, 1, 1.04],
  );
  const heat = useTransform(scrollYProgress, [0, 0.5, 1], [0.16, 0.48, 0.3]);
  const isCompact =
    capabilities.hydrated &&
    (capabilities.coarsePointer || capabilities.quality === "economy");

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      items.length - 1,
      Math.max(0, Math.floor(value * items.length)),
    );
    setActive((current) => (current === next ? current : next));
  });

  if (!items.length) return null;

  if (reduced || isCompact) {
    return (
      <section
        data-testid="restaurant-fire-deck"
        className="overflow-hidden border-y border-orange-300/15 bg-[#140804] px-5 py-16 text-white"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-orange-300">
          Fogo sob comando
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-5xl uppercase leading-[0.88]">
          Três desejos. Nenhum espaço morto.
        </h2>
        <div className="-mx-5 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5 [scrollbar-width:none]">
          {items.map((product, index) => (
            <CompactFoodCard
              key={product.id}
              product={product}
              storeSlug={store.slug}
              index={index}
            />
          ))}
        </div>
      </section>
    );
  }

  const current = items[active] ?? items[0];

  return (
    <section
      ref={sectionRef}
      data-testid="restaurant-fire-deck"
      className="relative h-[158svh] border-y border-orange-300/15 bg-[#120603] text-white"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_65%_58%,rgba(255,91,31,.55),transparent_28%),radial-gradient(circle_at_25%_85%,rgba(255,184,55,.22),transparent_25%)]"
          style={{ opacity: heat }}
        />
        <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:58px_58px]" />
        <FireField />

        <div className="relative mx-auto grid h-full max-w-[94rem] items-center gap-10 px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-12">
          <div className="relative z-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-orange-300">
              <Flame className="mr-2 inline h-4 w-4" /> Câmara de desejo · 0
              {active + 1}
            </p>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: -22, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.46 }}
            >
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(3.2rem,5.2vw,5.5rem)] uppercase leading-[0.84] tracking-[-0.05em]">
                {current.name}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-orange-50/72">
                {current.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <strong className="text-3xl text-orange-200">
                  {brl(current.salePrice ?? current.price)}
                </strong>
                <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.26em] text-orange-200/60">
                  <Gauge className="h-4 w-4" /> calor {38 + active * 19}%
                </span>
              </div>
              <Link
                to="/demo/$storeSlug/produto/$productSlug"
                params={{ storeSlug: store.slug, productSlug: current.slug }}
                className="mt-6 inline-flex min-h-13 items-center gap-3 border border-orange-300/35 bg-orange-500 px-6 text-[10px] font-bold uppercase tracking-[0.24em] text-[#160703] transition hover:bg-orange-300"
              >
                Abrir pedido <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <div className="mt-7 flex items-center gap-3">
              {items.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    const top = sectionRef.current?.offsetTop ?? 0;
                    const travel =
                      (sectionRef.current?.offsetHeight ?? 0) -
                      window.innerHeight;
                    window.scrollTo({
                      top: top + travel * ((index + 0.15) / items.length),
                      behavior: "smooth",
                    });
                  }}
                  aria-label={`Mostrar ${product.name}`}
                  aria-pressed={index === active}
                  className={`h-1.5 transition-all ${index === active ? "w-16 bg-orange-300" : "w-7 bg-white/20"}`}
                />
              ))}
              <span className="ml-2 inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.24em] text-white/35">
                <Hand className="h-3.5 w-3.5" /> role para atiçar
              </span>
            </div>
          </div>

          <CursorParallax
            className="relative z-10 h-[68vh] min-h-[32rem]"
            strengthX={16}
            strengthY={10}
          >
            <motion.div
              className="absolute inset-0"
              style={{ scale: stageScale, transformStyle: "preserve-3d" }}
            >
              {items.map((product, index) => {
                const offset = index - active;
                return (
                  <motion.article
                    key={product.id}
                    animate={{
                      x: offset * 118,
                      y: Math.abs(offset) * 34,
                      rotateY: offset * -13,
                      rotateZ: offset * 3.2,
                      scale: index === active ? 1 : 0.82,
                      opacity:
                        Math.abs(offset) > 1
                          ? 0.34
                          : index === active
                            ? 1
                            : 0.68,
                      filter:
                        index === active ? "brightness(1)" : "brightness(.55)",
                    }}
                    transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-[5%_13%] overflow-hidden border border-orange-200/20 bg-black shadow-[0_50px_130px_rgba(0,0,0,.72)]"
                    style={{
                      zIndex: 20 - Math.abs(offset),
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120603] via-transparent to-orange-200/[0.06]" />
                    <div className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 transition-opacity duration-500 ${index === active ? "opacity-100" : "opacity-15"}`}>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-orange-300">
                          Brasa 0{index + 1}
                        </p>
                        <p className="mt-2 font-display text-3xl uppercase">
                          {product.name}
                        </p>
                      </div>
                      <strong className="text-lg text-orange-100">
                        {brl(product.salePrice ?? product.price)}
                      </strong>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </CursorParallax>
        </div>
      </div>
    </section>
  );
}

function CompactFoodCard({
  product,
  storeSlug,
  index,
}: {
  product: Product;
  storeSlug: string;
  index: number;
}) {
  return (
    <Link
      to="/demo/$storeSlug/produto/$productSlug"
      params={{ storeSlug, productSlug: product.slug }}
      className="relative w-[84vw] max-w-sm shrink-0 snap-center overflow-hidden border border-orange-300/20 bg-[#241008]"
    >
      <img
        src={product.images[0]}
        alt=""
        className="aspect-[4/5] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-orange-300">
          Fogo 0{index + 1}
        </p>
        <h3 className="mt-2 font-display text-3xl uppercase">{product.name}</h3>
        <p className="mt-2 text-lg font-bold text-orange-100">
          {brl(product.salePrice ?? product.price)}
        </p>
      </div>
    </Link>
  );
}

function FireField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-44 overflow-hidden opacity-70"
    >
      {Array.from({ length: 12 }).map((_, index) => (
        <span
          key={index}
          className="fire-tongue absolute bottom-[-45%] rounded-[50%_50%_30%_30%] bg-gradient-to-t from-red-600 via-orange-400 to-yellow-200 blur-[2px]"
          style={{
            left: `${index * 9 - 3}%`,
            width: `${55 + (index % 4) * 12}px`,
            height: `${110 + (index % 5) * 18}px`,
            animationDelay: `${index * -0.17}s`,
          }}
        />
      ))}
      <style>{`
        .fire-tongue { animation: fire-dance 1.35s ease-in-out infinite alternate; transform-origin: 50% 100%; mix-blend-mode: screen; }
        @keyframes fire-dance { from { transform: translateY(18px) scaleX(.72) rotate(-5deg); opacity: .35; } to { transform: translateY(-25px) scaleX(1.08) rotate(7deg); opacity: .9; } }
        @media (prefers-reduced-motion: reduce) { .fire-tongue { animation: none; } }
      `}</style>
    </div>
  );
}
