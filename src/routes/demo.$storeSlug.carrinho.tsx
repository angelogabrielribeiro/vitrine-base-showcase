import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, MessageCircle, ArrowRight } from "lucide-react";
import { getStore } from "@/config/stores";
import { useCart } from "@/hooks/use-cart";
import { brl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { waStore } from "@/lib/whatsapp";
import { useHydrated } from "@/hooks/use-hydrated";

export const Route = createFileRoute("/demo/$storeSlug/carrinho")({
  component: CartPage,
});

function CartPage() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const { items, subtotal, setQuantity, remove } = useCart(storeSlug);
  const hydrated = useHydrated();
  const deliveryPreview = store.deliveryFee;

  if (!hydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-10">Carregando carrinho...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="font-display mt-4 text-2xl font-semibold">Seu carrinho está vazio</h1>
        <p className="mt-2 text-sm text-muted-foreground">Explore o catálogo e adicione produtos.</p>
        <Button asChild className="mt-6">
          <Link to="/demo/$storeSlug/produtos" params={{ storeSlug }} search={{ q: "", cat: "", sort: "" }}>Ver produtos</Link>
        </Button>
      </div>
    );
  }

  const total = subtotal + deliveryPreview;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Seu carrinho</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.key} className="flex gap-4 rounded-[var(--radius)] border border-border bg-card p-3">
              <div className="h-24 w-24 shrink-0 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${i.image})` }} />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    {i.variantLabel && <div className="text-xs text-muted-foreground">{i.variantLabel}</div>}
                    {i.addons && i.addons.length > 0 && (
                      <div className="text-xs text-muted-foreground">+ {i.addons.map((a) => a.name).join(", ")}</div>
                    )}
                    {i.notes && <div className="text-xs italic text-muted-foreground">Obs: {i.notes}</div>}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{brl(i.unitPrice * i.quantity)}</div>
                    <div className="text-xs text-muted-foreground">{brl(i.unitPrice)} cada</div>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-border">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(i.key, i.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <div className="w-8 text-center text-sm">{i.quantity}</div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(i.key, i.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove(i.key)}><Trash2 className="mr-1 h-3 w-3" />Remover</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-[var(--radius)] border border-border bg-card p-5">
          <h2 className="font-semibold">Resumo</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{brl(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Entrega (estimada)</dt><dd>{brl(deliveryPreview)}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><dt>Total</dt><dd>{brl(total)}</dd></div>
          </dl>
          {store.minOrder > 0 && subtotal < store.minOrder && (
            <p className="mt-3 text-xs text-amber-600">Pedido mínimo desta loja: {brl(store.minOrder)}</p>
          )}
          <Button asChild className="mt-5 w-full" disabled={store.minOrder > 0 && subtotal < store.minOrder}>
            <Link to="/demo/$storeSlug/checkout" params={{ storeSlug }}>Ir para o checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="mt-2 w-full">
            <a href={waStore(store, `Olá! Tenho uma dúvida sobre o meu carrinho na ${store.name}.`)} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> Dúvida no WhatsApp
            </a>
          </Button>
        </aside>
      </div>
    </div>
  );
}
