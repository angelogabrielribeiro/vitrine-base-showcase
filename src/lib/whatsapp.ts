import { siteConfig, type ServiceSlug } from "../config/site";
import { services } from "../config/site";
import { trackEvent } from "./analytics";

export function whatsappUrl(message: string) {
  const phone = siteConfig.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function openServiceWhatsapp(slug: ServiceSlug) {
  const service = services[slug];
  trackEvent("whatsapp_click", { service: slug, page: window.location.pathname });
  window.open(whatsappUrl(service.whatsappMessage), "_blank", "noopener,noreferrer");
}

export function openGeneralWhatsapp() {
  trackEvent("whatsapp_click", { service: "general", page: window.location.pathname });
  window.open(
    whatsappUrl("Olá, vi seu site e gostaria de entender qual atendimento se encaixa melhor no que preciso."),
    "_blank",
    "noopener,noreferrer",
  );
}
