/**
 * Escalonamento: eliminação de Gauss-Jordan e classificação do sistema.
 *
 * Implementa:
 *  - eliminação de Gauss-Jordan com pivoteamento parcial;
 *  - cálculo dos postos de A e (A|B) e classificação SPD/SPI/SI;
 *  - solução paramétrica para sistemas possíveis e indeterminados;
 *  - integração com a Regra de Cramer (lib/cramer.js) em solveSystem.
 *
 * Todas as funções são puras — nenhum resultado é predefinido. Não dependem
 * de interface, formatação, LaTeX ou gráfico.
 */

import { detSarrus, resolverCramer, verificarSolucao } from "./cramer"

export const PARAM_NAMES = ["t", "s", "u", "r", "q"]

export const EPS = 1e-9

/** Zera valores irrelevantes (ruído numérico). */
export function cleanZero(value, tolerance = 1e-12) {
  return Math.abs(value) < tolerance ? 0 : value
}

/**
 * Eliminação de Gauss-Jordan com pivoteamento parcial.
 * @param {number[][]} A matriz m×n
 * @param {number[]} b vetor m
 */
export function gaussJordan(A, b) {
  const m = A.length
  const n = A[0].length

  let maxAbs = 0
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) maxAbs = Math.max(maxAbs, Math.abs(A[i][j]))
  }
  // Tolerância relativa baseada apenas em A: termos independentes grandes
  // não devem zerar coeficientes legítimos.
  const tolerance = maxAbs > 0 ? EPS * maxAbs : 1e-12

  let M = A.map((row, i) => [...row, b[i]])
  const steps = []
  const pivotCols = []
  let row = 0

  for (let col = 0; col < n && row < m; col += 1) {
    let pivot = row
    for (let i = row + 1; i < m; i += 1) {
      if (Math.abs(M[i][col]) > Math.abs(M[pivot][col])) pivot = i
    }

    if (Math.abs(M[pivot][col]) <= tolerance) {
      for (let i = row; i < m; i += 1) M[i][col] = 0
      continue
    }

    if (pivot !== row) {
      const swap = M[row]
      M[row] = M[pivot]
      M[pivot] = swap
      steps.push({
        type: "swap",
        from: pivot,
        to: row,
        text: `Troca de linhas para trazer o maior pivô da coluna ${col + 1}.`,
        matrix: M.map((r) => [...r]),
      })
    }

    const p = M[row][col]
    if (Math.abs(p - 1) > tolerance) {
      M[row] = M[row].map((v) => cleanZero(v / p, tolerance))
      steps.push({
        type: "scale",
        row,
        divisor: p,
        text: `Normaliza o pivô da coluna ${col + 1} para 1.`,
        matrix: M.map((r) => [...r]),
      })
    }

    for (let i = 0; i < m; i += 1) {
      if (i === row) continue
      const factor = M[i][col]
      if (Math.abs(factor) <= tolerance) continue
      M[i] = M[i].map((v, j) => cleanZero(v - factor * M[row][j], tolerance))
      steps.push({
        type: "eliminate",
        row: i,
        source: row,
        factor,
        col,
        text: `Zera o elemento da linha ${i + 1}, coluna ${col + 1}.`,
        matrix: M.map((r) => [...r]),
      })
    }

    pivotCols.push(col)
    row += 1
  }

  M = M.map((r) => r.map((v) => cleanZero(v, tolerance)))

  const inconsistentRows = []
  for (let i = 0; i < m; i += 1) {
    let allZero = true
    for (let j = 0; j < n; j += 1) {
      if (Math.abs(M[i][j]) > tolerance) {
        allZero = false
        break
      }
    }
    if (allZero && Math.abs(M[i][n]) > tolerance) inconsistentRows.push(i)
  }

  const rankA = pivotCols.length
  const inconsistent = inconsistentRows.length > 0

  return {
    M,
    steps,
    pivotCols,
    tolerance,
    rankA,
    rankAug: inconsistent ? rankA + 1 : rankA,
    inconsistent,
    inconsistentRows,
    m,
    n,
    startMatrix: A.map((r, i) => [...r, b[i]]),
  }
}

/** Classifica o sistema a partir dos postos. */
export function classify(res) {
  if (res.inconsistent) return "SI"
  if (res.rankA < res.n) return "SPI"
  return "SPD"
}

/** Expressão simbólica: { constant, terms: [{ name, coef }] }. */
export function buildParametricSolution(res) {
  const { M, n, pivotCols } = res
  const freeCols = []
  for (let j = 0; j < n; j += 1) if (!pivotCols.includes(j)) freeCols.push(j)

  const paramOf = new Map()
  freeCols.forEach((col, index) => {
    paramOf.set(col, PARAM_NAMES[index] || `p${index + 1}`)
  })

  const exprs = []
  for (let j = 0; j < n; j += 1) {
    if (paramOf.has(j)) {
      exprs.push({ constant: 0, terms: [{ name: paramOf.get(j), coef: 1 }] })
      continue
    }
    const line = pivotCols.indexOf(j)
    const expr = { constant: cleanZero(M[line][n], res.tolerance), terms: [] }
    freeCols.forEach((free) => {
      const coef = cleanZero(-M[line][free], res.tolerance)
      if (coef !== 0) expr.terms.push({ name: paramOf.get(free), coef })
    })
    exprs.push(expr)
  }

  return {
    freeCols,
    params: freeCols.map((col) => paramOf.get(col)),
    exprs,
    isConstant: freeCols.length === 0,
  }
}

/**
 * Regra de Cramer para o sistema: só se aplica a sistemas quadrados (m = n).
 * Acrescenta a verificação por substituição (quando D ≠ 0) e o determinante
 * por Sarrus (quando 3×3).
 */
function cramerDoSistema(A, b) {
  if (A.length !== A[0].length) return { aplicavel: false, motivo: "nao-quadrado" }
  const cramer = resolverCramer(A, b)
  if (cramer.aplicavel) cramer.verificacao = verificarSolucao(A, b, cramer.solucao)
  if (A.length === 3) cramer.sarrus = detSarrus(A)
  return cramer
}

/** Junta tudo o que a interface precisa saber sobre um sistema resolvido. */
export function solveSystem(A, b) {
  const res = gaussJordan(A, b)
  const classification = classify(res)
  const solution = buildParametricSolution(res)
  const cramer = cramerDoSistema(A, b)
  return { A, b, res, classification, solution, cramer }
}

