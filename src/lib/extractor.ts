import JSZip from 'jszip';
import { createWorker } from 'tesseract.js';

export type FileKind = 'document' | 'code' | 'image' | 'binary';

export interface ExtractedFileItem {
  id: string;
  name: string;
  relativePath: string;
  type: string;
  mimeType: string;
  size: number;
  excerpt: string;
  modified: string;
  sha256: string;
  selected: boolean;
  kind: FileKind;
  rawBlob?: Blob;
}

export const TEXT_EXTENSIONS = new Set([
  'md', 'txt', 'csv', 'json', 'yaml', 'yml', 'xml', 'html', 'htm', 'sql',
  'js', 'ts', 'tsx', 'jsx', 'py', 'ipynb', 'sh', 'css', 'scss', 'env', 'rs', 'go', 'java'
]);

export const CODE_EXTENSIONS = new Set([
  'js', 'ts', 'tsx', 'jsx', 'py', 'ipynb', 'sql', 'html', 'htm', 'sh', 'css', 'scss', 'rs', 'go', 'java'
]);

export const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'heic', 'svg', 'bmp']);

export const IGNORED_FOLDERS = new Set(['__macosx', '.venv', 'venv', 'node_modules', '__pycache__', '.git', '.idea', '.vscode']);

export const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || 'bin';
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isTechnicalNoise(path: string): boolean {
  const normalized = path.replace(/\\/g, '/');
  const parts = normalized.split('/');
  const leaf = parts[parts.length - 1] || '';
  if (parts.some(part => IGNORED_FOLDERS.has(part.toLowerCase()))) return true;
  if (leaf === '.DS_Store' || leaf.startsWith('._') || leaf === 'Thumbs.db') return true;
  if (leaf.startsWith('.~lock.') || leaf.endsWith('.tmp')) return true;
  return false;
}

export function determineFileKind(filename: string): FileKind {
  const ext = getFileExtension(filename);
  if (IMAGE_EXTENSIONS.has(ext)) return 'image';
  if (CODE_EXTENSIONS.has(ext)) return 'code';
  if (TEXT_EXTENSIONS.has(ext) || ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'rtf'].includes(ext)) return 'document';
  return 'binary';
}

export function getMimeType(filename: string): string {
  const ext = getFileExtension(filename);
  const mimeMap: Record<string, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
    csv: 'text/csv',
    txt: 'text/plain',
    md: 'text/markdown',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    js: 'text/javascript',
    ts: 'text/typescript',
    tsx: 'text/typescript-jsx',
    py: 'text/x-python',
    sql: 'application/sql',
  };
  return mimeMap[ext] || 'application/octet-stream';
}

export async function calculateSha256(buffer: ArrayBuffer): Promise<string> {
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.warn('Falha no crypto.subtle para SHA-256, usando fallback:', err);
    return `sha256_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}

export function clampString(str: string, maxLength = 2200): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 1).trimEnd()}…`;
}

export async function extractPdfText(blob: Blob): Promise<string> {
  try {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
    const arrayBuffer = await blob.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const pageCount = Math.min(pdf.numPages, 30);
    let fullText = '';

    for (let pageNo = 1; pageNo <= pageCount; pageNo++) {
      const page = await pdf.getPage(pageNo);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += `${pageText}\n`;
    }

    if (fullText.trim().length >= 80) {
      return clampString(fullText.trim(), 8000);
    }

    // Fallback para OCR caso o PDF seja digitalizado / escaneado
    const worker = await createWorker('por+eng');
    try {
      let ocrText = '';
      const maxOcrPages = Math.min(pdf.numPages, 5);
      for (let pageNo = 1; pageNo <= maxOcrPages; pageNo++) {
        const page = await pdf.getPage(pageNo);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d');
        if (!context) continue;
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const result = await worker.recognize(canvas);
        ocrText += `${result.data.text}\n`;
      }
      return clampString(ocrText.trim() || fullText.trim(), 8000);
    } finally {
      await worker.terminate();
    }
  } catch (error) {
    console.error('Erro na extração do PDF:', error);
    return 'Documento PDF (não foi possível extrair o texto automaticamente).';
  }
}

export async function extractDocxText(blob: Blob): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(blob);
    const docXml = zip.file('word/document.xml');
    if (!docXml) return 'Documento Word DOCX';
    const xmlContent = await docXml.async('text');
    // Remove tags XML e extrai parágrafos
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
    const paragraphs = xmlDoc.getElementsByTagName('w:p');
    const lines: string[] = [];
    for (let i = 0; i < paragraphs.length; i++) {
      const text = paragraphs[i].textContent || '';
      if (text.trim()) lines.push(text.trim());
    }
    return clampString(lines.join('\n'), 8000);
  } catch (err) {
    console.warn('Erro na extração DOCX:', err);
    return 'Documento DOCX';
  }
}

