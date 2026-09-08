import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Monitor, 
  Smartphone, 
  Grid, 
  ExternalLink, 
  CheckCircle2, 
  FileCode2, 
  Play, 
  BookOpen,
  Info
} from 'lucide-react';
import { useStore, View } from '../../store';
import { InfiniteCanvas } from '../../design-system/canvas/InfiniteCanvas';
import { DesignKitView } from '../../design-system/components/DesignKitView';
import { 
  SCREEN_REGISTRY, 
  getScreenCount, 
  getDesktopFrameCount, 
  getMobileFrameCount, 
  getTotalFrameCount 
} from '../../design-system/registry/screenRegistry';
import { Badge } from '../../design-system/components/Badge';
import { Button } from '../../design-system/components/Button';

export default function ProductCanvasView() {
  const { setCurrentView } = useStore();
  const [activeTab, setActiveTab] = useState<'canvas' | 'design-kit'>('canvas');

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#fbfbfb] text-[#070707] font-sans">
      {/* Sub-header de Navegação: Canvas e Design Kit */}
      <div className="bg-white border-b border-[#e8e8e8] px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-[6px] bg-[#0c2b15] text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs shrink-0">
            Më
          </div>
          <div>
            <div className="text-xs font-semibold text-[#0c2b15] leading-tight">
              Canvas de Telas
            </div>
            <div className="text-[10px] font-mono text-[#696969]">
              BCG + Goldman Sachs • {getScreenCount()} telas • {getTotalFrameCount()} frames
            </div>
          </div>
        </div>

        {/* Duas Abas Canônicas: Telas e Design Kit */}
        <div className="flex items-center bg-[#f4f4f4] p-0.5 rounded-[8px] border border-[#e8e8e8] self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 text-xs font-medium rounded-[6px] min-h-[40px] sm:min-h-[32px] transition ${
              activeTab === 'canvas'
                ? 'bg-white text-[#0c2b15] shadow-xs font-semibold'
                : 'text-[#696969] hover:text-[#070707]'
            }`}
          >
            <Grid className="w-3.5 h-3.5 shrink-0" /> Telas
          </button>
          <button
            onClick={() => setActiveTab('design-kit')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 text-xs font-medium rounded-[6px] min-h-[40px] sm:min-h-[32px] transition ${
              activeTab === 'design-kit'
                ? 'bg-white text-[#0c2b15] shadow-xs font-semibold'
                : 'text-[#696969] hover:text-[#070707]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" /> Design Kit
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Badge variant="forest">
            {getTotalFrameCount()} frames ({getDesktopFrameCount()} desktop + {getMobileFrameCount()} mobile)
          </Badge>
          <Badge variant="neutral">Contraste BCG + Goldman</Badge>
        </div>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="flex-1 w-full">
        {/* Aba 1: O Canvas de Telas 2D Real (Quadro Visual com Pan & Zoom) */}
        {activeTab === 'canvas' && (
          <InfiniteCanvas onNavigateToView={(view: View) => setCurrentView(view)} />
        )}

        {/* Aba 2: Design Kit (Foundations, Tokens, Componentes e Padrões) */}
        {activeTab === 'design-kit' && (
          <DesignKitView />
        )}
      </div>
    </div>
  );
}
