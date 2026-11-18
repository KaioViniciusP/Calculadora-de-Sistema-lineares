# Calculadora de Sistemas Lineares

**Resolva, classifique e entenda sistemas lineares — de 1 a 5 equações e de 2 a 5 incógnitas — pela Regra de Cramer com determinantes pelo Teorema de Laplace, conferida pelo escalonamento de Gauss-Jordan, com solução paramétrica e gráfico interativo.**

Uma aplicação web em português (pt-BR), feita para estudantes e professores verem não só o resultado, mas *como* ele foi obtido. Roda 100% no navegador, sem servidor, sem cadastro e sem internet.

**[▶ Abrir a calculadora](https://kaioViniciusP.github.io/Calculadora-de-Sistema-lineares/)** · **[📘 Documentação técnica](docs/DOCUMENTACAO.md)** · **[🧭 Guia de uso](docs/GUIA-DE-USO.md)**

![Tela inicial da calculadora](docs/preview.png)

---

## Índice

- [Recursos](#recursos)
- [Documentação](#documentação)
- [Como usar](#como-usar)
- [Como o sistema é resolvido](#como-o-sistema-é-resolvido)
- [Como foi feito](#como-foi-feito)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Rodar localmente](#rodar-localmente)
- [Build de arquivo único](#build-de-arquivo-único)
- [Publicação no GitHub Pages](#publicação-no-github-pages)
- [Limitações](#limitações)
- [Créditos](#créditos)

---

## Recursos

### Entrada flexível

- **1 a 5 equações** e **2 a 5 incógnitas** (x, y, z, w, v).
- Grade editável de coeficientes + termos independentes.
- Aceita inteiros, decimais com vírgula ou ponto, negativos, zero e frações como `1/2`.
- Todos os campos são obrigatórios: campo vazio é inválido e fica destacado, como qualquer entrada inválida (use `0` para coeficientes nulos).
- **15 exemplos prontos**: SPD, SPI e SI de 2×2 a 5×5, com a situação-problema do relatório no topo da lista.

### Resolução matemática

- **Regra de Cramer** em sistemas quadrados: determinante principal `D`, determinantes `Dx, Dy, Dz, Dw, Dv` (coluna da incógnita trocada pelos termos independentes, destacada em azul) e `xᵢ = Dᵢ / D`.
- **Teorema de Laplace**: todo determinante é calculado pela expansão na 1ª coluna, exibindo menores complementares, cofatores, parcelas e soma.
- **Comparação com a Regra de Sarrus** em sistemas 3×3: `D` é calculado pelos dois métodos, com a indicação “mesmo resultado” ou “resultados diferentes”.
- **Verificação por substituição** da solução de Cramer, equação por equação (✓/✗).
- Mensagens claras quando a regra não se aplica: `D = 0` (com ou sem algum `Dᵢ ≠ 0`) ou sistema não quadrado.
- **Conferência por escalonamento**: tabela que compara cada incógnita obtida por Cramer com a do escalonamento (“coincide” / “diverge”).
- **Eliminação de Gauss-Jordan** com pivoteamento parcial (método de conferência e único método para sistemas não quadrados).
- Passo a passo completo: troca de linhas, normalização do pivô e eliminação, com a matriz ampliada em cada operação.
- **Classificação por postos** de A e (A|B): SPD, SPI ou SI.
- Conjunto solução único, **paramétrico** (com variáveis livres) ou vazio (`S = ∅`).
- Tolerância relativa de `1e-9 × max|A|` para tratar ruído de ponto flutuante.

### Visualização e estudo

- Gráfico 2D interativo com **Mafs**: retas, ponto de interseção, zoom, pan e reenquadramento.
- Para 3+ incógnitas, explicação geométrica com planos em vez de um gráfico enganoso.
- Seção teórica sobre SPD, SPI e SI e sobre os métodos usados.
- Botões de **copiar resultado** e **imprimir / gerar PDF** com layout próprio.
- Interface responsiva, acessível por teclado e com atalho `Enter` para resolver.

---

## Documentação

| Documento | Conteúdo |
|---|---|
| **[Documentação técnica](docs/DOCUMENTACAO.md)** | Visão geral, requisitos, arquitetura, módulos, modelo matemático, interface, build, validação, limitações e manutenção. |
| **[Guia de uso](docs/GUIA-DE-USO.md)** | Passo a passo para o usuário, formatos de entrada, leitura dos resultados, atalhos e perguntas frequentes. |

---

## Como usar

### 1. Escolha as dimensões

Em **SEC 01 · Configuração**, selecione a quantidade de incógnitas e de equações e clique em **Gerar matriz**.

### 2. Preencha os coeficientes

Em **SEC 02 · Entrada de dados**, digite os coeficientes e o termo independente de cada equação.

Exemplo (situação-problema do relatório):

```
2x + y + z = 100
 x + 3y + 2z = 180
3x + 2y + 2z = 200
```

Na grade, a última coluna é o termo independente:

| x | y | z | = |
|---|---|---|---|
| 2 | 1 | 1 | 100 |
| 1 | 3 | 2 | 180 |
| 3 | 2 | 2 | 200 |

Todos os campos precisam ser preenchidos; digite `0` para coeficientes nulos.

> Dica: use **Exemplo preenchido** ou escolha um exemplo pronto no seletor. Pressione `Enter` em qualquer campo para resolver.

### 3. Resolva

Clique em **Resolver sistema**. A “prancha” de resultados é gerada com:

| Seção | O que mostra |
|---|---|
| **SEC 03 · Sistema** | O sistema montado a partir da matriz, em notação matemática |
| **SEC 04 · Representação matricial** | A, X, B e a matriz ampliada (A\|B) |
| **SEC 05 · Regra de Cramer · Teorema de Laplace** | `D` pela expansão de Laplace (e por Sarrus em 3×3), cada `Dᵢ`, `xᵢ = Dᵢ / D`, verificação por substituição ou a mensagem de `D = 0` / sistema não quadrado |
| **SEC 06 · Escalonamento · Eliminação de Gauss-Jordan** | Todas as operações de Gauss-Jordan, pivô por pivô (conferência) |
| **SEC 07 · Classificação do sistema · por escalonamento** | Postos, número de soluções e o critério aplicado |
| **SEC 08 · Conjunto solução · por escalonamento** | Valores únicos, forma paramétrica ou conjunto vazio |
| **SEC 09 · Conferência · Cramer × escalonamento** | Cada incógnita pelos dois métodos, com “coincide” ou “diverge” (sistema quadrado com `D ≠ 0`) |
| **SEC 10 · Gráfico** | Retas, interseção e zoom (2 incógnitas) ou leitura geométrica (3+) |
| **SEC 11 · Teoria** | Referência sobre SPD, SPI, SI e os métodos |

![Sistema e matrizes resolvidos](docs/solucao.png)

### 4. Explore o gráfico

Com **2 incógnitas**, cada equação vira uma reta. Arraste para mover, use a roda do mouse ou o gesto de pinça para o zoom e clique em **Reenquadrar** para voltar à escala automática.

![Gráfico com retas e ponto de interseção](docs/grafico.png)

Com **3 ou mais incógnitas**, a aplicação explica por que o desenho 2D não representa corretamente o problema e mostra a interpretação de planos no espaço, coerente com a classificação.

### 5. Copie ou imprima

- **Copiar resultado** gera um resumo em texto para colar no relatório, com `D`, os `Dᵢ`, a solução por Cramer (ou a mensagem de `D = 0` / não quadrado), a verificação e o resultado do escalonamento.
- **Imprimir / PDF** abre a impressão do navegador já sem os controles, preservando resultados e gráfico.

### Classificações

| Classificação | Critério | Leitura geométrica (2D) |
|---|---|---|
| **SPD** — Sistema Possível e Determinado | `posto(A) = posto(A\|B) = n` | Retas concorrentes em um ponto |
| **SPI** — Sistema Possível e Indeterminado | `posto(A) = posto(A\|B) < n` | Retas coincidentes |
| **SI** — Sistema Impossível | `posto(A) ≠ posto(A\|B)` | Retas paralelas distintas |

---

## Como o sistema é resolvido

Os cálculos estão em [`codigo-fonte/src/lib/cramer.js`](codigo-fonte/src/lib/cramer.js) (Regra de Cramer, Laplace e Sarrus) e [`codigo-fonte/src/lib/solver.js`](codigo-fonte/src/lib/solver.js) (escalonamento), sem bibliotecas de álgebra linear.

### Regra de Cramer com o Teorema de Laplace

1. **Determinante principal** — `D = det(A)`, pelo Teorema de Laplace na 1ª coluna: `D = Σ aᵢ₁·Cᵢ₁`, com cofator `Cᵢ₁ = (−1)^(i+1)·Mᵢ₁` e `Mᵢ₁` o menor complementar. Em 3×3, `D` também é calculado por Sarrus.
2. **Determinantes Dᵢ** — `Dᵢ = det(Aᵢ)`, em que `Aᵢ` é `A` com a coluna `i` trocada pelos termos independentes.
3. **Solução** — se `D ≠ 0`, o sistema é SPD e `xᵢ = Dᵢ / D`, verificado por substituição em cada equação.
4. **D = 0** — a regra não se aplica: se algum `Dᵢ ≠ 0`, o sistema é impossível; se todos os `Dᵢ = 0`, os determinantes não bastam para classificar e a classificação vem do escalonamento.
5. **Sistema não quadrado** — resolvido apenas por escalonamento.

Com coeficientes inteiros os determinantes saem exatos (só somas e produtos); a única divisão é a final, `Dᵢ / D`. Com inteiros, um determinante é nulo só quando vale exatamente `0`; com decimais, quando `|det| ≤ 1e-10 ×` limite de Hadamard (produto das normas das colunas), uma tolerância que acompanha a escala do determinante.

### Escalonamento (conferência)

1. **Matriz ampliada** — os coeficientes e os termos independentes são reunidos em `(A|B)`.
2. **Pivoteamento parcial** — em cada coluna, escolhe-se o maior elemento em módulo para reduzir erro numérico.
3. **Eliminação de Gauss-Jordan** — o pivô é normalizado para 1 e a coluna é zerada nas demais linhas, registrando cada operação elementar.
4. **Postos** — contam-se as linhas não nulas de A e de (A|B), desconsiderando valores dentro da tolerância.
5. **Classificação** — aplica-se o critério de Rouché–Capelli:
   - `posto(A) ≠ posto(A|B)` → **SI**;
   - `posto(A) = posto(A|B) = n` → **SPD**;
   - `posto(A) = posto(A|B) < n` → **SPI**.
6. **Solução** — para SPI, as variáveis livres recebem parâmetros (`t, s, u, r, q`) e as variáveis pivô são escritas em função delas.
7. **Limpeza numérica** — valores muito próximos de zero e de inteiros são normalizados antes da exibição, evitando `0.0000000001` e `2.9999999999`.

A tolerância é relativa à maior entrada de A (`1e-9 × max|A|`), porque a escala dos coeficientes muda de problema para problema.

---

## Como foi feito

### Stack

| Camada | Tecnologia |
|---|---|
| Interface | **React 18** |
| Build | **Vite 7** com `vite-plugin-singlefile` |
| Matemática na tela | **KaTeX 0.16** |
| Gráfico 2D | **Mafs 0.21** |
| Tipografia | **Geist Sans** e **Geist Mono** via `@fontsource-variable` |
| Estilo | CSS próprio, sem framework |

### Decisões de projeto

- **KaTeX em vez de MathJax** para renderizar sistemas, matrizes e operações com tipografia matemática precisa e sem dependência de CDN.
- **Mafs em vez de canvas manual** para ganhar zoom, pan e coordenadas interativas com comportamento consistente.
- **Fontes locais** (`@fontsource-variable`) para o app funcionar offline.
- **Build em arquivo único** (`vite-plugin-singlefile`): JS, CSS e fontes são embutidos em um só `index.html`, que abre com duplo clique.
- **Tolerância relativa** em vez de comparação absoluta com zero, mais adequada a coeficientes de escalas diferentes.
- **Laplace sempre pela 1ª coluna**, para que menores e cofatores exibidos possam ser comparados com o cálculo manual do relatório; o custo na ordem de `n!` é aceitável no limite de 5×5.
- **Módulos de cálculo autocontidos**: `cramer.js` e `solver.js` não importam React, formatação, LaTeX nem o gráfico.
- **Sem gráfico falso para 3+ incógnitas**: a aplicação declara a limitação e apresenta a leitura geométrica correta.

### Design

A interface segue uma mistura de **Geist** (Vercel) com **Meridian Blueprint** (Kombai):

- fundo claro com grid técnico, azul de planta e detalhes em verde;
- barra de carimbo `SHEET 01 / 11 · REV 2.0 · SCALE 1:1`;
- seções numeradas `SEC 01` a `SEC 11`, cantos técnicos e cartões de 1 px;
- tipografia mono para metadados e números tabulares;
- layout responsivo, com tabela que cabe até 5 incógnitas no celular.

---

## Estrutura do projeto

```
.
├── index.html                  # build publicado (arquivo único, abre sozinho)
├── docs/
│   ├── DOCUMENTACAO.md         # documentação técnica do sistema
│   ├── GUIA-DE-USO.md          # manual do usuário
│   ├── preview.png             # capturas usadas neste README
│   ├── solucao.png
│   └── grafico.png
├── codigo-fonte/
│   ├── index.html              # HTML de entrada do Vite
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx             # estado, resolução, exemplos, copiar/imprimir
│       ├── main.jsx            # entrada React + fontes + CSS
│       ├── styles.css          # tela e impressão
│       ├── components/
│       │   ├── SheetHeader.jsx # barra de carimbo
│       │   ├── Sections.jsx    # seções SEC 01 a 11
│       │   ├── MatrixInput.jsx # grade editável
│       │   ├── GraphView.jsx   # gráfico Mafs e leitura 3D
│       │   └── Tex.jsx         # renderizador KaTeX
│       └── lib/
│           ├── cramer.js       # Regra de Cramer, Laplace, Sarrus, verificação
│           ├── solver.js       # Gauss-Jordan, postos, classificação
│           ├── formatacao.js   # leitura e formatação de números
│           ├── grafico.js      # geometria do gráfico 2D
│           ├── latex.js        # construtores de LaTeX
│           └── examples.js     # exemplos e redimensionamento
└── README.md
```

> `index.html` na raiz é **gerado**. Para alterar o app, edite `codigo-fonte/src/` e refaça o build.

---

## Rodar localmente

Requisitos: **Node.js 20+**.

```bash
cd codigo-fonte
npm install
npm run dev
```

No Windows, se o PowerShell bloquear `npm.ps1`, use `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
```

Abra o endereço indicado pelo Vite (normalmente `http://localhost:5173`).

---

## Build de arquivo único

```bash
cd codigo-fonte
npm run build
```

O resultado é `codigo-fonte/dist/index.html`, autocontido. Para publicar, copie sobre o `index.html` da raiz:

```powershell
Copy-Item codigo-fonte\dist\index.html index.html -Force
```

Também é possível abrir o build direto do disco (`file://`), sem servidor e sem internet.

---

## Publicação no GitHub Pages

O repositório é público e o Pages serve o `index.html` da branch `main`:

1. **Settings → Pages**
2. **Source:** *Deploy from a branch*
3. **Branch:** `main` · **Folder:** `/ (root)`

O endereço fica no formato:

```
https://kaioViniciusP.github.io/Calculadora-de-Sistema-lineares/
```

---

## Limitações

- Os cálculos usam ponto flutuante de precisão dupla. A tolerância reduz, mas não elimina, os efeitos de arredondamento em sistemas muito mal condicionados.
- O gráfico cartesiano só representa corretamente sistemas com **2 incógnitas**. Para 3+, a aplicação apresenta a leitura geométrica em vez de um desenho incorreto.
- Dimensões limitadas a **1–5 equações** e **2–5 incógnitas** por decisão de interface (o Teorema de Laplace cresce na ordem de `n!`).
- A Regra de Cramer só se aplica a sistemas quadrados com `D ≠ 0`; com `D = 0` e todos os `Dᵢ = 0`, a classificação depende do escalonamento.
- O foco é didático: mostrar o método e o significado do resultado, não substituir software de álgebra linear de alta performance.

---

## Créditos

Desenvolvido como parte do **Projeto Integrador de Matemática Aplicada à Computação II**.

Bibliotecas e referências: [React](https://react.dev/), [Vite](https://vite.dev/), [Mafs](https://mafs.dev/), [KaTeX](https://katex.org/), [Geist](https://vercel.com/geist/introduction) e [Meridian Blueprint](https://agent.kombai.com/kombai-inspiration-library/templates/meridian-blueprint/index.html).

Se este projeto te ajudou a estudar, deixe uma ⭐ no repositório.
