import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          wrapper: 'bg-[#41a217]/10 border-[#41a217]/30 text-[#0c2b15]',
          icon: <CheckCircle2 className="w-4 h-4 text-[#41a217] shrink-0 mt-0.5" />,
        };
      case 'warning':
        return {
          wrapper: 'bg-[#fef3c7] border-[#fde68a] text-[#92400e]',
          icon: <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />,
        };
      case 'danger':
        return {
          wrapper: 'bg-[#fee2e2] border-[#fecaca] text-[#991b1b]',
          icon: <AlertCircle className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />,
        };
      case 'info':
      default:
        return {
          wrapper: 'bg-[#7399c6]/10 border-[#7399c6]/30 text-[#1b365d]',
          icon: <Info className="w-4 h-4 text-[#7399c6] shrink-0 mt-0.5" />,
        };
    }
  };

  const { wrapper, icon } = getVariantStyles();

  return (
    <div className={`flex gap-3 p-3.5 rounded-[10px] border text-xs leading-relaxed ${wrapper} ${className}`}>
      {icon}
      <div className="flex-1">
        {title && <div className="font-semibold mb-0.5">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};
