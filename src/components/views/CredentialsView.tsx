import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  CREDENTIALS_STORAGE_KEY,
  DEFAULT_GEMINI_MODEL,
  AVAILABLE_GEMINI_MODELS,
  getGeminiCredential,
  saveGeminiCredential,
} from '../../lib/credentials';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Save,
  ShieldCheck,
  Trash2,
  Wifi,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEY = CREDENTIALS_STORAGE_KEY;

type ProviderId = 'gemini' | 'openai' | 'anthropic';

interface CredentialVault {
  gemini: { apiKey: string; model: string };
  openai: { apiKey: string };
  anthropic: { apiKey: string };
  updatedAt?: string;
}

const emptyVault: CredentialVault = {
  gemini: { apiKey: '', model: DEFAULT_GEMINI_MODEL },
  openai: { apiKey: '' },
  anthropic: { apiKey: '' },
};

function loadVault(): CredentialVault {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyVault;
    const parsed = JSON.parse(raw) as Partial<CredentialVault>;
    return {
      gemini: {
        apiKey: parsed.gemini?.apiKey || '',
        model: parsed.gemini?.model || DEFAULT_GEMINI_MODEL,
      },
      openai: { apiKey: parsed.openai?.apiKey || '' },
      anthropic: { apiKey: parsed.anthropic?.apiKey || '' },
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return emptyVault;
  }
}

function connectionErrorMessage(error: unknown) {
  const value = String(error).toLowerCase();
  if (value.includes('429') || value.includes('resource_exhausted')) {
    return 'A chave respondeu, mas a cota do projeto foi atingida. Consulte os limites no Google AI Studio.';
  }
  if (value.includes('401') || value.includes('403') || value.includes('api key') || value.includes('api_key_invalid')) {
    return 'A chave foi recusada. Confirme se ela pertence a um projeto com a Gemini API habilitada.';
  }
  if (value.includes('not found') || value.includes('404')) {
    return 'Modelo não encontrado ou sem acesso para esta chave. Escolha outro modelo na lista.';
  }
  return 'Não foi possível validar agora. A chave não foi exibida nem enviada a servidores externos.';
}

