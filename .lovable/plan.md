## Vitrine Base — E-commerce White Label

Base reutilizável com 3 lojas demo (moda, mercearia, restaurante) compartilhando o mesmo núcleo técnico, dados em localStorage, pronta para trocar por Supabase depois.

### Ajuste importante de stack

Você pediu **React Router**, mas este projeto já está em **TanStack Start + TanStack Router** (roteamento por arquivos em `src/routes/`). Vou usar TanStack Router — a API é equivalente (`Link`, `useNavigate`, params, layouts) e evita reescrever o bootstrap. Todo o resto da stack pedida (React, TS, Vite, Tailwind, shadcn/ui, Framer Motion) já está disponível ou será adicionado.

Rotas ficarão com a mesma forma que você descreveu, só mudando o arquivo:
- `/` → `src/routes/index.tsx` (Central de Demonstrações)
- `/demo/$storeSlug/...` → `src/routes/demo.$storeSlug.*.tsx`
- `/demo/$storeSlug/admin/...` → `src/routes/demo.$storeSlug.admin.*.tsx`

### Arquitetura

```text
src/
  config/stores.ts              # StoreConfig das 3 lojas (cores, fontes, wa, etc.)
  types/commerce.ts             # Product, Variant, CartItem, Order, StoreConfig...
  data/demo-data.ts             # 12+ produtos por loja, categorias, banners
  services/
    commerce-repository.ts      # Interface CommerceRepository
    local-repository.ts         # Implementação localStorage (por storeSlug)
    demo-session.ts             # Sessão demo cliente/admin
  hooks/
    use-store.ts                # Loja ativa via param
    use-cart.ts                 # Carrinho reativo por loja
    use-products.ts / use-orders.ts
  components/
    storefront/                 # Header, Hero, ProductCard, WhatsAppFab, etc.
    admin/                      # Layout admin, tabelas, forms
    checkout/                   # Steps, PaymentMock, OrderSummary
    ui/                         # shadcn (já existente)
  lib/
    whatsapp.ts                 # buildWhatsappUrl(store, context)
    format.ts, cn.ts
    demo-mode.ts                # DEMO_MODE flag + banner
  routes/
    index.tsx                                 # Central Vitrine Base
    demo.$storeSlug.tsx                       # Layout público (header/footer/wa)
    demo.$storeSlug.index.tsx                 # Home da loja
    demo.$storeSlug.produtos.tsx              # Catálogo
    demo.$storeSlug.categoria.$categorySlug.tsx
    demo.$storeSlug.produto.$productSlug.tsx
    demo.$storeSlug.carrinho.tsx
    demo.$storeSlug.checkout.tsx
    demo.$storeSlug.pedido-confirmado.$orderId.tsx
    demo.$storeSlug.login.tsx
    demo.$storeSlug.privacidade.tsx
    demo.$storeSlug.termos.tsx
    demo.$storeSlug.trocas.tsx
    demo.$storeSlug.admin.tsx                 # Layout admin (gate demo)
    demo.$storeSlug.admin.login.tsx
    demo.$storeSlug.admin.index.tsx           # Dashboard
    demo.$storeSlug.admin.produtos.tsx
    demo.$storeSlug.admin.produtos.novo.tsx
    demo.$storeSlug.admin.produtos.$id.tsx
    demo.$storeSlug.admin.pedidos.tsx
    demo.$storeSlug.admin.pedidos.$id.tsx
    demo.$storeSlug.admin.configuracoes.tsx
```

### Camada de dados

`CommerceRepository` (interface) com métodos:
`listProducts`, `getProduct`, `saveProduct`, `deleteProduct`, `listOrders`, `getOrder`, `createOrder`, `updateOrderStatus`, `getConfig`, `saveConfig`, `getCart`, `saveCart`, `getSession`, `setSession`.

