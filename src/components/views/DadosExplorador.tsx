import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { Search, Filter, Download, MoreHorizontal, Plus, Database, Check, X } from 'lucide-react';

export default function DadosExplorador() {
  const { tasks, projects, areas, addTask, addProject, addArea } = useStore();
  const [selectedTable, setSelectedTable] = useState('Tasks');
  const [isAdding, setIsAdding] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // States for new record
  const [newTitle, setNewTitle] = useState('');
  const [newArea, setNewArea] = useState('');

  const tables = ['Tasks', 'Notes', 'Resources', 'Projects', 'Areas', 'Daily Optimization'];

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddSubmit = () => {
    if (!newTitle.trim()) {
      setIsAdding(false);
      return;
    }
    
    if (selectedTable === 'Tasks') {
      addTask(newTitle, newArea || 'Inbox');
    } else if (selectedTable === 'Projects') {
      addProject(newTitle, '', newArea || 'Inbox');
    } else if (selectedTable === 'Areas') {
      addArea(newTitle, '📁');
    }
    
    setNewTitle('');
    setNewArea('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-white border border-forest/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-xl overflow-hidden mt-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-forest/10 bg-[#f9fafb] gap-2 relative z-20">
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between bg-white border border-forest/20 text-forest font-bold text-[13px] rounded-lg pl-3 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-forest/20 cursor-pointer shadow-sm w-44 hover:bg-forest/5 transition-colors"
            >
              <span className="truncate">{selectedTable}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ml-2 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-forest/10 rounded-lg shadow-xl z-[60] overflow-hidden">
                {tables.map(t => (
                  <button 
                    key={t}
                    onClick={() => {
                      setSelectedTable(t);
                      setIsDropdownOpen(false);
                      setIsAdding(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] transition-colors flex items-center ${
                      selectedTable === t 
                        ? 'bg-forest/5 text-forest font-bold' 
                        : 'text-ink hover:bg-forest/5 hover:text-forest font-medium'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="h-4 w-px bg-forest/20 mx-1"></div>
          
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Filtrar registros..." 
              className="pl-8 pr-3 py-1.5 bg-white border border-forest/10 rounded-lg text-[12px] font-medium w-64 focus:outline-none focus:ring-2 focus:ring-forest/20 text-ink placeholder:text-ink/40 shadow-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-forest text-white rounded-lg text-[12px] font-bold hover:bg-forest/90 transition-colors shadow-sm mr-2"
          >
            <Plus className="w-3.5 h-3.5" /> Novo Registro
          </button>
          <div className="h-4 w-px bg-forest/20 mx-1"></div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-forest/10 rounded-lg text-[12px] font-bold text-ink hover:bg-forest/5 transition-colors shadow-sm">
            <Filter className="w-3.5 h-3.5" /> Filtros
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-forest/10 rounded-lg text-[12px] font-bold text-ink hover:bg-forest/5 transition-colors shadow-sm">
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </div>

      {/* Data Table Area */}
      <div className="flex-1 overflow-auto bg-white tabular-nums relative w-full">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-[#f9fafb] z-10 shadow-sm">
            <tr>
              <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest border-b border-forest/10 whitespace-nowrap">ID</th>
              <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest border-b border-forest/10 whitespace-nowrap">Título / Nome</th>
              <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest border-b border-forest/10 whitespace-nowrap">Status</th>
              <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest border-b border-forest/10 whitespace-nowrap">
                {selectedTable === 'Projects' ? 'Área' : selectedTable === 'Areas' ? 'Ícone' : 'Área / Projeto'}
              </th>
              <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest border-b border-forest/10 whitespace-nowrap">Prazo / Info</th>
              <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest border-b border-forest/10 whitespace-nowrap border-r border-forest/10">Prioridade / Score</th>
              <th className="w-8 border-b border-forest/10 bg-[#f9fafb]"></th>
            </tr>
          </thead>
          <tbody className="text-[12px] font-medium text-ink">
            {/* Inline Add Row */}
            {isAdding && (selectedTable === 'Tasks' || selectedTable === 'Projects' || selectedTable === 'Areas') && (
              <tr className="bg-blue-50/50 border-b border-blue-100">
                <td className="py-2 px-4 whitespace-nowrap">
                  <span className="font-mono text-[10px] text-blue-400">new</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap max-w-[200px]">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Novo título..." 
                    className="w-full bg-white border border-blue-200 rounded px-2 py-1 text-[12px] focus:outline-none focus:border-blue-400"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubmit()}
                  />
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <span className="text-[10px] text-ink/40 italic">-</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-ink/60 max-w-[200px]">
                   <input 
                    type="text" 
                    placeholder="Área..." 
                    className="w-full bg-white border border-blue-200 rounded px-2 py-1 text-[12px] focus:outline-none focus:border-blue-400"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubmit()}
                  />
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-ink/40 text-[10px] italic">-</td>
                <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/40 text-[10px] italic">-</td>
                <td className="py-2 px-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={handleAddSubmit} className="p-1 text-blue-600 hover:bg-blue-100 rounded"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setIsAdding(false)} className="p-1 text-ink/40 hover:bg-black/5 rounded"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            )}

            {selectedTable === 'Tasks' && tasks.map((task, i) => (
              <tr key={task.id} className={`hover:bg-forest/5 group ${i !== tasks.length - 1 ? 'border-b border-forest/5' : ''}`}>
                <td className="py-2 px-4 whitespace-nowrap">
                  <span className="font-mono text-[10px] text-ink/40 group-hover:text-forest transition-colors">{task.id.length > 8 ? task.id.substring(0, 6) : task.id}</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap max-w-[200px] truncate">
                  <span className="font-bold">{task.title}</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    task.status === 'done' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>{task.status}</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-ink/60 truncate max-w-[200px]">
                  {task.area} {task.project ? <span className="text-forest font-bold">· {task.project}</span> : ''}
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-ink/60">{task.executionDate}</td>
                <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5"><span className="bg-forest/10 text-forest px-1.5 py-0.5 rounded text-[11px] font-bold tracking-widest">{task.priority || 'P 3'}</span></td>
                <td className="py-2 px-2 text-center text-ink/30 hover:text-ink cursor-pointer"><MoreHorizontal className="w-4 h-4 mx-auto" /></td>
              </tr>
            ))}

            {selectedTable === 'Projects' && projects.map((project, i) => (
              <tr key={project.id} className={`hover:bg-forest/5 group ${i !== projects.length - 1 ? 'border-b border-forest/5' : ''}`}>
                <td className="py-2 px-4 whitespace-nowrap">
                  <span className="font-mono text-[10px] text-ink/40 group-hover:text-forest transition-colors">{project.id.length > 8 ? project.id.substring(0, 6) : project.id}</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap max-w-[200px] truncate">
                  <span className="font-bold">{project.title}</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    project.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>{project.status.replace('-', ' ')}</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-ink/60 truncate max-w-[200px]">
                  {project.area}
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-ink/60">{project.progress}% completado</td>
                <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5"><span className="bg-forest/10 text-forest px-1.5 py-0.5 rounded text-[11px] font-bold tracking-widest">P1</span></td>
                <td className="py-2 px-2 text-center text-ink/30 hover:text-ink cursor-pointer"><MoreHorizontal className="w-4 h-4 mx-auto" /></td>
              </tr>
            ))}
            
            {selectedTable === 'Areas' && areas.map((area, i) => (
              <tr key={area.id} className={`hover:bg-forest/5 group ${i !== areas.length - 1 ? 'border-b border-forest/5' : ''}`}>
                <td className="py-2 px-4 whitespace-nowrap">
                  <span className="font-mono text-[10px] text-ink/40 group-hover:text-forest transition-colors">{area.id.length > 8 ? area.id.substring(0, 6) : area.id}</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap max-w-[200px] truncate">
                  <span className="font-bold">{area.name}</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700`}>active</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-ink/60 truncate max-w-[200px]">
                  <span className="text-[16px]">{area.icon}</span>
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-ink/60">{area.count} itens</td>
                <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5"><span className="bg-forest/10 text-forest px-1.5 py-0.5 rounded text-[11px] font-bold tracking-widest">-</span></td>
                <td className="py-2 px-2 text-center text-ink/30 hover:text-ink cursor-pointer"><MoreHorizontal className="w-4 h-4 mx-auto" /></td>
              </tr>
            ))}

            {/* Quick mock for other tables if empty */}
            {selectedTable !== 'Tasks' && selectedTable !== 'Projects' && selectedTable !== 'Areas' && (
              <tr>
                <td colSpan={7} className="py-12 flex-col flex items-center justify-center text-center text-ink/40 font-medium text-[13px]">
                  <Database className="w-8 h-8 mb-3 text-ink/20" />
                  Nenhum dado mockado configurado para a visualização <strong className="text-ink/60 ml-1">{selectedTable}</strong> no momento.<br/>A integração em produção puxaria os dados reais do Notion.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
