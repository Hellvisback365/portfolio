'use client';

import HeroOverlay from './HeroOverlay';
import AboutOverlay from './AboutOverlay';
import SkillsOverlay from './SkillsOverlay';
import ProjectsOverlay from './ProjectsOverlay';
import ContactOverlay from './ContactOverlay';

export default function HtmlOverlay() {
  return (
    <div className="flex flex-col w-full text-white">
      {/* Page 1: Hero */}
      <section id="hero" className="w-full relative z-10">
        <HeroOverlay />
      </section>

      {/* Page 2: About */}
      <section id="about" className="w-full relative z-10">
        <AboutOverlay />
      </section>

      {/* Page 3: Skills */}
      <section id="skills" className="w-full relative z-10">
        <SkillsOverlay />
      </section>

      {/* Page 4: Projects */}
      <section id="projects" className="w-full relative z-10">
        <ProjectsOverlay />
      </section>

      {/* Page 5: Contact */}
      <section id="contact" className="w-full relative z-10">
        <ContactOverlay />
      </section>
    </div>
  );
}
