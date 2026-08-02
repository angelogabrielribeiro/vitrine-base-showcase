import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, MapPin, MessageCircle } from "lucide-react";
import { getStore } from "@/config/stores";
import { waStore } from "@/lib/whatsapp";

export const Route = createFileRoute("/demo/$storeSlug/contato")({
  component: Page,
  head: ({ params }) => {
    const s = getStore(params.storeSlug);
    return {
      meta: [
        { title: `Contato — ${s?.name ?? "Loja"}` },
        { name: "description", content: `Endereço, horários e WhatsApp da ${s?.name ?? "loja"}.` },
        { property: "og:title", content: `Contato — ${s?.name ?? "Loja"}` },
        {
          property: "og:description",
          content: `Endereço, horários e WhatsApp da ${s?.name ?? "loja"}.`,
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
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-[clamp(1.6rem,7vw,2.4rem)] font-semibold leading-tight">
        Contato
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Fale com a equipe da {store.name} pelo canal que preferir. O atendimento é feito pelas
        mesmas pessoas que estão na loja.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary" /> Endereço
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{store.address}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4 text-primary" /> Horários
          </div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {store.hours.map((h) => (
              <li key={h.label}>
                {h.label}: {h.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={waStore(store, `Olá, ${store.name}! Quero falar com a equipe.`)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a
          href={`https://instagram.com/${store.instagram.replace("@", "")}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold"
        >
          <Instagram className="h-4 w-4" /> {store.instagram}
        </a>
      </div>
    </div>
  );
}
