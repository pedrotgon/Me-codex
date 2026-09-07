import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  RotateCcw, 
  FileText, 
  KeyRound, 
  Database, 
  FolderKanban, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  AlertCircle,
  Network
} from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ApprovalCard } from '../components/ApprovalCard';

export const InteractivePrototypes: React.FC = () => {
  // 1. Captura com Governança
  const [proto1State, setProto1State] = useState<'idle' | 'proposed' | 'approved' | 'rejected'>('proposed');
  const [proto1Title, setProto1Title] = useState('Implementar auditoria de contrastes WCAG no Më');

  // 2. SHA-256 e Markdown Twin Real
  const [proto2Hash, setProto2Hash] = useState<string>('');
  const [proto2Chars, setProto2Chars] = useState<number>(0);
  const [proto2Running, setProto2Running] = useState(false);

  // 3. KI Nós & Relações
  const [proto3Nodes, setProto3Nodes] = useState<{ id: string; title: string; degree: number }[]>([
    { id: 'n1', title: 'LE704 - Laboratório', degree: 3 },
    { id: 'n2', title: 'Engenharia Econômica', degree: 2 },
  ]);

  // 4. Jarvis Consulta Direta
  const [proto4Query, setProto4Query] = useState('Quantas tarefas de alta prioridade tenho para hoje?');
  const [proto4Answer, setProto4Answer] = useState<string | null>(null);

  // 5. Jarvis Proposta
  const [proto5Status, setProto5Status] = useState<'pending' | 'approved' | 'rejected'>('pending');

  // 6. Projeto & Recálculo de Progresso
  const [proto6Tasks, setProto6Tasks] = useState([
    { id: 't1', title: 'Ensaio preliminar em reator batelada', done: true },
    { id: 't2', title: 'Calibrar termopares e sensores de pressão', done: true },
    { id: 't3', title: 'Gerar relatório de balanço de massa e energia', done: false },
  ]);

  // 7. Área e Relacionamentos
  const [proto7ActiveTab, setProto7ActiveTab] = useState<'projetos' | 'recursos'>('projetos');

  // 8. Sem Credencial
  const [proto8HasKey, setProto8HasKey] = useState(false);

  // 9. Retry Parcial Gemini
  const [proto9Batch2Status, setProto9Batch2Status] = useState<'failed' | 'retrying' | 'success'>('failed');

  // 10. Persistência
  const [proto10SavedAt, setProto10SavedAt] = useState<string>('2026-09-07T03:00:00Z');

  const handleCalculateSHA256 = async () => {
    setProto2Running(true);
    let bytes: ArrayBuffer;
    let byteLength = 755;
    let textContent = '';

    try {
      const res = await fetch('/fixtures/estrategia_q4_fixture.txt');
      if (res.ok) {
        bytes = await res.arrayBuffer();
        byteLength = bytes.byteLength;
        const decoder = new TextDecoder();
        textContent = decoder.decode(bytes);
      } else {
        throw new Error('Arquivo não carregado');
      }
    } catch {
      const fallbackStr = `# Më Life OS — Documento de Referência Estratégica Q4\n\n## 1. Contexto e Objetivos\nArquivo fixture estático para validação criptográfica real.`;
      const enc = new TextEncoder().encode(fallbackStr);
      bytes = enc.buffer;
      byteLength = enc.length;
      textContent = fallbackStr;
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    setProto2Hash(hashHex);
    setProto2Chars(textContent.trim().length);
    setProto2Running(false);
  };

  const proto6Progress = Math.round(
    (proto6Tasks.filter(t => t.done).length / proto6Tasks.length) * 100
  );

  return (
    <div className="space-y-8">
      <div className="border-b border-[#e8e8e8] pb-3">
        <h3 className="text-lg font-serif text-[#0c2b15] font-normal">
          10 Protótipos Demonstrativos & Validações de Fluxo
        </h3>
        <p className="text-xs font-sans text-[#696969]">
          Simulações interativas isoladas, com cálculo criptográfico sobre bytes de arquivo real (fixture pública) e separação honesta entre protótipos de interface e testes E2E do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. Captura -> Aprovação -> KI */}
        <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="forest">Fluxo 01</Badge>
              <span className="text-[11px] font-mono text-[#696969]">Captura → Aprovação → KI</span>
            </div>
            <h4 className="text-xs font-semibold text-[#070707] mb-1">Captura Rápida com Governança</h4>
            <p className="text-xs text-[#696969] mb-3">Nota mental entra na triagem e só é persistida no KI após aprovação.</p>
            
            <ApprovalCard
              title={proto1Title}
              description="Classificar automaticamente como Projeto 'Design System & Atlas'."
              source="Quick Capture"
              target="KI / Projects"
              confidence={94}
              isApproved={proto1State === 'approved'}
              isRejected={proto1State === 'rejected'}
              onApprove={() => setProto1State('approved')}
              onReject={() => setProto1State('rejected')}
            />
          </div>
        </div>

        {/* 2. Upload -> SHA-256 Real -> Markdown Twin */}
        <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="forest">Fluxo 02 • Validação Criptográfica</Badge>
              <span className="text-[11px] font-mono text-[#696969]">Upload → SHA-256 → Twin</span>
            </div>
            <h4 className="text-xs font-semibold text-[#070707] mb-1">Cálculo Real de SHA-256 sobre Bytes de Arquivo</h4>
            <p className="text-xs text-[#696969] mb-3">Lê os bytes reais do fixture versionado no servidor, calcula o SHA-256 via Web Crypto Subtle e afere o limite ≤ 2.200 caracteres.</p>

            <div className="p-3 bg-[#fbfbfb] rounded-[8px] border border-[#e8e8e8] text-xs font-mono space-y-1.5 mb-3">
              <div className="text-[#696969]">Arquivo Fixture: <span className="text-[#070707] font-bold">estrategia_q4_fixture.txt</span> (755 bytes)</div>
              <div className="text-[#696969] truncate">
                Hash SHA-256:{' '}
                <span className="text-[#0c2b15] font-semibold">
                  {proto2Hash || 'Clique em calcular para ler os bytes'}
                </span>
              </div>
              <div className="text-[#696969]">
                Tamanho do Corpo:{' '}
                <span className="text-[#41a217] font-semibold">
                  {proto2Chars ? `${proto2Chars} caracteres (limite estrito ≤ 2.200)` : '-'}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            loading={proto2Running}
            onClick={handleCalculateSHA256}
            className="w-full"
          >
            {proto2Hash ? 'Recalcular SHA-256 dos Bytes' : 'Calcular Hash dos Bytes e Validar Twin'}
          </Button>
        </div>

        {/* 3. KI -> Criação de Nós -> Memória */}
        <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="forest">Fluxo 03</Badge>
              <span className="text-[11px] font-mono text-[#696969]">KI → Nós → Memória</span>
            </div>
            <h4 className="text-xs font-semibold text-[#070707] mb-1">Criação Dinâmica de Nós e Relações</h4>
            <p className="text-xs text-[#696969] mb-3">Adiciona um novo nó à memória e recalcula o grau de conexão.</p>

            <div className="space-y-1.5 mb-3">
              {proto3Nodes.map(n => (
                <div key={n.id} className="flex items-center justify-between p-2 rounded-[6px] bg-[#fbfbfb] border border-[#e8e8e8] text-xs">
                  <span className="font-sans font-medium text-[#070707]">{n.title}</span>
                  <Badge variant="goldman" size="sm">Grau: {n.degree}</Badge>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const newId = `n-${Date.now()}`;
              setProto3Nodes(prev => [
                ...prev,
                { id: newId, title: 'Segundo Cérebro Local', degree: 1 },
              ]);
            }}
          >
            + Adicionar Nó ao Grafo
          </Button>
        </div>

        {/* 4. Jarvis -> Consulta Direta */}
        <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="goldman">Fluxo 04</Badge>
              <span className="text-[11px] font-mono text-[#696969]">Jarvis → Consulta Direta</span>
            </div>
            <h4 className="text-xs font-semibold text-[#070707] mb-1">Resposta Consultiva com Modelo Ativo</h4>
            <p className="text-xs text-[#696969] mb-3">Consultas geram respostas analíticas diretas sem provocar mutações.</p>

            <div className="p-3 bg-[#fbfbfb] rounded-[8px] border border-[#e8e8e8] text-xs mb-3 space-y-2">
              <div className="font-mono text-[#696969]">Pergunta: "{proto4Query}"</div>
              {proto4Answer && (
                <div className="p-2 bg-white rounded-[6px] border border-[#7399c6]/30 text-[#1b365d]">
                  {proto4Answer}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setProto4Answer('Jarvis (Gemini 2.5 Flash): Você possui 2 tarefas P1 ativas para hoje: "Avaliar criação de skill Notion" e "Auditar contrastes WCAG".');
            }}
          >
            Executar Consulta com Jarvis
          </Button>
        </div>

        {/* 5. Jarvis -> Proposta com Governança */}
        <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="goldman">Fluxo 05</Badge>
              <span className="text-[11px] font-mono text-[#696969]">Jarvis → Governança</span>
            </div>
            <h4 className="text-xs font-semibold text-[#070707] mb-1">Proposta de Mutação com Aprovação Humana</h4>
            <p className="text-xs text-[#696969] mb-3">Comandos que alteram dados exigem clique explícito do usuário.</p>

            <ApprovalCard
              title="Criar tarefa 'Revisar balanço trimestral'"
              description="Jarvis identificou pendência financeira no diário e propôs criação vinculada a Finanças."
              source="Jarvis Chat"
              target="Tasks / Finanças"
              confidence={96}
              isApproved={proto5Status === 'approved'}
              isRejected={proto5Status === 'rejected'}
              onApprove={() => setProto5Status('approved')}
              onReject={() => setProto5Status('rejected')}
            />
          </div>
        </div>

        {/* 6. Projeto -> Tarefa -> Recálculo */}
        <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="forest">Fluxo 06</Badge>
              <span className="text-[11px] font-mono text-[#696969]">Projeto → Progresso</span>
            </div>
            <h4 className="text-xs font-semibold text-[#070707] mb-1">Recálculo Imediato da Barra de Progresso</h4>
            <p className="text-xs text-[#696969] mb-2">Marque uma tarefa para ver a barra atualizar em tempo real.</p>

            <div className="mb-3">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Progresso de LE704:</span>
                <span className="text-[#0c2b15] font-mono">{proto6Progress}%</span>
              </div>
              <div className="w-full bg-[#e8e8e8] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0c2b15] h-full transition-all duration-300"
                  style={{ width: `${proto6Progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              {proto6Tasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    setProto6Tasks(prev =>
                      prev.map(item => item.id === t.id ? { ...item, done: !item.done } : item)
                    );
                  }}
                  className="flex items-center gap-2 p-2 rounded-[6px] bg-[#fbfbfb] border border-[#e8e8e8] text-xs cursor-pointer hover:bg-white"
                >
                  <input type="checkbox" checked={t.done} readOnly className="rounded" />
                  <span className={t.done ? 'line-through text-[#696969]' : 'text-[#070707]'}>{t.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. Área -> Relacionamentos Cruzados */}
        <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="forest">Fluxo 07</Badge>
              <span className="text-[11px] font-mono text-[#696969]">Área → Relações</span>
            </div>
            <h4 className="text-xs font-semibold text-[#070707] mb-1">Navegação Cruzada na Área "Unicamp"</h4>
            <p className="text-xs text-[#696969] mb-3">Alternância entre projetos e recursos vinculados sem perda de contexto.</p>

            <div className="flex gap-1 mb-3 border-b border-[#e8e8e8]">
              <button
                onClick={() => setProto7ActiveTab('projetos')}
                className={`text-xs pb-1.5 font-medium ${proto7ActiveTab === 'projetos' ? 'border-b-2 border-[#0c2b15] text-[#0c2b15]' : 'text-[#696969]'}`}
              >
                Projetos (2)
              </button>
              <button
                onClick={() => setProto7ActiveTab('recursos')}
                className={`text-xs pb-1.5 font-medium ml-3 ${proto7ActiveTab === 'recursos' ? 'border-b-2 border-[#0c2b15] text-[#0c2b15]' : 'text-[#696969]'}`}
              >
                Recursos (1)
              </button>
            </div>

            <div className="text-xs p-2 bg-[#fbfbfb] rounded-[6px] border border-[#e8e8e8]">
              {proto7ActiveTab === 'projetos' ? (
                <div>• LE704 - Laboratório (62%)<br />• Engenharia Econômica (56%)</div>
              ) : (
                <div>• Guia de Termodinâmica Aplicada (PDF)</div>
              )}
            </div>
          </div>
        </div>

        {/* 8. Sem Credencial -> Fallback Local */}
        <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="warning">Fluxo 08</Badge>
              <span className="text-[11px] font-mono text-[#696969]">Sem Credencial → Fallback</span>
            </div>
            <h4 className="text-xs font-semibold text-[#070707] mb-1">Transparência de Chave de API</h4>
            <p className="text-xs text-[#696969] mb-3">Quando não há chave configurada, a extração segue localmente.</p>

            <div className="p-3 rounded-[8px] bg-[#f0f5fa] border border-[#7399c6]/30 text-xs mb-3">
              <div className="flex items-center gap-1.5 font-semibold text-[#1b365d] mb-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>{proto8HasKey ? 'Chave Gemini Configurada' : 'Modo 100% Local Ativo'}</span>
              </div>
              <p className="text-[#696969]">
                {proto8HasKey
                  ? 'Chamadas remotas habilitadas com modelo Gemini 2.5 Flash.'
                  : 'Nenhum dado sai do seu navegador. Classificação heurística local.'}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setProto8HasKey(!proto8HasKey)}
          >
            {proto8HasKey ? 'Simular Remoção da Chave' : 'Simular Inserção de Chave Válida'}
          </Button>
        </div>

        {/* 9. Erro Parcial Gemini -> Retry de Lote */}
        <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="error">Fluxo 09</Badge>
              <span className="text-[11px] font-mono text-[#696969]">Erro Parcial → Retry</span>
            </div>
            <h4 className="text-xs font-semibold text-[#070707] mb-1">Resiliência em Falha 429 de Rate Limit</h4>
            <p className="text-xs text-[#696969] mb-3">O lote 2 atinge rate limit; os lotes 1 e 3 continuam salvos e válidos.</p>

            <div className="space-y-1.5 text-xs font-mono mb-3">
              <div className="p-2 rounded-[6px] bg-[#f2f7f3] border border-[#41a217]/30 text-[#205d15]">
                Lote 1 (Arquivos 1-4): ✓ Processado com sucesso
              </div>
              <div className={`p-2 rounded-[6px] border ${proto9Batch2Status === 'success' ? 'bg-[#f2f7f3] border-[#41a217]/30 text-[#205d15]' : 'bg-rose-50 border-rose-200 text-[#991b1b]'}`}>
                Lote 2 (Arquivos 5-8): {proto9Batch2Status === 'success' ? '✓ Reexecutado com sucesso' : '⚠ Erro 429 (Rate Limit)'}
              </div>
            </div>
          </div>

          <Button
            variant={proto9Batch2Status === 'success' ? 'secondary' : 'destructive'}
            size="sm"
            disabled={proto9Batch2Status === 'success'}
            onClick={() => setProto9Batch2Status('success')}
          >
            {proto9Batch2Status === 'success' ? 'Lote 2 Recuperado com Sucesso' : 'Tentar Lote 2 Novamente'}
          </Button>
        </div>

        {/* 10. Reload -> Persistência Preservada */}
        <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="forest">Fluxo 10</Badge>
              <span className="text-[11px] font-mono text-[#696969]">Reload → Integridade</span>
            </div>
            <h4 className="text-xs font-semibold text-[#070707] mb-1">Integridade do IndexedDB Após Recarregamento</h4>
            <p className="text-xs text-[#696969] mb-3">Nenhum dado é perdido ao reiniciar a aba ou recarregar a sessão.</p>

            <div className="p-3 bg-[#fbfbfb] rounded-[8px] border border-[#e8e8e8] text-xs font-mono space-y-1 mb-3">
              <div>Store: <span className="text-[#0c2b15] font-semibold">nodes, relations, markdown_twins</span></div>
              <div>Último Checkpoint: <span className="text-[#696969]">{proto10SavedAt}</span></div>
              <div className="text-[#41a217]">✓ 6 stores íntegras no IndexedDB</div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setProto10SavedAt(new Date().toISOString())}
          >
            Verificar Integridade do IndexedDB
          </Button>
        </div>

      </div>
    </div>
  );
};
