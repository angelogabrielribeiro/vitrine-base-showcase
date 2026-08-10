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
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useProgress } from "@react-three/drei";
import { Flame, Layers3, MousePointer2, Sparkles } from "lucide-react";
import * as THREE from "three";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

type IngredientKey = "bottom" | "patty" | "cheese" | "tomato" | "lettuce" | "top";

type Layer3D = {
  key: IngredientKey;
  label: string;
  targetSize: number;
  closed: [number, number, number];
  open: [number, number, number];
  openRotation: [number, number, number];
  delay: number;
  parallax: number;
};

type FoodProfile = {
  base: string;
  accent: string;
  dark: string;
  roughness: number;
  bump: number;
  repeat: number;
};

const MATERIAL_PROFILES: Record<IngredientKey, FoodProfile> = {
  bottom: { base: "#8b4b24", accent: "#d99a55", dark: "#552713", roughness: 0.72, bump: 0.042, repeat: 2.6 },
  patty: { base: "#5d3021", accent: "#936047", dark: "#2b140f", roughness: 0.86, bump: 0.09, repeat: 4.8 },
  cheese: { base: "#d9820f", accent: "#ffc947", dark: "#9f4f08", roughness: 0.53, bump: 0.024, repeat: 2.2 },
  tomato: { base: "#a91f20", accent: "#e84a3d", dark: "#6f1014", roughness: 0.62, bump: 0.026, repeat: 2.4 },
  lettuce: { base: "#477c32", accent: "#a5c85d", dark: "#274b22", roughness: 0.78, bump: 0.052, repeat: 3.4 },
  top: { base: "#925127", accent: "#dda05b", dark: "#5d2d16", roughness: 0.68, bump: 0.045, repeat: 2.6 },
};

function hashNoise(x: number, y: number, seed: number) {
  const value = Math.sin((x + seed * 17.13) * 12.9898 + (y + seed * 31.77) * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function makeFoodMaps(key: IngredientKey) {
  const profile = MATERIAL_PROFILES[key];
  const base = new THREE.Color(profile.base);
  const accent = new THREE.Color(profile.accent);
  const dark = new THREE.Color(profile.dark);
  const size = 256;
  const colorData = new Uint8Array(size * size * 4);
  const bumpData = new Uint8Array(size * size * 4);
  const roughnessData = new Uint8Array(size * size * 4);
  const seed = 11 + Object.keys(MATERIAL_PROFILES).indexOf(key) * 17;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const fine = hashNoise(x * 0.94, y * 0.94, seed);
      const medium = hashNoise(x * 0.21, y * 0.21, seed + 5);
      const broad = hashNoise(x * 0.055, y * 0.055, seed + 13);
      const grain = fine * 0.32 + medium * 0.43 + broad * 0.25;
      const char = key === "patty" && hashNoise(x * 0.09, y * 0.6, seed + 31) > 0.84;
      const vein = key === "lettuce" && Math.abs(Math.sin((x + medium * 20) * 0.115)) > 0.92;
      const pore = (key === "bottom" || key === "top") && fine > 0.91;

      const color = base.clone().lerp(accent, 0.12 + grain * 0.72);
      if (char || pore) color.lerp(dark, char ? 0.72 : 0.32);
      if (vein) color.lerp(accent, 0.48);

      const outputColor = color.clone().convertLinearToSRGB();
      colorData[i] = Math.round(outputColor.r * 255);
      colorData[i + 1] = Math.round(outputColor.g * 255);
      colorData[i + 2] = Math.round(outputColor.b * 255);
      colorData[i + 3] = 255;

      const relief = THREE.MathUtils.clamp(70 + grain * 145 + (char ? 28 : 0) + (vein ? 38 : 0), 0, 255);
      bumpData[i] = bumpData[i + 1] = bumpData[i + 2] = Math.round(relief);
      bumpData[i + 3] = 255;
      const rough = THREE.MathUtils.clamp(profile.roughness * 255 + (fine - 0.5) * 34, 0, 255);
      roughnessData[i] = roughnessData[i + 1] = roughnessData[i + 2] = Math.round(rough);
      roughnessData[i + 3] = 255;
    }
  }

  const map = new THREE.DataTexture(colorData, size, size, THREE.RGBAFormat);
  map.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = new THREE.DataTexture(bumpData, size, size, THREE.RGBAFormat);
  const roughnessMap = new THREE.DataTexture(roughnessData, size, size, THREE.RGBAFormat);
  for (const texture of [map, bumpMap, roughnessMap]) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(profile.repeat, profile.repeat);
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }
  return { map, bumpMap, roughnessMap, profile };
}

