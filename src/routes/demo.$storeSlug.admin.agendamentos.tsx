import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { brl } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import type { AppointmentStatus } from "@/types/commerce";

export const Route = createFileRoute("/demo/$storeSlug/admin/agendamentos")({
  component: Page,
});

const STATUSES: AppointmentStatus[] = ["pendente", "confirmado", "concluido", "cancelado", "faltou"];

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
      .filter((a) => (status === "todos" ? true : a.status === status))
      .filter((a) => {
        if (!norm) return true;
        return (
          a.number.toLowerCase().includes(norm) ||
          a.customer.name.toLowerCase().includes(norm) ||
          a.serviceName.toLowerCase().includes(norm) ||
          a.professionalName.toLowerCase().includes(norm)
        );
      })
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  }, [all, q, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Agendamentos</h1>
        <p className="text-sm text-muted-foreground">Gerencie as reservas de {store.name}.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Buscar por número, cliente, serviço…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-full sm:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {STATUSES.map((s) => (<SelectItem key={s} value={s}>{cap(s)}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius)] border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3">Número</th>
              <th className="p-3">Data / Hora</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Serviço</th>
              <th className="p-3">Profissional</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((a) => (
              <tr key={a.id} className="hover:bg-muted/30">
                <td className="p-3 font-mono">{a.number}</td>
                <td className="p-3">
                  {new Date(a.date + "T00:00:00").toLocaleDateString("pt-BR")} · {a.time}
                </td>
                <td className="p-3">
                  <div>{a.customer.name}</div>
                  <div className="text-xs text-muted-foreground">{a.customer.whatsapp}</div>
                </td>
                <td className="p-3">{a.serviceName}</td>
                <td className="p-3">{a.professionalName}</td>
                <td className="p-3">{brl(a.price)}</td>
                <td className="p-3">
                  <Select
                    value={a.status}
                    onValueChange={(v) => repo.updateAppointmentStatus(storeSlug, a.id, v as AppointmentStatus)}
                  >
                    <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (<SelectItem key={s} value={s}>{cap(s)}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={whatsappUrl(
                        a.customer.whatsapp,
                        `Olá ${a.customer.name}! Confirmando seu agendamento ${a.number} em ${store.name} para ${new Date(a.date + "T00:00:00").toLocaleDateString("pt-BR")} às ${a.time}.`,
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

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}