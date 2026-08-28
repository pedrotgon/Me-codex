import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function WeekWidget() {
  const now = new Date();
  const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  };
  
  const weekNum = getWeekNumber(now);
  const days = ['S','T','Q','Q','S','S','D'];
  const currentDay = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0 for Monday

  return (
    <section className="glass-card p-6 border-forest/10 bg-white/70">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[15px] flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-forest" />
          Weeks
        </h3>
        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-forest/10 text-forest">
          Sem {weekNum}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => {
          const isToday = i === currentDay;
          const diff = i - currentDay;
          const dateDate = new Date(now);
          dateDate.setDate(now.getDate() + diff);
          return (
            <div key={i} className="py-2">
              <div className="text-[11px] font-bold text-ink/40">{d}</div>
              <div className={`mt-2 w-8 h-8 mx-auto flex items-center justify-center rounded-[10px] text-[13px] font-bold transition-colors ${
                isToday ? 'bg-forest text-white shadow-sm' : 'text-ink/70 hover:bg-forest/10 hover:text-forest'
              }`}>
                {String(dateDate.getDate()).padStart(2, '0')}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 pt-4 border-t border-black/5 text-[12px] text-ink/60 font-medium leading-relaxed">
        <p><span className="font-bold text-forest">Foco:</span> consolidar captura diária e revisar Arquivos Pendentes.</p>
      </div>
    </section>
  );
}
