import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'forest' | 'goldman' | 'success' | 'warning' | 'error' | 'neutral' | 'priority';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-mono font-medium rounded-[6px] border select-none';

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-none',
    md: 'text-[11px] px-2 py-0.5 leading-tight',
  };

  const variantClasses = {
    forest: 'bg-[#0c2b15]/10 text-[#0c2b15] border-[#0c2b15]/15',
    goldman: 'bg-[#7399c6]/15 text-[#1b365d] border-[#7399c6]/25',
    success: 'bg-[#41a217]/15 text-[#205d15] border-[#41a217]/25',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-[#f4f4f4] text-[#696969] border-[#e8e8e8]',
    priority: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
