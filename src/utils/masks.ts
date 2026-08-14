// Máscaras leves para campos brasileiros comuns — sem dependências
// externas. Cada função aceita o valor bruto (pode ter caracteres não
// numéricos) e devolve o texto formatado para exibição no input.

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)

  if (digits.length <= 10) {
    // (11) 1234-5678
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
  }

  // (11) 91234-5678
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
}

export function maskCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14)

  if (digits.length <= 11) {
    // CPF: 123.456.789-00
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }

  // CNPJ: 12.345.678/0001-90
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}

export function maskZipCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  return digits.replace(/(\d{5})(\d)/, "$1-$2")
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "")
}
