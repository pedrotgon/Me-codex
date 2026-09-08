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
  Table as TableIcon,
  AlertCircle
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
import { calculateFitAll } from './fitAllCalculator';
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

  // Fit All Real: calcula limites matemáticos reais do canvas e do conteúdo
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

    const { zoom: calculatedZoom, pan: calculatedPan } = calculateFitAll({
      containerWidth,
      containerHeight,
      contentWidth,
      contentHeight,
      margin: 48,
    });

    setZoom(calculatedZoom);
    setPan(calculatedPan);
  }, []);

  const fitSelection = () => {
    if (!selectedScreen) return;
    setPan({ x: -selectedScreen.x * 0.7 + 100, y: -selectedScreen.y * 0.7 + 100 });
    setZoom(0.7);
  };

  // Componente de Preview Leve com Detecção Explícita de Erro
  const ScreenPreviewFrame: React.FC<{
    screen: ScreenMetadata;
    viewport: 'desktop' | 'mobile';
    isSelected: boolean;
  }> = ({ screen, viewport, isSelected }) => {
    const [loadError, setLoadError] = useState(false);

    // Se selecionada, renderiza a view React real live completa
    if (isSelected) {
      return <AtlasScreenRenderer screenId={screen.id} viewport={viewport} />;
    }

    // Estado explícito de erro para previews ausentes, corrompidos ou fallback HTML
    if (loadError) {
      return (
        <div 
          className="w-full h-full p-4 bg-[#fff5f5] border border-dashed border-[#e53e3e]/40 rounded-[8px] flex flex-col items-center justify-center text-center select-none"
          data-testid={`preview-error-${screen.id}-${viewport}`}
        >
          <div className="w-8 h-8 rounded-full bg-[#e53e3e]/10 text-[#e53e3e] flex items-center justify-center mb-1.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-[#e53e3e]">Preview Indisponível</span>
          <span className="text-[10px] font-mono text-[#696969] mt-0.5">
            {screen.id} • {viewport}
          </span>
          <span className="text-[9px] text-[#888] mt-1">
            Execute npm run atlas:capture
          </span>
        </div>
      );
    }

    return (
      <div className="w-full h-full relative bg-[#fbfbfb] flex items-center justify-center">
        <img
          src={`/previews/${screen.id}-${viewport}.png`}
          alt={`${screen.title} - ${viewport}`}
          className="w-full h-full object-cover object-top select-none"
          loading="lazy"
          onError={() => {
            console.warn(`[ScreenAtlas] Failed to load preview: /previews/${screen.id}-${viewport}.png`);
            setLoadError(true);
          }}
        />
      </div>
    );
  };

  // Renderizador Fiel de Previews Leves e Views Live Sob Demanda (Zero fallback genérico)
  const renderScreenContent = (screen: ScreenMetadata, viewport: 'desktop' | 'mobile', isSelected: boolean) => {
    return <ScreenPreviewFrame screen={screen} viewport={viewport} isSelected={isSelected} />;
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
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-[10px] sm:rounded-[12px] border border-[#e8e8e8] shadow-sm canvas-ui-control">
        {/* Linha 1: Marca, Título e Controles de Zoom */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[6px] sm:rounded-[8px] bg-[#0c2b15] text-white flex items-center justify-center font-serif text-sm sm:text-base font-bold shadow-xs shrink-0">
              Më
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-semibold text-[#070707] leading-tight">
                Canvas de Telas
              </h1>
              <p className="text-[10px] sm:text-[11px] text-[#696969] truncate">
                Quadro visual: {getScreenCount()} telas • {getTotalFrameCount()} frames (Desktop + Mobile)
              </p>
            </div>
          </div>

          {/* Controles de Zoom Compactos e Confortáveis */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Button variant="secondary" size="sm" onClick={fitAll} title="Enquadrar Todas as Telas" className="min-h-[38px] sm:min-h-[32px] px-2.5 text-xs">
              <Maximize2 className="w-3.5 h-3.5" /> Fit All
            </Button>
            <Button variant="secondary" size="sm" onClick={fitSelection} title="Focar na Tela Selecionada" className="hidden sm:inline-flex min-h-[32px] px-2 text-xs">
              <Target className="w-3.5 h-3.5" /> Focar
            </Button>
            <div className="flex items-center bg-[#f4f4f4] rounded-[6px] border border-[#e8e8e8] px-0.5">
              <button onClick={zoomOut} className="p-1.5 sm:p-1 hover:text-[#0c2b15] text-[#696969] min-w-[32px] min-h-[32px] flex items-center justify-center" aria-label="Diminuir zoom" title="Diminuir zoom">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span 
                className="font-mono text-[11px] sm:text-xs px-1.5 min-w-[42px] sm:min-w-[48px] text-center"
                data-testid="zoom-indicator"
              >
                {Math.round(zoom * 100)}%
              </span>
              <button onClick={zoomIn} className="p-1.5 sm:p-1 hover:text-[#0c2b15] text-[#696969] min-w-[32px] min-h-[32px] flex items-center justify-center" aria-label="Aumentar zoom" title="Aumentar zoom">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
            <Button variant="secondary" size="sm" onClick={resetView} title="Resetar Visualização" className="min-h-[38px] sm:min-h-[32px] px-2">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Linha 2: Filtros de Viewport, Busca e Jornada */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t border-[#f0f0f0] md:border-0">
          {/* Filtro de Viewport */}
          <div className="flex items-center bg-[#f4f4f4] p-0.5 rounded-[6px] border border-[#e8e8e8]">
            <button
              onClick={() => setViewportFilter('all')}
              className={`px-2.5 py-1.5 sm:py-1 text-xs font-medium rounded-[4px] min-h-[36px] sm:min-h-[28px] transition ${viewportFilter === 'all' ? 'bg-white text-[#070707] shadow-2xs' : 'text-[#696969]'}`}
            >
              Todos ({getTotalFrameCount()})
            </button>
            <button
              onClick={() => setViewportFilter('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1.5 sm:py-1 text-xs font-medium rounded-[4px] min-h-[36px] sm:min-h-[28px] transition ${viewportFilter === 'desktop' ? 'bg-white text-[#070707] shadow-2xs' : 'text-[#696969]'}`}
            >
              <Monitor className="w-3 h-3" /> Desktop ({getDesktopFrameCount()})
            </button>
            <button
              onClick={() => setViewportFilter('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1.5 sm:py-1 text-xs font-medium rounded-[4px] min-h-[36px] sm:min-h-[28px] transition ${viewportFilter === 'mobile' ? 'bg-white text-[#070707] shadow-2xs' : 'text-[#696969]'}`}
            >
              <Smartphone className="w-3 h-3" /> Mobile ({getMobileFrameCount()})
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
            {/* Busca */}
            <div className="relative flex-1 sm:flex-none min-w-[120px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#696969]" />
              <input
                type="text"
                placeholder="Buscar tela..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-36 lg:w-44 pl-8 pr-3 py-1.5 text-xs bg-[#fbfbfb] border border-[#e8e8e8] rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#7399c6] min-h-[36px] sm:min-h-[28px]"
              />
            </div>

            {/* Filtro por Jornada */}
            <select
              value={journeyFilter}
              onChange={(e) => setJourneyFilter(e.target.value)}
              className="text-xs bg-[#fbfbfb] border border-[#e8e8e8] rounded-[6px] px-2 py-1.5 text-[#070707] min-h-[36px] sm:min-h-[28px] max-w-[130px] sm:max-w-none truncate"
            >
              <option value="all">Jornadas ({getScreenCount()})</option>
              {journeys.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>
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

      {/* Painel Lateral / Bottom Sheet de Inspeção de Tela (quando um frame está selecionado) */}
      {selectedScreen && (
        <aside className="fixed inset-x-0 bottom-0 max-h-[75vh] w-full rounded-t-[20px] rounded-b-none border-t border-[#e8e8e8] shadow-2xl p-4 sm:p-5 z-40 sm:absolute sm:inset-auto sm:right-4 sm:top-20 sm:bottom-4 sm:w-80 lg:sm:w-96 sm:rounded-[14px] sm:border sm:shadow-lg bg-white flex flex-col overflow-y-auto canvas-ui-control">
          {/* Puxador Visual Mobile */}
          <div className="sm:hidden w-10 h-1 rounded-full bg-[#d0d0d0] mx-auto mb-2 shrink-0" />

          <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8] mb-3 sm:mb-4 shrink-0">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#696969]">Inspeção de Tela</span>
              <h3 className="text-sm sm:text-base font-serif text-[#0c2b15] font-semibold">{selectedScreen.title}</h3>
            </div>
            <button 
              onClick={() => setSelectedScreenId(null)}
              className="p-2 sm:p-1 rounded-[6px] text-[#696969] hover:text-[#070707] hover:bg-[#f4f4f4] min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
              aria-label="Fechar Inspeção"
            >
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4 text-xs font-sans flex-1">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#696969]">ID Canônico & Rota:</span>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
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

          <div className="pt-3 border-t border-[#e8e8e8] mt-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              className="w-full min-h-[44px]"
              icon={<ExternalLink className="w-4 h-4" />}
              onClick={() => onNavigateToView(selectedScreen.route)}
            >
              Abrir Tela no Më Life OS
            </Button>
          </div>
        </aside>
      )}

      {/* Indicador de Atalhos / Dica no canto inferior */}
      <div className="hidden sm:block absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-white rounded-[8px] border border-[#e8e8e8] text-[11px] font-mono text-[#696969] shadow-2xs pointer-events-none">
        Arraste para mover o canvas • Use o scroll do mouse ou botões para Zoom
      </div>

    </div>
  );
};
