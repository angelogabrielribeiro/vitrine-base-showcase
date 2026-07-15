import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileUp,
  Info,
  Loader2,
  Upload,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { getStore } from "@/config/stores";
import { useRepo } from "@/hooks/use-repo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { brl } from "@/lib/format";
import type { ProductFieldKey } from "@/lib/catalog-import/fields";
import { PRODUCT_FIELDS, suggester } from "@/lib/catalog-import/fields";
import type { ParsedTable } from "@/lib/catalog-import/parse";
import { parseFile, MAX_FILE_BYTES, MAX_ROWS } from "@/lib/catalog-import/parse";
import type { DuplicatePolicy, ValidationResult } from "@/lib/catalog-import/validate";
import { selectImportable, validate } from "@/lib/catalog-import/validate";

export const Route = createFileRoute("/demo/$storeSlug/admin/importar-exportar")({
  component: ImportExportPage,
});

type Step = 1 | 2 | 3 | 4;

function ImportExportPage() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const isBarber = store.niche === "barber";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold">Importação assistida</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reconhecemos automaticamente as colunas e você confirma antes de importar.
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          Seu arquivo é processado somente neste navegador nesta demonstração.
        </p>
      </header>

      {isBarber ? (
        <Tabs defaultValue="produtos" className="w-full">
          <TabsList>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          </TabsList>
          <TabsContent value="produtos" className="mt-4">
            <ProductsPanel storeSlug={storeSlug} />
          </TabsContent>
          <TabsContent value="servicos" className="mt-4">
            <ExportOnlyPanel
              title="Serviços"
              description="Exporte os serviços cadastrados."
              onCsv={async () => {
                const { exportServicesCsv } = await import("@/lib/catalog-import/export");
                await exportServicesCsv(store, repo.listServices(storeSlug));
              }}
              onXlsx={async () => {
                const { exportXlsx } = await import("@/lib/catalog-import/export");
                await exportXlsx(store, { services: repo.listServices(storeSlug) });
              }}
            />
          </TabsContent>
          <TabsContent value="agendamentos" className="mt-4">
            <ExportOnlyPanel
              title="Agendamentos"
              description="Exporte a lista de agendamentos (sem dados sensíveis desnecessários)."
              onCsv={async () => {
                const { exportAppointmentsCsv } = await import("@/lib/catalog-import/export");
                await exportAppointmentsCsv(store, repo.listAppointments(storeSlug));
              }}
              onXlsx={async () => {
                const { exportXlsx } = await import("@/lib/catalog-import/export");
                await exportXlsx(store, { appointments: repo.listAppointments(storeSlug) });
              }}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <ProductsPanel storeSlug={storeSlug} />
      )}
    </div>
  );
}

