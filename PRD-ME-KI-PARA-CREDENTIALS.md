# PRD — Më: Knowledge Intake, Credenciais e Para-Organizer

**Versão:** 1.0  
**Data:** 2026-08-27  
**Status:** aprovado para implementação do primeiro incremento  
**Leitores:** Pedro e qualquer IA executora (Codex, Gemini, Claude ou equivalente)

## 1. Resumo executivo

O Më é um Life OS pessoal em que o **Knowledge Intake (KI)** funciona como fonte única lógica para Projects, Areas, Resources, Archives, Tasks, arquivos e relações. Este incremento não cria um banco paralelo: preserva a base atual, documenta suas limitações e acrescenta uma configuração local de credenciais para testes com Gemini 3.6 Flash.

O Para-Organizer deixa de aparecer duplicado dentro de Dados e passa a possuir uma única entrada na barra lateral, imediatamente abaixo de Dados. A estética existente — verde floresta, fundo nude, Inter, bordas discretas e alta densidade informacional — é mandatória.

## 2. Início rápido para qualquer IA executora

### Contexto obrigatório

- Trabalhe no repositório existente; não recrie a aplicação.
- Leia este PRD inteiro antes de editar.
- Preserve alterações do usuário e a arquitetura React/Vite atual.
- Não crie outro SQLite ou outra “fonte da verdade” sem evidência de necessidade.
- Não revele, registre em logs, envie ao KI ou faça commit de credenciais.
- Execute um bloco por vez e valide seus critérios de conclusão.
- Não exponha raciocínio privado; registre decisões verificáveis e resultados.

### Ordem de execução

1. Auditar `DadosCortex`, `DadosView`, `DadosIngestao`, `Sidebar`, `App` e `store`.
2. Confirmar que KI é hoje uma projeção unificada das coleções em memória.
3. Implementar Credenciais como configuração local e isolada do KI.
4. Remover Para-Organizer das abas internas de Dados.
5. Criar a rota única Para-Organizer na barra lateral, abaixo de Dados.
6. Rodar lint e build; corrigir somente defeitos relacionados ao incremento.

## 3. Objetivos e não objetivos

### Objetivos

- Criar a aba **Credenciais** ao lado de **Knowledge Intake**.
- Configurar `gemini-3.6-flash` para testes.
- Permitir salvar, testar e remover a chave Gemini neste dispositivo.
- Reservar campos opcionais para OpenAI e Anthropic sem ativar integrações fictícias.
- Manter KI como SSOT lógico.
- Consolidar uma única navegação para Para-Organizer.

### Não objetivos deste incremento

- Criar autenticação própria, SQL, sincronização multi-dispositivo ou cofre servidor.
- Armazenar arquivos originais no site.
- Finalizar a geração dos arquivos Markdown ou o grafo.
- Prometer monitoramento real do computador em um site hospedado.
- Enviar chamadas OpenAI ou Anthropic.

## 4. Arquitetura

### Camadas

1. **Dados atuais:** estado React com Tasks, Projects, Areas e Resources.
2. **KI:** projeção unificada e interface operacional sobre essas coleções.
3. **Para-Organizer:** entrada, proposta, revisão e futura geração de representantes Markdown.
4. **Credenciais:** configuração técnica local; nunca é conhecimento do usuário.
5. **IA:** usa credenciais para analisar conteúdo e propor alterações; não grava sem aprovação.

### Regra de fonte única

Novas tabelas ou bases só podem existir quando representam entidades que o KI não comporta corretamente, como `source_files`, `markdown_twins`, `relations`, `ingestion_proposals` e `audit_log`. Quando persistência real for adicionada, essas estruturas devem alimentar o KI, não competir com ele.

## 5. Camada de dados

### Estado atual confirmado

O projeto não possui SQLite funcional neste incremento. O KI combina arrays de `areas`, `projects`, `tasks` e `resources`. Credenciais não pertencem a esses dados.

### Credenciais locais de teste

Chave do navegador: `me_credentials_v1`.

```json
{
  "gemini": { "apiKey": "AIza...", "model": "gemini-3.6-flash" },
  "openai": { "apiKey": "" },
  "anthropic": { "apiKey": "" },
  "updatedAt": "2026-08-27T18:30:00.000Z"
}
```

Regras:

- persistência somente em `localStorage` do navegador atual;
- nunca incluir o valor em analytics, KI, logs ou mensagens de erro;
- campo sempre `password` e mascarado por padrão;
- remoção deve apagar o valor salvo;
- produção exige proxy servidor/cofre de segredos.
- no plano gratuito, não processar inicialmente documentos pessoais sensíveis, pois o conteúdo pode ser usado pelo provedor para melhoria dos produtos.

