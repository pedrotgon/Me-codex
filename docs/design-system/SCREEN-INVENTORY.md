# Matriz de Cobertura, Inventário e Auditoria de Telas — Më Life OS

**Data da Auditoria:** 08 de Setembro de 2026  
**Baseline:** Commit `f1738b1198074c1087e5aa9a9513156193d2a33a` (Branch `gemini/canvas-route-correction` validada)  
**Metodologia:** Auditoria visual automatizada via Agent Browser (`Google Chrome for Testing 152.0.7977.64`, sessão `me-product-audit`), inspeção estática em `src/design-system/registry/screenRegistry.ts`, rastreamento do fluxo de dados em `src/store.tsx` e verificação nos frames live do Canvas de Telas.

---

## 1. Visão Geral e Métricas da Auditoria

| Métrica | Valor Auditado | Observação |
| :--- | :--- | :--- |
| **Total de Telas / Subtelas** | **28 telas auditadas** | Extraídas das views operacionais, abas, detalhes e painéis reais do produto |
| **Total de Frames no Canvas** | **56 frames base** | 28 Desktop (1440×1024) + 28 Mobile (390×844) lado a lado no Canvas de Telas |
| **Frames com `renderKind: live`** | **56 frames (100%)** | Renderizam o componente operacional de produção real via `AtlasStoreProvider` |
| **Frames Genéricos / Fallbacks** | **0 frames (0%)** | Zero skeletons fictícios; fidelidade operacional total |
| **Telas com Decisão MANTER** | **11 telas (39%)** | Mantidas no núcleo operacional ou de conhecimento |
| **Telas com Decisão REDESENHAR** | **7 telas (25%)** | Redesenhadas para otimizar foco, ergonomia e fluxo de execução |
| **Telas com Decisão UNIR** | **5 telas (18%)** | Agrupadas para eliminar duplicidade de abas e fragmentação |
| **Telas com Decisão ARQUIVAR** | **4 telas (14%)** | Removidas da navegação principal (pesadas ou puramente técnicas) |
| **Telas com Decisão INVESTIGAR** | **1 tela (4%)** | Avaliação da utilidade para o usuário final versus depuração técnica |

---

## 2. Matriz Consolidada de Decisões do MVD (28 Telas)

*Classificação rigorosa baseada na tese de transformar intenção em ação executada:*

| ID Canônico | Nome Atual | Pilar do Produto | Jornada Associada | Prioridade MVD | Decisão Proposta | Justificativa da Decisão (1 Frase) |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **S01-home** | Visão Geral (Home) | Decisão & Planejamento | Começar o Dia com Clareza | **Essencial** | **UNIR** | Unir seus widgets essenciais ao Giro do Dia (Journal) para compor uma única tela inicial ("Hoje") focada em execução diária. |
| **S02-quick-capture** | Quick Capture | Captura & Triagem | Captura Imediata sem Atrito | **Importante** | **REDESENHAR** | Redesenhar de página isolada para um modal flutuante com atalho global rápido, evitando que o usuário precise mudar de contexto para registrar uma ideia. |
| **S03-take-action** | Take Action | Execução & Foco | Executar a Próxima Ação | **Essencial** | **MANTER** | Manter como a fila de ação direta e focada, exibindo as tarefas inegociáveis ordenadas por urgência e naipes. |
| **S04-weeks** | Weeks (Planejador) | Decisão & Planejamento | Revisão & Planejamento Semanal | **Importante** | **REDESENHAR** | Redesenhar como um modo de calendário semanal integrado diretamente à central de tarefas, eliminando a duplicação de listas e melhorando a distribuição visual de carga. |
| **S05-journal** | Journal (Giro do Dia) | Reflexão & Diário | Encerrar o Dia & Retroalimentar | **Essencial** | **REDESENHAR** | Redesenhar para consolidar o comando diário (bateria, descompressor 80/20 e reflexão noturna), formando a base da tela inicial do MVD. |
| **S06-projects** | Projects (Grid) | Decisão & Planejamento | Revisão & Planejamento Semanal | **Essencial** | **MANTER** | Manter como a visão macro de projetos ativos com barras de progresso real e associação clara às áreas da vida. |
| **S07-project-detail** | Project Detail | Execução & Foco | Executar a Próxima Ação | **Essencial** | **MANTER** | Manter como o espaço de aprofundamento do projeto para visualização e desdobramento das tarefas e referências vinculadas. |
| **S08-tasks** | Tasks (Tabela/Board) | Execução & Foco | Executar a Próxima Ação | **Essencial** | **REDESENHAR** | Redesenhar para unificar a alternância entre Tabela e Kanban de forma fluida, com filtros rápidos por projeto e edição inline mais leve. |
| **S09-areas** | Areas (Grid) | Decisão & Planejamento | Revisão & Planejamento Semanal | **Essencial** | **MANTER** | Manter como a representação perene das esferas de responsabilidade contínua (Saúde, Unicamp, Pessoal, Finanças). |
| **S10-area-detail** | Area Detail | Decisão & Planejamento | Revisão & Planejamento Semanal | **Essencial** | **MANTER** | Manter como o painel de contexto de cada área, agrupando seus respectivos projetos, tarefas avulsas e recursos. |
| **S11-recursos** | Recursos | Memória & Inteligência | Consultar Contexto & Memória | **Importante** | **REDESENHAR** | Redesenhar de lista estática para um cofre de conhecimento prático e referências acionáveis conectado aos nós da Memória. |
| **S12-arquivados** | Arquivados | Decisão & Planejamento | Revisão & Planejamento Semanal | **Importante** | **MANTER** | Manter como o repositório frio e seguro de tarefas concluídas e projetos finalizados, permitindo restauração sem poluir o fluxo ativo. |
| **S13-inbox** | Inbox (Pendentes) | Captura & Triagem | Captura Imediata sem Atrito | **Importante** | **UNIR** | Unir ao ecossistema de Captura Rápida como a bandeja de triagem intermediária antes da alocação consciente no PARA. |
| **S14-habitos** | Hábitos | Execução & Foco | Começar o Dia com Clareza | **Essencial** | **UNIR** | Unir o acompanhamento diário de hábitos diretamente ao Giro do Dia (Hoje), mantendo a tela dedicada apenas para configuração e cadastro de novos hábitos. |
| **S15-dados-cortex** | Dados / Córtex (KI) | Memória & Inteligência | Consultar Contexto & Memória | **Futura** | **INVESTIGAR** | Investigar se a exibição da tabela bruta de nós do Knowledge Intake agrega valor ao usuário Pedro ou se deve permanecer apenas como ferramenta técnica de diagnóstico. |
| **S16-dados-credentials** | Dados / Credenciais | Sistema & Motor | Configuração & Governança | **Essencial** | **MANTER** | Manter como tela indispensável para inserção segura e teste da chave Gemini local (`localStorage`), sem exposição em código ou tráfego público. |
| **S17-dados-registros** | Dados / Registros | Reflexão & Diário | Encerrar o Dia & Retroalimentar | **Importante** | **UNIR** | Unir à linha do tempo histórica do Journal, visto que ambos representam exatamente o mesmo registro cronológico de reflexões diárias. |
| **S18-dados-explorador** | Dados / Explorador Raw| Sistema & Motor | Diagnóstico Interno | **Futura** | **ARQUIVAR** | Arquivar da navegação do produto principal, por se tratar de um explorador cru de tabelas de banco reservado a testes de engenharia. |
| **S19-dados-analytics** | Dados / Analytics (BI)| Decisão & Planejamento | Revisão & Planejamento Semanal | **Futura** | **REDESENHAR** | Redesenhar para substituir gráficos corporativos genéricos por indicadores objetivos de consistência executiva pessoal e taxa de conclusão de projetos. |
| **S20-dados-relacional** | Dados / Grafo 3D | Memória & Inteligência | Consultar Contexto & Memória | **Futura** | **ARQUIVAR** | Arquivar a renderização tridimensional pesada em Three.js em prol do Mapa D3 bidimensional da Memória (`S24`), eliminando redundância e sobrecarga de GPU. |
| **S21-para-overview** | Para-Org / Visão Geral | Captura & Triagem | Ingerir Lotes de Arquivos | **Futura** | **ARQUIVAR** | Arquivar como aba autônoma da aplicação, convertendo seus textos explicativos em documentação de apoio ou ajuda contextual sob demanda. |
| **S22-para-content** | Para-Org / Conteúdo | Captura & Triagem | Ingerir Lotes de Arquivos | **Futura** | **ARQUIVAR** | Arquivar do menu do produto do usuário final, preservando os guias técnicos como arquivos Markdown (`SKILL.md`) no repositório. |
| **S23-para-upload** | Para-Org / Upload | Captura & Triagem | Ingerir Lotes de Arquivos | **Importante** | **REDESENHAR** | Redesenhar como um assistente de importação local simplificado dentro de Sistema/Dados, ativado somente quando o usuário desejar importar pacotes de documentos. |
| **S24-memoria-mapa** | Memória / Mapa (D3) | Memória & Inteligência | Consultar Contexto & Memória | **Importante** | **MANTER** | Manter como a visualização espacial central (estilo Obsidian) que expõe as conexões orgânicas entre projetos, tarefas, áreas e notas. |
| **S25-memoria-nos** | Memória / Nós | Memória & Inteligência | Consultar Contexto & Memória | **Importante** | **MANTER** | Manter como a lista tabular pesquisável de todos os itens do segundo cérebro para localização rápida de conhecimento. |
| **S26-memoria-relacoes** | Memória / Relações | Memória & Inteligência | Consultar Contexto & Memória | **Importante** | **MANTER** | Manter como a central de governança relacional onde o usuário revisa, aprova ou rejeita conexões propostas pela IA. |
| **S27-memoria-orfaos** | Memória / Órfãos | Memória & Inteligência | Consultar Contexto & Memória | **Futura** | **UNIR** | Unir como um filtro inteligente dentro da tela de Nós ou Relações, evitando a ocupação desnecessária de uma aba permanente para itens desconexos. |
| **S28-jarvis** | Assistente Jarvis | Memória & Inteligência | Executar com Foco & Consulta | **Essencial** | **MANTER** | Manter como assistente conversacional omnipresente e seguro, que consulta a base do usuário e emite cartões de proposta para aprovação humana. |

