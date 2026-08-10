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
import { ContactShadows, Environment, Lightformer, useGLTF, useProgress } from "@react-three/drei";
import { Flame, Layers3, MousePointer2, Sparkles } from "lucide-react";
import * as THREE from "three";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

type IngredientKey = "bottom" | "patty" | "cheese" | "tomato" | "lettuce" | "top";

type Layer3D = {
  key: IngredientKey;
  label: string;
  model: string;
  targetSize: number;
  modelScale?: [number, number, number];
  modelRotation?: [number, number, number];
  tint: string;
  roughness: number;
  closed: [number, number, number];
  open: [number, number, number];
  openRotation: [number, number, number];
  delay: number;
  parallax: number;
};

const BURGER_LAYERS: Layer3D[] = [
  {
    key: "bottom",
    label: "Base",
    model: "/models/brasa/bottom.glb",
    targetSize: 2.72,
    modelScale: [1.05, 0.5, 1.05],
    tint: "#fff2e1",
    roughness: 0.76,
    closed: [0, -0.4, 0],
    open: [-0.72, -2.42, -0.86],
    openRotation: [-0.13, -0.48, -0.1],
    delay: 0.04,
    parallax: 0.12,
  },
  {
    key: "patty",
    label: "Blend",
    model: "/models/brasa/patty.glb",
    targetSize: 2.72,
    modelScale: [1.04, 0.58, 1.04],
    tint: "#fff7f1",
    roughness: 0.68,
    closed: [0, -0.12, 0.03],
    open: [0.72, -1.5, 0.34],
    openRotation: [0.18, 0.44, 0.13],
    delay: 0.11,
    parallax: 0.15,
  },
  {
    key: "cheese",
    label: "Cheddar",
    model: "/models/brasa/cheese.glb",
    targetSize: 2.76,
    modelScale: [0.98, 0.08, 0.98],
    modelRotation: [0.02, 0.1, 0.02],
    tint: "#ffb13b",
    roughness: 0.55,
    closed: [0, 0.05, 0.08],
    open: [-0.9, -0.5, 0.82],
    openRotation: [0.22, -0.54, -0.18],
    delay: 0.18,
    parallax: 0.19,
  },
  {
    key: "tomato",
    label: "Tomate",
    model: "/models/brasa/tomato.glb",
    targetSize: 2.58,
    modelScale: [1.07, 1.07, 0.16],
    modelRotation: [Math.PI / 2, 0, 0],
    tint: "#ff554d",
    roughness: 0.48,
    closed: [0, 0.13, 0.06],
    open: [0.88, 0.42, 0.58],
    openRotation: [0.18, 0.64, 0.2],
    delay: 0.09,
    parallax: 0.22,
  },
  {
    key: "lettuce",
    label: "Alface",
    model: "/models/brasa/lettuce.glb",
    targetSize: 2.76,
    modelScale: [1.18, 0.92, 0.16],
    modelRotation: [Math.PI / 2, 0, 0],
    tint: "#ffffff",
    roughness: 0.62,
    closed: [0, 0.22, 0.08],
    open: [-0.78, 1.36, 0.98],
    openRotation: [-0.16, -0.62, -0.21],
    delay: 0.14,
    parallax: 0.25,
  },
  {
    key: "top",
    label: "Brioche",
    model: "/models/brasa/top.glb",
    targetSize: 2.92,
    modelScale: [1, 0.72, 1],
    tint: "#fff0dc",
    roughness: 0.72,
    closed: [0, 0.43, 0.03],
    open: [0.58, 2.18, 0.72],
    openRotation: [-0.22, -0.72, -0.18],
    delay: 0.02,
    parallax: 0.29,
  },
];

BURGER_LAYERS.forEach(({ model }) => useGLTF.preload(model));

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
            <div className="hidden">
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
      <Canvas dpr={[1, 2]} shadows camera={{ position: [0, -0.05, 8.4], fov: 34, near: 0.1, far: 80 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.04;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}>
        <NaturalLighting {...props} />
        <Suspense fallback={null}>
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={2.4} color="#fff4e8" position={[0, 4, 5]} rotation={[-0.7, 0, 0]} scale={[7, 4, 1]} />
            <Lightformer form="rect" intensity={1.25} color="#ffc99a" position={[-4, 1, 3]} rotation={[0, 0.75, 0]} scale={[4, 5, 1]} />
            <Lightformer form="ring" intensity={0.9} color="#ffffff" position={[4, -1, 2]} rotation={[0, -0.8, 0]} scale={3} />
          </Environment>
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
    const targetScale = (compact ? 0.7 : 1.03) * THREE.MathUtils.lerp(1, 0.86, openEase);
    const cinematicSpin = THREE.MathUtils.smootherstep(p, 0.18, 0.91);
    const breathe = props.reduceMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.75) * 0.015 * openEase;

    group.position.y = THREE.MathUtils.damp(group.position.y, -0.1 - openEase * 0.1 + breathe, 4.6, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, -0.1 + cinematicSpin * 0.66 + px * 0.21, 4.6, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, -0.09 + cinematicSpin * 0.14 - py * 0.075, 4.8, delta);
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
    const rotationEase = THREE.MathUtils.smootherstep(raw, 0.24, 1);
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
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, layer.openRotation[0] * rotationEase - py * 0.035 * rotationEase + floatR, 5, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, layer.openRotation[1] * rotationEase + px * 0.06 * rotationEase - floatR * 0.5, 5, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, layer.openRotation[2] * rotationEase + px * 0.025 * rotationEase + floatR, 5, delta);
  });

  return (
    <group ref={groupRef} position={layer.closed}>
      <GLBIngredient layer={layer} />
    </group>
  );
}

function GLBIngredient({ layer }: { layer: Layer3D }) {
  const gl = useThree((state) => state.gl);
  const { scene } = useGLTF(layer.model);

  const object = useMemo(() => {
    const clone = scene.clone(true);
    const maxAnisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;

      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
      const upgraded = sourceMaterials.map((source) => {
        const material = source.clone() as THREE.MeshStandardMaterial;
        for (const texture of [material.map, material.normalMap, material.roughnessMap, material.aoMap]) {
          if (!texture) continue;
          texture.anisotropy = maxAnisotropy;
          texture.needsUpdate = true;
        }
        if (material.map) material.map.colorSpace = THREE.SRGBColorSpace;
        material.color.set(layer.tint);
        material.metalness = 0;
        material.roughness = layer.roughness;
        material.envMapIntensity = layer.key === "patty" ? 0.42 : layer.key === "cheese" ? 0.52 : 0.62;
        material.side = layer.key === "lettuce" || layer.key === "tomato" || layer.key === "cheese"
          ? THREE.DoubleSide
          : THREE.FrontSide;
        if (layer.key === "cheese") {
          material.emissive = new THREE.Color("#6b2600");
          material.emissiveIntensity = 0.07;
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
  }, [gl, layer.key, layer.roughness, layer.targetSize, layer.tint, scene]);

  return (
    <group scale={layer.modelScale ?? [1, 1, 1]} rotation={layer.modelRotation ?? [0, 0, 0]}>
      <primitive object={object} />
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
