'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';

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
  'Qual è il tuo approccio alla explainable analytics?',
  'Che risultati avete ottenuto con la B.Future Challenge 2025?'
];

const initialAssistant: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Ciao! Sono il copilot del portfolio. Posso raccontarti esperienze, metriche e focus di Vito. Chiedimi qualsiasi cosa sul suo percorso.',
};

function formatAnswer(text: string) {
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

export default function RagChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistant]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(() => suggestionPool.slice(0, 3));
  const scrollAnchor = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);

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
        body: JSON.stringify({ question: prompt }),
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
    // Run client-side to keep SSR markup deterministic and avoid hydration mismatches
    setSuggestions(getInitialSuggestions(3));
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    scrollAnchor.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="rounded-3xl border border-white/10 bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Copilot</p>
          <p className="text-lg font-semibold text-white">Chat con il profilo</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="h-2 w-2 rounded-full bg-neural-cyan" />
          Online
        </div>
      </div>

      <div className="border-b border-white/5 px-6 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Suggerimenti</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                cycleSuggestion(index);
                sendQuestion(suggestion);
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:border-neural-cyan/60 hover:text-white"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="flex max-h-[28rem] flex-col gap-4 overflow-y-auto px-6 py-6">
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';
          return (
            <div key={message.id} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isAssistant
                    ? 'bg-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                    : 'bg-neural-cyan text-black shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
                }`}
              >
                <p className="mb-1 text-[0.65rem] uppercase tracking-[0.4em] opacity-70">
                  {isAssistant ? 'Copilot' : 'Tu'}
                </p>
                <div className="space-y-3">
                  {formatAnswer(message.content).map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
                  {message.sources.map((source) => (
                    <Badge key={source.id} variant="outline" className="border-white/20 text-[0.6rem] text-white/80">
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
            className="flex items-center gap-3 text-sm text-white/70"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="h-3 w-3 rounded-full bg-neural-cyan" />
            Sto recuperando le informazioni e generando la risposta...
          </motion.div>
        )}
        <div ref={scrollAnchor} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendQuestion();
        }}
        className="border-t border-white/5 px-6 py-5"
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 focus-within:border-neural-cyan/60">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Scrivi la tua domanda..."
            rows={3}
            className="h-28 w-full resize-none bg-transparent px-4 py-3 text-sm text-white/90 placeholder-white/50 outline-none"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || input.trim().length < 3}
              className="rounded-full border border-white/30 bg-transparent px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-neural-cyan hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              Invia
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
