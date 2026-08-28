import React from 'react';
import { Repeat2, TrendingUp, Target, Flame, Activity, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Moon, Sun, Coffee } from 'lucide-react';
import HabitsTracker from '../HabitsTracker';
import ViewHeader from '../ViewHeader';
import { useStore } from '../../store';

export default function HabitosView() {
  const { habits } = useStore();
  
  const totalHabits = habits.length;
  const currentHighestStreak = Math.max(...habits.map(h => h.streak), 0);
  const todayCompletions = habits.filter(h => h.days[6] === 1).length;
  const completionRate = Math.round((todayCompletions / totalHabits) * 100) || 0;
  const weekSuccess = Math.round((habits.reduce((acc, h) => acc + h.days.filter(Boolean).length, 0) / (habits.length * 7)) * 100) || 0;

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-forest tracking-tight flex items-center gap-3">
            <Repeat2 className="w-8 h-8 opacity-80" />
            Sistema de Hábitos
          </h1>
          <p className="text-ink/60 mt-2 text-[14px]">
            Acompanhe sua consistência diária, mantenha suas ofensivas ativas e construa disciplina.
          </p>
        </div>
        <button className="h-10 px-5 rounded-xl bg-forest text-white text-[13px] font-bold hover:bg-forest/90 transition shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Hábito
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-2 text-ink/40 mb-3">
            <h3 className="text-[12px] font-bold uppercase tracking-wider">Desempenho Hoje</h3>
          </div>
          <p className="text-4xl font-black text-forest leading-none tracking-tight">{todayCompletions} <span className="text-lg font-bold text-forest/30">/ {totalHabits}</span></p>
          <div className="mt-5 w-full h-2.5 bg-[#f0f3f1] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Flame className="w-16 h-16 text-forest" />
          </div>
          <div className="flex items-center gap-2 text-ink/40 mb-3">
             <h3 className="text-[12px] font-bold uppercase tracking-wider">Maior Ofensiva</h3>
          </div>
          <p className="text-4xl font-black text-forest leading-none tracking-tight">{currentHighestStreak} <span className="text-lg font-bold text-forest/30">dias</span></p>
          <p className="text-[12px] text-ink/40 font-medium mt-3 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" /> Pessoal</p>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Activity className="w-16 h-16" />
          </div>
          <div className="flex items-center gap-2 text-ink/40 mb-3">
            <h3 className="text-[12px] font-bold uppercase tracking-wider">Taxa Padrão</h3>
          </div>
          <p className="text-4xl font-black text-forest leading-none tracking-tight">{weekSuccess}%</p>
          <p className="text-[12px] text-ink/40 font-medium mt-3 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Média de 7 dias</p>
        </div>
        
        <div className="bg-gradient-to-br from-forest to-[#1a3c34] rounded-[24px] p-6 shadow-sm relative overflow-hidden text-white flex flex-col justify-between">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Sessões</h3>
            </div>
            <p className="text-[14px] font-medium text-white/90 leading-snug">Você completou todas rotinas matinais esta semana!</p>
          </div>
          <div className="flex gap-2">
            <div className="h-8 flex-1 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold font-mono"><Sun className="w-3.5 h-3.5 mr-1" /> 5/5</div>
            <div className="h-8 flex-1 rounded-lg bg-black/20 flex items-center justify-center text-xs font-bold font-mono"><Moon className="w-3.5 h-3.5 mr-1" /> 2/5</div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[16px] font-bold text-forest">Tracker Semanal</h2>
          <div className="flex items-center gap-2 bg-white px-1 py-1 rounded-lg border border-black/5 shadow-sm">
            <button className="p-1 hover:bg-black/5 rounded text-ink/40 hover:text-ink"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-[12px] font-bold px-2">Esta Semana</span>
            <button className="p-1 hover:bg-black/5 rounded text-ink/40 hover:text-ink"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <HabitsTracker />
      </div>

    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
