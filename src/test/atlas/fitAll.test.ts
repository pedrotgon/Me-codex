import { describe, it, expect } from 'vitest';
import { calculateFitAll } from '../../design-system/canvas/fitAllCalculator';

describe('BLOCO 6 — Mathematical Fit All Proof & Bounds Calculation', () => {
  it('correctly scales down when content is larger than container viewport', () => {
    // Desktop canvas container: 1440 x 900
    // Content spanning 8 journeys: 3600 x 4800, margin: 48
    const result = calculateFitAll({
      containerWidth: 1440,
      containerHeight: 900,
      contentWidth: 3600,
      contentHeight: 4800,
      margin: 48,
    });

    const expectedUsableW = 1440 - 96; // 1344
    const expectedUsableH = 900 - 96;  // 804
    const scaleX = expectedUsableW / 3600; // 0.3733
    const scaleY = expectedUsableH / 4800; // 0.1675
    const expectedZoom = Number(Math.min(scaleX, scaleY).toFixed(2)); // 0.17

    expect(result.zoom).toBe(expectedZoom);
    expect(result.usableWidth).toBe(expectedUsableW);
    expect(result.usableHeight).toBe(expectedUsableH);

    // Verify mathematical centering formula: pan = (container - content * zoom) / 2
    const expectedPanX = Math.round((1440 - 3600 * expectedZoom) / 2);
    const expectedPanY = Math.round((900 - 4800 * expectedZoom) / 2);
    expect(result.pan.x).toBe(expectedPanX);
    expect(result.pan.y).toBe(expectedPanY);
  });

  it('correctly scales up (capped at maxZoom) when content is smaller than container viewport', () => {
    // Filtered view with 1 screen: 600 x 400
    const result = calculateFitAll({
      containerWidth: 1440,
      containerHeight: 900,
      contentWidth: 600,
      contentHeight: 400,
      margin: 48,
      maxZoom: 1.5,
    });

    // Both scaleX (1344/600 = 2.24) and scaleY (804/400 = 2.01) > maxZoom 1.5
    expect(result.zoom).toBe(1.5);
    expect(result.pan.x).toBe(Math.round((1440 - 600 * 1.5) / 2));
    expect(result.pan.y).toBe(Math.round((900 - 400 * 1.5) / 2));
  });

  it('calculates exact bounds on a mobile container viewport (390 x 844)', () => {
    const result = calculateFitAll({
      containerWidth: 390,
      containerHeight: 844,
      contentWidth: 1600,
      contentHeight: 3000,
      margin: 24,
    });

    const usableW = 390 - 48; // 342
    const usableH = 844 - 48; // 796
    const expectedScale = Math.min(usableW / 1600, usableH / 3000);
    const expectedZoom = Math.max(0.15, Number(expectedScale.toFixed(2)));

    expect(result.zoom).toBe(expectedZoom);
    expect(result.pan.x).toBe(Math.round((390 - 1600 * expectedZoom) / 2));
    expect(result.pan.y).toBe(Math.round((844 - 3000 * expectedZoom) / 2));
  });

  it('dynamically adapts when viewport filter reduces content width (e.g. mobile-only filter)', () => {
    // When viewport filter is mobile-only, column width is narrower
    const allScreensResult = calculateFitAll({
      containerWidth: 1440,
      containerHeight: 900,
      contentWidth: 2400,
      contentHeight: 3200,
    });

    const mobileOnlyResult = calculateFitAll({
      containerWidth: 1440,
      containerHeight: 900,
      contentWidth: 1200, // Halved content width
      contentHeight: 3200,
    });

    // Narrower content allows greater or equal zoom and adjusts panX
    expect(mobileOnlyResult.zoom).toBeGreaterThanOrEqual(allScreensResult.zoom);
    expect(mobileOnlyResult.pan.x).not.toBe(allScreensResult.pan.x);
  });

  it('dynamically adapts when search query filters down to a single journey section', () => {
    const fullAtlas = calculateFitAll({
      containerWidth: 1440,
      containerHeight: 900,
      contentWidth: 3600,
      contentHeight: 4500,
    });

    const singleJourney = calculateFitAll({
      containerWidth: 1440,
      containerHeight: 900,
      contentWidth: 1600,
      contentHeight: 800,
    });

    expect(singleJourney.zoom).toBeGreaterThan(fullAtlas.zoom);
    // Single journey content fits with higher zoom and is centered
    expect(singleJourney.pan.y).toBeGreaterThan(fullAtlas.pan.y);
  });
});
