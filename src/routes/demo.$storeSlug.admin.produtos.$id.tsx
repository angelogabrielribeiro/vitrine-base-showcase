import { createFileRoute, useNavigate, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useRepo } from "@/hooks/use-repo";
import { ProductForm } from "@/components/admin/product-form";
import { toast } from "sonner";

export const Route = createFileRoute("/demo/$storeSlug/admin/produtos/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { storeSlug, id } = Route.useParams();
  const repo = useRepo();
  const navigate = useNavigate();
  const product = repo.getProductById(storeSlug, id);
  if (!product) throw notFound();
  return (
    <div className="space-y-4">
      <Link to="/demo/$storeSlug/admin/produtos" params={{ storeSlug }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="h-4 w-4" /> Produtos
      </Link>
      <h1 className="font-display text-3xl font-semibold">Editar produto</h1>
      <ProductForm
        storeSlug={storeSlug}
        initial={product}
        onSubmit={(p) => {
          repo.saveProduct(storeSlug, p);
          toast.success("Produto atualizado");
          navigate({ to: "/demo/$storeSlug/admin/produtos", params: { storeSlug } });
        }}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
