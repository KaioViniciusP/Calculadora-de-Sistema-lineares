/**
 * Conversão de dados numéricos em LaTeX para o KaTeX.
 * Mantém a notação matemática consistente em todo o app.
 */

import { texNum, VARS } from "./solver"

const plus = (negative) => (negative ? "-" : "+")

/** Coeficientes de um lado da equação: 2x - y + 0{,}5z */
export function linearExprTex(coeffs, vars = VARS) {
  const parts = []
  coeffs.forEach((value, index) => {
    if (Math.abs(value) < 1e-12) return
    const negative = value < 0
    const magnitude = Math.abs(value)
    const coef = Math.abs(magnitude - 1) < 1e-12 ? "" : texNum(magnitude)
    const term = `${coef}${vars[index]}`
    if (parts.length === 0) parts.push(`${negative ? "-" : ""}${term}`)
    else parts.push(`${plus(negative)} ${term}`)
  })
  return parts.length ? parts.join(" ") : "0"
}

/** Sistema completo em notação de chaves com alinhamento no "=". */
export function systemTex(A, b, vars = VARS) {
  const rows = A.map(
    (row, index) => `${linearExprTex(row, vars)} &= ${texNum(b[index])}`,
  )
  return `\\left\\{\\begin{aligned}${rows.join(" \\\\ ")}\\end{aligned}\\right.`
}

/** Matriz com colchetes (bmatrix). */
export function matrixTex(rows, name) {
  const body = rows
    .map((row) => row.map((v) => texNum(v)).join(" & "))
    .join(String.raw` \\ `)
  const matrix = String.raw`\begin{bmatrix}${body}\end{bmatrix}`
  return name ? `${name} = ${matrix}` : matrix
}

/** Vetor coluna. */
export function vectorTex(values, name) {
  return matrixTex(values.map((v) => [v]), name)
}

/** Vetor coluna de símbolos (incógnitas). */
export function variableVectorTex(vars, name) {
  const matrix = String.raw`\begin{bmatrix}${vars.join(String.raw` \\ `)}\end{bmatrix}`
  return name ? `${name} = ${matrix}` : matrix
}

/**
 * Matriz ampliada com barra vertical antes da última coluna.
 * `pivots` é uma lista de [linha, coluna] destacada em azul.
 */
export function augmentedTex(rows, columns, pivots = []) {
  const spec = `${"c".repeat(columns)}|c`
  const pivotSet = new Set(pivots.map(([r, c]) => `${r}:${c}`))
  const body = rows
    .map((row, r) =>
      row
        .map((value, c) => {
          const cell = texNum(value)
          return pivotSet.has(`${r}:${c}`)
            ? String.raw`{\color{#0060df}\mathbf{${cell}}}`
            : cell
        })
        .join(" & "),
    )
    .join(String.raw` \\ `)
  return String.raw`\left[\begin{array}{${spec}}${body}\end{array}\right]`
}

/** Número entre parênteses quando negativo. */
function parenNum(value) {
  return value < 0 ? `\\left(${texNum(value)}\\right)` : texNum(value)
}

/** Operação elementar entre linhas. */
export function stepTex(step) {
  const L = (i) => `L_{${i + 1}}`
  switch (step.type) {
    case "swap":
      return `${L(step.to)} \\leftrightarrow ${L(step.from)}`
    case "scale":
      return `${L(step.row)} \\leftarrow ${L(step.row)} \\div ${parenNum(step.divisor)}`
    case "eliminate":
      return `${L(step.row)} \\leftarrow ${L(step.row)} - ${parenNum(step.factor)}\\,${L(step.source)}`
    default:
      return ""
  }
}

/** Expressão simbólica (solução paramétrica). */
export function paramExprTex(expr) {
  let out = ""
  let hasTerm = false

  if (Math.abs(expr.constant) > 1e-12) {
    out += `${expr.constant < 0 ? "-" : ""}${texNum(Math.abs(expr.constant))}`
    hasTerm = true
  }

  expr.terms.forEach((term) => {
    if (Math.abs(term.coef) < 1e-12) return
    const negative = term.coef < 0
    const magnitude = Math.abs(term.coef)
    const coef = Math.abs(magnitude - 1) < 1e-12 ? "" : texNum(magnitude)
    const piece = `${coef}${term.name}`
    if (!hasTerm) {
      out += `${negative ? "-" : ""}${piece}`
      hasTerm = true
    } else {
      out += negative ? ` - ${piece}` : ` + ${piece}`
    }
  })

  return hasTerm ? out : "0"
}

/** Conjunto solução em LaTeX. */
export function solutionTex(solution, classification) {
  if (classification === "SI") return String.raw`S = \varnothing`

  if (classification === "SPD") {
    const values = solution.exprs.map((expr) => texNum(expr.constant)).join(";\\ ")
    return String.raw`S = \left\{\left(${values}\right)\right\}`
  }

  const values = solution.exprs.map((expr) => paramExprTex(expr)).join(";\\ ")
  const params = solution.params.length > 1
    ? `${solution.params.join(",\\ ")} \\in \\mathbb{R}`
    : `${solution.params[0]} \\in \\mathbb{R}`
  return String.raw`S = \left\{\left(${values}\right) \mid ${params}\right\}`
}

/** Critério de classificação, na forma simbólica e com os valores do caso. */
export function criterionTex(res, classification) {
  const rankA = String.raw`\operatorname{posto}(A)`
  const rankAug = String.raw`\operatorname{posto}(A|B)`

  if (classification === "SPI") {
    return `${rankA} = ${rankAug} < n \\;\\Rightarrow\\; ${res.rankA} = ${res.rankAug} < ${res.n}`
  }
  if (classification === "SI") {
    return `${rankA} \\neq ${rankAug} \\;\\Rightarrow\\; ${res.rankA} \\neq ${res.rankAug}`
  }
  return `${rankA} = ${rankAug} = n \\;\\Rightarrow\\; ${res.rankA} = ${res.rankAug} = ${res.n}`
}
