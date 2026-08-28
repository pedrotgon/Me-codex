import React from 'react';
import { CalendarDays, Target, TrendingUp, Sparkles, CheckCircle2, ChevronRight, Edit3 } from 'lucide-react';
import { useStore } from '../../store';

export default function WeeksView() {
  const { tasks } = useStore();
  const weekTasks = tasks.filter(t => t.executionDate === 'This Week');
  const doneTasks = weekTasks.filter(t => t.status === 'done').length;
  const progress = weekTasks.length > 0 ? Math.round((doneTasks / weekTasks.length) * 100) : 0;

  const now = new Date();
  const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  };
  const weekNum = getWeekNumber(now);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-20">
      
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-forest text-white text-[10px] font-bold uppercase tracking-widest hidden md:inline-block">Week {weekNum}</span>
            <span className="text-ink/40 text-[13px] font-semibold">12 de Maio — 18 de Maio</span>
          </div>
          <h1 className="text-3xl font-bold text-forest tracking-tight flex items-center gap-3">
            <CalendarDays className="w-8 h-8 opacity-80" />
            Weekly Planner
          </h1>
        </div>
        <button className="h-10 px-5 rounded-xl bg-forest text-white text-[13px] font-bold hover:bg-forest/90 transition shadow-sm flex items-center gap-2">
          <Edit3 className="w-4 h-4" /> Iniciar Planejamento
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gradient-to-tr from-forest to-[#1A3A32] rounded-[24px] p-8 text-white relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
            <div>
              <h3 className="text-emerald-300 text-[12px] font-bold uppercase tracking-widest mb-1 shadow-sm">Foco da Semana</h3>
              <p className="text-2xl font-semibold leading-tight max-w-lg shadow-sm">Consolidar a captura diária, revisar arquivos pendentes e estruturar o projeto de migração Alpha.</p>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[12px] font-medium text-white/60">Progresso de Tarefas da Semana</span>
                <span className="text-[14px] font-bold">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-ink/40 mb-4">
            <Target className="w-4 h-4" />
            <h3 className="text-[12px] font-bold uppercase tracking-wider">Metas da Semana</h3>
          </div>
          <div className="flex-1 space-y-3">
            {[
              { text: 'Finalizar documentação v2', done: true },
              { text: 'Treino 4x na semana', done: false },
              { text: 'Limpar Inbox até Sexta', done: false }
            ].map((m, i) => (
              <label key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${m.done ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-black/5 hover:border-black/10'}`}>
                <input type="checkbox" checked={m.done} readOnly className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 border-black/20" />
                <span className={`text-[13px] font-medium leading-snug ${m.done ? 'text-emerald-800 line-through opacity-70' : 'text-ink'}`}>{m.text}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Retro */}
        <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-ink/40">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-[12px] font-bold uppercase tracking-wider">Retrospectiva Semanal</h3>
            </div>
            <button className="h-8 px-4 bg-forest text-white text-[11px] font-bold rounded-lg shadow-sm hover:bg-forest/90 transition-colors">
              Salvar Entrada
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-ink/70 mb-1.5 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> O que funcionou bem?</label>
              <textarea 
                className="w-full bg-[#fbfcfc] border border-black/5 rounded-xl p-3 text-[13px] text-ink min-h-[80px] focus:outline-none focus:ring-2 focus:ring-forest/20 focus:bg-white transition-all resize-none"
                placeholder="Ex: Conseguir acordar às 6h me deu mais tempo focado..."
                defaultValue="O time-blocking na parte da manhã funcionou perfeitamente para escrever o relatório sem interrupções."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-[12px] font-bold text-ink/70 mb-1.5 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-red-400 rotate-180" /> O que não funcionou?</label>
              <textarea 
                className="w-full bg-[#fbfcfc] border border-black/5 rounded-xl p-3 text-[13px] text-ink min-h-[80px] focus:outline-none focus:ring-2 focus:ring-forest/20 focus:bg-white transition-all resize-none"
                placeholder="Ex: Procrastinei muito depois do almoço..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-[12px] font-bold text-ink/70 mb-1.5 flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-amber-500" /> O que vou melhorar para a próxima semana?</label>
              <textarea 
                className="w-full bg-[#fbfcfc] border border-black/5 rounded-xl p-3 text-[13px] text-ink min-h-[80px] focus:outline-none focus:ring-2 focus:ring-forest/20 focus:bg-white transition-all resize-none"
                placeholder="Ex: Vou usar a técnica Pomodoro à tarde..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* This Week's Tasks */}
        <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-sm flex flex-col h-full">
           <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-ink/40">
              <CheckCircle2 className="w-4 h-4" />
              <h3 className="text-[12px] font-bold uppercase tracking-wider">Ações Agendadas</h3>
            </div>
            <span className="text-[11px] font-bold bg-forest/5 text-forest px-2 py-0.5 rounded-full">{weekTasks.length} Ações</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {weekTasks.length > 0 ? (
              weekTasks.map(task => (
                <div key={task.id} className="group flex items-center gap-3 p-3 rounded-xl border border-black/5 hover:border-black/10 bg-[#fbfcfc] hover:bg-white transition-colors cursor-pointer">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${task.status === 'done' ? 'border-emerald-500 bg-emerald-500' : 'border-ink/20'}`}>
                    {task.status === 'done' && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-medium truncate ${task.status === 'done' ? 'text-ink/40 line-through' : 'text-ink'}`}>{task.title}</p>
                    {task.project && (
                      <p className="text-[10px] text-ink/40 truncate flex items-center gap-1 mt-0.5">
                        <FolderIcon /> {task.project}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink/20 group-hover:text-ink/40" />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-ink/40 space-y-2 py-8">
                <CalendarDays className="w-8 h-8 opacity-20" />
                <p className="text-[13px]">Nenhuma ação agendada para 'This Week'.</p>
                <button className="text-[12px] font-bold text-forest hover:underline">Ver Inbox Global</button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}
