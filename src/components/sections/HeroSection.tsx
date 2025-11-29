
'use client';

import { motion } from 'framer-motion';
import AnimatedTitle from '@/components/AnimatedTitle';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';

interface HeroSectionProps {
  onScrollToNext: () => void;
}

const text = `Ciao, mi chiamo\nVito Piccolini`;
const startPiccolini = text.indexOf('Piccolini');

const stackBadges = [
  'Python',
  'LangGraph · LangChain',
  'n8n Automations',
  'React · Next.js',
  'Gemini · Ollama',
];

export default function HeroSection({ onScrollToNext }: HeroSectionProps) {

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-neural-grid text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-neural-blue/60 to-black/80" />
      <div className="absolute inset-0 neural-grid-overlay" />
      <div className="absolute -left-20 top-10 w-72 h-72 rounded-full bg-neural-accent opacity-30 blur-3xl" />
      <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-neural-accent opacity-20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto w-full max-w-4xl px-6 py-16 md:px-12"
      >
        <div className="flex flex-col gap-8 text-center items-center">
          <Badge variant="glow">
            Disponibile per progetti AI
          </Badge>

          <AnimatedTitle
            text={text}
            highlightFrom={startPiccolini}
            highlightClass="text-neural-magenta"
          />

          <p className="text-lg text-white/80 max-w-2xl">
            Laureando magistrale in <span className="text-neural-cyan">Computer Science – Artificial Intelligence</span>, 
            appassionato di IA e Machine Learning con esperienza in sistemi di raccomandazione LLM-driven.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {stackBadges.map((badge) => (
              <Badge key={badge} variant="outline">
                {badge}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <CTAButton href="#contact" variant="primary">
              Contattami
            </CTAButton>
            <CTAButton href="#projects" variant="secondary">
              Vedi i progetti
            </CTAButton>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={onScrollToNext}
          className="mx-auto mt-12 flex flex-col items-center gap-2 text-white/70 transition-colors hover:text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-sm font-medium tracking-[0.4em]">SCORRI</span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, repeatType: 'loop', duration: 1.2, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>
      </motion.div>
    </section>
  );
} 