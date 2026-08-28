import React from 'react';
import { Repeat2, Flame } from 'lucide-react';
import { useStore, Habit } from '../store';

export default function HabitsList() {
  const { habits, toggleHabit } = useStore();
  const maxStreak = Math.max(...habits.map(h => h.streak), 0);
  const daysOfWeek = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

  const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);

  return (
    <section className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest/5 text-forest flex items-center justify-center">
            <Repeat2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[18px] text-ink leading-tight">Hábitos</h3>
            <p className="text-[11px] font-bold text-ink/30 uppercase tracking-widest mt-0.5">Frequência Semanal</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-xl text-[13px] font-bold border border-orange-100/50 shadow-sm">
          🔥 {totalStreak} dias
        </div>
      </div>

      <div className="space-y-4">
        {habits.map((habit: Habit) => (
          <div key={habit.id} className="bg-white border border-black/5 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{habit.icon}</span>
                <span className="text-[14px] font-bold text-ink">{habit.name}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg text-[11px] font-black">
                <Flame className="w-3 h-3" />
                {habit.streak}d
              </div>
            </div>
            
            <div className="flex gap-1.5">
              {daysOfWeek.map((d, i) => {
                const isCompleted = !!habit.days[i];
                return (
                  <button 
                    key={i}
                    onClick={() => toggleHabit(habit.id, i)}
                    className={`flex-1 h-8 rounded-lg border transition-all flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-forest border-forest shadow-sm' 
                        : 'bg-[#f8f9fa] border-black/5 hover:border-forest/20'
                    }`}
                  >
                    <span className={`text-[10px] font-black ${isCompleted ? 'text-white' : 'text-ink/20'}`}>{d}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
