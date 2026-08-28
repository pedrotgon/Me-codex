import { GoogleGenAI, Type } from '@google/genai';
import { ExtractedFileItem, clampString } from './extractor';
import { getGeminiCredential } from './credentials';

export type ParaCategory = 'project' | 'area' | 'resource' | 'archive';

export interface ParaProposalItem extends ExtractedFileItem {
  para: ParaCategory;
  title: string;
  parent: string;
  summary: string;
  tags: string[];
  actions: string[];
  confidence: number;
  markdown: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface BatchAnalysisResult {
  successful: ParaProposalItem[];
  failed: { item: ExtractedFileItem; error: string }[];
}

export const PARA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          para: {
            type: Type.STRING,
            enum: ['project', 'area', 'resource', 'archive'],
            description: 'Categoria no método PARA: project (curto prazo/entregas), area (padrão contínuo), resource (referência/interesse), archive (inativo/histórico)',
          },
          title: { type: Type.STRING, description: 'Título claro e limpo do item' },
          parent: { type: Type.STRING, description: 'Nome da Área ou Projeto pai correspondente' },
          summary: { type: Type.STRING, description: 'Resumo conciso de até 160 caracteres' },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Até 3 tags relevantes',
          },
          actions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Até 2 próximas ações práticas',
          },
          confidence: { type: Type.INTEGER, description: 'Confiança de 0 a 100' },
        },
        required: ['id', 'para', 'title', 'parent', 'summary', 'confidence'],
      },
    },
  },
  required: ['items'],
};

export function localFallbackProposal(item: ExtractedFileItem): ParaProposalItem {
  const lower = item.name.toLowerCase();
  let para: ParaCategory = 'resource';

  if (lower.includes('contrato') || lower.includes('recibo') || lower.includes('old') || lower.includes('2024') || lower.includes('2023') || lower.includes('backup')) {
    para = 'archive';
  } else if (lower.includes('projeto') || lower.includes('plano') || lower.includes('sprint') || lower.includes('entrega') || lower.includes('prd') || lower.includes('app')) {
    para = 'project';
  } else if (lower.includes('rotina') || lower.includes('saude') || lower.includes('financas') || lower.includes('casa') || lower.includes('carreira') || lower.includes('estudo')) {
    para = 'area';
  }

  const cleanTitle = item.name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    ...item,
    para,
    title: cleanTitle || item.name,
    parent: para === 'archive' ? 'Arquivados' : 'Inbox',
    summary: item.excerpt ? clampString(item.excerpt.replace(/\n+/g, ' '), 150) : 'Documento catalogado pelo sistema local.',
    tags: [item.type.toLowerCase(), para],
    actions: para === 'project' ? ['Revisar escopo e próximas tarefas'] : [],
    confidence: 45,
    markdown: '',
    status: 'pending',
  };
}

