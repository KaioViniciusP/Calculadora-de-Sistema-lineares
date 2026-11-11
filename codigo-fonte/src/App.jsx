import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import SheetHeader from "./components/SheetHeader"
import GraphView from "./components/GraphView"
import {
  ConfigSection,
  InputSection,
  SystemSection,
  MatricesSection,
  StepsSection,
  ClassificationSection,
  SolutionSection,
  ExplainSection,
} from "./components/Sections"
import { EXAMPLES, emptyValues, exampleForSize, resizeValues, valuesFromSystem } from "./lib/examples"
import { fmt, parseNumber, solveSystem, VARS } from "./lib/solver"

const CLASS_TITLES = {
  SPD: "Sistema Possível e Determinado",
  SPI: "Sistema Possível e Indeterminado",
  SI: "Sistema Impossível",
}

/** Expressão em texto puro (para copiar/imprimir). */
function plainExpr(coeffs, vars) {
  const parts = []
  coeffs.forEach((value, index) => {
    if (Math.abs(value) < 1e-12) return
    const negative = value < 0
    const magnitude = Math.abs(value)
    const coef = Math.abs(magnitude - 1) < 1e-12 ? "" : fmt(magnitude)
    const term = `${coef}${vars[index]}`
    if (parts.length === 0) parts.push(`${negative ? "-" : ""}${term}`)
    else parts.push(`${negative ? "-" : "+"} ${term}`)
  })
  return parts.length ? parts.join(" ") : "0"
}

