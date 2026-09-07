# Padrões de Interação e Experiência (UX Patterns) — Më Life OS

Este documento formaliza os padrões de fluxo, interação e governança operacional adotados no Më Life OS.

---

## 1. Padrão de Governança e Decisão Humana

### 1.1 Propostas do Jarvis e Para-Organizer
Nenhum dado é gravado silenciosamente no Knowledge Intake. Toda operação sugerida por inteligência artificial segue o ciclo:
```
Entrada / Comando
   ↓
Extração & Análise Local
   ↓
Geração de Proposta Estruturada (ApprovalCard)
   ↓
Revisão Humana: [Rejeitar] ou [Aprovar]
   ↓
Gravação no KI (IndexedDB) + Geração de Markdown Twin
```

### 1.2 Ações Destrutivas
- Toda exclusão definitiva (ex: remoção permanente de item dos Arquivados ou exclusão de nó no Córtex) exige confirmação em modal dedicado com aviso de irreversibilidade.
- Operações de arquivamento padrão são reversíveis através da visualização de Arquivados.

---

## 2. Padrões de Estado (Multi-State Handling)

Para cada visão ou componente de dados, devem existir os seguintes estados observáveis:
1. **Padrão (Default)**: Visualização com dados populados, alinhamento e paginação/scroll estáveis.
2. **Vazio (Empty)**: Apresenta mensagem amigável, ícone contextual e botão direto de criação ("Começar agora").
3. **Carregando (Loading)**: Exibe spinner ou esqueletos de linha sutis sem deslocamento de layout ("zero layout shift").
4. **Sucesso (Success)**: Feedback tátil ou toast discreto confirmando a persistência do item.
5. **Erro (Error)**: Mensagem contextual clara com botão de retry sem perda do estado de digitação ou seleção prévia.
6. **Validação (Validation)**: Destaque de campos obrigatórios não preenchidos antes da submissão.
7. **Sem Credencial (No Credentials)**: Quando um recurso depende da Gemini API e não há chave configurada, a UI exibe um banner orientando o usuário a acessar a aba Credenciais, mantendo recursos locais funcionando.

---

## 3. Padrões de Densidade Tabular e Gráfica

- **Tabelas do Goldman Sachs**:
  - Altura de linha padronizada em 36px a 40px para permitir visualização de alta densidade sem cansaço visual.
  - Alinhamento de números e datas à direita; textos e títulos alinhados à esquerda.
  - Hover de linha suave (`#f4f4f4`) com destaque sutil da célula ativa.
- **Gráficos e Métricas**:
  - Paleta restrita: `#0c2b15` (principal), `#41a217` (sucesso), `#7399c6` (foco), `#1b365d` (comparativo).
  - Sempre acompanhados de legenda e tooltip com valor absoluto e percentual.

---

## 4. Padrões de Navegação e Responsividade

- **Desktop (1440x1024)**:
  - Sidebar permanente de 280px à esquerda.
  - Conteúdo centralizado com largura máxima de 1400px.
  - Jarvis acessível como drawer expansível à direita de 420px.
- **Mobile (390x844)**:
  - Header fixo com botão sanduíche que abre a Sidebar como gaveta lateral deslizante.
  - Ações primárias ancoradas em áreas de alcance do polegar.
  - Tabelas adaptam-se para cartões expansíveis em pilha vertical.
