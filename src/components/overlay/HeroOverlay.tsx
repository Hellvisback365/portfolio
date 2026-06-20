'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const STACK = ['Python', 'LangGraph', 'RAG ibrido · BM25 + FAISS', 'React · Next.js', 'n8n'];

/**
 * La hero è una tesi: nome, una frase che dice cosa costruisci,
 * e la prova interattiva (il copilot) a un tap di distanza.
 * Una sola famiglia tipografica a pesi disciplinati, mono per le label.
 */
export default function HeroOverlay() {
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const reduced = useReducedMotion();

  const isEn = language === 'en';

  return (
    <>

      <div className="flex min-h-dvh w-full items-center justify-center px-6">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="flex max-w-3xl flex-col items-center gap-7 text-center"
        >
          <p className="eyebrow">AI Engineer — RecSys · RAG · Agents</p>

          <h1 className="text-5xl font-extralight leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl">
            Vito Piccolini
            <span className="text-accent">.</span>
          </h1>

          <p className="max-w-xl text-balance text-base font-light leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            {isEn
              ? 'I build recommendation systems and AI copilots that reason on real-world data - from multi-agent orchestration to hybrid retrieval.'
              : "Costruisco sistemi di raccomandazione e copiloti AI che ragionano su dati reali - dall'orchestrazione multi-agente al retrieval ibrido."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {STACK.map((item, i) => (
              <span key={item} className="flex items-center gap-5">
                {i > 0 && <span className="text-accent/40">·</span>}
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setCopilotOpen(true)}
              className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-white transition-all hover:bg-accent-soft hover:shadow-[0_0_32px_rgb(10_132_255/0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {isEn ? 'Talk to my Copilot' : 'Parla con il mio copilot'}
            </button>
            <a
              href="#projects"
              className="rounded-full border border-line px-7 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-accent-soft/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {isEn ? 'View Projects' : 'Vedi i progetti'}
            </a>
          </div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-2 text-[var(--text-muted)]"
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.5em]">{isEn ? 'Scroll' : 'Scorri'}</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
}
