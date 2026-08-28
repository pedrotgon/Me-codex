import React, { useState, useMemo } from 'react';
import { 
  Link2, 
  Plus, 
  Trash2, 
  Check, 
  Search, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../store';
import { KiRelation, RelationType } from '../../lib/db';

const RELATION_LABELS: Record<RelationType, string> = {
  belongs_to: 'belongs_to (pertence a)',
  supports: 'supports (apoia / sustenta)',
  produces: 'produces (produz / gera)',
  depends_on: 'depends_on (depende de)',
  references: 'references (referencia)',
  task_for: 'task_for (tarefa para)',
  related_to: 'related_to (relacionado a)',
};

export default function MemoriaRelacoes() {
  const { nodes = [], relations = [], createRelation, approveRelation, deleteRelation } = useStore();
  
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAuthor, setFilterAuthor] = useState<string>('all');
  const [search, setSearch] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [relType, setRelType] = useState<RelationType>('supports');

  const nodeMap = useMemo(() => {
    return new Map((nodes || []).map(n => [n.id, n]));
  }, [nodes]);

  const filteredRelations = useMemo(() => {
    return (relations || []).filter(r => {
      if (!r) return false;
      if (filterType !== 'all' && r.type !== filterType) return false;
      if (filterAuthor !== 'all' && r.author !== filterAuthor) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const sNode = nodeMap.get(r.sourceId);
        const tNode = nodeMap.get(r.targetId);
        const matchSource = (sNode?.title || '').toLowerCase().includes(query) || (r.sourceId || '').toLowerCase().includes(query);
        const matchTarget = (tNode?.title || '').toLowerCase().includes(query) || (r.targetId || '').toLowerCase().includes(query);
        const matchType = (r.type || '').toLowerCase().includes(query);
        if (!matchSource && !matchTarget && !matchType) return false;
      }
      return true;
    });
  }, [relations, filterType, filterAuthor, search, nodeMap]);

  const handleCreate = async () => {
    if (!sourceId || !targetId || sourceId === targetId) {
      alert('Selecione origem e destino válidos e distintos.');
      return;
    }
    await createRelation(sourceId, targetId, relType, 'manual');
    setIsDialogOpen(false);
    setSourceId('');
    setTargetId('');
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[calc(100vh-140px)] min-h-[600px] bg-white rounded-2xl border border-forest/10 shadow-xs overflow-hidden">
      {/* Header & Filtros */}
      <div className="p-4 border-b border-forest/10 flex flex-wrap items-center justify-between gap-3 bg-forest/3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-forest/50" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar conexões por nome..."
              className="h-9 w-64 pl-8 pr-3 rounded-xl bg-white border border-forest/15 text-[12px] font-medium text-ink placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-2xs"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="h-9 rounded-xl bg-white border border-forest/15 px-3 text-[12px] font-bold text-ink focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-2xs"
          >
            <option value="all">Todos os Tipos de Relação</option>
            {Object.entries(RELATION_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            value={filterAuthor}
            onChange={e => setFilterAuthor(e.target.value)}
            className="h-9 rounded-xl bg-white border border-forest/15 px-3 text-[12px] font-bold text-ink focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-2xs"
          >
            <option value="all">Todas as Origens (Manual, IA, Sistema)</option>
            <option value="manual">Manual</option>
            <option value="ai">IA (Gemini)</option>
            <option value="system">Sistema</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest text-white text-[12px] font-bold shadow-sm hover:bg-forest/90 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nova Relação
        </button>
      </div>

      {/* Lista de Relações */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRelations.map(rel => {
            const sNode = nodeMap.get(rel.sourceId);
            const tNode = nodeMap.get(rel.targetId);

            return (
              <div
                key={rel.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition ${
                  rel.approved ? 'border-forest/15 bg-white shadow-2xs' : 'border-amber-300 bg-amber-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-forest/10 text-forest uppercase">
                      {rel.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      rel.author === 'ai' ? 'bg-purple-100 text-purple-800' : 'bg-forest/5 text-forest/70'
                    }`}>
                      {rel.author === 'ai' ? 'Sugestão IA' : rel.author}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-[12px]">
                    <span className="font-bold text-ink truncate flex-1" title={sNode?.title || rel.sourceId}>
                      {sNode?.title || rel.sourceId}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-forest/50 shrink-0" />
                    <span className="font-bold text-ink truncate flex-1" title={tNode?.title || rel.targetId}>
                      {tNode?.title || rel.targetId}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-forest/8 flex items-center justify-between">
                  {!rel.approved ? (
                    <button
                      type="button"
                      onClick={() => approveRelation(rel.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-forest text-white text-[11px] font-bold hover:bg-forest/90 transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Aprovar Relação
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Aprovada
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteRelation(rel.id)}
                    className="p-1 text-red-600/60 hover:text-red-700 rounded transition cursor-pointer"
                    title="Excluir relação"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredRelations.length === 0 && (
            <div className="col-span-full py-16 text-center text-ink/40 font-medium text-[13px]">
              Nenhuma relação encontrada com os filtros selecionados.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Criação de Relação */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border border-forest/15 shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-[16px] font-bold text-ink flex items-center gap-2">
              <Link2 className="w-4 h-4 text-forest" />
              Criar Nova Conexão na Memória
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Nó de Origem</label>
                <select
                  value={sourceId}
                  onChange={e => setSourceId(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-forest/15 bg-white px-2.5 text-[12px] font-medium text-ink"
                >
                  <option value="">Selecione a origem...</option>
                  {(nodes || []).map(n => (
                    <option key={n.id} value={n.id}>
                      [{n.type}] {n.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Tipo de Relação</label>
                <select
                  value={relType}
                  onChange={e => setRelType(e.target.value as RelationType)}
                  className="mt-1 h-9 w-full rounded-xl border border-forest/15 bg-white px-2.5 text-[12px] font-bold text-ink"
                >
                  {Object.entries(RELATION_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Nó de Destino</label>
                <select
                  value={targetId}
                  onChange={e => setTargetId(e.target.value)}
                  className="mt-1 h-9 w-full rounded-xl border border-forest/15 bg-white px-2.5 text-[12px] font-medium text-ink"
                >
                  <option value="">Selecione o destino...</option>
                  {(nodes || []).filter(n => n.id !== sourceId).map(n => (
                    <option key={n.id} value={n.id}>
                      [{n.type}] {n.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 rounded-xl text-[12px] font-bold text-ink/60 hover:bg-forest/5 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!sourceId || !targetId}
                className="px-4 py-2 rounded-xl bg-forest text-white text-[12px] font-bold disabled:opacity-40 shadow-sm cursor-pointer"
              >
                Criar Relação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
