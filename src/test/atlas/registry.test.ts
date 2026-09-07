import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { 
  SCREEN_REGISTRY, 
  getScreenCount, 
  getDesktopFrameCount, 
  getMobileFrameCount, 
  getTotalFrameCount,
  ScreenMetadata 
} from '../../design-system/registry/screenRegistry';
import { AtlasScreenRenderer } from '../../design-system/registry/AtlasScreenRenderer';

describe('BLOCO 1 — Canonical Screen Registry', () => {
  it('should have all unique screen IDs without duplicates', () => {
    const ids = SCREEN_REGISTRY.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('every screen must define required canonical fields', () => {
    SCREEN_REGISTRY.forEach(screen => {
      expect(screen.id, `Screen missing ID`).toBeTruthy();
      expect(screen.title, `Screen ${screen.id} missing title`).toBeTruthy();
      expect(screen.journey, `Screen ${screen.id} missing journey`).toBeTruthy();
      expect(screen.route, `Screen ${screen.id} missing route`).toBeTruthy();
      expect(screen.componentName, `Screen ${screen.id} missing componentName`).toBeTruthy();
      expect(screen.dataUsed, `Screen ${screen.id} missing dataUsed`).toBeTruthy();
      expect(Array.isArray(screen.states), `Screen ${screen.id} states must be an array`).toBe(true);
      expect(screen.states.length, `Screen ${screen.id} must have at least one state`).toBeGreaterThan(0);
    });
  });

  it('every screen must support both Desktop and Mobile viewports', () => {
    SCREEN_REGISTRY.forEach(screen => {
      expect(screen.viewportDesktop, `Screen ${screen.id} must have viewportDesktop=true`).toBe(true);
      expect(screen.viewportMobile, `Screen ${screen.id} must have viewportMobile=true`).toBe(true);
    });
  });

  it('every screen must have renderKind as live or captured, strictly banning generic fallbacks', () => {
    SCREEN_REGISTRY.forEach(screen => {
      expect(['live', 'captured']).toContain(screen.renderKind);
      expect((screen as any).renderKind).not.toBe('generic');
      expect((screen as any).renderKind).not.toBe('placeholder');
      expect((screen as any).renderKind).not.toBe('metadata-card');
    });
  });

  it('computed frame counts must be strictly derived from SCREEN_REGISTRY', () => {
    const screenCount = getScreenCount();
    const desktopCount = getDesktopFrameCount();
    const mobileCount = getMobileFrameCount();
    const totalFrames = getTotalFrameCount();

    expect(screenCount).toBe(SCREEN_REGISTRY.length);
    expect(desktopCount).toBe(SCREEN_REGISTRY.filter(s => s.viewportDesktop).length);
    expect(mobileCount).toBe(SCREEN_REGISTRY.filter(s => s.viewportMobile).length);
    expect(totalFrames).toBe(desktopCount + mobileCount);
  });

  it('every registered screen must be mapped to a real production view in AtlasScreenRenderer', () => {
    SCREEN_REGISTRY.forEach(screen => {
      // AtlasScreenRenderer should not throw for registered screens
      expect(() => {
        AtlasScreenRenderer({ screenId: screen.id, viewport: 'desktop' });
      }).not.toThrow();

      expect(() => {
        AtlasScreenRenderer({ screenId: screen.id, viewport: 'mobile' });
      }).not.toThrow();
    });
  });

  it('AtlasScreenRenderer must throw an explicit error for unknown screens (no silent generic fallback)', () => {
    expect(() => {
      AtlasScreenRenderer({ screenId: 'UNKNOWN-SCREEN-ID', viewport: 'desktop' });
    }).toThrow(/Tela desconhecida sem renderer real|Unknown screen ID/i);
  });

  it('matches 1-to-1 with docs/design-system/SCREEN-INVENTORY.md', () => {
    const inventoryPath = path.resolve(__dirname, '../../../docs/design-system/SCREEN-INVENTORY.md');
    const content = fs.readFileSync(inventoryPath, 'utf-8');

    SCREEN_REGISTRY.forEach(screen => {
      expect(content, `SCREEN-INVENTORY.md missing screen ID ${screen.id}`).toContain(screen.id);
    });
  });
});