---

## 3. Auditoria Detalhada Tela a Tela (S01 a S28)

### S01-home — Visão Geral (Home)
- **Localização & Componente:** `src/components/views/HomeView.tsx` (`currentView = 'home'`)
- **Finalidade Atual:** Painel de controle panorâmico com cards de métricas (taxa de conclusão, áreas, projetos ativos), radar de tarefas e tracker semanal de hábitos.
- **Finalidade Recomendada:** Integrar-se ao Giro do Dia (Journal) para criar a tela única de comando diário "Hoje", centrada em energia (bateria), prioridades do dia e hábitos.
- **Jornada:** Começar o Dia com Clareza
- **Pilar:** Decisão & Planejamento
- **Dados Consumidos:** `tasks`, `habits`, `projects`, `areas`, métricas agregadas.
- **Ações Disponíveis:** Clicar em KPIs para navegar, marcar hábitos do dia, clicar em tarefas do radar, acessar Jarvis.
- **Frequência de Uso:** Alta (abertura inicial do produto).
- **Valor para Execução:** Médio — atualmente mais contemplativo do que executivo.
- **Redundâncias:** Repete a lista de tarefas prioritárias com `Take Action` e o tracker de hábitos com `HabitosView` e `JournalView`.
- **Dependências:** `useStore`, `ViewHeader`, `Metrics`, `HabitsTracker`.
- **Problemas:** Dispersa o usuário com 4 cards de BI antes de mostrar o que fazer.
- **Desktop vs Mobile:** Desktop em grid balanceado de 3 colunas; Mobile em empilhamento vertical longo.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **UNIR**
- **Justificativa:** Unir seus widgets essenciais ao Giro do Dia (Journal) para compor uma única tela inicial ("Hoje") focada em execução diária.

---

### S02-quick-capture — Quick Capture
- **Localização & Componente:** `src/components/views/QuickCaptureView.tsx` (`currentView = 'quick-capture'`)
- **Finalidade Atual:** Página inteira contendo um formulário de texto para descarregar notas ou tarefas rápidas na Inbox.
- **Finalidade Recomendada:** Converter em modal flutuante ou gaveta rápida ativada por atalho (`Cmd+K` / `Ctrl+K`), sem abandonar a tela de trabalho corrente.
- **Jornada:** Captura Imediata sem Atrito
- **Pilar:** Captura & Triagem
- **Dados Consumidos:** N/A (cria novas entradas em `tasks` na área Inbox).
- **Ações Disponíveis:** Digitar texto livre, selecionar tipo (tarefa/nota), submeter ou cancelar.
- **Frequência de Uso:** Muito Alta (várias vezes ao dia).
- **Valor para Execução:** Alto — previne perda de ideias sem interromper o raciocínio.
- **Redundâncias:** Ocupa uma tela inteira para um único campo de entrada.
- **Dependências:** `useStore`, `QuickCapture`.
- **Problemas:** Interrompe a tela ativa ao forçar navegação de rota.
- **Desktop vs Mobile:** Desktop com card centralizado espaçoso; Mobile ocupando a largura total com teclado virtual.
- **Prioridade MVD:** **Importante**
- **Decisão Proposta:** **REDESENHAR**
- **Justificativa:** Redesenhar de página isolada para um modal flutuante com atalho global rápido, evitando que o usuário precise mudar de contexto para registrar uma ideia.

---

