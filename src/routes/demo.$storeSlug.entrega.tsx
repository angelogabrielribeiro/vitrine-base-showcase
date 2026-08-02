import { createFileRoute } from "@tanstack/react-router";
import { getStore } from "@/config/stores";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/demo/$storeSlug/entrega")({
  component: Page,
  head: ({ params }) => {
    const s = getStore(params.storeSlug);
    return {
      meta: [
        { title: `Entrega e frete — ${s?.name ?? "Loja"}` },
        {
          name: "description",
          content: `Formas de entrega, retirada e prazos da ${s?.name ?? "loja"}.`,
        },
        { property: "og:title", content: `Entrega e frete — ${s?.name ?? "Loja"}` },
        {
          property: "og:description",
          content: `Formas de entrega, retirada e prazos da ${s?.name ?? "loja"}.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
});

function Page() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const { pickup, localDelivery, shipping } = store.fulfillment;
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-[clamp(1.6rem,7vw,2.4rem)] font-semibold leading-tight">
        Entrega e frete
      </h1>
      <div className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs">
        Conteúdo demonstrativo. Ajustar prazos e valores conforme a operação do cliente.
      </div>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {pickup && (
          <p>
            <strong className="text-foreground">Retirada na loja:</strong> sem custo, no endereço{" "}
            {store.address}, dentro dos horários de atendimento.
          </p>
        )}
        {localDelivery && (
          <p>
            <strong className="text-foreground">Entrega local:</strong> taxa de{" "}
            {store.deliveryFee > 0 ? brl(store.deliveryFee) : "cortesia"} para a região atendida,
            com pedido mínimo de {brl(store.minOrder)}.
          </p>
        )}
        {shipping && (
          <p>
            <strong className="text-foreground">Envio:</strong> despacho em até 2 dias úteis após a
            confirmação, com código de rastreio enviado no WhatsApp.
          </p>
        )}
        <p>
          Qualquer alteração de endereço pode ser combinada pelo WhatsApp da loja antes do despacho.
        </p>
      </div>
    </div>
  );
}
