'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiMessageCircle, FiX, FiCpu } from 'react-icons/fi';
import { useAppStore } from '@/store/useAppStore';
import type { EmbedderState } from '@/lib/rag/embedder';
import { useCopilotChat } from '@/hooks/useCopilotChat';
import CopilotMessage from '@/components/ui/copilot/CopilotMessage';
import CopilotInput from '@/components/ui/copilot/CopilotInput';

function prettyError(err: Error | undefined, isEn: boolean): string {
  if (!err) return isEn ? 'An error occurred.' : 'Si è verificato un errore.';
  try {
    const parsed = JSON.parse(err.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    /* il body non era JSON */
  }
  return err.message || (isEn ? 'An error occurred.' : 'Si è verificato un errore.');
}

function EmbedderDot({ state, isEn }: { state: EmbedderState, isEn: boolean }) {
  if (state === 'error') return null; // degradazione silenziosa
  const label =
    state === 'ready'
      ? (isEn ? 'semantic retrieval active' : 'retrieval semantico attivo')
      : (isEn ? 'loading semantic model…' : 'carico il modello semantico…');
  return (
    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/40">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          state === 'ready' ? 'bg-leaf' : 'animate-pulse bg-accent-soft'
        }`}
      />
      {label}
    </span>
  );
}

export default function CopilotOverlay() {
  const copilotOpen = useAppStore((s) => s.copilotOpen);
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const flyToSection = useAppStore((s) => s.flyToSection);
  const reduceMotion = useReducedMotion();
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';

  const [input, setInput] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});
  const endRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    status,
    error,
    busy,
    submit,
    embedderState,
    suggestions,
    isLoadingSuggestions,
    handleSuggestionClick
  } = useCopilotChat();

  // Auto-scroll in fondo a ogni aggiornamento.
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [messages, status, reduceMotion]);

  const handleFeedback = async (messageId: string, score: number, aiResponseText: string, userQuestionText: string) => {
    if (feedbackGiven[messageId]) return;
    setFeedbackGiven(prev => ({ ...prev, [messageId]: true }));
    try {
      await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, score, aiResponseText, userQuestionText })
      });
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  const handleSubmit = () => {
    if (submit(input)) {
      setInput('');
    }
  };

  return (
    <>
      {/* Launcher flottante */}
      <AnimatePresence>
        {!copilotOpen && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCopilotOpen(true)}
            aria-label={isEn ? 'Open portfolio copilot' : 'Apri il copilot del portfolio'}
            className="glass-panel fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-accent-soft transition-colors hover:text-white"
          >
            <FiMessageCircle className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Pannello */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? 'Portfolio copilot' : 'Copilot del portfolio'}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel bg-zinc-950/95 backdrop-blur-xl shadow-2xl fixed inset-y-0 right-0 z-50 flex w-full flex-col sm:inset-y-3 sm:right-3 sm:w-[420px] sm:rounded-2xl"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2 text-sm font-medium text-white">
                  <FiCpu className="h-4 w-4 text-accent" />
                  Copilot
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                    BM25 + e5 · {process.env.NEXT_PUBLIC_LLM_PROVIDER || 'AI'}
                  </span>
                </span>
                <EmbedderDot state={embedderState} isEn={isEn} />
              </div>
              <button
                onClick={() => setCopilotOpen(false)}
                aria-label={isEn ? 'Close copilot' : 'Chiudi il copilot'}
                className="rounded-full p-2 text-white/50 transition-colors hover:text-white"
              >
                <FiX className="h-4 w-4" />
              </button>
            </header>

            {/* Messaggi */}
            <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 text-sm text-white/85">
              {messages.length === 0 && (
                <div className="flex h-full flex-col justify-end gap-3 pb-2">
                  <p className="text-white/55">
                    {isEn ? "Ask me about Vito's thesis, projects, or background: I only answer based on portfolio documents, citing sources." : 'Chiedimi della tesi, dei progetti o del percorso di Vito: rispondo solo sulla base dei documenti del portfolio, citando le fonti.'}
                  </p>
                  <div className="flex flex-col items-start gap-2">
                    {isLoadingSuggestions ? (
                      // Skeleton loader per i suggerimenti
                      Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-6 w-48 animate-pulse rounded-full bg-white/5"
                        />
                      ))
                    ) : (
                      suggestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSuggestionClick(q)}
                          className="hairline rounded-full border bg-white/5 px-3 py-1.5 text-left text-xs text-white/75 transition-colors hover:bg-accent/15 hover:text-white"
                        >
                          {q}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <CopilotMessage
                  key={message.id}
                  message={message}
                  messages={messages}
                  flyToSection={flyToSection}
                  setCopilotOpen={setCopilotOpen}
                  feedbackGiven={feedbackGiven}
                  onFeedback={handleFeedback}
                />
              ))}

              {status === 'submitted' && (
                <p className="font-mono text-[11px] text-white/40">
                  <span className="animate-pulse">{isEn ? 'retrieval in progress…' : 'retrieval in corso…'}</span>
                </p>
              )}
              {status === 'error' && (
                <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                  {prettyError(error, isEn)}
                </p>
              )}

              {/* Suggerimenti persistenti */}
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestionClick(q)}
                      className="hairline rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-left text-[11px] text-white/70 transition-colors hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent-soft)]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
            <CopilotInput
              input={input}
              setInput={setInput}
              onSubmit={handleSubmit}
              busy={busy}
              copilotOpen={copilotOpen}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
