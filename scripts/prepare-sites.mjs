import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDir = new URL('../dist/', import.meta.url);
const projectDir = new URL('../', import.meta.url);
const outputDirPath = fileURLToPath(outputDir);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'server' || entry.name === '.openai') continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(path));
    else files.push(path);
  }
  return files;
}

const files = await listFiles(outputDirPath);
const assets = {};

for (const file of files) {
  const path = `/${relative(outputDirPath, file).replaceAll('\\\\', '/')}`;
  assets[path] = {
    body: (await readFile(file)).toString('base64'),
    type: mimeTypes[extname(file)] ?? 'application/octet-stream',
  };
}

const worker = `const assets = ${JSON.stringify(assets)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function handle(request) {
  const url = new URL(request.url);
  const asset = assets[url.pathname] ?? assets['/index.html'];
  const headers = new Headers({ 'content-type': asset.type });
  if (url.pathname.startsWith('/assets/')) headers.set('cache-control', 'public, max-age=31536000, immutable');
  else headers.set('cache-control', 'no-cache');
  return new Response(decodeBase64(asset.body), { headers });
}

export { handle as fetch };
export default { fetch: handle };
`;

await mkdir(new URL('./server/', outputDir), { recursive: true });
await mkdir(new URL('./.openai/', outputDir), { recursive: true });
await writeFile(new URL('./server/index.js', outputDir), worker);
await writeFile(
  new URL('./.openai/hosting.json', outputDir),
  await readFile(new URL('./.openai/hosting.json', projectDir)),
);
