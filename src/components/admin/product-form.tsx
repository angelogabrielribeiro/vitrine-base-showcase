import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { getStore } from "@/config/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/types/commerce";
import { slugify } from "@/lib/format";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80";

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
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initial?.name ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? store.categories[0].slug);
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [salePrice, setSalePrice] = useState(String(initial?.salePrice ?? ""));
  const [stock, setStock] = useState(String(initial?.stock ?? "0"));
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [imageUrls, setImageUrls] = useState("");
  const [dragging, setDragging] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);
  const [active, setActive] = useState(initial?.active ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  const addFiles = async (files: File[]) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`O limite é de ${MAX_IMAGES} imagens por produto.`);
      return;
    }

    const selected = files.slice(0, remaining);
    if (files.length > remaining) {
      toast.info(`Foram selecionadas apenas ${remaining} imagens para respeitar o limite.`);
    }

    setProcessingImages(true);
    try {
      const converted: string[] = [];
      for (const file of selected) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} não é uma imagem válida.`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} ultrapassa o limite de 8 MB.`);
          continue;
        }
        converted.push(await resizeProductImage(file));
      }

      if (converted.length) {
        setImages((current) => [...current, ...converted].slice(0, MAX_IMAGES));
        toast.success(
          converted.length === 1 ? "Imagem adicionada" : `${converted.length} imagens adicionadas`,
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível processar a imagem.");
    } finally {
      setProcessingImages(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const addImageUrls = () => {
    const urls = imageUrls
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!urls.length) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`O limite é de ${MAX_IMAGES} imagens por produto.`);
      return;
    }

    const added = urls.slice(0, remaining);
    setImages((current) => [...current, ...added].slice(0, MAX_IMAGES));
    setImageUrls("");
    toast.success(added.length === 1 ? "Link adicionado" : `${added.length} links adicionados`);
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const destination = index + direction;
      if (destination < 0 || destination >= current.length) return current;
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    void addFiles(Array.from(event.dataTransfer.files));
  };

  const handle = (event: FormEvent) => {
    event.preventDefault();
    const product: Product = {
      id: initial?.id ?? `p-${Date.now().toString(36)}`,
      slug: initial?.slug ?? slugify(name),
      name: name.trim(),
      sku: sku.trim() || undefined,
      category,
      description: description.trim(),
      price: Number(price) || 0,
      salePrice: salePrice ? Number(salePrice) : undefined,
      images: images.length ? images : [FALLBACK_IMAGE],
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
    onSubmit(product);
  };

  return (
    <form onSubmit={handle} className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Nome</Label>
          <Input value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
        <div>
          <Label>SKU (opcional)</Label>
          <Input
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            placeholder="Ex.: MB-VS-001"
          />
        </div>
        <div>
          <Label>Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {store.categories.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Preço</Label>
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </div>
        <div>
          <Label>Preço promocional (opcional)</Label>
          <Input
            type="number"
            step="0.01"
            value={salePrice}
            onChange={(event) => setSalePrice(event.target.value)}
          />
        </div>
        <div>
          <Label>Estoque</Label>
          <Input type="number" value={stock} onChange={(event) => setStock(event.target.value)} />
        </div>
        <div>
          <Label>Unidade (opcional)</Label>
          <Input
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            placeholder="kg, un, 500ml"
          />
        </div>
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
        />
      </div>

      <section className="space-y-3 rounded-[var(--radius)] border border-border bg-card p-4">
        <div>
          <h2 className="font-semibold">Imagens do produto</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Arraste imagens ou escolha pela galeria do celular. A primeira será a imagem principal.
          </p>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(event) => void addFiles(Array.from(event.target.files ?? []))}
        />

        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          onDragEnter={() => setDragging(true)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          disabled={processingImages || images.length >= MAX_IMAGES}
          className={`flex min-h-36 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-6 text-center transition ${
            dragging
              ? "border-primary bg-primary/10"
              : "border-border bg-muted/25 hover:border-primary/70 hover:bg-muted/50"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {processingImages ? (
            <ImagePlus className="mb-2 h-8 w-8 animate-pulse text-primary" />
          ) : (
            <UploadCloud className="mb-2 h-8 w-8 text-primary" />
          )}
          <span className="font-medium">
            {processingImages ? "Preparando imagens..." : "Arraste aqui ou toque para selecionar"}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            JPG, PNG, WebP ou AVIF · até 8 MB · máximo de {MAX_IMAGES}
          </span>
        </button>

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {images.map((image, index) => (
              <article
                key={`${image.slice(0, 80)}-${index}`}
                className="overflow-hidden rounded-lg border border-border bg-background"
              >
                <div className="relative aspect-square bg-muted">
                  <img
                    src={image}
                    alt={`Imagem ${index + 1} do produto`}
                    className="h-full w-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
                      Principal
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1 p-1.5">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-full"
                    disabled={index === 0}
                    onClick={() => moveImage(index, -1)}
                    aria-label="Mover imagem para a esquerda"
                  >
                    <ArrowUp className="h-4 w-4 -rotate-90" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-full"
                    disabled={index === images.length - 1}
                    onClick={() => moveImage(index, 1)}
                    aria-label="Mover imagem para a direita"
                  >
                    <ArrowDown className="h-4 w-4 -rotate-90" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-full text-destructive hover:text-destructive"
                    onClick={() => removeImage(index)}
                    aria-label="Remover imagem"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Nesta demonstração, os arquivos ficam salvos somente neste navegador.
        </p>

        <details>
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
            Opção avançada: adicionar imagem por link
          </summary>
          <div className="mt-3 space-y-2">
            <Textarea
              value={imageUrls}
              onChange={(event) => setImageUrls(event.target.value)}
              rows={3}
              placeholder="Cole um ou mais links, um por linha"
            />
            <Button type="button" variant="outline" onClick={addImageUrls}>
              Adicionar links
            </Button>
          </div>
        </details>
      </section>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={active} onCheckedChange={(value) => setActive(Boolean(value))} />
          Ativo
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={featured} onCheckedChange={(value) => setFeatured(Boolean(value))} />
          Destaque
        </label>
      </div>
      <Button type="submit" disabled={processingImages}>
        {submitLabel}
      </Button>
    </form>
  );
}

async function resizeProductImage(file: File): Promise<string> {
  const source = await readAsDataUrl(file);
  const image = await loadImage(source);
  const maxDimension = 1200;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Seu navegador não conseguiu preparar a imagem.");
  context.drawImage(image, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Não foi possível comprimir a imagem."));
          return;
        }
        readAsDataUrl(blob).then(resolve).catch(reject);
      },
      "image/webp",
      0.78,
    );
  });
}

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("A imagem selecionada não pôde ser aberta."));
    image.src = source;
  });
}
