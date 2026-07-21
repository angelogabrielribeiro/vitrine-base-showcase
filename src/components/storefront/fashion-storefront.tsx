import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useMemo } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Product, StoreConfig } from "@/types/commerce";
import { FashionHero } from "@/components/storefront/hero/fashion-hero";
import type { HeroSpotlight } from "@/components/storefront/hero/niche-hero";
import { ZoomParallax, type ZoomImage } from "@/components/effects/ZoomParallax";
import { FlowingMenu, type FlowingItem } from "@/components/effects/FlowingMenu";
import { EditorialProductCard } from "@/components/storefront/product-card-editorial";
import { SectionReveal, WordReveal, Marquee } from "@/components/motion/primitives";
import { useHydrated } from "@/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Galeria 3D é carregada apenas no browser após a hidratação para não quebrar SSR.
const Gallery3D = lazy(() => import("@/components/effects/Gallery3D"));

export function FashionStorefront({
  store,
  spotlight,
  featured,
  products,
}: {
  store: StoreConfig;
  spotlight: HeroSpotlight;
  featured: Product[];
  products: Product[];
}) {
  const hydrated = useHydrated();

  // Pool de imagens autênticas do próprio catálogo Maison Belle
  const catalogImages = useMemo(() => {
    const all = products.flatMap((p) => p.images).filter(Boolean);
    // dedup preservando ordem
    return Array.from(new Set(all));
  }, [products]);

  const zoomImages: ZoomImage[] = useMemo(() => {
    const layout: Omit<ZoomImage, "src">[] = [
      { alt: "Campanha", className: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[28vh] w-[22vw] min-w-[220px]", scale: 8 },
      { alt: "", className: "left-[6%] top-[10%] h-[26vh] w-[18vw] min-w-[160px]", scale: 5.5 },
      { alt: "", className: "right-[8%] top-[8%] h-[22vh] w-[16vw] min-w-[140px]", scale: 6 },
      { alt: "", className: "left-[4%] bottom-[8%] h-[24vh] w-[20vw] min-w-[180px]", scale: 5 },
      { alt: "", className: "right-[4%] bottom-[10%] h-[26vh] w-[18vw] min-w-[160px]", scale: 6.5 },
      { alt: "", className: "left-[38%] top-[6%] h-[16vh] w-[12vw] min-w-[120px]", scale: 7 },
      { alt: "", className: "right-[36%] bottom-[6%] h-[18vh] w-[14vw] min-w-[130px]", scale: 6 },
    ];
    return layout.map((l, i) => ({ ...l, src: catalogImages[i % catalogImages.length] ?? "" }));
  }, [catalogImages]);

  const flowingItems: FlowingItem[] = useMemo(
    () =>
      store.categories.map((c) => {
        const imgs = products
          .filter((p) => p.category === c.slug)
          .flatMap((p) => p.images)
          .slice(0, 4);
        return {
          label: c.name,
          images: imgs.length ? imgs : catalogImages.slice(0, 3),
          storeSlug: store.slug,
          categorySlug: c.slug,
        };
      }),
    [store, products, catalogImages],
  );

  const lookbook = useMemo(() => catalogImages.slice(0, 10), [catalogImages]);

  // Grid editorial assimétrico
  const editorialGrid = useMemo(() => featured.slice(0, 6), [featured]);

  return (
    <div className="bg-neutral-50 text-neutral-900">
      <FashionHero store={store} spotlight={spotlight} featured={featured} />

      {/* MANIFESTO cinético */}
      <section className="relative overflow-hidden bg-neutral-50 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionReveal>
            <span className="text-[10px] font-semibold uppercase tracking-[0.5em] text-neutral-500">
              Manifesto — {new Date().getFullYear()}
            </span>
          </SectionReveal>
          <h2 className="font-display mt-6 text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight">
            <WordReveal
              text="Roupas que respiram. Tecidos que duram. Silhuetas que permanecem."
              as="span"
              className="block"
            />
          </h2>
          <SectionReveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-neutral-600">
              A Maison Belle é uma curadoria autoral de moda feminina contemporânea. Cada peça é
              desenhada em pequenos lotes, com atenção a caimento, matéria-prima e presença.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ZOOM PARALLAX de campanha */}
      <ZoomParallax
        eyebrow="Editorial 01"
        title="Um retrato da coleção"
        caption="Imagens autênticas do acervo Maison Belle."
        images={zoomImages}
      />

      {/* FLOWING MENU de categorias */}
      <section className="relative bg-neutral-950 py-16 text-white sm:py-24">
        <div className="mx-auto mb-8 max-w-6xl px-6">
          <span className="text-[10px] uppercase tracking-[0.5em] text-amber-200/80">
            Categorias
          </span>
          <h2 className="font-display mt-3 text-3xl sm:text-5xl">Descubra por linha</h2>
        </div>
        <FlowingMenu items={flowingItems} />
      </section>

      {/* GALERIA 3D LOOKBOOK */}
      {hydrated && lookbook.length > 3 ? (
        <Suspense
          fallback={
            <div className="grid h-[80vh] place-items-center bg-neutral-950 text-white/60">
              <span className="text-xs uppercase tracking-[0.4em]">Carregando lookbook…</span>
            </div>
          }
        >
          <Gallery3D images={lookbook} title="Lookbook Alta Primavera" eyebrow="Coleção" />
        </Suspense>
      ) : (
        <div className="grid h-[60vh] place-items-center bg-neutral-950 text-white/60">
          <span className="text-xs uppercase tracking-[0.4em]">Carregando lookbook…</span>
        </div>
      )}

      {/* GRID EDITORIAL ASSIMÉTRICO */}
      <section className="mx-auto max-w-[110rem] px-6 py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-500">
              Seleção da estação
            </span>
            <h2 className="font-display mt-3 text-3xl sm:text-5xl">Peças em destaque</h2>
          </div>
          <Link
            to="/demo/$storeSlug/produtos"
            params={{ storeSlug: store.slug }}
            search={{ q: "", cat: "", sort: "" }}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-700"
          >
            Ver todos
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {editorialGrid.length > 0 && (
          <div className="grid grid-cols-12 gap-x-6 gap-y-16">
            {editorialGrid[0] && (
              <div className="col-span-12 md:col-span-7">
                <EditorialProductCard
                  product={editorialGrid[0]}
                  storeSlug={store.slug}
                  aspect="tall"
                />
              </div>
            )}
            {editorialGrid[1] && (
              <div className="col-span-12 md:col-span-5 md:pt-24">
                <EditorialProductCard
                  product={editorialGrid[1]}
                  storeSlug={store.slug}
                  aspect="portrait"
                />
              </div>
            )}
            {editorialGrid[2] && (
              <div className="col-span-6 md:col-span-4">
                <EditorialProductCard
                  product={editorialGrid[2]}
                  storeSlug={store.slug}
                  aspect="square"
                />
              </div>
            )}
            {editorialGrid[3] && (
              <div className="col-span-6 md:col-span-4 md:pt-16">
                <EditorialProductCard
                  product={editorialGrid[3]}
                  storeSlug={store.slug}
                  aspect="portrait"
                />
              </div>
            )}
            {editorialGrid[4] && (
              <div className="col-span-12 md:col-span-4">
                <EditorialProductCard
                  product={editorialGrid[4]}
                  storeSlug={store.slug}
                  aspect="tall"
                />
              </div>
            )}
            {editorialGrid[5] && (
              <div className="col-span-12 md:col-span-8 md:col-start-3">
                <EditorialProductCard
                  product={editorialGrid[5]}
                  storeSlug={store.slug}
                  aspect="portrait"
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* CURADORIA — imagem atravessa tipografia */}
      <section className="relative overflow-hidden bg-neutral-900 py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08]">
          <span className="font-display text-[22vw] leading-none">Maison</span>
        </div>
        <div className="relative mx-auto grid max-w-6xl grid-cols-12 items-center gap-8 px-6">
          <div className="col-span-12 md:col-span-5">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src={catalogImages[2] ?? catalogImages[0] ?? ""}
                alt="Curadoria Maison Belle"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.5em] text-amber-200/80">
              História
            </span>
            <h2 className="font-display mt-4 text-3xl leading-tight sm:text-5xl">
              {store.messages.aboutTitle}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
              {store.messages.aboutBody}
            </p>
            <Accordion type="single" collapsible className="mt-8 border-t border-white/15">
              {store.faq.map((f, i) => (
                <AccordionItem key={i} value={`f${i}`} className="border-white/15">
                  <AccordionTrigger className="py-4 text-left text-sm uppercase tracking-[0.2em] text-white/90 hover:text-white">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-white/70">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* MARQUEE de benefícios integrados */}
      <div className="border-y border-neutral-200 bg-neutral-50 py-5">
        <Marquee speed={30}>
          {store.benefits.map((b) => (
            <span
              key={b.title}
              className="font-display text-2xl italic tracking-tight text-neutral-800"
            >
              {b.title}
              <span className="mx-6 text-amber-500">◆</span>
            </span>
          ))}
          <span className="font-display text-2xl italic tracking-tight text-neutral-800">
            Curadoria autoral <span className="mx-6 text-amber-500">◆</span>
          </span>
        </Marquee>
      </div>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-neutral-50 px-6 py-28 text-center">
        <SectionReveal>
          <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-500">
            Explore agora
          </span>
        </SectionReveal>
        <h2 className="font-display mx-auto mt-6 max-w-4xl text-[clamp(2.25rem,6vw,5rem)] leading-[1] tracking-tight">
          <WordReveal text="Encontre a peça que vai te acompanhar por muito tempo." as="span" />
        </h2>
        <div className="mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-none bg-neutral-900 px-10 py-6 text-xs uppercase tracking-[0.3em] text-white hover:bg-neutral-800"
          >
            <Link
              to="/demo/$storeSlug/produtos"
              params={{ storeSlug: store.slug }}
              search={{ q: "", cat: "", sort: "" }}
            >
              Explorar coleção
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
