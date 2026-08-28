# PRD — Më Life OS: PARA, Knowledge Intake, Memória e Jarvis

**Versão:** 2.0  
**Data:** 2026-08-28  
**Repositório:** https://github.com/pedrotgon/Me-codex  
**Site atual:** https://m-life-os-pedro.pedrotg022.chatgpt.site  
**Baseline auditado:** commit dd45fe29f0490294d2fd01baaf166bb4406e8cc4  
**Status:** implementação parcial; exige conclusão e validação ponta a ponta.

## 1. Visão do produto

O Më é um segundo cérebro local-first. O Knowledge Intake (KI) é a fonte lógica única de Projects, Areas, Resources, Archives, Tasks, arquivos Markdown e relações.

Fluxo principal:

Arquivo/ZIP → limpeza → extração local → seleção → Gemini → proposta → revisão humana → KI + Markdown → Memória.

Nenhuma informação é gravada definitivamente antes da aprovação humana.

## 2. Leitura obrigatória para qualquer IA

Antes de editar:

1. Ler `AGENTS.md`.
2. Ler este PRD inteiro.
3. Inspecionar `domain/`, `ferramentas/` e o código existente.
4. Identificar regras de negócio antes de alterar componentes.
5. Preservar a arquitetura React/Vite, o design atual e mudanças do usuário.
6. Não revelar raciocínio privado; registrar decisões, evidências e limitações.
7. Não publicar o site. Ao final, deixar a `main` validada para publicação posterior.

## 3. Direção visual

Preservar a identidade do Më:

- verde floresta, fundo claro/nude e tipografia existente;
- alta densidade informacional;
- bordas discretas e hierarquia limpa;
- sem gradientes, neon, glassmorphism ou aparência genérica de IA;
- reutilizar componentes, tokens, ícones e padrões existentes.

## 4. Estado atual confirmado

### Concluído

- Knowledge Intake e coleções PARA existentes.
- Aba Credenciais com chave Gemini local.
- Uma entrada Para-Organizer abaixo de Dados.
- Abas Visão geral, Conteúdo da skill e Upload.
- Upload de arquivos e ZIP com limite de 100 MB.
- Preservação dos caminhos relativos do ZIP.
- Exclusão de `__MACOSX`, `._*`, `.DS_Store`, `.venv`, `node_modules`, `.git` e `__pycache__`.
- Seleção individual e filtros Recomendados, Documentos, Códigos, Todos e Limpar.
- Agrupamento por pastas e edição do nome exibido.
- Extração local de texto de PDF e OCR com PDF.js/Tesseract.
- Gemini por lotes, revisão de título, categoria PARA e pai.
- Geração e download de Markdown em ZIP.
- Corpo do Markdown limitado a 2.200 caracteres; frontmatter fora do limite.
- Aprovação antes da integração.
- Build de produção concluído em 2026-08-28.

### Concluído e Validado (v2.1)

- Knowledge Intake como Single Source of Truth consolidado no IndexedDB com 6 stores (`nodes`, `relations`, `source_assets`, `markdown_twins`, `ingestion_jobs`, `approval_events`).
- Extração local com cálculo de SHA-256 via Web Crypto, suporte a PDF (PDF.js + OCR Tesseract), DOCX, XLSX e imagens.
- Preservação correta de tamanho e data descompactada de arquivos em ZIP e descarte de arquivos ocultos/lixo técnico.
- Structured Output com JSON Schema no Gemini API, lotes de 6 itens, retries exponenciais e preservação de resultados parciais.
- Geração de Markdown Twins com frontmatter completo (`path_mac`, `path_windows`, `sha256`, `mime_type`, etc.) e corte no corpo em 2.200 caracteres.
- Memória completa com 4 abas integradas (Mapa Relacional D3 force-directed estilo Obsidian na paleta Forest/Nude, Nós, Relações e Órfãos).
- Jarvis conectado à Gemini API com modelo ativo exibido, respostas consultivas diretas e cartões de proposta interativos com botões de aprovação e rejeição.
- Validação E2E com Agent Browser e registro de evidências visuais em `artifacts/verification/`.
- Build de produção verificado com 0 erros de tipagem.

## 5. Para-Organizer definitivo

### Pipeline

1. Receber arquivo ou ZIP.
2. Validar o limite de 100 MB.
3. Preservar árvore e metadados disponíveis.
4. Remover lixo técnico.
5. Extrair texto localmente.
6. Calcular SHA-256 com Web Crypto.
7. Permitir seleção e revisão.
8. Enviar ao Gemini somente conteúdo selecionado.
9. Validar resposta contra JSON Schema.
10. Exibir proposta editável.
11. Aprovar ou rejeitar por item.
12. Persistir no KI.
13. Gerar os representantes `.md`.

### Extração

- PDF textual: PDF.js.
- PDF digitalizado: OCR sob demanda em português e inglês.
- TXT, MD, CSV, JSON e código: leitura textual.
- DOCX: extração local adequada.
- XLSX: nomes das abas e valores úteis, sem fórmulas executáveis.
- Imagens: OCR somente quando selecionadas.
- Binários desconhecidos: metadados, sem inventar conteúdo.

Nunca armazenar o arquivo original no site. O representante Markdown aponta para ele.

### Frontmatter mínimo

- `id`
- `title`
- `original_file`
- `relative_path`
- `path_mac`
- `path_windows`
- `mime_type`
- `size`
- `modified`
- `sha256`
- `para`
- `parent`
- `tags`
- `created_at`

