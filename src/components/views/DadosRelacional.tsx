import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import * as d3 from 'd3';
import { Layers, FolderKanban, CheckCircle2, Library, ZoomIn, ZoomOut, Maximize, RotateCcw, Filter, Activity, Network, Plus, X } from 'lucide-react';
import { formatNaipe } from '../../lib/icons';
import NewItemDialog from '../NewItemDialog';

const toArr = (v: any) => Array.isArray(v) ? v : (v ? [v] : []);

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  group: string;
  radius: number;
  color: string;
  data: any;
  archived: boolean;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

export default function DadosRelacional() {
  const { tasks, projects, areas, resources, addTask, addProject, addArea, addResource, editArea, editProject, editTask, editResource, archivedNodeIds } = useStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [newItemDialog, setNewItemDialog] = useState<{isOpen: boolean, cat: string, title: string}>({isOpen: false, cat: '', title: ''});
  const [showArchived, setShowArchived] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    areas: true, projects: true, tasks: true, resources: true
  });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // D3 Selection Refs
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);

  const effectivelyArchived = new Set(archivedNodeIds);
  // Calculate inherited archives
  for (let i = 0; i < 3; i++) {
    projects.forEach(p => {
      const parentArea = areas.find(a => a.name === p.area || a.id === p.area);
      if (parentArea && effectivelyArchived.has(parentArea.id)) effectivelyArchived.add(p.id);
    });
    tasks.forEach(t => {
      if (t.project) {
        const p = projects.find(p => p.title === t.project || p.id === t.project);
        if (p && effectivelyArchived.has(p.id)) effectivelyArchived.add(t.id);
      }
      if (t.area) {
        const a = areas.find(a => a.name === t.area || a.id === t.area);
        if (a && effectivelyArchived.has(a.id)) effectivelyArchived.add(t.id);
      }
    });
    resources.forEach(r => {
      toArr(r.task).forEach((taskName) => {
        const t = tasks.find(t => t.title === taskName || t.id === taskName);
        if (t && effectivelyArchived.has(t.id)) effectivelyArchived.add(r.id);
      });
      toArr(r.project).forEach((projectName) => {
        const p = projects.find(p => p.title === projectName || p.id === projectName);
        if (p && effectivelyArchived.has(p.id)) effectivelyArchived.add(r.id);
      });
      toArr(r.area).forEach((areaName) => {
        const a = areas.find(a => a.name === areaName || a.id === areaName);
        if (a && effectivelyArchived.has(a.id)) effectivelyArchived.add(r.id);
      });
    });
  }

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Setup Zoom
    const g = svg.append("g");
    gRef.current = g;

    // Engineering Axes
    g.append("line").attr("x1", -5000).attr("y1", 0).attr("x2", 5000).attr("y2", 0).attr("stroke", "rgba(255,255,255,0.05)").attr("stroke-width", 1).attr("stroke-dasharray", "4 4");
    g.append("line").attr("x1", 0).attr("y1", -5000).attr("x2", 0).attr("y2", 5000).attr("stroke", "rgba(255,255,255,0.05)").attr("stroke-width", 1).attr("stroke-dasharray", "4 4");
    g.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 4).attr("fill", "none").attr("stroke", "rgba(255,255,255,0.1)").attr("stroke-width", 1);
    
    // Add concentric circles for scale
    [100, 200, 300, 400, 500, 600].forEach(r => {
      g.append("circle").attr("cx", 0).attr("cy", 0).attr("r", r).attr("fill", "none").attr("stroke", "rgba(255,255,255,0.02)").attr("stroke-width", 1);
    });

    const defs = svg.append("defs");
    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "rgba(255,255,255,0.2)")
      .attr("d", "M0,-5L10,0L0,5");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    zoomRef.current = zoom;
    svg.call(zoom);

    // Initial transform to center
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.5));

    // Data Processing
    let nodesData: Node[] = [];
    let linksData: Link[] = [];

    const unlinkedProjects = projects.filter(p => !p.area);
    const hasUnlinked = unlinkedProjects.length > 0;

    let nodeIndex = 0;
    let areaIndex = 0;
    const areasCount = areas.length + (hasUnlinked ? 1 : 0);

    const addNode = (item: any, group: string, color: string, radius: number) => {
      const isArchived = effectivelyArchived.has(item.id);
      if (isArchived && !showArchived && item.id !== 'no-area') return;
      if (!activeFilters[group]) return;

      let initialX, initialY, fx, fy;

      if (group === 'areas') {
        const angle = (areaIndex / (areasCount || 1)) * Math.PI * 2;
        const dist = 550; // Larger fixed orbit for areas to give space
        fx = Math.cos(angle) * dist;
        fy = Math.sin(angle) * dist;
        initialX = fx;
        initialY = fy;
        areaIndex++;
      } else {
        const angle = nodeIndex * 2.39996; // golden angle approx
        const dist = Math.sqrt(nodeIndex + 1) * 35; // spiral out
        initialX = Math.cos(angle) * dist;
        initialY = Math.sin(angle) * dist;
      }

      nodesData.push({
        id: item.id,
        name: item.title || item.name || 'Sem nome',
        group,
        radius,
        color: isArchived ? '#94a3b8' : color, // slate-400 for archived
        data: item,
        archived: isArchived,
        x: initialX,
        y: initialY,
        fx,
        fy,
      });
      if (group !== 'areas') nodeIndex++;
    };

    areas.forEach(a => addNode(a, 'areas', '#D95319', 65));
    if (hasUnlinked && activeFilters['areas']) {
      addNode({ id: 'no-area', name: 'Projetos Avulsos' }, 'areas', '#A2142F', 65);
    }
    projects.forEach(p => addNode(p, 'projects', '#0072BD', 45));
    tasks.forEach(t => addNode(t, 'tasks', '#7E2F8E', 30));
    resources.forEach(r => addNode(r, 'resources', '#77AC30', 35));

    const nodeIds = new Set(nodesData.map(n => n.id));

    // Build Links
    const addLink = (source: string, targetIdOrName: string) => {
       if (!nodeIds.has(source)) return;
       // Find target by ID or Name across all categories
       const targetNode = nodesData.find(n => n.id === targetIdOrName || n.name === targetIdOrName);
       if (targetNode && nodeIds.has(targetNode.id)) {
          linksData.push({ source, target: targetNode.id });
       }
    };

    projects.forEach(p => {
      if (p.area) addLink(p.id, p.area);
      else if (hasUnlinked) addLink(p.id, 'no-area');
    });

    tasks.forEach(t => {
      if (t.project) addLink(t.id, t.project);
      else if (t.area) addLink(t.id, t.area);
    });

    resources.forEach(r => {
      toArr(r.task).forEach(t => addLink(r.id, t));
      toArr(r.project).forEach(p => addLink(r.id, p));
      toArr(r.area).forEach(a => addLink(r.id, a));
    });

    // Remove duplicate links
    const uniqueLinks = new Map<string, Link>();
    linksData.forEach(l => {
        const id1 = typeof l.source === 'string' ? l.source : (l.source as any).id;
        const id2 = typeof l.target === 'string' ? l.target : (l.target as any).id;
        const key = id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
        if (!uniqueLinks.has(key)) {
            uniqueLinks.set(key, l);
        }
    });
    linksData = Array.from(uniqueLinks.values());

    // Simulation Setup
    const simulation = d3.forceSimulation<Node, Link>(nodesData)
      .force("link", d3.forceLink<Node, Link>(linksData).id(d => d.id).distance(d => {
        if ((d.source as Node).group === 'areas' || (d.target as Node).group === 'areas') return 200;
        if ((d.source as Node).group === 'projects' || (d.target as Node).group === 'projects') return 120;
        return 80;
      }).strength(0.8))
      .force("charge", d3.forceManyBody().strength(-1500).distanceMax(1000))
      .force("collide", d3.forceCollide().radius(d => (d as Node).radius + 35).iterations(4))
      .force("x", d3.forceX().strength(0.02))
      .force("y", d3.forceY().strength(0.02));

    simulationRef.current = simulation;

    // Draw Links
    const link = g.append("g")
      .attr("stroke", "rgba(255,255,255,0.15)") // faint white
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1)
      .selectAll("line")
      .data(linksData)
      .join("line")
      .attr("marker-end", "url(#arrow)");

    // Draw Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodesData)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Node Circles
    node.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.group === 'areas' ? d.color : d3.rgb(d.color).darker(2.5).toString())
      .attr("stroke", d => d.color)
      .attr("stroke-width", d => d.group === 'areas' ? 0 : 1.5)
      .attr("opacity", d => d.archived ? 0.3 : (d.group === 'areas' ? 0.8 : 0.9))
      .style("cursor", "pointer")
      .style("transition", "all 0.2s ease")
      .on("mouseover", function(event, d) { 
        d3.select(this)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2)
          .attr("fill", (d as Node).group === 'areas' ? d3.rgb((d as Node).color).brighter(0.5).toString() : d3.rgb((d as Node).color).darker(1.5).toString()); 
      })
      .on("mouseout", function(event, d) { 
        d3.select(this)
          .attr("stroke", (d as Node).group === 'areas' ? null : (d as Node).color)
          .attr("stroke-width", (d as Node).group === 'areas' ? 0 : 1.5)
          .attr("fill", (d as Node).group === 'areas' ? (d as Node).color : d3.rgb((d as Node).color).darker(2.5).toString()); 
      });

    node.on("click", (event, d) => {
      event.stopPropagation();
      setSelectedNode(d as Node);
      if (svgRef.current && zoomRef.current && containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        let scale = 1.0;
        if (d.group === 'areas') scale = 0.8;
        else if (d.group === 'projects') scale = 1.0;
        else scale = 1.2;

        const transform = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-d.x!, -d.y!);

        d3.select(svgRef.current).transition().duration(750).call(zoomRef.current.transform, transform);
      }
      
      const connectedIds = new Set<string>();
      connectedIds.add(d.id);
      
      linksData.forEach(l => {
        const sid = (l.source as Node).id;
        const tid = (l.target as Node).id;
        if (sid === d.id) connectedIds.add(tid);
        if (tid === d.id) connectedIds.add(sid);
      });
      
      node.style("opacity", n => connectedIds.has((n as Node).id) ? 1 : 0.1);
      link.style("stroke-opacity", l => {
         const sid = (l.source as Node).id;
         const tid = (l.target as Node).id;
         return (sid === d.id || tid === d.id) ? 0.9 : 0.02;
      });
      link.style("stroke-width", l => {
         const sid = (l.source as Node).id;
         const tid = (l.target as Node).id;
         return (sid === d.id || tid === d.id) ? 2 : 1;
      });
      link.style("stroke", l => {
         const sid = (l.source as Node).id;
         const tid = (l.target as Node).id;
         return (sid === d.id || tid === d.id) ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)";
      });
    });

    svg.on("click", () => {
      setSelectedNode(null);
      node.style("opacity", 1);
      link.style("stroke-opacity", 0.6);
      link.style("stroke-width", 1);
      link.style("stroke", "rgba(255,255,255,0.1)");
    });

    // Labels
    const textGroup = node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("font-family", d => d.group === 'areas' ? "'Inter', sans-serif" : "'JetBrains Mono', monospace")
      .style("font-size", d => Math.max(9, d.radius * (d.group === 'areas' ? 0.28 : 0.24)) + "px")
      .style("font-weight", d => d.group === 'areas' ? "600" : "500")
      .style("fill", d => d.group === 'areas' ? "#ffffff" : "#f8fafc")
      .style("stroke", d => d.group === 'areas' ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.8)")
      .style("stroke-width", d => d.group === 'areas' ? "2px" : "3px")
      .style("paint-order", "stroke")
      .style("letter-spacing", "-0.02em")
      .style("pointer-events", "none")
      .attr("opacity", d => d.archived ? 0.6 : 1);

    textGroup.each(function(d) {
      const el = d3.select(this);
      const words = d.name.split(/\s+/);
      const lines = [];
      let currentLine = words[0];
      for (let i = 1; i < words.length; i++) {
        if (currentLine.length + words[i].length < (d.radius / 3.5)) {
           currentLine += " " + words[i];
        } else {
           lines.push(currentLine);
           currentLine = words[i];
        }
      }
      lines.push(currentLine);
      const maxLines = d.radius < 40 ? 2 : 3;
      const finalLines = lines.slice(0, maxLines);
      if (lines.length > maxLines) finalLines[maxLines - 1] += "...";

      const lineHeight = 1.1; // em
      const startY = -((finalLines.length - 1) * lineHeight) / 2;

      finalLines.forEach((line, i) => {
        el.append("tspan")
          .text(line)
          .attr("x", 0)
          .attr("dy", i === 0 ? `${startY}em` : `${lineHeight}em`);
      });
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [areas, projects, tasks, resources, showArchived, activeFilters, archivedNodeIds]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.2);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.8);
    }
  };

  const handleCenter = () => {
    if (svgRef.current && zoomRef.current && containerRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      d3.select(svgRef.current).transition().duration(750).call(
        zoomRef.current.transform, 
        d3.zoomIdentity.translate(width / 2, height / 2).scale(0.5)
      );
    }
  };

  const handleCreateNode = (cat: string) => {
    let titleStr = '';
    if (cat === 'areas') titleStr = 'Nova Área';
    else if (cat === 'projects') titleStr = 'Novo Projeto';
    else if (cat === 'tasks') titleStr = 'Nova Tarefa';
    else if (cat === 'resources') titleStr = 'Novo Recurso';
    setNewItemDialog({isOpen: true, cat, title: titleStr});
  };

  const onConfirmNewItem = (title: string) => {
    if (!title) return;
    const { cat } = newItemDialog;
    if (cat === 'areas') addArea(title);
    else if (cat === 'projects') addProject(title);
    else if (cat === 'tasks') addTask(title);
    else if (cat === 'resources') addResource(title);
  };

  const toggleFilter = (cat: string) => {
    setActiveFilters(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden relative">
      <div className="h-[72px] shrink-0 border-b border-white/10 bg-black flex items-center justify-between px-8 z-10">
        <div>
          <h2 className="text-[20px] font-bold text-white tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-400" />
            Grafos
          </h2>
          <p className="text-[13px] text-white/60 mt-0.5">Mapa de relacionamentos Më Life OS</p>
        </div>
        <div className="flex items-center gap-2">
           <label className="flex items-center gap-1.5 cursor-pointer text-[12px] font-bold text-white/70 hover:text-white mr-4">
             <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/30" />
             Mostrar Arquivados
           </label>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full bg-black" ref={containerRef}>
        <svg ref={svgRef} className="w-full h-full cursor-move relative z-0" />

        
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
                          className={`flex items-center gap-2 text-[12px] font-semibold transition-colors ${activeFilters[cat.id] ? 'text-white' : 'text-white/40'}`}
                        >
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeFilters[cat.id] ? cat.color : 'rgba(255,255,255,0.1)' }} />
                          {cat.label}
                        </button>
                        <button 
                          onClick={() => handleCreateNode(cat.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-white/50 transition-all"
                          title={`Novo ${cat.label}`}
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
      
      
      
      <NewItemDialog
        isOpen={newItemDialog.isOpen}
        onClose={() => setNewItemDialog({isOpen: false, cat: '', title: ''})}
        onConfirm={onConfirmNewItem}
        title={newItemDialog.title}
      />
    </div>
  );
}
