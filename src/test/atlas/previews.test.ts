import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  SCREEN_REGISTRY, 
  getScreenCount, 
  getDesktopFrameCount, 
  getMobileFrameCount, 
  getTotalFrameCount 
} from '../../design-system/registry/screenRegistry';

const PREVIEWS_DIR = path.resolve(process.cwd(), 'public/previews');
const MANIFEST_PATH = path.join(PREVIEWS_DIR, 'manifest.json');

// Helper to inspect PNG dimensions from IHDR chunk (RFC 2083)
function readPngDimensions(buffer: Buffer): { width: number; height: number } | null {
  // PNG Magic Header: 89 50 4E 47 0D 0A 1A 0A
  const isPng = buffer.length >= 24 &&
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
    buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a;
  
  if (!isPng) return null;
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

describe('BLOCO 4 — Canonical Screen Previews & Manifest Integrity', () => {
  it('fails if public/previews directory or manifest.json is missing', () => {
    expect(fs.existsSync(PREVIEWS_DIR), `Directory ${PREVIEWS_DIR} must exist`).toBe(true);
    expect(fs.existsSync(MANIFEST_PATH), `Manifest ${MANIFEST_PATH} must exist`).toBe(true);
  });

  it('fails if manifest.json is incomplete, malformed, or does not match calculated canonical counts', () => {
    if (!fs.existsSync(MANIFEST_PATH)) {
      throw new Error(`manifest.json does not exist at ${MANIFEST_PATH}`);
    }

    const content = fs.readFileSync(MANIFEST_PATH, 'utf-8');
    const manifest = JSON.parse(content);

    expect(Array.isArray(manifest.previews)).toBe(true);
    expect(manifest.previews.length).toBe(getTotalFrameCount());
    expect(manifest.totalPreviews).toBe(getTotalFrameCount());
    expect(manifest.desktopPreviews).toBe(getDesktopFrameCount());
    expect(manifest.mobilePreviews).toBe(getMobileFrameCount());
    expect(manifest.screenCount).toBe(getScreenCount());
  });

  it('validates that every registered screen has a physical, non-empty, decodable Desktop and Mobile preview', () => {
    const missingPreviews: string[] = [];
    const htmlContaminated: string[] = [];
    const invalidDimensions: string[] = [];
    const hashes = new Map<string, string>();
    const duplicateHashes: string[] = [];

    const expectedDesktopWidth = 1440;
    const expectedDesktopHeight = 1024;
    const expectedMobileWidth = 390;
    const expectedMobileHeight = 844;

    for (const screen of SCREEN_REGISTRY) {
      for (const viewport of ['desktop', 'mobile'] as const) {
        const fileName = `${screen.id}-${viewport}.png`;
        const filePath = path.join(PREVIEWS_DIR, fileName);

        if (!fs.existsSync(filePath)) {
          missingPreviews.push(fileName);
          continue;
        }

        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
          missingPreviews.push(`${fileName} (empty file: 0 bytes)`);
          continue;
        }

        const buffer = fs.readFileSync(filePath);
        const textPrefix = buffer.slice(0, 100).toString('utf-8').toLowerCase();
        if (textPrefix.includes('<!doctype') || textPrefix.includes('<html') || textPrefix.includes('<head')) {
          htmlContaminated.push(fileName);
          continue;
        }

        const dims = readPngDimensions(buffer);
        if (!dims) {
          invalidDimensions.push(`${fileName} (invalid PNG header)`);
          continue;
        }

        const expW = viewport === 'desktop' ? expectedDesktopWidth : expectedMobileWidth;
        const expH = viewport === 'desktop' ? expectedDesktopHeight : expectedMobileHeight;
        if (dims.width !== expW || dims.height !== expH) {
          invalidDimensions.push(`${fileName} (got ${dims.width}x${dims.height}, expected ${expW}x${expH})`);
        }

        // Check hash collisions across screens
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');
        if (hashes.has(hash)) {
          duplicateHashes.push(`${fileName} has identical bytes to ${hashes.get(hash)}`);
        } else {
          hashes.set(hash, fileName);
        }
      }
    }

    expect(missingPreviews, `Missing previews:\n${missingPreviews.join('\n')}`).toHaveLength(0);
    expect(htmlContaminated, `HTML contaminated previews (Vite SPA fallback):\n${htmlContaminated.join('\n')}`).toHaveLength(0);
    expect(invalidDimensions, `Invalid PNG dimensions:\n${invalidDimensions.join('\n')}`).toHaveLength(0);
    expect(duplicateHashes, `Duplicate preview images detected:\n${duplicateHashes.join('\n')}`).toHaveLength(0);
  });

  it('fails if there are orphan files in public/previews not belonging to the canonical registry', () => {
    if (!fs.existsSync(PREVIEWS_DIR)) return;

    const files = fs.readdirSync(PREVIEWS_DIR);
    const validNames = new Set<string>();
    validNames.add('manifest.json');

    for (const screen of SCREEN_REGISTRY) {
      validNames.add(`${screen.id}-desktop.png`);
      validNames.add(`${screen.id}-mobile.png`);
    }

    const orphanFiles = files.filter(f => !validNames.has(f) && !f.startsWith('.'));
    expect(orphanFiles, `Orphan files detected in public/previews: ${orphanFiles.join(', ')}`).toHaveLength(0);
  });
});
