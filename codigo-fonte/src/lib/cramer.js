/**
 * Regra de Cramer com determinantes pelo Teorema de Laplace.
 *
 * Implementa:
 *  - determinante por expansão de Laplace (sempre pela 1ª coluna);
 *  - primeiro nível da expansão, para exibição (menores, cofatores, parcelas);
 *  - determinante pela Regra de Sarrus (3×3), para comparação;
 *  - Regra de Cramer: xᵢ = Dᵢ / D;
 *  - verificação da solução por substituição nas equações.
 *
 * Funções puras: recebem arrays e devolvem números/objetos. Não dependem de
 * interface, formatação, LaTeX ou gráfico. Matrizes quadradas de ordem 1 a 5.
 */

/** Matriz sem a linha i e a coluna j (submatriz do menor complementar Mᵢⱼ). */
function submatriz(M, i, j) {
  return M.filter((_, linha) => linha !== i).map((row) =>
    row.filter((_, coluna) => coluna !== j),
  )
}

/** Troca -0 por 0, para não exibir "−0". */
function semZeroNegativo(valor) {
  return valor === 0 ? 0 : valor
}

/** Cofator da 1ª coluna: Cᵢ₁ = (−1)^(i+1) · Mᵢ₁ (com i a partir de 0: (−1)^i). */
function cofatorPrimeiraColuna(M, i) {
  const menor = detLaplace(submatriz(M, i, 0))
  return semZeroNegativo((-1) ** i * menor) // Cᵢ₁ = (−1)^(i+1) · Mᵢ₁
}

/**
 * Determinante pelo Teorema de Laplace, expandindo SEMPRE pela 1ª coluna:
 *
 *   det(M) = a₁₁·C₁₁ + a₂₁·C₂₁ + … + aₙ₁·Cₙ₁,   Cᵢ₁ = (−1)^(i+1) · Mᵢ₁
 *
 * onde Mᵢ₁ é o menor complementar (determinante da submatriz sem a linha i e
 * a coluna 1). Casos base: n = 1 → a₁₁; n = 2 → a₁₁·a₂₂ − a₁₂·a₂₁.
 *
 * Com coeficientes inteiros o resultado sai exato: a expansão usa apenas
 * somas e produtos, e a única divisão acontece no final da Regra de Cramer
 * (xᵢ = Dᵢ / D). O custo cresce na ordem de n!, aceitável porque a interface
 * limita os sistemas a 5×5.
 */
export function detLaplace(M) {
  const n = M.length
  if (n === 1) return M[0][0]
  if (n === 2) return semZeroNegativo(M[0][0] * M[1][1] - M[0][1] * M[1][0])

  let soma = 0
  for (let i = 0; i < n; i += 1) {
    if (M[i][0] === 0) continue // parcela nula: aᵢ₁ = 0
    soma += M[i][0] * cofatorPrimeiraColuna(M, i)
  }
  return semZeroNegativo(soma)
}

/**
 * Primeiro nível da expansão de Laplace pela 1ª coluna (n ≥ 2), para exibição:
 * para cada linha i, o elemento aᵢ₁, a submatriz, o menor Mᵢ₁, o cofator Cᵢ₁
 * e a parcela aᵢ₁·Cᵢ₁. O total é a soma das parcelas: det(M).
 */
export function expansaoLaplace(M) {
  if (M.length < 2) return null
  const termos = M.map((row, i) => {
    const sub = submatriz(M, i, 0)
    const menor = detLaplace(sub) // Mᵢ₁
    const cofator = semZeroNegativo((-1) ** i * menor) // Cᵢ₁ = (−1)^(i+1) · Mᵢ₁
    const parcela = semZeroNegativo(row[0] * cofator) // aᵢ₁ · Cᵢ₁
    return { linha: i, elemento: row[0], submatriz: sub, menor, cofator, parcela }
  })
  const total = semZeroNegativo(termos.reduce((soma, t) => soma + t.parcela, 0))
  return { termos, total }
}

/**
 * Determinante 3×3 pela Regra de Sarrus (segundo método, para comparar):
 *
 *   det = (a₁₁a₂₂a₃₃ + a₁₂a₂₃a₃₁ + a₁₃a₂₁a₃₂)
 *       − (a₁₃a₂₂a₃₁ + a₁₁a₂₃a₃₂ + a₁₂a₂₁a₃₃)
 *
 * Retorna null se a matriz não for 3×3.
 */
