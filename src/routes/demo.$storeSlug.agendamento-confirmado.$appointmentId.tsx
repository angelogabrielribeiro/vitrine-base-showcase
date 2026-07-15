import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { useHydrated } from "@/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { CalendarDays, Check, Clock, MessageCircle, Scissors, User2 } from "lucide-react";

export const Route = createFileRoute("/demo/$storeSlug/agendamento-confirmado/$appointmentId")({
  beforeLoad: ({ params }) => {
    const s = getStore(params.storeSlug);
    if (!s || s.niche !== "barber") throw notFound();
  },
  head: () => ({ meta: [{ title: "Agendamento confirmado" }] }),
  component: Page,
});

function Page() {
  const { storeSlug, appointmentId } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const hydrated = useHydrated();
  const appt = hydrated ? repo.getAppointment(storeSlug, appointmentId) : undefined;

  if (!hydrated) return <div className="p-10 text-sm text-muted-foreground">Carregando…</div>;
  if (!appt) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Agendamento não encontrado.</p>
        <Button asChild className="mt-4">
          <Link to="/demo/$storeSlug" params={{ storeSlug }}>Voltar</Link>
        </Button>
      </div>
    );
  }

  const dateHuman = new Date(appt.date + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long",
  });

  const waMsg = [
    `Olá, ${store.name}!`,
    `Confirmação de agendamento ${appt.number}:`,
    `• Serviço: ${appt.serviceName} (${appt.durationMinutes}min) — ${brl(appt.price)}`,
    `• Profissional: ${appt.professionalName}`,
    `• Data: ${dateHuman} às ${appt.time}`,
    `• Cliente: ${appt.customer.name}`,
    appt.notes ? `• Obs.: ${appt.notes}` : "",
  ].filter(Boolean).join("\n");

  const waHref = whatsappUrl(store.whatsapp, waMsg);

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-[var(--radius)] border border-border bg-card p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Check className="h-6 w-6" />
        </div>
        <h1 className="font-display mt-4 text-2xl">Agendamento confirmado</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Número <span className="font-mono">{appt.number}</span>
        </p>

        <div className="mt-6 grid gap-3 text-left text-sm">
          <Row icon={<Scissors className="h-4 w-4" />} label="Serviço" value={`${appt.serviceName} — ${brl(appt.price)}`} />
          <Row icon={<User2 className="h-4 w-4" />} label="Profissional" value={appt.professionalName} />
          <Row icon={<CalendarDays className="h-4 w-4" />} label="Data" value={dateHuman} />
          <Row icon={<Clock className="h-4 w-4" />} label="Horário" value={`${appt.time} (${appt.durationMinutes}min)`} />
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <a href={waHref} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> Confirmar por WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/demo/$storeSlug" params={{ storeSlug }}>Voltar à loja</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border/70 bg-background p-3">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}