import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Code2,
  ExternalLink,
  Gauge,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { CursorParallax, useCinematicMotion } from "@/components/motion/cinematic-motion-system";

const PROPOSAL_URL = "https://www.instagram.com/angelo.sem.acento/";

type CreationPlan = {
  name: string;
  eyebrow: string;
  description: string;
  price: string;
  prefix?: string;
  features: string[];
  popular?: boolean;
};

type MaintenancePlan = {
  name: string;
  price: string;
  hours: string;
  description: string;
  features: string[];
  popular?: boolean;
};

const CREATION_PLANS: CreationPlan[] = [
  {
    name: "Essencial",
    eyebrow: "Começar com estrutura",
    description:
      "Para uma operação direta, com uma unidade, catálogo menor e tudo o que precisa para funcionar bem.",
    price: "1.190",
    features: [
      "Identidade visual adaptada ao negócio",
      "Site responsivo para celular e computador",
      "Painel e catálogo quando aplicáveis",
      "WhatsApp, pedidos e pagamento conforme escopo",
      "Até 2 rodadas de ajustes",
    ],
  },
  {
    name: "Recomendado",
    eyebrow: "Equilíbrio para crescer",
    description:
      "Mais profundidade visual, conteúdo e controle para transformar o site em uma operação comercial completa.",
    price: "1.590",
    features: [
      "Tudo do plano Essencial",
      "Mais páginas, seções e produtos",
      "Personalização visual aprofundada",
      "Painel e fluxos mais completos",
      "Até 3 rodadas de ajustes",
    ],
    popular: true,
  },
  {
    name: "Premium",
    eyebrow: "Operações avançadas",
    description:
      "Para múltiplas unidades, agendamento próprio, perfis de acesso e integrações que exigem projeto dedicado.",
    prefix: "A partir de",
    price: "2.190",
    features: [
      "Tudo do plano Recomendado",
      "Múltiplas unidades ou profissionais",
      "Agendamento e regras personalizadas",
      "Perfis de acesso e integrações adicionais",
      "Componentes e movimento exclusivos",
    ],
  },
];

const MAINTENANCE_PLANS: MaintenancePlan[] = [
  {
    name: "Base",
    price: "179",
    hours: "1 hora por mês",
    description: "Para manter a operação acompanhada e resolver solicitações pontuais.",
    features: [
      "Gestão e manutenção técnica",
      "Monitoramento e acompanhamento de backups",
      "Atualizações e pequenos ajustes",
    ],
  },
  {
    name: "Evolução",
    price: "279",
    hours: "2 horas por mês",
    description: "Para negócios que atualizam conteúdo e precisam de acompanhamento mais próximo.",
    features: [
      "Tudo do plano Base",
      "Mais tempo para suporte e ajustes",
      "Relatório mensal de utilização",
    ],
    popular: true,
  },
  {
    name: "Prioridade",
    price: "449",
    hours: "3 horas por mês",
    description: "Para operações mais críticas, com maior frequência de solicitações.",
    features: [
      "Tudo do plano Base",
      "Atendimento prioritário em horário comercial",
      "Maior franquia para suporte e ajustes",
    ],
  },
];

function formatPrice(price: string) {
  return (
    <>
      <span className="text-base font-semibold text-white/55">R$</span>
      <span>{price}</span>
    </>
  );
}

