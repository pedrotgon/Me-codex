export const PARA_SKILL_PT = `---
name: para-organizer
version: "2.0"
description: "Implementa o método PARA (Projetos, Áreas, Recursos e Arquivados) no sistema de arquivos local. Analisa arquivos reais, apresenta um plano completo para aprovação e somente depois executa as alterações autorizadas."
---

# Para-Organizer — Organização do sistema de arquivos (v2)

## REGRA DE OURO: PRIMEIRO PLANEJAR, DEPOIS AGIR

Esta skill trabalha com arquivos reais no computador do usuário. Confiança e reversibilidade são requisitos centrais.

**Não crie, mova, renomeie ou exclua qualquer arquivo ou pasta antes de apresentar um plano completo por escrito e receber aprovação explícita do usuário.**

No início, explique: “Primeiro examinarei seus arquivos e entenderei seus projetos e responsabilidades. Depois apresentarei tudo o que pretendo criar ou mover. Nada será alterado até você aprovar o plano.”

O Para-Organizer aplica o método PARA ao sistema de arquivos local. Ele pode começar por uma estrutura existente, organizar somente itens soltos ou propor um recomeço seguro. Também produz um inventário Markdown e orientações para Windows, macOS e Linux.

Antes de classificar, leia \`references/para-framework.md\`. Esse documento contém as definições e regras oficiais usadas pela skill.

## Orientação rápida

O PARA ordena informações por **acionabilidade**, daquilo que exige ação agora ao que está inativo:

- **Projetos** — esforços de curto prazo com resultado e prazo. São finitos e podem ser concluídos.
- **Áreas** — responsabilidades contínuas com um padrão a manter, sem data de término.
- **Recursos** — temas de interesse, aprendizagem ou referência, sem responsabilidade contínua.
- **Arquivados** — itens inativos vindos das outras categorias: projetos concluídos, áreas encerradas e interesses abandonados.

Os itens podem mudar de categoria conforme a vida muda. Isso é parte normal do sistema.

## Visão geral do fluxo

1. **Descobrir** — examinar a pasta e compreender projetos, áreas e interesses. Somente leitura.
2. **Apresentar o plano** — mostrar cada pasta a criar, cada item a mover e cada classificação proposta.
3. **Executar** — somente após aprovação explícita, aplicar exatamente o plano autorizado.
4. **Gerar inventário** — salvar a classificação final e orientações de manutenção.

## Fase 1 — Descobrir (SOMENTE LEITURA)

### Etapa 1 — Definir expectativas

Antes da análise, informe claramente que nenhuma alteração ocorrerá sem aprovação.

### Etapa 2 — Compreender o ponto de partida

Pergunte qual pasta deve ser organizada. Exemplos comuns são Documentos, Downloads ou uma raiz escolhida pelo usuário.

**Verifique se existe um Prompt Mestre.** Ele pode descrever projetos atuais, responsabilidades, metas e interesses. Use essas informações para reduzir perguntas, mas confirme o que pode ter mudado.

Perguntas essenciais, somente quando ainda necessárias:

1. Quais projetos ativos possuem resultado concreto e prazo aproximado?
2. Quais responsabilidades precisam ser mantidas continuamente?
3. Existem iniciativas com prazo escondidas dentro dessas áreas que deveriam virar projetos?
4. Quais assuntos são mantidos apenas por interesse, estudo ou referência?

### Etapa 3 — Examinar a pasta e detectar um PARA existente

Liste itens do nível superior, registrando nome, tipo e data de modificação. Ignore arquivos ocultos e pastas do sistema. Não faça uma varredura profunda sem necessidade.

Procure estruturas existentes, como:

- \`1 Projetos\`, \`2 Áreas\`, \`3 Recursos\`, \`4 Arquivados\`;
- nomes sem numeração;
- implementações parciais;
- variações como Projetos Ativos, Responsabilidades, Referências, Inativos e Concluídos;
- categorias auxiliares, como Entrada, Modelos e Algum Dia.

Se já existir uma estrutura, apresente três modalidades:

1. **Auditar e atualizar** — preservar a estrutura, revisar itens antigos ou classificados incorretamente e incorporar arquivos soltos.
2. **Organizar itens soltos** — manter tudo o que já está organizado e classificar somente o que está fora do PARA.
3. **Recomeçar** — arquivar o estado atual em uma pasta datada e reconstruir a estrutura.

Nunca escolha automaticamente a modalidade Recomeçar.

### Etapa 4 — Classificar e resolver ambiguidades

Use o contexto fornecido pelo usuário e as regras de \`references/para-framework.md\`.

**Analise o conteúdo, não apenas o nome.** Leia cabeçalhos, primeiras páginas e nomes internos quando um item estiver ambíguo. Não processe mais conteúdo que o necessário para uma classificação confiável.

Casos evidentes podem ser classificados diretamente no plano. Casos ambíguos devem ser apresentados em pequenos grupos de três a cinco itens, sempre com:

- recomendação principal;
- justificativa curta;
- alternativas plausíveis;
- opção para o usuário corrigir.

**Capturas de tela e imagens:** não arquive automaticamente. Primeiro identifique se representam documentação, evidência, referência ou material de algum projeto.

**Arquivos ilegíveis:** não adivinhe. Informe o nome e o tipo, explique a limitação e peça ao usuário que escolha entre categorias plausíveis.

**Nada solto na raiz das categorias:** cada arquivo deve ficar dentro de um projeto, área, recurso ou grupo arquivado nomeado. Não deixe arquivos diretamente em \`1 Projetos/\`, \`2 Áreas/\`, \`3 Recursos/\` ou \`4 Arquivados/\`.

Ao final desta fase, cada item do plano deve possuir destino definido. Nada foi movido ainda.

## Fase 2 — Apresentar o plano (FASE CRÍTICA)

Apresente uma proposta completa, legível e sem perguntas pendentes.

### O plano deve conter

1. **Modalidade escolhida** — auditoria, organização de itens soltos ou recomeço.
2. **Estrutura a criar** — todas as pastas, sem omissões.
3. **Projetos** — nome curto, resultado esperado e prazo separados.
4. **Áreas e recursos** — somente pastas que já terão algum conteúdo.
5. **Movimentações** — origem e destino de cada arquivo ou pasta.
6. **Itens preservados** — tudo o que permanecerá onde está.
7. **Riscos ou conflitos** — nomes duplicados, permissões e formatos ilegíveis.

Exemplo:

\`\`\`
PLANO PROPOSTO

Modalidade: organizar itens soltos

Pastas a criar:
  1 Projetos/🚀 Novo Site/
  2 Áreas/Saúde/
  3 Recursos/produtividade/

Movimentações:
  Downloads/brief-site.pdf → 1 Projetos/🚀 Novo Site/
  Documentos/exames.pdf → 2 Áreas/Saúde/

Nenhum arquivo será excluído ou renomeado.
\`\`\`

Finalize perguntando: **“O plano está correto? Você pode alterar qualquer classificação ou pedir que algum item permaneça onde está. Não moverei nada até você autorizar.”**

Se houver correções, atualize o plano e apresente novamente as partes alteradas.

## Fase 3 — Executar (SOMENTE APÓS APROVAÇÃO)

Execute exclusivamente o plano aprovado:

1. valide novamente os caminhos de origem e destino;
2. crie apenas as pastas autorizadas e que receberão conteúdo;
3. mova itens em lotes pequenos e verificáveis;
4. não sobrescreva arquivos com o mesmo nome;
5. não renomeie ou exclua sem autorização específica;
6. pare diante de erro de permissão, conflito ou mudança inesperada;
7. registre cada operação realizada.

Após a execução, apresente:

- contagem por categoria;
- pastas criadas;
- itens movidos;
- decisões não óbvias para revisão;
- itens que falharam e o motivo;
- caminho do arquivo de segurança, quando a modalidade Recomeçar for usada.

## Fase 4 — Gerar inventário

Crie \`PARA-Inventory.md\` na raiz escolhida:

\`\`\`markdown
# Meu inventário PARA

## 1 Projetos
- Nome — Resultado: definição de concluído — Prazo: data

## 2 Áreas
- Nome — Padrão que precisa ser mantido

## 3 Recursos
- Nome — Tema ou utilidade

## 4 Arquivados
- Arquivo AAAA-MM-DD — descrição e quantidade de itens

## Observações
- Itens podem mudar de categoria conforme sua acionabilidade.
\`\`\`

## Princípios de manutenção

- **Organize por resultados:** pergunte o que ajuda a avançar agora.
- **Organize no momento necessário:** evite classificar “por precaução”.
- **Mantenha simples:** precisão é essencial nos projetos; o restante pode ser flexível.
- Revise periodicamente nomes, projetos concluídos e responsabilidades alteradas.
- Use a mesma estrutura entre plataformas, mas crie pastas somente quando houver conteúdo.

## Tom e comportamento

- Use linguagem clara, acolhedora e sem jargão desnecessário.
- Confiança é prioridade: plano primeiro, aprovação depois.
- Em caso de empate, prefira a categoria mais acionável, mas deixe a decisão visível.
- Não existe um único destino universalmente correto; importa a relação atual do usuário com a informação.
- Não crie hierarquias profundas ou pastas vazias.
- Não duplique arquivos para associá-los; prefira mover, vincular ou etiquetar.
- Uma organização 80% útil e revisável é melhor que uma classificação perfeita que nunca termina.
`;

