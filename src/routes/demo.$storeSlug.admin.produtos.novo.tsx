import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useRepo } from "@/hooks/use-repo";
import { ProductForm } from "@/components/admin/product-form";
import { toast } from "sonner";

export const Route = createFileRoute("/demo/$storeSlug/admin/produtos/novo")({
  component: NewProduct,
});

function NewProduct() {
  const { storeSlug } = Route.useParams();
  const repo = useRepo();
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <Link to="/demo/$storeSlug/admin/produtos" params={{ storeSlug }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="h-4 w-4" /> Produtos
      </Link>
      <h1 className="font-display text-3xl font-semibold">Novo produto</h1>
      <ProductForm
        storeSlug={storeSlug}
        onSubmit={(p) => {
          repo.saveProduct(storeSlug, p);
          toast.success("Produto criado");
          navigate({ to: "/demo/$storeSlug/admin/produtos", params: { storeSlug } });
        }}
        submitLabel="Criar produto"
      />
    </div>
  );
}
