'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { SECTIONS, type SectionId, useAppStore } from '@/store/useAppStore';

const LABELS: Record<SectionId, string> = {
  hero: 'Home',
  about: 'About',
  skills: 'Skills',
  projects: 'Projects',
  contact: 'Contact',
};

/**
 * Stessa UX di prima, costo diverso: gli offsetTop delle sezioni sono
 * misurati una volta (e su resize), non a ogni evento di scroll; lo
 * scroll handler è coalizzato in un singolo rAF. Niente reflow nel
 * percorso caldo.
 */
export default function NavigationOverlay() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const offsets = useRef<number[]>([]);
  const ticking = useRef(false);
  const lenis = useLenis();
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const isEn = language === 'en';

  const measure = useCallback(() => {
    offsets.current = SECTIONS.map((id) => {
      const el = document.getElementById(id);
      return el ? el.offsetTop : 0;
    });
  }, []);

  useEffect(() => {
    measure();
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        const y = window.scrollY;
        const limit = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(limit > 0 ? y / limit : 0);
        const threshold = y + window.innerHeight / 2;
        let current = 0;
        for (let i = 0; i < offsets.current.length; i++) {
          if (threshold >= offsets.current[i]) current = i;
        }
        setActiveIndex(current);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const scrollToSection = useCallback(
    (index: number) => {
      const el = document.getElementById(SECTIONS[index]);
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el.offsetTop, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
      }
    },
    [lenis],
  );

  // Canale per la navigazione programmata (copilot, CTA).
  useEffect(() => {
    const handler = (event: Event) => {
      const section = (event as CustomEvent).detail?.section as string | undefined;
      const index = SECTIONS.indexOf(section as SectionId);
      if (index !== -1) scrollToSection(index);
    };
    window.addEventListener('navigate-section', handler);
    return () => window.removeEventListener('navigate-section', handler);
  }, [scrollToSection]);

  return (
    <>
      {/* Barra di avanzamento */}
      <div className="fixed left-0 right-0 top-0 z-40 h-px bg-white/5">
        <div
          className="h-full bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Language Toggle */}
      <div className="fixed top-5 right-5 z-[100] pointer-events-auto">
        <button
          onClick={() => setLanguage(isEn ? 'it' : 'en')}
          className="glass-panel flex h-9 w-[4.5rem] items-center justify-between rounded-full p-1 text-[10px] font-bold uppercase tracking-widest text-white/50 transition-colors cursor-pointer"
        >
          <span className={`flex-1 text-center transition-colors ${!isEn ? 'text-white' : 'hover:text-white/80'}`}>IT</span>
          <span className="h-full w-[1px] bg-white/20"></span>
          <span className={`flex-1 text-center transition-colors ${isEn ? 'text-white' : 'hover:text-white/80'}`}>EN</span>
        </button>
      </div>

      {/* Monogramma */}
      <div className="fixed left-6 top-4 z-40">
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-xs tracking-[0.3em] text-[var(--text-secondary)]"
        >
          VP
        </motion.p>
      </div>

      {/* Dot di sezione */}
      <nav className="fixed right-6 top-1/2 z-40 -translate-y-1/2" aria-label="Sezioni">
        <div className="flex flex-col items-end gap-4">
          {SECTIONS.map((id, index) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(index)}
              className="group flex min-h-0 min-w-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              aria-label={`Vai a ${LABELS[id]}`}
              aria-current={activeIndex === index ? 'true' : undefined}
            >
              <span
                className={`font-mono text-[0.58rem] uppercase tracking-[0.3em] transition-all duration-300 ${
                  activeIndex === index
                    ? 'text-accent-soft opacity-100'
                    : 'text-white/0 group-hover:text-white/50'
                }`}
              >
                {LABELS[id]}
              </span>
              <span className="relative flex items-center justify-center">
                {activeIndex === index && (
                  <motion.span
                    layoutId="active-dot"
                    className="absolute h-4 w-4 rounded-full border border-accent/50"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? 'bg-accent shadow-[0_0_10px_rgb(10_132_255/0.6)]'
                      : 'bg-white/20 group-hover:bg-white/50'
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
