import { isAxiosError } from "axios";

// A API sempre responde erro como { message: string } (ver errorHandler.ts
// no backend) — este helper evita repetir a mesma checagem "any" em cada
// catch de cada tela.
export function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const message = err.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return fallback;
}

// Erros 422 do Zod vêm com { message, errors: { campo: [mensagens] } } —
// usado nas telas que mostram o erro do campo específico em vez do genérico.
export function getFieldErrors(err: unknown): Record<string, string[]> | undefined {
  if (isAxiosError(err)) {
    return err.response?.data?.errors as Record<string, string[]> | undefined;
  }
  return undefined;
}

export function getFirstFieldError(err: unknown): string | undefined {
  const fieldErrors = getFieldErrors(err);
  return fieldErrors && Object.values(fieldErrors).flat()[0];
}
