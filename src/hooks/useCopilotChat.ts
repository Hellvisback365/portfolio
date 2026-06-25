import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useAppStore } from '@/store/useAppStore';
import {
  embedQuery,
  getEmbedderState,
  subscribeEmbedder,
  warmupEmbedder,
  type EmbedderState,
} from '@/lib/rag/embedder';

export const ALL_SUGGESTIONS_IT = [
  'Di cosa parla la tesi di Vito?',
  'Raccontami del progetto Zenith',
  'Che esperienza ha con i sistemi RAG?',
  'Mostrami i contatti di Vito',
  'Quali linguaggi usa nel backend?',
  'Parlami dell\'hackathon Space Edition',
  'Come è fatto TerraNode?',
  'Che università frequenta?',
  'Vito ha esperienza lavorativa?',
  'Portami alla sezione progetti',
];

export const ALL_SUGGESTIONS_EN = [
  'What is Vito\'s thesis about?',
  'Tell me about the Zenith project',
  'What experience does he have with RAG systems?',
  'Show me Vito\'s contacts',
  'What languages does he use in the backend?',
  'Tell me about the Space Edition hackathon',
  'How is TerraNode built?',
  'What university does he attend?',
  'Does Vito have work experience?',
  'Take me to the projects section',
];

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

type AnyPart = { type: string } & Record<string, unknown>;

export function useCopilotChat() {
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';
  const copilotOpen = useAppStore((s) => s.copilotOpen);
  const flyToSection = useAppStore((s) => s.flyToSection);
  
  const [embedderState, setEmbedderState] = useState<EmbedderState>(() => getEmbedderState());
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  
  const poolsRef = useRef<Record<string, string[]>>({});
  const clickedSuggestionsRef = useRef<Set<string>>(new Set());
  const processedTools = useRef<Set<string>>(new Set());
  const inFlightRef = useRef(false);

  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });
  const busy = status === 'submitted' || status === 'streaming';

  // Subscriptions & Warmup
  useEffect(() => subscribeEmbedder(setEmbedderState), []);

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

  // Fetch suggestions
  useEffect(() => {
    if (!copilotOpen) return;
    
    if (poolsRef.current[language]) {
      // Già fetchato per questa lingua
      const pool = poolsRef.current[language];
      setSuggestions(pool.slice(0, 3));
      return;
    }

    setIsLoadingSuggestions(true);
    fetch(`/api/suggestions?lang=${language}`)
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => {
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          poolsRef.current[language] = data.questions;
          setSuggestions(data.questions.slice(0, 3));
        } else {
          throw new Error('Invalid schema');
        }
      })
      .catch((err) => {
        console.error('[Copilot] Fallback to static suggestions:', err);
        const fallbacks = isEn ? ALL_SUGGESTIONS_EN : ALL_SUGGESTIONS_IT;
        const shuffled = [...fallbacks].sort(() => 0.5 - Math.random());
        poolsRef.current[language] = shuffled;
        setSuggestions(shuffled.slice(0, 3));
      })
      .finally(() => {
        setIsLoadingSuggestions(false);
      });
  }, [copilotOpen, language, isEn]);

  // Process UI actions
  useEffect(() => {
    for (const message of messages) {
      if (processedTools.current.has(message.id)) continue;
      
      let actionFound = false;
      for (const part of message.parts as AnyPart[]) {
        if (part.type === 'data-uiAction') {
          const actionData = part.data as { action?: string; target?: string };
          actionFound = true;
          
          if (actionData.action === 'navigateToSection' && actionData.target) {
            flyToSection(actionData.target);
          } else if (actionData.action === 'showProject') {
            flyToSection('projects');
          } else if (actionData.action === 'showSkillsRadar') {
            flyToSection('skills');
          }
        }
      }
      if (actionFound) {
        processedTools.current.add(message.id);
      }
    }
  }, [messages, flyToSection]);

  const submit = useCallback(
    (text: string): boolean => {
      text = text.trim();
      if (!text || busy || inFlightRef.current) return false;
      inFlightRef.current = true;
      
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
      return true;
    },
    [busy, sendMessage],
  );

  const handleSuggestionClick = useCallback((q: string) => {
    submit(q);
    clickedSuggestionsRef.current.add(q);
    setSuggestions((prev) => {
      const pool = poolsRef.current[language] || (isEn ? ALL_SUGGESTIONS_EN : ALL_SUGGESTIONS_IT);
      const clicked = clickedSuggestionsRef.current;
      const remaining = pool.filter((s) => !prev.includes(s) && !clicked.has(s));
      
      if (remaining.length === 0) {
        const fallbacks = isEn ? ALL_SUGGESTIONS_EN : ALL_SUGGESTIONS_IT;
        const fallbackRemaining = fallbacks.filter((s) => !prev.includes(s) && !clicked.has(s) && !pool.includes(s));
        if (fallbackRemaining.length === 0) return prev;
        const next = fallbackRemaining[Math.floor(Math.random() * fallbackRemaining.length)];
        return prev.map((s) => (s === q ? next : s));
      }
      
      const next = remaining[Math.floor(Math.random() * remaining.length)];
      return prev.map((s) => (s === q ? next : s));
    });
  }, [submit, isEn, language]);

  return {
    messages,
    status,
    error,
    busy,
    submit,
    embedderState,
    suggestions,
    isLoadingSuggestions,
    handleSuggestionClick
  };
}
