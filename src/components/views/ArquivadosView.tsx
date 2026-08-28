import React, { useState } from 'react';
import { Archive, Search, ListTodo, FolderKanban } from 'lucide-react';
import ViewHeader from '../ViewHeader';
import { useStore } from '../../store';

export default function ArquivadosView() {
  const { tasks, projects } = useStore();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'projects'>('tasks');

  const archivedTasks = tasks.filter(t => t.status === 'arquivadas');
  // I notice some projects have 'status' active/completed/on-hold, there is no archived but let's assume completed
  const completedProjects = projects.filter(p => p.status === 'completed');

  const filteredTasks = archivedTasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
  const filteredProjects = completedProjects.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full h-full relative">
      <ViewHeader 
        title="Arquivados" 
        description="Recupere tarefas arquivadas ou consulte projetos finalizados."
        icon={Archive}
        action={null}
      />

      <div className="flex items-center gap-4 border-b border-forest/10 pb-4">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'tasks' ? 'bg-forest text-white shadow-sm' : 'hover:bg-forest/5 text-ink/60'}`}
        >
          <ListTodo className="w-4 h-4" />
          Tarefas Arquivadas
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === 'tasks' ? 'bg-white/20 text-white' : 'bg-forest/10 text-ink/40'}`}>
            {archivedTasks.length}
          </span>
        </button>
        <button 
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-forest text-white shadow-sm' : 'hover:bg-forest/5 text-ink/60'}`}
        >
          <FolderKanban className="w-4 h-4" />
          Projetos Finalizados
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-forest/10 text-ink/40'}`}>
            {completedProjects.length}
          </span>
        </button>
      </div>

      <div className="bg-white/50 border border-forest/10 rounded-2xl p-5 flex flex-col flex-1 shadow-sm min-h-0">
        <div className="relative mb-6 shrink-0">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Pesquisar ${activeTab === 'tasks' ? 'tarefas' : 'projetos'}...`} 
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-forest/10 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-forest/20 text-ink transition-all shadow-sm" 
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          {activeTab === 'tasks' ? (
            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <Archive className="w-12 h-12 text-ink/20 mb-4" />
                  <h3 className="text-lg font-bold text-ink">Nenhuma tarefa encontrada</h3>
                  <p className="text-sm font-medium text-ink/50 mt-1">Não há tarefas arquivadas correspondentes.</p>
                </div>
              ) : (
                filteredTasks.map(t => (
                  <div key={t.id} className="flex items-center p-4 bg-white border border-forest/10 rounded-xl">
                    <ListTodo className="w-5 h-5 text-ink/30 mr-4" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-ink line-through opacity-70">{t.title}</p>
                      <p className="text-xs text-ink/50 mt-1">{t.area} {t.project ? `• ${t.project}` : ''}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                  <FolderKanban className="w-12 h-12 text-ink/20 mb-4" />
                  <h3 className="text-lg font-bold text-ink">Nenhum projeto encontrado</h3>
                  <p className="text-sm font-medium text-ink/50 mt-1">Nenhum projeto foi finalizado ou corresponde à busca.</p>
                </div>
              ) : (
                filteredProjects.map(p => (
                  <div key={p.id} className="p-5 bg-white border border-forest/10 rounded-2xl shadow-sm opacity-80">
                    <h3 className="font-bold text-[16px] text-ink mb-2">{p.title}</h3>
                    <p className="text-xs text-ink/50 uppercase font-bold tracking-wider">{p.area}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
