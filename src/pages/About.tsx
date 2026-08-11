import { Play } from "lucide-react";
import { useEffect } from "react";
import { siteConfig } from "../config/site";
import { updateMeta } from "../lib/analytics";

export function About() {
  useEffect(() => updateMeta(`Sobre | ${siteConfig.professionalName}`, "Conheça o profissional por trás do atendimento em tecnologia, finanças e tributos."), []);
  return (
    <div className="page-shell">
      <section className="page-hero compact"><span className="section-kicker">Sobre</span><h1>Presença profissional sem fabricar uma empresa que não existe.</h1><p>O site foi estruturado para apresentar um profissional individual, conhecido localmente, com atuação em TI e serviços complementares por fora do emprego registrado.</p></section>
      <section className="about-full">
        <div className="portrait-placeholder"><span>FOTO REAL</span><strong>{siteConfig.professionalName}</strong><small>Adicionar em src/config/site.ts</small></div>
        <div className="about-narrative"><h2>Competência aparece melhor quando existe contexto.</h2><p>Fotos do dia a dia, vídeo trabalhando e exemplos reais de situações atendidas podem entrar aqui depois, sem reconstruir o layout. A primeira versão evita inventar currículo, certificações, clientes ou números.</p><p>A base de atendimento fica entre {siteConfig.locations.join(" e ")}, com suporte remoto quando tecnicamente possível.</p><div className="video-strip"><Play /><span>Espaço preparado para vídeo real de trabalho.</span></div></div>
      </section>
    </div>
  );
}
