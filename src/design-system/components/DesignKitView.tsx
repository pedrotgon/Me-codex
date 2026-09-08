import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Sliders, 
  ExternalLink,
  Layers,
  Palette,
  Type,
  Maximize,
  ShieldCheck,
  FileCode2,
  Copy,
  Check
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { StatusBadge } from './StatusBadge';
import { MetricCard } from './MetricCard';
import { Progress } from './Progress';
import { Alert } from './Alert';
import { Input } from './Input';
import { ApprovalCard } from './ApprovalCard';
import { EmptyState, LoadingState, ErrorState } from './States';

export function DesignKitView() {
  const [activeSection, setActiveSection] = useState<'foundations' | 'components' | 'guidelines'>('foundations');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 animate-fade-in">
      {/* Cabeçalho do Design Kit */}
      <div className="border-b border-[#e8e8e8] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-[4px] bg-[#0c2b15] text-white text-[10px] font-mono uppercase font-semibold">
                Design System v2.0
              </span>
              <span className="text-xs text-[#696969] font-mono">BCG + Goldman Sachs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#0c2b15] font-normal tracking-tight">
              Design Kit do Më Life OS
            </h2>
            <p className="text-xs sm:text-sm text-[#696969] mt-1.5 leading-relaxed max-w-2xl">
              Biblioteca viva de foundations, tokens, componentes, estados e diretrizes corporativas de alta densidade e clareza analítica.
            </p>
          </div>

          {/* Sub-navegação interna do Kit */}
          <div className="flex items-center bg-[#f4f4f4] p-1 rounded-[8px] border border-[#e8e8e8] self-start sm:self-auto">
            <button
              onClick={() => setActiveSection('foundations')}
              className={`px-3 py-1.5 text-xs font-medium rounded-[6px] transition ${
                activeSection === 'foundations'
                  ? 'bg-white text-[#0c2b15] shadow-xs font-semibold'
                  : 'text-[#696969] hover:text-[#070707]'
              }`}
            >
              Foundations & Tokens
            </button>
            <button
              onClick={() => setActiveSection('components')}
              className={`px-3 py-1.5 text-xs font-medium rounded-[6px] transition ${
                activeSection === 'components'
                  ? 'bg-white text-[#0c2b15] shadow-xs font-semibold'
                  : 'text-[#696969] hover:text-[#070707]'
              }`}
            >
              Componentes & Estados
            </button>
            <button
              onClick={() => setActiveSection('guidelines')}
              className={`px-3 py-1.5 text-xs font-medium rounded-[6px] transition ${
                activeSection === 'guidelines'
                  ? 'bg-white text-[#0c2b15] shadow-xs font-semibold'
                  : 'text-[#696969] hover:text-[#070707]'
              }`}
            >
              Padrões & Uso
            </button>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: FOUNDATIONS & TOKENS */}
      {activeSection === 'foundations' && (
        <div className="space-y-10">
          {/* Paleta de Cores */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e8e8e8] pb-2">
              <Palette className="w-4 h-4 text-[#0c2b15]" />
              <h3 className="text-base font-serif text-[#0c2b15] font-semibold">Cores & Tokens Semânticos</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Forest Green (Principal) */}
              <div className="p-4 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-3">
                <span className="text-[11px] font-mono uppercase text-[#696969] font-bold">Forest Green (Primário)</span>
                <div className="space-y-2">
                  {[
                    { name: 'Forest Dark', hex: '#0c2b15', text: 'text-white', token: '--color-forest' },
                    { name: 'Forest Medium', hex: '#134423', text: 'text-white', token: '--color-forest-medium' },
                    { name: 'Forest Light', hex: '#41a217', text: 'text-white', token: '--color-forest-light' },
                    { name: 'Forest Surface', hex: '#eef6f0', text: 'text-[#0c2b15]', token: '--color-forest-surface' },
                  ].map(c => (
                    <div 
                      key={c.hex}
                      onClick={() => copyToClipboard(c.hex)}
                      className={`h-10 rounded-[6px] px-3 flex items-center justify-between cursor-pointer transition hover:opacity-90 ${c.text}`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className="text-xs font-medium">{c.name}</span>
                      <span className="text-[10px] font-mono">{copiedToken === c.hex ? 'Copiado!' : c.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neutros Corporativos */}
              <div className="p-4 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-3">
                <span className="text-[11px] font-mono uppercase text-[#696969] font-bold">Neutros Corporativos</span>
                <div className="space-y-2">
                  {[
                    { name: 'Text Primary', hex: '#070707', text: 'text-white', token: '--color-text-primary' },
                    { name: 'Text Muted', hex: '#696969', text: 'text-white', token: '--color-text-muted' },
                    { name: 'Border Subtle', hex: '#e8e8e8', text: 'text-[#070707]', token: '--color-border' },
                    { name: 'Canvas Background', hex: '#fbfbfb', text: 'text-[#070707]', token: '--color-canvas-bg' },
                  ].map(c => (
                    <div 
                      key={c.hex}
                      onClick={() => copyToClipboard(c.hex)}
                      className={`h-10 rounded-[6px] px-3 flex items-center justify-between cursor-pointer border border-[#e0e0e0] transition hover:opacity-90 ${c.text}`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className="text-xs font-medium">{c.name}</span>
                      <span className="text-[10px] font-mono">{copiedToken === c.hex ? 'Copiado!' : c.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goldman & Status */}
              <div className="p-4 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-3">
                <span className="text-[11px] font-mono uppercase text-[#696969] font-bold">Goldman & Status</span>
                <div className="space-y-2">
                  {[
                    { name: 'Slate Blue (Ação Secundária)', hex: '#7399c6', text: 'text-white', token: '--color-slate-blue' },
                    { name: 'Goldman Gold (Destaque)', hex: '#c5a059', text: 'text-white', token: '--color-goldman-gold' },
                    { name: 'Sucesso Executivo', hex: '#38a169', text: 'text-white', token: '--color-success' },
                    { name: 'Risco / Erro', hex: '#e53e3e', text: 'text-white', token: '--color-danger' },
                  ].map(c => (
                    <div 
                      key={c.hex}
                      onClick={() => copyToClipboard(c.hex)}
                      className={`h-10 rounded-[6px] px-3 flex items-center justify-between cursor-pointer transition hover:opacity-90 ${c.text}`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className="text-xs font-medium">{c.name}</span>
                      <span className="text-[10px] font-mono">{copiedToken === c.hex ? 'Copiado!' : c.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Tipografia */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e8e8e8] pb-2">
              <Type className="w-4 h-4 text-[#0c2b15]" />
              <h3 className="text-base font-serif text-[#0c2b15] font-semibold">Tipografia Hierárquica</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-2">
                <span className="text-[10px] font-mono text-[#696969] uppercase font-bold">Editorial Serif</span>
                <p className="font-serif text-2xl text-[#0c2b15]">Playfair Display</p>
                <p className="text-xs text-[#696969] leading-relaxed">
                  Usada em títulos de seções, cabeçalhos de jornadas e grandes métricas executivas.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#0c2b15]">
                  H1 (32px) • H2 (24px) • H3 (18px)
                </div>
              </div>

              <div className="p-4 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-2">
                <span className="text-[10px] font-mono text-[#696969] uppercase font-bold">Sans Corporativa</span>
                <p className="font-sans font-semibold text-2xl text-[#070707]">Inter</p>
                <p className="text-xs text-[#696969] leading-relaxed">
                  Tipografia primária de interface, formulários, botões, tabelas e fluxos operacionais.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#0c2b15]">
                  Body (14px) • Dense (13px) • Caption (11px)
                </div>
              </div>

              <div className="p-4 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-2">
                <span className="text-[10px] font-mono text-[#696969] uppercase font-bold">Monospace Analítica</span>
                <p className="font-mono text-2xl text-[#1b365d]">JetBrains Mono</p>
                <p className="text-xs text-[#696969] leading-relaxed">
                  Para códigos de tela (S01..S28), hashes SHA-256, timestamps e metadados de sistema.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#0c2b15]">
                  Code (12px) • Tag (10px) • Micro (9px)
                </div>
              </div>
            </div>
          </section>

          {/* Espaçamento, Raios e Sombras */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e8e8e8] pb-2">
              <Maximize className="w-4 h-4 text-[#0c2b15]" />
              <h3 className="text-base font-serif text-[#0c2b15] font-semibold">Espaçamento, Raios de Borda & Sombras</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Espaçamento */}
              <div className="p-4 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-3">
                <span className="text-[10px] font-mono text-[#696969] uppercase font-bold">Escala de Espaçamento</span>
                <div className="space-y-1.5 text-xs font-mono">
                  {[
                    { label: 'space-1 (4px)', width: '16px' },
                    { label: 'space-2 (8px)', width: '32px' },
                    { label: 'space-3 (12px)', width: '48px' },
                    { label: 'space-4 (16px)', width: '64px' },
                    { label: 'space-6 (24px)', width: '96px' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-[#696969]">{s.label}</span>
                      <div className="h-2 bg-[#0c2b15] rounded-[2px]" style={{ width: s.width }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Raios de Borda */}
              <div className="p-4 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-3">
                <span className="text-[10px] font-mono text-[#696969] uppercase font-bold">Raios de Borda</span>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 border border-[#e8e8e8] bg-[#fbfbfb] rounded-[4px]">
                    <span className="font-mono text-[10px]">4px (Pill/Tag)</span>
                  </div>
                  <div className="p-2 border border-[#e8e8e8] bg-[#fbfbfb] rounded-[6px]">
                    <span className="font-mono text-[10px]">6px (Input/Btn)</span>
                  </div>
                  <div className="p-2 border border-[#e8e8e8] bg-[#fbfbfb] rounded-[10px]">
                    <span className="font-mono text-[10px]">10px (Card)</span>
                  </div>
                  <div className="p-2 border border-[#e8e8e8] bg-[#fbfbfb] rounded-[14px]">
                    <span className="font-mono text-[10px]">14px (Frame)</span>
                  </div>
                </div>
              </div>

              {/* Sombras */}
              <div className="p-4 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-3">
                <span className="text-[10px] font-mono text-[#696969] uppercase font-bold">Sombras BCG</span>
                <div className="space-y-2">
                  <div className="p-2 bg-white rounded-[6px] border border-[#e8e8e8] shadow-2xs text-[11px] text-[#696969]">
                    shadow-2xs: cards em repouso
                  </div>
                  <div className="p-2 bg-white rounded-[6px] border border-[#e8e8e8] shadow-xs text-[11px] text-[#696969]">
                    shadow-xs: botões e elevações
                  </div>
                  <div className="p-2 bg-white rounded-[6px] border border-[#e8e8e8] shadow-md text-[11px] text-[#696969]">
                    shadow-md: modais e drawers
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* SEÇÃO 2: COMPONENTES & ESTADOS VIVOS */}
      {activeSection === 'components' && (
        <div className="space-y-10">
          {/* Botões */}
          <section className="p-5 bg-white rounded-[12px] border border-[#e8e8e8] shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#070707] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0c2b15]" />
              Botões (`Button`) & Variantes
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="md">Primary Button</Button>
              <Button variant="secondary" size="md">Secondary Button</Button>
              <Button variant="ghost" size="md">Ghost Button</Button>
              <Button variant="danger" size="md">Danger Button</Button>
              <Button variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>Com Ícone</Button>
              <Button variant="secondary" size="md" disabled>Desabilitado</Button>
            </div>
          </section>

          {/* Badges & Status */}
          <section className="p-5 bg-white rounded-[12px] border border-[#e8e8e8] shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#070707] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#41a217]" />
              Badges (`Badge` e `StatusBadge`)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="forest">Badge Forest</Badge>
              <Badge variant="goldman">Badge Goldman</Badge>
              <Badge variant="neutral">Badge Neutro</Badge>
              <StatusBadge status="active">Ativo</StatusBadge>
              <StatusBadge status="pending">Pendente</StatusBadge>
              <StatusBadge status="review">Em Revisão</StatusBadge>
              <StatusBadge status="archived">Arquivado</StatusBadge>
              <StatusBadge status="error">Erro</StatusBadge>
            </div>
          </section>

          {/* MetricCards & Progress */}
          <section className="p-5 bg-white rounded-[12px] border border-[#e8e8e8] shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#070707] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7399c6]" />
              Cards de Métricas (`MetricCard`) & Progresso (`Progress`)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard 
                title="Taxa de Conclusão" 
                value="84.2%" 
                change="+12.4%" 
                trend="up" 
                subtext="vs. semana anterior" 
              />
              <MetricCard 
                title="Tempo de Foco" 
                value="38h 15m" 
                change="+4.1%" 
                trend="up" 
                subtext="Meta de 40h/semana" 
              />
              <MetricCard 
                title="Tarefas Críticas" 
                value="3" 
                change="-2" 
                trend="down" 
                subtext="Itens pendentes" 
              />
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono text-[#696969]">
                <span>Progresso do Sprint Q4</span>
                <span>72% Concluído</span>
              </div>
              <Progress value={72} variant="forest" />
            </div>
          </section>

          {/* Alertas & Inputs */}
          <section className="p-5 bg-white rounded-[12px] border border-[#e8e8e8] shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#070707] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
              Alertas (`Alert`) & Entradas (`Input`)
            </h3>
            <div className="space-y-3">
              <Alert 
                variant="info" 
                title="Sincronização Ativa" 
                message="Todas as telas do Më Life OS estão mapeadas e disponíveis no Canvas de Telas." 
              />
              <Alert 
                variant="success" 
                title="Operação Aprovada" 
                message="As fixtures foram carregadas no store isolado com persistência íntegra." 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input 
                label="Campo de Busca Canônica" 
                placeholder="Ex: S06-projects ou Take Action..." 
                icon={<Search className="w-4 h-4 text-[#696969]" />}
              />
              <Input 
                label="Identificador do Registro" 
                value="LE704 - Laboratório de Engenharia" 
                readOnly
              />
            </div>
          </section>

          {/* Cards de Aprovação */}
          <section className="p-5 bg-white rounded-[12px] border border-[#e8e8e8] shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#070707] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e53e3e]" />
              Cards de Decisão & Confirmação (`ApprovalCard`)
            </h3>
            <div className="max-w-md">
              <ApprovalCard
                title="Aprovação de Alocação de Recursos Q4"
                description="Liberar verba executiva para 3 novos projetos de alta prioridade na jornada acadêmica e profissional."
                author="Pedro Gonçalves"
                timestamp="Hoje às 14:30"
                onApprove={() => alert('Aprovado no Design Kit!')}
                onReject={() => alert('Rejeitado no Design Kit!')}
              />
            </div>
          </section>

          {/* Estados do Sistema */}
          <section className="p-5 bg-white rounded-[12px] border border-[#e8e8e8] shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-[#070707] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#696969]" />
              Estados de Sistema (Vazio, Carregamento, Erro)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#fbfbfb] rounded-[8px] border border-[#e8e8e8]">
                <EmptyState 
                  title="Nenhum registro encontrado" 
                  description="Ajuste os filtros de jornada ou limpe a busca." 
                  actionLabel="Limpar Filtros"
                  onAction={() => {}}
                />
              </div>
              <div className="p-4 bg-[#fbfbfb] rounded-[8px] border border-[#e8e8e8]">
                <ErrorState 
                  title="Falha na conexão" 
                  message="Não foi possível consultar os dados locais." 
                  onRetry={() => {}}
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* SEÇÃO 3: PADRÕES & USO */}
      {activeSection === 'guidelines' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-3">
              <h3 className="text-sm font-semibold text-[#070707]">Diretrizes de Contraste BCG</h3>
              <p className="text-xs text-[#696969] leading-relaxed">
                Todo elemento de texto principal deve alcançar contraste mínimo de 7:1 (WCAG AAA). Textos secundários e bordas nunca utilizam opacidade decorativa excessiva ou gradientes difusos.
              </p>
              <ul className="text-xs text-[#070707] space-y-1.5 list-disc list-inside">
                <li>Textos principais em preto absoluto `#070707` sobre fundo `#ffffff` ou `#fbfbfb`.</li>
                <li>Verde corporativo `#0c2b15` com razão de contraste &gt; 12:1 sobre fundos claros.</li>
                <li>Zero gradientes puramente decorativos em áreas de dados analíticos.</li>
              </ul>
            </div>

            <div className="p-5 bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs space-y-3">
              <h3 className="text-sm font-semibold text-[#070707]">Tokens W3C DTCG Conectados</h3>
              <p className="text-xs text-[#696969] leading-relaxed">
                Tokens gerados em formato W3C DTCG prontos para exportação e sincronização contínua com CSS e ferramentas de design como Penpot.
              </p>
              <div className="p-3 bg-[#fbfbfb] rounded-[6px] border border-[#e8e8e8] font-mono text-[11px] text-[#0c2b15] space-y-1">
                <div>design-system/tokens.json</div>
                <div>design-system/tokens.css</div>
                <div className="text-[#696969]">docs/design-system/PENPOT-INTEGRATION.md</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
