import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "../src/components/Toast";

function TriggerButtons() {
  const toast = useToast();
  return (
    <>
      <button onClick={() => toast.success("Salvo com sucesso!")}>disparar sucesso</button>
      <button onClick={() => toast.error("Algo deu errado.")}>disparar erro</button>
    </>
  );
}

describe("Toast", () => {
  it("mostra um toast de sucesso ao chamar toast.success", async () => {
    render(
      <ToastProvider>
        <TriggerButtons />
      </ToastProvider>
    );

    await userEvent.click(screen.getByText("disparar sucesso"));

    expect(await screen.findByText("Salvo com sucesso!")).toBeInTheDocument();
  });

  it("mostra um toast de erro ao chamar toast.error", async () => {
    render(
      <ToastProvider>
        <TriggerButtons />
      </ToastProvider>
    );

    await userEvent.click(screen.getByText("disparar erro"));

    expect(await screen.findByText("Algo deu errado.")).toBeInTheDocument();
  });

  it("remove o toast ao clicar no X", async () => {
    render(
      <ToastProvider>
        <TriggerButtons />
      </ToastProvider>
    );

    await userEvent.click(screen.getByText("disparar sucesso"));
    const message = await screen.findByText("Salvo com sucesso!");
    expect(message).toBeInTheDocument();

    const closeButton = message.closest("div[class*='pointer-events-auto']")?.querySelector("button");
    if (closeButton) await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Salvo com sucesso!")).not.toBeInTheDocument();
    });
  });
});