function usePricingCardMotion() {
  const { capabilities } = useCinematicMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [4.5, -4.5]), {
    stiffness: 220,
    damping: 24,
    mass: 0.35,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5.5, 5.5]), {
    stiffness: 220,
    damping: 24,
    mass: 0.35,
  });
  const glowX = useTransform(pointerX, [-0.5, 0.5], ["18%", "82%"]);
  const glowY = useTransform(pointerY, [-0.5, 0.5], ["18%", "82%"]);
  const tiltEnabled =
    capabilities.hydrated &&
    capabilities.precisePointer &&
    !capabilities.reducedMotion &&
    capabilities.quality !== "static";
  const ambientEnabled =
    capabilities.hydrated &&
    !capabilities.reducedMotion &&
    capabilities.quality !== "static" &&
    capabilities.quality !== "economy";

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!tiltEnabled) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5);
    pointerY.set((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return {
    ambientEnabled,
    capabilities,
    glowX,
    glowY,
    onPointerLeave,
    onPointerMove,
    rotateX,
    rotateY,
    tiltEnabled,
  };
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { capabilities } = useCinematicMotion();

  return (
    <motion.div
      initial={capabilities.reducedMotion ? false : { opacity: 0, y: 26, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProposalLink({
  className,
  label = "Solicitar proposta",
}: {
  className: string;
  label?: string;
}) {
  return (
    <a
      href={PROPOSAL_URL}
      target="_blank"
      rel="noreferrer"
      className={className}
      aria-label={label.includes("Instagram") ? label : `${label} pelo Instagram`}
    >
      {label}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function PricingShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { capabilities } = useCinematicMotion();

  useEffect(() => {
    if (!capabilities.allow3D || capabilities.reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vertexSource = `
      attribute vec2 aPosition;
      void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
    `;
    const fragmentSource = `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uResolution;

      float ring(vec2 point, float radius, float width) {
        float wave = sin(atan(point.y, point.x) * 8.0 + uTime * 0.75) * 0.008;
        return smoothstep(width, 0.0, abs(length(point) - radius - wave));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
        float breathing = sin(uTime * 0.38) * 0.012;
        float halo = ring(uv, 0.58 + breathing, 0.035);
        halo += ring(uv, 0.67 - breathing * 0.45, 0.008) * 0.7;
        halo += ring(uv, 0.535 + breathing * 0.3, 0.004) * 0.45;
        float glow = exp(-2.8 * length(uv - vec2(-0.8, 0.55)));
        float angle = atan(uv.y, uv.x);
        float shimmer = 0.72 + sin(angle * 2.0 - uTime * 0.55) * 0.28;
        vec3 base = vec3(0.018, 0.027, 0.043);
        vec3 cyan = vec3(0.13, 0.82, 0.91);
        vec3 blue = vec3(0.18, 0.38, 0.96);
        vec3 amber = vec3(0.96, 0.69, 0.22);
        vec3 ringColor = mix(cyan, blue, 0.28 + shimmer * 0.2);
        vec3 color = base + ringColor * halo * (0.25 + shimmer * 0.11) + amber * glow * 0.07;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "uTime");
    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    let animationFrame = 0;
    let visible = !document.hidden;

    const resize = () => {
      const dpr = capabilities.dpr;
      const width = Math.max(1, Math.floor(window.innerWidth * dpr));
      const height = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (time: number) => {
      resize();
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = visible ? window.requestAnimationFrame(render) : 0;
    };

    const onVisibilityChange = () => {
      visible = !document.hidden;
      if (visible && !animationFrame) animationFrame = window.requestAnimationFrame(render);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [capabilities.allow3D, capabilities.dpr, capabilities.reducedMotion]);

  if (!capabilities.allow3D || capabilities.reducedMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 aspect-square w-[min(120vw,52rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20 shadow-[0_0_70px_rgba(34,211,238,0.14),inset_0_0_50px_rgba(59,130,246,0.08)] sm:w-[min(82vw,52rem)]" />
        <span className="absolute left-1/2 top-1/2 aspect-square w-[min(106vw,46rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10 shadow-[0_0_36px_rgba(34,211,238,0.08)] sm:w-[min(72vw,46rem)]" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
      aria-hidden="true"
    />
  );
}

function CreationCard({ plan, index }: { plan: CreationPlan; index: number }) {
  const motionState = usePricingCardMotion();

  return (
    <motion.article
      onPointerMove={motionState.onPointerMove}
      onPointerLeave={motionState.onPointerLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={motionState.tiltEnabled ? { scale: 1.018, y: -7 } : undefined}
      viewport={{ once: true, margin: "-10%" }}
      animate={
        motionState.ambientEnabled
          ? {
              boxShadow: plan.popular
                ? [
                    "0 30px 90px rgba(34,211,238,0.10)",
                    "0 34px 115px rgba(34,211,238,0.22)",
                    "0 30px 90px rgba(34,211,238,0.10)",
                  ]
                : [
                    "0 24px 70px rgba(0,0,0,0.22)",
                    "0 30px 90px rgba(34,211,238,0.08)",
                    "0 24px 70px rgba(0,0,0,0.22)",
                  ],
            }
          : undefined
      }
      transition={{
        opacity: { duration: 0.58, delay: index * 0.1 },
        y: { duration: 0.58, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] },
        scale: { type: "spring", stiffness: 260, damping: 24 },
        rotateX: { type: "spring", stiffness: 220, damping: 24 },
        rotateY: { type: "spring", stiffness: 220, damping: 24 },
        boxShadow: {
          duration: 4.8 + index * 0.45,
          delay: index * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      style={
        motionState.tiltEnabled
          ? {
              rotateX: motionState.rotateX,
              rotateY: motionState.rotateY,
              transformPerspective: 1100,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      className={[
        "group relative isolate flex min-h-[540px] flex-col overflow-hidden rounded-[1.75rem] border px-6 py-7 backdrop-blur-2xl sm:px-7",
        plan.popular
          ? "border-cyan-300/40 bg-gradient-to-b from-white/[0.16] to-white/[0.07] shadow-[0_30px_100px_rgba(34,211,238,0.12)] lg:-mt-5 lg:mb-5"
          : "border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.035] shadow-2xl shadow-black/25",
      ].join(" ")}
    >
      <motion.div
        className="pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/15 blur-3xl"
        style={{ left: motionState.glowX, top: motionState.glowY }}
        animate={motionState.ambientEnabled ? { opacity: [0.16, 0.42, 0.16] } : { opacity: 0.14 }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-px origin-center",
          plan.popular
            ? "bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
            : "bg-gradient-to-r from-transparent via-white/30 to-transparent",
        ].join(" ")}
        animate={
          motionState.ambientEnabled
            ? { opacity: [0.35, 1, 0.35], scaleX: [0.32, 1, 0.32] }
            : undefined
        }
        transition={{ duration: 4.1 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      {plan.popular && (
        <motion.span
          className="absolute right-5 top-5 rounded-full border border-cyan-200/30 bg-cyan-300 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-950"
          animate={
            motionState.ambientEnabled
              ? {
                  boxShadow: [
                    "0 0 0 rgba(34,211,238,0)",
                    "0 0 30px rgba(34,211,238,.42)",
                    "0 0 0 rgba(34,211,238,0)",
                  ],
                }
              : undefined
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Mais escolhido
        </motion.span>
      )}

      <div className="pr-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
          {plan.eyebrow}
        </p>
        <h3 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] text-white">
          {plan.name}
        </h3>
      </div>
      <p className="mt-4 min-h-[72px] text-sm leading-6 text-white/62">{plan.description}</p>

      <div className="my-7 border-y border-white/10 py-6">
        {plan.prefix && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
            {plan.prefix}
          </p>
        )}
        <div className="flex items-baseline gap-2 font-display text-5xl font-light tracking-[-0.05em] text-white">
          {formatPrice(plan.price)}
        </div>
        <p className="mt-2 text-xs text-white/45">50% para iniciar · 50% antes da publicação</p>
      </div>

      <ul className="space-y-3 text-sm text-white/78">
        {plan.features.map((feature, featureIndex) => (
          <motion.li
            key={feature}
            className="flex items-start gap-3"
            initial={motionState.capabilities.reducedMotion ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.34, delay: index * 0.08 + featureIndex * 0.045 }}
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-cyan-200 transition group-hover:border-cyan-200/45 group-hover:bg-cyan-300/15">
              <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
            </span>
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>

      <ProposalLink
        className={[
          "mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200",
          plan.popular
            ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            : "border border-white/15 bg-white/[0.06] text-white hover:border-cyan-300/40 hover:bg-cyan-300/10",
        ].join(" ")}
      />
    </motion.article>
  );
}

function MaintenanceCard({ plan, index }: { plan: MaintenancePlan; index: number }) {
  const motionState = usePricingCardMotion();

  return (
    <motion.article
      onPointerMove={motionState.onPointerMove}
      onPointerLeave={motionState.onPointerLeave}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={motionState.tiltEnabled ? { y: -7, scale: 1.012 } : undefined}
      animate={
        motionState.ambientEnabled && plan.popular
          ? {
              borderColor: [
                "rgba(252, 211, 77, 0.35)",
                "rgba(252, 211, 77, 0.56)",
                "rgba(252, 211, 77, 0.35)",
              ],
            }
          : undefined
      }
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        opacity: { duration: 0.45, delay: index * 0.06 },
        y: { type: "spring", stiffness: 240, damping: 24, delay: index * 0.06 },
        scale: { type: "spring", stiffness: 260, damping: 22 },
        borderColor: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
      }}
      style={{
        rotateX: motionState.rotateX,
        rotateY: motionState.rotateY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      className={[
        "group relative isolate overflow-hidden rounded-3xl border p-6 backdrop-blur-xl will-change-transform",
        plan.popular
          ? "border-amber-300/35 bg-amber-200/[0.08]"
          : "border-white/10 bg-white/[0.045]",
      ].join(" ")}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ left: motionState.glowX, top: motionState.glowY }}
      />
      {plan.popular && (
        <span className="absolute right-5 top-5 rounded-full border border-amber-200/25 bg-amber-300/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-200">
          Equilíbrio
        </span>
      )}
      <h3 className="font-display text-3xl font-light text-white">{plan.name}</h3>
      <p className="mt-2 min-h-[48px] max-w-sm text-sm leading-6 text-white/58">
        {plan.description}
      </p>
      <div className="mt-6 flex items-end justify-between gap-3 border-y border-white/10 py-5">
        <div>
          <p className="font-display text-4xl font-light tracking-[-0.04em] text-white">
            {formatPrice(plan.price)}
          </p>
          <p className="mt-1 text-xs text-white/45">por mês</p>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/70">
          {plan.hours}
        </span>
      </div>
      <ul className="mt-5 space-y-3 text-sm text-white/72">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function PricingPreview() {
  const { capabilities } = useCinematicMotion();

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#071018]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_15%_90%,rgba(251,191,36,0.1),transparent_32%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Investimento transparente
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-light tracking-[-0.035em] text-white sm:text-5xl">
              Um ponto de partida claro. O escopo final continua sendo seu.
            </h2>
          </div>
          <Link
            to="/planos"
            className="inline-flex items-center gap-2 self-start rounded-full border border-cyan-200/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 md:self-auto"
          >
            Comparar todos os planos <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {CREATION_PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={capabilities.reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={
                capabilities.precisePointer && !capabilities.reducedMotion
                  ? { y: -6, scale: 1.012 }
                  : undefined
              }
              animate={
                plan.popular &&
                capabilities.hydrated &&
                !capabilities.reducedMotion &&
                capabilities.quality !== "static"
                  ? {
                      boxShadow: [
                        "0 18px 55px rgba(34,211,238,0.05)",
                        "0 24px 75px rgba(34,211,238,0.16)",
                        "0 18px 55px rgba(34,211,238,0.05)",
                      ],
                    }
                  : undefined
              }
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                opacity: { duration: 0.48, delay: index * 0.08 },
                y: { duration: 0.48, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
                scale: { type: "spring", stiffness: 260, damping: 22 },
                boxShadow: { duration: 4.4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="rounded-2xl"
            >
              <Link
                to="/planos"
                className={[
                  "group relative block h-full overflow-hidden rounded-2xl border p-5 transition",
                  plan.popular
                    ? "border-cyan-300/35 bg-cyan-300/[0.09]"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-t from-cyan-300/10 to-transparent transition-transform duration-500 ease-out group-hover:translate-y-0"
                />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="font-display text-2xl text-white">{plan.name}</span>
                  {plan.popular && (
                    <motion.span
                      className="rounded-full bg-cyan-300 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-950"
                      animate={
                        capabilities.reducedMotion
                          ? undefined
                          : {
                              boxShadow: [
                                "0 0 0 rgba(34,211,238,0)",
                                "0 0 24px rgba(34,211,238,.35)",
                                "0 0 0 rgba(34,211,238,0)",
                              ],
                            }
                      }
                      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      Mais escolhido
                    </motion.span>
                  )}
                </div>
                <p className="relative mt-5 text-xs uppercase tracking-[0.16em] text-white/45">
                  {plan.prefix ?? "Projeto completo"}
                </p>
                <p className="relative mt-1 font-display text-4xl font-light tracking-[-0.04em] text-white">
                  {formatPrice(plan.price)}
                </p>
                <p className="relative mt-4 flex items-center gap-2 text-sm text-white/60 transition group-hover:text-white/85">
                  Ver detalhes{" "}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-xs leading-5 text-white/45">
          Condição de lançamento para os três primeiros projetos. Domínio, hospedagem, banco de
          dados, gateway e licenças externas são contratados separadamente.
        </p>
      </div>
    </section>
  );
}

export function PricingPage() {
  const { capabilities } = useCinematicMotion();

  return (
    <div className="min-h-screen overflow-x-clip bg-[#05070a] text-white">
      <PricingShader />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_var(--cinematic-pointer-x)_var(--cinematic-pointer-y),rgba(34,211,238,0.09),transparent_25%),radial-gradient(circle_at_10%_70%,rgba(251,191,36,0.07),transparent_28%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070a]/75 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link
            to="/"
            className="font-semibold tracking-[0.22em] text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
          >
            VITRINE BASE
          </Link>
          <nav
            className="hidden items-center gap-6 text-xs text-white/58 sm:flex"
            aria-label="Planos"
          >
            <a href="#criacao" className="transition hover:text-white">
              Criação
            </a>
            <a href="#manutencao" className="transition hover:text-white">
              Manutenção
            </a>
            <a href="#custos-externos" className="transition hover:text-white">
              Custos externos
            </a>
          </nav>
          <ProposalLink
            label="Falar sobre meu projeto"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
          />
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex min-h-[76svh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center">
          <CursorParallax strengthX={8} strengthY={6} className="flex w-full flex-col items-center">
            <motion.p
              initial={capabilities.reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-full border border-amber-200/20 bg-amber-300/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-200"
            >
              Condição de lançamento · 3 primeiros projetos
            </motion.p>
            <motion.h1
              initial={capabilities.reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-7 max-w-5xl bg-gradient-to-r from-white via-cyan-100 to-amber-200 bg-clip-text font-display text-5xl font-light leading-[0.96] tracking-[-0.055em] text-transparent sm:text-7xl lg:text-[6.2rem]"
            >
              O plano certo para transformar sua operação em presença digital.
            </motion.h1>
            <motion.p
              initial={capabilities.reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-7 max-w-2xl text-base leading-7 text-white/62 sm:text-lg"
            >
              Todos os planos entregam um site profissional e funcional. O que muda é a profundidade
              do design, do conteúdo e dos fluxos do seu negócio.
            </motion.p>
            <motion.div
              initial={capabilities.reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-9 flex flex-wrap justify-center gap-3"
            >
              <a
                href="#criacao"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Comparar investimentos <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                to="/"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Ver demonstrações
              </Link>
            </motion.div>
          </CursorParallax>
        </section>

        <section id="criacao" className="scroll-mt-24 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">
                Criação do site
              </p>
              <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-6xl">
                Escolha pela complexidade, não pela qualidade.
              </h2>
              <p className="mt-5 text-sm leading-6 text-white/56 sm:text-base">
                Banco, painel, WhatsApp e pagamentos entram quando fazem sentido para a operação. O
                plano define o tamanho e a profundidade do projeto.
              </p>
            </Reveal>

            <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
              {CREATION_PLANS.map((plan, index) => (
                <CreationCard key={plan.name} plan={plan} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/20 px-4 py-16">
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Code2,
                title: "Projeto adaptado",
                text: "A base técnica é reaproveitada; a experiência visual é construída para o negócio.",
              },
              {
                icon: ShieldCheck,
                title: "Entrega funcional",
                text: "O plano de entrada não é um site incompleto ou uma amostra sem operação.",
              },
              {
                icon: Gauge,
                title: "Escopo controlado",
                text: "Quantidades, integrações e prazos são definidos antes do desenvolvimento.",
              },
              {
                icon: Sparkles,
                title: "Evolução possível",
                text: "Novas páginas e funcionalidades podem ser contratadas conforme o negócio cresce.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={capabilities.reducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={
                  capabilities.precisePointer && !capabilities.reducedMotion
                    ? { y: -5, borderColor: "rgba(103, 232, 249, 0.25)" }
                    : undefined
                }
                viewport={{ once: true, margin: "-8%" }}
                transition={{
                  opacity: { duration: 0.45, delay: index * 0.06 },
                  y: { duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] },
                  borderColor: { duration: 0.25 },
                }}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-shadow hover:shadow-[0_18px_55px_rgba(34,211,238,0.08)]"
              >
                <item.icon className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/52">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="manutencao" className="scroll-mt-24 px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-200">
                  Depois da publicação
                </p>
                <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-6xl">
                  Manutenção com tempo visível e regra clara.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-white/55">
                O cliente recebe relatório de utilização. Erros reproduzíveis causados pela
                implementação não consomem a franquia de suporte.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {MAINTENANCE_PLANS.map((plan, index) => (
                <MaintenanceCard key={plan.name} plan={plan} index={index} />
              ))}
            </div>

            <div className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:grid-cols-3">
              <div className="flex gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold">Blocos de 15 minutos</h3>
                  <p className="mt-1 text-sm leading-6 text-white/52">
                    Só o tempo efetivamente trabalhado entra no relatório.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold">R$ 100 por hora excedente</h3>
                  <p className="mt-1 text-sm leading-6 text-white/52">
                    Executada somente após autorização do cliente.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <ServerCog className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold">Horas não acumulam</h3>
                  <p className="mt-1 text-sm leading-6 text-white/52">
                    Novas páginas e funcionalidades recebem orçamento próprio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="custos-externos"
          className="scroll-mt-24 border-y border-white/10 bg-[#071018] px-4 py-24"
        >
          <Reveal className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">
                Sem custo escondido
              </p>
              <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.04em] sm:text-5xl">
                Serviço técnico e ferramentas são cobranças diferentes.
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/58">
                Sempre que possível, as contas externas ficam no nome e no cartão do cliente. Você
                mantém a propriedade dos seus acessos e sabe exatamente quanto cada fornecedor
                cobra.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
                <h3 className="font-display text-2xl text-cyan-100">O que a Vitrine Base cobra</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-white/68">
                  {[
                    "Planejamento, design e desenvolvimento",
                    "Configuração e publicação",
                    "Gestão técnica e suporte contratado",
                    "Manutenção e pequenos ajustes",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.055] p-6">
                <h3 className="font-display text-2xl text-amber-100">
                  O que o cliente paga direto
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-white/68">
                  {[
                    "Domínio, hospedagem e banco de dados",
                    "Gateway e taxas de pagamento",
                    "E-mail, APIs e comunicações pagas",
                    "Licenças e consumo excedente",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-amber-200" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="px-4 py-24">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-200">
              Próximo passo
            </p>
            <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.045em] sm:text-6xl">
              Conte o que seu negócio precisa. A proposta fecha o escopo.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/56 sm:text-base">
              Não existe compra automática. Antes de começar, alinhamos páginas, produtos,
              integrações, prazo e custos externos.
            </p>
            <ProposalLink
              label="Solicitar proposta no Instagram"
              className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            />
          </Reveal>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <span>Vitrine Base · sites e webapps para negócios locais</span>
          <span>Valores sujeitos ao escopo aprovado em proposta.</span>
        </div>
      </footer>
    </div>
  );
}
