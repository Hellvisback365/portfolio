'use client';

import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';

const text = `Ciao, mi chiamo`;
const name = `Vito Piccolini`;

const stackBadges = [
  'Python',
  'LangGraph · LangChain',
  'n8n Automations',
  'React · Next.js',
  'Gemini · Ollama',
];

export default function HeroOverlay() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex max-w-3xl flex-col items-center gap-6 text-center"
      >
        <Badge variant="glow">Disponibile per progetti AI</Badge>

        <h1 className="text-4xl font-light leading-tight tracking-tight text-white/90 sm:text-5xl md:text-6xl lg:text-7xl">
          {text}
          <br />
          <span className="font-semibold glow-text-cyan text-white">{name}</span>
        </h1>

        <p className="max-w-2xl text-base text-white/60 sm:text-lg">
          Laureando magistrale in{' '}
          <span className="text-[#5DE0E6]">Computer Science – Artificial Intelligence</span>,
          appassionato di IA e Machine Learning con esperienza in sistemi di raccomandazione
          LLM-driven.
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {stackBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-wide text-white/70 backdrop-blur-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <CTAButton href="#contact" variant="primary">
            Contattami
          </CTAButton>
          <CTAButton href="#projects" variant="secondary">
            Vedi i progetti
          </CTAButton>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-2 text-white/40"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <span className="text-[0.6rem] uppercase tracking-[0.5em]">Scorri</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
