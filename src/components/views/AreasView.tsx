import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import ViewHeader from '../ViewHeader';
import AreasGrid from '../AreasGrid';
import AreaDetailView from './AreaDetailView';
import { useStore } from '../../store';
import NewItemDialog from '../NewItemDialog';

export default function AreasView() {
  const { addArea, selectedAreaId, setSelectedAreaId, areas } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddArea = (name: string) => {
    if (name) {
      addArea(name, "📁");
    }
  };

  const selectedArea = areas.find(a => a.id === selectedAreaId) || null;

  if (selectedArea) {
    return <AreaDetailView area={selectedArea} onBack={() => setSelectedAreaId(null)} />;
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full animate-fade-in">
      <ViewHeader 
        title="Áreas da Vida" 
        description="Gerencie as áreas de responsabilidade que você deseja manter ao longo do tempo."
        icon={Layers}
        action={
          <button onClick={() => setIsDialogOpen(true)} className="h-9 px-4 rounded-xl bg-forest text-white text-[13px] font-bold hover:bg-forest/90 transition shadow-sm">
            + Nova Área
          </button>
        }
      />
      <AreasGrid />
      <NewItemDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onConfirm={handleAddArea} 
        title="Nova Área" 
      />
    </div>
  );
}
