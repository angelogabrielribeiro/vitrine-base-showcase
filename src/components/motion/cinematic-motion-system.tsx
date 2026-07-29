/* eslint-disable react-refresh/only-export-components -- Motion context, hooks and primitives form one public system. */
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

export type MotionQuality = "static" | "economy" | "balanced" | "cinematic";
export type MotionQualityPreference = "auto" | MotionQuality;

export type CinematicCapabilities = {
  hydrated: boolean;
  reducedMotion: boolean;
  precisePointer: boolean;
  coarsePointer: boolean;
  saveData: boolean;
  quality: MotionQuality;
  allow3D: boolean;
  dpr: number;
  maxParticles: number;
};

type CinematicMotionContextValue = {
  capabilities: CinematicCapabilities;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: EventTarget & {
    saveData?: boolean;
  };
};

type ScrollOptions = NonNullable<Parameters<typeof useScroll>[0]>;

const QUALITY_RANK: Record<MotionQuality, number> = {
  static: 0,
  economy: 1,
  balanced: 2,
  cinematic: 3,
};

const DEFAULT_CAPABILITIES: CinematicCapabilities = {
  hydrated: false,
  reducedMotion: true,
  precisePointer: false,
  coarsePointer: true,
  saveData: true,
  quality: "static",
  allow3D: false,
  dpr: 1,
  maxParticles: 0,
};

const CinematicMotionContext = createContext<CinematicMotionContextValue | null>(null);

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function resolveQuality({
  preference,
  reducedMotion,
  saveData,
  precisePointer,
  viewportWidth,
  cores,
  memory,
}: {
  preference: MotionQualityPreference;
  reducedMotion: boolean;
  saveData: boolean;
  precisePointer: boolean;
  viewportWidth: number;
  cores: number;
  memory: number;
}): MotionQuality {
  if (reducedMotion) return "static";
  if (preference !== "auto") return preference;
  if (saveData || viewportWidth < 640 || cores <= 2 || memory <= 2) return "economy";
  if (!precisePointer || viewportWidth < 1024 || cores <= 4 || memory <= 4) {
    return "balanced";
  }
  if (viewportWidth >= 1280 && cores >= 8 && memory >= 8) return "cinematic";
  return "balanced";
}

function readCapabilities(preference: MotionQualityPreference): CinematicCapabilities {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const navigatorHints = navigator as NavigatorWithHints;
  const saveData = navigatorHints.connection?.saveData ?? false;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigatorHints.deviceMemory || 4;
  const viewportWidth = window.innerWidth;
  const quality = resolveQuality({
    preference,
    reducedMotion,
    saveData,
    precisePointer,
    viewportWidth,
    cores,
    memory,
  });
  const allow3D =
    !reducedMotion &&
    !saveData &&
    precisePointer &&
    viewportWidth >= 768 &&
    QUALITY_RANK[quality] >= QUALITY_RANK.balanced &&
    supportsWebGL();
  const dpr =
    quality === "cinematic"
      ? Math.min(window.devicePixelRatio || 1, 1.75)
      : quality === "balanced"
        ? Math.min(window.devicePixelRatio || 1, 1.35)
        : 1;

  return {
    hydrated: true,
    reducedMotion,
    precisePointer,
    coarsePointer,
    saveData,
    quality,
    allow3D,
    dpr,
    maxParticles: quality === "cinematic" ? 96 : quality === "balanced" ? 48 : 0,
  };
}

