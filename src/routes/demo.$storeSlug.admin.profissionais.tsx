import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useRepo } from "@/hooks/use-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, User2 } from "lucide-react";
import type { Professional } from "@/types/commerce";

export const Route = createFileRoute("/demo/$storeSlug/admin/profissionais")({
  component: Page,
});

function emptyPro(): Professional {
  return {
    id: "pro-" + Math.random().toString(36).slice(2, 8),
    name: "",
    role: "Barbeiro",
    bio: "",
    active: true,
    workingDays: [2, 3, 4, 5, 6],
    workStart: "10:00",
    workEnd: "19:00",
  };
}

function Page() {
  const { storeSlug } = Route.useParams();
  const repo = useRepo();
  const pros = repo.listProfessionals(storeSlug);
  const [editing, setEditing] = useState<Professional | null>(null);

  const save = () => {
    if (!editing) return;
    repo.saveProfessional(storeSlug, editing);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Profissionais</h1>
          <p className="text-sm text-muted-foreground">Equipe disponível para agendamento.</p>
        </div>
        <Button onClick={() => setEditing(emptyPro())}>
          <Plus className="mr-2 h-4 w-4" /> Novo profissional
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pros.map((p) => (
          <div key={p.id} className="rounded-[var(--radius)] border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              {p.avatar ? (
                <img src={p.avatar} alt={p.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
                  <User2 className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.role}</div>
              </div>
              <span className={"rounded-full px-2 py-0.5 text-[10px] " + (p.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                {p.active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{p.bio}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(p)}>Editar</Button>
              <Button
                variant="outline" size="sm"
                onClick={() => confirm("Excluir profissional?") && repo.deleteProfessional(storeSlug, p.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-[var(--radius)] border border-border bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 font-display text-xl font-semibold">Editar profissional</h2>
            <div className="space-y-3">
              <div>
                <Label>Nome</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Função</Label>
                <Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
              </div>
              <div>
                <Label>Avatar (URL)</Label>
                <Input value={editing.avatar ?? ""} onChange={(e) => setEditing({ ...editing, avatar: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Início</Label>
                  <Input value={editing.workStart ?? "10:00"} onChange={(e) => setEditing({ ...editing, workStart: e.target.value })} />
                </div>
                <div>
                  <Label>Fim</Label>
                  <Input value={editing.workEnd ?? "19:00"} onChange={(e) => setEditing({ ...editing, workEnd: e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
                Ativo
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button onClick={save}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}