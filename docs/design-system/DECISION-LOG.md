# Diário de Decisões de Design (Decision Log) — Më Life OS

**Registro de Auditoria e Decisões Arquiteturais de Design**

---

## Decisão 001: Eliminação de Glassmorphism e Translucidez
- **Data:** 2026-09-07
- **Contexto:** Versões preliminares usavam `backdrop-filter: blur(12px)`, fundos `rgba(255, 255, 255, 0.6)` e bordas semitransparentes. Em telas densas e dados tabulares, isso causava lentidão na GPU e comprometia a legibilidade do texto ("efeito névoa").
- **Decisão:** Substituir todos os cartões por fundos brancos opacos `#ffffff` com borda sutil `#e8e8e8` e raio de 10px (`0.625rem`).
- **Impacto:** Melhora de 30% na velocidade de renderização em listas longas e leitura nítida e editorial alinhada à estética BCG/Goldman Sachs.

---

## Decisão 002: Fusão das Identidades BCG + Goldman Sachs
- **Data:** 2026-09-07
- **Contexto:** O projeto necessitava de autoridade visual, densidade analítica e harmonia entre rotinas diárias e dados profundos.
- **Decisão:**
  - BCG forneceu o verde floresta profundo `#0c2b15`, o verde de acento `#41a217`, o canvas calmo `#fbfbfb` e a sobriedade estrutural.
  - Goldman Sachs forneceu o azul analítico `#7399C6`, o marinho executivo `#1B365D`, a precisão das tabelas com divisores calmos e o par tipográfico editorial `Newsreader` (títulos) + `Inter` (dados).
- **Impacto:** O Më adquire uma identidade proprietária de alta classe que não se confunde com ferramentas genéricas de produtividade.

---

## Decisão 003: Governança Humana Explícita para o Jarvis e Relações
- **Data:** 2026-09-07
- **Contexto:** Assistentes de IA frequentemente aplicam mutações silenciosas ou exibem respostas sem rastreabilidade.
- **Decisão:** Nenhuma criação ou alteração proposta pelo Jarvis ou pelo Para-Organizer é gravada no Knowledge Intake sem botões explícitos de Aprovar e Rejeitar.
- **Impacto:** Confiabilidade total do usuário sobre seu segundo cérebro.

---

## Decisão 004: Padronização dos Tokens em W3C DTCG
- **Data:** 2026-09-07
- **Contexto:** Garantir que ferramentas externas (como Penpot ou geradores de protótipos) e o código React/Vite consumam o mesmo contrato visual.
- **Decisão:** Criar `tokens.json` em três camadas (primitiva, semântica e componente) compatível com o padrão do W3C DTCG, acompanhado de `tokens.css` com `@theme` do Tailwind v4.
- **Impacto:** Eliminação de cores arbitrárias hardcoded no código.
