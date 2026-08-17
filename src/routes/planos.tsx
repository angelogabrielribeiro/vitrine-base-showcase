import { createFileRoute } from "@tanstack/react-router";
import { PricingPageV4 } from "@/components/pricing/pricing-page-v4";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e investimento | SAV Digital · Vitrine Base" },
      {
        name: "description",
        content:
          "Compare os projetos da SAV Digital: site profissional e animado a partir de R$ 940, domínio .com.br do primeiro ano, SEO, Analytics e Search Console incluídos. Infraestrutura mensal só quando houver sistema, banco, login ou painel.",
      },
      { property: "og:title", content: "Planos e investimento | SAV Digital · Vitrine Base" },
      {
        property: "og:description",
        content:
          "Sites profissionais e animados a partir de R$ 940. O Essencial já inclui direção visual, SEO, Analytics, Search Console, domínio e publicação; sistema só paga infraestrutura quando precisa.",
      },
    ],
  }),
  component: PricingPageV4,
});
