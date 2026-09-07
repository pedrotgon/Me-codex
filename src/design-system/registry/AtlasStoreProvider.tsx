import React, { useState } from 'react';
import { StoreContext, StoreState, Task, Habit, Project, Area, Resource, View } from '../../store';
import { 
  DEMO_TASKS, 
  DEMO_PROJECTS, 
  DEMO_AREAS, 
  DEMO_RESOURCES, 
  DEMO_HABITS, 
  DEMO_NODES, 
  DEMO_RELATIONS 
} from './fixtures';
import { KiNode, KiRelation } from '../../lib/db';

interface AtlasStoreProviderProps {
  children: React.ReactNode;
  overrides?: Partial<StoreState>;
}

export const AtlasStoreProvider: React.FC<AtlasStoreProviderProps> = ({ children, overrides }) => {
  const o: Partial<StoreState> = overrides || {};
  const [currentView, setCurrentView] = useState<View>(o.currentView || 'home');
  const [tasks, setTasks] = useState<Task[]>(o.tasks || DEMO_TASKS);
  const [habits, setHabits] = useState<Habit[]>(o.habits || DEMO_HABITS);
  const [projects, setProjects] = useState<Project[]>(o.projects || DEMO_PROJECTS);
  const [areas, setAreas] = useState<Area[]>(o.areas || DEMO_AREAS);
  const [resources, setResources] = useState<Resource[]>(o.resources || DEMO_RESOURCES);
  const [nodes, setNodes] = useState<KiNode[]>(o.nodes || DEMO_NODES);
  const [relations, setRelations] = useState<KiRelation[]>(o.relations || DEMO_RELATIONS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(o.selectedProjectId ?? 'demo-pr-1');
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(o.selectedAreaId ?? 'demo-ar-1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(o.isSidebarOpen ?? true);
  const [isJarvisOpen, setJarvisOpen] = useState(o.isJarvisOpen ?? false);
  const [jarvisMessage, setJarvisMessage] = useState<string | null>(o.jarvisMessage ?? null);
  const [archivedNodeIds, setArchivedNodeIds] = useState<string[]>(o.archivedNodeIds || []);

  const storeValue: StoreState = {
    currentView,
    setCurrentView,
    tasks,
    habits,
    projects,
    areas,
    resources,
    nodes,
    relations,
    isDbLoaded: true,
    addTask: (title, area = 'Inbox', project, additionalProps = {}) => {
      const newTask: Task = {
        id: `demo-task-${Date.now()}`,
        title,
        status: 'not-started',
        area,
        project,
        executionDate: new Date().toISOString().split('T')[0],
        deadline: '-',
        priority: 'P 2',
        battleTokens: '10',
        ...additionalProps,
      };
      setTasks(prev => [newTask, ...prev]);
    },
    addProject: (title, desc = '', area = 'Unicamp') => {
      const newProj: Project = {
        id: `demo-proj-${Date.now()}`,
        title,
        desc,
        progress: 0,
        area,
        status: 'active',
      };
      setProjects(prev => [...prev, newProj]);
    },
    addArea: (name, icon = '📁') => {
      const newArea: Area = {
        id: `demo-area-${Date.now()}`,
        name,
        icon,
        count: 0,
      };
      setAreas(prev => [...prev, newArea]);
    },
    addResource: (title, area = 'Geral', project, task) => {
      const newRes: Resource = {
        id: `demo-res-${Date.now()}`,
        title,
        area,
        project,
        task,
      };
      setResources(prev => [...prev, newRes]);
    },
    editArea: (id, field, value) => {
      setAreas(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
    },
    editResource: (id, field, value) => {
      setResources(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    },
    editTask: (id, field, value) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    },
    editProject: (id, field, value) => {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    },
    toggleTask: (id) => {
      setTasks(prev => prev.map(t => {
        if (t.id !== id) return t;
        const newStatus = t.status === 'done' ? 'not-started' : 'done';
        return { ...t, status: newStatus };
      }));
    },
    deleteTask: (id) => {
      setTasks(prev => prev.filter(t => t.id !== id));
    },
    toggleHabit: (id, dayIndex) => {
      setHabits(prev => prev.map(h => {
        if (h.id !== id) return h;
        const newDays = [...h.days];
        newDays[dayIndex] = newDays[dayIndex] === 1 ? 0 : 1;
        return { ...h, days: newDays };
      }));
    },
    jarvisMessage,
    setJarvisMessage,
    isJarvisOpen,
    setJarvisOpen,
    processJarvisCommand: (cmd) => {
      setJarvisMessage(`Comando processado no ambiente demonstrativo: "${cmd}"`);
    },
    archivedNodeIds,
    toggleArchiveNode: (id) => {
      setArchivedNodeIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    },
    deleteNodes: (ids) => {
      setNodes(prev => prev.filter(n => !ids.includes(n.id)));
    },
    selectedProjectId,
    setSelectedProjectId,
    selectedAreaId,
    setSelectedAreaId,
    isSidebarOpen,
    toggleSidebar: () => setIsSidebarOpen(prev => !prev),
    createRelation: async (sourceId, targetId, type, author = 'manual') => {
      const newRel: KiRelation = {
        id: `rel-${Date.now()}`,
        sourceId,
        targetId,
        type,
        weight: 1,
        confidence: 100,
        author,
        approved: true,
        createdAt: new Date().toISOString(),
      };
      setRelations(prev => [...prev, newRel]);
    },
    approveRelation: async (relationId) => {
      setRelations(prev => prev.map(r => r.id === relationId ? { ...r, approved: true } : r));
    },
    deleteRelation: async (relationId) => {
      setRelations(prev => prev.filter(r => r.id !== relationId));
    },
    ...overrides,
  };

  return (
    <StoreContext.Provider value={storeValue}>
      {children}
    </StoreContext.Provider>
  );
};
