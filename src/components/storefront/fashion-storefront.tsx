import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, MousePointer2, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Product, StoreConfig } from "@/types/commerce";
import { FashionHero } from "@/components/storefront/hero/fashion-hero";
import type { HeroSpotlight } from "@/components/storefront/hero/niche-hero";
import { EditorialProductCard } from "@/components/storefront/product-card-editorial";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FASHION = {
  ink: "#25131d",
  wine: "#5b1830",
  plum: "#8b3150",
  rose: "#d49aa7",
  blush: "#ead1c8",
  ivory: "#f5eee8",
  gold: "#c99a55",
};

type Chapter = {
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  notes: string[];
  objectPosition: string;
};

function FashionChapter({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.12, 0.76, 0.94], [0.22, 1, 1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 0.35, 0.78, 1], [1.18, 1.02, 1, 1.08]);
  const imageX = useTransform(
    scrollYProgress,
    [0, 0.32, 0.76, 1],
    [index % 2 === 0 ? -42 : 42, 0, 0, index % 2 === 0 ? 24 : -24],
  );
  const copyY = useTransform(scrollYProgress, [0.08, 0.26, 0.72, 0.9], [42, 0, 0, -34]);
  const copyOpacity = useTransform(scrollYProgress, [0.08, 0.24, 0.72, 0.9], [0, 1, 1, 0]);
  const lineScale = useTransform(scrollYProgress, [0.12, 0.85], [0, 1]);

  return (
    <section
      ref={ref}
      data-testid="fashion-chapter"
      className="relative min-h-[190svh] border-t border-[#ead1c8]/12 bg-[#25131d] sm:min-h-[210svh]"
    >
      <div className="sticky top-[4.5rem] h-[calc(100svh-4.5rem)] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={reduceMotion ? undefined : { opacity: sceneOpacity }}
        >
          <motion.img
            src={chapter.image}
            alt=""
            aria-hidden="true"
            loading={index === 0 ? "eager" : "lazy"}
            className="h-full w-full object-cover"
            style={
              reduceMotion
                ? { objectPosition: chapter.objectPosition }
                : { objectPosition: chapter.objectPosition, scale: imageScale, x: imageX }
            }
          />
          <div
            className={`absolute inset-0 ${index % 2 === 0 ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-[#25131d]/95 via-[#3d1828]/65 to-[#25131d]/20`}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(37,19,29,.82),transparent_42%,rgba(37,19,29,.2))]" />
        </motion.div>

        <div className="absolute inset-y-0 left-5 hidden w-px bg-[#ead1c8]/16 lg:block">
          <motion.div
            className="h-full w-px origin-top bg-[#c99a55] shadow-[0_0_24px_rgba(201,154,85,.65)]"
            style={reduceMotion ? { scaleY: 1 } : { scaleY: lineScale }}
          />
        </div>

        <div className="relative mx-auto flex h-full max-w-[100rem] items-center px-5 sm:px-8 lg:px-16">
          <motion.div
            className={`max-w-3xl ${index % 2 === 1 ? "lg:ml-auto" : ""}`}
            style={reduceMotion ? undefined : { opacity: copyOpacity, y: copyY }}
          >
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.34em] text-[#d8ad72]">
              <span>{chapter.number}</span>
              <span className="h-px w-12 bg-[#d8ad72]/55" />
              <span>{chapter.eyebrow}</span>
            </div>
            <h2 className="mt-6 font-display text-[clamp(3.4rem,8vw,8rem)] font-medium leading-[0.82] tracking-[-0.06em] text-[#f7eee8]">
              {chapter.title}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#f7eee8]/68 sm:text-lg">
              {chapter.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {chapter.notes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-[#ead1c8]/20 bg-[#301622]/65 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ead1c8]/76 backdrop-blur-xl"
                >
                  {note}
                </span>
              ))}
            </div>
            <p className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/38">
              <MousePointer2 className="h-4 w-4 text-[#c99a55]" /> Continue rolando para atravessar
              o editorial
            </p>
          </motion.div>
        </div>

        <span className="absolute bottom-5 right-6 font-display text-[22vw] leading-none text-[#ead1c8]/[0.035]">
          {chapter.number}
        </span>
      </div>
    </section>
  );
}

