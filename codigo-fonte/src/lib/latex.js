/**
 * Conversão de dados numéricos em LaTeX para o KaTeX.
 * Mantém a notação matemática consistente em todo o app.
 */

import { texNum, VARS } from "./formatacao"

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

/** Destaque em azul (mesmo usado nos pivôs). */
function highlight(cell) {
  return String.raw`{\color{#0060df}\mathbf{${cell}}}`
}

/** Corpo de matriz; a coluna `highlightCol` (opcional) é destacada em azul. */
function matrixBody(rows, highlightCol = -1) {
  return rows
    .map((row) =>
      row
        .map((v, c) => (c === highlightCol ? highlight(texNum(v)) : texNum(v)))
        .join(" & "),
    )
    .join(String.raw` \\ `)
}

/** Matriz com colchetes (bmatrix); `highlightCol` destaca uma coluna em azul. */
export function matrixTex(rows, name, highlightCol = -1) {
  const matrix = String.raw`\begin{bmatrix}${matrixBody(rows, highlightCol)}\end{bmatrix}`
  return name ? `${name} = ${matrix}` : matrix
}

/** Determinante com barras verticais (vmatrix). */
export function detTex(rows, highlightCol = -1) {
  return String.raw`\begin{vmatrix}${matrixBody(rows, highlightCol)}\end{vmatrix}`
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
          return pivotSet.has(`${r}:${c}`) ? highlight(cell) : cell
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

/* ---------------- Regra de Cramer · Teorema de Laplace ---------------- */

/** Menor complementar: M_{i1} = |submatriz| = valor. */
export function minorTex(term) {
  const i = term.linha + 1
  return `M_{${i}1} = ${detTex(term.submatriz)} = ${texNum(term.menor)}`
}

/** Cofator: C_{i1} = (-1)^{i+1} · M_{i1} = valor. */
export function cofactorTex(term) {
  const i = term.linha + 1
  return `C_{${i}1} = (-1)^{${i}+1} \\cdot ${parenNum(term.menor)} = ${texNum(term.cofator)}`
}

/** Parcela: a_{i1} · C_{i1} = valor. */
export function termTex(term) {
  const i = term.linha + 1
  return `a_{${i}1} \\cdot C_{${i}1} = ${parenNum(term.elemento)} \\cdot ${parenNum(term.cofator)} = ${texNum(term.parcela)}`
}

/** Soma da expansão: D = Σ a_{i1}·C_{i1}, com os valores do caso. */
export function laplaceSumTex(expansao, D, name = "D") {
  const symbols = expansao.termos.map((t) => `a_{${t.linha + 1}1}C_{${t.linha + 1}1}`)
  const products = expansao.termos.map((t) => `${parenNum(t.elemento)} \\cdot ${parenNum(t.cofator)}`)
  const parts = expansao.termos.map((t) => parenNum(t.parcela))
  const lines = [
    `${name} &= ${symbols.join(" + ")}`,
    `&= ${products.join(" + ")}`,
    `&= ${parts.join(" + ")}`,
    `&= ${texNum(D)}`,
  ]
  return String.raw`\begin{aligned}${lines.join(String.raw` \\ `)}\end{aligned}`
}

/**
 * Regra de Sarrus (3×3) com os elementos substituídos, em linhas curtas:
 * P = soma das diagonais principais, S = soma das secundárias, D = P − S.
 */
export function sarrusTex(M, value, name = "D") {
  const [[a, b, c], [d, e, f], [g, h, i]] = M
  const diagonals = (list) => {
    const products = list.map(([x, y, z]) => `${parenNum(x)} \\cdot ${parenNum(y)} \\cdot ${parenNum(z)}`)
    const values = list.map(([x, y, z]) => x * y * z)
    const total = values.reduce((sum, v) => sum + v, 0)
    return { products: products.join(" + "), values: values.map(parenNum).join(" + "), total }
  }
  const P = diagonals([[a, e, i], [b, f, g], [c, d, h]])
  const S = diagonals([[c, e, g], [a, f, h], [b, d, i]])
  const lines = [
    "P &= a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32}",
    `&= ${P.products}`,
    `&= ${P.values} = ${texNum(P.total)}`,
    "S &= a_{13}a_{22}a_{31} + a_{11}a_{23}a_{32} + a_{12}a_{21}a_{33}",
    `&= ${S.products}`,
    `&= ${S.values} = ${texNum(S.total)}`,
    `${name} &= P - S = ${parenNum(P.total)} - ${parenNum(S.total)} = ${texNum(value)}`,
  ]
  return String.raw`\begin{aligned}${lines.join(String.raw` \\ `)}\end{aligned}`
}

/** Quociente da Regra de Cramer: x = Dx / D = valor. */
export function cramerQuotientTex(variable, Di, D, value) {
  return `${variable} = \\dfrac{D_{${variable}}}{D} = \\dfrac{${texNum(Di)}}{${texNum(D)}} = ${texNum(value)}`
}

/** Substituição da solução no lado esquerdo de uma equação. */
export function substitutionTex(row, x, leftSide) {
  const parts = row.map((a, j) => `${parenNum(a)} \\cdot ${parenNum(x[j])}`)
  return `${parts.join(" + ")} = ${texNum(leftSide)}`
}
