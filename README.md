# Vitrine Base Showcase

Plataforma demonstrativa de **e-commerce white-label** com quatro experiências comerciais visualmente distintas sobre uma base técnica compartilhada.

**Demo:** https://vitrine-base-showcase.lovable.app

## Visão geral

A Vitrine Base nasceu como uma base reutilizável para apresentar soluções digitais a pequenos negócios. O projeto combina catálogo, carrinho, checkout demonstrativo, painel administrativo e diferentes direções de arte sem reconstruir toda a aplicação para cada nicho.

A arquitetura separa configuração, dados e interface para permitir que cada demonstração tenha identidade própria mantendo o mesmo núcleo de comércio.

## Demonstrações

A versão atual inclui quatro experiências:

1. **Maison Belle** — moda feminina, com direção editorial e foco em produto;
2. **Barber Noir** — barbearia e grooming, com serviços, produtos e agendamento demonstrativo;
3. **Brasa Urbana** — restaurante/hamburgueria, com cardápio, adicionais e fluxo de pedido;
4. **NovaCore Electronics** — eletrônicos, com experiência espacial, interações 3D e catálogo tecnológico.

Cada demo possui paleta, tipografia, composição, animações e narrativa visual próprias.

## Funcionalidades

- catálogo e busca de produtos;
- categorias, filtros e variantes;
- carrinho persistido por loja;
- checkout demonstrativo;
- criação local de pedidos;
- painel administrativo demonstrativo;
- cadastro e edição de produtos;
- upload e tratamento visual de imagens;
- estoque e status de pedidos;
- configurações específicas por loja;
- integração de contato por WhatsApp;
- rotas institucionais;
- experiência responsiva desktop/mobile;
- suporte a `prefers-reduced-motion`;
- cenas WebGL/3D e motion design em áreas específicas.

## Arquitetura white-label

As lojas são definidas por configuração tipada, incluindo identidade visual, conteúdo, categorias, dados de contato, regras de entrega, checkout e mensagens comerciais. Isso reduz valores hardcoded nos componentes e permite reutilizar o núcleo da aplicação em diferentes nichos.

A camada de dados demonstrativa é abstraída para que uma implementação futura com backend possa substituir o armazenamento local sem exigir a reconstrução das páginas.

## Stack

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Three.js
- React Three Fiber
- Drei
- Zod
- React Hook Form
- Recharts
- ExcelJS / PapaParse

## Estado dos dados

A versão pública é **demonstrativa**. Produtos, configurações e pedidos utilizam dados locais e `localStorage` onde aplicável. Não existe processamento real de cartão nem backend de produção nesta demonstração.

Essa separação é intencional: o objetivo do showcase é validar experiência, arquitetura white-label e fluxos comerciais antes de conectar infraestrutura real de autenticação, banco de dados e pagamentos.

## Executando localmente

```bash
git clone https://github.com/angelogabrielribeiro/vitrine-base-showcase.git
cd vitrine-base-showcase
npm install
npm run dev
```

## Status

**Showcase funcional e publicado.** O projeto continua recebendo melhorias de experiência, responsividade e arquitetura para futura adaptação a projetos comerciais reais.

## Objetivos técnicos

Este projeto explora arquitetura configurável, reutilização de componentes, modelagem de e-commerce, persistência local, UX de checkout/admin, interfaces altamente interativas e integração de Three.js/WebGL em experiências comerciais.

---

Desenvolvido por **Angelo Gabriel Ribeiro Santos**.