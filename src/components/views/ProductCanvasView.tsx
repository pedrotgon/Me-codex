import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Monitor, 
  Smartphone, 
  Grid, 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  FolderKanban, 
  FileText, 
  Database, 
  Network, 
  KeyRound, 
  ArrowRight, 
  AlertCircle, 
  Play, 
  Check, 
  X, 
  Clock, 
  Search, 
  Copy, 
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Flame,
  Info,
  CalendarDays,
  Repeat2,
  Archive,
  Inbox,
  Filter
} from 'lucide-react';
import { useStore } from '../../store';

type SectionId = '00' | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10';

interface PrototypeState {
  step: number;
  data: any;
  status: 'idle' | 'running' | 'success' | 'rejected' | 'error';
  log: string[];
}

export default function ProductCanvasView() {
  const { 
    tasks, 
    projects, 
    areas, 
    resources, 
    nodes, 
    relations, 
    setCurrentView, 
    addTask,
    toggleTask,
    createRelation,
    approveRelation
  } = useStore();

  const [activeSection, setActiveSection] = useState<SectionId>('00');
  const [viewportMode, setViewportMode] = useState<'all' | 'desktop' | 'mobile'>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Estados dos Protótipos Interativos da Seção 09
  const [proto1, setProto1] = useState<PrototypeState>({ step: 1, data: { title: 'Implementar auditoria de contrastes no Më', category: 'project' }, status: 'idle', log: [] });
  const [proto2, setProto2] = useState<PrototypeState>({ step: 1, data: { filename: 'estrategia_q4.pdf', size: '2.4 MB', sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }, status: 'idle', log: [] });
  const [proto5, setProto5] = useState<PrototypeState>({ step: 1, data: { proposal: 'Criar tarefa "Revisar balanço trimestral" vinculada a Finanças' }, status: 'idle', log: [] });
  const [proto9, setProto9] = useState<PrototypeState>({ step: 1, data: { failedBatch: 2, totalBatches: 4, retried: false }, status: 'idle', log: [] });

  const sections = [
    { id: '00', title: '00 — Cover & Índice' },
    { id: '01', title: '01 — Princípios & Identidade' },
    { id: '02', title: '02 — Foundations' },
    { id: '03', title: '03 — Componentes' },
    { id: '04', title: '04 — Padrões' },
    { id: '05', title: '05 — Mapa de Jornadas' },
    { id: '06', title: '06 — Telas Desktop' },
    { id: '07', title: '07 — Telas Mobile' },
    { id: '08', title: '08 — Estados & Casos' },
    { id: '09', title: '09 — Protótipos Navegáveis' },
    { id: '10', title: '10 — Handoff & Penpot' },
  ];

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-120px)] bg-[#fbfbfb] text-[#070707] font-sans antialiased pb-24">
      
      {/* Canvas Topbar: Navegação de Seções, Filtros de Viewport e Zoom */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e5e5e5] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-[#0c2b15] text-white flex items-center justify-center font-serif text-base font-bold shadow-xs">
            Më
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-[#070707] leading-tight flex items-center gap-2">
              Screen Atlas & Canvas Visual
              <span className="text-[10px] font-mono uppercase bg-[#0c2b15]/10 text-[#0c2b15] px-2 py-0.5 rounded-[4px] font-semibold">
                BCG + GS v2.0
              </span>
            </h1>
            <p className="text-[11px] font-sans text-[#696969]">Todas as telas, jornadas, estados e protótipos em um único canvas infinito</p>
          </div>
        </div>

        {/* Seletor Rápido de Seções */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-2xl py-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id as SectionId)}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-[6px] transition-all whitespace-nowrap ${
                activeSection === s.id
                  ? 'bg-[#0c2b15] text-white shadow-xs font-semibold'
                  : 'text-[#696969] hover:text-[#070707] hover:bg-[#f4f4f4]'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Controles de Visualização: Viewport e Zoom */}
        <div className="flex items-center gap-3">
          {/* Viewport Filter */}
          <div className="flex items-center bg-[#f4f4f4] p-0.5 rounded-[8px] border border-[#e5e5e5]">
            <button
              onClick={() => setViewportMode('all')}
              className={`px-2.5 py-1 text-[11px] rounded-[6px] font-medium transition ${viewportMode === 'all' ? 'bg-white text-[#070707] shadow-xs' : 'text-[#696969]'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setViewportMode('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-[6px] font-medium transition ${viewportMode === 'desktop' ? 'bg-white text-[#070707] shadow-xs' : 'text-[#696969]'}`}
            >
              <Monitor className="w-3 h-3" /> Desktop
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-[6px] font-medium transition ${viewportMode === 'mobile' ? 'bg-white text-[#070707] shadow-xs' : 'text-[#696969]'}`}
            >
              <Smartphone className="w-3 h-3" /> Mobile
            </button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1 bg-[#f4f4f4] p-0.5 rounded-[8px] border border-[#e5e5e5]">
            <button 
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
              className="p-1 text-[#696969] hover:text-[#070707] hover:bg-white rounded-[6px]"
              title="Diminuir Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-[#070707]">{zoomLevel}%</span>
            <button 
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
              className="p-1 text-[#696969] hover:text-[#070707] hover:bg-white rounded-[6px]"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoomLevel(100)}
              className="p-1 text-[#696969] hover:text-[#070707] hover:bg-white rounded-[6px]"
              title="Resetar Zoom (100%)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Área Principal do Canvas com Zoom Dinâmico */}
      <main 
        className="w-full flex-1 p-6 md:p-10 transition-transform origin-top duration-150"
        style={{ zoom: `${zoomLevel}%` }}
      >

        {/* ========================================================================= */}
        {/* SEÇÃO 00: COVER & ÍNDICE */}
        {/* ========================================================================= */}
        {(activeSection === '00' || activeSection === '05') && (
          <section className="mb-20 bg-white border border-[#e5e5e5] rounded-[14px] p-8 md:p-12 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#0c2b15]/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="px-2.5 py-1 rounded-[6px] bg-[#0c2b15] text-white text-[11px] font-mono font-medium tracking-wider uppercase">
                  Më Life OS
                </span>
                <span className="px-2.5 py-1 rounded-[6px] bg-[#7399c6]/15 text-[#1b365d] text-[11px] font-mono font-medium">
                  Design System & Screen Atlas
                </span>
                <span className="text-[12px] font-mono text-[#696969]">v2.0 • 2026-09-07</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-normal text-[#0c2b15] tracking-tight leading-tight mb-4">
                O Segundo Cérebro Local-First de Alta Fidelidade
              </h1>

              <p className="text-[15px] font-sans text-[#696969] leading-relaxed mb-8">
                Especificação visual, arquitetura de componentes, estados e protótipos navegáveis completos. 
                Construído sob a fusão estética da sobriedade florestal do <strong>Boston Consulting Group (BCG)</strong> e a autoridade analítica e tipográfica editorial do <strong>Goldman Sachs (GS)</strong>.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-[10px] bg-[#fbfbfb] border border-[#e5e5e5]">
                <div>
                  <div className="text-[11px] font-mono text-[#696969] uppercase">Jornadas Cobertas</div>
                  <div className="text-2xl font-serif text-[#0c2b15] mt-0.5">17 Fluxos</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#696969] uppercase">Telas & Subtelas</div>
                  <div className="text-2xl font-serif text-[#0c2b15] mt-0.5">28 Telas</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#696969] uppercase">Estados Mapeados</div>
                  <div className="text-2xl font-serif text-[#0c2b15] mt-0.5">112 Estados</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#696969] uppercase">Governança IA</div>
                  <div className="text-2xl font-serif text-[#41a217] mt-0.5">100% Humana</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SEÇÃO 01: PRINCÍPIOS & IDENTIDADE */}
        {/* ========================================================================= */}
        {(activeSection === '01' || activeSection === '00') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e5e5e5]">
              <div>
                <h2 className="text-2xl font-serif text-[#0c2b15]">01 — Princípios e Identidade Visual</h2>
                <p className="text-xs font-sans text-[#696969]">Fusão cromática BCG + Goldman Sachs e padrões de alta densidade</p>
              </div>
              <span className="text-xs font-mono text-[#696969]">Tokens Canônicos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* BCG Palette */}
              <div className="bg-white p-6 rounded-[10px] border border-[#e5e5e5] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#070707]">BCG Deep Forest & Accent</h3>
                  <span className="text-[10px] font-mono text-[#696969]">Paleta Primária</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#0c2b15] text-white">
                    <span className="text-xs font-medium">Forest 900 (Canônico)</span>
                    <span className="font-mono text-xs">#0c2b15</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#41a217] text-white">
                    <span className="text-xs font-medium">Vivid Green 500 (Acento)</span>
                    <span className="font-mono text-xs">#41a217</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#f2f7f3] text-[#0c2b15] border border-[#0c2b15]/10">
                    <span className="text-xs font-medium">Forest 50 (Fundo Destaque)</span>
                    <span className="font-mono text-xs">#f2f7f3</span>
                  </div>
                </div>
              </div>

              {/* Goldman Sachs Palette */}
              <div className="bg-white p-6 rounded-[10px] border border-[#e5e5e5] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#070707]">Goldman Sachs Analytics</h3>
                  <span className="text-[10px] font-mono text-[#696969]">Precisão Analítica</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#1b365d] text-white">
                    <span className="text-xs font-medium">Deep Navy 900 (Executivo)</span>
                    <span className="font-mono text-xs">#1b365d</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#7399c6] text-white">
                    <span className="text-xs font-medium">Financial Blue 400 (IA / Foco)</span>
                    <span className="font-mono text-xs">#7399c6</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#dce8f4] text-[#1b365d] border border-[#7399c6]/20">
                    <span className="text-xs font-medium">Goldman 100 (Badge IA)</span>
                    <span className="font-mono text-xs">#dce8f4</span>
                  </div>
                </div>
              </div>

              {/* Neutrals & Editorial Canvas */}
              <div className="bg-white p-6 rounded-[10px] border border-[#e5e5e5] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#070707]">Editorial Neutrals & Canvas</h3>
                  <span className="text-[10px] font-mono text-[#696969]">Contraste AAA</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#fbfbfb] text-[#070707] border border-[#e5e5e5]">
                    <span className="text-xs font-medium">Canvas Off-White (Fundo)</span>
                    <span className="font-mono text-xs">#fbfbfb</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#ffffff] text-[#070707] border border-[#e5e5e5]">
                    <span className="text-xs font-medium">Surface White (Card)</span>
                    <span className="font-mono text-xs">#ffffff</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#070707] text-white">
                    <span className="text-xs font-medium">Editorial Ink (Texto 19.8:1)</span>
                    <span className="font-mono text-xs">#070707</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Do's and Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f2f7f3] border border-[#41a217]/30 p-5 rounded-[10px]">
                <div className="flex items-center gap-2 text-[#0c2b15] font-semibold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#41a217]" /> O que é o Më Life OS (Diretrizes Ativas)
                </div>
                <ul className="text-xs text-[#0c2b15]/80 space-y-1.5 list-disc list-inside">
                  <li>Cartões brancos opacos com bordas calmas de 1px (`#e5e5e5`)</li>
                  <li>Raio padronizado de 10px (`0.625rem`) herdado do BCG</li>
                  <li>Tipografia editorial mista: Newsreader (títulos) + Inter (dados)</li>
                  <li>Governança explícita: Toda sugestão da IA requer aprovação humana</li>
                  <li>Densidade informacional elevada com legibilidade imediata</li>
                </ul>
              </div>

              <div className="bg-[#fef2f2] border border-[#dc2626]/30 p-5 rounded-[10px]">
                <div className="flex items-center gap-2 text-[#991b1b] font-semibold text-sm mb-2">
                  <X className="w-4 h-4 text-[#dc2626]" /> O que é Proibido no Më (Anti-patterns)
                </div>
                <ul className="text-xs text-[#991b1b]/80 space-y-1.5 list-disc list-inside">
                  <li>Glassmorphism (`backdrop-filter: blur`, cartões transparentes)</li>
                  <li>Neon, sombras coloridas difusas ou gradientes aleatórios</li>
                  <li>Estética genérica de "IA Dashboard" com cantos pílula gigantes</li>
                  <li>Mutações silenciosas no banco de dados sem autorização do usuário</li>
                  <li>Armazenamento de arquivos originais (apenas Markdown Twins com SHA-256)</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SEÇÃO 02: FOUNDATIONS */}
        {/* ========================================================================= */}
        {(activeSection === '02' || activeSection === '00') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e5e5e5]">
              <div>
                <h2 className="text-2xl font-serif text-[#0c2b15]">02 — Foundations</h2>
                <p className="text-xs font-sans text-[#696969]">Escala espacial, raios, sombras calmas e conformidade WCAG AA</p>
              </div>
              <span className="text-xs font-mono text-[#696969]">W3C DTCG Format</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Spacing */}
              <div className="bg-white p-5 rounded-[10px] border border-[#e5e5e5]">
                <h4 className="text-xs font-mono uppercase text-[#696969] mb-3">Escala Espacial</h4>
                <div className="space-y-2">
                  {[
                    { name: 'spacing-2', px: '4px', w: 'w-1' },
                    { name: 'spacing-4', px: '8px', w: 'w-2' },
                    { name: 'spacing-6', px: '12px', w: 'w-3' },
                    { name: 'spacing-8', px: '16px', w: 'w-4' },
                    { name: 'spacing-10', px: '20px', w: 'w-5' },
                    { name: 'spacing-12', px: '24px', w: 'w-6' },
                  ].map(s => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#696969]">{s.name}</span>
                      <span className="font-mono text-[#070707] font-semibold">{s.px}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radius */}
              <div className="bg-white p-5 rounded-[10px] border border-[#e5e5e5]">
                <h4 className="text-xs font-mono uppercase text-[#696969] mb-3">Raios de Borda</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>Tag / Badge (`6px`)</span>
                    <div className="w-6 h-6 bg-[#0c2b15]/10 rounded-[6px] border border-[#0c2b15]/20" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Controle (`8px`)</span>
                    <div className="w-6 h-6 bg-[#0c2b15]/10 rounded-[8px] border border-[#0c2b15]/20" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0c2b15]">Card BCG (`10px`)</span>
                    <div className="w-6 h-6 bg-[#0c2b15] rounded-[10px]" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Modal / Drawer (`14px`)</span>
                    <div className="w-6 h-6 bg-[#0c2b15]/10 rounded-[14px] border border-[#0c2b15]/20" />
                  </div>
                </div>
              </div>

              {/* Typography Scale */}
              <div className="bg-white p-5 rounded-[10px] border border-[#e5e5e5]">
                <h4 className="text-xs font-mono uppercase text-[#696969] mb-3">Tipografia</h4>
                <div className="space-y-2">
                  <div className="text-lg font-serif text-[#0c2b15] leading-none">Newsreader 24px</div>
                  <div className="text-sm font-sans font-semibold text-[#070707]">Inter Semibold 14px</div>
                  <div className="text-xs font-sans text-[#696969]">Inter Regular 12px</div>
                  <div className="text-[11px] font-mono text-[#1b365d]">JetBrains Mono 11px</div>
                </div>
              </div>

              {/* Elevation */}
              <div className="bg-white p-5 rounded-[10px] border border-[#e5e5e5]">
                <h4 className="text-xs font-mono uppercase text-[#696969] mb-3">Elevação Calma</h4>
                <div className="space-y-2">
                  <div className="p-2 text-xs bg-white border border-[#e5e5e5] rounded-[6px] shadow-xs">
                    shadow-xs (1px subtle)
                  </div>
                  <div className="p-2 text-xs bg-white border border-[#e5e5e5] rounded-[10px] shadow-sm">
                    shadow-sm (Card padrão)
                  </div>
                  <div className="p-2 text-xs bg-white border border-[#e5e5e5] rounded-[14px] shadow-md">
                    shadow-md (Modal / Popover)
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SEÇÃO 03: CATÁLOGO DE COMPONENTES */}
        {/* ========================================================================= */}
        {(activeSection === '03' || activeSection === '00') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e5e5e5]">
              <div>
                <h2 className="text-2xl font-serif text-[#0c2b15]">03 — Catálogo de Componentes</h2>
                <p className="text-xs font-sans text-[#696969]">Biblioteca de primitivos, compostos e estruturas operacionais</p>
              </div>
              <span className="text-xs font-mono text-[#696969]">React / Tailwind v4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Botões & Controles */}
              <div className="bg-white p-6 rounded-[10px] border border-[#e5e5e5]">
                <h3 className="text-xs font-mono uppercase text-[#696969] mb-4">Botões & Ações</h3>
                <div className="flex flex-col gap-2.5">
                  <button className="w-full bg-[#0c2b15] text-white text-xs font-sans font-medium py-2 rounded-[10px] hover:bg-[#164416] transition shadow-xs">
                    Botão Primário (Forest 900)
                  </button>
                  <button className="w-full bg-[#41a217] text-white text-xs font-sans font-medium py-2 rounded-[10px] hover:bg-[#297716] transition shadow-xs">
                    Acento / Aprovar (BCG 500)
                  </button>
                  <button className="w-full bg-white text-[#070707] border border-[#e5e5e5] text-xs font-sans font-medium py-2 rounded-[10px] hover:bg-[#f4f4f4] transition">
                    Botão Secundário (Borda Calma)
                  </button>
                  <button className="w-full bg-white text-[#dc2626] border border-[#dc2626]/20 text-xs font-sans font-medium py-2 rounded-[10px] hover:bg-[#dc2626]/5 transition">
                    Destrutivo / Rejeitar
                  </button>
                </div>
              </div>

              {/* Badges & Tags */}
              <div className="bg-white p-6 rounded-[10px] border border-[#e5e5e5]">
                <h3 className="text-xs font-mono uppercase text-[#696969] mb-4">Badges & Rótulos de Estado</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-[6px] text-xs font-mono bg-[#0c2b15]/10 text-[#0c2b15] border border-[#0c2b15]/15">
                    Forest Tag
                  </span>
                  <span className="px-2.5 py-1 rounded-[6px] text-xs font-mono bg-[#7399c6]/15 text-[#1b365d] border border-[#7399c6]/25">
                    Sugestão IA
                  </span>
                  <span className="px-2.5 py-1 rounded-[6px] text-xs font-mono bg-[#41a217]/15 text-[#205d15] border border-[#41a217]/25">
                    Concluído
                  </span>
                  <span className="px-2.5 py-1 rounded-[6px] text-xs font-mono bg-amber-50 text-amber-700 border border-amber-200">
                    Pendente
                  </span>
                  <span className="px-2.5 py-1 rounded-[6px] text-xs font-mono bg-rose-50 text-rose-700 border border-rose-200">
                    P1 Urgente
                  </span>
                </div>
              </div>

              {/* Approval Card (Governança IA) */}
              <div className="bg-white p-6 rounded-[10px] border border-[#e5e5e5]">
                <h3 className="text-xs font-mono uppercase text-[#696969] mb-4">Cartão de Aprovação (ApprovalCard)</h3>
                <div className="p-4 rounded-[8px] bg-[#fbfbfb] border border-[#e5e5e5]">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1b365d] mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#7399c6]" /> Proposta de Mutação
                  </div>
                  <p className="text-xs text-[#070707] mb-3">Vincular 3 arquivos à Área "Acadêmico / Unicamp"</p>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-[#41a217] text-white text-[11px] font-medium py-1.5 rounded-[6px] hover:bg-[#297716] flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" /> Aprovar
                    </button>
                    <button className="flex-1 bg-white text-[#dc2626] border border-[#dc2626]/20 text-[11px] font-medium py-1.5 rounded-[6px] hover:bg-rose-50 flex items-center justify-center gap-1">
                      <X className="w-3 h-3" /> Rejeitar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SEÇÃO 05: MAPA VISUAL DE JORNADAS COM SETAS */}
        {/* ========================================================================= */}
        {(activeSection === '05' || activeSection === '00') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e5e5e5]">
              <div>
                <h2 className="text-2xl font-serif text-[#0c2b15]">05 — Mapa Geral de Jornadas do Produto</h2>
                <p className="text-xs font-sans text-[#696969]">Fluxo ponta a ponta da esquerda para a direita conectando o segundo cérebro</p>
              </div>
              <span className="text-xs font-mono text-[#696969]">Pipeline Visual</span>
            </div>

            <div className="p-6 md:p-8 bg-white border border-[#e5e5e5] rounded-[14px] shadow-xs overflow-x-auto">
              <div className="flex items-center gap-4 min-w-[1100px] justify-between">
                
                {/* Etapa 1: Ingestão / Captura */}
                <div className="flex-1 bg-[#fbfbfb] p-4 rounded-[10px] border border-[#e5e5e5]">
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase text-[#0c2b15] font-semibold">
                    <Inbox className="w-4 h-4 text-[#0c2b15]" /> 1. Entrada
                  </div>
                  <h4 className="text-sm font-semibold text-[#070707] mb-1">Quick Capture & ZIP</h4>
                  <p className="text-xs text-[#696969]">Upload de arquivos ou notas rápidas sem categorização prévia.</p>
                </div>

                <ChevronRight className="w-5 h-5 text-[#696969] shrink-0" />

                {/* Etapa 2: Para-Organizer */}
                <div className="flex-1 bg-[#fbfbfb] p-4 rounded-[10px] border border-[#e5e5e5]">
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase text-[#0c2b15] font-semibold">
                    <Sparkles className="w-4 h-4 text-[#41a217]" /> 2. Processamento
                  </div>
                  <h4 className="text-sm font-semibold text-[#070707] mb-1">Para-Organizer</h4>
                  <p className="text-xs text-[#696969]">Limpeza, OCR/PDF.js, SHA-256 e Structured Output com Gemini.</p>
                </div>

                <ChevronRight className="w-5 h-5 text-[#696969] shrink-0" />

                {/* Etapa 3: Governança Humana */}
                <div className="flex-1 bg-[#f2f7f3] p-4 rounded-[10px] border border-[#41a217]/30">
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase text-[#205d15] font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#41a217]" /> 3. Governança
                  </div>
                  <h4 className="text-sm font-semibold text-[#070707] mb-1">Revisão & Aprovação</h4>
                  <p className="text-xs text-[#696969]">Decisão humana por item: [Aprovar] ou [Rejeitar].</p>
                </div>

                <ChevronRight className="w-5 h-5 text-[#696969] shrink-0" />

                {/* Etapa 4: Knowledge Intake (SSOT) */}
                <div className="flex-1 bg-[#fbfbfb] p-4 rounded-[10px] border border-[#e5e5e5]">
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase text-[#0c2b15] font-semibold">
                    <Database className="w-4 h-4 text-[#0c2b15]" /> 4. SSOT
                  </div>
                  <h4 className="text-sm font-semibold text-[#070707] mb-1">Knowledge Intake</h4>
                  <p className="text-xs text-[#696969]">Persistência IndexedDB (6 stores) + Geração de Markdown Twins.</p>
                </div>

                <ChevronRight className="w-5 h-5 text-[#696969] shrink-0" />

                {/* Etapa 5: Memória & Execução */}
                <div className="flex-1 bg-[#fbfbfb] p-4 rounded-[10px] border border-[#e5e5e5]">
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase text-[#1b365d] font-semibold">
                    <Network className="w-4 h-4 text-[#7399c6]" /> 5. Memória & PARA
                  </div>
                  <h4 className="text-sm font-semibold text-[#070707] mb-1">Grafo D3 & Jarvis</h4>
                  <p className="text-xs text-[#696969]">Visualização radial, nós conectados, execução diária e chat IA.</p>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SEÇÕES 06 & 07: TELAS DESKTOP (1440x1024) E MOBILE (390x844) */}
        {/* ========================================================================= */}
        {(activeSection === '06' || activeSection === '07' || activeSection === '00') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e5e5e5]">
              <div>
                <h2 className="text-2xl font-serif text-[#0c2b15]">
                  {activeSection === '07' ? '07 — Telas Mobile (390 × 844)' : '06 — Telas Desktop (1440 × 1024)'}
                </h2>
                <p className="text-xs font-sans text-[#696969]">
                  Visualização de alta fidelidade de todas as telas em ambos os formatos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#696969]">
                  {viewportMode === 'all' ? 'Exibindo Desktop & Mobile' : viewportMode.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Grid de Telas */}
            <div className="space-y-12">

              {/* J01: Home / Visão Geral */}
              <div className="bg-white p-6 rounded-[14px] border border-[#e5e5e5] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#0c2b15] text-white text-[10px] font-mono">J01</span>
                    <h3 className="text-base font-serif font-medium text-[#0c2b15]">Visão Geral (Home / Dashboard)</h3>
                  </div>
                  <button onClick={() => setCurrentView('home')} className="text-xs text-[#0c2b15] font-semibold hover:underline flex items-center gap-1">
                    Abrir no Më <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Desktop Frame */}
                  {(viewportMode === 'all' || viewportMode === 'desktop') && (
                    <div className="lg:col-span-2 bg-[#fbfbfb] rounded-[10px] border border-[#e5e5e5] p-5 shadow-2xs">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e5e5] text-[11px] font-mono text-[#696969]">
                        <span>Desktop / J01-Inicio / Home / Padrao (1440 × 1024)</span>
                        <span>3 Colunas • Métricas • Radar • Hábitos</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-[8px] border border-[#e5e5e5]">
                          <div className="text-[10px] font-mono text-[#696969]">Tokens de Batalha</div>
                          <div className="text-lg font-serif text-[#0c2b15] font-normal">85 Pts</div>
                        </div>
                        <div className="bg-white p-3 rounded-[8px] border border-[#e5e5e5]">
                          <div className="text-[10px] font-mono text-[#696969]">Radar Hoje</div>
                          <div className="text-lg font-serif text-[#0c2b15] font-normal">{tasks.filter(t => t.status === 'in-progress').length} ativas</div>
                        </div>
                        <div className="bg-white p-3 rounded-[8px] border border-[#e5e5e5]">
                          <div className="text-[10px] font-mono text-[#696969]">Projetos Ativos</div>
                          <div className="text-lg font-serif text-[#0c2b15] font-normal">{projects.filter(p => p.status === 'active').length} projetos</div>
                        </div>
                      </div>
                      <div className="bg-white p-3.5 rounded-[8px] border border-[#e5e5e5] text-xs">
                        <span className="font-semibold text-[#070707]">Tarefas Prioritárias:</span>
                        <div className="mt-2 space-y-1.5">
                          {tasks.slice(0, 3).map(t => (
                            <div key={t.id} className="flex items-center justify-between p-2 rounded-[6px] bg-[#fbfbfb] border border-[#e5e5e5]">
                              <span className="truncate pr-2">{t.title}</span>
                              <span className="text-[10px] font-mono text-[#41a217]">{t.priority}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Frame */}
                  {(viewportMode === 'all' || viewportMode === 'mobile') && (
                    <div className="bg-[#fbfbfb] rounded-[10px] border border-[#e5e5e5] p-5 shadow-2xs max-w-[390px] mx-auto w-full">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e5e5] text-[11px] font-mono text-[#696969]">
                        <span>Mobile (390 × 844)</span>
                        <span>Stack Vertical</span>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-[8px] border border-[#e5e5e5]">
                          <div className="text-[10px] font-mono text-[#696969]">Resumo do Dia</div>
                          <div className="text-base font-serif text-[#0c2b15]">3 tarefas prioritárias</div>
                        </div>
                        <div className="bg-white p-3 rounded-[8px] border border-[#e5e5e5] space-y-1.5">
                          <span className="text-[11px] font-semibold text-[#070707]">Agenda</span>
                          {tasks.slice(0, 2).map(t => (
                            <div key={t.id} className="p-2 rounded-[6px] bg-[#fbfbfb] text-xs truncate border border-[#e5e5e5]">
                              {t.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* J14: Para-Organizer Pipeline */}
              <div className="bg-white p-6 rounded-[14px] border border-[#e5e5e5] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#41a217] text-white text-[10px] font-mono">J14</span>
                    <h3 className="text-base font-serif font-medium text-[#0c2b15]">Para-Organizer (Upload, Gemini & Revisão)</h3>
                  </div>
                  <button onClick={() => setCurrentView('para-organizer')} className="text-xs text-[#0c2b15] font-semibold hover:underline flex items-center gap-1">
                    Abrir no Më <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Desktop Frame */}
                  {(viewportMode === 'all' || viewportMode === 'desktop') && (
                    <div className="lg:col-span-2 bg-[#fbfbfb] rounded-[10px] border border-[#e5e5e5] p-5 shadow-2xs">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e5e5] text-[11px] font-mono text-[#696969]">
                        <span>Desktop / J14-ParaOrg / Upload / Padrao (1440 × 1024)</span>
                        <span>Árvore de Pastas • SHA-256 • Structured Output</span>
                      </div>
                      <div className="border-2 border-dashed border-[#e5e5e5] bg-white rounded-[10px] p-6 text-center mb-4">
                        <Sparkles className="w-6 h-6 text-[#41a217] mx-auto mb-2" />
                        <div className="text-xs font-semibold text-[#070707]">Arraste arquivos ou ZIP (limite 100 MB)</div>
                        <div className="text-[11px] text-[#696969] mt-1">Cálculo local de SHA-256, OCR e extração textual pré-envio</div>
                      </div>
                      <div className="bg-white p-3.5 rounded-[8px] border border-[#e5e5e5]">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-semibold text-[#070707]">Propostas Pendentes (Lote 1/2)</span>
                          <span className="text-[11px] font-mono text-[#7399c6]">Gemini 2.5 Flash</span>
                        </div>
                        <div className="p-3 bg-[#fbfbfb] rounded-[6px] border border-[#e5e5e5] flex items-center justify-between text-xs">
                          <div>
                            <div className="font-medium text-[#070707]">reuniao_estrategica_q3.pdf</div>
                            <div className="text-[10px] font-mono text-[#696969]">Sugestão: Projeto "Expansão Operacional"</div>
                          </div>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-[#41a217] text-white rounded-[4px] text-[11px] font-medium">Aprovar</span>
                            <span className="px-2 py-1 bg-white text-[#dc2626] border border-[#dc2626]/20 rounded-[4px] text-[11px] font-medium">Rejeitar</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Frame */}
                  {(viewportMode === 'all' || viewportMode === 'mobile') && (
                    <div className="bg-[#fbfbfb] rounded-[10px] border border-[#e5e5e5] p-5 shadow-2xs max-w-[390px] mx-auto w-full">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e5e5] text-[11px] font-mono text-[#696969]">
                        <span>Mobile (390 × 844)</span>
                        <span>Controle Tátil</span>
                      </div>
                      <div className="border border-dashed border-[#e5e5e5] bg-white p-4 rounded-[8px] text-center mb-3">
                        <div className="text-xs font-semibold">Toque para selecionar arquivos</div>
                      </div>
                      <div className="bg-white p-3 rounded-[8px] border border-[#e5e5e5] space-y-2">
                        <div className="text-[11px] font-semibold text-[#070707]">Proposta IA</div>
                        <div className="text-xs text-[#696969]">reuniao_estrategica.pdf → Projeto</div>
                        <div className="flex gap-2 pt-1">
                          <button className="flex-1 bg-[#41a217] text-white py-1 rounded-[4px] text-[11px]">Aprovar</button>
                          <button className="flex-1 bg-white border border-[#dc2626]/20 text-[#dc2626] py-1 rounded-[4px] text-[11px]">Rejeitar</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* J15: Memória (Grafo Relacional D3) */}
              <div className="bg-white p-6 rounded-[14px] border border-[#e5e5e5] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#1b365d] text-white text-[10px] font-mono">J15</span>
                    <h3 className="text-base font-serif font-medium text-[#0c2b15]">Memória (Mapa Relacional D3 Force-Directed)</h3>
                  </div>
                  <button onClick={() => setCurrentView('memoria')} className="text-xs text-[#0c2b15] font-semibold hover:underline flex items-center gap-1">
                    Abrir no Më <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Desktop Frame */}
                  {(viewportMode === 'all' || viewportMode === 'desktop') && (
                    <div className="lg:col-span-2 bg-[#fbfbfb] rounded-[10px] border border-[#e5e5e5] p-5 shadow-2xs">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e5e5] text-[11px] font-mono text-[#696969]">
                        <span>Desktop / J15-Memoria / Mapa / Padrao (1440 × 1024)</span>
                        <span>Composição Esférica • Zoom/Pan • Drawer de Nó</span>
                      </div>
                      <div className="h-64 bg-white rounded-[10px] border border-[#e5e5e5] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                          <Network className="w-48 h-48 text-[#0c2b15]" />
                        </div>
                        <div className="relative text-center p-4">
                          <div className="text-xs font-semibold text-[#0c2b15]">{nodes.length || 24} Nós Ativos • {relations.length || 18} Conexões</div>
                          <div className="text-[11px] text-[#696969] mt-1">Arrastável • Zoom • Force Layout normalizado com paleta BCG/GS</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Frame */}
                  {(viewportMode === 'all' || viewportMode === 'mobile') && (
                    <div className="bg-[#fbfbfb] rounded-[10px] border border-[#e5e5e5] p-5 shadow-2xs max-w-[390px] mx-auto w-full">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e5e5] text-[11px] font-mono text-[#696969]">
                        <span>Mobile (390 × 844)</span>
                        <span>Fallback Tabular Touch</span>
                      </div>
                      <div className="h-44 bg-white rounded-[8px] border border-[#e5e5e5] flex items-center justify-center p-4 text-center">
                        <div className="text-xs text-[#696969]">Visualização otimizada para toque com lista pesquisável de nós e conexões</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SEÇÃO 08: ESTADOS E CASOS EXTREMOS */}
        {/* ========================================================================= */}
        {(activeSection === '08' || activeSection === '00') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e5e5e5]">
              <div>
                <h2 className="text-2xl font-serif text-[#0c2b15]">08 — Estados e Casos Extremos</h2>
                <p className="text-xs font-sans text-[#696969]">Padrão, Vazio, Carregamento, Erro, Validação, Confirmação, Sem Credencial, Aprovação e Rejeição</p>
              </div>
              <span className="text-xs font-mono text-[#696969]">Multi-State Matrix</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Estado Vazio */}
              <div className="bg-white p-5 rounded-[10px] border border-[#e5e5e5] shadow-xs">
                <div className="text-[10px] font-mono uppercase text-[#696969] mb-2">1. Estado Vazio (Empty)</div>
                <div className="p-6 text-center rounded-[8px] bg-[#fbfbfb] border border-dashed border-[#e5e5e5]">
                  <FolderKanban className="w-6 h-6 text-[#696969] mx-auto mb-2" />
                  <div className="text-xs font-semibold text-[#070707]">Nenhum item cadastrado</div>
                  <p className="text-[11px] text-[#696969] mt-1">Comece criando seu primeiro projeto</p>
                  <button className="mt-3 bg-[#0c2b15] text-white text-[11px] px-3 py-1.5 rounded-[6px]">
                    + Novo Projeto
                  </button>
                </div>
              </div>

              {/* Estado Carregando */}
              <div className="bg-white p-5 rounded-[10px] border border-[#e5e5e5] shadow-xs">
                <div className="text-[10px] font-mono uppercase text-[#696969] mb-2">2. Carregando (Loading)</div>
                <div className="p-6 text-center rounded-[8px] bg-[#fbfbfb] border border-[#e5e5e5]">
                  <RotateCcw className="w-6 h-6 text-[#41a217] mx-auto mb-2 animate-spin" />
                  <div className="text-xs font-semibold text-[#070707]">Processando lote local...</div>
                  <p className="text-[11px] text-[#696969] mt-1">Extraindo texto e calculando SHA-256</p>
                  <div className="w-full bg-[#e5e5e5] h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-[#41a217] h-full w-2/3 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Estado de Erro com Retry */}
              <div className="bg-white p-5 rounded-[10px] border border-[#e5e5e5] shadow-xs">
                <div className="text-[10px] font-mono uppercase text-[#dc2626] mb-2">3. Erro com Retry (Error)</div>
                <div className="p-6 text-center rounded-[8px] bg-rose-50/50 border border-rose-200">
                  <AlertCircle className="w-6 h-6 text-[#dc2626] mx-auto mb-2" />
                  <div className="text-xs font-semibold text-[#991b1b]">Falha parcial na API Gemini</div>
                  <p className="text-[11px] text-[#696969] mt-1">Lote 2 falhou (429 Rate Limit). 3 itens válidos preservados.</p>
                  <button className="mt-3 bg-white text-[#dc2626] border border-rose-300 text-[11px] px-3 py-1.5 rounded-[6px] font-medium hover:bg-rose-50">
                    Tentar Lote Novamente
                  </button>
                </div>
              </div>

              {/* Estado Sem Credencial */}
              <div className="bg-white p-5 rounded-[10px] border border-[#e5e5e5] shadow-xs">
                <div className="text-[10px] font-mono uppercase text-[#1b365d] mb-2">4. Sem Credencial Gemini</div>
                <div className="p-6 text-center rounded-[8px] bg-[#f0f5fa] border border-[#7399c6]/30">
                  <KeyRound className="w-6 h-6 text-[#7399c6] mx-auto mb-2" />
                  <div className="text-xs font-semibold text-[#1b365d]">Chave API Não Configurada</div>
                  <p className="text-[11px] text-[#696969] mt-1">O modo local está ativo. Para IA remota, adicione sua chave.</p>
                  <button onClick={() => setCurrentView('dados')} className="mt-3 bg-[#1b365d] text-white text-[11px] px-3 py-1.5 rounded-[6px]">
                    Ir para Credenciais
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SEÇÃO 09: PROTÓTIPOS NAVEGÁVEIS DAS JORNADAS CRÍTICAS */}
        {/* ========================================================================= */}
        {(activeSection === '09' || activeSection === '00') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e5e5e5]">
              <div>
                <h2 className="text-2xl font-serif text-[#0c2b15]">09 — Protótipos Navegáveis das Jornadas Críticas</h2>
                <p className="text-xs font-sans text-[#696969]">Simulações ponta a ponta funcionais com dados reais do Knowledge Intake</p>
              </div>
              <span className="text-xs font-mono text-[#696969]">10 Fluxos E2E</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Protótipo 1: Captura -> Classificação -> Aprovação -> KI */}
              <div className="bg-white p-6 rounded-[14px] border border-[#e5e5e5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#0c2b15] font-semibold">Fluxo 01</span>
                    <span className="text-[10px] font-mono text-[#696969]">Captura → Aprovação → KI</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#070707] mb-2">Captura Rápida com Governança</h4>
                  <p className="text-xs text-[#696969] mb-4">
                    Simula o envio de uma nota mental, geração da proposta de tarefa e aprovação humana para persistência no KI.
                  </p>

                  <div className="p-4 rounded-[8px] bg-[#fbfbfb] border border-[#e5e5e5] mb-4 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#696969]">Item capturado:</span>
                      <span className="font-medium text-[#070707]">{proto1.data.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#696969]">Classificação sugerida:</span>
                      <span className="font-mono text-[#0c2b15]">Projeto "Design System"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#696969]">Status atual:</span>
                      <span className={`font-mono font-semibold ${proto1.status === 'success' ? 'text-[#41a217]' : proto1.status === 'rejected' ? 'text-[#dc2626]' : 'text-amber-600'}`}>
                        {proto1.status === 'success' ? 'Gravado no KI' : proto1.status === 'rejected' ? 'Rejeitado / Descartado' : 'Aguardando Decisão'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-[#e5e5e5]">
                  <button 
                    onClick={() => {
                      addTask(proto1.data.title, 'Inbox', 'Më Codex');
                      setProto1(prev => ({ ...prev, status: 'success', log: [...prev.log, 'Tarefa aprovada e inserida no store'] }));
                    }}
                    disabled={proto1.status === 'success'}
                    className="flex-1 bg-[#41a217] disabled:opacity-50 text-white text-xs font-medium py-2 rounded-[8px] hover:bg-[#297716] flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Aprovar e Salvar no KI
                  </button>
                  <button 
                    onClick={() => setProto1(prev => ({ ...prev, status: 'rejected', log: [...prev.log, 'Item rejeitado pelo usuário'] }))}
                    disabled={proto1.status === 'rejected'}
                    className="flex-1 bg-white disabled:opacity-50 text-[#dc2626] border border-[#dc2626]/20 text-xs font-medium py-2 rounded-[8px] hover:bg-rose-50 flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" /> Rejeitar
                  </button>
                </div>
              </div>

              {/* Protótipo 2: Upload/ZIP -> SHA-256 -> Gemini -> Markdown Twin */}
              <div className="bg-white p-6 rounded-[14px] border border-[#e5e5e5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#0c2b15] font-semibold">Fluxo 02</span>
                    <span className="text-[10px] font-mono text-[#696969]">Upload → SHA-256 → Twin</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#070707] mb-2">Ingestão Local com Hash Criptográfico</h4>
                  <p className="text-xs text-[#696969] mb-4">
                    Demonstra cálculo de SHA-256 via Web Crypto, preservação de caminho e corte estrito do Markdown Twin em 2.200 caracteres.
                  </p>

                  <div className="p-4 rounded-[8px] bg-[#fbfbfb] border border-[#e5e5e5] mb-4 text-xs space-y-1.5 font-mono">
                    <div className="text-[#696969]">Arquivo: <span className="text-[#070707]">{proto2.data.filename} ({proto2.data.size})</span></div>
                    <div className="text-[#696969] truncate">SHA-256: <span className="text-[#0c2b15]">{proto2.data.sha256}</span></div>
                    <div className="text-[#696969]">Tamanho do corpo: <span className="text-[#41a217]">1.840 caracteres (≤ 2.200)</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-[#e5e5e5]">
                  <button 
                    onClick={() => {
                      setProto2(prev => ({ ...prev, status: 'success' }));
                    }}
                    className="w-full bg-[#0c2b15] text-white text-xs font-medium py-2 rounded-[8px] hover:bg-[#164416] flex items-center justify-center gap-1.5"
                  >
                    {proto2.status === 'success' ? '✓ Markdown Twin Gerado e Validado' : 'Executar Validação de Integridade'}
                  </button>
                </div>
              </div>

              {/* Protótipo 5: Jarvis -> Proposta de Criação -> Aprovação */}
              <div className="bg-white p-6 rounded-[14px] border border-[#e5e5e5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#0c2b15] font-semibold">Fluxo 05</span>
                    <span className="text-[10px] font-mono text-[#696969]">Jarvis → Proposta Interativa</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#070707] mb-2">Comando do Jarvis sem Mutação Silenciosa</h4>
                  <p className="text-xs text-[#696969] mb-4">
                    O Jarvis recebe um comando no chat, mas não grava diretamente no banco: exibe um cartão de proposta com decisão explícita.
                  </p>

                  <div className="p-4 rounded-[8px] bg-[#fbfbfb] border border-[#e5e5e5] mb-4 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1b365d]">
                      <Sparkles className="w-3.5 h-3.5 text-[#7399c6]" /> Proposta gerada pelo Jarvis:
                    </div>
                    <div className="text-[#070707]">{proto5.data.proposal}</div>
                    <div className="text-[10px] font-mono text-[#696969]">Modelo: Gemini 2.5 Flash • Resposta consultiva direta</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-[#e5e5e5]">
                  <button 
                    onClick={() => {
                      addTask('Revisar balanço trimestral', 'Finanças');
                      setProto5(prev => ({ ...prev, status: 'success' }));
                    }}
                    disabled={proto5.status === 'success'}
                    className="flex-1 bg-[#41a217] disabled:opacity-50 text-white text-xs font-medium py-2 rounded-[8px] hover:bg-[#297716] flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Aprovar Proposta
                  </button>
                  <button 
                    onClick={() => setProto5(prev => ({ ...prev, status: 'rejected' }))}
                    disabled={proto5.status === 'rejected'}
                    className="flex-1 bg-white disabled:opacity-50 text-[#dc2626] border border-[#dc2626]/20 text-xs font-medium py-2 rounded-[8px] hover:bg-rose-50 flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" /> Rejeitar
                  </button>
                </div>
              </div>

              {/* Protótipo 9: Resiliência Gemini e Retry Parcial */}
              <div className="bg-white p-6 rounded-[14px] border border-[#e5e5e5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#0c2b15] font-semibold">Fluxo 09</span>
                    <span className="text-[10px] font-mono text-[#696969]">Erro Parcial → Retry Seguro</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#070707] mb-2">Recuperação de Lote sem Perda de Seleção</h4>
                  <p className="text-xs text-[#696969] mb-4">
                    Quando uma requisição atinge limite de taxa (429), apenas o lote afetado é reexecutado. Os lotes já processados são preservados.
                  </p>

                  <div className="p-4 rounded-[8px] bg-[#fbfbfb] border border-[#e5e5e5] mb-4 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span>Lote 1 (Arquivos 1 a 6):</span>
                      <span className="text-[#41a217]">✓ Concluído</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lote 2 (Arquivos 7 a 12):</span>
                      <span className={proto9.data.retried ? 'text-[#41a217]' : 'text-[#dc2626]'}>
                        {proto9.data.retried ? '✓ Recuperado com Sucesso' : '⚠ 429 Rate Limit (Retry disponível)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-[#e5e5e5]">
                  <button 
                    onClick={() => {
                      setProto9(prev => ({ ...prev, data: { ...prev.data, retried: true }, status: 'success' }));
                    }}
                    className="w-full bg-[#0c2b15] text-white text-xs font-medium py-2 rounded-[8px] hover:bg-[#164416] flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reexecutar Apenas Lote 2
                  </button>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SEÇÃO 10: HANDOFF E PENPOT */}
        {/* ========================================================================= */}
        {(activeSection === '10' || activeSection === '00') && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e5e5e5]">
              <div>
                <h2 className="text-2xl font-serif text-[#0c2b15]">10 — Handoff e Integração Penpot</h2>
                <p className="text-xs font-sans text-[#696969]">Instruções de transferência, tokens W3C DTCG e quality gates</p>
              </div>
              <span className="text-xs font-mono text-[#696969]">Ready for Production</span>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[14px] border border-[#e5e5e5] shadow-xs">
              <h3 className="text-base font-serif font-normal text-[#0c2b15] mb-2">Checklist de Conformidade do Handoff</h3>
              <p className="text-xs text-[#696969] mb-6">
                Todas as especificações visuais, tokens e telas foram documentados determinísticamente para importação direta no Penpot ou consumo no React.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-[8px] bg-[#fbfbfb] border border-[#e5e5e5]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0c2b15] mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#41a217]" /> Tokens W3C DTCG
                  </div>
                  <p className="text-[11px] text-[#696969]">`design-system/tokens.json` compatível com Penpot e Figma Tokens Studio.</p>
                </div>

                <div className="p-4 rounded-[8px] bg-[#fbfbfb] border border-[#e5e5e5]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0c2b15] mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#41a217]" /> Nomenclatura Canônica
                  </div>
                  <p className="text-[11px] text-[#696969]">Frames estruturados como `Desktop / Jornada / Tela / Estado` e `Mobile / ...`.</p>
                </div>

                <div className="p-4 rounded-[8px] bg-[#fbfbfb] border border-[#e5e5e5]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0c2b15] mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#41a217]" /> Zero Quebra de Regras
                  </div>
                  <p className="text-[11px] text-[#696969]">Knowledge Intake como SSOT preservado, sem credenciais expostas no Git.</p>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
