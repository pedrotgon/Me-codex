import React from 'react';
import { FolderKanban, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = <FolderKanban className="w-8 h-8 text-[#696969]" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-[#fbfbfb] rounded-[10px] border border-dashed border-[#e8e8e8]">
      <div className="mb-3 p-3 bg-white rounded-full border border-[#e8e8e8] shadow-2xs">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-[#070707] mb-1">{title}</h3>
      <p className="text-xs text-[#696969] max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export interface LoadingStateProps {
  message?: string;
  subtext?: string;
  progressPercent?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando dados...',
  subtext,
  progressPercent,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-[10px] border border-[#e8e8e8]">
      <Loader2 className="w-8 h-8 text-[#41a217] animate-spin mb-3" />
      <div className="text-xs font-semibold text-[#070707]">{message}</div>
      {subtext && <div className="text-[11px] text-[#696969] mt-1">{subtext}</div>}
      {progressPercent !== undefined && (
        <div className="w-48 bg-[#f4f4f4] h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-[#41a217] h-full transition-all duration-200"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocorreu um erro',
  message,
  onRetry,
  retryText = 'Tentar novamente',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-[10px] border border-rose-200">
      <div className="mb-2 p-2 bg-white rounded-full border border-rose-200 text-[#dc2626]">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-xs font-semibold text-[#991b1b] mb-1">{title}</h4>
      <p className="text-[11px] text-[#696969] max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="destructive"
          size="sm"
          icon={<RotateCcw className="w-3 h-3" />}
          onClick={onRetry}
        >
          {retryText}
        </Button>
      )}
    </div>
  );
};
