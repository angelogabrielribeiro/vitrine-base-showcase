/**
 * Mapa central de mídia da Barber Noir.
 *
 * Todas as imagens são arquivos locais em `public/media/barber-noir/`,
 * eliminando dependência de hotlink em runtime. SafeImage usa
 * `src={image}` + `fallbackSrc={barberCategoryFallback(cat)}` e só cai
 * no fallback neutro se ambas falharem.
 */

const local = (name: string) => `/media/barber-noir/${name}.webp`;

/** Fallback por categoria de PRODUTO da Barber Noir. */
export const BARBER_CATEGORY_FALLBACK: Record<string, string> = {
  barba: local("produto-oleo-barba-noir"),
  cabelo: local("produto-pomada-cabelo-matte"),
  "pos-barba": local("produto-pos-barba-locao"),
  acessorios: local("produto-pente-madeira"),
  kits: local("produto-kit-barba-completo"),
};

/** Último recurso: imagem genérica de produto de grooming. */
export const BARBER_DEFAULT_FALLBACK = BARBER_CATEGORY_FALLBACK.barba;

export function barberCategoryFallback(category?: string): string {
  if (!category) return BARBER_DEFAULT_FALLBACK;
  return BARBER_CATEGORY_FALLBACK[category] ?? BARBER_DEFAULT_FALLBACK;
}

/** Fallback por SLUG de serviço, com imagem local distinta por item. */
export const BARBER_SERVICE_FALLBACK: Record<string, string> = {
  "corte-classico": local("servico-corte-classico"),
  "corte-degrade": local("servico-corte-degrade"),
  "barba-desenhada": local("servico-barba-desenhada"),
  "ritual-completo": local("servico-ritual-completo"),
  pigmentacao: local("servico-pigmentacao"),
  sobrancelha: local("servico-sobrancelha"),
};

/** Fallback genérico caso o slug não esteja mapeado. */
const BARBER_SERVICE_DEFAULT = local("servico-corte-classico");

export function barberServiceFallback(slug?: string): string {
  if (!slug) return BARBER_SERVICE_DEFAULT;
  return BARBER_SERVICE_FALLBACK[slug] ?? BARBER_SERVICE_DEFAULT;
}

/** Fallback para avatares de profissionais. */
export const BARBER_PROFESSIONAL_FALLBACK =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80";