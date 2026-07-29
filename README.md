# Vitrine Base Showcase

Crie um projeto chamado “Vitrine Base — E-commerce White Label”. Esta será uma base reutilizável e sólida para apresentar hoje a lojistas físicos e depois adaptar para clientes reais.

OBJETIVO DO PRODUTO
Criar uma única aplicação de demonstração com três lojas completas visualmente diferentes, mas compartilhando o mesmo núcleo técnico:
1. Moda feminina.
2. Empório/mercearia de produtos alimentícios.
3. Restaurante/delivery.

A aplicação precisa parecer um produto real e vendável, funcionar perfeitamente no celular e permitir que eu apresente todo o fluxo comercial sem servidor real nesta primeira versão. Use dados locais e localStorage, mas organize a camada de dados para ser substituída depois por Supabase sem reconstruir as páginas.

STACK E PADRÕES
- React, TypeScript, Vite, Tailwind e shadcn/ui.
- React Router.
- Framer Motion somente para animações leves.
- Mobile-first, acessível e responsivo.
- Código modular, tipado e organizado.
- Suporte a prefers-reduced-motion.
- Não usar WebGL, partículas pesadas, vídeos enormes ou efeitos que prejudiquem celulares comuns.
- Não instalar integrações externas nem usar chaves reais nesta etapa.
- Não registrar dados pessoais no console.
- Não armazenar cartão, CPF ou segredos.

ARQUITETURA WHITE-LABEL
Crie uma camada de configuração central e tipada. Cada loja deve ser definida por um objeto StoreConfig com:
- id, slug, nome, subtítulo e descrição;
- nicho;
- logo textual ou imagem;
- cores, fontes, raio e estilo de cards;
- número de WhatsApp;
- Instagram;
- endereço e horários;
- métodos de entrega;
- taxa de entrega;
- pedido mínimo;
- categorias;
- banners e benefícios;
- mensagens comerciais;
- configurações do checkout.

Crie pelo menos estes arquivos ou equivalentes:
- src/config/stores.ts
- src/types/commerce.ts
- src/data/demo-data.ts
- src/services/commerce-repository.ts

Evite textos, telefones, cores e nomes espalhados diretamente pelos componentes. Tudo deve vir da configuração ou dos dados da loja ativa.

CENTRAL DE DEMONSTRAÇÕES
A rota inicial / deve ser uma apresentação profissional chamada “Vitrine Base”. Ela deve permitir escolher uma das três demonstrações e explicar em linguagem comercial:
- loja virtual responsiva;
- produtos e estoque;
- carrinho;
- checkout;
- painel administrativo;
- integração com WhatsApp;
- personalização para cada negócio.

Cada card deve abrir a loja correspondente:
- /demo/moda
- /demo/mercado
- /demo/restaurante

Inclua também um seletor discreto dentro das demonstrações para alternar entre os três exemplos durante uma apresentação.

LOJA 1 — MODA FEMININA
Nome fictício: “Maison Belle”.
Visual claro, sofisticado, bege/off-white, editorial e contemporâneo.
Categorias: vestidos, conjuntos, blusas, calças, bolsas e acessórios.
Crie ao menos 12 produtos com imagens estáveis, preço, preço promocional opcional, tamanhos, cores, estoque por variante, descrição e produtos relacionados.

LOJA 2 — EMPÓRIO/MERCEARIA
Nome fictício: “Casa do Sabor”.
Visual acolhedor, verde escuro, creme e elementos artesanais modernos.
Categorias: cafés, doces, massas, molhos, bebidas e kits.
Crie ao menos 12 produtos com unidade, peso/volume, preço, disponibilidade e descrição.

LOJA 3 — RESTAURANTE/DELIVERY
Nome fictício: “Brasa Urbana”.
Visual escuro, quente e apetitoso.
Categorias: entradas, hambúrgueres, pratos, bebidas e sobremesas.
Crie ao menos 12 itens. Produtos devem aceitar adicionais, observações e opções quando aplicável, como ponto da carne, tamanho e remoção de ingredientes.

