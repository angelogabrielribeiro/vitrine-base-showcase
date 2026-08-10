import { createFileRoute } from "@tanstack/react-router";
import { PricingPageV4 } from "@/components/pricing/pricing-page-v4";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e investimento | SAV Digital · Vitrine Base" },
      {
        name: "description",
        content:
          "Compare os projetos da SAV Digital na Vitrine Base: criação a partir de R$ 1.190, domínio .com.br do primeiro ano incluído e infraestrutura mensal a partir de R$ 249 somente quando o projeto usa sistema, banco, login ou painel.",
      },
      { property: "og:title", content: "Planos e investimento | SAV Digital · Vitrine Base" },
      {
        property: "og:description",
        content:
          "Sites, mensuração e operação sob medida pela SAV Digital. Site vitrine pode operar sem mensalidade técnica; projetos com sistema usam infraestrutura de produção.",
      },
    ],
  }),
  component: PricingPageV4,
});
