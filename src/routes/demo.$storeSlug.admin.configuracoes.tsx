import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { StoreConfig, StoreNiche } from "@/types/commerce";

export const Route = createFileRoute("/demo/$storeSlug/admin/configuracoes")({
  component: Settings,
});

type SimpleThemePreset = {
  name: string;
  primary: string;
  background: string;
};

const THEME_PRESETS: SimpleThemePreset[] = [
  { name: "Quente", primary: "#ea6f3f", background: "#1b100d" },
  { name: "Noir", primary: "#d4aa3c", background: "#15171b" },
  { name: "Claro", primary: "#5f4c42", background: "#faf7f1" },
  { name: "Tecnologia", primary: "#3b82f6", background: "#070b16" },
  { name: "Natural", primary: "#2f855a", background: "#f4f7f2" },
];

const DEFAULT_COLORS: Record<StoreNiche, { primary: string; background: string }> = {
  fashion: { primary: "#51433b", background: "#faf7f0" },
  barber: { primary: "#d6ad36", background: "#17181c" },
  restaurant: { primary: "#ea6f3f", background: "#1b100d" },
  electronics: { primary: "#4f7cff", background: "#070b16" },
};

const RADIUS_OPTIONS = [
  { value: "0.25rem", label: "Discreto" },
  { value: "0.5rem", label: "Levemente arredondado" },
  { value: "0.875rem", label: "Arredondado" },
  { value: "1.25rem", label: "Bem arredondado" },
];

