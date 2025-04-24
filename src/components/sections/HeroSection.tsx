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


      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl px-6 py-8 md:p-16"
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
          className="text-xl md:text-2xl mb-4 md:mb-6 text-white"
        >
          Sviluppatore <span className="text-primary-light">IA emergente</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-base md:text-lg text-white/70 mb-6 md:mb-8 max-w-2xl"
        >
          Focalizzato su modelli linguistici e sistemi di raccomandazione. Cerco opportunità per applicare Python,
          LangChain e NLP a progetti sfidanti. Guarda cosa so fare.
        </motion.p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-10">
          <motion.a
            href="#contact"
            className="relative overflow-hidden px-6 py-3 bg-gradient-to-r from-primary-light to-primary-dark text-white rounded-md text-center"
            style={{ backgroundSize: '200% 200%' }}
            initial={{ backgroundPosition: '0% 50%' }}
            animate={{ backgroundPosition: '100% 50%' }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            whileHover={{ scale: 1.05, boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            Contattami
            <motion.span
              className="absolute top-0 left-[-100%] w-16 h-full bg-white opacity-20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </motion.a>
          <motion.a
            href="#projects"
            className="relative overflow-hidden px-6 py-3 border-2 border-primary-light text-primary-light rounded-md text-center"
            initial={{ borderColor: '#3B82F6', scale: 1 }}
            animate={{ borderColor: ['#3B82F6', '#2563EB', '#3B82F6'], scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05, borderColor: '#1D4ED8', color: '#1D4ED8', boxShadow: '0px 8px 15px rgba(37, 99, 235, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            Vedi i miei progetti
            <motion.span
              className="absolute inset-0 bg-primary-light opacity-0"
              whileHover={{ opacity: 0.1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'mirror' }}
            />
          </motion.a>
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