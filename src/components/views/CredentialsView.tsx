import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Save,
  ShieldCheck,
  Trash2,
  Wifi,
} from 'lucide-react';

const STORAGE_KEY = 'me_credentials_v1';
const GEMINI_MODEL = 'gemini-3.6-flash';

type ProviderId = 'gemini' | 'openai' | 'anthropic';

interface CredentialVault {
  gemini: { apiKey: string; model: string };
  openai: { apiKey: string };
  anthropic: { apiKey: string };
  updatedAt?: string;
}

const emptyVault: CredentialVault = {
  gemini: { apiKey: '', model: GEMINI_MODEL },
  openai: { apiKey: '' },
  anthropic: { apiKey: '' },
};

function loadVault(): CredentialVault {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyVault;
    const parsed = JSON.parse(raw) as Partial<CredentialVault>;
    return {
      gemini: { apiKey: parsed.gemini?.apiKey || '', model: GEMINI_MODEL },
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
  if (value.includes('401') || value.includes('403') || value.includes('api key')) {
    return 'A chave foi recusada. Confirme se ela pertence a um projeto com a Gemini API habilitada.';
  }
  return 'Não foi possível validar agora. A chave não foi exibida nem enviada ao Knowledge Intake.';
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
        ? { apiKey, model: GEMINI_MODEL }
        : { apiKey },
    }));
    setTestState('idle');
    setMessage('');
  };

  const removeKey = (provider: ProviderId, providerName: string) => {
    const next: CredentialVault = {
      ...vault,
      [provider]: provider === 'gemini'
        ? { apiKey: '', model: GEMINI_MODEL }
        : { apiKey: '' },
    };
    persist(next, providerName);
    setMessage(`${providerName} removida deste navegador.`);
  };

  const testGemini = async () => {
    const apiKey = vault.gemini.apiKey.trim();
    if (!apiKey) {
      setTestState('error');
      setMessage('Cole uma chave do Google AI Studio antes de testar.');
      return;
    }

    setTestState('testing');
    setMessage('Validando a chave com uma solicitação mínima...');
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: 'Responda somente com a palavra OK.',
        config: { maxOutputTokens: 32, temperature: 0 },
      });
      if (!response.text) throw new Error('empty response');
      setTestState('success');
      setMessage(`Conexão confirmada com ${GEMINI_MODEL}.`);
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
                {GEMINI_MODEL}
              </span>
            </div>
            <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-ink/55">
              Credencial de rascunho para testar a análise do Para-Organizer. Ela não faz parte do Knowledge Intake.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-forest/10 bg-forest/5 px-3 py-2 text-[11px] font-bold text-forest">
            <ShieldCheck className="h-4 w-4" /> Uso local neste navegador
          </div>
        </div>

        <div className="mt-5">
          <KeyField provider="gemini" label="Gemini API Key" placeholder="Cole a chave criada no Google AI Studio" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-forest/10 pt-4">
          <button
            type="button"
            onClick={() => persist(vault, 'Chave Gemini')}
            disabled={!vault.gemini.apiKey.trim()}
            className="flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save className="h-4 w-4" /> Salvar neste dispositivo
          </button>
          <button
            type="button"
            onClick={testGemini}
            disabled={testState === 'testing'}
            className="flex items-center gap-2 rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-[12px] font-bold text-forest transition hover:bg-forest/5 disabled:opacity-50"
          >
            {testState === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
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
          <div className={`mt-4 rounded-xl border px-3 py-2.5 text-[12px] font-medium ${
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
            <div key={item.provider} className="rounded-xl border border-forest/10 bg-nude-light p-4">
              <KeyField provider={item.provider} label={`${item.name} API Key`} placeholder={item.placeholder} />
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => persist(vault, `Chave ${item.name}`)}
                  disabled={!vault[item.provider].apiKey.trim()}
                  className="rounded-lg bg-white px-3 py-2 text-[11px] font-bold text-forest shadow-sm ring-1 ring-forest/10 transition hover:bg-forest/5 disabled:opacity-40"
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
        Esta configuração é adequada apenas ao teste privado atual. Antes de produção, as chamadas devem passar por um backend e a chave deve migrar para um cofre de segredos. No plano gratuito, o conteúdo enviado pode ser usado pelo Google para melhorar seus produtos; não teste inicialmente com documentos pessoais sensíveis. As cotas variam por projeto e podem ser consultadas na página oficial de{' '}
        <a
          href="https://ai.google.dev/gemini-api/docs/rate-limits"
          target="_blank"
          rel="noreferrer"
          className="font-bold underline underline-offset-2"
        >
          limites da Gemini API
        </a>.
      </div>
    </div>
  );
}
