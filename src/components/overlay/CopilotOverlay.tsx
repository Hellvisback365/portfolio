'use client';

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiArrowUp, FiCpu, FiMessageCircle, FiX } from 'react-icons/fi';
import { useAppStore } from '@/store/useAppStore';
import {
  embedQuery,
  getEmbedderState,
  subscribeEmbedder,
  warmupEmbedder,
  type EmbedderState,
} from '@/lib/rag/embedder';
import ProjectCard from '@/components/ui/rag/ProjectCard';
import SkillsRadar from '@/components/ui/rag/SkillsRadar';

/**
 * Copilot del portfolio — client del nuovo stack RAG.
 *
 * - useChat (AI SDK v6): messaggi a `parts`, streaming nativo, storico
 *   completo inviato al server (il vecchio client perdeva tutto con
 *   `messages.slice(-1)` lato API).
 * - All'apertura parte il warmup di multilingual-e5-small nel browser;
 *   ogni invio prova a calcolare il query vector con un budget di 2 s:
 *   se il modello non è pronto si manda null e il server lavora in
 *   BM25-only. La chat non aspetta mai l'embedding.
 * - Le parts vengono renderizzate per tipo: testo, chips fonti
 *   (`data-sources`), card progetto, radar skills, navigazione.
 */

interface SourceChip {
  tag: string;
  id: string;
  title: string;
  category: string;
  score: number;
}

const SUGGESTIONS = [
  'Di cosa parla la tesi di Vito?',
  'Raccontami del progetto Zenith',
  'Che esperienza ha con i sistemi RAG?',
];

// Narrowing helper: con UIMessage non parametrizzato le parts custom
// arrivano come union larga; concentriamo qui i cast controllati.
type AnyPart = { type: string } & Record<string, unknown>;

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

