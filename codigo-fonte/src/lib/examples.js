/** Exemplos prontos e utilidades para a grade de coeficientes. */

export const EXAMPLES = [
  { id: "3x3-relatorio", name: "3×3 · Situação-problema (relatório)", n: 3, m: 3, A: [[2, 1, 1], [1, 3, 2], [3, 2, 2]], b: [100, 180, 200] },
  { id: "3x3-relatorio-ajustado", name: "3×3 · Situação-problema (totais ajustados)", n: 3, m: 3, A: [[2, 1, 1], [1, 3, 2], [3, 2, 2]], b: [110, 190, 200] },
  { id: "2x2-spd", name: "2×2 · SPD (retas concorrentes)", n: 2, m: 2, A: [[2, 3], [1, -1]], b: [12, 1] },
  { id: "2x2-spi", name: "2×2 · SPI (retas coincidentes)", n: 2, m: 2, A: [[1, 1], [2, 2]], b: [2, 4] },
  { id: "2x2-si", name: "2×2 · SI (retas paralelas)", n: 2, m: 2, A: [[1, 1], [1, 1]], b: [2, 3] },
  { id: "2x2-dec", name: "2×2 · decimais e negativos", n: 2, m: 2, A: [[1.5, -2], [-0.5, 4]], b: [3, 10] },
  { id: "3x2-spd", name: "3×2 · SPD (mais equações que incógnitas)", n: 2, m: 3, A: [[1, 1], [1, -1], [2, 0]], b: [5, 1, 6] },
  { id: "3x2-si", name: "3×2 · SI (inconsistente)", n: 2, m: 3, A: [[1, 1], [1, -1], [2, 0]], b: [5, 1, 7] },
  { id: "1x2-spi", name: "1×2 · SPI (uma equação, duas incógnitas)", n: 2, m: 1, A: [[1, 2]], b: [4] },
  { id: "3x3-spd", name: "3×3 · SPD (coeficientes variados)", n: 3, m: 3, A: [[2, 1, 3], [1, 3, 2], [1, 2, 2]], b: [190, 190, 160] },
  { id: "3x3-spi", name: "3×3 · SPI (infinitas soluções)", n: 3, m: 3, A: [[1, 2, 1], [2, 4, 2], [1, -1, 0]], b: [4, 8, 1] },
  { id: "3x3-si", name: "3×3 · SI (inconsistente)", n: 3, m: 3, A: [[1, 1, 1], [2, 2, 2], [1, -1, 0]], b: [3, 7, 1] },
  { id: "3x3-d0-si", name: "3×3 · D = 0, todos os Dᵢ nulos e sistema impossível", n: 3, m: 3, A: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], b: [1, 2, 3] },
  { id: "4x4-spd", name: "4×4 · SPD", n: 4, m: 4, A: [[2, 1, 0, 1], [1, 3, 1, 0], [0, 1, 2, 1], [1, 1, 1, 3]], b: [5, 6, 7, 8] },
  { id: "5x5-spd", name: "5×5 · SPD", n: 5, m: 5, A: [[4, 1, 0, 0, 1], [1, 5, 1, 0, 0], [0, 1, 6, 1, 0], [0, 0, 1, 7, 1], [1, 0, 0, 1, 8]], b: [7, 9, 12, 15, 20] },
]

/** Grade vazia (m linhas × n+1 colunas de texto). */
export function emptyValues(m, n) {
  return Array.from({ length: m }, () => Array.from({ length: n + 1 }, () => ""))
}

/** Redimensiona preservando os valores já digitados. */
export function resizeValues(values, m, n) {
  return Array.from({ length: m }, (_, row) =>
    Array.from({ length: n + 1 }, (_, col) => {
      const previous = values?.[row]?.[col]
      return previous === undefined ? "" : previous
    }),
  )
}

/** Converte A/b em grade de textos. */
export function valuesFromSystem(A, b) {
  return A.map((row, i) => [...row.map(String), String(b[i])])
}

/** Exemplo compatível com a dimensão atual (ou um SPD gerado). */
export function exampleForSize(n, m) {
  const found = EXAMPLES.find((example) => example.n === n && example.m === m)
  if (found) return found

  const solution = [2, 3, 4, 5, 6].slice(0, n)
  const A = Array.from({ length: m }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      if (i === j) return 3
      return (i + j) % 3 === 0 ? 1 : 0
    }),
  )
  const b = A.map((row) => row.reduce((sum, value, j) => sum + value * solution[j], 0))
  return { id: "gerado", name: `Exemplo ${m}×${n}`, n, m, A, b }
}