/** Expressão paramétrica em texto puro. */
function plainParamExpr(expr) {
  let out = ""
  let hasTerm = false
  if (Math.abs(expr.constant) > 1e-12) {
    out += `${expr.constant < 0 ? "-" : ""}${fmt(Math.abs(expr.constant))}`
    hasTerm = true
  }
  expr.terms.forEach((term) => {
    if (Math.abs(term.coef) < 1e-12) return
    const negative = term.coef < 0
    const magnitude = Math.abs(term.coef)
    const coef = Math.abs(magnitude - 1) < 1e-12 ? "" : fmt(magnitude)
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

/** Relatório textual completo do resultado. */
function resultToText(result) {
  if (!result) return ""
  const { A, b, res, solution, classification } = result
  const vars = VARS.slice(0, res.n)

  const lines = []
  lines.push("CALC · SISTEMAS LINEARES")
  lines.push(`${res.m} equações · ${res.n} incógnitas (${vars.join(", ")})`)
  lines.push("")
  lines.push("SISTEMA")
  A.forEach((row, index) => {
    lines.push(`  ${plainExpr(row, vars)} = ${fmt(b[index])}`)
  })
  lines.push("")
  lines.push(`Matriz A (${res.m}×${res.n})`)
  A.forEach((row) => lines.push(`  [ ${row.map((v) => fmt(v)).join("  ")} ]`))
  lines.push("")
  lines.push(`Vetor B: [ ${b.map((v) => fmt(v)).join("  ")} ]`)
  lines.push("")
  lines.push("CLASSIFICAÇÃO")
  lines.push(`  ${classification} — ${CLASS_TITLES[classification]}`)
  lines.push(`  posto(A) = ${res.rankA} · posto(A|B) = ${res.rankAug} · incógnitas = ${res.n}`)
  lines.push("")
  lines.push("SOLUÇÃO")
  if (classification === "SI") {
    lines.push("  S = ∅ (conjunto vazio)")
  } else if (classification === "SPD") {
    lines.push(`  ${solution.exprs.map((expr, i) => `${vars[i]} = ${fmt(expr.constant)}`).join("; ")}`)
  } else {
    lines.push(`  ${solution.exprs.map((expr, i) => `${vars[i]} = ${plainParamExpr(expr)}`).join("; ")}`)
    lines.push(`  ${solution.freeCols.map((col, i) => `${vars[col]} = ${solution.params[i]} (livre)`).join("; ")}`)
    lines.push(`  ${solution.params.join(", ")} ∈ ℝ`)
  }
  lines.push("")
  lines.push("Resolvido por eliminação de Gauss-Jordan com pivoteamento parcial.")
  return lines.join("\r\n")
}

export default function App() {
  const [n, setN] = useState(2)
  const [m, setM] = useState(2)
  const [values, setValues] = useState(() => emptyValues(2, 2))
  const [errors, setErrors] = useState(() => new Set())
  const [formError, setFormError] = useState("")
  const [result, setResult] = useState(null)
  const [stale, setStale] = useState(false)
  const [graphKey, setGraphKey] = useState(0)
  const [exampleId, setExampleId] = useState("")
  const [toast, setToast] = useState("")

  const inputRefs = useRef({})
  const toastTimer = useRef(null)

  const showToast = useCallback((message) => {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(""), 2600)
  }, [])

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    },
    [],
  )

  const changeDims = useCallback((nextN, nextM) => {
    setN(nextN)
    setM(nextM)
    setValues((current) => resizeValues(current, nextM, nextN))
    setErrors(new Set())
    setFormError("")
    setStale(true)
  }, [])

  const handleUnknowns = (nextN) => changeDims(nextN, m)
  const handleEquations = (nextM) => changeDims(n, nextM)

  const handleChange = (row, col, value) => {
    setValues((current) =>
      current.map((line, i) =>
        i === row ? line.map((cell, j) => (j === col ? value : cell)) : line,
      ),
    )
    setErrors((current) => {
      if (!current.has(`${row}-${col}`)) return current
      const next = new Set(current)
      next.delete(`${row}-${col}`)
      return next
    })
    setFormError("")
    setStale(true)
  }

  const focusFirst = () => {
    requestAnimationFrame(() => {
      const element = inputRefs.current["0-0"]
      if (element) {
        element.focus()
        element.select()
      }
    })
  }

  const handleGenerate = () => {
    setErrors(new Set())
    setFormError("")
    focusFirst()
    showToast(`Matriz ${m}×${n} pronta para preenchimento.`)
  }

  const handleClear = () => {
    setValues(emptyValues(m, n))
    setErrors(new Set())
    setFormError("")
    setExampleId("")
    setStale(true)
    focusFirst()
    showToast("Campos limpos.")
  }

  const handleReset = () => {
    setValues(emptyValues(m, n))
    setErrors(new Set())
    setFormError("")
    setExampleId("")
    setResult(null)
    setStale(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
    showToast("Novo sistema iniciado.")
  }

  const applyExample = (example, announce = true) => {
    setN(example.n)
    setM(example.m)
    setValues(valuesFromSystem(example.A, example.b))
    setExampleId(example.id)
    setErrors(new Set())
    setFormError("")
    setResult(null)
    setStale(false)
    if (announce) showToast(`Exemplo aplicado: ${example.name}.`)
  }

  const handleExampleSelect = (id) => {
    const example = EXAMPLES.find((item) => item.id === id)
    if (!example) {
      setExampleId("")
      return
    }
    applyExample(example)
  }

  const handleExample = () => {
    applyExample(exampleForSize(n, m))
  }

  const handleSolve = () => {
    const invalid = new Set()
    values.forEach((row, i) => {
      row.forEach((raw, j) => {
        if (!Number.isFinite(parseNumber(raw))) invalid.add(`${i}-${j}`)
      })
    })

    if (invalid.size > 0) {
      setErrors(invalid)
      setFormError(
        `Verifique ${invalid.size} ${
          invalid.size === 1 ? "campo destacado" : "campos destacados"
        }: use números inteiros, decimais (vírgula ou ponto) ou frações como 1/2.`,
      )
      const firstKey = [...invalid][0]
      inputRefs.current[firstKey]?.focus()
      return
    }

    const A = values.map((row) => row.slice(0, n).map((raw) => parseNumber(raw)))
    const b = values.map((row) => parseNumber(row[n]))

    try {
      const solved = solveSystem(A, b)
      setResult(solved)
      setErrors(new Set())
      setFormError("")
      setStale(false)
      setGraphKey((key) => key + 1)
      showToast(
        `${solved.classification} · ${CLASS_TITLES[solved.classification]}.`,
      )
      if (typeof window !== "undefined") {
        setTimeout(() => {
          document
            .getElementById("sec-system")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 90)
      }
    } catch (error) {
      setFormError(`Não foi possível resolver o sistema: ${String(error.message || error)}`)
    }
  }

  const handleCellKeyDown = (event) => {
    const row = Number(event.target.dataset.row)
    const col = Number(event.target.dataset.col)
    if (!Number.isInteger(row) || !Number.isInteger(col)) return

    if (event.key === "Enter") {
      event.preventDefault()
      handleSolve()
      return
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const nextRow = row + (event.key === "ArrowDown" ? 1 : -1)
      if (nextRow >= 0 && nextRow < m) {
        event.preventDefault()
        const element = inputRefs.current[`${nextRow}-${col}`]
        if (element) {
          element.focus()
          element.select()
        }
      }
    }
  }

  const handleCopy = async () => {
    const text = resultToText(result)
    if (!text) return

    // Em arquivo local (file://) o execCommand é mais confiável e síncrono.
    try {
      const area = document.createElement("textarea")
      area.value = text
      area.setAttribute("readonly", "")
      area.style.position = "fixed"
      area.style.top = "0"
      area.style.left = "0"
      area.style.opacity = "0"
      document.body.appendChild(area)
      area.focus()
      area.select()
      area.setSelectionRange(0, text.length)
      const ok = document.execCommand("copy")
      document.body.removeChild(area)
      if (ok) {
        showToast("Resultado copiado para a área de transferência.")
        return
      }
    } catch {
      // segue para a Clipboard API
    }

    try {
      await navigator.clipboard.writeText(text)
      showToast("Resultado copiado para a área de transferência.")
    } catch {
      showToast("Não foi possível copiar automaticamente.")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const status = useMemo(() => {
    if (!result) return "aguardando dados"
    return `${result.classification} · posto(A) ${result.res.rankA} · ${result.res.m}×${result.res.n}`
  }, [result])

  return (
    <>
      <SheetHeader />

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-main">
            <span className="hero-kicker">DWG · ÁLGEBRA LINEAR / SISTEMAS</span>
            <h1 className="hero-title">
              Sistemas lineares,
              <br />
              resolvidos em prancha.
            </h1>
            <p className="hero-sub">
              Resolva sistemas de 1 a 5 equações, classifique por postos e
              acompanhe cada operação de Gauss-Jordan — com a leitura gráfica
              das retas no plano.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#resolver">
                Começar resolução
              </a>
              <a className="btn btn-ghost" href="#teoria">
                Ver referência teórica
              </a>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>Equações</dt>
                <dd>1–5</dd>
              </div>
              <div>
                <dt>Incógnitas</dt>
                <dd>2–5</dd>
              </div>
              <div>
                <dt>Método</dt>
                <dd>Gauss-Jordan</dd>
              </div>
              <div>
                <dt>Classificações</dt>
                <dd>3</dd>
              </div>
            </dl>
          </div>

          <aside className="hero-figure" aria-hidden="true">
            <span className="figure-label">FIG 1.0 — LEITURA NO PLANO</span>
            <svg viewBox="0 0 360 300" role="presentation">
              <defs>
                <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#b9d2f6" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="360" height="300" fill="url(#blueprint-grid)" opacity="0.55" />
              <line x1="30" y1="150" x2="330" y2="150" stroke="#8fb6ea" strokeWidth="1.2" />
              <line x1="180" y1="20" x2="180" y2="280" stroke="#8fb6ea" strokeWidth="1.2" />
              <line x1="46" y1="252" x2="314" y2="48" stroke="#0060df" strokeWidth="2.4" />
              <line x1="60" y1="52" x2="300" y2="248" stroke="#0d9f6e" strokeWidth="2.4" strokeDasharray="8 6" />
              <circle cx="180" cy="150" r="18" fill="#0d9f6e" fillOpacity="0.12" />
              <circle cx="180" cy="150" r="6" fill="#0d9f6e" stroke="#ffffff" strokeWidth="2.5" />
              <text x="190" y="138" fontFamily="Geist Mono Variable, monospace" fontSize="11" fontWeight="700" fill="#0a7a55">
                P (3; 2)
              </text>
              <text x="252" y="66" fontFamily="Geist Mono Variable, monospace" fontSize="10" fill="#0060df">
                r₁
              </text>
              <text x="66" y="66" fontFamily="Geist Mono Variable, monospace" fontSize="10" fill="#0a7a55">
                r₂
              </text>
              <text x="30" y="286" fontFamily="Geist Mono Variable, monospace" fontSize="9" fill="#5b6b7c">
                ESCALA 1:1 · PLANO CARTESIANO
              </text>
            </svg>
            <span className="figure-caption">
              Retas concorrentes → uma única solução (SPD).
            </span>
          </aside>
        </div>
      </div>

      <main className="page">
        <ConfigSection
          n={n}
          m={m}
          onUnknowns={handleUnknowns}
          onEquations={handleEquations}
          onGenerate={handleGenerate}
        />

        <InputSection
          n={n}
          m={m}
          values={values}
          errors={errors}
          formError={formError}
          exampleId={exampleId}
          examples={EXAMPLES}
          inputRefs={inputRefs}
          onChange={handleChange}
          onKeyDown={handleCellKeyDown}
          onSolve={handleSolve}
          onClear={handleClear}
          onExample={handleExample}
          onExampleSelect={handleExampleSelect}
          onGenerate={handleGenerate}
        />

        {result ? (
          <div className="results">
            <div className="action-bar no-print">
              {stale ? (
                <span className="stale-pill">
                  Coeficientes alterados — resultados da última resolução
                </span>
              ) : null}
              <button type="button" className="btn btn-dark btn-sm" onClick={handleSolve}>
                Resolver novamente
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
                Limpar e iniciar novo
              </button>
              <div className="spacer" />
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleCopy}>
                Copiar resultado
              </button>
              <button type="button" className="btn btn-green btn-sm" onClick={handlePrint}>
                Imprimir / PDF
              </button>
            </div>

            <SystemSection result={result} />
            <MatricesSection result={result} />
            <StepsSection result={result} />
            <ClassificationSection result={result} />
            <SolutionSection result={result} />

            <section id="sec-graph" className="card graph-card">
              <span className="card-tick card-tick-tl" aria-hidden="true" />
              <span className="card-tick card-tick-tr" aria-hidden="true" />
              <span className="card-tick card-tick-bl" aria-hidden="true" />
              <span className="card-tick card-tick-br" aria-hidden="true" />
              <header className="card-head">
                <div className="card-head-main">
                  <span className="sec-kicker">SEC 08 · GRÁFICO</span>
                  <h2 className="card-title">Representação gráfica</h2>
                  <p className="card-sub">
                    {result.res.n === 2
                      ? "Cada equação é uma reta no plano. Arraste, aplique zoom e confira a interseção."
                      : "Com três ou mais incógnitas, cada equação é um plano — veja a leitura geométrica abaixo."}
                  </p>
                </div>
              </header>
              <div className="card-body">
                <GraphView
                  result={result}
                  graphKey={graphKey}
                  onReset={() => setGraphKey((key) => key + 1)}
                />
              </div>
            </section>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-kicker">AGUARDANDO DADOS</span>
            <p>
              Preencha os coeficientes acima e clique em{" "}
              <strong>Resolver sistema</strong> para gerar a prancha completa:
              matrizes, passo a passo, classificação, conjunto solução e gráfico.
            </p>
          </div>
        )}

        <ExplainSection />
      </main>

      <footer className="site-footer">
        <div className="footer-meta">
          <span>CALC · SISTEMAS LINEARES</span>
          <span>REV 2.0 · 2026</span>
        </div>
        <div className="footer-note">
          Calculadora de Sistemas Lineares Online · React, Mafs e KaTeX
        </div>
        <div className="footer-status" aria-live="polite">
          <span className={`status-dot ${result ? "on" : ""}`} aria-hidden="true" />
          {status}
        </div>
      </footer>

      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  )
}
