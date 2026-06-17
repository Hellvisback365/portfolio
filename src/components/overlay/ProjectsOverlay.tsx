'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { projects as projectsData, type ProjectData } from '@/data/projects';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';

const ProjectModal = dynamic(() => import('@/components/ProjectModal'), {
  ssr: false,
});

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function ProjectsOverlay() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  return (
    <>
      <div className="flex min-h-screen w-screen items-start justify-center px-4 py-16 sm:px-8">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeIn}
            className="mb-10 text-center"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">
              Case Studies
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Esperienze AI & Platform
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
              Ogni progetto combina discovery, progettazione tecnica e un layer di osservabilità per
              consegne senza attriti.
            </p>
          </motion.div>

          {/* Project cards */}
          <div className="space-y-8">
            {projectsData.map((project, index) => (
              <motion.article
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={1 + index}
                variants={fadeIn}
                className="glass-holographic rounded-2xl p-5 transition-all duration-300 hover:border-[white]/25"
              >
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* Image */}
                  <div className="flex flex-col lg:w-2/5">
                    <div className="relative flex-1 min-h-[16rem] overflow-hidden rounded-xl border border-white/8 bg-[#05060d]">
                      {/* Blurred background */}
                      <Image
                        src={project.image}
                        alt={`${project.title} blur`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover blur-2xl opacity-40 scale-110"
                      />
                      {/* Foreground image */}
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-contain p-4 relative z-10 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#05060d]/60 via-transparent to-transparent" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/8 bg-white/5 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">
                          {project.timeline}
                        </p>
                        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                        <p className="text-xs text-white/60">{project.subtitle}</p>
                      </div>
                      <Badge variant="glow" className="text-[0.6rem]">
                        {project.role}
                      </Badge>
                    </div>

                    <p className="text-sm text-white/70">{project.description}</p>

                    {/* Metrics */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {project.metrics.map((metric) => (
                        <div
                          key={`${project.id}-${metric.label}`}
                          className="rounded-xl border border-white/8 bg-white/5 p-3"
                        >
                          <p className="text-[0.55rem] uppercase tracking-[0.3em] text-white/50">
                            {metric.label}
                          </p>
                          <p className="mt-1 text-xl font-semibold text-white">{metric.value}</p>
                          <p className="mt-0.5 text-[0.6rem] text-white/60">{metric.caption}</p>
                        </div>
                      ))}
                    </div>

                    {/* Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <CTAButton variant="primary" onClick={() => setSelectedProject(project)}>
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

                {/* Pillars */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.pillars.map((pillar) => (
                    <Badge key={pillar} variant="outline" className="text-[0.55rem]">
                      {pillar}
                    </Badge>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      {/* Project Modal (reused from original) */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
}
