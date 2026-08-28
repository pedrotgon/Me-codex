import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  FolderKanban, 
  Plus,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../store';
import { getGeminiCredential } from '../lib/credentials';
import { JarvisMessage, JarvisActionProposal, processJarvisMessage } from '../lib/jarvis';

export default function JarvisChat() {
  const { 
    isJarvisOpen, 
    setJarvisOpen, 
    nodes, 
    addTask, 
    addProject, 
    createRelation 
  } = useStore();

  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credential, setCredential] = useState(getGeminiCredential);
  
  const [messages, setMessages] = useState<JarvisMessage[]>([
    {
      id: 'init-1',
      sender: 'jarvis',
      text: 'Olá, Pedro! Sou o Jarvis do Më Life OS. Posso responder perguntas sobre sua base de conhecimento ou propor novas tarefas e projetos com sua aprovação.',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCredential(getGeminiCredential());
  }, [isJarvisOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: JarvisMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await processJarvisMessage(userText, nodes);
      const jarvisMsg: JarvisMessage = {
        id: `jarvis-${Date.now()}`,
        sender: 'jarvis',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        proposal: response.proposal,
        proposalStatus: response.proposal ? 'pending' : undefined,
      };
      setMessages(prev => [...prev, jarvisMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `jarvis-${Date.now()}`,
          sender: 'jarvis',
          text: 'Houve uma instabilidade momentânea na conexão. Como posso tentar ajudar novamente?',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveProposal = (msgId: string, proposal: JarvisActionProposal) => {
    if (proposal.type === 'create_task') {
      addTask(proposal.title, proposal.category || 'Inbox', undefined, {
        priority: proposal.priority || 'P 2',
      });
    } else if (proposal.type === 'create_project') {
      addProject(proposal.title, proposal.description || '', proposal.category || 'Inbox');
    }

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, proposalStatus: 'approved' };
      }
      return m;
    }));
  };

  const handleRejectProposal = (msgId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, proposalStatus: 'rejected' };
      }
      return m;
    }));
  };

  return (
    <>
      {/* Botão Flutuante de Abertura */}
      <AnimatePresence>
        {!isJarvisOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setJarvisOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-forest text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 z-50 group hover:shadow-forest/30 cursor-pointer"
            aria-label="Abrir Jarvis"
          >
            <Bot className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white shadow-xs" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Janela do Chat */}
      <AnimatePresence>
        {isJarvisOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
            className={`fixed bottom-6 right-6 z-50 bg-white/98 backdrop-blur-2xl shadow-2xl flex flex-col border border-forest/15 rounded-3xl overflow-hidden text-ink ${
              isExpanded ? 'w-[480px] h-[720px]' : 'w-[400px] h-[580px]'
            } max-w-[calc(100vw-32px)] max-h-[calc(100vh-48px)]`}
          >
            {/* Header com Provedor / Modelo Ativo */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-forest/10 bg-forest/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-forest text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[14px] text-ink leading-tight">Jarvis</h4>
                    <span className="px-2 py-0.5 rounded-md bg-forest/10 text-forest text-[9px] uppercase tracking-wider font-bold">
                      {credential.apiKey ? credential.model : 'Local Mode'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${credential.apiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                    <span className="text-[11px] font-medium text-ink/50">
                      {credential.apiKey ? 'Conectado à Gemini API' : 'Chave não configurada'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-ink/40 hover:text-ink hover:bg-forest/10 rounded-xl transition"
                  title={isExpanded ? 'Restaurar tamanho' : 'Expandir'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setJarvisOpen(false)}
                  className="p-2 text-ink/40 hover:text-ink hover:bg-forest/10 rounded-xl transition"
                  title="Fechar Jarvis"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lista de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-nude/20">
              {messages.map(msg => {
                const isJarvis = msg.sender === 'jarvis';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1 ${isJarvis ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-[13px] leading-relaxed ${
                        isJarvis
                          ? 'bg-white border border-forest/10 text-ink shadow-2xs rounded-bl-xs'
                          : 'bg-forest text-white shadow-xs rounded-br-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap font-medium">{msg.text}</p>

                      {/* Card de Proposta com Botões de Aprovação */}
                      {msg.proposal && (
                        <div className="mt-3 p-3 rounded-xl border border-forest/15 bg-forest/3 text-ink space-y-2.5">
                          <div className="flex items-center justify-between gap-2 border-b border-forest/10 pb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-forest flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Proposta do Jarvis
                            </span>
                            <span className="text-[10px] font-mono text-ink/40">
                              Confiança: {msg.proposal.confidence}%
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase text-ink/40">
                              {msg.proposal.type === 'create_task' ? 'Nova Tarefa' : 'Novo Projeto'}
                            </span>
                            <h5 className="font-bold text-[13px] text-ink mt-0.5">
                              {msg.proposal.title}
                            </h5>
                            <p className="text-[11px] text-ink/60 mt-0.5">
                              Destino: <span className="font-bold text-forest">{msg.proposal.category}</span>
                            </p>
                          </div>

                          {msg.proposalStatus === 'pending' && (
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleApproveProposal(msg.id, msg.proposal!)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-forest text-white text-[11px] font-bold shadow-xs hover:bg-forest/90 transition cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" /> Aprovar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectProposal(msg.id)}
                                className="px-3 py-1.5 rounded-lg border border-forest/20 text-ink/60 text-[11px] font-bold hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition cursor-pointer"
                              >
                                Rejeitar
                              </button>
                            </div>
                          )}

                          {msg.proposalStatus === 'approved' && (
                            <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Aprovado e integrado ao Knowledge Intake!
                            </div>
                          )}

                          {msg.proposalStatus === 'rejected' && (
                            <div className="text-[11px] font-medium text-ink/40 bg-black/5 p-2 rounded-lg">
                              Proposta recusada. Nenhuma alteração foi realizada.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-ink/30 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-ink/40 text-[12px] p-2 bg-white/60 rounded-xl w-fit">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-forest" />
                  <span>Jarvis consultando o Knowledge Intake...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Barra de Entrada de Texto */}
            <div className="p-3.5 bg-white border-t border-forest/10 shrink-0">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Pergunte ou comande o seu segundo cérebro..."
                  className="w-full h-11 pl-4 pr-12 rounded-xl bg-nude/40 border border-forest/15 text-[13px] font-medium text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30 focus:bg-white transition shadow-inner"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 w-8 h-8 flex items-center justify-center rounded-lg bg-forest text-white disabled:opacity-30 hover:bg-forest/90 transition shadow-xs cursor-pointer"
                  title="Enviar mensagem"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest/40">
                  Respostas consultivas diretas • Mutações exigem aprovação
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
