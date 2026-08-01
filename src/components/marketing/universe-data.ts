import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  MessageCircle,
  PackageSearch,
  Store,
  type LucideIcon,
} from "lucide-react";
import { STORES } from "@/config/stores";

export type UniverseCapabilityKind =
  | "vitrine"
  | "catalogo"
  | "checkout"
  | "painel"
  | "whatsapp"
  | "agenda";

export type UniverseCapability = {
  kind: UniverseCapabilityKind;
  icon: LucideIcon;
  label: string;
  detail: string;
  /** Rota interna real da demonstração, quando existir. */
  path?: "" | "produtos" | "carrinho" | "admin" | "agendar";
};

export type Universe = {
  slug: string;
  name: string;
  tagline: string;
  niche: string;
  number: string;
  label: string;
  image: string;
  /** Cor de energia compartilhada entre hero, capítulos e configurador. */
  accent: string;
  accentSoft: string;
  material: string;
  problem: string;
  solution: string;
  gesture: string;
  capabilities: UniverseCapability[];
};

const CAP: Record<UniverseCapabilityKind, { icon: LucideIcon; label: string }> = {
  vitrine: { icon: Store, label: "Vitrine" },
  catalogo: { icon: PackageSearch, label: "Catálogo" },
  checkout: { icon: CreditCard, label: "Checkout" },
  painel: { icon: LayoutDashboard, label: "Painel" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp" },
  agenda: { icon: CalendarDays, label: "Agenda" },
};

function cap(
  kind: UniverseCapabilityKind,
  detail: string,
  path?: UniverseCapability["path"],
  label?: string,
): UniverseCapability {
  return { kind, icon: CAP[kind].icon, label: label ?? CAP[kind].label, detail, path };
}

const META: Record<
  string,
  Omit<Universe, "slug" | "name" | "tagline" | "niche" | "image">
> = {
  moda: {
    number: "01",
    label: "Moda e varejo",
    accent: "#d58c9a",
    accentSoft: "#e6c477",
    material: "linho, papel e luz difusa",
    problem: "Coleções espalhadas entre posts, destaques e mensagens.",
    solution:
      "Uma vitrine editorial que transforma peça, composição e compra em uma leitura contínua.",
    gesture: "Arraste para girar a coleção",
    capabilities: [
      cap("vitrine", "Home editorial com galeria 3D e capítulos de coleção.", ""),
      cap("catalogo", "Grade compacta, variações de tamanho e cor, estoque real.", "produtos"),
      cap("checkout", "Sacola, frete, cupom e confirmação sem sair do clima da marca.", "carrinho"),
      cap("painel", "Cadastro de peças, imagens, preços e pedidos.", "admin"),
      cap("whatsapp", "Resumo do pedido enviado pronto para a atendente conferir."),
    ],
  },
  barbearia: {
    number: "02",
    label: "Serviços e agenda",
    accent: "#d8ae57",
    accentSoft: "#8a6d36",
    material: "aço escovado, couro e âmbar",
    problem: "Agenda dependente de trocas manuais de mensagens.",
    solution:
      "Serviços, profissionais e horários organizados para o cliente reservar sozinho, em minutos.",
    gesture: "Arraste para entrar no salão",
    capabilities: [
      cap("vitrine", "Home cinematográfica com ritual, equipe e resultados.", ""),
      cap("agenda", "Fluxo de agendamento com serviço, profissional, data e horário.", "agendar"),
      cap("catalogo", "Linha de grooming com produtos, kits e estoque.", "produtos"),
      cap("painel", "Agendamentos, profissionais e configurações do salão.", "admin"),
      cap("whatsapp", "Confirmação do horário aberta automaticamente após reservar."),
    ],
  },
  restaurante: {
    number: "03",
    label: "Pedidos locais",
    accent: "#ff7448",
    accentSoft: "#e6c477",
    material: "brasa, ferro e vapor",
    problem: "Cardápio, adicionais e pedidos difíceis de conferir.",
    solution:
      "Uma experiência quente e direta para escolher, personalizar e fechar o pedido sem dúvida.",
    gesture: "Arraste para abrir o cardápio",
    capabilities: [
      cap("vitrine", "Home apetitosa com destaques, combos e ambiente.", ""),
      cap("catalogo", "Cardápio por categoria, adicionais, ponto e observações.", "produtos"),
      cap("checkout", "Retirada ou entrega local, taxa, troco e pagamento na entrega.", "carrinho"),
      cap("painel", "Fila de pedidos com status de preparo, pronto e entregue.", "admin"),
      cap("whatsapp", "Pedido completo enviado para a cozinha em texto legível."),
    ],
  },
  eletronicos: {
    number: "04",
    label: "Catálogo técnico",
    accent: "#65dde9",
    accentSoft: "#9275f5",
    material: "vidro, alumínio e energia azul",
    problem: "Produtos técnicos apresentados sem hierarquia nem contexto.",
    solution:
      "Categorias, especificações e compra organizadas em um ambiente digital de alta precisão.",
    gesture: "Arraste para atravessar o campo",
    capabilities: [
      cap("vitrine", "Home tecnológica com campo de energia e destaques.", ""),
      cap("catalogo", "Filtros, especificações, variações e comparação de itens.", "produtos"),
      cap("checkout", "Envio, pagamento e confirmação com resumo técnico.", "carrinho"),
      cap("painel", "Importação de catálogo, estoque e pedidos.", "admin"),
      cap("whatsapp", "Atendimento com o item exato que o cliente estava vendo."),
    ],
  },
};

export const UNIVERSES: Universe[] = STORES.map((store) => {
  const meta = META[store.slug];
  return {
    slug: store.slug,
    name: store.name,
    tagline: store.tagline,
    niche: store.niche,
    image: store.banners[0]?.image ?? "",
    ...meta,
  };
});

export function universeHref(slug: string, path: UniverseCapability["path"]) {
  return path ? `/demo/${slug}/${path}` : `/demo/${slug}`;
}