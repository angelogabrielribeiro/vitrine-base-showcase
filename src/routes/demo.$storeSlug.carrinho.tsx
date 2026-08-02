import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { getStore } from "@/config/stores";
import { useCart } from "@/hooks/use-cart";
import { brl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { waStore } from "@/lib/whatsapp";
import { useHydrated } from "@/hooks/use-hydrated";
import { commerceSurface } from "@/components/storefront/commerce-surface";

export const Route = createFileRoute("/demo/$storeSlug/carrinho")({
  component: CartPage,
});

const ATMOSPHERES = {
  fashion:
    "radial-gradient(circle at 16% 10%, rgba(212,154,167,.3), transparent 28%), radial-gradient(circle at 88% 55%, rgba(201,154,85,.16), transparent 30%)",
  barber:
    "radial-gradient(circle at 16% 10%, rgba(244,200,102,.18), transparent 28%), radial-gradient(circle at 88% 55%, rgba(130,86,31,.12), transparent 30%)",
  restaurant:
    "radial-gradient(circle at 16% 10%, rgba(255,100,43,.3), transparent 28%), radial-gradient(circle at 88% 55%, rgba(255,189,74,.13), transparent 30%)",
  electronics:
    "radial-gradient(circle at 16% 10%, rgba(103,232,249,.22), transparent 28%), radial-gradient(circle at 88% 55%, rgba(139,92,246,.18), transparent 30%)",
} as const;

function CartPage() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const surface = commerceSurface(store.niche);
  const { items, subtotal, setQuantity, remove } = useCart(storeSlug);
  const hydrated = useHydrated();
  const reduced = useReducedMotion();
  const deliveryPreview = store.deliveryFee;

  if (!hydrated) {
    return (
      <div className={`grid min-h-[70svh] place-items-center ${surface.shell}`}>
        <span
          className={`animate-pulse text-xs uppercase tracking-[0.3em] ${surface.eyebrow}`}
        >
          Montando sua seleção…
        </span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main
        className={`relative grid min-h-[80svh] place-items-center overflow-hidden px-5 text-center ${surface.shell}`}
      >
        <div
          className="absolute inset-0"
          style={{ background: ATMOSPHERES[store.niche] }}
        />
        <motion.div
          aria-hidden="true"
          animate={
            reduced ? undefined : { rotate: 360, scale: [0.92, 1.08, 0.92] }
          }
          transition={{
            rotate: { duration: 18, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity },
          }}
          className={`absolute h-80 w-80 rounded-full border ${surface.border}`}
        />
        <div className="relative max-w-3xl">
          <ShoppingBag className={`mx-auto h-10 w-10 ${surface.eyebrow}`} />
          <h1 className="mt-7 font-sans text-5xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-7xl">
            O próximo objeto ainda não entrou em órbita.
          </h1>
          <p
            className={`mx-auto mt-6 max-w-xl text-base leading-8 ${surface.muted}`}
          >
            Explore o catálogo, interaja com os cards e traga uma peça para esta
            composição.
          </p>
          <Button
            asChild
            className={`mt-9 min-h-13 rounded-none px-7 ${surface.button}`}
          >
            <Link
              to="/demo/$storeSlug/produtos"
              params={{ storeSlug }}
              search={{ q: "", cat: "", sort: "" }}
            >
              Abrir catálogo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const total = subtotal + deliveryPreview;

  return (
    <main
      data-testid="premium-cart"
      className={`relative isolate min-h-screen overflow-hidden ${surface.shell}`}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: ATMOSPHERES[store.niche] }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:64px_64px]" />

      <section className={`border-b ${surface.border}`}>
        <div className="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.38em] ${surface.eyebrow}`}
              >
                <Sparkles className="mr-2 inline h-4 w-4" /> Seleção em
                movimento
              </p>
              <h1 className="mt-6 max-w-5xl font-sans text-[clamp(3.7rem,9vw,8.5rem)] font-semibold leading-[0.78] tracking-[-0.07em]">
                Seu carrinho agora tem presença.
              </h1>
            </div>
            <div className={`max-w-sm text-sm leading-7 ${surface.muted}`}>
              {items.length}{" "}
              {items.length === 1 ? "objeto ativo" : "objetos ativos"}.
              Quantidade, entrega e total respondem sem quebrar a atmosfera da
              loja.
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[92rem] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_26rem] lg:px-12 lg:py-20">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item, index) => (
              <motion.article
                layout
                key={item.key}
                initial={reduced ? false : { opacity: 0, y: 42, rotateX: -8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={
                  reduced ? undefined : { opacity: 0, x: -120, scale: 0.92 }
                }
                transition={{
                  duration: 0.62,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={reduced ? undefined : { x: 8, rotateY: -1.5 }}
                className={`group relative overflow-hidden border p-3 sm:p-4 ${surface.border} ${surface.panel}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.span
                  aria-hidden="true"
                  animate={
                    reduced
                      ? undefined
                      : {
                          opacity: [0.05, 0.24, 0.05],
                          x: ["-20%", "70%", "-20%"],
                        }
                  }
                  transition={{
                    duration: 4.4,
                    repeat: Infinity,
                    delay: index * 0.4,
                  }}
                  className={`pointer-events-none absolute inset-y-0 w-1/2 blur-3xl ${surface.accentSoft}`}
                />
                <div className="relative grid gap-4 sm:grid-cols-[9rem_1fr]">
                  <div className="aspect-square overflow-hidden border border-white/10 sm:aspect-[4/5]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col py-1">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p
                          className={`text-[8px] font-bold uppercase tracking-[0.28em] ${surface.eyebrow}`}
                        >
                          Objeto {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="mt-2 font-sans text-xl font-semibold sm:text-2xl">
                          {item.name}
                        </h2>
                        {item.variantLabel && (
                          <p className={`mt-1 text-xs ${surface.muted}`}>
                            {item.variantLabel}
                          </p>
                        )}
                        {item.addons && item.addons.length > 0 && (
                          <p className={`mt-1 text-xs ${surface.muted}`}>
                            +{" "}
                            {item.addons.map((addon) => addon.name).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-xl font-semibold">
                          {brl(item.unitPrice * item.quantity)}
                        </div>
                        <div
                          className={`mt-1 text-[9px] uppercase tracking-[0.2em] ${surface.muted}`}
                        >
                          {brl(item.unitPrice)} cada
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                      <div
                        className={`flex items-center border ${surface.border}`}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-none"
                          onClick={() =>
                            setQuantity(item.key, item.quantity - 1)
                          }
                          aria-label={`Diminuir ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <motion.div
                          key={item.quantity}
                          initial={{ scale: 1.35 }}
                          animate={{ scale: 1 }}
                          className="w-10 text-center text-sm font-bold"
                        >
                          {item.quantity}
                        </motion.div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-none"
                          onClick={() =>
                            setQuantity(item.key, item.quantity + 1)
                          }
                          aria-label={`Aumentar ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(item.key)}
                        className={`rounded-none text-[9px] uppercase tracking-[0.2em] ${surface.muted}`}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Remover
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <aside
          className={`relative h-fit overflow-hidden border p-6 lg:sticky lg:top-24 ${surface.border} ${surface.panelStrong}`}
        >
          <motion.div
            aria-hidden="true"
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className={`absolute -right-24 -top-24 h-52 w-52 rounded-full border ${surface.border}`}
          />
          <div className="relative">
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.32em] ${surface.eyebrow}`}
            >
              Resumo em tempo real
            </p>
            <h2 className="mt-3 font-sans text-3xl font-semibold">
              Fechar composição
            </h2>
            <dl className="mt-8 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className={surface.muted}>Subtotal</dt>
                <dd>{brl(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className={surface.muted}>Entrega estimada</dt>
                <dd>{brl(deliveryPreview)}</dd>
              </div>
              <div
                className={`flex justify-between gap-4 border-t pt-5 ${surface.border}`}
              >
                <dt className="text-base font-bold">Total</dt>
                <motion.dd
                  key={total}
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-semibold"
                >
                  {brl(total)}
                </motion.dd>
              </div>
            </dl>

            {store.minOrder > 0 && subtotal < store.minOrder && (
              <p className={`mt-4 text-xs ${surface.eyebrow}`}>
                Pedido mínimo: {brl(store.minOrder)}
              </p>
            )}

            <Button
              asChild
              className={`mt-8 min-h-14 w-full rounded-none text-xs font-bold uppercase tracking-[0.16em] ${surface.button}`}
              disabled={store.minOrder > 0 && subtotal < store.minOrder}
            >
              <Link to="/demo/$storeSlug/checkout" params={{ storeSlug }}>
                Ir para o checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className={`mt-3 min-h-12 w-full rounded-none bg-transparent ${surface.outlineButton}`}
            >
              <a
                href={waStore(
                  store,
                  `Olá! Tenho uma dúvida sobre o meu carrinho na ${store.name}.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Dúvida no WhatsApp
              </a>
            </Button>
            <p
              className={`mt-6 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] ${surface.muted}`}
            >
              <ShieldCheck className={`h-4 w-4 ${surface.eyebrow}`} /> Ambiente
              demonstrativo seguro
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
