'use client';

import { motion } from 'framer-motion';
import type { ReactElement } from 'react';
import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiTensorflow,
  SiScikitlearn,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiTailwindcss,
  SiFramer,
} from 'react-icons/si';
import { BsRobot, BsTranslate, BsGlobe } from 'react-icons/bs';
import { HiCode } from 'react-icons/hi';
import { FaBrain } from 'react-icons/fa';
import { TbWorldWww } from 'react-icons/tb';
import SectionHeader from '@/components/ui/SectionHeader';
import NeuralCard from '@/components/ui/NeuralCard';
import Badge from '@/components/ui/Badge';
import {
  capabilityTracks,
  toolHighlights,
  languages,
  type SkillIconKey,
} from '@/data/skills';

export default function SkillsSection() {
  const iconMap: Record<SkillIconKey, ReactElement> = {
    python: <SiPython className="text-lg" />,
    javascript: <SiJavascript className="text-lg" />,
    typescript: <SiTypescript className="text-lg" />,
    tensorflow: <SiTensorflow className="text-lg" />,
    scikitlearn: <SiScikitlearn className="text-lg" />,
    llms: <BsRobot className="text-lg" />,
    nlp: <BsTranslate className="text-lg" />,
    react: <SiReact className="text-lg" />,
    node: <SiNodedotjs className="text-lg" />,
    mongodb: <SiMongodb className="text-lg" />,
    tailwind: <SiTailwindcss className="text-lg" />,
    framer: <SiFramer className="text-lg" />,
    code: <HiCode className="text-2xl" />,
    brain: <FaBrain className="text-2xl" />,
    web: <TbWorldWww className="text-2xl" />,
    robot: <BsRobot className="text-lg" />,
    translate: <BsTranslate className="text-lg" />,
    globe: <BsGlobe className="text-2xl" />,
  };

  return (
    <section id="skills" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
      <SectionHeader
        eyebrow="Skill Matrix"
        title="Capacità trasversali per prodotti AI-first"
        description="Dal brief al roll-out: combino ricerca, orchestrazione LangGraph, UX spiegabile e automazioni n8n per ridurre il time-to-impact dei progetti AI."
        align="center"
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr,0.75fr]">
        <div className="space-y-6">
          {capabilityTracks.map((track, index) => (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NeuralCard padding="lg">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-neural-cyan">
                        {iconMap[track.icon]}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Capability</p>
                        <h3 className="text-2xl font-semibold text-white">{track.title}</h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
                      {track.stack.map((tool) => (
                        <span key={tool} className="rounded-full border border-white/15 px-3 py-1 text-white/70">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/80">{track.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {track.focusAreas.map((focus) => (
                      <Badge key={focus} variant="outline" className="text-[0.65rem]">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>
              </NeuralCard>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NeuralCard padding="lg">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Toolchain</p>
              <div className="mt-6 space-y-5">
                {toolHighlights.map((cluster) => (
                  <div
                    key={cluster.area}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="glow" className="text-[0.6rem]">
                        {cluster.area}
                      </Badge>
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                        {cluster.category}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-white/80">{cluster.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cluster.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/60"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </NeuralCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <NeuralCard tone="primary" padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-neural-cyan">
                  <BsGlobe className="text-2xl" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">Competenze</p>
                  <h3 className="text-2xl font-semibold text-white">Lingue</h3>
                </div>
              </div>
              <div className="space-y-4">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="rounded-2xl border border-white/15 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-white">{lang.name}</p>
                      <Badge variant="outline" className="text-[0.65rem]">
                        {lang.level}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-white/70">{lang.description}</p>
                  </div>
                ))}
              </div>
            </NeuralCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}