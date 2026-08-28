import React, { useState } from 'react';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { isToday, isPast } from '../lib/dateUtils';

export default function TakeActionList() {
  const { tasks, toggleTask, deleteTask } = useStore();
  const [filter, setFilter] = useState<'todas' | 'hoje' | 'pendentes' | 'dead tasks' | 'sem data'>('hoje'); // Default to hoje as requested?

  const filteredTasks = tasks.filter(t => {
    if (filter === 'hoje') return isToday(t.executionDate);
    if (filter === 'pendentes') return t.status !== 'done';
    if (filter === 'sem data') return !t.executionDate || t.executionDate === '-' || t.executionDate === '' || t.executionDate.toLowerCase() === 'sem data';
    if (filter === 'dead tasks') return t.status !== 'done' && isPast(t.executionDate); 
    return true;
  });

  return (
    <section className="bg-white rounded-[32px] p-8 flex-1 flex flex-col border border-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-[18px] flex items-center gap-2 text-ink">
          <CheckCircle2 className="w-5 h-5 text-forest" />
          Take Action
        </h3>
        <div className="flex items-center gap-1 p-1 bg-white border border-black/5 rounded-2xl shadow-sm">
          {(['todas', 'hoje', 'pendentes', 'dead tasks', 'sem data'] as const).map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition-colors ${filter === f ? 'bg-forest text-white shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-black/5'}`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      <ul className="divide-y divide-black/5 -mx-4 px-4 overflow-y-auto max-h-[360px] pb-4">
        {filteredTasks.map(t => (
          <li key={t.id} className="group flex items-start gap-4 py-4">
            <button 
              onClick={() => toggleTask(t.id)}
              className={`mt-0.5 w-6 h-6 rounded-[8px] border flex items-center justify-center shrink-0 transition-all ${
                t.status === 'done' ? 'bg-forest border-forest text-white' : 'border-black/10 bg-white hover:border-forest/50 shadow-sm'
              }`}
            >
              {t.status === 'done' && <CheckCircle2 className="w-4 h-4" strokeWidth={3} />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-[15px] font-bold leading-snug transition-colors ${t.status === 'done' ? 'line-through text-ink/30' : 'text-ink'}`}>
                {t.title}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-forest/5 text-forest">{t.area}</span>
                <span className="text-[12px] font-bold text-ink/40 bg-black/5 px-2 py-0.5 rounded-md">{t.executionDate || '-'}</span>
              </div>
            </div>
            <button 
              onClick={() => deleteTask(t.id)}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-50 text-red-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
        {filteredTasks.length === 0 && (
          <div className="py-12 text-center text-[14px] font-bold text-ink/30">Nenhuma tarefa encontrada para este filtro.</div>
        )}
      </ul>
      
      <button className="mt-auto pt-6 text-[13px] font-bold text-forest hover:text-forest/80 flex items-center gap-2 transition-colors">
        <Plus className="w-4 h-4" /> Nova tarefa urgente
      </button>
    </section>
  );
}
