import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { useRepo } from "@/hooks/use-repo";
import { getStore } from "@/config/stores";
import { brl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Product } from "@/types/commerce";

export const Route = createFileRoute("/demo/$storeSlug/admin/produtos")({
  component: ProductsAdmin,
});

function ProductsAdmin() {
  const { storeSlug } = Route.useParams();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const store = getStore(storeSlug)!;
  const repo = useRepo();
  const [query, setQuery] = useState("");
  const isProductsIndex = pathname.replace(/\/+$/, "") === `/demo/${storeSlug}/admin/produtos`;

  if (!isProductsIndex) return <Outlet />;
  const products = repo
    .listProducts(storeSlug)
    .filter((p) => (query ? p.name.toLowerCase().includes(query.toLowerCase()) : true));

  const stockOf = (product: Product) =>
    product.variants && product.variants.length
      ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
      : product.stock;

  const deleteProduct = (product: Product) => {
    repo.deleteProduct(storeSlug, product.id);
    toast.success("Produto excluído");
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} itens no catálogo</p>
        </div>
        <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/demo/$storeSlug/admin/importar-exportar" params={{ storeSlug }}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Importar / Exportar
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/demo/$storeSlug/admin/produtos/novo" params={{ storeSlug }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo produto
            </Link>
          </Button>
        </div>
      </div>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome..."
        className="w-full max-w-sm"
      />

      <div className="grid gap-3 md:hidden">
        {products.map((product) => {
          const stock = stockOf(product);
          const category =
            store.categories.find((item) => item.slug === product.category)?.name ??
            product.category;

          return (
            <article
              key={product.id}
              className="min-w-0 rounded-[var(--radius)] border border-border bg-card p-4"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className="h-14 w-14 shrink-0 rounded-md bg-muted bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.images[0]})` }}
                />
                <div className="min-w-0 flex-1">
                  <h2 className="break-words font-semibold leading-tight">{product.name}</h2>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{product.slug}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{category}</p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-2 rounded-md bg-muted/40 p-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Preço</dt>
                  <dd className="font-semibold">{brl(product.salePrice ?? product.price)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Estoque</dt>
                  <dd className="font-semibold">{stock}</dd>
                </div>
              </dl>

              <div className="mt-3 flex min-h-11 items-center justify-between rounded-md border border-border px-3">
                <div>
                  <div className="text-sm font-medium">Disponível na loja</div>
                  <div className="text-xs text-muted-foreground">
                    {product.active ? "Produto ativo" : "Produto desativado"}
                  </div>
                </div>
                <Switch
                  checked={product.active}
                  aria-label={`${product.active ? "Desativar" : "Ativar"} ${product.name}`}
                  onCheckedChange={(value) =>
                    repo.saveProduct(storeSlug, { ...product, active: Boolean(value) })
                  }
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link
                    to="/demo/$storeSlug/admin/produtos/$id"
                    params={{ storeSlug, id: product.id }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </Button>
                <DeleteProductButton product={product} onDelete={() => deleteProduct(product)} />
              </div>
            </article>
          );
        })}
        {products.length === 0 && (
          <div className="rounded-[var(--radius)] border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nenhum produto encontrado.
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto overscroll-x-contain rounded-[var(--radius)] border border-border bg-card md:block">
        <table className="w-full min-w-[780px] text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3">Produto</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Estoque</th>
              <th className="p-3">Ativo</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stock = stockOf(product);
              return (
                <tr key={product.id} className="border-b border-border/60 last:border-b-0">
                  <td className="min-w-64 p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 shrink-0 rounded-md bg-muted bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.images[0]})` }}
                      />
                      <div className="min-w-0">
                        <div className="font-medium">{product.name}</div>
                        <div className="max-w-64 truncate text-xs text-muted-foreground">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {store.categories.find((category) => category.slug === product.category)
                      ?.name ?? product.category}
                  </td>
                  <td className="whitespace-nowrap p-3">
                    {brl(product.salePrice ?? product.price)}
                  </td>
                  <td className="p-3">{stock}</td>
                  <td className="p-3">
                    <Switch
                      checked={product.active}
                      aria-label={`${product.active ? "Desativar" : "Ativar"} ${product.name}`}
                      onCheckedChange={(value) =>
                        repo.saveProduct(storeSlug, { ...product, active: Boolean(value) })
                      }
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link
                          to="/demo/$storeSlug/admin/produtos/$id"
                          params={{ storeSlug, id: product.id }}
                          aria-label={`Editar ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteProductIconButton
                        product={product}
                        onDelete={() => deleteProduct(product)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeleteProductButton({ product, onDelete }: { product: Product; onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <DeleteProductDialogContent product={product} onDelete={onDelete} />
    </AlertDialog>
  );
}

function DeleteProductIconButton({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label={`Excluir ${product.name}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <DeleteProductDialogContent product={product} onDelete={onDelete} />
    </AlertDialog>
  );
}

function DeleteProductDialogContent({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: () => void;
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir "{product.name}"?</AlertDialogTitle>
        <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
