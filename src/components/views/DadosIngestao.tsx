import React, { useRef, useState } from 'react';
import JSZip from 'jszip';
import { GoogleGenAI } from '@google/genai';
import { Check, CheckCircle2, Download, FileArchive, FileText, FolderUp, Loader2, Play, ShieldCheck, Sparkles, Upload } from 'lucide-react';
import { useStore } from '../../store';
import { getGeminiCredential } from '../../lib/credentials';

type Para = 'project' | 'area' | 'resource' | 'archive';
type SourceItem = { id: string; name: string; type: string; size: number; excerpt: string; modified: string };
type Proposal = SourceItem & { para: Para; title: string; parent: string; summary: string; tags: string[]; actions: string[]; confidence: number; markdown: string };

const textExtensions = new Set(['md', 'txt', 'csv', 'json', 'yaml', 'yml', 'xml', 'html', 'htm', 'sql', 'js', 'ts', 'tsx', 'jsx', 'py', 'doc']);
const paraLabel: Record<Para, string> = { project: 'Projeto', area: 'Área', resource: 'Recurso', archive: 'Arquivado' };
const intakeKey = 'me_knowledge_intake_v1';

function extension(name: string) { return name.split('.').pop()?.toLowerCase() || 'arquivo'; }
function humanSize(bytes: number) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }
function cleanJson(value: string) { return value.replace(/^```json\s*/i, '').replace(/```$/i, '').trim(); }
function limit(value: string, max = 2200) { return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`; }

function fallback(item: SourceItem): Proposal {
  const para: Para = item.name.toLowerCase().includes('contrato') ? 'archive' : item.name.toLowerCase().includes('projeto') ? 'project' : 'resource';
  const title = item.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  return { ...item, para, title, parent: '', summary: 'Proposta gerada localmente. Conecte a chave Gemini para classificação semântica.', tags: [], actions: [], confidence: 35, markdown: '' };
}

function buildMarkdown(item: Proposal, sourcePath: string) {
  const metadata = [
    `id: ${item.id}`,
    `title: ${item.title}`,
    `original_file: ${item.name}`,
    `source_path: ${sourcePath || 'não informado'}`,
    `type: ${item.type}`,
    `modified: ${item.modified}`,
    `para: ${item.para}`,
    `parent: ${item.parent || 'sem vínculo'}`,
    `tags: [${item.tags.map(tag => JSON.stringify(tag)).join(', ')}]`,
  ].join('\n');
  const body = [`# ${item.title}`, '', item.summary, item.actions.length ? `## Próximas ações\n${item.actions.map(action => `- [ ] ${action}`).join('\n')}` : ''].filter(Boolean).join('\n\n');
  return limit(`---\n${metadata}\n---\n\n${body}`);
}

