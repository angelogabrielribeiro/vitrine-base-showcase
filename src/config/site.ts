export type ServiceSlug = "ti" | "manutencao" | "financas" | "contabilidade";

export type ServiceConfig = {
  slug: ServiceSlug;
  short: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  secondary: string;
  whatsappMessage: string;
  bullets: string[];
  seoTitle: string;
  seoDescription: string;
};

export const siteConfig = {
  professionalName: "SEU NOME",
  role: "Tecnologia, finanças e tributos",
  whatsapp: "5500000000000",
  email: "SEU_EMAIL@EXEMPLO.COM",
  locations: ["Conceição do Araguaia — PA", "Couto Magalhães — TO"],
  remoteSupport: true,
  media: {
    portrait: "",
    workVideo: "",
  },
  analytics: {
    ga4Id: "",
    metaPixelId: "",
  },
} as const;

export const services: Record<ServiceSlug, ServiceConfig> = {
  ti: {
    slug: "ti",
    short: "TI & Sistemas",
    eyebrow: "Diagnóstico, suporte e continuidade",
    title: "Tecnologia que volta a trabalhar a seu favor.",
    description:
      "Atendimento técnico para computadores, softwares, sistemas e rotinas digitais. Presencial e remoto quando o problema permitir.",
    accent: "#55d6d0",
    secondary: "#2d8aa0",
    whatsappMessage: "Olá, vi seu site e gostaria de falar sobre suporte de TI.",
    bullets: [
      "Suporte técnico e diagnóstico",
      "Configuração de computadores e softwares",
      "Resolução de problemas em sistemas",
      "Orientação de uso e suporte empresarial",
      "Atendimento remoto quando aplicável",
    ],
    seoTitle: "Suporte de TI em Conceição do Araguaia | SEU NOME",
    seoDescription:
      "Suporte de TI, computadores, softwares e sistemas em Conceição do Araguaia, Couto Magalhães e atendimento remoto quando aplicável.",
  },
  manutencao: {
    slug: "manutencao",
    short: "Manutenção",
    eyebrow: "Equipamentos, continuidade e prevenção",
    title: "Manutenção tecnológica sem reduzir tudo a uma formatação.",
    description:
      "Manutenção e suporte em equipamentos e produtos de tecnologia, com leitura do problema antes da intervenção e foco em restabelecer a operação.",
    accent: "#7ec8ff",
    secondary: "#5367b8",
    whatsappMessage: "Olá, vi seu site e gostaria de falar sobre manutenção tecnológica.",
    bullets: [
      "Análise e identificação de falhas",
      "Manutenção de equipamentos tecnológicos",
      "Configuração e retorno à operação",
      "Atendimento a necessidades empresariais",
      "Orientação sobre prevenção e uso",
    ],
    seoTitle: "Manutenção tecnológica em Conceição do Araguaia | SEU NOME",
    seoDescription:
      "Manutenção e suporte tecnológico para pessoas e empresas em Conceição do Araguaia e região.",
  },
  financas: {
    slug: "financas",
    short: "Finanças",
    eyebrow: "Organização antes da decisão",
    title: "Dados financeiros mais claros para decisões mais conscientes.",
    description:
      "Apoio em demandas financeiras com abordagem direta, organizada e compreensível, sem transformar números em um labirinto.",
    accent: "#75d6a2",
    secondary: "#3b8c68",
    whatsappMessage: "Olá, vi seu site e gostaria de conversar sobre serviços financeiros.",
    bullets: [
      "Organização de informações financeiras",
      "Apoio em rotinas e necessidades administrativas",
      "Leitura estruturada de dados e documentos",
      "Atendimento próximo e contextual",
    ],
    seoTitle: "Serviços financeiros em Conceição do Araguaia | SEU NOME",
    seoDescription:
      "Atendimento em demandas financeiras e administrativas em Conceição do Araguaia, Couto Magalhães e região.",
  },
  contabilidade: {
    slug: "contabilidade",
    short: "Tributos & Contabilidade",
    eyebrow: "Informação fiscal com menos ruído",
    title: "Tributos, documentos e obrigações explicados com clareza.",
    description:
      "Atendimento relacionado a contabilidade, impostos, orientação fiscal e necessidades administrativas, com comunicação simples e responsável.",
    accent: "#f0c778",
    secondary: "#9d6c37",
    whatsappMessage: "Olá, vi seu site e gostaria de conversar sobre serviços contábeis e tributários.",
    bullets: [
      "Orientação relacionada a impostos",
      "Demandas contábeis e fiscais",
      "Organização documental",
      "Apoio em necessidades administrativas relacionadas",
    ],
    seoTitle: "Contabilidade e impostos em Conceição do Araguaia | SEU NOME",
    seoDescription:
      "Atendimento em contabilidade, impostos e orientação fiscal em Conceição do Araguaia, Couto Magalhães e região.",
  },
};
