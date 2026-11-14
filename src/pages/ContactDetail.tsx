import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Mail, MapPin, Phone } from "lucide-react";

import { getContactById, type ContactDetail as ContactDetailType } from "../services/contacts";
import {
  Badge,
  type BadgeTone,
  Card,
  CardHeader,
  PageContainer,
  SkeletonRows,
  StatStrip,
} from "../components/ui";

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}

const contactTypeLabels: Record<string, string> = {
  LEAD: "Lead",
  CUSTOMER: "Cliente",
  SUPPLIER: "Fornecedor",
};

const invoiceStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Paga",
  OVERDUE: "Vencida",
  CANCELED: "Cancelada",
};

const invoiceStatusTones: Record<string, BadgeTone> = {
  PENDING: "warn",
  PAID: "positive",
  OVERDUE: "negative",
  CANCELED: "neutral",
};

const orderStatusLabels: Record<string, string> = {
  CREATED: "Criado",
  CONFIRMED: "Confirmado",
  IN_PREPARATION: "Em preparo",
  OUT_FOR_DELIVERY: "Saiu para entrega",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

const eventStatusLabels: Record<string, string> = {
  SCHEDULED: "Agendado",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado",
};

export function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<ContactDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
    setLoading(true);
    setError("");
    getContactById(id)
      .then(setContact)
      .catch(() => setError("Erro ao carregar os dados do contato."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PageContainer>
      <Link
        to="/contatos"
        className="flex w-fit items-center gap-1.5 text-[12.5px] text-muted transition hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark"
      >
        <ArrowLeft size={14} />
        Voltar para Contatos
      </Link>

      {loading ? (
        <Card>
          <SkeletonRows rows={4} cols={2} />
        </Card>
      ) : error || !contact ? (
        <Card>
          <div className="p-5 text-[13px] text-danger dark:text-danger-dark">
            {error || "Contato não encontrado."}
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[18px] font-semibold tracking-tight">{contact.name}</h1>
                  <Badge tone={contact.type === "CUSTOMER" ? "positive" : contact.type === "SUPPLIER" ? "accent" : "info"}>
                    {contactTypeLabels[contact.type] || contact.type}
                  </Badge>
                  <Badge tone={contact.status === "ACTIVE" ? "positive" : "neutral"}>
                    {contact.status === "ACTIVE" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-muted dark:text-muted-dark">
                  {contact.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} />
                      {contact.email}
                    </span>
                  )}
                  {contact.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={13} />
                      {contact.phone}
                    </span>
                  )}
                  {contact.company && (
                    <span className="flex items-center gap-1.5">
                      <Building2 size={13} />
                      {contact.company}
                    </span>
                  )}
                  {(contact.city || contact.state) && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      {[contact.city, contact.state].filter(Boolean).join(" - ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <StatStrip
            items={[
              {
                label: "Saldo em aberto",
                value: toCurrency(contact.balanceDue),
                tone: contact.balanceDue > 0 ? "danger" : "default",
              },
              { label: "Faturas", value: String(contact.invoices.length) },
              { label: "Pedidos", value: String(contact.orders.length) },
              { label: "Compromissos", value: String(contact.events.length) },
            ]}
          />

          <Card>
            <CardHeader title="Faturas" subtitle="Últimas 20 faturas ligadas a este contato." />
            {contact.invoices.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-muted dark:text-muted-dark">Nenhuma fatura ainda.</p>
            ) : (
              <ul className="divide-y divide-line dark:divide-line-dark">
                {contact.invoices.map((invoice) => (
                  <li key={invoice.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">{invoice.description}</p>
                      <p className="text-[12px] text-muted dark:text-muted-dark">
                        Vence em {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[13px] font-medium tabular-nums">
                        {toCurrency(Number(invoice.amount || 0))}
                      </span>
                      <Badge tone={invoiceStatusTones[invoice.status] ?? "neutral"}>
                        {invoiceStatusLabels[invoice.status] || invoice.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Pedidos" subtitle="Últimos 20 pedidos ligados a este contato." />
            {contact.orders.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-muted dark:text-muted-dark">Nenhum pedido ainda.</p>
            ) : (
              <ul className="divide-y divide-line dark:divide-line-dark">
                {contact.orders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <p className="text-[12px] text-muted dark:text-muted-dark">{formatDate(order.createdAt)}</p>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[13px] font-medium tabular-nums">
                        {toCurrency(Number(order.total || 0))}
                      </span>
                      <Badge tone="neutral">{orderStatusLabels[order.status] || order.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Compromissos" subtitle="Últimos 20 compromissos ligados a este contato." />
            {contact.events.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-muted dark:text-muted-dark">Nenhum compromisso ainda.</p>
            ) : (
              <ul className="divide-y divide-line dark:divide-line-dark">
                {contact.events.map((event) => (
                  <li key={event.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <p className="truncate text-[13px] font-medium">{event.title}</p>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[12px] text-muted dark:text-muted-dark">
                        {formatDate(event.startDate)}
                      </span>
                      <Badge tone="neutral">{eventStatusLabels[event.status] || event.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </PageContainer>
  );
}
