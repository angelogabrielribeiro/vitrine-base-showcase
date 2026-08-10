import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { ContactShadows, useProgress } from "@react-three/drei";
import { Flame, Layers3, MousePointer2, Sparkles } from "lucide-react";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

type Layer3D = {
  key: "bottom" | "patty" | "cheese" | "greens" | "top";
  label: string;
  obj: string;
  mtl: string;
  targetSize: number;
  closed: [number, number, number];
  open: [number, number, number];
  openRotation: [number, number, number];
  delay: number;
  parallax: number;
  roughness: number;
};

const BURGER_LAYERS: Layer3D[] = [
  {
    key: "bottom",
    label: "Base",
    obj: "https://v3b.fal.media/files/b/0aa5bc39/ZnnAAKl2M4BL8b39EWROu_279c9e64555dd1af68bcce588f6fe692.obj",
    mtl: "https://v3b.fal.media/files/b/0aa5bc39/k__sqzPd1N06zYxVOWro-_material.mtl",
    targetSize: 2.72,
    closed: [0, -1.34, 0],
    open: [-0.72, -3.05, -1.05],
    openRotation: [-0.24, -0.48, -0.14],
    delay: 0.03,
    parallax: 0.14,
    roughness: 0.62,
  },
  {
    key: "patty",
    label: "Blend",
    obj: "https://v3b.fal.media/files/b/0aa5bc38/zAoPvOz9YZ_gnm4K9vOMC_90293462e8dddfad0e739bd4d0a393c4.obj",
    mtl: "https://v3b.fal.media/files/b/0aa5bc38/eklM6XDuNtK0jEPuiU_yG_material.mtl",
    targetSize: 2.72,
    closed: [0, -0.55, 0.04],
    open: [0.58, -1.18, 0.42],
    openRotation: [0.2, 0.42, 0.14],
    delay: 0.13,
    parallax: 0.17,
    roughness: 0.76,
  },
  {
    key: "cheese",
    label: "Cheddar",
    obj: "https://v3b.fal.media/files/b/0aa5bc37/DyMA6T43lcZbuH3VoS80N_0c176574ef6d7ab558ceb54451d75dc4.obj",
    mtl: "https://v3b.fal.media/files/b/0aa5bc37/hi3d6OHV_y6SX3Y_p9-NU_material.mtl",
    targetSize: 2.88,
    closed: [0, 0.02, 0.1],
    open: [-0.82, 0.12, 1.25],
    openRotation: [-0.28, -0.52, -0.34],
    delay: 0.19,
    parallax: 0.22,
    roughness: 0.48,
  },
  {
    key: "greens",
    label: "Frescor",
    obj: "https://v3b.fal.media/files/b/0aa5bc3d/EaQLxWhMpBjDc9CzbSLH5_6e4dd5c97af8801cec67afc39a46cdcc.obj",
    mtl: "https://v3b.fal.media/files/b/0aa5bc3d/s6hp4ZxEBLbble1_R13sP_material.mtl",
    targetSize: 2.8,
    closed: [0, 0.58, 0.12],
    open: [0.9, 1.72, 0.95],
    openRotation: [0.18, 0.58, 0.28],
    delay: 0.08,
    parallax: 0.26,
    roughness: 0.68,
  },
  {
    key: "top",
    label: "Brioche",
    obj: "https://v3b.fal.media/files/b/0aa5bc36/KlHmBTmSTFE3WuAXiHI6M_6ceaade6ad374f949d1a1d44b8439ddc.obj",
    mtl: "https://v3b.fal.media/files/b/0aa5bc36/-WPBmwpxYDxM-QPhmnxLt_material.mtl",
    targetSize: 2.92,
    closed: [0, 1.45, 0.08],
    open: [-0.7, 2.92, 1.5],
    openRotation: [-0.3, -0.82, -0.24],
    delay: 0.01,
    parallax: 0.32,
    roughness: 0.58,
  },
];

const PHASES = [
  {
    kicker: "01 · Brasa baixa",
    title: "Primeiro, a silhueta.",
    body: "O burger entra quase no escuro. A estrutura existe, mas a luz ainda segura o sabor antes da abertura.",
  },
  {
    kicker: "02 · Ignição",
    title: "A mordida começa a acender.",
    body: "Enquanto as peças cedem, a luz ganha temperatura, revela os materiais e empurra cada camada para fora do eixo.",
  },
  {
    kicker: "03 · Explosão 3D",
    title: "Agora a Brasa sai do plano.",
    body: "Brioche, frescor, cheddar, blend e base abrem em X, Y e Z com rotação maior, profundidade e câmera recuando junto.",
  },
  {
    kicker: "04 · Brasa aberta",
    title: "Tudo aceso. Tudo em profundidade.",
    body: "A composição segura o exploded view iluminado por mais tempo, com cada ingrediente legível e inteiro dentro do quadro.",
  },
] as const;