export function CinematicMotionProvider({
  children,
  quality = "auto",
}: {
  children: ReactNode;
  quality?: MotionQualityPreference;
}) {
  const [capabilities, setCapabilities] = useState<CinematicCapabilities>(DEFAULT_CAPABILITIES);
  const rawPointerX = useMotionValue(0);
  const rawPointerY = useMotionValue(0);
  const pointerX = useSpring(rawPointerX, { stiffness: 150, damping: 28, mass: 0.22 });
  const pointerY = useSpring(rawPointerY, { stiffness: 150, damping: 28, mass: 0.22 });

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const navigatorHints = navigator as NavigatorWithHints;
    let resizeFrame = 0;

    const update = () => setCapabilities(readCapabilities(quality));
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(update);
    };

    update();
    reducedQuery.addEventListener("change", update);
    fineQuery.addEventListener("change", update);
    coarseQuery.addEventListener("change", update);
    navigatorHints.connection?.addEventListener?.("change", update);
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(resizeFrame);
      reducedQuery.removeEventListener("change", update);
      fineQuery.removeEventListener("change", update);
      coarseQuery.removeEventListener("change", update);
      navigatorHints.connection?.removeEventListener?.("change", update);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [quality]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motionQuality = capabilities.quality;
    root.dataset.reducedMotion = String(capabilities.reducedMotion);
    root.dataset.precisePointer = String(capabilities.precisePointer);
    root.dataset.cinematicReady = String(capabilities.hydrated);

    return () => {
      delete root.dataset.motionQuality;
      delete root.dataset.reducedMotion;
      delete root.dataset.precisePointer;
      delete root.dataset.cinematicReady;
    };
  }, [capabilities]);

  useEffect(() => {
    const enabled =
      capabilities.hydrated &&
      capabilities.precisePointer &&
      !capabilities.reducedMotion &&
      QUALITY_RANK[capabilities.quality] >= QUALITY_RANK.balanced;
    const root = document.documentElement;
    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const commit = () => {
      frame = 0;
      rawPointerX.set(nextX);
      rawPointerY.set(nextY);
      root.style.setProperty("--cinematic-pointer-x", `${((nextX + 1) * 50).toFixed(2)}%`);
      root.style.setProperty("--cinematic-pointer-y", `${((nextY + 1) * 50).toFixed(2)}%`);
      root.style.setProperty("--cinematic-pointer-nx", nextX.toFixed(4));
      root.style.setProperty("--cinematic-pointer-ny", nextY.toFixed(4));
    };

    const onPointerMove = (event: PointerEvent) => {
      nextX = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      nextY = (event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
      if (!frame) frame = window.requestAnimationFrame(commit);
    };

    const reset = () => {
      nextX = 0;
      nextY = 0;
      if (!frame) frame = window.requestAnimationFrame(commit);
    };

    if (enabled) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", reset);
    } else {
      reset();
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", reset);
      rawPointerX.set(0);
      rawPointerY.set(0);
    };
  }, [
    capabilities.hydrated,
    capabilities.precisePointer,
    capabilities.quality,
    capabilities.reducedMotion,
    rawPointerX,
    rawPointerY,
  ]);

  const value = useMemo(
    () => ({ capabilities, pointerX, pointerY }),
    [capabilities, pointerX, pointerY],
  );

  return (
    <CinematicMotionContext.Provider value={value}>{children}</CinematicMotionContext.Provider>
  );
}

export function useCinematicMotion() {
  const context = useContext(CinematicMotionContext);
  if (!context) {
    throw new Error("useCinematicMotion must be used inside CinematicMotionProvider");
  }
  return context;
}

export function useSceneActivity<T extends HTMLElement>(
  ref: RefObject<T | null>,
  {
    rootMargin = "25% 0px",
    threshold = 0.01,
    once = false,
  }: {
    rootMargin?: string;
    threshold?: number;
    once?: boolean;
  } = {},
) {
  const [intersecting, setIntersecting] = useState(false);
  const [seen, setSeen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setIntersecting(true);
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        setIntersecting(visible);
        if (visible) {
          setSeen(true);
          if (once) observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [once, ref, rootMargin, threshold]);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return { active: intersecting && pageVisible, seen };
}

export function useInertialScrollProgress<T extends HTMLElement>(
  target: RefObject<T | null>,
  {
    offset = ["start end", "end start"],
  }: {
    offset?: ScrollOptions["offset"];
  } = {},
) {
  const { capabilities } = useCinematicMotion();
  const { scrollYProgress } = useScroll({ target, offset });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: capabilities.quality === "cinematic" ? 105 : 135,
    damping: capabilities.quality === "cinematic" ? 26 : 32,
    mass: 0.25,
    restDelta: 0.001,
  });

  return capabilities.reducedMotion || capabilities.quality === "static"
    ? scrollYProgress
    : smoothProgress;
}

type SceneRenderState = {
  progress: MotionValue<number>;
  active: boolean;
};

const SceneProgressContext = createContext<SceneRenderState | null>(null);

