import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useRepo } from "@/hooks/use-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, User2, Upload, Camera, X, Link2 } from "lucide-react";
import { toast } from "sonner";
import { BARBER_PROFESSIONAL_FALLBACK } from "@/lib/barber-media";
import { SafeImage } from "@/components/storefront/safe-image";
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
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                <SafeImage
                  src={p.avatar}
                  fallbackSrc={BARBER_PROFESSIONAL_FALLBACK}
                  alt={p.name}
                  fallbackLabel={p.name}
                  className="h-full w-full object-cover"
                />
              </div>
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
                <Label>Foto do profissional</Label>
                <AvatarPicker
                  value={editing.avatar}
                  onChange={(v) => setEditing({ ...editing, avatar: v })}
                />
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

/* -------------------------------------------------------------------------- */
/* AvatarPicker — arquivo, câmera (mobile), drag & drop, paste, URL opcional. */
/* -------------------------------------------------------------------------- */

const ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_DIM = 900;

function isTouchMobile(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(hover: none) and (pointer: coarse)").matches ?? false
  );
}

async function resizeToDataUrl(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    throw new Error("Formato inválido. Use JPEG, PNG ou WebP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Imagem grande demais. Máximo 8 MB.");
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Não foi possível ler a imagem."));
      el.src = url;
    });
    const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponível neste navegador.");
    ctx.drawImage(img, 0, 0, w, h);
    let out = canvas.toDataURL("image/webp", 0.82);
    if (!out.startsWith("data:image/webp")) {
      out = canvas.toDataURL("image/jpeg", 0.85);
    }
    return out;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function AvatarPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [drag, setDrag] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(isTouchMobile());
  }, []);

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await resizeToDataUrl(file);
      onChange(dataUrl);
      toast.success("Foto atualizada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao carregar imagem.");
    } finally {
      setBusy(false);
    }
  };

  // Paste local à área de upload (sem listener global).
  const onPaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    const item = Array.from(e.clipboardData?.items ?? []).find((it) =>
      it.type.startsWith("image/"),
    );
    if (!item) return;
    const file = item.getAsFile();
    if (file) {
      e.preventDefault();
      void handleFile(file);
    }
  };

  return (
    <div className="mt-2 space-y-3">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
          {value ? (
            <SafeImage
              src={value}
              fallbackSrc={BARBER_PROFESSIONAL_FALLBACK}
              alt="Foto do profissional"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground">
              <User2 className="h-7 w-7" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              <Upload className="mr-2 h-4 w-4" />
              {value ? "Trocar imagem" : "Escolher imagem"}
            </Button>
            {isMobile && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => cameraRef.current?.click()}
                disabled={busy}
              >
                <Camera className="mr-2 h-4 w-4" />
                Tirar foto
              </Button>
            )}
            {value && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChange(undefined)}
                disabled={busy}
              >
                <X className="mr-2 h-4 w-4" />
                Remover
              </Button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            JPEG, PNG ou WebP · até 8 MB · a imagem é redimensionada para até
            {" "}
            {MAX_DIM}px no seu navegador.
          </p>
        </div>
      </div>

      {!isMobile && (
        <div
          ref={dropRef}
          tabIndex={0}
          onPaste={onPaste}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void handleFile(e.dataTransfer.files?.[0]);
          }}
          className={
            "rounded-md border-2 border-dashed p-4 text-center text-xs outline-none transition " +
            (drag
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground focus:border-primary/60")
          }
        >
          Arraste um arquivo aqui ou clique nesta área e cole com Ctrl+V.
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          if (fileRef.current) fileRef.current.value = "";
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          if (cameraRef.current) cameraRef.current.value = "";
        }}
      />

      <div>
        <button
          type="button"
          onClick={() => setShowUrl((s) => !s)}
          className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <Link2 className="h-3 w-3" />
          {showUrl ? "Ocultar URL" : "Usar URL em vez de arquivo"}
        </button>
        {showUrl && (
          <Input
            className="mt-2"
            placeholder="https://..."
            value={value && value.startsWith("http") ? value : ""}
            onChange={(e) => onChange(e.target.value || undefined)}
          />
        )}
      </div>
    </div>
  );
}