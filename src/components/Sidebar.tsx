import React from 'react';
import { Brain, Home, Zap, CheckCircle2, FolderKanban, Layers, Library, Inbox, Repeat2, CalendarDays, Database, Sparkles, Network, BookOpen, Archive } from 'lucide-react';
import { useStore, View } from '../store';

export default function Sidebar() {
  const { currentView, setCurrentView, isSidebarOpen, toggleSidebar } = useStore();

  const SidebarLink = ({ icon: Icon, text, view, badge }: { icon: any, text: string, view: View, badge?: number }) => {
    const active = currentView === view;
    return (
      <button 
        onClick={() => setCurrentView(view)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-colors ${active ? 'bg-white/15 text-white shadow-sm' : 'hover:bg-white/10 text-white/70'}`}
      >
        <Icon className="w-[18px] h-[18px] shrink-0" />
        {isSidebarOpen && <span className={`font-medium truncate ${active ? 'text-white' : ''}`}>{text}</span>}
        {isSidebarOpen && badge !== undefined && (
          <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded-md bg-white/20 text-white font-bold shrink-0">
            {badge}
          </span>
        )}
      </button>
    );
  };

  if (!isSidebarOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={() => toggleSidebar()}
      />
      <aside className="fixed inset-y-0 left-0 z-50 lg:sticky lg:top-0 flex w-[280px] shrink-0 bg-forest text-white border-r border-forest-900 flex-col h-[100dvh] overflow-hidden">
      <div className="h-[72px] shrink-0 flex items-center gap-3 px-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-white text-forest flex items-center justify-center shadow-sm">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <div className="font-semibold tracking-tight text-[18px] leading-tight text-white">Më</div>
          <div className="text-[12px] text-white/50 font-medium">Life OS</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
        <div>
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/50">Início</p>
          <div className="space-y-0.5">
            <SidebarLink icon={Home} text="Visão Geral" view="home" />
            <SidebarLink icon={Network} text="Memória" view="memoria" />
            <SidebarLink icon={Zap} text="Quick Capture" view="quick-capture" />
          </div>
        </div>

        <div>
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/50">Agenda</p>
          <div className="space-y-0.5">
            <SidebarLink icon={CheckCircle2} text="Take Action" view="take-action" />
            <SidebarLink icon={CalendarDays} text="Weeks" view="weeks" />
            <SidebarLink icon={BookOpen} text="Journal" view="journal" />
          </div>
        </div>

        <div>
           <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/50">PARA</p>
           <div className="space-y-0.5">
             <SidebarLink icon={FolderKanban} text="Projects" view="projects" />
             <SidebarLink icon={CheckCircle2} text="Tasks" view="tasks" />
             <SidebarLink icon={Layers} text="Areas" view="areas" />
             <SidebarLink icon={Library} text="Recursos" view="recursos" />
             <SidebarLink icon={Archive} text="Arquivados" view="arquivados" />
           </div>
        </div>

        <div>
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/50">Sistema</p>
          <div className="space-y-0.5">
            <SidebarLink icon={Inbox} text="Arquivos Pendentes" view="inbox" badge={7} />
            <SidebarLink icon={Repeat2} text="Hábitos" view="habitos" />
            <SidebarLink icon={Database} text="Dados" view="dados" />
            <SidebarLink icon={Sparkles} text="Para-Organizer" view="para-organizer" />
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="rounded-2xl p-4 border border-white/20 bg-white/5 shadow-none">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Sparkles className="w-4 h-4 text-emerald-300" /> Jarvis Ativo
          </div>
          <p className="text-[12px] text-white/70 mt-1.5 leading-snug font-medium">Escreva uma frase no chat. A IA age e reporta.</p>
        </div>
      </div>
    </aside>
    </>
  );
}
