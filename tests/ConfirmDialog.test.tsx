import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "../src/components/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("não renderiza nada quando open=false", () => {
    const { container } = render(
      <ConfirmDialog
        open={false}
        title="Excluir contato"
        description="Tem certeza?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("mostra título e descrição quando open=true", () => {
    render(
      <ConfirmDialog
        open
        title="Excluir contato"
        description="Essa ação não pode ser desfeita."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText("Excluir contato")).toBeInTheDocument();
    expect(screen.getByText("Essa ação não pode ser desfeita.")).toBeInTheDocument();
  });

  it("chama onConfirm ao clicar em confirmar", async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Excluir"
        description="..."
        confirmLabel="Excluir"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Excluir" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("chama onCancel ao clicar em cancelar", async () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Excluir"
        description="..."
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("desabilita os botões e mostra 'Aguarde...' quando loading", () => {
    render(
      <ConfirmDialog
        open
        loading
        title="Excluir"
        description="..."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Aguarde..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });
});
