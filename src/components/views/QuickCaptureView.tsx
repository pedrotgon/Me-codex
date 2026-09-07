import React from 'react';
import { Zap } from 'lucide-react';
import QuickCapture from '../QuickCapture';

export default function QuickCaptureView() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full mt-[6vh]">
      <div className="bg-white rounded-[14px] p-8 text-center border border-[#e8e8e8] shadow-2xs">
        <div className="w-12 h-12 rounded-[10px] bg-[#0c2b15] text-white flex items-center justify-center mx-auto mb-5 shadow-xs">
          <Zap className="w-6 h-6" />
        </div>
        <h2 className="text-[24px] font-serif font-normal text-[#0c2b15] mb-2 tracking-tight">Descarregue sua mente</h2>
        <p className="text-[13px] font-sans text-[#696969] mb-8 max-w-lg mx-auto leading-relaxed">
          Escreva tudo o que está na sua cabeça. O processo PARA irá se certificar de que tudo irá para os lugares corretos.
        </p>
        <div className="text-left w-full">
          <QuickCapture />
        </div>
      </div>
    </div>
  );
}
