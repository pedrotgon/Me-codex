import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { 
  KiNode, 
  KiRelation, 
  NodeType, 
  RelationType, 
  getAllFromStore, 
  putInStore, 
  putBatchInStore, 
  deleteFromStore, 
  deleteBatchFromStore 
} from './lib/db';
import { ParaProposalItem } from './lib/gemini';

export interface Task {
  id: string;
  title: string;
  status: 'not-started' | 'in-progress' | 'done' | 'arquivadas';
  area: string;
  project?: string;
  executionDate: string;
  deadline: string;
  priority: string;
  naipe?: string;
  day?: string;
  link?: string;
  battleTokens?: string;
  subAreas?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  days: number[];
}

export interface Project {
  id: string;
  title: string;
  desc: string;
  progress: number;
  area: string;
  icon?: string;
  due?: string;
  status: 'active' | 'completed' | 'on-hold';
  executionDate?: string;
  deadline?: string;
}

export interface Area {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Resource {
  id: string;
  title: string;
  link?: string;
  area?: string | string[];
  project?: string | string[];
  task?: string | string[];
}

export type View = 'home' | 'quick-capture' | 'tasks' | 'take-action' | 'projects' | 'areas' | 'recursos' | 'arquivados' | 'inbox' | 'habitos' | 'weeks' | 'dados' | 'diagrama' | 'memoria' | 'journal' | 'analytics-completo' | 'para-organizer';

interface StoreState {
  currentView: View;
  setCurrentView: (view: View) => void;
  tasks: Task[];
  habits: Habit[];
  projects: Project[];
  areas: Area[];
  resources: Resource[];
  nodes: KiNode[];
  relations: KiRelation[];
  isDbLoaded: boolean;
  addBatchItems?: (items: {
    tasks?: Partial<Task>[];
    projects?: Partial<Project>[];
    areas?: Partial<Area>[];
    resources?: Partial<Resource>[];
  }) => void;
  addKiIngestionBatch?: (proposals: ParaProposalItem[], sourceRootPath: string) => Promise<void>;
  createRelation: (sourceId: string, targetId: string, type: RelationType, author?: 'manual' | 'ai' | 'system') => Promise<void>;
  approveRelation: (relationId: string) => Promise<void>;
  deleteRelation: (relationId: string) => Promise<void>;
  addTask: (title: string, area?: string, project?: string, additionalProps?: Partial<Task>) => void;
  addProject: (title: string, desc?: string, area?: string) => void;
  addArea: (name: string, icon?: string) => void;
  addResource: (title: string, area?: string, project?: string, task?: string) => void;
  editArea: (id: string, field: keyof Area, value: any) => void;
  editResource: (id: string, field: keyof Resource, value: any) => void;
  editTask: (id: string, field: keyof Task, value: any) => void;
  editProject: (id: string, field: keyof Project, value: any) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleHabit: (id: string, dayIndex: number) => void;
  jarvisMessage: string | null;
  setJarvisMessage: (msg: string | null) => void;
  isJarvisOpen: boolean;
  setJarvisOpen: (open: boolean) => void;
  processJarvisCommand: (command: string) => void;
  archivedNodeIds: string[];
  toggleArchiveNode: (id: string) => void;
  deleteNodes: (ids: string[]) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedAreaId: string | null;
  setSelectedAreaId: (id: string | null) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: "tk-csv-0",
    title: "Avaliar criação de skill/POP para operar o Notion",
    status: "done",
    area: "Inbox",
    executionDate: "8-May-26",
    deadline: "-",
    priority: "P 3",
    day: "Friday",
    battleTokens: "15"
  },
  {
    id: "tk-csv-1",
    title: "Manter inventário e POP dos templates do Më",
    status: "not-started",
    area: "Unicamp",
    executionDate: "-",
    deadline: "-",
    priority: "P 2",
    battleTokens: "0"
  },
  {
    id: "tk-csv-2",
    title: "Adicionar link do reels sobre Claude Code analisando perfil",
    status: "not-started",
    area: "Inbox",
    executionDate: "-",
    deadline: "-",
    priority: "P 4",
    battleTokens: "0"
  },
  {
    id: "tk-csv-3",
    title: "Fazer exame de sangue e plaquetas antes da validade da guia",
    status: "arquivadas",
    area: "Inbox",
    executionDate: "9-May-26",
    deadline: "-",
    priority: "P 1",
    battleTokens: "50"
  },
  {
    id: "tk-csv-4",
    title: "Testar janela entreaberta para luz natural ao acordar",
    status: "in-progress",
    area: "Inbox",
    executionDate: "13-May-26",
    deadline: "-",
    priority: "P 2",
    battleTokens: "0"
  },
  {
    id: "tk-csv-5",
    title: "Criar controle financeiro mínimo de gastos",
    status: "not-started",
    area: "Inbox",
    executionDate: "-",
    deadline: "-",
    priority: "P 3",
    battleTokens: "0"
  },
  {
    id: "tk-csv-6",
    title: "Fazer eletrocardiograma antes da validade da guia",
    status: "arquivadas",
    area: "Inbox",
    executionDate: "9-May-26",
    deadline: "-",
    priority: "P 1",
    battleTokens: "50"
  },
  {
    id: "tk-csv-7",
    title: "Procurar jogo narrativo para baixar no PC",
    status: "not-started",
    area: "Inbox",
    executionDate: "-",
    deadline: "-",
    priority: "P 5",
    battleTokens: "0"
  },
  {
    id: "tk-csv-8",
    title: "Definir data e horário do bate-papo com Ricardo",
    status: "done",
    area: "Estudo",
    executionDate: "-",
    deadline: "-",
    priority: "P 3",
    battleTokens: "15"
  },
  {
    id: "tk-csv-9",
    title: "Ir à Óticas Ipanema com a receita do exame",
    status: "not-started",
    area: "Saúde",
    project: "Óculos",
    executionDate: "-",
    deadline: "-",
    priority: "P 3",
    battleTokens: "0"
  },
  {
    id: "tk-csv-10",
    title: "Realizar exame de vista completo",
    status: "not-started",
    area: "Saúde",
    project: "Óculos",
    executionDate: "-",
    deadline: "-",
    priority: "P 2",
    battleTokens: "0"
  },
  {
    id: "tk-csv-11",
    title: "Marcar consulta com oftalmologista",
    status: "not-started",
    area: "Saúde",
    project: "Óculos",
    executionDate: "-",
    deadline: "-",
    priority: "P 2",
    battleTokens: "0"
  },
  {
    id: "tk-csv-12",
    title: "Retirar óculos prontos",
    status: "not-started",
    area: "Saúde",
    project: "Óculos",
    executionDate: "-",
    deadline: "-",
    priority: "P 3",
    battleTokens: "0"
  },
  {
    id: "tk-csv-13",
    title: "Escolher armação e lentes na ótica",
    status: "not-started",
    area: "Saúde",
    project: "Óculos",
    executionDate: "-",
    deadline: "-",
    priority: "P 3",
    battleTokens: "0"
  },
  {
    id: "tk-csv-14",
    title: "Criar fluxo de anexação real",
    status: "not-started",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "17-May-26 10:00",
    deadline: "-",
    priority: "P 2",
    day: "Sunday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-15",
    title: "Procurar jogo para PC inspirado em Life is Strange",
    status: "not-started",
    area: "Pessoal",
    executionDate: "-",
    deadline: "-",
    priority: "P 5",
    battleTokens: "0",
    subAreas: "Lazer"
  },
  {
    id: "tk-csv-16",
    title: "Desenhar dashboard de recompensas e progressão visual",
    status: "not-started",
    area: "Pessoal",
    project: "2° Cérebro",
    executionDate: "22-May-26 9:00",
    deadline: "-",
    priority: "P 3",
    day: "Friday",
    battleTokens: "0",
    subAreas: "Recompensas"
  },
  {
    id: "tk-csv-17",
    title: "Revisar Painel de Comando",
    status: "not-started",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "17-May-26 9:00",
    deadline: "-",
    priority: "P 2",
    day: "Sunday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-18",
    title: "Mapear Drive de Lab 1",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "10-May-26 9:00",
    deadline: "-",
    priority: "P 1",
    day: "Sunday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-19",
    title: "Verificar exames pendentes no Centro Médico de Campinas",
    status: "done",
    area: "Saúde",
    executionDate: "9-May-26",
    deadline: "-",
    priority: "P 1",
    battleTokens: "50",
    subAreas: "Cirurgia/Colesteatoma"
  },
  {
    id: "tk-csv-20",
    title: "Organizar repouso pós-operatório",
    status: "not-started",
    area: "Saúde",
    project: "Cirurgia",
    executionDate: "20-May-26 14:00",
    deadline: "-",
    priority: "P 2",
    day: "Wednesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-21",
    title: "Fazer eletrocardiograma",
    status: "done",
    area: "Saúde",
    project: "Cirurgia",
    executionDate: "13-May-26 11:00",
    deadline: "-",
    priority: "P 1",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-22",
    title: "Fazer hemograma + coagulograma",
    status: "done",
    area: "Saúde",
    project: "Cirurgia",
    executionDate: "7-May-26 9:00",
    deadline: "-",
    priority: "P 1",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-23",
    title: "Verificar restrições alimentares pré-cirurgia",
    status: "not-started",
    area: "Saúde",
    project: "Cirurgia",
    executionDate: "20-May-26 10:00",
    deadline: "-",
    priority: "P 2",
    day: "Wednesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-24",
    title: "Confirmar data, horário e local da cirurgia",
    status: "done",
    area: "Saúde",
    project: "Cirurgia",
    executionDate: "13-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    day: "Monday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-25",
    title: "Separar documentos para o hospital",
    status: "not-started",
    area: "Saúde",
    project: "Cirurgia",
    executionDate: "23-May-26 10:00",
    deadline: "-",
    priority: "P 2",
    day: "Saturday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-26",
    title: "Criar Caderno de Bolso — A1 Secagem",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "13-May-26 9:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-27",
    title: "Estudar Sedimentação — Kynch, massa específica, área",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "12-May-26 14:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Tuesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-28",
    title: "Criar Caderno de Bolso — A3 Filtração",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "14-May-26 9:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-29",
    title: "Exercícios Cremasco Cap 13-14 + McCabe",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "16-May-26 9:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♦️ Ouros",
    day: "Saturday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-30",
    title: "Criar Caderno de Bolso — A2 Transferência de Calor",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "15-May-26 9:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Friday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-31",
    title: "Simulado com questões da prova antiga Lab 1",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "17-May-26 9:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Sunday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-32",
    title: "Implementar Claude Skills v2 — 18 skills operacionais",
    status: "done",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "10-May-26 2:00",
    deadline: "-",
    priority: "P 1",
    day: "Sunday",
    battleTokens: "50"
  },
  {
    id: "tk-csv-33",
    title: "Criar tasks com mapa mental para Lab 1 e Cirurgia",
    status: "done",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "11-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    day: "Sunday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-34",
    title: "Setup Areas, Projects e Resources do MVP",
    status: "done",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "9-May-26 23:00",
    deadline: "-",
    priority: "P 1",
    day: "Saturday",
    battleTokens: "50"
  },
  {
    id: "tk-csv-35",
    title: "Criar tasks para todos os projetos prioritários",
    status: "done",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "11-May-26 6:00",
    deadline: "-",
    priority: "P 1",
    day: "Sunday",
    battleTokens: "50"
  },
  {
    id: "tk-csv-36",
    title: "Fornecer arquivos Drive para projetos sem Resource",
    status: "not-started",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "12-May-26 9:00",
    deadline: "-",
    priority: "P 1",
    day: "Tuesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-37",
    title: "Validar estrutura completa do 2° Cérebro MVP",
    status: "not-started",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "13-May-26 10:00",
    deadline: "-",
    priority: "P 2",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-38",
    title: "Buscar resultados dos exames presencialmente",
    status: "not-started",
    area: "Saúde",
    project: "Cirurgia",
    executionDate: "12-May-26 9:00",
    deadline: "-",
    priority: "P 3",
    day: "Tuesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-39",
    title: "Raio X pré-operatório realizado — aguardar laudo",
    status: "done",
    area: "Saúde",
    project: "Cirurgia",
    executionDate: "5-May-26 11:50",
    deadline: "-",
    priority: "P 1",
    day: "Monday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-40",
    title: "Atualizar catálogo Dindoca com feedback registrado",
    status: "not-started",
    area: "Pessoal",
    project: "Dindoca",
    executionDate: "13-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    day: "Wednesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-41",
    title: "Treinar Dindoca para atualizar o catálogo sozinha",
    status: "not-started",
    area: "Pessoal",
    project: "Dindoca",
    executionDate: "16-May-26 14:00",
    deadline: "-",
    priority: "P 2",
    day: "Saturday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-42",
    title: "Testar catálogo num grupo WhatsApp real",
    status: "not-started",
    area: "Pessoal",
    project: "Dindoca",
    executionDate: "14-May-26 14:00",
    deadline: "-",
    priority: "P 1",
    day: "Thursday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-43",
    title: "Revisar áudio de feedback do catálogo Dindoca",
    status: "not-started",
    area: "Pessoal",
    project: "Dindoca",
    executionDate: "11-May-26 14:00",
    deadline: "-",
    priority: "P 1",
    day: "Monday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-44",
    title: "Preparar e ir para aula Eng. Econ. — sexta 14h",
    status: "not-started",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "15-May-26 13:30",
    deadline: "-",
    priority: "P 1",
    day: "Friday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-45",
    title: "Resolver exercícios VPL, TIR e Payback — ER704",
    status: "not-started",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "13-May-26 14:00",
    deadline: "-",
    priority: "P 2",
    day: "Wednesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-46",
    title: "Estudar Amortização SAC e SAF/Price — ER704",
    status: "not-started",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "12-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    day: "Tuesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-47",
    title: "Confirmar aprovação mínima e faltas acumuladas ER704",
    status: "done",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "11-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    day: "Monday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-48",
    title: "Definir critérios e orçamento máximo com os amigos",
    status: "in-progress",
    area: "Pessoal",
    project: "Apartamento",
    executionDate: "12-May-26 19:00",
    deadline: "-",
    priority: "P 1",
    day: "Tuesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-49",
    title: "Mapear apartamentos em avaliação com preços",
    status: "done",
    area: "Pessoal",
    project: "Apartamento",
    executionDate: "11-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    day: "Monday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-50",
    title: "Alimentar ApartaRank com apás candidatos e ranquear",
    status: "not-started",
    area: "Pessoal",
    project: "ApartaRank",
    executionDate: "13-May-26 19:00",
    deadline: "-",
    priority: "P 1",
    day: "Wednesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-51",
    title: "Levantar estado atual do ApartaRank_Web no Drive",
    status: "not-started",
    area: "Pessoal",
    project: "ApartaRank",
    executionDate: "12-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    day: "Tuesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-52",
    title: "Confirmar próxima consulta com nutricionista",
    status: "not-started",
    area: "Saúde",
    project: "Nutricionista",
    executionDate: "11-May-26 10:00",
    deadline: "-",
    priority: "P 2",
    day: "Monday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-53",
    title: "Manter frequência semanal na academia (Wellhub)",
    status: "not-started",
    area: "Saúde",
    project: "Academia",
    executionDate: "13-May-26 19:00",
    deadline: "-",
    priority: "P 2",
    day: "Wednesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-54",
    title: "Ajustar alimentação para recuperação pós-cirurgia",
    status: "not-started",
    area: "Saúde",
    project: "Nutricionista",
    executionDate: "20-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    day: "Wednesday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-55",
    title: "Confirmar plano de treino atual na academia",
    status: "not-started",
    area: "Saúde",
    project: "Academia",
    executionDate: "11-May-26 19:00",
    deadline: "-",
    priority: "P 2",
    day: "Monday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-56",
    title: "🗂️ Revisão e organização do Google Drive",
    status: "not-started",
    area: "Inbox",
    project: "2° Cérebro",
    executionDate: "-",
    deadline: "-",
    priority: "P 3",
    battleTokens: "0"
  },
  {
    id: "tk-csv-57",
    title: "Registrar resultado A2 Transferência de Calor — nota 1,3/3",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "14-May-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-58",
    title: "Registrar resultado A3 Filtração — nota 2,3/3",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "14-May-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-59",
    title: "Apresentar pitch Lab 1",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "21-May-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♣️ Paus",
    day: "Thursday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-60",
    title: "Realizar avaliação final Lab 1",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "18-Jun-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-61",
    title: "Entregar A4 Sedimentação",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "7-May-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-62",
    title: "Registrar resultado A1 Secagem — nota 1,7/3",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "14-May-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-63",
    title: "Auditar A1 Secagem — pasta e outputs de IA",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "11-May-26 14:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Sunday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-64",
    title: "Laboratório Experimento 1 — A1 Secagem",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "5-Mar-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-65",
    title: "Entregar planilha A1 Secagem — impressa",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "12-Mar-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-66",
    title: "Entregar planilha A1 Secagem — Classroom",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "12-Mar-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-67",
    title: "Entregar relatório A3 Secagem — impresso",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "19-Mar-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-68",
    title: "Entregar relatório A3 Secagem — Classroom",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "19-Mar-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-69",
    title: "Laboratório Experimento 2 — A2 Transferência de Calor",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "19-Mar-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-70",
    title: "Entregar planilha A2 Calor — impressa",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "26-Mar-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-71",
    title: "Entregar planilha A2 Calor — Classroom",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "26-Mar-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-72",
    title: "Entregar relatório A3 Calor — impresso",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "9-Apr-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-73",
    title: "Entregar relatório A3 Calor — Classroom",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "9-Apr-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-74",
    title: "Laboratório Experimento 3 — A3 Filtração",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "9-Apr-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-75",
    title: "Entregar planilha A3 Filtração — impressa",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "16-Apr-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-76",
    title: "Entregar planilha A3 Filtração — Classroom",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "16-Apr-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-77",
    title: "Entregar relatório A3 Filtração — impresso",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "23-Apr-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-78",
    title: "Entregar relatório A3 Filtração — Classroom",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "23-Apr-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-79",
    title: "Laboratório Experimento 4 — A4 Sedimentação",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "23-Apr-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-80",
    title: "Entregar planilha A4 Sedimentação — impressa",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "30-Apr-26 12:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-81",
    title: "Entregar planilha A4 Sedimentação — Classroom",
    status: "done",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "30-Apr-26 17:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-82",
    title: "Validar auditoria Lab 1 — Drive + Notion",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "17-May-26 10:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♦️ Ouros",
    day: "Sunday",
    link: "https://...",
    battleTokens: "0"
  },
  {
    id: "tk-csv-83",
    title: "Aula 1 - Introdução | ER704",
    status: "done",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "27-Feb-26 14:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♣️ Paus",
    day: "Friday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-84",
    title: "Aula 2 - Juros Simples | ER704",
    status: "done",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "6-Mar-26 14:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♣️ Paus",
    day: "Friday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-85",
    title: "Entregar Atividades 1 e 2 (Juros Simples/Compostos) — Classroom | ER704",
    status: "done",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "13-Mar-26 10:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Friday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-86",
    title: "Entregar Atividades 1 e 2 (Juros Simples/Compostos) — Impressa | ER704",
    status: "done",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "13-Mar-26 10:30",
    deadline: "-",
    priority: "P 1",
    naipe: "♠️ Espadas",
    day: "Friday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-87",
    title: "Aula 3 - Descontos | ER704",
    status: "done",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "13-Mar-26 14:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♣️ Paus",
    day: "Friday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-88",
    title: "Aula 4 - Inflação | ER704",
    status: "done",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "20-Mar-26 14:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♣️ Paus",
    day: "Friday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-89",
    title: "Entregar Atividade 3 (Descontos) — Classroom | ER704",
    status: "done",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "20-Mar-26 10:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Friday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-90",
    title: "Entregar Atividade 3 (Descontos) — Impressa | ER704",
    status: "done",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "20-Mar-26 10:30",
    deadline: "-",
    priority: "P 1",
    naipe: "♠️ Espadas",
    day: "Friday",
    link: "https://...",
    battleTokens: "50"
  },
  {
    id: "tk-csv-91",
    title: "Ensinar a mãe a atualizar o catálogo de forma independente",
    status: "not-started",
    area: "Pessoal",
    project: "Dindoca",
    executionDate: "17-May-26 15:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♣️ Paus",
    day: "Sunday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-92",
    title: "Levantar produtos da mãe — fotos, nomes e preços",
    status: "not-started",
    area: "Pessoal",
    project: "Dindoca",
    executionDate: "14-May-26 14:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♣️ Paus",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-93",
    title: "Definir formato do catálogo — PDF, imagem ou link",
    status: "not-started",
    area: "Pessoal",
    project: "Dindoca",
    executionDate: "13-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Tuesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-94",
    title: "Criar catálogo digital v1 para WhatsApp",
    status: "not-started",
    area: "Pessoal",
    project: "Dindoca",
    executionDate: "15-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-95",
    title: "Publicar catálogo final nos grupos de WhatsApp",
    status: "not-started",
    area: "Pessoal",
    project: "Dindoca",
    executionDate: "18-May-26 10:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♣️ Paus",
    day: "Sunday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-96",
    title: "Testar catálogo com a mãe em grupo de WhatsApp real",
    status: "not-started",
    area: "Pessoal",
    project: "Dindoca",
    executionDate: "16-May-26 14:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♣️ Paus",
    day: "Saturday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-97",
    title: "Mapear apartamentos visitados e em avaliação",
    status: "not-started",
    area: "Pessoal",
    project: "Apartamento",
    executionDate: "21-May-26 10:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-98",
    title: "Alinhar orçamento máximo por pessoa com os amigos",
    status: "not-started",
    area: "Pessoal",
    project: "Apartamento",
    executionDate: "21-May-26 16:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♣️ Paus",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-99",
    title: "Revisar contrato e cláusulas críticas antes de assinar",
    status: "not-started",
    area: "Pessoal",
    project: "Apartamento",
    executionDate: "4-Jun-26 10:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-100",
    title: "Definir critérios de decisão com os dois amigos",
    status: "not-started",
    area: "Pessoal",
    project: "Apartamento",
    executionDate: "21-May-26 14:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♣️ Paus",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-101",
    title: "Planejar logística de mudança com os amigos",
    status: "not-started",
    area: "Pessoal",
    project: "Apartamento",
    executionDate: "11-Jun-26 10:00",
    deadline: "-",
    priority: "P 3",
    naipe: "♣️ Paus",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-102",
    title: "Definir MVP do ApartaRank — features mínimas para decidir o ap",
    status: "not-started",
    area: "Profissional",
    project: "ApartaRank",
    executionDate: "21-May-26 11:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-103",
    title: "Testar ApartaRank com os amigos usando aptos reais",
    status: "not-started",
    area: "Profissional",
    project: "ApartaRank",
    executionDate: "30-May-26 14:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♣️ Paus",
    day: "Friday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-104",
    title: "Documentar código e preservar como Resource no Notion",
    status: "not-started",
    area: "Profissional",
    project: "ApartaRank",
    executionDate: "4-Jun-26 14:00",
    deadline: "-",
    priority: "P 4",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-105",
    title: "Auditar estado atual do ApartaRank_Web no Drive",
    status: "not-started",
    area: "Profissional",
    project: "ApartaRank",
    executionDate: "21-May-26 9:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-106",
    title: "Implementar MVP local funcional do ApartaRank",
    status: "not-started",
    area: "Profissional",
    project: "ApartaRank",
    executionDate: "28-May-26 10:00",
    deadline: "-",
    priority: "P 3",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-107",
    title: "Seguir plano alimentar — checar compras da semana",
    status: "not-started",
    area: "Saúde",
    project: "Nutricionista",
    executionDate: "13-May-26 9:00",
    deadline: "-",
    priority: "P 3",
    naipe: "♥️ Copas",
    day: "Monday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-108",
    title: "Preparar situações difíceis para discutir na próxima consulta",
    status: "not-started",
    area: "Saúde",
    project: "Nutricionista",
    executionDate: "20-May-26 10:00",
    deadline: "-",
    priority: "P 3",
    naipe: "♦️ Ouros",
    day: "Tuesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-109",
    title: "Revisar progresso da academia após 4 semanas",
    status: "not-started",
    area: "Saúde",
    project: "Academia",
    executionDate: "11-Jun-26 10:00",
    deadline: "-",
    priority: "P 4",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-110",
    title: "Agendar próxima consulta com a nutricionista",
    status: "not-started",
    area: "Saúde",
    project: "Nutricionista",
    executionDate: "13-May-26 10:00",
    deadline: "-",
    priority: "P 3",
    naipe: "♣️ Paus",
    day: "Tuesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-111",
    title: "Definir treino semanal com horários fixos",
    status: "not-started",
    area: "Saúde",
    project: "Academia",
    executionDate: "13-May-26 20:00",
    deadline: "-",
    priority: "P 3",
    naipe: "♦️ Ouros",
    day: "Tuesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-112",
    title: "Revisar ficha de treino atual e ajustar se desatualizada",
    status: "not-started",
    area: "Saúde",
    project: "Academia",
    executionDate: "13-May-26 21:00",
    deadline: "-",
    priority: "P 3",
    naipe: "♦️ Ouros",
    day: "Tuesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-113",
    title: "Aplicar primeira técnica do LLMOps no 2° Cérebro",
    status: "not-started",
    area: "Estudo",
    project: "LLMOps",
    executionDate: "11-Jun-26 10:00",
    deadline: "-",
    priority: "P 4",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-114",
    title: "Fazer revisão formal das Areas ativas",
    status: "not-started",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "21-May-26 10:00",
    deadline: "-",
    priority: "P 3",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-115",
    title: "Concluir módulo de RAG do curso LLMOps",
    status: "not-started",
    area: "Estudo",
    project: "LLMOps",
    executionDate: "18-Jun-26 10:00",
    deadline: "-",
    priority: "P 5",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-116",
    title: "Revisar e atualizar Claude Skills no Notion",
    status: "not-started",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "28-May-26 10:00",
    deadline: "-",
    priority: "P 4",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-117",
    title: "Acessar curso LLMOps Duke/Coursera e mapear módulos",
    status: "not-started",
    area: "Estudo",
    project: "LLMOps",
    executionDate: "28-May-26 14:00",
    deadline: "-",
    priority: "P 5",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-118",
    title: "Processar Inbox — triar todos os itens sem projeto ou área",
    status: "not-started",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "18-May-26 9:00",
    deadline: "-",
    priority: "P 3",
    naipe: "♦️ Ouros",
    day: "Monday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-119",
    title: "Fazer revisão semanal do 2° Cérebro — ritual de fechamento",
    status: "not-started",
    area: "Estudo",
    project: "2° Cérebro",
    executionDate: "18-May-26 20:00",
    deadline: "-",
    priority: "P 3",
    naipe: "♦️ Ouros",
    day: "Sunday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-120",
    title: "Assistir módulo 1 do LLMOps e fazer anotacões",
    status: "not-started",
    area: "Estudo",
    project: "LLMOps",
    executionDate: "4-Jun-26 10:00",
    deadline: "-",
    priority: "P 5",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-121",
    title: "Fazer simulado com questões da prova antiga de Lab 1",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "16-Jun-26 10:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Tuesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-122",
    title: "Criar Caderno de Bolso — A1 Secagem",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "28-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-123",
    title: "Criar Caderno de Bolso — A3 Filtração",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "30-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Friday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-124",
    title: "Preparar apresentação Pitch Lab 1 — treinar para qualquer apresentador",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "19-May-26 14:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Monday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-125",
    title: "Resolver exercícios de Lab 1 — Cremasco + McCabe",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "8-Jun-26 10:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Monday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-126",
    title: "Criar Caderno de Bolso — A2 Transferência de Calor",
    status: "not-started",
    area: "Unicamp",
    project: "LE704 - Laboratório de Engenharia 1",
    executionDate: "29-May-26 10:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Thursday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-127",
    title: "Verificar datas de provas e trabalhos restantes — Eng. Econômica",
    status: "not-started",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "15-May-26 14:30",
    deadline: "-",
    priority: "P 2",
    naipe: "♦️ Ouros",
    day: "Friday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-128",
    title: "Organizar repouso pós-operatório no calendário",
    status: "not-started",
    area: "Saúde",
    project: "Cirurgia",
    executionDate: "13-May-26 14:00",
    deadline: "-",
    priority: "P 1",
    naipe: "♦️ Ouros",
    day: "Tuesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-129",
    title: "Comunicar cirurgia aos professores e grupo do Lab 1",
    status: "not-started",
    area: "Saúde",
    project: "Cirurgia",
    executionDate: "20-May-26 10:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♣️ Paus",
    day: "Tuesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-130",
    title: "Ir à aula de Eng. Econômica — sexta 14h-18h",
    status: "not-started",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "16-May-26 14:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♠️ Espadas",
    day: "Friday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-131",
    title: "Estudar para P2 — Eng. Econômica",
    status: "not-started",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "3-Jun-26 10:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♦️ Ouros",
    day: "Wednesday",
    battleTokens: "0"
  },
  {
    id: "tk-csv-132",
    title: "Confirmar critério de aprovação e faltas acumuladas — Eng. Econômica",
    status: "not-started",
    area: "Unicamp",
    project: "Engenharia Econômica",
    executionDate: "15-May-26 14:00",
    deadline: "-",
    priority: "P 2",
    naipe: "♦️ Ouros",
    day: "Friday",
    battleTokens: "0"
  }
];

