/**
 * Mapa central de mídia da Barber Noir.
 *
 * Objetivo: garantir que produtos e serviços tenham SEMPRE uma imagem
 * coerente com a categoria mesmo quando a imagem principal falhar
 * (URL quebrada, hotlink bloqueado ou id de Unsplash trocado).
 *
 * Uso: SafeImage recebe `src={image}` e `fallbackSrc={barberCategoryFallback(cat)}`.
 * Somente se ambas falharem cai no fallback neutro abstrato do SafeImage.
 */

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * Fallback por categoria de PRODUTO da Barber Noir. Cada categoria aponta
 * para uma imagem coerente com o item (frasco de óleo, pomada, aftershave,
 * pente, kit) — nunca interior de barbearia como fallback de produto.
 */
export const BARBER_CATEGORY_FALLBACK: Record<string, string> = {
  barba: u("1775127596288-9249a530cab7"),
  cabelo: u("1775127741095-86ee33b6b385"),
  "pos-barba": u("1553265393-2055017658a2"),
  acessorios: u("1680670500665-22e480bcb0fa"),
  kits: u("1775126251074-cd5f4cfdf7c9"),
};

/** Último recurso: imagem genérica de produto de grooming (frasco). */
export const BARBER_DEFAULT_FALLBACK = BARBER_CATEGORY_FALLBACK.barba;

export function barberCategoryFallback(category?: string): string {
  if (!category) return BARBER_DEFAULT_FALLBACK;
  return BARBER_CATEGORY_FALLBACK[category] ?? BARBER_DEFAULT_FALLBACK;
}

/**
 * Fallback por SLUG de serviço. Cada serviço tem uma imagem própria e
 * distinta, para não reutilizar a mesma foto em toda a carta.
 */
export const BARBER_SERVICE_FALLBACK: Record<string, string> = {
  "corte-classico": u("1585747860715-2ba37e788b70"),
  "corte-degrade": u("1639511177364-0866c0da16fa"),
  "barba-desenhada": u("1621605815971-fbc98d665033"),
  "ritual-completo": u("1761148438883-e34e0289a214"),
  pigmentacao: u("1747352690408-0381bf50ec95"),
  sobrancelha: u("1764269724210-2dee78f4fb09"),
};

/** Fallback genérico caso o slug não esteja mapeado. */
const BARBER_SERVICE_DEFAULT = u("1585747860715-2ba37e788b70");

export function barberServiceFallback(slug?: string): string {
  if (!slug) return BARBER_SERVICE_DEFAULT;
  return BARBER_SERVICE_FALLBACK[slug] ?? BARBER_SERVICE_DEFAULT;
}

/** Fallback para avatares de profissionais. */
export const BARBER_PROFESSIONAL_FALLBACK = u("1500648767791-00dcc994a43e", 600);