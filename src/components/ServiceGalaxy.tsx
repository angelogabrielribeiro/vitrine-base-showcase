import { Html, Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { services, type ServiceSlug } from "../config/site";

const nodes: { slug: ServiceSlug; position: [number, number, number] }[] = [
  { slug: "ti", position: [-3.4, 1.35, 0.2] },
  { slug: "manutencao", position: [3.1, 1.05, -1.4] },
  { slug: "financas", position: [-2.6, -1.9, -1.1] },
  { slug: "contabilidade", position: [3.25, -1.75, 0.4] },
];

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 1400;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + ((i * 17) % 100) / 17;
      const a = i * 2.399963;
      const b = Math.sin(i * .73) * 2.2;
      data[i * 3] = Math.cos(a) * r;
      data[i * 3 + 1] = b;
      data[i * 3 + 2] = Math.sin(a) * r;
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * .018;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#77d7d0" size={.028} transparent opacity={.42} sizeAttenuation />
    </points>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((_, delta) => {
    const x = pointer.x * .6;
    const y = pointer.y * .35;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 4, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function ServiceNode({ slug, position, onSelect }: { slug: ServiceSlug; position: [number, number, number]; onSelect: (slug: ServiceSlug) => void }) {
  const service = services[slug];
  return (
    <Float speed={1.25} rotationIntensity={.16} floatIntensity={.25}>
      <group position={position}>
        <mesh onClick={() => onSelect(slug)} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "auto")}>
          <icosahedronGeometry args={[.72, 2]} />
          <meshStandardMaterial color={service.accent} roughness={.26} metalness={.16} emissive={service.accent} emissiveIntensity={.16} />
        </mesh>
        <mesh scale={1.32}>
          <icosahedronGeometry args={[.72, 1]} />
          <meshBasicMaterial color={service.accent} wireframe transparent opacity={.12} />
        </mesh>
        <Html transform distanceFactor={9} position={[0, -1.1, 0]} center>
          <button className="galaxy-label" onClick={() => onSelect(slug)}>
            <strong>{service.short}</strong>
            <span>{service.eyebrow}</span>
          </button>
        </Html>
      </group>
    </Float>
  );
}

export function ServiceGalaxy() {
  const navigate = useNavigate();
  const select = (slug: ServiceSlug) => navigate(`/${slug}`);

  return (
    <section className="galaxy-section">
      <div className="section-kicker">Mapa de atendimento</div>
      <div className="galaxy-copy">
        <h2>Quatro frentes. Uma conversa direta.</h2>
        <p>Explore o campo. Cada núcleo representa um tipo de problema e leva para uma página específica, pronta para receber tráfego de anúncios sem jogar todo mundo na mesma home.</p>
      </div>
      <div className="galaxy-canvas">
        <Canvas camera={{ position: [0, 0, 8.8], fov: 46 }} dpr={[1, 1.55]}>
          <ambientLight intensity={.45} />
          <pointLight position={[4, 4, 6]} intensity={15} color="#8ce6df" distance={16} />
          <pointLight position={[-4, -3, 4]} intensity={8} color="#d9a75f" distance={14} />
          <ParticleField />
          {nodes.map((node) => <ServiceNode key={node.slug} {...node} onSelect={select} />)}
          <CameraRig />
        </Canvas>
      </div>
      <p className="galaxy-hint">Mova o cursor · toque nos núcleos · entre pelo serviço certo</p>
    </section>
  );
}
