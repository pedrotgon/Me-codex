import React from 'react';
import { Task } from '../../store';
import { CheckCircle2, Circle } from 'lucide-react';
import { formatNaipe } from '../../lib/icons';

export const getPriorityColor = (priority: string) => {
  if (priority === 'P 1') return 'bg-red-500/20 text-red-700';
  if (priority === 'P 2') return 'bg-orange-500/20 text-orange-700';
  if (priority === 'P 3') return 'bg-yellow-500/20 text-yellow-700';
  return 'bg-black/5 text-ink/60';
};

const CalendarTaskCard = ({ task, size = 'sm', onToggle }: { task: Task, size: 'sm' | 'md' | 'lg', onToggle: (id: string) => void }) => {
  const isDone = task.status === 'done' || task.status === 'arquivadas';
  
  if (size === 'sm') {
    return (
      <div 
        onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
        className={`group cursor-pointer rounded-lg overflow-hidden flex items-center gap-2 p-1.5 px-2 transition-all border ${isDone ? 'bg-black/5 border-transparent text-ink/40 line-through shadow-none' : 'bg-white border-forest/10 hover:border-forest/30 hover:shadow-sm text-ink'} shadow-[0_1px_3px_rgb(0,0,0,0.02)] mb-1`}
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${isDone ? 'bg-ink/20' : 'bg-forest'}`} />
        <span className="text-[11px] font-bold truncate flex-1 leading-snug break-words">{task.title}</span>
      </div>
    );
  }

  if (size === 'md') {
    return (
      <div 
        className={`group rounded-xl overflow-hidden flex flex-col gap-1.5 p-2.5 transition-all border ${isDone ? 'bg-black/5 border-transparent text-ink/40 shadow-none hover:shadow-none' : 'bg-white border-forest/10 hover:border-forest/30 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)] text-ink'} mb-1.5 relative`}
      >
        <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${isDone ? 'bg-ink/20' : 'bg-forest/80'}`} />
        <div className="flex items-start gap-2 pl-1.5 w-full">
          <button onClick={(e) => { e.stopPropagation(); onToggle(task.id); }} className={`mt-[2px] shrink-0 w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${isDone ? 'bg-forest border-forest text-white' : 'border-ink/20 hover:border-forest/50 bg-white'}`}>
            {isDone && <CheckCircle2 className="w-2.5 h-2.5" />}
          </button>
          <span className={`text-[12px] font-bold leading-tight flex-1 break-words pb-0.5 ${isDone ? 'line-through opacity-70' : ''}`}>{task.title}</span>
        </div>
        <div className="pl-7 flex flex-wrap gap-1.5 mt-0.5">
          {task.priority && task.priority !== '-' && (
            <span className={`text-[9px] uppercase font-bold px-1.5 py-[2px] border border-black/5 rounded-md ${getPriorityColor(task.priority)}`}>{task.priority.replace(' ', '')}</span>
          )}
          {task.project && task.project !== '-' && (
            <span className="text-[10px] font-semibold text-ink/50 truncate max-w-[80px] bg-[#f8f9fa] border border-black/5 px-1.5 py-[2px] rounded-md">
              {task.project}
            </span>
          )}
          {task.naipe && task.naipe !== '-' && (
             <span className="text-[10px] font-semibold text-ink/50 truncate max-w-[60px] bg-[#f8f9fa] border border-black/5 px-1.5 py-[2px] rounded-md">
               {formatNaipe(task.naipe)}
             </span>
          )}
        </div>
      </div>
    );
  }

  // Large size
  return (
    <div className={`w-full group rounded-xl overflow-hidden flex flex-col gap-2 p-3 transition-colors border ${isDone ? 'bg-black/5 border-transparent text-ink/40' : 'bg-white border-forest/20 hover:border-forest/40 hover:shadow-md text-ink'} shadow-sm relative`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isDone ? 'bg-ink/20' : 'bg-forest'}`} />
        <div className="flex items-start gap-2 pl-2">
          <button onClick={(e) => { e.stopPropagation(); onToggle(task.id); }} className={`mt-0.5 shrink-0 w-4 h-4 rounded border transition-colors flex items-center justify-center ${isDone ? 'bg-forest border-forest text-white' : 'border-ink/20 hover:border-forest/50 bg-white'}`}>
            {isDone && <CheckCircle2 className="w-3 h-3" />}
          </button>
          <div className="flex-1 min-w-0">
             <span className={`text-[13px] font-bold block leading-snug ${isDone ? 'line-through opacity-70' : ''}`}>{task.title}</span>
             {(task.project || task.area) && (
                <div className="text-[11px] font-medium text-ink/50 mt-1 flex items-center gap-1.5 truncate">
                  <span className="opacity-60">🧠</span> {task.project || task.area}
                </div>
             )}
          </div>
        </div>
        {!isDone && (
          <div className="pl-8 flex flex-wrap gap-1.5 items-center mt-1">
            {task.priority && task.priority !== '-' && (
              <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)}`}>{task.priority.replace(' ', '')}</span>
            )}
            {task.naipe && task.naipe !== '-' && (
               <span className="text-[10px] font-semibold text-ink/60 bg-black/5 px-1.5 py-0.5 rounded">
                  {formatNaipe(task.naipe)}
               </span>
            )}
          </div>
        )}
    </div>
  );
};
export default CalendarTaskCard;
