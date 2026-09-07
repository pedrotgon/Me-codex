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