### Futuro representante Markdown

O frontmatter não conta no limite. Somente o corpo após o segundo `---` possui máximo de 2.200 caracteres. O Markdown aponta ao original; não duplica o binário.

## 6. Especificações dos componentes

### Credenciais

- Local: `Dados > Credenciais`, imediatamente após Knowledge Intake.
- Campos: Gemini API Key, modelo fixo visível, OpenAI API Key opcional e Anthropic API Key opcional.
- Ações Gemini: mostrar/ocultar, salvar, testar conexão e remover.
- Teste: uma solicitação mínima esperando resposta; tratar chave inválida, indisponibilidade e `429` sem revelar a chave.
- Mensagem de segurança: configuração local de rascunho; produção requer backend.

### Para-Organizer

- Remover a aba `ParaOrganizer Ingestão` de `DadosView`.
- Criar view global `para-organizer`.
- Adicionar item `Para-Organizer` abaixo de `Dados` na seção Sistema.
- Reutilizar `DadosIngestao`; não duplicar o componente.

### Direção visual

- Reusar cores, tipografia, raios, bordas e densidade atuais.
- Sem gradientes, efeitos neon, glassmorphism novo, ilustrações genéricas ou linguagem promocional de IA.
- IA aparece como infraestrutura, não como decoração.

## 7. Plano de construção

| Bloco | Entrega | Executor | Concluído quando |
|---|---|---|---|
| 0 | Auditoria e PRD | IA | arquitetura atual e limites registrados |
| 1 | Credenciais | IA | salvar, mascarar, testar e remover funcionam |
| 2 | Navegação | IA | só existe uma entrada Para-Organizer |
| 3 | Segurança | IA | nenhuma chave entra no bundle, KI ou Git |
| 4 | Validação | IA | TypeScript e build passam |

**Ordem de corte:** credenciais opcionais de OpenAI/Anthropic; refinamentos informativos.  
**Nunca cortar:** isolamento da chave, KI como SSOT, navegação única e validação.

## 8. Prompts e protocolos executáveis

### Classificação futura pelo Gemini

```text
Você é o classificador do Më. Analise somente o conteúdo fornecido. Produza uma proposta, nunca uma ação definitiva. Retorne JSON válido com: title, para_category, parent_id, summary, key_points, suggested_tasks, relations, confidence e reasons. Projects exigem resultado e prazo; Areas são responsabilidades contínuas; Resources são referências/interesses; Archives são itens inativos. O corpo Markdown final deve ter no máximo 2.200 caracteres; frontmatter não entra no limite. Nunca invente caminho, hash, data ou relação. Marque dados ausentes como null. Aguarde aprovação humana antes de qualquer gravação ou movimentação.
```

### Protocolo de implementação universal

```text
Leia o PRD inteiro. Inspecione a implementação existente antes de editar. Preserve o design e a arquitetura. Faça mudanças mínimas, rastreáveis e reversíveis. Não crie dados fictícios para simular integrações reais. Não exponha credenciais. Após cada bloco, execute os testes disponíveis e relate: arquivos alterados, comportamento entregue, evidência de validação e limitações restantes.
```

## 9. Registro de decisões

| Decisão | Razão e trade-off |
|---|---|
| KI permanece SSOT lógico | Evita banco concorrente; persistência real continua pendente |
| Sem SQLite neste incremento | O projeto atual ainda opera em memória |
| Credenciais fora do KI | Segredo técnico não é conhecimento pessoal |
| `gemini-3.6-flash` fixo | Modelo solicitado e identificador oficial |
| Limites não codificados | Cotas variam por conta e podem mudar |
| `localStorage` apenas para rascunho | Permite testar; não serve como cofre de produção |
| Uma única view Para-Organizer | Remove navegação ambígua sem duplicar código |
| Estética atual preservada | Evita aparência genérica de produto de IA |
| Frontmatter fora dos 2.200 caracteres | Mantém metadados ricos sem empobrecer o resumo |

## 10. Fora do escopo e evolução

Próximos incrementos: persistência real do KI; cofre servidor; proxy Gemini; entidades para arquivos originais e representantes Markdown; cálculo de hash; caminhos Mac/Windows; fila de aprovação; auditoria; geração dos `.md`; relações Tasks–PARA; grafo force-directed estilo Obsidian.

Uma reestruturação será necessária apenas quando houver persistência multiusuário, acesso fora do dispositivo, execução autônoma sobre arquivos locais ou credenciais de produção. Até lá, novas funções devem se integrar ao KI e às views existentes.
