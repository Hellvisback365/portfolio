'use client';

import { motion } from 'framer-motion';
import AnimatedTitle from '@/components/AnimatedTitle';
import { useState, useRef, useEffect } from 'react';

interface HeroSectionProps {
  onScrollToAbout: () => void;
}
const text = `Ciao, mi chiamo\nVito Piccolini`;
const startPiccolini = text.indexOf("Piccolini");
export default function HeroSection({ onScrollToAbout }: HeroSectionProps) {
  const contactBtnRef = useRef<HTMLAnchorElement>(null);
  const projectsBtnRef = useRef<HTMLAnchorElement>(null);
  
  const [contactMousePosition, setContactMousePosition] = useState({ x: 0, y: 0 });
  const [projectsMousePosition, setProjectsMousePosition] = useState({ x: 0, y: 0 });
  const [isContactHovering, setIsContactHovering] = useState(false);
  const [isProjectsHovering, setIsProjectsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add window resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleContactMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!contactBtnRef.current || isMobile) return;
    const rect = contactBtnRef.current.getBoundingClientRect();
    setContactMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleProjectsMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!projectsBtnRef.current || isMobile) return;
    const rect = projectsBtnRef.current.getBoundingClientRect();
    setProjectsMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

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
            ref={contactBtnRef}
            href="#contact"
            className="relative overflow-hidden px-6 py-3 bg-primary-dark text-white rounded-md text-center"
            initial={{ backgroundPosition: '0% 50%' }}
            onMouseMove={handleContactMouseMove}
            onMouseEnter={() => setIsContactHovering(true)}
            onMouseLeave={() => setIsContactHovering(false)}
            whileHover={{ scale: 1.05, boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            Contattami
            {/* Desktop effect */}
            {!isMobile && (
              <div 
                className="absolute inset-0 pointer-events-none rounded-md transition-opacity duration-300"
                style={{
                  opacity: isContactHovering ? 1 : 0,
                  background: `radial-gradient(circle 120px at ${contactMousePosition.x}px ${contactMousePosition.y}px, rgba(37, 99, 235, 1), rgba(37, 99, 235, 0.4) 50%, rgba(59, 130, 246, 0) 100%)`
                }}
              />
            )}
            {/* Mobile effect */}
            {isMobile && (
              <motion.div 
                className="absolute inset-0 pointer-events-none rounded-md"
                initial={{ opacity: 0 }}
                animate={isContactHovering 
                  ? { 
                      opacity: 1, 
                      background: [
                        'linear-gradient(90deg, rgba(37, 99, 235, 0.8) 0%, rgba(59, 130, 246, 0.4) 100%)',
                        'linear-gradient(90deg, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.8) 100%)',
                        'linear-gradient(90deg, rgba(37, 99, 235, 0.8) 0%, rgba(59, 130, 246, 0.4) 100%)'
                      ] 
                    }
                  : { opacity: 0 }
                }
                transition={{ 
                  opacity: { duration: 0.3 },
                  background: { 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              />
            )}
          </motion.a>
          <motion.a
            ref={projectsBtnRef}
            href="#projects"
            className="relative overflow-hidden px-6 py-3 border-2 border-primary-light text-primary-light rounded-md text-center"
            onMouseMove={handleProjectsMouseMove}
            onMouseEnter={() => setIsProjectsHovering(true)}
            onMouseLeave={() => setIsProjectsHovering(false)}
            whileHover={{ 
              scale: 1.05, 
              borderColor: '#1D4ED8', 
              color: '#1D4ED8', 
              boxShadow: '0px 8px 15px rgba(37, 99, 235, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            Vedi i miei progetti
            {/* Desktop effect */}
            {!isMobile && (
              <div 
                className="absolute inset-0 pointer-events-none rounded-md transition-opacity duration-300"
                style={{
                  opacity: isProjectsHovering ? 1 : 0,
                  background: `radial-gradient(circle 120px at ${projectsMousePosition.x}px ${projectsMousePosition.y}px, rgba(191, 219, 254, 0.6), rgba(191, 219, 254, 0.2) 40%, rgba(191, 219, 254, 0) 70%)`
                }}
              />
            )}
            {/* Mobile effect */}
            {isMobile && (
              <motion.div 
                className="absolute inset-0 pointer-events-none rounded-md"
                initial={{ opacity: 0 }}
                animate={isProjectsHovering 
                  ? { 
                      opacity: 1, 
                      background: [
                        'linear-gradient(90deg, rgba(191, 219, 254, 0.6) 0%, rgba(147, 197, 253, 0.2) 100%)',
                        'linear-gradient(90deg, rgba(147, 197, 253, 0.2) 0%, rgba(191, 219, 254, 0.6) 100%)',
                        'linear-gradient(90deg, rgba(191, 219, 254, 0.6) 0%, rgba(147, 197, 253, 0.2) 100%)'
                      ] 
                    }
                  : { opacity: 0 }
                }
                transition={{ 
                  opacity: { duration: 0.3 },
                  background: { 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              />
            )}
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