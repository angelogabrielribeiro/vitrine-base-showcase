import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MousePointer2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { NicheHeroProps } from "./niche-hero";
import { brl } from "@/lib/format";

const wrap = (value: number, total: number) => (value + total) % total;

export function FashionHero({ store, spotlight, featured }: NicheHeroProps) {
  const reduceMotion = useReducedMotion();
  const fallbackImage = store.banners[0]?.image ?? "";
  const looks = useMemo(() => {
    const candidates = featured.slice(0, 5).map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? fallbackImage,
      price: product.salePrice ?? product.price,
      category: product.category,
    }));

    if (candidates.length) return candidates;
    return [
      {
        id: "collection",
        slug: "",
        name: store.banners[0]?.title ?? store.name,
        image: fallbackImage,
        price: 0,
        category: "coleção",
      },
    ];
  }, [fallbackImage, featured, store]);

  const [active, setActive] = useState(0);
  const selected = looks[active];
  const step = (direction: number) =>
    setActive((current) => wrap(current + direction, looks.length));

  return (
    <section
      data-testid="fashion-hero"
      className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#25131d] text-[#f7eee8]"
      aria-label="Provador interativo Maison Belle"
    >
      <motion.img
        key={selected.image}
        src={selected.image}
        alt=""
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.08 }}
        animate={{ opacity: 0.2, scale: 1.02 }}
        transition={{ duration: reduceMotion ? 0 : 1.4 }}
        className="absolute inset-0 h-full w-full object-cover blur-2xl saturate-75"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(197,114,132,.32),transparent_34%),linear-gradient(115deg,rgba(37,19,29,.98)_0%,rgba(74,24,43,.92)_48%,rgba(35,18,28,.86)_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(244,217,205,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(244,217,205,.12)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-[110rem] items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[0.76fr_1.24fr] lg:px-12">
        <div className="relative z-20">
          <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.42em] text-[#d9ad72]">
            <span>Maison Belle</span>
            <span className="h-px w-10 bg-[#d9ad72]/50" />
            <span>Édition 01</span>
          </div>
          <h1 className="mt-7 max-w-3xl font-display text-[clamp(3.7rem,8.2vw,8.7rem)] font-medium leading-[0.78] tracking-[-0.065em]">
            Vista a cena.
            <span className="block text-[#dda5ad]">Mude a história.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-[#f7eee8]/68 sm:text-lg">
            Escolha um look, mova o carrossel e veja a vitrine responder. Cada gesto revela peça,
            preço e caminho de compra — sem sair da campanha.
          </p>

          <div className="mt-9 grid max-w-lg grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-l border-[#d9ad72]/45 pl-5">
            <span className="row-span-2 font-display text-5xl text-[#d9ad72]">
              {String(active + 1).padStart(2, "0")}
            </span>
            <p className="self-end text-xs font-bold uppercase tracking-[0.22em] text-white/48">
              {selected.category}
            </p>
            <p className="font-display text-2xl leading-tight text-white">{selected.name}</p>
            {selected.price > 0 && (
              <p className="col-start-2 text-sm text-[#e8c9c2]/72">{brl(selected.price)}</p>
            )}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {selected.slug ? (
              <Link
                to="/demo/$storeSlug/produto/$productSlug"
                params={{ storeSlug: store.slug, productSlug: selected.slug }}
                className="group inline-flex min-h-13 items-center gap-3 bg-[#e9d3c7] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#301722] transition hover:bg-white"
              >
                Vestir este look
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                to="/demo/$storeSlug/produtos"
                params={{ storeSlug: store.slug }}
                search={{ q: "", cat: "", sort: "" }}
                className="inline-flex min-h-13 items-center gap-3 bg-[#e9d3c7] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#301722]"
              >
                Explorar coleção <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <span className="inline-flex items-center gap-2 px-2 text-[10px] uppercase tracking-[0.2em] text-white/45">
              <MousePointer2 className="h-4 w-4 text-[#d9ad72]" /> Arraste ou escolha
            </span>
          </div>
        </div>

        <div className="relative min-h-[34rem] lg:min-h-[44rem]" style={{ perspective: "1400px" }}>
          <motion.div
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 45) step(info.offset.x < 0 ? 1 : -1);
            }}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {looks.map((look, index) => {
              let offset = index - active;
              if (offset > looks.length / 2) offset -= looks.length;
              if (offset < -looks.length / 2) offset += looks.length;
              const distance = Math.abs(offset);
              const isActive = offset === 0;

              return (
                <motion.button
                  type="button"
                  data-testid="fashion-look-card"
                  key={look.id}
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  aria-label={`Selecionar ${look.name}`}
                  animate={{
                    x: offset * 150,
                    y: distance * 30,
                    z: isActive ? 100 : -120 * distance,
                    rotateY: offset * -24,
                    rotateZ: offset * 2.5,
                    scale: isActive ? 1 : Math.max(0.72, 1 - distance * 0.12),
                    opacity: distance > 2 ? 0 : isActive ? 1 : 0.62,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-1/2 h-[30rem] w-[15.5rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[#f5ded2]/25 bg-[#4b2234] text-left shadow-[0_35px_80px_rgba(14,4,10,.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9ad72] sm:h-[38rem] sm:w-[20rem]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img src={look.image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#241019]/85 via-transparent to-transparent" />
                  <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                    <span className="font-display text-2xl leading-none text-white">
                      {look.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#e8c9c2]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <div className="absolute inset-x-0 bottom-1 z-30 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-[#2e1722]/75 text-white transition hover:border-[#d9ad72] hover:text-[#d9ad72]"
              aria-label="Look anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2" aria-label="Posição no provador">
              {looks.map((look, index) => (
                <button
                  key={look.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Ir para look ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${index === active ? "w-10 bg-[#d9ad72]" : "w-4 bg-white/25"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => step(1)}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-[#2e1722]/75 text-white transition hover:border-[#d9ad72] hover:text-[#d9ad72]"
              aria-label="Próximo look"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {spotlight?.kind === "product" && (
        <p className="sr-only">Peça em destaque: {spotlight.product.name}</p>
      )}
    </section>
  );
}
