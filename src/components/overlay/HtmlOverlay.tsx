'use client';

import { useEffect, useRef } from 'react';
import { Scroll } from '@react-three/drei';
import HeroOverlay from './HeroOverlay';
import AboutOverlay from './AboutOverlay';
import SkillsOverlay from './SkillsOverlay';
import ProjectsOverlay from './ProjectsOverlay';
import ContactOverlay from './ContactOverlay';

interface HtmlOverlayProps {
  setPages: (pages: number) => void;
}

export default function HtmlOverlay({ setPages }: HtmlOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Dynamically calculate the number of pages required based on actual HTML content height
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        // Add a small buffer to ensure the very bottom doesn't get cut off by browser chrome
        const newPages = height / window.innerHeight;
        setPages(Math.max(5, newPages));
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [setPages]);

  return (
    <Scroll html style={{ width: '100%' }}>
      <div ref={containerRef} className="flex flex-col w-full">
        {/* Page 1: Hero */}
        <section id="hero" className="w-full">
          <HeroOverlay />
        </section>

        {/* Page 2: About */}
        <section id="about" className="w-full">
          <AboutOverlay />
        </section>

        {/* Page 3: Skills */}
        <section id="skills" className="w-full">
          <SkillsOverlay />
        </section>

        {/* Page 4: Projects */}
        <section id="projects" className="w-full">
          <ProjectsOverlay />
        </section>

        {/* Page 5: Contact */}
        <section id="contact" className="w-full">
          <ContactOverlay />
        </section>
      </div>
    </Scroll>
  );
}
