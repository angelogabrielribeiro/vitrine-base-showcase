import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChefHat,
  Clock3,
  Flame,
  MapPin,
  MoveRight,
  Quote,
  Sparkles,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Product, StoreConfig } from "@/types/commerce";
import { brl } from "@/lib/format";
import { SafeImage } from "@/components/storefront/safe-image";
import {
  Marquee,
  MOTION,
  ParallaxMedia,
  SectionReveal,
  Stagger,
  StaggerItem,
  WordReveal,
} from "@/components/motion/primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HERO_IMAGE = "/media/brasa-urbana/hero-brasa-duplo.webp";
const PROCESS_IMAGE = "/media/brasa-urbana/processo-brasa.webp";

const REVIEWS = [
  {
    quote:
      "Chegou quente, com a carne no ponto e a batata ainda crocante. Virou o pedido oficial de sexta.",
    author: "Marina S.",
    meta: "Pedido verificado · Pinheiros",
  },
  {
    quote:
      "O Brasa Duplo tem sabor de churrasqueira de verdade. Não é só molho tentando salvar o lanche.",
    author: "Lucas R.",
    meta: "Cliente da casa · Vila Madalena",
  },
  {
    quote:
      "A costela desmancha e a embalagem segura muito bem o calor. Experiência impecável do clique à mesa.",
    author: "Camila T.",
    meta: "Pedido verificado · Jardins",
  },
];

type Props = {
  store: StoreConfig;
  products: Product[];
  featured: Product[];
};

function menuLink(storeSlug: string) {
  return {
    to: "/demo/$storeSlug/produtos" as const,
    params: { storeSlug },
    search: { q: "", cat: "", sort: "" },
  };
}

