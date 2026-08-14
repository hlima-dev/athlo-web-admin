import { api } from "./api";

export interface Plan {
  id: string;
  name: string;
  slug: string;
  priceMonthly: string | number;
  priceYearly: string | number;
  maxUsers: number;
  maxContacts: number;
  features?: string[] | null;
}

export interface Subscription {
  id: string;
  status: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
  plan: Plan;
}

export async function getPlans(): Promise<Plan[]> {
  const response = await api.get("/plans");
  return response.data.data ?? [];
}

export async function getSubscription(): Promise<Subscription> {
  const response = await api.get("/plans/subscription");
  return response.data.data;
}

export async function changePlan(planSlug: string) {
  const response = await api.post("/plans/subscription/change", { planSlug });
  return response.data;
}

export async function cancelSubscription() {
  const response = await api.post("/plans/subscription/cancel");
  return response.data;
}

// Cria uma sessão de Stripe Checkout e retorna a URL de pagamento —
// o chamador deve redirecionar (window.location.href = url).
export async function checkoutPlan(planSlug: string): Promise<string> {
  const response = await api.post("/plans/subscription/checkout", { planSlug });
  return response.data.data.url;
}

// Cria uma sessão do Stripe Billing Portal (gerenciar cartão, cancelar,
// ver faturas) e retorna a URL — o chamador deve redirecionar.
export async function openBillingPortal(): Promise<string> {
  const response = await api.post("/plans/subscription/portal");
  return response.data.data.url;
}