export function detSarrus(M) {
  if (M.length !== 3 || M.some((row) => row.length !== 3)) return null
  const [[a, b, c], [d, e, f], [g, h, i]] = M
  const principais = a * e * i + b * f * g + c * d * h
  const secundarias = c * e * g + a * f * h + b * d * i
  return semZeroNegativo(principais - secundarias)
}

/** Cópia de A com a coluna k substituída pelo vetor b (A não é alterada). */
export function trocarColuna(A, k, b) {
  return A.map((row, i) => row.map((valor, j) => (j === k ? b[i] : valor)))
}

/**
 * Decide se um determinante é zero.
 *
 * Com elementos inteiros, Laplace usa só somas e produtos: o resultado é exato
 * (enquanto couber em Number.MAX_SAFE_INTEGER) e a comparação com 0 é direta.
 * Com decimais (0,1; 1/3…), o ponto flutuante gera resíduos como 1e-16, então
 * usa-se uma tolerância proporcional ao limite de Hadamard:
 *
 *   |det(M)| ≤ ‖coluna 1‖ · ‖coluna 2‖ · … · ‖coluna n‖
 *
 * Esse limite cresce na mesma proporção que o determinante (multiplicar uma
 * coluna por k multiplica os dois por k), ao contrário de (maior |mᵢⱼ|)ⁿ.
 */
export function ehZero(valor, M) {
  const inteiros = M.every((row) => row.every(Number.isInteger))
  const limite = limiteHadamard(M)
  if (inteiros && limite < Number.MAX_SAFE_INTEGER) return valor === 0
  return Math.abs(valor) <= 1e-10 * limite
}

/** Limite de Hadamard: |det(M)| ≤ produto das normas das colunas. */
function limiteHadamard(M) {
  return M[0].reduce((prod, _, j) => prod * Math.hypot(...M.map((row) => row[j])), 1)
}

/**
 * Regra de Cramer: D = det(A) e Dᵢ = det(Aᵢ), onde Aᵢ é A com a coluna i
 * trocada pelo vetor b. Se D ≠ 0, o sistema é possível e determinado e
 * xᵢ = Dᵢ / D. Se D = 0, a regra não se aplica; informa se algum Dᵢ ≠ 0.
 * Determinantes considerados nulos por ehZero são devolvidos como 0.
 */
export function resolverCramer(A, b) {
  const detA = detLaplace(A)
  const D = ehZero(detA, A) ? 0 : detA
  const Di = A[0].map((_, i) => {
    const Ai = trocarColuna(A, i, b) // Aᵢ: coluna i de A substituída por b
    const valor = detLaplace(Ai)
    return ehZero(valor, Ai) ? 0 : valor
  })
  const expansao = expansaoLaplace(A)
  const algumDiNaoNulo = Di.some((d) => d !== 0)

  if (D === 0) {
    return { aplicavel: false, D, Di, expansao, solucao: null, algumDiNaoNulo }
  }
  const solucao = Di.map((d) => d / D) // xᵢ = Dᵢ / D (única divisão do método)
  return { aplicavel: true, D, Di, expansao, solucao, algumDiNaoNulo }
}

/**
 * Verificação por substituição: para cada equação i, calcula o lado esquerdo
 * Σ aᵢⱼ·xⱼ e compara com o termo independente bᵢ. A tolerância é relativa à
 * escala da própria equação (maior entre |bᵢ| e os |aᵢⱼ·xⱼ|).
 */
export function verificarSolucao(A, b, x) {
  return A.map((row, i) => {
    const produtos = row.map((a, j) => a * x[j])
    const ladoEsquerdo = produtos.reduce((soma, p) => soma + p, 0)
    const escala = Math.max(Math.abs(b[i]), ...produtos.map(Math.abs))
    const satisfeita = Math.abs(ladoEsquerdo - b[i]) <= 1e-9 * Math.max(escala, 1e-12)
    return { ladoEsquerdo, termo: b[i], satisfeita }
  })
}

/** Dois resultados coincidem (diferença relativa até 1e-9)? */
export function coincidem(a, b) {
  return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
}
