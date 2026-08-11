import { Check, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { StoryScene } from "../components/StoryScene";
import { services, type ServiceSlug } from "../config/site";
import { updateMeta } from "../lib/analytics";
import { openServiceWhatsapp } from "../lib/whatsapp";

const kinds: Record<ServiceSlug, "network" | "hardware" | "finance" | "tax"> = {
  ti: "network",
  manutencao: "hardware",
  financas: "finance",
  contabilidade: "tax",
};

export function ServicePage({ slug }: { slug: ServiceSlug }) {
  const service = services[slug];
  useEffect(() => updateMeta(service.seoTitle, service.seoDescription), [service]);

  return (
    <div className="page-shell service-page" style={{ "--accent": service.accent } as React.CSSProperties}>
      <section className="page-hero service-hero">
        <span className="section-kicker">{service.eyebrow}</span>
        <h1>{service.title}</h1>
        <p>{service.description}</p>
        <button className="primary-button" onClick={() => openServiceWhatsapp(slug)}><MessageCircle size={18} /> Solicitar atendimento</button>
      </section>
      <StoryScene kind={kinds[slug]} accent={service.accent} eyebrow="Como esta área é apresentada" title="A animação explica a lógica do serviço, não só decora a página." copy={service.description} />
      <section className="service-detail-grid">
        <div><span className="section-kicker">Pode envolver</span><h2>Atendimento adaptado ao problema.</h2></div>
        <ul>{service.bullets.map((bullet) => <li key={bullet}><Check size={18} /> {bullet}</li>)}</ul>
      </section>
      <section className="service-cta"><h2>Quer explicar sua situação antes de decidir qualquer coisa?</h2><button className="primary-button" onClick={() => openServiceWhatsapp(slug)}>Abrir conversa no WhatsApp</button></section>
    </div>
  );
}
