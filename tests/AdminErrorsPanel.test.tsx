import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminErrorsPanel } from "../src/components/AdminErrorsPanel";
import { ToastProvider } from "../src/components/Toast";

const { listAdminErrors, resolveAdminError } = vi.hoisted(() => ({
  listAdminErrors: vi.fn(),
  resolveAdminError: vi.fn(),
}));

vi.mock("../src/services/admin", () => ({
  listAdminErrors,
  resolveAdminError,
}));

const sampleError = {
  id: "err_1",
  message: "Cannot read properties of undefined",
  stack: "Error: Cannot read properties of undefined\n  at handler (/app/src/x.ts:10:5)",
  statusCode: 500,
  method: "GET",
  path: "/api/v1/contacts",
  resolvedAt: null,
  createdAt: "2026-01-01T12:00:00.000Z",
  user: { id: "u1", name: "Ana", email: "ana@x.com" },
  organization: { id: "o1", name: "Empresa X" },
};

function renderPanel() {
  return render(
    <ToastProvider>
      <AdminErrorsPanel />
    </ToastProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AdminErrorsPanel", () => {
  it("mostra estado vazio quando não há erros pendentes", async () => {
    listAdminErrors.mockResolvedValueOnce([]);
    renderPanel();

    await waitFor(() => expect(screen.getByText("Nenhum erro pendente.")).toBeInTheDocument());
  });

  it("lista os erros retornados com rota e autor", async () => {
    listAdminErrors.mockResolvedValueOnce([sampleError]);
    renderPanel();

    await waitFor(() =>
      expect(screen.getByText("Cannot read properties of undefined")).toBeInTheDocument(),
    );
    expect(screen.getByText("GET /api/v1/contacts")).toBeInTheDocument();
    expect(screen.getByText(/Ana/)).toBeInTheDocument();
  });

  it("marca como resolvido e remove da lista", async () => {
    listAdminErrors.mockResolvedValueOnce([sampleError]);
    resolveAdminError.mockResolvedValueOnce({ ...sampleError, resolvedAt: "2026-01-02T00:00:00.000Z" });
    renderPanel();

    await waitFor(() => expect(screen.getByText("Resolver")).toBeInTheDocument());
    await userEvent.click(screen.getByText("Resolver"));

    await waitFor(() => expect(resolveAdminError).toHaveBeenCalledWith("err_1"));
    await waitFor(() => expect(screen.queryByText("Resolver")).not.toBeInTheDocument());
  });

  it("refaz a busca ao trocar o filtro", async () => {
    listAdminErrors.mockResolvedValue([]);
    renderPanel();

    await waitFor(() => expect(listAdminErrors).toHaveBeenCalledTimes(1));
    await userEvent.click(screen.getByText("Todos"));

    await waitFor(() => expect(listAdminErrors).toHaveBeenCalledTimes(2));
    expect(listAdminErrors).toHaveBeenLastCalledWith(
      expect.objectContaining({ resolved: undefined }),
    );
  });
});
