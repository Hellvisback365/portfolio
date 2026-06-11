import { motion } from 'framer-motion';

interface ProjectCardProps {
  projectName: string;
}

export default function ProjectCard({ projectName }: ProjectCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 flex flex-col gap-2 rounded-xl border border-neural-cyan/30 bg-black/40 p-4 shadow-[0_0_20px_rgba(0,255,255,0.1)] backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{projectName}</h4>
        <span className="rounded-full bg-neural-cyan/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-neural-cyan">
          Case Study
        </span>
      </div>
      <p className="text-xs text-white/70">
        Sto recuperando le informazioni per il progetto {projectName}. Puoi trovare maggiori dettagli scorrendo la pagina o visitando la sezione progetti!
      </p>
      <button className="mt-2 w-full rounded-lg bg-white/10 py-1.5 text-xs text-white transition hover:bg-neural-cyan hover:text-black">
        Esplora Progetto
      </button>
    </motion.div>
  );
}