const BURGER_LAYERS: Layer3D[] = [
  {
    key: "bottom",
    label: "Base",
    targetSize: 2.72,
    closed: [0, -0.6, 0],
    open: [-0.72, -2.55, -0.9],
    openRotation: [-0.2, -0.5, -0.12],
    delay: 0.04,
    parallax: 0.12,
  },
  {
    key: "patty",
    label: "Blend",
    targetSize: 2.72,
    closed: [0, -0.3, 0.03],
    open: [0.72, -1.55, 0.3],
    openRotation: [0.18, 0.44, 0.13],
    delay: 0.11,
    parallax: 0.15,
  },
  {
    key: "cheese",
    label: "Cheddar",
    targetSize: 2.76,
    closed: [0, -0.02, 0.08],
    open: [-0.9, -0.42, 1.15],
    openRotation: [-0.24, -0.55, -0.26],
    delay: 0.18,
    parallax: 0.19,
  },
  {
    key: "tomato",
    label: "Tomate",
    targetSize: 2.58,
    closed: [0, 0.06, 0.06],
    open: [0.88, 0.68, 0.56],
    openRotation: [0.12, 0.66, 0.22],
    delay: 0.09,
    parallax: 0.22,
  },
  {
    key: "lettuce",
    label: "Alface",
    targetSize: 2.76,
    closed: [0, 0.17, 0.08],
    open: [-0.78, 1.63, 0.98],
    openRotation: [-0.16, -0.62, -0.21],
    delay: 0.14,
    parallax: 0.25,
  },
  {
    key: "top",
    label: "Brioche",
    targetSize: 2.92,
    closed: [0, 0.52, 0.03],
    open: [0.58, 2.62, 0.72],
    openRotation: [-0.26, -0.78, -0.2],
    delay: 0.02,
    parallax: 0.29,
  },
];

const PHASES = [
  {
    kicker: "01 · Fechado",
    title: "Primeiro você vê a mordida.",
    body: "O burger entra montado: brioche, alface, tomate, cheddar, blend e base comprimidos como um lanche de verdade.",
  },
  {
    kicker: "02 · Pressão",
    title: "A estrutura começa a ceder.",
    body: "Depois da tensão inicial, cada ingrediente solta em seu próprio plano sem perder a leitura de comida real.",
  },
  {
    kicker: "03 · Explosão 3D",
    title: "Agora a Brasa sai do plano.",
    body: "As seis peças abrem em X, Y e Z com rotação, profundidade e câmera recuando para manter tudo em quadro.",
  },
  {
    kicker: "04 · Assinatura",
    title: "Tudo aberto. Tudo em profundidade.",
    body: "O final segura a composição com luz de food photography e cores naturais, sem dourar ou plastificar os ingredientes.",
  },
] as const;

function phaseFromProgress(value: number) {
  if (value < 0.08) return 0;
  if (value < 0.45) return 1;
  if (value < 0.88) return 2;
  return 3;
}

