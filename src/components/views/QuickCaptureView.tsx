import React from 'react';
import { Zap } from 'lucide-react';
import QuickCapture from '../QuickCapture';

export default function QuickCaptureView() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full mt-[10vh]">
      <div className="bg-white rounded-[32px] p-10 text-center border border-black/5 shadow-sm">
        <div className="w-16 h-16 rounded-[20px] bg-white border border-black/5 flex items-center justify-center mx-auto mb-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <Zap className="w-8 h-8 text-forest" />
        </div>
        <h2 className="text-[22px] font-bold text-ink mb-3">Descarregue sua mente</h2>
        <p className="text-[14px] text-ink/50 mb-10 max-w-lg mx-auto">
          Escreva tudo o que está na sua cabeça. O processo PARA irá se certificar de que tudo irá para os lugares corretos.
        </p>
        <div className="text-left w-full">
          <QuickCapture />
        </div>
      </div>
    </div>
  );
}
