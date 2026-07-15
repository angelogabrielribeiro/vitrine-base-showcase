// Definição dos campos importáveis de produto e reconhecimento
// automático de cabeçalhos em português (determinístico, sem IA).

export type ProductFieldKey =
  | "sku"
  | "name"
  | "description"
  | "category"
  | "price"
  | "salePrice"
  | "stock"
  | "images"
  | "sizes"
  | "colors"
  | "active"
  | "featured"
  | "unit"
  | "addons";

export interface ProductFieldDef {
  key: ProductFieldKey;
  label: string;
  aliases: string[];
  required?: boolean;
}

export const PRODUCT_FIELDS: ProductFieldDef[] = [
  { key: "sku", label: "SKU", aliases: ["sku", "codigo", "código", "referencia", "referência", "ref"] },
  { key: "name", label: "Nome", aliases: ["nome", "produto", "titulo", "título", "name", "title"], required: true },
  { key: "description", label: "Descrição", aliases: ["descricao", "descrição", "description", "desc"] },
  { key: "category", label: "Categoria", aliases: ["categoria", "category"] },
  { key: "price", label: "Preço", aliases: ["preco", "preço", "valor", "price"], required: true },
  {
    key: "salePrice",
    label: "Preço promocional",
    aliases: [
      "preco promocional",
      "preço promocional",
      "promocao",
      "promoção",
      "promo",
      "sale price",
      "sale",
      "preco promo",
      "preço promo",
    ],
  },
  { key: "stock", label: "Estoque", aliases: ["estoque", "quantidade", "qtd", "stock", "qty"] },
  {
    key: "images",
    label: "Imagens",
    aliases: ["imagem", "foto", "imagem url", "imagens", "fotos", "images", "image", "url"],
  },
  { key: "sizes", label: "Tamanhos", aliases: ["tamanhos", "tamanho", "sizes", "size"] },
  { key: "colors", label: "Cores", aliases: ["cores", "cor", "colors", "color"] },
  { key: "active", label: "Ativo", aliases: ["ativo", "publicado", "status", "active"] },
  { key: "featured", label: "Destaque", aliases: ["destaque", "featured"] },
  { key: "unit", label: "Peso/Unidade", aliases: ["peso", "volume", "unidade", "peso/unidade", "peso unidade", "unit"] },
  { key: "addons", label: "Adicionais", aliases: ["adicionais", "complementos", "addons", "addon"] },
];

/** Cabeçalho normalizado: minúsculo, sem acentos, sem pontuação, espaços colapsados. */
export function normalizeHeader(h: string): string {
  return h
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Interface para futuros sugeridores (ex.: ML). */
export interface ColumnMappingSuggester {
  suggest(headers: string[]): Record<number, ProductFieldKey | null>;
}

/** Sugere mapeamento por aliases de cabeçalho. */
export class HeaderAliasMappingSuggester implements ColumnMappingSuggester {
  suggest(headers: string[]): Record<number, ProductFieldKey | null> {
    const used = new Set<ProductFieldKey>();
    const result: Record<number, ProductFieldKey | null> = {};
    const normFields = PRODUCT_FIELDS.map((f) => ({
      key: f.key,
      aliases: f.aliases.map(normalizeHeader),
    }));
    headers.forEach((raw, i) => {
      const norm = normalizeHeader(raw ?? "");
      let hit: ProductFieldKey | null = null;
      if (norm) {
        for (const f of normFields) {
          if (used.has(f.key)) continue;
          if (f.aliases.includes(norm)) {
            hit = f.key;
            break;
          }
        }
        if (!hit) {
          // heurística: cabeçalho contém alias como palavra
          for (const f of normFields) {
            if (used.has(f.key)) continue;
            if (f.aliases.some((a) => norm === a || norm.includes(a))) {
              hit = f.key;
              break;
            }
          }
        }
      }
      result[i] = hit;
      if (hit) used.add(hit);
    });
    return result;
  }
}

export const suggester = new HeaderAliasMappingSuggester();