NÚCLEO PÚBLICO COMPARTILHADO
Cada demonstração deve ter:
- barra promocional;
- header responsivo;
- busca;
- menu mobile;
- hero forte e bonito;
- categorias;
- produtos em destaque;
- catálogo completo;
- página de produto;
- avaliações claramente identificadas como demonstração;
- benefícios;
- FAQ;
- endereço e horários;
- rodapé;
- botão flutuante do WhatsApp.

ROTAS DAS LOJAS
Estruture as rotas por loja, por exemplo:
- /demo/:storeSlug
- /demo/:storeSlug/produtos
- /demo/:storeSlug/categoria/:categorySlug
- /demo/:storeSlug/produto/:productSlug
- /demo/:storeSlug/carrinho
- /demo/:storeSlug/checkout
- /demo/:storeSlug/pedido-confirmado/:orderId
- /demo/:storeSlug/privacidade
- /demo/:storeSlug/termos
- /demo/:storeSlug/trocas

CATÁLOGO
- Busca por nome.
- Filtros adequados ao nicho.
- Ordenação.
- Disponibilidade.
- Cards responsivos.
- Estado vazio.
- Skeleton preparado para backend futuro.
- Produtos esgotados não podem ser comprados.

PÁGINA DE PRODUTO
- Galeria.
- Descrição.
- Preço e promoção.
- Variantes adequadas ao nicho.
- Quantidade.
- Estoque.
- Adicionais e observação no restaurante.
- Botão adicionar ao carrinho.
- Botão tirar dúvida no WhatsApp.
- Relacionados.

CARRINHO
- Carrinho lateral e página completa.
- Persistência em localStorage separada por loja.
- Alterar quantidade.
- Remover.
- Validar estoque.
- Mostrar subtotal, entrega, descontos demonstrativos e total.
- No restaurante, exibir adicionais e observações.

LOGIN DEMONSTRATIVO
Preciso que exista uma caixa de login com aparência real para apresentação, mas sem fingir segurança.
Crie:
- /demo/:storeSlug/login
- /demo/:storeSlug/admin/login

Login de cliente:
- campos de WhatsApp ou e-mail e senha;
- botão entrar;
- opção criar conta;
- opção continuar sem conta;
- ao entrar em modo demo, criar uma sessão local claramente marcada como demonstrativa.

Login administrativo:
- visual profissional;
- aviso discreto “Acesso demonstrativo — autenticação segura será conectada na versão do cliente”.
- botão “Entrar no painel demonstrativo”.
- não criar credenciais fixas nem afirmar que existe autenticação real.

CHECKOUT DEMONSTRATIVO COMPLETO
Não processar pagamento real ainda, mas o checkout deve parecer completo e convincente.
Campos:
- nome;
- WhatsApp obrigatório;
- e-mail opcional;
- retirada, entrega local ou delivery, conforme cada loja;
- endereço condicional;
- observações;
- cupom demonstrativo.

Formas de pagamento visuais:
- Pix;
- cartão de crédito;
- cartão de débito;
- dinheiro na entrega, apenas quando configurado;
- opção de troco para dinheiro.

Para cartão, mostre uma interface visual segura com aviso de que o pagamento real será processado por provedor homologado, mas não armazene nem aceite dados reais. Em DEMO_MODE, use campos de demonstração desabilitados ou mascarados, sem capturar número completo.

Inclua:
- resumo completo;
- taxas;
- total;
- aceite obrigatório de termos e privacidade;
- consentimento separado e opcional para marketing pelo WhatsApp, desmarcado por padrão;
- aviso visível de demonstração;
- botão “Simular pagamento aprovado”.

Ao finalizar:
- criar pedido local com número legível;
- salvar itens, cliente, entrega, forma de pagamento e consentimentos;
- limpar carrinho;
- abrir página de confirmação.

