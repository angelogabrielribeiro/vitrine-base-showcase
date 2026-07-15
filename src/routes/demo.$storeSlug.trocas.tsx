import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/demo/$storeSlug/trocas")({ component: Page });
function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">Trocas e devoluções</h1>
      <div className="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs">
        Texto provisório para apresentação. Ajustar conforme regra comercial do cliente.
      </div>
      <div className="prose prose-sm mt-6 max-w-none text-sm leading-relaxed text-muted-foreground">
        <p>Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor.</p>
        <p>Peças devem ser devolvidas sem uso, com etiquetas e embalagem originais.</p>
        <p>Entre em contato pelo WhatsApp da loja para iniciar o processo.</p>
      </div>
    </div>
  );
}
