'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

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

  // Helper to find the ScrollControls container
  const getScrollContainer = useCallback(() => {
    return Array.from(document.querySelectorAll('div')).find(
      (el) => el.style.overflowY === 'auto' || el.style.overflow === 'auto'
    ) as HTMLElement | undefined;
  }, []);

  // Listen for scroll events from the drei ScrollControls
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = getScrollContainer();
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      if (scrollHeight <= 0) return;

      const progress = scrollTop / scrollHeight;
      setScrollProgress(progress);

      // Find the currently active section based on actual scroll position
      let currentSection = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        // Activate when the section is at least halfway into the viewport
        if (el && scrollTop >= el.offsetTop - window.innerHeight / 2) {
          currentSection = i;
        }
      }
      setActiveIndex(currentSection);
    };

    // Observe the DOM until the scroll container is mounted
    const observer = new MutationObserver(() => {
      const scrollContainer = getScrollContainer();
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also try immediately
    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      const sc = getScrollContainer();
      if (sc) sc.removeEventListener('scroll', handleScroll);
    };
  }, [getScrollContainer]);

  const scrollToSection = useCallback((index: number) => {
    const scrollContainer = getScrollContainer();
    if (!scrollContainer) return;

    const sectionId = SECTIONS[index].id;
    const sectionEl = document.getElementById(sectionId);
    if (!sectionEl) return;

    // The section's offsetTop is relative to its parent flex container,
    // which starts at the top of the scrollContainer's scrollable area.
    const targetScroll = sectionEl.offsetTop;

    scrollContainer.scrollTo({
      top: targetScroll,
      behavior: 'auto',
    });
  }, [getScrollContainer]);

  return (
    <>
      {/* ─── Top progress bar ─── */}
      <div className="fixed left-0 right-0 top-0 z-40 h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-[#5DE0E6] to-[#C084FC]"
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
          className="text-sm font-semibold tracking-[0.2em] text-[#5DE0E6]/70"
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
                    ? 'text-[#5DE0E6] opacity-100'
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
                    className="absolute h-4 w-4 rounded-full border border-[#5DE0E6]/40"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {/* Inner dot */}
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? 'bg-[#5DE0E6] shadow-[0_0_8px_rgba(93,224,230,0.5)]'
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