export function CinematicScene({
  children,
  className,
  stickyClassName = "sticky top-0 min-h-svh overflow-hidden",
  height = "180svh",
  label,
}: {
  children: ReactNode | ((state: SceneRenderState) => ReactNode);
  className?: string;
  stickyClassName?: string;
  height?: string;
  label?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const progress = useInertialScrollProgress(ref, {
    offset: ["start start", "end end"],
  });
  const { active } = useSceneActivity(ref, { rootMargin: "10% 0px" });
  const state = useMemo(() => ({ progress, active }), [active, progress]);

  return (
    <section
      ref={ref}
      aria-label={label}
      className={className}
      data-cinematic-scene=""
      data-scene-active={String(active)}
      style={{ height }}
    >
      <SceneProgressContext.Provider value={state}>
        <div className={stickyClassName}>
          {typeof children === "function" ? children(state) : children}
        </div>
      </SceneProgressContext.Provider>
    </section>
  );
}

export function useCinematicScene() {
  const scene = useContext(SceneProgressContext);
  if (!scene) {
    throw new Error("useCinematicScene must be used inside CinematicScene");
  }
  return scene;
}

export function CinematicParallax({
  children,
  className,
  fromY = 36,
  toY = -36,
  fromX = 0,
  toX = 0,
  fromScale = 1,
  toScale = 1,
}: {
  children: ReactNode;
  className?: string;
  fromY?: number;
  toY?: number;
  fromX?: number;
  toX?: number;
  fromScale?: number;
  toScale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { capabilities } = useCinematicMotion();
  const progress = useInertialScrollProgress(ref);
  const x = useTransform(progress, [0, 1], [fromX, toX]);
  const y = useTransform(progress, [0, 1], [fromY, toY]);
  const scale = useTransform(progress, [0, 1], [fromScale, toScale]);
  const enabled =
    capabilities.hydrated &&
    !capabilities.reducedMotion &&
    QUALITY_RANK[capabilities.quality] >= QUALITY_RANK.balanced;

  return (
    <div ref={ref} className={className} data-cinematic-parallax="">
      <motion.div style={enabled ? { x, y, scale } : undefined}>{children}</motion.div>
    </div>
  );
}

export function CursorParallax({
  children,
  className,
  strengthX = 18,
  strengthY = 14,
}: {
  children: ReactNode;
  className?: string;
  strengthX?: number;
  strengthY?: number;
}) {
  const { capabilities, pointerX, pointerY } = useCinematicMotion();
  const x = useTransform(pointerX, [-1, 1], [-strengthX, strengthX]);
  const y = useTransform(pointerY, [-1, 1], [-strengthY, strengthY]);
  const enabled =
    capabilities.hydrated &&
    capabilities.precisePointer &&
    !capabilities.reducedMotion &&
    QUALITY_RANK[capabilities.quality] >= QUALITY_RANK.balanced;

  return (
    <motion.div
      className={className}
      data-cursor-parallax=""
      style={enabled ? { x, y, willChange: "transform" } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function DeferredScene({
  children,
  fallback,
  className,
  minQuality = "balanced",
  require3D = false,
  rootMargin = "35% 0px",
}: {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  minQuality?: MotionQuality;
  require3D?: boolean;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { capabilities } = useCinematicMotion();
  const { active, seen } = useSceneActivity(ref, {
    rootMargin,
    threshold: 0.01,
    once: true,
  });
  const qualityAllowed = QUALITY_RANK[capabilities.quality] >= QUALITY_RANK[minQuality];
  const sceneAllowed =
    capabilities.hydrated &&
    seen &&
    qualityAllowed &&
    !capabilities.reducedMotion &&
    (!require3D || capabilities.allow3D);

  return (
    <div
      ref={ref}
      className={className}
      data-cinematic-deferred=""
      data-scene-active={String(active)}
      data-scene-mounted={String(sceneAllowed)}
    >
      {sceneAllowed ? children : fallback}
    </div>
  );
}

export function CinematicStorefront({
  children,
  tone,
  className,
}: {
  children: ReactNode;
  tone: string;
  className?: string;
}) {
  const { capabilities } = useCinematicMotion();

  return (
    <div
      className={["cinematic-storefront", className].filter(Boolean).join(" ")}
      data-cinematic-store=""
      data-cinematic-tone={tone}
      data-motion-quality={capabilities.quality}
      data-reduced-motion={String(capabilities.reducedMotion)}
    >
      {children}
    </div>
  );
}
