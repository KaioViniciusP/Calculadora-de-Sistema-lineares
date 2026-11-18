/** Cabeçalho tipo carimbo de prancha técnica (Meridian Blueprint). */
export default function SheetHeader() {
  return (
    <header className="sheet-bar">
      <div className="sheet-brand">
        <span className="sheet-dot" aria-hidden="true" />
        <span>CALC · SISTEMAS LINEARES</span>
      </div>
      <div className="sheet-meta" aria-label="Metadados da prancha">
        <span>SHEET 01 / 11</span>
        <span className="sheet-sep" aria-hidden="true" />
        <span>REV 2.0</span>
        <span className="sheet-sep" aria-hidden="true" />
        <span>SCALE 1:1</span>
      </div>
      <nav className="sheet-nav" aria-label="Navegação principal">
        <a href="#resolver">RESOLVER</a>
        <a href="#coeficientes">DADOS</a>
        <a href="#teoria">TEORIA</a>
      </nav>
    </header>
  )
}
