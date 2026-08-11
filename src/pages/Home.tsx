import { ArrowRight, MessageCircle, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { ShaderHero } from "../components/ShaderHero";
import { ServiceGalaxy } from "../components/ServiceGalaxy";
import { StoryScene } from "../components/StoryScene";
import { services, siteConfig } from "../config/site";
import { openGeneralWhatsapp } from "../lib/whatsapp";
import { useEffect } from "react";
import { updateMeta } from "../lib/analytics";

export function Home() {
  useEffect(() => {
    updateMeta(
      `${siteConfig.professionalName} — Tecnologia, finanças e tributos`,
      "Atendimento profissional em tecnologia, manutenção, finanças e tributos em Conceição do Araguaia, Couto Magalhães e remoto quando aplicável.",
    );
  }, []);

  return (
    <>
      <ShaderHero />
      <section className="manifesto">
        <span className="section-kicker">O princípio</span>
        <h2>Antes de vender um serviço, entender o problema.</h2>
        <p>O site foi desenhado para separar assuntos diferentes sem criar uma parede entre eles. Tecnologia, operação, finanças e tributos têm uma coisa em comum: quando a informação fica confusa, a decisão fica pior.</p>
      </section>

      <ServiceGalaxy />

      <StoryScene kind="network" accent={services.ti.accent} eyebrow="01 · TI e sistemas" title="Encontrar o ponto de falha antes de sair clicando em tudo." copy="Diagnóstico, configuração, suporte a computadores, softwares e sistemas. A animação conecta e isola nós para representar o caminho entre sintoma e solução." />
      <StoryScene kind="hardware" accent={services.manutencao.accent} eyebrow="02 · Manutenção tecnológica" title="Abrir o problema em camadas, não no chute." copy="A cena desmonta entrada, processo e saída para comunicar manutenção como leitura técnica e continuidade de operação, não como uma lista genérica de reparos." />
      <StoryScene kind="finance" accent={services.financas.accent} eyebrow="03 · Finanças" title="Números dispersos começam a formar uma leitura." copy="Fluxos irregulares se alinham em uma estrutura legível. A ideia visual é simples: clareza não nasce de mais informação, mas de informação melhor organizada." />
      <StoryScene kind="tax" accent={services.contabilidade.accent} eyebrow="04 · Contabilidade e tributos" title="Do ruído documental para uma sequência compreensível." copy="Blocos incompletos se resolvem progressivamente. É a tradução visual de uma conversa fiscal sem juridiquês performático e sem prometer mágica." />

      <section className="about-teaser">
        <div className="media-placeholder">
          <Play size={36} />
          <strong>Vídeo real do profissional</strong>
          <span>Substituir em src/config/site.ts quando o material estiver disponível.</span>
        </div>
        <div className="about-copy">
          <span className="section-kicker">Quem atende</span>
          <h2>Um profissional. Uma conversa direta. Sem fingir que existe uma corporação atrás da tela.</h2>
          <p>Este espaço foi preparado para fotos e vídeo reais de trabalho, porque confiança local não deveria depender de banco de imagem com sujeito aleatório sorrindo para um notebook.</p>
          <Link to="/sobre" className="text-link">Conhecer o profissional <ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="final-cta">
        <span>Conceição do Araguaia · Couto Magalhães · remoto quando aplicável</span>
        <h2>Explique o que está acontecendo. O atendimento começa pela situação real.</h2>
        <button className="primary-button" onClick={openGeneralWhatsapp}><MessageCircle size={18} /> Falar no WhatsApp</button>
      </section>
    </>
  );
}
