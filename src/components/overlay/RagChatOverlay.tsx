'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';

/* ÔöÇÔöÇÔöÇ Types ÔöÇÔöÇÔöÇ */
interface RagSource {
  id: string;
  title: string;
  summary?: string;
  tags?: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: RagSource[];
}

const suggestionPool = [
  'Quali metriche hai raggiunto durante la B.Future Challenge?',
  'Raccontami il tirocinio al laboratorio LACAM.',
  'Come puoi aiutare un team a integrare un copilot AI?',
  'Che stack usi per orchestrare LangGraph e LangChain?',
  'Come hai integrato n8n nei flussi CRM e marketing?',
  'Che tipo di dashboard Next.js hai creato per spiegare le raccomandazioni?',
  'In che modo guidi un discovery workshop per copilot enterprise?',
  'Qual ├¿ il tuo approccio alla explainable analytics?',
  'Che risultati avete ottenuto con la B.Future Challenge 2025?',
];

const initialAssistant: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Ciao! Sono il copilot del portfolio. Posso raccontarti esperienze, metriche e focus di Vito. Chiedimi qualsiasi cosa sul suo percorso.',
};

function formatAnswer(text?: string) {
  if (!text) return [];
  return text
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function pickRandomSuggestion(exclude: string[] = []) {
  const available = suggestionPool.filter((item) => !exclude.includes(item));
  const pool = available.length > 0 ? available : suggestionPool;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getInitialSuggestions(count: number) {
  const selections: string[] = [];
  for (let i = 0; i < count; i += 1) {
    selections.push(pickRandomSuggestion(selections));
  }
  return selections;
}

export default function RagChatOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistant]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(() => suggestionPool.slice(0, 3));
  
  const scrollAnchor = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);

  // Per conservare i sources (il header arriva alla prima risposta dello stream)
  const [showGlow, setShowGlow] = useState(false);

  const sendQuestion = async (question?: string) => {
    const prompt = (question ?? input).trim();
    if (!prompt) return;
    setError('');
    setInput('');
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: prompt,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Il copilot non è disponibile.');
      }
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      if (data.sources && data.sources.length > 0) {
        setShowGlow(true);
        setTimeout(() => setShowGlow(false), 5000);
      }
    } catch (err) {
      const fallback: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          err instanceof Error
            ? err.message
            : 'Si è verificato un errore inatteso. Riprova fra qualche secondo.',
      };
      setMessages((prev) => [...prev, fallback]);
      setError('Impossibile completare la richiesta.');
    } finally {
      setIsLoading(false);
    }
  };

  const cycleSuggestion = (index: number) => {
    setSuggestions((prev) => {
      const next = [...prev];
      const exclude = next.filter((_, idx) => idx !== index);
      next[index] = pickRandomSuggestion(exclude);
      return next;
    });
  };

  useEffect(() => {
    setSuggestions(getInitialSuggestions(3));
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (scrollAnchor.current) {
      const rect = scrollAnchor.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!isVisible) {
        scrollAnchor.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [messages, isLoading]);

  const latestSources = messages.filter(m => m.role === 'assistant' && m.sources && m.sources.length > 0).pop()?.sources || [];

  return (
    <>
      {/* ÔöÇÔöÇÔöÇ Floating trigger button ÔöÇÔöÇÔöÇ */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#5DE0E6]/25 bg-black/80 text-[#5DE0E6] shadow-[0_0_30px_rgba(93,224,230,0.15)] backdrop-blur-xl transition-all hover:border-[#5DE0E6]/50 hover:shadow-[0_0_40px_rgba(93,224,230,0.25)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen
            ? '0 0 30px rgba(93, 224, 230, 0.3)'
            : [
                '0 0 20px rgba(93, 224, 230, 0.1)',
                '0 0 30px rgba(93, 224, 230, 0.2)',
                '0 0 20px rgba(93, 224, 230, 0.1)',
              ],
        }}
        transition={isOpen ? {} : { repeat: Infinity, duration: 2 }}
        aria-label="Apri Copilot Chat"
      >
        {isOpen ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9h.01M12 9h.01M16 9h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </motion.button>

      {/* ÔöÇÔöÇÔöÇ Chat panel ÔöÇÔöÇÔöÇ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-black/90 backdrop-blur-2xl transition-all duration-700 sm:w-[420px] ${
              showGlow
                ? 'border-[#5DE0E6] shadow-[0_0_80px_rgba(93,224,230,0.4)]'
                : 'border-[#5DE0E6]/15 shadow-[0_0_60px_rgba(93,224,230,0.1)]'
            }`}
            style={{ maxHeight: 'calc(100vh - 8rem)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3 relative overflow-hidden">
              {showGlow && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5DE0E6]/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              )}
              <div className="z-10 flex items-center gap-2">
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.5em] text-[#5DE0E6]/50">
                    Copilot
                  </p>
                  <p className="text-sm font-semibold text-white">Chat con il profilo</p>
                </div>
              </div>
              <div className="z-10 flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-[0.6rem] text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5DE0E6]" />
                  Online
                </div>
                <AnimatePresence>
                  {showGlow && latestSources.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 flex items-center gap-1 rounded-full border border-[#5DE0E6]/40 bg-[#5DE0E6]/10 px-2 py-0.5 text-[0.55rem] text-[#5DE0E6]"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Retrieved {latestSources.length} docs
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Suggestions */}
            <div className="border-b border-white/5 px-5 py-3">
              <p className="text-[0.55rem] uppercase tracking-[0.3em] text-white/30">
                Suggerimenti
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      cycleSuggestion(index);
                      sendQuestion(suggestion);
                    }}
                    className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[0.65rem] text-white/70 transition hover:border-[#5DE0E6]/40 hover:text-white"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4" style={{ maxHeight: '320px' }}>
              {messages.map((message) => {
                const isAssistant = message.role === 'assistant';

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-white/8 text-white/90'
                          : 'bg-[#5DE0E6]/10 border border-[#5DE0E6]/15 text-white'
                      }`}
                    >
                      <p className="mb-1 text-[0.5rem] uppercase tracking-[0.4em] opacity-50">
                        {isAssistant ? 'Copilot' : 'Tu'}
                      </p>
                      <div className="space-y-2">
                        {formatAnswer(message.content).map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    {isAssistant && message.sources && message.sources.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1 text-[0.5rem] text-white/50">
                        {message.sources.map((source) => (
                          <Badge
                            key={source.id}
                            variant="outline"
                            className="border-white/15 text-[0.5rem] text-[#5DE0E6]/70"
                          >
                            {source.title}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <motion.div
                  className="flex items-center gap-2 text-xs text-white/50"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <span className="h-2 w-2 rounded-full bg-[#5DE0E6]" />
                  Sto recuperando le informazioni...
                </motion.div>
              )}
              <div ref={scrollAnchor} />
            </div>

            {/* Input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                sendQuestion();
              }} 
              className="border-t border-white/5 px-5 py-3"
            >
              <div className="rounded-xl border border-white/8 bg-white/5 focus-within:border-[#5DE0E6]/30">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendQuestion();
                    }
                  }}
                  placeholder="Scrivi la tua domanda..."
                  rows={2}
                  className="h-16 w-full resize-none bg-transparent px-3 py-2 text-xs text-white placeholder-white/30 outline-none caret-[#5DE0E6]"
                  style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                />
                <div className="flex items-center justify-between px-3 pb-2">
                  {error && <p className="text-[0.6rem] text-red-400">{error}</p>}
                  <div className="ml-auto">
                    <button
                      type="submit"
                      disabled={isLoading || input.trim().length < 3}
                      className="rounded-full border border-[#5DE0E6]/25 bg-transparent px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[#5DE0E6] transition hover:bg-[#5DE0E6]/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Invia
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
