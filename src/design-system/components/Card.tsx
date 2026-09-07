import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  hoverEffect = false,
  children,
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hoverEffect
    ? 'transition-all duration-150 hover:border-[#0c2b15]/30 hover:shadow-sm'
    : '';

  return (
    <div
      className={`bg-white rounded-[10px] border border-[#e8e8e8] shadow-xs text-[#070707] ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
}) => {
  return (
    <Card padding="md" className="flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#696969]">{label}</span>
        {icon && <span className="text-[#0c2b15]">{icon}</span>}
      </div>
      <div className="text-2xl lg:text-3xl font-serif text-[#0c2b15] font-normal leading-tight">
        {value}
      </div>
      {(subtext || trend) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f4f4f4] text-[11px] text-[#696969]">
          <span>{subtext}</span>
          {trend && <span className="font-mono text-[#41a217]">{trend}</span>}
        </div>
      )}
    </Card>
  );
};
