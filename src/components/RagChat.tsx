'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { useChat } from '@ai-sdk/react';
import { useAppStore } from '@/store/useAppStore';
import SkillsRadar from '@/components/ui/rag/SkillsRadar';
import ProjectCard from '@/components/ui/rag/ProjectCard';

const suggestionPool = [
  'Quali metriche hai raggiunto durante la B.Future Challenge?',
  'Raccontami il tirocinio al laboratorio LACAM.',
  'Come puoi aiutare un team a integrare un copilot AI?',
  'Mostrami le tue competenze in ambito AI.',
  'Portami alla sezione dei tuoi progetti!',
];

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
  const [suggestions, setSuggestions] = useState<string[]>(() => suggestionPool.slice(0, 3));
  const [sources, setSources] = useState<any[]>([]);
  const scrollAnchor = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);
  const [showGlow, setShowGlow] = useState(false);
  
  const flyToSection = useAppStore(state => state.flyToSection);
  const [localInput, setLocalInput] = useState('');

  // @ts-ignore
  const { messages, isLoading, error, append, sendMessage } = useChat({
    // @ts-ignore
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Ciao! Sono il copilot del portfolio, un agente spaziale. Chiedimi qualsiasi cosa sul percorso di Vito, oppure chiedimi di navigare verso una sezione specifica!',
      }
    ],
    onResponse: (response: any) => {
      const sourcesHeader = response.headers.get('x-rag-sources');
      if (sourcesHeader) {
        try {
          const parsedSources = JSON.parse(atob(sourcesHeader));
          if (parsedSources.length > 0) {
            setSources(parsedSources);
            setShowGlow(true);
            setTimeout(() => setShowGlow(false), 5000);
          }
        } catch (e) {
          console.error("Failed to parse sources", e);
        }
      }
    },
    onToolCall: ({ toolCall }) => {
       if (toolCall.toolName === 'MapsPortfolioSection') {
           const section = (toolCall as any).args.section;
           if (section) {
               flyToSection(section);
           }
       }
    }
  });

  const sendQuestion = (question: string) => {
      const sendMsg = append || sendMessage;
      if (sendMsg) {
          sendMsg({
              role: 'user',
              content: question
          });
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

  return (
    <div className={`flex flex-col overflow-hidden rounded-3xl border bg-white/5 backdrop-blur-2xl transition-all duration-700 w-full h-full ${
      showGlow
        ? 'border-neural-cyan/50 shadow-[0_0_80px_rgba(0,255,255,0.15)]'
        : 'border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 relative overflow-hidden">
        {showGlow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-neural-cyan/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
        <div className="z-10 flex items-center gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-neural-cyan/80">
              Spatial Agent
            </p>
            <p className="text-lg font-semibold text-white">Copilot</p>
          </div>
        </div>
        <div className="z-10 flex flex-col items-end">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="h-2 w-2 rounded-full bg-neural-cyan" />
            Online
          </div>
          {showGlow && sources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 flex items-center gap-1 rounded-full border border-neural-cyan/30 bg-neural-cyan/10 px-2 py-0.5 text-xs text-neural-cyan"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Retrieved {sources.length} docs
            </motion.div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className="border-b border-white/5 px-6 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
          Suggerimenti
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                cycleSuggestion(index);
                sendQuestion(suggestion);
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:border-neural-cyan/50 hover:text-white"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6 max-h-[28rem]">
        {messages.map((rawMessage, index) => {
          const message = rawMessage as any;
          const isAssistant = message.role === 'assistant';

          return (
            <div
              key={`${message.id}-${index}`}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              {message.content && (
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-white/10 text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                      : 'bg-neural-cyan/20 border border-neural-cyan/30 text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
                  }`}
                >
                  <p className="mb-1 text-[0.65rem] uppercase tracking-[0.4em] opacity-50">
                    {isAssistant ? 'Copilot' : 'Tu'}
                  </p>
                  <div className="space-y-3">
                    {message.content.split('\n').filter(Boolean).map((paragraph: string, idx: number) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Generative UI based on Tool Invocations */}
              {message.toolInvocations?.map((toolInvocation: any) => {
                const { toolName, toolCallId, args } = toolInvocation;

                if (toolName === 'showSkillsRadar') {
                  return <SkillsRadar key={toolCallId} />;
                }
                
                if (toolName === 'showProjectCard') {
                  return <ProjectCard key={toolCallId} projectName={(args as any).projectName} />;
                }
                
                if (toolName === 'MapsPortfolioSection') {
                  return (
                    <div key={toolCallId} className="mt-2 text-xs text-neural-cyan italic">
                      🚀 Navigazione spaziale verso {(args as any).section}...
                    </div>
                  );
                }

                return null;
              })}

              {isAssistant && message.id === messages[messages.length - 1].id && sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/50">
                  {sources.map((source) => (
                    <Badge
                      key={source.id}
                      variant="outline"
                      className="border-white/20 text-[0.6rem] text-white/70"
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
            className="flex items-center gap-3 text-sm text-neural-cyan/70"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="h-3 w-3 rounded-full bg-neural-cyan" />
            Sto analizzando lo spazio latente...
          </motion.div>
        )}
        {error && (
          <div className="text-sm text-red-400">
            Si è verificato un errore: {error.message}
          </div>
        )}
        <div ref={scrollAnchor} />
      </div>

      {/* Input */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!localInput.trim() || isLoading) return;
            const sendMsg = append || sendMessage;
            if (sendMsg) sendMsg({ role: 'user', content: localInput });
            setLocalInput('');
          }}
          className="px-6 py-5"
        >
        <div className="rounded-2xl border border-white/10 bg-white/5 focus-within:border-neural-cyan/50 transition-colors">
          <textarea
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Invia comando al copilot..."
            rows={3}
            className="h-28 w-full resize-none bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none caret-neural-cyan"
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="ml-auto">
              <button
                type="submit"
                disabled={isLoading || !localInput || localInput.trim().length < 3}
                className="rounded-full border border-neural-cyan/30 bg-neural-cyan/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-neural-cyan transition hover:bg-neural-cyan hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Invia
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
