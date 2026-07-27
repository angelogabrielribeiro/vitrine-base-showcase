import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { StoreConfig } from "@/types/commerce";

export const Route = createFileRoute("/demo/$storeSlug/admin/configuracoes")({
  component: Settings,
});

function Settings() {
  const { storeSlug } = Route.useParams();
  const repo = useRepo();
  const current = repo.getConfig(storeSlug) ?? getStore(storeSlug)!;
  const [cfg, setCfg] = useState<StoreConfig>(current);
  const products = repo.listProducts(storeSlug).filter((p) => p.active);
  const services = cfg.niche === "barber" ? repo.listServices(storeSlug).filter((s) => s.active) : [];
  const isBarber = cfg.niche === "barber";

  const update = <K extends keyof StoreConfig>(k: K, v: StoreConfig[K]) => setCfg((c) => ({ ...c, [k]: v }));

  const save = () => {
    repo.saveConfig(cfg);
    toast.success("Configurações salvas");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Configurações</h1>
        <p className="text-sm text-muted-foreground">Alterações refletem imediatamente na vitrine.</p>
      </div>

      <section className="rounded-[var(--radius)] border border-border bg-card p-5">
        <h2 className="font-semibold">Identidade</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div><Label>Nome</Label><Input value={cfg.name} onChange={(e) => update("name", e.target.value)} /></div>
          <div><Label>Subtítulo</Label><Input value={cfg.tagline} onChange={(e) => update("tagline", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Descrição</Label><Textarea value={cfg.description} onChange={(e) => update("description", e.target.value)} /></div>
        </div>
      </section>

      <section className="rounded-[var(--radius)] border border-border bg-card p-5">
        <h2 className="font-semibold">Contato</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div><Label>WhatsApp (só dígitos)</Label><Input value={cfg.whatsapp} onChange={(e) => update("whatsapp", e.target.value.replace(/\D/g, ""))} /></div>
          <div><Label>Instagram</Label><Input value={cfg.instagram} onChange={(e) => update("instagram", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Endereço</Label><Input value={cfg.address} onChange={(e) => update("address", e.target.value)} /></div>
        </div>
      </section>

      <section className="rounded-[var(--radius)] border border-border bg-card p-5">
        <h2 className="font-semibold">Recebimento</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
            <span>Retirada no local</span>
            <Switch checked={cfg.fulfillment.pickup} onCheckedChange={(v) => update("fulfillment", { ...cfg.fulfillment, pickup: Boolean(v) })} />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
            <span>Entrega local</span>
            <Switch checked={cfg.fulfillment.localDelivery} onCheckedChange={(v) => update("fulfillment", { ...cfg.fulfillment, localDelivery: Boolean(v) })} />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
            <span>Envio (Correios/transportadora)</span>
            <Switch checked={cfg.fulfillment.shipping} onCheckedChange={(v) => update("fulfillment", { ...cfg.fulfillment, shipping: Boolean(v) })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Taxa de entrega (R$)</Label><Input type="number" step="0.01" value={cfg.deliveryFee} onChange={(e) => update("deliveryFee", Number(e.target.value) || 0)} /></div>
            <div><Label>Pedido mínimo (R$)</Label><Input type="number" step="0.01" value={cfg.minOrder} onChange={(e) => update("minOrder", Number(e.target.value) || 0)} /></div>
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius)] border border-border bg-card p-5">
        <h2 className="font-semibold">Aparência</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div><Label>Cor primária (oklch)</Label><Input value={cfg.theme.primary} onChange={(e) => update("theme", { ...cfg.theme, primary: e.target.value })} /></div>
          <div><Label>Fundo (oklch)</Label><Input value={cfg.theme.background} onChange={(e) => update("theme", { ...cfg.theme, background: e.target.value })} /></div>
          <div><Label>Raio</Label><Input value={cfg.theme.radius} onChange={(e) => update("theme", { ...cfg.theme, radius: e.target.value })} /></div>
          <div className="sm:col-span-3"><Label>Banner (URL)</Label><Input value={cfg.banners[0]?.image ?? ""} onChange={(e) => {
            const newBanners = [...cfg.banners];
            if (newBanners[0]) newBanners[0] = { ...newBanners[0], image: e.target.value };
            update("banners", newBanners);
          }} /></div>
        </div>
      </section>

      <section className="rounded-[var(--radius)] border border-border bg-card p-5">
        <h2 className="font-semibold">Spotlight e WhatsApp</h2>
        <div className="mt-4 grid gap-3">
          <div>
            <Label>Item em destaque no Spotlight</Label>
            <select
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={cfg.spotlightItemId ?? ""}
              onChange={(e) => update("spotlightItemId", e.target.value || undefined)}
            >
              <option value="">Automático (primeiro em destaque)</option>
              {services.length > 0 && (
                <optgroup label="Serviços">
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Produtos">
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
            <span>Abrir WhatsApp obrigatoriamente após pedido/agendamento</span>
            <Switch
              checked={cfg.whatsappRequiredAfterCheckout}
              onCheckedChange={(v) => update("whatsappRequiredAfterCheckout", Boolean(v))}
            />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={save} size="lg">Salvar alterações</Button>
      </div>

      {isBarber && (
        <section className="rounded-[var(--radius)] border border-dashed border-border bg-card/60 p-5">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Dados e backups</h2>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              Avançado
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Importe um catálogo existente ou baixe cópias dos produtos, serviços e agendamentos.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link
                to="/demo/$storeSlug/admin/importar-exportar"
                params={{ storeSlug }}
              >
                Abrir dados e backups
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
