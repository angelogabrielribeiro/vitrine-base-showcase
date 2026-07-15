import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Utensils, Store, Sparkles, ShieldCheck, MessageCircle, Smartphone } from "lucide-react";
import { STORES } from "@/config/stores";
import { DEMO_LABEL } from "@/lib/demo-mode";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitrine Base — E-commerce White Label" },
      {
        name: "description",
        content:
          "Plataforma white-label pronta para apresentação: 3 lojas demonstrativas (moda, mercearia e restaurante) com catálogo, carrinho, checkout e painel administrativo.",
      },
      { property: "og:title", content: "Vitrine Base — E-commerce White Label" },
      {
        property: "og:description",
        content:
          "Uma base sólida e reutilizável de e-commerce, com 3 lojas de demonstração e painel administrativo completo.",
      },
    ],
  }),
  component: Index,
});

const NICHE_ICON: Record<string, typeof ShoppingBag> = {
  fashion: ShoppingBag,
  grocery: Store,
  restaurant: Utensils,
};

const FEATURES = [
  { icon: Smartphone, title: "Loja virtual responsiva", desc: "Mobile-first, rápida e acessível." },
  { icon: ShoppingBag, title: "Produtos e estoque", desc: "Catálogo com variantes, adicionais e imagens." },
  { icon: ShoppingBag, title: "Carrinho persistente", desc: "Salvo por loja no navegador do cliente." },
  { icon: ShieldCheck, title: "Checkout completo", desc: "Pix, cartão, dinheiro e cupom demonstrativo." },
  { icon: Sparkles, title: "Painel administrativo", desc: "Produtos, pedidos e configurações em tempo real." },
  { icon: MessageCircle, title: "Integração WhatsApp", desc: "Contato e pós-venda direto pelo aplicativo." },
];

function Index() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.15),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
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
            Escolha uma das três lojas demonstrativas abaixo. Todas rodam sobre o mesmo núcleo,
            adaptado visual e comercialmente para o segmento do cliente.
          </motion.p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STORES.map((s, i) => {
              const Icon = NICHE_ICON[s.niche];
              return (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    to="/demo/$storeSlug"
                    params={{ storeSlug: s.slug }}
                    className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/[0.06]"
                  >
                    <div
                      className="mb-6 aspect-[4/3] w-full rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${s.banners[0]?.image})` }}
                    />
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300">
                      <Icon className="h-4 w-4" />
                      {s.tagline}
                    </div>
                    <h3 className="mt-2 text-2xl font-semibold">{s.name}</h3>
                    <p className="mt-2 text-sm text-neutral-300">{s.description}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-300">
                      Abrir demonstração
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
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
