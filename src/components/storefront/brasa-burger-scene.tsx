import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, useGLTF } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const MODEL_URLS = {
  top: "https://v3b.fal.media/files/b/0aa5b90a/_yTuGk25g3FLoLcqiHRJk_model.glb",
  greens: "https://v3b.fal.media/files/b/0aa5b8ff/tEhNTxccJiIYtwTj4t_P7_model.glb",
  cheese: "https://v3b.fal.media/files/b/0aa5b8fa/gwA3NVHUkkTxlwnuzj9GO_model.glb",
  patty: "https://v3b.fal.media/files/b/0aa5b90f/vvgLpjJwze4nx3n6tSkga_model.glb",
  bottom: "https://v3b.fal.media/files/b/0aa5b90d/yKHi4cdHni8FCv5Zmk4Tb_model.glb",
} as const;

type BrasaBurgerCanvasProps = {
  progress: MotionValue<number>;
  compact: boolean;
  reduced: boolean;
  dpr: number;
  antialias: boolean;
};

type BurgerLayerConfig = {
  url: string;
  baseY: number;
  explodeY: number;
  width: number;
  driftX: number;
  rotateZ: number;
  rotateY: number;
};

const LAYERS: BurgerLayerConfig[] = [
  {
    url: MODEL_URLS.bottom,
    baseY: -0.88,
    explodeY: -0.7,
    width: 2.68,
    driftX: -0.06,
    rotateZ: -0.028,
    rotateY: -0.045,
  },
  {
    url: MODEL_URLS.patty,
    baseY: -0.43,
    explodeY: -0.34,
    width: 2.66,
    driftX: 0.08,
    rotateZ: 0.03,
    rotateY: 0.055,
  },
  {
    url: MODEL_URLS.cheese,
    baseY: -0.04,
    explodeY: 0.04,
    width: 2.78,
    driftX: -0.09,
    rotateZ: -0.055,
    rotateY: -0.07,
  },
  {
    url: MODEL_URLS.greens,
    baseY: 0.36,
    explodeY: 0.38,
    width: 2.76,
    driftX: 0.1,
    rotateZ: 0.045,
    rotateY: 0.075,
  },
  {
    url: MODEL_URLS.top,
    baseY: 0.88,
    explodeY: 0.72,
    width: 2.7,
    driftX: -0.04,
    rotateZ: -0.028,
    rotateY: -0.05,
  },
];

export default function BrasaBurgerCanvas({
  progress,
  compact,
  reduced,
  dpr,
  antialias,
}: BrasaBurgerCanvasProps) {
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.08, compact ? 8.4 : 7.7], fov: compact ? 50 : 43 }}
      gl={{ antialias, alpha: true, powerPreference: "high-performance" }}
      className="absolute inset-0"
      shadows={!compact}
    >
      <BurgerScene progress={progress} compact={compact} reduced={reduced} />
    </Canvas>
  );
}

function BurgerScene({
  progress,
  compact,
  reduced,
}: {
  progress: MotionValue<number>;
  compact: boolean;
  reduced: boolean;
}) {
  const rigRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const rig = rigRef.current;
    if (!rig) return;

    const value = reduced ? 0.72 : progress.get();
    const open = THREE.MathUtils.smoothstep(value, 0.06, 0.92);
    const pointerX = compact ? 0 : state.pointer.x;
    const pointerY = compact ? 0 : state.pointer.y;
    const targetScale = compact ? 0.68 - open * 0.035 : 0.92 - open * 0.045;

    rig.rotation.y = THREE.MathUtils.damp(
      rig.rotation.y,
      pointerX * 0.15 + open * 0.1,
      4.2,
      delta,
    );
    rig.rotation.x = THREE.MathUtils.damp(rig.rotation.x, -pointerY * 0.065, 4.2, delta);
    rig.position.x = THREE.MathUtils.damp(
      rig.position.x,
      compact ? 0 : 0.78 + pointerX * 0.09,
      3.6,
      delta,
    );
    rig.position.y = THREE.MathUtils.damp(
      rig.position.y,
      compact ? -0.24 : -0.08 - pointerY * 0.06,
      3.6,
      delta,
    );
    const nextScale = THREE.MathUtils.damp(rig.scale.x, targetScale, 4.2, delta);
    rig.scale.setScalar(nextScale);
  });

  return (
    <>
      <fog attach="fog" args={["#120d0a", 8, 15]} />
      <ambientLight intensity={1.05} />
      <hemisphereLight args={["#ffb36b", "#2b0d05", 1.05]} />
      <directionalLight
        position={[3.5, 5.5, 5]}
        intensity={3.2}
        color="#ffd0a1"
        castShadow={!compact}
      />
      <pointLight position={[-3.4, 1.5, 3]} intensity={28} distance={9} color="#ff4d18" />
      <pointLight position={[2.8, -2.2, 1]} intensity={20} distance={8} color="#ff9a3d" />

      <group ref={rigRef}>
        <Suspense fallback={<FallbackBurger progress={progress} reduced={reduced} compact={compact} />}>
          {LAYERS.map((layer, index) => (
            <BurgerLayer
              key={layer.url}
              config={layer}
              index={index}
              progress={progress}
              reduced={reduced}
              compact={compact}
            />
          ))}
        </Suspense>
      </group>

      <Sparkles
        count={compact ? 14 : 34}
        scale={compact ? [4.5, 5.2, 2] : [7, 6, 3]}
        size={compact ? 1.25 : 1.55}
        speed={0.18}
        opacity={0.42}
        color="#ff7a2f"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, compact ? -2.4 : -2.75, -0.3]} receiveShadow>
        <circleGeometry args={[compact ? 2.8 : 3.7, 48]} />
        <meshStandardMaterial
          color="#160b06"
          roughness={0.92}
          metalness={0.04}
          transparent
          opacity={0.68}
        />
      </mesh>
    </>
  );
}

