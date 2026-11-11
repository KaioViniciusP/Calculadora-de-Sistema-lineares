import { useMemo } from "react"
import katex from "katex"

/**
 * Renderiza uma expressão LaTeX com KaTeX.
 * `display` usa modo de bloco (centralizado, maior).
 */
export default function Tex({ tex, display = false, className = "" }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: "ignore",
        trust: true,
        output: "html",
      })
    } catch (error) {
      return `<span class="tex-error">${String(error.message || error)}</span>`
    }
  }, [tex, display])

  return (
    <span
      className={`tex ${display ? "tex-display" : ""} ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