### S03-take-action — Take Action
- **Localização & Componente:** `src/components/views/TakeActionView.tsx` (`currentView = 'take-action'`)
- **Finalidade Atual:** Fila vertical priorizada de tarefas ativas filtráveis por Hoje, Pendentes, Dead Tasks e Sem Data.
- **Finalidade Recomendada:** Manter como o cockpit de foco de execução do operador, integrando cronômetro leve ou modo foco.
- **Jornada:** Executar a Próxima Ação
- **Pilar:** Execução & Foco
- **Dados Consumidos:** `tasks` com status `not-started` ou `in-progress`.
- **Ações Disponíveis:** Filtrar por urgência, marcar como concluída, adicionar nova tarefa rápida, abrir detalhes.
- **Frequência de Uso:** Contínua (durante todo o período de trabalho).
- **Valor para Execução:** Máximo — é onde o trabalho é efetivamente riscado da lista.
- **Redundâncias:** Nenhuma em relação à sua função núcleo, embora compartilhe dados com a Visão Geral.
- **Dependências:** `useStore`, `ViewHeader`, `TakeActionList`.
- **Problemas:** Nenhum bloqueante; visualmente densa e funcional.
- **Desktop vs Mobile:** Desktop em colunas duplas priorizadas; Mobile em lista compacta com alvos de toque grandes.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como a fila de ação direta e focada, exibindo as tarefas inegociáveis ordenadas por urgência e naipes.

---

### S04-weeks — Weeks (Planejador)
- **Localização & Componente:** `src/components/views/WeeksView.tsx` (`currentView = 'weeks'`)
- **Finalidade Atual:** Visão semanal com foco da semana, metas semanais (checkboxes), retrospectiva e ações agendadas.
- **Finalidade Recomendada:** Redesenhar como o modo semanal do gerenciador de tarefas (colunas de segunda a domingo com arrastar e soltar).
- **Jornada:** Revisão & Planejamento Semanal
- **Pilar:** Decisão & Planejamento
- **Dados Consumidos:** `tasks` com data de execução (`executionDate` / `day`), metas semanais.
- **Ações Disponíveis:** Iniciar planejamento, marcar metas, escrever retrospectiva, inspecionar tarefas por dia.
- **Frequência de Uso:** Baixa/Média (início e fim da semana).
- **Valor para Execução:** Alto no planejamento estratégico, baixo no micro-foco diário.
- **Redundâncias:** A seção de retrospectiva semanal repete a lógica do Journal diário.
- **Dependências:** `useStore`, `ViewHeader`, `WeekWidget`.
- **Problemas:** Mistura editor de texto com lista de tarefas de forma ligeiramente assimétrica.
- **Desktop vs Mobile:** Desktop com layout em 7 colunas ou grid balanceado; Mobile com scroll horizontal tátil.
- **Prioridade MVD:** **Importante**
- **Decisão Proposta:** **REDESENHAR**
- **Justificativa:** Redesenhar como um modo de calendário semanal integrado diretamente à central de tarefas, eliminando a duplicação de listas e melhorando a distribuição visual de carga.

---

### S05-journal — Journal (Giro do Dia)
- **Localização & Componente:** `src/components/views/JournalView.tsx` (`currentView = 'journal'`)
- **Finalidade Atual:** Comando completo do dia com ticker operacional, seletor de bateria (Alta/Média/Recup), radar de 6 tarefas, Descompressor 80/20, reflexão diária, hábitos e projetos.
- **Finalidade Recomendada:** Consolidar-se como a tela de partida do produto ("Hoje"), conectando o início, a descompressão e o fechamento reflexivo.
- **Jornada:** Encerrar o Dia & Retroalimentar (e Começar o Dia)
- **Pilar:** Reflexão & Diário
- **Dados Consumidos:** `tasks`, `habits`, `projects`, `areas`, `resources`, histórico de diário.
- **Ações Disponíveis:** Selecionar bateria, navegar entre dias, marcar tarefas concluídas, descomprimir tarefas difíceis, salvar reflexão noturna.
- **Frequência de Uso:** Altíssima (duas vezes ao dia: manhã e noite).
- **Valor para Execução:** Máximo — é a tela mais rica psicologicamente do produto.
- **Redundâncias:** Atualmente duplica os projetos e áreas da Visão Geral.
- **Dependências:** `useStore`, `ViewHeader`.
- **Problemas:** Comprimento vertical extenso quando preenchida com muitos blocos.
- **Desktop vs Mobile:** Desktop com seletor de dias no topo e ticker contínuo; Mobile em sequência vertical tátil.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **REDESENHAR**
- **Justificativa:** Redesenhar para consolidar o comando diário (bateria, descompressor 80/20 e reflexão noturna), formando a base da tela inicial do MVD.

---

### S06-projects — Projects (Grid)
- **Localização & Componente:** `src/components/views/ProjectsView.tsx` (`currentView = 'projects'`)
- **Finalidade Atual:** Grid de cartões de projetos ativos com percentual de conclusão, status e área de foco associada.
- **Finalidade Recomendada:** Manter como o ponto de ancoragem do método PARA para projetos em andamento.
- **Jornada:** Revisão & Planejamento Semanal
- **Pilar:** Decisão & Planejamento
- **Dados Consumidos:** `projects`, contagem de `tasks` por projeto, `areas`.
- **Ações Disponíveis:** Criar novo projeto, filtrar por área/status, alternar visualização grade/lista, clicar para abrir detalhes.
- **Frequência de Uso:** Média (2 a 3 vezes por semana).
- **Valor para Execução:** Alto — conecta o esforço diário aos resultados de longo prazo.
- **Redundâncias:** Nenhuma; representa a entidade canônica Projeto.
- **Dependências:** `useStore`, `ViewHeader`, `ProjectsGrid`.
- **Problemas:** Projetos antigos do CSV com 0% de progresso poluem o grid inicial se não forem filtrados.
- **Desktop vs Mobile:** Desktop em grade responsiva de 3 colunas; Mobile em cards em coluna única com barras de progresso visíveis.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como a visão macro de projetos ativos com barras de progresso real e associação clara às áreas da vida.

---

### S07-project-detail — Project Detail
- **Localização & Componente:** `src/components/views/ProjectDetailView.tsx` (`selectedProjectId = id`)
- **Finalidade Atual:** Exibição do título, status, progresso e lista completa de tarefas sincronizadas de um projeto específico.
- **Finalidade Recomendada:** Manter como a área de trabalho focada de um projeto, permitindo adicionar tarefas e consultar notas de suporte.
- **Jornada:** Executar a Próxima Ação
- **Pilar:** Execução & Foco
- **Dados Consumidos:** Dados do projeto selecionado e suas respectivas `tasks`.
- **Ações Disponíveis:** Marcar tarefa concluída, adicionar nova tarefa ao projeto, alterar status ativo/pausado.
- **Frequência de Uso:** Alta (durante sessões de trabalho dedicadas a um projeto).
- **Valor para Execução:** Muito Alto — elimina a distração de outros projetos.
- **Redundâncias:** Nenhuma.
- **Dependências:** `useStore`, `DEMO_PROJECTS` / Store.
- **Problemas:** Falta campo para anexar recursos ou notas de suporte do projeto diretamente nesta tela.
- **Desktop vs Mobile:** Desktop com layout lateral de metadados + lista; Mobile empilhado com botão de adição rápida.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como o espaço de aprofundamento do projeto para visualização e desdobramento das tarefas e referências vinculadas.

---

