import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { Library, Search, FileText, Link as LinkIcon, Image as ImageIcon, Video, Folder, Calendar, ExternalLink, ArrowUpRight, BarChart3, Database, LayoutGrid, List, ChevronDown, Check, X } from 'lucide-react';
import ViewHeader from '../ViewHeader';
import NewItemDialog from '../NewItemDialog';

const toArray = (val: any): string[] => {
  if (!val || val === '-' || val === 'Inbox') return [];
  if (Array.isArray(val)) return val;
  return [val];
};

function MultiSelect({ label, options, selected, onChange, placeholder }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item: string) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 flex-1" ref={ref}>
      <span className="text-[10px] font-bold text-ink/40 uppercase tracking-wider mb-1.5 pl-1">{label}</span>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-h-[44px] bg-white border border-forest/10 hover:border-forest/30 rounded-xl px-3 py-2 cursor-pointer shadow-sm transition-all"
      >
        <div className="flex flex-wrap gap-1.5 items-center overflow-hidden">
          {selected.length === 0 && <span className="text-ink/40 text-[13px] font-medium">{placeholder}</span>}
          {selected.map((item: string) => {
            const opt = options.find((o:any) => o.id === item || o.name === item || o.title === item);
            const display = opt ? (opt.name || opt.title || opt.id) : item;
            return (
            <span key={item} className="bg-forest/5 text-forest border border-forest/10 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 group truncate max-w-[150px]">
              <span className="truncate">{display}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleOption(item); }}
                className="hover:bg-forest/20 rounded-full p-0.5 transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )})}
        </div>
        <ChevronDown className="w-4 h-4 text-ink/30 shrink-0 ml-2" />
      </div>
      
      {isOpen && (
        <div className="absolute top-calc-100 mt-2 left-0 w-full min-w-[200px] bg-white border border-forest/10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 max-h-[250px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {options.length === 0 ? (
             <div className="p-3 text-[12px] font-medium text-ink/40 text-center">Nenhuma opção disponível</div>
          ) : (
            <div className="p-1.5 flex flex-col gap-0.5">
              {options.map((opt: any) => {
                const val = opt.name || opt.title || opt.id;
                const isSelected = selected.includes(val) || selected.includes(opt.id) || selected.includes(opt.name) || selected.includes(opt.title);
                const display = opt.name || opt.title || opt.id;
                
                return (
                  <button
                    key={val}
                    onClick={(e) => { e.stopPropagation(); toggleOption(val); }}
                    className={`flex items-center gap-2 w-full px-2.5 py-2 text-left text-[13px] font-medium rounded-lg transition-colors ${isSelected ? 'bg-forest/10 text-forest font-bold' : 'hover:bg-black/5 text-ink'}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-forest border-forest text-white' : 'border-ink/20 shadow-sm'}`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="truncate flex-1">{display}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResourceDetailModal({ resource, onClose, areas, projects, tasks, editResource, getTypeColor, getTypeIcon, getResourceType }: any) {
  const selectedAreas = toArray(resource.area);
  const selectedProjects = toArray(resource.project);
  const selectedTasks = toArray(resource.task);

  const handleUpdate = (field: string, values: string[]) => {
    editResource(resource.id, field, values.length > 0 ? values : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="border-b border-forest/10 p-6 sm:p-8 flex items-start gap-5 bg-gradient-to-b from-[#f8f9fa] to-white shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-ink/40 hover:text-ink transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center border shadow-sm ${getTypeColor(getResourceType(resource.title))} shrink-0 bg-white`}>
            {getTypeIcon(getResourceType(resource.title), "w-9 h-9")}
          </div>
          <div className="flex flex-col justify-center pt-1 pr-6 flex-1 min-w-0">
            <div className="text-[11px] font-black tracking-[0.2em] text-ink/30 uppercase mb-2">
              {getResourceType(resource.title)}
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-black leading-[1.1] text-ink break-words">{resource.title}</h2>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex-1 overflow-y-auto bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-forest" />
            <h4 className="text-[14px] font-black uppercase tracking-widest text-ink">Propriedades & Relacionamentos</h4>
          </div>
          <div className="bg-[#f8f9fa] border border-forest/10 rounded-2xl p-5 space-y-5 shadow-sm">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <MultiSelect 
                label="Áreas"
                placeholder="Selecione as áreas"
                options={areas}
                selected={selectedAreas}
                onChange={(vals: string[]) => handleUpdate('area', vals)}
              />
              <MultiSelect 
                label="Projetos"
                placeholder="Selecione os projetos"
                options={projects}
                selected={selectedProjects}
                onChange={(vals: string[]) => handleUpdate('project', vals)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <MultiSelect 
                label="Tarefas Associadas"
                placeholder="Selecione as tarefas"
                options={tasks}
                selected={selectedTasks}
                onChange={(vals: string[]) => handleUpdate('task', vals)}
              />
              <div className="flex-1"></div>
            </div>
            
          </div>
        </div>
        
        <div className="border-t border-forest/10 p-5 sm:p-6 bg-[#f8f9fa] flex flex-wrap-reverse sm:flex-nowrap items-center justify-between gap-4 shrink-0">
          <div className="text-[12px] font-medium text-ink/50 flex items-center gap-2 w-full sm:w-auto justify-center">
            <Check className="w-4 h-4 text-forest" /> Salvo em tempo real no Knowledge Intake
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white border border-forest/10 text-ink text-[13px] font-bold hover:bg-black/5 hover:border-forest/20 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-forest/20">
              Concluir
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-forest text-white text-[13px] font-bold hover:bg-forest/90 transition shadow-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:ring-offset-2">
              <ExternalLink className="w-4 h-4" /> Acessar Recurso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecursosView() {
  const { resources, addResource, projects, areas, tasks, editResource } = useStore();
  const [query, setQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [viewType, setViewType] = useState<'gallery' | 'table'>('gallery');

  const handleAddRecurso = (name: string) => {
    if (name) {
      addResource(name, 'Inbox');
    }
  };

  const getResourceType = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('http') || t.includes('www')) return 'link';
    if (t.includes('.jpg') || t.includes('.png') || t.includes('imagem') || t.includes('foto')) return 'image';
    if (t.includes('youtube') || t.includes('vimeo') || t.includes('vídeo') || t.includes('video')) return 'video';
    return 'document';
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'link': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'image': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'video': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-amber-100 text-amber-600 border-amber-200';
    }
  };

  const getTypeIcon = (type: string, className = "w-4 h-4") => {
    switch(type) {
      case 'link': return <LinkIcon className={className} />;
      case 'image': return <ImageIcon className={className} />;
      case 'video': return <Video className={className} />;
      default: return <FileText className={className} />;
    }
  };

  const filtered = resources.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));

  // KPIs
  const total = resources.length;
  const inAreas = resources.filter(r => toArray(r.area).some(a => a !== 'Inbox')).length;
  const withProjects = resources.filter(r => toArray(r.project).length > 0).length;
  const linkCount = resources.filter(r => getResourceType(r.title) === 'link').length;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full h-full relative">
      <ViewHeader 
        title="Biblioteca de Recursos" 
        description="Repositório centralizado de referências, materiais e arquivos."
        icon={Library}
        action={
          <button onClick={() => setIsDialogOpen(true)} className="h-10 px-5 rounded-xl bg-forest text-white text-[13px] font-bold hover:bg-forest/90 transition shadow-md flex items-center gap-2">
            <PlusIcon /> Adicionar Recurso
          </button>
        }
      />

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-forest/10 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-forest/5 rounded-full transition-transform group-hover:scale-150"></div>
          <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-4">
            <Library className="w-5 h-5" />
          </div>
          <div className="text-[32px] font-black tracking-tight text-ink mb-1">{total}</div>
          <div className="text-[12px] font-bold text-ink/40 uppercase tracking-wider">Total de Recursos</div>
        </div>
        
        <div className="bg-white border border-forest/10 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full transition-transform group-hover:scale-150"></div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
            <Folder className="w-5 h-5" />
          </div>
          <div className="text-[32px] font-black tracking-tight text-ink mb-1">{inAreas}</div>
          <div className="text-[12px] font-bold text-ink/40 uppercase tracking-wider">Vínculos por Área</div>
        </div>

        <div className="bg-white border border-forest/10 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full transition-transform group-hover:scale-150"></div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
            <Database className="w-5 h-5" />
          </div>
          <div className="text-[32px] font-black tracking-tight text-ink mb-1">{withProjects}</div>
          <div className="text-[12px] font-bold text-ink/40 uppercase tracking-wider">Vínculos em Projetos</div>
        </div>

        <div className="bg-white border border-forest/10 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full transition-transform group-hover:scale-150"></div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="text-[32px] font-black tracking-tight text-ink mb-1">{linkCount}</div>
          <div className="text-[12px] font-bold text-ink/40 uppercase tracking-wider">Links Externos</div>
        </div>
      </div>
      
      <div className="bg-white/50 border border-forest/10 rounded-2xl p-5 flex flex-col flex-1 shadow-sm min-h-0">
        <div className="relative mb-6 shrink-0 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar nos recursos do seu Cérebro..." 
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-forest/10 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-forest/20 text-ink transition-all shadow-sm" 
            />
          </div>
          <div className="flex bg-white border border-forest/10 rounded-xl p-1 h-12 shadow-sm">
            <button 
              onClick={() => setViewType('gallery')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${viewType === 'gallery' ? 'bg-forest/10 text-forest' : 'text-ink/40 hover:text-ink/70'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewType('table')}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${viewType === 'table' ? 'bg-forest/10 text-forest' : 'text-ink/40 hover:text-ink/70'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          {viewType === 'gallery' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((f, i) => {
                const type = getResourceType(f.title);
                const colorClass = getTypeColor(type);
                
                return (
                  <div 
                    key={f.id || i} 
                    onClick={() => setSelectedResource(f)}
                    className="group bg-white p-5 rounded-2xl border border-forest/10 hover:border-forest/30 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClass} shrink-0 transition-transform group-hover:scale-105`}>
                        {getTypeIcon(type, "w-6 h-6")}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-5 h-5 text-ink/30" />
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-[16px] text-ink leading-snug line-clamp-2 mb-3 flex-1 group-hover:text-forest transition-colors">{f.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-forest/5">
                      {toArray(f.area).map(a => a !== 'Inbox' && (
                        <span key={a} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-forest/5 text-forest/70">{a}</span>
                      ))}
                      {toArray(f.project).map(p => (
                        <span key={p} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-blue-500/5 text-blue-600">{p}</span>
                      ))}
                      {(toArray(f.area).length === 0 && toArray(f.project).length === 0) && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-ink/5 text-ink/50">Caixa de Entrada</span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {filtered.length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                  <Library className="w-12 h-12 text-ink/20 mb-4" />
                  <h3 className="text-lg font-bold text-ink">Nenhum recurso encontrado</h3>
                  <p className="text-sm font-medium text-ink/50 mt-1 max-w-md">Não conseguimos localizar nenhum recurso com estes termos na sua base de conhecimento.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-forest/10 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-forest/5 border-b border-forest/10">
                  <tr>
                    <th className="px-5 py-4 text-[11px] font-bold text-ink/40 uppercase tracking-wider">Tipo</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-ink/40 uppercase tracking-wider">Título</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-ink/40 uppercase tracking-wider">Área</th>
                    <th className="px-5 py-4 text-[11px] font-bold text-ink/40 uppercase tracking-wider">Projeto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5">
                  {filtered.map((f, i) => {
                    const type = getResourceType(f.title);
                    const colorClass = getTypeColor(type);

                    return (
                      <tr 
                        key={f.id || i}
                        onClick={() => setSelectedResource(f)}
                        className="hover:bg-forest/5 cursor-pointer transition-colors group"
                      >
                        <td className="px-5 py-4 w-16">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colorClass}`}>
                            {getTypeIcon(type)}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[14px] font-bold text-ink group-hover:text-forest transition-colors">{f.title}</p>
                        </td>
                        <td className="px-5 py-4">
                          {toArray(f.area).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {toArray(f.area).map(a => a !== 'Inbox' && (
                                <span key={a} className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-forest/5 text-forest/70">{a}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] font-medium text-ink/30">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {toArray(f.project).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {toArray(f.project).map(p => (
                                <span key={p} className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-500/5 text-blue-600">{p}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] font-medium text-ink/30">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-16 text-center">
                        <Library className="w-10 h-10 text-ink/20 mx-auto mb-3" />
                        <p className="text-[14px] font-bold text-ink">Nenhum recurso encontrado</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Resource Detail Modal */}
      {selectedResource && (
        <ResourceDetailModal 
          resource={resources.find(r => r.id === selectedResource.id) || selectedResource}
          onClose={() => setSelectedResource(null)}
          areas={areas}
          projects={projects}
          tasks={tasks}
          editResource={editResource}
          getTypeColor={getTypeColor}
          getTypeIcon={getTypeIcon}
          getResourceType={getResourceType}
        />
      )}

      <NewItemDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onConfirm={handleAddRecurso} 
        title="Novo Recurso" 
      />
    </div>
  );
}

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
