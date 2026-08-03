import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { StoreNiche } from "@/types/commerce";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

const PALETTES: Record<
  StoreNiche,
  { a: string; b: string; fallback: string; falloff: number; fallbackSize: number }
> = {
  fashion: {
    a: "#d49aa7",
    b: "#c99a55",
    fallback: "rgba(212,154,167,.24)",
    falloff: 11.9,
    fallbackSize: 5.4,
  },
  barber: {
    a: "#f4c866",
    b: "#a86b23",
    fallback: "rgba(244,200,102,.2)",
    falloff: 10.8,
    fallbackSize: 6,
  },
  restaurant: {
    a: "#ff642b",
    b: "#ffbd4a",
    fallback: "rgba(255,100,43,.22)",
    falloff: 10.8,
    fallbackSize: 6,
  },
  electronics: {
    a: "#67e8f9",
    b: "#8b5cf6",
    fallback: "rgba(103,232,249,.22)",
    falloff: 10.8,
    fallbackSize: 6,
  },
};

export function StoreCursorShader({ niche }: { niche: StoreNiche }) {
  const ref = useRef<HTMLDivElement>(null);
  const { capabilities } = useCinematicMotion();
  const palette = PALETTES[niche];

  useEffect(() => {
    const container = ref.current;
    if (!container || !capabilities.hydrated || !capabilities.precisePointer) return;

    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.45;
    let velocity = 0;
    let previousX = pointerX;
    let previousY = pointerY;
    let renderer: THREE.WebGLRenderer | null = null;
    let animationId = 0;

    const move = (x: number, y: number) => {
      const distance = Math.hypot(x - previousX, y - previousY);
      velocity = Math.min(1, distance / 70);
      pointerX = x;
      pointerY = y;
      previousX = x;
      previousY = y;
      container.style.setProperty("--cursor-x", `${x}px`);
      container.style.setProperty("--cursor-y", `${y}px`);
    };
    const onPointerMove = (event: PointerEvent) => move(event.clientX, event.clientY);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    move(pointerX, pointerY);

    if (!capabilities.allow3D) {
      return () => window.removeEventListener("pointermove", onPointerMove);
    }

    const vertexShader = `
      void main() { gl_Position = vec4(position, 1.0); }
    `;
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform vec2 pointer;
      uniform float time;
      uniform float velocity;
      uniform float falloff;
      uniform vec3 colorA;
      uniform vec3 colorB;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      void main() {
        vec2 safe = max(resolution, vec2(1.0));
        vec2 uv = gl_FragCoord.xy / safe;
        vec2 p = pointer;
        vec2 aspect = vec2(safe.x / safe.y, 1.0);
        float distanceToPointer = length((uv - p) * aspect);
        float ring = sin(distanceToPointer * 54.0 - time * (2.0 + velocity * 5.0));
        float halo = exp(-distanceToPointer * (falloff - velocity * 1.2));
        float sparks = smoothstep(.93, 1.0, sin((uv.x + uv.y) * 72.0 + time * 2.4 + hash(floor(uv * 36.0)) * 6.0));
        float energy = halo * (.28 + .18 * ring + velocity * .34) + sparks * halo * .16;
        vec3 color = mix(colorA, colorB, .5 + .5 * sin(time * .7 + distanceToPointer * 18.0));
        float alpha = clamp(energy, 0.0, .36);
        gl_FragColor = vec4(color * (energy * 1.45), alpha);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      resolution: { value: new THREE.Vector2(1, 1) },
      pointer: { value: new THREE.Vector2(0.5, 0.55) },
      time: { value: 0 },
      velocity: { value: 0 },
      falloff: { value: palette.falloff },
      colorA: { value: new THREE.Color(palette.a) },
      colorB: { value: new THREE.Color(palette.b) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Mesh(geometry, material));

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      geometry.dispose();
      material.dispose();
      return () => window.removeEventListener("pointermove", onPointerMove);
    }

    renderer.setPixelRatio(Math.min(capabilities.dpr, 1.5));
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const resize = () => {
      if (!renderer) return;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    let lastFrame = 0;
    const render = (timestamp = 0) => {
      if (!renderer) return;
      if (timestamp - lastFrame >= 30) {
        lastFrame = timestamp;
        uniforms.time.value += 0.032;
        uniforms.velocity.value += (velocity - uniforms.velocity.value) * 0.12;
        velocity *= 0.86;
        uniforms.pointer.value.set(pointerX / window.innerWidth, 1 - pointerY / window.innerHeight);
        renderer.render(scene, camera);
      }
      animationId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(animationId);
      observer.disconnect();
      if (renderer?.domElement.parentElement === container)
        container.removeChild(renderer.domElement);
      renderer?.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [
    capabilities.allow3D,
    capabilities.dpr,
    capabilities.hydrated,
    capabilities.precisePointer,
    palette.a,
    palette.b,
    palette.falloff,
  ]);

  return (
    <div
      ref={ref}
      data-testid="store-cursor-shader"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[35] hidden overflow-hidden mix-blend-screen sm:block motion-reduce:hidden"
    >
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          width: `${palette.fallbackSize}rem`,
          height: `${palette.fallbackSize}rem`,
          left: "var(--cursor-x, 50vw)",
          top: "var(--cursor-y, 45vh)",
          background: `radial-gradient(circle, ${palette.fallback}, transparent 68%)`,
        }}
      />
    </div>
  );
}