export function BrasaBurgerStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { pointerX, pointerY } = useCinematicMotion();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [mountScene, setMountScene] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const burgerProgress = useTransform(
    scrollYProgress,
    [0, 0.18, 0.28, 0.67, 0.91, 1],
    [0, 0, 0.04, 0.68, 1, 1],
    { clamp: true },
  );
  const glowOpacity = useTransform(burgerProgress, [0, 0.5, 1], [0.18, 0.24, 0.29]);
  const glowScale = useTransform(burgerProgress, [0, 0.55, 1], [0.84, 1, 1.1]);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setMountScene(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setMountScene(true);
      observer.disconnect();
    }, { rootMargin: "120% 0px 120% 0px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(burgerProgress, "change", (value) => {
    const next = phaseFromProgress(value);
    setPhaseIndex((current) => current === next ? current : next);
  });

  const phase = PHASES[phaseIndex] ?? PHASES[0];

  return (
    <section ref={sectionRef} aria-labelledby="brasa-burger-story-title" className="relative h-[380svh] border-y border-orange-200/10 bg-[#0d0806] sm:h-[370svh] lg:h-[360svh]">
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_73%_47%,rgba(241,90,36,.18),transparent_30%),radial-gradient(circle_at_48%_91%,rgba(255,155,65,.08),transparent_36%),linear-gradient(140deg,#090605_0%,#160b07_48%,#0b0705_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:54px_54px]" />
        <motion.div aria-hidden="true" className="absolute inset-[4%] rounded-[50%] bg-[radial-gradient(circle,rgba(244,102,33,.3)_0%,rgba(244,102,33,.1)_42%,transparent_72%)] blur-3xl" style={{ opacity: glowOpacity, scale: glowScale }} />
        <motion.div aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_24px_rgba(251,146,60,.75)]" style={{ scaleX: burgerProgress }} />

        <div className="absolute inset-x-0 bottom-8 top-[29%] sm:top-[24%] lg:inset-y-0 lg:left-[37%] lg:right-[1%]">
          {mountScene ? <BurgerCanvas progress={burgerProgress} pointerX={pointerX} pointerY={pointerY} reduceMotion={reduceMotion} /> : (
            <div className="absolute inset-0 grid place-items-center"><div className="h-40 w-40 animate-pulse rounded-full border border-orange-400/25 shadow-[0_0_90px_rgba(241,90,36,.18)]" /></div>
          )}
          {mountScene && <SceneLoadIndicator />}
        </div>

        <div className="pointer-events-none relative z-10 mx-auto grid h-full max-w-7xl px-5 py-5 sm:px-8 sm:py-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-12">
          <div className="self-start pt-3 sm:pt-6 lg:self-center lg:pt-0">
            <div className="inline-flex items-center gap-2 border border-orange-300/20 bg-black/30 px-3 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-orange-300 backdrop-blur-xl">
              <Layers3 className="h-3.5 w-3.5" /> Raio-X 3D da Brasa
            </div>
            <h2 id="brasa-burger-story-title" className="mt-4 max-w-[8ch] font-display text-[clamp(2.9rem,7.4vw,6.8rem)] uppercase leading-[0.82] tracking-[-0.04em] text-[#fff6e7] sm:mt-5">
              Desmonte a mordida.
            </h2>
            <AnimatePresence mode="wait">
              <motion.div key={phase.kicker} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -9 }} transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }} className="mt-4 max-w-lg sm:mt-6">
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-orange-400 sm:text-[10px]">{phase.kicker}</p>
                <p className="mt-2 max-w-[16ch] font-display text-2xl uppercase leading-[0.95] text-white sm:text-4xl">{phase.title}</p>
                <p className="mt-3 max-w-md text-xs leading-6 text-orange-50/58 sm:text-sm sm:leading-7">{phase.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 hidden max-w-md grid-cols-6 gap-1.5 lg:grid">
              {BURGER_LAYERS.map((layer, index) => (
                <motion.div key={layer.key} animate={reduceMotion ? undefined : { y: phaseIndex >= Math.min(index, 3) ? -4 : 0, borderColor: phaseIndex >= Math.min(index, 3) ? "rgba(251,146,60,.5)" : "rgba(255,255,255,.08)" }} className="border border-white/10 bg-black/25 px-1.5 py-3 text-center text-[7px] font-black uppercase tracking-[0.1em] text-white/52 backdrop-blur">
                  {layer.label}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="self-end pb-8 text-right lg:self-center lg:pb-0">
            <div className="ml-auto hidden w-fit items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-orange-100/40 sm:inline-flex">
              <MousePointer2 className="h-3.5 w-3.5 text-orange-400" /> Mouse move a luz e a câmera · scroll explode em 3D
            </div>
          </div>
        </div>

        <div className="absolute inset-x-5 bottom-3 z-20 flex items-center gap-3 sm:inset-x-8 sm:bottom-4 lg:inset-x-12">
          <span className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-orange-200/55 sm:text-[9px]"><Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" /> Brasa em profundidade</span>
          <div className="h-px flex-1 overflow-hidden bg-white/10"><motion.div className="h-full origin-left bg-gradient-to-r from-[#f15a24] to-[#ffb25b]" style={{ scaleX: burgerProgress }} /></div>
          <span className="hidden items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/34 sm:inline-flex"><Sparkles className="h-3 w-3 text-orange-400" /> seis peças · luz física</span>
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
      <Canvas dpr={[1, 1.75]} shadows camera={{ position: [0, -0.05, 8.4], fov: 34, near: 0.1, far: 80 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.04;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}>
        <NaturalLighting {...props} />
        <Suspense fallback={null}>
          <BurgerAssembly {...props} />
          <ContactShadows position={[0, -3.15, 0]} opacity={0.5} scale={9.5} blur={2.7} far={8} resolution={512} color="#080302" />
        </Suspense>
        <CameraRig {...props} />
      </Canvas>
    </div>
  );
}

function SceneLoadIndicator() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return <div className="pointer-events-none absolute bottom-7 right-4 z-20 border border-orange-300/15 bg-black/45 px-3 py-2 text-[8px] font-black uppercase tracking-[0.22em] text-orange-200/65 backdrop-blur sm:right-7">Construindo volume · {Math.round(progress)}%</div>;
}

function BurgerAssembly(props: SceneProps) {
  const burgerRef = useRef<THREE.Group>(null);
  const viewportWidth = useThree((state) => state.size.width);
  const compact = viewportWidth < 720;

  useFrame((state, delta) => {
    const group = burgerRef.current;
    if (!group) return;
    const p = props.reduceMotion ? 0 : props.progress.get();
    const px = props.reduceMotion ? 0 : props.pointerX.get();
    const py = props.reduceMotion ? 0 : props.pointerY.get();
    const openEase = THREE.MathUtils.smootherstep(p, 0.06, 1);
    const targetScale = (compact ? 0.67 : 0.93) * THREE.MathUtils.lerp(1, 0.86, openEase);
    const cinematicSpin = THREE.MathUtils.smootherstep(p, 0.18, 0.91);
    const breathe = props.reduceMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.75) * 0.015 * openEase;

    group.position.y = THREE.MathUtils.damp(group.position.y, -0.1 - openEase * 0.1 + breathe, 4.6, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, -0.1 + cinematicSpin * 0.66 + px * 0.21, 4.6, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, -0.02 + cinematicSpin * 0.075 - py * 0.075, 4.8, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, Math.sin(cinematicSpin * Math.PI) * 0.075 + px * 0.03, 4.6, delta);
    const scale = THREE.MathUtils.damp(group.scale.x, targetScale, 4.5, delta);
    group.scale.setScalar(scale);
  });

  return (
    <group>
      <DepthRings progress={props.progress} reduceMotion={props.reduceMotion} />
      <group ref={burgerRef}>
        {BURGER_LAYERS.map((layer) => <IngredientLayer key={layer.key} layer={layer} {...props} />)}
      </group>
    </group>
  );
}

function IngredientLayer({ layer, progress, pointerX, pointerY, reduceMotion }: SceneProps & { layer: Layer3D }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const p = reduceMotion ? 0 : progress.get();
    const raw = THREE.MathUtils.clamp((p - layer.delay) / Math.max(0.001, 0.93 - layer.delay), 0, 1);
    const e = THREE.MathUtils.smootherstep(raw, 0, 1);
    const px = reduceMotion ? 0 : pointerX.get();
    const py = reduceMotion ? 0 : pointerY.get();
    const pointerStrength = e * layer.parallax;
    const floatPhase = state.clock.elapsedTime * (1.02 + layer.delay) + layer.delay * 18;
    const floatY = reduceMotion ? 0 : Math.sin(floatPhase) * 0.045 * e;
    const floatR = reduceMotion ? 0 : Math.cos(floatPhase * 0.88) * 0.022 * e;

    const x = THREE.MathUtils.lerp(layer.closed[0], layer.open[0], e) + px * pointerStrength;
    const y = THREE.MathUtils.lerp(layer.closed[1], layer.open[1], e) - py * pointerStrength * 0.55 + floatY;
    const z = THREE.MathUtils.lerp(layer.closed[2], layer.open[2], e) + Math.abs(px) * pointerStrength * 0.3;
    group.position.x = THREE.MathUtils.damp(group.position.x, x, 5.2, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, y, 5.2, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, z, 5.2, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, layer.openRotation[0] * e - py * 0.035 + floatR, 5, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, layer.openRotation[1] * e + px * 0.06 - floatR * 0.5, 5, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, layer.openRotation[2] * e + px * 0.025 + floatR, 5, delta);
  });

  return (
    <group ref={groupRef} position={layer.closed}>
      {layer.key === "cheese" && <CheeseIngredient />}
      {layer.key === "tomato" && <TomatoIngredient />}
      {layer.key === "lettuce" && <LettuceIngredient />}
      {layer.key === "bottom" && <BunIngredient variant="bottom" />}
      {layer.key === "patty" && <PattyIngredient />}
      {layer.key === "top" && <BunIngredient variant="top" />}
    </group>
  );
}