function phaseFromProgress(value: number) {
  if (value < 0.12) return 0;
  if (value < 0.46) return 1;
  if (value < 0.86) return 2;
  return 3;
}

export function BrasaBurgerStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { pointerX, pointerY } = useCinematicMotion();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [mountScene, setMountScene] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const burgerProgress = useTransform(
    scrollYProgress,
    [0, 0.11, 0.26, 0.64, 0.9, 1],
    [0, 0, 0.08, 0.62, 1, 1],
    { clamp: true },
  );
  const glowOpacity = useTransform(burgerProgress, [0, 0.35, 0.72, 1], [0.08, 0.16, 0.32, 0.48]);
  const glowScale = useTransform(burgerProgress, [0, 0.55, 1], [0.78, 0.98, 1.18]);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setMountScene(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setMountScene(true);
        observer.disconnect();
      },
      { rootMargin: "120% 0px 120% 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(burgerProgress, "change", (value) => {
    const next = phaseFromProgress(value);
    setPhaseIndex((current) => (current === next ? current : next));
  });

  const phase = PHASES[phaseIndex] ?? PHASES[0];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="brasa-burger-story-title"
      className="relative h-[355svh] border-y border-orange-200/10 bg-[#0d0806] sm:h-[345svh] lg:h-[335svh]"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_73%_47%,rgba(241,90,36,.16),transparent_30%),radial-gradient(circle_at_48%_91%,rgba(255,155,65,.07),transparent_36%),linear-gradient(140deg,#070504_0%,#130a06_48%,#090605_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:54px_54px]"
        />
        <motion.div
          aria-hidden="true"
          className="absolute inset-[4%] rounded-[50%] bg-[radial-gradient(circle,rgba(244,102,33,.35)_0%,rgba(244,102,33,.14)_40%,transparent_72%)] blur-3xl"
          style={{ opacity: glowOpacity, scale: glowScale }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_24px_rgba(251,146,60,.75)]"
          style={{ scaleX: burgerProgress }}
        />

        <div className="absolute inset-x-0 bottom-8 top-[29%] sm:top-[24%] lg:inset-y-0 lg:left-[37%] lg:right-[1%]">
          {mountScene ? (
            <BurgerCanvas
              progress={burgerProgress}
              pointerX={pointerX}
              pointerY={pointerY}
              reduceMotion={reduceMotion}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-40 w-40 animate-pulse rounded-full border border-orange-400/25 shadow-[0_0_90px_rgba(241,90,36,.18)]" />
            </div>
          )}
          {mountScene && <SceneLoadIndicator />}
        </div>

        <div className="pointer-events-none relative z-10 mx-auto grid h-full max-w-7xl px-5 py-5 sm:px-8 sm:py-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-12">
          <div className="self-start pt-3 sm:pt-6 lg:self-center lg:pt-0">
            <div className="inline-flex items-center gap-2 border border-orange-300/20 bg-black/30 px-3 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-orange-300 backdrop-blur-xl">
              <Layers3 className="h-3.5 w-3.5" />
              Raio-X 3D da Brasa
            </div>

            <h2
              id="brasa-burger-story-title"
              className="mt-4 max-w-[8ch] font-display text-[clamp(2.9rem,7.4vw,6.8rem)] uppercase leading-[0.82] tracking-[-0.04em] text-[#fff6e7] sm:mt-5"
            >
              Desmonte a mordida.
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={phase.kicker}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -9 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 max-w-lg sm:mt-6"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-orange-400 sm:text-[10px]">
                  {phase.kicker}
                </p>
                <p className="mt-2 max-w-[16ch] font-display text-2xl uppercase leading-[0.95] text-white sm:text-4xl">
                  {phase.title}
                </p>
                <p className="mt-3 max-w-md text-xs leading-6 text-orange-50/58 sm:text-sm sm:leading-7">
                  {phase.body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 hidden max-w-md grid-cols-5 gap-2 lg:grid">
              {BURGER_LAYERS.map((layer, index) => (
                <motion.div
                  key={layer.key}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: phaseIndex >= Math.min(index, 3) ? -4 : 0,
                          borderColor:
                            phaseIndex >= Math.min(index, 3)
                              ? "rgba(251,146,60,.5)"
                              : "rgba(255,255,255,.08)",
                        }
                  }
                  className="border border-white/10 bg-black/25 px-2 py-3 text-center text-[8px] font-black uppercase tracking-[0.12em] text-white/52 backdrop-blur"
                >
                  {layer.label}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="self-end pb-8 text-right lg:self-center lg:pb-0">
            <div className="ml-auto hidden w-fit items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-orange-100/40 sm:inline-flex">
              <MousePointer2 className="h-3.5 w-3.5 text-orange-400" />
              Mouse move a luz e a câmera · scroll acende e explode em 3D
            </div>
          </div>
        </div>

        <div className="absolute inset-x-5 bottom-3 z-20 flex items-center gap-3 sm:inset-x-8 sm:bottom-4 lg:inset-x-12">
          <span className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-orange-200/55 sm:text-[9px]">
            <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
            Brasa em profundidade
          </span>
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-[#f15a24] to-[#ffb25b]"
              style={{ scaleX: burgerProgress }}
            />
          </div>
          <span className="hidden items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/34 sm:inline-flex">
            <Sparkles className="h-3 w-3 text-orange-400" />
            geometria 3D · luz física
          </span>
        </div>
      </div>
    </section>
  );
}

type SceneProps = {
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  reduceMotion: boolean;
};

function BurgerCanvas(props: SceneProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 1.65]}
        shadows
        camera={{ position: [0, -0.05, 8.15], fov: 34, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.72;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <AnimatedLighting {...props} />
        <Suspense fallback={null}>
          <BurgerAssembly {...props} />
          <ContactShadows
            position={[0, -3.8, 0]}
            opacity={0.52}
            scale={9.5}
            blur={2.8}
            far={8}
            resolution={512}
            color="#080302"
          />
        </Suspense>
        <CameraRig {...props} />
      </Canvas>
    </div>
  );
}

function SceneLoadIndicator() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute bottom-7 right-4 z-20 border border-orange-300/15 bg-black/45 px-3 py-2 text-[8px] font-black uppercase tracking-[0.22em] text-orange-200/65 backdrop-blur sm:right-7">
      Construindo volume · {Math.round(progress)}%
    </div>
  );
}

