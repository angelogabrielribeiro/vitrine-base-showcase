import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Truck, RefreshCcw, Sparkles, Gift } from "lucide-react";
import { getStore } from "@/config/stores";
import { repo } from "@/services/local-repository";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/demo/$storeSlug/")({
  component: StoreHome,
});

const ICONS: Record<string, typeof Truck> = {
  truck: Truck,
  refresh: RefreshCcw,
  sparkles: Sparkles,
  gift: Gift,
};

function StoreHome() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const products = repo.listProducts(storeSlug).filter((p) => p.active);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const banner = store.banners[0];
  const reduce = useReducedMotion();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${banner?.image})` }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <motion.p
            initial={reduce ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-primary"
          >
            {store.messages.heroKicker}
          </motion.p>
          <motion.h1
            initial={reduce ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl"
          >
            {store.messages.heroTitle}
          </motion.h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            {store.messages.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/demo/$storeSlug/produtos" params={{ storeSlug }} search={{ q: "", cat: "", sort: "" }}>
                {store.messages.heroCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="border-y border-border/60 bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
          {store.benefits.map((b) => {
            const Icon = ICONS[b.icon] ?? Sparkles;
            return (
              <div key={b.title} className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{b.title}</div>
                  <div className="text-xs text-muted-foreground">{b.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Categorias</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {store.categories.map((c) => (
            <Link
              key={c.slug}
              to="/demo/$storeSlug/categoria/$categorySlug"
              params={{ storeSlug, categorySlug: c.slug }}
              className="rounded-[var(--radius)] border border-border/60 bg-card p-4 text-center text-sm font-medium transition hover:border-primary hover:bg-accent hover:text-accent-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Destaques</h2>
            <Link
              to="/demo/$storeSlug/produtos"
              params={{ storeSlug }}
              search={{ q: "", cat: "", sort: "" }}
              className="text-sm text-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} storeSlug={storeSlug} />
            ))}
          </div>
        </section>
      )}

      {/* SOBRE */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{store.messages.aboutTitle}</h2>
        <p className="mt-4 text-muted-foreground">{store.messages.aboutBody}</p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="font-display mb-6 text-2xl font-semibold sm:text-3xl">Perguntas frequentes</h2>
        <Accordion type="single" collapsible>
          {store.faq.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
