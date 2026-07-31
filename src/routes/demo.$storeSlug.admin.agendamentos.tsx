import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brl } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import type { AppointmentStatus } from "@/types/commerce";

export const Route = createFileRoute("/demo/$storeSlug/admin/agendamentos")({
  component: Page,
});

const STATUSES: AppointmentStatus[] = [
  "pendente",
  "confirmado",
  "concluido",
  "cancelado",
  "faltou",
];

function Page() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const all = repo.listAppointments(storeSlug);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"todos" | AppointmentStatus>("todos");

  const items = useMemo(() => {
    const norm = q.trim().toLowerCase();
    return all
      .filter((appointment) => (status === "todos" ? true : appointment.status === status))
      .filter((appointment) => {
        if (!norm) return true;
        return (
          appointment.number.toLowerCase().includes(norm) ||
          appointment.customer.name.toLowerCase().includes(norm) ||
          appointment.serviceName.toLowerCase().includes(norm) ||
          appointment.professionalName.toLowerCase().includes(norm)
        );
      })
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  }, [all, q, status]);

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Agendamentos</h1>
        <p className="text-sm text-muted-foreground">Gerencie as reservas de {store.name}.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Buscar por número, cliente, serviço…"
          value={q}
          onChange={(event) => setQ(event.target.value)}
        />
        <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {cap(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground md:hidden">
        Deslize a tabela para o lado para acessar status e ações.
      </p>
      <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-[var(--radius)] border border-border bg-card [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[1040px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3">Número</th>
              <th className="p-3">Data / Hora</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Serviço</th>
              <th className="p-3">Profissional</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-muted/30">
                <td className="whitespace-nowrap p-3 font-mono">{appointment.number}</td>
                <td className="whitespace-nowrap p-3">
                  {new Date(appointment.date + "T00:00:00").toLocaleDateString("pt-BR")} · {appointment.time}
                </td>
                <td className="min-w-48 p-3">
                  <div>{appointment.customer.name}</div>
                  <div className="text-xs text-muted-foreground">{appointment.customer.whatsapp}</div>
                </td>
                <td className="min-w-44 p-3">{appointment.serviceName}</td>
                <td className="min-w-40 p-3">{appointment.professionalName}</td>
                <td className="whitespace-nowrap p-3">{brl(appointment.price)}</td>
                <td className="p-3">
                  <Select
                    value={appointment.status}
                    onValueChange={(value) =>
                      repo.updateAppointmentStatus(
                        storeSlug,
                        appointment.id,
                        value as AppointmentStatus,
                      )
                    }
                  >
                    <SelectTrigger className="h-9 w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {cap(item)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={whatsappUrl(
                        appointment.customer.whatsapp,
                        `Olá ${appointment.customer.name}! Confirmando seu agendamento ${appointment.number} em ${store.name} para ${new Date(appointment.date + "T00:00:00").toLocaleDateString("pt-BR")} às ${appointment.time}.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function cap(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
