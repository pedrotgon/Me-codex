import React, { useMemo, useState } from 'react';
import { 
  AlertCircle, 
  Link2, 
  Trash2, 
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../store';
import { RelationType } from '../../lib/db';

export default function MemoriaOrfaos() {
  const { nodes = [], relations = [], createRelation, deleteNodes } = useStore();
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState('');
  const [relType, setRelType] = useState<RelationType>('belongs_to');

  // Identificar nós com grau de conexão = 0
  const orphanNodes = useMemo(() => {
    const connectedIds = new Set<string>();
    (relations || []).forEach(r => {
      if (r && r.sourceId) connectedIds.add(r.sourceId);
      if (r && r.targetId) connectedIds.add(r.targetId);
    });

    return (nodes || []).filter(n => n && !connectedIds.has(n.id) && n.type !== 'area');
  }, [nodes, relations]);

  const candidateTargets = useMemo(() => {
    return (nodes || []).filter(n => n && (n.type === 'area' || n.type === 'project'));
  }, [nodes]);

  const handleConnect = async (orphanId: string) => {
    if (!targetId) return;
    await createRelation(orphanId, targetId, relType, 'manual');
    setConnectingNodeId(null);
    setTargetId('');
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[calc(100vh-140px)] min-h-[600px] bg-white rounded-2xl border border-forest/10 shadow-xs overflow-hidden">
      {/* Header Informativo */}
      <div className="p-4 border-b border-forest/10 flex items-center justify-between bg-forest/3">
        <div>
          <h3 className="text-[14px] font-bold text-ink flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Nós Órfãos ({orphanNodes.length})
          </h3>
          <p className="text-[11px] text-ink/60 mt-0.5">
            Itens que ainda não possuem conexões ativas com nenhuma Área, Projeto ou Recurso na Memória.
          </p>
        </div>
      </div>

      {/* Lista de Órfãos */}
      <div className="flex-1 overflow-auto p-4">
        {orphanNodes.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orphanNodes.map(node => (
              <div
                key={node.id}
                className="p-4 rounded-xl border border-forest/15 bg-white shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 uppercase">
                      {node.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteNodes([node.id])}
                      className="text-red-500/60 hover:text-red-700 p-1 cursor-pointer"
                      title="Excluir item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="mt-2 text-[13px] font-bold text-ink leading-snug">
                    {node.title || 'Sem título'}
                  </h4>

                  {node.metadata?.summary && (
                    <p className="mt-1 text-[11px] text-ink/60 line-clamp-2">
                      {node.metadata.summary}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-forest/10">
                  {connectingNodeId === node.id ? (
                    <div className="space-y-2">
                      <select
                        value={targetId}
                        onChange={e => setTargetId(e.target.value)}
                        className="w-full h-8 rounded-lg border border-forest/20 bg-white px-2 text-[11px] font-medium"
                      >
                        <option value="">Vincular a qual Área/Projeto?</option>
                        {candidateTargets.map(t => (
                          <option key={t.id} value={t.id}>
                            [{t.type}] {t.title}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleConnect(node.id)}
                          disabled={!targetId}
                          className="flex-1 py-1 rounded-lg bg-forest text-white text-[11px] font-bold disabled:opacity-40 cursor-pointer"
                        >
                          Conectar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConnectingNodeId(null)}
                          className="px-2 py-1 rounded-lg bg-white border border-forest/15 text-[11px] cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConnectingNodeId(node.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-forest/20 bg-forest/5 text-forest text-[11px] font-bold hover:bg-forest/10 transition cursor-pointer"
                    >
                      <Link2 className="w-3.5 h-3.5" /> Conectar ao PARA
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center text-ink/40">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-2" />
            <h4 className="text-[15px] font-bold text-ink">Nenhum nó órfão encontrado!</h4>
            <p className="text-[12px] text-ink/60 mt-1 max-w-sm">
              Todos os itens da sua base de conhecimento estão devidamente conectados e contextualizados no Më.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
