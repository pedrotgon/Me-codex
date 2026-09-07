import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useStore } from '../store';
import { Button } from '../design-system/components';

export default function QuickCapture() {
  const [text, setText] = useState('');
  const { processJarvisCommand } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    processJarvisCommand(text);
    setText('');
  };

  return (
    <section className="bg-white rounded-[12px] p-6 mb-6 shrink-0 relative overflow-hidden border border-[#e8e8e8] shadow-2xs">
      <div className="flex items-center gap-3 mb-5 relative">
        <div className="w-9 h-9 rounded-[8px] bg-[#0c2b15] text-white flex items-center justify-center shadow-xs">
          <Zap className="w-4 h-4" />
        </div>
        <h3 className="font-serif text-[18px] font-normal text-[#0c2b15]">Captura Rápida</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que está na sua mente? ( / para focar )" 
          className="w-full h-12 pl-4 pr-24 rounded-[8px] bg-[#fbfbfb] border border-[#e8e8e8] text-[14px] font-sans placeholder:text-[#696969]/60 focus:outline-none focus:ring-1 focus:ring-[#0c2b15] focus:border-[#0c2b15] focus:bg-white transition text-[#070707]" 
        />
        <div className="absolute right-1.5">
          <Button 
            type="submit"
            variant="primary"
            size="sm"
            disabled={!text.trim()}
          >
            Enviar
          </Button>
        </div>
      </form>
    </section>
  );
}
