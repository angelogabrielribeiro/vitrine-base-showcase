# Vitrine Base Showcase

Plataforma white-label de e-commerce criada para demonstrar como um mesmo núcleo técnico pode atender negócios de nichos diferentes sem reconstruir toda a aplicação.

🔗 **Demo:** https://vitrine-base-showcase.lovable.app

## Sobre o projeto

A Vitrine Base reúne três experiências comerciais dentro da mesma aplicação:

- moda feminina;
- empório/mercearia;
- restaurante/delivery.

Cada loja possui identidade visual, catálogo e regras próprias, mas compartilha a mesma arquitetura de produtos, carrinho, checkout, pedidos e painel administrativo demonstrativo.

## Principais recursos

- Arquitetura white-label configurável
- Catálogo com busca, filtros e categorias
- Produtos com variantes e estoque
- Carrinho persistente por loja
- Checkout demonstrativo
- Fluxo de pedidos
- Painel administrativo demonstrativo
- Cadastro e edição local de produtos
- Configurações específicas por estabelecimento
- Integração de contato via WhatsApp
- Importação e manipulação de dados tabulares
- Layout mobile-first e responsivo

## Stack

- React 19
- TypeScript
- TanStack Start / Router / Query
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Three.js / React Three Fiber
- Zod
- React Hook Form
- ExcelJS
- Papa Parse

## Arquitetura

Os dados de cada negócio são centralizados em configurações tipadas. A camada de acesso a dados é separada da interface para permitir a substituição do armazenamento local por uma implementação com Supabase ou outro backend no futuro.

Isso permite adaptar marca, catálogo, regras comerciais e experiência visual sem duplicar o núcleo da aplicação.

## Segurança da demonstração

A versão pública não processa pagamentos reais nem deve armazenar dados sensíveis. Autenticação, checkout e pedidos são apresentados em modo demonstrativo para permitir a validação do fluxo comercial antes da integração de serviços de produção.

## Rodando localmente

```bash
git clone <url-do-repositorio>
cd vitrine-base-showcase
npm install
npm run dev
```

## Status

✅ **Showcase funcional publicado.** O projeto serve como base técnica e comercial para futuras implementações personalizadas.

## Objetivos técnicos

O projeto explora arquitetura reutilizável, configuração white-label, tipagem de domínio, persistência local, fluxos de e-commerce, responsividade e construção de sistemas que possam evoluir de demonstração para produto real.
