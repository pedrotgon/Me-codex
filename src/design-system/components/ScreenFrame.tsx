import React from 'react';
import { ExternalLink, Monitor, Smartphone } from 'lucide-react';
import { Badge } from './Badge';

export interface ScreenFrameProps {
  id: string;
  title: string;
  journey: string;
  viewport: 'desktop' | 'mobile';
  stateName?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onOpenLive?: () => void;
  children: React.ReactNode;
  width?: number;
  height?: number;
  scale?: number;
  className?: string;
}

export const ScreenFrame: React.FC<ScreenFrameProps> = ({
  id,
  title,
  journey,
  viewport,
  stateName = 'Padrão',
  isSelected = false,
  onSelect,
  onOpenLive,
  children,
  width,
  height,
  scale = 0.25,
  className = '',
}) => {
  const isDesktop = viewport === 'desktop';
  const naturalWidth = width || (isDesktop ? 1440 : 390);
  const naturalHeight = height || (isDesktop ? 1024 : 844);

  const containerWidth = naturalWidth * scale;
  const containerHeight = naturalHeight * scale;

  return (
    <div
      onClick={onSelect}
      className={`flex flex-col bg-white rounded-[12px] border transition-all duration-150 cursor-pointer select-none group ${
        isSelected
          ? 'border-[#0c2b15] ring-2 ring-[#0c2b15]/20 shadow-md'
          : 'border-[#e8e8e8] hover:border-[#0c2b15]/40 shadow-xs'
      } ${className}`}
      style={{ width: containerWidth + 24 }}
    >
      {/* Frame Topbar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#fbfbfb] border-b border-[#e8e8e8] rounded-t-[12px]">
        <div className="flex items-center gap-2 truncate pr-2">
          {isDesktop ? (
            <Monitor className="w-3.5 h-3.5 text-[#0c2b15] shrink-0" />
          ) : (
            <Smartphone className="w-3.5 h-3.5 text-[#7399c6] shrink-0" />
          )}
          <span className="text-xs font-semibold text-[#070707] truncate">{title}</span>
          <Badge variant={isDesktop ? 'forest' : 'goldman'} size="sm">
            {isDesktop ? '1440×1024' : '390×844'}
          </Badge>
          {stateName !== 'Padrão' && (
            <Badge variant="warning" size="sm">
              {stateName}
            </Badge>
          )}
        </div>

        {onOpenLive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenLive();
            }}
            title="Abrir esta tela no Më Life OS"
            className="p-1 rounded-[6px] text-[#696969] hover:text-[#0c2b15] hover:bg-white transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Viewport Canvas Frame Area (scaled with CSS transform) */}
      <div
        className="p-3 bg-[#f8f9fa] flex items-center justify-center overflow-hidden rounded-b-[12px]"
        style={{ height: containerHeight + 24 }}
      >
        <div
          className="relative bg-white rounded-[8px] border border-[#e8e8e8] shadow-2xs overflow-hidden origin-top-left"
          style={{
            width: naturalWidth,
            height: naturalHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            pointerEvents: 'none', // Prevents accidental input inside miniature frame
          }}
        >
          {children}
        </div>
      </div>

      {/* Frame Footer Info */}
      <div className="px-3 py-1.5 bg-[#fbfbfb] border-t border-[#f0f0f0] rounded-b-[12px] flex items-center justify-between text-[10px] font-mono text-[#696969]">
        <span className="truncate">{journey}</span>
        <span>ID: {id}</span>
      </div>
    </div>
  );
};
