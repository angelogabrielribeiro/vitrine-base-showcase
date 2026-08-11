import { MapPin, MessageCircle, MonitorSmartphone } from "lucide-react";
import { useEffect } from "react";
import { services, siteConfig } from "../config/site";
import { updateMeta } from "../lib/analytics";
import { openGeneralWhatsapp, openServiceWhatsapp } from "../lib/whatsapp";

export function Contact() {
  useEffect(() => updateMeta(`Contato | ${siteConfig.professionalName}`, "Entre em contato para atendimento em tecnologia, finanças, contabilidade e tributos."), []);
  return (
    <div className="page-shell">
      <section className="page-hero compact"><span className="section-kicker">Contato</span><h1>Comece pela área que mais se aproxima do problema.</h1><p>As mensagens são pré-preenchidas por serviço para tornar a conversa mais objetiva e permitir mensuração de interesse quando os eventos de analytics forem configurados.</p></section>
      <section className="contact-grid">
        <button className="contact-main" onClick={openGeneralWhatsapp}><MessageCircle /><strong>Atendimento geral</strong><span>Não sabe em qual área se encaixa? Comece aqui.</span></button>
        <div className="contact-locations"><div><MapPin /><span>{siteConfig.locations[0]}</span></div><div><MapPin /><span>{siteConfig.locations[1]}</span></div><div><MonitorSmartphone /><span>Suporte remoto quando aplicável</span></div></div>
      </section>
      <section className="contact-services">{Object.values(services).map((service) => <button key={service.slug} onClick={() => openServiceWhatsapp(service.slug)} style={{ "--accent": service.accent } as React.CSSProperties}><small>{service.eyebrow}</small><strong>{service.short}</strong><span>Abrir WhatsApp</span></button>)}</section>
      <p className="config-note">Antes da publicação: substituir o WhatsApp placeholder <code>{siteConfig.whatsapp}</code> em <code>src/config/site.ts</code>.</p>
    </div>
  );
}
