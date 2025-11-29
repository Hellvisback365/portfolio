'use client';

import { useRef } from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/sections/HeroSection';
import RagSection from '@/components/sections/RagSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  const ragRef = useRef<HTMLDivElement>(null);
  
  const scrollToRag = () => ragRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Layout>
      <HeroSection onScrollToNext={scrollToRag} />

      {/* RAG Copilot Section */}
      <div ref={ragRef}>
        <RagSection />
      </div>
      
      {/* About Section */}
      <div>
        <AboutSection />
      </div>

      {/* Projects Section */}
      <ProjectsSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Contact Section */}
      <ContactSection />
    </Layout>
  );
}
