import Tex from "./Tex"
import MatrixInput from "./MatrixInput"
import {
  augmentedTex,
  criterionTex,
  matrixTex,
  solutionTex,
  stepTex,
  systemTex,
  variableVectorTex,
  vectorTex,
  paramExprTex,
} from "../lib/latex"
import { fmt, texNum, VARS } from "../lib/solver"

const CLASS_TITLES = {
  SPD: "Sistema Possível e Determinado",
  SPI: "Sistema Possível e Indeterminado",
  SI: "Sistema Impossível",
}

const CLASS_SUBS = {
  SPD: "Solução única — as equações se encontram em um único ponto.",
  SPI: "Infinitas soluções — há incógnitas livres que se tornam parâmetros.",
  SI: "Nenhuma solução — as equações se contradizem.",
}

/**
 * Moldura comum das seções: numeração de prancha, título e corpo.
 */
export function SectionShell({
  id,
  index,
  kicker,
  title,
  sub,
  actions,
  children,
  className = "",
  noPrint = false,
}) {
  return (
    <section
      id={id}
      className={`card ${noPrint ? "no-print" : ""} ${className}`.trim()}
    >
      <span className="card-tick card-tick-tl" aria-hidden="true" />
      <span className="card-tick card-tick-tr" aria-hidden="true" />
      <span className="card-tick card-tick-bl" aria-hidden="true" />
      <span className="card-tick card-tick-br" aria-hidden="true" />

      <header className="card-head">
        <div className="card-head-main">
          <span className="sec-kicker">
            SEC {index}
            {kicker ? <span className="sec-kicker-text"> · {kicker}</span> : null}
          </span>
          <h2 className="card-title">{title}</h2>
          {sub ? <p className="card-sub">{sub}</p> : null}
        </div>
        {actions ? <div className="card-head-actions">{actions}</div> : null}
      </header>

      <div className="card-body">{children}</div>
    </section>
  )
}

function ConfigSection({ n, m, onUnknowns, onEquations, onGenerate }) {
  return (
    <SectionShell
      id="resolver"
      index="01"
      kicker="CONFIGURAÇÃO"
      title="Dimensões do sistema"
      sub="Escolha quantas equações e quantas incógnitas o sistema possui. A grade é redesenhada preservando os valores já digitados."
      noPrint
    >
      <div className="config-grid">
        <label className="field">
          <span className="field-label">Incógnitas</span>
          <select
            className="select"
            value={n}
            onChange={(event) => onUnknowns(Number(event.target.value))}
          >
            <option value={2}>2 incógnitas · x, y</option>
            <option value={3}>3 incógnitas · x, y, z</option>
            <option value={4}>4 incógnitas · x, y, z, w</option>
            <option value={5}>5 incógnitas · x, y, z, w, v</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Equações</span>
          <select
            className="select"
            value={m}
            onChange={(event) => onEquations(Number(event.target.value))}
          >
            {[1, 2, 3, 4, 5].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "equação" : "equações"}
              </option>
            ))}
          </select>
        </label>

        <div className="field field-action">
          <span className="field-label">&nbsp;</span>
          <button type="button" className="btn btn-secondary" onClick={onGenerate}>
            Gerar matriz
          </button>
        </div>
      </div>

      <dl className="meta-strip">
        <div>
          <dt>Matriz A</dt>
          <dd>
            {m} × {n}
          </dd>
        </div>
        <div>
          <dt>Ampliada</dt>
          <dd>
            {m} × {n + 1}
          </dd>
        </div>
        <div>
          <dt>Método</dt>
          <dd>Gauss-Jordan</dd>
        </div>
        <div>
          <dt>Tolerância</dt>
          <dd>1e−9 × max|A|</dd>
        </div>
      </dl>
    </SectionShell>
  )
}

