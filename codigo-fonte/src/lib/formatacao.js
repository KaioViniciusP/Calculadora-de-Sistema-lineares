/**
 * Leitura e formatação de números.
 *
 * Implementa:
 *  - leitura/validação do texto digitado (vírgula, ponto, frações e expoentes);
 *  - formatação para exibição em português e para LaTeX;
 *  - nomes das incógnitas e índices subscritos.
 */

export const VARS = ["x", "y", "z", "w", "v"]
export const SUB = ["₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈"]

/** Formata número para exibição em português (vírgula decimal). */
export function fmt(value, digits = 6) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—"
  if (!Number.isFinite(value)) return value > 0 ? "∞" : "−∞"
  if (Math.abs(value) < 1e-12) value = 0

  const abs = Math.abs(value)
  if (abs !== 0 && (abs < 1e-4 || abs >= 1e7)) {
    return value
      .toExponential(4)
      .replace(/\.?0+e/, "e")
      .replace(".", ",")
      .replace("e-", "e−")
      .replace("e+", "e")
  }

  let out = value.toFixed(digits)
  if (out.includes(".")) out = out.replace(/0+$/, "").replace(/\.$/, "")
  if (out === "-0") out = "0"
  return out.replace(".", ",")
}

/** Formata número para LaTeX (vírgula decimal sem espaçamento). */
export function texNum(value, digits = 4) {
  if (value === null || value === undefined || Number.isNaN(value)) return "\\text{—}"
  if (!Number.isFinite(value)) return value > 0 ? "\\infty" : "-\\infty"
  if (Math.abs(value) < 1e-12) value = 0

  const abs = Math.abs(value)
  if (abs !== 0 && (abs < 1e-4 || abs >= 1e7)) {
    const exp = value
      .toExponential(2)
      .replace(/\.?0+e/, "e")
      .replace(".", "{,}")
      .replace("e-", "e-")
      .replace("e+", "e")
    return exp
  }

  let out = value.toFixed(digits)
  if (out.includes(".")) out = out.replace(/0+$/, "").replace(/\.$/, "")
  if (out === "-0") out = "0"
  return out.replace(".", "{,}")
}

/**
 * Converte o texto digitado em número (aceita 1/2, -3,5, 2e3, −4).
 * Campo vazio é inválido (NaN): o usuário deve digitar 0 para coeficientes nulos.
 */
export function parseNumber(raw) {
  if (raw === null || raw === undefined) return NaN
  let text = String(raw).trim()
  if (text === "") return NaN
  text = text.replace(/\s+/g, "").replace(/−/g, "-").replace(/,/g, ".")

  const fraction = text.match(
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\/([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/,
  )
  if (fraction) {
    const numerator = parseFloat(fraction[1])
    const denominator = parseFloat(fraction[2])
    return denominator === 0 ? NaN : numerator / denominator
  }

  if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) {
    return parseFloat(text)
  }
  return NaN
}