### S08-tasks — Tasks (Tabela/Board)
- **Localização & Componente:** `src/components/views/TasksView.tsx` (`currentView = 'tasks'`)
- **Finalidade Atual:** Gerenciador completo de tarefas com visualização alternável entre Tabela densa e Kanban (To Do, In Progress, Done).
- **Finalidade Recomendada:** Redesenhar para tornar a alternância entre tabela e kanban mais fluida e intuitiva, com foco em tarefas ativas.
- **Jornada:** Executar a Próxima Ação
- **Pilar:** Execução & Foco
- **Dados Consumidos:** Coleção completa de `tasks`, `projects`, `areas`.
- **Ações Disponíveis:** Drag and drop no Kanban, busca por texto, filtro por área/projeto, edição inline, arquivamento.
- **Frequência de Uso:** Alta.
- **Valor para Execução:** Alto — permite organizar e reordenar grandes volumes de pendências.
- **Redundâncias:** Apresenta grande sobreposição conceitual com `Take Action`.
- **Dependências:** `useStore`, `ViewHeader`, drag and drop HTML5.
- **Problemas:** Com mais de 100 tarefas do CSV, o Kanban fica muito extenso na coluna "Done".
- **Desktop vs Mobile:** Desktop com tabela densa ou 3 colunas de kanban; Mobile com cards sanfonados e botões de status táteis.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **REDESENHAR**
- **Justificativa:** Redesenhar para unificar a alternância entre Tabela e Kanban de forma fluida, com filtros rápidos por projeto e edição inline mais leve.

---

### S09-areas — Areas (Grid)
- **Localização & Componente:** `src/components/views/AreasView.tsx` (`currentView = 'areas'`)
- **Finalidade Atual:** Grade com as 6 áreas de responsabilidade contínua (Unicamp, Estudo, Saúde, Pessoal, Profissional, Finanças).
- **Finalidade Recomendada:** Manter como o nível mais alto de categorização de vida e responsabilidade.
- **Jornada:** Revisão & Planejamento Semanal
- **Pilar:** Decisão & Planejamento
- **Dados Consumidos:** `areas`, contagem de projetos e tarefas vinculadas.
- **Ações Disponíveis:** Criar nova área, inspecionar contagem de itens, clicar para abrir o detalhe da área.
- **Frequência de Uso:** Baixa/Média (revisões estratégicas semanais/mensais).
- **Valor para Execução:** Médio — valor estrutural e orientador.
- **Redundâncias:** Nenhuma.
- **Dependências:** `useStore`, `ViewHeader`, `AreasGrid`.
- **Problemas:** Ícones e dados estáticos herdados do CSV sem edição direta de metas da área.
- **Desktop vs Mobile:** Desktop em grade de 3 colunas elegantes; Mobile em cards horizontais táteis.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como a representação perene das esferas de responsabilidade contínua (Saúde, Unicamp, Pessoal, Finanças).

---

### S10-area-detail — Area Detail
- **Localização & Componente:** `src/components/views/AreaDetailView.tsx` (`selectedAreaId = id`)
- **Finalidade Atual:** Painel detalhado exibindo os projetos pertencentes à área, tarefas avulsas e recursos associados.
- **Finalidade Recomendada:** Manter como a visão agregadora de tudo o que pertence a uma esfera de vida específica.
- **Jornada:** Revisão & Planejamento Semanal
- **Pilar:** Decisão & Planejamento
- **Dados Consumidos:** Dados da área, `projects` da área, `tasks` da área, `resources` da área.
- **Ações Disponíveis:** Navegar para os projetos da área, adicionar tarefas na área, voltar para o grid.
- **Frequência de Uso:** Média.
- **Valor para Execução:** Médio/Alto — útil para o ritual de fechamento semanal por área.
- **Redundâncias:** Nenhuma.
- **Dependências:** `useStore`, `DEMO_AREAS` / Store.
- **Problemas:** Falta um resumo do padrão de qualidade ou compromisso contínuo da área.
- **Desktop vs Mobile:** Desktop com seções laterais; Mobile empilhado de forma linear.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como o painel de contexto de cada área, agrupando seus respectivos projetos, tarefas avulsas e recursos.

---

### S11-recursos — Recursos
- **Localização & Componente:** `src/components/views/RecursosView.tsx` (`currentView = 'recursos'`)
- **Finalidade Atual:** Biblioteca em grid exibindo 8 cartões de recursos (links, referências, e-books, faturas) categorizados por área.
- **Finalidade Recomendada:** Redesenhar como o repositório de referências práticas conectado à Memória relacional.
- **Jornada:** Consultar Contexto & Memória
- **Pilar:** Memória & Inteligência
- **Dados Consumidos:** `resources`, `areas`, `projects`.
- **Ações Disponíveis:** Adicionar novo recurso, buscar por texto, abrir link de referência.
- **Frequência de Uso:** Ocasional (quando uma tarefa exige consulta de documento).
- **Valor para Execução:** Médio — suporte informacional à execução.
- **Redundâncias:** Parcialmente redundante com a aba de Nós do tipo "Resource" na Memória.
- **Dependências:** `useStore`, `ViewHeader`.
- **Problemas:** Não possui pré-visualização de arquivos locais nem suporte a tags ricas.
- **Desktop vs Mobile:** Desktop em grade de 3 colunas com badges; Mobile em cards simplificados.
- **Prioridade MVD:** **Importante**
- **Decisão Proposta:** **REDESENHAR**
- **Justificativa:** Redesenhar de lista estática para um cofre de conhecimento prático e referências acionáveis conectado aos nós da Memória.

---

### S12-arquivados — Arquivados
- **Localização & Componente:** `src/components/views/ArquivadosView.tsx` (`currentView = 'arquivados'`)
- **Finalidade Atual:** Listagem de tarefas e projetos arquivados (status `arquivadas` ou nós com flag `archived`).
- **Finalidade Recomendada:** Manter como cofre frio de itens inativos, garantindo a higiene visual do dia a dia.
- **Jornada:** Revisão & Planejamento Semanal
- **Pilar:** Decisão & Planejamento
- **Dados Consumidos:** Tarefas e nós arquivados.
- **Ações Disponíveis:** Pesquisar no arquivo morto, restaurar item para o estado ativo.
- **Frequência de Uso:** Rara (apenas para resgatar algo passado).
- **Valor para Execução:** Baixo na execução ativa, alto na sensação de ordem e segurança psicológica.
- **Redundâncias:** Nenhuma.
- **Dependências:** `useStore`, `ViewHeader`.
- **Problemas:** Interface bastante minimalista; pode ter filtros por data de arquivamento.
- **Desktop vs Mobile:** Desktop em lista com metadados; Mobile em lista compacta com botão de restauração.
- **Prioridade MVD:** **Importante**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como o repositório frio e seguro de tarefas concluídas e projetos finalizados, permitindo restauração sem poluir o fluxo ativo.

---