export default function CredentialsView() {
  const [vault, setVault] = useState<CredentialVault>(loadVault);
  const [visible, setVisible] = useState<Record<ProviderId, boolean>>({
    gemini: false,
    openai: false,
    anthropic: false,
  });
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const persist = (next: CredentialVault, providerName: string) => {
    const withTimestamp = { ...next, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withTimestamp));
    setVault(withTimestamp);
    setTestState('idle');
    setMessage(`${providerName} salva somente neste navegador.`);
  };

  const updateKey = (provider: ProviderId, apiKey: string) => {
    setVault(current => ({
      ...current,
      [provider]: provider === 'gemini'
        ? { ...current.gemini, apiKey }
        : { apiKey },
    }));
    setTestState('idle');
    setMessage('');
  };

  const updateGeminiModel = (model: string) => {
    setVault(current => ({
      ...current,
      gemini: { ...current.gemini, model },
    }));
    setTestState('idle');
    setMessage('');
  };

  const removeKey = (provider: ProviderId, providerName: string) => {
    const next: CredentialVault = {
      ...vault,
      [provider]: provider === 'gemini'
        ? { apiKey: '', model: DEFAULT_GEMINI_MODEL }
        : { apiKey: '' },
    };
    persist(next, providerName);
    setMessage(`${providerName} removida deste navegador.`);
  };

  const testGemini = async () => {
    const apiKey = vault.gemini.apiKey.trim();
    const model = vault.gemini.model.trim() || DEFAULT_GEMINI_MODEL;
    if (!apiKey) {
      setTestState('error');
      setMessage('Cole uma chave do Google AI Studio antes de testar.');
      return;
    }

    setTestState('testing');
    setMessage(`Validando chave com modelo ${model}...`);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model,
        contents: 'Responda apenas OK.',
        config: { maxOutputTokens: 16, temperature: 0 },
      });
      if (!response.text) throw new Error('Resposta vazia');
      setTestState('success');
      setMessage(`Conexão confirmada com sucesso (${model}).`);
    } catch (error) {
      setTestState('error');
      setMessage(connectionErrorMessage(error));
    }
  };

  const KeyField = ({ provider, label, placeholder }: { provider: ProviderId; label: string; placeholder: string }) => (
    <div className="space-y-2">
      <label className="text-[12px] font-bold text-ink/70" htmlFor={`${provider}-api-key`}>
        {label}
      </label>
      <div className="relative">
        <input
          id={`${provider}-api-key`}
          type={visible[provider] ? 'text' : 'password'}
          value={vault[provider].apiKey}
          onChange={event => updateKey(provider, event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="h-11 w-full rounded-xl border border-forest/15 bg-white px-3 pr-11 font-mono text-[12px] text-ink outline-none transition focus:border-forest/35 focus:ring-2 focus:ring-forest/10 placeholder:text-ink/25"
        />
        <button
          type="button"
          onClick={() => setVisible(current => ({ ...current, [provider]: !current[provider] }))}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink/40 transition hover:bg-forest/5 hover:text-forest"
          aria-label={visible[provider] ? `Ocultar ${label}` : `Mostrar ${label}`}
        >
          {visible[provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-10">
      <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-forest" />
              <h2 className="text-[17px] font-bold text-ink">Google Gemini</h2>
              <span className="rounded-md bg-forest/8 px-2 py-1 font-mono text-[10px] font-bold text-forest">
                {vault.gemini.model || DEFAULT_GEMINI_MODEL}
              </span>
            </div>
            <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-ink/55">
              Credencial local para o Para-Organizer e Jarvis. Permanece unicamente no navegador e nunca é sincronizada externamente.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-forest/10 bg-forest/5 px-3 py-2 text-[11px] font-bold text-forest">
            <ShieldCheck className="h-4 w-4" /> Uso local neste navegador
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_260px]">
          <KeyField provider="gemini" label="Gemini API Key" placeholder="AIzaSy..." />
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-ink/70" htmlFor="gemini-model-select">
              Modelo Ativo
            </label>
            <select
              id="gemini-model-select"
              value={vault.gemini.model || DEFAULT_GEMINI_MODEL}
              onChange={e => updateGeminiModel(e.target.value)}
              className="h-11 w-full rounded-xl border border-forest/15 bg-white px-3 text-[12px] font-semibold text-ink outline-none transition focus:border-forest/35 focus:ring-2 focus:ring-forest/10"
            >
              {AVAILABLE_GEMINI_MODELS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-forest/10 pt-4">
          <button
            type="button"
            onClick={() => persist(vault, 'Chave Gemini')}
            disabled={!vault.gemini.apiKey.trim()}
            className="flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
          >
            <Save className="h-4 w-4" /> Salvar neste dispositivo
          </button>
          <button
            type="button"
            onClick={testGemini}
            disabled={testState === 'testing'}
            className="flex items-center gap-2 rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-[12px] font-bold text-forest transition hover:bg-forest/5 disabled:opacity-50"
          >
            {testState === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Wifi className="h-4 w-4" />}
            {testState === 'testing' ? 'Testando...' : 'Testar conexão'}
          </button>
          <button
            type="button"
            onClick={() => removeKey('gemini', 'Chave Gemini')}
            disabled={!vault.gemini.apiKey}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-35"
          >
            <Trash2 className="h-4 w-4" /> Remover
          </button>
        </div>

        {message && (
          <div className={`mt-4 rounded-xl border px-3.5 py-2.5 text-[12px] font-medium ${
            testState === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : testState === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-forest/10 bg-forest/5 text-forest'
          }`}>
            {message}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
        <div>
          <h3 className="text-[15px] font-bold text-ink">Outras credenciais</h3>
          <p className="mt-1 text-[12px] font-medium text-ink/50">
            Campos opcionais para integrações futuras. Salvar uma chave não ativa chamadas automaticamente.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {([
            { provider: 'openai' as const, name: 'OpenAI', placeholder: 'sk-...' },
            { provider: 'anthropic' as const, name: 'Anthropic', placeholder: 'sk-ant-...' },
          ]).map(item => (
            <div key={item.provider} className="rounded-xl border border-forest/10 bg-forest/3 p-4">
              <KeyField provider={item.provider} label={`${item.name} API Key`} placeholder={item.placeholder} />
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => persist(vault, `Chave ${item.name}`)}
                  disabled={!vault[item.provider].apiKey.trim()}
                  className="rounded-lg bg-white px-3 py-2 text-[11px] font-bold text-forest shadow-xs ring-1 ring-forest/10 transition hover:bg-forest/5 disabled:opacity-40"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => removeKey(item.provider, `Chave ${item.name}`)}
                  disabled={!vault[item.provider].apiKey}
                  className="rounded-lg px-3 py-2 text-[11px] font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-35"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] font-medium leading-relaxed text-amber-900">
        Esta configuração é totalmente local-first. As credenciais ficam salvas em localStorage isolado e nunca são transferidas para repositórios ou logs. Consulte as cotas e limites na documentação oficial de{' '}
        <a
          href="https://ai.google.dev/gemini-api/docs/rate-limits"
          target="_blank"
          rel="noreferrer"
          className="font-bold underline underline-offset-2 text-amber-950"
        >
          taxas da Gemini API
        </a>.
      </div>
    </div>
  );
}
