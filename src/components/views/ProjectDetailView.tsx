import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Clock, Plus, Target, Play } from 'lucide-react';
import { useStore, Project, Task } from '../../store';
import { getProjectIcon } from '../../lib/icons';

export default function ProjectDetailView({ project, onBack }: { project: Project, onBack: () => void }) {
  const { tasks, addTask, toggleTask, editTask, editProject } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Sincroniza as tarefas do Intake baseadas no nome do projeto
  const projectTasks = useMemo(() => tasks.filter(t => t.project === project.title), [tasks, project.title]);

  const progressCount = useMemo(() => {
    // "progesso conte quando estiver no status em prograsso e no satus finalizado (tambem inclua o status arquivado na conta), ou seja, só não entrara para o contador da barra de progresso o que esta como não inciado"
    const progressed = projectTasks.filter(t => t.status !== 'not-started').length;
    const total = projectTasks.length;
    return { progressed, total, percentage: total === 0 ? 0 : Math.round((progressed / total) * 100) };
  }, [projectTasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, project.area, project.title);
      setNewTaskTitle('');
    }
  };

  const cycleStatus = (task: Task) => {
    const statuses: Task['status'][] = ['not-started', 'in-progress', 'done', 'arquivadas'];
    const currentIndex = statuses.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    editTask(task.id, 'status', statuses[nextIndex]);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-20">
      <div className="flex items-start gap-4 mb-4">
        <button onClick={onBack} className="p-2 mt-1 hover:bg-forest/10 rounded-full transition-colors text-forest shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center text-[28px] shrink-0">
            {getProjectIcon(project.title)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full shrink-0 ${project.status === 'active' ? 'bg-forest' : 'bg-gray-300'}`} />
              <h2 className="text-2xl font-bold text-ink">{project.title}</h2>
            </div>
            {project.desc && <p className="text-sm text-ink/60 mt-1">{project.desc}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-card p-6 border-forest/10 bg-white/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-ink">Progresso do Projeto</span>
            <span className="text-sm font-bold text-forest">{progressCount.percentage}% ({progressCount.progressed}/{progressCount.total})</span>
          </div>
          <div className="h-2.5 bg-black/5 rounded-full overflow-hidden">
            <div className="h-full bg-forest rounded-full transition-all duration-300" style={{ width: `${progressCount.percentage}%` }}></div>
          </div>
          <p className="text-xs text-ink/50 mt-3 font-medium">Contabilizando tarefas em andamento, concluídas e arquivadas.</p>
        </div>

        <div className="glass-card p-6 border-forest/10 bg-white/50 flex flex-col justify-center">
          <span className="text-sm font-bold text-ink mb-3">Status do Projeto</span>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className={`text-sm font-bold ${project.status === 'active' ? 'text-forest' : 'text-ink/60'}`}>
              {project.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={project.status === 'active'}
                onChange={(e) => editProject(project.id, 'status', e.target.checked ? 'active' : 'on-hold')}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${project.status === 'active' ? 'bg-forest' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 border-gray-300 border bg-white w-4 h-4 rounded-full transition-transform transform ${project.status === 'active' ? 'translate-x-4 border-forest top-1' : 'top-1'}`}></div>
            </div>
          </label>
        </div>
      </div>

      <div className="glass-card p-0 border-forest/10 bg-white/50 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-black/5 bg-white/40 flex items-center justify-between">
          <h3 className="font-bold text-ink flex items-center gap-2">
            <Target className="w-4 h-4 text-forest" />
            Tarefas Sincronizadas
          </h3>
        </div>

        <div className="divide-y divide-black/5">
          {projectTasks.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink/50 font-medium">
              Nenhuma tarefa sincronizada. Crie uma abaixo.
            </div>
          ) : (
            projectTasks.map(task => (
              <div key={task.id} className="p-4 flex items-center justify-between hover:bg-white/40 transition-colors group">
                <div className="flex items-center gap-3">
                  <button onClick={() => cycleStatus(task)} className="text-forest hover:opacity-80 transition-opacity">
                    {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : 
                     task.status === 'in-progress' ? <Play className="w-5 h-5 text-amber-500" /> :
                     task.status === 'arquivadas' ? <Circle className="w-5 h-5 text-ink/30" /> :
                     <Circle className="w-5 h-5" />}
                  </button>
                  <span className={`text-[14px] font-medium ${task.status === 'done' || task.status === 'arquivadas' ? 'line-through text-ink/40' : 'text-ink'}`}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/5 text-ink/60">
                    {task.status === 'done' ? 'FINALIZADA' : 
                     task.status === 'in-progress' ? 'EM PROGRESSO' : 
                     task.status === 'arquivadas' ? 'ARQUIVADA' : 'NÃO INICIADA'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-white/30 border-t border-black/5">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Adicionar nova tarefa..." 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-transparent border border-black/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-forest/30"
            />
            <button type="submit" disabled={!newTaskTitle.trim()} className="h-10 px-4 rounded-lg bg-forest text-white flex items-center gap-2 text-sm font-bold disabled:opacity-50 hover:bg-forest/90 transition shadow-sm">
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
