import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import type { Product, StoreConfig } from "@/types/commerce";
import { useCart } from "@/hooks/use-cart";
import { brl } from "@/lib/format";
import { waProductInquiry } from "@/lib/whatsapp";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SafeImage } from "@/components/storefront/safe-image";
import { ProductCard } from "@/components/storefront/product-card";
import { barberCategoryFallback } from "@/lib/barber-media";
import { commerceSurface } from "@/components/storefront/commerce-surface";

interface PremiumProductDetailProps {
  store: StoreConfig;
  product: Product;
  related: Product[];
}

export function PremiumProductDetail({ store, product, related }: PremiumProductDetailProps) {
  const surface = commerceSurface(store.niche);
  const reduceMotion = useReducedMotion();
  const { add } = useCart(store.slug);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");

  const optionNames = useMemo(
    () => product.variantOptions?.map((option) => option.name) ?? [],
    [product.variantOptions],
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const option of product.variantOptions ?? []) initial[option.name] = option.values[0];
    return initial;
  });

  const variant = useMemo(() => {
    if (!product.variants?.length) return undefined;
    return product.variants.find((item) =>
      optionNames.every((name) => item.attributes[name] === selectedOptions[name]),
    );
  }, [optionNames, product.variants, selectedOptions]);

  const hasVariants = Boolean(product.variants?.length);
  const stock = hasVariants ? (variant?.stock ?? 0) : product.stock;
  const inStock = stock > 0;
  const selectedAddonItems = product.addons?.filter((addon) => selectedAddons.has(addon.id)) ?? [];
  const addonTotal = selectedAddonItems.reduce((total, addon) => total + addon.price, 0);
  const basePrice = product.salePrice ?? product.price;
  const unitPrice = basePrice + (variant?.priceDelta ?? 0) + addonTotal;
  const fallback = store.niche === "barber" ? barberCategoryFallback(product.category) : undefined;

  const handleAdd = () => {
    if (!inStock) return;
    add({
      product,
      quantity,
      variant,
      addons: selectedAddonItems,
      notes,
    });
    toast.success("Adicionado ao carrinho", {
      description: `${quantity}× ${product.name}`,
    });
  };

  const specs = [
    [
      "Categoria",
      store.categories.find((category) => category.slug === product.category)?.name ??
        product.category,
    ],
    ["Código", product.sku ?? `OBJ-${product.id.slice(-5).toUpperCase()}`],
    ["Disponibilidade", inStock ? `${stock} unidades` : "Indisponível"],
    [
      "Entrega",
      store.niche === "restaurant"
        ? "Preparo imediato"
        : store.fulfillment.shipping
          ? "Envio nacional"
          : "Retirada no local",
    ],
  ];

  return (
    <main className={`relative isolate min-h-screen overflow-hidden ${surface.shell}`}>
      <DetailAmbient niche={store.niche} />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pb-24">
        <nav
          aria-label="Navegação estrutural"
          className={`mb-8 flex flex-wrap items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.28em] ${surface.muted}`}
        >
          <Link
            to="/demo/$storeSlug"
            params={{ storeSlug: store.slug }}
            className="transition hover:text-current"
          >
            Experiência
          </Link>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <Link
            to="/demo/$storeSlug/produtos"
            params={{ storeSlug: store.slug }}
            search={{ q: "", cat: "", sort: "" }}
            className="transition hover:text-current"
          >
            Catálogo
          </Link>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <span className={surface.eyebrow}>{product.name}</span>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-6"
          >
            <div className={`relative overflow-hidden border ${surface.border} ${surface.panel}`}>
              <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeImage}
                    initial={
                      reduceMotion ? false : { opacity: 0, scale: 1.04, filter: "blur(8px)" }
                    }
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <SafeImage
                      src={product.images[activeImage]}
                      fallbackSrc={fallback}
                      alt={product.name}
                      fallbackLabel={product.name}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      store.niche === "fashion"
                        ? "linear-gradient(to top, rgba(32,28,25,.28), transparent 45%)"
                        : store.niche === "restaurant"
                          ? "linear-gradient(to top, rgba(22,8,3,.72), transparent 48%)"
                          : "linear-gradient(to top, rgba(3,5,14,.62), transparent 48%)",
                  }}
                />
                {store.niche === "electronics" && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(103,232,249,.11) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,.11) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                      maskImage: "linear-gradient(to bottom, black, transparent 70%)",
                    }}
                  />
                )}

                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
                  <span className="border border-white/20 bg-black/45 px-3 py-2 text-[8px] uppercase tracking-[0.32em] text-white backdrop-blur-md">
                    {surface.productKicker}
                  </span>
                  <span className="border border-white/20 bg-black/45 px-3 py-2 text-[8px] uppercase tracking-[0.25em] text-white backdrop-blur-md">
                    {String(activeImage + 1).padStart(2, "0")} /{" "}
                    {String(product.images.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white sm:p-6">
                  <div>
                    <div className="text-[8px] uppercase tracking-[0.34em] opacity-65">
                      Object study
                    </div>
                    <div className="mt-1 max-w-sm text-sm font-semibold sm:text-base">
                      {product.name}
                    </div>
                  </div>
                  <div className="hidden h-10 w-10 place-items-center border border-white/30 backdrop-blur sm:grid">
                    <CircleDot className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`Mostrar imagem ${index + 1}`}
                    aria-pressed={activeImage === index}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-square overflow-hidden border transition ${
                      activeImage === index
                        ? `${surface.border} ring-1 ring-current`
                        : `${surface.border} opacity-55 hover:opacity-100`
                    }`}
                  >
                    <SafeImage
                      src={image}
                      fallbackSrc={fallback}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {activeImage === index && (
                      <motion.span
                        layoutId="active-product-image"
                        className={`absolute inset-x-0 bottom-0 h-1 ${surface.accent}`}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.section>

          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={`flex items-center justify-between gap-4 text-[8px] uppercase tracking-[0.32em] ${surface.eyebrow}`}
            >
              <span>{surface.productKicker}</span>
              <span className={surface.muted}>{product.sku ?? "Curated object"}</span>
            </div>

            <h1 className={`${store.niche === "fashion" ? "font-sans font-semibold" : "font-display"} mt-5 text-5xl leading-[0.9] tracking-[-0.045em] sm:text-6xl lg:text-[4.6rem]`}>
              {product.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className={`flex gap-1 ${surface.eyebrow}`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <div className={`text-[9px] uppercase tracking-[0.24em] ${surface.muted}`}>
                4.9 / experiência demonstrativa
              </div>
              <span className={`h-px w-10 ${surface.accent}`} />
              <div className={`text-[9px] uppercase tracking-[0.24em] ${surface.eyebrow}`}>
                {inStock ? "Disponível agora" : "Lista de espera"}
              </div>
            </div>

            <div className={`mt-8 border-y py-6 ${surface.border}`}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className={`text-[8px] uppercase tracking-[0.3em] ${surface.muted}`}>
                    Valor desta configuração
                  </div>
                  <div className="mt-2 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                    {brl(unitPrice)}
                  </div>
                </div>
                {product.salePrice && (
                  <div className="text-right">
                    <div className={`text-xs line-through ${surface.muted}`}>
                      {brl(product.price)}
                    </div>
                    <div
                      className={`mt-1 text-[8px] uppercase tracking-[0.24em] ${surface.eyebrow}`}
                    >
                      Condição especial
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className={`mt-7 max-w-2xl text-sm leading-7 sm:text-base ${surface.muted}`}>
              {product.description}
            </p>

            {product.variantOptions?.map((option) => (
              <div key={option.name} className={`mt-8 border-t pt-6 ${surface.border}`}>
                <div className="flex items-center justify-between gap-4">
                  <Label className="text-[9px] font-semibold uppercase tracking-[0.3em]">
                    {option.name}
                  </Label>
                  <span className={`text-[9px] ${surface.muted}`}>
                    {selectedOptions[option.name]}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const active = selectedOptions[option.name] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setSelectedOptions((current) => ({ ...current, [option.name]: value }))
                        }
                        className={`relative min-h-12 min-w-12 border px-4 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
                          active
                            ? `${surface.accent} border-transparent text-black`
                            : `${surface.border} ${surface.outlineButton}`
                        }`}
                      >
                        {value}
                        {active && <Check className="absolute right-1 top-1 h-2.5 w-2.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {product.addons && product.addons.length > 0 && (
              <div className={`mt-8 border-t pt-6 ${surface.border}`}>
                <Label className="text-[9px] font-semibold uppercase tracking-[0.3em]">
                  Personalize a experiência
                </Label>
                <div className="mt-4 grid gap-2">
                  {product.addons.map((addon) => (
                    <label
                      key={addon.id}
                      className={`group flex cursor-pointer items-center justify-between border p-4 transition hover:brightness-110 ${surface.border} ${surface.panel}`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <Checkbox
                          checked={selectedAddons.has(addon.id)}
                          onCheckedChange={(checked) => {
                            setSelectedAddons((current) => {
                              const next = new Set(current);
                              if (checked) next.add(addon.id);
                              else next.delete(addon.id);
                              return next;
                            });
                          }}
                        />
                        {addon.name}
                      </span>
                      <span className={`text-xs font-semibold ${surface.eyebrow}`}>
                        + {brl(addon.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {product.allowNotes && (
              <div className={`mt-8 border-t pt-6 ${surface.border}`}>
                <Label
                  htmlFor="premium-product-notes"
                  className="text-[9px] font-semibold uppercase tracking-[0.3em]"
                >
                  Instruções para a casa
                </Label>
                <Textarea
                  id="premium-product-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Ponto, retirada de ingredientes ou observações..."
                  className={`mt-4 min-h-28 rounded-none bg-transparent ${surface.border}`}
                />
              </div>
            )}

            <div className={`mt-8 border-t pt-6 ${surface.border}`}>
              <div className="grid gap-3 sm:grid-cols-[132px_1fr]">
                <div
                  className={`flex h-15 items-center justify-between border ${surface.border} ${surface.panel}`}
                >
                  <button
                    type="button"
                    aria-label="Diminuir quantidade"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="grid h-full w-11 place-items-center transition hover:opacity-55"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold">{String(quantity).padStart(2, "0")}</span>
                  <button
                    type="button"
                    aria-label="Aumentar quantidade"
                    onClick={() => setQuantity((current) => Math.min(stock || 99, current + 1))}
                    className="grid h-full w-11 place-items-center transition hover:opacity-55"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!inStock}
                  className={`group flex h-15 items-center justify-between px-5 text-[10px] font-bold uppercase tracking-[0.24em] transition disabled:cursor-not-allowed disabled:opacity-45 ${surface.button}`}
                >
                  <span className="inline-flex items-center gap-3">
                    <ShoppingBag className="h-4 w-4" />
                    {inStock ? "Adicionar ao carrinho" : "Indisponível"}
                  </span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </div>

              <a
                href={waProductInquiry(store, product.name)}
                target="_blank"
                rel="noreferrer"
                className={`mt-3 flex h-14 items-center justify-between border px-5 text-[9px] font-semibold uppercase tracking-[0.22em] transition ${surface.outlineButton}`}
              >
                <span className="inline-flex items-center gap-3">
                  <MessageCircle className="h-4 w-4" />
                  Falar com um especialista
                </span>
                <ArrowRight className="h-4 w-4" />
              </a>

              {stock > 0 && stock < 10 && (
                <div
                  className={`mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] ${surface.eyebrow}`}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  Últimas {stock} unidades desta configuração
                </div>
              )}
            </div>

            <div className={`mt-8 grid gap-px border sm:grid-cols-3 ${surface.border}`}>
              {[
                [ShieldCheck, surface.proof[0]],
                [Truck, surface.proof[1]],
                [PackageCheck, surface.proof[2]],
              ].map(([Icon, label]) => {
                const ProofIcon = Icon as typeof ShieldCheck;
                return (
                  <div key={String(label)} className={`p-4 ${surface.panel}`}>
                    <ProofIcon className={`h-4 w-4 ${surface.eyebrow}`} />
                    <div className="mt-3 text-[8px] font-semibold uppercase tracking-[0.2em]">
                      {String(label)}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        </div>
      </div>

      <section className={`relative border-y ${surface.border} ${surface.panel}`}>
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[.82fr_1.18fr]">
          <div
            className={`flex flex-col justify-between border-b p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14 ${surface.border}`}
          >
            <div>
              <div className={`text-[9px] uppercase tracking-[0.36em] ${surface.eyebrow}`}>
                Product intelligence
              </div>
              <h2 className={`${store.niche === "fashion" ? "font-sans font-semibold" : "font-display"} mt-5 text-4xl leading-[0.94] sm:text-5xl`}>
                O detalhe não é uma nota de rodapé.
              </h2>
              <p className={`mt-6 max-w-lg text-sm leading-7 ${surface.muted}`}>
                Cada item desta vitrine carrega contexto, disponibilidade e uma experiência de
                compra coerente com a identidade da marca.
              </p>
            </div>
            <Link
              to="/demo/$storeSlug/produtos"
              params={{ storeSlug: store.slug }}
              search={{ q: "", cat: "", sort: "" }}
              className={`group mt-10 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.28em] ${surface.eyebrow}`}
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              Voltar ao catálogo
            </Link>
          </div>

          <div className="grid sm:grid-cols-2">
            {specs.map(([label, value], index) => (
              <motion.div
                key={label}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.06, duration: 0.55 }}
                className={`border-b p-7 sm:p-9 sm:[&:nth-child(odd)]:border-r ${surface.border}`}
              >
                <div className={`text-[8px] uppercase tracking-[0.3em] ${surface.muted}`}>
                  0{index + 1} / {label}
                </div>
                <div className={`${store.niche === "fashion" ? "font-sans font-semibold" : "font-display"} mt-5 text-2xl`}>{value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="mb-10 flex items-end justify-between gap-5">
            <div>
              <div className={`text-[9px] uppercase tracking-[0.34em] ${surface.eyebrow}`}>
                Continue the sequence
              </div>
              <h2 className={`${store.niche === "fashion" ? "font-sans font-semibold" : "font-display"} mt-3 text-4xl sm:text-5xl`}>Próximos objetos.</h2>
            </div>
            <Sparkles className={`hidden h-7 w-7 sm:block ${surface.eyebrow}`} />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} storeSlug={store.slug} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function DetailAmbient({ niche }: { niche: StoreConfig["niche"] }) {
  const background =
    niche === "electronics"
      ? "linear-gradient(rgba(103,232,249,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,.055) 1px, transparent 1px), radial-gradient(circle at 78% 8%, rgba(59,130,246,.22), transparent 30%)"
      : niche === "restaurant"
        ? "radial-gradient(circle at 82% 5%, rgba(255,100,43,.22), transparent 24%), radial-gradient(circle at 8% 40%, rgba(145,45,15,.15), transparent 28%)"
        : niche === "barber"
          ? "linear-gradient(120deg, transparent 38%, rgba(217,177,102,.06), transparent 66%), radial-gradient(circle at 72% 0%, rgba(217,177,102,.09), transparent 24%)"
          : "radial-gradient(circle at 82% 5%, rgba(143,85,72,.15), transparent 26%), linear-gradient(rgba(42,32,29,.035) 1px, transparent 1px)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-80"
      style={{
        backgroundImage: background,
        backgroundSize:
          niche === "electronics"
            ? "42px 42px, 42px 42px, auto"
            : niche === "fashion"
              ? "auto, 100% 44px"
              : "auto",
      }}
    />
  );
}
