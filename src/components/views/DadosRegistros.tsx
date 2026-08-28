import React, { useState } from 'react';
import { Calendar, Search, Filter, Download, Activity, Target, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DadosRegistros() {
  const [searchTerm, setSearchTerm] = useState('');

  // Example mocked data, each row is a unique day in descending order
  const logs = [
    { id: '1', date: '2026-05-12', progress: 85, habitsCompleted: 5, totalHabits: 5, focus: 'Consolidar a captura diária, revisar arquivos pendentes', wentWell: 'O time-blocking na manhã funcionou muito bem.', toImprove: 'Não me distrair a tarde' },
    { id: '2', date: '2026-05-11', progress: 60, habitsCompleted: 3, totalHabits: 5, focus: 'Avançar com documentação do PR', wentWell: 'Entreguei a principal task do dia', toImprove: 'Não bebi agua quase nenhuma hoje' },
    { id: '3', date: '2026-05-10', progress: 100, habitsCompleted: 5, totalHabits: 5, focus: 'Review semanal e descanso', wentWell: 'Dormi 8 horas seguidas', toImprove: 'Tentar acordar mais cedo no final de semana' },
    { id: '4', date: '2026-05-09', progress: 40, habitsCompleted: 2, totalHabits: 5, focus: 'Resolver bug critico UX', wentWell: 'Achei a root cause de forma rapida', toImprove: 'Evitar contexto isolado' },
    { id: '5', date: '2026-05-08', progress: 90, habitsCompleted: 5, totalHabits: 5, focus: 'Lançamento Alpha', wentWell: 'Sucesso total na primeira release', toImprove: 'Criar scripts para não precisar fazer manualmente da proxima' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-white border border-forest/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-xl overflow-hidden mt-2">
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-forest/10 bg-[#fbfcfc] gap-4 z-30">
        <div>
          <h3 className="font-bold text-[14px] text-ink flex items-center gap-2">
            <Calendar className="w-4 h-4 text-forest" />
            Registros Históricos (Timeline)
          </h3>
          <p className="text-[11px] font-medium text-ink/50 mt-0.5">
             Cada linha representa um dia único da sua vida. Histórico consolidado das Semanas e Hábitos.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Buscar por data ou texto..."
              className="pl-8 pr-3 py-1.5 bg-white border border-forest/10 rounded-lg text-[12px] font-medium w-64 focus:outline-none focus:ring-2 focus:ring-forest/20 text-ink placeholder:text-ink/40 shadow-sm transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-black/5 p-1 rounded-lg">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-forest/10 rounded-lg text-[12px] font-bold text-ink hover:bg-forest/5 transition-colors shadow-sm">
              <Filter className="w-3.5 h-3.5" /> Filtrar
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent rounded-lg text-[12px] font-bold text-ink/60 hover:text-ink hover:bg-black/5 transition-colors ml-1">
               <Download className="w-3.5 h-3.5" /> CSV Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white tabular-nums w-full relative">
        <table className="w-full text-left border-collapse min-w-[max-content]">
          <thead className="sticky top-0 bg-[#fbfcfc] shadow-[0_1px_0_rgba(0,0,0,0.05)] z-20">
            <tr>
              <th className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-ink/40 w-32 border-r border-black/5">Data</th>
              <th className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-ink/40 w-44 border-r border-black/5">Desempenho</th>
              <th className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-ink/40 min-w-[200px] border-r border-black/5">Foco Diário / Semanal</th>
              <th className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-ink/40 min-w-[200px] border-r border-black/5">O que funcionou</th>
              <th className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-ink/40 min-w-[200px]">A Melhorar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {logs.map(log => {
               const dateObj = new Date(log.date);
               dateObj.setUTCHours(12); // avoid time zone shift
               const formattedDate = dateObj.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

               return (
                <tr key={log.id} className="hover:bg-black/[0.02] transition-colors group">
                  <td className="py-3 px-4 border-r border-black/5 relative">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-forest mt-0.5" />
                       <span className="text-[12px] font-mono text-ink/80 font-bold">{formattedDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-r border-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden flex-1 max-w-[80px]">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${log.progress}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-ink/60">{log.progress}%</span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-ink/60 bg-black/5 px-1.5 py-0.5 rounded">
                        <Flame className="w-3 h-3 text-orange-500" /> {log.habitsCompleted}/{log.totalHabits}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-r border-black/5">
                    <div className="flex items-start gap-1.5">
                      <Target className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                      <span className="text-[12px] text-ink font-medium leading-snug">{log.focus}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-r border-black/5">
                    <div className="flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-[12px] text-ink font-medium leading-snug">{log.wentWell}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                     <span className="text-[12px] text-ink/60 font-medium leading-snug">{log.toImprove}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
