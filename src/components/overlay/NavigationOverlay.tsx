'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

import { useLenis } from 'lenis/react';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function NavigationOverlay() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenis = useLenis();

  // Listen for native window scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight <= 0) return;

      const progress = scrollTop / scrollHeight;
      setScrollProgress(progress);

      // Find the currently active section based on actual scroll position
      let currentSection = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && scrollTop >= el.offsetTop - window.innerHeight / 2) {
          currentSection = i;
        }
      }
      setActiveIndex(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  const scrollToSection = useCallback((index: number) => {
    const el = document.getElementById(SECTIONS[index].id);
    if (!el) return;
    
    const targetScroll = el.offsetTop;

    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [lenis]);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const sectionId = customEvent.detail?.section;
      const index = SECTIONS.findIndex(s => s.id === sectionId);
      if (index !== -1) {
        scrollToSection(index);
      }
    };
    window.addEventListener('navigate-section', handleNavigate);
    return () => window.removeEventListener('navigate-section', handleNavigate);
  }, [scrollToSection]);

  return (
    <>
      {/* ─── Top progress bar ─── */}
      <div className="fixed left-0 right-0 top-0 z-40 h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${scrollProgress * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* ─── Top name / logo ─── */}
      <div className="fixed left-6 top-4 z-40">
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-semibold tracking-[0.2em] text-[white]/70"
        >
          VP
        </motion.p>
      </div>

      {/* ─── Navigation dots (right side) ─── */}
      <nav className="fixed right-6 top-1/2 z-40 -translate-y-1/2" aria-label="Sezioni">
        <div className="flex flex-col items-end gap-4">
          {SECTIONS.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(index)}
              className="group flex items-center gap-3"
              aria-label={`Vai a ${section.label}`}
              aria-current={activeIndex === index ? 'true' : undefined}
            >
              {/* Label (visible on hover) */}
              <span
                className={`text-[0.6rem] uppercase tracking-[0.3em] transition-all duration-300 ${
                  activeIndex === index
                    ? 'text-[white] opacity-100'
                    : 'text-white/0 group-hover:text-white/50'
                }`}
              >
                {section.label}
              </span>

              {/* Dot */}
              <span className="relative flex items-center justify-center">
                {/* Active ring */}
                {activeIndex === index && (
                  <motion.span
                    layoutId="active-dot"
                    className="absolute h-4 w-4 rounded-full border border-[white]/40"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {/* Inner dot */}
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? 'bg-[white] shadow-[0_0_8px_rgba(255,255,255,0.5)]'
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
