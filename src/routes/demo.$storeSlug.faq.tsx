import { createFileRoute } from "@tanstack/react-router";
import { getStore } from "@/config/stores";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/demo/$storeSlug/faq")({
  component: Page,
  head: ({ params }) => {
    const s = getStore(params.storeSlug);
    return {
      meta: [
        { title: `Perguntas frequentes — ${s?.name ?? "Loja"}` },
        { name: "description", content: `Dúvidas comuns sobre a ${s?.name ?? "loja"}.` },
        { property: "og:title", content: `Perguntas frequentes — ${s?.name ?? "Loja"}` },
        { property: "og:description", content: `Dúvidas comuns sobre a ${s?.name ?? "loja"}.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
});

function Page() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-[clamp(1.6rem,7vw,2.4rem)] font-semibold leading-tight">
        Perguntas frequentes
      </h1>
      <Accordion type="single" collapsible className="mt-8">
        {store.faq.map((f, i) => (
          <AccordionItem key={i} value={`f${i}`}>
            <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
