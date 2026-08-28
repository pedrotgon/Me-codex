import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useStore } from '../store';

export default function QuickCapture() {
  const [text, setText] = useState('');
  const { processJarvisCommand } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    processJarvisCommand(text);
    setText('');
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 mb-6 shrink-0 relative overflow-hidden border border-black/5 shadow-sm">
      <div className="flex items-center gap-3 mb-6 relative">
        <div className="w-10 h-10 rounded-xl bg-white border border-black/5 text-emerald-500 flex items-center justify-center shadow-sm">
          <Zap className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-[18px] text-ink">Captura Rápida</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <input 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que está na sua mente? ( / para focar )" 
          className="w-full h-16 pl-6 pr-28 rounded-2xl bg-white border border-black/5 text-[15px] font-medium placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30 transition-shadow shadow-sm text-ink" 
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button 
            type="submit"
            className="h-12 px-6 rounded-xl bg-white text-forest border border-black/5 text-[14px] font-bold hover:bg-forest/5 active:scale-[.98] transition shadow-sm"
          >
            Enviar
          </button>
        </div>
      </form>
    </section>
  );
}