function ProductsPanel({ storeSlug }: { storeSlug: string }) {
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [busy, setBusy] = useState(false);
  const [table, setTable] = useState<ParsedTable | null>(null);
  const [mapping, setMapping] = useState<Record<number, ProductFieldKey | null>>({});
  const [policy, setPolicy] = useState<DuplicatePolicy>("update");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [importOnlyValid, setImportOnlyValid] = useState(true);
  const [summary, setSummary] = useState<null | {
    created: number;
    updated: number;
    skipped: number;
    errors: number;
  }>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const knownCategories = useMemo(() => store.categories.map((c) => c.slug), [store]);

  const onFile = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      const parsed = await parseFile(file);
      const sug = suggester.suggest(parsed.headers);
      setTable(parsed);
      setMapping(sug);
      setResult(null);
      setSummary(null);
      setStep(2);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao ler arquivo.");
    } finally {
      setBusy(false);
    }
  };

  const runValidation = () => {
    if (!table) return;
    // Verificar mapeamento duplicado
    const seen = new Map<ProductFieldKey, number>();
    for (const [idx, key] of Object.entries(mapping)) {
      if (!key) continue;
      if (seen.has(key)) {
        toast.error(`Duas colunas mapeadas para "${labelOf(key)}". Ajuste antes de continuar.`);
        return;
      }
      seen.set(key, Number(idx));
    }
    // Verificar obrigatórios
    const required = PRODUCT_FIELDS.filter((f) => f.required).map((f) => f.key);
    for (const r of required) {
      if (!seen.has(r)) {
        toast.error(`Mapeamento obrigatório ausente: "${labelOf(r)}".`);
        return;
      }
    }
    const res = validate(table.headers, table.rows, mapping, {
      storeSlug,
      existing: repo.listProducts(storeSlug),
      categoriesKnown: knownCategories,
      policy,
    });
    setResult(res);
    setStep(3);
  };

  const runImport = () => {
    if (!result) return;
    setBusy(true);
    try {
      const existing = repo.listProducts(storeSlug);
      const filtered = importOnlyValid
        ? { ...result, rows: result.rows.filter((r) => r.errors.length === 0) }
        : result;
      const pick = selectImportable(filtered, existing, policy);
      repo.saveProducts(storeSlug, pick.toSave);
      setSummary({
        created: pick.created,
        updated: pick.updated,
        skipped: pick.skipped,
        errors: result.rows.filter((r) => r.errors.length > 0).length,
      });
      setStep(4);
      toast.success("Importação concluída");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao importar.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setStep(1);
    setTable(null);
    setMapping({});
    setResult(null);
    setSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <ExportBar
        onExportCsv={async () => {
          const { exportProductsCsv } = await import("@/lib/catalog-import/export");
          await exportProductsCsv(store, repo.listProducts(storeSlug));
        }}
        onExportXlsx={async () => {
          const { exportXlsx } = await import("@/lib/catalog-import/export");
          await exportXlsx(store, { products: repo.listProducts(storeSlug) });
        }}
        onTemplateCsv={async () => {
          const { downloadCsvTemplate } = await import("@/lib/catalog-import/templates");
          await downloadCsvTemplate(store.niche, store.slug);
        }}
        onTemplateXlsx={async () => {
          const { downloadXlsxTemplate } = await import("@/lib/catalog-import/templates");
          await downloadXlsxTemplate(store.niche, store.slug);
        }}
      />

      <Stepper step={step} />

      {step === 1 && (
        <StepUpload
          busy={busy}
          fileInputRef={fileInputRef}
          onFile={(f) => void onFile(f)}
        />
      )}

      {step === 2 && table && (
        <StepMap
          table={table}
          mapping={mapping}
          setMapping={setMapping}
          onBack={reset}
          onNext={runValidation}
        />
      )}

      {step === 3 && result && (
        <StepReview
          result={result}
          policy={policy}
          setPolicy={setPolicy}
          importOnlyValid={importOnlyValid}
          setImportOnlyValid={setImportOnlyValid}
          busy={busy}
          onBack={() => setStep(2)}
          onImport={runImport}
        />
      )}

      {step === 4 && summary && (
        <StepDone
          summary={summary}
          onReset={reset}
          onSeeProducts={() =>
            navigate({ to: "/demo/$storeSlug/admin/produtos", params: { storeSlug } })
          }
        />
      )}
    </div>
  );
}

function labelOf(k: ProductFieldKey): string {
  return PRODUCT_FIELDS.find((f) => f.key === k)?.label ?? k;
}

function Stepper({ step }: { step: Step }) {
  const steps = ["Enviar arquivo", "Mapear colunas", "Revisar dados", "Importar"];
  return (
    <ol className="flex flex-wrap gap-2 text-xs">
      {steps.map((s, i) => {
        const idx = (i + 1) as Step;
        const active = idx === step;
        const done = idx < step;
        return (
          <li
            key={s}
            className={
              "flex items-center gap-2 rounded-full border px-3 py-1 " +
              (active
                ? "border-primary bg-primary text-primary-foreground"
                : done
                ? "border-primary/40 text-primary"
                : "border-border text-muted-foreground")
            }
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-background/50 text-[10px] font-semibold text-foreground">
              {idx}
            </span>
            {s}
          </li>
        );
      })}
    </ol>
  );
}

function ExportBar({
  onExportCsv,
  onExportXlsx,
  onTemplateCsv,
  onTemplateXlsx,
}: {
  onExportCsv: () => Promise<void>;
  onExportXlsx: () => Promise<void>;
  onTemplateCsv: () => Promise<void>;
  onTemplateXlsx: () => Promise<void>;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const wrap = (key: string, fn: () => Promise<void>) => async () => {
    setBusy(key);
    try {
      await fn();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha.");
    } finally {
      setBusy(null);
    }
  };
  return (
    <section className="grid gap-3 rounded-[var(--radius)] border border-border bg-card p-4 sm:grid-cols-2">
      <div>
        <h2 className="font-semibold">Modelos para começar</h2>
        <p className="text-xs text-muted-foreground">Baixe e preencha antes de importar.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={wrap("tx", onTemplateXlsx)} disabled={!!busy}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Modelo Excel
          </Button>
          <Button variant="outline" size="sm" onClick={wrap("tc", onTemplateCsv)} disabled={!!busy}>
            <Download className="mr-2 h-4 w-4" />
            Modelo CSV
          </Button>
        </div>
      </div>
      <div>
        <h2 className="font-semibold">Exportar catálogo atual</h2>
        <p className="text-xs text-muted-foreground">Backup ou envio para terceiros.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={wrap("ex", onExportXlsx)} disabled={!!busy}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          <Button size="sm" variant="secondary" onClick={wrap("ec", onExportCsv)} disabled={!!busy}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>
    </section>
  );
}

function StepUpload({
  busy,
  fileInputRef,
  onFile,
}: {
  busy: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (f: File | null) => void;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <section
      className={
        "rounded-[var(--radius)] border-2 border-dashed p-8 text-center " +
        (drag ? "border-primary bg-primary/5" : "border-border bg-card")
      }
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onFile(e.dataTransfer.files?.[0] ?? null);
      }}
    >
      {busy ? (
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          Lendo arquivo...
        </div>
      ) : (
        <>
          <FileUp className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">Arraste um arquivo aqui ou clique para escolher.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Aceita .xlsx e .csv. Máximo {Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB e {MAX_ROWS} linhas.
          </p>
          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Escolher arquivo
            </Button>
          </div>
        </>
      )}
    </section>
  );
}

