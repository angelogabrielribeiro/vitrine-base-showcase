import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, ShoppingBag, Utensils, Scissors, Sparkles, ShieldCheck,
  MessageCircle, Smartphone, LayoutDashboard, CalendarDays, Cpu,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { STORES } from "@/config/stores";
import { DEMO_LABEL } from "@/lib/demo-mode";
import { AnimatedGradient } from "@/components/effects/AnimatedGradient";
import { PulsingBorder } from "@/components/effects/PulsingBorder";
import { InteractiveTiltCard } from "@/components/effects/InteractiveTiltCard";
import { InteractiveProductFolder } from "@/components/effects/InteractiveProductFolder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitrine Base — E-commerce White Label" },
      {
        name: "description",
        content:
          "Plataforma white-label pronta para apresentação: 4 lojas demonstrativas (moda, barbearia, restaurante e eletrônicos) com catálogo, agendamento, checkout e painel administrativo.",
      },
      { property: "og:title", content: "Vitrine Base — E-commerce White Label" },
      {
        property: "og:description",
        content:
          "Base sólida e reutilizável de e-commerce, com 4 lojas de demonstração (moda, barbearia, restaurante e eletrônicos) e painel administrativo completo.",
      },
    ],
  }),
  component: Index,
});

const NICHE_ICON: Record<string, typeof ShoppingBag> = {
  fashion: ShoppingBag,
  barber: Scissors,
  restaurant: Utensils,
  electronics: Cpu,
};

const FEATURES = [
  { icon: Smartphone, title: "Loja virtual responsiva", desc: "Mobile-first, rápida e acessível." },
  { icon: ShoppingBag, title: "Produtos e estoque", desc: "Catálogo com variantes, adicionais e imagens." },
  { icon: CalendarDays, title: "Agendamento online", desc: "Serviço, profissional, data e horário." },
  { icon: ShieldCheck, title: "Checkout completo", desc: "Pix, cartão, dinheiro e cupom demonstrativo." },
  { icon: Sparkles, title: "Painel administrativo", desc: "Produtos, pedidos e configurações em tempo real." },
  { icon: MessageCircle, title: "Integração WhatsApp", desc: "Contato e pós-venda direto pelo aplicativo." },
];

function Index() {
  const [ready, setReady] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>(STORES[0]?.slug ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("vb-preloaded") === "1") {
        setReady(true);
        return;
      }
      sessionStorage.setItem("vb-preloaded", "1");
    } catch { setReady(true); return; }
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const selected = useMemo(
    () => STORES.find((s) => s.slug === selectedSlug) ?? STORES[0],
    [selectedSlug],
  );

  const folderItems = useMemo(
    () => STORES.flatMap((s) =>
      s.banners.map((b) => ({ title: s.name, subtitle: s.tagline, image: b.image })),
    ),
    [],
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-neutral-950"
          >
            <div className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full border-2 border-amber-300/30 border-t-amber-300 animate-spin" />
              <div className="mt-4 font-semibold tracking-[0.35em] text-amber-300 text-xs">VITRINE BASE</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs">
          <span className="font-semibold tracking-widest text-amber-300">VITRINE BASE</span>
          <span className="rounded-full border border-amber-300/40 px-2 py-0.5 text-[10px] text-amber-200">
            {DEMO_LABEL}
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <AnimatedGradient
          colors={["#f59e0b", "#a855f7", "#0ea5e9"]}
          intensity={0.35}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300"
          >
            Apresentação comercial
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 text-4xl font-bold leading-tight sm:text-6xl"
          >
            Um e-commerce sólido, <span className="text-amber-300">personalizado</span> para cada lojista.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-2xl text-base text-neutral-300 sm:text-lg"
          >
            Quatro lojas demonstrativas — moda, barbearia, restaurante e eletrônicos — sobre o
            mesmo núcleo, adaptadas visual e comercialmente ao segmento de cada lojista.
          </motion.p>

          {/* Seletor interativo */}
          <div className="mt-10 flex flex-wrap gap-2">
            {STORES.map((s) => {
              const Icon = NICHE_ICON[s.niche] ?? ShoppingBag;
              const active = s.slug === selectedSlug;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setSelectedSlug(s.slug)}
                  className={
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition " +
                    (active
                      ? "border-amber-300 bg-amber-300 text-neutral-950"
                      : "border-white/15 text-neutral-200 hover:border-amber-300/50 hover:text-white")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {s.name}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
              <PulsingBorder color="rgba(251,191,36,0.55)" radius="1rem">
                <InteractiveTiltCard className="rounded-2xl">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                    <div
                      className="aspect-[16/9] w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${selected.banners[0]?.image})` }}
                    />
                    <div className="p-6">
                      <div className="text-xs uppercase tracking-widest text-amber-300">{selected.tagline}</div>
                      <h3 className="mt-2 font-display text-3xl">{selected.name}</h3>
                      <p className="mt-2 text-sm text-neutral-300">{selected.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                          to="/demo/$storeSlug"
                          params={{ storeSlug: selected.slug }}
                          className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:brightness-95"
                        >
                          Abrir demonstração <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                          to="/demo/$storeSlug/admin"
                          params={{ storeSlug: selected.slug }}
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-neutral-100 transition hover:border-amber-300/60"
                        >
                          <LayoutDashboard className="h-4 w-4" /> Ver painel
                        </Link>
                        {selected.niche === "barber" && (
                          <Link
                            to="/demo/$storeSlug/agendar"
                            params={{ storeSlug: selected.slug }}
                            className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 px-4 py-2 text-sm text-amber-200 transition hover:bg-amber-300/10"
                          >
                            <CalendarDays className="h-4 w-4" /> Agendar
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </InteractiveTiltCard>
              </PulsingBorder>

              <InteractiveProductFolder items={folderItems} label="Galeria das lojas" />
            </div>
          )}
        </div>
      </section>

      {/* Bento das demos */}
      <section className="border-t border-white/5 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-300">Demos</div>
              <h2 className="text-2xl font-semibold sm:text-3xl">Quatro lojas, um núcleo</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-6">
            {STORES.map((s, i) => {
              const Icon = NICHE_ICON[s.niche] ?? ShoppingBag;
              const spans = i === 0 ? "sm:col-span-6 lg:col-span-3" : "sm:col-span-3 lg:col-span-3";
              return (
                <InteractiveTiltCard key={s.slug} className={"rounded-2xl " + spans}>
                  <Link
                    to="/demo/$storeSlug"
                    params={{ storeSlug: s.slug }}
                    className="group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-neutral-900"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-70 transition group-hover:scale-105 group-hover:opacity-90"
                      style={{ backgroundImage: `url(${s.banners[0]?.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="relative p-5">
                      <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-amber-300">
                        <Icon className="h-3 w-3" /> {s.tagline}
                      </div>
                      <h3 className="mt-1 font-display text-2xl">{s.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-300">{s.description}</p>
                      <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-300">
                        Abrir <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </InteractiveTiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">O que está incluso</h2>
          <p className="mt-2 text-neutral-400">
            Um núcleo técnico compartilhado por todas as lojas, pronto para personalização.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <f.icon className="h-6 w-6 text-amber-300" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-neutral-500">
        Vitrine Base · Modelo demonstrativo · Nenhum pagamento é processado
      </footer>
    </div>
  );
}
