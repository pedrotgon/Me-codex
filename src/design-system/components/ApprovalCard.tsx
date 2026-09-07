import React from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { Button } from './Button';

export interface ApprovalCardProps {
  title: string;
  description: string;
  source?: string;
  target?: string;
  confidence?: number;
  onApprove: () => void;
  onReject: () => void;
  isApproved?: boolean;
  isRejected?: boolean;
  className?: string;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  title,
  description,
  source,
  target,
  confidence,
  onApprove,
  onReject,
  isApproved,
  isRejected,
  className = '',
}) => {
  return (
    <div className={`p-4 rounded-[10px] bg-[#fbfbfb] border border-[#e8e8e8] text-xs font-sans transition-all ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-[#1b365d]">
          <Sparkles className="w-3.5 h-3.5 text-[#7399c6]" />
          <span>Proposta da IA</span>
        </div>
        {confidence !== undefined && (
          <span className="text-[10px] font-mono text-[#696969] bg-white px-1.5 py-0.5 rounded-[4px] border border-[#e8e8e8]">
            Confiança: {confidence}%
          </span>
        )}
      </div>

      <div className="font-semibold text-[#070707] mb-1">{title}</div>
      <p className="text-[#696969] mb-3 leading-relaxed">{description}</p>

      {(source || target) && (
        <div className="flex items-center gap-2 p-2 mb-3 rounded-[6px] bg-white border border-[#e8e8e8] font-mono text-[11px] text-[#070707]">
          <span className="truncate">{source || 'Entrada'}</span>
          <span className="text-[#696969]">→</span>
          <span className="font-semibold text-[#0c2b15] truncate">{target || 'Destino'}</span>
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-[#e8e8e8]">
        {isApproved ? (
          <div className="w-full py-1.5 text-center font-semibold text-[#41a217] bg-[#41a217]/10 rounded-[8px] flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5" /> Aprovado e Integrado
          </div>
        ) : isRejected ? (
          <div className="w-full py-1.5 text-center font-semibold text-[#dc2626] bg-rose-50 rounded-[8px] flex items-center justify-center gap-1">
            <X className="w-3.5 h-3.5" /> Proposta Rejeitada
          </div>
        ) : (
          <>
            <Button
              variant="accent"
              size="sm"
              className="flex-1"
              icon={<Check className="w-3.5 h-3.5" />}
              onClick={onApprove}
            >
              Aprovar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              icon={<X className="w-3.5 h-3.5" />}
              onClick={onReject}
            >
              Rejeitar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
