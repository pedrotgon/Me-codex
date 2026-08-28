import React, { useState } from 'react';
import { 
  FolderTree, 
  FileText, 
  FileCode2, 
  Copy, 
  Check, 
  ChevronDown, 
  Terminal,
  Sparkles,
  BookOpen,
  ArrowRight,
  Eye,
  Code2
} from 'lucide-react';
import ViewHeader from '../ViewHeader';
import DadosIngestao from './DadosIngestao';
import { CROSS_PLATFORM_PT, PARA_FRAMEWORK_PT, PARA_SKILL_PT } from '../../lib/paraOrganizerContent';

interface SkillFile {
  name: string;
  path: string;
  category: string;
  content: string;
}

export default function ParaOrganizerSkillView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'upload'>('overview');
  const [selectedFile, setSelectedFile] = useState<string>('SKILL.md');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const files: Record<string, SkillFile> = {
    "SKILL.md": { name: "SKILL.md", path: "SKILL.md", category: "", content: "" },
    "references/cross-platform-guide.md": { name: "cross-platform-guide.md", path: "references/cross-platform-guide.md", category: "", content: "" },
    "references/para-framework.md": { name: "para-framework.md", path: "references/para-framework.md", category: "", content: "" },
  };

  const localizedFiles: Record<string, SkillFile> = {
    'SKILL.md': {
      ...files['SKILL.md'],
      category: 'Arquivo principal da skill',
      content: PARA_SKILL_PT,
    },
    'references/cross-platform-guide.md': {
      ...files['references/cross-platform-guide.md'],
      category: 'Referência multiplataforma',
      content: CROSS_PLATFORM_PT,
    },
    'references/para-framework.md': {
      ...files['references/para-framework.md'],
      category: 'Framework teórico',
      content: PARA_FRAMEWORK_PT,
    },
  };

  const copySkillCode = () => {
    navigator.clipboard.writeText(localizedFiles[selectedFile]?.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-fade-in pb-12">
      
      {/* Header Unificado no Design Padrão do Sistema */}
      <ViewHeader
        title="Para-Organizer"
        description="Implemente o método PARA (Projetos, Áreas, Recursos e Arquivados) no sistema de arquivos local."
        icon={Sparkles}
        action={
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-ink/50">
              {isEnabled ? 'Skill ativa' : 'Skill inativa'}
            </span>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                isEnabled ? 'bg-forest justify-end' : 'bg-forest/20 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-xs" />
            </button>
          </div>
        }
      />

      {/* Tabs Claras e Leves */}
      <div className="flex items-center gap-2 border-b border-forest/10 pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-forest/10 text-forest'
              : 'text-ink/60 hover:text-ink hover:bg-forest/5'
          }`}
        >
          Visão geral
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'content'
              ? 'bg-forest/10 text-forest'
              : 'text-ink/60 hover:text-ink hover:bg-forest/5'
          }`}
        >
          <span>Conteúdo da skill</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-forest/10 text-forest font-semibold">
            3
          </span>
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-forest/10 text-forest'
              : 'text-ink/60 hover:text-ink hover:bg-forest/5'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>

      {/* ABA 1: VISÃO GERAL */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna Principal */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Descrição em Card Padrão Branco */}
            <div className="bg-white rounded-2xl p-6 border border-forest/10 shadow-xs flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-ink flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-forest" />
                Sobre a skill
              </h3>
              <p className="text-[13px] text-ink/70 leading-relaxed">
                Implementa o método PARA no sistema de arquivos local. A skill examina arquivos reais, apresenta um plano completo para aprovação e somente depois executa as alterações autorizadas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-forest/5 border border-forest/10 flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest">Regra de ouro</span>
                  <span className="text-[13px] font-bold text-ink">Primeiro planejar, depois agir</span>
                  <p className="text-[12px] text-ink/60">Nenhuma alteração sem aprovação explícita por escrito.</p>
                </div>
                <div className="p-4 rounded-xl bg-forest/5 border border-forest/10 flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest">Critério central</span>
                  <span className="text-[13px] font-bold text-ink">Espectro de acionabilidade</span>
                  <p className="text-[12px] text-ink/60">Organize informações pela relevância imediata para a vida e o trabalho.</p>
                </div>
              </div>
            </div>

            {/* Estrutura das 4 Pastas */}
            <div className="bg-white rounded-2xl p-6 border border-forest/10 shadow-xs flex flex-col gap-4">
              <h3 className="text-[15px] font-bold text-ink">Estrutura dos quatro pilares</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-forest/10 text-center">
                  <span className="text-[16px]">🚀</span>
                  <p className="text-[12px] font-bold text-ink mt-1">1 Projetos</p>
                  <p className="text-[10px] text-ink/50">Curto prazo e entregas</p>
                </div>
                <div className="p-3 rounded-xl border border-forest/10 text-center">
                  <span className="text-[16px]">📂</span>
                  <p className="text-[12px] font-bold text-ink mt-1">2 Áreas</p>
                  <p className="text-[10px] text-ink/50">Padrões contínuos</p>
                </div>
                <div className="p-3 rounded-xl border border-forest/10 text-center">
                  <span className="text-[16px]">📚</span>
                  <p className="text-[12px] font-bold text-ink mt-1">3 Recursos</p>
                  <p className="text-[10px] text-ink/50">Interesses e temas</p>
                </div>
                <div className="p-3 rounded-xl border border-forest/10 text-center">
                  <span className="text-[16px]">📦</span>
                  <p className="text-[12px] font-bold text-ink mt-1">4 Arquivados</p>
                  <p className="text-[10px] text-ink/50">Histórico inativo</p>
                </div>
              </div>
            </div>

          </div>

          {/* Coluna Lateral: Atalho & Arquivos */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white rounded-2xl p-5 border border-forest/10 shadow-xs flex flex-col gap-3">
              <span className="text-[12px] font-bold text-ink/60">Comando da skill</span>
              <div className="bg-forest/5 border border-forest/10 rounded-xl p-3 font-mono text-[13px] text-forest font-bold flex items-center justify-between">
                <span>/para-organizer</span>
                <Terminal className="w-4 h-4 text-forest/40" />
              </div>
              <p className="text-[11px] text-ink/50 leading-relaxed">
                Inicia o fluxo interativo de organização e auditoria do sistema de arquivos.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-forest/10 shadow-xs flex flex-col gap-3">
              <span className="text-[12px] font-bold text-ink/60">Arquivos da skill</span>
              <div className="space-y-2">
                {Object.values(localizedFiles).map((f) => (
                  <button
                    key={f.path}
                    onClick={() => {
                      setSelectedFile(f.path);
                      setActiveTab('content');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-forest/5 hover:border-forest/20 hover:bg-forest/5 transition text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileCode2 className="w-4 h-4 text-forest" />
                      <span className="text-[12px] font-mono font-medium text-ink">{f.name}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-forest/40" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ABA 2: CONTEÚDO (Com Seletor de Arquivo, Toggle de Olho / Código e Copiar) */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-2xl border border-forest/10 shadow-xs overflow-hidden flex flex-col">
          
          {/* Barra de Ferramentas Superior */}
          <div className="p-3.5 border-b border-forest/10 flex items-center justify-between bg-forest/5 gap-3 flex-wrap">
            
            {/* Seletor Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-ink text-[13px] font-bold border border-forest/15 shadow-2xs hover:bg-forest/5 transition cursor-pointer"
              >
                <FileCode2 className="w-4 h-4 text-forest" />
                <span className="font-mono text-[12px]">{selectedFile}</span>
                <ChevronDown className="w-3.5 h-3.5 text-ink/40 ml-1" />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-forest/15 rounded-xl shadow-lg p-2 z-50 flex flex-col gap-1">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Arquivos da skill
                  </div>
                  
                  {Object.values(localizedFiles).map((f) => (
                    <button
                      key={f.path}
                      onClick={() => { setSelectedFile(f.path); setIsDropdownOpen(false); }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-mono text-left transition ${
                        selectedFile === f.path 
                          ? 'bg-forest text-white font-bold' 
                          : 'text-ink/80 hover:bg-forest/5'
                      }`}
                    >
                      <span>{f.name}</span>
                      <span className={`text-[10px] ${selectedFile === f.path ? 'text-white/70' : 'text-ink/40'}`}>
                        {f.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ações da Direita: Toggle Eye / Code & Botão Copiar */}
            <div className="flex items-center gap-2">
              
              {/* Segmented Toggle: Olhinho vs Código (Idêntico à imagem de referência) */}
              <div className="flex items-center bg-[#2a2c2d] p-1 rounded-xl shadow-inner border border-black/10">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    viewMode === 'preview' 
                      ? 'bg-[#3e4245] text-white shadow-xs' 
                      : 'text-white/40 hover:text-white/70'
                  }`}
                  title="Visualização renderizada"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    viewMode === 'code' 
                      ? 'bg-[#3e4245] text-white shadow-xs' 
                      : 'text-white/40 hover:text-white/70'
                  }`}
                  title="Código Markdown"
                >
                  <span className="font-mono text-[13px] font-bold leading-none">&lt;/&gt;</span>
                </button>
              </div>

              {/* Botão Copiar */}
              <button
                onClick={copySkillCode}
                className="px-3 py-1.5 rounded-xl bg-white border border-forest/15 hover:bg-forest/5 text-ink text-[12px] font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-ink/50" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>

            </div>

          </div>

          {/* Área de Conteúdo */}
          <div className="p-6 lg:p-8 max-h-[650px] overflow-y-auto font-sans leading-relaxed text-[13px]">
            {viewMode === 'code' ? (
              <pre className="font-mono text-[12.5px] text-ink/90 bg-forest/5 p-5 rounded-xl border border-forest/10 overflow-x-auto whitespace-pre leading-relaxed">
                {localizedFiles[selectedFile]?.content}
              </pre>
            ) : (
              <div className="space-y-4 text-ink leading-relaxed">
                {localizedFiles[selectedFile]?.content.split('\n\n').map((block, idx) => {
                  if (block.startsWith('---')) {
                    return <hr key={idx} className="border-forest/10 my-4" />;
                  }
                  if (block.startsWith('# ')) {
                    return (
                      <h1 key={idx} className="text-[18px] font-bold text-ink border-b border-forest/10 pb-2">
                        {block.replace('# ', '')}
                      </h1>
                    );
                  }
                  if (block.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-[15px] font-bold text-forest mt-4">
                        {block.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-[13.5px] font-bold text-ink mt-2">
                        {block.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (block.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="p-3.5 rounded-xl bg-forest/5 border-l-4 border-forest text-[13px] font-medium text-ink/80 my-2">
                        {block.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  if (block.startsWith('```')) {
                    const cleanCode = block.replace(/```[a-z]*\n?/gi, '').replace(/```$/gi, '');
                    return (
                      <pre key={idx} className="p-4 rounded-xl bg-forest/5 border border-forest/10 font-mono text-[12px] text-ink/90 overflow-x-auto whitespace-pre">
                        {cleanCode}
                      </pre>
                    );
                  }
                  return (
                    <p key={idx} className="text-[13px] text-ink/80 leading-relaxed font-normal whitespace-pre-wrap">
                      {block}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ABA 3: FLUXO OPERACIONAL DE UPLOAD E REVISÃO */}
      {activeTab === 'upload' && <DadosIngestao />}

    </div>
  );
}
