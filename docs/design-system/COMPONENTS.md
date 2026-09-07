# Catálogo de Componentes do Më Life OS

Este catálogo documenta a taxonomia de componentes do Më Life OS, organizada por níveis de dependência: **Primitivos**, **Compostos** e **Estruturas**.

---

## NÍVEL 1: COMPONENTES PRIMITIVOS

### 1. Typography
- **Finalidade:** Renderizar textos com hierarquia consistente e fontes padronizadas (`Inter`, `Newsreader`, `JetBrains Mono`).
- **Quando usar:** Em todo texto visível da interface.
- **Quando não usar:** Não misturar fontes serifadas fora de títulos ou contextos editoriais.
- **Variantes:** `display` (Newsreader 32px), `title` (Newsreader 24px), `heading` (Inter 16px font-semibold), `body` (Inter 13-14px), `caption` (Inter 11-12px), `mono` (JetBrains Mono 11-12px).
- **Acessibilidade:** Elementos semânticos `h1`, `h2`, `h3`, `p`, `span`, `code` com contraste WCAG AA mínimo.
- **Tokens:** `font-sans`, `font-serif`, `font-mono`, `color-ink`, `color-muted-copy`.

### 2. Icon
- **Finalidade:** Fornecer suporte visual rápido para ações, estados e entidades.
- **Quando usar:** Ao lado de rótulos de botões, itens de navegação, status e categorias PARA.
- **Biblioteca:** `lucide-react` com `strokeWidth={1.75}` consistente.
- **Tamanhos:** `sm` (14px), `md` (16px), `lg` (18px), `xl` (24px).
- **Acessibilidade:** `aria-hidden="true"` quando acompanhado de texto; `aria-label` quando isolado.

### 3. Button
- **Finalidade:** Disparar ações e comandos primários ou secundários.
- **Variantes:**
  - `primary`: fundo `#0c2b15`, texto branco, raio 10px. Hover `#164416`.
  - `secondary`: fundo branco, borda `#e8e8e8`, texto `#070707`. Hover `#f4f4f4`.
  - `accent`: fundo `#41a217`, texto branco. Usado para aprovação e confirmação.
  - `destructive`: texto `#dc2626`, borda `#dc2626`/20. Usado para rejeição e exclusão.
  - `ghost`: sem borda, hover sutil com fundo neutro.
- **Estados:** Padrão, Hover, Active, Focus-visible, Disabled, Loading (com spinner).
- **Touch Target:** Altura mínima de 36px no desktop e 44px no mobile.

### 4. IconButton
- **Finalidade:** Ações compactas em cabeçalhos e linhas de tabela (fechar, voltar, editar, excluir).
- **Tamanhos:** 32x32px e 36x36px com `border-radius: 8px`.

### 5. Input & Textarea
- **Finalidade:** Coleta de dados textuais com feedback de validação.
- **Anatomia:** Rótulo, container com borda `#e8e8e8`, campo de texto, mensagem de ajuda/erro.
- **Estados:** Padrão, Hover, Foco (borda azul Goldman `#7399C6` com anel discreto), Erro (borda vermelha `#dc2626`), Disabled.

### 6. Checkbox & Radio
- **Finalidade:** Seleção booleana (conclusão de tarefas, hábitos, filtros de lote).
- **Anatomia:** Caixa de 16x16px (ou 20x20px para touch) com cantos levemente arredondados (4px), ícone de check nítido.
- **Tokens:** Fundo branco no estado inativo, fundo `#0c2b15` ou `#41a217` quando checado.

### 7. Toggle (Switch)
- **Finalidade:** Alternância de estado ativo/inativo instantâneo (ex: ativação da skill Para-Organizer).
- **Dimensões:** 44px de largura por 24px de altura, círculo de 20px com transição suave.

### 8. Badge & Tag
- **Finalidade:** Rótulos de metadados, contadores, naipe, prioridade e status.
- **Variantes:**
  - `forest`: fundo `#0c2b15`/10, texto `#0c2b15`.
  - `goldman`: fundo `#7399c6`/15, texto `#1b365d`.
  - `priority`: P1 (vermelho suave), P2 (laranja suave), P3 (azul suave), P4/P5 (neutro).
  - `status`: `not-started` (cinza), `in-progress` (azul), `done` (verde), `arquivadas` (roxo/cinza).

### 9. Divider
- **Finalidade:** Separar seções lógicas com espessura de 1px e cor `#e8e8e8`.

