const fs = require('fs');

let file = fs.readFileSync('src/components/views/DadosRelacional.tsx', 'utf-8');

// Replace the legend and selected node details block

const startTag = '{/* Selected Node Details Card (Bottom Left) */}';
const endTag = '</div>\n          </div>\n        </div>\n      </div>\n      \n      <NewItemDialog';

const startIdx = file.indexOf(startTag);
const endIdx = file.indexOf(endTag) + endTag.length - 28; // just before <NewItemDialog

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find start or end index.");
  process.exit(1);
}

const replacement = `
        {/* Left Side Container for Panels */}
        <div className="absolute top-6 left-6 flex flex-col gap-4 z-10 max-h-[calc(100%-48px)] w-[320px] pointer-events-none">
          
          {/* Categories Toggle & Card */}
          <div className="flex flex-col gap-2 pointer-events-auto">
             <button 
               onClick={() => setIsFiltersOpen(!isFiltersOpen)}
               className="flex items-center justify-between bg-black/40 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-3 w-[200px] hover:bg-white/5 transition-colors"
             >
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/50">
                  <Filter className="w-3.5 h-3.5" />
                  Categorias
                </div>
                <div className="text-white/40">
                  {isFiltersOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
             </button>
             
             {isFiltersOpen && (
                <div className="bg-black/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 p-4 w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    {[
                      { id: 'areas', label: 'Áreas', color: '#D95319', icon: Layers },
                      { id: 'projects', label: 'Projetos', color: '#0072BD', icon: FolderKanban },
                      { id: 'tasks', label: 'Tarefas', color: '#7E2F8E', icon: CheckCircle2 },
                      { id: 'resources', label: 'Recursos', color: '#77AC30', icon: Library },
                    ].map(cat => (
                      <div key={cat.id} className="flex items-center justify-between group">
                        <button 
                          onClick={() => toggleFilter(cat.id)}
                          className={\`flex items-center gap-2 text-[12px] font-semibold transition-colors \${activeFilters[cat.id] ? 'text-white' : 'text-white/40'}\`}
                        >
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeFilters[cat.id] ? cat.color : 'rgba(255,255,255,0.1)' }} />
                          {cat.label}
                        </button>
                        <button 
                          onClick={() => handleCreateNode(cat.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-white/50 transition-all"
                          title={\`Novo \${cat.label}\`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
             )}
          </div>

          {/* Selected Node Details Card */}
          {selectedNode && (
            <div className="pointer-events-auto bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-y-auto max-h-full animate-in fade-in slide-in-from-left-4 duration-300 custom-scrollbar flex-shrink-0">
              <div className="h-2 w-full shrink-0" style={{ backgroundColor: selectedNode.color }} />
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="text-[10px] font-bold tracking-widest uppercase opacity-60" style={{ color: selectedNode.color }}>
                    {selectedNode.group === 'areas' ? 'Área' : selectedNode.group === 'projects' ? 'Projeto' : selectedNode.group === 'tasks' ? 'Tarefa' : 'Recurso'}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Editable properties area */}
                <div className="space-y-4">
                  {/* Title / Name */}
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Título</span>
                     <input 
                        type="text"
                        className="bg-transparent text-lg font-bold text-white leading-tight outline-none border-b border-transparent focus:border-white/20 pb-1 w-full"
                        value={selectedNode.group === 'areas' ? selectedNode.data.name : selectedNode.data.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (selectedNode.group === 'areas') editArea(selectedNode.id, 'name', val);
                          else if (selectedNode.group === 'projects') editProject(selectedNode.id, 'title', val);
                          else if (selectedNode.group === 'tasks') editTask(selectedNode.id, 'title', val);
                          else editResource(selectedNode.id, 'title', val);
                          
                          // update local selected node so input updates smoothly without waiting for full rebuild if it stutters
                          selectedNode.name = val;
                          if(selectedNode.group === 'areas') selectedNode.data.name = val; else selectedNode.data.title = val;
                          // Trigger re-render of local component if needed, or rely on store
                        }}
                     />
                  </div>

                  {/* Status (if applicable) */}
                  {selectedNode.group !== 'areas' && selectedNode.group !== 'resources' && (
                     <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Status</span>
                       <select 
                          className="bg-white/5 border border-white/10 rounded-md text-[13px] text-white/90 p-1.5 outline-none focus:border-white/30"
                          value={selectedNode.data.status || ''}
                          onChange={(e) => {
                             const val = e.target.value;
                             if (selectedNode.group === 'projects') editProject(selectedNode.id, 'status', val);
                             else if (selectedNode.group === 'tasks') editTask(selectedNode.id, 'status', val);
                             selectedNode.data.status = val;
                          }}
                       >
                         {selectedNode.group === 'projects' ? (
                           <>
                             <option value="active" className="bg-neutral-900">Em Andamento</option>
                             <option value="completed" className="bg-neutral-900">Concluído</option>
                             <option value="on-hold" className="bg-neutral-900">Pausado</option>
                           </>
                         ) : (
                           <>
                             <option value="not-started" className="bg-neutral-900">Não Iniciado</option>
                             <option value="in-progress" className="bg-neutral-900">Em Andamento</option>
                             <option value="done" className="bg-neutral-900">Concluído</option>
                           </>
                         )}
                       </select>
                     </div>
                  )}

                  {/* Area (if applicable) */}
                  {selectedNode.group !== 'areas' && (
                     <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Área</span>
                       <select 
                          className="bg-white/5 border border-white/10 rounded-md text-[13px] text-white/90 p-1.5 outline-none focus:border-white/30"
                          value={selectedNode.data.area || ''}
                          onChange={(e) => {
                             const val = e.target.value;
                             if (selectedNode.group === 'projects') editProject(selectedNode.id, 'area', val);
                             else if (selectedNode.group === 'tasks') editTask(selectedNode.id, 'area', val);
                             else editResource(selectedNode.id, 'area', val);
                             selectedNode.data.area = val;
                          }}
                       >
                         <option value="" className="bg-neutral-900">Nenhuma</option>
                         {areas.map(a => <option key={a.id} value={a.id} className="bg-neutral-900">{a.name}</option>)}
                       </select>
                     </div>
                  )}

                  {/* Project (if applicable) */}
                  {(selectedNode.group === 'tasks' || selectedNode.group === 'resources') && (
                     <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Projeto</span>
                       <select 
                          className="bg-white/5 border border-white/10 rounded-md text-[13px] text-white/90 p-1.5 outline-none focus:border-white/30"
                          value={selectedNode.data.project || ''}
                          onChange={(e) => {
                             const val = e.target.value;
                             if (selectedNode.group === 'tasks') editTask(selectedNode.id, 'project', val);
                             else editResource(selectedNode.id, 'project', val);
                             selectedNode.data.project = val;
                          }}
                       >
                         <option value="" className="bg-neutral-900">Nenhum</option>
                         {projects.map(p => <option key={p.id} value={p.id} className="bg-neutral-900">{p.title}</option>)}
                       </select>
                     </div>
                  )}
                  
                  {/* Additional Property (e.g., executionDate, desc, link) */}
                  {selectedNode.group === 'projects' && (
                     <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Descrição</span>
                       <textarea 
                          className="bg-white/5 border border-white/10 rounded-md text-[13px] text-white/90 p-1.5 outline-none focus:border-white/30 resize-none h-16"
                          value={selectedNode.data.desc || ''}
                          placeholder="Adicione uma descrição..."
                          onChange={(e) => {
                             const val = e.target.value;
                             editProject(selectedNode.id, 'desc', val);
                             selectedNode.data.desc = val;
                          }}
                       />
                     </div>
                  )}
                  {selectedNode.group === 'tasks' && (
                     <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Data de Execução</span>
                       <input 
                          type="date"
                          className="bg-white/5 border border-white/10 rounded-md text-[13px] text-white/90 p-1.5 outline-none focus:border-white/30"
                          value={selectedNode.data.executionDate || ''}
                          onChange={(e) => {
                             const val = e.target.value;
                             editTask(selectedNode.id, 'executionDate', val);
                             selectedNode.data.executionDate = val;
                          }}
                       />
                     </div>
                  )}
                  {selectedNode.group === 'resources' && (
                     <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Link</span>
                       <input 
                          type="text"
                          className="bg-white/5 border border-white/10 rounded-md text-[13px] text-white/90 p-1.5 outline-none focus:border-white/30"
                          value={selectedNode.data.link || ''}
                          placeholder="https://..."
                          onChange={(e) => {
                             const val = e.target.value;
                             editResource(selectedNode.id, 'link', val);
                             selectedNode.data.link = val;
                          }}
                       />
                       {selectedNode.data.link && (
                         <a href={selectedNode.data.link} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-400 hover:underline truncate mt-1">Acessar link externo</a>
                       )}
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
          <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-1 flex flex-col gap-1 pointer-events-auto">
            <button onClick={handleZoomIn} className="p-2 hover:bg-white/10 rounded-lg text-white/70 transition-colors" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleCenter} className="p-2 hover:bg-white/10 rounded-lg text-white/70 transition-colors" title="Centralizar">
              <Maximize className="w-4 h-4" />
            </button>
            <button onClick={handleZoomOut} className="p-2 hover:bg-white/10 rounded-lg text-white/70 transition-colors" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      `;

file = file.substring(0, startIdx) + replacement + file.substring(endIdx);
fs.writeFileSync('src/components/views/DadosRelacional.tsx', file);