const initialHabits: Habit[] = [
  {id:'fisio', name:'Fisioterapia / Mobilidade', icon:'🦴', streak:12, days:[1,1,1,0,1,1,0]},
  {id:'estudo', name:'Revisão Lab1 / Eng', icon:'📚', streak:8, days:[1,1,0,1,1,1,1]},
  {id:'treino', name:'Treino Academia', icon:'🏋️', streak:5, days:[0,1,1,1,0,1,0]},
  {id:'dieta', name:'Seguir Dieta', icon:'🥗', streak:21, days:[1,1,1,1,1,1,0]},
  {id:'leitura', name:'Leitura Diária', icon:'📖', streak:3, days:[1,0,1,1,0,1,1]},
];

const initialProjects: Project[] = [
  {
    id: "pr-csv-0",
    title: "Óculos",
    desc: "",
    progress: 0,
    area: "Saúde",
    executionDate: "-",
    deadline: "-",
    status: "active"
  },
  {
    id: "pr-csv-1",
    title: "2° Cérebro",
    desc: "",
    progress: 0,
    area: "Estudo",
    executionDate: "-",
    deadline: "-",
    status: "active"
  },
  {
    id: "pr-csv-2",
    title: "LE704 - Laboratório de Engenharia 1",
    desc: "",
    progress: 0,
    area: "Unicamp",
    executionDate: "-",
    deadline: "-",
    status: "active"
  },
  {
    id: "pr-csv-3",
    title: "Cirurgia",
    desc: "",
    progress: 0,
    area: "Saúde",
    executionDate: "-",
    deadline: "-",
    status: "active"
  },
  {
    id: "pr-csv-4",
    title: "Dindoca",
    desc: "",
    progress: 0,
    area: "Pessoal",
    executionDate: "-",
    deadline: "-",
    status: "active"
  },
  {
    id: "pr-csv-5",
    title: "Engenharia Econômica",
    desc: "",
    progress: 0,
    area: "Unicamp",
    executionDate: "-",
    deadline: "-",
    status: "active"
  },
  {
    id: "pr-csv-6",
    title: "Apartamento",
    desc: "",
    progress: 0,
    area: "Pessoal",
    executionDate: "-",
    deadline: "-",
    status: "active"
  },
  {
    id: "pr-csv-7",
    title: "ApartaRank",
    desc: "",
    progress: 0,
    area: "Pessoal",
    executionDate: "-",
    deadline: "-",
    status: "active"
  },
  {
    id: "pr-csv-8",
    title: "Nutricionista",
    desc: "",
    progress: 0,
    area: "Saúde",
    executionDate: "-",
    deadline: "-",
    status: "active"
  },
  {
    id: "pr-csv-9",
    title: "Academia",
    desc: "",
    progress: 0,
    area: "Saúde",
    executionDate: "-",
    deadline: "-",
    status: "active"
  },
  {
    id: "pr-csv-10",
    title: "LLMOps",
    desc: "",
    progress: 0,
    area: "Estudo",
    executionDate: "-",
    deadline: "-",
    status: "active"
  }
];