export function RestaurantStorefront({ store, products, featured }: Props) {
  const reduce = useReducedMotion();
  const signature =
    products.find((product) => product.slug === "burger-brasa") ?? featured[0] ?? products[0];
  const popular = featured.length ? featured.slice(0, 4) : products.slice(0, 4);

  return (
    <div className="overflow-hidden bg-[#120d0a] text-[#fff8eb]">
      <section className="relative isolate min-h-[760px] overflow-hidden border-b border-orange-300/10 lg:min-h-[calc(100svh-6.5rem)]">
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-cover bg-[68%_center] sm:bg-[70%_center] lg:bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          initial={reduce ? undefined : { scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.25, ease: MOTION.ease }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,7,5,0.98)_0%,rgba(11,7,5,0.92)_34%,rgba(11,7,5,0.34)_68%,rgba(11,7,5,0.48)_100%)] sm:bg-[linear-gradient(90deg,rgba(11,7,5,0.98)_0%,rgba(11,7,5,0.86)_40%,rgba(11,7,5,0.08)_78%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_30%,rgba(251,146,60,.22),transparent_32%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:auto,42px_42px,42px_42px]"
        />

        <div className="relative mx-auto flex min-h-[760px] max-w-7xl flex-col justify-between px-5 pb-8 pt-16 sm:px-8 lg:min-h-[calc(100svh-6.5rem)] lg:px-12 lg:pb-10 lg:pt-20">
          <div className="max-w-3xl">
            <SectionReveal>
              <span className="inline-flex items-center gap-2 border border-orange-300/30 bg-black/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.32em] text-orange-200 backdrop-blur-sm">
                <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                Fogo aceso · Pedidos até 23h
              </span>
            </SectionReveal>

            <h1 className="mt-7 max-w-[10ch] font-display text-[clamp(4rem,11vw,9rem)] uppercase leading-[0.82] tracking-[-0.035em] text-[#fff6e7]">
              <WordReveal text="Sabor que chega pegando fogo." delay={0.1} />
            </h1>

            <SectionReveal delay={0.22}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-orange-50/70 sm:text-lg">
                Blend da casa, pão tostado na manteiga e ingredientes preparados todo dia. Da
                primeira faísca à última mordida.
              </p>
            </SectionReveal>

            <SectionReveal delay={0.32}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  {...menuLink(store.slug)}
                  className="group inline-flex min-h-14 items-center justify-center gap-4 bg-[#f15a24] px-7 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#ff713a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                >
                  Abrir cardápio
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#mais-pedidos"
                  className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/15 bg-black/20 px-6 text-xs font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm transition hover:border-orange-300/45 hover:text-white"
                >
                  Ver mais pedidos
                </a>
              </div>
            </SectionReveal>
          </div>

          <Stagger
            className="mt-14 grid max-w-3xl grid-cols-1 border-y border-white/10 bg-black/20 backdrop-blur-sm sm:grid-cols-3"
            delay={0.45}
          >
            {[
              ["40 min", "média de entrega"],
              ["180 g", "blend moído na casa"],
              ["4,9", "avaliação dos clientes"],
            ].map(([value, label]) => (
              <StaggerItem
                key={label}
                className="border-b border-white/10 px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <strong className="font-display text-3xl uppercase text-orange-300">{value}</strong>
                <span className="ml-3 text-[10px] uppercase tracking-[0.18em] text-white/50">
                  {label}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <div className="border-b border-orange-200/10 bg-[#f15a24] py-3 text-[#190d07]">
        <Marquee speed={26} className="font-black uppercase tracking-[0.18em]">
          {[
            "Blend próprio",
            "Ingredientes frescos",
            "Pão tostado na hora",
            "Embalagem que segura o calor",
          ].map((item) => (
            <span key={item} className="inline-flex items-center gap-10 text-xs">
              {item}
              <Flame className="h-3.5 w-3.5 fill-current" />
            </span>
          ))}
        </Marquee>
      </div>

      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <SectionReveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-orange-400">
              Escolha seu caminho
            </span>
            <h2 className="mt-4 max-w-[9ch] font-display text-5xl uppercase leading-[0.92] sm:text-6xl">
              Cardápio em chamas
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-orange-50/55 lg:justify-self-end">
            Vá direto ao que importa. Cada categoria nasce de um tipo de fome — da primeira mordida
            ao último gole.
          </p>
        </SectionReveal>

        <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" step={0.08}>
          {store.categories.map((category, index) => {
            const product = products.find((item) => item.category === category.slug);
            return (
              <StaggerItem
                key={category.slug}
                className={index === 1 ? "sm:col-span-2 lg:col-span-2" : ""}
              >
                <Link
                  to="/demo/$storeSlug/categoria/$categorySlug"
                  params={{ storeSlug: store.slug, categorySlug: category.slug }}
                  className="group relative block min-h-56 overflow-hidden border border-white/10 bg-[#1c1410]"
                >
                  <SafeImage
                    src={product?.images[0]}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-70"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                    <span>
                      <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-orange-300">
                        0{index + 1}
                      </span>
                      <span className="mt-1 block font-display text-2xl uppercase">
                        {category.name}
                      </span>
                    </span>
                    <MoveRight className="h-5 w-5 text-white/50 transition group-hover:translate-x-1 group-hover:text-orange-300" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <section
        id="mais-pedidos"
        className="border-y border-orange-100/10 bg-[#19110d] px-5 py-20 sm:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <SectionReveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-orange-400">
                Os incontornáveis
              </span>
              <h2 className="mt-4 font-display text-5xl uppercase leading-none sm:text-6xl">
                Mais pedidos
              </h2>
            </div>
            <Link
              {...menuLink(store.slug)}
              className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-200"
            >
              Ver cardápio completo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SectionReveal>

          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.1}>
            {popular.map((product, index) => (
              <StaggerItem key={product.id}>
                <RestaurantProductCard product={product} storeSlug={store.slug} rank={index + 1} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {signature && (
        <section className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-12 lg:py-32">
          <ParallaxMedia offset={30} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#1b110c]">
              <SafeImage
                src={HERO_IMAGE}
                fallbackSrc={signature.images[0]}
                alt={signature.name}
                loading="lazy"
                className="h-full w-full object-cover object-[64%_center]"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"
              />
              <span className="absolute bottom-6 left-6 border border-orange-200/20 bg-black/60 px-4 py-3 backdrop-blur">
                <span className="block text-[9px] uppercase tracking-[0.28em] text-orange-300">
                  Assinatura da casa
                </span>
                <span className="mt-1 block font-display text-3xl uppercase">{signature.name}</span>
              </span>
            </div>
          </ParallaxMedia>

          <div className="lg:pl-10">
            <SectionReveal>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-orange-400">
                <Sparkles className="h-3.5 w-3.5" />
                Assinatura da casa
              </span>
              <h2 className="mt-5 max-w-[10ch] font-display text-6xl uppercase leading-[0.88] sm:text-7xl">
                Duas carnes. Uma obsessão.
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.12}>
              <p className="mt-7 max-w-lg text-base leading-8 text-orange-50/60">
                {signature.description} Camadas pensadas para entregar crocância, suculência e
                fumaça na mesma mordida.
              </p>
            </SectionReveal>

            <Stagger className="mt-8 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3">
              {["Blend 2×180g", "Cheddar cremoso", "Bacon crocante"].map((item) => (
                <StaggerItem
                  key={item}
                  className="bg-[#120d0a] px-4 py-5 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-100/70"
                >
                  {item}
                </StaggerItem>
              ))}
            </Stagger>

            <SectionReveal delay={0.2}>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <span className="font-display text-4xl text-orange-300">
                  {brl(signature.salePrice ?? signature.price)}
                </span>
                <Link
                  to="/demo/$storeSlug/produto/$productSlug"
                  params={{ storeSlug: store.slug, productSlug: signature.slug }}
                  className="group inline-flex min-h-13 items-center gap-4 bg-[#f15a24] px-6 text-xs font-black uppercase tracking-[0.16em] transition hover:bg-[#ff713a]"
                >
                  Montar meu Brasa
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </SectionReveal>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden border-y border-orange-100/10 bg-black">
        <div className="grid min-h-[680px] lg:grid-cols-[1.12fr_0.88fr]">
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-full">
            <SafeImage
              src={PROCESS_IMAGE}
              alt="Hambúrguer sendo preparado na brasa"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:to-black/75"
            />
          </div>
          <div className="relative flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14">
            <SectionReveal>
              <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-orange-400">
                Da brasa à mesa
              </span>
              <h2 className="mt-4 font-display text-5xl uppercase leading-[0.92] sm:text-6xl">
                Calor é ingrediente.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-orange-50/55">
                A chama não é cenário. Ela cria crosta, sela o suco e deixa a assinatura defumada
                que acompanha cada pedido.
              </p>
            </SectionReveal>

            <Stagger className="mt-10 space-y-0">
              {[
                [ChefHat, "Preparo diário", "Molhos, vegetais e blends começam frescos."],
                [Flame, "Fogo alto", "Selagem rápida para manter textura e suculência."],
                [Clock3, "Rota curta", "Montagem e despacho pensados para chegar quente."],
              ].map(([Icon, title, text], index) => {
                const StepIcon = Icon as typeof Flame;
                return (
                  <StaggerItem
                    key={title as string}
                    className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-white/10 py-5 last:border-b"
                  >
                    <span className="grid h-11 w-11 place-items-center border border-orange-300/20 text-orange-300">
                      <StepIcon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-400">
                        0{index + 1}
                      </span>
                      <strong className="mt-1 block text-sm uppercase tracking-[0.08em]">
                        {title as string}
                      </strong>
                      <span className="mt-1 block text-xs leading-5 text-white/45">
                        {text as string}
                      </span>
                    </span>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <SectionReveal className="flex items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-orange-400">
              Falam de boca cheia
            </span>
            <h2 className="mt-4 font-display text-5xl uppercase leading-none sm:text-6xl">
              Quem provou, voltou.
            </h2>
          </div>
          <Quote className="hidden h-14 w-14 text-orange-300/25 sm:block" />
        </SectionReveal>
        <Stagger className="mt-10 grid gap-px bg-white/10 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <StaggerItem key={review.author} className="bg-[#120d0a] p-7 sm:p-8">
              <div className="flex gap-1 text-orange-400" aria-label="5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-7 text-lg leading-8 text-orange-50/85">
                “{review.quote}”
              </blockquote>
              <div className="mt-8 border-t border-white/10 pt-5">
                <strong className="block text-xs uppercase tracking-[0.16em]">
                  {review.author}
                </strong>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-white/35">
                  {review.meta}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-y border-orange-100/10 bg-[#19110d]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-28">
          <SectionReveal>
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-orange-400">
              Sem mistério
            </span>
            <h2 className="mt-4 max-w-[8ch] font-display text-5xl uppercase leading-[0.92] sm:text-6xl">
              Perguntas antes da fome apertar.
            </h2>
            <div className="mt-8 space-y-3 text-xs uppercase tracking-[0.12em] text-white/45">
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-orange-400" />
                Entrega local e retirada
              </p>
              <p className="flex items-center gap-3">
                <UtensilsCrossed className="h-4 w-4 text-orange-400" />
                Personalize no checkout
              </p>
            </div>
          </SectionReveal>
          <Accordion type="single" collapsible className="border-t border-white/10">
            {store.faq.map((item, index) => (
              <AccordionItem key={item.q} value={`restaurant-faq-${index}`}>
                <AccordionTrigger className="py-6 text-left text-sm uppercase tracking-[0.08em] hover:text-orange-300 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-6 leading-7 text-orange-50/55">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-5 py-24 text-center sm:px-8 lg:py-32">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,rgba(241,90,36,.35),transparent_48%)]"
        />
        <SectionReveal className="mx-auto max-w-4xl">
          <Flame className="mx-auto h-8 w-8 fill-orange-500 text-orange-500" />
          <h2 className="mt-6 font-display text-[clamp(3.5rem,9vw,7rem)] uppercase leading-[0.86]">
            Sua próxima mordida começa aqui.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-orange-50/55">
            Escolha, personalize e finalize. A gente cuida do fogo.
          </p>
          <Link
            {...menuLink(store.slug)}
            className="group mx-auto mt-9 inline-flex min-h-14 items-center gap-4 bg-[#f15a24] px-8 text-xs font-black uppercase tracking-[0.18em] transition hover:bg-[#ff713a]"
          >
            Fazer meu pedido
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </SectionReveal>
      </section>
    </div>
  );
}

function RestaurantProductCard({
  product,
  storeSlug,
  rank,
}: {
  product: Product;
  storeSlug: string;
  rank: number;
}) {
  const price = product.salePrice ?? product.price;

  return (
    <Link
      to="/demo/$storeSlug/produto/$productSlug"
      params={{ storeSlug, productSlug: product.slug }}
      className="group block h-full border border-white/10 bg-[#120d0a] transition duration-300 hover:-translate-y-1 hover:border-orange-400/45 hover:shadow-[0_24px_70px_-35px_rgba(241,90,36,.8)]"
    >
      <div className="relative aspect-[4/4.7] overflow-hidden bg-[#251811]">
        <SafeImage
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/10"
        />
        <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center border border-white/15 bg-black/50 font-display text-xl text-orange-300 backdrop-blur">
          {rank}
        </span>
        {product.salePrice && (
          <span className="absolute right-4 top-4 bg-[#f15a24] px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em]">
            Oferta
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-300">
            {product.category}
          </span>
          <h3 className="mt-1 font-display text-3xl uppercase leading-none">{product.name}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 p-5">
        <span>
          <span className="block text-[9px] uppercase tracking-[0.2em] text-white/35">
            a partir de
          </span>
          <strong className="mt-1 block text-lg text-orange-200">{brl(price)}</strong>
        </span>
        <span className="grid h-11 w-11 place-items-center border border-white/10 text-white/65 transition group-hover:border-orange-400 group-hover:bg-orange-500 group-hover:text-white">
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
