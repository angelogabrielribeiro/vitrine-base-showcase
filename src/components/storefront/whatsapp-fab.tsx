import { MessageCircle } from "lucide-react";
import type { StoreConfig } from "@/types/commerce";
import { waStore } from "@/lib/whatsapp";

export function WhatsappFab({ store, message }: { store: StoreConfig; message?: string }) {
  const url = waStore(store, message ?? `Olá, ${store.name}! Vim pelo site.`);
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed right-5 bottom-24 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-105 hover:bg-green-600 md:bottom-5"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