### S13-inbox — Inbox (Pendentes)
- **Localização & Componente:** `src/components/views/InboxView.tsx` (`currentView = 'inbox'`)
- **Finalidade Atual:** Lista de 7 a 8 tarefas ou itens na área "Inbox" aguardando triagem, com botão de ação rápida "Organizar".
- **Finalidade Recomendada:** Unir ao Quick Capture para formar a central unificada de Captura & Triagem do MVD.
- **Jornada:** Captura Imediata sem Atrito
- **Pilar:** Captura & Triagem
- **Dados Consumidos:** `tasks` cuja área é `Inbox` ou sem projeto associado.
- **Ações Disponíveis:** Clicar em "Organizar" para atribuir área/projeto, capturar novo item, descartar.
- **Frequência de Uso:** Diária (ritual de triagem).
- **Valor para Execução:** Alto — evita o acúmulo de notas desestruturadas.
- **Redundâncias:** Duplica a intenção do Quick Capture em rota separada.
- **Dependências:** `useStore`, `ViewHeader`.
- **Problemas:** O badge na barra lateral exibe número fixo que nem sempre reflete a contagem real dinâmica.
- **Desktop vs Mobile:** Desktop com lista limpa e botões de ação lateral; Mobile com cards de toque tátil.
- **Prioridade MVD:** **Importante**
- **Decisão Proposta:** **UNIR**
- **Justificativa:** Unir ao ecossistema de Captura Rápida como a bandeja de triagem intermediária antes da alocação consciente no PARA.

---

### S14-habitos — Hábitos
- **Localização & Componente:** `src/components/views/HabitosView.tsx` (`currentView = 'habitos'`)
- **Finalidade Atual:** Tracker semanal em tabela/heatmap para marcar os 5 hábitos diários (Fisioterapia, Revisão, Treino, Dieta, Leitura) com cálculo de ofensiva (streak).
- **Finalidade Recomendada:** Unir o registro diário ao Hoje / Journal, mantendo esta tela apenas para gerenciar metas e cadastrar novos hábitos.
- **Jornada:** Começar o Dia com Clareza
- **Pilar:** Execução & Foco
- **Dados Consumidos:** `habits` com matriz de dias da semana e contador de ofensiva.
- **Ações Disponíveis:** Clicar nas células de dias para marcar/desmarcar hábito, adicionar novo hábito.
- **Frequência de Uso:** Diária (registro), Baixa (configuração).
- **Valor para Execução:** Alto — sustenta a base fisiológica de saúde e estudo do usuário.
- **Redundâncias:** O mesmo widget de hábitos já aparece na Visão Geral e no Journal.
- **Dependências:** `useStore`, `ViewHeader`, `HabitsList`.
- **Problemas:** A existência de 3 lugares diferentes para marcar o mesmo hábito confunde o operador.
- **Desktop vs Mobile:** Desktop com tabela matricial ampla; Mobile com cards horizontais com 7 botões circulares táteis.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **UNIR**
- **Justificativa:** Unir o acompanhamento diário de hábitos diretamente ao Giro do Dia (Hoje), mantendo a tela dedicada apenas para configuração e cadastro de novos hábitos.

---

### S15-dados-cortex — Dados / Córtex (KI)
- **Localização & Componente:** `src/components/views/DadosView.tsx` (`tab = 'cortex'`)
- **Finalidade Atual:** Tabela densa exibindo todas as entidades brutas indexadas no IndexedDB como nós do Knowledge Intake.
- **Finalidade Recomendada:** Investigar se deve virar um modo avançado de auditoria de banco para desenvolvedores ou ser ocultada do usuário final.
- **Jornada:** Consultar Contexto & Memória
- **Pilar:** Memória & Inteligência
- **Dados Consumidos:** `nodes` e `relations` do IndexedDB.
- **Ações Disponíveis:** Filtrar por tipo de entidade, arquivar nó, inspecionar campos brutos.
- **Frequência de Uso:** Baixíssima para o usuário; Alta para o desenvolvedor durante testes.
- **Valor para Execução:** Praticamente nulo na rotina diária.
- **Redundâncias:** Apresenta dados idênticos à tela de Memória / Nós (`S25`), porém em formato cru.
- **Dependências:** `useStore`, `src/lib/db.ts`.
- **Problemas:** Parece uma ferramenta interna de desenvolvedor que vazou para a interface de usuário.
- **Desktop vs Mobile:** Desktop com tabela densa cheia de colunas; Mobile quebrando em cards simplificados.
- **Prioridade MVD:** **Futura**
- **Decisão Proposta:** **INVESTIGAR**
- **Justificativa:** Investigar se a exibição da tabela bruta de nós do Knowledge Intake agrega valor ao usuário Pedro ou se deve permanecer apenas como ferramenta técnica de diagnóstico.

---

### S16-dados-credentials — Dados / Credenciais
- **Localização & Componente:** `src/components/views/DadosView.tsx` (`tab = 'credentials'`)
- **Finalidade Atual:** Formulário seguro para configuração da Gemini API Key local, seleção do modelo ativo e teste de conexão.
- **Finalidade Recomendada:** Manter como tela canônica de configurações de inteligência local em "Sistema & Dados".
- **Jornada:** Configuração & Governança
- **Pilar:** Sistema & Motor
- **Dados Consumidos:** Credencial da Gemini API salva no `localStorage` do navegador.
- **Ações Disponíveis:** Inserir chave, ocultar/mostrar chave, trocar modelo, testar ping com a API, remover credencial.
- **Frequência de Uso:** Rara (configuração inicial ou troca de chave).
- **Valor para Execução:** Crítico para habilitar o Jarvis e o processamento de IA local.
- **Redundâncias:** Nenhuma.
- **Dependências:** `src/lib/credentials.ts`, `src/lib/gemini.ts`.
- **Problemas:** Nenhum; implementada com estrito respeito à segurança e sem vazamento em logs.
- **Desktop vs Mobile:** Desktop em painel centralizado; Mobile em formulário vertical com teclado adaptável.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como tela indispensável para inserção segura e teste da chave Gemini local (`localStorage`), sem exposição em código ou tráfego público.

---

### S17-dados-registros — Dados / Registros
- **Localização & Componente:** `src/components/views/DadosView.tsx` (`tab = 'registros'`)
- **Finalidade Atual:** Linha do tempo tabular com histórico de logs diários (data, desempenho, foco, o que funcionou, o que melhorar).
- **Finalidade Recomendada:** Unir ao Journal como a visão de histórico cronológico de reflexões diárias.
- **Jornada:** Encerrar o Dia & Retroalimentar
- **Pilar:** Reflexão & Diário
- **Dados Consumidos:** `mockDailyLogs` / Registros de reflexão.
- **Ações Disponíveis:** Buscar por data/texto, filtrar, exportar CSV.
- **Frequência de Uso:** Ocasional (revisão semanal ou mensal de hábitos).
- **Valor para Execução:** Alto no autoconhecimento de longo prazo.
- **Redundâncias:** Total sobreposição com as entradas históricas do Journal.
- **Dependências:** `useStore`.
- **Problemas:** Está separada do Journal em uma aba técnica de dados, gerando desconexão mental.
- **Desktop vs Mobile:** Desktop com tabela cronológica de 5 colunas; Mobile em lista linear de cards de log.
- **Prioridade MVD:** **Importante**
- **Decisão Proposta:** **UNIR**
- **Justificativa:** Unir à linha do tempo histórica do Journal, visto que ambos representam exatamente o mesmo registro cronológico de reflexões diárias.

