import React, { useState } from 'react';
import { useStore } from '../../store';
import { formatNaipe } from '../../lib/icons';
import { Search, Filter, Download, Plus, BrainCircuit, Check, X, Network, Archive, ArchiveRestore, Trash2, AlertTriangle } from 'lucide-react';

export default function DadosCortex() {
  const { tasks, projects, areas, resources, addTask, addProject, addArea, archivedNodeIds, toggleArchiveNode, deleteNodes } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [viewMode, setViewMode] = useState<'ativos' | 'arquivados'>('ativos');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Task');
  const [newRelation, setNewRelation] = useState('');

  const handleAddSubmit = () => {
    if (!newTitle.trim()) {
      setIsAdding(false);
      return;
    }
    
    if (newType === 'Task') {
      addTask(newTitle, newRelation || 'Inbox');
    } else if (newType === 'Project') {
      addProject(newTitle, '', newRelation || 'Inbox');
    } else if (newType === 'Area') {
      addArea(newTitle, '📁');
    }
    
    setNewTitle('');
    setNewRelation('');
    setIsAdding(false);
  };

  const rArea = (val: any) => Array.isArray(val) ? val.join(', ') : (val || '-');

  const unifiedData = [
    ...areas.map(a => ({ id: a.id, type: 'Area', title: a.name, status: 'active', relation: 'Córtex', icon: a.icon, executionDate: '-', priority: '-', naipe: '-', day: '-', link: '-', battleTokens: '-', subAreas: '-', areaCol: a.name, projetoCol: '-', tarefaCol: '-', recursoCol: '-', colorStyle: 'bg-orange-100 text-orange-700' })),
    ...projects.map(p => ({ id: p.id, type: 'Project', title: p.title, status: p.status, relation: p.area, icon: '📂', executionDate: p.due || '-', priority: '-', naipe: '-', day: '-', link: '-', battleTokens: '-', subAreas: '-', areaCol: p.area, projetoCol: p.title, tarefaCol: '-', recursoCol: '-', colorStyle: 'bg-blue-100 text-blue-700' })),
    ...tasks.map(t => ({ id: t.id, type: 'Task', title: t.title, status: t.status, relation: t.project || t.area, icon: '✓', executionDate: t.executionDate, priority: t.priority, naipe: t.naipe || '-', day: t.day || '-', link: t.link || '-', battleTokens: t.battleTokens || '-', subAreas: t.subAreas || '-', areaCol: t.area, projetoCol: t.project || '-', tarefaCol: t.title, recursoCol: '-', colorStyle: 'bg-purple-100 text-purple-700' })),
    ...resources.map((r: any) => ({ id: r.id, type: 'Resource', title: r.title, status: 'active', relation: rArea(r.task) !== '-' ? rArea(r.task) : rArea(r.project) !== '-' ? rArea(r.project) : rArea(r.area) !== '-' ? rArea(r.area) : 'Inbox', icon: '📄', executionDate: '-', priority: '-', naipe: '-', day: '-', link: '-', battleTokens: '-', subAreas: '-', areaCol: rArea(r.area), projetoCol: rArea(r.project), tarefaCol: rArea(r.task), recursoCol: r.title, colorStyle: 'bg-green-100 text-green-700'}))
  ];

  const filteredByMode = unifiedData.filter(d => 
    viewMode === 'ativos' ? !archivedNodeIds.includes(d.id) : archivedNodeIds.includes(d.id)
  );

  const filteredData = filteredByMode.filter(d => 
    d.title.toLowerCase().includes(filterText.toLowerCase()) || 
    d.type.toLowerCase().includes(filterText.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length && filteredData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(d => d.id)));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Tem certeza que deseja deletar PERMANENTEMENTE ${selectedIds.size} itens?`)) {
      deleteNodes(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-white border border-forest/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-xl overflow-hidden mt-2">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-forest/10 bg-[#f9fafb]">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 font-bold text-[13px] rounded-lg shadow-sm cursor-pointer transition-colors ${viewMode === 'ativos' ? 'bg-forest text-white' : 'bg-white text-ink/60 hover:bg-forest/5 border border-forest/10'}`} onClick={() => { setViewMode('ativos'); setSelectedIds(new Set()); }}>
              <BrainCircuit className="w-4 h-4" />
              Knowledge Intake
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 font-bold text-[13px] rounded-lg shadow-sm cursor-pointer transition-colors ${viewMode === 'arquivados' ? 'bg-red-800 text-white' : 'bg-white text-ink/60 hover:bg-red-50 hover:text-red-800 border border-black/5'}`} onClick={() => { setViewMode('arquivados'); setSelectedIds(new Set()); }}>
              <Archive className="w-4 h-4" />
              Arquivados
            </div>
            
            <div className="h-4 w-px bg-forest/20 mx-1"></div>
            
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input 
                type="text" 
                placeholder="Buscar em todo o sistema..." 
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-forest/10 rounded-lg text-[12px] font-medium w-64 focus:outline-none focus:ring-2 focus:ring-forest/20 text-ink placeholder:text-ink/40 shadow-sm transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === 'ativos' ? (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-forest/5 text-forest border border-forest/10 rounded-lg text-[12px] font-bold hover:bg-forest/10 transition-colors shadow-sm mr-2"
              >
                <Plus className="w-3.5 h-3.5" /> Novo Nó Global
              </button>
            ) : (
              selectedIds.size > 0 && (
                <button 
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 border border-red-200 rounded-lg text-[12px] font-bold hover:bg-red-200 transition-colors shadow-sm mr-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Deletar ({selectedIds.size})
                </button>
              )
            )}
            <div className="h-4 w-px bg-forest/20 mx-1"></div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-forest/10 rounded-lg text-[12px] font-bold text-ink hover:bg-forest/5 transition-colors shadow-sm">
              <Filter className="w-3.5 h-3.5" /> Filtrar Tipo
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-forest/10 rounded-lg text-[12px] font-bold text-ink hover:bg-forest/5 transition-colors shadow-sm">
              <Download className="w-3.5 h-3.5" /> Exportar .CSV
            </button>
          </div>
        </div>

        {/* Data Table Area */}
        <div className="flex-1 overflow-auto bg-white tabular-nums w-full relative">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="sticky top-0 bg-[#f9fafb] z-10 shadow-sm border-b border-forest/10">
              <tr>
                {viewMode === 'arquivados' && (
                  <th className="w-10 py-2.5 px-4 bg-[#f9fafb] border-r border-forest/5">
                    <input 
                      type="checkbox"
                      checked={selectedIds.size === filteredData.length && filteredData.length > 0}
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                )}
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">ID (Único)</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Ramo</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Entidade (Nome)</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Status</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Prioridade</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Naipe</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Relação Pai (Nó acima)</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Due / Data</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Dia</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Link</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Battle Tokens</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Sub Áreas</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Área</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Projeto</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Tarefa</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-ink/50 uppercase tracking-widest whitespace-nowrap border-r border-forest/5 bg-[#f9fafb]">Recurso</th>
                <th className="w-12 bg-[#f9fafb]"></th>
              </tr>
            </thead>
            <tbody className="text-[12px] font-medium text-ink">
              {/* Inline Add Row */}
              {isAdding && viewMode === 'ativos' && (
                <tr className="bg-forest/5 border-b border-forest/10">
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="font-mono text-[10px] text-forest/40">auto-gen</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <select 
                      className="bg-white border border-forest/20 rounded px-2 py-1 text-[12px] font-bold focus:outline-none focus:border-forest/50 w-full"
                      value={newType}
                      onChange={e => setNewType(e.target.value)}
                    >
                      <option value="Task">Task</option>
                      <option value="Project">Project</option>
                      <option value="Area">Area</option>
                      <option value="Resource">Resource</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap max-w-[300px] border-r border-forest/5">
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Nome da Entidade..." 
                      className="w-full bg-white border border-forest/20 rounded px-2 py-1 text-[12px] focus:outline-none focus:border-forest/50"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubmit()}
                    />
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">not-started</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap text-ink/60 max-w-[200px] border-r border-forest/5">
                     <input 
                      type="text" 
                      placeholder="Nó Pai (Opcional)..." 
                      className="w-full bg-white border border-forest/20 rounded px-2 py-1 text-[12px] focus:outline-none focus:border-forest/50"
                      value={newRelation}
                      onChange={(e) => setNewRelation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubmit()}
                    />
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="text-[10px] text-ink/40 italic">-</span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={handleAddSubmit} className="p-1.5 text-forest bg-white shadow-sm border border-forest/10 hover:bg-forest/10 rounded"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setIsAdding(false)} className="p-1.5 text-ink/40 bg-white shadow-sm border border-forest/10 hover:bg-ink/5 rounded"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              )}

              {filteredData.map((d, i) => (
                <tr key={d.id} className={`hover:bg-forest/5 group transition-colors ${i !== filteredData.length - 1 ? 'border-b border-forest/5' : ''}`}>
                  {viewMode === 'arquivados' && (
                    <td className="py-2 px-4 border-r border-forest/5">
                      <input 
                        type="checkbox"
                        checked={selectedIds.has(d.id)}
                        onChange={() => toggleSelect(d.id)}
                        className="cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className="font-mono text-[10px] text-ink/40 group-hover:text-forest transition-colors">{d.id}</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${d.colorStyle}`}>{d.type}</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap max-w-[300px] truncate border-r border-forest/5">
                    <span className="font-bold flex items-center gap-2"><span className="text-sm opacity-80">{d.icon}</span> {d.title}</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border text-ink/60 shadow-sm cursor-pointer ${
                      d.status === 'done' ? 'bg-forest/10 text-forest border-transparent' : 
                      d.status === 'in-progress' ? 'bg-amber-100 text-amber-700 border-transparent' :
                      d.status === 'arquivadas' ? 'bg-red-100 text-red-800 border-transparent' :
                      'bg-white border-ink/10'
                    }`}>
                      {d.status === 'in-progress' ? 'Progredindo' : d.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60">
                    <span className={`px-1.5 py-0.5 rounded bg-forest/5 text-forest text-[10px] font-bold tracking-widest`}>{d.priority || '-'}</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60 text-center">
                    {formatNaipe(d.naipe)}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap text-ink/60 truncate max-w-[200px] border-r border-forest/5 cursor-pointer">
                    <span className="flex items-center gap-1.5 hover:text-forest"><Network className="w-3.5 h-3.5 text-ink/30" /> {d.relation}</span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60 cursor-pointer hover:text-forest">
                    {d.executionDate}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60">
                    {d.day}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60 underline">
                    {d.link && d.link !== '-' ? <a href={d.link} target="_blank" rel="noreferrer" className="text-forest hover:text-forest/80">Link</a> : '-'}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60">
                    {d.battleTokens}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60">
                    {d.subAreas}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60">
                    {d.areaCol}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60">
                    {d.projetoCol}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60 truncate max-w-[150px]">
                    {d.tarefaCol}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap border-r border-forest/5 text-ink/60 truncate max-w-[150px]">
                    {d.recursoCol}
                  </td>
                  <td className="py-2 px-2 text-center flex items-center justify-center gap-1">
                    <button 
                      onClick={() => toggleArchiveNode(d.id)}
                      className="p-1.5 text-ink/30 hover:text-ink hover:bg-black/5 rounded-md transition-colors"
                      title={viewMode === 'ativos' ? "Arquivar" : "Restaurar"}
                    >
                      {viewMode === 'ativos' ? <Archive className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
                    </button>
                    {viewMode === 'arquivados' && (
                      <button 
                        onClick={() => deleteNodes([d.id])}
                        className="p-1.5 text-red-500/50 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Deletar permanentemente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={viewMode === 'arquivados' ? 8 : 7} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center text-ink/40 font-medium text-[13px]">
                      <BrainCircuit className="w-10 h-10 mb-4 text-ink/20" />
                      Nenhum registro encontrado {viewMode === 'arquivados' ? 'nos arquivados' : 'no Córtex'}. Tente buscar algo diferente.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {viewMode === 'arquivados' && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 text-red-800 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div className="text-[13px]">
            <h4 className="font-bold text-red-900 mb-1">Área de Arquivados</h4>
            <p className="text-red-800/80">
              Você está visualizando os nós arquivados da Knowledge Intake. Itens arquivados mantêm suas conexões originais para o diagrama, mas são ocultados das visualizações ativas. Atenção: Excluir um item permanentemente aqui não poderá ser desfeito.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
