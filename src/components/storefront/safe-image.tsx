import { useEffect, useState, type ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "onError" | "src"> & {
  src?: string;
  alt: string;
  /** Imagem secundária tentada apenas uma vez se `src` falhar. */
  fallbackSrc?: string;
  /** Rótulo opcional exibido de forma discreta no fallback neutro. */
  fallbackLabel?: string;
};

type Stage = "primary" | "fallback" | "neutral";

/**
 * Imagem com fallback em camadas:
 *   1. tenta `src`;
 *   2. se falhar (ou vazio), tenta `fallbackSrc` UMA vez;
 *   3. se ambas falharem, renderiza um bloco abstrato sofisticado.
 *
 * O bloco neutro NÃO usa tesoura ou monograma "BN" como elemento
 * principal — é uma superfície discreta com textura sutil, para não
 * roubar atenção nem parecer uma imagem real.
 * O estado interno é resetado quando `src` ou `fallbackSrc` mudam.
 */
export function SafeImage({
  src,
  alt,
  fallbackSrc,
  fallbackLabel,
  className = "",
  ...rest
}: Props) {
  const initial: Stage = src ? "primary" : fallbackSrc ? "fallback" : "neutral";
  const [stage, setStage] = useState<Stage>(initial);

  useEffect(() => {
    setStage(src ? "primary" : fallbackSrc ? "fallback" : "neutral");
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (stage === "primary" && fallbackSrc) setStage("fallback");
    else setStage("neutral");
  };

  if (stage !== "neutral") {
    const currentSrc = stage === "primary" ? src : fallbackSrc;
    return (
      <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
        className={className}
        {...rest}
      />
    );
  }

  // Fallback neutro abstrato — sem tesoura, sem monograma proeminente.
  return (
    <div
      role="img"
      aria-label={alt}
      className={
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-neutral-900 " +
        className
      }
    >
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 20%, rgba(255,255,255,0.05), transparent 60%), radial-gradient(80% 60% at 80% 90%, rgba(217,177,102,0.06), transparent 65%), linear-gradient(135deg, #0f0f10 0%, #17161a 50%, #0b0b0d 100%)",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 8px)",
        }}
      />
      <span
        aria-hidden
        className="absolute left-4 right-4 top-4 h-px bg-white/10"
      />
      <span
        aria-hidden
        className="absolute bottom-4 left-4 right-4 h-px bg-white/10"
      />
      {fallbackLabel && (
        <span className="relative z-10 max-w-[70%] truncate text-center text-[9px] uppercase tracking-[0.4em] text-neutral-600">
          {fallbackLabel}
        </span>
      )}
    </div>
  );
}