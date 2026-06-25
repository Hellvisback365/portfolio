'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  FiSearch, FiHome, FiUser, FiZap, FiLayers, FiMail,
  FiMessageCircle, FiGlobe, FiGithub, FiLinkedin, FiCornerDownLeft, FiCheck,
} from 'react-icons/fi';
import { useAppStore } from '@/store/useAppStore';

interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: ReactNode;
  keywords: string;
  run: () => void;
}

/**
 * Command palette ⌘K: navigazione tastiera-first (sezioni, copilot, lingua,
 * link). Include un trigger flottante (anche per chi non ha la tastiera) per
 * scoperta e accesso da mobile. Apple-style: minimale, vetro, accent blu.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  const flyToSection = useAppStore((s) => s.flyToSection);
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const isEn = language === 'en';

  const commands = useMemo<Command[]>(() => {
    const go = (section: string) => () => { flyToSection(section); setOpen(false); };
    return [
      { id: 'hero', label: isEn ? 'Home' : 'Home', icon: <FiHome />, keywords: 'home start top inizio', run: go('hero') },
      { id: 'about', label: isEn ? 'About' : 'Chi sono', icon: <FiUser />, keywords: 'about percorso bio formazione esperienza', run: go('about') },
      { id: 'skills', label: isEn ? 'Skills' : 'Competenze', icon: <FiZap />, keywords: 'skills competenze stack tecnologie languages', run: go('skills') },
      { id: 'projects', label: isEn ? 'Projects' : 'Progetti', icon: <FiLayers />, keywords: 'projects progetti case studies lavori', run: go('projects') },
      { id: 'contact', label: isEn ? 'Contact' : 'Contatti', icon: <FiMail />, keywords: 'contact contatti email scrivi', run: go('contact') },
      {
        id: 'copilot',
        label: isEn ? 'Ask the Copilot' : 'Chiedi al Copilot',
        hint: 'AI',
        icon: <FiMessageCircle />,
        keywords: 'copilot ai chat assistant assistente domanda rag',
        run: () => { setCopilotOpen(true); setOpen(false); },
      },
      {
        id: 'lang',
        label: isEn ? 'Switch to Italian' : 'Passa all’inglese',
        icon: <FiGlobe />,
        keywords: 'language lingua italiano english it en',
        run: () => { setLanguage(isEn ? 'it' : 'en'); setOpen(false); },
      },
      {
        id: 'github',
        label: 'GitHub',
        hint: '↗',
        icon: <FiGithub />,
        keywords: 'github codice repo sorgente',
        run: () => { window.open('https://github.com/Hellvisback365', '_blank', 'noopener'); setOpen(false); },
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        hint: '↗',
        icon: <FiLinkedin />,
        keywords: 'linkedin lavoro profilo network',
        run: () => { window.open('https://www.linkedin.com/in/vitopiccolini/', '_blank', 'noopener'); setOpen(false); },
      },
      {
        id: 'email',
        label: isEn ? 'Copy / send email' : 'Copia / invia email',
        hint: '@',
        icon: <FiMail />,
        keywords: 'email mail scrivi contatto copia copy',
        run: () => {
          const email = 'vitopiccolini@live.it';
          setCopied(true); // mostra subito la conferma
          navigator.clipboard?.writeText(email).catch(() => {});
          // best-effort: apre il client di posta se configurato (altrimenti no-op).
          // Differito così non ruba il focus prima che il banner si dipinga.
          setTimeout(() => { window.location.href = `mailto:${email}`; }, 350);
        },
      },
    ];
  }, [isEn, flyToSection, setCopilotOpen, setLanguage]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => (c.label + ' ' + c.keywords).toLowerCase().includes(q));
  }, [query, commands]);

  // Apertura/chiusura globale con ⌘K / Ctrl+K, chiusura con Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Reset e focus all'apertura: in rAF (non sincrono nell'effect).
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      setQuery('');
      setActive(0);
      setCopied(false);
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  return (
    <>
      {/* Trigger flottante: scoperta + accesso touch (gemello del copilot) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={isEn ? 'Open command palette' : 'Apri la command palette'}
        className="glass-panel fixed bottom-5 left-5 z-40 hidden h-9 items-center gap-2 rounded-full px-3 text-[11px] text-white/55 transition-colors hover:text-white sm:flex"
      >
        <FiSearch className="h-3.5 w-3.5" />
        <span className="font-mono tracking-wide">{isEn ? 'Menu' : 'Menu'}</span>
        <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-white/50">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[18vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={isEn ? 'Command palette' : 'Command palette'}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onWheel={(e) => e.stopPropagation()}
              className="glass-panel relative z-10 w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <FiSearch className="h-4 w-4 shrink-0 text-accent-soft" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                  onKeyDown={onInputKey}
                  placeholder={isEn ? 'Type a command or search…' : 'Scrivi un comando o cerca…'}
                  aria-label={isEn ? 'Command' : 'Comando'}
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
                <kbd className="hidden rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-white/40 sm:block">
                  ESC
                </kbd>
              </div>

              {copied && (
                <div className="mx-1.5 mt-1.5 flex items-center gap-2 rounded-xl border border-leaf/30 bg-leaf/15 px-3 py-2 text-xs text-leaf">
                  <FiCheck className="h-3.5 w-3.5 shrink-0" />
                  vitopiccolini@live.it — {isEn ? 'copied to clipboard' : 'copiata negli appunti'}
                </div>
              )}

              <div
                className="max-h-[50vh] overflow-y-auto overscroll-contain p-1.5"
                onWheel={(e) => e.stopPropagation()}
              >
                {filtered.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-white/40">
                    {isEn ? 'No results' : 'Nessun risultato'}
                  </p>
                ) : (
                  filtered.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => c.run()}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        i === active ? 'bg-accent/15 text-white' : 'text-white/70'
                      }`}
                    >
                      <span className={`text-base ${i === active ? 'text-accent-soft' : 'text-white/40'}`}>
                        {c.icon}
                      </span>
                      <span className="flex-1">{c.label}</span>
                      {c.hint && (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                          {c.hint}
                        </span>
                      )}
                      {i === active && <FiCornerDownLeft className="h-3.5 w-3.5 text-white/40" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
