import { MessageCircle } from "lucide-react";
import type { StoreConfig } from "@/types/commerce";
import { waStore } from "@/lib/whatsapp";
import { useMobileMenuState } from "@/components/storefront/mobile-menu-state";

export function WhatsappFab({ store, message }: { store: StoreConfig; message?: string }) {
  const url = waStore(store, message ?? `Olá, ${store.name}! Vim pelo site.`);
  const isBarber = store.niche === "barber";
  const { menuOpen } = useMobileMenuState();
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      aria-hidden={menuOpen ? true : undefined}
      tabIndex={menuOpen ? -1 : undefined}
      className={
        "fixed right-5 z-30 inline-flex items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition duration-300 hover:scale-105 hover:bg-green-600 md:z-40 " +
        (menuOpen
          ? "pointer-events-none scale-90 opacity-0 md:pointer-events-auto md:scale-100 md:opacity-100 "
          : "opacity-100 ") +
        (isBarber
          ? "h-12 w-12 bottom-[6.25rem] md:h-14 md:w-14 md:bottom-5"
          : "h-14 w-14 bottom-24 md:bottom-5")
      }
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <MessageCircle className={isBarber ? "h-5 w-5 md:h-6 md:w-6" : "h-6 w-6"} />
    </a>
  );
}
