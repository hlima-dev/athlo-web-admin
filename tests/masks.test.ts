import { describe, it, expect } from "vitest";
import { maskPhone, maskCpfCnpj, maskZipCode, onlyDigits } from "../src/utils/masks";

describe("utils/masks — maskPhone", () => {
  it("formata telefone fixo (10 dígitos)", () => {
    expect(maskPhone("1133334444")).toBe("(11) 3333-4444");
  });

  it("formata celular (11 dígitos)", () => {
    expect(maskPhone("11999998888")).toBe("(11) 99999-8888");
  });

  it("formata parcialmente enquanto o usuário ainda está digitando", () => {
    expect(maskPhone("11999")).toBe("(11) 999");
  });

  it("ignora caracteres não numéricos já digitados", () => {
    expect(maskPhone("(11) 99999-8888")).toBe("(11) 99999-8888");
  });

  it("corta dígitos além do limite de 11", () => {
    expect(maskPhone("11999998888999")).toBe("(11) 99999-8888");
  });

  it("string vazia continua vazia", () => {
    expect(maskPhone("")).toBe("");
  });
});

describe("utils/masks — maskCpfCnpj", () => {
  it("formata CPF (11 dígitos)", () => {
    expect(maskCpfCnpj("12345678900")).toBe("123.456.789-00");
  });

  it("formata CNPJ (14 dígitos) automaticamente ao passar de 11 dígitos", () => {
    expect(maskCpfCnpj("12345678000190")).toBe("12.345.678/0001-90");
  });

  it("formata parcialmente um CPF incompleto", () => {
    expect(maskCpfCnpj("123456")).toBe("123.456");
  });

  it("corta dígitos além do limite de 14 (CNPJ)", () => {
    expect(maskCpfCnpj("123456780001900000")).toBe("12.345.678/0001-90");
  });
});

describe("utils/masks — maskZipCode", () => {
  it("formata CEP completo", () => {
    expect(maskZipCode("01310100")).toBe("01310-100");
  });

  it("formata CEP parcial", () => {
    expect(maskZipCode("0131")).toBe("0131");
  });

  it("corta dígitos além do limite de 8", () => {
    expect(maskZipCode("013101009999")).toBe("01310-100");
  });
});

describe("utils/masks — onlyDigits", () => {
  it("remove tudo que não é dígito", () => {
    expect(onlyDigits("(11) 99999-8888")).toBe("11999998888");
    expect(onlyDigits("123.456.789-00")).toBe("12345678900");
  });

  it("mantém string já numérica intacta", () => {
    expect(onlyDigits("12345")).toBe("12345");
  });
});
