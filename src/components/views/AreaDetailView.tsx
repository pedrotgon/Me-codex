import React from 'react';
import { Layers, ArrowLeft, FolderKanban, CheckSquare, FileText } from 'lucide-react';
import { useStore, Area } from '../../store';
import { getAreaIcon, getProjectIcon } from '../../lib/icons';

interface Props {
  area: Area;
  onBack: () => void;
}

export default function AreaDetailView({ area, onBack }: Props) {
  const { projects, tasks, resources, setSelectedProjectId, setCurrentView } = useStore();

  const areaProjects = projects.filter(p => p.area === area.name);
  const areaTasks = tasks.filter(t => t.area === area.name && t.status !== 'arquivadas');
  const areaResources = resources.filter(r => {
    const areas = Array.isArray(r.area) ? r.area : (r.area ? [r.area] : []);
    return areas.includes(area.name);
  });

  const completedProjects = areaProjects.filter(p => p.status === 'completed').length;

  const handleOpenProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('projects');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full animate-fade-in pb-12">
      {/* Header */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[13px] font-bold text-ink/40 hover:text-ink w-fit transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Áreas
      </button>

      <div className="flex items-center gap-4 mt-2 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center text-[32px]">
          {getAreaIcon(area.name)}
        </div>
        <div>
          <h1 className="text-[28px] font-black tracking-tight text-ink leading-none">{area.name}</h1>
          <p className="text-[13px] text-ink/50 font-medium mt-2 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            {areaProjects.length} Projetos • {areaTasks.length} Tarefas • {areaResources.length} Recursos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Projects */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <section className="bg-white border border-forest/10 rounded-3xl p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-ink mb-4 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-forest" />
              Projetos da Área
            </h2>
            
            {areaProjects.length === 0 ? (
              <div className="py-8 text-center text-[13px] font-medium text-ink/40">
                Nenhum projeto associado a esta área.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {areaProjects.map(proj => {
                  const pTasks = tasks.filter(t => t.project === proj.title);
                  const pCompleted = pTasks.filter(t => t.status === 'done').length;
                  const pProgress = pTasks.length > 0 ? (pCompleted / pTasks.length) * 100 : proj.progress;

                  return (
                    <button
                      key={proj.id}
                      onClick={() => handleOpenProject(proj.id)}
                      className="group flex flex-col text-left p-4 rounded-2xl border border-black/5 hover:border-forest/30 hover:shadow-md bg-white transition-all overflow-hidden relative"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center text-[20px] shrink-0">
                          {getProjectIcon(proj.title)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[14px] font-bold text-ink truncate group-hover:text-forest transition-colors">
                            {proj.title}
                          </h3>
                          <p className="text-[12px] font-medium text-ink/40 mt-0.5 flex items-center gap-1">
                            {proj.status === 'active' ? 'Em andamento' : proj.status === 'completed' ? 'Concluído' : 'Pausado'}
                          </p>
                        </div>
                      </div>

                      <div className="w-full mt-auto">
                        <div className="flex justify-between text-[10px] font-bold text-ink/50 uppercase tracking-wider mb-1.5">
                          <span>Progresso</span>
                          <span>{Math.round(pProgress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-forest rounded-full transition-all duration-500"
                            style={{ width: `${pProgress}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-white border border-forest/10 rounded-3xl p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-ink mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-forest" />
              Tarefas Avulsas
            </h2>
            <div className="flex flex-col gap-2">
              {areaTasks.filter(t => !t.project).length === 0 ? (
                <div className="py-4 text-center text-[13px] font-medium text-ink/40">
                  Nenhuma tarefa avulsa nesta área.
                </div>
              ) : (
                areaTasks.filter(t => !t.project).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl border border-black/5">
                    <div className="w-4 h-4 rounded border border-ink/20 flex items-center justify-center">
                      {task.status === 'done' && <div className="w-2.5 h-2.5 rounded-sm bg-forest" />}
                    </div>
                    <span className="text-[13px] font-medium text-ink leading-snug">{task.title}</span>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Info & Resources */}
        <div className="flex flex-col gap-6">
          <section className="bg-nude rounded-3xl p-6 border border-black/5">
            <h3 className="text-[12px] font-bold text-ink/50 uppercase tracking-wider mb-4">Informações</h3>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-bold text-ink/40 uppercase mb-1">Status</p>
                <p className="text-[13px] font-bold text-ink flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Ativa
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-ink/40 uppercase mb-1">Taxa de Conclusão (Projetos)</p>
                <p className="text-[13px] font-bold text-ink">
                  {areaProjects.length > 0 ? Math.round((completedProjects / areaProjects.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-forest/10 rounded-3xl p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-ink mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-forest" />
              Recursos
            </h2>
            <div className="flex flex-col gap-2">
              {areaResources.length === 0 ? (
                <div className="py-4 text-center text-[13px] font-medium text-ink/40">
                  Nenhum recurso anexado.
                </div>
              ) : (
                areaResources.map(res => (
                  <div key={res.id} className="flex items-center gap-2 p-3 text-[13px] font-medium text-ink rounded-xl hover:bg-black/5 cursor-pointer transition-colors">
                    <FileText className="w-4 h-4 text-ink/40 shrink-0" />
                    <span className="truncate">{res.title}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