function BurgerAssembly(props: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const viewportWidth = useThree((state) => state.size.width);
  const compact = viewportWidth < 720;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = props.reduceMotion ? 0 : props.progress.get();
    const px = props.reduceMotion ? 0 : props.pointerX.get();
    const py = props.reduceMotion ? 0 : props.pointerY.get();
    const openEase = THREE.MathUtils.smootherstep(p, 0.08, 1);
    const targetScale = (compact ? 0.7 : 0.94) * THREE.MathUtils.lerp(1, 0.86, openEase);
    const cinematicSpin = THREE.MathUtils.smootherstep(p, 0.2, 0.92);
    const breathe = props.reduceMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.75) * 0.018 * openEase;

    group.position.y = THREE.MathUtils.damp(group.position.y, -0.22 - openEase * 0.12 + breathe, 4.5, delta);
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      -0.12 + cinematicSpin * 0.68 + px * 0.24,
      4.6,
      delta,
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      -0.025 + cinematicSpin * 0.08 - py * 0.09,
      4.8,
      delta,
    );
    group.rotation.z = THREE.MathUtils.damp(
      group.rotation.z,
      Math.sin(cinematicSpin * Math.PI) * 0.08 + px * 0.035,
      4.6,
      delta,
    );
    const scale = THREE.MathUtils.damp(group.scale.x, targetScale, 4.5, delta);
    group.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <DepthRings progress={props.progress} pointerX={props.pointerX} reduceMotion={props.reduceMotion} />
      {BURGER_LAYERS.map((layer) => (
        <IngredientLayer key={layer.key} layer={layer} {...props} />
      ))}
    </group>
  );
}

