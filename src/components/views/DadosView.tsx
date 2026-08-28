import React, { useState } from 'react';
import { Database, LineChart, Table, BrainCircuit, KeyRound } from 'lucide-react';
import ViewHeader from '../ViewHeader';
import DadosAnalytics from './DadosAnalytics';
import DadosExplorador from './DadosExplorador';
import DadosCortex from './DadosCortex';
import DadosRegistros from './DadosRegistros';
import CredentialsView from './CredentialsView';

export default function DadosView() {
  const [activeTab, setActiveTab] = useState<'credentials' | 'analytics' | 'explorador' | 'cortex' | 'registros'>('analytics');

  return (
    <div className={`flex flex-col gap-6 w-full max-w-none h-full`}>
      <ViewHeader 
        title={
          activeTab === 'cortex' ? "Knowledge Intake (SSOT)" :
          activeTab === 'credentials' ? "Credenciais" :
          activeTab === 'registros' ? "Log Diário Automático" :
          activeTab === 'analytics' ? "Analytics e Desempenho" : 
          "Explorador de Dados (Raw)"
        } 
        description={
         activeTab === 'cortex' ? "Tabela unificada que engloba toda a base de conhecimento do Cérebro Mestre." :
         activeTab === 'credentials' ? "Configuração local das chaves usadas pelos modelos de IA do Më." :
         activeTab === 'registros' ? "Histórico inquebrável por dia e semanas, guardado e sumarizado em tempo real." :
         activeTab === 'analytics' ? "Métricas e KPIs, semelhante a um dashboard no estilo Power BI." :
         "Acesso granular e de alta densidade a todas as ramificações do Córtex."
        }
        icon={activeTab === 'cortex' ? BrainCircuit : activeTab === 'credentials' ? KeyRound : activeTab === 'explorador' ? Table : Database}
      />

      <div className="flex items-center gap-2 p-1 bg-white/50 border border-forest/10 rounded-[14px] self-start mb-2 overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('cortex')}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-[10px] transition-all whitespace-nowrap ${
            activeTab === 'cortex' ? 'bg-forest text-white shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-black/5'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          Knowledge Intake
        </button>
        <div className="w-px h-5 bg-forest/10 mx-1"></div>
        <button
          onClick={() => setActiveTab('credentials')}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-[10px] transition-all whitespace-nowrap ${
            activeTab === 'credentials' ? 'bg-forest text-white shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-black/5'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          Credenciais
        </button>
        <div className="w-px h-5 bg-forest/10 mx-1"></div>
        <button
          onClick={() => setActiveTab('registros')}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-[10px] transition-all whitespace-nowrap ${
            activeTab === 'registros' ? 'bg-forest text-white shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-black/5'
          }`}
        >
          <Database className="w-4 h-4" />
          Log Diário
        </button>
        <div className="w-px h-5 bg-forest/10 mx-1"></div>
        <button
          onClick={() => setActiveTab('explorador')}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-[10px] transition-all whitespace-nowrap ${
            activeTab === 'explorador' ? 'bg-forest text-white shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-black/5'
          }`}
        >
          <Table className="w-4 h-4" />
          Ramos (Explorador)
        </button>
        <div className="w-px h-5 bg-forest/10 mx-1"></div>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-[10px] transition-all whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-forest text-white shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-black/5'
          }`}
        >
          <LineChart className="w-4 h-4" />
          BI / Analytis
        </button>
      </div>

      <div className="w-full flex-1">
        {activeTab === 'cortex' && <DadosCortex />}
        {activeTab === 'credentials' && <CredentialsView />}
        {activeTab === 'registros' && <DadosRegistros />}
        {activeTab === 'analytics' && <DadosAnalytics />}
        {activeTab === 'explorador' && <DadosExplorador />}
      </div>
    </div>
  );
}
