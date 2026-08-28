import React from 'react';
import { Layers } from 'lucide-react';
import { useStore } from '../store';
import { getAreaIcon } from '../lib/icons';

export default function AreasGrid() {
  const { areas, setSelectedAreaId } = useStore();

  return (
    <section className="glass-card p-6">
      <h3 className="font-bold text-[15px] mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-ink/60" />
        Áreas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {areas.map(a => (
          <button 
            key={a.id} 
            onClick={() => setSelectedAreaId(a.id)}
            className="group flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-black/5 hover:border-forest/20 hover:bg-white hover:shadow-md transition-all text-left w-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-forest/0 via-forest/0 to-forest/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center text-[18px] shrink-0 group-hover:scale-105 group-hover:bg-forest/10 transition-all">
              {getAreaIcon(a.name)}
            </div>
            <div className="min-w-0 pr-4">
              <div className="text-[14px] font-bold leading-tight text-ink group-hover:text-forest transition-colors">{a.name}</div>
              <div className="text-[12px] font-medium text-ink/40 mt-0.5">{a.count} itens associados</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