export const CROSS_PLATFORM_PT = `# Guia multiplataforma do Para-Organizer

## 1. Windows

- Raiz sugerida: \`C:\\Users\\<Usuário>\\Documents\\PARA\`.
- Normalize barras de caminho antes de comparar endereços.
- Preserve letras de unidade e caminhos UNC.
- Para abrir um original, use o Explorador de Arquivos por meio da ponte local do Më.
- Links simbólicos e junções só podem ser criados mediante pedido explícito.

## 2. macOS

- Raiz sugerida: \`~/Documents/PARA\` ou \`~/PARA\`.
- Não mova \`.DS_Store\`, \`.git\`, Library ou arquivos de configuração do sistema.
- Para abrir um original, use o Finder por meio da ponte local do Më.
- Respeite volumes externos e permissões de privacidade do macOS.

## 3. Linux

- Raiz sugerida: \`~/Documents/PARA\` ou \`~/PARA\`.
- Preserve permissões, proprietários e links simbólicos.
- Não manipule diretórios de sistema ou itens ocultos sem autorização.

## 4. Nuvem e sincronização

- Google Drive, Dropbox, iCloud e OneDrive são fontes ou pastas sincronizadas, não uma segunda fonte da verdade.
- Evite renomeações em massa instantâneas, pois podem gerar conflitos.
- Mova diretórios sequencialmente e confirme a sincronização entre lotes.
- Nunca mantenha duas cópias independentes do mesmo arquivo apenas para classificá-lo em dois lugares.

## 5. Caminhos no representante Markdown

O representante pode registrar mais de um caminho:

\`\`\`yaml
path_mac: /Users/pedro/Documents/TCC/relatorio.pdf
path_windows: C:\\Users\\Pedro\\Documents\\TCC\\relatorio.pdf
\`\`\`

O caminho é um endereço operacional; o hash é a identidade do conteúdo. Se o arquivo for movido, o Më deve atualizar o caminho sem criar outro registro.
`;

