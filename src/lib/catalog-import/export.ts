import type { Appointment, Product, Service, StoreConfig } from "@/types/commerce";

export const PRODUCT_HEADERS = [
  "SKU",
  "Nome",
  "Descrição",
  "Categoria",
  "Preço",
  "Preço promocional",
  "Estoque",
  "Imagens",
  "Tamanhos",
  "Cores",
  "Ativo",
  "Destaque",
  "Peso/Unidade",
  "Adicionais",
] as const;

export const SERVICE_HEADERS = [
  "Código",
  "Nome",
  "Descrição",
  "Duração (min)",
  "Preço",
  "Ativo",
] as const;

export const APPOINTMENT_HEADERS = [
  "Número",
  "Status",
  "Serviço",
  "Profissional",
  "Data",
  "Horário",
  "Cliente",
  "WhatsApp",
  "Preço",
  "Criado em",
] as const;

function joinMulti(arr: string[] | undefined): string {
  return (arr ?? []).join("; ");
}

function findVariant(p: Product, name: string): string[] {
  const vo = p.variantOptions?.find((v) => v.name.toLowerCase() === name.toLowerCase());
  return vo?.values ?? [];
}

function productToRow(p: Product): (string | number | undefined)[] {
  return [
    p.sku ?? "",
    p.name,
    p.description ?? "",
    p.category,
    p.price,
    p.salePrice ?? "",
    p.stock ?? 0,
    joinMulti(p.images),
    joinMulti(findVariant(p, "Tamanho")),
    joinMulti(findVariant(p, "Cor")),
    p.active ? "Sim" : "Não",
    p.featured ? "Sim" : "Não",
    p.unit ?? "",
    joinMulti(p.addons?.map((a) => a.name)),
  ];
}

function serviceToRow(s: Service): (string | number)[] {
  return [s.slug, s.name, s.description ?? "", s.durationMinutes, s.price, s.active ? "Sim" : "Não"];
}

function appointmentToRow(a: Appointment): (string | number)[] {
  return [
    a.number,
    a.status,
    a.serviceName,
    a.professionalName,
    a.date,
    a.time,
    a.customer.name,
    a.customer.whatsapp,
    a.price,
    a.createdAt,
  ];
}

function todayStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function toCsvBlob(rows: (string | number | undefined)[][]): Promise<Blob> {
  const Papa = (await import("papaparse")).default;
  const csv = Papa.unparse(rows.map((r) => r.map((v) => (v == null ? "" : v))));
  return new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
}

export async function exportProductsCsv(store: StoreConfig, products: Product[]) {
  const rows: (string | number | undefined)[][] = [
    [...PRODUCT_HEADERS],
    ...products.map(productToRow),
  ];
  const blob = await toCsvBlob(rows);
  downloadBlob(blob, `produtos-${store.slug}-${todayStamp()}.csv`);
}

export async function exportServicesCsv(store: StoreConfig, services: Service[]) {
  const rows: (string | number | undefined)[][] = [[...SERVICE_HEADERS], ...services.map(serviceToRow)];
  const blob = await toCsvBlob(rows);
  downloadBlob(blob, `servicos-${store.slug}-${todayStamp()}.csv`);
}

export async function exportAppointmentsCsv(store: StoreConfig, appts: Appointment[]) {
  const rows: (string | number | undefined)[][] = [
    [...APPOINTMENT_HEADERS],
    ...appts.map(appointmentToRow),
  ];
  const blob = await toCsvBlob(rows);
  downloadBlob(blob, `agendamentos-${store.slug}-${todayStamp()}.csv`);
}

function stylizeHeader(row: import("exceljs").Row) {
  row.font = { bold: true };
  row.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEDEDED" } } as never;
  });
}

export async function exportXlsx(
  store: StoreConfig,
  args: {
    products?: Product[];
    services?: Service[];
    appointments?: Appointment[];
  },
) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Vitrine Base";
  wb.created = new Date();

  if (args.products) {
    const ws = wb.addWorksheet("Produtos");
    ws.addRow([...PRODUCT_HEADERS]);
    stylizeHeader(ws.getRow(1));
    args.products.forEach((p) => ws.addRow(productToRow(p)));
    ws.columns.forEach((c) => {
      c.width = 18;
    });
  }
  if (args.services) {
    const ws = wb.addWorksheet("Serviços");
    ws.addRow([...SERVICE_HEADERS]);
    stylizeHeader(ws.getRow(1));
    args.services.forEach((s) => ws.addRow(serviceToRow(s)));
    ws.columns.forEach((c) => {
      c.width = 20;
    });
  }
  if (args.appointments) {
    const ws = wb.addWorksheet("Agendamentos");
    ws.addRow([...APPOINTMENT_HEADERS]);
    stylizeHeader(ws.getRow(1));
    args.appointments.forEach((a) => ws.addRow(appointmentToRow(a)));
    ws.columns.forEach((c) => {
      c.width = 18;
    });
  }

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const kinds = [
    args.products ? "produtos" : null,
    args.services ? "servicos" : null,
    args.appointments ? "agendamentos" : null,
  ].filter(Boolean).join("-") || "export";
  downloadBlob(blob, `${kinds}-${store.slug}-${todayStamp()}.xlsx`);
}
