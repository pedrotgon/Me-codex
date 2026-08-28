import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Layers, 
  FolderKanban, 
  CheckCircle2, 
  Library, 
  Archive, 
  FileText, 
  FileCode2, 
  Link2, 
  Trash2
} from 'lucide-react';
import { useStore } from '../../store';
import { KiNode, NodeType } from '../../lib/db';

const TYPE_CONFIG: Record<NodeType, { label: string; color: string; bg: string }> = {
  area: { label: 'Área', color: 'text-emerald-900', bg: 'bg-emerald-100' },
  project: { label: 'Projeto', color: 'text-blue-900', bg: 'bg-blue-100' },
  task: { label: 'Tarefa', color: 'text-purple-900', bg: 'bg-purple-100' },
  resource: { label: 'Recurso', color: 'text-green-900', bg: 'bg-green-100' },
  archive: { label: 'Arquivado', color: 'text-slate-900', bg: 'bg-slate-200' },
  markdown: { label: 'Markdown', color: 'text-cyan-900', bg: 'bg-cyan-100' },
  source: { label: 'Arquivo', color: 'text-rose-900', bg: 'bg-rose-100' },
};

export default function MemoriaNos() {
  const { nodes = [], relations = [], deleteNodes } = useStore();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const degreeMap = useMemo(() => {
    const map = new Map<string, number>();
    (relations || []).forEach(r => {
      if (r.sourceId) map.set(r.sourceId, (map.get(r.sourceId) || 0) + 1);
      if (r.targetId) map.set(r.targetId, (map.get(r.targetId) || 0) + 1);
    });
    return map;
  }, [relations]);

  const filteredNodes = useMemo(() => {
    return (nodes || []).filter(n => {
      if (!n) return false;
      if (selectedType !== 'all' && n.type !== selectedType) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = (n.title || '').toLowerCase().includes(query);
        const matchesId = (n.id || '').toLowerCase().includes(query);
        const matchesType = (n.type || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesId && !matchesType) return false;
      }
      return true;
    });
  }, [nodes, search, selectedType]);

  return (
    <div className="flex flex-col gap-4 w-full h-[calc(100vh-140px)] min-h-[600px] bg-white rounded-2xl border border-forest/10 shadow-xs overflow-hidden">
      {/* Header com Busca & Filtro de Tipos */}
      <div className="p-4 border-b border-forest/10 flex flex-wrap items-center justify-between gap-3 bg-forest/3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-forest/50" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por título, ID ou metadados..."
              className="h-9 w-72 pl-8 pr-3 rounded-xl bg-white border border-forest/15 text-[12px] font-medium text-ink placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-2xs"
            />
          </div>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="h-9 rounded-xl bg-white border border-forest/15 px-3 text-[12px] font-bold text-ink focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-2xs"
          >
            <option value="all">Todos os Tipos ({nodes.length})</option>
            <option value="area">Áreas</option>
            <option value="project">Projetos</option>
            <option value="task">Tarefas</option>
            <option value="resource">Recursos</option>
            <option value="archive">Arquivados</option>
            <option value="markdown">Markdown Twins</option>
            <option value="source">Arquivos Originais</option>
          </select>
        </div>

        <span className="text-[12px] font-bold text-ink/60">
          Exibindo {filteredNodes.length} de {nodes.length} nós registrados
        </span>
      </div>

      {/* Tabela de Nós */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead className="sticky top-0 bg-nude/80 backdrop-blur-md z-10 border-b border-forest/10 text-[10px] font-bold text-ink/50 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Título / Nome</th>
              <th className="py-3 px-4">Conexões</th>
              <th className="py-3 px-4">Status / Metadados</th>
              <th className="py-3 px-4">Criado em</th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/5 font-medium text-ink">
            {filteredNodes.map(node => {
              const cfg = TYPE_CONFIG[node.type] || { label: node.type || 'Item', color: 'text-ink', bg: 'bg-forest/10' };
              const degree = degreeMap.get(node.id) || 0;
              return (
                <tr key={node.id} className="hover:bg-forest/3 transition">
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[10px] text-ink/40">
                    {node.id}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-ink max-w-[280px] truncate">
                    {node.title || 'Sem título'}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-forest text-[11px] bg-forest/5 px-2 py-0.5 rounded-full">
                      <Link2 className="w-3 h-3" />
                      {degree} {degree === 1 ? 'conexão' : 'conexões'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-ink/60 truncate max-w-[240px]">
                    {node.metadata?.summary || node.metadata?.area || node.metadata?.status || '-'}
                  </td>
                  <td className="py-2.5 px-4 text-ink/40 font-mono text-[10px]">
                    {node.createdAt ? new Date(node.createdAt).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => deleteNodes([node.id])}
                      className="p-1.5 rounded-lg text-red-600/70 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                      title="Excluir nó permanentemente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredNodes.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-ink/40 font-medium">
                  Nenhum nó encontrado com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
