import { ArrowDownRight, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { openGeneralWhatsapp } from "../lib/whatsapp";

const vertexSource = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}`;

const fragmentSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 pointer;
#define FC gl_FragCoord.xy
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=0.,a=.5;mat2 m=mat2(1.2,-.5,.3,1.1);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
void main(){
  vec2 uv=(FC-.5*resolution)/min(resolution.x,resolution.y);
  vec2 p=uv*vec2(1.45,1.0);
  vec2 mp=(pointer-.5)*2.;
  float drift=time*.035;
  float n=fbm(p*1.4+vec2(drift,-drift*.5));
  float n2=fbm(p*2.8-vec2(drift*.7,drift));
  float lens=.34/(.16+length(p-mp*.18));
  float line=abs(sin((p.x+n*.28)*7.+time*.22))*0.5;
  vec3 deep=vec3(.018,.055,.073);
  vec3 cyan=vec3(.13,.68,.72);
  vec3 mineral=vec3(.22,.49,.38);
  vec3 amber=vec3(.65,.43,.20);
  vec3 col=deep;
  col+=cyan*(n*.36+n2*.11);
  col+=mineral*max(0.,n2-.52)*.55;
  col+=amber*pow(max(0.,1.-length(p-vec2(-.55,.25))),4.)*.34;
  col+=cyan*lens*.055;
  col+=cyan*(1.-line)*.018;
  float vignette=smoothstep(1.3,.25,length(uv));
  col*=mix(.34,1.,vignette);
  O=vec4(col,1.);
}`;

export function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "resolution");
    const time = gl.getUniformLocation(program, "time");
    const pointer = gl.getUniformLocation(program, "pointer");
    const pointerState = { x: .5, y: .5 };
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.35 : 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerState.x = (event.clientX - rect.left) / rect.width;
      pointerState.y = 1 - (event.clientY - rect.top) / rect.height;
    };

    const render = () => {
      resize();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, reduced ? 0 : (performance.now() - start) / 1000);
      gl.uniform2f(pointer, pointerState.x, pointerState.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced) raf = requestAnimationFrame(render);
    };

    canvas.addEventListener("pointermove", onPointer);
    window.addEventListener("resize", resize);
    render();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [reduced]);

  return (
    <section className="hero">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          Tecnologia · Finanças · Tributos
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .08, duration: .8, ease: [0.22, 1, 0.36, 1] }}
        >
          Problemas complexos.<br />
          <span>Atendimento direto.</span>
        </motion.h1>
        <motion.p
          className="hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .18, duration: .75 }}
        >
          Suporte tecnológico, manutenção, finanças e orientação contábil para quem precisa resolver com clareza em {siteConfig.locations[0]}, {siteConfig.locations[1]} e remotamente quando aplicável.
        </motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>
          <button className="primary-button" onClick={openGeneralWhatsapp}>
            <MessageCircle size={18} /> Solicitar atendimento
          </button>
          <Link className="ghost-button" to="/servicos">
            Conhecer serviços <ArrowDownRight size={18} />
          </Link>
        </motion.div>
      </div>
      <div className="hero-location">
        <span>Atendimento local</span>
        <strong>PA ↔ TO</strong>
        <small>+ suporte remoto</small>
      </div>
    </section>
  );
}