export const PARA_FRAMEWORK_PT = `# Guia do framework PARA

## Acionabilidade em vez de assunto

O PARA estrutura informações pela proximidade com a ação, não apenas pelo tema:

- **Projetos:** maior acionabilidade; exigem atenção atual.
- **Áreas:** responsabilidades contínuas com padrão de manutenção.
- **Recursos:** conhecimentos úteis para consulta, aprendizagem ou compartilhamento.
- **Arquivados:** itens inativos preservados para referência futura.

## Árvore de decisão

1. Possui resultado específico e prazo? → **Projeto**.
2. É uma responsabilidade contínua cuja negligência causa consequências? → **Área**.
3. É um tema útil ou interessante sem responsabilidade contínua? → **Recurso**.
4. Está concluído, cancelado ou inativo? → **Arquivo**.
5. Ainda não há contexto suficiente? → **Entrada**, aguardando decisão.

Em caso de empate, proponha a categoria mais acionável e explique o motivo.

## Projetos versus Áreas

Um projeto pode ser concluído; uma área precisa ser mantida.

- “Concluir o TCC até dezembro” é Projeto.
- “Universidade” é Área.
- “Entregar a declaração de imposto” é Projeto.
- “Finanças” é Área.

Iniciativas com prazo não devem ficar escondidas dentro de áreas. Elas ganham visibilidade própria como projetos, mantendo uma relação com a área correspondente.

## Áreas versus Recursos

Pergunte: algo sofre ou deixa de funcionar se isso for negligenciado?

- Sim → Área.
- Não; é apenas útil ou interessante → Recurso.

O mesmo tema pode mudar conforme a pessoa. Design é Área para um designer e pode ser Recurso para alguém que apenas estuda o assunto.

## Arquivados

Arquivados não são lixeira. Eles preservam:

- projetos concluídos ou cancelados;
- responsabilidades que deixaram de existir;
- recursos que perderam relevância atual.

Itens arquivados podem voltar a Projetos, Áreas ou Recursos quando recuperarem acionabilidade.

## Fluxos naturais

- Projeto → Arquivo após conclusão.
- Área → Projeto quando surge uma iniciativa com prazo.
- Recurso → Área quando um interesse vira responsabilidade.
- Arquivo → Projeto quando um conhecimento antigo volta a ser usado.

## Associação sem duplicação

Para relacionar informações, prefira:

1. mover um item para o destino mais acionável;
2. vincular entidades;
3. aplicar uma etiqueta comum;
4. registrar relações no Knowledge Intake.

Não crie cópias independentes do arquivo original. O Më utiliza um representante Markdown leve que aponta para o original.

## Manutenção semanal

1. **Renomear:** os títulos ainda representam o conteúdo?
2. **Reclassificar:** a acionabilidade aumentou ou diminuiu?
3. **Arquivar:** quais projetos terminaram?
4. **Promover:** surgiu algum projeto dentro de uma área?
5. **Limpar a entrada:** quais itens ainda aguardam decisão?

O método deve permanecer leve, informal e adaptável.
`;
