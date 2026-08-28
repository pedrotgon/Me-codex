import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Search, 
  Layers, 
  FolderKanban, 
  CheckCircle2, 
  Library, 
  Archive, 
  FileText, 
  FileCode2, 
  X, 
  Plus, 
  Link2, 
  Sparkles,
  Loader2,
  Network
} from 'lucide-react';
import { useStore } from '../../store';
import { KiNode, KiRelation, NodeType, RelationType } from '../../lib/db';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: NodeType;
  color: string;
  radius: number;
  degree: number;
  raw: KiNode;
  archived: boolean;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  type: RelationType;
  weight: number;
  approved: boolean;
  author: 'manual' | 'ai' | 'system';
}

const TYPE_CONFIG: Record<NodeType, { label: string; color: string; icon: any }> = {
  area: { label: 'Áreas', color: '#1b4332', icon: Layers },
  project: { label: 'Projetos', color: '#2563eb', icon: FolderKanban },
  task: { label: 'Tarefas', color: '#7c3aed', icon: CheckCircle2 },
  resource: { label: 'Recursos', color: '#16a34a', icon: Library },
  archive: { label: 'Arquivados', color: '#64748b', icon: Archive },
  markdown: { label: 'Markdown Twins', color: '#0891b2', icon: FileText },
  source: { label: 'Arquivos Originais', color: '#e11d48', icon: FileCode2 },
};

