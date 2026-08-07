import { createFileRoute } from "@tanstack/react-router";
import { PricingPageV3 } from "@/components/pricing/pricing-page-v3";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e investimento | Vitrine Base" },
      {
        name: "description",
        content:
          "Compare os projetos da Vitrine Base: criação a partir de R$ 1.190, domínio .com.br do primeiro ano incluído e manutenção recorrente opcional.",
      },
      { property: "og:title", content: "Planos e investimento | Vitrine Base" },
      {
        property: "og:description",
        content:
          "Site completo, domínio .com.br por 1 ano incluído e liberdade para escolher manutenção mensal ou suporte sob demanda.",
      },
    ],
  }),
  component: PricingPageV3,
});
