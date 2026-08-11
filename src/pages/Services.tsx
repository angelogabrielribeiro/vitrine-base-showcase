import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { services, siteConfig } from "../config/site";
import { updateMeta } from "../lib/analytics";
import { useEffect } from "react";

export function Services() {
  useEffect(() => updateMeta(`Serviços | ${siteConfig.professionalName}`, "Conheça as áreas de atendimento em TI, manutenção tecnológica, finanças, contabilidade e tributos."), []);
  return (
    <div className="page-shell">
      <section className="page-hero compact">
        <span className="section-kicker">Serviços</span>
        <h1>Entre pela necessidade certa.</h1>
        <p>As páginas são separadas para explicar melhor cada frente e também para que anúncios de TI, finanças ou tributos levem direto ao conteúdo correspondente.</p>
      </section>
      <section className="service-index">
        {Object.values(services).map((service, index) => (
          <Link key={service.slug} to={`/${service.slug}`} className="service-row" style={{ "--accent": service.accent } as React.CSSProperties}>
            <span>0{index + 1}</span>
            <div><small>{service.eyebrow}</small><h2>{service.short}</h2><p>{service.description}</p></div>
            <ArrowUpRight />
          </Link>
        ))}
      </section>
    </div>
  );
}
