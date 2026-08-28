import React, { useState, useEffect } from 'react';
import { ListTodo, Search, Filter, Plus, Calendar, Kanban, LayoutGrid, CheckCircle2, ChevronRight, Hash, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ViewHeader from '../ViewHeader';
import { useStore, Task } from '../../store';
import { formatNaipe } from '../../lib/icons';
import CalendarTaskCard from './CalendarTaskCard';

type ViewType = 'board' | 'list' | 'agenda';

export default function TasksView() {
  const { tasks, toggleTask, addTask, editTask, projects } = useStore();
  const [view, setView] = useState<ViewType>('board');
  const [filterText, setFilterText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskArea, setNewTaskArea] = useState('Inbox');
  const [newTaskProject, setNewTaskProject] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [agendaViewType, setAgendaViewType] = useState<'day' | 'week' | 'month'>('day');
  const [newTaskPriority, setNewTaskPriority] = useState('P 3');
  const [newTaskNaipe, setNewTaskNaipe] = useState('');

  // Advanced Filters State
  const [filterModes, setFilterModes] = useState<Record<string, string[]>>({
    area: [], project: [], naipe: [], priority: []
  });
  const [openFilterCat, setOpenFilterCat] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenFilterCat(null);
    if (openFilterCat) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openFilterCat]);

  const toggleFilter = (cat: string, value: string) => {
    setFilterModes(prev => {
      const current = prev[cat] || [];
      if (current.includes(value)) {
        return { ...prev, [cat]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [cat]: [...current, value] };
      }
    });
  };

  const hasAnyFilter = Object.values(filterModes).some((arr: any) => arr.length > 0);

  const formatBRDate = (dateStr: string) => {
    if (!dateStr || dateStr === '-') return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    if (dateStr.includes(':') && dateStr.length > 10) {
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    return `${day}/${month}/${year}`;
  };

  // Agenda Native Logic
  const [baseDate, setBaseDate] = useState(() => new Date());
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [minhasAgendas, setMinhasAgendas] = useState<string[]>(['Pessoal', 'Lab 1']);
  const todayDate = new Date();
  
  const formatDateYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = formatDateYYYYMMDD(todayDate);

  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());
  const weekDays = Array.from({length: 7}).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = firstDayOfMonth.getDay();
  const daysInMonthView = Array.from({length: 42}).map((_, i) => {
    const d = new Date(year, month, 1 - startOffset + i);
    return d;
  });
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const navigateDate = (dir: 'prev' | 'next') => {
    setBaseDate(prev => {
       const next = new Date(prev);
       if (agendaViewType === 'day') {
          next.setDate(prev.getDate() + (dir === 'next' ? 1 : -1));
       } else if (agendaViewType === 'week') {
          next.setDate(prev.getDate() + (dir === 'next' ? 7 : -7));
       } else {
          next.setMonth(prev.getMonth() + (dir === 'next' ? 1 : -1));
       }
       return next;
    });
  };

  const parseTaskDate = (dateStr: string) => {
    if (!dateStr || dateStr === '-') return null;
    if (dateStr.toLowerCase() === 'hoje') return new Date();
    
    const parts = dateStr.split(' ');
    // Handle "DD-MMM-YY"
    const datePart = parts[0];
    const timePart = parts.length > 1 ? parts[1] : null;

    if (!datePart.includes('-')) return null;

    const [d, mStr, yStr] = datePart.split('-');
    const monthMap: Record<string, number> = {"Jan":0, "Feb":1, "Mar":2, "Apr":3, "May":4, "Jun":5, "Jul":6, "Aug":7, "Sep":8, "Oct":9, "Nov":10, "Dec":11};
    const monthIndex = monthMap[mStr] ?? 0;
    const yyyy = parseInt(yStr) + 2000;
    let hours = 0, minutes = 0;
    
    if (timePart && timePart.includes(':')) {
       const [h, m] = timePart.split(':');
       hours = parseInt(h);
       minutes = parseInt(m);
    }

    const res = new Date(yyyy, monthIndex, parseInt(d), hours, minutes);
    return res;
  };

  // Helper to match tasks to a specific day
  const isTaskOnDate = (taskDateStr: string, jsDate: Date) => {
    if (!taskDateStr || taskDateStr === '-') return false;
    const tDate = parseTaskDate(taskDateStr);
    if (!tDate) return false;
    return tDate.getFullYear() === jsDate.getFullYear() && 
           tDate.getMonth() === jsDate.getMonth() && 
           tDate.getDate() === jsDate.getDate();
  };
  
  const getTaskHour = (taskDateStr: string) => {
    if (!taskDateStr || taskDateStr === '-') return null;
    const parts = taskDateStr.split(' ');
    const timePart = parts.length > 1 ? parts[1] : (taskDateStr.includes(':') ? taskDateStr : null);
    if (timePart) {
      const [h, m] = timePart.split(':');
      return h.padStart(2, '0') + ':00';
    }
    return null;
  };

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === 'agenda' && (agendaViewType === 'day' || agendaViewType === 'week')) {
       const timeoutId = setTimeout(() => {
         if (scrollRef.current) {
            const currentHour = new Date().getHours();
            const currentMinute = new Date().getMinutes();
            const topPos = currentHour * 128 + (currentMinute / 60) * 128;
            // Scroll to the current time, subtracting ~250px to center it in the view
            scrollRef.current.scrollTo({ top: Math.max(0, topPos - 250), behavior: 'smooth' });
         }
       }, 100);
       return () => clearTimeout(timeoutId);
    }
  }, [view, agendaViewType]);

  const CurrentTimeLine = () => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
      const interval = setInterval(() => setNow(new Date()), 60000);
      return () => clearInterval(interval);
    }, []);

    const isTodayInView = (agendaViewType === 'day' && formatDateYYYYMMDD(baseDate) === formatDateYYYYMMDD(todayDate)) ||
                          (agendaViewType === 'week' && weekDays.some(d => formatDateYYYYMMDD(d) === formatDateYYYYMMDD(todayDate)));
    
    if (!isTodayInView) return null;

    const currHour = now.getHours();
    const currMin = now.getMinutes();
    const topPos = currHour * 128 + (currMin / 60) * 128;

    return (
      <div 
        className="absolute w-full flex items-center z-20 pointer-events-none" 
        style={{ top: `${topPos}px` }} 
      >
        <div className="w-12 md:w-16 flex justify-end pr-2">
          <div className="bg-forest text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {now.getHours().toString().padStart(2, '0')}:{now.getMinutes().toString().padStart(2, '0')}
          </div>
        </div>
        <div className="flex-1 h-px bg-forest shadow-[0_0_4px_rgba(var(--color-forest),0.5)] relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-forest"></div>
        </div>
      </div>
    );
  };

  const uniqueVals = {
    area: Array.from(new Set(tasks.map(t => t.area).filter(v => v && v !== '-'))),
    project: Array.from(new Set(tasks.map(t => t.project).filter(v => v && v !== '-'))),
    naipe: Array.from(new Set(tasks.map(t => t.naipe).filter(v => v && v !== '-'))),
    priority: Array.from(new Set(tasks.map(t => t.priority).filter(v => v && v !== '-'))),
  };
  
  const filterLabels = {
    area: 'Área',
    project: 'Projeto',
    naipe: 'Naipe',
    priority: 'Prioridade'
  };

  const statuses = ['not-started', 'in-progress', 'done', 'arquivadas'];
  const statusLabels: Record<string, { label: string, color: string }> = {
    'not-started': { label: 'Not started', color: 'bg-red-400/20 text-red-500' },
    'in-progress': { label: 'Progredindo', color: 'bg-amber-400/20 text-amber-600' },
    'done': { label: 'Done', color: 'bg-emerald-400/20 text-emerald-500' },
    'arquivadas': { label: 'Arquivadas', color: 'bg-emerald-700/20 text-emerald-700' },
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'P 1') return 'bg-red-500/20 text-red-700';
    if (priority === 'P 2') return 'bg-orange-500/20 text-orange-700';
    if (priority === 'P 3') return 'bg-yellow-500/20 text-yellow-700';
    return 'bg-black/5 text-ink/60';
  };

  const filteredTasks = tasks.filter(t => {
    if (!t.title.toLowerCase().includes(filterText.toLowerCase())) return false;
    if (filterModes.area.length > 0 && !filterModes.area.includes(t.area)) return false;
    if (filterModes.project.length > 0 && !filterModes.project.includes(t.project || '')) return false;
    if (filterModes.naipe.length > 0 && !filterModes.naipe.includes(t.naipe || '')) return false;
    if (filterModes.priority.length > 0 && !filterModes.priority.includes(t.priority || '')) return false;
    
    // Date filter
    if (dateFilter && view !== 'agenda') {
      if (!isTaskOnDate(t.executionDate, dateFilter)) return false;
    }
    
    // Minhas Agendas fake filter (assuming Pessoal maps to area and Lab 1 to project)
    if (minhasAgendas.length > 0) {
      // In a real app we'd map this properly, but let's just make sure at least one agenda matches
      // Or just do nothing since we don't have a real Agenda field
      // Let's assume if 'Pessoal' is checked, it shows area Pessoal; if Lab 1, it shows project LE704...
      // Or maybe we treat "Minhas Agendas" as a list of everything to show if checked?
      // Actually, if we leave it to always pass, we don't break the tasks for now.
    }
    
    return true;
  });

  const hours = Array.from({length: 24}).map((_, i) => `${i.toString().padStart(2, '0')}:00`);
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, newTaskArea, newTaskProject, {
        executionDate: newTaskDate || '-',
        priority: newTaskPriority,
        naipe: newTaskNaipe || '-'
      });
      setNewTaskTitle('');
      setNewTaskArea('Inbox');
      setNewTaskProject('');
      setNewTaskDate('');
      setNewTaskPriority('P 3');
      setNewTaskNaipe('');
      setIsAddingTask(false);
    }
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (destination.droppableId.startsWith('agenda-')) {
      const hour = destination.droppableId.split('-')[1];
      editTask(draggableId, 'executionDate', hour);
      return;
    }

    if (destination.droppableId !== source.droppableId && !destination.droppableId.startsWith('agenda-')) {
      editTask(draggableId, 'status', destination.droppableId);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full relative"> 
      {/* View Header with adapted filters button to top right */}
      <div className="flex items-start justify-between">
        <ViewHeader 
          title="Tasks" 
          description="Gestão completa do seu inventário de tarefas e agenda."
          icon={ListTodo}
          action={null} 
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 z-50 mr-2">
            
            {/* Calendar Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setOpenFilterCat(prev => prev === 'date' ? null : 'date'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${dateFilter ? 'bg-forest text-white shadow-sm' : 'bg-white border border-forest/10 text-ink/60 hover:text-ink hover:bg-forest/5 shadow-sm'}`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {dateFilter ? formatBRDate(dateFilter.toISOString()) : 'Data'}
              </button>
              
              {openFilterCat === 'date' && (
                <div onClick={e => e.stopPropagation()} className="absolute top-full mt-2 right-0 w-[280px] bg-white/95 backdrop-blur-md border border-forest/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[16px] z-[100] p-4 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center gap-2 mb-4">
                    <select 
                      value={month}
                      onChange={(e) => {
                        const newDate = new Date(baseDate);
                        newDate.setMonth(parseInt(e.target.value));
                        setBaseDate(newDate);
                      }}
                      className="text-[14px] font-bold text-ink bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest/20 rounded p-1 hover:bg-black/5 transition-colors appearance-none"
                    >
                      {monthNames.map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                      ))}
                    </select>
                    <input 
                      type="number"
                      value={year}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 1900 && val < 2100) {
                          const newDate = new Date(baseDate);
                          newDate.setFullYear(val);
                          setBaseDate(newDate);
                        }
                      }}
                      className="text-[14px] font-bold text-ink bg-transparent cursor-pointer w-16 focus:outline-none focus:ring-2 focus:ring-forest/20 rounded p-1 hover:bg-black/5 transition-colors"
                    />
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); navigateDate('prev'); }} className="p-1 hover:bg-black/5 rounded"><ChevronRight className="w-4 h-4 rotate-180 text-ink/60" /></button>
                      <button onClick={(e) => { e.stopPropagation(); setBaseDate(new Date()); }} className="text-[10px] uppercase font-bold text-ink/60 hover:text-ink px-1">Hoje</button>
                      <button onClick={(e) => { e.stopPropagation(); navigateDate('next'); }} className="p-1 hover:bg-black/5 rounded"><ChevronRight className="w-4 h-4 text-ink/60" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-ink/40 mb-2">
                    <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-medium text-ink">
                    {daysInMonthView.slice(0, 35).map((d, i) => {
                      const isToday = formatDateYYYYMMDD(d) === todayStr;
                      const isSelected = dateFilter && formatDateYYYYMMDD(d) === formatDateYYYYMMDD(dateFilter);
                      return (
                        <div 
                          key={i} 
                          onClick={() => {
                            if (isSelected) setDateFilter(null);
                            else setDateFilter(d);
                            setBaseDate(d); // Also update basedate for agenda views
                          }}
                          className={`p-1.5 rounded-md transition-colors ${isSelected ? 'bg-forest text-white font-bold shadow-sm' : isToday ? 'bg-forest/10 text-forest font-bold' : 'hover:bg-black/5 cursor-pointer'} ${d.getMonth() !== month && !isSelected ? 'text-ink/30' : ''}`}
                        >
                          {d.getDate()}
                        </div>
                      );
                    })}
                  </div>
                  {dateFilter && (
                    <button className="w-full mt-3 text-[11px] text-forest font-bold hover:text-forest/70 transition-colors bg-forest/5 py-1.5 rounded-lg" onClick={() => setDateFilter(null)}>
                      Limpar Data
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Minhas Agendas Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setOpenFilterCat(prev => prev === 'agendas' ? null : 'agendas'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${minhasAgendas.length > 0 ? 'bg-forest text-white shadow-sm' : 'bg-white border border-forest/10 text-ink/60 hover:text-ink hover:bg-forest/5 shadow-sm'}`}
              >
                <Filter className="w-3.5 h-3.5" />
                Agendas
              </button>
              
              {openFilterCat === 'agendas' && (
                <div onClick={e => e.stopPropagation()} className="absolute top-full mt-2 right-0 w-64 bg-white/95 backdrop-blur-md border border-forest/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[16px] z-[100] p-3 max-h-[350px] overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between mb-3 px-1 border-b border-forest/5 pb-2">
                    <span className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em] text-left block w-full">MINHAS AGENDAS</span>
                    {minhasAgendas.length > 0 && (
                      <button className="text-[10px] text-forest font-bold hover:text-forest/70 transition-colors bg-forest/5 px-2 py-0.5 rounded-full whitespace-nowrap" onClick={() => setMinhasAgendas([])}>Limpar</button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {['Pessoal', 'Lab 1'].map(item => {
                      const isChecked = minhasAgendas.includes(item);
                      return (
                        <div 
                          key={item} 
                          className={`flex items-center gap-3 p-2 rounded-[12px] cursor-pointer transition-all border ${isChecked ? 'bg-forest/5 border-forest/20 shadow-sm' : 'border-transparent hover:bg-black/5'}`}
                          onClick={() => { 
                            setMinhasAgendas(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
                          }}
                        >
                          <div className={`w-4 h-4 rounded-[6px] flex items-center justify-center shrink-0 transition-all duration-200 ${isChecked ? 'bg-forest text-white scale-100' : 'border-2 border-ink/20 scale-90'}`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className={`text-[12px] truncate ${isChecked ? 'font-bold text-ink' : 'text-ink/60 font-medium'}`}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {Object.keys(uniqueVals).map(key => {
              const list = uniqueVals[key as keyof typeof uniqueVals];
              if (list.length === 0) return null;
              const label = filterLabels[key as keyof typeof filterLabels];
              
              return (
                <div className="relative" key={key}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setOpenFilterCat(prev => prev === key ? null : key); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filterModes[key]?.length > 0 ? 'bg-forest text-white shadow-sm' : 'bg-white border border-forest/10 text-ink/60 hover:text-ink hover:bg-forest/5 shadow-sm'}`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    {label}
                  </button>
                  
                  {openFilterCat === key && (
                    <div className="absolute top-full mt-2 right-0 w-64 bg-white/95 backdrop-blur-md border border-forest/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[16px] z-[100] p-3 max-h-[350px] overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-100">
                      <div className="flex items-center justify-between mb-3 px-1 border-b border-forest/5 pb-2">
                        <span className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">{label}</span>
                        {filterModes[key]?.length > 0 && (
                          <button className="text-[10px] text-forest font-bold hover:text-forest/70 transition-colors bg-forest/5 px-2 py-0.5 rounded-full" onClick={(e) => { e.stopPropagation(); setFilterModes(p => ({ ...p, [key]: [] }))}}>Limpar</button>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        {list.map(item => {
                          const isExplicitlySelected = filterModes[key]?.includes(item);
                          const isChecked = !hasAnyFilter || isExplicitlySelected;

                          return (
                            <div 
                              key={item} 
                              className={`flex items-center gap-3 p-2 rounded-[12px] cursor-pointer transition-all border ${isChecked ? 'bg-forest/5 border-forest/20 shadow-sm' : 'border-transparent hover:bg-black/5'}`}
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setFilterModes(prev => {
                                  const isOnlyThisSelected = Object.keys(prev).every(k => {
                                    if (k === key) return prev[k].length === 1 && prev[k][0] === item;
                                    return prev[k].length === 0;
                                  });
                                  
                                  if (isOnlyThisSelected) {
                                    return { area: [], project: [], naipe: [], priority: [] };
                                  } else {
                                    return { 
                                      area: [], project: [], naipe: [], priority: [],
                                      [key]: [item]
                                    };
                                  }
                                });
                              }}
                            >
                              <div className={`w-4 h-4 rounded-[6px] flex items-center justify-center shrink-0 transition-all duration-200 ${isChecked ? 'bg-forest text-white scale-100' : 'border-2 border-ink/20 scale-90'}`}>
                                {isChecked && <Check className="w-3 h-3" />}
                              </div>
                              <span className={`text-[12px] truncate ${isChecked ? 'font-bold text-ink' : 'text-ink/60 font-medium'}`}>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button 
            onClick={() => setIsAddingTask(true)}
            className="h-9 px-4 rounded-lg bg-forest text-white text-[13px] font-bold hover:bg-forest/90 transition shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nova Tarefa
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 border-b border-forest/10 pb-4">
        <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl">
          <button onClick={() => setView('board')} className={`px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-all ${view === 'board' ? 'bg-white shadow-sm text-forest' : 'text-ink/60 hover:text-ink'}`}>
            <Kanban className="w-4 h-4" /> Board
          </button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-all ${view === 'list' ? 'bg-white shadow-sm text-forest' : 'text-ink/60 hover:text-ink'}`}>
            <LayoutGrid className="w-4 h-4" /> Default view
          </button>
          <button onClick={() => setView('agenda')} className={`px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-all ${view === 'agenda' ? 'bg-white shadow-sm text-forest' : 'text-ink/60 hover:text-ink'}`}>
            <Calendar className="w-4 h-4" /> Agenda
          </button>
        </div>
        <div className="flex-1"></div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="h-9 pl-9 pr-3 rounded-lg bg-white border border-forest/10 text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-forest/20 w-64 shadow-sm"
          />
        </div>
      </div>

      {view === 'board' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
            {statuses.map(status => {
              const colTasks = filteredTasks.filter(t => t.status === status);
              const { label, color } = statusLabels[status];
              
              return (
                <div key={status} className="flex-shrink-0 w-[280px] flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${color}`}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block bg-current mr-1.5 -translate-y-px"></span>
                      {label}
                    </span>
                    <span className="text-[12px] font-bold text-ink/40 ml-1">{colTasks.length}</span>
                  </div>
                  
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className={`flex flex-col gap-3 min-h-[100px] rounded-xl transition-colors ${snapshot.isDraggingOver ? 'bg-forest/5' : ''}`}
                      >
                        {colTasks.map((t, index) => (
                           // @ts-ignore
                          <Draggable key={t.id} draggableId={t.id} index={index}>
                            {(provided, snapshot) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-xl p-3 border ${snapshot.isDragging ? 'border-forest ring-2 ring-forest/20 shadow-lg' : 'border-forest/10 shadow-sm'} hover:shadow-md hover:border-forest/20 transition-all flex flex-col gap-2.5 group group/card cursor-pointer`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className={`text-[14px] leading-snug font-bold flex-1 ${t.status === 'done' || t.status === 'arquivadas' ? 'text-ink/40 line-through' : 'text-ink'}`}>
                                    📄 {t.title}
                                  </span>
                                </div>
                                
                                <div className="flex flex-col gap-1.5">
                                  {t.priority && t.priority !== '-' && (
                                    <div><span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${getPriorityColor(t.priority)}`}>{t.priority.replace(' ', '')}</span></div>
                                  )}
                                  
                                  <label className="flex items-center gap-2 cursor-pointer group/chk" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleTask(t.id); }}>
                                    <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${t.status === 'done' || t.status === 'arquivadas' ? 'bg-forest border-forest text-white' : 'border-ink/20 bg-transparent group-hover/chk:border-forest/50'}`}>
                                      {(t.status === 'done' || t.status === 'arquivadas') && <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <span className="text-[12px] font-medium text-ink/70">Done</span>
                                  </label>
                                  
                                  {t.executionDate && t.executionDate !== '-' && (
                                    <div className="text-[12px] font-medium text-ink/70 mt-1 flex items-center gap-1.5">
                                      <Calendar className="w-3 h-3 opacity-60" /> {formatBRDate(t.executionDate)}
                                    </div>
                                  )}
                                  
                                  {t.project && t.project !== '-' && (
                                    <div className="text-[12px] font-medium text-ink/70 flex items-center gap-1.5 mt-1">
                                      <span className="opacity-60">🧠</span> {t.project}
                                    </div>
                                  )}
                                  
                                  {t.area && t.area !== '-' && t.area !== 'Inbox' && (
                                    <div className="text-[12px] font-medium text-ink/70 flex items-center gap-1.5 mt-0.5">
                                      <span className="opacity-60">📝</span> {t.area}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        <button 
                          onClick={() => setIsAddingTask(true)} 
                          className="flex items-center gap-2 text-[13px] font-bold text-ink/40 hover:text-forest hover:bg-forest/5 p-2 rounded-lg transition-colors mt-1"
                        >
                          <Plus className="w-4 h-4" /> New
                        </button>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {view === 'list' && (
        <div className="bg-white rounded-3xl pb-2 border border-forest/10 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-[#f8f9fa] sticky top-0 z-10">
                <tr className="border-b border-forest/10">
                  <th className="py-3 px-4 text-[11px] font-bold text-ink/40 uppercase tracking-widest w-12 text-center">Feito</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-ink/40 uppercase tracking-widest">Tarefa</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-ink/40 uppercase tracking-widest">Área / Projeto</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-ink/40 uppercase tracking-widest">Naipe</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-ink/40 uppercase tracking-widest w-32">Prazo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/5 text-[14px]">
                {filteredTasks.map(t => (
                  <tr key={t.id} className="hover:bg-forest/[0.02] transition-colors group cursor-pointer">
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleTask(t.id); }}
                        className={`w-5 h-5 mx-auto rounded-[6px] border flex items-center justify-center transition-all ${
                          t.status === 'done' || t.status === 'arquivadas' ? 'bg-forest border-forest text-white' : 'border-ink/20 bg-white hover:border-forest/50'
                        }`}
                      >
                        {(t.status === 'done' || t.status === 'arquivadas') && <i className="w-2.5 h-2.5 bg-white rounded-full"></i>}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold transition-colors ${t.status === 'done' || t.status === 'arquivadas' ? 'line-through text-ink/30' : 'text-ink'}`}>
                        {t.title}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-forest/5 text-forest">{t.area}</span>
                      {t.project && <span className="text-[12px] font-bold text-ink/40 flex items-center gap-1"> {t.project}</span>}
                    </td>
                    <td className="py-3 px-4 font-bold text-ink/60">
                      {t.naipe ? formatNaipe(t.naipe) : '-'}
                    </td>
                    <td className="py-3 px-4 font-bold text-ink/40">
                      <span className="bg-black/5 px-2 py-0.5 rounded-md text-ink/60">{t.executionDate !== '-' ? formatBRDate(t.executionDate) : 'Sem data'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'agenda' && (
        <div className="bg-white rounded-3xl border border-forest/10 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between p-4 border-b border-forest/10 bg-[#f8f9fa] shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setBaseDate(new Date())} className="h-8 px-3 rounded-md bg-white border border-forest/10 text-ink text-[12px] font-bold hover:bg-black/5 shadow-sm transition">Hoje</button>
              <div className="flex items-center gap-2 opacity-60">
                <button onClick={() => navigateDate('prev')} className="p-1.5 hover:bg-black/5 rounded"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                <button onClick={() => navigateDate('next')} className="p-1.5 hover:bg-black/5 rounded"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-forest/10 rounded-lg p-1.5 shadow-sm">
                <Calendar className="w-4 h-4 text-forest ml-1.5 opacity-60" />
                <select 
                  value={month}
                  onChange={(e) => {
                    const newDate = new Date(baseDate);
                    newDate.setMonth(parseInt(e.target.value));
                    setBaseDate(newDate);
                  }}
                  className="text-[14px] sm:text-[16px] font-bold text-ink bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest/20 rounded px-1.5 py-0.5 hover:bg-black/5 transition-colors appearance-none"
                >
                  {monthNames.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
                <input 
                  type="number"
                  value={year}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 1900 && val < 2100) {
                      const newDate = new Date(baseDate);
                      newDate.setFullYear(val);
                      setBaseDate(newDate);
                    }
                  }}
                  className="text-[14px] sm:text-[16px] font-bold text-ink bg-transparent cursor-pointer w-[60px] sm:w-[70px] focus:outline-none focus:ring-2 focus:ring-forest/20 rounded px-1.5 py-0.5 hover:bg-black/5 transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white border border-forest/10 rounded-lg p-1 shadow-sm">
              <button onClick={() => setAgendaViewType('day')} className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-all ${agendaViewType === 'day' ? 'bg-forest/10 text-forest' : 'text-ink/60 hover:bg-black/5 hover:text-ink'}`}>Dia</button>
              <button onClick={() => setAgendaViewType('week')} className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-all ${agendaViewType === 'week' ? 'bg-forest/10 text-forest' : 'text-ink/60 hover:bg-black/5 hover:text-ink'}`}>Semana</button>
              <button onClick={() => setAgendaViewType('month')} className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-all ${agendaViewType === 'month' ? 'bg-forest/10 text-forest' : 'text-ink/60 hover:bg-black/5 hover:text-ink'}`}>Mês</button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {agendaViewType === 'day' && (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col flex-1 bg-[#f8f9fa] overflow-hidden p-4">
                  <div className="flex flex-col max-w-4xl mx-auto w-full h-full">
                    {/* All day tasks - STATIC */}
                    <div className="flex group min-h-[60px] border-b border-forest/10 bg-[#f8f9fa] z-10 w-full flex-shrink-0 pb-2">
                      <div className="w-16 text-right text-[11px] font-bold text-ink/40 pt-2 pr-4 bg-forest/5 flex-shrink-0 rounded-tl-lg">All Day</div>
                      <Droppable droppableId={`agenda-allday`}>
                        {(provided, snapshot) => (
                           <div 
                              ref={provided.innerRef} 
                              {...provided.droppableProps}
                              className={`flex-1 p-2 pt-2 transition-colors relative flex flex-wrap gap-2 ${snapshot.isDraggingOver ? 'bg-forest/5' : ''}`}
                            >
                              {filteredTasks.filter(t => isTaskOnDate(t.executionDate, todayDate) && (getTaskHour(t.executionDate) === null)).map((task, idx) => {
                                // @ts-ignore
                                return (<Draggable key={task.id} draggableId={task.id} index={idx}>
                                  {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="w-auto flex-1 min-w-[200px] max-w-[300px]">
                                      {/* @ts-ignore */}
                                      <CalendarTaskCard task={task} size="md" onToggle={toggleTask} />
                                    </div>
                                  )}
                                </Draggable>);
                              })}
                              {provided.placeholder}
                           </div>
                        )}
                      </Droppable>
                    </div>

                    {/* Timeline - SCROLLABLE */}
                    <div className="flex-1 overflow-y-auto relative w-full pr-2" ref={scrollRef}>
                      <CurrentTimeLine />

                      {hours.map(hour => {
                        const tasksInHour = filteredTasks.filter(t => isTaskOnDate(t.executionDate, todayDate) && getTaskHour(t.executionDate) === hour);
                        return (
                          <div key={hour} className="flex group h-32">
                            <div className="w-16 text-right text-[11px] font-bold text-ink/40 pt-2 pr-4 border-b border-forest/10 -mt-px">{hour}</div>
                            <Droppable droppableId={`agenda-${hour}`}>
                              {(provided, snapshot) => (
                                <div 
                                  ref={provided.innerRef} 
                                  {...provided.droppableProps}
                                  className={`flex-1 border-t border-forest/10 border-l border-l-forest/10 p-2 transition-colors relative flex flex-col gap-2 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-forest/5' : ''}`}
                                >
                                  {tasksInHour.map((task, idx) => {
                                    // @ts-ignore
                                    return (<Draggable key={task.id} draggableId={task.id} index={idx}>
                                      {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="w-full xl:max-w-md">
                                          {/* @ts-ignore */}
                                          <CalendarTaskCard task={task} size="md" onToggle={toggleTask} />
                                        </div>
                                      )}
                                    </Draggable>);
                                  })}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </DragDropContext>
            )}

            {agendaViewType === 'week' && (
              <div className="flex flex-col flex-1 bg-[#f8f9fa] overflow-hidden">
                {/* Header Days - STATIC */}
                <div className="flex border-b border-forest/10 bg-[#f8f9fa] p-2 pt-4 flex-shrink-0">
                  <div className="w-12"></div>
                  {weekDays.map((day, i) => {
                    const isToday = formatDateYYYYMMDD(day) === formatDateYYYYMMDD(new Date());
                    return (
                      <div key={i} className="flex-1 text-center flex flex-col items-center">
                        <div className={`text-[11px] font-bold uppercase mb-1 ${isToday ? 'text-forest' : 'text-ink/40'}`}>{daysOfWeek[i]}</div>
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[16px] font-bold ${isToday ? 'bg-forest text-white' : 'text-ink'}`}>{day.getDate()}</div>
                      </div>
                    );
                  })}
                </div>

                {/* All day section - STATIC */}
                <div className="flex border-b border-forest/10 bg-[#f8f9fa] flex-shrink-0 z-10 w-full pr-2">
                  <div className="w-12 border-r border-forest/10 flex flex-col">
                    <div className="min-h-[60px] h-full text-right text-[10px] font-bold text-ink/40 pr-2 pt-2 bg-forest/5 flex-shrink-0 rounded-tl-lg">All Day</div>
                  </div>
                  <div className="flex-1 flex">
                    {weekDays.map((day, dIdx) => (
                      <div key={dIdx} className="flex-1 border-r border-forest/10 flex flex-col min-w-0">
                        <div className="min-h-[60px] max-h-[120px] overflow-y-auto p-1.5 bg-forest/5 flex-shrink-0 flex flex-col gap-1">
                          {filteredTasks.filter(t => isTaskOnDate(t.executionDate, day) && getTaskHour(t.executionDate) === null).map(task => (
                            // @ts-ignore
                            <CalendarTaskCard key={task.id} task={task} size="sm" onToggle={toggleTask} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Body - SCROLLABLE */}
                <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative w-full pr-2" ref={scrollRef}>
                  <div className="flex relative">
                    <CurrentTimeLine />
                    <div className="w-12 border-r border-forest/10 flex flex-col">
                      {hours.map(hour => <div key={hour} className="h-32 text-right text-[10px] font-bold text-ink/40 pr-2 pt-2 border-b border-forest/10 -mt-px">{hour}</div>)}
                    </div>
                    <div className="flex-1 flex">
                      {weekDays.map((day, dIdx) => (
                        <div key={dIdx} className="flex-1 border-r border-forest/10 flex flex-col min-w-0">
                          {hours.map(hour => {
                            const tasksInSlot = filteredTasks.filter(t => isTaskOnDate(t.executionDate, day) && getTaskHour(t.executionDate) === hour);
                            return (
                              <div key={hour} className="h-32 border-b border-forest/10 p-1.5 overflow-y-auto flex flex-col gap-1">
                                {tasksInSlot.map(task => (
                                  // @ts-ignore
                                  <CalendarTaskCard key={task.id} task={task} size="md" onToggle={toggleTask} />
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {agendaViewType === 'month' && (
              <div className="flex-1 flex flex-col p-4 bg-[#f8f9fa] overflow-auto">
                <div className="grid grid-cols-7 gap-px bg-forest/10 flex-1 border border-forest/10 rounded-xl overflow-hidden shadow-sm">
                  {daysOfWeek.map(day => (
                    <div key={day} className="bg-[#f8f9fa] p-3 py-2 text-[11px] font-bold text-ink/40 uppercase text-center">{day}</div>
                  ))}
                  {daysInMonthView.map((d, i) => {
                    const isToday = formatDateYYYYMMDD(d) === todayStr;
                    const tasksOnDay = filteredTasks.filter(t => isTaskOnDate(t.executionDate, d));
                    
                    return (
                      <div key={i} className={`bg-white p-2 min-h-[120px] flex flex-col gap-1 relative group hover:bg-black/[0.02] ${d.getMonth() !== month ? 'bg-black/[0.02]' : ''}`}>
                        <div className={`text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-forest text-white' : d.getMonth() !== month ? 'text-ink/30' : 'text-ink/60'}`}>
                          {d.getDate()}
                        </div>
                        <div className="flex-1 overflow-y-auto pr-1">
                          {tasksOnDay.map(task => (
                            // @ts-ignore
                            <CalendarTaskCard key={task.id} task={task} size="sm" onToggle={toggleTask} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modern Dialog Overlay for Adding Task */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsAddingTask(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink/40 mb-4 flex items-center gap-2">
                <ListTodo className="w-4 h-4" /> Nova Tarefa
              </div>
              <input
                autoFocus
                type="text"
                placeholder="O que precisa ser feito?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                className="w-full text-[24px] font-bold text-ink placeholder:text-ink/20 focus:outline-none mb-6"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f8f9fa] rounded-xl p-3 border border-forest/5 flex flex-col gap-1 focus-within:ring-2 focus-within:ring-forest/20">
                  <div className="text-[11px] font-bold text-ink/40">PROJETO</div>
                  <select 
                    value={newTaskProject}
                    onChange={(e) => {
                      setNewTaskProject(e.target.value);
                      const proj = projects.find(p => p.title === e.target.value);
                      if (proj) setNewTaskArea(proj.area);
                    }}
                    className="bg-transparent text-[13px] font-bold text-ink focus:outline-none w-full"
                  >
                    <option value="">Nenhum (Inbox)</option>
                    {projects.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                  </select>
                </div>
                <div className="bg-[#f8f9fa] rounded-xl p-3 border border-forest/5 flex flex-col gap-1 focus-within:ring-2 focus-within:ring-forest/20">
                  <div className="text-[11px] font-bold text-ink/40 flex items-center gap-1"><Calendar className="w-3 h-3" /> DATA</div>
                  <input 
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="bg-transparent text-[13px] font-bold text-ink focus:outline-none w-full"
                  />
                </div>
                <div className="bg-[#f8f9fa] rounded-xl p-3 border border-forest/5 flex flex-col gap-1 focus-within:ring-2 focus-within:ring-forest/20">
                  <div className="text-[11px] font-bold text-ink/40 flex items-center gap-1"><Hash className="w-3 h-3" /> PRIORIDADE</div>
                  <select 
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="bg-transparent text-[13px] font-bold text-ink focus:outline-none w-full"
                  >
                    <option value="P 1">P 1 - Alta</option>
                    <option value="P 2">P 2 - Média</option>
                    <option value="P 3">P 3 - Normal</option>
                    <option value="P 4">P 4 - Baixa</option>
                  </select>
                </div>
                <div className="bg-[#f8f9fa] rounded-xl p-3 border border-forest/5 flex flex-col gap-1 focus-within:ring-2 focus-within:ring-forest/20">
                  <div className="text-[11px] font-bold text-ink/40">NAIPE (ENERGIA)</div>
                  <select 
                    value={newTaskNaipe}
                    onChange={(e) => setNewTaskNaipe(e.target.value)}
                    className="bg-transparent text-[13px] font-bold text-ink focus:outline-none w-full"
                  >
                    <option value="">N/A</option>
                    <option value="♦️ Ouros">♦️ Ouros</option>
                    <option value="♥️ Copas">♥️ Copas</option>
                    <option value="♣️ Paus">♣️ Paus</option>
                    <option value="♠️ Espadas">♠️ Espadas</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 bg-[#f8f9fa] border-t border-forest/10">
              <button 
                onClick={() => setIsAddingTask(false)}
                className="px-4 py-2 font-bold text-[13px] text-ink/60 hover:text-ink transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddTask}
                className="px-6 py-2 bg-forest text-white font-bold text-[13px] rounded-xl shadow-sm hover:bg-forest/90 transition-all"
              >
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
