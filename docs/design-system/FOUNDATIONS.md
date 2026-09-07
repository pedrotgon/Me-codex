# Fundações do Design System — Më Life OS

**Referência Técnica:** W3C DTCG Tokens & Tailwind v4 Theme  
**Alinhamento Estratégico:** BCG (Boston Consulting Group) + Goldman Sachs  

---

## 1. Identidade e Filosofia

O Më Life OS foi desenhado para ser o **segundo cérebro pessoal de alta fidelidade**. Ele não é um "to-do app" comum nem um painel decorativo: é um instrumento de trabalho, reflexão e síntese de conhecimento que opera 100% no cliente (local-first).

Por essa razão, sua identidade visual combina:
- **Seriedade e Clareza**: Não existem efeitos que distraiam a atenção. A informação é a protagonista.
- **Autoridade Editorial**: O uso de `Newsreader` para títulos evoca a leitura atenta de relatórios do BCG e análises de mercado do Goldman Sachs.
- **Eficiência Cognitiva**: O olho humano escaneia blocos bem delimitados com alto contraste entre o fundo off-white (`#fbfbfb`), o cartão branco puro (`#ffffff`) e o texto editorial nítido (`#070707`).

---

## 2. Cores e Razão de Contraste (WCAG AA / AAA)

Todas as combinações do sistema foram calibradas para cumprir no mínimo a especificação **WCAG 2.1 nível AA** (4.5:1 para texto normal, 3:1 para texto grande/componentes), atingindo **AAA** (7:1) nas leituras principais:

| Combinação | Cores Hex | Razão de Contraste | Nível WCAG | Uso no Më |
| :--- | :--- | :--- | :--- | :--- |
| **Texto Primário no Canvas** | `#070707` sobre `#fbfbfb` | **19.8 : 1** | **AAA** | Leitura de tarefas, títulos e notas |
| **Texto Secundário no Canvas** | `#696969` sobre `#ffffff` | **5.4 : 1** | **AA** | Metadados, descrições, subtítulos |
| **Botão Primário Forest** | `#ffffff` sobre `#0c2b15` | **15.2 : 1** | **AAA** | Botão primário e barra lateral |
| **Acento de Sucesso BCG** | `#ffffff` sobre `#41a217` | **3.8 : 1** (Texto grande) / `#297716` (Normal) | **AA** | Aprovações, badges de status concluído |
| **Azul Goldman Sachs** | `#1b365d` sobre `#dce8f4` | **9.6 : 1** | **AAA** | Tags de IA, relações e nós de memória |
| **Erro e Rejeição** | `#dc2626` sobre `#ffffff` | **4.6 : 1** | **AA** | Botões de rejeitar e alertas de erro |

---

## 3. Escala Espacial e Grid

O sistema utiliza um grid modular baseado em passos de 4px:

```
4px   -> Espaçamento micro (entre ícone e texto compacto)
8px   -> Espaçamento padrão de controles (gap entre chips)
12px  -> Padding interno de itens de lista compactos
16px  -> Padding de botões e espaçamento de formulário
20px  -> Padding interno de cards padrão
24px  -> Gaps entre seções e cartões do dashboard
32px  -> Espaçamento macro entre blocos do layout
```

### Breakpoints
- `sm`: 640px
- `md`: 768px (transição mobile -> tablet)
- `lg`: 1024px (transição tablet -> desktop com sidebar fixa)
- `xl`: 1280px
- `2xl`: 1440px (canvas desktop canônico do Më)

---

## 4. Movimento e Micro-interações

- **Duração**: Micro-interações entre 150ms e 200ms.
- **Timing Function**: `cubic-bezier(0.16, 1, 0.3, 1)` (suave desaceleração natural).
- **Redução de Movimento**: `@media (prefers-reduced-motion: reduce)` desativa transições não essenciais.
- **Objetivo**: Feedback imediato de clique, alternância de tabs e abertura de modais sem sensação de atraso ("snappy UI").