export default function MemoriaMapa() {
  const { nodes, relations, isDbLoaded, createRelation } = useStore();

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<NodeType, boolean>>({
    area: true,
    project: true,
    task: true,
    resource: true,
    archive: false,
    markdown: true,
    source: false,
  });

  const [isLinking, setIsLinking] = useState(false);
  const [linkTargetId, setLinkTargetId] = useState('');
  const [linkType, setLinkType] = useState<RelationType>('supports');

  // D3 Behavior References
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId, nodes]);

  // Construção e Simulação D3
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    if (!nodes || nodes.length === 0) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Zoom Group
    const g = svg.append('g');
    gRef.current = g;

    // Grid e Círculos de Órbita Suaves (Estética Më Nude/Forest)
    [120, 240, 380, 520, 680, 850].forEach(r => {
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(27, 67, 50, 0.05)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 4');
    });

    // Marcador de Flechas
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'rel-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', 'rgba(27, 67, 50, 0.25)')
      .attr('d', 'M0,-4L8,0L0,4');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 3.5])
      .on('zoom', event => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.6));

    // Cálculo do Grau Conectivo Ponderado
    const degreeMap = new Map<string, number>();
    (relations || []).forEach(r => {
      degreeMap.set(r.sourceId, (degreeMap.get(r.sourceId) || 0) + (r.weight || 1));
      degreeMap.set(r.targetId, (degreeMap.get(r.targetId) || 0) + (r.weight || 1));
    });

    // Filtro de Nós Ativos
    const visibleNodesList = nodes.filter(n => {
      if (!activeFilters[n.type]) return false;
      if (n.archived && !activeFilters.archive) return false;
      return true;
    });

    const visibleNodeIds = new Set(visibleNodesList.map(n => n.id));

    // Montagem dos nós com Raio Logarítmico Ponderado
    let areaIndex = 0;
    const areasCount = visibleNodesList.filter(n => n.type === 'area').length || 1;

    const graphNodes: GraphNode[] = visibleNodesList.map((n, idx) => {
      const degree = degreeMap.get(n.id) || 0;
      const radius = Math.min(48, Math.max(14, Math.round(14 + 7 * Math.log(1 + degree))));
      const config = TYPE_CONFIG[n.type] || { color: '#1b4332' };

      let initialX = 0;
      let initialY = 0;
      let fx: number | undefined = undefined;
      let fy: number | undefined = undefined;

      if (n.type === 'area') {
        const angle = (areaIndex / areasCount) * Math.PI * 2;
        const orbit = 380;
        fx = Math.cos(angle) * orbit;
        fy = Math.sin(angle) * orbit;
        initialX = fx;
        initialY = fy;
        areaIndex++;
      } else {
        const phi = idx * 2.39996;
        const dist = Math.sqrt(idx + 1) * 42;
        initialX = Math.cos(phi) * dist;
        initialY = Math.sin(phi) * dist;
      }

      return {
        id: n.id,
        name: n.title || 'Sem título',
        type: n.type,
        color: config.color,
        radius,
        degree,
        raw: n,
        archived: n.archived,
        x: initialX,
        y: initialY,
        fx,
        fy,
      };
    });

    // Links estritamente válidos
    const graphLinks: GraphLink[] = (relations || [])
      .filter(r => visibleNodeIds.has(r.sourceId) && visibleNodeIds.has(r.targetId))
      .map(r => ({
        id: r.id,
        source: r.sourceId,
        target: r.targetId,
        type: r.type,
        weight: r.weight || 1,
        approved: r.approved,
        author: r.author,
      }));

    // Simulação Force-Directed
    const simulation = d3.forceSimulation<GraphNode, GraphLink>(graphNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(graphLinks)
        .id(d => d.id)
        .distance(d => {
          const s = d.source as GraphNode;
          const t = d.target as GraphNode;
          if (s && t && (s.type === 'area' || t.type === 'area')) return 160;
          return 90;
        })
        .strength(0.7)
      )
      .force('charge', d3.forceManyBody().strength(-800).distanceMax(700))
      .force('collide', d3.forceCollide<GraphNode>().radius(d => d.radius + 20).iterations(3))
      .force('x', d3.forceX(0).strength(0.03))
      .force('y', d3.forceY(0).strength(0.03));

    simulationRef.current = simulation;

    // Renderização dos Links
    const linkSelection = g.append('g')
      .selectAll('line')
      .data(graphLinks)
      .join('line')
      .attr('stroke', 'rgba(27, 67, 50, 0.18)')
      .attr('stroke-width', d => Math.max(1, d.weight * 1.2))
      .attr('stroke-dasharray', d => d.approved ? 'none' : '4 3')
      .attr('marker-end', 'url(#rel-arrow)');

    // Renderização dos Nós
    const nodeSelection = g.append('g')
      .selectAll('g')
      .data(graphNodes)
      .join('g')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.2).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          if (d.type !== 'area') {
            d.fx = null;
            d.fy = null;
          }
        })
      );

    const normalizedSearch = searchQuery.trim().toLocaleLowerCase('pt-BR');
    const searchMatches = new Set(
      graphNodes
        .filter(node => !normalizedSearch || node.name.toLocaleLowerCase('pt-BR').includes(normalizedSearch))
        .map(node => node.id)
    );

    const restoreSearchState = () => {
      nodeSelection.style('opacity', node => !normalizedSearch || searchMatches.has(node.id) ? 1 : 0.12);
      linkSelection.style('stroke-opacity', link => {
        if (!normalizedSearch) return 0.6;
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        return searchMatches.has(sourceId) || searchMatches.has(targetId) ? 0.75 : 0.04;
      });
    };

    restoreSearchState();

    // Círculos dos Nós
    nodeSelection.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.type === 'area' ? d.color : d3.rgb(d.color).brighter(1.8).toString())
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
      .attr('opacity', d => d.archived ? 0.4 : 0.95)
      .style('cursor', 'pointer');

    // Rótulo dos Nós
    nodeSelection.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-family', "'Outfit', 'Inter', sans-serif")
      .style('font-size', d => Math.max(10, Math.min(13, d.radius * 0.45)) + 'px')
      .style('font-weight', '700')
      .style('fill', d => d.type === 'area' ? '#ffffff' : '#1b4332')
      .style('pointer-events', 'none')
      .style('paint-order', 'stroke')
      .style('stroke', d => d.type === 'area' ? 'rgba(0,0,0,0.4)' : '#ffffff')
      .style('stroke-width', '2px')
      .text(d => {
        const clean = d.name;
        return clean.length > 14 ? `${clean.slice(0, 12)}…` : clean;
      });

    // Interações de Clique e Hover com Destaque de Vizinhança
    nodeSelection.on('click', (event, d) => {
      event.stopPropagation();
      setSelectedNodeId(d.id);

      const connected = new Set<string>([d.id]);
      graphLinks.forEach(l => {
        const sId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
        const tId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
        if (sId === d.id) connected.add(tId);
        if (tId === d.id) connected.add(sId);
      });

      nodeSelection.style('opacity', n => connected.has((n as GraphNode).id) ? 1 : 0.12);
      linkSelection.style('stroke-opacity', l => {
        const sId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
        const tId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
        return (sId === d.id || tId === d.id) ? 0.9 : 0.04;
      });
      linkSelection.style('stroke', l => {
        const sId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
        const tId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
        return (sId === d.id || tId === d.id) ? '#1b4332' : 'rgba(27, 67, 50, 0.18)';
      });
    });

    svg.on('click', () => {
      setSelectedNodeId(null);
      restoreSearchState();
      linkSelection.style('stroke', 'rgba(27, 67, 50, 0.18)');
    });

    simulation.on('tick', () => {
      linkSelection
        .attr('x1', d => (typeof d.source === 'object' && (d.source as GraphNode).x != null) ? (d.source as GraphNode).x! : 0)
        .attr('y1', d => (typeof d.source === 'object' && (d.source as GraphNode).y != null) ? (d.source as GraphNode).y! : 0)
        .attr('x2', d => (typeof d.target === 'object' && (d.target as GraphNode).x != null) ? (d.target as GraphNode).x! : 0)
        .attr('y2', d => (typeof d.target === 'object' && (d.target as GraphNode).y != null) ? (d.target as GraphNode).y! : 0);

      nodeSelection.attr('transform', d => (d.x != null && d.y != null) ? `translate(${d.x},${d.y})` : 'translate(0,0)');
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, relations, activeFilters, searchQuery]);

  const handleZoom = (factor: number) => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, factor);
    }
  };

  const handleCenter = () => {
    if (svgRef.current && zoomRef.current && containerRef.current) {
      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 600;
      d3.select(svgRef.current)
        .transition()
        .duration(600)
        .call(zoomRef.current.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.6));
    }
  };

  const handleAddLink = async () => {
    if (!selectedNodeId || !linkTargetId) return;
    await createRelation(selectedNodeId, linkTargetId, linkType, 'manual');
    setIsLinking(false);
    setLinkTargetId('');
  };

  const toggleFilter = (type: NodeType) => {
    setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  if (!isDbLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] min-h-[600px] bg-white rounded-2xl border border-forest/10 p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-forest mb-3" />
        <p className="text-[13px] font-bold text-ink">Carregando mapa relacional da Memória...</p>
      </div>
    );
  }

  if (!nodes.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] min-h-[600px] bg-white rounded-2xl border border-forest/10 p-8 text-center">
        <Network className="w-9 h-9 text-forest/45 mb-3" />
        <p className="text-[14px] font-bold text-ink">Sua Memória ainda está vazia</p>
        <p className="mt-1 max-w-md text-[12px] leading-relaxed text-ink/55">
          Adicione itens ao método PARA ou aprove uma ingestão no Para-Organizer para formar os primeiros nós e relações.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 w-full h-[calc(100vh-140px)] min-h-[600px] bg-nude/40 rounded-2xl border border-forest/10 overflow-hidden shadow-xs">
      {/* Controles Flutuantes Superiores: Busca & Filtros */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 max-w-[calc(100%-32px)]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-forest/50" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Localizar nó no mapa..."
            className="h-9 w-52 pl-8 pr-3 rounded-xl bg-white/90 backdrop-blur-md border border-forest/15 text-[12px] font-medium text-ink placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-forest/15 shadow-xs">
          {(Object.entries(TYPE_CONFIG) as [NodeType, typeof TYPE_CONFIG[NodeType]][]).map(([type, cfg]) => {
            const active = activeFilters[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleFilter(type)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  active
                    ? 'bg-forest/10 text-forest'
                    : 'text-ink/40 hover:bg-forest/5 hover:text-ink'
                }`}
                title={`Alternar visualização de ${cfg.label}`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: active ? cfg.color : 'rgba(0,0,0,0.15)' }}
                />
                <span className="hidden sm:inline">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG do Mapa */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Painel Lateral de Inspeção do Nó Selecionado */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-20 w-80 max-h-[calc(100%-32px)] bg-white/95 backdrop-blur-xl border border-forest/15 rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="h-1.5 w-full" style={{ backgroundColor: TYPE_CONFIG[selectedNode.type]?.color || '#1b4332' }} />
          
          <div className="p-4 flex items-start justify-between border-b border-forest/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest/70">
                {TYPE_CONFIG[selectedNode.type]?.label || selectedNode.type}
              </span>
              <h3 className="text-[15px] font-bold text-ink leading-tight mt-0.5">
                {selectedNode.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNodeId(null)}
              className="p-1 rounded-lg text-ink/40 hover:bg-forest/5 hover:text-forest cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-4 flex-1 text-[12px]">
            {selectedNode.metadata?.summary && (
              <div>
                <span className="text-[10px] font-bold uppercase text-ink/40">Resumo</span>
                <p className="mt-0.5 text-ink/75 leading-relaxed bg-forest/3 p-2 rounded-lg border border-forest/5">
                  {selectedNode.metadata.summary}
                </p>
              </div>
            )}

            {selectedNode.metadata?.original_file && (
              <div>
                <span className="text-[10px] font-bold uppercase text-ink/40">Arquivo Fonte</span>
                <p className="mt-0.5 text-ink/70 font-mono text-[11px]">
                  {selectedNode.metadata.original_file}
                </p>
              </div>
            )}

            {/* Relações Conectadas */}
            <div>
              <span className="text-[10px] font-bold uppercase text-ink/40">Conexões na Memória</span>
              <div className="mt-1 space-y-1.5">
                {(relations || [])
                  .filter(r => r.sourceId === selectedNode.id || r.targetId === selectedNode.id)
                  .map(rel => {
                    const isSource = rel.sourceId === selectedNode.id;
                    const otherId = isSource ? rel.targetId : rel.sourceId;
                    const otherNode = nodes.find(n => n.id === otherId);
                    return (
                      <div
                        key={rel.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-forest/5 border border-forest/8 text-[11px]"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <Link2 className="w-3.5 h-3.5 text-forest shrink-0" />
                          <span className="font-bold text-forest">{rel.type}:</span>
                          <span className="text-ink truncate">{otherNode?.title || otherId}</span>
                        </div>
                        <span className="text-[9px] font-mono text-ink/40 shrink-0">
                          {rel.author}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Adicionar Nova Relação */}
            {isLinking ? (
              <div className="p-3 rounded-xl border border-forest/20 bg-forest/5 space-y-2">
                <span className="text-[11px] font-bold text-forest">Conectar a outro Nó:</span>
                <select
                  value={linkTargetId}
                  onChange={e => setLinkTargetId(e.target.value)}
                  className="w-full h-8 rounded-lg border border-forest/15 bg-white px-2 text-[11px]"
                >
                  <option value="">Selecione o destino...</option>
                  {nodes.filter(n => n.id !== selectedNode.id).map(n => (
                    <option key={n.id} value={n.id}>
                      [{TYPE_CONFIG[n.type]?.label}] {n.title}
                    </option>
                  ))}
                </select>

                <select
                  value={linkType}
                  onChange={e => setLinkType(e.target.value as RelationType)}
                  className="w-full h-8 rounded-lg border border-forest/15 bg-white px-2 text-[11px]"
                >
                  <option value="supports">supports (suporta)</option>
                  <option value="belongs_to">belongs_to (pertence a)</option>
                  <option value="produces">produces (produz)</option>
                  <option value="depends_on">depends_on (depende de)</option>
                  <option value="references">references (referencia)</option>
                  <option value="task_for">task_for (tarefa de)</option>
                  <option value="related_to">related_to (relacionado a)</option>
                </select>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAddLink}
                    disabled={!linkTargetId}
                    className="flex-1 py-1.5 rounded-lg bg-forest text-white font-bold text-[11px] disabled:opacity-40 cursor-pointer"
                  >
                    Salvar Conexão
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLinking(false)}
                    className="px-2 py-1.5 rounded-lg bg-white border border-forest/15 text-ink/60 text-[11px] cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLinking(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-forest/20 bg-white text-forest text-[11px] font-bold hover:bg-forest/5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Criar Conexão Relacional
              </button>
            )}
          </div>
        </div>
      )}

      {/* Controles Flutuantes Inferiores: Zoom & Centralizar */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-forest/15 shadow-sm">
        <button
          type="button"
          onClick={() => handleZoom(1.25)}
          className="p-2 text-forest/70 hover:bg-forest/10 hover:text-forest rounded-lg transition cursor-pointer"
          title="Aumentar Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleCenter}
          className="p-2 text-forest/70 hover:bg-forest/10 hover:text-forest rounded-lg transition cursor-pointer"
          title="Centralizar Visualização"
        >
          <Maximize className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(0.8)}
          className="p-2 text-forest/70 hover:bg-forest/10 hover:text-forest rounded-lg transition cursor-pointer"
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
