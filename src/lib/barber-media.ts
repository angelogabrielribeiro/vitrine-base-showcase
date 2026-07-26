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

/** Imagem genérica de barbearia (atmosfera). Último recurso antes do neutro. */
export const BARBER_DEFAULT_FALLBACK = u("1503951914875-452162b0f3f1");

/** Fallback por categoria de produto da Barber Noir. */
export const BARBER_CATEGORY_FALLBACK: Record<string, string> = {
  barba: u("1621605815971-fbc98d665033"),
  cabelo: u("1585747860715-2ba37e788b70"),
  "pos-barba": u("1521490878406-27953b71c3fc"),
  acessorios: u("1503951914875-452162b0f3f1"),
  kits: u("1622286346003-c5c7e63b6d1a"),
};

export function barberCategoryFallback(category?: string): string {
  if (!category) return BARBER_DEFAULT_FALLBACK;
  return BARBER_CATEGORY_FALLBACK[category] ?? BARBER_DEFAULT_FALLBACK;
}

/** Fallback para serviços da barbearia (independente da imagem original). */
export function barberServiceFallback(_slug?: string): string {
  return u("1622286346003-c5c7e63b6d1a");
}

/** Fallback para avatares de profissionais. */
export const BARBER_PROFESSIONAL_FALLBACK = u("1500648767791-00dcc994a43e", 600);