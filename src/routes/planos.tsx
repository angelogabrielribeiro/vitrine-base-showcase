import { createFileRoute } from "@tanstack/react-router";
import { PricingPageV3 } from "@/components/pricing/pricing-page-v3";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e investimento | Vitrine Base" },
      {
        name: "description",
        content:
          "Compare os projetos da Vitrine Base: criação a partir de R$ 1.190, domínio .com.br do primeiro ano incluído e infraestrutura mensal somente quando o projeto usa sistema, banco, login ou painel.",
      },
      { property: "og:title", content: "Planos e investimento | Vitrine Base" },
      {
        property: "og:description",
        content:
          "Site vitrine pode operar sem mensalidade técnica. Projetos com pedidos persistidos, agenda, login ou painel usam infraestrutura operacional de produção.",
      },
    ],
  }),
  component: PricingPageV3,
});
