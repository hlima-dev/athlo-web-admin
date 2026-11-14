# ATHLO — Gestão para pequenas e médias empresas

SaaS multi-tenant para PMEs administrarem contatos, financeiro, produtos,
pedidos e agenda em um só lugar. Cada empresa que assina tem seus dados
isolados, controle de acesso por papel (dono/admin/membro) e cobrança real
via Stripe. Um mesmo login pode dar acesso a mais de uma empresa (útil pra
quem tem várias unidades/CNPJs), com um seletor pra trocar entre elas.

React + TypeScript + Vite no front, Express + Prisma + PostgreSQL no back.

## Demo

- Frontend: https://athlo-web-admin-fdizioprj-hlima-dev1.vercel.app/
- API: https://athlo-backend-r176.onrender.com

O login de demonstração não é publicado aqui porque esse ambiente ao
vivo usa Stripe em modo **live** (cobrança real) — ver
[`athlo-backend`](https://github.com/hlima-dev/athlo-backend) pra rodar
localmente com o seed de demonstração.

A API roda no plano free do Render, então o primeiro request depois de um
tempo parado pode demorar ~1 min pra "acordar".

## O que tem

- Contatos (CRM), financeiro (contas a pagar/receber), catálogo de
  produtos, pedidos e agenda — com PDF de fatura/pedido e máscaras de
  telefone/CPF/CNPJ nos formulários
- Assinatura paga de verdade: Checkout do Stripe, portal de cobrança,
  webhooks ativando/cancelando o plano, bloqueio de escrita quando o
  trial acaba
- Login pode acessar mais de uma empresa (Membership) — tela de seleção
  e botão de trocar de unidade na sidebar
- Sessão em cookie httpOnly + CSRF, bloqueio de conta após tentativas de
  senha erradas seguidas, rate limit em toda a API
- Verificação de e-mail e convite de equipe (inclusive pra quem já tem
  conta em outra empresa)
- Notificação de compromisso da agenda: dentro do sistema + push no
  navegador (funciona no notebook e no celular, sem app nativo)
- Painel separado pra administração da plataforma (visão de todas as
  empresas clientes, MRR, suspender conta, log de erros 5xx com filtro
  e busca)
- Exportação de relatórios em Excel
- Exclusão de conta/empresa (LGPD)
- Testes automatizados (Vitest) e CI

## Rodando local

```bash
git clone https://github.com/hlima-dev/athlo-web-admin.git
cd athlo-web-admin
npm install
cp .env.example .env   # aponta pra API de demo por padrão
npm run dev
```

Outros comandos: `npm run build`, `npm run test`.

## Stack

React, TypeScript, Vite, TailwindCSS, React Router, React Query, Recharts,
Axios. Testes com Vitest + Testing Library.

## Estrutura

```
src/
 ├── components/
 ├── hooks/
 ├── layouts/
 ├── pages/
 ├── routes/
 ├── services/
 └── utils/
tests/
```

## Falta

- Upload de logo/avatar
- Pipeline de vendas / Kanban

---

Lucas Lima Santos
