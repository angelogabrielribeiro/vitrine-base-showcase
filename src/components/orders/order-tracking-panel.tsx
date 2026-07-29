import { Bike, Check, ChefHat, CircleDot, Clock3, PackageCheck, Store } from "lucide-react";
import { useTrackingClock } from "@/hooks/use-tracking-clock";
import { getOrderTrackingSnapshot, type TrackingStageId } from "@/lib/order-tracking";
import type { Order } from "@/types/commerce";

const STAGE_ICON: Record<TrackingStageId, typeof CircleDot> = {
  recebido: CircleDot,
  aceito: Store,
  preparo: ChefHat,
  pronto: PackageCheck,
  saiu: Bike,
  entregue: Check,
};

function secondsUntil(timestamp: number | undefined, now: number): number {
  if (!timestamp || !now) return 0;
  return Math.max(0, Math.ceil((timestamp - now) / 1_000));
}

export function OrderTrackingPanel({ order }: { order: Order }) {
  const now = useTrackingClock(true);
  const effectiveNow = now || new Date(order.createdAt).getTime();
  const tracking = getOrderTrackingSnapshot(order, effectiveNow);
  const remainingSeconds = secondsUntil(tracking.nextAt, effectiveNow);

  if (order.status === "cancelado" || order.status === "reembolsado") {
    return (
      <section className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-600">
          Acompanhamento interrompido
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          {order.status === "cancelado" ? "Pedido cancelado" : "Pedido reembolsado"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Fale com a loja caso precise de ajuda com este pedido.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-orange-500/25 bg-[#140b07] text-white shadow-[0_24px_80px_-40px_rgba(249,115,22,.7)]">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-orange-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" />
              Acompanhamento automático
            </div>
            <h2
              className="mt-3 text-2xl font-black uppercase tracking-tight"
              aria-live="polite"
              aria-atomic="true"
            >
              {tracking.currentStage.label}
            </h2>
            <p className="mt-1 text-sm text-white/65">{tracking.currentStage.description}</p>
          </div>
          <div className="border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
            <div className="text-[9px] uppercase tracking-[0.25em] text-white/45">
              {tracking.nextStage ? "Próxima etapa" : "Status"}
            </div>
            <div className="mt-1 flex items-center justify-end gap-2 text-sm font-semibold">
              <Clock3 className="h-4 w-4 text-orange-300" />
              {tracking.nextStage
                ? `${tracking.nextStage.label} em ~${remainingSeconds}s`
                : "Pedido concluído"}
            </div>
          </div>
        </div>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300 transition-[width] duration-700 motion-reduce:transition-none"
            style={{ width: `${tracking.progress}%` }}
          />
        </div>
      </div>

      <ol className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {tracking.stages.map((stage, index) => {
          const Icon = STAGE_ICON[stage.id];
          const complete = index < tracking.currentIndex;
          const current = index === tracking.currentIndex;
          return (
            <li
              key={stage.id}
              className={`flex gap-3 bg-[#140b07] p-4 transition ${
                current ? "bg-orange-500/[0.12]" : ""
              }`}
              aria-current={current ? "step" : undefined}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${
                  complete
                    ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                    : current
                      ? "border-orange-300 bg-orange-400 text-[#140b07]"
                      : "border-white/15 text-white/35"
                }`}
              >
                {complete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <div>
                <div
                  className={`text-sm font-semibold ${current || complete ? "text-white" : "text-white/45"}`}
                >
                  {stage.label}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-white/40">
                  {stage.description}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-white/10 bg-white/[0.03] px-5 py-3 text-[10px] leading-relaxed text-white/45 sm:px-6">
        Showcase acelerado: as etapas avançam pelo horário do pedido. Na operação real, pagamento,
        cozinha/PDV e entrega alimentam a mesma tela automaticamente.
      </div>
    </section>
  );
}
