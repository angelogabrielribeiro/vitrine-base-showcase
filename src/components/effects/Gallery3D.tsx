import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

export type Gallery3DProps = {
  images: string[];
  title?: string;
  eyebrow?: string;
};

/**
 * Galeria editorial 3D. Planos distribuídos em profundidade (eixo Z).
 * - Roda do mouse, setas do teclado, arrastar (touch/mouse) e autoplay.
 * - Fade + blur suave por profundidade.
 * - Deformação leve tipo tecido/ondulação no hover.
 * - Pausa fora de viewport / com document.hidden.
 * - reduced-motion e fallback estático elegante em português.
 */
export default function Gallery3D({ images, title, eyebrow }: Gallery3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null);
  const [inView, setInView] = useState(true);
  const [hasFocus, setHasFocus] = useState(false);
  const { capabilities } = useCinematicMotion();

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      setSupportsWebGL(!!gl);
    } catch {
      setSupportsWebGL(false);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (supportsWebGL === false || capabilities.reducedMotion || !capabilities.allow3D) {
    return (
      <section
        ref={containerRef}
        className="relative bg-neutral-950 text-neutral-50"
        aria-label={title ?? "Lookbook"}
      >
        <div className="mx-auto max-w-6xl px-6 py-24">
          {eyebrow && (
            <span className="text-[10px] uppercase tracking-[0.5em] text-amber-200/80">
              {eyebrow}
            </span>
          )}
          {title && <h2 className="font-display mt-4 text-4xl sm:text-6xl">{title}</h2>}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
            ))}
          </div>
          <p className="mt-6 text-xs text-white/50">
            Experiência 3D indisponível neste dispositivo — apresentando lookbook estático.
          </p>
        </div>
      </section>
    );
  }

  const dpr: [number, number] = capabilities.coarsePointer ? [1, 1] : [1, capabilities.dpr];

  return (
    <section
      ref={containerRef}
      className="relative bg-neutral-950 text-neutral-50"
      aria-label={title ?? "Lookbook"}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
      tabIndex={-1}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-10 text-center">
        {eyebrow && (
          <span className="text-[10px] uppercase tracking-[0.5em] text-amber-200/80">
            {eyebrow}
          </span>
        )}
        {title && <h2 className="font-display mt-3 text-3xl sm:text-5xl">{title}</h2>}
      </div>
      <div className="h-[62vh] w-full sm:h-[64vh]">
        {supportsWebGL && (
          <Canvas
            dpr={dpr}
            camera={{ position: [0, 0, 4.6], fov: 42 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            frameloop={inView ? "always" : "never"}
          >
            <ambientLight intensity={0.9} />
            <GalleryScene
              images={images}
              inView={inView}
              hasFocus={hasFocus}
              containerRef={containerRef}
            />
          </Canvas>
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 text-center text-[10px] uppercase tracking-[0.4em] text-white/60">
        Role, arraste ou use ← → para navegar
      </div>
    </section>
  );
}

// ------- cena -------

function GalleryScene({
  images,
  inView,
  hasFocus,
  containerRef,
}: {
  images: string[];
  inView: boolean;
  hasFocus: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const textures = useLoader(THREE.TextureLoader, images);
  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
    });
  }, [textures]);

  const count = images.length;
  const spacing = 2.2;
  // scroll offset ao longo do "trilho" (0..count-1, wrap)
  const offset = useRef(0);
  const velocity = useRef(0);
  const target = useRef(0);
  const hoverIndex = useRef<number | null>(null);
  const lastInteract = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const bump = (d: number) => {
      target.current += d;
      lastInteract.current = performance.now();
    };

    const onWheel = (e: WheelEvent) => {
      if (!inView) return;
      e.preventDefault();
      bump(e.deltaY * 0.0025);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!inView && !hasFocus) return;
      if (e.key === "ArrowRight") bump(0.5);
      else if (e.key === "ArrowLeft") bump(-0.5);
    };

    let touchX = 0;
    let touching = false;
    const onTouchStart = (e: TouchEvent) => {
      touching = true;
      touchX = e.touches[0]?.clientX ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touching) return;
      const x = e.touches[0]?.clientX ?? 0;
      const dx = touchX - x;
      touchX = x;
      bump(dx * 0.005);
    };
    const onTouchEnd = () => (touching = false);

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [inView, hasFocus, containerRef]);

  const planes = useMemo(
    () => new Array(count).fill(0).map(() => ({ base: Math.random() * 0.5 })),
    [count],
  );
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (typeof document !== "undefined" && document.hidden) return;
    if (!inView) return;
    // autoplay após 3s sem interação
    const idle = performance.now() - lastInteract.current > 3000;
    if (idle) target.current += delta * 0.15;
    // easing
    offset.current += (target.current - offset.current) * Math.min(1, delta * 6);
    velocity.current = target.current - offset.current;

    const g = groupRef.current;
    if (!g) return;
    for (let i = 0; i < g.children.length; i++) {
      const mesh = g.children[i] as THREE.Mesh;
      // posição wrap
      let z = (((i - offset.current) % count) + count) % count;
      if (z > count / 2) z -= count;
      mesh.position.z = -z * spacing;
      mesh.position.x = Math.sin(z * 0.4 + planes[i].base) * 0.45;
      mesh.position.y = Math.cos(z * 0.35 + planes[i].base) * 0.28;
      mesh.rotation.y = z * 0.06;
      // deformação sutil no hover
      const hovered = hoverIndex.current === i;
      const targetScale = hovered ? 1.08 : 1;
      mesh.scale.x += (targetScale - mesh.scale.x) * 0.1;
      mesh.scale.y += (targetScale - mesh.scale.y) * 0.1;
      // ondulação leve via rotationZ oscilante
      mesh.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + i) * 0.02;
      // fade/blur por distância
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const dist = Math.abs(z);
      const a = Math.max(0, 1 - dist / (count / 2));
      mat.opacity = 0.15 + a * 0.85;
    }
  });

  return (
    <group ref={groupRef}>
      {textures.map((tex, i) => (
        <mesh
          key={i}
          onPointerOver={() => (hoverIndex.current = i)}
          onPointerOut={() => (hoverIndex.current = null)}
        >
          <planeGeometry args={[1.9, 2.4, 24, 24]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
