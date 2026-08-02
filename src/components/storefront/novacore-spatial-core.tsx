import { lazy, Suspense, useMemo } from "react";
import { motion, type MotionValue } from "framer-motion";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";
import { useAdaptiveQuality } from "@/hooks/use-adaptive-quality";
import { useInView } from "@/hooks/use-in-view";

type NovaCoreSpatialCoreProps = {
  className?: string;
  activeIndex?: number;
  compact?: boolean;
};

const NovaCoreCanvas = lazy(() => import("@/components/storefront/novacore-core-scene"));

/**
 * Núcleo 3D da NovaCore. Qualidade adaptativa via useAdaptiveQuality:
 * no mobile o WebGL continua ativo (tier "low"), apenas com geometria,
 * partículas e DPR reduzidos. Pausa fora da viewport com useInView e
 * a cena pesada é carregada via lazy import.
 */
export function NovaCoreSpatialCore({
  className,
  activeIndex = 0,
  compact = false,
}: NovaCoreSpatialCoreProps) {
  const { pointerX, pointerY } = useCinematicMotion();
  const adaptive = useAdaptiveQuality();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0, rootMargin: "35% 0px" });

  const canRender3D = adaptive.tier !== "off";
  const isCompact = compact || adaptive.isMobile;
  const particles = useMemo(() => {
    const base = adaptive.tier === "low" ? 16 : isCompact ? 32 : 48;
    return Math.max(10, base);
  }, [adaptive.tier, isCompact]);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <div className="absolute inset-0 overflow-hidden bg-[#02040c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_42%,rgba(37,99,235,.24),transparent_28%),radial-gradient(circle_at_42%_60%,rgba(139,92,246,.16),transparent_32%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(103,232,249,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,.08) 1px, transparent 1px)",
            backgroundSize: isCompact ? "38px 38px" : "58px 58px",
            maskImage: "radial-gradient(circle at 64% 50%, black, transparent 76%)",
          }}
        />
      </div>

      {canRender3D ? (
        <Suspense fallback={null}>
          <NovaCoreCanvas
            activeIndex={activeIndex}
            compact={isCompact}
            pointerX={pointerX as MotionValue<number>}
            pointerY={pointerY as MotionValue<number>}
            particles={particles}
            dpr={adaptive.dpr}
            antialias={!adaptive.isMobile}
            active={inView}
          />
        </Suspense>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="relative aspect-square w-[min(72%,34rem)] rounded-full border border-cyan-200/20"
          >
            <div className="absolute inset-[14%] rounded-full border border-blue-300/25" />
            <div className="absolute inset-[28%] rotate-45 border border-violet-300/35 bg-blue-500/10 shadow-[0_0_80px_rgba(37,99,235,.35)]" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-200/30 to-transparent" />
            <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent" />
          </motion.div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#02040c_0%,rgba(2,4,12,.82)_27%,transparent_58%,rgba(2,4,12,.42)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#02040c] to-transparent" />
    </div>
  );
}
