'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function RagChatOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(() => suggestionPool.slice(0, 3));
  const [sources, setSources] = useState<any[]>([]);
  const scrollAnchor = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);
  const [showGlow, setShowGlow] = useState(false);
  
  const flyToSection = useAppStore(state => state.flyToSection);
  const [localInput, setLocalInput] = useState('');
  const processedTools = useRef<Set<string>>(new Set());

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
    }
  });

  useEffect(() => {
    messages.forEach((m: any) => {
      const invocations = (m.toolInvocations && m.toolInvocations.length > 0) 
        ? m.toolInvocations 
        : (m.parts?.filter((p: any) => p.type === 'tool-invocation' || p.toolCallId).map((p: any) => {
            if (p.toolInvocation) return p.toolInvocation;
            return {
              toolCallId: p.toolCallId,
              toolName: p.type?.startsWith('tool-') ? p.type.substring(5) : p.toolName,
              args: p.input || p.args || {},
              state: p.state === 'output-available' ? 'result' : p.state || 'call'
            };
          }) || []);
      
      invocations.forEach((inv: any) => {
        if (!inv) return;
        if (inv.state === 'call' || inv.state === 'result') {
          if (!processedTools.current.has(inv.toolCallId)) {
            processedTools.current.add(inv.toolCallId);
            if (inv.toolName === 'MapsPortfolioSection') {
              const section = inv.args?.section;
              if (section) {
                flyToSection(section);
              } else {
                // LLM generated empty args, fallback to guessing based on last user message
                const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user');
                const lastUserMessageContent = (lastUserMessage as any)?.content || '';
                const text = lastUserMessageContent.toLowerCase();
                const guessedSection = 
                  (text.includes('home') || text.includes('inizio') || text.includes('hero')) ? 'hero' :
                  (text.includes('about') || text.includes('chi sono') || text.includes('esperienza') || text.includes('lavoro')) ? 'about' : 
                  (text.includes('skills') || text.includes('competenze') || text.includes('tecnolog')) ? 'skills' : 
                  (text.includes('contat') || text.includes('contart') || text.includes('mail') || text.includes('linkedin') || text.includes('telef')) ? 'contact' : 
                  'projects';
                
                flyToSection(guessedSection);
              }
            }
          }
        }
      });
    });
  }, [messages, flyToSection]);

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
      scrollAnchor.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading]);

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-2xl transition-all hover:border-white/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen
            ? '0 0 30px rgba(255, 255, 255, 0.1)'
            : [
                '0 0 20px rgba(255, 255, 255, 0.05)',
                '0 0 30px rgba(255, 255, 255, 0.1)',
                '0 0 20px rgba(255, 255, 255, 0.05)',
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

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border bg-white/5 backdrop-blur-2xl transition-all duration-700 sm:w-[420px] ${
              showGlow
                ? 'border-neural-cyan/50 shadow-[0_0_80px_rgba(0,255,255,0.15)]'
                : 'border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)]'
            }`}
            style={{ maxHeight: 'calc(100vh - 8rem)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3 relative overflow-hidden">
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
                  <p className="text-[0.55rem] uppercase tracking-[0.5em] text-neural-cyan/80">
                    Spatial Agent
                  </p>
                  <p className="text-sm font-semibold text-white">Copilot</p>
                </div>
              </div>
              <div className="z-10 flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-[0.6rem] text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-neural-cyan" />
                  Online
                </div>
                <AnimatePresence>
                  {showGlow && sources.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 flex items-center gap-1 rounded-full border border-neural-cyan/30 bg-neural-cyan/10 px-2 py-0.5 text-[0.55rem] text-neural-cyan"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Retrieved {sources.length} docs
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
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] text-white/70 transition hover:border-neural-cyan/50 hover:text-white"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4 overscroll-contain" style={{ maxHeight: '320px' }} data-lenis-prevent="true">
              {messages.map((rawMessage, index) => {
                const message = rawMessage as any;
                const isAssistant = message.role === 'assistant';
                const content = message.content || message.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '';
                const invocations = (message.toolInvocations && message.toolInvocations.length > 0) 
                  ? message.toolInvocations 
                  : (message.parts?.filter((p: any) => p.type === 'tool-invocation' || p.toolCallId).map((p: any) => {
                      if (p.toolInvocation) return p.toolInvocation;
                      return {
                        toolCallId: p.toolCallId,
                        toolName: p.type?.startsWith('tool-') ? p.type.substring(5) : p.toolName,
                        args: p.input || p.args || {},
                        state: p.state === 'output-available' ? 'result' : p.state || 'call'
                      };
                    }) || []);

                if (isAssistant) {
                  console.log('DEBUG MSG:', { id: message.id, content, invocations, raw: message });
                }

                return (
                  <div
                    key={`${message.id}-${index}`}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    {content && (
                      <div
                        className={`max-w-[90%] rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
                          isAssistant
                            ? 'bg-white/10 text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                            : 'bg-neural-cyan/20 border border-neural-cyan/30 text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
                        }`}
                      >
                        <p className="mb-1 text-[0.5rem] uppercase tracking-[0.4em] opacity-50">
                          {isAssistant ? 'Copilot' : 'Tu'}
                        </p>
                        <div className="space-y-2">
                          {content.split('\n').filter(Boolean).map((paragraph: any, idx: any) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Generative UI based on Tool Invocations */}
                    {invocations.map((toolInvocation: any) => {
                      const { toolName, toolCallId, args } = toolInvocation;

                      if (toolName === 'showSkillsRadar') {
                        return <SkillsRadar key={toolCallId} />;
                      }
                      
                      if (toolName === 'showProjectCard') {
                        return <ProjectCard key={toolCallId} projectName={(args as any)?.projectName || ''} />;
                      }
                      
                      if (toolName === 'MapsPortfolioSection') {
                        const sectionName = (args as any)?.section || 'una sezione pertinente';
                        return (
                          <div key={toolCallId} className="mt-2 text-[0.6rem] text-neural-cyan italic">
                            🚀 Navigazione spaziale verso {sectionName}
                          </div>
                        );
                      }

                      return null;
                    })}

                    {isAssistant && message.id === messages[messages.length - 1].id && sources.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1 text-[0.5rem] text-white/50">
                        {sources.map((source) => (
                          <Badge
                            key={source.id}
                            variant="outline"
                            className="border-white/20 text-[0.5rem] text-white/70"
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
                  className="flex items-center gap-2 text-xs text-neural-cyan/70"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <span className="h-2 w-2 rounded-full bg-neural-cyan" />
                  Sto analizzando lo spazio latente...
                </motion.div>
              )}
              {error && (
                <div className="text-xs text-red-400">
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
              className="border-t border-white/5 px-5 py-3"
            >
              <div className="rounded-xl border border-white/10 bg-white/5 focus-within:border-neural-cyan/50 transition-colors">
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
                  rows={2}
                  className="h-16 w-full resize-none bg-transparent px-3 py-2 text-xs text-white placeholder-white/30 outline-none caret-neural-cyan"
                  style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                />
                <div className="flex items-center justify-between px-3 pb-2">
                  <div className="ml-auto">
                    <button
                      type="submit"
                      disabled={isLoading || !localInput || localInput.trim().length < 3}
                      className="rounded-full border border-neural-cyan/30 bg-neural-cyan/10 px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-neural-cyan transition hover:bg-neural-cyan hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
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
