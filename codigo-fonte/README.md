# Calculadora de Sistemas Lineares — React + Mafs + KaTeX

Código-fonte da calculadora publicada em `../index.html` (build single-file).

## Tecnologias

- **React 18** + **Vite 7**
- **Mafs 0.21** — gráfico cartesiano interativo (zoom, pan, retas e ponto de interseção)
- **KaTeX** — sistema de equações, matrizes, operações elementares e conjunto solução
- **Geist Sans / Geist Mono** via `@fontsource-variable` (fontes locais, sem CDN)
- **vite-plugin-singlefile** — JS, CSS e fontes embutidos em um único `index.html`

## Desenvolvimento

```powershell
npm.cmd install
npm.cmd run dev
```

> No Windows, use `npm.cmd` porque a política de execução do PowerShell bloqueia `npm.ps1`.

## Build

```powershell
npm.cmd run build
```

O resultado fica em `dist/index.html`. Ele é autocontido e abre com duplo clique,
sem servidor e sem internet.

Para publicar, copie o build sobre a versão da raiz:

```powershell
Copy-Item dist/index.html ..\index.html -Force
```

## Estrutura

```
src/
  App.jsx                    estado, resolução, exemplos, copiar/imprimir
  main.jsx                   entrada React + fontes + CSS do KaTeX/Mafs
  styles.css                 Geist × Meridian Blueprint (tela e impressão)
  components/
    SheetHeader.jsx          barra de carimbo da prancha
    Sections.jsx             seções da prancha (SEC 01 a 09)
    MatrixInput.jsx          grade editável de coeficientes
    GraphView.jsx            gráfico Mafs e explicação para 3+ incógnitas
    Tex.jsx                  renderizador KaTeX
  lib/
    solver.js                Gauss-Jordan, postos, SPD/SPI/SI, paramétrica
    latex.js                 construtores de LaTeX
    examples.js              exemplos e redimensionamento da grade
```

## Verificações matemáticas

- Eliminação de Gauss-Jordan com pivoteamento parcial.
- Tolerância relativa `1e-9 × max|A|` (apenas a matriz A).
- Classificação por postos de A e (A|B).
- Solução paramétrica com parâmetros `t, s, u, r, q`.
- Entrada aceita inteiros, decimais com vírgula/ponto, negativos, zero e frações (`1/2`).
