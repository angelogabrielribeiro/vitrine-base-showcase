import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Clock } from "lucide-react";
import type { StoreConfig } from "@/types/commerce";

const FOOTER_TONE = {
  fashion: "border-[#d49aa7]/18 bg-[#180c12] text-[#f7eee8] [&_.footer-muted]:text-[#cfaeb7]",
  barber: "border-white/10 bg-[#070809] text-[#f7f3ea] [&_.footer-muted]:text-neutral-400",
  restaurant: "border-orange-300/15 bg-[#120603] text-[#fff4e8] [&_.footer-muted]:text-orange-100/55",
  electronics: "border-cyan-200/15 bg-[#030611] text-white [&_.footer-muted]:text-slate-400",
} as const;

export function StoreFooter({ store }: { store: StoreConfig }) {
  return (
    <footer className={`border-t ${FOOTER_TONE[store.niche]}`}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="font-display text-xl font-semibold">{store.logoText}</div>
          <p className="mt-3 max-w-xs text-sm footer-muted">{store.description}</p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest footer-muted">Endereço</div>
          <p className="flex gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            {store.address}
          </p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest footer-muted">Horários</div>
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
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest footer-muted">Institucional</div>
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
              <Link to="/demo/$storeSlug/entrega" params={{ storeSlug: store.slug }} className="hover:text-primary">
                Entrega e frete
              </Link>
            </li>
            <li>
              <Link to="/demo/$storeSlug/faq" params={{ storeSlug: store.slug }} className="hover:text-primary">
                Perguntas frequentes
              </Link>
            </li>
            <li>
              <Link to="/demo/$storeSlug/contato" params={{ storeSlug: store.slug }} className="hover:text-primary">
                Contato
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
      <div className="border-t border-current/10 py-4 text-center text-xs footer-muted">
        © {new Date().getFullYear()} {store.name} · Modelo demonstrativo · Nenhum pagamento é processado
      </div>
    </footer>
  );
}