function IngredientLayer({
  layer,
  progress,
  pointerX,
  pointerY,
  reduceMotion,
}: SceneProps & { layer: Layer3D }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = reduceMotion ? 0 : progress.get();
    const raw = THREE.MathUtils.clamp((p - layer.delay) / Math.max(0.001, 1 - layer.delay), 0, 1);
    const e = THREE.MathUtils.smootherstep(raw, 0, 1);
    const px = reduceMotion ? 0 : pointerX.get();
    const py = reduceMotion ? 0 : pointerY.get();
    const pointerStrength = (0.2 + e * 0.8) * layer.parallax;
    const floatPhase = state.clock.elapsedTime * (1.05 + layer.delay) + layer.delay * 18;
    const floatY = reduceMotion ? 0 : Math.sin(floatPhase) * 0.055 * e;
    const floatR = reduceMotion ? 0 : Math.cos(floatPhase * 0.88) * 0.028 * e;

    const x = THREE.MathUtils.lerp(layer.closed[0], layer.open[0], e) + px * pointerStrength;
    const y = THREE.MathUtils.lerp(layer.closed[1], layer.open[1], e) - py * pointerStrength * 0.65 + floatY;
    const z = THREE.MathUtils.lerp(layer.closed[2], layer.open[2], e) + Math.abs(px) * pointerStrength * 0.38;

    group.position.x = THREE.MathUtils.damp(group.position.x, x, 5.2, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, y, 5.2, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, z, 5.2, delta);
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      layer.openRotation[0] * e - py * 0.045 + floatR,
      5,
      delta,
    );
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      layer.openRotation[1] * e + px * 0.075 - floatR * 0.5,
      5,
      delta,
    );
    group.rotation.z = THREE.MathUtils.damp(
      group.rotation.z,
      layer.openRotation[2] * e + px * 0.03 + floatR,
      5,
      delta,
    );
  });

  return (
    <group ref={groupRef} position={layer.closed}>
      <NormalizedIngredient layer={layer} progress={progress} reduceMotion={reduceMotion} />
    </group>
  );
}

function NormalizedIngredient({
  layer,
  progress,
  reduceMotion,
}: {
  layer: Layer3D;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const materials = useLoader(MTLLoader, layer.mtl);
  materials.preload();
  const loaded = useLoader(OBJLoader, layer.obj, (loader) => {
    loader.setMaterials(materials);
  });
  const gl = useThree((state) => state.gl);

  const object = useMemo(() => {
    const clone = loaded.clone(true);
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
      const upgraded = sourceMaterials.map((source) => {
        const sourceMaterial = source as THREE.MeshPhongMaterial;
        const material = new THREE.MeshStandardMaterial({
          color: sourceMaterial.color ?? new THREE.Color("white"),
          map: sourceMaterial.map ?? null,
          transparent: sourceMaterial.transparent,
          opacity: sourceMaterial.opacity,
          alphaTest: sourceMaterial.alphaTest,
          side: THREE.FrontSide,
          metalness: 0,
          roughness: layer.roughness,
        });

        material.userData.baseColor = material.color.clone();
        material.emissive = new THREE.Color("#3b1005");
        material.emissiveIntensity = 0.01;

        if (material.map) {
          material.map.colorSpace = THREE.SRGBColorSpace;
          material.map.anisotropy = maxAnisotropy;
          material.map.needsUpdate = true;
        }

        return material;
      });

      child.material = Array.isArray(child.material) ? upgraded : upgraded[0];
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    const longest = Math.max(size.x, size.y, size.z, 0.001);
    clone.scale.setScalar(layer.targetSize / longest);

    return clone;
  }, [gl, layer.roughness, layer.targetSize, loaded]);

  useFrame(() => {
    const p = reduceMotion ? 1 : progress.get();
    const ignition = THREE.MathUtils.smootherstep(p, 0.04, 0.88);
    const brightness = THREE.MathUtils.lerp(0.38, 1.08, ignition);
    const emissive = THREE.MathUtils.lerp(0.005, 0.16, ignition);

    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;
        const baseColor = mat.userData.baseColor as THREE.Color | undefined;
        if (baseColor) mat.color.copy(baseColor).multiplyScalar(brightness);
        mat.emissiveIntensity = emissive;
        mat.roughness = THREE.MathUtils.lerp(layer.roughness + 0.12, Math.max(0.32, layer.roughness - 0.05), ignition);
      });
    });
  });

  return <primitive object={object} />;
}

