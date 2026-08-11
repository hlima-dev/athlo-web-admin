# ATHLO — SaaS de Gestão para Pequenas e Médias Empresas

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)

---

# 📌 Sobre o projeto

O **ATHLO** é uma plataforma **SaaS multi-tenant** para pequenas e médias
empresas gerenciarem seu negócio em um só lugar: contatos (CRM), financeiro,
agenda, produtos/serviços e equipe.

Cada empresa que se cadastra (tenant) tem seus dados completamente isolados,
usuários próprios com papéis de acesso (dono, administrador, membro) e um
plano de assinatura (Free, Starter, Pro).

Tudo através de uma interface moderna, responsiva e focada em acessibilidade
e experiência do usuário.

---

# 🚀 Funcionalidades

## 🔐 Autenticação e multi-tenant
- Cadastro self-service (cria uma nova empresa)
- Convite de membros da equipe por e-mail
- Proteção de rotas e JWT Authentication
- Papéis por empresa: Dono, Administrador, Membro

## 📊 Dashboard
- Estatísticas em tempo real da empresa
- Indicadores de contatos, receita, faturas e agenda
- Gráficos interativos

## 👥 Contatos (CRM)
- Cadastro de leads, clientes e fornecedores
- Busca e filtros
- Histórico de faturas e agenda por contato

## 💰 Financeiro
- Contas a pagar e a receber
- Marcar faturas como pagas
- Indicadores de fluxo de caixa

## 📦 Produtos e serviços
- Catálogo de produtos e serviços
- Preço, SKU e status

## 📅 Agenda
- Reuniões, tarefas e prazos
- Calendário mensal

## 🤝 Equipe
- Convite de membros
- Papéis de acesso por empresa

## 💳 Planos e assinatura
- Planos Free / Starter / Pro
- Troca de plano pela própria empresa
- Estrutura pronta para integração de cobrança (Stripe)

## 🔔 Notificações
- Alertas administrativos, de financeiro, agenda e equipe

## 📈 Relatórios
- Indicadores de desempenho
- Gráficos analíticos

---

# 🛠️ Tecnologias utilizadas

## Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- React Query
- Recharts
- Framer Motion
- Lucide React
- Axios

## Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT

---

# 🎨 Design

A interface foi desenvolvida com foco em:

- visual moderno
- experiência premium
- responsividade
- acessibilidade
- UI estilo SaaS

---

# ⚙️ Como executar o projeto

## Clone o repositório

```bash
git clone https://github.com/hlima-dev/athlo-web-admin.git
```

---

## Instale as dependências

```bash
npm install
```

---

## Execute o projeto

```bash
npm run dev
```

---

# 🌐 Build de produção

```bash
npm run build
```

---

# 📁 Estrutura do projeto

```bash
src/
 ├── components/
 ├── hooks/
 ├── layouts/
 ├── pages/
 ├── routes/
 ├── services/
 ├── assets/
```

---

# 🗺️ Roadmap

- Integração de cobrança real (Stripe Checkout)
- Enforcement automático de limites de plano
- Pipeline de vendas / Kanban de oportunidades

---

# 👨‍💻 Desenvolvido por

- Lucas Lima Santos

---

# 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais, evoluído para um
produto SaaS.