export default function DadosIngestao() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addBatchItems } = useStore();
  const [items, setItems] = useState<SourceItem[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [sourcePath, setSourcePath] = useState('');
  const [state, setState] = useState<'idle' | 'reading' | 'analyzing' | 'ready' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('Selecione arquivos ou um ZIP. Nada é movido nem enviado antes da análise.');

  const readFile = async (file: File): Promise<SourceItem[]> => {
    if (extension(file.name) !== 'zip') {
      const canRead = textExtensions.has(extension(file.name));
      return [{ id: crypto.randomUUID(), name: file.name, type: file.type || extension(file.name).toUpperCase(), size: file.size, excerpt: canRead ? limit(await file.text(), 8000) : '', modified: new Date(file.lastModified).toISOString().slice(0, 10) }];
    }
    const zip = await JSZip.loadAsync(file);
    const entries = Object.values(zip.files).filter(entry => !entry.dir).slice(0, 50);
    return Promise.all(entries.map(async entry => {
      const content = textExtensions.has(extension(entry.name)) ? limit(await entry.async('text'), 8000) : '';
      return { id: crypto.randomUUID(), name: entry.name, type: extension(entry.name).toUpperCase(), size: 0, excerpt: content, modified: new Date().toISOString().slice(0, 10) };
    }));
  };

  const onFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setState('reading'); setMessage('Lendo os arquivos selecionados…');
    try {
      const batches = await Promise.all(files.slice(0, 20).map(readFile));
      const next = batches.flat();
      setItems(next); setProposals([]); setState('idle');
      setMessage(`${next.length} item(ns) pronto(s). Clique em “Analisar com Gemini”.`);
    } catch {
      setState('error'); setMessage('Não foi possível abrir um dos arquivos. Tente um ZIP ou arquivos menores.');
    }
  };

  const analyze = async () => {
    if (!items.length) return;
    const credential = getGeminiCredential();
    if (!credential.apiKey) { setState('error'); setMessage('Salve e teste a chave Gemini em Dados → Credenciais antes de analisar.'); return; }
    setState('analyzing'); setMessage('Lendo o conteúdo e preparando a proposta PARA…');
    const compact = items.map(item => ({ id: item.id, name: item.name, type: item.type, excerpt: limit(item.excerpt, 500) }));
    const prompt = `Você organiza um segundo cérebro pelo método PARA. Classifique cada item em project, area, resource ou archive. Retorne SOMENTE JSON válido: {"items":[{"id":"","para":"project|area|resource|archive","title":"","parent":"","summary":"até 300 caracteres","tags":[""],"actions":[""],"confidence":0}]}. Não invente fatos. Itens: ${JSON.stringify(compact)}`;
    try {
      const ai = new GoogleGenAI({ apiKey: credential.apiKey });
      const result = await ai.models.generateContent({ model: credential.model, contents: prompt, config: { temperature: 0.2, maxOutputTokens: 3000, responseMimeType: 'application/json' } });
      const parsed = JSON.parse(cleanJson(result.text || '{}')) as { items?: Array<Partial<Proposal>> };
      const byId = new Map((parsed.items || []).map(item => [item.id, item]));
      const next = items.map(item => {
        const aiItem = byId.get(item.id);
        const base = aiItem?.para && ['project', 'area', 'resource', 'archive'].includes(aiItem.para) ? { ...fallback(item), ...aiItem, para: aiItem.para as Para } : fallback(item);
        return { ...base, tags: Array.isArray(base.tags) ? base.tags.slice(0, 8) : [], actions: Array.isArray(base.actions) ? base.actions.slice(0, 5) : [], confidence: Number(base.confidence) || 0, markdown: '' } as Proposal;
      }).map(item => ({ ...item, markdown: buildMarkdown(item, sourcePath) }));
      setProposals(next); setState('ready'); setMessage('Proposta pronta. Revise antes de integrar ao Knowledge Intake.');
    } catch (error) {
      setState('error'); setMessage(`A análise falhou: ${String(error).includes('429') ? 'cota Gemini atingida.' : 'verifique a chave e tente novamente.'}`);
    }
  };

  const updateProposal = (id: string, patch: Partial<Proposal>) => setProposals(current => current.map(item => {
    const next = { ...item, ...patch } as Proposal;
    return { ...next, markdown: buildMarkdown(next, sourcePath) };
  }));

  const integrate = () => {
    const saved = JSON.parse(localStorage.getItem(intakeKey) || '[]');
    localStorage.setItem(intakeKey, JSON.stringify([...saved, ...proposals.map(({ markdown, ...item }) => ({ ...item, markdown, createdAt: new Date().toISOString() }))]));
    addBatchItems?.({
      areas: proposals.filter(item => item.para === 'area').map(item => ({ name: item.title, icon: '◌' })),
      projects: proposals.filter(item => item.para === 'project').map(item => ({ title: item.title, desc: item.summary, area: item.parent || 'Inbox', status: 'active' as const })),
      resources: proposals.filter(item => item.para === 'resource' || item.para === 'archive').map(item => ({ title: item.title, area: item.parent || (item.para === 'archive' ? 'Arquivados' : 'Inbox') })),
      tasks: proposals.flatMap(item => item.actions.map(title => ({ title, area: item.parent || 'Inbox', project: item.para === 'project' ? item.title : undefined, priority: 'P 2', battleTokens: '0', status: 'not-started' as const }))),
    });
    setState('saved'); setMessage('Aprovado: registros e MDs foram adicionados ao Knowledge Intake deste navegador.');
  };

  const download = async () => {
    const zip = new JSZip();
    proposals.forEach(item => zip.file(`${item.title.replace(/[^a-z0-9-_ ]/gi, '').slice(0, 80) || item.id}.md`, item.markdown));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'para-organizer-md.zip'; link.click(); URL.revokeObjectURL(url);
  };

  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 pb-10">
    <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-forest" /><h2 className="text-[18px] font-bold text-ink">Ingestão PARA</h2></div><p className="mt-1 text-[13px] text-ink/60">Arquivo ou ZIP → Gemini → proposta revisável → Markdown + Knowledge Intake.</p></div><span className="flex items-center gap-2 rounded-xl bg-forest/5 px-3 py-2 text-[11px] font-bold text-forest"><ShieldCheck className="h-4 w-4" /> Aprovação obrigatória</span></div>
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_280px]"><button onClick={() => inputRef.current?.click()} className="flex min-h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-forest/20 bg-forest/3 p-5 text-center transition hover:border-forest/45 hover:bg-forest/5"><FolderUp className="h-8 w-8 text-forest" /><span className="mt-2 text-[14px] font-bold text-ink">Selecionar arquivos ou ZIP</span><span className="mt-1 text-[11px] text-ink/50">ZIP, Markdown, texto, CSV, JSON e outros arquivos</span></button><div className="rounded-2xl border border-forest/10 p-4"><label className="text-[12px] font-bold text-ink/70">Caminho original (opcional)</label><input value={sourcePath} onChange={event => setSourcePath(event.target.value)} placeholder="/Users/Pedro/..." className="mt-2 h-10 w-full rounded-xl border border-forest/15 px-3 text-[12px] outline-none focus:border-forest/40" /><p className="mt-2 text-[11px] text-ink/45">O navegador não consegue descobrir esse caminho sozinho.</p></div></div>
      <input ref={inputRef} onChange={onFiles} type="file" multiple className="hidden" accept=".zip,.md,.txt,.csv,.json,.sql,.pdf,.doc,.docx,.xlsx,.mp3,.m4a" />
      <div className="mt-4 flex flex-wrap items-center gap-3"><button onClick={analyze} disabled={!items.length || state === 'reading' || state === 'analyzing'} className="flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-[12px] font-bold text-white disabled:opacity-40">{state === 'analyzing' || state === 'reading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white" />} Analisar com Gemini</button><p className={`text-[12px] font-medium ${state === 'error' ? 'text-red-700' : 'text-ink/55'}`}>{message}</p></div>
    </div>
    {!!items.length && <div className="rounded-2xl border border-forest/10 bg-white p-5"><h3 className="text-[14px] font-bold text-ink">Entrada ({items.length})</h3><div className="mt-3 grid gap-2 md:grid-cols-2">{items.map(item => <div key={item.id} className="flex items-center gap-3 rounded-xl bg-forest/4 p-3"><FileArchive className="h-4 w-4 text-forest" /><div className="min-w-0"><p className="truncate text-[12px] font-bold text-ink">{item.name}</p><p className="text-[10px] text-ink/50">{item.type} · {humanSize(item.size)}</p></div></div>)}</div></div>}
    {!!proposals.length && <div className="rounded-2xl border border-forest/10 bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-[14px] font-bold text-ink">Revisão antes de aprovar</h3><p className="text-[11px] text-ink/50">Cada MD tem no máximo 2.200 caracteres; metadados ficam fora desse limite.</p></div><div className="flex gap-2"><button onClick={download} className="flex items-center gap-2 rounded-xl border border-forest/15 px-3 py-2 text-[12px] font-bold text-forest"><Download className="h-4 w-4" /> Baixar MDs</button><button onClick={integrate} className="flex items-center gap-2 rounded-xl bg-forest px-3 py-2 text-[12px] font-bold text-white"><CheckCircle2 className="h-4 w-4" /> Aprovar e integrar</button></div></div><div className="mt-4 space-y-3">{proposals.map(item => <div key={item.id} className="rounded-xl border border-forest/10 p-4"><div className="grid gap-3 md:grid-cols-[1.2fr_.65fr_.8fr]"><div><label className="text-[10px] font-bold uppercase text-ink/45">Título</label><input value={item.title} onChange={event => updateProposal(item.id, { title: event.target.value })} className="mt-1 h-9 w-full rounded-lg border border-forest/15 px-2 text-[12px]" /></div><div><label className="text-[10px] font-bold uppercase text-ink/45">PARA</label><select value={item.para} onChange={event => updateProposal(item.id, { para: event.target.value as Para })} className="mt-1 h-9 w-full rounded-lg border border-forest/15 px-2 text-[12px]">{Object.entries(paraLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div><label className="text-[10px] font-bold uppercase text-ink/45">Pai</label><input value={item.parent} onChange={event => updateProposal(item.id, { parent: event.target.value })} className="mt-1 h-9 w-full rounded-lg border border-forest/15 px-2 text-[12px]" /></div></div><p className="mt-3 text-[12px] leading-relaxed text-ink/70">{item.summary}</p><div className="mt-2 flex items-center gap-2 text-[10px] text-ink/45"><FileText className="h-3.5 w-3.5" /> {item.name} · confiança {item.confidence}%</div></div>)}</div></div>}
    {state === 'saved' && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[13px] font-bold text-emerald-800"><Check className="mr-2 inline h-4 w-4" />Integração concluída neste navegador.</div>}
  </div>;
}