Os caminhos absolutos devem ser informados ou derivados de uma raiz fornecida pelo usuário. O navegador não pode inventá-los.

### Resiliência Gemini

- Usar Structured Output com JSON Schema/Zod.
- Validar todos os campos antes de atualizar a interface.
- Lotes máximos de oito itens e concorrência controlada.
- Até duas novas tentativas com espera progressiva para 429/5xx.
- Uma falha deve afetar somente o lote correspondente.
- Preservar resultados parciais.
- Mostrar “tentar novamente” sem perder seleção ou revisão.
- Nunca exibir a chave em logs ou erros.
- Não confundir o modelo do Anti-Gravity com o identificador da Gemini API.
- Modelo da API deve vir da aba Credenciais e ser validado.

## 6. Knowledge Intake e persistência

O KI permanece a única fonte lógica. Não criar banco concorrente.

Criar uma camada única de acesso aos dados e persistência frontend em IndexedDB para:

- nodes;
- relations;
- source_assets;
- markdown_twins;
- ingestion_jobs;
- approval_events.

Projects, Areas, Resources, Archives e Tasks continuam sendo projeções dessas entidades. Migrar dados existentes de modo idempotente. Credenciais permanecem separadas.

## 7. Memória

Renomear **Grafos** para **Memória**.

Memória não é apenas um gráfico. É a camada que guarda, conecta e permite explorar o conhecimento do KI.

### Seções

- **Mapa:** visualização relacional inspirada no grafo global do Obsidian.
- **Nós:** lista pesquisável de tudo que compõe a memória.
- **Relações:** criação, revisão e remoção de conexões.
- **Órfãos:** itens sem conexões relevantes.

### Tipos de nós

Project, Area, Resource, Archive, Task, Markdown e Source.

### Relações

`belongs_to`, `supports`, `produces`, `depends_on`, `references`, `task_for` e `related_to`.

Cada relação possui origem, destino, tipo, peso, confiança, autor (`manual`, `ai`, `system`) e aprovação.

### Visualização

- composição circular/radial com sensação de esfera;
- force-directed graph semelhante à experiência do Obsidian;
- zoom, pan, arrastar, busca, filtros e centralização;
- clique abre painel lateral do nó;
- cores por tipo e legenda;
- tamanho pelo grau ponderado de conexões;
- normalização logarítmica para impedir nós gigantes;
- layout estável entre renderizações;
- destaque de vizinhança e redução visual dos demais nós;
- filtros para Tasks e quatro categorias PARA;
- boa experiência em desktop e fallback legível no mobile.

Grau de conexão representa conectividade, não “importância absoluta”. Não criar relações inventadas sem aprovação.

## 8. Jarvis

Conectar o chat à credencial Gemini configurada.

- Remover a alegação falsa “Llama-3 Local”.
- Mostrar o provedor/modelo realmente ativo.
- Respostas consultivas podem ser diretas.
- Criação ou alteração de dados deve produzir proposta revisável.
- Jarvis consulta o KI e pode propor Tasks e relações.
- Nunca alterar PARA, arquivos ou Memória silenciosamente.

## 9. Segurança

O projeto continua totalmente frontend.

- chave nunca entra no Git, bundle, screenshots ou relatórios;
- armazenamento local é aceito somente para protótipo pessoal;
- recomendar chave sem billing e restrita à Gemini API e ao domínio;
- avisar que uma chave persistente no navegador não é um cofre;
- somente trechos selecionados são enviados ao Gemini;
- arquivos originais permanecem locais.

## 10. Loop de verificação obrigatório

Para cada bloco:

1. Mapear requisito para teste observável.
2. Implementar a menor unidade coerente.
3. Rodar typecheck, lint, testes e build.
4. Abrir o app com Agent Browser.
5. Testar caminho feliz, erro, vazio e recarregamento.
6. Salvar screenshots e resumo em `artifacts/verification/`.
7. Comparar o resultado com este PRD.
8. Corrigir e repetir.

Máximo de quatro ciclos por bloco. Se a mesma falha ocorrer duas vezes, investigar a causa em vez de repetir cegamente. Usar saída limpa de terminal e evitar despejos enormes de MCP, logs ou arquivos.

## 11. Cenários de aceite

1. ZIP do macOS preserva estrutura e remove lixo técnico.
2. Filtros e checkboxes mantêm seleção correta.
3. PDF textual e PDF escaneado geram conteúdo útil.
4. Um lote Gemini inválido pode ser repetido sem perder os demais.
5. Nenhum erro de JSON bruto chega ao usuário.
6. Proposta pode ser editada, rejeitada ou aprovada por item.
7. Reload mantém os registros aprovados.
8. Markdown contém SHA-256 e caminhos, com corpo ≤2.200 caracteres.
9. Arquivos originais não são armazenados.
10. Memória mostra dados reais do KI, centralidade e relações.
11. Jarvis usa Gemini e pede aprovação antes de gravar.
12. Não existem erros no console.
13. Typecheck, lint, testes e build passam.
14. Agent Browser comprova o fluxo ponta a ponta com evidências.

## 12. Definição de pronto

O trabalho só termina quando todos os cenários de aceite estiverem verdes, o PRD refletir o estado final e houver relatório contendo:

- arquivos alterados;
- testes executados;
- screenshots;
- problemas encontrados e corrigidos;
- limitações reais restantes;
- commit final enviado à `main`.

Não publicar o site. O Codex fará a publicação depois da atualização da `main`.