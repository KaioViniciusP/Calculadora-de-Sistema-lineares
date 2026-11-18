# Documentação do Sistema — Calculadora de Sistemas Lineares

> **Versão:** 2.0.0 · **Última atualização:** novembro de 2026
>
> **Repositório:** <https://github.com/KaioViniciusP/Calculadora-de-Sistema-lineares>
>
> **Aplicação publicada:** <https://kaioViniciusP.github.io/Calculadora-de-Sistema-lineares/>

---

## Índice

1. [Visão geral](#1-visão-geral)
2. [Objetivo e público-alvo](#2-objetivo-e-público-alvo)
3. [Escopo](#3-escopo)
4. [Requisitos](#4-requisitos)
5. [Arquitetura](#5-arquitetura)
6. [Fluxo de execução](#6-fluxo-de-execução)
7. [Módulos e responsabilidades](#7-módulos-e-responsabilidades)
8. [Modelo matemático](#8-modelo-matemático)
9. [Interface](#9-interface)
10. [Exemplos embutidos](#10-exemplos-embutidos)
11. [Build, execução e publicação](#11-build-execução-e-publicação)
12. [Validação e testes](#12-validação-e-testes)
13. [Limitações e riscos](#13-limitações-e-riscos)
14. [Manutenção e evolução](#14-manutenção-e-evolução)
15. [Referências](#15-referências)

---

## 1. Visão geral

A **Calculadora de Sistemas Lineares** é uma aplicação web em português (pt-BR) que resolve sistemas de equações lineares de **1 a 5 equações** e **2 a 5 incógnitas**. Diferentemente de calculadoras que só exibem a resposta, ela apresenta a **memória de cálculo completa**: o sistema montado, as matrizes, a **Regra de Cramer** com os determinantes calculados pelo **Teorema de Laplace** (menores complementares, cofatores e parcelas), a verificação por substituição e, como **método de conferência**, cada operação elementar do escalonamento de Gauss-Jordan, a classificação por postos e o conjunto solução.

O sistema roda inteiramente no navegador, sem backend, cadastro ou conexão com a internet. O build publicado é um **único arquivo `index.html`** com JavaScript, CSS e fontes embutidos, que pode ser aberto por duplo clique (`file://`).

| Item | Valor |
|---|---|
| Nome | Calculadora de Sistemas Lineares |
| Versão | 2.0.0 |
| Idioma | Português do Brasil (pt-BR) |
| Tipo | Aplicação web estática (SPA) |
| Interface | React 18 |
| Build | Vite 7 + `vite-plugin-singlefile` |
| Matemática na tela | KaTeX 0.16 |
| Gráfico | Mafs 0.21 |
| Licença de uso | Projeto acadêmico (Projeto Integrador) |

---

## 2. Objetivo e público-alvo

**Objetivo:** apoiar o estudo de álgebra linear, tornando visível o processo de resolução de um sistema linear e o significado geométrico da classificação.

**Público-alvo:**

- estudantes de Ensino Médio, graduação e cursos técnicos que estão aprendendo sistemas lineares;
- professores que precisam de um recurso de demonstração em sala ou de um material para impressão;
- qualquer pessoa que queira conferir um sistema pequeno sem instalar software.

**Proposta pedagógica:** mostrar *como* o resultado foi obtido, e não apenas *qual* é o resultado. A aplicação também evita gráficos incorretos: com 3 ou mais incógnitas, apresenta uma leitura geométrica em vez de simular um plano cartesiano enganoso.

---

## 3. Escopo

### 3.1 Funcionalidades implementadas

- Entrada de **1 a 5 equações** e **2 a 5 incógnitas** (`x, y, z, w, v`).
- Grade editável com coeficientes e termos independentes.
- Aceitação de inteiros, decimais com vírgula ou ponto, negativos, zero, frações (`1/2`) e notação científica (`2e3`).
- Todos os campos são obrigatórios: campo vazio é **inválido** e fica destacado, assim como qualquer entrada inválida (use `0` para coeficientes nulos).
- **15 exemplos prontos** cobrindo SPD, SPI e SI em diferentes dimensões, incluindo a situação-problema do relatório.
- Resolução pela **Regra de Cramer** em sistemas quadrados: determinante principal `D` e determinantes `Dx, Dy, Dz, Dw, Dv`, com `xᵢ = Dᵢ / D`.
- Determinantes pelo **Teorema de Laplace**, expandindo sempre pela 1ª coluna, com menores complementares, cofatores e parcelas exibidos.
- Em sistemas 3×3, o determinante principal também é calculado pela **Regra de Sarrus**, para comparação com Laplace.
- **Verificação por substituição** da solução de Cramer, equação por equação.
- Mensagens específicas quando `D = 0` ou quando o sistema não é quadrado.
- **Conferência** dos valores de Cramer com os do escalonamento, incógnita por incógnita.
- Escalonamento por **eliminação de Gauss-Jordan com pivoteamento parcial** (método de conferência e único método para sistemas não quadrados).
- **Passo a passo** com troca de linhas, normalização de pivô e eliminação.
- **Classificação por postos** de `A` e `(A|B)`: SPD, SPI ou SI.
- Conjunto solução **único**, **paramétrico** ou **vazio**.
- Gráfico 2D interativo com retas, ponto de interseção, zoom, pan e reenquadramento.
- Leitura geométrica para 3 ou mais incógnitas.
- **Copiar resultado** em texto e **imprimir / gerar PDF** com layout próprio.
- Interface responsiva, navegação por teclado e atalho `Enter` para resolver.

### 3.2 Fora do escopo

- Sistemas com mais de 5 incógnitas ou mais de 5 equações.
- Coeficientes simbólicos, complexos ou intervalos.
- Entrada por texto livre (por exemplo, digitar `2x + 3y = 12`).
- Persistência de histórico em nuvem ou banco de dados.
- Substituição de software de álgebra linear de alto desempenho.
- Gráfico 3D real para sistemas com 3 ou mais incógnitas.

---

## 4. Requisitos

### 4.1 Requisitos funcionais

| ID | Requisito |
|---|---|
| RF01 | Permitir escolher a quantidade de incógnitas (2–5) e de equações (1–5). |
| RF02 | Exibir uma grade editável de coeficientes e termos independentes compatível com as dimensões escolhidas. |
| RF03 | Aceitar números inteiros, decimais com vírgula ou ponto, negativos, zero, frações e notação científica. |
| RF04 | Validar as entradas (inclusive campos vazios) e destacar os campos inválidos antes de resolver. |
| RF05 | Resolver o sistema por eliminação de Gauss-Jordan com pivoteamento parcial. |
| RF06 | Exibir a matriz ampliada inicial e a matriz resultante de cada operação elementar. |
| RF07 | Calcular os postos de `A` e `(A|B)` e classificar o sistema em SPD, SPI ou SI. |
| RF08 | Exibir o conjunto solução na forma única, paramétrica ou vazia. |
| RF09 | Desenhar o gráfico das retas e o ponto de interseção para sistemas 2×2. |
| RF10 | Apresentar leitura geométrica para sistemas com 3 ou mais incógnitas. |
| RF11 | Oferecer exemplos prontos e preenchimento automático compatível com as dimensões atuais. |
| RF12 | Permitir copiar o resultado em texto e imprimir/exportar em PDF. |
| RF13 | Preservar os valores já digitados ao alterar as dimensões. |
| RF14 | Em sistemas quadrados, calcular `D` e cada `Dᵢ` pela Regra de Cramer e, se `D ≠ 0`, `xᵢ = Dᵢ / D`. |
| RF15 | Calcular os determinantes pelo Teorema de Laplace (1ª coluna), exibindo menores, cofatores e parcelas. |
| RF16 | Em 3×3, calcular `D` também pela Regra de Sarrus e indicar se coincide com Laplace. |
| RF17 | Verificar a solução de Cramer por substituição e conferi-la com o resultado do escalonamento. |
| RF18 | Informar quando a Regra de Cramer não se aplica (`D = 0` ou sistema não quadrado). |

### 4.2 Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF01 | Funcionar 100% no cliente, sem servidor de aplicação ou banco de dados. |
| RNF02 | Funcionar offline, inclusive a partir de `file://`. |
| RNF03 | Ser responsiva em desktop, tablet e celular. |
| RNF04 | Ser acessível por teclado e usar rótulos/`aria` apropriados. |
| RNF05 | Usar tipografia matemática precisa (KaTeX) e não depender de CDNs. |
| RNF06 | Tratar ruído de ponto flutuante com tolerância relativa. |
| RNF07 | Ter build autocontido em um único `index.html`. |
| RNF08 | Manter o código organizado em módulos de matemática, LaTeX e interface. |
| RNF09 | Não pré-definir resultados: todo valor exibido deriva dos dados digitados. |

---

## 5. Arquitetura

### 5.1 Visão de alto nível

```text
┌─────────────────────────────────────────────────────────────┐
│                        Navegador                            │
│                                                             │
│  index.html (build single-file com JS, CSS e fontes)        │
│      │                                                      │
│      ▼                                                      │
│  React (App.jsx)                                            │
│      │  estado: dimensões, valores, erros, resultado        │
│      ├──────────────► components/                           │
│      │                  Sections.jsx (SEC 01–11)            │
│      │                  MatrixInput.jsx (grade)             │
│      │                  GraphView.jsx (Mafs)                │
│      │                  Tex.jsx (KaTeX)                     │
│      │                                                      │
│      └──────────────► lib/                                  │
│                         cramer.js (Cramer/Laplace/Sarrus)   │
│                         solver.js (Gauss-Jordan/postos)     │
│                         formatacao.js (números/parsing)     │
│                         grafico.js (geometria do gráfico)   │
│                         latex.js (notação matemática)       │
│                         examples.js (exemplos/grade)        │
└─────────────────────────────────────────────────────────────┘
```

Não há backend. A aplicação é uma SPA estática; toda a matemática é executada no navegador.

### 5.2 Camadas

| Camada | Arquivos | Responsabilidade |
|---|---|---|
| Apresentação / estado | `App.jsx`, `main.jsx` | Estado da aplicação, eventos, resolução, copiar/imprimir. |
| Componentes visuais | `components/*.jsx` | Seções da “prancha”, grade, gráfico e renderização KaTeX. |
| Domínio matemático | `lib/cramer.js` | Regra de Cramer, Teorema de Laplace, Regra de Sarrus e verificação por substituição. |
| Domínio matemático | `lib/solver.js` | Gauss-Jordan, postos, classificação, solução paramétrica e integração com Cramer. |
| Leitura e formatação | `lib/formatacao.js` | Leitura do texto digitado e formatação de números (pt-BR e LaTeX). |
| Geometria do gráfico | `lib/grafico.js` | Enquadramento, passo da grade, extremos das retas e retas coincidentes. |
| Formatação matemática | `lib/latex.js` | Conversão de números e estruturas em LaTeX. |
| Dados auxiliares | `lib/examples.js` | Exemplos prontos e operações sobre a grade. |
| Estilo | `styles.css` | Tema visual (Geist × Meridian Blueprint), responsividade e regras de impressão. |
| Build | `vite.config.js` | Geração do arquivo único com `viteSingleFile`. |

### 5.3 Estrutura de arquivos

```text
.
├── index.html                  # build publicado (gerado; abre sozinho)
├── docs/                       # documentação e capturas de tela
│   ├── DOCUMENTACAO.md         # este documento
│   ├── GUIA-DE-USO.md          # manual do usuário
│   ├── preview.png
│   ├── solucao.png
│   └── grafico.png
├── codigo-fonte/
│   ├── index.html              # HTML de entrada do Vite
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── components/
│       │   ├── SheetHeader.jsx
│       │   ├── Sections.jsx
│       │   ├── MatrixInput.jsx
│       │   ├── GraphView.jsx
│       │   └── Tex.jsx
│       └── lib/
│           ├── cramer.js
│           ├── solver.js
│           ├── formatacao.js
│           ├── grafico.js
│           ├── latex.js
│           └── examples.js
└── README.md
```

> O `index.html` da raiz é **gerado** pelo build. Alterações devem ser feitas em `codigo-fonte/src/` e publicadas após um novo build.

---

## 6. Fluxo de execução

1. O usuário escolhe as dimensões em **SEC 01 · Configuração**. A grade é redimensionada preservando os valores existentes.
2. O usuário preenche os coeficientes em **SEC 02 · Entrada de dados** ou aplica um exemplo pronto.
3. Ao clicar em **Resolver sistema** (ou pressionar `Enter`):
   1. cada célula é convertida por `parseNumber` (campo vazio é inválido);
   2. entradas inválidas são coletadas e destacadas; a resolução é interrompida;
   3. `A` e `b` são montados;
   4. `solveSystem(A, b)` executa Gauss-Jordan, classificação e solução paramétrica e acrescenta o campo `cramer` (Regra de Cramer com Laplace, Sarrus em 3×3 e verificação);
   5. o resultado é armazenado no estado e as seções SEC 03–10 são renderizadas (SEC 09 só quando a Regra de Cramer se aplica);
   6. o gráfico é remontado (`graphKey`) e a página rola até o sistema.
4. Alterar qualquer coeficiente marca o resultado como **desatualizado** (“stale”), sem apagá-lo.
5. O usuário pode copiar o resultado em texto ou imprimir/exportar em PDF.

---

## 7. Módulos e responsabilidades

Os módulos de cálculo (`cramer.js` e `solver.js`) contêm apenas matemática: não importam React, formatação, LaTeX nem o gráfico; recebem arrays e devolvem números/objetos.

### 7.1 `lib/cramer.js` — Regra de Cramer e Teorema de Laplace

Funções puras para matrizes quadradas de ordem 1 a 5.

| Função | Entrada | Saída / efeito |
|---|---|---|
| `detLaplace(M)` | matriz `n×n` | determinante por Laplace, recursivo, sempre pela 1ª coluna; casos base `n = 1` (`a₁₁`) e `n = 2` (`a₁₁·a₂₂ − a₁₂·a₂₁`) |
| `expansaoLaplace(M)` | matriz `n×n` (`n ≥ 2`) | primeiro nível da expansão: `{ termos: [{ linha, elemento, submatriz, menor, cofator, parcela }], total }` (só para exibição) |
| `detSarrus(M)` | matriz 3×3 | determinante pela Regra de Sarrus (`null` se não for 3×3) |
| `trocarColuna(A, k, b)` | matriz, índice, vetor | cópia de `A` com a coluna `k` substituída por `b` (`A` não é alterada) |
| `ehZero(valor, M)` | determinante e sua matriz | matriz inteira (com limite de Hadamard abaixo de `Number.MAX_SAFE_INTEGER`): `valor === 0`; caso contrário, `\|valor\| ≤ 1e-10 × limite de Hadamard` |
| `resolverCramer(A, b)` | sistema quadrado | `{ aplicavel, D, Di, expansao, solucao, algumDiNaoNulo }` |
| `verificarSolucao(A, b, x)` | sistema e solução | por equação: `{ ladoEsquerdo, termo, satisfeita }` (tolerância `1e-9 ×` escala da equação: maior entre `\|bᵢ\|` e os `\|aᵢⱼ·xⱼ\|`) |
| `coincidem(a, b)` | dois números | `true` se a diferença relativa for até `1e-9` (usada na conferência e na comparação Laplace × Sarrus) |

### 7.2 `lib/solver.js` — escalonamento

| Função / constante | Entrada | Saída / efeito |
|---|---|---|
| `EPS` | — | `1e-9`, fator da tolerância relativa do escalonamento |
| `PARAM_NAMES` | — | nomes dos parâmetros livres: `t, s, u, r, q` |
| `cleanZero(value, tol)` | número | `0` quando dentro da tolerância (usada no Gauss-Jordan) |
| `gaussJordan(A, b)` | matriz `m×n`, vetor `m` | `{ M, steps, pivotCols, tolerance, rankA, rankAug, inconsistent, inconsistentRows, m, n, startMatrix }` |
| `classify(res)` | resultado de `gaussJordan` | `"SPD"`, `"SPI"` ou `"SI"` |
| `buildParametricSolution(res)` | resultado de `gaussJordan` | `{ freeCols, params, exprs, isConstant }` |
| `solveSystem(A, b)` | sistema | `{ A, b, res, classification, solution, cramer }` |

O campo `cramer` de `solveSystem`:

- sistema quadrado: resultado de `resolverCramer(A, b)` acrescido de `verificacao` (resultado de `verificarSolucao`, só quando `aplicavel = true`) e `sarrus` (resultado de `detSarrus`, só em 3×3);
- sistema não quadrado: `{ aplicavel: false, motivo: "nao-quadrado" }`.

### 7.3 `lib/formatacao.js` — leitura e formatação de números

| Função / constante | Entrada | Saída / efeito |
|---|---|---|
| `VARS` | — | nomes das incógnitas: `x, y, z, w, v` |
| `SUB` | — | índices subscritos Unicode (`₁` a `₈`) |
| `parseNumber(raw)` | texto digitado | número; `NaN` se inválido **ou vazio** |
| `fmt(value, digits)` | número | texto pt-BR (vírgula decimal, notação científica quando necessário) |
| `texNum(value, digits)` | número | número formatado para LaTeX |

### 7.4 `lib/grafico.js` — geometria do gráfico

| Função | Entrada | Saída / efeito |
|---|---|---|
| `niceStep(raw)` | escala bruta | passo “redondo” (1, 2, 5 × 10ᵏ) para a grade |
| `linesCoincident(lines)` | retas desenhadas | indica se todas são coincidentes |
| `computeView(A, b, point)` | sistema e ponto | retângulo de visualização e passo da grade |
| `lineEndpoints(a, b, c, view)` | coeficientes da reta | dois pontos distantes para desenhar o segmento |

### 7.5 `lib/latex.js` — notação matemática

| Função | Uso |
|---|---|
| `linearExprTex` | lado esquerdo de uma equação (`2x - y + 0{,}5z`) |
| `systemTex` | sistema completo com chaves e alinhamento no `=` |
| `matrixTex` | matriz com colchetes; 3º parâmetro opcional destaca uma coluna em azul |
| `detTex` | determinante com barras verticais (coluna opcional em azul, como em `Dᵢ`) |
| `vectorTex` / `variableVectorTex` | vetores coluna `B` e `X` |
| `augmentedTex` | matriz ampliada `(A|B)` com barra e pivôs destacados |
| `stepTex` | operação elementar (`L₂ ↔ L₁`, `L₁ ← L₁ ÷ 2`, etc.) |
| `paramExprTex` | expressão da solução paramétrica |
| `solutionTex` | conjunto solução `S` |
| `criterionTex` | critério de classificação com os valores do caso |
| `minorTex` / `cofactorTex` / `termTex` | menor complementar `Mᵢ₁`, cofator `Cᵢ₁` e parcela `aᵢ₁·Cᵢ₁` de cada linha da expansão |
| `laplaceSumTex` | soma da expansão de Laplace até o valor de `D` |
| `sarrusTex` | Regra de Sarrus com diagonais principais `P`, secundárias `S` e `D = P − S` |
| `cramerQuotientTex` | `xᵢ = Dᵢ / D` com os valores |
| `substitutionTex` | substituição da solução no lado esquerdo de uma equação |

### 7.6 Componentes

| Componente | Responsabilidade |
|---|---|
| `App.jsx` | Estado global, validação, resolução, exemplos, copiar (incluindo o bloco de Cramer), imprimir e composição da página. |
| `SheetHeader.jsx` | Barra de carimbo da “prancha” (`SHEET 01 / 11 · REV 2.0`). |
| `Sections.jsx` | Moldura comum e conteúdo das seções SEC 01–11, inclusive `CramerSection`, `ConferenceSection` e as mensagens de Cramer (`cramerMensagem`). |
| `MatrixInput.jsx` | Grade editável, com a última coluna reservada ao termo independente. |
| `GraphView.jsx` | Gráfico Mafs para 2 incógnitas e explicação geométrica para 3+. |
| `Tex.jsx` | Encapsula o KaTeX (`renderToString`), com fallback de erro. |

### 7.7 `lib/examples.js`

- `EXAMPLES`: lista dos 15 exemplos prontos (os dois da situação-problema no topo).
- `emptyValues(m, n)`: grade vazia.
- `resizeValues(values, m, n)`: redimensiona preservando valores.
- `valuesFromSystem(A, b)`: converte `A`/`b` em textos para a grade.
- `exampleForSize(n, m)`: retorna um exemplo compatível ou gera um SPD sintético.

---

## 8. Modelo matemático

### 8.1 Representação

Um sistema com `m` equações e `n` incógnitas é escrito como `A · X = B`:

```text
 a₁₁x₁ + a₁₂x₂ + ... + a₁ₙxₙ = b₁
 a₂₁x₁ + a₂₂x₂ + ... + a₂ₙxₙ = b₂
 ...
 aₘ₁x₁ + aₘ₂x₂ + ... + aₘₙxₙ = bₘ
```

A Regra de Cramer usa a **matriz principal** `A` (quadrada, `n × n`). O escalonamento usa a **matriz ampliada** `(A|B)`, de dimensão `m × (n+1)`, em que a última coluna contém os termos independentes.

### 8.2 Regra de Cramer

Aplica-se apenas a sistemas **quadrados** (`m = n`):

```text
D  = det(A)                       determinante principal
Dᵢ = det(Aᵢ)                      Aᵢ = A com a coluna i trocada por B
D ≠ 0  →  sistema possível e determinado,  xᵢ = Dᵢ / D
```

Nomes seguem as incógnitas: `Dx, Dy, Dz, Dw, Dv`. Quando a regra não se aplica, a interface exibe:

| Caso | Mensagem |
|---|---|
| `D = 0` e pelo menos um `Dᵢ ≠ 0` | “D = 0 e pelo menos um Dᵢ ≠ 0: o sistema é impossível.” |
| `D = 0` e todos os `Dᵢ = 0` | “D = 0 e todos os Dᵢ = 0: os determinantes não bastam para classificar o sistema (ele pode ser possível e indeterminado ou impossível). A classificação é confirmada pelo escalonamento, na seção Classificação do sistema.” |
| sistema não quadrado | “A Regra de Cramer exige o mesmo número de equações e incógnitas. Este sistema é resolvido apenas por escalonamento.” |

O caso “todos os `Dᵢ = 0`” é inconclusivo de fato: o exemplo `3x3-spi` é SPI e o exemplo `3x3-d0-si` (todos os coeficientes iguais a 1, `b = (1, 2, 3)`) é SI, ambos com `D = Dx = Dy = Dz = 0`.

Quando `D ≠ 0`, a solução é **verificada por substituição**: para cada equação, calcula-se `Σ aᵢⱼ·xⱼ` e compara-se com `bᵢ`. A tolerância é relativa à escala da própria equação: `|Σ aᵢⱼ·xⱼ − bᵢ| ≤ 1e-9 × max(|bᵢ|, |aᵢ₁·x₁|, …, |aᵢₙ·xₙ|)`. Assim, termos independentes ou soluções grandes (por exemplo, `b = (110000, 190000, 200000)`, com solução `(20000, 30000, 40000)`) não reprovam uma solução correta por erro de arredondamento.

### 8.3 Teorema de Laplace e Regra de Sarrus

Todos os determinantes (`D` e cada `Dᵢ`) são calculados por `detLaplace`, expandindo **sempre pela 1ª coluna** (requisito fixo: os menores e cofatores exibidos são comparados com um cálculo manual feito pela mesma coluna):

```text
det(M) = a₁₁·C₁₁ + a₂₁·C₂₁ + … + aₙ₁·Cₙ₁
Cᵢ₁    = (−1)^(i+1) · Mᵢ₁          Mᵢ₁ = determinante da submatriz sem a linha i e a coluna 1
n = 1  →  det = a₁₁
n = 2  →  det = a₁₁·a₂₂ − a₁₂·a₂₁
```

Com coeficientes inteiros, os determinantes saem **exatos**: a expansão usa só somas e produtos, e a única divisão ocorre no final da Regra de Cramer (`xᵢ = Dᵢ / D`). O custo cresce na ordem de `n!`, aceitável porque a interface limita os sistemas a 5×5.

Exemplo — situação-problema do relatório, `A = [[2,1,1],[1,3,2],[3,2,2]]`:

| i | aᵢ₁ | Mᵢ₁ | Cᵢ₁ | aᵢ₁·Cᵢ₁ |
|---|---|---|---|---|
| 1 | 2 | 2 | 2 | 4 |
| 2 | 1 | 0 | 0 | 0 |
| 3 | 3 | −1 | −1 | −3 |

`D = 4 + 0 − 3 = 1`. Com `b = (100, 180, 200)`: `Dx = 0`, `Dy = −20`, `Dz = 120`, logo `(x, y, z) = (0, −20, 120)`.

Em sistemas 3×3, `D` também é calculado pela **Regra de Sarrus** (`detSarrus`), como segundo método:

```text
D = (a₁₁a₂₂a₃₃ + a₁₂a₂₃a₃₁ + a₁₃a₂₁a₃₂) − (a₁₃a₂₂a₃₁ + a₁₁a₂₃a₃₂ + a₁₂a₂₁a₃₃)
```

A interface indica “Laplace e Sarrus: mesmo resultado” ou “resultados diferentes”.

### 8.4 Determinante nulo: tolerância de `ehZero`

`ehZero(valor, M)` decide se um determinante é zero em dois casos:

- **Matriz de inteiros:** o Teorema de Laplace usa só somas e produtos, então o determinante é **exato** enquanto couber em `Number.MAX_SAFE_INTEGER` (2⁵³ − 1). A comparação é direta: `valor === 0`.
- **Matriz com decimais** (`0,1`, `1/3`…), ou inteiros grandes demais: o ponto flutuante gera resíduos como `1e-17` onde o determinante deveria ser `0`. Usa-se uma tolerância proporcional ao **limite de Hadamard**:

```text
|det(M)| ≤ ‖coluna 1‖ · ‖coluna 2‖ · … · ‖coluna n‖          (limite de Hadamard)

det considerado nulo  ⇔  |det(M)| ≤ 1e-10 × ‖coluna 1‖ · … · ‖coluna n‖
```

O limite de Hadamard cresce na mesma proporção que o determinante: multiplicar uma coluna por `k` multiplica os dois por `k`. Uma regra baseada em `(max|mᵢⱼ|)ⁿ` não tem essa propriedade e falha em dois casos:

| Caso | Com `1e-9 × (max\|mᵢⱼ\|)ⁿ` | Com a regra atual |
|---|---|---|
| `A = [[2,1,1],[1,3,2],[3,2,2]]`, `b = (110000, 190000, 200000)` | os `Dᵢ` (até `40000`) ficam abaixo de `1e-9 × 200000³ = 8·10⁶` e viram `0`; solução `(0, 0, 0)` | `Dx = 20000`, `Dy = 30000`, `Dz = 40000`; solução `(20000, 30000, 40000)` |
| 5×5 de inteiros até `1000` com `D = 1` (ex.: `[[1000,999,0,0,0],[1,1,0,0,0],…]`) | `D = 1` fica abaixo de `1e-9 × 1000⁵ = 10⁶` e vira `0` | `D = 1`; solução `(−998, 999, 1, 1, 1)` |

Com decimais, a regra continua reconhecendo determinantes nulos: em `[[0,1; 0,2], [0,3; 0,6]]`, `D` é tratado como `0`.

`D` e cada `Dᵢ` são testados com a própria matriz (`A` ou `Aᵢ`); valores considerados nulos são devolvidos como `0`.

### 8.5 Eliminação de Gauss-Jordan com pivoteamento parcial (conferência)

O escalonamento é o **método de conferência** dos resultados da Regra de Cramer e o único método para sistemas não quadrados.

Pseudocódigo implementado em `gaussJordan`:

```text
tolerância ← 1e-9 × max|A|          (1e-12 se A for toda nula)
M ← [A | b]
linha ← 0
para cada coluna col de A:
    pivô ← linha com maior |M[i][col]|, para i ≥ linha
    se |M[pivô][col]| ≤ tolerância:
        zerar a coluna a partir de "linha" e continuar
    se pivô ≠ linha:
        trocar as linhas e registrar operação "swap"
    dividir a linha do pivô por M[linha][col] e registrar "scale"
    para cada outra linha i:
        fator ← M[i][col]
        se |fator| > tolerância:
            L[i] ← L[i] − fator × L[linha] e registrar "eliminate"
    registrar a coluna do pivô
    linha ← linha + 1
```

Ao final, `M` está na **forma escalonada reduzida** (Gauss-Jordan), e cada operação elementar fica registrada em `steps` para exibição.

### 8.6 Tolerância numérica do escalonamento

Os cálculos usam ponto flutuante de precisão dupla. Para evitar que resíduos como `0,0000000001` sejam interpretados como valores reais, a aplicação usa:

```text
tolerância = 1e-9 × max|A|
```

A tolerância é **relativa à matriz `A`**, não aos termos independentes, para que valores grandes em `b` não zerem coeficientes legítimos. Se `max|A| = 0`, usa-se `1e-12`. Valores dentro da tolerância são normalizados para zero em todas as operações e na solução final. Na formatação, valores menores que `1e-12` também são exibidos como zero, e números próximos de inteiros são “limpos” antes da exibição.

### 8.7 Classificação por postos (Rouché–Capelli)

| Condição | Classificação | Significado |
|---|---|---|
| `posto(A) ≠ posto(A|B)` | **SI** — Sistema Impossível | Não há solução; existe linha `0 = k` com `k ≠ 0`. |
| `posto(A) = posto(A|B) = n` | **SPD** — Sistema Possível e Determinado | Solução única. |
| `posto(A) = posto(A|B) < n` | **SPI** — Sistema Possível e Indeterminado | Infinitas soluções; `n − posto(A)` graus de liberdade. |

O posto é o número de pivôs encontrados (linhas não nulas) na eliminação. Quando há inconsistência, `rankAug` é registrado como `rankA + 1`.

**Leitura geométrica em 2D:**

- SPD → retas concorrentes em um ponto;
- SPI → retas coincidentes (ou uma única reta, quando `m = 1`);
- SI → retas paralelas distintas (ou ausência de reta, se todos os coeficientes forem zero).

### 8.8 Solução paramétrica

Para sistemas SPI:

- colunas sem pivô correspondem a **variáveis livres**;
- cada variável livre recebe um parâmetro, na ordem `t, s, u, r, q`;
- as variáveis pivô são expressas em função da constante e dos parâmetros.

Exemplo (`x + y = 2`, `2x + 2y = 4`):

```text
posto(A) = posto(A|B) = 1 < 2  →  SPI
y = t (livre)
x = 2 − t
S = { (2 − t, t) | t ∈ ℝ }
```

Para SPD, o conjunto é um único ponto `S = {(x₁; x₂; …; xₙ)}`. Para SI, `S = ∅`.

### 8.9 Gráfico

Para `n = 2`, cada equação `a·x + b·y = c` é desenhada como uma reta:

- o ponto de ancoragem é a projeção da origem sobre a reta;
- a direção é `(b, −a)`;
- os extremos são calculados bem além do retângulo visível;
- o enquadramento (`computeView`) centraliza as retas no ponto de interseção e nos pontos de ancoragem, com margem de 1,85× e passo de grade “redondo”.

Para `n ≥ 3`, não há gráfico cartesiano: a aplicação explica que cada equação representa um plano (ou hiperplano) e apresenta a classificação com os postos. Isso evita uma visualização incorreta.

---

## 9. Interface

### 9.1 Seções da “prancha”

| Seção | ID | Conteúdo |
|---|---|---|
| SEC 01 · Configuração | `#resolver` | Seleção de incógnitas/equações e metadados (dimensões, método, tolerância). |
| SEC 02 · Entrada de dados | `#coeficientes` | Grade editável, exemplos, validação e botão resolver. |
| SEC 03 · Sistema | `#sec-system` | Sistema de equações em notação matemática. |
| SEC 04 · Representação matricial | `#sec-matrices` | `A`, `X`, `B` e `(A|B)`. |
| SEC 05 · Regra de Cramer · Teorema de Laplace | `#sec-cramer` | `A` e `D` com a expansão de Laplace pela 1ª coluna (menores, cofatores, parcelas e soma); em 3×3, `D` por Sarrus ao lado; matrizes `Dᵢ` com a coluna substituída em azul; `xᵢ = Dᵢ / D`; verificação por substituição (✓/✗); mensagens de `D = 0` ou de sistema não quadrado. |
| SEC 06 · Escalonamento · Eliminação de Gauss-Jordan | `#sec-steps` | Passo a passo completo com pivôs destacados (método de conferência). |
| SEC 07 · Classificação do sistema · por escalonamento | `#sec-classification` | SPD/SPI/SI, critério e inconsistência (se houver). |
| SEC 08 · Conjunto solução · por escalonamento | `#sec-solution` | Solução única, paramétrica ou vazia. |
| SEC 09 · Conferência · Cramer × escalonamento | `#sec-conferencia` | Só para sistema quadrado com `D ≠ 0`: cada incógnita por Cramer e por escalonamento, com “coincide” ou “diverge”. |
| SEC 10 · Gráfico | `#sec-graph` | Retas e interseção (2 incógnitas) ou leitura geométrica (3+). |
| SEC 11 · Referência teórica | `#teoria` | Explicação de SPD, SPI, SI e dos métodos. |

### 9.2 Formatos de entrada aceitos

| Entrada | Interpretação |
|---|---|
| `42`, `-3` | inteiro |
| `3,5`, `3.5` | decimal |
| `−4` (sinal de menos tipográfico) | `-4` |
| `1/2` | fração → `0,5` |
| `-3/4` | fração negativa → `-0,75` |
| `2e3`, `2E-3` | notação científica |
| `1 000` | espaços internos removidos → `1000` |
| vazio | inválido — campo destacado (digite `0` para coeficientes nulos) |
| `abc`, `1/0` | inválido — campo destacado |

Mensagem exibida quando há campos inválidos: “Verifique N campo(s) destacado(s): preencha todos os campos com números inteiros, decimais (vírgula ou ponto) ou frações como 1/2. Use 0 para coeficientes nulos.”

### 9.3 Teclado e acessibilidade

- `Enter` em qualquer campo resolve o sistema.
- `↑` / `↓` navegam entre as linhas da mesma coluna.
- Todos os campos têm `aria-label` descritivo.
- Mensagens de erro e status usam `role="alert"` ou `aria-live`.
- Botões e seletores são elementos nativos, navegáveis por `Tab`.

### 9.4 Copiar e imprimir

- **Copiar resultado** monta um relatório em texto com sistema, matrizes, o bloco da Regra de Cramer (`D` com a expansão de Laplace, `D` por Sarrus em 3×3, cada `Dᵢ`, a solução por Cramer ou a mensagem de `D = 0` / não quadrado, e a verificação por substituição), classificação, postos e solução por escalonamento. Usa `document.execCommand("copy")` como estratégia principal (confiável em `file://`) e a Clipboard API como fallback.
- **Imprimir / PDF** chama `window.print()`. O CSS de impressão oculta controles (`.no-print`) e preserva as seções de resultado (inclusive Regra de Cramer e Conferência) e o gráfico. A seção de Cramer pode quebrar entre páginas, pois em 5×5 é longa.

---

## 10. Exemplos embutidos

| ID | Dimensão | Classificação | Regra de Cramer | Sistema |
|---|---|---|---|---|
| `3x3-relatorio` | 3×3 | SPD | `D = 1`, `(0, −20, 120)` | situação-problema do relatório: `2x + y + z = 100`, `x + 3y + 2z = 180`, `3x + 2y + 2z = 200` |
| `3x3-relatorio-ajustado` | 3×3 | SPD | `D = 1`, `(20, 30, 40)` | mesma matriz, totais `110`, `190`, `200` |
| `2x2-spd` | 2×2 | SPD | `D = −5`, `(3, 2)` | `2x + 3y = 12`, `x − y = 1` |
| `2x2-spi` | 2×2 | SPI | `D = 0`, todos os `Dᵢ = 0` | `x + y = 2`, `2x + 2y = 4` |
| `2x2-si` | 2×2 | SI | `D = 0`, algum `Dᵢ ≠ 0` | `x + y = 2`, `x + y = 3` |
| `2x2-dec` | 2×2 | SPD | `D = 5`, `(6,4; 3,3)` | `1,5x − 2y = 3`, `−0,5x + 4y = 10` |
| `3x2-spd` | 3×2 | SPD | não quadrado | `x + y = 5`, `x − y = 1`, `2x = 6` |
| `3x2-si` | 3×2 | SI | não quadrado | mesma matriz do anterior, com `2x = 7` |
| `1x2-spi` | 1×2 | SPI | não quadrado | `x + 2y = 4` |
| `3x3-spd` | 3×3 | SPD | `D = 1`, `(20, 30, 40)` | coeficientes variados: `2x + y + 3z = 190`, `x + 3y + 2z = 190`, `x + 2y + 2z = 160` |
| `3x3-spi` | 3×3 | SPI | `D = 0`, todos os `Dᵢ = 0` | `x + 2y + z = 4`, `2x + 4y + 2z = 8`, `x − y = 1` |
| `3x3-si` | 3×3 | SI | `D = 0`, algum `Dᵢ ≠ 0` | `x + y + z = 3`, `2x + 2y + 2z = 7`, `x − y = 1` |
| `3x3-d0-si` | 3×3 | SI | `D = 0`, todos os `Dᵢ = 0` | `x + y + z = 1`, `x + y + z = 2`, `x + y + z = 3` |
| `4x4-spd` | 4×4 | SPD | `D = 16` | matriz 4×4 com termos independentes `5, 6, 7, 8` |
| `5x5-spd` | 5×5 | SPD | `D = 5702` | matriz 5×5 com termos independentes `7, 9, 12, 15, 20` |

O botão **Exemplo preenchido** usa o primeiro exemplo compatível com a dimensão atual (em 3×3, a situação-problema do relatório); se não existir, gera um SPD sintético cuja solução é `(2, 3, 4, 5, 6)`.

---

## 11. Build, execução e publicação

### 11.1 Requisitos

- **Node.js 20+**
- npm (incluído no Node)

### 11.2 Desenvolvimento

```bash
cd codigo-fonte
npm install
npm run dev
```

No Windows, se o PowerShell bloquear `npm.ps1`:

```powershell
npm.cmd install
npm.cmd run dev
```

O Vite serve a aplicação em `http://localhost:5173` (ou na próxima porta livre).

### 11.3 Build de arquivo único

```bash
cd codigo-fonte
npm run build
```

Resultado: `codigo-fonte/dist/index.html`, autocontido. Para publicar, copie sobre o `index.html` da raiz:

```powershell
Copy-Item codigo-fonte\dist\index.html index.html -Force
```

### 11.4 Publicação no GitHub Pages

1. Envie o conteúdo da raiz para a branch `main`.
2. Em **Settings → Pages**, selecione **Deploy from a branch**.
3. Escolha **Branch: `main`** e **Folder: `/ (root)`**.
4. A aplicação fica disponível em:

```text
https://kaioViniciusP.github.io/Calculadora-de-Sistema-lineares/
```

> O arquivo `index.html` da raiz é o artefato publicado. O `dist/` e `node_modules/` são ignorados pelo Git.

---

## 12. Validação e testes

O projeto não possui suíte automatizada; a validação é feita por roteiro manual. Casos recomendados:

| # | Sistema | Resultado esperado |
|---|---|---|
| 1 | `x + y = 3`, `x − y = 1` | SPD, `x = 2`, `y = 1`, posto 2 |
| 2 | `x + y = 2`, `2x + 2y = 4` | SPI, `y = t`, `x = 2 − t`, posto 1 |
| 3 | `x + y = 2`, `x + y = 3` | SI, inconsistência `0 = 1` |
| 4 | `2x + 3y = 12`, `x − y = 1` | SPD, `(3; 2)`, retas concorrentes |
| 5 | `x + 2y = 4` (1 equação) | SPI, `y = t`, `x = 4 − 2t` |
| 6 | sistema 3×3 de coeficientes variados (`3x3-spd`) | SPD, `(20; 30; 40)` por Cramer e por escalonamento |
| 7 | matriz nula com `b ≠ 0` | SI, nenhuma reta definida |
| 8 | matriz nula com `b = 0` | SPI, todo o plano é solução |
| 9 | coeficientes com frações (`1/2`, `3/4`) | mesmo resultado das formas decimais |
| 10 | entrada inválida (`abc`, `1/0`) ou campo vazio | campos destacados, resolução bloqueada |
| 11 | alterar dimensão após resolver | valores preservados; resultado marcado como desatualizado |
| 12 | imprimir/PDF | controles ocultos; resultados e gráfico preservados |
| 13 | situação-problema (`3x3-relatorio`) | `D = 1` por Laplace e por Sarrus; menores `2, 0, −1`; cofatores `2, 0, −1`; parcelas `4, 0, −3`; `Dx = 0`, `Dy = −20`, `Dz = 120`; `(0, −20, 120)`, igual ao escalonamento; 3 equações ✓ |
| 14 | totais ajustados (`3x3-relatorio-ajustado`) | `D = 1`, `Dx = 20`, `Dy = 30`, `Dz = 40`; `(20, 30, 40)` |
| 15 | `3x3-si` | `D = 0` e algum `Dᵢ ≠ 0` → mensagem de sistema impossível |
| 16 | `3x3-spi` | `D = 0` e todos os `Dᵢ = 0` → mensagem remetendo ao escalonamento, que classifica como SPI |
| 17 | `3x3-d0-si` | `D = 0` e todos os `Dᵢ = 0`; o escalonamento classifica como SI |
| 18 | 2×2 SPD, 4×4 e 5×5 | Conferência: todas as incógnitas “coincide” |
| 19 | não quadrados (3×2, 1×2) | mensagem de sistema não quadrado; demais seções iguais às da versão anterior |

**Verificações adicionais:**

- O passo a passo deve terminar na forma escalonada reduzida.
- A soma de operações deve ser coerente com a matriz final.
- Para SPD, substituir a solução nas equações originais deve satisfazer todas (a SEC 05 faz isso automaticamente para a solução de Cramer).
- Para SPI, diferentes valores dos parâmetros devem gerar soluções válidas.
- O gráfico 2D deve mostrar interseção apenas em SPD.
- Sistemas com 3+ incógnitas devem exibir a leitura geométrica, não um gráfico 2D.

---

## 13. Limitações e riscos

| Limitação | Impacto | Mitigação |
|---|---|---|
| Ponto flutuante de precisão dupla | Sistemas muito mal condicionados podem acumular erro. | Tolerância relativa `1e-9 × max|A|`; pivoteamento parcial. |
| Máximo de 5 incógnitas/equações | Não cobre sistemas maiores. | Limite de interface explícito; foco didático. |
| Gráfico apenas para 2 incógnitas | Não há visualização 3D. | Leitura geométrica explícita para 3+. |
| Custo do Teorema de Laplace na ordem de `n!` | Inviável para matrizes grandes. | Interface limitada a 5×5 (no máximo 120 produtos por determinante). |
| `D = 0` com todos os `Dᵢ = 0` | Os determinantes não decidem entre SPI e SI. | Mensagem explícita; a classificação vem do escalonamento. |
| Sem suíte automatizada | Regressões dependem de teste manual. | Roteiro de validação na seção 12. |
| Sem persistência | Recarregar a página perde os dados. | Comportamento intencional (privacidade/simplicidade). |
| `index.html` gerado manualmente | Risco de publicar build desatualizado. | Refazer o build e copiar para a raiz a cada alteração. |

---

## 14. Manutenção e evolução

### 14.1 Adicionar um exemplo

1. Edite `codigo-fonte/src/lib/examples.js`.
2. Acrescente um objeto com `id`, `name`, `n`, `m`, `A` e `b`.
3. Rode o build e valide a classificação exibida.

### 14.2 Alterar o limite de dimensões

- A interface permite 2–5 incógnitas e 1–5 equações em `Sections.jsx` (`ConfigSection`).
- O solver já é genérico para `m × n`; para ampliar, ajuste os seletores, a lista `VARS` (em `formatacao.js`) e `PARAM_NAMES` (em `solver.js`), além do layout da grade. Lembre que o Teorema de Laplace cresce na ordem de `n!`.
- `SUB` contém índices Unicode para até 8 variáveis.

### 14.3 Alterar a tolerância

- A constante `EPS = 1e-9` está em `lib/solver.js`.
- A tolerância efetiva é `EPS × max|A|`. Documente qualquer mudança na seção 8.6.
- A decisão de determinante nulo está em `ehZero` (`lib/cramer.js`): comparação exata para matrizes de inteiros e `1e-10 ×` limite de Hadamard nos demais casos. Documente mudanças na seção 8.4.

### 14.4 Publicar uma atualização

```powershell
cd codigo-fonte
npm.cmd run build
Copy-Item dist\index.html ..\index.html -Force
cd ..
git add index.html codigo-fonte docs README.md
git commit -m "docs: atualiza documentação e build"
git push origin main
```

### 14.5 Roadmap sugerido

- Suíte de testes unitários para `cramer.js` e `solver.js` (Vitest).
- Entrada por texto livre (`2x + 3y = 12`).
- Exportação em PDF sem depender do diálogo de impressão.
- Histórico local de sistemas resolvidos.
- Visualização 3D para sistemas 3×3.
- Suporte a coeficientes fracionários exatos (aritmética racional).

---

## 15. Referências

- **Gauss-Jordan e eliminação gaussiana** — Anton, H.; Rorres, C. *Álgebra Linear com Aplicações*.
- **Rouché–Capelli** — teorema de consistência de sistemas lineares.
- **React** — <https://react.dev/>
- **Vite** — <https://vite.dev/>
- **Mafs** — <https://mafs.dev/>
- **KaTeX** — <https://katex.org/>
- **vite-plugin-singlefile** — <https://github.com/richardtallent/vite-plugin-singlefile>
- **Geist** — <https://vercel.com/geist/introduction>
- **Meridian Blueprint** — <https://agent.kombai.com/kombai-inspiration-library/templates/meridian-blueprint/index.html>

---

<p align="center">
  <sub>Calculadora de Sistemas Lineares · v2.0.0 · Projeto Integrador de Matemática Aplicada à Computação II</sub>
</p>
