import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export default function SkillsRadar() {
  const isEn = useAppStore(s => s.language === 'en');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-2 rounded-xl border border-neural-cyan/30 bg-black/40 p-4 shadow-[0_0_20px_rgba(0,255,255,0.1)] backdrop-blur-md"
    >
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neural-cyan">
        {isEn ? 'AI & Web Engineering Stack' : 'Stack AI & Web Engineering'}
      </h4>
      <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
        <div className="rounded-lg border border-white/5 bg-white/5 p-2">
          <span className="block font-medium text-white">AI / LLM</span>
          <span className="text-[0.65rem] opacity-70">LangChain, LangGraph, Vercel AI SDK, Groq</span>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 p-2">
          <span className="block font-medium text-white">Frontend</span>
          <span className="text-[0.65rem] opacity-70">Next.js 16, React 19, Three.js, GSAP</span>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 p-2">
          <span className="block font-medium text-white">Backend</span>
          <span className="text-[0.65rem] opacity-70">Node.js, Vector DBs, Edge Functions</span>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 p-2">
          <span className="block font-medium text-white">Ops / Tools</span>
          <span className="text-[0.65rem] opacity-70">n8n, Vercel, Docker, Git</span>
        </div>
      </div>
    </motion.div>
  );
}
