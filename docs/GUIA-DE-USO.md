# Guia de Uso — Calculadora de Sistemas Lineares

Este guia mostra, passo a passo, como usar a calculadora para resolver, classificar e interpretar sistemas lineares.

> **Acesse:** <https://kaioViniciusP.github.io/Calculadora-de-Sistema-lineares/>
>
> Também é possível abrir o arquivo `index.html` do repositório diretamente no navegador, sem internet.

---

## Índice

- [Antes de começar](#antes-de-começar)
- [Passo 1 — Escolher as dimensões](#passo-1--escolher-as-dimensões)
- [Passo 2 — Preencher os coeficientes](#passo-2--preencher-os-coeficientes)
- [Passo 3 — Resolver](#passo-3--resolver)
- [Passo 4 — Ler o resultado](#passo-4--ler-o-resultado)
- [Passo 5 — Explorar o gráfico](#passo-5--explorar-o-gráfico)
- [Passo 6 — Copiar ou imprimir](#passo-6--copiar-ou-imprimir)
- [Formatos de entrada aceitos](#formatos-de-entrada-aceitos)
- [Entendendo as classificações](#entendendo-as-classificações)
- [Atalhos de teclado](#atalhos-de-teclado)
- [Exemplos para testar](#exemplos-para-testar)
- [Perguntas frequentes](#perguntas-frequentes)

---

## Antes de começar

Você precisa de um navegador moderno (Chrome, Edge, Firefox ou Safari), em computador ou celular. Não é necessário criar conta, instalar nada ou estar conectado à internet quando a página já está aberta.

A tela é organizada como uma **prancha técnica**, com seções numeradas:

- **SEC 01** — configuração;
- **SEC 02** — entrada de dados;
- **SEC 03 a 11** — resultados (Regra de Cramer, escalonamento e conferência), gráfico e teoria (aparecem após resolver).

---

## Passo 1 — Escolher as dimensões

Em **SEC 01 · Configuração**, escolha:

- **Incógnitas:** 2 a 5 (`x, y` até `x, y, z, w, v`);
- **Equações:** 1 a 5.

Clique em **Gerar matriz** (ou apenas continue preenchendo). A grade é atualizada e os valores já digitados são preservados ao mudar as dimensões.

> Exemplo de leitura: um sistema **3×2** tem 3 equações e 2 incógnitas. A matriz `A` tem dimensão `3 × 2` e a ampliada `(A|B)` tem `3 × 3`.

---

## Passo 2 — Preencher os coeficientes

Em **SEC 02 · Entrada de dados**, preencha a grade. A **última coluna** é o termo independente (o valor depois do `=`).

Para o sistema:

```text
2x + y + 3z = 190
 x + 3y + 2z = 190
 x + 2y + 2z = 160
```

Preencha:

| x | y | z | = |
|---|---|---|---|
| 2 | 1 | 3 | 190 |
| 1 | 3 | 2 | 190 |
| 1 | 2 | 2 | 160 |

Atalhos úteis:

- **Exemplo preenchido** — aplica um exemplo compatível com a dimensão atual;
- **Ou escolha um exemplo pronto** — lista com 15 sistemas SPD, SPI e SI (a situação-problema do relatório está no topo);
- **Limpar campos** — zera a grade;
- **Gerar matriz** — redesenha a grade e posiciona o cursor no primeiro campo.

Todos os campos são obrigatórios: digite `0` para coeficientes nulos. Campos vazios ou inválidos ficam destacados e a resolução não é executada.

---

## Passo 3 — Resolver

Clique em **Resolver sistema** ou pressione `Enter` em qualquer campo.

A calculadora valida os dados, monta as matrizes, aplica a Regra de Cramer (determinantes pelo Teorema de Laplace) e confere o resultado pela eliminação de Gauss-Jordan. Em seguida, a página rola até a seção de resultados.

Se você alterar um coeficiente depois de resolver, aparece o aviso **“Coeficientes alterados — resultados da última resolução”**. Clique em **Resolver novamente** para atualizar.

---

## Passo 4 — Ler o resultado

| Seção | O que você encontra |
|---|---|
| **SEC 03 · Sistema** | O sistema montado a partir da matriz, com a classificação. |
| **SEC 04 · Representação matricial** | `A`, `X`, `B` e a matriz ampliada `(A\|B)`. |
| **SEC 05 · Regra de Cramer · Teorema de Laplace** | `D` pela expansão de Laplace na 1ª coluna (menores, cofatores e parcelas), `D` por Sarrus em 3×3, cada `Dᵢ` com a coluna trocada em azul, `xᵢ = Dᵢ / D` e a verificação por substituição. Se `D = 0` ou o sistema não for quadrado, aparece uma mensagem explicando o caso. |
| **SEC 06 · Escalonamento · Eliminação de Gauss-Jordan** | Cada operação elementar (troca, normalização e eliminação) com a matriz resultante. Os pivôs finais ficam em azul. |
| **SEC 07 · Classificação do sistema · por escalonamento** | SPD, SPI ou SI, o critério por postos e, em SI, a linha impossível `0 = k`. |
| **SEC 08 · Conjunto solução · por escalonamento** | Valores únicos, forma paramétrica ou `S = ∅`. |
| **SEC 09 · Conferência · Cramer × escalonamento** | Cada incógnita pelos dois métodos, com “coincide” ou “diverge” (só quando `D ≠ 0`). |
| **SEC 10 · Gráfico** | Retas e interseção (2 incógnitas) ou leitura geométrica (3+). |
| **SEC 11 · Teoria** | Referência sobre as classificações e os métodos. |

### Como interpretar os postos

- `posto(A)` é o número de linhas independentes da matriz dos coeficientes;
- `posto(A|B)` é o número de linhas independentes da matriz ampliada;
- `n` é o número de incógnitas.

| Situação | Classificação |
|---|---|
| `posto(A) = posto(A\|B) = n` | **SPD** — uma única solução |
| `posto(A) = posto(A\|B) < n` | **SPI** — infinitas soluções |
| `posto(A) ≠ posto(A\|B)` | **SI** — nenhuma solução |

### Solução paramétrica (SPI)

Quando há variáveis livres, elas recebem parâmetros (`t, s, u, r, q`). Exemplo:

```text
x + y = 2
2x + 2y = 4
```

Resultado:

```text
y = t (livre)
x = 2 − t
S = { (2 − t, t) | t ∈ ℝ }
```

Cada valor real de `t` gera uma solução diferente — por isso são infinitas.

---

## Passo 5 — Explorar o gráfico

Com **2 incógnitas**, cada equação vira uma reta:

- **arraste** para mover o plano;
- use a **roda do mouse** ou o gesto de **pinça** para dar zoom;
- clique em **Reenquadrar** para voltar à escala automática;
- o ponto verde indica a interseção quando o sistema é SPD.

As cores e estilos das retas aparecem na legenda com a equação correspondente.

Com **3 ou mais incógnitas**, a calculadora não desenha um gráfico 2D enganoso: ela explica que cada equação representa um plano (ou hiperplano) e resume a leitura geométrica da classificação.

---

## Passo 6 — Copiar ou imprimir

Na barra de ações acima dos resultados:

- **Copiar resultado** — copia um relatório em texto com sistema, matrizes, classificação, postos e solução. Útil para colar em relatórios.
- **Imprimir / PDF** — abre o diálogo de impressão. Os controles são ocultados e o layout preserva as seções de resultado e o gráfico. Escolha **Salvar como PDF** para gerar um arquivo.

---

## Formatos de entrada aceitos

| Você digita | A calculadora entende |
|---|---|
| `5` | 5 |
| `-5` ou `−5` | −5 |
| `3,5` | 3,5 |
| `3.5` | 3,5 |
| `1/2` | 0,5 |
| `-3/4` | −0,75 |
| `2e3` | 2000 |
| `2E-3` | 0,002 |
| `1 000` | 1000 |
| *(vazio)* | inválido — digite `0` para coeficientes nulos |
| `abc` | inválido — campo destacado |
| `1/0` | inválido — divisão por zero |

---

## Entendendo as classificações

### SPD — Sistema Possível e Determinado

Tem **uma única solução**. No plano, as retas se cruzam em um único ponto.

```text
posto(A) = posto(A|B) = n
```

### SPI — Sistema Possível e Indeterminado

Tem **infinitas soluções**. No plano, as retas são coincidentes (ou há apenas uma reta).

```text
posto(A) = posto(A|B) < n
```

### SI — Sistema Impossível

**Não tem solução**. As equações se contradizem. No plano, as retas são paralelas distintas.

```text
posto(A) ≠ posto(A|B)
```

---

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| `Enter` | Resolve o sistema a partir de qualquer campo. |
| `↑` / `↓` | Navega entre as linhas da mesma coluna. |
| `Tab` / `Shift+Tab` | Navega entre campos e botões. |

---

## Exemplos para testar

| Sistema | Resultado esperado |
|---|---|
| `x + y = 3`, `x − y = 1` | SPD · `x = 2`, `y = 1` |
| `x + y = 2`, `2x + 2y = 4` | SPI · `x = 2 − t`, `y = t` |
| `x + y = 2`, `x + y = 3` | SI · `S = ∅` |
| `2x + 3y = 12`, `x − y = 1` | SPD · `(3; 2)` |
| `x + 2y = 4` | SPI · `x = 4 − 2t`, `y = t` |
| sistema 3×3 dos projetos | SPD · `(20; 30; 40)` |

---

## Perguntas frequentes

**A calculadora precisa de internet?**
Não. Depois de carregada (ou abrindo o `index.html` localmente), tudo funciona offline.

**Meus dados são enviados para algum lugar?**
Não. Todo o cálculo acontece no navegador; não há servidor nem armazenamento remoto.

**Por que o resultado ficou com vírgula?**
A aplicação usa o formato brasileiro: `3,5` em vez de `3.5`.

**Por que apareceu `S = ∅`?**
O sistema é impossível (SI): não existe conjunto de valores que satisfaça todas as equações.

**Por que o gráfico não aparece com 3 incógnitas?**
Um gráfico cartesiano 2D não representa corretamente três variáveis. Em vez de mostrar um desenho incorreto, a calculadora apresenta a interpretação geométrica em planos.

**Posso usar mais de 5 incógnitas?**
Não pela interface. O limite é 1–5 equações e 2–5 incógnitas, por decisão de projeto.

**O resultado foi marcado como “desatualizado”. O que fazer?**
Você alterou algum coeficiente depois da última resolução. Clique em **Resolver novamente**.

**A calculadora mostra todos os passos?**
Sim. A SEC 05 mostra a Regra de Cramer com a expansão de Laplace de `D`, e a SEC 06 registra trocas de linha, normalização de pivô e eliminação, com a matriz resultante de cada operação.

---

<p align="center">
  <sub>Calculadora de Sistemas Lineares · v2.0.0 · Documentação do usuário</sub>
</p>