---

### S18-dados-explorador — Dados / Explorador Raw
- **Localização & Componente:** `src/components/views/DadosView.tsx` (`tab = 'explorador'`)
- **Finalidade Atual:** Inspeção crua de todas as tabelas e objetos JavaScript existentes na memória do sistema.
- **Finalidade Recomendada:** Arquivar da navegação principal do MVD, mantendo-a apenas se o modo de depuração técnica estiver ativo.
- **Jornada:** Diagnóstico Interno
- **Pilar:** Sistema & Motor
- **Dados Consumidos:** Coleções brutas do store.
- **Ações Disponíveis:** Inspecionar chaves e valores JSON crus, exportar tabela.
- **Frequência de Uso:** Nula para o usuário comum.
- **Valor para Execução:** Zero na rotina executiva.
- **Redundâncias:** Inspeção de baixo nível desnecessária na interface do usuário.
- **Dependências:** `useStore`.
- **Problemas:** Confunde o usuário e destoa da identidade premium de produto pessoal.
- **Desktop vs Mobile:** Desktop em tabela raw densa; Mobile em sanfona de JSON.
- **Prioridade MVD:** **Futura**
- **Decisão Proposta:** **ARQUIVAR**
- **Justificativa:** Arquivar da navegação do produto principal, por se tratar de um explorador cru de tabelas de banco reservado a testes de engenharia.

---

### S19-dados-analytics — Dados / Analytics (BI)
- **Localização & Componente:** `src/components/views/DadosView.tsx` (`tab = 'analytics'`)
- **Finalidade Atual:** Gráficos de barras e pizza com produtividade semanal e distribuição PARA gerados com Recharts.
- **Finalidade Recomendada:** Redesenhar para exibir métricas objetivas de tração pessoal (taxa de conclusão de tarefas prioritárias, ofensiva de hábitos e ritmo de projetos) em vez de BI empresarial genérico.
- **Jornada:** Revisão & Planejamento Semanal
- **Pilar:** Decisão & Planejamento
- **Dados Consumidos:** Métricas agregadas do store via Recharts.
- **Ações Disponíveis:** Visualizar gráficos, inspecionar tooltips ao passar o mouse.
- **Frequência de Uso:** Baixa (uma vez por semana no máximo).
- **Valor para Execução:** Baixo atualmente (métricas decorativas).
- **Redundâncias:** Métricas já aparecem no cabeçalho da Visão Geral.
- **Dependências:** `useStore`, biblioteca `recharts`.
- **Problemas:** Alimenta a ilusão de produtividade sem impulsionar a próxima ação concreta.
- **Desktop vs Mobile:** Desktop em gráficos lado a lado em 2 colunas; Mobile empilhado em coluna única responsiva.
- **Prioridade MVD:** **Futura**
- **Decisão Proposta:** **REDESENHAR**
- **Justificativa:** Redesenhar para substituir gráficos corporativos genéricos por indicadores objetivos de consistência executiva pessoal e taxa de conclusão de projetos.

---

### S20-dados-relacional — Dados / Grafo Relacional 3D
- **Localização & Componente:** `src/components/views/DadosRelacional.tsx` (`tab = 'relacional'`)
- **Finalidade Atual:** Visualização tridimensional em esfera dos nós e conexões do sistema usando `react-force-graph-3d` / Three.js.
- **Finalidade Recomendada:** Arquivar totalmente do MVD em favor do Mapa D3 2D da Memória (`S24`).
- **Jornada:** Consultar Contexto & Memória
- **Pilar:** Memória & Inteligência
- **Dados Consumidos:** Nós e arestas do IndexedDB.
- **Ações Disponíveis:** Rotacionar esfera 3D, dar zoom, clicar em nós.
- **Frequência de Uso:** Praticamente nula (pesado e pouco prático).
- **Valor para Execução:** Zero — é puramente visual e sem usabilidade ergonômica.
- **Redundâncias:** Duplica a função da tela de Memória / Mapa (`S24`).
- **Dependências:** `three`, `react-force-graph-3d`.
- **Problemas:** Pesa excessivamente no bundle JavaScript, consome GPU e tem baixa legibilidade em telas menores.
- **Desktop vs Mobile:** Desktop com viewport pesado; Mobile com performance degradada e dificuldade de toque.
- **Prioridade MVD:** **Futura**
- **Decisão Proposta:** **ARQUIVAR**
- **Justificativa:** Arquivar a renderização tridimensional pesada em Three.js em prol do Mapa D3 bidimensional da Memória (`S24`), eliminando redundância e sobrecarga de GPU.

---

### S21-para-overview — Para-Organizer / Visão Geral
- **Localização & Componente:** `src/components/views/ParaOrganizerSkillView.tsx` (`tab = 'overview'`)
- **Finalidade Atual:** Página com cards explicativos sobre o que é a skill de organização PARA e seus quatro pilares.
- **Finalidade Recomendada:** Arquivar da navegação principal, transformando o texto em documentação de suporte contextual.
- **Jornada:** Ingerir Lotes de Arquivos
- **Pilar:** Captura & Triagem
- **Dados Consumidos:** Metadados estáticos da skill.
- **Ações Disponíveis:** Leitura passiva de cartões.
- **Frequência de Uso:** Nula após a primeira leitura.
- **Valor para Execução:** Zero.
- **Redundâncias:** Explica na interface o que já está documentado em arquivos de engenharia.
- **Dependências:** `useStore`.
- **Problemas:** Ocupa uma aba nobre do produto com documentação estática que o usuário não precisa revisitar.
- **Desktop vs Mobile:** Desktop em grade editorial; Mobile em cards empilhados.
- **Prioridade MVD:** **Futura**
- **Decisão Proposta:** **ARQUIVAR**
- **Justificativa:** Arquivar como aba autônoma da aplicação, convertendo seus textos explicativos em documentação de apoio ou ajuda contextual sob demanda.

---

### S22-para-content — Para-Organizer / Conteúdo da Skill
- **Localização & Componente:** `src/components/views/ParaOrganizerSkillView.tsx` (`tab = 'content'`)
- **Finalidade Atual:** Leitor de arquivos markdown internos (`SKILL.md`, guias cross-platform).
- **Finalidade Recomendada:** Arquivar do produto final do usuário, preservando os arquivos originais na pasta `docs/` do repositório Git.
- **Jornada:** Ingerir Lotes de Arquivos
- **Pilar:** Captura & Triagem
- **Dados Consumidos:** Arquivos markdown crus.
- **Ações Disponíveis:** Leitura em split-view de documentação técnica.
- **Frequência de Uso:** Nula para o usuário em produção.
- **Valor para Execução:** Zero.
- **Redundâncias:** Interface interna duplicando um leitor de código/documentação.
- **Dependências:** `useStore`.
- **Problemas:** Confunde a experiência do usuário leigo com arquivos técnicos de agentes de IA.
- **Desktop vs Mobile:** Desktop com leitor split-view; Mobile com leitor vertical.
- **Prioridade MVD:** **Futura**
- **Decisão Proposta:** **ARQUIVAR**
- **Justificativa:** Arquivar do menu do produto do usuário final, preservando os guias técnicos como arquivos Markdown (`SKILL.md`) no repositório.

