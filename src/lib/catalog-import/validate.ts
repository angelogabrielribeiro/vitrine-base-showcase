import type { Product } from "@/types/commerce";
import type { ProductFieldKey } from "./fields";

export interface ValidatedRow {
  index: number; // número da linha no arquivo (2 = 1ª linha após cabeçalho)
  raw: Record<ProductFieldKey, string>;
  product: Product;
  errors: string[];
  warnings: string[];
}

export type DuplicatePolicy = "create" | "update" | "skip";

export interface ValidateOptions {
  storeSlug: string;
  existing: Product[];
  categoriesKnown: string[];
  policy: DuplicatePolicy;
}

export interface ValidationResult {
  rows: ValidatedRow[];
  counts: { valid: number; warnings: number; errors: number };
  duplicateSkusInFile: string[];
}

export function slugify(s: string): string {
  return s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80) || `item-${Date.now().toString(36)}`;
}

/** Aceita "19,90", "R$ 19,90", "1.234,56", "19.90". */
export function parseBRLNumber(v: string): number | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  if (!s) return undefined;
  const cleaned = s.replace(/[^\d,.\-]/g, "");
  if (!cleaned) return undefined;
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");
  let norm = cleaned;
  if (hasComma && hasDot) {
    // 1.234,56 → 1234.56
    norm = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    norm = cleaned.replace(",", ".");
  }
  const n = Number(norm);
  return Number.isFinite(n) ? n : undefined;
}

export function parseBoolean(v: string, fallback = true): boolean {
  const s = (v ?? "").toString().trim().toLowerCase();
  if (!s) return fallback;
  if (["true", "1", "sim", "yes", "y", "s", "ativo", "publicado", "on"].includes(s)) return true;
  if (["false", "0", "nao", "não", "no", "n", "inativo", "off"].includes(s)) return false;
  return fallback;
}

/** Divide por `;`; se ausente, por `,`. */
export function splitMulti(v: string): string[] {
  const s = (v ?? "").toString().trim();
  if (!s) return [];
  const sep = s.includes(";") ? ";" : ",";
  return s
    .split(sep)
    .map((x) => x.trim())
    .filter(Boolean);
}

