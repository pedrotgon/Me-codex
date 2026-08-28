import React, { useState, useRef } from 'react';
import { useStore, Task, Project, Area, Resource } from '../../store';
import { 
  Upload, 
  FolderSync, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HardDrive, 
  Layers, 
  FolderKanban, 
  CheckSquare, 
  FileText, 
  RefreshCw, 
  Database, 
  Cpu, 
  AlertCircle, 
  Play, 
  Eye, 
  Server, 
  Terminal, 
  Check, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export interface IngestedItemPreview {
  id: string;
  sourceFile: string;
  sourceType: string;
  size: string;
  detectedCategory: 'Area' | 'Project' | 'Task' | 'Resource';
  title: string;
  assignedArea: string;
  assignedProject?: string;
  priority?: string;
  confidence: number;
  tags: string[];
  status: 'pending' | 'processing' | 'classified' | 'integrated';
}

export default function DadosIngestao() {
  const { addBatchItems, setCurrentView, setSelectedProjectId, tasks, projects, areas, resources } = useStore();
  
  // Pipeline Stages: 1. Input/Upload -> 2. AI & ParaOrganizer Engine -> 3. Pipeline Queue / Review -> 4. Integrated
  const [pipelineStep, setPipelineStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLog, setProcessingLog] = useState<string[]>([]);
  const [integrationSuccess, setIntegrationSuccess] = useState(false);
  
  // Selected files queue
  const [rawFiles, setRawFiles] = useState<Array<{ name: string; size: string; type: string }>>([
    { name: 'plano_estrategico_q3.pdf', size: '2.4 MB', type: 'PDF' },
    { name: 'backup_notion_unicamp_2026.zip', size: '18.7 MB', type: 'ZIP / SQL' },
    { name: 'reuniao_alinhamento_ia.m4a', size: '6.1 MB', type: 'Audio' },
    { name: 'anotacoes_pesquisa_mestrado.md', size: '45 KB', type: 'Markdown' },
    { name: 'contrato_locacao_escritorio.pdf', size: '1.2 MB', type: 'PDF' }
  ]);

  // Classified Items by the ParaOrganizer Engine
  const [classifiedQueue, setClassifiedQueue] = useState<IngestedItemPreview[]>([
    {
      id: 'ing-1',
      sourceFile: 'plano_estrategico_q3.pdf',
      sourceType: 'PDF Document',
      size: '2.4 MB',
      detectedCategory: 'Project',
      title: 'Lançamento Estratégico Q3',
      assignedArea: 'Trabalho',
      confidence: 98,
      tags: ['#meta-q3', '#roadmaps', '#diretoria'],
      status: 'classified'
    },
    {
      id: 'ing-2',
      sourceFile: 'plano_estrategico_q3.pdf [Seção 4]',
      sourceType: 'Sub-extração',
      size: '2.4 MB',
      detectedCategory: 'Task',
      title: 'Apresentar KPI de expansão para investidores',
      assignedArea: 'Trabalho',
      assignedProject: 'Lançamento Estratégico Q3',
      priority: 'P 1',
      confidence: 95,
      tags: ['#pitch', '#financeiro'],
      status: 'classified'
    },
    {
      id: 'ing-3',
      sourceFile: 'backup_notion_unicamp_2026.zip [SQL/DB]',
      sourceType: 'Archive ZIP',
      size: '18.7 MB',
      detectedCategory: 'Area',
      title: 'Pesquisa e Pós-Graduação Unicamp',
      assignedArea: 'Unicamp',
      confidence: 99,
      tags: ['#academico', '#fapesp', '#lab'],
      status: 'classified'
    },
    {
      id: 'ing-4',
      sourceFile: 'anotacoes_pesquisa_mestrado.md',
      sourceType: 'Markdown',
      size: '45 KB',
      detectedCategory: 'Task',
      title: 'Concluir revisão sistemática de literatura no Scopus',
      assignedArea: 'Unicamp',
      assignedProject: 'Pesquisa e Pós-Graduação Unicamp',
      priority: 'P 2',
      confidence: 94,
      tags: ['#scopus', '#artigo'],
      status: 'classified'
    },
    {
      id: 'ing-5',
      sourceFile: 'reuniao_alinhamento_ia.m4a',
      sourceType: 'Voice Memo',
      size: '6.1 MB',
      detectedCategory: 'Task',
      title: 'Configurar automação do ParaOrganizer via Cloud Run',
      assignedArea: 'Sistemas',
      assignedProject: 'Automações Córtex',
      priority: 'P 1',
      confidence: 97,
      tags: ['#cloud-run', '#devops', '#ia'],
      status: 'classified'
    },
    {
      id: 'ing-6',
      sourceFile: 'contrato_locacao_escritorio.pdf',
      sourceType: 'PDF Document',
      size: '1.2 MB',
      detectedCategory: 'Resource',
      title: 'Contrato de Locação e Termos de Uso 2026',
      assignedArea: 'Finanças',
      confidence: 99,
      tags: ['#imobiliario', '#documento-legal'],
      status: 'classified'
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    const newFileObjs = files.map((f: File) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.name.split('.').pop()?.toUpperCase() || 'FILE'
    }));
    setRawFiles(prev => [...newFileObjs, ...prev]);
  };

  // Run the ParaOrganizer Pipeline
  const runOrganizerPipeline = () => {
    setIsProcessing(true);
    setProcessingLog([]);
    
    const logs = [
      '⚡ Iniciando ParaOrganizer Ingestion Engine...',
      '📦 Descompactando arquivos, diretórios e esquemas SQL/JSON...',
      '🧠 Analisando estrutura semântica com o Córtex...',
      '🔍 Mapeando relacionamentos: Área ➔ Projeto ➔ Tarefa ➔ Recurso...',
      '🏷️ Aplicando taxonomia e categorização de alta confiança...',
      '✅ Fila de produção estruturada com sucesso!'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setProcessingLog(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsProcessing(false);
          setPipelineStep(2);
        }
      }, (index + 1) * 450);
    });
  };

  // Apply Changes into the Real Store / Brain
  const commitToSystem = () => {
    if (addBatchItems) {
      const newAreas = classifiedQueue
        .filter(item => item.detectedCategory === 'Area')
        .map(a => ({ name: a.title, icon: '📂' }));

      const newProjects = classifiedQueue
        .filter(item => item.detectedCategory === 'Project')
        .map(p => ({
          title: p.title,
          desc: `Importado via ParaOrganizer (${p.sourceFile})`,
          area: p.assignedArea || 'Inbox',
          status: 'active' as const
        }));

      const newTasks = classifiedQueue
        .filter(item => item.detectedCategory === 'Task')
        .map(t => ({
          title: t.title,
          area: t.assignedArea || 'Inbox',
          project: t.assignedProject,
          priority: t.priority || 'P 2',
          battleTokens: '15',
          status: 'not-started' as const
        }));

      const newResources = classifiedQueue
        .filter(item => item.detectedCategory === 'Resource')
        .map(r => ({
          title: r.title,
          area: r.assignedArea,
          project: r.assignedProject
        }));

      addBatchItems({
        areas: newAreas,
        projects: newProjects,
        tasks: newTasks,
        resources: newResources
      });
    }

    setIntegrationSuccess(true);
    setPipelineStep(3);
  };

  const updateItemCategory = (id: string, newCat: 'Area' | 'Project' | 'Task' | 'Resource') => {
    setClassifiedQueue(prev => prev.map(item => item.id === id ? { ...item, detectedCategory: newCat } : item));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      
      {/* Workflow Stepper / Header */}
      <div className="bg-white rounded-[24px] p-6 border border-forest/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest/10 flex items-center justify-center text-forest">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-ink">Fluxo de Upload do Para-Organizer</h2>
              <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                v2.4 Sincronização
              </span>
            </div>
            <p className="text-[13px] text-ink/60 font-medium">
              Pipeline de produção autônomo: Entrada de arquivos, descompactação, taxonomia e atualização de todo o Segundo Cérebro.
            </p>
          </div>
        </div>

        {/* Status Steps */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-forest/5 p-1.5 rounded-2xl border border-forest/10">
          <div className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all ${pipelineStep === 1 ? 'bg-forest text-white shadow-sm' : 'text-ink/60'}`}>
            <Upload className="w-3.5 h-3.5" /> 1. Upload
          </div>
          <ChevronRight className="w-4 h-4 text-forest/30" />
          <div className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all ${pipelineStep === 2 ? 'bg-forest text-white shadow-sm' : 'text-ink/60'}`}>
            <Sparkles className="w-3.5 h-3.5" /> 2. Fila Organizada
          </div>
          <ChevronRight className="w-4 h-4 text-forest/30" />
          <div className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 transition-all ${pipelineStep === 3 ? 'bg-emerald-700 text-white shadow-sm' : 'text-ink/60'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> 3. Sincronizado
          </div>
        </div>
      </div>

      {/* Main Workflow View */}
      {pipelineStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* File Dropper / Input */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-forest/10 shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="text-[17px] font-bold text-ink flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-forest" />
                  Entrada de arquivos e pastas do computador ou nuvem
                </h3>
                <p className="text-[13px] text-ink/60 font-medium mt-1">
                  Arraste qualquer arquivo (.zip, .pdf, .md, .sql, áudios, planilhas ou pastas inteiras). O pipeline extrai o contexto e auto-alimenta as tabelas e gráficos.
                </p>
              </div>

              {/* Drag Drop Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-forest/20 hover:border-forest/50 bg-[#fbfdfc] hover:bg-forest/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  multiple 
                  className="hidden" 
                />
                <div className="w-14 h-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <p className="text-[15px] font-bold text-ink">
                  Solte seus arquivos aqui ou clique para selecionar
                </p>
                <p className="text-[12px] text-ink/50 font-medium mt-1">
                  Suporta .ZIP, Pastas inteiras, Documentos, Áudios de voz, Notas Obsidian/Notion, Bancos SQL
                </p>
              </div>

              {/* Arquivos Selecionados na Fila de Entrada */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink/70">
                    Arquivos aguardando ingestão ({rawFiles.length})
                  </span>
                  <span className="text-[11px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-lg">
                    Prontos para processamento
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {rawFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-forest/5 border border-forest/10">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-forest text-[11px] font-bold shadow-xs shrink-0 border border-forest/10">
                          {file.type}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[13px] font-bold text-ink truncate">{file.name}</p>
                          <p className="text-[11px] text-ink/50 font-medium">{file.size}</p>
                        </div>
                      </div>
                      <Check className="w-4 h-4 text-forest shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-forest/10 flex items-center justify-between">
                <div className="text-[12px] text-ink/50 font-medium">
                  Modo de Execução: <strong>Vercel / Cloud Run + ParaOrganizer Autonomous Agent</strong>
                </div>
                <button
                  onClick={runOrganizerPipeline}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-xl bg-forest hover:bg-forest/90 text-white font-bold text-[14px] flex items-center gap-2 shadow-md transition-all hover:translate-y-[-1px] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processando Fila...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      Executar Workflow de Organização
                    </>
                  )}
                </button>
              </div>

              {/* Live Processing Terminal Logs */}
              {isProcessing && (
                <div className="bg-[#121c19] text-emerald-300 p-4 rounded-xl font-mono text-[12px] space-y-1.5 border border-emerald-900/50 shadow-inner">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-emerald-900/40 pb-2 mb-2">
                    <Terminal className="w-4 h-4" />
                    Console de Execução em Tempo Real
                  </div>
                  {processingLog.map((log, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-emerald-500">❯</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Cloud Integrations & Workflow Spec */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white rounded-[24px] p-6 border border-forest/10 shadow-sm flex flex-col gap-4">
              <h4 className="text-[15px] font-bold text-ink flex items-center gap-2">
                <Server className="w-4 h-4 text-forest" /> Conexões Automáticas
              </h4>
              <p className="text-[12px] text-ink/60 font-medium">
                O ParaOrganizer pode monitorar continuamente pastas do seu computador e repositórios na nuvem.
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl border border-forest/15 bg-forest/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-forest border border-forest/10 shadow-xs">
                      <FolderSync className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-ink">Pasta Local /Documents</p>
                      <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Monitorando em tempo real
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-forest/10 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-forest/5 flex items-center justify-center text-forest">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-ink">Vercel & Cloud Run API</p>
                      <p className="text-[11px] text-ink/40 font-medium">Endpoint Ativo</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-lg">Online</span>
                </div>
              </div>
            </div>

            <div className="bg-forest text-white rounded-[24px] p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-bold text-[15px] text-white">Como Funciona o Workflow</h4>
              </div>
              <p className="text-[12px] text-white/80 leading-relaxed font-medium">
                1. <strong>Input Universal:</strong> Arquivos brutos entram na fila.<br/>
                2. <strong>Classificação PARA:</strong> A IA distribui em Projetos, Áreas, Tarefas e Recursos.<br/>
                3. <strong>Atualização Global:</strong> Alimenta as tabelas de dados, log diário, grafos relacionais e o painel inicial instantaneamente.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Step 2: Review & Confirm Classified Queue */}
      {pipelineStep === 2 && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[24px] p-6 border border-forest/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-bold text-ink flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-forest" />
                Fila de Produção e Triagem Inteligente
              </h3>
              <p className="text-[13px] text-ink/60 font-medium mt-0.5">
                Revise os itens extraídos pelo ParaOrganizer antes de confirmar a integração permanente nas suas tabelas e painéis.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setPipelineStep(1)} 
                className="px-4 py-2 rounded-xl border border-forest/20 text-forest font-bold text-[13px] hover:bg-forest/5"
              >
                Voltar
              </button>
              <button 
                onClick={commitToSystem}
                className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest/90 text-white font-bold text-[13px] flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Integrar Todos no Sistema ({classifiedQueue.length})
              </button>
            </div>
          </div>

          {/* Classified Cards Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classifiedQueue.map((item) => {
              const catBg = 
                item.detectedCategory === 'Area' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                item.detectedCategory === 'Project' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                item.detectedCategory === 'Task' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <div key={item.id} className="bg-white rounded-2xl p-5 border border-forest/10 shadow-xs flex flex-col justify-between gap-4 hover:border-forest/30 transition-all">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <select 
                        value={item.detectedCategory} 
                        onChange={(e) => updateItemCategory(item.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${catBg}`}
                      >
                        <option value="Area">📁 Área</option>
                        <option value="Project">📂 Projeto</option>
                        <option value="Task">✓ Tarefa</option>
                        <option value="Resource">📄 Recurso</option>
                      </select>
                      <span className="text-[11px] font-bold text-forest/70 bg-forest/5 px-2 py-0.5 rounded-md">
                        {item.confidence}% confiança
                      </span>
                    </div>

                    <div>
                      <h4 className="text-[15px] font-bold text-ink leading-snug">{item.title}</h4>
                      <p className="text-[11px] text-ink/40 font-medium mt-1 truncate">
                        Origem: {item.sourceFile}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-forest/5">
                      <span className="text-[11px] font-bold bg-black/5 text-ink/70 px-2 py-0.5 rounded-md">
                        Área: {item.assignedArea}
                      </span>
                      {item.assignedProject && (
                        <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                          Proj: {item.assignedProject}
                        </span>
                      )}
                      {item.priority && (
                        <span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded-md">
                          {item.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[11px] text-ink/40 font-medium">
                    <span>{item.sourceType}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Pronto
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Success & System Update Confirmation */}
      {pipelineStep === 3 && (
        <div className="bg-white rounded-[32px] p-8 lg:p-12 border border-forest/10 shadow-sm flex flex-col items-center text-center max-w-2xl mx-auto my-6 gap-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-[24px] font-bold text-ink">Sistema Atualizado com Sucesso!</h3>
            <p className="text-[14px] text-ink/60 font-medium mt-2 leading-relaxed">
              Todos os {classifiedQueue.length} itens do workflow foram distribuídos, alocados no banco de dados, e o painel inicial e os gráficos foram recalculados automaticamente.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
            <div className="p-3.5 rounded-xl bg-forest/5 border border-forest/10">
              <div className="text-[20px] font-bold text-forest">{tasks.length}</div>
              <div className="text-[11px] font-bold text-ink/50 uppercase">Tarefas Totais</div>
            </div>
            <div className="p-3.5 rounded-xl bg-forest/5 border border-forest/10">
              <div className="text-[20px] font-bold text-forest">{projects.length}</div>
              <div className="text-[11px] font-bold text-ink/50 uppercase">Projetos</div>
            </div>
            <div className="p-3.5 rounded-xl bg-forest/5 border border-forest/10">
              <div className="text-[20px] font-bold text-forest">{areas.length}</div>
              <div className="text-[11px] font-bold text-ink/50 uppercase">Áreas Foco</div>
            </div>
            <div className="p-3.5 rounded-xl bg-forest/5 border border-forest/10">
              <div className="text-[20px] font-bold text-forest">{resources.length}</div>
              <div className="text-[11px] font-bold text-ink/50 uppercase">Recursos</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentView('home')}
              className="px-6 py-3 rounded-xl bg-forest text-white font-bold text-[13px] flex items-center gap-2 shadow-sm hover:bg-forest/90 transition-all"
            >
              <Eye className="w-4 h-4" /> Ver Painel Inicial & Gráficos Atualizados
            </button>
            <button
              onClick={() => {
                setPipelineStep(1);
                setIntegrationSuccess(false);
              }}
              className="px-5 py-3 rounded-xl border border-forest/20 text-forest font-bold text-[13px] hover:bg-forest/5 transition-all"
            >
              Novo Ingest / Upload
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
