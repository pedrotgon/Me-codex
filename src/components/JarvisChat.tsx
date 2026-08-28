import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { useStore } from '../store';

export default function JarvisChat() {
  const { jarvisMessage, isJarvisOpen, setJarvisOpen, processJarvisCommand } = useStore();
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    processJarvisCommand(input);
    setInput('');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isJarvisOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setJarvisOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-forest text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 z-50 group hover:shadow-forest/30"
          >
            <Bot className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-nude -mt-0.5 -mr-0.5 shadow-sm" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isJarvisOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className={`fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] flex flex-col border border-ink/10 rounded-[28px] overflow-hidden text-ink ${
              isExpanded ? 'w-[440px] h-[700px]' : 'w-[380px] h-[540px]'
            } max-w-[calc(100vw-32px)] max-h-[calc(100vh-48px)]`}
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-ink/5 bg-white/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[12px] bg-forest/5 text-forest flex items-center justify-center border border-forest/10">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[13px] text-ink leading-tight flex items-center gap-1.5">
                    Jarvis
                    <span className="px-1.5 py-0.5 rounded-full bg-forest/10 text-forest text-[8px] uppercase tracking-wider font-bold">Beta</span>
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium text-ink/40">Online • Llama-3 Local</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-ink/40 hover:text-ink hover:bg-forest/5 rounded-xl transition-colors"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setJarvisOpen(false)}
                  className="p-2 text-ink/40 hover:text-ink hover:bg-forest/5 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 pb-6 flex flex-col gap-4 bg-gradient-to-b from-white/30 to-nude-light/50">
              <div className="flex items-end gap-2 max-w-[85%] self-start">
                <div className="w-7 h-7 rounded-full bg-forest/5 flex items-center justify-center shrink-0 border border-forest/10">
                  <Bot className="w-4 h-4 text-forest" />
                </div>
                <div className="bg-white border border-forest/5 rounded-2xl rounded-bl-sm p-3.5 shadow-sm">
                  <p className="text-[13px] text-ink font-medium leading-relaxed">
                    Pronto, Pedro. Escreva uma frase e eu organizo no PARA.
                  </p>
                  <div className="mt-2 text-[12px] text-ink/50 bg-forest/5 p-2 rounded-lg border border-forest/10 leading-relaxed">
                    <span className="font-bold text-forest/70">Exemplo:</span> "tenho prova de Lab1 na próxima quinta-feira às 9h"
                  </div>
                </div>
              </div>

              {jarvisMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex items-end gap-2 max-w-[85%] self-end flex-row-reverse"
                >
                  <div className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold ring-2 ring-white">
                    P
                  </div>
                  <div className="bg-forest text-white rounded-2xl rounded-br-sm p-3.5 shadow-sm">
                    <p className="text-[13px] font-medium leading-relaxed">{jarvisMessage}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white/80 border-t border-forest/5 shrink-0">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Comande o seu segundo cérebro..."
                  className="w-full h-11 pl-4 pr-12 rounded-[14px] bg-nude/50 border border-forest/10 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/30 focus:bg-white transition-all text-ink placeholder:text-ink/40 shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-1.5 w-8 h-8 flex items-center justify-center rounded-[10px] bg-forest text-white disabled:opacity-40 disabled:bg-ink/10 disabled:text-ink/40 hover:bg-forest/90 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </form>
              <div className="text-center mt-3">
                <p className="text-[10px] font-medium text-ink/30 uppercase tracking-tight">O Jarvis processa linguagem natural</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
