import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Clock } from "lucide-react";
import type { StoreConfig } from "@/types/commerce";

export function StoreFooter({ store }: { store: StoreConfig }) {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="font-display text-xl font-semibold">{store.logoText}</div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{store.description}</p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Endereço</div>
          <p className="flex gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            {store.address}
          </p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Horários</div>
          <ul className="space-y-1 text-sm">
            {store.hours.map((h) => (
              <li key={h.label} className="flex gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                {h.label}: {h.value}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Institucional</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/demo/$storeSlug/privacidade" params={{ storeSlug: store.slug }} className="hover:text-primary">
                Privacidade
              </Link>
            </li>
            <li>
              <Link to="/demo/$storeSlug/termos" params={{ storeSlug: store.slug }} className="hover:text-primary">
                Termos
              </Link>
            </li>
            <li>
              <Link to="/demo/$storeSlug/trocas" params={{ storeSlug: store.slug }} className="hover:text-primary">
                Trocas
              </Link>
            </li>
            <li>
              <a
                href={`https://instagram.com/${store.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
                {store.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {store.name} · Modelo demonstrativo · Nenhum pagamento é processado
      </div>
    </footer>
  );
}
