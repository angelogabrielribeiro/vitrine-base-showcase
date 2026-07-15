import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { brl } from "@/lib/format";
import { ArrowLeft, ArrowRight, Check, Clock, Scissors, User2, CalendarDays } from "lucide-react";
import type { Appointment, Professional } from "@/types/commerce";
import { waAppointmentSummaryToStore, whatsappUrl, markWhatsappPending } from "@/lib/whatsapp";

export const Route = createFileRoute("/demo/$storeSlug/agendar")({
  beforeLoad: ({ params }) => {
    const s = getStore(params.storeSlug);
    if (!s || s.niche !== "barber") throw notFound();
  },
  head: ({ params }) => {
    const s = getStore(params.storeSlug);
    return {
      meta: [
        { title: `Agendar horário — ${s?.name ?? "Barbearia"}` },
        { name: "description", content: "Escolha serviço, profissional, data e horário." },
      ],
    };
  },
  component: AgendarPage,
});

type Step = 0 | 1 | 2 | 3 | 4 | 5;
const STEP_LABELS = ["Serviço", "Profissional", "Data", "Horário", "Dados", "Confirmação"];

function AgendarPage() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const navigate = useNavigate();
  const services = repo.listServices(storeSlug).filter((s) => s.active);
  const professionals = repo.listProfessionals(storeSlug).filter((p) => p.active);
  const appointments = repo.listAppointments(storeSlug);

  const [step, setStep] = useState<Step>(0);
  const [serviceId, setServiceId] = useState<string>("");
  const [professionalId, setProfessionalId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(store.checkout.marketingConsentDefault);
  const [submitting, setSubmitting] = useState(false);

  const service = services.find((s) => s.id === serviceId);
  const professional = professionals.find((p) => p.id === professionalId);

  const eligiblePros = useMemo<Professional[]>(() => {
    if (!service) return [];
    return professionals.filter((p) => !p.serviceIds || p.serviceIds.length === 0 || p.serviceIds.includes(service.id));
  }, [professionals, service]);

  const dateOptions = useMemo(() => buildNextDays(14, professional), [professional]);
  const timeOptions = useMemo(
    () => (professional && date && service ? buildTimeSlots(professional, date, service.durationMinutes, appointments) : []),
    [professional, date, service, appointments],
  );

  const canNext = (() => {
    if (step === 0) return !!serviceId;
    if (step === 1) return !!professionalId;
    if (step === 2) return !!date;
    if (step === 3) return !!time;
    if (step === 4) return name.trim().length > 2 && whatsapp.replace(/\D/g, "").length >= 10 && terms;
    return true;
  })();

  const next = () => setStep((s) => (s < 5 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const submit = () => {
    if (!service || !professional) return;
    setSubmitting(true);

    let waWindow: Window | null = null;
    if (store.whatsappRequiredAfterCheckout) {
      try {
        waWindow = window.open("", "_blank");
      } catch {
        waWindow = null;
      }
    }

    const now = new Date();
    const id = `apt-${now.getTime().toString(36)}`;
    const number = "AG-" + String(now.getTime()).slice(-6);
    const appointment: Appointment = {
      id,
      number,
      storeSlug,
      createdAt: now.toISOString(),
      status: "confirmado",
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      durationMinutes: service.durationMinutes,
      professionalId: professional.id,
      professionalName: professional.name,
      date,
      time,
      customer: {
        name: name.trim(),
        whatsapp: whatsapp.replace(/\D/g, ""),
        email: email.trim() || undefined,
      },
      notes: notes.trim() || undefined,
      consents: { terms, marketing },
      demo: true,
    };
    repo.createAppointment(storeSlug, appointment);

    if (store.whatsappRequiredAfterCheckout) {
      const waHref = whatsappUrl(store.whatsapp, waAppointmentSummaryToStore(store, appointment));
      if (waWindow && !waWindow.closed) {
        try {
          waWindow.location.href = waHref;
        } catch {
          markWhatsappPending(id);
        }
      } else {
        markWhatsappPending(id);
      }
    }

    setStep(5);
    setSubmitting(false);
    setTimeout(() => {
      navigate({
        to: "/demo/$storeSlug/agendamento-confirmado/$appointmentId",
        params: { storeSlug, appointmentId: id },
      });
    }, 600);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-primary">Reserva</div>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl">Agendar horário</h1>
        <p className="mt-2 text-sm text-muted-foreground">Preencha as etapas abaixo. Simples e rápido.</p>
      </div>

      <ol className="mb-8 grid grid-cols-3 gap-2 text-[10px] sm:grid-cols-6 sm:text-xs">
        {STEP_LABELS.map((label, i) => (
          <li
            key={label}
            className={
              "rounded-full border px-2 py-1 text-center " +
              (i < step
                ? "border-primary/60 bg-primary/10 text-primary"
                : i === step
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground")
            }
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-[var(--radius)] border border-border bg-card p-5 sm:p-6"
      >
        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setServiceId(s.id)}
                className={
                  "flex items-start gap-3 rounded-lg border p-4 text-left transition " +
                  (serviceId === s.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50")
                }
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Scissors className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate font-semibold">{s.name}</div>
                    <div className="text-sm font-semibold">{brl(s.price)}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {s.durationMinutes} min
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {eligiblePros.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProfessionalId(p.id)}
                className={
                  "flex items-center gap-3 rounded-lg border p-3 text-left transition " +
                  (professionalId === p.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50")
                }
              >
                {p.avatar ? (
                  <img src={p.avatar} alt={p.name} className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
                    <User2 className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{p.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{p.role}</div>
                </div>
              </button>
            ))}
            {eligiblePros.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum profissional disponível para este serviço.</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {dateOptions.map((d) => (
              <button
                key={d.iso}
                type="button"
                onClick={() => {
                  setDate(d.iso);
                  setTime("");
                }}
                disabled={!d.enabled}
                className={
                  "rounded-lg border px-2 py-3 text-center text-xs transition disabled:cursor-not-allowed disabled:opacity-40 " +
                  (date === d.iso
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50")
                }
              >
                <div className="text-[10px] uppercase text-muted-foreground">{d.weekday}</div>
                <div className="mt-1 text-base font-semibold">{d.day}</div>
                <div className="text-[10px] text-muted-foreground">{d.month}</div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {timeOptions.length === 0 && (
              <p className="col-span-full text-sm text-muted-foreground">
                Sem horários disponíveis nesta data. Escolha outro dia.
              </p>
            )}
            {timeOptions.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={
                  "rounded-lg border px-3 py-2 text-sm transition " +
                  (time === t
                    ? "border-primary bg-primary/10 font-semibold"
                    : "border-border hover:border-primary/50")
                }
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ag-nome">Nome completo *</Label>
              <Input id="ag-nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como devemos te chamar" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="ag-wa">WhatsApp *</Label>
                <Input
                  id="ag-wa"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  inputMode="tel"
                />
              </div>
              <div>
                <Label htmlFor="ag-email">E-mail (opcional)</Label>
                <Input id="ag-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="ag-obs">Observações</Label>
              <Textarea id="ag-obs" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferências, referências, etc." />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox checked={terms} onCheckedChange={(v) => setTerms(Boolean(v))} className="mt-0.5" />
              <span>Aceito os termos e política de agendamento (demonstrativo).</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox checked={marketing} onCheckedChange={(v) => setMarketing(Boolean(v))} className="mt-0.5" />
              <span>Quero receber lembretes e novidades por WhatsApp.</span>
            </label>
          </div>
        )}

        {step === 5 && (
          <div className="grid place-items-center py-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Check className="h-6 w-6" />
            </div>
            <div className="mt-4 font-semibold">Agendamento confirmado!</div>
            <div className="text-sm text-muted-foreground">Redirecionando…</div>
          </div>
        )}
      </motion.div>

      {/* Resumo lateral inline */}
      {(service || date || time) && step < 5 && (
        <div className="mt-6 rounded-[var(--radius)] border border-dashed border-border p-4 text-sm">
          <div className="mb-2 font-semibold">Resumo</div>
          <ul className="grid gap-1 text-muted-foreground sm:grid-cols-2">
            {service && (
              <li>
                <Scissors className="mr-1 inline h-3 w-3" /> {service.name} · {brl(service.price)} · {service.durationMinutes}min
              </li>
            )}
            {professional && (
              <li>
                <User2 className="mr-1 inline h-3 w-3" /> {professional.name}
              </li>
            )}
            {date && (
              <li>
                <CalendarDays className="mr-1 inline h-3 w-3" /> {new Date(date + "T00:00:00").toLocaleDateString("pt-BR")}
              </li>
            )}
            {time && (
              <li>
                <Clock className="mr-1 inline h-3 w-3" /> {time}
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-2">
        <Button variant="outline" onClick={back} disabled={step === 0 || step === 5}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        {step < 4 && (
          <Button onClick={next} disabled={!canNext}>
            Avançar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {step === 4 && (
          <Button onClick={submit} disabled={!canNext || submitting}>
            Confirmar agendamento
          </Button>
        )}
      </div>
    </div>
  );
}

// ================ helpers ================

const WEEKDAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function buildNextDays(count: number, professional?: Professional) {
  const days: { iso: string; day: string; month: string; weekday: string; enabled: boolean }[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const dow = d.getDay();
    const iso = d.toISOString().slice(0, 10);
    const enabled = professional?.workingDays ? professional.workingDays.includes(dow) : dow !== 0 && dow !== 1;
    days.push({
      iso,
      day: String(d.getDate()).padStart(2, "0"),
      month: MONTHS_PT[d.getMonth()],
      weekday: WEEKDAYS_PT[dow],
      enabled,
    });
  }
  return days;
}

function buildTimeSlots(
  professional: Professional,
  date: string,
  durationMinutes: number,
  appointments: Appointment[],
): string[] {
  const start = parseHM(professional.workStart ?? "10:00");
  const end = parseHM(professional.workEnd ?? "19:00");
  const step = 30;
  const slots: string[] = [];
  for (let m = start; m + durationMinutes <= end; m += step) {
    slots.push(toHM(m));
  }
  const taken = new Set(
    appointments
      .filter((a) => a.professionalId === professional.id && a.date === date && a.status !== "cancelado")
      .map((a) => a.time),
  );
  return slots.filter((s) => !taken.has(s));
}

function parseHM(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}
function toHM(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}