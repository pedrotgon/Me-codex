import React, { useState, useMemo } from 'react';
import { 
  FolderKanban, 
  Search, 
  Filter, 
  X, 
  RotateCcw, 
  Check, 
  Layers, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  Clock, 
  CheckCircle2, 
  CircleDot, 
  Target,
  Sparkles
} from 'lucide-react';
import ViewHeader from '../ViewHeader';
import ProjectsGrid from '../ProjectsGrid';
import ProjectDetailView from './ProjectDetailView';
import { useStore, Project } from '../../store';
import NewItemDialog from '../NewItemDialog';
import { getAreaIcon } from '../../lib/icons';

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'progress-desc' | 'progress-asc' | 'status' | 'area';

export default function ProjectsView() {
  const { addProject, selectedProjectId, setSelectedProjectId, projects, areas, tasks } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<Project['status'][]>([]);
  const [areaFilters, setAreaFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleAddProject = (title: string) => {
    if (title) {
      addProject(title, "Novo projeto criado...", "Inbox");
    }
  };

  // Distinct areas from projects and store
  const availableAreas = useMemo(() => {
    const areaSet = new Set<string>();
    areas.forEach(a => { if (a.name) areaSet.add(a.name); });
    projects.forEach(p => { if (p.area) areaSet.add(p.area); });
    return Array.from(areaSet).sort((a, b) => a.localeCompare(b));
  }, [areas, projects]);

  // Counts by status
  const statusCounts = useMemo(() => {
    return {
      all: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      'on-hold': projects.filter(p => p.status === 'on-hold').length,
      completed: projects.filter(p => p.status === 'completed').length,
    };
  }, [projects]);

  // Counts by area
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableAreas.forEach(area => {
      counts[area] = projects.filter(p => p.area === area).length;
    });
    return counts;
  }, [projects, availableAreas]);

  // Toggle status filter
  const toggleStatusFilter = (status: Project['status']) => {
    setStatusFilters(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Toggle area filter
  const toggleAreaFilter = (area: string) => {
    setAreaFilters(prev => {
      if (prev.includes(area)) {
        return prev.filter(a => a !== area);
      } else {
        return [...prev, area];
      }
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilters([]);
    setAreaFilters([]);
    setSortBy('default');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilters.length > 0 || areaFilters.length > 0 || sortBy !== 'default';

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = (p.desc || '').toLowerCase().includes(q);
        const matchesArea = (p.area || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesArea) return false;
      }

      // Status filter
      if (statusFilters.length > 0) {
        if (!statusFilters.includes(p.status)) return false;
      }

      // Area filter
      if (areaFilters.length > 0) {
        if (!areaFilters.includes(p.area)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'name-desc') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'area') {
        return a.area.localeCompare(b.area);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      if (sortBy === 'progress-desc' || sortBy === 'progress-asc') {
        // Calculate progress for sort
        const getProgress = (proj: Project) => {
          const projectTasks = tasks.filter(t => t.project === proj.title);
          const doneTasks = projectTasks.filter(t => t.status === 'done' || t.status === 'arquivadas').length;
          const inProgress = projectTasks.filter(t => t.status === 'in-progress').length;
          const progressed = doneTasks + inProgress;
          return projectTasks.length === 0 ? (proj.progress || 0) : Math.round((progressed / projectTasks.length) * 100);
        };
        const pA = getProgress(a);
        const pB = getProgress(b);
        return sortBy === 'progress-desc' ? pB - pA : pA - pB;
      }
      return 0; // default order
    });
  }, [projects, tasks, searchQuery, statusFilters, areaFilters, sortBy]);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  if (selectedProject) {
    return <ProjectDetailView project={selectedProject} onBack={() => setSelectedProjectId(null)} />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-16">
      <ViewHeader 
        title="Projetos" 
        description="Esforços com um prazo definido conectados a uma meta ou resultado final."
        icon={FolderKanban}
        action={
          <button 
            onClick={() => setIsDialogOpen(true)} 
            className="h-9 px-4 rounded-xl bg-forest text-white text-[13px] font-bold hover:bg-forest/90 transition shadow-sm flex items-center gap-1.5"
          >
            <span>+</span> Novo Projeto
          </button>
        }
      />

      {/* Filter Bar Component */}
      <section className="glass-card bg-white/80 border border-black/5 rounded-3xl p-5 shadow-sm space-y-4">
        {/* Top Controls: Search, Sort, View Toggle, Clear */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Buscar por nome, descrição ou área..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-8 py-2 bg-black/5 hover:bg-black/[0.07] focus:bg-white rounded-xl text-[13px] text-ink placeholder:text-ink/40 border border-transparent focus:border-forest/20 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink/40 hover:text-ink rounded-full transition-colors"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 border border-transparent hover:border-black/10 transition-colors">
              <ArrowUpDown className="w-3.5 h-3.5 text-ink/50" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Ordenar:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-[12px] font-semibold text-ink outline-none cursor-pointer pr-1"
              >
                <option value="default">Padrão</option>
                <option value="name-asc">Nome (A - Z)</option>
                <option value="name-desc">Nome (Z - A)</option>
                <option value="progress-desc">Maior Progresso (%)</option>
                <option value="progress-asc">Menor Progresso (%)</option>
                <option value="area">Área de Foco</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-black/5 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-forest shadow-xs font-bold' : 'text-ink/50 hover:text-ink'}`}
                title="Visualização em Grade"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-forest shadow-xs font-bold' : 'text-ink/50 hover:text-ink'}`}
                title="Visualização em Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Clear All Filters button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-forest bg-forest/5 hover:bg-forest/10 border border-forest/15 transition-all"
                title="Limpar todos os filtros"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Filters Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-black/5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink/50 shrink-0 min-w-[70px]">
            <CircleDot className="w-3.5 h-3.5 text-forest" />
            <span>Status:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* All Status Pill */}
            <button
              onClick={() => setStatusFilters([])}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                statusFilters.length === 0 
                  ? 'bg-forest text-white shadow-xs' 
                  : 'bg-black/5 hover:bg-black/10 text-ink/70'
              }`}
            >
              <span>Todos</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilters.length === 0 ? 'bg-white/20 text-white' : 'bg-black/5 text-ink/50'}`}>
                {statusCounts.all}
              </span>
            </button>

            {/* Active Pill */}
            <button
              onClick={() => toggleStatusFilter('active')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                statusFilters.includes('active')
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-500/20'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilters.includes('active') ? 'bg-white' : 'bg-emerald-500'}`} />
              <span>Ativos</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilters.includes('active') ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-700'}`}>
                {statusCounts.active}
              </span>
            </button>

            {/* On Hold Pill */}
            <button
              onClick={() => toggleStatusFilter('on-hold')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                statusFilters.includes('on-hold')
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white hover:bg-amber-50 text-amber-800 border-amber-500/20'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilters.includes('on-hold') ? 'bg-white' : 'bg-amber-500'}`} />
              <span>Em Espera</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilters.includes('on-hold') ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-700'}`}>
                {statusCounts['on-hold']}
              </span>
            </button>

            {/* Completed Pill */}
            <button
              onClick={() => toggleStatusFilter('completed')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                statusFilters.includes('completed')
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white hover:bg-blue-50 text-blue-800 border-blue-500/20'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>Concluídos</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilters.includes('completed') ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-700'}`}>
                {statusCounts.completed}
              </span>
            </button>
          </div>
        </div>

        {/* Area of Focus Filters Section */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 pt-2 border-t border-black/5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink/50 shrink-0 min-w-[70px] pt-1">
            <Layers className="w-3.5 h-3.5 text-forest" />
            <span>Área:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* All Areas Pill */}
            <button
              onClick={() => setAreaFilters([])}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                areaFilters.length === 0 
                  ? 'bg-forest text-white shadow-xs' 
                  : 'bg-black/5 hover:bg-black/10 text-ink/70'
              }`}
            >
              <span>Todas as Áreas</span>
            </button>

            {/* Individual Area Pills */}
            {availableAreas.map(areaName => {
              const isSelected = areaFilters.includes(areaName);
              const count = areaCounts[areaName] || 0;
              if (count === 0 && !isSelected) return null;

              return (
                <button
                  key={areaName}
                  onClick={() => toggleAreaFilter(areaName)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-forest text-white border-forest shadow-xs font-bold'
                      : 'bg-white hover:bg-black/5 text-ink/80 border-black/5 shadow-2xs'
                  }`}
                >
                  <span className="shrink-0">{getAreaIcon(areaName)}</span>
                  <span>{areaName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-ink/50'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Tags & Count Result */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-black/5 text-xs text-ink/60 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-ink/80">
              Mostrando <strong className="text-forest font-bold">{filteredProjects.length}</strong> de {projects.length} projetos
            </span>

            {hasActiveFilters && (
              <div className="flex items-center gap-1.5 flex-wrap pl-2 border-l border-black/10">
                {statusFilters.map(status => (
                  <span key={status} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-forest/10 text-forest text-[11px] font-bold">
                    Status: {status === 'active' ? 'Ativo' : status === 'on-hold' ? 'Em Espera' : 'Concluído'}
                    <button onClick={() => toggleStatusFilter(status)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {areaFilters.map(area => (
                  <span key={area} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-forest/10 text-forest text-[11px] font-bold">
                    Área: {area}
                    <button onClick={() => toggleAreaFilter(area)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-forest/10 text-forest text-[11px] font-bold">
                    Busca: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid with Filtered Projects */}
      <ProjectsGrid 
        projectsList={filteredProjects}
        onSelectProject={(p) => setSelectedProjectId(p.id)} 
        viewMode={viewMode}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <NewItemDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onConfirm={handleAddProject} 
        title="Novo Projeto" 
      />
    </div>
  );
}

