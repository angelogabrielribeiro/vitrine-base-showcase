import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/demo/$storeSlug/privacidade")({ component: Page });
function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">Política de privacidade</h1>
      <div className="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs">
        Texto provisório para apresentação. Deve ser revisado por advogado antes da versão de produção.
      </div>
      <div className="prose prose-sm mt-6 max-w-none text-sm leading-relaxed text-muted-foreground">
        <p>Coletamos apenas os dados necessários para processar seu pedido e entrar em contato: nome, WhatsApp, endereço (quando aplicável) e histórico de compras.</p>
        <p>Não compartilhamos seus dados com terceiros sem seu consentimento, exceto quando exigido por lei ou para viabilizar a entrega do pedido (transportadora, provedor de pagamento).</p>
        <p>Nesta demonstração, nenhum dado é enviado a servidores. Tudo permanece localmente no seu navegador.</p>
        <p>Para exercer seus direitos previstos na LGPD, entre em contato pelos canais informados no rodapé.</p>
      </div>
    </div>
  );
}