function StepMap({
  table,
  mapping,
  setMapping,
  onBack,
  onNext,
}: {
  table: ParsedTable;
  mapping: Record<number, ProductFieldKey | null>;
  setMapping: React.Dispatch<React.SetStateAction<Record<number, ProductFieldKey | null>>>;
  onBack: () => void;
  onNext: () => void;
}) {
  const duplicates = useMemo(() => {
    const c = new Map<ProductFieldKey, number>();
    for (const v of Object.values(mapping)) {
      if (!v) continue;
      c.set(v, (c.get(v) ?? 0) + 1);
    }
    return new Set([...c.entries()].filter(([, n]) => n > 1).map(([k]) => k));
  }, [mapping]);

  return (
    <section className="space-y-4">
      <div className="rounded-[var(--radius)] border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold">{table.sourceName}</h2>
            <p className="text-xs text-muted-foreground">
              {table.rows.length} linhas · {table.headers.length} colunas
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Confirme o campo que representa cada coluna do arquivo.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-4">Coluna do arquivo</th>
                <th className="pb-2 pr-4">Campo do produto</th>
                <th className="pb-2">Amostra</th>
              </tr>
            </thead>
            <tbody>
              {table.headers.map((h, i) => {
                const val = mapping[i] ?? "";
                const isDup = val && duplicates.has(val as ProductFieldKey);
                const sample = (table.rows[0]?.[i] ?? "").toString().slice(0, 60);
                return (
                  <tr key={i} className="border-t border-border">
                    <td className="py-2 pr-4 font-medium">{h || `Coluna ${i + 1}`}</td>
                    <td className="py-2 pr-4">
                      <Select
                        value={val || "__none__"}
                        onValueChange={(v) =>
                          setMapping((m) => ({
                            ...m,
                            [i]: v === "__none__" ? null : (v as ProductFieldKey),
                          }))
                        }
                      >
                        <SelectTrigger className={"h-9 w-full min-w-[180px] " + (isDup ? "border-amber-500" : "")}>
                          <SelectValue placeholder="Ignorar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Ignorar coluna</SelectItem>
                          {PRODUCT_FIELDS.map((f) => (
                            <SelectItem key={f.key} value={f.key}>
                              {f.label}
                              {f.required ? " *" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isDup && (
                        <p className="mt-1 text-[11px] text-amber-700">
                          Outra coluna também está mapeada aqui.
                        </p>
                      )}
                    </td>
                    <td className="py-2 text-xs text-muted-foreground">{sample}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Campos com * são obrigatórios (Nome e Preço).
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={onNext}>
          Revisar dados
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

function StepReview({
  result,
  policy,
  setPolicy,
  importOnlyValid,
  setImportOnlyValid,
  busy,
  onBack,
  onImport,
}: {
  result: ValidationResult;
  policy: DuplicatePolicy;
  setPolicy: (p: DuplicatePolicy) => void;
  importOnlyValid: boolean;
  setImportOnlyValid: (v: boolean) => void;
  busy: boolean;
  onBack: () => void;
  onImport: () => void;
}) {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Válidas" value={result.counts.valid} tone="ok" />
        <Stat label="Com avisos" value={result.counts.warnings} tone="warn" />
        <Stat label="Com erros" value={result.counts.errors} tone="err" />
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-card p-4">
        <h2 className="font-semibold">Política de duplicidade por SKU</h2>
        <RadioGroup
          value={policy}
          onValueChange={(v) => setPolicy(v as DuplicatePolicy)}
          className="mt-3 grid gap-2 sm:grid-cols-3"
        >
          <PolicyOption value="create" label="Criar novos" description="Sempre cria; SKUs existentes viram novo produto." />
          <PolicyOption value="update" label="Atualizar por SKU" description="Substitui o produto existente com o mesmo SKU." />
          <PolicyOption value="skip" label="Ignorar existentes" description="Só importa SKUs novos." />
        </RadioGroup>

        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={importOnlyValid}
            onChange={(e) => setImportOnlyValid(e.target.checked)}
            className="h-4 w-4"
          />
          Importar apenas linhas válidas (recomendado)
        </label>
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-card p-4">
        <h2 className="font-semibold">Prévia das linhas</h2>
        <div className="mt-3 max-h-[420px] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-card text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-2 py-2 text-left">Linha</th>
                <th className="px-2 py-2 text-left">Nome</th>
                <th className="px-2 py-2 text-left">SKU</th>
                <th className="px-2 py-2 text-right">Preço</th>
                <th className="px-2 py-2 text-right">Estoque</th>
                <th className="px-2 py-2 text-left">Problemas</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.slice(0, 200).map((r) => {
                const isErr = r.errors.length > 0;
                return (
                  <tr key={r.index} className={"border-t border-border " + (isErr ? "bg-red-500/5" : "")}>
                    <td className="px-2 py-1.5 text-muted-foreground">{r.index}</td>
                    <td className="px-2 py-1.5 font-medium">{r.product.name}</td>
                    <td className="px-2 py-1.5 text-xs text-muted-foreground">{r.product.sku ?? "—"}</td>
                    <td className="px-2 py-1.5 text-right">{brl(r.product.price)}</td>
                    <td className="px-2 py-1.5 text-right">{r.product.stock}</td>
                    <td className="px-2 py-1.5 text-xs">
                      {r.errors.map((m, k) => (
                        <div key={"e" + k} className="flex items-start gap-1 text-red-700">
                          <XCircle className="mt-0.5 h-3 w-3 shrink-0" />
                          {m}
                        </div>
                      ))}
                      {r.warnings.map((m, k) => (
                        <div key={"w" + k} className="flex items-start gap-1 text-amber-700">
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                          {m}
                        </div>
                      ))}
                      {r.errors.length === 0 && r.warnings.length === 0 && (
                        <span className="text-emerald-700">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {result.rows.length > 200 && (
            <p className="p-2 text-xs text-muted-foreground">
              Mostrando 200 primeiras. Todas as linhas válidas serão importadas.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={onImport} disabled={busy || result.counts.valid === 0}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Importar agora
        </Button>
      </div>
    </section>
  );
}

function PolicyOption({
  value,
  label,
  description,
}: {
  value: DuplicatePolicy;
  label: string;
  description: string;
}) {
  return (
    <Label
      htmlFor={`pol-${value}`}
      className="flex cursor-pointer items-start gap-2 rounded-md border border-border p-3 hover:bg-muted/40"
    >
      <RadioGroupItem id={`pol-${value}`} value={value} className="mt-0.5" />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
    </Label>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "warn" | "err";
}) {
  const cls =
    tone === "ok"
      ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700"
      : tone === "warn"
      ? "border-amber-500/40 bg-amber-500/5 text-amber-700"
      : "border-red-500/40 bg-red-500/5 text-red-700";
  return (
    <div className={"rounded-[var(--radius)] border p-3 " + cls}>
      <div className="text-xs uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function StepDone({
  summary,
  onReset,
  onSeeProducts,
}: {
  summary: { created: number; updated: number; skipped: number; errors: number };
  onReset: () => void;
  onSeeProducts: () => void;
}) {
  return (
    <section className="rounded-[var(--radius)] border border-border bg-card p-6 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
      <h2 className="mt-2 font-display text-2xl font-semibold">Importação concluída</h2>
      <div className="mx-auto mt-4 grid max-w-md gap-2 sm:grid-cols-4">
        <SmallStat label="Criados" value={summary.created} />
        <SmallStat label="Atualizados" value={summary.updated} />
        <SmallStat label="Ignorados" value={summary.skipped} />
        <SmallStat label="Com erro" value={summary.errors} />
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={onSeeProducts}>Ver produtos importados</Button>
        <Button variant="outline" onClick={onReset}>
          Importar outro arquivo
        </Button>
      </div>
    </section>
  );
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border p-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function ExportOnlyPanel({
  title,
  description,
  onCsv,
  onXlsx,
}: {
  title: string;
  description: string;
  onCsv: () => Promise<void>;
  onXlsx: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const wrap = (fn: () => Promise<void>) => async () => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="rounded-[var(--radius)] border border-border bg-card p-4">
      <h2 className="font-semibold">Exportar {title.toLowerCase()}</h2>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={wrap(onXlsx)} disabled={busy}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Excel
        </Button>
        <Button size="sm" variant="secondary" onClick={wrap(onCsv)} disabled={busy}>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>
    </section>
  );
}
