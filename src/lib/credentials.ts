export const CREDENTIALS_STORAGE_KEY = 'me_credentials_v1';
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

export const AVAILABLE_GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Recomendado / Rápido)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Raciocínio Complexo)' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
];

export interface GeminiCredential {
  apiKey: string;
  model: string;
}

export function getGeminiCredential(): GeminiCredential {
  try {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!raw) return { apiKey: '', model: DEFAULT_GEMINI_MODEL };
    const parsed = JSON.parse(raw) as { gemini?: { apiKey?: string; model?: string } };
    return {
      apiKey: (parsed.gemini?.apiKey || '').trim(),
      model: parsed.gemini?.model || DEFAULT_GEMINI_MODEL,
    };
  } catch {
    return { apiKey: '', model: DEFAULT_GEMINI_MODEL };
  }
}

export function saveGeminiCredential(apiKey: string, model: string = DEFAULT_GEMINI_MODEL) {
  try {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    const updated = {
      ...existing,
      gemini: { apiKey: apiKey.trim(), model: model || DEFAULT_GEMINI_MODEL },
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Falha ao salvar credencial local:', err);
  }
}
