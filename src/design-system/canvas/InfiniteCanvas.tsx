import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Search, 
  Filter, 
  Monitor, 
  Smartphone, 
  ExternalLink, 
  X, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  FolderKanban, 
  CalendarDays, 
  BookOpen, 
  Database, 
  Network, 
  Inbox, 
  Repeat2, 
  KeyRound, 
  Archive, 
  Library, 
  Zap, 
  Check, 
  Info,
  Target,
  Clock,
  Flame,
  FileCode2,
  Table as TableIcon
} from 'lucide-react';
import { 
  SCREEN_REGISTRY, 
  ScreenMetadata, 
  getScreenCount, 
  getDesktopFrameCount, 
  getMobileFrameCount, 
  getTotalFrameCount 
} from '../registry/screenRegistry';
import { AtlasScreenRenderer } from '../registry/AtlasScreenRenderer';
import { DEMO_TASKS, DEMO_PROJECTS, DEMO_AREAS, DEMO_RESOURCES, DEMO_HABITS, DEMO_NODES, DEMO_RELATIONS } from '../registry/fixtures';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ScreenFrame } from '../components/ScreenFrame';
import { View } from '../../store';

interface InfiniteCanvasProps {
  onNavigateToView: (view: View) => void;
}

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ onNavigateToView }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Coordenadas e Zoom do Canvas Espacial
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 60, y: 60 });
  const [zoom, setZoom] = useState<number>(0.65);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filtros e Busca
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>('S01-home');
  const [viewportFilter, setViewportFilter] = useState<'all' | 'desktop' | 'mobile'>('all');
  const [journeyFilter, setJourneyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lista de Jornadas Únicas
  const journeys = useMemo(() => {
    return Array.from(new Set(SCREEN_REGISTRY.map(s => s.journey)));
  }, []);

  // Telas Filtradas
  const filteredScreens = useMemo(() => {
    return SCREEN_REGISTRY.filter(screen => {
      const matchJourney = journeyFilter === 'all' || screen.journey === journeyFilter;
      const matchSearch = 
        screen.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screen.journey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screen.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screen.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchJourney && matchSearch;
    });
  }, [journeyFilter, searchQuery]);

  // Tela Selecionada Ativa
  const selectedScreen = useMemo(() => {
    return SCREEN_REGISTRY.find(s => s.id === selectedScreenId) || null;
  }, [selectedScreenId]);

  // Controles de Pan pelo Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    // Apenas pan se clicar no fundo do canvas
    if ((e.target as HTMLElement).closest('.screen-frame-container') || (e.target as HTMLElement).closest('.canvas-ui-control')) {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom via Roda do Mouse
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || true) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom(prevZoom => Math.min(2.0, Math.max(0.15, prevZoom * zoomFactor)));
    }
  };

  // Controles de Zoom Rápidos
  const zoomIn = () => setZoom(prev => Math.min(2.0, prev + 0.15));
  const zoomOut = () => setZoom(prev => Math.max(0.15, prev - 0.15));
  const resetView = () => {
    setPan({ x: 60, y: 60 });
    setZoom(0.65);
  };

  // Fit All Real: calcula limites reais do canvas e do conteúdo
  const fitAll = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 1440;
    const containerHeight = containerRef.current.clientHeight || 900;

    let contentWidth = 1800;
    let contentHeight = 3200;

    if (contentRef.current) {
      const sw = contentRef.current.scrollWidth;
      const sh = contentRef.current.scrollHeight;
      if (sw > 100) contentWidth = sw;
      if (sh > 100) contentHeight = sh;
    }

    const margin = 48;
    const availableW = Math.max(containerWidth - margin * 2, 200);
    const availableH = Math.max(containerHeight - margin * 2, 200);

    const scaleX = availableW / contentWidth;
    const scaleY = availableH / contentHeight;
    const calculatedZoom = Math.min(scaleX, scaleY);

    const clampedZoom = Math.min(1.5, Math.max(0.18, Number(calculatedZoom.toFixed(2))));
    const calculatedPanX = Math.round((containerWidth - contentWidth * clampedZoom) / 2);
    const calculatedPanY = Math.max(margin, Math.round((containerHeight - contentHeight * clampedZoom) / 2));

    setZoom(clampedZoom);
    setPan({
      x: calculatedPanX > 0 ? calculatedPanX : margin,
      y: calculatedPanY > 0 ? calculatedPanY : margin,
    });
  }, []);

  const fitSelection = () => {
    if (!selectedScreen) return;
    setPan({ x: -selectedScreen.x * 0.7 + 100, y: -selectedScreen.y * 0.7 + 100 });
    setZoom(0.7);
  };

  // Renderizador Fiel de Previews Leves e Views Live Sob Demanda (Zero fallback genérico)
  const renderScreenContent = (screen: ScreenMetadata, viewport: 'desktop' | 'mobile', isSelected: boolean) => {
    if (isSelected) {
      return <AtlasScreenRenderer screenId={screen.id} viewport={viewport} />;
    }

    return (
      <div className="w-full h-full relative bg-[#fbfbfb] flex items-center justify-center">
        <img
          src={`/previews/${screen.id}-${viewport}.png`}
          alt={`${screen.title} - ${viewport}`}
          className="w-full h-full object-cover object-top select-none"
          loading="lazy"
        />
      </div>
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-74px)] bg-[#f5f5f5] overflow-hidden select-none">
      
      {/* Grade de Fundo Suave */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#0c2b15 0.75px, transparent 0.75px)',
          backgroundSize: '24px 24px',
          transform: `translate(${pan.x % 24}px, ${pan.y % 24}px)`,
        }}
      />

      {/* Barra de Ferramentas Flutuante Superior */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-[12px] border border-[#e8e8e8] shadow-sm canvas-ui-control">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-[#0c2b15] text-white flex items-center justify-center font-serif text-base font-bold shadow-xs">
            Më
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[#070707] leading-tight">
              Screen Atlas — Infinite Canvas Workspace
            </h1>
            <p className="text-[11px] text-[#696969]">
              Quadro branco espacial 2D: {getScreenCount()} telas • {getTotalFrameCount()} frames-base (Desktop + Mobile)
            </p>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="flex items-center gap-2">
          {/* Busca */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#696969]" />
            <input
              type="text"
              placeholder="Buscar tela..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#fbfbfb] border border-[#e8e8e8] rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#7399c6] w-36 lg:w-48"
            />
          </div>

          {/* Filtro por Jornada */}
          <select
            value={journeyFilter}
            onChange={(e) => setJourneyFilter(e.target.value)}
            className="text-xs bg-[#fbfbfb] border border-[#e8e8e8] rounded-[6px] px-2 py-1.5 text-[#070707]"
          >
            <option value="all">Todas as Jornadas ({getScreenCount()})</option>
            {journeys.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>

          {/* Filtro de Viewport */}
          <div className="flex items-center bg-[#f4f4f4] p-0.5 rounded-[6px] border border-[#e8e8e8]">
            <button
              onClick={() => setViewportFilter('all')}
              className={`px-2 py-1 text-xs font-medium rounded-[4px] transition ${viewportFilter === 'all' ? 'bg-white text-[#070707] shadow-2xs' : 'text-[#696969]'}`}
            >
              Todos ({getTotalFrameCount()})
            </button>
            <button
              onClick={() => setViewportFilter('desktop')}
              className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-[4px] transition ${viewportFilter === 'desktop' ? 'bg-white text-[#070707] shadow-2xs' : 'text-[#696969]'}`}
            >
              <Monitor className="w-3 h-3" /> Desktop ({getDesktopFrameCount()})
            </button>
            <button
              onClick={() => setViewportFilter('mobile')}
              className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-[4px] transition ${viewportFilter === 'mobile' ? 'bg-white text-[#070707] shadow-2xs' : 'text-[#696969]'}`}
            >
              <Smartphone className="w-3 h-3" /> Mobile ({getMobileFrameCount()})
            </button>
          </div>
        </div>

        {/* Controles de Zoom Espacial */}
        <div className="flex items-center gap-1.5">
          <Button variant="secondary" size="sm" onClick={fitAll} title="Enquadrar Todas as Telas">
            <Maximize2 className="w-3.5 h-3.5" /> Fit All
          </Button>
          <Button variant="secondary" size="sm" onClick={fitSelection} title="Focar na Tela Selecionada">
            <Target className="w-3.5 h-3.5" /> Focar
          </Button>
          <div className="flex items-center bg-[#f4f4f4] rounded-[6px] border border-[#e8e8e8] px-1">
            <button onClick={zoomOut} className="p-1 hover:text-[#0c2b15] text-[#696969]" aria-label="Diminuir zoom" title="Diminuir zoom">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span 
              className="font-mono text-xs px-2 min-w-[48px] text-center"
              data-testid="zoom-indicator"
            >
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={zoomIn} className="p-1 hover:text-[#0c2b15] text-[#696969]" aria-label="Aumentar zoom" title="Aumentar zoom">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          <Button variant="secondary" size="sm" onClick={resetView} title="Resetar Visualização">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Viewport Espacial com Transform 2D (Pan & Zoom Matemático) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className={`w-full h-full cursor-${isPanning ? 'grabbing' : 'grab'} overflow-hidden relative`}
      >
        <div
          ref={contentRef}
          className="absolute origin-top-left transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* Agrupamento Espacial por Jornadas */}
          {journeys.map((journeyName, journeyIndex) => {
            const journeyScreens = filteredScreens.filter(s => s.journey === journeyName);
            if (journeyScreens.length === 0) return null;

            return (
              <div 
                key={journeyName}
                className="mb-24 p-8 rounded-[16px] bg-white/70 border border-[#e8e8e8] shadow-sm relative"
                style={{ minWidth: 1600 }}
              >
                {/* Cabeçalho da Jornada */}
                <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#e8e8e8]">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-[6px] bg-[#0c2b15] text-white text-xs font-mono font-semibold">
                      J0{journeyIndex + 1}
                    </span>
                    <h2 className="text-2xl font-serif text-[#0c2b15] font-normal">
                      {journeyName}
                    </h2>
                    <Badge variant="neutral">{journeyScreens.length} Telas</Badge>
                  </div>
                  <span className="text-xs font-mono text-[#696969]">
                    Desktop (1440×1024) e Mobile (390×844) Lado a Lado
                  </span>
                </div>

                {/* Grid Lado a Lado de Frames */}
                <div className="flex flex-wrap gap-10 items-start">
                  {journeyScreens.map(screen => {
                    const isSelected = selectedScreenId === screen.id;

                    return (
                      <div 
                        key={screen.id} 
                        className="screen-frame-container flex flex-col gap-3 p-4 bg-[#fbfbfb] rounded-[14px] border border-[#e8e8e8] shadow-2xs"
                      >
                        {/* Identificador da Tela */}
                        <div 
                          onClick={() => setSelectedScreenId(screen.id)}
                          className="flex items-center justify-between text-xs font-semibold text-[#0c2b15] pb-2 border-b border-[#e8e8e8] cursor-pointer hover:text-[#7399c6]"
                        >
                          <span className="truncate max-w-[280px]">{screen.title}</span>
                          <span className="font-mono text-[10px] text-[#696969]">{screen.id}</span>
                        </div>

                        {/* Par de Viewports: Desktop + Mobile */}
                        <div className="flex gap-4 items-start">
                          {/* Desktop Frame (1440 x 1024) */}
                          {(viewportFilter === 'all' || viewportFilter === 'desktop') && (
                            <ScreenFrame
                              id={`${screen.id}-desktop`}
                              title={screen.title}
                              journey={screen.journey}
                              viewport="desktop"
                              scale={0.24}
                              isSelected={isSelected}
                              onSelect={() => setSelectedScreenId(screen.id)}
                              onOpenLive={() => onNavigateToView(screen.route)}
                            >
                              {renderScreenContent(screen, 'desktop', isSelected)}
                            </ScreenFrame>
                          )}

                          {/* Mobile Frame (390 x 844) */}
                          {(viewportFilter === 'all' || viewportFilter === 'mobile') && (
                            <ScreenFrame
                              id={`${screen.id}-mobile`}
                              title={screen.title}
                              journey={screen.journey}
                              viewport="mobile"
                              scale={0.24}
                              isSelected={isSelected}
                              onSelect={() => setSelectedScreenId(screen.id)}
                              onOpenLive={() => onNavigateToView(screen.route)}
                            >
                              {renderScreenContent(screen, 'mobile', isSelected)}
                            </ScreenFrame>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel Lateral de Inspeção de Tela (quando um frame está selecionado) */}
      {selectedScreen && (
        <aside className="absolute right-4 top-20 bottom-4 w-80 lg:w-96 bg-white rounded-[14px] border border-[#e8e8e8] shadow-lg z-20 flex flex-col p-5 overflow-y-auto canvas-ui-control">
          <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8] mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#696969]">Inspeção de Tela</span>
              <h3 className="text-base font-serif text-[#0c2b15] font-semibold">{selectedScreen.title}</h3>
            </div>
            <button 
              onClick={() => setSelectedScreenId(null)}
              className="p-1 rounded-[6px] text-[#696969] hover:text-[#070707] hover:bg-[#f4f4f4]"
              aria-label="Fechar Inspeção"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs font-sans flex-1">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#696969]">ID Canônico & Rota:</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="forest">{selectedScreen.id}</Badge>
                <Badge variant="goldman">rota: {selectedScreen.route}</Badge>
                {selectedScreen.subtab && <Badge variant="neutral">subaba: {selectedScreen.subtab}</Badge>}
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-[#696969]">Jornada do Produto:</span>
              <div className="font-semibold text-[#070707] mt-1">{selectedScreen.journey}</div>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-[#696969]">Objetivo do Usuário:</span>
              <p className="text-[#696969] mt-1 leading-relaxed">{selectedScreen.description}</p>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-[#696969]">Componente Fonte (Código):</span>
              <div className="p-2 bg-[#fbfbfb] rounded-[6px] border border-[#e8e8e8] font-mono text-[11px] text-[#0c2b15] mt-1">
                {selectedScreen.componentName}.tsx
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-[#696969]">Dados & Modelos Utilizados:</span>
              <div className="p-2 bg-[#fbfbfb] rounded-[6px] border border-[#e8e8e8] font-mono text-[11px] text-[#070707] mt-1">
                {selectedScreen.dataUsed}
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-[#696969]">Estados Cobertos:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {selectedScreen.states.map(st => (
                  <Badge key={st} variant="neutral" size="sm">{st}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e8e8e8] mt-4">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              icon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={() => onNavigateToView(selectedScreen.route)}
            >
              Abrir Tela no Më Life OS
            </Button>
          </div>
        </aside>
      )}

      {/* Indicador de Atalhos / Dica no canto inferior */}
      <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-white rounded-[8px] border border-[#e8e8e8] text-[11px] font-mono text-[#696969] shadow-2xs pointer-events-none">
        Arraste para mover o canvas • Use o scroll do mouse ou botões para Zoom
      </div>

    </div>
  );
};
