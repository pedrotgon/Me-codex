import React, { useState } from 'react';
import { 
  Network, 
  Table, 
  Link2, 
  AlertCircle, 
  BrainCircuit, 
  Layers 
} from 'lucide-react';
import ViewHeader from '../ViewHeader';
import MemoriaMapa from './MemoriaMapa';
import MemoriaNos from './MemoriaNos';
import MemoriaRelacoes from './MemoriaRelacoes';
import MemoriaOrfaos from './MemoriaOrfaos';

export default function MemoriaView() {
  const [activeTab, setActiveTab] = useState<'mapa' | 'nos' | 'relacoes' | 'orfaos'>('mapa');

  return (
    <div className="flex flex-col gap-5 w-full h-full pb-10">
      <ViewHeader
        title="Memória"
        description="A camada viva que conecta todo o conhecimento do Knowledge Intake e do método PARA."
        icon={Network}
      />

      {/* Tabs Claras da Memória */}
      <div className="flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-md border border-forest/10 rounded-2xl self-start overflow-x-auto max-w-full shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('mapa')}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-xl transition ${
            activeTab === 'mapa'
              ? 'bg-forest text-white shadow-xs'
              : 'text-ink/60 hover:text-ink hover:bg-forest/5'
          }`}
        >
          <Network className="w-4 h-4" />
          Mapa Relacional
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('nos')}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-xl transition ${
            activeTab === 'nos'
              ? 'bg-forest text-white shadow-xs'
              : 'text-ink/60 hover:text-ink hover:bg-forest/5'
          }`}
        >
          <Table className="w-4 h-4" />
          Nós
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('relacoes')}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-xl transition ${
            activeTab === 'relacoes'
              ? 'bg-forest text-white shadow-xs'
              : 'text-ink/60 hover:text-ink hover:bg-forest/5'
          }`}
        >
          <Link2 className="w-4 h-4" />
          Relações
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orfaos')}
          className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-xl transition ${
            activeTab === 'orfaos'
              ? 'bg-forest text-white shadow-xs'
              : 'text-ink/60 hover:text-ink hover:bg-forest/5'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Órfãos
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="w-full flex-1">
        {activeTab === 'mapa' && <MemoriaMapa />}
        {activeTab === 'nos' && <MemoriaNos />}
        {activeTab === 'relacoes' && <MemoriaRelacoes />}
        {activeTab === 'orfaos' && <MemoriaOrfaos />}
      </div>
    </div>
  );
}
