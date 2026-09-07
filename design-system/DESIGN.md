# DESIGN.md — Especificação Visual Canônica do Më Life OS

**Versão:** 2.0.0  
**Status:** Canônico / Obrigatório  
**Fontes de Inspiração:** Boston Consulting Group (BCG) + Goldman Sachs (GS)  
**Assinatura Visual:** Clean UI Editorial, Densidade Operacional, Zero Glassmorphism, Zero Neon, Cartões Opacos e Bordas Calmas.

---

## 1. Princípios Inegociáveis

1. **Fusão Editorial BCG & Goldman Sachs**:
   - Do **BCG**: A sobriedade do verde floresta profundo (`#0c2b15`), o acento vivo e enérgico (`#41a217`), as superfícies off-white/nude (`#fbfbfb`) e os cantos elegantes de 10px (`0.625rem`).
   - Do **Goldman Sachs**: A autoridade tipográfica editorial (`Newsreader` serif nos títulos, `Inter` sans na navegação/dados, `JetBrains Mono` nos metadados/hashes), o azul de precisão financeira (`#7399C6`), o marinho executivo (`#1B365D`) e a altíssima densidade informacional sem poluição visual.

2. **Proibição de Estética Genérica de IA**:
   - **NÃO usar**: `backdrop-filter: blur()`, translucidez exagerada, gradientes coloridos aleatórios, sombras projetadas com raios gigantes, bordas brilhantes de neon ou cantos pílula em cartões de dados.
   - **USAR**: Cartões brancos opacos (`#ffffff`), bordas ultra sutis (`1px solid #e8e8e8`), sombras secas e de pouca dispersão (`0 1px 3px rgba(0, 0, 0, 0.04)`).

3. **Governança e Transparência de Dados**:
   - Todo dado mutável ou gerado por IA exige confirmação humana explícita.
   - Indicadores visuais claros para origem do dado: `manual` (cinza/neutro), `ai` (azul Goldman Sachs / tag explicativa), `system` (verde acento).
   - O Knowledge Intake (KI) é a única fonte lógica; a interface apenas projeta suas coleções.

---

## 2. Paleta de Cores e Escala Semântica

### 2.1 Cores Primitivas

| Família | Token | Valor Hex | Descrição |
| :--- | :--- | :--- | :--- |
| **Forest** (BCG) | `forest-900` | `#0c2b15` | Tom primário da marca, cabeçalhos fortes e sidebar |
| | `forest-500` | `#41a217` | Acento BCG vívido para botões de ação e sucesso |
| | `forest-100` | `#e2efe4` | Fundo de badges de status e chips de destaque |
| | `forest-50` | `#f2f7f3` | Fundo suave de cards em destaque |
| **Goldman** (GS) | `goldman-900` | `#1b365d` | Deep Navy executivo para dados analíticos |
| | `goldman-400` | `#7399c6` | Azul assinatura Goldman Sachs para gráficos e foco |
| | `goldman-100` | `#dce8f4` | Badges analíticas e relações sugeridas por IA |
| **Neutrals** | `neutral-0` | `#ffffff` | Branco puro para superfícies de cartões e modais |
| | `neutral-50` | `#fbfbfb` | Calm canvas off-white / fundo do app |
| | `neutral-100` | `#f4f4f4` | Fundo de tabelas e estados hover secundários |
| | `neutral-200` | `#e8e8e8` | Bordas sutis de cartões e separadores de seção |
| | `neutral-500` | `#696969` | Texto secundário e legendas |
| | `neutral-900` | `#070707` | Títulos e texto com alto contraste WCAG AAA |

### 2.2 Cores Semânticas de Estado

| Estado | Token Semântico | Cor | Significado na Interface |
| :--- | :--- | :--- | :--- |
| **Padrão / Sucesso** | `status.success` | `#41a217` | Tarefa concluída, lote salvo no KI, proposta aceita |
| **Alerta / Atenção** | `status.warning` | `#d97706` | Prazos próximos, tarefa atrasada, arquivo grande |
| **Erro / Destrutivo** | `status.error` | `#dc2626` | Falha de API, exclusão permanente, proposta rejeitada |
| **IA / Informativo** | `status.info` | `#7399c6` | Sugestão do Jarvis, relação proposta pendente |

