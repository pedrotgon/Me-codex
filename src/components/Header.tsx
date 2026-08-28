import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useStore } from '../store';

export default function Header() {
  const { toggleSidebar } = useStore();
  const [time, setTime] = useState<{ date: string, time: string }>({
    date: new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime({
        date: now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-[72px] backdrop-blur-xl bg-nude/90 border-b border-forest/10">
      <div className="h-full flex items-center gap-4 px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-xl hover:bg-forest/5 transition-colors">
          <Menu className="w-5 h-5 text-forest" />
        </button>
        
        <div className="hidden md:flex items-center gap-3 text-[13px] font-bold">
          <span className="text-forest/60">Hoje</span>
          <span className="text-forest/30">•</span>
          <span className="text-forest">{time.date}</span>
          <span className="text-forest/30">•</span>
          <span className="text-forest">{time.time}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-forest/50" />
            <input 
              placeholder="Buscar antes de criar..." 
              className="h-10 w-[260px] pl-9 pr-4 rounded-xl bg-white/70 border border-forest/10 text-sm font-medium placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30 transition-all text-forest" 
            />
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/70 border border-forest/10 hover:bg-white text-forest/70 transition-colors shadow-sm">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center text-xs font-bold shadow-sm">
            PG
          </div>
        </div>
      </div>
    </header>
  );
}