PEDIDO CONFIRMADO E WHATSAPP
A página deve mostrar:
- sucesso;
- número;
- itens;
- total;
- método de recebimento;
- pagamento aprovado em modo demonstração;
- próximos passos;
- botão “Falar com a loja sobre este pedido”.

O botão deve abrir wa.me com mensagem pronta usando o telefone da loja ativa e apenas número do pedido e contexto necessário. Não incluir endereço completo ou dados sensíveis na URL.

Crie também botões de WhatsApp:
- flutuante geral;
- dúvida sobre produto;
- dúvida sobre carrinho;
- pós-compra.

PAINEL ADMINISTRATIVO DEMONSTRATIVO
Rotas:
- /demo/:storeSlug/admin
- /demo/:storeSlug/admin/dashboard
- /demo/:storeSlug/admin/produtos
- /demo/:storeSlug/admin/produtos/novo
- /demo/:storeSlug/admin/produtos/:id
- /demo/:storeSlug/admin/pedidos
- /demo/:storeSlug/admin/pedidos/:id
- /demo/:storeSlug/admin/configuracoes

Dashboard com dados reais do localStorage da loja ativa:
- produtos;
- produtos ativos;
- estoque baixo;
- pedidos;
- pedidos pagos;
- valor demonstrativo vendido;
- pedidos recentes.

Produtos:
- cadastrar;
- editar;
- ativar/desativar;
- imagens por URL;
- preço e promoção;
- categorias;
- variantes;
- estoque;
- adicionais no restaurante;
- excluir com confirmação.

Pedidos:
- buscar e filtrar;
- abrir detalhes;
- ver cliente, itens, entrega e pagamento;
- mudar status;
- abrir WhatsApp do cliente com mensagem sobre o pedido.

Status:
- Novo;
- Pagamento aprovado;
- Em separação/preparo;
- Pronto para retirada;
- Saiu para entrega;
- Enviado;
- Entregue;
- Cancelado;
- Reembolsado.

Configurações:
- nome;
- descrição;
- telefone;
- Instagram;
- endereço;
- horários;
- banner;
- cores;
- taxa;
- pedido mínimo;
- métodos de recebimento.

Mudanças devem refletir imediatamente na loja ativa.

CAMADA DE DADOS
Nunca acessar localStorage diretamente nas páginas. Criar repository/service com funções para produtos, pedidos, configurações, carrinho e sessão demo. Estruturar interfaces para futura implementação SupabaseRepository.

PRIVACIDADE E SEGURANÇA
- DEMO_MODE=true visível nos pontos importantes.
- Sem analytics, pixel ou cookies desnecessários.
- Sem banner de cookies falso.
- Sem dados de cartão.
- Sem CPF.
- Sem chaves.
- Sem APIs externas.
- Páginas jurídicas provisórias, claramente marcadas para personalização antes da produção.

QUALIDADE VISUAL
As três lojas devem parecer exemplos comerciais diferentes, não apenas trocar uma cor. Ajuste tipografia, densidade, hero, cards e linguagem por nicho, mantendo o mesmo núcleo.
Use animações sutis apenas na home, menu, carrinho e cards. Checkout e admin devem ser rápidos e estáveis.

VALIDAÇÃO FINAL
Antes de concluir:
1. Verificar todas as rotas.
2. Testar alternância entre lojas.
3. Testar busca e filtros.
4. Testar variantes e adicionais.
5. Testar persistência do carrinho por loja.
6. Criar pedido em cada nicho.
7. Confirmar que pedidos aparecem no painel correto.
8. Cadastrar ou editar produto e verificar reflexo na vitrine.
9. Testar WhatsApp com mensagens corretas.
10. Corrigir imports, TypeScript, layout mobile e botões sem ação.
11. Não deixar páginas importantes vazias.
12. Entregar resumo curto do que foi criado e indicar credenciais externas que serão necessárias somente na etapa futura.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://vitrine-base-showcase.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f6802b5f-7b68-4c6d-8b51-a065f2159911).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
