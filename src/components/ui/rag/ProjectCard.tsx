'use client';

import { motion } from 'framer-motion';

interface ProjectCardProps {
  projectName: string;
  /** Azione del bottone "Esplora progetto". Se assente, il bottone non è mostrato. */
  onExplore?: () => void;
}

export default function ProjectCard({ projectName, onExplore }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 flex flex-col gap-2 rounded-xl border border-accent/30 bg-accent/[0.06] p-4 backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{projectName}</h4>
        <span className="rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-accent-soft">
          Case Study
        </span>
      </div>
      <p className="text-xs text-white/70">
        Vai alla sezione progetti per i dettagli completi di {projectName}: ruolo,
        stack e risultati.
      </p>
      {onExplore && (
        <button
          type="button"
          onClick={onExplore}
          className="mt-2 w-full rounded-lg bg-accent py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          Esplora progetto
        </button>
      )}
    </motion.div>
  );
}
