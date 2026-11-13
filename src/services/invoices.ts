import { api, extractPaginated, type PaginatedResult } from "./api";

export interface Invoice {
  id: string;
  type: "RECEIVABLE" | "PAYABLE";
  description: string;
  amount: string | number;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELED";
  method?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  accessKey?: string | null;
  contact?: { id: string; name: string } | null;
  createdAt: string;
}

export interface ParsedNfeDraft {
  accessKey: string;
  model: string;
  issuerName: string;
  issuerDocument: string;
  recipientDocument?: string;
  totalValue: number;
  issueDate: string;
  itemsSummary: string;
  suggestedType: "RECEIVABLE" | "PAYABLE";
}

export interface InvoicesSummary {
  totalReceivable: number;
  totalPayable: number;
  pending: number;
  overdue: number;
}

export async function getInvoices(params?: Record<string, string>): Promise<PaginatedResult<Invoice, InvoicesSummary>> {
  const response = await api.get("/invoices", { params });
  return extractPaginated<Invoice, InvoicesSummary>(response.data);
}


export async function createInvoice(data: Record<string, unknown>) {
  const response = await api.post("/invoices", data);
  return response.data;
}

// Lê o XML de uma NF-e/NFC-e que a empresa já recebeu (não consulta a
// SEFAZ) e devolve um rascunho pra revisar antes de salvar como fatura.
export async function importInvoiceXml(xml: string): Promise<ParsedNfeDraft> {
  const response = await api.post("/invoices/import-xml", xml, {
    headers: { "Content-Type": "text/xml" },
  });
  return response.data?.data as ParsedNfeDraft;
}

 
export async function updateInvoice(id: string, data: Record<string, unknown>) {
  const response = await api.patch(`/invoices/${id}`, data);
  return response.data;
}

export async function markInvoicePaid(id: string, method?: string) {
  const response = await api.patch(`/invoices/${id}/pay`, { method });
  return response.data;
}

export async function deleteInvoice(id: string) {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
}
