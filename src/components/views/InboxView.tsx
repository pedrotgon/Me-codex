import React from 'react';
import { Inbox, Check } from 'lucide-react';
import ViewHeader from '../ViewHeader';
import { useStore } from '../../store';

export default function InboxView() {
  const { tasks } = useStore();
  const inboxTasks = tasks.filter(t => t.area === 'Inbox' || t.area === 'Arquivos Pendentes');

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <ViewHeader 
        title="Arquivos Pendentes" 
        description="Itens recém capturados que ainda não foram organizados no seu sistema."
        icon={Inbox}
        action={
          <button className="h-9 px-4 rounded-xl bg-forest text-white text-[13px] font-bold hover:bg-forest/90 transition shadow-sm">
            + Capturar
          </button>
        }
      />

      <div className="glass-card p-6">
        <h3 className="font-bold text-[15px] mb-4 text-forest flex items-center gap-2">
          Itens não triados ({inboxTasks.length})
        </h3>
        
        {inboxTasks.length > 0 ? (
          <div className="space-y-3">
            {inboxTasks.map(t => (
              <div key={t.id} className="group flex items-start justify-between gap-4 p-4 rounded-xl border border-forest/10 hover:shadow-sm bg-white/40 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-ink">{t.title}</p>
                  <p className="text-[11px] font-medium text-ink/40 mt-1">Capturado {t.executionDate}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                  <button className="px-3 py-1.5 rounded-lg bg-forest/10 text-forest hover:bg-forest/20 text-xs font-bold transition-colors">
                    Organizar
                  </button>
                  <button className="p-1.5 rounded-lg text-ink/30 hover:text-green-500 hover:bg-green-50 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-forest/20 rounded-xl bg-white/30">
            <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center text-forest/30 mb-4 shadow-sm">
              <Check className="w-8 h-8" />
            </div>
            <p className="text-forest/60 font-medium">Você tem a Caixa de Entrada ZERADA! Parabéns!</p>
          </div>
        )}
      </div>
    </div>
  );
}
