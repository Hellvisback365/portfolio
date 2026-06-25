import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface UseSpeechRecognitionOptions {
  /** Trascrizione parziale, aggiornata live mentre l'utente parla. */
  onInterim?: (text: string) => void;
  /** Trascrizione finale (utterance conclusa). */
  onFinal: (text: string) => void;
}

/**
 * Riconoscimento vocale (Web Speech API) lingua-aware (it-IT / en-US).
 * Espone risultati intermedi (per l'anteprima live) e finali (per l'auto-invio).
 */
export function useSpeechRecognition({ onInterim, onFinal }: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const onInterimRef = useRef(onInterim);
  const onFinalRef = useRef(onFinal);

  useEffect(() => { onInterimRef.current = onInterim; }, [onInterim]);
  useEffect(() => { onFinalRef.current = onFinal; }, [onFinal]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      if (interim) onInterimRef.current?.(interim);
      if (final.trim()) onFinalRef.current(final.trim());
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);

    recognitionRef.current = rec;
    return () => {
      try { rec.abort(); } catch {}
    };
  }, []);

  const toggleListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      const language = useAppStore.getState().language;
      rec.lang = language === 'en' ? 'en-US' : 'it-IT';
      try {
        rec.start();
        setIsListening(true);
      } catch {
        // start() lancia se già attivo: ignora.
      }
    }
  }, [isListening]);

  return {
    isListening,
    toggleListening,
    hasSupport:
      typeof window !== 'undefined' &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
  };
}