function AtelierConsole({ store, products }: { store: StoreConfig; products: Product[] }) {
  const [category, setCategory] = useState(store.categories[0]?.slug ?? "");
  const selectedCategory = store.categories.find((item) => item.slug === category);
  const selection = useMemo(() => {
    const matching = products.filter((product) => product.category === category);
    return (matching.length ? matching : products).slice(0, 4);
  }, [category, products]);

  return (
    <section
      data-testid="fashion-atelier"
      className="relative overflow-hidden bg-[#4a192b] px-5 py-24 text-[#f7eee8] sm:px-8 sm:py-32"
    >
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_80%_20%,#d49aa7_0,transparent_26%),radial-gradient(circle_at_15%_80%,#c99a55_0,transparent_22%)]" />
      <div className="relative mx-auto max-w-[100rem]">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#d8ad72]">
              Atelier interativo
            </p>
            <h2 className="mt-5 font-display text-5xl font-medium leading-[0.88] tracking-[-0.055em] sm:text-7xl">
              Monte a arara. A cena muda com você.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-base leading-8 text-white/62">
              Selecione uma linha para reorganizar a curadoria, trocar as imagens e abrir o caminho
              direto para os produtos daquele universo.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {store.categories.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  data-testid="fashion-category"
                  aria-pressed={item.slug === category}
                  onClick={() => setCategory(item.slug)}
                  className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition ${
                    item.slug === category
                      ? "border-[#d8ad72] bg-[#d8ad72] text-[#301622]"
                      : "border-white/18 bg-white/[0.04] text-white/62 hover:border-[#d8ad72]/65 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid min-h-[36rem] gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="relative h-[32rem]" style={{ perspective: "1200px" }}>
            {selection.map((product, index) => {
              const center = (selection.length - 1) / 2;
              const offset = index - center;
              return (
                <motion.div
                  layout
                  key={`${category}-${product.id}`}
                  initial={{ opacity: 0, y: 45, rotateY: offset * -12 }}
                  animate={{
                    opacity: 1,
                    x: offset * 145,
                    y: Math.abs(offset) * 22,
                    z: 80 - Math.abs(offset) * 90,
                    rotateY: offset * -17,
                    rotateZ: offset * 2,
                  }}
                  transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-1/2 h-[28rem] w-[14rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-white/18 bg-[#6b2941] shadow-[0_28px_70px_rgba(25,5,15,.45)] sm:w-[17rem]"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#25131d]/86 via-transparent to-transparent" />
                  <p className="absolute inset-x-4 bottom-4 font-display text-xl leading-tight">
                    {product.name}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="border-l border-[#ead1c8]/18 pl-7 sm:pl-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#d8ad72]">
              Curadoria ativa
            </p>
            <p className="mt-4 font-display text-5xl text-white">
              {selectedCategory?.name ?? "Coleção"}
            </p>
            <p className="mt-5 text-sm leading-7 text-white/58">
              {selection.length} peças selecionadas agora. Abra a linha completa para filtrar o
              catálogo, comparar detalhes e escolher seu tamanho.
            </p>
            <Link
              to="/demo/$storeSlug/produtos"
              params={{ storeSlug: store.slug }}
              search={{ q: "", cat: category, sort: "" }}
              className="group mt-8 inline-flex min-h-13 items-center gap-3 bg-[#ead1c8] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#301622]"
            >
              Abrir {selectedCategory?.name ?? "coleção"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

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
  const images = useMemo(
    () => Array.from(new Set(products.flatMap((product) => product.images).filter(Boolean))),
    [products],
  );
  const chapters: Chapter[] = [
    {
      number: "01",
      eyebrow: "Matéria",
      title: "O tecido dita o ritmo.",
      body: "A imagem se aproxima devagar para revelar textura, movimento e caimento. A peça deixa de ser um card e vira presença.",
      image: images[1] ?? images[0] ?? store.banners[0]?.image ?? "",
      notes: ["fibras naturais", "toque macio", "pequenos lotes"],
      objectPosition: "center 38%",
    },
    {
      number: "02",
      eyebrow: "Silhueta",
      title: "Seu gesto muda a composição.",
      body: "Navegação, produto e narrativa permanecem na mesma cena. Você explora sem quebrar o clima da campanha.",
      image: images[3] ?? images[2] ?? images[0] ?? "",
      notes: ["proporção", "movimento", "presença"],
      objectPosition: "center 32%",
    },
    {
      number: "03",
      eyebrow: "Curadoria",
      title: "Escolher também é criar.",
      body: "Categorias deixam de ser um menu morto: cada escolha reorganiza a arara, troca a informação e abre um novo percurso de compra.",
      image: images[5] ?? images[4] ?? images[0] ?? "",
      notes: ["linha ativa", "seleção dinâmica", "compra contextual"],
      objectPosition: "center 42%",
    },
  ];
  const editorialGrid = featured.slice(0, 6);

  return (
    <div data-testid="fashion-storefront" className="bg-[#f5eee8] text-[#2c1721]">
      <FashionHero store={store} spotlight={spotlight} featured={featured} />

      <section className="relative overflow-hidden bg-[#ead1c8] px-5 py-24 sm:px-8 sm:py-32">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#8b3150]/16 blur-3xl" />
        <div className="relative mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#7b4d25]">
            Manifesto Maison Belle
          </p>
          <div>
            <h2 className="font-display text-[clamp(3.1rem,7vw,7.2rem)] font-medium leading-[0.86] tracking-[-0.06em]">
              Moda não é uma sequência de fotos. É uma sensação que continua.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#2c1721]/66">
              Uma única atmosfera acompanha toda a vitrine: vinho profundo, rosa queimado, marfim
              quente e dourado. Sem blocos desconectados, sem branco estourado, sem colagem
              aleatória.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-[#25131d]">
        {chapters.map((chapter, index) => (
          <FashionChapter key={chapter.number} chapter={chapter} index={index} />
        ))}
      </div>

      <AtelierConsole store={store} products={products} />

      <section className="bg-[#f5eee8] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[84rem]">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#8b3150]">
                Seleção da estação
              </p>
              <h2 className="mt-4 font-display text-5xl font-medium tracking-[-0.05em] sm:text-7xl">
                Peças que sustentam a cena.
              </h2>
            </div>
            <Link
              to="/demo/$storeSlug/produtos"
              params={{ storeSlug: store.slug }}
              search={{ q: "", cat: "", sort: "" }}
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#5b1830]"
            >
              Ver coleção completa
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {editorialGrid.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.65, delay: (index % 3) * 0.06 }}
                className={index % 3 === 1 ? "lg:mt-12" : ""}
              >
                <EditorialProductCard product={product} storeSlug={store.slug} aspect="portrait" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#351722] px-5 py-24 text-[#f7eee8] sm:px-8 sm:py-32">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[25vw] text-[#ead1c8]/[0.025]">
          Belle
        </div>
        <div className="relative mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-xl">
            <div className="aspect-[4/5] overflow-hidden border border-[#ead1c8]/18 bg-[#5b1830] p-2">
              <img
                src={images[2] ?? images[0] ?? ""}
                alt="Curadoria Maison Belle"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-5 grid h-28 w-28 place-items-center rounded-full border border-[#d8ad72]/55 bg-[#5b1830] text-center text-[9px] font-bold uppercase tracking-[0.2em] text-[#d8ad72]">
              Feito em
              <br /> pequenos lotes
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#d8ad72]">
              A Maison
            </p>
            <h2 className="mt-5 font-display text-5xl font-medium leading-[0.9] tracking-[-0.05em] sm:text-7xl">
              {store.messages.aboutTitle}
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/65">
              {store.messages.aboutBody}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {store.benefits.map((benefit) => (
                <div key={benefit.title} className="border-l border-[#d8ad72]/40 pl-4">
                  <Check className="h-4 w-4 text-[#d8ad72]" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-white/86">
                    {benefit.title}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/45">{benefit.description}</p>
                </div>
              ))}
            </div>
            <Accordion type="single" collapsible className="mt-10 border-t border-white/14">
              {store.faq.map((item, index) => (
                <AccordionItem key={item.q} value={`faq-${index}`} className="border-white/14">
                  <AccordionTrigger className="py-5 text-left text-sm uppercase tracking-[0.16em] text-white/82 hover:text-white">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-7 text-white/58">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#d8ada7] px-5 py-28 text-center text-[#301622] sm:px-8 sm:py-36">
        <Sparkles className="mx-auto h-6 w-6 text-[#7d3a4e]" />
        <h2 className="mx-auto mt-7 max-w-5xl font-display text-[clamp(3.3rem,8vw,8rem)] font-medium leading-[0.82] tracking-[-0.065em]">
          A próxima cena começa no seu guarda-roupa.
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-[#301622]/62">
          Explore a coleção, escolha seu tamanho e finalize a compra dentro da mesma experiência.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-10 rounded-none bg-[#301622] px-9 py-7 text-xs font-bold uppercase tracking-[0.24em] text-[#f7eee8] hover:bg-[#5b1830]"
        >
          <Link
            to="/demo/$storeSlug/produtos"
            params={{ storeSlug: store.slug }}
            search={{ q: "", cat: "", sort: "" }}
          >
            Entrar na coleção <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
