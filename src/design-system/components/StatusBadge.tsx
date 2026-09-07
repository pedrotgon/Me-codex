import React from 'react';

export type StatusType = 
  | 'not-started' 
  | 'in-progress' 
  | 'done' 
  | 'arquivadas'
  | 'active'
  | 'completed'
  | 'on-hold';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (st: string) => {
    switch (st) {
      case 'done':
      case 'completed':
        return {
          label: 'Concluído',
          className: 'bg-[#41a217]/10 text-[#0c2b15] border-[#41a217]/30',
        };
      case 'in-progress':
      case 'active':
        return {
          label: 'Em Andamento',
          className: 'bg-[#7399c6]/15 text-[#1b365d] border-[#7399c6]/40',
        };
      case 'not-started':
        return {
          label: 'Não Iniciado',
          className: 'bg-[#f4f4f4] text-[#696969] border-[#e8e8e8]',
        };
      case 'arquivadas':
      case 'on-hold':
        return {
          label: 'Arquivado',
          className: 'bg-black/5 text-ink/40 border-black/10',
        };
      default:
        return {
          label: st,
          className: 'bg-[#f4f4f4] text-[#696969] border-[#e8e8e8]',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-mono font-medium border ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
};
