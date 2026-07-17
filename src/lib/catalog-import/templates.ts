import type { StoreNiche } from "@/types/commerce";
import { PRODUCT_HEADERS } from "./export";

function nicheExamples(niche: StoreNiche): (string | number)[][] {
  if (niche === "fashion") {
    return [
      [
        "MB-VS-001",
        "Vestido Midi Linho",
        "Vestido midi em linho puro com caimento fluido.",
        "vestidos",
        459.9,
        379.9,
        12,
        "https://images.unsplash.com/photo-1520975916090-3105956dac38",
        "P; M; G",
        "Bege; Preto",
        "Sim",
        "Sim",
        "",
        "",
      ],
      [
        "MB-BL-014",
        "Blusa Seda Off",
        "Blusa em seda leve, ideal para dias quentes.",
        "blusas",
        289,
        "",
        20,
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
        "P; M; G",
        "Off White",
        "Sim",
        "Não",
        "",
        "",
      ],
    ];
  }
  if (niche === "restaurant") {
    return [
      [
        "BR-HB-01",
        "Burger Brasa Duplo",
        "Duas carnes 160g, cheddar, bacon e molho da casa.",
        "hamburgueres",
        49.9,
        "",
        100,
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        "",
        "",
        "Sim",
        "Sim",
        "",
        "Cheddar extra; Bacon extra; Sem cebola",
      ],
      [
        "BR-BB-02",
        "Batata Rústica",
        "Batata rústica crocante com alecrim.",
        "acompanhamentos",
        24.9,
        19.9,
        200,
        "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5",
        "",
        "",
        "Sim",
        "Não",
        "",
        "",
      ],
    ];
  }
  if (niche === "electronics") {
    return [
      [
        "NC-XPRO-256",
        "NovaCore X Pro 5G",
        "Flagship 6.7\" AMOLED 120Hz, chip Fusion e câmera 200MP.",
        "smartphones",
        8999,
        7499,
        40,
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        "256GB; 512GB",
        "Grafite; Prata",
        "Sim",
        "Sim",
        "",
        "",
      ],
      [
        "NC-HST-TTN",
        "Headset Gamer Nova Titan",
        "Áudio 7.1, drivers 50mm, RGB dinâmico.",
        "gamer",
        899,
        699,
        60,
        "https://images.unsplash.com/photo-1599669454699-248893623440",
        "",
        "",
        "Sim",
        "Sim",
        "",
        "",
      ],
    ];
  }
  // barber
  return [
    [
      "BN-PM-001",
      "Pomada Modeladora Matte",
      "Fixação forte com acabamento fosco.",
      "grooming",
      89.9,
      74.9,
      30,
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07",
      "",
      "",
      "Sim",
      "Sim",
      "100g",
      "",
    ],
    [
      "BN-SH-002",
      "Shampoo Barba Cedro",
      "Higieniza sem ressecar. Perfume amadeirado.",
      "grooming",
      69,
      "",
      40,
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
      "",
      "",
      "Sim",
      "Não",
      "200ml",
      "",
    ],
  ];
}

async function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadCsvTemplate(niche: StoreNiche, storeSlug: string) {
  const Papa = (await import("papaparse")).default;
  const rows = [[...PRODUCT_HEADERS], ...nicheExamples(niche)];
  const csv = Papa.unparse(rows.map((r) => r.map((v) => (v == null ? "" : v))));
  await downloadBlob(
    new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }),
    `modelo-produtos-${storeSlug}.csv`,
  );
}

export async function downloadXlsxTemplate(niche: StoreNiche, storeSlug: string) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Produtos");
  ws.addRow([...PRODUCT_HEADERS]);
  ws.getRow(1).font = { bold: true };
  nicheExamples(niche).forEach((r) => ws.addRow(r));
  ws.columns.forEach((c) => {
    c.width = 20;
  });

  const inst = wb.addWorksheet("Instruções");
  const lines: [string, string][] = [
    ["Como usar este modelo", ""],
    ["Cada linha vira um produto.", ""],
    ["Nome e Preço são obrigatórios.", ""],
    ["Preço", "Use vírgula ou ponto: 19,90 ou 19.90. Aceita R$ 19,90."],
    ["Preço promocional", "Deixe vazio se não houver promoção."],
    ["Estoque", "Número inteiro. Use 0 para esgotado."],
    [
      "Imagens",
      "Cole URLs http/https separadas por ponto e vírgula. Ex.: https://... ; https://...",
    ],
    ["Tamanhos / Cores", "Separe por ponto e vírgula. Ex.: P; M; G."],
    ["Ativo / Destaque", "Use Sim ou Não."],
    ["Categoria", "Se a categoria não existir, será criada automaticamente."],
    ["Adicionais", "Só para restaurantes. Separe por ponto e vírgula."],
    ["", ""],
    ["Dica", "Baixe primeiro o modelo, preencha e depois importe pela mesma tela."],
  ];
  lines.forEach((r) => inst.addRow(r));
  inst.getRow(1).font = { bold: true, size: 14 };
  inst.getColumn(1).width = 26;
  inst.getColumn(2).width = 70;

  const buf = await wb.xlsx.writeBuffer();
  await downloadBlob(
    new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `modelo-produtos-${storeSlug}.xlsx`,
  );
}
