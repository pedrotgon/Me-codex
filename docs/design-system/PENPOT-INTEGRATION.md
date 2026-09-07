# Guia de Integração e Handoff para o Penpot — Më Life OS

**Status:** Pronto para transferência para o Penpot  
**Ambiente Local:** Canvas interativo portátil disponível em `design-system/canvas/index.html` e integrado no app via `ProductCanvasView.tsx`.

---

## 1. Estrutura Canônica de Páginas no Penpot

Ao criar o arquivo mestre no Penpot chamado `Më Life OS — Design System & Screen Atlas`, organize as páginas rigorosamente com a seguinte estrutura de 11 seções:

```
├── 00 — Cover e índice
├── 01 — Princípios e identidade
├── 02 — Foundations
├── 03 — Componentes
├── 04 — Padrões
├── 05 — Mapa de jornadas
├── 06 — Telas desktop (1440 × 1024)
├── 07 — Telas mobile (390 × 844)
├── 08 — Estados e casos extremos
├── 09 — Protótipos navegáveis
└── 10 — Handoff e decisões
```

---

## 2. Nomenclatura Determinística dos Frames

Para compatibilidade total com os tokens e o código React, os frames de telas no Penpot devem seguir o padrão:

```
Desktop / [Jornada] / [Tela] / [Estado]
Mobile / [Jornada] / [Tela] / [Estado]
```

### Exemplos:
- `Desktop / J01-Inicio / Home / Padrao`
- `Desktop / J01-Inicio / Home / Vazio`
- `Desktop / J14-ParaOrg / Upload / AnalisandoGemini`
- `Desktop / J14-ParaOrg / Upload / PropostasProntas`
- `Desktop / J16-Jarvis / Drawer / PropostaPendente`
- `Mobile / J01-Inicio / Home / Padrao`
- `Mobile / J15-Memoria / Mapa / DrawerAberto`

---

## 3. Importação de Tokens

1. Acesse o menu de **Design Tokens** no Penpot.
2. Importe o arquivo W3C DTCG: `design-system/tokens.json`.
3. Os tokens são automaticamente organizados nas três camadas:
   - `primitive` (Forest, Goldman, Neutrals, Spacing, Radius, Typography, Shadows);
   - `semantic` (Background, Text, Border, Status);
   - `component` (Button, Card, Input, Table, Dialog).

---

## 4. O que falta para transferência direta via API

Caso seja configurado um token de acesso pessoal do Penpot (`PENPOT_ACCESS_TOKEN` e `PENPOT_FILE_ID`), a API REST do Penpot pode receber a sincronização direta dos tokens e das páginas. No momento, o Canvas Local Portátil provê 100% da visualização e prototipagem navegável em código sem dependência de nuvem externa.
