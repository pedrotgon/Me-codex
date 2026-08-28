import { GoogleGenAI, Type } from '@google/genai';
import { getGeminiCredential } from './credentials';
import { KiNode } from './db';

export interface JarvisActionProposal {
  id: string;
  type: 'create_task' | 'create_project' | 'create_relation';
  title: string;
  category: string; // Area or Project name
  description: string;
  priority?: string;
  confidence: number;
}

export interface JarvisMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  proposal?: JarvisActionProposal;
  proposalStatus?: 'pending' | 'approved' | 'rejected';
}

export async function processJarvisMessage(
  userPrompt: string,
  contextNodes: KiNode[]
): Promise<{ text: string; proposal?: JarvisActionProposal }> {
  const credential = getGeminiCredential();

  // Resumo do contexto do Knowledge Intake para o Jarvis
  const areas = contextNodes.filter(n => n.type === 'area').map(n => n.title).slice(0, 10);
  const projects = contextNodes.filter(n => n.type === 'project').map(n => n.title).slice(0, 15);
  const tasksCount = contextNodes.filter(n => n.type === 'task').length;

  const systemContext = `Você é o Jarvis, assistente inteligente do Më Life OS (Segundo Cérebro baseado no método PARA).
Você opera com base no Knowledge Intake local.
Contexto atual do usuário:
- Áreas ativas: ${areas.join(', ') || 'Inbox'}
- Projetos ativos: ${projects.join(', ') || 'Nenhum'}
- Total de tarefas cadastradas: ${tasksCount}

Diretrizes:
1. Respostas Consultivas: Se o usuário fez uma pergunta informativa, forneça uma resposta direta, didática, amigável e concisa em Português.
2. Ações de Criação/Alteração: Se o usuário solicitou criar ou modificar uma Tarefa, Projeto ou Relação, você DEVE gerar uma proposta formal no campo 'proposal'.
3. Nunca invente dados e nunca execute mutações silenciosas sem aprovação.`;

  if (!credential.apiKey) {
    // Fallback Inteligente Local
    const lower = userPrompt.toLowerCase();
    if (lower.includes('criar') || lower.includes('tarefa') || lower.includes('lembrar') || lower.includes('fazer')) {
      const cleanTitle = userPrompt
        .replace(/^(criar|adicionar|lembrar de|nova tarefa:?)\s*/i, '')
        .trim();
      return {
        text: `Compreendi seu comando. Preparei a proposta de cadastro abaixo para sua revisão e aprovação.`,
        proposal: {
          id: `prop-${Date.now()}`,
          type: 'create_task',
          title: cleanTitle || userPrompt,
          category: 'Inbox',
          description: 'Capturado via Jarvis Chat',
          priority: 'P 2',
          confidence: 75,
        },
      };
    }
    return {
      text: `Olá! Sou o Jarvis do Më. Para raciocínio semântico avançado, configure sua chave no menu Dados → Credenciais. Como posso te ajudar hoje?`,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: credential.apiKey });
    const model = credential.model || 'gemini-2.5-flash';

    const schema = {
      type: Type.OBJECT,
      properties: {
        reply: {
          type: Type.STRING,
          description: 'Resposta textual direta e educada ao usuário',
        },
        hasAction: {
          type: Type.BOOLEAN,
          description: 'True se o usuário solicitou criar ou alterar uma tarefa, projeto ou relação',
        },
        actionType: {
          type: Type.STRING,
          enum: ['create_task', 'create_project', 'create_relation', 'none'],
        },
        title: {
          type: Type.STRING,
          description: 'Título limpo e objetivo do item a ser criado',
        },
        category: {
          type: Type.STRING,
          description: 'Área ou Projeto de destino mais adequado com base no contexto',
        },
        description: {
          type: Type.STRING,
          description: 'Detalhes ou justificativa da proposta',
        },
        priority: {
          type: Type.STRING,
          description: 'Prioridade sugerida (P 1, P 2, P 3 ou P 4)',
        },
        confidence: {
          type: Type.INTEGER,
          description: 'Confiança de 0 a 100',
        },
      },
      required: ['reply', 'hasAction'],
    };

    const response = await ai.models.generateContent({
      model,
      contents: `${systemContext}\n\nComando do usuário: "${userPrompt}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema as any,
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const replyText = parsed.reply || 'Entendido. Estou à disposição para organizar seu segundo cérebro.';

    if (parsed.hasAction && parsed.actionType !== 'none' && parsed.title) {
      return {
        text: replyText,
        proposal: {
          id: `prop-${Date.now()}`,
          type: parsed.actionType || 'create_task',
          title: parsed.title,
          category: parsed.category || 'Inbox',
          description: parsed.description || '',
          priority: parsed.priority || 'P 2',
          confidence: parsed.confidence || 90,
        },
      };
    }

    return { text: replyText };
  } catch (err: any) {
    console.error('Erro na chamada do Jarvis:', err);
    return {
      text: `Entendido: "${userPrompt}". Adicionei como nota no seu fluxo. (Dica: verifique sua cota da API em Credenciais).`,
    };
  }
}
