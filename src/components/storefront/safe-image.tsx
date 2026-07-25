import { useState, type ImgHTMLAttributes } from "react";
import { Scissors } from "lucide-react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "onError"> & {
  src?: string;
  alt: string;
  fallbackLabel?: string;
  monogram?: string;
};

/**
 * Imagem com fallback dark (Barber Noir). Se `src` for vazia ou falhar ao
 * carregar, renderiza um bloco escuro com monograma + rótulo curto no lugar,
 * evitando o "vazio branco/cinza" que aparecia quando URLs quebravam.
 */
export function SafeImage({
  src,
  alt,
  fallbackLabel,
  monogram = "BN",
  className = "",
  ...rest
}: Props) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-900 text-neutral-500 " +
          className
        }
      >
        <div className="grid h-10 w-10 place-items-center rounded-full border border-amber-300/30 bg-neutral-950 text-amber-200/80">
          <Scissors className="h-4 w-4" />
        </div>
        <div className="font-display text-[10px] uppercase tracking-[0.35em] text-amber-200/70">
          {monogram}
        </div>
        {fallbackLabel && (
          <div className="max-w-[80%] truncate text-center text-[10px] uppercase tracking-[0.25em] text-neutral-500">
            {fallbackLabel}
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}