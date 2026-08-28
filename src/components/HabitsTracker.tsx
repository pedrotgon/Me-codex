import React from 'react';
import { Check, MoreHorizontal, Activity, Flame } from 'lucide-react';
import { useStore } from '../store';

export default function HabitsTracker() {
  const { habits, toggleHabit } = useStore();
  const daysOfWeek = [
    { name: 'Seg', date: '12' },
    { name: 'Ter', date: '13' },
    { name: 'Qua', date: '14' },
    { name: 'Qui', date: '15' },
    { name: 'Sex', date: '16' },
    { name: 'Sáb', date: '17' },
    { name: 'Dom', date: '18', isToday: true }
  ];

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-black/5 bg-[#fbfcfc]">
              <th className="py-3 px-5 text-[11px] font-bold uppercase tracking-wider text-ink/40 w-[240px]">Hábito / Rotina</th>
              <th className="py-3 px-2 text-[11px] font-bold uppercase tracking-wider text-ink/40 w-[100px] text-center">Ofensiva</th>
              {daysOfWeek.map((d, i) => (
                <th key={i} className="py-3 px-2 w-[56px] text-center">
                  <div className={`flex flex-col items-center justify-center rounded-lg p-1 ${d.isToday ? 'bg-forest text-white' : 'text-ink/40'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{d.name}</span>
                    <span className={`text-[12px] font-bold mt-0.5 ${d.isToday ? 'text-white' : 'text-ink/80'}`}>{d.date}</span>
                  </div>
                </th>
              ))}
              <th className="py-3 px-5 w-[60px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {habits.map((habit: any) => (
              <tr key={habit.id} className="hover:bg-black/[0.02] transition-colors group">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-black/5 flex items-center justify-center text-lg shadow-sm">
                      {habit.icon}
                    </div>
                    <div>
                      <span className="text-[13px] font-bold text-ink block leading-snug">{habit.name}</span>
                      <span className="text-[11px] text-ink/40 font-medium flex items-center gap-1 mt-0.5">
                        <Activity className="w-3 h-3" /> Diário
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-center">
                  <div className="inline-flex items-center justify-center min-w-[40px] h-6 px-2 rounded-md bg-forest/5 text-forest text-[11px] font-bold shadow-sm border border-forest/10">
                    <Flame className="w-3 h-3 mr-1" /> {habit.streak} d
                  </div>
                </td>
                {habit.days.map((d: number, idx: number) => {
                  const isCompleted = !!d;
                  const isToday = idx === 6; // assuming Day 6 is DOM/Today
                  return (
                    <td key={idx} className="py-3 px-2 text-center">
                      <button 
                        onClick={() => toggleHabit(habit.id, idx)}
                        className={`w-7 h-7 mx-auto rounded-[8px] flex items-center justify-center transition-all duration-200 border ${
                          isCompleted 
                            ? 'bg-forest border-forest text-white' 
                            : isToday
                              ? 'bg-white border-forest/40 hover:border-forest/80'
                              : 'bg-[#f4f6f5] border-black/5 hover:border-black/20 text-transparent'
                        }`}
                      >
                        <Check className={`w-4 h-4 transition-transform duration-200 ${isCompleted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} strokeWidth={3} />
                      </button>
                    </td>
                  );
                })}
                <td className="py-3 px-5 text-right">
                  <button className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-ink/30 hover:bg-black/5 hover:text-ink transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
