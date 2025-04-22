'use client';

import { motion } from 'framer-motion';
import AnimatedTitle from '@/components/AnimatedTitle';

interface HeroSectionProps {
  onScrollToAbout: () => void;
}

export default function HeroSection({ onScrollToAbout }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      {/* Video background for seamless nebula loop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/nebulosa-loop.mp4"
      />

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl p-16"
      >
        {/* Animated title */}
        <AnimatedTitle text={`Ciao,\nsono Vito Piccolini`} />

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl md:text-2xl mb-8 text-white/75"
        >
          Sviluppatore AI orientato all'utente
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-white/70 mb-10 max-w-2xl"
        >
          Mi specializzo nell'integrazione di LLM locali (LLaMA, Mistral), prompt tuning, caching e chaining, 
          ottenendo riduzioni dei tempi di inferenza del 20-30%, con competenze in Python, LangChain, Node.js e React.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          onClick={onScrollToAbout}
          className="px-8 py-3 rounded-md bg-primary-light dark:bg-primary-dark text-white font-medium 
                     hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-md hover:shadow-lg"
        >
          Scopri di più
        </motion.button>
      </motion.div>
    </section>
  );
} 