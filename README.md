# Sistema Just in Time – Gestão da Produção

## Sobre o projeto

Sistema web desenvolvido para auxiliar no controle da produção e do estoque de uma empresa de produtos em MDF, utilizando o conceito **Just in Time**.

O sistema permite realizar o login de usuários, cadastrar e gerenciar produtos, registrar produtos fabricados e pedidos, controlar o estoque e identificar quando um produto está abaixo do estoque mínimo.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- Prisma
- MySQL
- CORS

## Funcionalidades

- Login de usuários
- Consulta de produtos
- Cadastro de produtos
- Edição de produtos
- Exclusão de produtos
- Pesquisa de produtos
- Controle de estoque
- Registro de produtos fabricados
- Registro de pedidos
- Atualização automática do estoque
- Verificação de estoque disponível
- Controle de estoque mínimo
- Alerta para estoque abaixo do mínimo
- Registro de movimentações
- Registro do usuário responsável pela movimentação

## Estrutura

```text
just_in_time_01_2026/
├── api/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   └── routes/
│   ├── server.js
│   ├── package.json
│   └── prisma.config.ts
│
├── html/
│   ├── index.html
│   ├── login.html
│   ├── produtos.html
│     producao.html
│   ├── css/
│   │   └── global.css
│   └── js/
│       ├── index.js
│       ├── login.js
│       ├── produtos.js
│       └── producao.js
│
└── banco/
    └── script_banco.sql
```

## Banco de dados

Banco utilizado:

**mydbpreparacao_db**

O banco de dados é composto pelas seguintes tabelas:

- Usuario
- Produto
- Pedido
- Item
- Producao
- Movimentacao

### Descrição das tabelas

- **Usuario:** armazena os usuários que acessam o sistema.
- **Produto:** armazena os produtos, seus custos e informações de estoque.
- **Pedido:** registra os pedidos realizados.
- **Item:** relaciona os produtos aos pedidos e armazena suas quantidades.
- **Producao:** registra os produtos fabricados, suas quantidades, datas e usuários responsáveis.
- **Movimentacao:** registra as entradas e saídas de estoque, identificando o produto, quantidade, tipo, data e usuário responsável.

O arquivo `script_banco.sql` contém a criação e a população inicial das tabelas do banco de dados.

## Como executar

### 1. Instalar as dependências

Dentro da pasta `api`:

```bash
npm install
```

### 2. Configurar o banco

Criar o banco `mydbpreparacao_db` no MySQL e executar o arquivo:

```text
banco/script_banco.sql
```

### 3. Iniciar o servidor

Dentro da pasta `api`:

```bash
npm run dev
```

### 4. Abrir o sistema

Abrir no navegador:

```text
web/login.html
```

## Documentação

O projeto possui os seguintes documentos:

- Lista de requisitos funcionais
- DER
- Script de criação e população do banco
- Interfaces do sistema
- Descritivo de casos de teste
- Lista de requisitos de infraestrutura

## Objetivo

Desenvolver um sistema simples de gestão da produção baseado no conceito **Just in Time**, permitindo controlar produtos, estoque e movimentações de forma organizada.

---
## 👩‍💻 Autora

Pietra Vitória Fernandes Lopes
