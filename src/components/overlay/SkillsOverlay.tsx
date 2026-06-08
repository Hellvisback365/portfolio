'use client';

import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { capabilityTracks, toolHighlights, languages } from '@/data/skills';

const CATEGORY_LEGEND = [
  { label: 'AI/ML & Data Science', color: '#5DE0E6' },
  { label: 'Web Development', color: '#60A5FA' },
  { label: 'DevOps & Integration', color: '#C084FC' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

export default function SkillsOverlay() {
  return (
    <div className="flex min-h-screen w-screen items-start justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeIn}
          className="mb-8 text-center"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#5DE0E6]/70">
            Skill Matrix
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Capacità trasversali per prodotti AI-first
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
            Dal brief al roll-out: combino ricerca, orchestrazione LangGraph, UX spiegabile e
            automazioni n8n per ridurre il time-to-impact dei progetti AI.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          variants={fadeIn}
          className="mb-10 flex flex-wrap justify-center gap-6"
        >
          {CATEGORY_LEGEND.map((cat) => (
            <div key={cat.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-white/60">{cat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
          {/* Left: Capability tracks */}
          <div className="space-y-5">
            {capabilityTracks.map((track, index) => (
              <motion.div
                key={track.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={2 + index}
                variants={fadeIn}
                className="glass-holographic rounded-2xl p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                      Capability
                    </p>
                    <h3 className="text-xl font-semibold text-white">{track.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {track.stack.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-white/12 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-white/60"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-white/70">{track.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {track.focusAreas.map((focus) => (
                    <Badge key={focus} variant="outline" className="text-[0.6rem]">
                      {focus}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Toolchain + Languages */}
          <div className="space-y-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={5}
              variants={fadeIn}
              className="glass-holographic rounded-2xl p-5"
            >
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                Toolchain
              </p>
              <div className="mt-4 space-y-4">
                {toolHighlights.map((cluster) => (
                  <div
                    key={cluster.area}
                    className="rounded-xl border border-white/8 bg-white/5 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="glow" className="text-[0.55rem]">
                        {cluster.area}
                      </Badge>
                      <span className="text-[0.55rem] uppercase tracking-[0.3em] text-white/40">
                        {cluster.category}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-white/60">{cluster.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cluster.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-white/5 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white/50"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={6}
              variants={fadeIn}
              className="glass-holographic rounded-2xl p-5"
            >
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                Lingue
              </p>
              <div className="mt-4 space-y-3">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-white">{lang.name}</p>
                      <Badge variant="outline" className="text-[0.6rem]">
                        {lang.level}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-white/60">{lang.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
