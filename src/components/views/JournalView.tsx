import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calendar, 
  Zap, 
  Target, 
  FolderKanban, 
  Layers, 
  Bookmark, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Quote, 
  Save, 
  Check, 
  Coffee, 
  Moon, 
  Activity, 
  ChevronRight, 
  ChevronLeft,
  FileText, 
  ExternalLink,
  Lock,
  Unlock,
  Play,
  Pause,
  RotateCcw,
  SlidersHorizontal,
  BarChart3,
  MousePointer2,
  Volume2
} from 'lucide-react';
import { useStore, Task } from '../../store';
import { getProjectIcon, getAreaIcon } from '../../lib/icons';

interface DayJournalData {
  headline: string;
  reflection: string;
  energy: 'high' | 'medium' | 'low';
  forecastNote: string;
  locked: boolean;
}

export default function JournalView() {
  const { 
    tasks, 
    projects, 
    areas, 
    resources, 
    habits, 
    toggleTask, 
    addTask, 
    toggleHabit, 
    setCurrentView, 
    setSelectedProjectId, 
    setSelectedAreaId 
  } = useStore();

  // Selected date state (default: today)
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  // Helper to format date key YYYY-MM-DD
  const formatDateKey = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);
  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const isToday = selectedKey === todayKey;
  const isPast = selectedKey < todayKey;

  // Load / Store per-day journal data from localStorage
  const [journalDatabase, setJournalDatabase] = useState<Record<string, DayJournalData>>(() => {
    try {
      const saved = localStorage.getItem('me_journal_db');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    const oldEnergy = (localStorage.getItem('me_journal_energy') as any) || 'high';
    const oldHeadline = localStorage.getItem('me_journal_headline') || '';
    const oldReflection = localStorage.getItem('me_journal_reflection') || '';
    
    return {
      [todayKey]: {
        headline: oldHeadline,
        reflection: oldReflection,
        energy: oldEnergy,
        forecastNote: '',
        locked: false
      }
    };
  });

  // Current day data
  const currentDayData: DayJournalData = useMemo(() => {
    return journalDatabase[selectedKey] || {
      headline: '',
      reflection: '',
      energy: 'high',
      forecastNote: '',
      locked: isPast
    };
  }, [journalDatabase, selectedKey, isPast]);

  const isLocked = currentDayData.locked;

  // Save changes to state + localStorage
  const updateCurrentDayData = (updates: Partial<DayJournalData>) => {
    setJournalDatabase(prev => {
      const updated = {
        ...prev,
        [selectedKey]: {
          ...(prev[selectedKey] || {
            headline: '',
            reflection: '',
            energy: 'high',
            forecastNote: '',
            locked: isPast
          }),
          ...updates
        }
      };
      localStorage.setItem('me_journal_db', JSON.stringify(updated));
      return updated;
    });
  };

  // Local state for micro-step creation
  const [frictionTask, setFrictionTask] = useState('');
  const [microStep, setMicroStep] = useState('');
  const [selectedAreaForTask, setSelectedAreaForTask] = useState('Pessoal');
  const [saveToast, setSaveToast] = useState(false);
  const frictionInputRef = useRef<HTMLInputElement>(null);

  // Manual save trigger
  const handleManualSave = () => {
    localStorage.setItem('me_journal_db', JSON.stringify(journalDatabase));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Date Navigation Helpers
  const changeDateByDays = (offset: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + offset);
    setSelectedDate(next);
  };

  const setDateToToday = () => {
    setSelectedDate(new Date());
  };

  // Quick 7-day strip
  const weekStrip = useMemo(() => {
    const days = [];
    const base = new Date(selectedDate);
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      const key = formatDateKey(d);
      const isSel = key === selectedKey;
      const isTod = key === todayKey;
      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      const dayNum = d.getDate();
      days.push({ date: d, key, isSel, isTod, dayName, dayNum });
    }
    return days;
  }, [selectedDate, selectedKey, todayKey]);

  // Formatted date string
  const dateFormatted = useMemo(() => {
    const weekday = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' });
    const day = selectedDate.getDate();
    const month = selectedDate.toLocaleDateString('pt-BR', { month: 'long' });
    const year = selectedDate.getFullYear();
    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    return {
      weekday: capitalizedWeekday,
      full: `${capitalizedWeekday}, ${day} de ${capitalizedMonth} de ${year}`,
      short: `${day}/${selectedDate.getMonth() + 1}/${year}`
    };
  }, [selectedDate]);

  // Quotes
  const dailyQuotes = [
    { quote: "O segredo para progredir é começar. O segredo para começar é quebrar tarefas complexas em micro-passos sem atrito.", author: "Mark Twain" },
    { quote: "Fazer o duro se tornar mole é a arte de escolher a menor ação imediata.", author: "Princípio Më" },
    { quote: "Você não precisa de mais tempo; precisa de mais clareza sobre o que eliminar.", author: "Essencialismo" },
    { quote: "Concentre-se em ser produtivo e lúcido em vez de apenas ocupado.", author: "Tim Ferriss" }
  ];
  const currentQuote = dailyQuotes[selectedDate.getDate() % dailyQuotes.length];

  // Active Projects with computed progress
  const activeProjects = useMemo(() => {
    return projects
      .filter(p => p.status === 'active')
      .map(p => {
        const projectTasks = tasks.filter(t => t.project === p.title);
        const doneTasks = projectTasks.filter(t => t.status === 'done' || t.status === 'arquivadas').length;
        const inProgress = projectTasks.filter(t => t.status === 'in-progress').length;
        const progressed = doneTasks + inProgress;
        const total = projectTasks.length;
        const calcProgress = total === 0 ? (p.progress || 0) : Math.round((progressed / total) * 100);
        return {
          ...p,
          doneTasks,
          totalTasks: total,
          calculatedProgress: calcProgress
        };
      });
  }, [projects, tasks]);

  // Priority Tasks for Today (P1, P2 or in-progress)
  const priorityTasks = useMemo(() => {
    const p1Tasks = tasks.filter(t => t.status !== 'done' && t.status !== 'arquivadas' && t.priority === 'P 1');
    const inProgTasks = tasks.filter(t => t.status === 'in-progress');
    const p2Tasks = tasks.filter(t => t.status !== 'done' && t.status !== 'arquivadas' && t.priority === 'P 2');
    
    const combinedMap = new Map<string, Task>();
    [...p1Tasks, ...inProgTasks, ...p2Tasks].forEach(t => combinedMap.set(t.id, t));
    const list = Array.from(combinedMap.values());

    if (list.length === 0) {
      return tasks.filter(t => t.status !== 'done' && t.status !== 'arquivadas').slice(0, 6);
    }
    return list.slice(0, 6);
  }, [tasks]);

  // Areas breakdown with stats
  const areasSummary = useMemo(() => {
    return areas.map(a => {
      const areaTasks = tasks.filter(t => t.area === a.name);
      const pendingTasks = areaTasks.filter(t => t.status !== 'done' && t.status !== 'arquivadas').length;
      const areaProjects = projects.filter(p => p.area === a.name && p.status === 'active').length;
      return {
        ...a,
        pendingTasks,
        activeProjects: areaProjects
      };
    });
  }, [areas, tasks, projects]);

  // Recent Resources
  const recentResources = useMemo(() => {
    return resources.slice(0, 4);
  }, [resources]);

  // Quick action: Transform friction into micro task
  const handleCreateMicroAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!microStep.trim() || isLocked) return;

    const title = frictionTask.trim() 
      ? `${microStep.trim()} (destravando: ${frictionTask.trim()})`
      : microStep.trim();

    addTask(title, selectedAreaForTask, undefined, {
      priority: 'P 1',
      status: 'in-progress'
    });

    setFrictionTask('');
    setMicroStep('');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Day index for habit tracker (0 = Mon .. 6 = Sun)
  const currentDayIndex = (selectedDate.getDay() + 6) % 7;

  // ----------------------------------------------------
  // INTERACTIVE TICKER TAPE (Drag, Wheel, Auto-scroll & Clickable)
  // ----------------------------------------------------
  const tickerContainerRef = useRef<HTMLDivElement>(null);
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [isDraggingTicker, setIsDraggingTicker] = useState(false);
  const [tickerStartX, setTickerStartX] = useState(0);
  const [tickerScrollLeft, setTickerScrollLeft] = useState(0);

  // Auto-scroll ticker smoothly
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isTickerPaused && !isDraggingTicker && tickerContainerRef.current) {
        const el = tickerContainerRef.current;
        // Scroll speed: ~40px per second
        el.scrollLeft += (45 * delta) / 1000;
        
        // Loop back seamlessly when reaching middle of duplicated elements
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }

      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isTickerPaused, isDraggingTicker]);

  // Mouse Drag Handlers
  const handleTickerMouseDown = (e: React.MouseEvent) => {
    if (!tickerContainerRef.current) return;
    setIsDraggingTicker(true);
    setTickerStartX(e.pageX - tickerContainerRef.current.offsetLeft);
    setTickerScrollLeft(tickerContainerRef.current.scrollLeft);
  };

  const handleTickerMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingTicker || !tickerContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tickerContainerRef.current.offsetLeft;
    const walk = (x - tickerStartX) * 1.5; // Drag sensitivity
    tickerContainerRef.current.scrollLeft = tickerScrollLeft - walk;
  };

  const handleTickerMouseUp = () => {
    setIsDraggingTicker(false);
  };

  // Wheel Horizontal Scroll
  const handleTickerWheel = (e: React.WheelEvent) => {
    if (!tickerContainerRef.current) return;
    e.preventDefault();
    tickerContainerRef.current.scrollLeft += e.deltaY + e.deltaX;
  };

  // Manual Nudge Scroll
  const nudgeTicker = (direction: 'left' | 'right') => {
    if (!tickerContainerRef.current) return;
    const amount = direction === 'left' ? -250 : 250;
    tickerContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Focus Descompressor
  const focusDescompressor = () => {
    frictionInputRef.current?.focus();
    frictionInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Ticker items data definition
  const tickerItems = [
    {
      id: 'projects',
      label: `PROJETOS ATIVOS: ${activeProjects.length}`,
      icon: FolderKanban,
      color: 'text-emerald-400',
      action: () => setCurrentView('projects'),
      tooltip: 'Abrir lista de Projetos'
    },
    {
      id: 'tasks',
      label: `FOCO DO DIA: ${priorityTasks.length} TAREFAS`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      action: () => setCurrentView('tasks'),
      tooltip: 'Ver Tarefas Prioritárias'
    },
    {
      id: 'areas',
      label: `ÁREAS ESTRATÉGICAS: ${areas.length}`,
      icon: Layers,
      color: 'text-blue-400',
      action: () => setCurrentView('areas'),
      tooltip: 'Ver Áreas de Responsabilidade'
    },
    {
      id: 'habits',
      label: `HÁBITOS: ${habits.length} EM RASTREIO`,
      icon: Flame,
      color: 'text-amber-400',
      action: () => setCurrentView('habitos'),
      tooltip: 'Abrir Rastreador de Hábitos'
    },
    {
      id: 'resources',
      label: `RECURSOS: ${resources.length} ITENS`,
      icon: Bookmark,
      color: 'text-amber-400',
      action: () => setCurrentView('recursos'),
      tooltip: 'Explorar Biblioteca de Recursos'
    },
    {
      id: 'energy',
      label: `BATERIA: ${currentDayData.energy.toUpperCase()}`,
      icon: Zap,
      color: 'text-yellow-300',
      action: () => {
        const next = currentDayData.energy === 'high' ? 'medium' : currentDayData.energy === 'medium' ? 'low' : 'high';
        updateCurrentDayData({ energy: next });
      },
      tooltip: 'Clique para alternar energia'
    },
    {
      id: 'friction',
      label: `DESCOMPRESSOR 80/20: TRANSFORMAR O DURO EM MOLE`,
      icon: Sparkles,
      color: 'text-teal-300',
      action: focusDescompressor,
      tooltip: 'Ir para o descompressor de atrito'
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-24 px-2 sm:px-4 select-none sm:select-auto">
      
      {/* 1. Terminal / Newspaper Banner Header */}
      <div className="flex flex-col gap-4 border-b-[6px] border-forest pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-forest text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-sm shadow-xs">
              MË CÓRTEX • GIRO DO DIA
            </div>
            <span className="text-[11px] font-bold text-ink/40 uppercase tracking-widest hidden sm:inline">
              Edição Matinal de Alta Clareza
            </span>
          </div>

          {/* Today Indicator & Lock Switch */}
          <div className="flex items-center gap-3">
            {!isToday && (
              <button
                onClick={setDateToToday}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 hover:bg-forest/20 text-forest text-xs font-bold transition-all shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Voltar para Hoje
              </button>
            )}

            {/* Lock / Unlock Toggle for Day */}
            <button
              onClick={() => updateCurrentDayData({ locked: !isLocked })}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border transition-all ${
                isLocked
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 hover:bg-amber-500/20 shadow-xs'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 hover:bg-emerald-500/20 shadow-xs'
              }`}
              title={isLocked ? "Dia bloqueado para edição. Clique para liberar" : "Dia liberado para edição. Clique para travar"}
            >
              {isLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Travado (Registro)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Editável</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Big Editorial Headline */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mt-2">
          <div>
            <h1 className="text-4xl sm:text-7xl font-black text-ink uppercase tracking-tight leading-[0.85] flex flex-wrap items-baseline gap-3">
              Giro do Dia
              <span className="text-sm sm:text-lg font-serif italic text-forest font-semibold normal-case opacity-70">
                — {dateFormatted.full}
              </span>
            </h1>
          </div>

          {/* Energy Selector Pill */}
          <div className="flex items-center gap-1 bg-black/5 p-1.5 rounded-2xl shrink-0 self-start md:self-auto border border-black/5">
            <span className="text-[10px] font-black text-ink/40 uppercase tracking-wider px-2">Bateria:</span>
            {[
              { id: 'high', label: 'Alta', icon: Zap, color: 'bg-emerald-700 text-white' },
              { id: 'medium', label: 'Média', icon: Coffee, color: 'bg-amber-600 text-white' },
              { id: 'low', label: 'Recup', icon: Moon, color: 'bg-blue-600 text-white' }
            ].map(m => (
              <button
                key={m.id}
                disabled={isLocked}
                onClick={() => updateCurrentDayData({ energy: m.id as any })}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentDayData.energy === m.id
                    ? `${m.color} shadow-xs font-black`
                    : 'text-ink/60 hover:text-ink hover:bg-black/5'
                } ${isLocked ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                <m.icon className="w-3 h-3" />
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Interactive Calendar Date Picker Ribbon */}
        <div className="mt-2 pt-3 border-t border-black/10 flex items-center justify-between gap-2 overflow-x-auto py-1">
          <button
            onClick={() => changeDateByDays(-1)}
            className="p-2 rounded-xl bg-white border border-black/10 hover:border-forest/40 hover:bg-forest/5 text-ink transition-colors shrink-0"
            title="Dia anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center min-w-max">
            {weekStrip.map(dayItem => (
              <button
                key={dayItem.key}
                onClick={() => setSelectedDate(dayItem.date)}
                className={`flex flex-col items-center px-3 sm:px-4 py-1.5 rounded-xl border transition-all ${
                  dayItem.isSel
                    ? 'bg-forest text-white border-forest shadow-sm scale-105 font-black'
                    : dayItem.isTod
                    ? 'bg-emerald-50 text-forest border-forest/30 font-bold'
                    : 'bg-white/80 hover:bg-white text-ink/70 border-black/5 hover:border-forest/20'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-80">
                  {dayItem.isTod ? 'Hoje' : dayItem.dayName}
                </span>
                <span className="text-sm font-extrabold">{dayItem.dayNum}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => changeDateByDays(1)}
            className="p-2 rounded-xl bg-white border border-black/10 hover:border-forest/40 hover:bg-forest/5 text-ink transition-colors shrink-0"
            title="Próximo dia"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. INTERACTIVE BROADCAST NEWS TICKER (CNN / GloboNews Style with Full Interactivity) */}
      <div 
        className="bg-ink text-white rounded-2xl border-2 border-forest overflow-hidden shadow-lg flex items-center relative group"
        onMouseEnter={() => setIsTickerPaused(true)}
        onMouseLeave={() => {
          if (!isDraggingTicker) setIsTickerPaused(false);
        }}
      >
        {/* Live Broadcast Badge & Interactive Play/Pause Controller */}
        <div className="bg-forest px-3 py-2.5 flex items-center gap-2.5 z-20 shrink-0 border-r border-white/20 shadow-md">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] font-black tracking-widest text-white uppercase">AO VIVO</span>
          </div>

          {/* Quick Play/Pause Button */}
          <button
            onClick={() => setIsTickerPaused(!isTickerPaused)}
            className="p-1 rounded-md bg-white/10 hover:bg-white/25 text-white transition-colors"
            title={isTickerPaused ? "Retomar rolagem automática" : "Pausar rolagem automática"}
          >
            {isTickerPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
          </button>

          {/* Nudge Buttons */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => nudgeTicker('left')}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
              title="Rolar para esquerda"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => nudgeTicker('right')}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/90 transition-colors"
              title="Rolar para direita"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Continuous Draggable & Clickable Track */}
        <div
          ref={tickerContainerRef}
          onMouseDown={handleTickerMouseDown}
          onMouseMove={handleTickerMouseMove}
          onMouseUp={handleTickerMouseUp}
          onWheel={handleTickerWheel}
          className={`flex items-center overflow-x-hidden whitespace-nowrap py-2.5 px-4 cursor-grab active:cursor-grabbing select-none text-[11px] font-black tracking-widest uppercase scroll-smooth ${
            isDraggingTicker ? 'cursor-grabbing' : ''
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Duplicated items to make the marquee endless */}
          {[...tickerItems, ...tickerItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={`${item.id}-${idx}`}>
                <button
                  onClick={(e) => {
                    // Avoid trigger click if user was dragging
                    if (isDraggingTicker) return;
                    item.action();
                  }}
                  title={item.tooltip}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/20 border border-white/5 hover:border-forest/50 transition-all hover:scale-105 active:scale-95 text-white/90 group/btn shrink-0"
                >
                  <Icon className={`w-3.5 h-3.5 ${item.color} group-hover/btn:rotate-12 transition-transform`} />
                  <span className="font-extrabold">{item.label}</span>
                </button>
                <span className="text-white/25 px-4 select-none">•</span>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Hint Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-ink/90 border-l border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest shrink-0 z-20">
          <MousePointer2 className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Arraste ou Clique</span>
        </div>
      </div>

      {/* 4. Main Dynamic Newspaper Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Headlines, Execution Radar, Descompressor */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Card: Grande Vitória / Manchete */}
          <section className="bg-white border-2 border-black/10 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-forest/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-forest text-white shadow-xs">
                <Target className="w-3 h-3" />
                Grande Vitória do Dia
              </span>
              <span className="text-xs text-ink/40 font-semibold">
                {isLocked ? '🔒 Registro travado' : 'Prioridade Única'}
              </span>
            </div>

            <textarea
              rows={2}
              disabled={isLocked}
              value={currentDayData.headline}
              onChange={(e) => updateCurrentDayData({ headline: e.target.value })}
              placeholder={isLocked ? "Nenhuma manchete definida para este dia." : "Qual é o grande movimento ou conquista de hoje?..."}
              className={`w-full text-xl sm:text-2xl font-serif font-bold text-ink placeholder:text-ink/20 bg-transparent outline-none resize-none border-b border-black/5 focus:border-forest pb-2 transition-colors ${
                isLocked ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            />
            <p className="text-[11px] text-ink/40 mt-2 font-medium">
              💡 Princípio 80/20: Se apenas esta meta for concluída, o dia já valeu a pena.
            </p>
          </section>

          {/* Card: Radar de Tarefas & Execução de Hoje */}
          <section className="bg-white border-2 border-black/10 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-ink uppercase tracking-tight">Radar de Execução do Dia</h3>
                  <p className="text-xs text-ink/50">Ações prioritárias e em andamento para hoje</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('tasks')}
                className="text-xs font-bold text-forest hover:underline flex items-center gap-1"
              >
                Todas as Tarefas <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {priorityTasks.length === 0 ? (
                <div className="p-6 text-center text-ink/50 text-sm bg-black/[0.02] rounded-2xl border border-dashed border-black/10">
                  Nenhuma tarefa urgente pendente. Aproveite para fazer progresso focado nos Projetos!
                </div>
              ) : (
                priorityTasks.map(task => {
                  const isDone = task.status === 'done' || task.status === 'arquivadas';
                  return (
                    <div
                      key={task.id}
                      className={`group flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                        isDone 
                          ? 'bg-black/5 border-transparent opacity-60' 
                          : 'bg-white hover:bg-forest/[0.02] border-black/10 hover:border-forest/30 shadow-2xs'
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-forest hover:scale-110 transition-transform shrink-0"
                        title={isDone ? "Marcar como pendente" : "Marcar como concluída"}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 fill-forest text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-ink/30 hover:text-forest" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold leading-snug transition-colors ${
                          isDone ? 'line-through text-ink/50' : 'text-ink group-hover:text-forest'
                        }`}>
                          {task.title}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[11px] text-ink/60 font-semibold">
                          {task.project && (
                            <button
                              onClick={() => {
                                const matched = projects.find(p => p.title === task.project);
                                if (matched) {
                                  setSelectedProjectId(matched.id);
                                  setCurrentView('projects');
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/5 hover:bg-forest/10 hover:text-forest transition-colors text-ink/70"
                              title="Abrir Projeto"
                            >
                              <span className="text-xs">{getProjectIcon(task.project)}</span>
                              <span className="truncate max-w-[130px]">{task.project}</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const matched = areas.find(a => a.name === task.area);
                              if (matched) {
                                setSelectedAreaId(matched.id);
                                setCurrentView('areas');
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-forest/5 hover:bg-forest/15 text-forest transition-colors"
                            title="Abrir Área"
                          >
                            <span>{getAreaIcon(task.area)}</span>
                            <span>{task.area}</span>
                          </button>
                          {task.priority && (
                            <span className={`px-2 py-0.2 rounded font-bold text-[10px] ${
                              task.priority === 'P 1' ? 'bg-red-500/10 text-red-700' : 'bg-amber-500/10 text-amber-700'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Card: Descompressor Estratégico ("Fazer o Duro Ficar Mole") */}
          <section className="bg-emerald-950 text-white rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Descompressor: Fazer o Duro ficar Mole</h3>
                  <p className="text-xs text-white/60">Destile um bloqueio pesado no menor primeiro passo</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateMicroAction} className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-300/80 mb-1">
                  1. O que está pesado ou travado? (Bloqueio)
                </label>
                <input
                  ref={frictionInputRef}
                  type="text"
                  disabled={isLocked}
                  value={frictionTask}
                  onChange={(e) => setFrictionTask(e.target.value)}
                  placeholder="Ex: TCC da Unicamp, relatório LE704, cirurgia..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-300/80 mb-1">
                    2. Menor micro-passo de 5 min (Sem atrito):
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={microStep}
                    onChange={(e) => setMicroStep(e.target.value)}
                    placeholder="Ex: Abrir o arquivo e escrever o sumário"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-300/80 mb-1">
                    Área:
                  </label>
                  <select
                    disabled={isLocked}
                    value={selectedAreaForTask}
                    onChange={(e) => setSelectedAreaForTask(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-400"
                  >
                    {areas.map(a => (
                      <option key={a.id} value={a.name} className="text-ink bg-white">
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!microStep.trim() || isLocked}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-emerald-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Criar Ação Leve no Sistema
              </button>
            </form>
          </section>

          {/* Card: Caderno de Reflexão & Anotações do Dia */}
          <section className="bg-white border-2 border-black/10 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-forest" />
                <h3 className="font-extrabold text-base text-ink uppercase tracking-tight">Reflexão & Diário do Dia</h3>
              </div>
              <span className="text-[11px] font-bold text-ink/40 uppercase tracking-widest">
                {isLocked ? 'Somente Leitura' : 'Salva Automaticamente'}
              </span>
            </div>

            <textarea
              rows={5}
              disabled={isLocked}
              value={currentDayData.reflection}
              onChange={(e) => updateCurrentDayData({ reflection: e.target.value })}
              placeholder={isLocked ? "Sem anotações gravadas para este dia." : "Escreva livremente reflexões, ideias capturadas, aprendizados ou insights da manhã..."}
              className={`w-full bg-black/[0.02] hover:bg-black/[0.04] focus:bg-white rounded-2xl p-4 text-sm text-ink leading-relaxed border border-black/5 focus:border-forest/40 outline-none resize-none transition-all ${
                isLocked ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-ink/50 italic">
                <Quote className="w-3.5 h-3.5 text-forest/70 shrink-0" />
                <span>"{currentQuote.quote}" — <strong>{currentQuote.author}</strong></span>
              </div>

              {!isLocked && (
                <button
                  onClick={handleManualSave}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-forest text-white text-xs font-bold hover:bg-forest/90 transition-all shadow-sm shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Registro</span>
                </button>
              )}
            </div>
          </section>

        </div>

        {/* Right Column (5 cols): Projetos, Hábitos, Áreas, Recursos */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Card: Projetos Ativos em Foco */}
          <section className="bg-white border-2 border-black/10 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-forest" />
                <h3 className="font-extrabold text-base text-ink uppercase tracking-tight">Projetos Ativos</h3>
              </div>
              <button
                onClick={() => setCurrentView('projects')}
                className="text-xs font-bold text-forest hover:underline flex items-center gap-1"
              >
                Ver Todos ({projects.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeProjects.slice(0, 4).map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setCurrentView('projects');
                  }}
                  className="group p-3.5 rounded-2xl bg-black/[0.02] hover:bg-forest/5 border border-black/5 hover:border-forest/20 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{getProjectIcon(p.title)}</span>
                      <h4 className="font-bold text-xs text-ink group-hover:text-forest transition-colors truncate">
                        {p.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-ink/60 border border-black/5 shrink-0">
                      {p.area}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-ink/50">
                      <span>Progresso</span>
                      <span>{p.calculatedProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-forest rounded-full transition-all duration-300"
                        style={{ width: `${p.calculatedProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Card: Hábitos do Dia */}
          <section className="bg-white border-2 border-black/10 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-base text-ink uppercase tracking-tight">Hábitos do Dia</h3>
              </div>
              <button
                onClick={() => setCurrentView('habitos')}
                className="text-xs font-bold text-forest hover:underline"
              >
                Gerenciar
              </button>
            </div>

            <div className="space-y-2">
              {habits.slice(0, 5).map(habit => {
                const isCompletedToday = habit.days[currentDayIndex] === 1;
                return (
                  <div
                    key={habit.id}
                    onClick={() => !isLocked && toggleHabit(habit.id, currentDayIndex)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isCompletedToday
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
                        : 'bg-black/[0.02] border-black/5 hover:bg-black/[0.04] text-ink'
                    } ${isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{habit.icon}</span>
                      <span className="text-xs font-bold">{habit.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        {habit.streak}d
                      </span>
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        isCompletedToday 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'border-black/20 bg-white'
                      }`}>
                        {isCompletedToday && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Card: Áreas Estratégicas (PARA) */}
          <section className="bg-white border-2 border-black/10 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-forest" />
                <h3 className="font-extrabold text-base text-ink uppercase tracking-tight">Áreas Estratégicas</h3>
              </div>
              <button
                onClick={() => setCurrentView('areas')}
                className="text-xs font-bold text-forest hover:underline"
              >
                Explorar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {areasSummary.map(area => (
                <div
                  key={area.id}
                  onClick={() => {
                    setSelectedAreaId(area.id);
                    setCurrentView('areas');
                  }}
                  className="p-3 rounded-2xl bg-black/[0.02] hover:bg-forest/5 border border-black/5 hover:border-forest/20 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base shrink-0">{getAreaIcon(area.name)}</span>
                    <span className="text-xs font-bold text-ink truncate">{area.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-ink/50 font-semibold">
                    <span>{area.pendingTasks} tarefas</span>
                    <span>{area.activeProjects} proj</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Card: Recursos & Referências */}
          <section className="bg-white border-2 border-black/10 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-forest" />
                <h3 className="font-extrabold text-base text-ink uppercase tracking-tight">Recursos & Referências</h3>
              </div>
              <button
                onClick={() => setCurrentView('recursos')}
                className="text-xs font-bold text-forest hover:underline"
              >
                Ver ({resources.length})
              </button>
            </div>

            <div className="space-y-2">
              {recentResources.map(res => (
                <div
                  key={res.id}
                  className="p-3 rounded-2xl bg-black/[0.02] hover:bg-forest/5 border border-black/5 hover:border-forest/20 transition-all flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-ink truncate">{res.title}</h5>
                    {res.area && (
                      <span className="text-[10px] text-ink/40 font-medium">
                        {Array.isArray(res.area) ? res.area.join(', ') : res.area}
                      </span>
                    )}
                  </div>
                  {res.link && (
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-forest hover:bg-forest/10 rounded-lg transition-colors"
                      title="Abrir link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

      {/* Floating Save Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-forest text-white text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>Registro salvo com sucesso!</span>
        </div>
      )}

    </div>
  );
}
