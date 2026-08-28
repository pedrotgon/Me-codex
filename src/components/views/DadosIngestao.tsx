import React, { useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { 
  Check, 
  CheckCircle2, 
  Download, 
  FileCode2, 
  FileImage, 
  FileText, 
  Folder, 
  FolderUp, 
  Loader2, 
  Pencil, 
  Play, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  RotateCcw,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { useStore } from '../../store';
import { 
  ExtractedFileItem, 
  processSingleFile, 
  processZipFile, 
  formatBytes, 
  MAX_FILE_BYTES 
} from '../../lib/extractor';
import { 
  ParaCategory, 
  ParaProposalItem, 
  analyzeBatchWithGemini, 
  buildMarkdownTwin, 
  localFallbackProposal 
} from '../../lib/gemini';
import { getGeminiCredential } from '../../lib/credentials';

const PARA_LABELS: Record<ParaCategory, string> = {
  project: 'Projeto',
  area: 'Área',
  resource: 'Recurso',
  archive: 'Arquivado',
};

export default function DadosIngestao() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addBatchItems, addKiIngestionBatch } = useStore();

  const [items, setItems] = useState<ExtractedFileItem[]>([]);
  const [proposals, setProposals] = useState<ParaProposalItem[]>([]);
  const [sourcePath, setSourcePath] = useState('');
  const [ignoredCount, setIgnoredCount] = useState(0);
  const [folderNames, setFolderNames] = useState<Record<string, string>>({});
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState('');

  const [state, setState] = useState<'idle' | 'reading' | 'analyzing' | 'ready' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('Selecione arquivos ou um ZIP (limite 100 MB). Nada é enviado sem sua autorização.');

  const selectedItems = useMemo(() => items.filter(it => it.selected), [items]);

  const folders = useMemo(() => {
    return items.reduce<Record<string, ExtractedFileItem[]>>((groups, item) => {
      const parts = item.relativePath.replace(/\\/g, '/').split('/');
      const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : 'Arquivos na raiz';
      if (!groups[folder]) groups[folder] = [];
      groups[folder].push(item);
      return groups;
    }, {});
  }, [items]);

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(event.target.files || []) as File[];
    if (!fileList.length) return;

    const oversized = fileList.find(f => f.size > MAX_FILE_BYTES);
    if (oversized) {
      setState('error');
      setMessage(`"${oversized.name}" ultrapassa o limite máximo de 100 MB.`);
      return;
    }

    setState('reading');
    setMessage('Processando arquivos, extraindo conteúdo e calculando SHA-256...');

    try {
      const allExtracted: ExtractedFileItem[] = [];
      let totalIgnored = 0;

      for (const file of fileList) {
        if (file.name.toLowerCase().endsWith('.zip')) {
          const { items: zipItems, ignoredCount: zipIgnored } = await processZipFile(file);
          allExtracted.push(...zipItems);
          totalIgnored += zipIgnored;
        } else {
          const single = await processSingleFile(file);
          allExtracted.push(single);
        }
      }

      setItems(allExtracted);
      setIgnoredCount(totalIgnored);
      setFolderNames({});
      setEditingFolder(null);
      setProposals([]);
      setState('idle');
      setMessage(`${allExtracted.length} arquivo(s) preparado(s) localmente. Selecione os que deseja enviar para classificação.`);
    } catch (err: any) {
      console.error(err);
      setState('error');
      setMessage('Falha ao processar arquivos. Confirme que não estão corrompidos e têm até 100 MB.');
    }
  };

  const toggleItem = (id: string) => {
    setItems(current => current.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const setSelectionMode = (mode: 'all' | 'recommended' | 'document' | 'code' | 'none') => {
    setItems(current => current.map(item => {
      let isSel = false;
      if (mode === 'all') isSel = true;
      else if (mode === 'recommended') isSel = item.kind === 'document' || item.kind === 'code';
      else if (mode === 'none') isSel = false;
      else isSel = item.kind === mode;
      return { ...item, selected: isSel };
    }));
  };

  const analyzeWithGemini = async () => {
    if (!selectedItems.length) {
      setState('error');
      setMessage('Selecione pelo menos um arquivo para analisar.');
      return;
    }

    const credential = getGeminiCredential();
    if (!credential.apiKey) {
      setState('error');
      setMessage('Configure sua Gemini API Key em Dados → Credenciais antes de analisar.');
      return;
    }

    setState('analyzing');
    setMessage(`Analisando ${selectedItems.length} arquivo(s) com ${credential.model}...`);

    try {
      const { successful, failed } = await analyzeBatchWithGemini(selectedItems, (done, total) => {
        setProgressMsg(`Processados ${done} de ${total}...`);
      });

      const nextProposals = successful.map(prop => ({
        ...prop,
        markdown: buildMarkdownTwin(prop, sourcePath),
      }));

      setProposals(nextProposals);
      setState('ready');

      if (failed.length > 0) {
        setMessage(`Análise concluída com ${failed.length} fallback(s) locais devido a limitações de cota.`);
      } else {
        setMessage('Proposta gerada com sucesso! Revise antes de aprovar para o Knowledge Intake.');
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.message || String(err);
      // Fallback local se a API falhar completamente
      const localProps = selectedItems.map(it => {
        const prop = localFallbackProposal(it);
        return {
          ...prop,
          markdown: buildMarkdownTwin(prop, sourcePath),
        };
      });
      setProposals(localProps);
      setState('ready');
      setMessage(`Atenção: A chamada ao Gemini falhou (${errMsg.slice(0, 100)}). Proposta gerada via regras locais.`);
    }
  };

  const updateProposal = (id: string, patch: Partial<ParaProposalItem>) => {
    setProposals(current => current.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, ...patch };
      return {
        ...updated,
        markdown: buildMarkdownTwin(updated, sourcePath),
      };
    }));
  };

  const toggleProposalStatus = (id: string) => {
    setProposals(current => current.map(item => {
      if (item.id !== id) return item;
      const nextStatus = item.status === 'rejected' ? 'approved' : 'rejected';
      return { ...item, status: nextStatus };
    }));
  };

  const downloadMarkdownZip = async () => {
    const approvedProposals = proposals.filter(p => p.status !== 'rejected');
    if (!approvedProposals.length) {
      alert('Nenhum item aprovado para download.');
      return;
    }

    const zip = new JSZip();
    approvedProposals.forEach(item => {
      const cleanName = item.title.replace(/[^a-zA-Z0-9-_ ]/g, '').trim().slice(0, 80) || item.id;
      zip.file(`${cleanName}.md`, item.markdown);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'me-knowledge-twins.zip';
    link.click();
    URL.revokeObjectURL(url);
  };

  const integrateApprovedItems = async () => {
    const approvedProposals = proposals.filter(p => p.status !== 'rejected');
    if (!approvedProposals.length) {
      alert('Nenhum item marcado como aprovado.');
      return;
    }

    // Persistência no Knowledge Intake unificado
    if (addKiIngestionBatch) {
      await addKiIngestionBatch(approvedProposals, sourcePath);
    } else {
      // Fallback
      addBatchItems?.({
        areas: approvedProposals.filter(p => p.para === 'area').map(p => ({ name: p.title, icon: '📁' })),
        projects: approvedProposals.filter(p => p.para === 'project').map(p => ({
          title: p.title,
          desc: p.summary,
          area: p.parent || 'Inbox',
          status: 'active' as const,
        })),
        resources: approvedProposals.filter(p => p.para === 'resource' || p.para === 'archive').map(p => ({
          title: p.title,
          area: p.parent || (p.para === 'archive' ? 'Arquivados' : 'Inbox'),
        })),
        tasks: approvedProposals.flatMap(p => (p.actions || []).map(action => ({
          title: action,
          area: p.parent || 'Inbox',
          project: p.para === 'project' ? p.title : undefined,
          priority: 'P 2',
          battleTokens: '10',
          status: 'not-started' as const,
        }))),
      });
    }

    setState('saved');
    setMessage(`${approvedProposals.length} item(ns) integrado(s) com sucesso ao Knowledge Intake (persistido no IndexedDB).`);
  };

  const ItemIcon = ({ kind }: { kind: string }) => {
    if (kind === 'image') return <FileImage className="h-4 w-4 text-forest" />;
    if (kind === 'code') return <FileCode2 className="h-4 w-4 text-forest" />;
    if (kind === 'document') return <FileText className="h-4 w-4 text-forest" />;
    return <FileText className="h-4 w-4 text-forest/60" />;
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-12">
      {/* Bloco de Upload & Configurações de Raiz */}
      <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-forest" />
              <h2 className="text-[18px] font-bold text-ink">Ingestão PARA & Knowledge Intake</h2>
            </div>
            <p className="mt-1 text-[13px] text-ink/60">
              Upload local → limpeza de ruído → extração SHA-256 → Gemini com Structured Output → Proposta com Aprovação.
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-xl bg-forest/5 px-3 py-2 text-[11px] font-bold text-forest">
            <ShieldCheck className="h-4 w-4" /> Aprovação humana obrigatória
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_300px]">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-forest/20 bg-forest/3 p-5 text-center transition hover:border-forest/45 hover:bg-forest/5 cursor-pointer"
          >
            <FolderUp className="h-8 w-8 text-forest" />
            <span className="mt-2 text-[14px] font-bold text-ink">Selecionar arquivos ou arquivo ZIP</span>
            <span className="mt-1 text-[11px] text-ink/50">
              PDF, DOCX, XLSX, TXT, MD, CSV, JSON, Código e Imagens (máx. 100 MB).
            </span>
          </button>

          <div className="rounded-2xl border border-forest/10 p-4 bg-nude-light/30 flex flex-col justify-between">
            <div>
              <label className="text-[12px] font-bold text-ink/70" htmlFor="source-root-input">
                Caminho Raiz Original
              </label>
              <input
                id="source-root-input"
                value={sourcePath}
                onChange={e => setSourcePath(e.target.value)}
                placeholder="/Users/Pedro/Documents..."
                className="mt-2 h-10 w-full rounded-xl border border-forest/15 bg-white px-3 font-mono text-[11px] outline-none focus:border-forest/40 focus:ring-2 focus:ring-forest/10"
              />
            </div>
            <p className="mt-2 text-[11px] text-ink/50 leading-relaxed">
              Utilizado para preencher `path_mac` e `path_windows` no frontmatter do Markdown.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          onChange={handleFiles}
          type="file"
          multiple
          className="hidden"
          accept=".zip,.md,.txt,.csv,.json,.sql,.py,.ipynb,.pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
        />

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-forest/10 pt-4">
          <button
            type="button"
            onClick={analyzeWithGemini}
            disabled={!selectedItems.length || state === 'reading' || state === 'analyzing'}
            className="flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-[12px] font-bold text-white shadow-sm transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {state === 'analyzing' || state === 'reading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4 fill-white" />
            )}
            Analisar {selectedItems.length ? `(${selectedItems.length})` : ''} com Gemini
          </button>

          <p className={`text-[12px] font-medium ${state === 'error' ? 'text-red-700 font-bold' : 'text-ink/65'}`}>
            {progressMsg || message}
          </p>
        </div>
      </div>

      {/* Árvore de Arquivos Extraídos e Filtros */}
      {items.length > 0 && (
        <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest/10 pb-4">
            <div>
              <h3 className="text-[14px] font-bold text-ink">Árvore de Arquivos Identificados</h3>
              <p className="mt-0.5 text-[11px] text-ink/50">
                {selectedItems.length} de {items.length} selecionado(s)
                {ignoredCount > 0 ? ` · ${ignoredCount} arquivos de lixo técnico descartados` : ''}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectionMode('recommended')}
                className="rounded-lg border border-forest/15 px-3 py-1.5 text-[11px] font-bold text-forest hover:bg-forest/5"
              >
                Recomendados
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode('document')}
                className="rounded-lg border border-forest/15 px-3 py-1.5 text-[11px] font-bold text-forest hover:bg-forest/5"
              >
                Documentos
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode('code')}
                className="rounded-lg border border-forest/15 px-3 py-1.5 text-[11px] font-bold text-forest hover:bg-forest/5"
              >
                Códigos
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode('all')}
                className="rounded-lg border border-forest/15 px-3 py-1.5 text-[11px] font-bold text-forest hover:bg-forest/5"
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode('none')}
                className="px-2 text-[11px] font-bold text-ink/45 hover:text-forest"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {(Object.entries(folders) as [string, ExtractedFileItem[]][]).sort(([a], [b]) => a.localeCompare(b)).map(([folder, group]) => (
              <div key={folder} className="rounded-xl border border-forest/8 p-3 bg-forest/2">
                <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold text-forest">
                  <Folder className="h-4 w-4" />
                  {editingFolder === folder ? (
                    <input
                      autoFocus
                      value={folderNames[folder] ?? folder}
                      onChange={e => setFolderNames(curr => ({ ...curr, [folder]: e.target.value }))}
                      onBlur={() => setEditingFolder(null)}
                      onKeyDown={e => e.key === 'Enter' && setEditingFolder(null)}
                      className="h-6 w-72 rounded border border-forest/25 bg-white px-2 text-[11px] outline-none"
                    />
                  ) : (
                    <>
                      <span>{folderNames[folder] || folder}</span>
                      <button
                        type="button"
                        onClick={() => setEditingFolder(folder)}
                        className="rounded p-1 text-forest/55 hover:bg-forest/10 hover:text-forest"
                        title="Renomear exibição da pasta"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <span className="ml-auto text-[10px] text-ink/40 font-mono">({group.length} itens)</span>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map(item => (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition ${
                        item.selected
                          ? 'border-forest/25 bg-white shadow-xs'
                          : 'border-forest/8 bg-white/60 opacity-60'
                      }`}
                    >
                      <ItemIcon kind={item.kind} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-bold text-ink">{item.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-ink/45 font-mono">
                          <span>{item.type}</span>
                          <span>•</span>
                          <span>{formatBytes(item.size)}</span>
                          <span>•</span>
                          <span className="truncate" title={item.sha256}>
                            {item.sha256.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleItem(item.id)}
                        className="h-4 w-4 accent-forest rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Propostas de Classificação PARA & Revisão Humana */}
      {proposals.length > 0 && (
        <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest/10 pb-4">
            <div>
              <h3 className="text-[15px] font-bold text-ink">Revisão Humana e Propostas do Gemini</h3>
              <p className="mt-0.5 text-[11px] text-ink/50">
                Edite os metadados antes de aprovar. Cada representante Markdown gerado possui corpo ≤ 2.200 caracteres.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadMarkdownZip}
                className="flex items-center gap-2 rounded-xl border border-forest/15 bg-white px-3.5 py-2 text-[12px] font-bold text-forest transition hover:bg-forest/5"
              >
                <Download className="h-4 w-4" /> Baixar Markdown (.zip)
              </button>
              <button
                type="button"
                onClick={integrateApprovedItems}
                className="flex items-center gap-2 rounded-xl bg-forest px-4 py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-forest/90"
              >
                <CheckCircle2 className="h-4 w-4" /> Aprovar e Integrar ao KI
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {proposals.map(item => {
              const isApproved = item.status !== 'rejected';
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 transition ${
                    isApproved ? 'border-forest/15 bg-white' : 'border-red-200 bg-red-50/40 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid flex-1 gap-3 md:grid-cols-[1.4fr_.7fr_.9fr]">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-ink/45">Título</label>
                        <input
                          value={item.title}
                          onChange={e => updateProposal(item.id, { title: e.target.value })}
                          className="mt-1 h-9 w-full rounded-lg border border-forest/15 bg-white px-2.5 text-[12px] font-bold text-ink outline-none focus:border-forest/40"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-ink/45">Categoria PARA</label>
                        <select
                          value={item.para}
                          onChange={e => updateProposal(item.id, { para: e.target.value as ParaCategory })}
                          className="mt-1 h-9 w-full rounded-lg border border-forest/15 bg-white px-2 text-[12px] font-bold text-ink outline-none focus:border-forest/40"
                        >
                          {Object.entries(PARA_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-ink/45">Vínculo Pai (Área / Projeto)</label>
                        <input
                          value={item.parent}
                          onChange={e => updateProposal(item.id, { parent: e.target.value })}
                          placeholder="Inbox, Saúde, etc."
                          className="mt-1 h-9 w-full rounded-lg border border-forest/15 bg-white px-2.5 text-[12px] font-medium text-ink outline-none focus:border-forest/40"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleProposalStatus(item.id)}
                      className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-bold transition ${
                        isApproved
                          ? 'bg-forest/10 text-forest hover:bg-red-50 hover:text-red-700'
                          : 'bg-red-100 text-red-800 hover:bg-forest/10 hover:text-forest'
                      }`}
                    >
                      {isApproved ? 'Aprovado ✓' : 'Rejeitado ✗'}
                    </button>
                  </div>

                  <p className="mt-3 text-[12.5px] leading-relaxed text-ink/75 font-medium">
                    {item.summary}
                  </p>

                  {item.actions && item.actions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-forest uppercase">Ações:</span>
                      {item.actions.map((act, idx) => (
                        <span key={idx} className="rounded-md bg-forest/5 px-2 py-0.5 text-[11px] font-medium text-forest">
                          ☐ {act}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-forest/5 pt-2.5 text-[10px] text-ink/45 font-mono">
                    <span>{item.relativePath}</span>
                    <span>•</span>
                    <span>SHA-256: {item.sha256.slice(0, 10)}...</span>
                    <span>•</span>
                    <span>Confiança: {item.confidence}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {state === 'saved' && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[13px] font-bold text-emerald-800 flex items-center gap-2">
          <Check className="h-5 w-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
