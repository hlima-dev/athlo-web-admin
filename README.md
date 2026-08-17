# ATHLO — SaaS de Gestão para Pequenas e Médias Empresas

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)

---

# 🌐 Demonstração Online

## Frontend
https://athlo-web-admin-fdizioprj-hlima-dev1.vercel.app/

## Backend API
https://athlo-backend-r176.onrender.com

## Credenciais de demonstração
| E-mail | Senha |
|---|---|
| admin@athlodemo.com.br | Admin@2024 |

> O backend está no plano gratuito do Render — se ficar inativo por um
> tempo, o primeiro acesso pode demorar até ~1 minuto para "acordar".

---

# 📌 Sobre o projeto

O **ATHLO** é uma plataforma **SaaS multi-tenant** para pequenas e médias
empresas gerenciarem seu negócio em um só lugar: contatos (CRM), financeiro,
agenda, produtos/serviços, pedidos e equipe.

Cada empresa que se cadastra (tenant) tem seus dados completamente isolados,
usuários próprios com papéis de acesso (dono, administrador, membro) e um
plano de assinatura pago de verdade (Free, Starter, Pro) via Stripe. Um
mesmo login também pode ter acesso a mais de uma empresa (múltiplos
CNPJs/unidades), com um seletor para trocar entre elas.

Tudo através de uma interface moderna, responsiva e focada em acessibilidade
e experiência do usuário.

---

# 🚀 Funcionalidades

## 🔐 Autenticação e multi-tenant
- Cadastro self-service (cria uma nova empresa) e convite de membros por e-mail
- Um mesmo login pode acessar várias empresas — tela de seleção de empresa e
  botão "Trocar Unidade" na sidebar
- Verificação de e-mail no cadastro
- Sessão em cookies httpOnly + proteção CSRF (tokens nunca ficam expostos ao JavaScript)
- Bloqueio automático de conta após tentativas de senha incorretas seguidas
- Papéis por empresa: Dono, Administrador, Membro

## 💳 Cobrança (Stripe)
- Checkout de assinatura hospedado pelo Stripe
- Portal de cobrança (trocar cartão, cancelar, ver faturas)
- Webhooks ativando/cancelando o plano automaticamente
- Bloqueio de escrita quando o trial acaba e não há assinatura ativa
- Limite de contatos e usuários por plano

## 👑 Administração da plataforma
- Painel exclusivo da equipe ATHLO (separado do dono de cada empresa cliente)
- Visão geral de MRR, assinaturas por status, lista de empresas clientes
- Suspender/reativar empresas

## 📊 Dashboard
- Estatísticas em tempo real da empresa
- Indicadores de contatos, receita, faturas e agenda
- Gráficos interativos

## 👥 Contatos (CRM)
- Cadastro de leads, clientes e fornecedores, com máscara de telefone/CPF/CNPJ
- Busca e filtros
- Histórico de faturas e agenda por contato

## 💰 Financeiro
- Contas a pagar e a receber
- Marcar faturas como pagas
- Geração de PDF da fatura

## 📦 Produtos e serviços
- Catálogo de produtos e serviços
- Preço, SKU e status

## 🧾 Pedidos
- Pedidos com itens, status, forma de pagamento e origem
- Geração de PDF do pedido
- E-mail automático ao cliente quando o status muda

## 📅 Agenda
- Reuniões, tarefas e prazos, com calendário mensal
- Cadastro rápido por texto em português (identifica data/hora automaticamente)
- Lembrete automático: notificação dentro do sistema + push no navegador
  (notebook e celular) quando um compromisso está prestes a começar

## 🤝 Equipe
- Convite de membros (inclusive para quem já tem conta em outra empresa)
- Papéis de acesso por empresa

## 🔔 Notificações
- Central de notificações dentro do sistema
- Notificações push no navegador (Web Push, sem app nativo)

## 📈 Relatórios
- Indicadores de desempenho e gráficos analíticos
- Exportação em Excel (.xlsx) com abas organizadas por assunto

## 🔒 Segurança
- LGPD: exclusão definitiva da empresa e de todos os dados, com confirmação de senha
- Limite de requisições por IP em toda a API
- Auditoria automática de dependências vulneráveis na CI

---

# 🛠️ Tecnologias utilizadas

## Frontend
- React, TypeScript, Vite, TailwindCSS
- React Router DOM, React Query
- Recharts, Framer Motion, Lucide React
- Axios
- Vitest + Testing Library (testes automatizados)

## Backend
- Node.js, Express, TypeScript
- Prisma ORM, PostgreSQL
- JWT + cookies httpOnly, Stripe, Resend (e-mail), Web Push
- ExcelJS, PDFKit
- Vitest (testes automatizados)

---

# 🎨 Design

A interface foi desenvolvida com foco em:

- visual moderno, com modo claro e escuro
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

# 🧪 Testes

```bash
npm run test
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
 ├── utils/
 ├── assets/
tests/
```

---

# 🗺️ Roadmap

- Monitoramento de erros em produção (Sentry)
- Upload de logo da empresa e foto de perfil
- Pipeline de vendas / Kanban de oportunidades

---

# 👨‍💻 Desenvolvido por

- Lucas Lima Santos

---

# 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais, evoluído para um
produto SaaS.
