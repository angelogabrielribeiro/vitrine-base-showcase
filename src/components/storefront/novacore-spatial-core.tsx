import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { motion, type MotionValue, useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  useCinematicMotion,
  useSceneActivity,
} from "@/components/motion/cinematic-motion-system";

type NovaCoreSpatialCoreProps = {
  className?: string;
  activeIndex?: number;
  compact?: boolean;
};

type CoreSceneProps = {
  activeIndex: number;
  compact: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  particles: number;
};

const CORE_COLORS = ["#67e8f9", "#60a5fa", "#a78bfa", "#22d3ee"];

export function NovaCoreSpatialCore({
  className,
  activeIndex = 0,
  compact = false,
}: NovaCoreSpatialCoreProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { capabilities, pointerX, pointerY } = useCinematicMotion();
  const activity = useSceneActivity(rootRef, { rootMargin: "35% 0px" });
  const canRender3D =
    capabilities.hydrated &&
    capabilities.allow3D &&
    !reduceMotion &&
    activity.seen;

  return (
    <div ref={rootRef} aria-hidden="true" className={className}>
      <div className="absolute inset-0 overflow-hidden bg-[#02040c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_42%,rgba(37,99,235,.24),transparent_28%),radial-gradient(circle_at_42%_60%,rgba(139,92,246,.16),transparent_32%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(103,232,249,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,.08) 1px, transparent 1px)",
            backgroundSize: compact ? "38px 38px" : "58px 58px",
            maskImage: "radial-gradient(circle at 64% 50%, black, transparent 76%)",
          }}
        />
      </div>

      {canRender3D ? (
        <Canvas
          dpr={capabilities.dpr}
          camera={{ position: [0, 0.15, compact ? 6.8 : 6.2], fov: compact ? 46 : 42 }}
          gl={{
            antialias: capabilities.quality === "cinematic",
            alpha: true,
            powerPreference: "high-performance",
          }}
          frameloop={activity.active ? "always" : "never"}
          className="absolute inset-0"
        >
          <CoreScene
            activeIndex={activeIndex}
            compact={compact}
            pointerX={pointerX}
            pointerY={pointerY}
            particles={Math.max(24, capabilities.maxParticles)}
          />
        </Canvas>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
            }
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

function CoreScene({
  activeIndex,
  compact,
  pointerX,
  pointerY,
  particles,
}: CoreSceneProps) {
  const sceneRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const color = CORE_COLORS[activeIndex % CORE_COLORS.length] ?? CORE_COLORS[0];

  useFrame((_state, delta) => {
    const scene = sceneRef.current;
    const orbit = orbitRef.current;
    if (!scene || !orbit) return;

    const x = pointerX.get();
    const y = pointerY.get();
    scene.rotation.y = THREE.MathUtils.damp(scene.rotation.y, x * 0.2, 4.2, delta);
    scene.rotation.x = THREE.MathUtils.damp(scene.rotation.x, -y * 0.12, 4.2, delta);
    scene.position.x = THREE.MathUtils.damp(scene.position.x, x * 0.34, 3.2, delta);
    scene.position.y = THREE.MathUtils.damp(scene.position.y, -y * 0.2, 3.2, delta);
    orbit.rotation.z += delta * 0.075;
    orbit.rotation.y -= delta * 0.11;
  });

  return (
    <>
      <fog attach="fog" args={["#02040c", 7, 15]} />
      <ambientLight intensity={0.42} />
      <pointLight position={[4, 3, 4]} intensity={38} distance={11} color={color} />
      <pointLight position={[-4, -2, 2]} intensity={24} distance={10} color="#7c3aed" />

      <group ref={sceneRef} position={compact ? [0.8, 0.05, 0] : [1.25, 0.05, 0]}>
        <Float speed={1.25} rotationIntensity={0.16} floatIntensity={0.28}>
          <Reactor activeIndex={activeIndex} compact={compact} />
        </Float>

        <group ref={orbitRef}>
          {Array.from({ length: compact ? 8 : 12 }).map((_, index) => {
            const angle = (index / (compact ? 8 : 12)) * Math.PI * 2;
            const radius = compact ? 2.15 : 2.7;
            return (
              <PowerNode
                key={index}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle) * radius * 0.52,
                  Math.sin(angle * 1.8) * 0.64,
                ]}
                phase={index * 0.6}
                color={index % 3 === 0 ? "#a78bfa" : color}
              />
            );
          })}
        </group>

        <Sparkles
          count={particles}
          scale={compact ? [6, 4, 3] : [8, 5, 4]}
          size={1.45}
          speed={0.22}
          opacity={0.54}
          color={color}
        />
      </group>

      <gridHelper
        args={[18, 30, "#164e63", "#071525"]}
        position={[0, -2.75, -1.8]}
      />
    </>
  );
}

function Reactor({ activeIndex, compact }: { activeIndex: number; compact: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const color = CORE_COLORS[activeIndex % CORE_COLORS.length] ?? CORE_COLORS[0];
  const satellites = useMemo(
    () =>
      Array.from({ length: compact ? 4 : 6 }).map((_, index) => ({
        angle: (index / (compact ? 4 : 6)) * Math.PI * 2,
        radius: 1.5 + (index % 2) * 0.22,
        y: (index % 3 - 1) * 0.38,
      })),
    [compact],
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.06;
    }
    if (shellRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8 + activeIndex) * 0.035;
      shellRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[compact ? 0.92 : 1.08, 3]} />
        <meshPhysicalMaterial
          color="#071126"
          emissive={color}
          emissiveIntensity={1.25}
          metalness={0.78}
          roughness={0.18}
          transmission={0.2}
          thickness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.12}
          wireframe
        />
      </mesh>

      <mesh scale={compact ? 0.67 : 0.76}>
        <octahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.4}
          metalness={0.35}
          roughness={0.16}
        />
      </mesh>

      {[0, 1, 2].map((ring) => (
        <mesh
          key={ring}
          rotation={[
            ring === 0 ? Math.PI / 2 : Math.PI / 3,
            ring === 1 ? Math.PI / 2.4 : 0,
            ring * 0.85,
          ]}
        >
          <torusGeometry args={[1.38 + ring * 0.24, 0.018 + ring * 0.006, 10, 128]} />
          <meshBasicMaterial color={ring === 2 ? "#a78bfa" : color} transparent opacity={0.7} />
        </mesh>
      ))}

      {satellites.map((satellite, index) => (
        <mesh
          key={index}
          position={[
            Math.cos(satellite.angle) * satellite.radius,
            satellite.y,
            Math.sin(satellite.angle) * satellite.radius,
          ]}
          rotation={[satellite.angle, satellite.angle * 0.6, satellite.angle * 1.2]}
        >
          <boxGeometry args={[0.2, 0.08, 0.42]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? color : "#a78bfa"}
            emissive={index % 2 === 0 ? color : "#7c3aed"}
            emissiveIntensity={1.2}
            metalness={0.82}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function PowerNode({
  position,
  phase,
  color,
}: {
  position: [number, number, number];
  phase: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 0.78 + (Math.sin(state.clock.elapsedTime * 1.45 + phase) + 1) * 0.18;
    ref.current.scale.setScalar(pulse);
    ref.current.rotation.x += 0.006;
    ref.current.rotation.y -= 0.009;
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} />
    </mesh>
  );
}
