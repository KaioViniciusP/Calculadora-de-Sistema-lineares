/**
 * Utilidades geométricas do gráfico (sistemas com 2 incógnitas).
 *
 * Implementa o enquadramento da área visível, o passo da grade, os pontos
 * extremos de cada reta e a detecção de retas coincidentes.
 */

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