function BurgerLayer({
  config,
  index,
  progress,
  reduced,
  compact,
}: {
  config: BurgerLayerConfig;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
  compact: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;

    const value = reduced ? 0.72 : progress.get();
    const open = THREE.MathUtils.smoothstep(value, 0.06, 0.92);
    const breathing = reduced
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.68 + index * 0.7) * 0.012;
    const explodeScale = compact ? 0.72 : 1;
    const targetY = config.baseY + config.explodeY * explodeScale * open + breathing;

    group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 5.4, delta);
    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      config.driftX * explodeScale * open,
      5.2,
      delta,
    );
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, config.rotateZ * open, 5, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, config.rotateY * open, 5, delta);
  });

  return (
    <group ref={ref} position={[0, config.baseY, 0]}>
      <NormalizedModel url={config.url} targetWidth={config.width} />
    </group>
  );
}

function NormalizedModel({ url, targetWidth }: { url: string; targetWidth: number }) {
  const { scene } = useGLTF(url);
  const normalized = useMemo(() => {
    const object = scene.clone(true);
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const horizontal = Math.max(size.x, size.z, 0.001);
    const scale = targetWidth / horizontal;
    object.position.set(-center.x, -center.y, -center.z);

    return { object, scale };
  }, [scene, targetWidth]);

  return <primitive object={normalized.object} scale={normalized.scale} />;
}

function FallbackBurger({
  progress,
  reduced,
  compact,
}: {
  progress: MotionValue<number>;
  reduced: boolean;
  compact: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const layerRefs = useRef<Array<THREE.Group | null>>([]);
  const assembledY = [-0.88, -0.43, -0.04, 0.36, 0.88];
  const explodedOffset = [-0.7, -0.34, 0.04, 0.38, 0.72];

  useFrame((_state, delta) => {
    const open = THREE.MathUtils.smoothstep(reduced ? 0.72 : progress.get(), 0.06, 0.92);
    const explodeScale = compact ? 0.72 : 1;
    layerRefs.current.forEach((layer, index) => {
      if (!layer) return;
      const target = assembledY[index] + explodedOffset[index] * explodeScale * open;
      layer.position.y = THREE.MathUtils.damp(layer.position.y, target, 5, delta);
    });
    if (root.current) root.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={root}>
      <group ref={(node) => { layerRefs.current[0] = node; }} position={[0, assembledY[0], 0]}>
        <mesh scale={[1.42, 0.26, 1.42]}>
          <sphereGeometry args={[1, 36, 18, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58]} />
          <meshStandardMaterial color="#d9863f" roughness={0.62} />
        </mesh>
      </group>
      <group ref={(node) => { layerRefs.current[1] = node; }} position={[0, assembledY[1], 0]}>
        <mesh scale={[1.38, 0.27, 1.38]}>
          <cylinderGeometry args={[1, 1.05, 0.42, 36]} />
          <meshStandardMaterial color="#4b1f10" roughness={0.9} />
        </mesh>
      </group>
      <group ref={(node) => { layerRefs.current[2] = node; }} position={[0, assembledY[2], 0]} rotation={[0, Math.PI / 4, 0]}>
        <mesh scale={[1.55, 0.07, 1.55]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#f7a21b" roughness={0.52} />
        </mesh>
      </group>
      <group ref={(node) => { layerRefs.current[3] = node; }} position={[0, assembledY[3], 0]}>
        <mesh scale={[1.4, 0.12, 1.4]}>
          <torusGeometry args={[0.72, 0.32, 14, 44]} />
          <meshStandardMaterial color="#4d8d3f" roughness={0.82} />
        </mesh>
      </group>
      <group ref={(node) => { layerRefs.current[4] = node; }} position={[0, assembledY[4], 0]}>
        <mesh scale={[1.44, 0.64, 1.44]}>
          <sphereGeometry args={[1, 42, 22, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#d98a46" roughness={0.58} />
        </mesh>
      </group>
    </group>
  );
}
