import { Task, Project, Area, Resource, Habit } from '../../store';
import { KiNode, KiRelation } from '../../lib/db';

export const DEMO_TASKS: Task[] = [
  {
    id: 'demo-tk-1',
    title: 'Avaliar criação de skill e POP para operar o Notion',
    status: 'in-progress',
    area: 'Unicamp',
    project: 'LE704 - Laboratório de Engenharia',
    executionDate: 'hoje',
    deadline: '10-Set-26',
    priority: 'P 1',
    naipe: '♦',
    battleTokens: '30',
  },
  {
    id: 'demo-tk-2',
    title: 'Revisar balanço trimestral e controle financeiro',
    status: 'not-started',
    area: 'Finanças',
    executionDate: 'amanhã',
    deadline: '15-Set-26',
    priority: 'P 2',
    naipe: '♠',
    battleTokens: '20',
  },
  {
    id: 'demo-tk-3',
    title: 'Testar janela entreaberta para luz natural ao acordar',
    status: 'done',
    area: 'Saúde',
    executionDate: 'ontem',
    deadline: '-',
    priority: 'P 3',
    battleTokens: '15',
  },
  {
    id: 'demo-tk-4',
    title: 'Auditar contrastes WCAG AA na paleta BCG + Goldman Sachs',
    status: 'in-progress',
    area: 'Inbox',
    executionDate: 'hoje',
    deadline: '12-Set-26',
    priority: 'P 1',
    battleTokens: '50',
  },
  {
    id: 'demo-tk-5',
    title: 'Exportar Markdown Twins para pasta local segura',
    status: 'arquivadas',
    area: 'Estudos',
    executionDate: '-',
    deadline: '-',
    priority: 'P 4',
    battleTokens: '10',
  },
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-pr-1',
    title: 'LE704 - Laboratório de Engenharia',
    desc: 'Pesquisa acadêmica experimental e ensaios de processos',
    progress: 62,
    area: 'Unicamp',
    icon: '🧪',
    due: '20-Out-26',
    status: 'active',
  },
  {
    id: 'demo-pr-2',
    title: 'Engenharia Econômica',
    desc: 'Modelagem financeira, TIR, VPL e análise de cenários',
    progress: 56,
    area: 'Unicamp',
    icon: '📈',
    due: '30-Set-26',
    status: 'active',
  },
  {
    id: 'demo-pr-3',
    title: 'Segundo Cérebro Local',
    desc: 'Arquitetura Knowledge Intake e grafo Obsidian',
    progress: 88,
    area: 'Estudos',
    icon: '🧠',
    due: '15-Out-26',
    status: 'active',
  },
  {
    id: 'demo-pr-4',
    title: 'Rotina de Treinos & Saúde',
    desc: 'Acompanhamento preventivo e protocolos de sono',
    progress: 100,
    area: 'Saúde',
    icon: '🏃',
    due: 'Concluído',
    status: 'completed',
  },
];

export const DEMO_AREAS: Area[] = [
  { id: 'demo-ar-1', name: 'Unicamp', icon: '🏛️', count: 4 },
  { id: 'demo-ar-2', name: 'Saúde', icon: '🩺', count: 3 },
  { id: 'demo-ar-3', name: 'Finanças', icon: '💳', count: 2 },
  { id: 'demo-ar-4', name: 'Estudos', icon: '📚', count: 5 },
];

export const DEMO_RESOURCES: Resource[] = [
  {
    id: 'demo-rc-1',
    title: 'Guia de Termodinâmica Aplicada e Balanços de Massa',
    link: 'https://unicamp.br/biblioteca/eng-quimica',
    area: 'Unicamp',
    project: 'LE704 - Laboratório de Engenharia',
  },
  {
    id: 'demo-rc-2',
    title: 'Planilha de Avaliação de Empresas por Fluxo de Caixa Descontado (DCF)',
    link: '#',
    area: 'Finanças',
    project: 'Engenharia Econômica',
  },
  {
    id: 'demo-rc-3',
    title: 'Paper: Gestão Pessoal Baseada no Método PARA de Tiago Forte',
    link: 'https://fortelabs.com/blog/para',
    area: 'Estudos',
  },
];

export const DEMO_HABITS: Habit[] = [
  { id: 'demo-hb-1', name: 'Leitura Focada (30m)', icon: '📖', streak: 14, days: [1, 1, 1, 1, 1, 1, 1] },
  { id: 'demo-hb-2', name: 'Atividade Física', icon: '🏋️', streak: 6, days: [1, 1, 0, 1, 1, 1, 0] },
  { id: 'demo-hb-3', name: 'Registro no Diário', icon: '✍️', streak: 21, days: [1, 1, 1, 1, 1, 1, 1] },
  { id: 'demo-hb-4', name: 'Revisão Noturna do Radar', icon: '🎯', streak: 8, days: [1, 1, 1, 1, 1, 1, 0] },
];

export const DEMO_NODES: KiNode[] = [
  { id: 'node-pr-1', type: 'project', title: 'LE704 - Lab de Engenharia', metadata: { category: 'Engenharia' }, archived: false, createdAt: '2026-08-20T10:00:00Z', updatedAt: '2026-09-07T00:00:00Z' },
  { id: 'node-ar-1', type: 'area', title: 'Unicamp', metadata: { domain: 'Educação' }, archived: false, createdAt: '2026-08-15T08:00:00Z', updatedAt: '2026-09-07T00:00:00Z' },
  { id: 'node-tk-1', type: 'task', title: 'Avaliar skill Notion', metadata: { priority: 'P1' }, archived: false, createdAt: '2026-09-01T14:00:00Z', updatedAt: '2026-09-07T00:00:00Z' },
  { id: 'node-rc-1', type: 'resource', title: 'Guia de Termodinâmica', metadata: { tag: 'Física' }, archived: false, createdAt: '2026-08-25T11:00:00Z', updatedAt: '2026-09-07T00:00:00Z' },
  { id: 'node-md-1', type: 'markdown', title: 'estrategia_q4.md', metadata: { sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' }, archived: false, createdAt: '2026-09-05T09:00:00Z', updatedAt: '2026-09-07T00:00:00Z' },
];

export const DEMO_RELATIONS: KiRelation[] = [
  { id: 'rel-1', sourceId: 'node-pr-1', targetId: 'node-ar-1', type: 'belongs_to', weight: 1, confidence: 100, author: 'manual', approved: true, createdAt: '2026-08-20T10:05:00Z' },
  { id: 'rel-2', sourceId: 'node-tk-1', targetId: 'node-pr-1', type: 'task_for', weight: 1, confidence: 95, author: 'manual', approved: true, createdAt: '2026-09-01T14:10:00Z' },
  { id: 'rel-3', sourceId: 'node-md-1', targetId: 'node-pr-1', type: 'references', weight: 1, confidence: 90, author: 'ai', approved: true, createdAt: '2026-09-05T09:15:00Z' },
  { id: 'rel-4', sourceId: 'node-rc-1', targetId: 'node-ar-1', type: 'belongs_to', weight: 1, confidence: 100, author: 'manual', approved: true, createdAt: '2026-08-25T11:05:00Z' },
];
