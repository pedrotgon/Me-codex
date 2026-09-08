export interface FitAllParams {
  containerWidth: number;
  containerHeight: number;
  contentWidth: number;
  contentHeight: number;
  margin?: number;
  minZoom?: number;
  maxZoom?: number;
}

export interface FitAllResult {
  zoom: number;
  pan: { x: number; y: number };
  usableWidth: number;
  usableHeight: number;
}

/**
 * Pure mathematical calculation of Fit All bounds for the 2D infinite canvas workspace.
 * Adjusts zoom and pan to fit content perfectly within container bounds while respecting margins.
 */
export function calculateFitAll({
  containerWidth,
  containerHeight,
  contentWidth,
  contentHeight,
  margin = 48,
  minZoom = 0.15,
  maxZoom = 1.5,
}: FitAllParams): FitAllResult {
  const usableWidth = Math.max(containerWidth - margin * 2, 50);
  const usableHeight = Math.max(containerHeight - margin * 2, 50);

  const safeContentW = Math.max(contentWidth, 1);
  const safeContentH = Math.max(contentHeight, 1);

  const scaleX = usableWidth / safeContentW;
  const scaleY = usableHeight / safeContentH;
  const rawZoom = Math.min(scaleX, scaleY);

  const zoom = Math.min(maxZoom, Math.max(minZoom, Number(rawZoom.toFixed(2))));

  // Center mathematically inside container
  const panX = Math.round((containerWidth - safeContentW * zoom) / 2);
  const panY = Math.round((containerHeight - safeContentH * zoom) / 2);

  return {
    zoom,
    pan: { x: panX, y: panY },
    usableWidth,
    usableHeight,
  };
}
