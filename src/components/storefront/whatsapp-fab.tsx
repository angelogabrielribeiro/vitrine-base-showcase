import { MessageCircle } from "lucide-react";
import type { StoreConfig } from "@/types/commerce";
import { waStore } from "@/lib/whatsapp";

export function WhatsappFab({ store, message }: { store: StoreConfig; message?: string }) {
  const url = waStore(store, message ?? `Olá, ${store.name}! Vim pelo site.`);
  const isBarber = store.niche === "barber";
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className={
        "fixed right-5 z-50 inline-flex items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-105 hover:bg-green-600 " +
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