### 10. Progress
- **Finalidade:** Indicar percentual de avanço de projetos e conclusão de listas.
- **Anatomia:** Barra de trilho de 6px com fundo neutro `#e8e8e8` e preenchimento `#0c2b15` ou `#41a217`.

### 11. Spinner
- **Finalidade:** Indicar processamento assíncrono (OCR, chamada Gemini, leitura de ZIP).
- **Anatomia:** Círculo animado `lucide-react` `Loader2` girando a 1 rotação/s.

---

## NÍVEL 2: COMPONENTES COMPOSTOS

### 1. Card
- **Finalidade:** Superfície modular para agrupar informações correlacionadas.
- **Especificação:** Fundo branco `#ffffff`, borda `1px solid #e8e8e8`, raio `10px` (`0.625rem`), sombra `0 1px 3px rgba(0,0,0,0.04)`.
- **Origem:** Fusão BCG + Clean UI.

### 2. MetricCard
- **Finalidade:** Exibir métricas-chave no topo do dashboard (Tokens de Batalha, Hábitos ativos, Tarefas de hoje, Projetos em andamento).
- **Anatomia:** Ícone em container suave, valor em destaque (24px font-bold), legenda em 12px neutral-500.

### 3. TaskItem
- **Finalidade:** Linha de tarefa individual na visão geral, take action ou lista de projetos.
- **Anatomia:** Checkbox/Naipe à esquerda, título truncado com hover, badge de prioridade/prazo, área de projeto.

### 4. ProjectCard
- **Finalidade:** Apresentação visual de um projeto no grid.
- **Anatomia:** Ícone grande, título, descrição curta, badge de área, barra de progresso com contador (`X/Y`), data de entrega.

### 5. EmptyState
- **Finalidade:** Orientar o usuário quando uma lista, tabela ou busca não possuir registros.
- **Anatomia:** Ilustração ou ícone sutil, título informativo, texto instrutivo e botão de ação primária (ex: "+ Criar Tarefa").

### 6. ErrorState
- **Finalidade:** Exibir falhas operacionais com alternativa de recuperação clara.
- **Anatomia:** Ícone de alerta, descrição amigável do erro (sem expor stack trace ou credenciais), botão de "Tentar Novamente".

### 7. Modal & Dialog
- **Finalidade:** Foco em ações críticas que exigem confirmação ou inserção rápida (`NewItemDialog`).
- **Anatomia:** Overlay escuro (`rgba(0, 0, 0, 0.45)`), container central de 480px com raio de 14px, cabeçalho com título, corpo do formulário, rodapé com ações de Cancelar e Confirmar.

### 8. Drawer
- **Finalidade:** Painel lateral deslizante para exploração sem perda de contexto (ex: Jarvis Chat, Detalhe de Nó no Grafo).
- **Largura:** 420px no desktop; 100% da largura no mobile.

### 9. Table (Estilo Goldman Sachs)
- **Finalidade:** Apresentação densa e escaneável de nós da memória, tarefas do Córtex e registros brutos.
- **Especificação:** Cabeçalho `#fbfbfb`, texto `#696969` em 11px uppercase, linhas com borda `#e8e8e8`, hover `#f4f4f4`.

### 10. ApprovalCard
- **Finalidade:** Apresentar propostas geradas pela IA (Jarvis ou Para-Organizer) para decisão humana soberana.
- **Anatomia:** Cabeçalho com badge "Proposta da IA", resumo da mutação, comparação de campos, botão verde "Aprovar" e botão vermelho "Rejeitar".

---

## NÍVEL 3: ESTRUTURAS E LAYOUTS

### 1. AppShell
- **Finalidade:** Esqueleto fundamental da aplicação que orquestra a Sidebar responsiva, o Header fixo, o conteúdo principal e o Drawer do Jarvis.

### 2. Sidebar
- **Finalidade:** Navegação principal entre as 17 jornadas do Më Life OS.
- **Especificação:** Fundo verde floresta profundo `#0c2b15`, largura 280px fixa no desktop, gaveta modal deslizante no mobile com backdrop escuro.

### 3. Header
- **Finalidade:** Acesso a comandos globais, data atual, busca universal, botão de Quick Capture e acionador do Jarvis.

### 4. ViewHeader
- **Finalidade:** Padronizar a abertura visual de todas as 28 telas com título em fonte serifada `Newsreader`, descrição de contexto em `Inter` e slot de botões de ação à direita.

### 5. GraphWorkspace
- **Finalidade:** Espaço de visualização radial/esférica force-directed D3 para o mapa relacional da Memória, com controles de zoom, pan, arraste e painel de inspeção de nó.
