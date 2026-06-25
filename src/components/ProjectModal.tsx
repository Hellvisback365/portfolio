'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { ProjectData } from '@/data/projects';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';
import { useAppStore } from '@/store/useAppStore';
import { loc } from '@/lib/i18n';

interface ProjectModalProps {
  project: ProjectData;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1 + (i * 0.1),
        duration: 0.4
      }
    })
  };

  const modalContent = (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backdropVariants}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#05060d]"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl border-b border-white/10 bg-[#05060d]">
          {/* Blurred Background */}
          <Image 
            src={project.image}
            alt="Background blur"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover blur-2xl opacity-30 scale-110"
          />
          <motion.div 
            className="absolute inset-0 overflow-hidden z-10"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: imageLoaded ? 1 : 1.1, 
              opacity: imageLoaded ? 1 : 0 
            }}
            transition={{ duration: 0.6 }}
          >
            <Image 
              src={project.image}
              alt={project.title}
              className="object-contain p-6 drop-shadow-2xl"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
          <motion.div 
            className="absolute inset-0 z-20 bg-gradient-to-t from-[#05060d] to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </div>

        <div className="space-y-6 px-6 py-8">
          <motion.div 
            custom={0}
            variants={contentVariants}
            className="flex flex-col gap-2"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              {typeof project.timeline !== 'string' ? (isEn ? project.timeline.en : project.timeline.it) : project.timeline}
            </p>
            <h2 className="text-3xl font-semibold text-white">
              {loc(project.title, isEn)}
            </h2>
            <p className="text-base text-white/70">
              {isEn ? project.subtitle.en : project.subtitle.it}
            </p>
            <Badge variant="glow" className="w-fit text-[0.65rem]">
              {typeof project.role !== 'string' ? (isEn ? project.role.en : project.role.it) : project.role}
            </Badge>
          </motion.div>
          
          <motion.p 
            custom={1}
            variants={contentVariants}
            className="text-base text-white/80"
          >
            {isEn ? project.longDescription.en : project.longDescription.it}
          </motion.p>
          
          <motion.div 
            custom={2}
            variants={contentVariants}
            className="grid gap-4 sm:grid-cols-3"
          >
            {project.metrics.map((metric, idx) => {
              const mLabel = typeof metric.label !== 'string' ? (isEn ? metric.label.en : metric.label.it) : metric.label;
              const mValue = typeof metric.value !== 'string' ? (isEn ? metric.value.en : metric.value.it) : metric.value;
              const mCaption = typeof metric.caption !== 'string' ? (isEn ? metric.caption.en : metric.caption.it) : metric.caption;
              return (
                <div
                  key={`${project.id}-metric-${idx}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{mLabel}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{mValue}</p>
                  <p className="mt-1 text-xs text-white/70">
                    {mCaption}
                  </p>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            custom={3}
            variants={contentVariants}
            className="space-y-3"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tool, idx) => {
                const toolLabel = typeof tool !== 'string' ? (isEn ? tool.en : tool.it) : tool;
                return (
                  <span
                    key={`modal-stack-${idx}`}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                  >
                    {toolLabel}
                  </span>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            custom={4}
            variants={contentVariants}
            className="space-y-3"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Focus</p>
            <div className="flex flex-wrap gap-2">
              {project.pillars.map((pillar, idx) => {
                const pillarLabel = typeof pillar !== 'string' ? (isEn ? pillar.en : pillar.it) : pillar;
                return (
                  <Badge key={`modal-pillar-${idx}`} variant="outline" className="text-[0.6rem]">
                    {pillarLabel}
                  </Badge>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            custom={5}
            variants={contentVariants}
            className="flex flex-wrap gap-3"
          >
            {project.links?.map((link) => (
              <CTAButton key={link.href} href={link.href} variant="secondary">
                {link.label}
              </CTAButton>
            ))}
            <CTAButton variant="primary" onClick={onClose}>
              {isEn ? 'Close' : 'Chiudi'}
            </CTAButton>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
} 