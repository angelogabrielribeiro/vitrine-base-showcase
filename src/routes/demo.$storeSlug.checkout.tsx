import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, Landmark, CreditCard, Wallet, QrCode } from "lucide-react";
import { getStore } from "@/config/stores";
import { useCart } from "@/hooks/use-cart";
import { useRepo } from "@/hooks/use-repo";
import { brl, orderNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import type { Order, PaymentMethod } from "@/types/commerce";
import { toast } from "sonner";
import { waOrderSummaryToStore, whatsappUrl, markWhatsappPending } from "@/lib/whatsapp";

export const Route = createFileRoute("/demo/$storeSlug/checkout")({
  component: CheckoutPage,
});

const PAYMENT_LABEL: Record<PaymentMethod, { label: string; Icon: typeof CreditCard }> = {
  pix: { label: "Pix", Icon: QrCode },
  credit: { label: "Cartão de crédito", Icon: CreditCard },
  debit: { label: "Cartão de débito", Icon: Landmark },
  cash: { label: "Dinheiro na entrega", Icon: Wallet },
};

function CheckoutPage() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const { items, subtotal, clear } = useCart(storeSlug);
  const repo = useRepo();
  const navigate = useNavigate();

  const availableFulfillments = useMemo(() => {
    const opts: { value: "pickup" | "local" | "shipping"; label: string; fee: number }[] = [];
    if (store.fulfillment.pickup) opts.push({ value: "pickup", label: "Retirada no local", fee: 0 });
    if (store.fulfillment.localDelivery) opts.push({ value: "local", label: "Entrega local", fee: store.deliveryFee });
    if (store.fulfillment.shipping) opts.push({ value: "shipping", label: "Envio", fee: store.deliveryFee });
    return opts;
  }, [store]);

  const [fulfillment, setFulfillment] = useState(availableFulfillments[0]?.value ?? "pickup");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [address, setAddress] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>(store.checkout.payments[0] ?? "pix");
  const [change, setChange] = useState<string>("");
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(store.checkout.marketingConsentDefault);
  const [submitting, setSubmitting] = useState(false);

  const requiresAddress = fulfillment !== "pickup";
  const fee = availableFulfillments.find((f) => f.value === fulfillment)?.fee ?? 0;
  const total = Math.max(0, subtotal + fee - discount);

  const applyCoupon = () => {
    if (!coupon.trim()) return;
    if (coupon.toUpperCase() === "DEMO10") {
      setDiscount(Math.round(subtotal * 0.1 * 100) / 100);
      toast.success("Cupom DEMO10 aplicado (10%)");
    } else {
      setDiscount(0);
      toast.error("Cupom inválido (dica: use DEMO10)");
    }
  };

  const submit = () => {
    if (items.length === 0) {
      toast.error("Carrinho vazio");
      return;
    }
    if (!name.trim() || !whatsapp.trim()) {
      toast.error("Informe seu nome e WhatsApp");
      return;
    }
    if (requiresAddress && (!address.street || !address.number || !address.city)) {
      toast.error("Informe o endereço de entrega");
      return;
    }
    if (!terms) {
      toast.error("É necessário aceitar os termos");
      return;
    }
    setSubmitting(true);

    // Abrir aba/janela provisória AINDA dentro do gesto do usuário para evitar bloqueio de popup.
    let waWindow: Window | null = null;
    if (store.whatsappRequiredAfterCheckout) {
      try {
        waWindow = window.open("", "_blank");
      } catch {
        waWindow = null;
      }
    }

    const num = orderNumber();
    const order: Order = {
      id: num,
      number: num,
      storeSlug,
      createdAt: new Date().toISOString(),
      status: "pago",
      items,
      subtotal,
      deliveryFee: fee,
      discount,
      total,
      customer: { name: name.trim(), whatsapp: whatsapp.replace(/\D/g, ""), email: email.trim() || undefined },
      fulfillment: {
        type: fulfillment,
        address: requiresAddress ? address : undefined,
        notes: notes.trim() || undefined,
      },
      payment: { method: payment, change: payment === "cash" && change ? Number(change) : undefined },
      consents: { terms, marketing },
      demo: true,
    };
    repo.createOrder(storeSlug, order);
    clear();
    setSubmitting(false);

    if (store.whatsappRequiredAfterCheckout) {
      const waHref = whatsappUrl(store.whatsapp, waOrderSummaryToStore(store, order));
      if (waWindow && !waWindow.closed) {
        try {
          waWindow.location.href = waHref;
        } catch {
          markWhatsappPending(num);
        }
      } else {
        markWhatsappPending(num);
      }
    }
    navigate({ to: "/demo/$storeSlug/pedido-confirmado/$orderId", params: { storeSlug, orderId: num } });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Nada para finalizar</h1>
        <Button asChild className="mt-6">
          <Link to="/demo/$storeSlug/produtos" params={{ storeSlug }} search={{ q: "", cat: "", sort: "" }}>Ver produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Checkout</h1>
      <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p>Demonstração: nenhum pagamento é processado. Dados de cartão não são solicitados nem armazenados.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-[var(--radius)] border border-border bg-card p-5">
            <h2 className="font-semibold">Dados de contato</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div><Label htmlFor="name">Nome</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label htmlFor="wa">WhatsApp *</Label><Input id="wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" /></div>
              <div className="sm:col-span-2"><Label htmlFor="email">E-mail (opcional)</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            </div>
          </section>

          <section className="rounded-[var(--radius)] border border-border bg-card p-5">
            <h2 className="font-semibold">Recebimento</h2>
            <RadioGroup className="mt-3" value={fulfillment} onValueChange={(v) => setFulfillment(v as typeof fulfillment)}>
              {availableFulfillments.map((o) => (
                <label key={o.value} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
                  <span className="flex items-center gap-2">
                    <RadioGroupItem value={o.value} id={`f-${o.value}`} />
                    {o.label}
                  </span>
                  <span className="text-muted-foreground">{o.fee ? brl(o.fee) : "Grátis"}</span>
                </label>
              ))}
            </RadioGroup>

            {requiresAddress && (
              <div className="mt-4 grid gap-3 sm:grid-cols-6">
                <div className="sm:col-span-2"><Label>CEP</Label><Input value={address.cep} onChange={(e) => setAddress({ ...address, cep: e.target.value })} /></div>
                <div className="sm:col-span-3"><Label>Rua</Label><Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} /></div>
                <div><Label>Nº</Label><Input value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Complemento</Label><Input value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Bairro</Label><Input value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Cidade</Label><Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /></div>
              </div>
            )}
            <div className="mt-3"><Label>Observações</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Instruções para a loja..." /></div>
          </section>

          <section className="rounded-[var(--radius)] border border-border bg-card p-5">
            <h2 className="font-semibold">Pagamento</h2>
            <RadioGroup className="mt-3 grid gap-2 sm:grid-cols-2" value={payment} onValueChange={(v) => setPayment(v as PaymentMethod)}>
              {store.checkout.payments.map((m) => {
                const meta = PAYMENT_LABEL[m];
                return (
                  <label key={m} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                    <RadioGroupItem value={m} id={`p-${m}`} />
                    <meta.Icon className="h-4 w-4" /> {meta.label}
                  </label>
                );
              })}
            </RadioGroup>

            {(payment === "credit" || payment === "debit") && (
              <div className="mt-4 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                <p className="mb-3">Interface visual apenas — na versão do cliente, os dados serão processados por provedor homologado (ex.: Stripe, Mercado Pago). Nenhum dado real é armazenado nesta demonstração.</p>
                <div className="grid gap-3 sm:grid-cols-6">
                  <div className="sm:col-span-6"><Label>Número do cartão</Label><Input disabled placeholder="•••• •••• •••• ••••" /></div>
                  <div className="sm:col-span-3"><Label>Validade</Label><Input disabled placeholder="MM/AA" /></div>
                  <div className="sm:col-span-3"><Label>CVV</Label><Input disabled placeholder="•••" /></div>
                </div>
              </div>
            )}

            {payment === "cash" && (
              <div className="mt-3">
                <Label>Troco para (opcional)</Label>
                <Input inputMode="numeric" value={change} onChange={(e) => setChange(e.target.value)} placeholder="Ex: 100" />
              </div>
            )}
          </section>

          {store.checkout.allowCoupon && (
            <section className="rounded-[var(--radius)] border border-border bg-card p-5">
              <h2 className="font-semibold">Cupom</h2>
              <div className="mt-3 flex gap-2">
                <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="DEMO10" />
                <Button variant="outline" onClick={applyCoupon}>Aplicar</Button>
              </div>
              {discount > 0 && <p className="mt-2 text-xs text-emerald-600">Desconto aplicado: −{brl(discount)}</p>}
            </section>
          )}

          <section className="space-y-3 rounded-[var(--radius)] border border-border bg-card p-5">
            <label className="flex items-start gap-2 text-sm">
              <Checkbox checked={terms} onCheckedChange={(v) => setTerms(Boolean(v))} />
              <span>Li e aceito os <Link to="/demo/$storeSlug/termos" params={{ storeSlug }} className="underline">termos</Link> e a <Link to="/demo/$storeSlug/privacidade" params={{ storeSlug }} className="underline">política de privacidade</Link>.</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox checked={marketing} onCheckedChange={(v) => setMarketing(Boolean(v))} />
              <span>Aceito receber novidades e ofertas pelo WhatsApp (opcional).</span>
            </label>
          </section>
        </div>

        <aside className="h-fit rounded-[var(--radius)] border border-border bg-card p-5">
          <h2 className="font-semibold">Resumo do pedido</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.key} className="flex justify-between gap-3">
                <span className="line-clamp-1">{i.quantity}× {i.name}</span>
                <span className="shrink-0">{brl(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-3" />
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{brl(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Entrega</dt><dd>{brl(fee)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Desconto</dt><dd>−{brl(discount)}</dd></div>}
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><dt>Total</dt><dd>{brl(total)}</dd></div>
          </dl>
          <Button className="mt-5 w-full" size="lg" onClick={submit} disabled={submitting}>
            Simular pagamento aprovado
          </Button>
          <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground">MODO DEMONSTRAÇÃO</p>
        </aside>
      </div>
    </div>
  );
}
