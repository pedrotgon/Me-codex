import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7399c6] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 rounded-[6px] gap-1.5 h-8',
    md: 'text-xs px-3.5 py-2 rounded-[10px] gap-2 h-9',
    lg: 'text-sm px-4 py-2.5 rounded-[10px] gap-2 h-10',
  };

  const variantClasses = {
    primary: 'bg-[#0c2b15] text-white hover:bg-[#164416] shadow-xs active:bg-[#081d0e]',
    secondary: 'bg-white text-[#070707] border border-[#e8e8e8] hover:bg-[#f4f4f4] active:bg-[#ebebeb] shadow-xs',
    accent: 'bg-[#41a217] text-white hover:bg-[#297716] shadow-xs active:bg-[#1f5e10]',
    destructive: 'bg-white text-[#dc2626] border border-[#dc2626]/30 hover:bg-rose-50 active:bg-rose-100',
    ghost: 'text-[#696969] hover:text-[#070707] hover:bg-[#f4f4f4] active:bg-[#ebebeb]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
