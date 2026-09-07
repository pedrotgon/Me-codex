import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-sans font-medium text-[#070707]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-[#696969] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full bg-white text-xs font-sans text-[#070707] placeholder:text-[#9e9e9e] border rounded-[8px] px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7399c6] disabled:bg-[#f4f4f4] disabled:text-[#9e9e9e] ${
            icon ? 'pl-9' : ''
          } ${
            error ? 'border-[#dc2626] focus-visible:ring-[#dc2626]' : 'border-[#e8e8e8] hover:border-[#0c2b15]/30'
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="text-[11px] font-sans text-[#dc2626]">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] font-sans text-[#696969]">{helperText}</span>
      ) : null}
    </div>
  );
};
