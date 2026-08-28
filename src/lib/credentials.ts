export const CREDENTIALS_STORAGE_KEY = 'me_credentials_v1';
export const GEMINI_MODEL = 'gemini-3.6-flash';

export function getGeminiCredential() {
  try {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (!raw) return { apiKey: '', model: GEMINI_MODEL };
    const parsed = JSON.parse(raw) as { gemini?: { apiKey?: string; model?: string } };
    return {
      apiKey: parsed.gemini?.apiKey || '',
      model: parsed.gemini?.model || GEMINI_MODEL,
    };
  } catch {
    return { apiKey: '', model: GEMINI_MODEL };
  }
}
