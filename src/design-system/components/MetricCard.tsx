import React from 'react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  trend,
  icon: Icon,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 bg-white rounded-[10px] border border-[#e8e8e8] shadow-2xs hover:border-[#0c2b15]/30 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-xs' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#696969]">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4 text-[#0c2b15]" />}
      </div>
      <div className="mt-2 text-2xl font-serif text-[#0c2b15] font-normal tracking-tight">
        {value}
      </div>
      {(subtext || trend) && (
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-mono font-medium ${
                trend.isPositive ? 'text-[#41a217]' : 'text-[#dc2626]'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-[#696969]">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
