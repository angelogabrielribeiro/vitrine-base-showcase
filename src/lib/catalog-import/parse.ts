// Leitura de .xlsx e .csv com imports dinâmicos.
// Nenhum dado sai do navegador.

export interface ParsedTable {
  sourceName: string; // nome do arquivo ou "arquivo.xlsx › Aba 1"
  headers: string[];
  rows: string[][]; // valores como strings
}

export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_ROWS = 5000;

function stringifyCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.text === "string") return o.text;
    if (Array.isArray(o.richText)) return (o.richText as Array<{ text: string }>).map((p) => p.text).join("");
    if (typeof o.result !== "undefined") return stringifyCell(o.result);
    if (typeof o.hyperlink === "string") return o.hyperlink;
    if (typeof o.formula === "string") return "";
  }
  return String(v);
}

export async function parseFile(file: File): Promise<ParsedTable> {
  if (!file) throw new Error("Nenhum arquivo selecionado.");
  if (file.size === 0) throw new Error("Arquivo vazio.");
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Arquivo grande demais. Máximo 5 MB.");
  }
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".xls") && !lower.endsWith(".xlsx")) {
    throw new Error(
      "Este formato .xls antigo não é suportado. Salve como .xlsx ou .csv e envie novamente.",
    );
  }
  if (lower.endsWith(".csv")) return parseCsv(file);
  if (lower.endsWith(".xlsx")) return parseXlsx(file);
  // fallback por tipo MIME
  if (file.type.includes("csv")) return parseCsv(file);
  return parseXlsx(file);
}

async function parseCsv(file: File): Promise<ParsedTable> {
  const Papa = (await import("papaparse")).default;
  const text = await file.text();
  // Detectar delimitador simples: se houver mais ";" do que "," na 1ª linha
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const semiCount = (firstLine.match(/;/g) ?? []).length;
  const commaCount = (firstLine.match(/,/g) ?? []).length;
  const delimiter = semiCount > commaCount ? ";" : ",";
  const parsed = Papa.parse<string[]>(text, {
    delimiter,
    skipEmptyLines: true,
  });
  const data = (parsed.data ?? []) as string[][];
  if (!data.length) throw new Error("CSV sem dados.");
  const headers = (data[0] ?? []).map((h) => stringifyCell(h));
  const rows = data.slice(1).map((r) => r.map(stringifyCell));
  if (rows.length > MAX_ROWS) {
    throw new Error(`Arquivo com muitas linhas. Máximo ${MAX_ROWS}.`);
  }
  return { sourceName: file.name, headers, rows };
}

async function parseXlsx(file: File): Promise<ParsedTable> {
  const ExcelJS = (await import("exceljs")).default;
  const buf = await file.arrayBuffer();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);
  const sheet = wb.worksheets.find((s) => s.rowCount > 0);
  if (!sheet) throw new Error("Planilha vazia.");
  const rowsRaw: string[][] = [];
  sheet.eachRow({ includeEmpty: false }, (row) => {
    const values = row.values as unknown[];
    // exceljs coloca undefined no índice 0
    const trimmed = values.slice(1).map(stringifyCell);
    rowsRaw.push(trimmed);
  });
  if (!rowsRaw.length) throw new Error("Planilha sem dados.");
  const headers = rowsRaw[0];
  const rows = rowsRaw.slice(1);
  if (rows.length > MAX_ROWS) {
    throw new Error(`Arquivo com muitas linhas. Máximo ${MAX_ROWS}.`);
  }
  return {
    sourceName: `${file.name} › ${sheet.name}`,
    headers,
    rows,
  };
}