---

## 3. Tipografia Editorial e Hierarquia

| Nível | Família | Tamanho | Peso | Line-Height | Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | `Newsreader` (serif) | 28px — 32px | Normal (400) | 1.2 | Títulos principais de visões (`ViewHeader`) |
| **H2 / Seção** | `Newsreader` (serif) | 20px — 24px | Normal (400) | 1.3 | Cabeçalhos de painéis e seções de cartões |
| **H3 / Card** | `Inter` (sans) | 15px — 16px | Semibold (600) | 1.35 | Títulos de tarefas, projetos e nós |
| **Body Primary** | `Inter` (sans) | 13px — 14px | Regular (400) | 1.5 | Parágrafos, propostas e descrições |
| **Body Dense** | `Inter` (sans) | 12px — 13px | Regular (400) | 1.4 | Linhas de tabela, itens de lista de tarefas |
| **Caption / Meta** | `Inter` (sans) | 11px — 12px | Medium (500) | 1.4 | Badges, datas, contadores de arquivos |
| **Code / Hash** | `JetBrains Mono` | 11px — 12px | Regular (400) | 1.4 | SHA-256, caminhos de arquivo, tokens de batalha |

---

## 4. Sistema Espacial e Geometria

- **Unidade Base**: Múltiplos de 4px e 8px.
- **Raios de Borda**:
  - Cartões (`cards`) e Botões principais: `10px` (`0.625rem` — padrão BCG).
  - Tags, Chips e Checkboxes: `6px` a `8px`.
  - Modais e Drawers: `14px`.
- **Elevação e Sombras**:
  - Cards: `0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)`.
  - Modais e Drawers: `0 12px 32px rgba(0, 0, 0, 0.12)`.
  - Zero sombras coloridas ou com efeito de brilho externo.

---

## 5. Padrões de Componentes Canônicos

### 5.1 Botões
- **Primário**: Fundo `#0c2b15`, texto branco, raio 10px, padding horizontal 16px, altura 36px. Hover: `#164416`.
- **Acento / Sucesso**: Fundo `#41a217`, texto branco, raio 10px. Hover: `#297716`.
- **Secundário**: Fundo branco `#ffffff`, borda `#e8e8e8`, texto `#070707`. Hover: `#f4f4f4`.
- **Destrutivo / Rejeição**: Borda `#dc2626`/30, texto `#dc2626`, fundo branco. Hover: `#dc2626`/10.

### 5.2 Cartões de Dados
- Fundo branco sólido `#ffffff`.
- Borda calma `1px solid #e8e8e8`.
- Padding de 20px a 24px.
- Sem cantos exagerados: sempre `10px`.

### 5.3 Tabelas de Alta Densidade (Estilo Goldman Sachs)
- Cabeçalho com fundo `#fbfbfb`, texto `#696969` em 11px uppercase tracking-wider.
- Linhas alternadas ou com borda inferior sutil `1px solid #e8e8e8`.
- Células com padding vertical de 10px a 12px, permitindo visualização de mais de 20 registros sem scroll excessivo.

---

## 6. Responsividade e Breakpoints

| Breakpoint | Largura | Comportamento Principal |
| :--- | :--- | :--- |
| **Mobile** | `< 768px` (Base 390px) | Sidebar vira drawer lateral deslizante; grid vira coluna única; tabelas adaptam-se para cards expansíveis |
| **Tablet** | `768px — 1024px` | Grids em 2 colunas; densidade mantida |
| **Desktop** | `> 1024px` (Base 1440px) | Sidebar fixa à esquerda (280px); conteúdo central até 1400px com 3 colunas de cards; drawer do Jarvis à direita (420px) |
