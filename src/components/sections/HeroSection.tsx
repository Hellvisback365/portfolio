'use client';

import { motion } from 'framer-motion';
import AnimatedTitle from '@/components/AnimatedTitle';

interface HeroSectionProps {
  onScrollToAbout: () => void;
}
const text = `Ciao, mi chiamo\nVito Piccolini`;
const startPiccolini = text.indexOf("Piccolini");
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
        {/* Title with highlight */}
        <AnimatedTitle
          text={text}
          highlightFrom={startPiccolini}
          highlightClass="text-slate-600 dark:text-blue-800"
        />

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl md:text-2xl mb-6 text-white"
        >
          Sviluppatore <span className="text-primary-light">IA emergente</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-white/70 mb-8 max-w-2xl"
        >
          Focalizzato su modelli linguistici e sistemi di raccomandazione. Cerco opportunità per applicare Python,
          LangChain e NLP a progetti sfidanti. Guarda cosa so fare.
        </motion.p>

        {/* Call-to-action buttons */}
        <div className="flex gap-4 mb-10">
          <a
            href="#contact"
            className="px-6 py-3 bg-primary-light text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Contattami
          </a>
          <a
            href="#projects"
            className="px-6 py-3 border-2 border-primary-light text-primary-light rounded-md hover:bg-primary-light hover:text-white transition-colors"
          >
            Vedi i miei progetti
          </a>
        </div>

        {/* Animated scroll-down indicator */}
        <motion.div
          onClick={onScrollToAbout}
          className="cursor-pointer flex flex-col items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-white font-medium">Scopri di più</span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, repeatType: 'loop', duration: 1.2, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </section>
  );
} 