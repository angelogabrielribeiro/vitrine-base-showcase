import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/demo/$storeSlug/termos")({ component: Page });
function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">Termos de uso</h1>
      <div className="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs">
        Texto provisório para apresentação. Deve ser personalizado antes da versão de produção.
      </div>
      <div className="prose prose-sm mt-6 max-w-none text-sm leading-relaxed text-muted-foreground">
        <p>Ao usar esta loja, você concorda com estes termos. Preços, estoques e prazos podem sofrer alterações sem aviso prévio.</p>
        <p>Nesta versão demonstrativa nenhuma cobrança é realizada e nenhum pedido é efetivamente processado.</p>
      </div>
    </div>
  );
}
