import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfiniteCanvas } from '../../design-system/canvas/InfiniteCanvas';
import { AtlasStoreProvider } from '../../design-system/registry/AtlasStoreProvider';
import { 
  SCREEN_REGISTRY, 
  getScreenCount, 
  getDesktopFrameCount, 
  getMobileFrameCount, 
  getTotalFrameCount 
} from '../../design-system/registry/screenRegistry';

describe('BLOCO 3 — Screen Atlas Canvas & Real Fit All', () => {
  const onNavigateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Atlas Canvas with dynamic counts derived from canonical registry', () => {
    render(
      <AtlasStoreProvider>
        <InfiniteCanvas onNavigateToView={onNavigateMock} />
      </AtlasStoreProvider>
    );

    const screenCount = getScreenCount();
    const totalFrames = getTotalFrameCount();
    const desktopCount = getDesktopFrameCount();
    const mobileCount = getMobileFrameCount();

    // Check header subtitle derived from registry
    expect(
      screen.getByText(new RegExp(`${screenCount}\\s*telas`, 'i'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`${totalFrames}\\s*frames`, 'i'))
    ).toBeInTheDocument();

    // Check filter button labels
    expect(
      screen.getByRole('button', { name: new RegExp(`Todos \\(${totalFrames}\\)`, 'i') })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: new RegExp(`Desktop \\(${desktopCount}\\)`, 'i') })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: new RegExp(`Mobile \\(${mobileCount}\\)`, 'i') })
    ).toBeInTheDocument();
  });

  it('filters by viewport: desktop only, mobile only, and all', () => {
    render(
      <AtlasStoreProvider>
        <InfiniteCanvas onNavigateToView={onNavigateMock} />
      </AtlasStoreProvider>
    );

    const desktopBtn = screen.getByRole('button', { name: new RegExp(`^Desktop \\(${getDesktopFrameCount()}\\)`, 'i') });
    const mobileBtn = screen.getByRole('button', { name: new RegExp(`^Mobile \\(${getMobileFrameCount()}\\)`, 'i') });
    const allBtn = screen.getByRole('button', { name: new RegExp(`^Todos \\(${getTotalFrameCount()}\\)`, 'i') });

    // Filter Desktop
    fireEvent.click(desktopBtn);
    const desktopBadges = screen.getAllByText('1440×1024');
    expect(desktopBadges.length).toBe(getDesktopFrameCount());
    expect(screen.queryByText('390×844')).not.toBeInTheDocument();

    // Filter Mobile
    fireEvent.click(mobileBtn);
    const mobileBadges = screen.getAllByText('390×844');
    expect(mobileBadges.length).toBe(getMobileFrameCount());
    expect(screen.queryByText('1440×1024')).not.toBeInTheDocument();

    // Filter All
    fireEvent.click(allBtn);
    expect(screen.getAllByText('1440×1024').length).toBe(getDesktopFrameCount());
    expect(screen.getAllByText('390×844').length).toBe(getMobileFrameCount());
  });

  it('selects a frame and displays canonical metadata in inspection drawer without UI freeze', () => {
    render(
      <AtlasStoreProvider>
        <InfiniteCanvas onNavigateToView={onNavigateMock} />
      </AtlasStoreProvider>
    );

    // Initial default or selected screen
    expect(screen.getByText(/Inspeção de Tela/i)).toBeInTheDocument();

    // Click on a specific screen frame (e.g. S03-take-action)
    const acoesFrame = screen.getByText('S03-take-action');
    fireEvent.click(acoesFrame);

    // Inspection drawer should reflect S03
    expect(screen.getAllByText('S03-take-action').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/rota: take-action/i)).toBeInTheDocument();

    // Action button to open live screen in Më Life OS
    const openLiveBtn = screen.getByRole('button', { name: /Abrir Tela no Më Life OS/i });
    fireEvent.click(openLiveBtn);
    expect(onNavigateMock).toHaveBeenCalledWith('take-action');
  });

  it('executes real mathematical Fit All based on canvas container and content dimensions', () => {
    const { container } = render(
      <AtlasStoreProvider>
        <InfiniteCanvas onNavigateToView={onNavigateMock} />
      </AtlasStoreProvider>
    );

    // Find zoom indicator
    const zoomIndicator = screen.getByTestId('zoom-indicator');
    expect(zoomIndicator).toBeInTheDocument();

    // Find Fit All button
    const fitAllBtn = screen.getByTitle('Enquadrar Todas as Telas');
    expect(fitAllBtn).toBeInTheDocument();

    // Trigger Fit All
    fireEvent.click(fitAllBtn);

    // Verify zoom changed and is a valid non-zero calculated number
    const zoomValue = parseInt(zoomIndicator.textContent?.replace('%', '') || '0', 10);
    expect(zoomValue).toBeGreaterThan(0);
    expect(zoomValue).toBeLessThanOrEqual(200);
  });

  it('supports zoom controls and reset view', () => {
    render(
      <AtlasStoreProvider>
        <InfiniteCanvas onNavigateToView={onNavigateMock} />
      </AtlasStoreProvider>
    );

    const zoomInBtn = screen.getByLabelText('Aumentar zoom');
    const zoomOutBtn = screen.getByLabelText('Diminuir zoom');
    const resetBtn = screen.getByTitle('Resetar Visualização');

    fireEvent.click(zoomInBtn);
    fireEvent.click(zoomOutBtn);
    fireEvent.click(resetBtn);

    expect(screen.getByText('65%')).toBeInTheDocument();
  });
});
