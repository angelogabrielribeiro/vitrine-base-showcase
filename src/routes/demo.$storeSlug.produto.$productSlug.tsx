import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageCircle, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { useCart } from "@/hooks/use-cart";
import { brl } from "@/lib/format";
import { waProductInquiry } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/storefront/product-card";
import { toast } from "sonner";

export const Route = createFileRoute("/demo/$storeSlug/produto/$productSlug")({
  component: ProductPage,
});

function ProductPage() {
  const { storeSlug, productSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const product = repo.getProduct(storeSlug, productSlug);
  if (!product) throw notFound();
  const { add } = useCart(storeSlug);

  // Variantes
  const optionNames = product.variantOptions?.map((o) => o.name) ?? [];
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const o of product.variantOptions ?? []) init[o.name] = o.values[0];
    return init;
  });
  const variant = useMemo(() => {
    if (!product.variants || !product.variants.length) return undefined;
    return product.variants.find((v) =>
      optionNames.every((n) => v.attributes[n] === selectedOptions[n]),
    );
  }, [product, selectedOptions, optionNames]);

  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  // Se o produto declara variantes mas a combinação selecionada não existe,
  // não herdar o estoque geral — a combinação é indisponível.
  const hasVariants = !!(product.variants && product.variants.length);
  const stock = hasVariants ? (variant ? variant.stock : 0) : product.stock;
  const inStock = stock > 0;

  const basePrice = product.salePrice ?? product.price;
  const addons =
    product.addons?.filter((a) => selectedAddons.has(a.id)) ?? [];
  const addonTotal = addons.reduce((s, a) => s + a.price, 0);
  const unitPrice = basePrice + (variant?.priceDelta ?? 0) + addonTotal;

  const related = repo
    .listProducts(storeSlug)
    .filter((p) => p.id !== product.id && p.category === product.category && p.active)
    .slice(0, 4);

  const handleAdd = () => {
    if (!inStock) return;
    add({ product, quantity, variant, addons, notes });
    toast.success("Adicionado ao carrinho", { description: product.name });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="text-xs text-muted-foreground">
        <Link to="/demo/$storeSlug" params={{ storeSlug }} className="hover:underline">Início</Link>
        {" / "}
        <Link to="/demo/$storeSlug/produtos" params={{ storeSlug }} search={{ q: "", cat: "", sort: "" }} className="hover:underline">Produtos</Link>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-[var(--radius)] bg-muted">
            <div className="aspect-[4/5] w-full bg-cover bg-center" style={{ backgroundImage: `url(${product.images[activeImage]})` }} />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  aria-label={`Imagem ${i + 1}`}
                  onClick={() => setActiveImage(i)}
                  className={
                    "h-16 w-16 overflow-hidden rounded-md border-2 bg-cover bg-center " +
                    (activeImage === i ? "border-primary" : "border-transparent")
                  }
                  style={{ backgroundImage: `url(${src})` }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span>4.9 · avaliações demonstrativas</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            {product.salePrice ? (
              <>
                <span className="text-3xl font-semibold">{brl(unitPrice)}</span>
                <span className="text-sm text-muted-foreground line-through">{brl(product.price)}</span>
              </>
            ) : (
              <span className="text-3xl font-semibold">{brl(unitPrice)}</span>
            )}
            {product.unit && <span className="text-sm text-muted-foreground">/{product.unit}</span>}
          </div>
          {!inStock && <Badge variant="secondary" className="mt-2">Esgotado</Badge>}

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {product.variantOptions?.map((opt) => (
            <div key={opt.name} className="mt-6">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{opt.name}</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {opt.values.map((v) => {
                  const active = selectedOptions[opt.name] === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setSelectedOptions((s) => ({ ...s, [opt.name]: v }))}
                      className={
                        "min-h-10 min-w-10 rounded-md border px-3 text-sm transition " +
                        (active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")
                      }
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {product.addons && product.addons.length > 0 && (
            <div className="mt-6">
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Adicionais</Label>
              <div className="mt-2 space-y-2">
                {product.addons.map((a) => (
                  <label key={a.id} className="flex cursor-pointer items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedAddons.has(a.id)}
                        onCheckedChange={(c) => {
                          setSelectedAddons((prev) => {
                            const n = new Set(prev);
                            if (c) n.add(a.id);
                            else n.delete(a.id);
                            return n;
                          });
                        }}
                      />
                      {a.name}
                    </span>
                    <span className="font-medium">+ {brl(a.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {product.allowNotes && (
            <div className="mt-6">
              <Label htmlFor="notes" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Observações</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: sem cebola, sem pimenta..." className="mt-2" />
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir"><Minus className="h-4 w-4" /></Button>
              <div className="w-10 text-center text-sm font-medium">{quantity}</div>
              <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))} aria-label="Aumentar"><Plus className="h-4 w-4" /></Button>
            </div>
            <Button size="lg" onClick={handleAdd} disabled={!inStock} className="flex-1 sm:flex-initial">
              <ShoppingBag className="mr-2 h-4 w-4" /> {inStock ? "Adicionar ao carrinho" : "Indisponível"}
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={waProductInquiry(store, product.name)} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> Dúvida no WhatsApp
              </a>
            </Button>
          </div>

          {stock > 0 && stock < 10 && (
            <p className="mt-3 text-xs text-amber-600">Últimas unidades: {stock}</p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Você também pode gostar</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} storeSlug={storeSlug} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