function Settings() {
  const { storeSlug } = Route.useParams();
  const repo = useRepo();
  const current = repo.getConfig(storeSlug) ?? getStore(storeSlug)!;
  const [cfg, setCfg] = useState<StoreConfig>(current);
  const defaults = DEFAULT_COLORS[cfg.niche];
  const [primaryDraft, setPrimaryDraft] = useState(() =>
    normalizeHex(current.theme.primary, defaults.primary),
  );
  const [backgroundDraft, setBackgroundDraft] = useState(() =>
    normalizeHex(current.theme.background, defaults.background),
  );
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const products = repo.listProducts(storeSlug).filter((p) => p.active);
  const services =
    cfg.niche === "barber" ? repo.listServices(storeSlug).filter((s) => s.active) : [];
  const isBarber = cfg.niche === "barber";

  const update = <K extends keyof StoreConfig>(k: K, v: StoreConfig[K]) =>
    setCfg((c) => ({ ...c, [k]: v }));

  const save = () => {
    repo.saveConfig(cfg);
    toast.success("Configurações salvas");
  };

  const applyColors = (primary: string, background: string) => {
    const normalizedPrimary = normalizeHex(primary, defaults.primary);
    const normalizedBackground = normalizeHex(background, defaults.background);
    setPrimaryDraft(normalizedPrimary);
    setBackgroundDraft(normalizedBackground);
    update(
      "theme",
      buildAccessibleTheme(cfg.theme, normalizedPrimary, normalizedBackground),
    );
  };

  const applyColorDraft = (
    kind: "primary" | "background",
    value: string,
  ) => {
    if (!isHexColor(value)) {
      toast.error("Use uma cor hexadecimal válida, como #EA6F3F.");
      if (kind === "primary") setPrimaryDraft(normalizeHex(cfg.theme.primary, defaults.primary));
      else setBackgroundDraft(normalizeHex(cfg.theme.background, defaults.background));
      return;
    }

    if (kind === "primary") applyColors(value, backgroundDraft);
    else applyColors(primaryDraft, value);
  };

  const setBanner = (image: string) => {
    const banners = [...cfg.banners];
    if (banners[0]) banners[0] = { ...banners[0], image };
    update("banners", banners);
  };

  const handleBannerFile = async (file?: File) => {
    if (!file) return;
    try {
      const image = await resizeBanner(file);
      setBanner(image);
      toast.success("Imagem principal atualizada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível carregar a imagem.");
    } finally {
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Alterações refletem imediatamente na vitrine.
        </p>
      </div>

      <section className="rounded-[var(--radius)] border border-border bg-card p-5">
        <h2 className="font-semibold">Identidade</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Nome</Label>
            <Input value={cfg.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <Label>Subtítulo</Label>
            <Input value={cfg.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Descrição</Label>
            <Textarea
              value={cfg.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius)] border border-border bg-card p-5">
        <h2 className="font-semibold">Contato</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <Label>WhatsApp (só dígitos)</Label>
            <Input
              value={cfg.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input
              value={cfg.instagram}
              onChange={(e) => update("instagram", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Endereço</Label>
            <Input
              value={cfg.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius)] border border-border bg-card p-5">
        <h2 className="font-semibold">Recebimento</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
            <span>Retirada no local</span>
            <Switch
              checked={cfg.fulfillment.pickup}
              onCheckedChange={(v) =>
                update("fulfillment", { ...cfg.fulfillment, pickup: Boolean(v) })
              }
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
            <span>Entrega local</span>
            <Switch
              checked={cfg.fulfillment.localDelivery}
              onCheckedChange={(v) =>
                update("fulfillment", {
                  ...cfg.fulfillment,
                  localDelivery: Boolean(v),
                })
              }
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
            <span>Envio (Correios/transportadora)</span>
            <Switch
              checked={cfg.fulfillment.shipping}
              onCheckedChange={(v) =>
                update("fulfillment", { ...cfg.fulfillment, shipping: Boolean(v) })
              }
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Taxa de entrega (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={cfg.deliveryFee}
                onChange={(e) => update("deliveryFee", Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Pedido mínimo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={cfg.minOrder}
                onChange={(e) => update("minOrder", Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius)] border border-border bg-card p-5">
        <div>
          <h2 className="font-semibold">Aparência do site</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha as cores visualmente. O contraste dos textos é ajustado automaticamente.
          </p>
        </div>

        <div className="mt-5">
          <Label>Temas prontos</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyColors(preset.primary, preset.background)}
                className="rounded-lg border border-border p-2 text-left transition hover:border-primary"
                aria-label={`Aplicar tema ${preset.name}`}
              >
                <div
                  className="h-12 rounded-md border border-black/10 p-2"
                  style={{ backgroundColor: preset.background }}
                >
                  <div
                    className="h-full w-2/3 rounded"
                    style={{ backgroundColor: preset.primary }}
                  />
                </div>
                <span className="mt-1 block text-xs font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ColorControl
            label="Cor de destaque"
            description="Botões, links e elementos principais."
            value={primaryDraft}
            onChange={(value) => {
              setPrimaryDraft(value);
              applyColors(value, backgroundDraft);
            }}
            onTextChange={setPrimaryDraft}
            onTextCommit={() => applyColorDraft("primary", primaryDraft)}
          />
          <ColorControl
            label="Cor de fundo"
            description="Cor principal atrás do conteúdo."
            value={backgroundDraft}
            onChange={(value) => {
              setBackgroundDraft(value);
              applyColors(primaryDraft, value);
            }}
            onTextChange={setBackgroundDraft}
            onTextCommit={() => applyColorDraft("background", backgroundDraft)}
          />
        </div>

        <div className="mt-5">
          <Label htmlFor="corner-style">Formato dos cantos</Label>
          <select
            id="corner-style"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm sm:max-w-sm"
            value={nearestRadius(cfg.theme.radius)}
            onChange={(e) =>
              update("theme", { ...cfg.theme, radius: e.target.value })
            }
          >
            {RADIUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-border">
          <div
            className="p-5"
            style={{
              backgroundColor: backgroundDraft,
              color: contrastText(backgroundDraft),
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest opacity-70">
              Prévia
            </div>
            <div className="mt-2 text-xl font-semibold">{cfg.name}</div>
            <div className="mt-1 text-sm opacity-75">{cfg.tagline}</div>
            <button
              type="button"
              className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: primaryDraft,
                color: contrastText(primaryDraft),
                borderRadius: cfg.theme.radius,
              }}
            >
              Botão principal
            </button>
          </div>
        </div>

        <div className="mt-5">
          <Label>Imagem principal do banner</Label>
          <div className="mt-2 overflow-hidden rounded-xl border border-border bg-muted">
            {cfg.banners[0]?.image ? (
              <img
                src={cfg.banners[0].image}
                alt="Prévia do banner"
                className="aspect-[16/7] w-full object-cover"
              />
            ) : (
              <div className="grid aspect-[16/7] place-items-center text-sm text-muted-foreground">
                Nenhuma imagem selecionada
              </div>
            )}
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => void handleBannerFile(e.target.files?.[0])}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => bannerInputRef.current?.click()}
            >
              Escolher imagem
            </Button>
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
              Opção avançada: usar link de uma imagem
            </summary>
            <div className="mt-2">
              <Input
                aria-label="Link da imagem do banner"
                placeholder="https://..."
                value={cfg.banners[0]?.image?.startsWith("data:") ? "" : (cfg.banners[0]?.image ?? "")}
                onChange={(e) => setBanner(e.target.value)}
              />
            </div>
          </details>
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
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Produtos">
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
            <span>Abrir WhatsApp obrigatoriamente após pedido/agendamento</span>
            <Switch
              checked={cfg.whatsappRequiredAfterCheckout}
              onCheckedChange={(v) =>
                update("whatsappRequiredAfterCheckout", Boolean(v))
              }
            />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={save} size="lg">
          Salvar alterações
        </Button>
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
            Importe um catálogo existente ou baixe cópias dos produtos, serviços e
            agendamentos.
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

function ColorControl({
  label,
  description,
  value,
  onChange,
  onTextChange,
  onTextCommit,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onTextCommit: () => void;
}) {
  const pickerValue = isHexColor(value) ? value : "#000000";
  return (
    <div className="rounded-xl border border-border p-4">
      <Label>{label}</Label>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <div className="mt-3 flex items-center gap-3">
        <label
          className="relative h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border"
          style={{ backgroundColor: pickerValue }}
          aria-label={`Selecionar ${label.toLowerCase()}`}
        >
          <input
            type="color"
            value={pickerValue}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <Input
          value={value}
          onChange={(e) => onTextChange(e.target.value)}
          onBlur={onTextCommit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          placeholder="#EA6F3F"
          maxLength={7}
          className="font-mono uppercase"
        />
      </div>
    </div>
  );
}

function buildAccessibleTheme(
  theme: StoreConfig["theme"],
  primary: string,
  background: string,
): StoreConfig["theme"] {
  const dark = relativeLuminance(background) < 0.42;
  const foreground = contrastText(background);
  const card = mixHex(background, dark ? "#ffffff" : "#000000", dark ? 0.06 : 0.035);
  const muted = mixHex(background, dark ? "#ffffff" : "#000000", dark ? 0.11 : 0.075);
  const border = mixHex(background, dark ? "#ffffff" : "#000000", dark ? 0.18 : 0.14);
  const secondary = mixHex(background, primary, dark ? 0.18 : 0.1);

  return {
    ...theme,
    background,
    foreground,
    card,
    cardForeground: foreground,
    primary,
    primaryForeground: contrastText(primary),
    secondary,
    secondaryForeground: foreground,
    muted,
    mutedForeground: mixHex(foreground, background, 0.34),
    accent: primary,
    accentForeground: contrastText(primary),
    border,
    ring: primary,
  };
}

function normalizeHex(value: string, fallback: string): string {
  if (isHexColor(value)) return value.toUpperCase();
  return fallback.toUpperCase();
}

function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value.trim());
}

function nearestRadius(value: string): string {
  return RADIUS_OPTIONS.some((option) => option.value === value)
    ? value
    : "0.875rem";
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = normalizeHex(hex, "#000000").slice(1);
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((channel) =>
        Math.round(Math.max(0, Math.min(255, channel)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  ).toUpperCase();
}

function mixHex(base: string, overlay: string, weight: number): string {
  const [br, bg, bb] = hexToRgb(base);
  const [or, og, ob] = hexToRgb(overlay);
  return rgbToHex(
    br + (or - br) * weight,
    bg + (og - bg) * weight,
    bb + (ob - bb) * weight,
  );
}

function relativeLuminance(hex: string): number {
  const channels = hexToRgb(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastText(background: string): string {
  return relativeLuminance(background) > 0.43 ? "#17120F" : "#FFF9F5";
}

async function resizeBanner(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    throw new Error("Use uma imagem JPEG, PNG ou WebP.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("A imagem deve ter no máximo 8 MB.");
  }

  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Não foi possível ler a imagem."));
      element.src = url;
    });

    const maxWidth = 1600;
    const scale = Math.min(1, maxWidth / image.width);
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível processar a imagem.");

    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/webp", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}
