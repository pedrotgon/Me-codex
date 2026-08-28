import React, { useMemo, useState } from 'react';
import { useStore } from '../../store';
import { FolderKanban, CheckCircle2, Layers, Library, Flame, Activity, PieChart, TrendingUp, Calendar as CalIcon, ChevronRight, X } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { getProjectIcon, getAreaIcon, formatNaipe } from '../../lib/icons';

export default function HomeView() {
  const { tasks, projects, areas, resources, habits, toggleHabit, currentView, setCurrentView, setSelectedProjectId } = useStore();
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  // Metrics calculation
  const activeProjects = projects.filter(p => p.status === 'active');
  const activeProjectNames = new Set(activeProjects.map(p => p.title));
  const tasksForCompletion = tasks.filter(t => t.project && activeProjectNames.has(t.project));
  const doneTasks = tasksForCompletion.filter(t => t.status === 'done' || t.status === 'arquivadas');
  const pendingTasks = tasksForCompletion.filter(t => t.status !== 'done' && t.status !== 'arquivadas');
  const completionRate = tasksForCompletion.length > 0 ? Math.round((doneTasks.length / tasksForCompletion.length) * 100) : 0;
  const totalTokens = tasks.reduce((acc, t) => acc + (parseInt(t.battleTokens || '0') || 0), 0);
  
  // Tasks by Area Data for PieChart
  const areaTaskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      const area = t.area && t.area !== '-' ? t.area : 'Sem Área';
      counts[area] = (counts[area] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [tasks]);

  const COLORS = ['#1d3c34', '#2a554a', '#3e7c6b', '#62a492', '#9fcdbe', '#d6eae4', '#e2e8f0'];

  // Calculate Habits total streak
  const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);
  const daysOfWeek = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const todayIndex = new Date().getDay();

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-7xl mx-auto pb-10">
      
      {/* Header Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'projects', icon: FolderKanban, label: 'Projetos Ativos', value: activeProjects.length, sub: `${projects.length} totais`, color: 'text-emerald-700', bg: 'bg-emerald-50', hover: 'hover:border-emerald-500/30' },
          { id: 'completion', icon: CheckCircle2, label: 'Taxa de Conclusão', value: `${completionRate}%`, sub: `${pendingTasks.length} pendentes`, color: 'text-forest', bg: 'bg-forest/10', hover: 'hover:border-forest/40' },
          { id: 'areas', icon: Layers, label: 'Áreas Foco', value: areas.length, sub: 'Monitoradas', color: 'text-blue-700', bg: 'bg-blue-50', hover: 'hover:border-blue-500/30' },
          { id: 'resources', icon: Library, label: 'Recursos', value: resources.length, sub: 'No Cofre', color: 'text-amber-700', bg: 'bg-amber-50', hover: 'hover:border-amber-500/30' }
        ].map((m, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedKpi(m.id)}
            className={`bg-white rounded-[24px] p-5 lg:p-6 border border-forest/10 shadow-sm flex flex-col gap-3 cursor-pointer transition-all hover:shadow-md ${m.hover}`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg} ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold text-ink/40 bg-black/5 px-2 py-0.5 rounded-lg">{m.sub}</span>
            </div>
            <div>
              <div className="text-[28px] font-bold text-ink tracking-tight">{m.value}</div>
              <div className="text-[12px] font-bold text-ink/50 uppercase tracking-widest">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column - Projects & Chart */}
        <div className="xl:col-span-2 flex flex-col gap-6 lg:gap-8">
          
          {/* Projects Pulse */}
          <div className="bg-white rounded-[32px] p-6 lg:p-8 border border-forest/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest/5 text-forest flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[18px] text-ink leading-tight">Projetos em Andamento</h3>
                  <p className="text-[11px] font-bold text-ink/40 uppercase tracking-widest mt-0.5">Top Projetos Ativos</p>
                </div>
              </div>
              <button onClick={() => { setSelectedProjectId(null); setCurrentView('projects'); }} className="text-[12px] font-bold text-forest hover:bg-forest/5 px-3 py-1.5 rounded-xl transition-colors">
                Ver todos
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeProjects
                .map(p => {
                  const projTasks = tasks.filter(t => t.project === p.title);
                  const progressed = projTasks.filter(t => t.status !== 'not-started').length;
                  const pRate = projTasks.length > 0 ? Math.round((progressed / projTasks.length) * 100) : 0;
                  return { ...p, pRate };
                })
                .sort((a, b) => b.pRate - a.pRate)
                .slice(0, 4)
                .map(p => {
                
                return (
                  <div 
                    key={p.id} 
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setCurrentView('projects');
                    }}
                    className="group cursor-pointer p-5 rounded-[20px] bg-[#f8f9fa] border border-forest/5 hover:border-forest/20 hover:shadow-sm transition-all flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl shrink-0">{getProjectIcon(p.title) || '🎯'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === 'active' ? 'bg-forest' : 'bg-gray-300'}`} />
                            <div className="text-[14px] font-bold text-ink truncate group-hover:text-forest transition-colors">{p.title}</div>
                          </div>
                          <div className="text-[11px] font-bold text-ink/40 uppercase truncate mt-0.5 ml-3.5">{p.area || 'Diversos'}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Progresso</span>
                         <span className="text-[12px] font-bold text-forest">{p.pRate}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-forest/10 rounded-full overflow-hidden">
                        <div className="h-full bg-forest rounded-full transition-all duration-500 delay-100" style={{ width: `${p.pRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {activeProjects.length === 0 && (
                <div className="col-span-2 py-8 text-center text-ink/40 font-medium text-sm">Nenhum projeto ativo.</div>
              )}
            </div>
          </div>

          {/* Areas Breakdown Chart */}
          <div className="bg-white rounded-[32px] p-6 lg:p-8 border border-forest/10 shadow-sm flex flex-col items-center">
             <div className="w-full flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest/5 text-forest flex items-center justify-center">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[18px] text-ink leading-tight">Distribuição de Tarefas</h3>
                    <p className="text-[11px] font-bold text-ink/40 uppercase tracking-widest mt-0.5">Visão por Área</p>
                  </div>
                </div>
             </div>
             
             <div className="w-full flex flex-col md:flex-row gap-8 items-center">
               <div className="w-[200px] h-[200px] shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                   <RechartsPieChart>
                     <Pie
                       data={areaTaskCounts}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={90}
                       stroke="none"
                       paddingAngle={3}
                       dataKey="value"
                     >
                       {areaTaskCounts.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                       itemStyle={{ color: '#1d3c34', fontWeight: 'bold' }}
                     />
                   </RechartsPieChart>
                 </ResponsiveContainer>
               </div>
               
               <div className="flex-1 w-full flex flex-col gap-3">
                 {areaTaskCounts.slice(0, 5).map((item, idx) => {
                   const total = areaTaskCounts.reduce((acc, curr) => acc + curr.value, 0);
                   const pc = Math.round((item.value / total) * 100);
                   return (
                   <div key={idx} className="flex items-center justify-between gap-3 text-[12px] font-bold w-full">
                     <div className="flex items-center gap-2 min-w-0">
                       <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                       <span className="text-ink truncate">{item.name}</span>
                     </div>
                     <div className="flex items-center gap-2 shrink-0">
                       <span className="text-ink/60 bg-[#f8f9fa] px-2 py-0.5 rounded-md min-w-[32px] text-center">{item.value}</span>
                       <span className="text-[10px] font-bold text-ink/40 w-8 text-right">{pc}%</span>
                     </div>
                   </div>
                 )})}
               </div>
             </div>
          </div>
        </div>

        {/* Right Column - Habits & Quick Stats */}
        <div className="flex flex-col gap-6 lg:gap-8">
          
          {/* Quick Stats list */}
          <div className="bg-white rounded-[32px] p-6 border border-forest/10 shadow-sm relative overflow-hidden">
            <h3 className="font-bold text-[16px] text-ink mb-1 relative z-10 flex items-center gap-2">
              <CalIcon className="w-4 h-4 text-forest" /> Radar do Dia
            </h3>
            <p className="text-[11px] font-bold text-ink/40 uppercase tracking-widest mb-4 relative z-10">Foco imediato</p>
            
            <div className="flex flex-col gap-2 relative z-10">
              {tasks.filter(t => t.executionDate === 'hoje' || t.deadline === 'hoje' || (t.executionDate?.includes(new Date().getDate().toString()))).slice(0, 4).map(t => (
                <div key={t.id} className="group flex items-center justify-between p-3 rounded-[16px] bg-[#f8f9fa] border border-forest/5 hover:border-forest/20 transition-all cursor-pointer">
                   <div className="flex items-center gap-3 truncate pr-4">
                     <div className="shrink-0 text-base leading-none flex items-center justify-center w-5 font-mono text-[12px]">{t.naipe ? formatNaipe(t.naipe) : <CheckCircle2 className="w-3.5 h-3.5 text-forest/40" />}</div>
                     <span className="text-[13px] font-bold text-ink truncate group-hover:text-forest transition-colors">{t.title}</span>
                   </div>
                </div>
              ))}
              {tasks.filter(t => t.executionDate === 'hoje' || t.deadline === 'hoje' || (t.executionDate?.includes(new Date().getDate().toString()))).length === 0 && (
                <div className="text-center py-6 text-[13px] font-bold text-ink/30 bg-[#f8f9fa] rounded-2xl border border-dashed border-forest/10">Radar livre hoje.</div>
              )}
            </div>
            
            <button onClick={() => setCurrentView('tasks')} className="w-full mt-3 text-[12px] font-bold text-forest bg-forest/5 py-2.5 rounded-xl hover:bg-forest/10 transition-colors flex items-center justify-center gap-2">
               Ver Agenda Completa <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Simple Habits list */}
          <div className="bg-white rounded-[32px] p-6 border border-forest/10 shadow-sm relative">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-[16px] text-ink leading-tight flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Hábitos
                </h3>
              </div>
              <div className="text-[11px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                {totalStreak} 🔥
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {habits.map((habit) => {
                const isCompleted = !!habit.days[todayIndex === 0 ? 6 : todayIndex - 1]; // naive "today" check
                
                return (
                <div key={habit.id} className="flex items-center justify-between p-2.5 rounded-[16px] bg-[#f8f9fa] border border-forest/5 transition-all hover:bg-forest/5">
                  <div className="flex items-center gap-3">
                    <span className="text-[18px]">{habit.icon}</span>
                    <span className="text-[13px] font-bold text-ink">{habit.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-ink/40 w-4 string-center">{habit.streak}d</span>
                    <button 
                      onClick={() => toggleHabit(habit.id, todayIndex === 0 ? 6 : todayIndex - 1)}
                      className={`w-7 h-7 rounded-lg transition-all flex items-center justify-center shrink-0 border-2 ${isCompleted ? 'bg-forest border-forest text-white' : 'border-ink/20 hover:border-forest/50'}`}
                    >
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )})}
            </div>
          </div>
          
        </div>
      </div>

      {/* KPI Details Modal */}
      {selectedKpi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setSelectedKpi(null)}></div>
          <div className="relative bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in flip-in-y zoom-in-95 duration-300">
            
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <h2 className="font-bold text-[20px] text-ink capitalize">
                Detalhes: {selectedKpi === 'projects' ? 'Projetos' : selectedKpi === 'completion' ? 'Tarefas' : selectedKpi === 'areas' ? 'Áreas' : 'Recursos'}
              </h2>
              <button onClick={() => setSelectedKpi(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-ink/60" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {selectedKpi === 'projects' && (
                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl mb-2 font-bold text-sm">
                    {activeProjects.length} de {projects.length} projetos estão ativos e em andamento.
                  </div>
                  {projects.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-[#f8f9fa] hover:bg-forest/5 border border-forest/5 rounded-[16px] transition-colors cursor-default">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-forest/10 text-xl shrink-0">
                           {getProjectIcon(p.title) || '🎯'}
                         </div>
                         <div className="flex flex-col gap-0.5">
                            <div className="font-bold text-[14px] text-ink leading-tight">{p.title}</div>
                            <div className="font-semibold tracking-widest text-[10px] text-ink/40 uppercase">{p.status}</div>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedKpi === 'completion' && (
                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-forest/10 text-forest rounded-2xl mb-2 font-bold text-sm">
                    Concluídas {doneTasks.length} de {tasksForCompletion.length} tarefas de projetos ativos.
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-[12px] uppercase text-ink/50 mb-1 mt-2">Últimas Tarefas Concluídas</h4>
                    {doneTasks.slice(0, 10).map(t => (
                      <div key={t.id} className="flex items-center gap-3 p-3 bg-[#f8f9fa] hover:bg-forest/5 border border-forest/5 rounded-[16px] transition-colors cursor-default">
                        <CheckCircle2 className="w-5 h-5 text-forest shrink-0" />
                        <span className="text-[13px] font-bold text-ink/70 line-through truncate">{t.title}</span>
                      </div>
                    ))}
                    {doneTasks.length === 0 && <span className="text-[12px] font-bold text-ink/40">Nenhuma tarefa marcada como concluída.</span>}
                  </div>
                </div>
              )}

              {selectedKpi === 'areas' && (
                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl mb-2 font-bold text-sm">
                    {areas.length} áreas mapeadas em seu sistema PARA.
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {areas.map(a => (
                      <div key={a.id} className="flex flex-col gap-2 p-4 border border-forest/5 bg-[#f8f9fa] hover:bg-forest/5 transition-colors rounded-[20px]">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-forest/10 text-xl">
                          {getAreaIcon(a.name) || '🎯'}
                        </div>
                        <span className="font-bold text-[14px] text-ink">{a.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedKpi === 'resources' && (
                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl mb-2 font-bold text-sm">
                    {resources.length} recursos arquivados e estruturados.
                  </div>
                  {resources.slice(0, 15).map((r: any) => (
                    <div key={r.id} className="flex items-center gap-4 p-4 border border-forest/5 bg-[#f8f9fa] hover:bg-forest/5 transition-colors rounded-[16px]">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-forest/10 text-amber-600 shrink-0">
                        <Library className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0 gap-0.5">
                         <span className="font-bold text-[13px] text-ink truncate relative -top-0.5">{r.title}</span>
                         <span className="font-semibold text-[11px] text-ink/40 truncate">{r.link || 'Sem link'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-black/5 bg-[#f8f9fa]">
              <button 
                onClick={() => {
                  setSelectedKpi(null);
                  if (selectedKpi === 'projects') setCurrentView('projects');
                  else if (selectedKpi === 'completion') setCurrentView('tasks');
                  else if (selectedKpi === 'areas') setCurrentView('areas');
                  else setCurrentView('recursos');
                }}
                className="w-full py-3 bg-forest text-white rounded-xl font-bold text-[14px] hover:bg-forest/90 transition-colors"
              >
                Abrir Visualização
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}

