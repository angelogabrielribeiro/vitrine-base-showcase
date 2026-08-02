import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useCinematicMotion } from "@/components/motion/cinematic-motion-system";

type TechnologyShaderProps = {
  className?: string;
};

/**
 * Campo de energia da NovaCore.
 *
 * A referência original do 21st.dev foi reduzida para uma paleta ciano/violeta,
 * ganhou limite de DPR, pausa fora da tela e fallback para movimento reduzido.
 */
export function TechnologyShader({ className }: TechnologyShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { capabilities } = useCinematicMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !capabilities.hydrated || !capabilities.allow3D) return;

    let animationId = 0;
    let visible = true;
    let renderer: THREE.WebGLRenderer | null = null;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      vec3 novaPalette(float value) {
        vec3 midnight = vec3(0.015, 0.025, 0.09);
        vec3 electricBlue = vec3(0.05, 0.55, 1.0);
        vec3 cyan = vec3(0.2, 1.0, 0.94);
        vec3 violet = vec3(0.57, 0.22, 1.0);

        vec3 color = mix(midnight, electricBlue, smoothstep(0.05, 0.42, value));
        color = mix(color, cyan, smoothstep(0.42, 0.68, value));
        color = mix(color, violet, smoothstep(0.68, 1.0, value));
        return color;
      }

      void main() {
        vec2 safeResolution = max(resolution, vec2(1.0));
        vec2 uv = (gl_FragCoord.xy * 2.0 - safeResolution.xy)
          / min(safeResolution.x, safeResolution.y);

        uv.x += 0.42;
        float radius = length(uv);
        float angle = atan(uv.y, uv.x);
        float t = time * 0.08;
        float energy = 0.0;

        for (int i = 0; i < 6; i++) {
          float fi = float(i);
          float spiral = radius * (2.1 + fi * 0.08) + angle * 0.58;
          float wave = fract(t + fi * 0.045) * 5.2 - spiral;
          float interference = mod(uv.x - uv.y + fi * 0.035, 0.22);
          energy += (0.004 + fi * fi * 0.0007)
            / max(abs(wave + interference), 0.018);
        }

        float pulse = 0.76 + 0.24 * sin(time * 0.22 + radius * 5.0);
        float normalized = clamp(energy * 0.28, 0.0, 1.0);
        vec3 color = novaPalette(normalized) * energy * pulse;

        float vignette = smoothstep(1.7, 0.18, radius);
        color *= mix(0.16, 1.0, vignette);
        gl_FragColor = vec4(color, clamp(energy * 0.72, 0.0, 0.88));
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time: { value: 1 },
      resolution: { value: new THREE.Vector2(1, 1) },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      geometry.dispose();
      material.dispose();
      return;
    }

    renderer.setPixelRatio(capabilities.dpr);
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

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !animationId) {
        animationId = window.requestAnimationFrame(render);
      }
    });
    intersectionObserver.observe(container);
    resize();

    function render() {
      if (!renderer || !visible || document.hidden) {
        animationId = 0;
        return;
      }
      uniforms.time.value += 0.045;
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(render);
    }
    animationId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (renderer?.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [capabilities.allow3D, capabilities.dpr, capabilities.hydrated]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{
        background:
          "radial-gradient(circle at 72% 40%, rgba(40, 108, 255, 0.18), transparent 42%), #050714",
      }}
    />
  );
}