function makeBunGeometry(variant: "bottom" | "top") {
  const geometry = new THREE.SphereGeometry(1, 96, 56);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const radial = Math.sqrt(x * x + z * z);
    const irregular = Math.sin(x * 7.1 + z * 4.3) * 0.018 + Math.sin(z * 8.6) * 0.011;
    if (variant === "top") {
      const shapedY = y < -0.2 ? -0.24 + (y + 0.2) * 0.18 : y;
      position.set(x * (1 + irregular), shapedY, z * (1 + irregular));
    } else {
      const flattenedY = y > 0.16
        ? 0.16 + (y - 0.16) * 0.08
        : y * 0.62 - Math.pow(radial, 2.4) * 0.045;
      position.set(x * (1 + irregular), flattenedY, z * (1 + irregular));
    }
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function BunIngredient({ variant }: { variant: "bottom" | "top" }) {
  const key = variant === "top" ? "top" : "bottom";
  const geometry = useMemo(() => makeBunGeometry(variant), [variant]);
  const food = useMemo(() => makeFoodMaps(key), [key]);
  const seeds = useMemo(() => Array.from({ length: 24 }, (_, index) => {
    const ring = index < 8 ? 0.32 : index < 18 ? 0.58 : 0.78;
    const slot = index < 8 ? index : index < 18 ? index - 8 : index - 18;
    const count = index < 8 ? 8 : index < 18 ? 10 : 6;
    const angle = slot / count * Math.PI * 2 + ring * 0.9;
    const x = Math.cos(angle) * ring * 1.28;
    const z = Math.sin(angle) * ring * 1.05;
    const dome = Math.sqrt(Math.max(0, 1 - Math.pow(x / 1.45, 2) - Math.pow(z / 1.2, 2)));
    return { x, z, y: dome * 0.72 + 0.06, angle };
  }), []);
  const scale: [number, number, number] = variant === "top" ? [1.45, 0.82, 1.2] : [1.42, 0.52, 1.18];

  return (
    <group>
      <mesh geometry={geometry} scale={scale} castShadow receiveShadow>
        <meshPhysicalMaterial color="#fff0d8" map={food.map} bumpMap={food.bumpMap} bumpScale={food.profile.bump} roughnessMap={food.roughnessMap} roughness={food.profile.roughness} metalness={0} clearcoat={0.025} clearcoatRoughness={0.76} />
      </mesh>
      {variant === "top" && seeds.map((seed, index) => (
        <mesh key={index} position={[seed.x, seed.y, seed.z]} rotation={[0.12, -seed.angle, 0.2]} scale={[0.09, 0.025, 0.035]} castShadow>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#f4d7a5" roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function makePattyGeometry() {
  const geometry = new THREE.CylinderGeometry(1.32, 1.35, 0.48, 96, 12);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const angle = Math.atan2(z, x);
    const edge = Math.sqrt(x * x + z * z);
    const irregular = Math.sin(angle * 7 + y * 18) * 0.035 + Math.sin(angle * 13 - y * 9) * 0.018;
    const surface = Math.sin(x * 8.2 + z * 5.3) * 0.014 + Math.sin(z * 11.1) * 0.01;
    if (edge > 1) {
      const scale = (edge + irregular) / edge;
      position.set(x * scale, y + surface, z * scale);
    } else {
      position.setY(i, y + surface);
    }
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function PattyIngredient() {
  const geometry = useMemo(makePattyGeometry, []);
  const food = useMemo(() => makeFoodMaps("patty"), []);
  return (
    <group scale={[1.03, 1, 0.95]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#fff4ea" map={food.map} bumpMap={food.bumpMap} bumpScale={food.profile.bump} roughnessMap={food.roughnessMap} roughness={food.profile.roughness} metalness={0} emissive="#180806" emissiveIntensity={0.12} />
      </mesh>
      {[-0.52, -0.18, 0.21, 0.58].map((z, index) => (
        <mesh key={z} position={[0, 0.249, z]} rotation={[-Math.PI / 2, 0, index % 2 ? 0.08 : -0.06]} scale={[1.05, 0.018, 0.018]}>
          <boxGeometry args={[1.7, 1, 1]} />
          <meshStandardMaterial color="#1a0c08" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function makeCheeseGeometry() {
  const geometry = new THREE.PlaneGeometry(2.72, 2.38, 28, 24);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const z = position.getZ(i);
    const nx = Math.abs(x) / 1.36;
    const nz = Math.abs(z) / 1.19;
    const edge = Math.max(nx, nz);
    const corner = nx * nz;
    const droop = -Math.pow(Math.max(0, edge - 0.68), 2) * 0.3 - Math.pow(corner, 2.4) * 0.11;
    const ripple = Math.sin(x * 3.2 + z * 2.5) * 0.012 + Math.cos(z * 4.1) * 0.008;
    position.setY(i, droop + ripple);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function CheeseIngredient() {
  const geometry = useMemo(makeCheeseGeometry, []);
  const food = useMemo(() => makeFoodMaps("cheese"), []);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial color="#fff3d0" map={food.map} bumpMap={food.bumpMap} bumpScale={food.profile.bump} roughnessMap={food.roughnessMap} roughness={food.profile.roughness} metalness={0} clearcoat={0.035} clearcoatRoughness={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}

function TomatoIngredient() {
  const food = useMemo(() => makeFoodMaps("tomato"), []);
  const seeds = useMemo(() => Array.from({ length: 10 }, (_, index) => {
    const angle = index / 10 * Math.PI * 2 + (index % 2) * 0.18;
    const radius = 0.42 + (index % 3) * 0.13;
    return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, r: angle + Math.PI / 2 };
  }), []);

  return (
    <group scale={[1.08, 1, 0.93]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.22, 0.13, 64, 3]} />
        <meshPhysicalMaterial color="#ff6f5d" map={food.map} bumpMap={food.bumpMap} bumpScale={food.profile.bump} roughnessMap={food.roughnessMap} roughness={0.6} metalness={0} clearcoat={0.08} clearcoatRoughness={0.48} />
      </mesh>
      <mesh position={[0, 0.069, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.86, 64]} />
        <meshPhysicalMaterial color="#d62c28" transparent opacity={0.38} roughness={0.48} side={THREE.DoubleSide} />
      </mesh>
      {seeds.map((seed, index) => (
        <mesh key={index} position={[seed.x, 0.082, seed.z]} rotation={[-Math.PI / 2, 0, seed.r]} scale={[1, 1, 0.45]}>
          <sphereGeometry args={[0.045, 12, 8]} />
          <meshPhysicalMaterial color="#f5c987" roughness={0.56} transmission={0.03} />
        </mesh>
      ))}
    </group>
  );
}

function makeLettuceGeometry() {
  const rings = 9;
  const segments = 96;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let ring = 0; ring <= rings; ring += 1) {
    const t = ring / rings;
    for (let segment = 0; segment <= segments; segment += 1) {
      const a = segment / segments * Math.PI * 2;
      const edgeWave = Math.sin(a * 9) * 0.095 + Math.sin(a * 17 + 0.8) * 0.04;
      const radius = t * (1.22 + edgeWave * Math.pow(t, 2.2));
      const x = Math.cos(a) * radius * 1.12;
      const z = Math.sin(a) * radius;
      const y = Math.sin(a * 5 + t * 7) * 0.038 * t + Math.sin(a * 13) * 0.035 * Math.pow(t, 3);
      positions.push(x, y, z);
      uvs.push(0.5 + x / 3, 0.5 + z / 2.7);
    }
  }
  for (let ring = 0; ring < rings; ring += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const a = ring * (segments + 1) + segment;
      const b = a + segments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function LettuceIngredient() {
  const geometry = useMemo(makeLettuceGeometry, []);
  const food = useMemo(() => makeFoodMaps("lettuce"), []);
  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial color="#eef9bf" map={food.map} bumpMap={food.bumpMap} bumpScale={food.profile.bump} roughnessMap={food.roughnessMap} roughness={food.profile.roughness} metalness={0} emissive="#102508" emissiveIntensity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.018, 8, 64]} />
        <meshStandardMaterial color="#b8d875" roughness={0.75} />
      </mesh>
    </group>
  );
}

function NaturalLighting({ progress, pointerX, pointerY, reduceMotion }: SceneProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemisphereRef = useRef<THREE.HemisphereLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const keyRef = useRef<THREE.PointLight>(null);
  const gl = useThree((state) => state.gl);
  const neutralDirectional = useMemo(() => new THREE.Color("#fff8ef"), []);
  const warmDirectional = useMemo(() => new THREE.Color("#ffe9ce"), []);
  const neutralKey = useMemo(() => new THREE.Color("#fff5e8"), []);
  const warmKey = useMemo(() => new THREE.Color("#ffe4c2"), []);

  useFrame((_, delta) => {
    const p = reduceMotion ? 0 : progress.get();
    const finish = THREE.MathUtils.smootherstep(p, 0.64, 1);
    const px = reduceMotion ? 0 : pointerX.get();
    const py = reduceMotion ? 0 : pointerY.get();
    if (ambientRef.current) ambientRef.current.intensity = THREE.MathUtils.damp(ambientRef.current.intensity, THREE.MathUtils.lerp(0.54, 0.62, finish), 4.2, delta);
    if (hemisphereRef.current) hemisphereRef.current.intensity = THREE.MathUtils.damp(hemisphereRef.current.intensity, THREE.MathUtils.lerp(0.9, 1.02, finish), 4.2, delta);
    if (directionalRef.current) {
      directionalRef.current.intensity = THREE.MathUtils.damp(directionalRef.current.intensity, THREE.MathUtils.lerp(3.4, 3.75, finish), 4.2, delta);
      directionalRef.current.color.copy(neutralDirectional).lerp(warmDirectional, finish * 0.2);
    }
    if (rimRef.current) rimRef.current.intensity = THREE.MathUtils.damp(rimRef.current.intensity, THREE.MathUtils.lerp(1.9, 2.8, finish), 4.2, delta);
    if (keyRef.current) {
      keyRef.current.intensity = THREE.MathUtils.damp(keyRef.current.intensity, THREE.MathUtils.lerp(8.6, 9.4, finish), 4.2, delta);
      keyRef.current.color.copy(neutralKey).lerp(warmKey, finish * 0.18);
      keyRef.current.position.x = THREE.MathUtils.damp(keyRef.current.position.x, 2.8 + px * 2.1, 5, delta);
      keyRef.current.position.y = THREE.MathUtils.damp(keyRef.current.position.y, 3 - py * 1.4, 5, delta);
    }
    gl.toneMappingExposure = THREE.MathUtils.damp(gl.toneMappingExposure, THREE.MathUtils.lerp(1.04, 1.07, finish), 3.8, delta);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.54} />
      <hemisphereLight ref={hemisphereRef} args={["#fff8ef", "#180b07", 0.9]} />
      <directionalLight ref={directionalRef} castShadow color="#fff8ef" intensity={3.4} position={[4.7, 6.5, 5.5]} shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0002} />
      <pointLight ref={rimRef} color="#f15a24" intensity={1.9} distance={12} position={[-3.5, 0.7, 3.2]} />
      <pointLight ref={keyRef} color="#fff5e8" intensity={8.6} distance={11} position={[2.8, 3, 3.9]} />
    </>
  );
}

function CameraRig({ progress, pointerX, pointerY, reduceMotion }: SceneProps) {
  const { camera } = useThree();
  const lookTarget = useMemo(() => new THREE.Vector3(0, -0.04, 0), []);
  useFrame((_, delta) => {
    const p = reduceMotion ? 0 : progress.get();
    const px = reduceMotion ? 0 : pointerX.get();
    const py = reduceMotion ? 0 : pointerY.get();
    const e = THREE.MathUtils.smootherstep(p, 0.08, 1);
    const orbit = Math.sin(e * Math.PI) * 0.42;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.42 + orbit, 3.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -0.02 - py * 0.22 - e * 0.05, 3.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, THREE.MathUtils.lerp(8.4, 11.9, e), 3.8, delta);
    camera.lookAt(lookTarget);
  });
  return null;
}

function DepthRings({ progress, reduceMotion }: { progress: MotionValue<number>; reduceMotion: boolean }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    const p = reduceMotion ? 0 : progress.get();
    if (outerRef.current) outerRef.current.rotation.z = THREE.MathUtils.damp(outerRef.current.rotation.z, p * 1.1, 2.4, delta);
    if (innerRef.current) {
      innerRef.current.rotation.z = THREE.MathUtils.damp(innerRef.current.rotation.z, -p * 1.45, 2.4, delta);
      innerRef.current.rotation.x = THREE.MathUtils.damp(innerRef.current.rotation.x, 0.12 + p * 0.1, 2.4, delta);
    }
  });
  return (
    <group position={[0, -0.02, -2.65]}>
      <mesh ref={outerRef} scale={[1.08, 1.08, 1]}>
        <torusGeometry args={[3.35, 0.012, 8, 128]} />
        <meshBasicMaterial color="#f15a24" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh ref={innerRef} rotation={[0.12, 0, 0]}>
        <torusGeometry args={[2.72, 0.009, 8, 128]} />
        <meshBasicMaterial color="#ffb25b" transparent opacity={0.14} depthWrite={false} />
      </mesh>
    </group>
  );
}