export async function extractXlsxText(blob: Blob): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(blob);
    const stringsFile = zip.file('xl/sharedStrings.xml');
    const sheetFiles = Object.keys(zip.files).filter(name => name.startsWith('xl/worksheets/sheet') && name.endsWith('.xml'));
    const strings: string[] = [];

    if (stringsFile) {
      const stringsXml = await stringsFile.async('text');
      const parser = new DOMParser();
      const doc = parser.parseFromString(stringsXml, 'application/xml');
      const tTags = doc.getElementsByTagName('t');
      for (let i = 0; i < Math.min(tTags.length, 500); i++) {
        if (tTags[i].textContent) strings.push(tTags[i].textContent!.trim());
      }
    }

    const summary = [`Planilha Excel com ${sheetFiles.length} aba(s).`];
    if (strings.length > 0) {
      summary.push(`Conteúdo identificado: ${strings.slice(0, 50).join(', ')}`);
    }
    return clampString(summary.join('\n'), 8000);
  } catch (err) {
    console.warn('Erro na extração XLSX:', err);
    return 'Planilha Excel XLSX';
  }
}

export async function extractImageOcr(blob: Blob): Promise<string> {
  try {
    const worker = await createWorker('por+eng');
    try {
      const result = await worker.recognize(blob);
      return clampString(result.data.text.trim(), 4000);
    } finally {
      await worker.terminate();
    }
  } catch (err) {
    console.warn('OCR em imagem falhou:', err);
    return 'Arquivo de imagem';
  }
}

export async function processSingleFile(file: File): Promise<ExtractedFileItem> {
  const ext = getFileExtension(file.name);
  const kind = determineFileKind(file.name);
  const mimeType = getMimeType(file.name);
  const buffer = await file.arrayBuffer();
  const sha256 = await calculateSha256(buffer);
  let excerpt = '';

  if (TEXT_EXTENSIONS.has(ext)) {
    const decoder = new TextDecoder('utf-8');
    excerpt = clampString(decoder.decode(buffer), 8000);
  } else if (ext === 'pdf') {
    excerpt = await extractPdfText(file);
  } else if (ext === 'docx') {
    excerpt = await extractDocxText(file);
  } else if (ext === 'xlsx') {
    excerpt = await extractXlsxText(file);
  }

  return {
    id: crypto.randomUUID(),
    name: file.name.split('/').pop() || file.name,
    relativePath: file.name,
    type: ext.toUpperCase(),
    mimeType,
    size: file.size,
    excerpt,
    modified: new Date(file.lastModified).toISOString().slice(0, 10),
    sha256,
    selected: kind !== 'image' && kind !== 'binary',
    kind,
    rawBlob: file,
  };
}

export async function processZipFile(file: File): Promise<{ items: ExtractedFileItem[]; ignoredCount: number }> {
  const zip = await JSZip.loadAsync(file);
  const entries = Object.values(zip.files).filter(entry => !entry.dir);
  const usefulEntries = entries.filter(entry => !isTechnicalNoise(entry.name)).slice(0, 100);
  const ignoredCount = entries.length - usefulEntries.length;

  const items: ExtractedFileItem[] = [];

  for (const entry of usefulEntries) {
    const ext = getFileExtension(entry.name);
    const kind = determineFileKind(entry.name);
    const mimeType = getMimeType(entry.name);
    const blob = await entry.async('blob');
    const buffer = await blob.arrayBuffer();
    const sha256 = await calculateSha256(buffer);
    const size = buffer.byteLength || (entry as any)._data?.uncompressedSize || blob.size || 0;
    const modified = entry.date ? new Date(entry.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    let excerpt = '';

    if (TEXT_EXTENSIONS.has(ext)) {
      const text = await entry.async('text');
      excerpt = clampString(text, 8000);
    } else if (ext === 'pdf') {
      excerpt = await extractPdfText(blob);
    } else if (ext === 'docx') {
      excerpt = await extractDocxText(blob);
    } else if (ext === 'xlsx') {
      excerpt = await extractXlsxText(blob);
    }

    items.push({
      id: crypto.randomUUID(),
      name: entry.name.split('/').pop() || entry.name,
      relativePath: entry.name,
      type: ext.toUpperCase(),
      mimeType,
      size,
      excerpt,
      modified,
      sha256,
      selected: kind !== 'image' && kind !== 'binary',
      kind,
      rawBlob: blob,
    });
  }

  return { items, ignoredCount };
}
