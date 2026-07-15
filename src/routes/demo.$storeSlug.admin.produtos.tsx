import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRepo } from "@/hooks/use-repo";
import { getStore } from "@/config/stores";
import { brl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/demo/$storeSlug/admin/produtos")({
  component: ProductsAdmin,
});

function ProductsAdmin() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const [query, setQuery] = useState("");
  const products = repo
    .listProducts(storeSlug)
    .filter((p) => (query ? p.name.toLowerCase().includes(query.toLowerCase()) : true));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} itens no catálogo</p>
        </div>
        <Button asChild>
          <Link to="/demo/$storeSlug/admin/produtos/novo" params={{ storeSlug }}><Plus className="mr-2 h-4 w-4" />Novo produto</Link>
        </Button>
      </div>

      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome..." className="max-w-sm" />

      <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3">Produto</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Estoque</th>
              <th className="p-3">Ativo</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = p.variants && p.variants.length ? p.variants.reduce((s, v) => s + v.stock, 0) : p.stock;
              return (
                <tr key={p.id} className="border-b border-border/60 last:border-b-0">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${p.images[0]})` }} />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{store.categories.find((c) => c.slug === p.category)?.name ?? p.category}</td>
                  <td className="p-3">{brl(p.salePrice ?? p.price)}</td>
                  <td className="p-3">{stock}</td>
                  <td className="p-3">
                    <Switch checked={p.active} onCheckedChange={(v) => repo.saveProduct(storeSlug, { ...p, active: Boolean(v) })} />
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link to="/demo/$storeSlug/admin/produtos/$id" params={{ storeSlug, id: p.id }}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir "{p.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { repo.deleteProduct(storeSlug, p.id); toast.success("Produto excluído"); }}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
