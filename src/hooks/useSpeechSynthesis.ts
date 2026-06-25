import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Sintesi vocale (Web Speech API) con SELEZIONE DELLA VOCE MIGLIORE.
 *
 * La voce di default del browser è quella robotica. Qui scegliamo, tra
 * quelle installate, la più naturale disponibile (neurali "Natural"/"Neural",
 * voci "Google"/"Online" del cloud), con un punteggio di preferenza.
 * Nessuna dipendenza esterna; degrada in silenzio se non supportata.
 */

const NATURAL_EN = /(natural|neural|aria|jenny|guy|libby|sonia|ava|emma|andrew)/;
const NATURAL_IT = /(natural|neural|elsa|isabella|giorgio|diego)/;

function pickVoice(
  voices: SpeechSynthesisVoice[],
  language: 'it' | 'en',
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const prefix = language === 'en' ? 'en' : 'it';
  const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
  const pool = matching.length > 0 ? matching : voices;

  const named = language === 'en' ? NATURAL_EN : NATURAL_IT;
  const score = (v: SpeechSynthesisVoice) => {
    const n = v.name.toLowerCase();
    let s = 0;
    if (n.includes('natural')) s += 120;
    if (n.includes('neural')) s += 110;
    if (n.includes('google')) s += 70;
    if (n.includes('online')) s += 50;
    if (n.includes('premium') || n.includes('enhanced')) s += 40;
    if (named.test(n)) s += 30;
    if (v.localService === false) s += 15; // le voci cloud/online sono più ricche
    if (language === 'en' && v.lang.toLowerCase() === 'en-us') s += 5;
    return s;
  };

  return pool.slice().sort((a, b) => score(b) - score(a))[0] ?? null;
}

// Spezza in frasi per evitare il bug di Chrome che taglia gli utterance lunghi.
function chunk(text: string): string[] {
  const pieces = text.match(/[^.!?…]+[.!?…]*\s*/g) ?? [text];
  const out: string[] = [];
  let buf = '';
  for (const p of pieces) {
    if ((buf + p).length > 220) {
      if (buf) out.push(buf.trim());
      buf = p;
    } else {
      buf += p;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out.length ? out : [text];
}

export function useSpeechSynthesis() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [speaking, setSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Le voci si popolano in modo asincrono: ascolta `voiceschanged`.
  useEffect(() => {
    if (!supported) return;
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [supported]);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string, language: 'it' | 'en') => {
      if (!supported) return;
      const clean = text.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
      if (!clean) return;

      window.speechSynthesis.cancel();
      const voices = voicesRef.current.length
        ? voicesRef.current
        : window.speechSynthesis.getVoices();
      const voice = pickVoice(voices, language);
      const parts = chunk(clean);

      parts.forEach((part, i) => {
        const utt = new SpeechSynthesisUtterance(part);
        if (voice) {
          utt.voice = voice;
          utt.lang = voice.lang;
        } else {
          utt.lang = language === 'en' ? 'en-US' : 'it-IT';
        }
        utt.rate = 1.02;
        utt.pitch = 1.0;
        if (i === 0) utt.onstart = () => setSpeaking(true);
        if (i === parts.length - 1) utt.onend = () => setSpeaking(false);
        utt.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utt);
      });
    },
    [supported],
  );

  // Stop alla smontatura: nessuna voce orfana.
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return { speak, cancel, speaking, supported };
}