export function buildMarkdownTwin(
  item: ParaProposalItem,
  sourceRootPath: string
): string {
  const cleanRoot = (sourceRootPath || '').trim();
  const relPath = item.relativePath.replace(/\\/g, '/');

  // O navegador não conhece caminhos absolutos. Só derivamos o sistema
  // operacional explicitamente informado pelo usuário; o outro fica vazio.
  const isMacRoot = cleanRoot.startsWith('/');
  const isWindowsRoot = /^[a-zA-Z]:[\\/]/.test(cleanRoot);
  const pathMac = isMacRoot ? `${cleanRoot.replace(/\/+$/, '')}/${relPath}` : '';
  const pathWindows = isWindowsRoot
    ? `${cleanRoot.replace(/[\\/]+$/, '').replace(/\//g, '\\')}\\${relPath.replace(/\//g, '\\')}`
    : '';

  const frontmatter = [
    '---',
    `id: "${item.id}"`,
    `title: "${item.title.replace(/"/g, '\\"')}"`,
    `original_file: "${item.name.replace(/"/g, '\\"')}"`,
    `relative_path: "${relPath}"`,
    `path_mac: "${pathMac}"`,
    `path_windows: "${pathWindows}"`,
    `mime_type: "${item.mimeType || 'application/octet-stream'}"`,
    `size: ${item.size || 0}`,
    `modified: "${item.modified || new Date().toISOString().slice(0, 10)}"`,
    `sha256: "${item.sha256 || ''}"`,
    `para: "${item.para}"`,
    `parent: "${(item.parent || 'Inbox').replace(/"/g, '\\"')}"`,
    `tags: [${(item.tags || []).map(t => JSON.stringify(t)).join(', ')}]`,
    `created_at: "${new Date().toISOString()}"`,
    '---',
  ].join('\n');

  const bodyParagraphs = [
    `# ${item.title}`,
    '',
    `> **Resumo:** ${item.summary || 'Sem resumo fornecido.'}`,
    '',
  ];

  if (item.actions && item.actions.length > 0) {
    bodyParagraphs.push('## Próximas Ações');
    item.actions.forEach(act => {
      bodyParagraphs.push(`- [ ] ${act}`);
    });
    bodyParagraphs.push('');
  }

  if (item.excerpt && item.excerpt.trim()) {
    bodyParagraphs.push('## Conteúdo Extraído');
    bodyParagraphs.push(item.excerpt.trim());
  }

  const rawBody = bodyParagraphs.join('\n');
  const clampedBody = clampString(rawBody, 2200);

  return `${frontmatter}\n\n${clampedBody}`;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function analyzeBatchWithGemini(
  items: ExtractedFileItem[],
  onProgress?: (processed: number, total: number) => void
): Promise<BatchAnalysisResult> {
  const credential = getGeminiCredential();
  if (!credential.apiKey) {
    throw new Error('Chave da Gemini API não encontrada. Configure em Dados → Credenciais.');
  }

  const ai = new GoogleGenAI({ apiKey: credential.apiKey });
  const model = credential.model || 'gemini-2.5-flash';

  const BATCH_SIZE = 6;
  const batches: ExtractedFileItem[][] = [];
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }

  const successful: ParaProposalItem[] = [];
  const failed: { item: ExtractedFileItem; error: string }[] = [];
  let processedCount = 0;

  for (const batch of batches) {
    let success = false;
    let lastError = '';

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const payload = batch.map(b => ({
          id: b.id,
          name: b.relativePath,
          type: b.type,
          size: b.size,
          excerpt: clampString(b.excerpt || '', 600),
        }));

        const prompt = `Você é o classificador do Më Life OS (segundo cérebro). Classifique cada arquivo recebido estritamente no método PARA (project, area, resource, archive).
Retorne a resposta no formato JSON estruturado com id, para, title, parent, summary, tags, actions e confidence.
Itens para classificação:
${JSON.stringify(payload, null, 2)}`;

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: PARA_SCHEMA as any,
            temperature: 0.1,
          },
        });

        const text = response.text || '{}';
        const parsed = JSON.parse(text) as { items?: Array<Partial<ParaProposalItem>> };
        const returnedItems = parsed.items || [];
        const itemMap = new Map(returnedItems.map(it => [it.id, it]));

        for (const original of batch) {
          const aiResult = itemMap.get(original.id);
          const fallback = localFallbackProposal(original);
          
          const finalItem: ParaProposalItem = {
            ...fallback,
            para: (aiResult?.para && ['project', 'area', 'resource', 'archive'].includes(aiResult.para))
              ? (aiResult.para as ParaCategory)
              : fallback.para,
            title: aiResult?.title?.trim() || fallback.title,
            parent: aiResult?.parent?.trim() || fallback.parent,
            summary: aiResult?.summary?.trim() || fallback.summary,
            tags: Array.isArray(aiResult?.tags) && aiResult.tags.length ? aiResult.tags.slice(0, 3) : fallback.tags,
            actions: Array.isArray(aiResult?.actions) && aiResult.actions.length ? aiResult.actions.slice(0, 2) : fallback.actions,
            confidence: typeof aiResult?.confidence === 'number' ? aiResult.confidence : 85,
            markdown: '',
            status: 'pending',
          };
          successful.push(finalItem);
        }

        success = true;
        break;
      } catch (err: any) {
        lastError = err?.message || String(err);
        if (lastError.toLowerCase().includes('429') || lastError.toLowerCase().includes('resource_exhausted')) {
          await sleep(1500 * attempt);
        } else if (attempt < 3) {
          await sleep(1000 * attempt);
        }
      }
    }

    if (!success) {
      // Se falhar o lote após 3 tentativas, salvamos com fallback mas marcamos com aviso
      for (const original of batch) {
        const fallback = localFallbackProposal(original);
        successful.push({
          ...fallback,
          summary: `[Classificação local] ${fallback.summary}`,
          confidence: 30,
        });
        failed.push({ item: original, error: lastError || 'Erro ao conectar ao Gemini' });
      }
    }

    processedCount += batch.length;
    onProgress?.(processedCount, items.length);
  }

  return { successful, failed };
}