Implementação `LocalRepository` usa `localStorage` com chave prefixada por `vitrine:{storeSlug}:...`. Assinatura pensada para trocar por `SupabaseRepository` depois sem tocar em páginas. Nada de `localStorage` direto em componentes.

### White-label

Cada loja em `stores.ts` define: id, slug, nome, subtítulo, nicho, logoText, paleta (primary/bg/surface/accent em oklch aplicados via CSS vars inline no layout da loja), fontes (link no `__root` head), raio, whatsapp, instagram, endereço, horários, entrega/retirada/delivery, taxa, pedido mínimo, categorias, banners, benefícios, FAQ, mensagens.

Aplicação do tema: `demo.$storeSlug.tsx` injeta `<style>` com CSS vars da loja no escopo do layout — os componentes usam `bg-primary`, `text-foreground`, etc., sem cores hardcoded.

### 3 lojas

- **Maison Belle** (moda) — bege/off-white editorial, serif display + sans, 12 produtos com tamanhos, cores, variantes com estoque, preço promocional.
- **Casa do Sabor** (empório) — verde escuro/creme, 12 produtos com unidade e peso/volume.
- **Brasa Urbana** (restaurante) — escuro/quente, 12 itens com adicionais, observações, ponto da carne, tamanho.

Imagens: Unsplash Source com IDs fixos (estáveis) por produto.

### Fluxos

- **Catálogo**: busca, filtros por nicho, ordenação, skeleton, estado vazio, esgotado desabilita compra.
- **Produto**: galeria, variantes, quantidade, adicionar ao carrinho, WhatsApp dúvida, relacionados.
- **Carrinho**: drawer lateral + página, persistência por loja, valida estoque, subtotal/entrega/desconto/total, adicionais/obs no restaurante.
- **Checkout demo**: form com Zod, entrega condicional, pagamento visual (Pix/cartão mascarado desabilitado com aviso/dinheiro+troco), cupom demo, consentimentos separados, botão "Simular pagamento aprovado" → cria pedido, limpa carrinho, vai para confirmação.
- **Confirmação**: número legível (`#VB-XXXX`), resumo, botão WhatsApp com mensagem mínima (só nº + contexto, sem endereço).
- **Login demo cliente/admin**: visual real, cria sessão local marcada como demo, sem credenciais fixas, banner "Autenticação segura será conectada na versão do cliente".
- **Admin**: dashboard com métricas do repositório, CRUD produtos, listagem/detalhes de pedidos com mudança de status e WhatsApp do cliente, configurações que refletem imediatamente na vitrine.

### Segurança/Privacidade

`DEMO_MODE=true` como flag em `lib/demo-mode.ts` + banner discreto no topo das lojas e admin. Sem analytics, sem cookies, sem captura de cartão real (inputs desabilitados/mascarados), sem CPF, sem chaves. Páginas jurídicas marcadas como provisórias.

### Acessibilidade & mobile

Mobile-first, tap targets ≥44px, `prefers-reduced-motion` respeitado em todas as animações Framer Motion, foco visível, labels em todos os inputs.

### Escopo desta entrega

Vou entregar tudo acima em uma única leva. Devido ao tamanho, alguns pontos serão priorizados assim:
1. Núcleo (types, config, repository, demo-data, hooks, tema por loja).
2. Central `/` + layout público + home/catálogo/produto/carrinho/checkout/confirmação.
3. Login demo cliente/admin + rotas admin (dashboard, produtos CRUD, pedidos com status, configurações).
4. Páginas jurídicas provisórias, WhatsApp, polimento visual das 3 lojas.

Ao final: verifico build, testo os fluxos principais no preview e entrego um resumo curto do que foi criado + o que ficará para a etapa Supabase/pagamento real.

### Confirmações rápidas antes de eu começar

- OK usar **TanStack Router** no lugar de React Router DOM? (recomendo sim — é o que o template já suporta)
- OK usar imagens do Unsplash para os produtos demo?

Se responder "pode ir" eu já começo a implementação completa.