---

### S23-para-upload — Para-Organizer / Upload & Pipeline
- **Localização & Componente:** `src/components/views/ParaOrganizerSkillView.tsx` (`tab = 'upload'`)
- **Finalidade Atual:** Pipeline completo de upload de arquivos e ZIP até 100 MB, extração local (PDF.js, OCR), cálculo de SHA-256 e propostas de categorização PARA com IA.
- **Finalidade Recomendada:** Redesenhar como um assistente de importação local sob demanda integrado na área de Configurações/Dados.
- **Jornada:** Ingerir Lotes de Arquivos
- **Pilar:** Captura & Triagem
- **Dados Consumidos:** Arquivos locais, bytes reais, resposta JSON da Gemini API.
- **Ações Disponíveis:** Selecionar arquivos/ZIP, informar caminho raiz, disparar análise com IA, aprovar/rejeitar propostas por item, gerar twins Markdown.
- **Frequência de Uso:** Ocasional (quando o usuário deseja importar grandes lotes de documentos).
- **Valor para Execução:** Alto na fase de migração de dados; baixo na rotina diária.
- **Redundâncias:** Nenhuma; é a implementação canônica do PRD de ingestão.
- **Dependências:** `pdfjs-dist`, `tesseract.js`, `jszip`, `src/lib/gemini.ts`.
- **Problemas:** O processamento de OCR e PDF é computacionalmente pesado no navegador; precisa ser acionado com parcimônia.
- **Desktop vs Mobile:** Desktop com árvore de arquivos e painel de revisão lateral; Mobile em lista de propostas empilhadas.
- **Prioridade MVD:** **Importante**
- **Decisão Proposta:** **REDESENHAR**
- **Justificativa:** Redesenhar como um assistente de importação local simplificado dentro de Sistema/Dados, ativado somente quando o usuário desejar importar pacotes de documentos.

---

### S24-memoria-mapa — Memória / Mapa (D3)
- **Localização & Componente:** `src/components/views/MemoriaView.tsx` (`tab = 'mapa'`)
- **Finalidade Atual:** Grafo relacional 2D force-directed em D3.js estilo Obsidian na paleta Forest/Nude, com zoom, pan, busca, filtros de nós e gaveta de detalhes.
- **Finalidade Recomendada:** Manter como a principal experiência espacial e visual de navegação no segundo cérebro do Më.
- **Jornada:** Consultar Contexto & Memória
- **Pilar:** Memória & Inteligência
- **Dados Consumidos:** Todos os `nodes` e `relations` do Knowledge Intake.
- **Ações Disponíveis:** Zoom, pan, arrastar nós, filtrar por tipo (Projetos, Áreas, Tarefas, Recursos), clicar em nó para abrir painel lateral.
- **Frequência de Uso:** Média (2 a 3 vezes por semana).
- **Valor para Execução:** Alto no discernimento estratégico e conexão de ideias.
- **Redundâncias:** Substitui completamente o Grafo 3D descartado (`S20`).
- **Dependências:** `d3`, `MemoriaMapa`, `useStore`.
- **Problemas:** Layout com muitos nós exige ajuste fino de forças para evitar oscilações visuais.
- **Desktop vs Mobile:** Desktop em canvas expansivo com gaveta lateral de metadados; Mobile adaptado para gestos de toque com painel deslizante.
- **Prioridade MVD:** **Importante**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como a visualização espacial central (estilo Obsidian) que expõe as conexões orgânicas entre projetos, tarefas, áreas e notas.

---

### S25-memoria-nos — Memória / Nós
- **Localização & Componente:** `src/components/views/MemoriaView.tsx` (`tab = 'nos'`)
- **Finalidade Atual:** Tabela pesquisável com todos os nós cadastrados na memória, exibindo tipo, título, quantidade de conexões, data e exclusão.
- **Finalidade Recomendada:** Manter como a listagem direta e rápida de consulta de itens indexados.
- **Jornada:** Consultar Contexto & Memória
- **Pilar:** Memória & Inteligência
- **Dados Consumidos:** `nodes` do Knowledge Intake.
- **Ações Disponíveis:** Buscar nó por título, filtrar por tipo, abrir detalhe, excluir nó permanentemente.
- **Frequência de Uso:** Média.
- **Valor para Execução:** Alto para localização rápida de arquivos e referências sem navegar pelo grafo.
- **Redundâncias:** Nenhuma; é a visão tabular complementar do mapa.
- **Dependências:** `useStore`, `MemoriaNos`.
- **Problemas:** Nenhum bloqueante.
- **Desktop vs Mobile:** Desktop em tabela completa com metadados; Mobile em lista de cards com busca tátil.
- **Prioridade MVD:** **Importante**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como a lista tabular pesquisável de todos os itens do segundo cérebro para localização rápida de conhecimento.

---

### S26-memoria-relacoes — Memória / Relações
- **Localização & Componente:** `src/components/views/MemoriaView.tsx` (`tab = 'relacoes'`)
- **Finalidade Atual:** Painel de governança de conexões relacionais (`belongs_to`, `supports`, `produces`, etc.), permitindo criar relações manuais e aprovar sugestões da IA.
- **Finalidade Recomendada:** Manter como o escudo de integridade do grafo do usuário.
- **Jornada:** Consultar Contexto & Memória
- **Pilar:** Memória & Inteligência
- **Dados Consumidos:** `relations` do Knowledge Intake com metadados de autor (`manual`, `ai`, `system`) e aprovação.
- **Ações Disponíveis:** Criar relação entre dois nós, aprovar relação sugerida pela IA, deletar conexão.
- **Frequência de Uso:** Ocasional (sempre que a IA ou o usuário sugerir novas conexões).
- **Valor para Execução:** Alto na manutenção da confiança do segundo cérebro.
- **Redundâncias:** Nenhuma.
- **Dependências:** `useStore`, `MemoriaRelacoes`.
- **Problemas:** Pode incorporar um indicador visual mais evidente para relações pendentes de aprovação.
- **Desktop vs Mobile:** Desktop em tabela estruturada com botões de governança; Mobile em lista de conexões com botões táteis de ação.
- **Prioridade MVD:** **Importante**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como a central de governança relacional onde o usuário revisa, aprova ou rejeita conexões propostas pela IA.

---

