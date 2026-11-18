import { useEffect, useMemo, useState } from "react"
import { Mafs, Coordinates, Line, Point, Text } from "mafs"
import Tex from "./Tex"
import { linearExprTex } from "../lib/latex"
import { computeView, linesCoincident, lineEndpoints } from "../lib/grafico"
import { fmt, VARS } from "../lib/formatacao"

const COLORS = ["#0060df", "#0d9f6e", "#7c3aed", "#dc2f2f", "#b45309"]
const STYLES = ["solid", "dashed", "solid", "dashed", "solid"]

/** Altura do gráfico ajustada ao tamanho da tela. */
function useGraphHeight() {
  const [height, setHeight] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 640 ? 340 : 470,
  )

  useEffect(() => {
    const onResize = () => setHeight(window.innerWidth < 640 ? 340 : 470)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return height
}

/** Uma reta por equação, com legenda e ponto de interseção. */
function CartesianGraph({ result, graphKey }) {
  const { A, b, classification, solution } = result
  const height = useGraphHeight()

  const point =
    classification === "SPD"
      ? {
          x: solution.exprs[0].constant,
          y: solution.exprs[1].constant,
        }
      : null

  const view = useMemo(() => computeView(A, b, point), [A, b, point])

  const lines = useMemo(
    () =>
      A.map((row, index) => {
        const a = Math.abs(row[0]) < 1e-12 ? 0 : row[0]
        const bb = Math.abs(row[1]) < 1e-12 ? 0 : row[1]
        if (a === 0 && bb === 0) return null
        const endpoints = lineEndpoints(a, bb, b[index], view)
        if (!endpoints) return null
        return {
          a,
          b: bb,
          c: b[index],
          point1: endpoints[0],
          point2: endpoints[1],
          color: COLORS[index % COLORS.length],
          style: STYLES[index % STYLES.length],
          tex: `${linearExprTex(row, VARS.slice(0, 2))} = ${fmt(b[index])}`,
          equation: row,
          independent: b[index],
        }
      }),
    [A, b, view],
  )

  const drawn = lines.filter(Boolean)
  const coincident = linesCoincident(drawn)
  const skipped = A.map((row, i) => (row.every((v) => Math.abs(v) < 1e-12) ? i : -1)).filter(
    (i) => i >= 0,
  )

  let message
  let tone = "positive"
  if (classification === "SPD") {
    message = (
      <>
        <strong>Ponto de interseção</strong> em ({fmt(point.x)}; {fmt(point.y)}) — as
        retas se cruzam em um único ponto, portanto a solução é única.
      </>
    )
  } else if (drawn.length === 0) {
    tone = classification === "SI" ? "negative" : "positive"
    message =
      classification === "SI" ? (
        <>
          <strong>Nenhuma reta definida</strong> — todos os coeficientes são zero e
          há uma contradição do tipo 0 = k (k ≠ 0). O sistema não tem solução.
        </>
      ) : (
        <>
          <strong>Qualquer ponto do plano é solução</strong> — todas as equações
          são identidades 0 = 0.
        </>
      )
  } else if (classification === "SI") {
    tone = "negative"
    message = (
      <>
        <strong>Sem interseção</strong> — as retas são paralelas distintas, então o
        sistema não possui solução.
      </>
    )
  } else if (drawn.length === 1) {
    message = (
      <>
        <strong>Infinitas soluções</strong> — a única equação do sistema representa
        todos os pontos desta reta.
      </>
    )
  } else if (coincident) {
    message = (
      <>
        <strong>Retas coincidentes</strong> — todos os pontos da reta são soluções
        do sistema.
      </>
    )
  } else {
    message = (
      <>
        <strong>Infinitas soluções</strong> — há retas coincidentes no sistema; a
        solução é um conjunto de pontos.
      </>
    )
  }

  return (
    <>
      <div className="graph-shell">
        <Mafs
          key={graphKey}
          height={height}
          pan
          zoom={{ min: 0.15, max: 8 }}
          viewBox={{ x: view.x, y: view.y, padding: 0.2 }}
        >
          <Coordinates.Cartesian
            xAxis={{ lines: view.step }}
            yAxis={{ lines: view.step }}
            subdivisions={false}
          />
          {drawn.map((line, index) => (
            <Line.Segment
              key={`${line.color}-${index}`}
              point1={line.point1}
              point2={line.point2}
              color={line.color}
              style={line.style}
              weight={2.6}
            />
          ))}
          {point ? (
            <>
              <Point x={point.x} y={point.y} color="#0d9f6e" />
              <Text
                x={point.x}
                y={point.y}
                attach="nw"
                color="#0a7a55"
                size={13}
              >
                {`(${fmt(point.x)}; ${fmt(point.y)})`}
              </Text>
            </>
          ) : null}
        </Mafs>
      </div>
      <span className="graph-hint">
        Arraste para mover · role a roda para ampliar · use “Reenquadrar” para
        voltar à escala automática
      </span>

      <div className="legend">
        {drawn.map((line, index) => (
          <div className="legend-item" key={`legend-${index}`}>
            <span
              className="legend-swatch"
              style={{
                borderColor: line.color,
                borderTopStyle: line.style === "dashed" ? "dashed" : "solid",
              }}
              aria-hidden="true"
            />
            <Tex tex={line.tex} className="legend-tex" />
          </div>
        ))}
        {skipped.map((index) => (
          <div className="legend-item legend-item-warn" key={`skip-${index}`}>
            Equação {index + 1}: todos os coeficientes são zero — não define uma reta.
          </div>
        ))}
      </div>

      <p className={`graph-result ${tone}`}>{message}</p>
    </>
  )
}

/** Ilustração esquemática de planos no espaço. */
function planesSvg(classification) {
  let marker = null
  if (classification === "SPD") {
    marker = (
      <>
        <circle cx="166" cy="130" r="14" fill="#0d9f6e" fillOpacity="0.16" />
        <circle cx="166" cy="130" r="5.5" fill="#0d9f6e" stroke="#fff" strokeWidth="2.5" />
        <text x="184" y="122" fontSize="12" fontWeight="700" fill="#0a7a55">
          solução
        </text>
      </>
    )
  } else if (classification === "SPI") {
    marker = (
      <>
        <line x1="92" y1="200" x2="240" y2="88" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
        <line x1="92" y1="200" x2="240" y2="88" stroke="#0d9f6e" strokeWidth="4" strokeLinecap="round" />
        <text x="186" y="68" fontSize="11.5" fontWeight="700" fill="#0a7a55">
          infinitas soluções
        </text>
      </>
    )
  } else {
    marker = (
      <text x="96" y="74" fontSize="11.5" fontWeight="700" fill="#b42318">
        sem interseção
      </text>
    )
  }

  return (
    <svg viewBox="0 0 320 240" role="img" aria-label="Planos no espaço">
      <polygon points="24,150 150,78 296,132 170,204" fill="#dbeafe" fillOpacity="0.95" stroke="#60a5fa" strokeWidth="1.6" strokeOpacity="0.8" />
      <polygon points="46,86 168,40 288,96 166,142" fill="#d1fae5" fillOpacity="0.72" stroke="#34d399" strokeWidth="1.6" strokeOpacity="0.8" />
      <polygon points="70,196 190,140 300,186 180,238" fill="#ede9fe" fillOpacity="0.72" stroke="#a78bfa" strokeWidth="1.6" strokeOpacity="0.8" />
      {marker}
    </svg>
  )
}

function PlaneExplanation({ result }) {
  const vars = VARS.slice(0, result.A[0].length)
  const texts = {
    SPD: `As ${result.res.m} equações se encontram em um único ponto do espaço.`,
    SPI: "As equações têm infinitos pontos em comum (uma reta, um plano ou um hiperplano).",
    SI: "Não existe ponto comum a todas as equações.",
  }

  return (
    <div className="alt-graph">
      {planesSvg(result.classification)}
      <div className="alt-graph-text">
        <p>
          <strong>Por que não há gráfico em 2D?</strong> Com {result.res.n} incógnitas (
          {vars.join(", ")}), cada equação representa{" "}
          {result.res.n === 3 ? "um plano" : "um hiperplano"} — um objeto que não pode
          ser desenhado corretamente em uma tela bidimensional sem perda de informação.
        </p>
        <p>
          Em vez de gerar um gráfico potencialmente incorreto, veja a leitura
          geométrica: {texts[result.classification]}
        </p>
        <div className="rank-chips">
          <span className={`chip chip-${result.classification.toLowerCase()}`}>
            {result.classification}
          </span>
          <span className="chip">posto(A) = {result.res.rankA}</span>
          <span className="chip">posto(A|B) = {result.res.rankAug}</span>
        </div>
      </div>
    </div>
  )
}

export default function GraphView({ result, graphKey, onReset }) {
  return (
    <div className="graph-wrap">
      {result.res.n === 2 ? (
        <>
          <div className="graph-toolbar no-print">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onReset}>
              Reenquadrar
            </button>
            <span className="graph-toolbar-note">
              escala automática · zoom 0,15× a 8×
            </span>
          </div>
          <CartesianGraph result={result} graphKey={graphKey} />
        </>
      ) : (
        <PlaneExplanation result={result} />
      )}
    </div>
  )
}
