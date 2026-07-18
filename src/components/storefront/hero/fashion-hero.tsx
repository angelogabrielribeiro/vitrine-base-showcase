import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { NicheHeroProps } from "./niche-hero";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/format";
import { ImageReveal, SectionReveal, WordReveal, Marquee, ParallaxMedia } from "@/components/motion/primitives";

/**
 * Fashion — editorial, split assimétrico, tipografia serif dominante,
 * imagens revelam por máscara, marquee sutil como tagline de coleção.
 */
export function FashionHero({ store, spotlight, featured }: NicheHeroProps) {
  const banner = store.banners[0];
  const heroImage =
    (spotlight?.kind === "product" ? spotlight.product.images[0] : undefined) ??
    banner?.image ??
    "";
  const secondaryImage = featured[1]?.images[0] ?? featured[0]?.images[0] ?? heroImage;
  const price =
    spotlight?.kind === "product"
      ? spotlight.product.salePrice ?? spotlight.product.price
      : undefined;

  return (
    <section className="relative isolate overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-border" />

      {/* Barra editorial superior */}
      <div className="mx-auto flex max-w-[110rem] items-center justify-between px-6 py-4 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
        <span>Édition {new Date().getFullYear()}</span>
        <span className="hidden sm:inline">{store.tagline}</span>
        <span>№ 01</span>
      </div>

      {/* Grid editorial assimétrico */}
      <div className="mx-auto grid max-w-[110rem] grid-cols-12 gap-x-4 gap-y-10 px-6 pb-16 pt-4 lg:pb-24">
        {/* Coluna texto */}
        <div className="col-span-12 lg:col-span-5 lg:col-start-1 lg:pt-16">
          <SectionReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-muted-foreground">
              {store.messages.heroKicker}
            </p>
          </SectionReveal>
          <h1 className="font-display mt-6 text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-tight">
            <WordReveal text={store.messages.heroTitle} as="span" className="block" />
          </h1>
          <SectionReveal delay={0.15}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              {store.messages.heroSubtitle}
            </p>
          </SectionReveal>
          <SectionReveal delay={0.25}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button asChild size="lg" className="rounded-none px-7 py-6 text-xs uppercase tracking-[0.3em]">
                <Link to="/demo/$storeSlug/produtos" params={{ storeSlug: store.slug }} search={{ q: "", cat: "", sort: "" }}>
                  {store.messages.heroCta} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {spotlight?.kind === "product" && (
                <Link
                  to="/demo/$storeSlug/produto/$productSlug"
                  params={{ storeSlug: store.slug, productSlug: spotlight.product.slug }}
                  className="group inline-flex flex-col text-xs uppercase tracking-[0.3em] text-muted-foreground"
                >
                  <span className="text-foreground">Peça destaque</span>
                  <span className="mt-1 border-b border-transparent pb-0.5 transition group-hover:border-foreground">
                    {spotlight.product.name}
                  </span>
                </Link>
              )}
            </div>
          </SectionReveal>
        </div>

        {/* Coluna imagem principal (desloca para direita) */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <ParallaxMedia offset={30}>
            <ImageReveal
              src={heroImage}
              alt={spotlight?.kind === "product" ? spotlight.product.name : store.name}
              eager
              className="aspect-[4/5] w-full"
            />
          </ParallaxMedia>
          {price && (
            <div className="mt-4 flex items-baseline justify-between text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              <span>Alta seleção</span>
              <span className="text-foreground">{brl(price)}</span>
            </div>
          )}
        </div>

        {/* Imagem secundária baixo esquerda (assimetria) */}
        <div className="col-span-8 col-start-1 -mt-24 hidden lg:col-span-4 lg:col-start-2 lg:block">
          <ParallaxMedia offset={-20}>
            <ImageReveal src={secondaryImage} alt="" className="aspect-[3/4] w-full" />
          </ParallaxMedia>
        </div>

        {/* Citação editorial à direita */}
        <div className="col-span-12 lg:col-span-4 lg:col-start-8 lg:mt-10">
          <SectionReveal>
            <p className="font-display text-2xl leading-snug text-foreground/85">
              “Peças que atravessam estações — feitas para durar mais do que uma tendência.”
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              Editorial da casa
            </p>
          </SectionReveal>
        </div>
      </div>

      {/* Marquee editorial */}
      <div className="border-y border-border/60 py-4">
        <Marquee speed={45}>
          {["Alta primavera", "Tecidos naturais", "Produção limitada", "Curadoria autoral", "Novos lançamentos"].map(
            (t) => (
              <span key={t} className="font-display text-2xl italic tracking-tight text-foreground/70">
                {t} <span className="mx-6 text-muted-foreground/50">◆</span>
              </span>
            ),
          )}
        </Marquee>
      </div>
    </section>
  );
}