import React, { useMemo } from 'react';
import { FolderKanban, CheckCircle2, Clock, AlertCircle, CircleDot, RotateCcw, Calendar, Check } from 'lucide-react';
import { useStore, Project } from '../store';
import { getProjectIcon, getAreaIcon } from '../lib/icons';

interface ProjectsGridProps {
  projectsList?: Project[];
  onSelectProject?: (p: Project) => void;
  viewMode?: 'grid' | 'list';
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

export default function ProjectsGrid({ 
  projectsList, 
  onSelectProject, 
  viewMode = 'grid',
  onResetFilters,
  hasActiveFilters = false
}: ProjectsGridProps) {
  const { projects: storeProjects, tasks } = useStore();
  
  const targetProjects = projectsList !== undefined ? projectsList : storeProjects;

  const projectsWithProgress = useMemo(() => {
    return targetProjects.map(p => {
      const projectTasks = tasks.filter(t => t.project === p.title);
      const doneTasks = projectTasks.filter(t => t.status === 'done' || t.status === 'arquivadas').length;
      const inProgressTasks = projectTasks.filter(t => t.status === 'in-progress').length;
      const progressed = doneTasks + inProgressTasks;
      const total = projectTasks.length;
      const calcProgress = total === 0 ? (p.progress || 0) : Math.round((progressed / total) * 100);
      
      return {
        ...p,
        calculatedProgress: calcProgress,
        doneTasks,
        totalTasks: total
      };
    });
  }, [targetProjects, tasks]);

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ativo
          </span>
        );
      case 'on-hold':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Em Espera
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-700 border border-blue-500/20">
            <Check className="w-3 h-3 text-blue-600" />
            Concluído
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/5 text-ink/60">
            {status}
          </span>
        );
    }
  };

  if (projectsWithProgress.length === 0) {
    return (
      <div className="glass-card bg-white/70 border border-black/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 my-4">
        <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center text-forest/40">
          <FolderKanban className="w-8 h-8" />
        </div>
        <div className="max-w-md">
          <h3 className="font-bold text-lg text-ink">Nenhum projeto encontrado</h3>
          <p className="text-sm text-ink/60 mt-1">
            {hasActiveFilters 
              ? "Nenhum projeto corresponde aos critérios dos filtros selecionados no momento."
              : "Não há projetos cadastrados nesta seção."}
          </p>
        </div>
        {hasActiveFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-white text-xs font-bold hover:bg-forest/90 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpar Filtros
          </button>
        )}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-2.5">
        {projectsWithProgress.map(p => (
          <div
            key={p.id}
            onClick={() => onSelectProject && onSelectProject(p)}
            className="group glass-card bg-white/80 hover:bg-white border border-black/5 hover:border-forest/30 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-forest/5 flex items-center justify-center text-[20px] group-hover:scale-105 transition-transform">
                {getProjectIcon(p.title)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-[14px] text-ink group-hover:text-forest transition-colors truncate">
                    {p.title}
                  </h4>
                  {getStatusBadge(p.status)}
                </div>
                {p.desc && <p className="text-xs text-ink/50 line-clamp-1 mt-0.5">{p.desc}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 sm:self-center justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-black/5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/5 text-ink/70 text-xs font-medium">
                <span className="shrink-0">{getAreaIcon(p.area)}</span>
                <span>{p.area}</span>
              </div>

              {p.totalTasks > 0 && (
                <div className="text-xs text-ink/50 font-medium">
                  {p.doneTasks}/{p.totalTasks} tarefas
                </div>
              )}

              <div className="w-28 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-ink/60">
                  <span>Progresso</span>
                  <span>{p.calculatedProgress}%</span>
                </div>
                <div className="h-1.5 bg-black/5 rounded-full overflow-hidden w-full">
                  <div 
                    className="h-full bg-forest rounded-full transition-all duration-300"
                    style={{ width: `${p.calculatedProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projectsWithProgress.map(p => (
        <div 
          key={p.id} 
          onClick={() => onSelectProject && onSelectProject(p)}
          className="group glass-card bg-white border border-black/5 hover:border-forest/30 p-5 rounded-3xl cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-forest/0 via-forest/0 to-forest/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div>
            <div className="flex items-start gap-3 relative">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-forest/5 flex items-center justify-center text-[20px] group-hover:scale-110 transition-transform">
                {getProjectIcon(p.title)}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-[14px] leading-snug text-ink group-hover:text-forest transition-colors truncate">
                    {p.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {getStatusBadge(p.status)}
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-black/5 text-ink/70 bg-white/80 shadow-2xs">
                    <span className="shrink-0 text-xs">{getAreaIcon(p.area)}</span>
                    <span className="truncate max-w-[100px]">{p.area}</span>
                  </span>
                </div>
                {p.desc && <p className="text-[12px] font-medium text-ink/50 mt-2 line-clamp-2">{p.desc}</p>}
              </div>
            </div>
          </div>
          
          <div className="mt-5 relative pt-2 border-t border-black/5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-ink/50 uppercase tracking-wider">
                <span>Progresso</span>
                {p.totalTasks > 0 && (
                  <span className="text-ink/40 font-normal lowercase">({p.doneTasks}/{p.totalTasks} tarefas)</span>
                )}
              </div>
              <span className="text-[11px] font-bold text-ink/70">{p.calculatedProgress}%</span>
            </div>
            <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-forest rounded-full transition-all duration-300" 
                style={{ width: `${p.calculatedProgress}%` }}
              />
            </div>
            {p.deadline && p.deadline !== '-' && (
              <div className="mt-2.5 flex items-center gap-1 text-[10px] font-medium text-ink/40">
                <Calendar className="w-3 h-3 text-ink/30" />
                <span>Prazo: {p.deadline}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

