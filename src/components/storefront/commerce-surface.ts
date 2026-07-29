import type { StoreNiche } from "@/types/commerce";

export interface CommerceSurface {
  shell: string;
  panel: string;
  panelStrong: string;
  border: string;
  muted: string;
  accent: string;
  accentText: string;
  accentSoft: string;
  button: string;
  outlineButton: string;
  eyebrow: string;
  catalogKicker: string;
  catalogTitle: string;
  catalogCopy: string;
  productKicker: string;
  proof: [string, string, string];
}

export const COMMERCE_SURFACES: Record<StoreNiche, CommerceSurface> = {
  fashion: {
    shell: "bg-[#f3efe8] text-[#201c19]",
    panel: "bg-[#fbf8f2]",
    panelStrong: "bg-[#2a201d] text-[#fbf8f2]",
    border: "border-[#2a201d]/15",
    muted: "text-[#756a63]",
    accent: "bg-[#8f5548]",
    accentText: "text-[#8f5548]",
    accentSoft: "bg-[#8f5548]/10",
    button: "bg-[#2a201d] text-white hover:bg-[#8f5548]",
    outlineButton: "border-[#2a201d]/20 hover:border-[#2a201d] hover:bg-white/70",
    eyebrow: "text-[#8f5548]",
    catalogKicker: "Maison Edit / Curadoria 2026",
    catalogTitle: "Peças que mudam o ritmo de uma sala.",
    catalogCopy:
      "Uma seleção construída como editorial: proporção, textura e movimento em primeiro plano.",
    productKicker: "Atelier selection",
    proof: ["Pequenos lotes", "Troca em 30 dias", "Envio nacional"],
  },
  barber: {
    shell: "bg-[#0b0b0d] text-[#f4efe5]",
    panel: "bg-[#111114]",
    panelStrong: "bg-[#171515]",
    border: "border-[#d9b166]/20",
    muted: "text-[#a49d92]",
    accent: "bg-[#d9b166]",
    accentText: "text-[#d9b166]",
    accentSoft: "bg-[#d9b166]/10",
    button: "bg-[#d9b166] text-[#111] hover:bg-[#f0cf8d]",
    outlineButton: "border-[#d9b166]/30 hover:border-[#d9b166] hover:bg-[#d9b166]/10",
    eyebrow: "text-[#d9b166]",
    catalogKicker: "The grooming cabinet",
    catalogTitle: "Ferramentas para manter o ritual.",
    catalogCopy:
      "Fórmulas, acessórios e assinaturas da casa organizados como uma coleção de precisão.",
    productKicker: "Barber Noir object",
    proof: ["Curadoria da casa", "Retirada expressa", "Ritual garantido"],
  },
  restaurant: {
    shell: "bg-[#160d09] text-[#fff4e8]",
    panel: "bg-[#21120c]",
    panelStrong: "bg-[#2a160e]",
    border: "border-[#ff6b2c]/20",
    muted: "text-[#c7aa97]",
    accent: "bg-[#ff642b]",
    accentText: "text-[#ff7b3f]",
    accentSoft: "bg-[#ff642b]/10",
    button: "bg-[#ff642b] text-[#190b06] hover:bg-[#ff8a50]",
    outlineButton: "border-[#ff8a50]/30 hover:border-[#ff8a50] hover:bg-[#ff642b]/10",
    eyebrow: "text-[#ff8a50]",
    catalogKicker: "Da chapa para agora",
    catalogTitle: "Escolha pelo desejo. A brasa faz o resto.",
    catalogCopy:
      "Um cardápio vivo, direto e sem fotografia tímida. Cada pedido começa pelos olhos.",
    productKicker: "Brasa signature",
    proof: ["Feito no pedido", "Ingredientes frescos", "Entrega rastreada"],
  },
  electronics: {
    shell: "bg-[#050714] text-white",
    panel: "bg-[#080c1c]",
    panelStrong: "bg-[#0a1025]",
    border: "border-cyan-200/15",
    muted: "text-slate-400",
    accent: "bg-cyan-300",
    accentText: "text-cyan-200",
    accentSoft: "bg-cyan-300/[0.07]",
    button: "bg-cyan-300 text-[#050714] hover:bg-white",
    outlineButton: "border-cyan-200/20 hover:border-cyan-200/60 hover:bg-cyan-300/[0.08]",
    eyebrow: "text-cyan-200",
    catalogKicker: "NovaCore systems index",
    catalogTitle: "Performance não deveria parecer comum.",
    catalogCopy:
      "Hardware organizado por intenção, com sinais técnicos e interação de produto em cada camada.",
    productKicker: "Verified specimen",
    proof: ["Bancada verificada", "Garantia NovaCore", "Envio 24h"],
  },
};

export const commerceSurface = (niche: StoreNiche) => COMMERCE_SURFACES[niche];