const initialResources: Resource[] = [
  {id: 'rc-1', title: "Template Finanças - inspiração", area: "Finanças"},
  {id: 'rc-2', title: "NuBank - Faturas", area: "Finanças"},
  {id: 'rc-3', title: "Óticas Ipanema", area: "Saúde"},
  {id: 'rc-4', title: "Plano Alimentar - Pedro Teixeira", area: "Saúde"},
  {id: 'rc-5', title: "Lembrete de bolso - Nutrição", area: "Saúde"},
  {id: 'rc-6', title: "Anotações sobre IA", area: "Estudo"},
  {id: 'rc-7', title: "Referências de Design", project: "2° Cérebro"},
  {id: 'rc-8', title: "E-book sobre Foco", area: "Pessoal"},
];

const initialAreas: Area[] = [
  {
    id: "ar-csv-0",
    name: "Unicamp",
    icon: "📁",
    count: 56
  },
  {
    id: "ar-csv-1",
    name: "Estudo",
    icon: "📁",
    count: 17
  },
  {
    id: "ar-csv-2",
    name: "Saúde",
    icon: "📁",
    count: 26
  },
  {
    id: "ar-csv-3",
    name: "Pessoal",
    icon: "📁",
    count: 21
  },
  {
    id: "ar-csv-4",
    name: "Profissional",
    icon: "📁",
    count: 5
  },
  {
    id: "ar-csv-5",
    name: "Finanças",
    icon: "📁",
    count: 12
  }
];

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [nodes, setNodes] = useState<KiNode[]>([]);
  const [relations, setRelations] = useState<KiRelation[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [jarvisMessage, setJarvisMessage] = useState<string | null>(null);
  const [isJarvisOpen, setJarvisOpen] = useState(false);
  const [archivedNodeIds, setArchivedNodeIds] = useState<string[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);

  // Inicialização e Migração Idempotente do IndexedDB
  useEffect(() => {
    async function initDb() {
      try {
        const storedNodes = await getAllFromStore<KiNode>('nodes');
        const storedRelations = await getAllFromStore<KiRelation>('relations');

        if (storedNodes && storedNodes.length > 0) {
          setNodes(storedNodes);
          setRelations(storedRelations || []);

          const loadedTasks: Task[] = [];
          const loadedProjects: Project[] = [];
          const loadedAreas: Area[] = [];
          const loadedResources: Resource[] = [];
          const loadedArchivedIds: string[] = [];

          for (const node of storedNodes) {
            if (node.archived) loadedArchivedIds.push(node.id);

            if (node.type === 'task') {
              loadedTasks.push({
                id: node.id,
                title: node.title,
                status: node.metadata?.status || (node.archived ? 'arquivadas' : 'not-started'),
                area: node.metadata?.area || 'Inbox',
                project: node.metadata?.project,
                executionDate: node.metadata?.executionDate || '-',
                deadline: node.metadata?.deadline || '-',
                priority: node.metadata?.priority || 'P 3',
                naipe: node.metadata?.naipe,
                day: node.metadata?.day,
                link: node.metadata?.link,
                battleTokens: node.metadata?.battleTokens || '0',
                subAreas: node.metadata?.subAreas,
              });
            } else if (node.type === 'project') {
              loadedProjects.push({
                id: node.id,
                title: node.title,
                desc: node.metadata?.desc || '',
                progress: node.metadata?.progress || 0,
                area: node.metadata?.area || 'Inbox',
                icon: node.metadata?.icon || '📂',
                due: node.metadata?.due || '-',
                status: node.metadata?.status || 'active',
                executionDate: node.metadata?.executionDate || '-',
                deadline: node.metadata?.deadline || '-',
              });
            } else if (node.type === 'area') {
              loadedAreas.push({
                id: node.id,
                name: node.title,
                icon: node.metadata?.icon || '📁',
                count: node.metadata?.count || 0,
              });
            } else if (node.type === 'resource' || node.type === 'archive') {
              loadedResources.push({
                id: node.id,
                title: node.title,
                link: node.metadata?.link,
                area: node.metadata?.area || (node.type === 'archive' ? 'Arquivados' : 'Inbox'),
                project: node.metadata?.project,
                task: node.metadata?.task,
              });
            }
          }

          setTasks(loadedTasks.length ? loadedTasks : initialTasks);
          setProjects(loadedProjects.length ? loadedProjects : initialProjects);
          setAreas(loadedAreas.length ? loadedAreas : initialAreas);
          setResources(loadedResources.length ? loadedResources : initialResources);
          setArchivedNodeIds(loadedArchivedIds);
        } else {
          // Migração Inicial Idempotente
          const newNodes: KiNode[] = [];
          const newRelations: KiRelation[] = [];

          initialAreas.forEach(a => {
            newNodes.push({
              id: a.id,
              type: 'area',
              title: a.name,
              metadata: { icon: a.icon, count: a.count },
              archived: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          });

          initialProjects.forEach(p => {
            newNodes.push({
              id: p.id,
              type: 'project',
              title: p.title,
              metadata: {
                desc: p.desc,
                progress: p.progress,
                area: p.area,
                icon: p.icon,
                due: p.due,
                status: p.status,
                executionDate: p.executionDate,
                deadline: p.deadline,
              },
              archived: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            if (p.area) {
              const targetArea = initialAreas.find(a => a.name === p.area || a.id === p.area);
              if (targetArea) {
                newRelations.push({
                  id: `rel-${p.id}-${targetArea.id}`,
                  sourceId: p.id,
                  targetId: targetArea.id,
                  type: 'belongs_to',
                  weight: 1,
                  confidence: 100,
                  author: 'system',
                  approved: true,
                  createdAt: new Date().toISOString(),
                });
              }
            }
          });

          initialTasks.forEach(t => {
            const isArchived = t.status === 'arquivadas';
            newNodes.push({
              id: t.id,
              type: 'task',
              title: t.title,
              metadata: {
                status: t.status,
                area: t.area,
                project: t.project,
                executionDate: t.executionDate,
                deadline: t.deadline,
                priority: t.priority,
                naipe: t.naipe,
                day: t.day,
                link: t.link,
                battleTokens: t.battleTokens,
                subAreas: t.subAreas,
              },
              archived: isArchived,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            if (t.project) {
              const targetProj = initialProjects.find(p => p.title === t.project || p.id === t.project);
              if (targetProj) {
                newRelations.push({
                  id: `rel-${t.id}-${targetProj.id}`,
                  sourceId: t.id,
                  targetId: targetProj.id,
                  type: 'task_for',
                  weight: 1,
                  confidence: 100,
                  author: 'system',
                  approved: true,
                  createdAt: new Date().toISOString(),
                });
              }
            } else if (t.area) {
              const targetArea = initialAreas.find(a => a.name === t.area || a.id === t.area);
              if (targetArea) {
                newRelations.push({
                  id: `rel-${t.id}-${targetArea.id}`,
                  sourceId: t.id,
                  targetId: targetArea.id,
                  type: 'belongs_to',
                  weight: 1,
                  confidence: 100,
                  author: 'system',
                  approved: true,
                  createdAt: new Date().toISOString(),
                });
              }
            }
          });

          initialResources.forEach(r => {
            newNodes.push({
              id: r.id,
              type: 'resource',
              title: r.title,
              metadata: { link: r.link, area: r.area, project: r.project, task: r.task },
              archived: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            const areaName = Array.isArray(r.area) ? r.area[0] : r.area;
            if (areaName) {
              const targetArea = initialAreas.find(a => a.name === areaName || a.id === areaName);
              if (targetArea) {
                newRelations.push({
                  id: `rel-${r.id}-${targetArea.id}`,
                  sourceId: r.id,
                  targetId: targetArea.id,
                  type: 'supports',
                  weight: 1,
                  confidence: 100,
                  author: 'system',
                  approved: true,
                  createdAt: new Date().toISOString(),
                });
              }
            }
          });

          await putBatchInStore('nodes', newNodes);
          await putBatchInStore('relations', newRelations);
          setNodes(newNodes);
          setRelations(newRelations);
        }
      } catch (err) {
        console.error('Erro ao carregar do IndexedDB:', err);
      } finally {
        setIsDbLoaded(true);
      }
    }

    initDb();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const toggleArchiveNode = (id: string) => {
    const isNowArchived = !archivedNodeIds.includes(id);
    setArchivedNodeIds(prev => isNowArchived ? [...prev, id] : prev.filter(i => i !== id));
    setNodes(prev => prev.map(n => {
      if (n.id === id) {
        const updated = { ...n, archived: isNowArchived, updatedAt: new Date().toISOString() };
        putInStore('nodes', updated).catch(console.error);
        return updated;
      }
      return n;
    }));
  };

  const deleteNodes = (ids: string[]) => {
    const relationIds = relations
      .filter(r => ids.includes(r.sourceId) || ids.includes(r.targetId))
      .map(r => r.id);
    setTasks(prev => prev.filter(t => !ids.includes(t.id)));
    setProjects(prev => prev.filter(p => !ids.includes(p.id)));
    setAreas(prev => prev.filter(a => !ids.includes(a.id)));
    setResources(prev => prev.filter(r => !ids.includes(r.id)));
    setArchivedNodeIds(prev => prev.filter(id => !ids.includes(id)));
    setNodes(prev => prev.filter(n => !ids.includes(n.id)));
    setRelations(prev => prev.filter(r => !ids.includes(r.sourceId) && !ids.includes(r.targetId)));

    deleteBatchFromStore('nodes', ids).catch(console.error);
    deleteBatchFromStore('relations', relationIds).catch(console.error);
  };

  const addTask = (title: string, area: string = "Inbox", project?: string, additionalProps?: Partial<Task>) => {
    if (!title.trim()) return;
    const newId = `tk-${Date.now()}`;
    const newTask: Task = {
      id: newId,
      title: title.trim(),
      status: 'not-started',
      area,
      project,
      executionDate: additionalProps?.executionDate || "Hoje",
      deadline: "-",
      priority: additionalProps?.priority || 'P 3',
      naipe: additionalProps?.naipe || '♦️',
      ...additionalProps,
    };

    setTasks(prev => [newTask, ...prev]);

    const kiNode: KiNode = {
      id: newId,
      type: 'task',
      title: newTask.title,
      metadata: { ...newTask },
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNodes(prev => [kiNode, ...prev]);
    putInStore('nodes', kiNode).catch(console.error);

    if (project) {
      const parentProj = projects.find(p => p.title === project || p.id === project);
      if (parentProj) {
        createRelation(newId, parentProj.id, 'task_for', 'manual').catch(console.error);
      }
    }
  };

  const addProject = (title: string, desc: string = "", area: string = "Inbox") => {
    if (!title.trim()) return;
    const newId = `pr-${Date.now()}`;
    const newProj: Project = {
      id: newId,
      title: title.trim(),
      desc,
      progress: 0,
      area,
      due: "-",
      status: 'active',
    };
    setProjects(prev => [newProj, ...prev]);

    const kiNode: KiNode = {
      id: newId,
      type: 'project',
      title: newProj.title,
      metadata: { ...newProj },
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNodes(prev => [kiNode, ...prev]);
    putInStore('nodes', kiNode).catch(console.error);

    if (area && area !== 'Inbox') {
      const parentArea = areas.find(a => a.name === area || a.id === area);
      if (parentArea) {
        createRelation(newId, parentArea.id, 'belongs_to', 'manual').catch(console.error);
      }
    }
  };

  const addArea = (name: string, icon: string = "📁") => {
    if (!name.trim()) return;
    const newId = `ar-${Date.now()}`;
    const newArea: Area = {
      id: newId,
      name: name.trim(),
      icon,
      count: 0,
    };
    setAreas(prev => [newArea, ...prev]);

    const kiNode: KiNode = {
      id: newId,
      type: 'area',
      title: newArea.name,
      metadata: { ...newArea },
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNodes(prev => [kiNode, ...prev]);
    putInStore('nodes', kiNode).catch(console.error);
  };

  const addResource = (title: string, area?: string, project?: string, task?: string) => {
    if (!title.trim()) return;
    const newId = `rc-${Date.now()}`;
    const newResource: Resource = {
      id: newId,
      title: title.trim(),
      area,
      project,
      task,
    };
    setResources(prev => [newResource, ...prev]);

    const kiNode: KiNode = {
      id: newId,
      type: 'resource',
      title: newResource.title,
      metadata: { ...newResource },
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNodes(prev => [kiNode, ...prev]);
    putInStore('nodes', kiNode).catch(console.error);
  };

  const editArea = (id: string, field: keyof Area, value: any) => {
    setAreas(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, [field]: value };
        putInStore('nodes', {
          id,
          type: 'area' as NodeType,
          title: updated.name,
          metadata: { ...updated },
          archived: archivedNodeIds.includes(id),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch(console.error);
        return updated;
      }
      return a;
    }));
  };

  const editResource = (id: string, field: keyof Resource, value: any) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        putInStore('nodes', {
          id,
          type: 'resource' as NodeType,
          title: updated.title,
          metadata: { ...updated },
          archived: archivedNodeIds.includes(id),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch(console.error);
        return updated;
      }
      return r;
    }));
  };

  const editTask = (id: string, field: keyof Task, value: any) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        putInStore('nodes', {
          id,
          type: 'task' as NodeType,
          title: updated.title,
          metadata: { ...updated },
          archived: updated.status === 'arquivadas',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch(console.error);
        return updated;
      }
      return t;
    }));
  };

  const editProject = (id: string, field: keyof Project, value: any) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        putInStore('nodes', {
          id,
          type: 'project' as NodeType,
          title: updated.title,
          metadata: { ...updated },
          archived: archivedNodeIds.includes(id),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch(console.error);
        return updated;
      }
      return p;
    }));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'done' ? 'not-started' : 'done';
        const updated = { ...t, status: nextStatus as Task['status'] };
        putInStore('nodes', {
          id,
          type: 'task' as NodeType,
          title: updated.title,
          metadata: { ...updated },
          archived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch(console.error);
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    deleteNodes([id]);
  };

  const toggleHabit = (id: string, dayIndex: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newDays = [...h.days];
        newDays[dayIndex] = newDays[dayIndex] ? 0 : 1;
        const newStreak = newDays.filter(Boolean).length;
        return { ...h, days: newDays, streak: newStreak };
      }
      return h;
    }));
  };

  const createRelation = async (
    sourceId: string,
    targetId: string,
    type: RelationType,
    author: 'manual' | 'ai' | 'system' = 'manual'
  ) => {
    const relId = `rel-${sourceId}-${targetId}-${type}`;
    const newRel: KiRelation = {
      id: relId,
      sourceId,
      targetId,
      type,
      weight: 1,
      confidence: author === 'manual' ? 100 : 85,
      author,
      approved: author !== 'ai',
      createdAt: new Date().toISOString(),
    };

    setRelations(prev => {
      const filtered = prev.filter(r => r.id !== relId);
      return [...filtered, newRel];
    });
    await putInStore('relations', newRel);
  };

  const approveRelation = async (relationId: string) => {
    setRelations(prev => prev.map(r => {
      if (r.id === relationId) {
        const updated = { ...r, approved: true };
        putInStore('relations', updated).catch(console.error);
        return updated;
      }
      return r;
    }));
  };

  const deleteRelation = async (relationId: string) => {
    setRelations(prev => prev.filter(r => r.id !== relationId));
    await deleteFromStore('relations', relationId);
  };

  const addKiIngestionBatch = async (proposals: ParaProposalItem[], sourceRootPath: string) => {
    const nodesToPersist: KiNode[] = [];
    const relationsToPersist: KiRelation[] = [];

    const newTasks: Task[] = [];
    const newProjects: Project[] = [];
    const newAreas: Area[] = [];
    const newResources: Resource[] = [];

    for (const item of proposals) {
      const nodeType: NodeType = item.para;
      const kiNode: KiNode = {
        id: item.id,
        type: nodeType,
        title: item.title,
        metadata: {
          original_file: item.name,
          relative_path: item.relativePath,
          mime_type: item.mimeType,
          size: item.size,
          modified: item.modified,
          sha256: item.sha256,
          summary: item.summary,
          tags: item.tags,
          actions: item.actions,
          parent: item.parent,
          para: item.para,
          confidence: item.confidence,
        },
        archived: item.para === 'archive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      nodesToPersist.push(kiNode);

      const sourceNodeId = `src-${item.id}`;
      nodesToPersist.push({
        id: sourceNodeId,
        type: 'source',
        title: item.name,
        metadata: {
          relative_path: item.relativePath,
          source_root: sourceRootPath || '',
          mime_type: item.mimeType,
          size: item.size,
          modified: item.modified,
          sha256: item.sha256,
        },
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Markdown Twin
      if (item.markdown) {
        const markdownNodeId = `md-${item.id}`;
        await putInStore('markdown_twins', {
          id: markdownNodeId,
          nodeId: item.id,
          title: item.title,
          filename: `${item.title.replace(/[^a-zA-Z0-9-_ ]/g, '').trim().slice(0, 80) || item.id}.md`,
          content: item.markdown,
          createdAt: new Date().toISOString(),
        });
        nodesToPersist.push({
          id: markdownNodeId,
          type: 'markdown',
          title: `${item.title}.md`,
          metadata: { nodeId: item.id, original_file: item.name },
          archived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        relationsToPersist.push(
          {
            id: `rel-${sourceNodeId}-${markdownNodeId}`,
            sourceId: sourceNodeId,
            targetId: markdownNodeId,
            type: 'produces',
            weight: 1,
            confidence: 100,
            author: 'system',
            approved: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: `rel-${markdownNodeId}-${item.id}`,
            sourceId: markdownNodeId,
            targetId: item.id,
            type: 'supports',
            weight: 1,
            confidence: 100,
            author: 'system',
            approved: true,
            createdAt: new Date().toISOString(),
          }
        );
      } else {
        relationsToPersist.push({
          id: `rel-${item.id}-${sourceNodeId}`,
          sourceId: item.id,
          targetId: sourceNodeId,
          type: 'references',
          weight: 1,
          confidence: 100,
          author: 'system',
          approved: true,
          createdAt: new Date().toISOString(),
        });
      }

      // Source Asset
      await putInStore('source_assets', {
        id: `src-${item.id}`,
        name: item.name,
        relativePath: item.relativePath,
        type: item.type,
        mimeType: item.mimeType,
        size: item.size,
        modified: item.modified,
        sha256: item.sha256,
        createdAt: new Date().toISOString(),
      });

      // Aprovação
      await putInStore('approval_events', {
        id: `appr-${item.id}-${Date.now()}`,
        entityType: 'node',
        entityId: item.id,
        action: 'approved',
        timestamp: new Date().toISOString(),
      });

      if (item.para === 'area') {
        newAreas.push({ id: item.id, name: item.title, icon: '📁', count: 0 });
      } else if (item.para === 'project') {
        newProjects.push({
          id: item.id,
          title: item.title,
          desc: item.summary,
          progress: 0,
          area: item.parent || 'Inbox',
          due: '-',
          status: 'active',
        });
      } else if (item.para === 'resource' || item.para === 'archive') {
        newResources.push({
          id: item.id,
          title: item.title,
          area: item.parent || (item.para === 'archive' ? 'Arquivados' : 'Inbox'),
        });
      }

      // Tarefas derivadas das ações
      if (item.actions && item.actions.length > 0) {
        item.actions.forEach((act, actIdx) => {
          const tId = `tk-${item.id}-${actIdx}`;
          const taskObj: Task = {
            id: tId,
            title: act,
            status: 'not-started',
            area: item.parent || 'Inbox',
            project: item.para === 'project' ? item.title : undefined,
            executionDate: 'Hoje',
            deadline: '-',
            priority: 'P 2',
            battleTokens: '10',
          };
          newTasks.push(taskObj);

          const taskNode: KiNode = {
            id: tId,
            type: 'task',
            title: act,
            metadata: { ...taskObj },
            archived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          nodesToPersist.push(taskNode);

          relationsToPersist.push({
            id: `rel-${tId}-${item.id}`,
            sourceId: tId,
            targetId: item.id,
            type: 'task_for',
            weight: 1,
            confidence: 100,
            author: 'system',
            approved: true,
            createdAt: new Date().toISOString(),
          });
        });
      }
    }

    await putBatchInStore('nodes', nodesToPersist);
    await putBatchInStore('relations', relationsToPersist);

    setNodes(prev => [...nodesToPersist, ...prev]);
    setRelations(prev => [...relationsToPersist, ...prev]);
    setAreas(prev => [...newAreas, ...prev]);
    setProjects(prev => [...newProjects, ...prev]);
    setResources(prev => [...newResources, ...prev]);
    setTasks(prev => [...newTasks, ...prev]);
  };

  const addBatchItems = (items: {
    tasks?: Partial<Task>[];
    projects?: Partial<Project>[];
    areas?: Partial<Area>[];
    resources?: Partial<Resource>[];
  }) => {
    if (items.areas && items.areas.length > 0) {
      setAreas(prev => {
        const existingNames = new Set(prev.map(a => a.name.toLowerCase()));
        const newOnes = (items.areas || [])
          .filter(a => a.name && !existingNames.has(a.name.toLowerCase()))
          .map((a, i) => ({
            id: a.id || `ar-${Date.now()}-${i}`,
            name: a.name!,
            icon: a.icon || '📁',
            count: a.count || 0
          }));
        return [...newOnes, ...prev];
      });
    }

    if (items.projects && items.projects.length > 0) {
      setProjects(prev => {
        const existingTitles = new Set(prev.map(p => p.title.toLowerCase()));
        const newOnes = (items.projects || [])
          .filter(p => p.title && !existingTitles.has(p.title.toLowerCase()))
          .map((p, i) => ({
            id: p.id || `pr-${Date.now()}-${i}`,
            title: p.title!,
            desc: p.desc || 'Importado via ParaOrganizer',
            progress: p.progress || 0,
            area: p.area || 'Inbox',
            icon: p.icon || '📂',
            due: p.due || '-',
            status: p.status || 'active',
            executionDate: p.executionDate || '-',
            deadline: p.deadline || '-'
          }));
        return [...newOnes, ...prev];
      });
    }

    if (items.tasks && items.tasks.length > 0) {
      setTasks(prev => {
        const newOnes = (items.tasks || []).map((t, i) => ({
          id: t.id || `tk-ingest-${Date.now()}-${i}`,
          title: t.title || 'Tarefa sem título',
          status: t.status || 'not-started',
          area: t.area || 'Inbox',
          project: t.project,
          executionDate: t.executionDate || '-',
          deadline: t.deadline || '-',
          priority: t.priority || 'P 3',
          day: t.day || '-',
          battleTokens: t.battleTokens || '10',
          link: t.link || '-',
          naipe: t.naipe,
          subAreas: t.subAreas
        }));
        return [...newOnes, ...prev];
      });
    }

    if (items.resources && items.resources.length > 0) {
      setResources(prev => {
        const newOnes = (items.resources || []).map((r, i) => ({
          id: r.id || `rc-ingest-${Date.now()}-${i}`,
          title: r.title || 'Recurso sem título',
          link: r.link || '#',
          area: r.area || 'Inbox',
          project: r.project,
          task: r.task
        }));
        return [...newOnes, ...prev];
      });
    }
  };

  const processJarvisCommand = (command: string) => {
    // Processamento do Jarvis - gerenciado no JarvisChat com conexão Gemini
    setJarvisOpen(true);
    setJarvisMessage(command);
  };

  return (
    <StoreContext.Provider value={{
      currentView, setCurrentView,
      tasks, habits, projects, areas, resources,
      nodes, relations, isDbLoaded,
      addBatchItems, addKiIngestionBatch,
      createRelation, approveRelation, deleteRelation,
      addTask, addProject, addArea, addResource, editArea, editResource, editTask, editProject, toggleTask, deleteTask, toggleHabit,
      jarvisMessage, setJarvisMessage, isJarvisOpen, setJarvisOpen,
      processJarvisCommand, archivedNodeIds, toggleArchiveNode, deleteNodes,
      selectedProjectId, setSelectedProjectId, selectedAreaId, setSelectedAreaId,
      isSidebarOpen, toggleSidebar
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
