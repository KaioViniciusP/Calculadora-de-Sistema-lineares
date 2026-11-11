import { VARS } from "../lib/solver"

/**
 * Grade editável de coeficientes.
 * A última coluna é o termo independente e recebe um separador tracejado.
 */
export default function MatrixInput({ n, m, values, errors, onChange, onKeyDown, inputRefs }) {
  const vars = VARS.slice(0, n)

  return (
    <div className="table-wrap">
      <table className="matrix-input">
        <thead>
          <tr>
            <th className="corner" scope="col">
              EQ
            </th>
            {vars.map((variable) => (
              <th key={variable} className="var-col" scope="col">
                <span className="var-symbol">{variable}</span>
              </th>
            ))}
            <th className="b-col" scope="col">
              Termo independente
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: m }, (_, row) => (
            <tr key={row}>
              <th scope="row" className="row-label">
                {String(row + 1).padStart(2, "0")}
              </th>
              {Array.from({ length: n }, (_, col) => {
                const key = `${row}-${col}`
                return (
                  <td key={key}>
                    <input
                      ref={(element) => {
                        if (inputRefs) inputRefs.current[key] = element
                      }}
                      className={`num-input ${errors.has(key) ? "invalid" : ""}`}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      spellCheck="false"
                      placeholder="0"
                      aria-label={`Coeficiente de ${vars[col]} na equação ${row + 1}`}
                      data-row={row}
                      data-col={col}
                      value={values[row]?.[col] ?? ""}
                      onChange={(event) => onChange(row, col, event.target.value)}
                      onKeyDown={onKeyDown}
                    />
                  </td>
                )
              })}
              <td className="b-cell">
                <input
                  ref={(element) => {
                    if (inputRefs) inputRefs.current[`${row}-${n}`] = element
                  }}
                  className={`num-input num-input-b ${errors.has(`${row}-${n}`) ? "invalid" : ""}`}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="0"
                  aria-label={`Termo independente da equação ${row + 1}`}
                  data-row={row}
                  data-col={n}
                  value={values[row]?.[n] ?? ""}
                  onChange={(event) => onChange(row, n, event.target.value)}
                  onKeyDown={onKeyDown}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