function isHttpUrl(u: string): boolean {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Constrói candidatos Product a partir das linhas + mapeamento coluna→campo.
 */
export function validate(
  headers: string[],
  rows: string[][],
  mapping: Record<number, ProductFieldKey | null>,
  opts: ValidateOptions,
): ValidationResult {
  const bySku = new Map<string, Product>();
  for (const p of opts.existing) if (p.sku) bySku.set(p.sku.toLowerCase(), p);

  const seenSku = new Map<string, number>();
  const duplicateSkusInFile = new Set<string>();

  const validated: ValidatedRow[] = rows.map((row, i) => {
    const raw = {} as Record<ProductFieldKey, string>;
    for (const [colIdxStr, field] of Object.entries(mapping)) {
      if (!field) continue;
      const colIdx = Number(colIdxStr);
      raw[field] = (row[colIdx] ?? "").toString();
    }
    const errors: string[] = [];
    const warnings: string[] = [];

    const name = (raw.name ?? "").trim();
    if (!name) errors.push("Nome é obrigatório.");

    const price = parseBRLNumber(raw.price ?? "");
    if (price === undefined) errors.push("Preço inválido.");
    else if (price < 0) errors.push("Preço deve ser ≥ 0.");

    let salePrice: number | undefined;
    if (raw.salePrice && raw.salePrice.trim()) {
      const sp = parseBRLNumber(raw.salePrice);
      if (sp === undefined || sp < 0) errors.push("Preço promocional inválido.");
      else salePrice = sp;
    }

    let stock = 0;
    if (raw.stock && raw.stock.trim()) {
      const st = parseBRLNumber(raw.stock);
      if (st === undefined || st < 0 || !Number.isInteger(st))
        errors.push("Estoque deve ser inteiro ≥ 0.");
      else stock = st;
    }

    const images = splitMulti(raw.images ?? "");
    const goodImages: string[] = [];
    for (const url of images) {
      if (!isHttpUrl(url)) {
        errors.push(`URL de imagem inválida: ${url}`);
      } else {
        goodImages.push(url);
      }
    }

    const sizes = splitMulti(raw.sizes ?? "");
    const colors = splitMulti(raw.colors ?? "");
    const addons = splitMulti(raw.addons ?? "");

    const active = parseBoolean(raw.active ?? "", true);
    const featured = raw.featured ? parseBoolean(raw.featured, false) : false;

    let category = (raw.category ?? "").toString().trim();
    let categorySlug = category ? slugify(category) : "";
    if (categorySlug && !opts.categoriesKnown.includes(categorySlug)) {
      warnings.push(`Categoria "${category}" será criada como "${categorySlug}".`);
    }

    const sku = (raw.sku ?? "").toString().trim();
    if (sku) {
      const k = sku.toLowerCase();
      const prev = seenSku.get(k);
      if (prev !== undefined) {
        duplicateSkusInFile.add(sku);
        warnings.push(`SKU duplicado no arquivo (também na linha ${prev + 2}).`);
      } else {
        seenSku.set(k, i);
      }
    }

    const existingBySku = sku ? bySku.get(sku.toLowerCase()) : undefined;

    // Política de duplicidade
    if (existingBySku) {
      if (opts.policy === "skip") {
        warnings.push("SKU já existe: linha será ignorada.");
      } else if (opts.policy === "update") {
        warnings.push("Atualizará produto existente pelo SKU.");
      } else {
        warnings.push("SKU já existe na loja; será criado outro produto.");
      }
    }

    // id/slug: preserva existente se update
    const id =
      opts.policy === "update" && existingBySku
        ? existingBySku.id
        : `imp-${Date.now().toString(36)}-${i}`;
    const productSlug =
      opts.policy === "update" && existingBySku
        ? existingBySku.slug
        : slugify(name || sku || `produto-${i + 1}`);

    const product: Product = {
      id,
      slug: productSlug,
      name: name || `Produto ${i + 1}`,
      sku: sku || undefined,
      category: categorySlug || existingBySku?.category || (opts.categoriesKnown[0] ?? "geral"),
      description: (raw.description ?? "").toString(),
      price: price ?? 0,
      salePrice,
      images: goodImages,
      active,
      featured,
      unit: (raw.unit ?? "").toString().trim() || undefined,
      stock,
      addons: addons.length
        ? addons.map((n, ai) => ({ id: `${id}-add-${ai}`, name: n, price: 0 }))
        : existingBySku?.addons,
      variantOptions:
        sizes.length || colors.length
          ? [
              ...(sizes.length ? [{ name: "Tamanho", values: sizes }] : []),
              ...(colors.length ? [{ name: "Cor", values: colors }] : []),
            ]
          : existingBySku?.variantOptions,
    };

    return { index: i + 2, raw, product, errors, warnings };
  });

  const counts = {
    valid: validated.filter((r) => r.errors.length === 0).length,
    warnings: validated.filter((r) => r.errors.length === 0 && r.warnings.length > 0).length,
    errors: validated.filter((r) => r.errors.length > 0).length,
  };

  return { rows: validated, counts, duplicateSkusInFile: [...duplicateSkusInFile] };
}

/** Aplica política de duplicidade e devolve os Products a persistir. */
export function selectImportable(
  result: ValidationResult,
  existing: Product[],
  policy: DuplicatePolicy,
): { toSave: Product[]; created: number; updated: number; skipped: number } {
  const existingSkus = new Set(existing.filter((p) => p.sku).map((p) => p.sku!.toLowerCase()));
  const toSave: Product[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;
  for (const r of result.rows) {
    if (r.errors.length > 0) {
      skipped++;
      continue;
    }
    const skuKey = r.product.sku?.toLowerCase();
    const exists = skuKey ? existingSkus.has(skuKey) : false;
    if (exists && policy === "skip") {
      skipped++;
      continue;
    }
    if (exists && policy === "update") {
      updated++;
    } else {
      created++;
    }
    toSave.push(r.product);
  }
  return { toSave, created, updated, skipped };
}
