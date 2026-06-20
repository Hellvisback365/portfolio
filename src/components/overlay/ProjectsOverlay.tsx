'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { projects as projectsData, type ProjectData } from '@/data/projects';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';
import { useAppStore } from '@/store/useAppStore';

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
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';

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
              {isEn ? 'AI & Platform Experiences' : 'Esperienze AI & Platform'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
              {isEn ? 'Each project combines discovery, technical design, and an observability layer for frictionless delivery.' : 'Ogni progetto combina discovery, progettazione tecnica e un layer di osservabilità per consegne senza attriti.'}
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
                      {project.tags.map((tag, idx) => {
                        const tagLabel = typeof tag !== 'string' ? (isEn ? tag.en : tag.it) : tag;
                        return (
                          <span
                            key={`tag-${idx}`}
                            className="rounded-full border border-white/8 bg-white/5 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white/60"
                          >
                            {tagLabel}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">
                          {typeof project.timeline !== 'string' ? (isEn ? project.timeline.en : project.timeline.it) : project.timeline}
                        </p>
                        <h3 className="text-xl font-semibold text-white">{typeof project.title !== 'string' ? (isEn ? (project.title as any).en : (project.title as any).it) : project.title}</h3>
                        <p className="text-xs text-white/60">{isEn ? project.subtitle.en : project.subtitle.it}</p>
                      </div>
                      <Badge variant="glow" className="text-[0.6rem]">
                        {typeof project.role !== 'string' ? (isEn ? project.role.en : project.role.it) : project.role}
                      </Badge>
                    </div>

                    <p className="text-sm text-white/70">{isEn ? project.description.en : project.description.it}</p>

                    {/* Metrics */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {project.metrics.map((metric, idx) => {
                        const mLabel = typeof metric.label !== 'string' ? (isEn ? metric.label.en : metric.label.it) : metric.label;
                        const mValue = typeof metric.value !== 'string' ? (isEn ? metric.value.en : metric.value.it) : metric.value;
                        const mCaption = typeof metric.caption !== 'string' ? (isEn ? metric.caption.en : metric.caption.it) : metric.caption;
                        return (
                          <div
                            key={`${project.id}-metric-${idx}`}
                            className="rounded-xl border border-white/8 bg-white/5 p-3"
                          >
                            <p className="text-[0.55rem] uppercase tracking-[0.3em] text-white/50">
                              {mLabel}
                            </p>
                            <p className="mt-1 text-xl font-semibold text-white">{mValue}</p>
                            <p className="mt-0.5 text-[0.6rem] text-white/60">
                              {mCaption}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech, idx) => {
                        const techLabel = typeof tech !== 'string' ? (isEn ? tech.en : tech.it) : tech;
                        return (
                          <span
                            key={`stack-${idx}`}
                            className="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/50"
                          >
                            {techLabel}
                          </span>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <CTAButton variant="primary" onClick={() => setSelectedProject(project)}>
                        {isEn ? 'Open case study' : 'Apri case study'}
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

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.pillars.map((pillar, idx) => {
                    const pillarLabel = typeof pillar !== 'string' ? (isEn ? pillar.en : pillar.it) : pillar;
                    return (
                      <Badge key={`pillar-${idx}`} variant="outline" className="text-[0.55rem]">
                        {pillarLabel}
                      </Badge>
                    );
                  })}
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