function InputSection({
  n,
  m,
  values,
  errors,
  formError,
  exampleId,
  examples,
  inputRefs,
  onChange,
  onKeyDown,
  onSolve,
  onClear,
  onExample,
  onExampleSelect,
  onGenerate,
}) {
  return (
    <SectionShell
      id="coeficientes"
      index="02"
      kicker="ENTRADA DE DADOS"
      title="Coeficientes do sistema"
      sub={
        <>
          Preencha cada coeficiente e o termo independente. Aceita inteiros,
          decimais com vírgula ou ponto, negativos, zero e frações como{" "}
          <strong>1/2</strong>. Campos vazios valem <strong>0</strong>.
        </>
      }
      noPrint
    >
      <MatrixInput
        n={n}
        m={m}
        values={values}
        errors={errors}
        onChange={onChange}
        onKeyDown={onKeyDown}
        inputRefs={inputRefs}
      />

      <p className="table-note">
        Dica: pressione <kbd>Enter</kbd> em qualquer campo para resolver. Use{" "}
        <kbd>↑</kbd> e <kbd>↓</kbd> para navegar entre as linhas.
      </p>

      <div className="actions">
        <button type="button" className="btn btn-ghost" onClick={onGenerate}>
          Gerar matriz
        </button>
        <button type="button" className="btn btn-ghost" onClick={onClear}>
          Limpar campos
        </button>
        <button type="button" className="btn btn-ghost" onClick={onExample}>
          Exemplo preenchido
        </button>
        <div className="spacer" />
        <button type="button" className="btn btn-primary" onClick={onSolve}>
          Resolver sistema
        </button>
      </div>

      {formError ? (
        <div className="alert" role="alert" aria-live="polite">
          {formError}
        </div>
      ) : null}

      <div className="example-row">
        <label className="field">
          <span className="field-label">Ou escolha um exemplo pronto</span>
          <select
            className="select"
            value={exampleId}
            onChange={(event) => onExampleSelect(event.target.value)}
          >
            <option value="">— Selecione um exemplo —</option>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>
                {example.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </SectionShell>
  )
}

function SystemSection({ result }) {
  const { A, b, res, classification } = result
  const vars = VARS.slice(0, res.n)

  return (
    <SectionShell
      id="sec-system"
      index="03"
      kicker="SISTEMA"
      title="Sistema de equações"
      sub={`${res.m} ${res.m === 1 ? "equação" : "equações"} · ${
        res.n
      } incógnitas (${vars.join(", ")}) · classificação ${classification}.`}
    >
      <div className="system-box">
        <Tex tex={systemTex(A, b, vars)} display />
      </div>
      <div className="chip-row">
        <span className="chip">incógnitas <strong>{res.n}</strong></span>
        <span className="chip">equações <strong>{res.m}</strong></span>
        <span className={`chip chip-${classification.toLowerCase()}`}>
          {classification}
        </span>
      </div>
    </SectionShell>
  )
}

function MatricesSection({ result }) {
  const { A, b, res } = result
  const vars = VARS.slice(0, res.n)

  return (
    <SectionShell
      id="sec-matrices"
      index="04"
      kicker="REPRESENTAÇÃO MATRICIAL"
      title="Matrizes do sistema"
      sub={
        <>
          A forma <strong>A · X = B</strong> reúne coeficientes, incógnitas e
          termos independentes. A matriz ampliada <strong>(A|B)</strong> é usada
          na eliminação.
        </>
      }
    >
      <div className="matrices">
        <div className="matrix-card">
          <span className="matrix-label">Matriz dos coeficientes</span>
          <Tex tex={matrixTex(A, "A")} display />
        </div>
        <div className="matrix-card">
          <span className="matrix-label">Vetor das incógnitas</span>
          <Tex tex={variableVectorTex(vars, "X")} display />
          <span className="matrix-hint">{vars.join(" · ")}</span>
        </div>
        <div className="matrix-card">
          <span className="matrix-label">Vetor dos termos independentes</span>
          <Tex tex={vectorTex(b, "B")} display />
        </div>
        <div className="matrix-card matrix-card-wide">
          <span className="matrix-label">Matriz ampliada (A|B)</span>
          <Tex tex={augmentedTex(res.startMatrix, res.n)} display />
        </div>
      </div>
    </SectionShell>
  )
}

const STEP_LABELS = {
  swap: "troca",
  scale: "escala",
  eliminate: "eliminação",
  start: "início",
  final: "final",
}

function StepsSection({ result }) {
  const { res } = result
  const pivots = res.pivotCols.map((column, row) => [row, column])
  const nullRows = res.m - res.rankA

  return (
    <SectionShell
      id="sec-steps"
      index="05"
      kicker="MEMÓRIA DE CÁLCULO"
      title="Passo a passo da resolução"
      sub={
        <>
          Eliminação de <strong>Gauss-Jordan</strong> com pivoteamento parcial:
          cada operação elementar entre linhas é registrada junto com a matriz
          resultante até a forma escalonada reduzida.
        </>
      }
    >
      <div className="steps-scroll">
        <div className="step">
          <span className="step-index">00</span>
          <div className="step-content">
            <div className="step-op">
              <span className="tag-mini start">início</span>
              Matriz ampliada inicial (A|B).
            </div>
            <div className="step-matrix">
              <Tex tex={augmentedTex(res.startMatrix, res.n)} display />
            </div>
          </div>
        </div>

        {res.steps.map((step, idx) => (
          <div className="step" key={idx}>
            <span className="step-index">{String(idx + 1).padStart(2, "0")}</span>
            <div className="step-content">
              <div className="step-op">
                <span className={`tag-mini ${step.type}`}>
                  {STEP_LABELS[step.type]}
                </span>
                <span>{step.text}</span>
                <span className="step-op-tex">
                  <Tex tex={stepTex(step)} />
                </span>
              </div>
              <div className="step-matrix">
                <Tex tex={augmentedTex(step.matrix, res.n)} display />
              </div>
            </div>
          </div>
        ))}

        <div className="step step-final">
          <span className="step-index">✓</span>
          <div className="step-content">
            <div className="step-op">
              <span className="tag-mini final">final</span>
              Forma escalonada reduzida. Pivôs destacados em azul.
            </div>
            <div className="step-matrix">
              <Tex tex={augmentedTex(res.M, res.n, pivots)} display />
            </div>
          </div>
        </div>
      </div>

      <div className="rank-grid">
        <span className="chip">
          posto(A) <strong>{res.rankA}</strong>
        </span>
        <span className={`chip ${res.inconsistent ? "chip-si" : "chip-spd"}`}>
          posto(A|B) <strong>{res.rankAug}</strong>
        </span>
        <span className="chip">
          incógnitas <strong>{res.n}</strong>
        </span>
        <span className="chip">
          linhas nulas em A <strong>{nullRows}</strong>
        </span>
        <span className="chip">
          tolerância relativa <strong>1e−9</strong>
        </span>
      </div>
    </SectionShell>
  )
}

function ClassificationSection({ result }) {
  const { res, classification } = result
  const cls = classification.toLowerCase()

  const descs = {
    SPD: (
      <>
        Como <strong>posto(A) = posto(A|B) = {res.n}</strong>, o sistema é
        compatível e o número de equações independentes é igual ao número de
        incógnitas: existe exatamente uma solução.
      </>
    ),
    SPI: (
      <>
        Como <strong>posto(A) = posto(A|B) = {res.rankA}</strong>, que é menor
        que o número de incógnitas (<strong>{res.n}</strong>), o sistema é
        compatível, mas sobram <strong>{res.n - res.rankA}</strong> grau(s) de
        liberdade — logo, infinitas soluções.
      </>
    ),
    SI: (
      <>
        Como <strong>posto(A) = {res.rankA}</strong> é diferente de{" "}
        <strong>posto(A|B) = {res.rankAug}</strong>, o sistema é incompatível:
        existe uma linha do tipo <strong>0 = k</strong> com k ≠ 0.
      </>
    ),
  }

  return (
    <SectionShell
      id="sec-classification"
      index="06"
      kicker="CLASSIFICAÇÃO"
      title="Classificação do sistema"
      className={`class-card class-${cls}`}
    >
      <div className="class-top">
        <span className={`class-badge class-badge-${cls}`}>{classification}</span>
        <div>
          <div className="class-title">{CLASS_TITLES[classification]}</div>
          <div className="class-sub">{CLASS_SUBS[classification]}</div>
        </div>
      </div>

      <p className="class-desc">{descs[classification]}</p>

      <div className="class-cond">
        <span className="cond-label">Critério</span>
        <Tex tex={criterionTex(res, classification)} className="cond-tex" />
      </div>

      {classification === "SI" ? (
        <div className="inconsistency">
          <span className="matrix-label">Inconsistência encontrada</span>
          {res.inconsistentRows.map((row) => {
            const k = res.M[row][res.n]
            const zeroSide = res.n === 2 ? "0x + 0y" : "0"
            return (
              <div className="inconsistency-row" key={row}>
                <span className="var-name">L{row + 1}</span>
                <Tex tex={`${zeroSide} = ${texNum(k)}`} />
                <span className="inconsistency-arrow">→</span>
                <Tex tex={`0 = ${texNum(k)}`} className="impossible" />
                <span className="inconsistency-note">impossível</span>
              </div>
            )
          })}
        </div>
      ) : null}
    </SectionShell>
  )
}

function SolutionSection({ result }) {
  const { res, solution, classification } = result
  const vars = VARS.slice(0, res.n)
  const cls = classification.toLowerCase()

  return (
    <SectionShell
      id="sec-solution"
      index="07"
      kicker="CONJUNTO SOLUÇÃO"
      title="Solução do sistema"
      className={`solution-card solution-${cls}`}
    >
      <div className={`solution-main ${cls}`}>
        <Tex tex={solutionTex(solution, classification)} display />
      </div>

      {classification === "SI" ? (
        <p className="sol-note">
          O conjunto solução é vazio: não existem valores reais que satisfaçam
          todas as equações ao mesmo tempo.
        </p>
      ) : null}

      {classification === "SPD" ? (
        <>
          <div className="sol-list">
            {solution.exprs.map((expr, index) => (
              <div className="sol-item" key={vars[index]}>
                <span className="var-name">{vars[index]}</span>
                <span className="sol-eq">=</span>
                <span className="val">{fmt(expr.constant)}</span>
              </div>
            ))}
          </div>
          <p className="sol-note">
            Substitua os valores nas equações originais para conferir a solução.
          </p>
        </>
      ) : null}

      {classification === "SPI" ? (
        <>
          <div className="sol-list">
            {solution.exprs.map((expr, index) => (
              <div className="sol-item" key={vars[index]}>
                <span className="var-name">{vars[index]}</span>
                <span className="sol-eq">=</span>
                <Tex tex={paramExprTex(expr)} className="val" />
              </div>
            ))}
          </div>

          <p className="sol-note">Variáveis livres (que recebem parâmetros):</p>
          <div className="free-list">
            {solution.freeCols.map((col, index) => (
              <span className="free-chip" key={vars[col]}>
                {vars[col]} = {solution.params[index]} (livre)
              </span>
            ))}
          </div>

          <p className="sol-note">
            Cada valor real atribuído ao(s) parâmetro(s) gera uma solução
            diferente do sistema — por isso existem infinitas soluções.
          </p>
        </>
      ) : null}
    </SectionShell>
  )
}

function ExplainSection() {
  return (
    <SectionShell
      id="teoria"
      index="09"
      kicker="REFERÊNCIA TEÓRICA"
      title="Entendendo SPD, SPI e SI"
      sub="A classificação vem da comparação entre os postos da matriz dos coeficientes e da matriz ampliada."
      noPrint
    >
      <div className="explain-grid">
        <article className="explain-card spd">
          <span className="sigla">SPD</span>
          <h4>Sistema Possível e Determinado</h4>
          <p>
            Possui <strong>uma única solução</strong>. No plano, as retas se
            cruzam em um único ponto.
          </p>
          <div className="cond">posto(A) = posto(A|B) = nº de incógnitas</div>
        </article>

        <article className="explain-card spi">
          <span className="sigla">SPI</span>
          <h4>Sistema Possível e Indeterminado</h4>
          <p>
            Possui <strong>infinitas soluções</strong>. As incógnitas livres
            viram parâmetros. No plano, as retas são coincidentes.
          </p>
          <div className="cond">posto(A) = posto(A|B) &lt; nº de incógnitas</div>
        </article>

        <article className="explain-card si">
          <span className="sigla">SI</span>
          <h4>Sistema Impossível</h4>
          <p>
            <strong>Não possui solução</strong>: as condições se contradizem. No
            plano, as retas são paralelas distintas.
          </p>
          <div className="cond">posto(A) ≠ posto(A|B)</div>
        </article>
      </div>

      <h3 className="method-title">Como a resolução funciona</h3>
      <ol className="method-list">
        <li>
          <span className="n">1</span>
          <span>
            <strong>Matriz ampliada:</strong> os coeficientes e os termos
            independentes são colocados na mesma matriz (A|B).
          </span>
        </li>
        <li>
          <span className="n">2</span>
          <span>
            <strong>Pivôs e operações elementares:</strong> escolhe-se o maior
            elemento em módulo da coluna (pivoteamento parcial) e usam-se troca
            de linhas, multiplicação por escalar e substituição entre linhas.
          </span>
        </li>
        <li>
          <span className="n">3</span>
          <span>
            <strong>Postos:</strong> conta-se o número de linhas não nulas com
            pivô em A e em (A|B). Uma linha do tipo <em>0 = k</em> com k ≠ 0
            indica inconsistência.
          </span>
        </li>
        <li>
          <span className="n">4</span>
          <span>
            <strong>Tolerância numérica:</strong> valores abaixo de 10⁻⁹ × (maior
            entrada da matriz A) são tratados como zero, evitando erros de
            arredondamento.
          </span>
        </li>
      </ol>

      <p className="disclaimer">
        Todos os resultados são calculados a partir dos valores digitados —
        nenhum valor é predefinido ou simulado.
      </p>
    </SectionShell>
  )
}

export {
  ConfigSection,
  InputSection,
  SystemSection,
  MatricesSection,
  StepsSection,
  ClassificationSection,
  SolutionSection,
  ExplainSection,
}
