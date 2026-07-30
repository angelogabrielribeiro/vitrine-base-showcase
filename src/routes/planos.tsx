import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "@/components/pricing/pricing-page";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e investimento | Vitrine Base" },
      {
        name: "description",
        content:
          "Compare os planos de criação e manutenção da Vitrine Base. Sites profissionais para negócios locais, com escopo transparente e proposta personalizada.",
      },
      { property: "og:title", content: "Planos e investimento | Vitrine Base" },
      {
        property: "og:description",
        content:
          "Criação a partir de R$ 1.190 e manutenção com regras claras. Solicite uma proposta personalizada para o seu negócio.",
      },
    ],
  }),
  component: PricingPage,
});
