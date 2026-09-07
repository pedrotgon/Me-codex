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
    <header className="sticky top-0 z-20 h-[72px] bg-[#fbfbfb]/95 backdrop-blur-md border-b border-[#e5e5e5]">
      <div className="h-full flex items-center gap-4 px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-[10px] hover:bg-black/5 text-[#0c2b15] transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-2.5 text-[14px]">
          <span className="font-serif italic text-[16px] text-[#0c2b15] font-normal capitalize">{time.date}</span>
          <span className="text-[#696969]/40">•</span>
          <span className="text-[13px] font-mono font-medium text-[#696969]">{time.time}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#696969]" />
            <input 
              placeholder="Buscar no sistema..." 
              className="h-10 w-[260px] pl-9 pr-4 rounded-[10px] bg-white border border-[#e5e5e5] text-[13px] font-sans placeholder:text-[#696969]/60 focus:outline-none focus:border-[#41a217] focus:ring-1 focus:ring-[#41a217] transition-all text-[#070707]" 
            />
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-[10px] bg-white border border-[#e5e5e5] hover:bg-[#f5f5f5] text-[#0c2b15] transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-[10px] bg-[#0c2b15] text-white flex items-center justify-center text-xs font-serif font-medium tracking-wide">
            PG
          </div>
        </div>
      </div>
    </header>
  );
}
