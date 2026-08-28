import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface NewItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  placeholder?: string;
}

export default function NewItemDialog({ isOpen, onClose, onConfirm, title, placeholder }: NewItemDialogProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-4 py-3 border-b border-black/5 flex items-center justify-between">
          <h3 className="font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-md text-ink/50 hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <input
            ref={inputRef}
            type="text"
            className="w-full border border-black/10 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-forest/50 focus:ring-1 focus:ring-forest/50"
            placeholder={placeholder || 'Digite o nome...'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value.trim()) {
                onConfirm(value.trim());
                onClose();
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
          />
        </div>
        <div className="px-4 py-3 bg-black/5 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] font-bold text-ink/60 hover:text-ink">Cancelar</button>
          <button 
            onClick={() => {
              if (value.trim()) {
                onConfirm(value.trim());
                onClose();
              }
            }}
            disabled={!value.trim()}
            className="px-3 py-1.5 text-[12px] font-bold bg-forest text-white rounded-lg disabled:opacity-50 transition-opacity"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
