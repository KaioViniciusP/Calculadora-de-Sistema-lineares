/**
 * Núcleo matemático da calculadora.
 *
 * Implementa:
 *  - leitura/validação de números (vírgula, ponto, frações e expoentes);
 *  - eliminação de Gauss-Jordan com pivoteamento parcial;
 *  - cálculo dos postos de A e (A|B) e classificação SPD/SPI/SI;
 *  - solução paramétrica para sistemas possíveis e indeterminados;
 *  - utilidades de formatação (texto e LaTeX) e de enquadramento do gráfico.
 *
 * Todas as funções são puras — nenhum resultado é predefinido.
 */

export const VARS = ["x", "y", "z", "w", "v"]
export const SUB = ["₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈"]
export const PARAM_NAMES = ["t", "s", "u", "r", "q"]

const EPS = 1e-9

/** Zera valores irrelevantes (ruído numérico). */
export function cleanZero(value, tolerance = 1e-12) {
  return Math.abs(value) < tolerance ? 0 : value
}

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

/** Converte o texto digitado em número (aceita 1/2, -3,5, 2e3, −4). */
export function parseNumber(raw) {
  if (raw === null || raw === undefined) return NaN
  let text = String(raw).trim()
  if (text === "") return 0
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

/** Próximo passo "redondo" (1, 2, 5 × 10^k) para grades. */
export function niceStep(raw) {
  if (!(raw > 0) || !Number.isFinite(raw)) return 1
  const power = 10 ** Math.floor(Math.log10(raw))
  const mantissa = raw / power
  let nice
  if (mantissa <= 1) nice = 1
  else if (mantissa <= 2) nice = 2
  else if (mantissa <= 5) nice = 5
  else nice = 10
  return nice * power
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

/** Junta tudo o que a interface precisa saber sobre um sistema resolvido. */
export function solveSystem(A, b) {
  const res = gaussJordan(A, b)
  const classification = classify(res)
  const solution = buildParametricSolution(res)
  return { A, b, res, classification, solution }
}

/** Verifica se todas as retas desenhadas são coincidentes. */
export function linesCoincident(lines) {
  if (lines.length < 2) return false
  const keyOf = (line) => {
    const norm = Math.hypot(line.a, line.b)
    if (norm < 1e-12) return null
    let k = [line.a / norm, line.b / norm, line.c / norm]
    const firstNonZero = k[0] !== 0 ? k[0] : k[1]
    if (firstNonZero < 0) k = k.map((v) => -v)
    return k.map((v) => (Math.abs(v) < 1e-9 ? 0 : v.toFixed(6))).join("|")
  }
  const first = keyOf(lines[0])
  if (!first) return false
  return lines.every((line) => keyOf(line) === first)
}

/** Retângulo de visualização e passo da grade para o gráfico. */
export function computeView(A, b, point) {
  const anchors = []
  for (let i = 0; i < A.length; i += 1) {
    const a = A[i][0]
    const bb = A[i][1]
    const c = b[i]
    const den = a * a + bb * bb
    if (den > 1e-24) anchors.push({ x: (a * c) / den, y: (bb * c) / den })
  }
  if (point) anchors.push(point)

  if (!anchors.length) return { x: [-5, 5], y: [-5, 5], step: 1 }

  const cx = anchors.reduce((sum, p) => sum + p.x, 0) / anchors.length
  const cy = anchors.reduce((sum, p) => sum + p.y, 0) / anchors.length

  let radius = 3
  for (let i = 0; i < A.length; i += 1) {
    const norm = Math.hypot(A[i][0], A[i][1])
    if (norm < 1e-12) continue
    const distance = Math.abs(A[i][0] * cx + A[i][1] * cy - b[i]) / norm
    radius = Math.max(radius, distance)
  }
  if (point) radius = Math.max(radius, Math.hypot(point.x - cx, point.y - cy))

  const span = Math.max(4, radius * 1.85)
  return {
    x: [cx - span, cx + span],
    y: [cy - span, cy + span],
    step: niceStep((2 * span) / 8),
  }
}

/** Dois pontos (bem distantes) sobre a reta a·x + b·y = c. */
export function lineEndpoints(a, bb, c, view) {
  const den = a * a + bb * bb
  if (den < 1e-24) return null

  const px = (a * c) / den
  const py = (bb * c) / den
  const dx = bb
  const dy = -a
  const reach =
    25 * Math.max(view.x[1] - view.x[0], view.y[1] - view.y[0]) + 1

  return [
    [px - dx * reach, py - dy * reach],
    [px + dx * reach, py + dy * reach],
  ]
}
