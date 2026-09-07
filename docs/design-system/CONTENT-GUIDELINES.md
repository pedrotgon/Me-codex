# Diretrizes de Conteúdo e Redação (Content Guidelines) — Më Life OS

Diretrizes para redação de interfaces, microcópia, mensagens de sistema e terminologia no Më Life OS.

---

## 1. Voz e Tom

- **Sóbrio e Didático**: Comunique-se como um consultor sênior de estratégia e um tutor pedagógico calmo. Evite gírias, piadas forçadas ou tom excessivamente robótico.
- **Transparente e Confiável**: Seja rigorosamente honesto sobre o que está acontecendo (ex: "Processando 12 arquivos localmente...", "Calculando SHA-256...", "Aguardando sua aprovação").
- **Conciso e Preciso**: Telas densas exigem microcópia econômica. Cada palavra deve carregar valor funcional.

---

## 2. Terminologia Padronizada do Më Life OS

| Termo | Descrição e Regra de Uso |
| :--- | :--- |
| **Knowledge Intake (KI)** | A fonte lógica única de verdade (SSOT) no IndexedDB. Nunca chamar de "banco de dados secundário" ou "cache". |
| **Projetos (Projects)** | Iniciativas com objetivo definido, prazo e fim determinado. |
| **Áreas (Areas)** | Esferas perenes de responsabilidade (ex: Saúde, Finanças). Não possuem data de término. |
| **Recursos (Resources)** | Tópicos de interesse permanente e materiais de referência. |
| **Arquivados (Archives)** | Itens inativos guardados para histórico e consulta futura. |
| **Memória** | A camada relacional viva (antigo Grafos) inspirada no Obsidian que conecta nós, arestas e órfãos. |
| **Para-Organizer** | A skill e pipeline de ingestão inteligente de arquivos e ZIPs locais. |
| **Jarvis** | O assistente inteligente contextual que opera com propostas revisáveis pelo usuário. |
| **Markdown Twin** | O arquivo `.md` representativo gerado com frontmatter completo e corpo limitado a 2.200 caracteres. |

---

## 3. Padrões de Mensagens do Sistema

### 3.1 Mensagens de Sucesso
- Formato: Curto e afirmativo.
- Exemplos:
  - "Lote de 8 arquivos aprovado e integrado ao Knowledge Intake."
  - "Tarefa marcada como concluída."
  - "Chave de API salva localmente com sucesso."

### 3.2 Mensagens de Erro
- Formato: Causa clara + Próximo passo de resolução.
- Exemplos:
  - "O arquivo selecionado ultrapassa o limite máximo de 100 MB. Por favor, divida o arquivo ou selecione outro item."
  - "Não foi possível conectar à Gemini API. Verifique sua chave na aba Credenciais."

### 3.3 Mensagens de Confirmação
- Formato: Pergunta direta + Ação irreversível explícita no botão.
- Exemplo:
  - "Deseja excluir permanentemente este registro? Esta ação não pode ser desfeita."
  - Botão: `[Excluir Permanentemente]` (vermelho).
