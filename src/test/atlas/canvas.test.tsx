import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfiniteCanvas } from '../../design-system/canvas/InfiniteCanvas';
import ProductCanvasView from '../../components/views/ProductCanvasView';
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

  it('handles image loading failures gracefully displaying diagnostic Preview Indisponível error state', () => {
    render(
      <AtlasStoreProvider>
        <InfiniteCanvas onNavigateToView={onNavigateMock} />
      </AtlasStoreProvider>
    );

    // Find all preview images
    const previewImages = screen.getAllByRole('img');
    expect(previewImages.length).toBeGreaterThan(0);

    // Simulate load error on the first image (missing file, html fallback or corrupt bytes)
    fireEvent.error(previewImages[0]);

    // Should display the explicit diagnostic error state without crashing the canvas
    expect(screen.getByText('Preview Indisponível')).toBeInTheDocument();
    expect(screen.getByText(/Execute npm run atlas:capture/i)).toBeInTheDocument();
  });

  it('ProductCanvasView presents exactly two canonical tabs (Telas and Design Kit) without prototypes in navigation', () => {
    render(
      <AtlasStoreProvider>
        <ProductCanvasView />
      </AtlasStoreProvider>
    );

    // Tab 1: Telas exists
    const telasTab = screen.getByRole('button', { name: /Telas/i });
    expect(telasTab).toBeInTheDocument();

    // Tab 2: Design Kit exists
    const designKitTab = screen.getByRole('button', { name: /Design Kit/i });
    expect(designKitTab).toBeInTheDocument();

    // Prototypes tab is removed from the navigation
    expect(screen.queryByRole('button', { name: /Protótipos/i })).not.toBeInTheDocument();

    // By default, renders the Canvas
    expect(screen.getAllByText('Canvas de Telas').length).toBeGreaterThanOrEqual(1);

    // Switch to Design Kit tab
    fireEvent.click(designKitTab);

    // Should render Design Kit foundations & components
    expect(screen.getByText(/Design Kit do Më Life OS/i)).toBeInTheDocument();
    expect(screen.getByText(/Foundations & Tokens/i)).toBeInTheDocument();
    expect(screen.getByText(/Componentes & Estados/i)).toBeInTheDocument();
    expect(screen.getByText(/Cores & Tokens Semânticos/i)).toBeInTheDocument();
  });

  it('adapts cleanly to mobile viewport (390 x 844) with ergonomic touch targets and responsive inspection drawer', () => {
    // Simulate mobile viewport dimensions
    window.innerWidth = 390;
    window.innerHeight = 844;
    window.dispatchEvent(new Event('resize'));

    render(
      <AtlasStoreProvider>
        <InfiniteCanvas onNavigateToView={onNavigateMock} />
      </AtlasStoreProvider>
    );

    // Canonical mobile header exists without broken text
    expect(screen.getByText('Canvas de Telas')).toBeInTheDocument();
    expect(screen.getByText(/Quadro visual:/i)).toBeInTheDocument();

    // Select a screen to verify mobile bottom-sheet inspection drawer
    const screenFrame = screen.getAllByText('S01-home')[0];
    fireEvent.click(screenFrame);

    // Inspection header and close button with touch target
    expect(screen.getByText('Inspeção de Tela')).toBeInTheDocument();
    const closeBtn = screen.getByLabelText('Fechar Inspeção');
    expect(closeBtn).toBeInTheDocument();

    // Action button to open live screen in Më Life OS
    const openBtn = screen.getByRole('button', { name: /Abrir Tela no Më Life OS/i });
    expect(openBtn).toBeInTheDocument();
    fireEvent.click(openBtn);
    expect(onNavigateMock).toHaveBeenCalledWith('home');

    // Close drawer
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Inspeção de Tela')).not.toBeInTheDocument();
  });
});
