import React from 'react';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  showLabel = false,
  className = '',
  size = 'md',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={`w-full flex items-center gap-2.5 ${className}`}>
      <div className={`flex-1 bg-[#e8e8e8] ${heightClass} rounded-full overflow-hidden`}>
        <div
          className="bg-[#0c2b15] h-full transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-xs text-[#0c2b15] font-semibold min-w-[36px] text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
};
