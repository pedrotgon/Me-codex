import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync, spawn } from 'child_process';
import http from 'http';
import { SCREEN_REGISTRY } from '../src/design-system/registry/screenRegistry';

const PREVIEWS_DIR = path.resolve(process.cwd(), 'public/previews');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Helper to check if a port is responding
function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        // Must verify that this is Më Life OS and not another project running on localhost
        resolve(data.includes('Më — Life OS') || data.includes('Më Life OS'));
      });
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Helper to read PNG dimensions from IHDR chunk
function readPngDimensions(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 24) return null;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
    buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a;
  if (!isPng) return null;
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Më Life OS — Deterministic Screen Capture Harness');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Ensure Chrome is installed
  if (!fs.existsSync(CHROME_PATH)) {
    console.error(`[ERROR] Google Chrome binary not found at: ${CHROME_PATH}`);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(PREVIEWS_DIR)) {
    fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
  }

  // Determine active port for Më Life OS (prefer 3000, then 5173)
  let port = 3000;
  if (await checkPort(3000)) {
    port = 3000;
  } else if (await checkPort(5173)) {
    port = 5173;
  } else {
    console.error('[ERROR] Më Life OS dev server is not responding on port 3000 or 5173.');
    console.error('Please verify that `npm run dev` is running Më Life OS.');
    process.exit(1);
  }

  console.log(`[INFO] Connected to Më Life OS on http://127.0.0.1:${port}/`);
  console.log(`[INFO] Found ${SCREEN_REGISTRY.length} canonical screens in registry.`);

  let gitCommit = 'unknown';
  try {
    gitCommit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    // Git commit not available
  }

  const manifestEntries: Array<{
    screenId: string;
    viewport: 'desktop' | 'mobile';
    title: string;
    journey: string;
    path: string;
    width: number;
    height: number;
    bytes: number;
    sha256: string;
    capturedAt: string;
  }> = [];

  const viewports: Array<{
    type: 'desktop' | 'mobile';
    width: number;
    height: number;
  }> = [
    { type: 'desktop', width: 1440, height: 1024 },
    { type: 'mobile', width: 390, height: 844 },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const screen of SCREEN_REGISTRY) {
    for (const vp of viewports) {
      const fileName = `${screen.id}-${vp.type}.png`;
      const outputPath = path.join(PREVIEWS_DIR, fileName);
      const url = `http://localhost:${port}/?harness=true&screenId=${encodeURIComponent(screen.id)}&viewport=${vp.type}`;

      process.stdout.write(`  Capturing [${vp.type.padEnd(7)}] ${screen.id.padEnd(26)} ... `);

      try {
        // Run Chrome in headless mode to capture target screen
        execSync(
          `"${CHROME_PATH}" --headless=new --screenshot="${outputPath}" --window-size=${vp.width},${vp.height} --virtual-time-budget=1800 --hide-scrollbars "${url}" 2>/dev/null`,
          { stdio: 'pipe', timeout: 20000 }
        );

        if (!fs.existsSync(outputPath)) {
          throw new Error('Screenshot file was not created');
        }

        const buffer = fs.readFileSync(outputPath);
        if (buffer.length === 0) {
          throw new Error('Screenshot file is empty (0 bytes)');
        }

        const textCheck = buffer.slice(0, 50).toString('utf-8').toLowerCase();
        if (textCheck.includes('<!doctype') || textCheck.includes('<html')) {
          throw new Error('Screenshot contains HTML text instead of PNG image');
        }

        const dims = readPngDimensions(buffer);
        if (!dims) {
          throw new Error('Invalid PNG header');
        }

        if (dims.width !== vp.width || dims.height !== vp.height) {
          throw new Error(`Dimensions mismatch: got ${dims.width}x${dims.height}, expected ${vp.width}x${vp.height}`);
        }

        const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

        manifestEntries.push({
          screenId: screen.id,
          viewport: vp.type,
          title: screen.title,
          journey: screen.journey,
          path: `/previews/${fileName}`,
          width: dims.width,
          height: dims.height,
          bytes: buffer.length,
          sha256,
          capturedAt: new Date().toISOString(),
        });

        successCount++;
        process.stdout.write(`OK (${dims.width}x${dims.height}, ${(buffer.length / 1024).toFixed(1)} KB)\n`);
      } catch (err: any) {
        failCount++;
        process.stdout.write(`FAIL: ${err.message}\n`);
      }
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Capture complete: ${successCount} successful, ${failCount} failed.`);

  if (failCount > 0) {
    console.error(`[ERROR] Screen capture failed with ${failCount} errors.`);
    process.exit(1);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    commit: gitCommit,
    screenCount: SCREEN_REGISTRY.length,
    desktopPreviews: manifestEntries.filter(m => m.viewport === 'desktop').length,
    mobilePreviews: manifestEntries.filter(m => m.viewport === 'mobile').length,
    totalPreviews: manifestEntries.length,
    previews: manifestEntries,
  };

  const manifestPath = path.join(PREVIEWS_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`[SUCCESS] Manifest written to ${manifestPath}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
