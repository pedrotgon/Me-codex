import React from 'react';
import { Target, Activity, Flame, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { useStore } from '../store';
import { isToday } from '../lib/dateUtils';

const KpiCard = ({ icon: Icon, label, value, trend, trendLabel, colorClass, borderClass }: any) => (
  <div className={`glass-card p-5 border ${borderClass} bg-white/70 hover:bg-white transition-all`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${colorClass} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      {trend && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 text-ink/60">
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-ink leading-none">{value}</h3>
      <p className="text-[12px] font-medium text-ink/50 mt-1">{label}</p>
      {trendLabel && <p className="text-[10px] font-bold text-ink/30 mt-2 uppercase tracking-wide">{trendLabel}</p>}
    </div>
  </div>
);

export default function Metrics() {
  const { tasks, projects, habits, setCurrentView } = useStore();
  
  const inboxCount = tasks.filter(t => t.area === 'Inbox' || t.area === 'Arquivos Pendentes').length;
  const isZeroInbox = inboxCount === 0;

  const activeProjects = projects.filter(p => p.status === 'em-andamento').length;
  const completedProjects = projects.filter(p => p.status === 'concluido').length;
  
  const currentHighestStreak = Math.max(...habits.map(h => h.streak), 0);

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-ink">Visão Geral do Cérebro</h2>
        </div>
        <button 
          onClick={() => setCurrentView('analytics-completo')}
          className="text-[11px] font-bold text-forest hover:text-forest/70 flex items-center gap-1 transition-colors"
        >
          Analytics Completo <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        <KpiCard 
          icon={Zap}
          label="Caixa de Entrada"
          value={isZeroInbox ? 'Zero Inbox! 🎉' : `${inboxCount} itens`}
          trend={isZeroInbox ? '+50xp' : 'Revisão Necessária'}
          trendLabel="Estado do Buffer"
          colorClass={isZeroInbox ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}
          borderClass={isZeroInbox ? 'border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-amber-500/20'}
        />
        
        <KpiCard 
          icon={Target}
          label="Projetos Ativos"
          value={activeProjects}
          trend={`${completedProjects} concluídos`}
          trendLabel="Taxa de Foco"
          colorClass="bg-blue-100 text-blue-600"
          borderClass="border-blue-500/10"
        />

        <KpiCard 
          icon={Flame}
          label="Maior Ofensiva"
          value={`${currentHighestStreak} dias`}
          trend="Hábitos"
          trendLabel="Consistência Diária"
          colorClass="bg-orange-100 text-orange-600"
          borderClass="border-orange-500/10"
        />

        <KpiCard 
          icon={CheckCircle2}
          label="Tarefas Hoje"
          value={tasks.filter(t => isToday(t.executionDate)).length}
          trend={`${tasks.filter(t => t.status === 'done' && isToday(t.executionDate)).length} concluidas`}
          trendLabel="Prioridades"
          colorClass="bg-purple-100 text-purple-600"
          borderClass="border-purple-500/10"
        />
      </div>

      {/* Metas Norte - Progress Bars Inspired by Notion */}
      <div className="mt-6 glass-card p-5 border border-forest/10 bg-white/70">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-ink/50 mb-5">Metas Norte (OKRs)</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-[13px] font-bold text-ink">Lançar MVP do SaaS</span>
              <span className="text-[11px] font-bold text-forest">68%</span>
            </div>
            <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-forest rounded-full transition-all duration-1000" style={{ width: '68%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-[13px] font-bold text-ink">Correr 10km direto</span>
              <span className="text-[11px] font-bold text-forest">45%</span>
            </div>
            <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-forest rounded-full transition-all duration-1000" style={{ width: '45%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-[13px] font-bold text-ink">Ler 12 livros no ano</span>
              <span className="text-[11px] font-bold text-forest">72%</span>
            </div>
            <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-forest rounded-full transition-all duration-1000" style={{ width: '72%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