### S27-memoria-orfaos — Memória / Órfãos
- **Localização & Componente:** `src/components/views/MemoriaView.tsx` (`tab = 'orfaos'`)
- **Finalidade Atual:** Lista de nós com zero conexões que precisam de vinculação a algum projeto ou área.
- **Finalidade Recomendada:** Unir como filtro contextual ou alerta inteligente dentro da aba de Nós ou Relações.
- **Jornada:** Consultar Contexto & Memória
- **Pilar:** Memória & Inteligência
- **Dados Consumidos:** Nós cujo grau de conexão é zero.
- **Ações Disponíveis:** Vincular nó órfão a um projeto ou área existente.
- **Frequência de Uso:** Rara (apenas em limpezas periódicas de conhecimento).
- **Valor para Execução:** Baixo na rotina diária.
- **Redundâncias:** Ocupa uma aba fixa inteira para exibir um filtro específico da coleção de nós.
- **Dependências:** `useStore`, `MemoriaOrfaos`.
- **Problemas:** Aba quase sempre vazia se o usuário mantiver o sistema arrumado.
- **Desktop vs Mobile:** Desktop em tabela de saneamento; Mobile em lista com botão de vinculação rápida.
- **Prioridade MVD:** **Futura**
- **Decisão Proposta:** **UNIR**
- **Justificativa:** Unir como um filtro inteligente dentro da tela de Nós ou Relações, evitando a ocupação desnecessária de uma aba permanente para itens desconexos.

---

### S28-jarvis — Assistente Jarvis
- **Localização & Componente:** `src/components/JarvisChat.tsx` (`isJarvisOpen = true`)
- **Finalidade Atual:** Modal/drawer conversacional com IA conectada ao Gemini, exibindo modelo ativo, suporte a propostas estruturadas com cartões de aprovação e comandos de ação.
- **Finalidade Recomendada:** Manter como o companheiro executivo omnipresente do operador, capaz de responder dúvidas, descomprimir tarefas e propor ações com segurança.
- **Jornada:** Executar com Foco & Consulta
- **Pilar:** Memória & Inteligência
- **Dados Consumidos:** Histórico de conversa, contexto do store (`tasks`, `projects`, `areas`, `nodes`), Gemini API.
- **Ações Disponíveis:** Enviar mensagens em linguagem natural, expandir modal, fechar, aprovar ou rejeitar propostas nos cartões `ApprovalCard`.
- **Frequência de Uso:** Alta (como assistente sob demanda).
- **Valor para Execução:** Altíssimo quando utilizado para descompressão de trabalho e consulta rápida.
- **Redundâncias:** Nenhuma; é a entidade de IA assistida do produto.
- **Dependências:** `useStore`, `src/lib/jarvis.ts`, `src/lib/gemini.ts`, `ApprovalCard`.
- **Problemas:** Precisa garantir que respostas longas não escondam os botões de ação nos cartões de proposta no mobile.
- **Desktop vs Mobile:** Desktop em painel lateral elegante ou janela flutuante expansível; Mobile em interface modal fullscreen tátil.
- **Prioridade MVD:** **Essencial**
- **Decisão Proposta:** **MANTER**
- **Justificativa:** Manter como assistente conversacional omnipresente e seguro, que consulta a base do usuário e emite cartões de proposta para aprovação humana.

---

## 4. Matriz Técnica Original com Arquivos e Rotas

Para fins de rastreabilidade com o Canvas de Telas e com os testes automatizados, preserva-se o mapeamento técnico dos frames auditados:

| ID | Nome | Rota / Gatilho | Componente | Arquivo Fonte | RenderKind | Evidência de Validação |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **S01-home** | Visão Geral (Home) | `currentView = 'home'` | `HomeView` | `src/components/views/HomeView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S02-quick-capture** | Quick Capture | `currentView = 'quick-capture'` | `QuickCaptureView` | `src/components/views/QuickCaptureView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S03-take-action** | Take Action | `currentView = 'take-action'` | `TakeActionView` | `src/components/views/TakeActionView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S04-weeks** | Weeks (Planejador) | `currentView = 'weeks'` | `WeeksView` | `src/components/views/WeeksView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S05-journal** | Journal (Giro do Dia) | `currentView = 'journal'` | `JournalView` | `src/components/views/JournalView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S06-projects** | Projects (Grid) | `currentView = 'projects'` | `ProjectsView` | `src/components/views/ProjectsView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S07-project-detail** | Project Detail | `selectedProjectId = id` | `ProjectDetailView` | `src/components/views/ProjectDetailView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S08-tasks** | Tasks (Tabela/Board) | `currentView = 'tasks'` | `TasksView` | `src/components/views/TasksView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S09-areas** | Areas (Grid) | `currentView = 'areas'` | `AreasView` | `src/components/views/AreasView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S10-area-detail** | Area Detail | `selectedAreaId = id` | `AreaDetailView` | `src/components/views/AreaDetailView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S11-recursos** | Recursos | `currentView = 'recursos'` | `RecursosView` | `src/components/views/RecursosView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S12-arquivados** | Arquivados | `currentView = 'arquivados'` | `ArquivadosView` | `src/components/views/ArquivadosView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S13-inbox** | Inbox (Pendentes) | `currentView = 'inbox'` | `InboxView` | `src/components/views/InboxView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S14-habitos** | Hábitos | `currentView = 'habitos'` | `HabitosView` | `src/components/views/HabitosView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S15-dados-cortex** | Dados / Córtex (KI) | `currentView = 'dados'`, `cortex` | `DadosView` | `src/components/views/DadosView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S16-dados-credentials** | Dados / Credenciais | `currentView = 'dados'`, `credentials` | `DadosView` | `src/components/views/DadosView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S17-dados-registros** | Dados / Registros | `currentView = 'dados'`, `registros` | `DadosView` | `src/components/views/DadosView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S18-dados-explorador** | Dados / Explorador Raw| `currentView = 'dados'`, `explorador` | `DadosView` | `src/components/views/DadosView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S19-dados-analytics** | Dados / Analytics | `currentView = 'dados'`, `analytics` | `DadosView` | `src/components/views/DadosView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S20-dados-relacional** | Dados / Grafo 3D | `currentView = 'dados'`, `relacional` | `DadosRelacional` | `src/components/views/DadosRelacional.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S21-para-overview** | Para-Org / Visão Geral | `currentView = 'para-organizer'`, `overview` | `ParaOrganizerSkillView` | `src/components/views/ParaOrganizerSkillView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S22-para-content** | Para-Org / Conteúdo | `currentView = 'para-organizer'`, `content` | `ParaOrganizerSkillView` | `src/components/views/ParaOrganizerSkillView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S23-para-upload** | Para-Org / Upload | `currentView = 'para-organizer'`, `upload` | `ParaOrganizerSkillView` | `src/components/views/ParaOrganizerSkillView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S24-memoria-mapa** | Memória / Mapa (D3) | `currentView = 'memoria'`, `mapa` | `MemoriaView` | `src/components/views/MemoriaView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S25-memoria-nos** | Memória / Nós | `currentView = 'memoria'`, `nos` | `MemoriaView` | `src/components/views/MemoriaView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S26-memoria-relacoes** | Memória / Relações | `currentView = 'memoria'`, `relacoes` | `MemoriaView` | `src/components/views/MemoriaView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S27-memoria-orfaos** | Memória / Órfãos | `currentView = 'memoria'`, `orfaos` | `MemoriaView` | `src/components/views/MemoriaView.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
| **S28-jarvis** | Assistente Jarvis | `isJarvisOpen = true` | `JarvisChat` | `src/components/JarvisChat.tsx` | `live` | `artifacts/verification/route-correction/desktop_canvas_overview_1788836671353.png` |
