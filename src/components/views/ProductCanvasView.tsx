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
import { InteractivePrototypes } from '../../design-system/prototypes/InteractivePrototypes';
import { SCREEN_REGISTRY } from '../../design-system/registry/screenRegistry';
import { Badge } from '../../design-system/components/Badge';
import { Button } from '../../design-system/components/Button';

export default function ProductCanvasView() {
  const { setCurrentView } = useStore();
  const [activeTab, setActiveTab] = useState<'canvas' | 'prototypes' | 'spec'>('canvas');

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#fbfbfb] text-[#070707] font-sans">
      {/* Sub-header de Modo do Screen Atlas */}
      <div className="bg-white border-b border-[#e8e8e8] px-6 py-2.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-[6px] bg-[#0c2b15] text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs">
            Më
          </div>
          <div>
            <div className="text-xs font-semibold text-[#0c2b15] leading-tight">
              Screen Atlas & Design System
            </div>
            <div className="text-[10px] font-mono text-[#696969]">
              BCG + Goldman Sachs v2.0 • 28 Telas • 56 Frames Base
            </div>
          </div>
        </div>

        {/* Abas Superiores do Atlas */}
        <div className="flex items-center bg-[#f4f4f4] p-0.5 rounded-[8px] border border-[#e8e8e8]">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] transition ${
              activeTab === 'canvas'
                ? 'bg-white text-[#0c2b15] shadow-xs font-semibold'
                : 'text-[#696969] hover:text-[#070707]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> Quadro Branco Espacial (Canvas)
          </button>
          <button
            onClick={() => setActiveTab('prototypes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] transition ${
              activeTab === 'prototypes'
                ? 'bg-white text-[#0c2b15] shadow-xs font-semibold'
                : 'text-[#696969] hover:text-[#070707]'
            }`}
          >
            <Play className="w-3.5 h-3.5" /> 10 Protótipos & Validações
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] transition ${
              activeTab === 'spec'
                ? 'bg-white text-[#0c2b15] shadow-xs font-semibold'
                : 'text-[#696969] hover:text-[#070707]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Especificação & Penpot
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="forest">56 Frames Live (28 Desktop + 28 Mobile)</Badge>
          <Badge variant="neutral">Contraste BCG + Goldman</Badge>
        </div>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="flex-1 w-full">
        {/* Aba 1: O Canvas Espacial 2D Real (Quadro Branco com Pan & Zoom) */}
        {activeTab === 'canvas' && (
          <InfiniteCanvas onNavigateToView={(view: View) => setCurrentView(view)} />
        )}

        {/* Aba 2: Os 10 Protótipos Navegáveis Reais */}
        {activeTab === 'prototypes' && (
          <div className="max-w-6xl mx-auto p-6 md:p-10 w-full animate-fade-in">
            <InteractivePrototypes />
          </div>
        )}

        {/* Aba 3: Especificação, Tokens e Handoff Penpot */}
        {activeTab === 'spec' && (
          <div className="max-w-5xl mx-auto p-6 md:p-10 w-full space-y-8 animate-fade-in">
            <div className="border-b border-[#e8e8e8] pb-4">
              <h2 className="text-2xl font-serif text-[#0c2b15] font-normal">
                Especificação Visual & Handoff para Penpot
              </h2>
              <p className="text-xs text-[#696969] mt-1">
                Integração dos tokens W3C DTCG e diretrizes estruturais de páginas e componentes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs">
                <h3 className="text-sm font-semibold text-[#070707] mb-2">Tokens em Formato W3C DTCG</h3>
                <p className="text-xs text-[#696969] mb-3 leading-relaxed">
                  O arquivo `design-system/tokens.json` é estruturado nas 3 camadas recomendadas pelo padrão do W3C:
                  Primitivos, Semânticos e Componentes.
                </p>
                <div className="p-3 bg-[#fbfbfb] rounded-[6px] border border-[#e8e8e8] font-mono text-[11px] text-[#0c2b15]">
                  design-system/tokens.json<br />
                  design-system/tokens.css (conectado ao Vite)
                </div>
              </div>

              <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs">
                <h3 className="text-sm font-semibold text-[#070707] mb-2">Estrutura de Páginas no Penpot</h3>
                <p className="text-xs text-[#696969] mb-3 leading-relaxed">
                  Ao criar o arquivo no Penpot, mantenha a hierarquia de 11 páginas documentadas no `PENPOT-INTEGRATION.md`:
                </p>
                <div className="p-3 bg-[#fbfbfb] rounded-[6px] border border-[#e8e8e8] font-mono text-[11px] text-[#1b365d]">
                  00 Cover • 01 Identidade • 02 Foundations<br />
                  03 Componentes • 04 Padrões • 05 Mapa<br />
                  06 Desktop • 07 Mobile • 08 Estados<br />
                  09 Protótipos • 10 Handoff
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs">
              <h3 className="text-sm font-semibold text-[#070707] mb-2">Inventário Auditado de Telas</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e8e8e8] bg-[#fbfbfb] text-[#696969] font-mono">
                      <th className="p-2">ID</th>
                      <th className="p-2">Tela</th>
                      <th className="p-2">Jornada</th>
                      <th className="p-2">Componente</th>
                      <th className="p-2">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCREEN_REGISTRY.map(s => (
                      <tr key={s.id} className="border-b border-[#f0f0f0] hover:bg-[#fbfbfb]">
                        <td className="p-2 font-mono text-[#0c2b15]">{s.id}</td>
                        <td className="p-2 font-medium">{s.title}</td>
                        <td className="p-2 text-[#696969]">{s.journey}</td>
                        <td className="p-2 font-mono text-[#1b365d]">{s.componentName}</td>
                        <td className="p-2">
                          <button
                            onClick={() => setCurrentView(s.route)}
                            className="text-[#41a217] hover:underline flex items-center gap-1 text-[11px]"
                          >
                            Abrir <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
