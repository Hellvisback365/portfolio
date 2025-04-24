'use client';

import { useRef } from 'react';
import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ContactSection from '@/components/sections/ContactSection';

// Lazy load non-critical components
const TechStack = dynamic(() => import('@/components/TechStack'), {
  loading: () => <div className="h-12 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md"></div>,
  ssr: false,
});

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const scrollToAbout = () => aboutRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Layout>
      <HeroSection onScrollToAbout={scrollToAbout} />
      
      {/* Tech Stack Section (lazy loaded) */}
      <TechStack />
      
      {/* About Section */}
      <div ref={aboutRef} id="about">
        <AboutSection />
      </div>

      {/* Projects Section */}
      <section id="projects">
        <ProjectsSection />
      </section>

      {/* Skills Section */}
      <section id="skills">
        <SkillsSection />
      </section>

      {/* Contact Section */}
      <section id="contact">
        <ContactSection />
      </section>
    </Layout>
  );
}
