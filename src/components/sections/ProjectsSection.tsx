'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { projects as projectsData, type ProjectData } from '@/data/projects';
import SectionHeader from '@/components/ui/SectionHeader';
import NeuralCard from '@/components/ui/NeuralCard';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';

const ProjectModal = dynamic(() => import('@/components/ProjectModal'), {
  ssr: false,
});

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const openProject = (project: ProjectData) => setSelectedProject(project);
  const closeProject = () => setSelectedProject(null);

  return (
    <>
      <section id="projects" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          eyebrow="Case Studies"
          title="Esperienze AI & Platform consegnate end-to-end"
          description="Ogni progetto combina discovery, progettazione tecnica e un layer di osservabilità per consegne senza attriti. Ne seleziono alcuni che mostrano la cura per UX, privacy e integrazione LLM."
          align="center"
        />

        <div className="mt-12 space-y-10">
          {projectsData.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NeuralCard padding="lg">
                <div className="flex flex-col gap-8 lg:flex-row">
                  <div className="lg:w-2/5">
                    <div className="relative h-64 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-contain p-6"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neural-cyan/20 to-neural-magenta/20" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-white/60">{project.timeline}</p>
                        <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                        <p className="text-sm text-white/70">{project.subtitle}</p>
                      </div>
                      <Badge variant="glow" className="text-[0.65rem]">
                        {project.role}
                      </Badge>
                    </div>

                    <p className="text-sm text-white/80">{project.description}</p>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {project.metrics.map((metric) => (
                        <div
                          key={`${project.id}-${metric.label}`}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <p className="text-xs uppercase tracking-[0.3em] text-white/60">{metric.label}</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
                          <p className="mt-1 text-xs text-white/70">{metric.caption}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <CTAButton variant="primary" onClick={() => openProject(project)}>
                        Apri case study
                      </CTAButton>
                      {project.links?.map((link) => (
                        <CTAButton
                          key={link.href}
                          href={link.href}
                          variant="secondary"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label}
                        </CTAButton>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.pillars.map((pillar) => (
                    <Badge key={pillar} variant="outline" className="text-[0.6rem]">
                      {pillar}
                    </Badge>
                  ))}
                </div>
              </NeuralCard>
            </motion.article>
          ))}
        </div>
      </section>

      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal project={selectedProject} onClose={closeProject} />
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
}