function prettyError(err: Error | undefined): string {
  if (!err) return 'Si è verificato un errore.';
  try {
    const parsed = JSON.parse(err.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    /* il body non era JSON */
  }
  return err.message || 'Si è verificato un errore.';
}

function EmbedderDot({ state }: { state: EmbedderState }) {
  if (state === 'error') return null; // degradazione silenziosa
  const label =
    state === 'ready'
      ? 'retrieval semantico attivo'
      : 'carico il modello semantico…';
  return (
    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/40">
      <span
        className={`h-1.5 w-1.5 rounded-full ${state === 'ready' ? 'bg-leaf' : 'animate-pulse bg-accent-soft'
          }`}
      />
      {label}
    </span>
  );
}

function SourceChips({ sources }: { sources: SourceChip[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {sources.map((s) => (
        <span
          key={s.id}
          title={`${s.category} · score ${s.score}`}
          className="hairline rounded-full border bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent-soft"
        >
          {s.tag} · {s.title}
        </span>
      ))}
    </div>
  );
}

export default function CopilotOverlay() {
  const copilotOpen = useAppStore((s) => s.copilotOpen);
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const flyToSection = useAppStore((s) => s.flyToSection);
  const reduceMotion = useReducedMotion();

  const [input, setInput] = useState('');
  const [embedderState, setEmbedderState] = useState<EmbedderState>(() =>
    getEmbedderState(),
  );
  const processedTools = useRef<Set<string>>(new Set());
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inFlightRef = useRef(false);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    [],
  );
  const { messages, sendMessage, status, error } = useChat({ transport });
  const busy = status === 'submitted' || status === 'streaming';

  // Sottoscrizione permanente allo stato dell'embedder.
  useEffect(() => subscribeEmbedder(setEmbedderState), []);

  // Warmup in background appena la pagina è idle (non all'apertura del
  // pannello): così il modello è quasi sempre già caldo quando l'utente
  // scrive, e la prima risposta è già ibrida invece che solo-BM25.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(() => warmupEmbedder(), { timeout: 4000 });
    } else {
      timeoutId = setTimeout(() => warmupEmbedder(), 2500);
    }
    return () => {
      if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Focus sulla textarea quando il pannello si apre.
  useEffect(() => {
    if (copilotOpen) textareaRef.current?.focus();
  }, [copilotOpen]);

  // Side-effect dei tool di navigazione: una sola volta per toolCallId.
  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts as AnyPart[]) {
        if (
          part.type === 'tool-navigateToSection' &&
          part.state === 'output-available' &&
          typeof part.toolCallId === 'string' &&
          !processedTools.current.has(part.toolCallId)
        ) {
          processedTools.current.add(part.toolCallId);
          const args = part.input as { section?: string } | undefined;
          if (args?.section) flyToSection(args.section);
        }
      }
    }
  }, [messages, flyToSection]);

  // Auto-scroll in fondo a ogni aggiornamento.
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [messages, status, reduceMotion]);

  const submit = useCallback(
    (raw?: string) => {
      const text = (raw ?? input).trim();
      // Lock sincrono: il guard `busy` diventa true solo DOPO sendMessage,
      // quindi durante il calcolo dell'embedding non protegge da un doppio
      // invio. Questo ref si imposta subito e rende submit idempotente.
      if (!text || busy || inFlightRef.current) return;
      inFlightRef.current = true;
      setInput('');
      // Non blocchiamo l'invio sull'embedding: se il modello è già caldo
      // alleghiamo il vettore (attesa breve e limitata), altrimenti partiamo
      // subito in BM25-only. Niente freeze in attesa del download del modello.
      const attachVector = getEmbedderState() === 'ready';
      void (async () => {
        try {
          const queryVector = attachVector
            ? await withTimeout(embedQuery(text), 1500, null)
            : null;
          sendMessage({ text }, { body: { queryVector } });
        } finally {
          inFlightRef.current = false;
        }
      })();
    },
    [input, busy, sendMessage],
  );

  const renderPart = (
    messageId: string,
    part: AnyPart,
    index: number,
  ): ReactNode => {
    const key = `${messageId}-${index}`;
    switch (part.type) {
      case 'text':
        return (
          <p key={key} className="whitespace-pre-wrap leading-relaxed">
            {part.text as string}
          </p>
        );
      case 'data-sources':
        return <SourceChips key={key} sources={part.data as SourceChip[]} />;
      case 'tool-showProject': {
        if (part.state !== 'output-available') return null;
        const args = part.input as { projectName?: string } | undefined;
        return args?.projectName ? (
          <ProjectCard
            key={key}
            projectName={args.projectName}
            onExplore={() => {
              flyToSection('projects');
              setCopilotOpen(false);
            }}
          />
        ) : null;
      }
      case 'tool-showSkillsRadar':
        return part.state === 'output-available' ? (
          <SkillsRadar key={key} />
        ) : null;
      case 'tool-navigateToSection': {
        if (part.state !== 'output-available') return null;
        const args = part.input as { section?: string } | undefined;
        return (
          <p key={key} className="font-mono text-[11px] text-accent-soft">
            → ti porto alla sezione {args?.section}
          </p>
        );
      }
      default:
        return null;
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
            aria-label="Apri il copilot del portfolio"
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
            aria-label="Copilot del portfolio"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel fixed inset-y-0 right-0 z-50 flex w-full flex-col sm:inset-y-3 sm:right-3 sm:w-[420px] sm:rounded-2xl"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2 text-sm font-medium text-white">
                  <FiCpu className="h-4 w-4 text-accent" />
                  Copilot
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                    BM25 + e5 · Groq
                  </span>
                </span>
                <EmbedderDot state={embedderState} />
              </div>
              <button
                onClick={() => setCopilotOpen(false)}
                aria-label="Chiudi il copilot"
                className="rounded-full p-2 text-white/50 transition-colors hover:text-white"
              >
                <FiX className="h-4 w-4" />
              </button>
            </header>

            {/* Messaggi */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm text-white/85">
              {messages.length === 0 && (
                <div className="flex h-full flex-col justify-end gap-3 pb-2">
                  <p className="text-white/55">
                    Chiedimi della tesi, dei progetti o del percorso di Vito:
                    rispondo solo sulla base dei documenti del portfolio,
                    citando le fonti.
                  </p>
                  <div className="flex flex-col items-start gap-2">
                    {SUGGESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => submit(q)}
                        className="hairline rounded-full border bg-white/5 px-3 py-1.5 text-left text-xs text-white/75 transition-colors hover:bg-accent/15 hover:text-white"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === 'user'
                      ? 'ml-8 rounded-2xl rounded-br-sm bg-accent/15 px-3.5 py-2.5'
                      : 'mr-4 space-y-2'
                  }
                >
                  {(message.parts as AnyPart[]).map((part, i) =>
                    renderPart(message.id, part, i),
                  )}
                </div>
              ))}

              {status === 'submitted' && (
                <p className="font-mono text-[11px] text-white/40">
                  <span className="animate-pulse">retrieval in corso…</span>
                </p>
              )}
              {status === 'error' && (
                <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                  {prettyError(error)}
                </p>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
              className="border-t border-white/10 p-3"
            >
              <div className="flex items-end gap-2 rounded-xl bg-white/5 px-3 py-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void submit();
                    }
                  }}
                  rows={1}
                  placeholder="Scrivi una domanda…"
                  aria-label="Messaggio per il copilot"
                  className="max-h-28 flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Invia"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-opacity disabled:opacity-30"
                >
                  <FiArrowUp className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
