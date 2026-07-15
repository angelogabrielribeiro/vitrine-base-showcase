import { useState } from "react";
import { getStore } from "@/config/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from "@/types/commerce";
import { slugify } from "@/lib/format";

export function ProductForm({
  storeSlug,
  initial,
  onSubmit,
  submitLabel,
}: {
  storeSlug: string;
  initial?: Partial<Product>;
  onSubmit: (p: Product) => void;
  submitLabel: string;
}) {
  const store = getStore(storeSlug)!;
  const [name, setName] = useState(initial?.name ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? store.categories[0].slug);
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [salePrice, setSalePrice] = useState(String(initial?.salePrice ?? ""));
  const [stock, setStock] = useState(String(initial?.stock ?? "0"));
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [imagesStr, setImagesStr] = useState((initial?.images ?? []).join("\n"));
  const [active, setActive] = useState(initial?.active ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const images = imagesStr.split("\n").map((s) => s.trim()).filter(Boolean);
    const p: Product = {
      id: initial?.id ?? `p-${Date.now().toString(36)}`,
      slug: initial?.slug ?? slugify(name),
      name: name.trim(),
      sku: sku.trim() || undefined,
      category,
      description: description.trim(),
      price: Number(price) || 0,
      salePrice: salePrice ? Number(salePrice) : undefined,
      images: images.length ? images : ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80"],
      active,
      featured,
      unit: unit || undefined,
      stock: Number(stock) || 0,
      variantOptions: initial?.variantOptions,
      variants: initial?.variants,
      addons: initial?.addons,
      allowNotes: initial?.allowNotes,
      relatedIds: initial?.relatedIds,
      tags: initial?.tags,
    };
    onSubmit(p);
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><Label>SKU (opcional)</Label><Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Ex.: MB-VS-001" /></div>
        <div>
          <Label>Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {store.categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div><Label>Preço</Label><Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
        <div><Label>Preço promocional (opcional)</Label><Input type="number" step="0.01" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} /></div>
        <div><Label>Estoque</Label><Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} /></div>
        <div><Label>Unidade (opcional)</Label><Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg, un, 500ml" /></div>
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      </div>
      <div>
        <Label>Imagens (URLs, uma por linha)</Label>
        <Textarea value={imagesStr} onChange={(e) => setImagesStr(e.target.value)} rows={3} placeholder="https://..." />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm"><Switch checked={active} onCheckedChange={(v) => setActive(Boolean(v))} /> Ativo</label>
        <label className="flex items-center gap-2 text-sm"><Switch checked={featured} onCheckedChange={(v) => setFeatured(Boolean(v))} /> Destaque</label>
      </div>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