function AnimatedLighting({ progress, pointerX, pointerY, reduceMotion }: SceneProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemisphereRef = useRef<THREE.HemisphereLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  const emberRef = useRef<THREE.PointLight>(null);
  const keyRef = useRef<THREE.PointLight>(null);
  const gl = useThree((state) => state.gl);

  useFrame((_, delta) => {
    const p = reduceMotion ? 1 : progress.get();
    const e = THREE.MathUtils.smootherstep(p, 0.04, 0.9);
    const px = reduceMotion ? 0 : pointerX.get();
    const py = reduceMotion ? 0 : pointerY.get();

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.damp(
        ambientRef.current.intensity,
        THREE.MathUtils.lerp(0.1, 0.72, e),
        4.2,
        delta,
      );
    }
    if (hemisphereRef.current) {
      hemisphereRef.current.intensity = THREE.MathUtils.damp(
        hemisphereRef.current.intensity,
        THREE.MathUtils.lerp(0.18, 1.65, e),
        4.2,
        delta,
      );
    }
    if (directionalRef.current) {
      directionalRef.current.intensity = THREE.MathUtils.damp(
        directionalRef.current.intensity,
        THREE.MathUtils.lerp(0.85, 5.4, e),
        4.2,
        delta,
      );
    }
    if (emberRef.current) {
      emberRef.current.intensity = THREE.MathUtils.damp(
        emberRef.current.intensity,
        THREE.MathUtils.lerp(2.5, 30, e),
        4.2,
        delta,
      );
    }
    if (keyRef.current) {
      keyRef.current.intensity = THREE.MathUtils.damp(
        keyRef.current.intensity,
        THREE.MathUtils.lerp(3, 24, e),
        4.2,
        delta,
      );
      keyRef.current.position.x = THREE.MathUtils.damp(keyRef.current.position.x, 2.7 + px * 2.4, 5, delta);
      keyRef.current.position.y = THREE.MathUtils.damp(keyRef.current.position.y, 2.8 - py * 1.6, 5, delta);
    }

    gl.toneMappingExposure = THREE.MathUtils.damp(
      gl.toneMappingExposure,
      THREE.MathUtils.lerp(0.68, 1.32, e),
      3.8,
      delta,
    );
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.1} />
      <hemisphereLight ref={hemisphereRef} args={["#ffd2a8", "#140603", 0.18]} />
      <directionalLight
        ref={directionalRef}
        castShadow
        color="#ffd3aa"
        intensity={0.85}
        position={[4.5, 6.4, 5.2]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />
      <pointLight ref={emberRef} color="#f15a24" intensity={2.5} distance={12} position={[-3.2, 0.6, 3.4]} />
      <pointLight ref={keyRef} color="#ffb16a" intensity={3} distance={11} position={[2.7, 2.8, 3.8]} />
    </>
  );
}

function CameraRig({ progress, pointerX, pointerY, reduceMotion }: SceneProps) {
  const { camera } = useThree();
  const lookTarget = useMemo(() => new THREE.Vector3(0, -0.08, 0), []);

  useFrame((_, delta) => {
    const p = reduceMotion ? 0 : progress.get();
    const px = reduceMotion ? 0 : pointerX.get();
    const py = reduceMotion ? 0 : pointerY.get();
    const e = THREE.MathUtils.smootherstep(p, 0.12, 1);
    const orbit = Math.sin(e * Math.PI) * 0.48;
    const targetZ = THREE.MathUtils.lerp(8.15, 12.25, e);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.48 + orbit, 3.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -0.02 - py * 0.26 - e * 0.08, 3.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3.8, delta);
    camera.lookAt(lookTarget);
  });

  return null;
}

function DepthRings({
  progress,
  pointerX,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const p = reduceMotion ? 0 : progress.get();
    const px = reduceMotion ? 0 : pointerX.get();
    const outer = outerRef.current;
    const inner = innerRef.current;

    if (outer) {
      outer.rotation.z = THREE.MathUtils.damp(outer.rotation.z, p * 1.1 + px * 0.18, 2.4, delta);
      outer.rotation.y = THREE.MathUtils.damp(outer.rotation.y, px * 0.13 + p * 0.12, 2.4, delta);
    }
    if (inner) {
      inner.rotation.z = THREE.MathUtils.damp(inner.rotation.z, -p * 1.45 - px * 0.22, 2.4, delta);
      inner.rotation.x = THREE.MathUtils.damp(inner.rotation.x, 0.18 + p * 0.16, 2.4, delta);
    }
  });

  return (
    <group position={[0, -0.02, -2.55]}>
      <mesh ref={outerRef} scale={[1.08, 1.08, 1]}>
        <torusGeometry args={[3.45, 0.012, 8, 128]} />
        <meshBasicMaterial color="#f15a24" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh ref={innerRef} rotation={[0.18, 0.08, 0]}>
        <torusGeometry args={[2.78, 0.009, 8, 128]} />
        <meshBasicMaterial color="#ffb25b" transparent opacity={0.14} depthWrite={false} />
      </mesh>
    </group>
  );
}
