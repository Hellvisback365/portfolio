'use client';

import { motion } from 'framer-motion';
import { capabilityTracks } from '@/data/skills';
import { useAppStore } from '@/store/useAppStore';

export default function SkillsOverlay() {
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';

  // Extract tracks for easy radial placement
  const aiTrack = capabilityTracks[0];
  const webTrack = capabilityTracks[1];
  const devopsTrack = capabilityTracks[2];

  // Animation variants for entering the section
  const fadeIn = {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: (i: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none">
      
      {/* Vignette background to darken edges and make text readable against particles */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 55% at 50% 50%, transparent 20%, rgba(4,6,12,0.9) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl h-full flex items-center justify-center pointer-events-none p-4 md:p-8">
        
        {/* TOP CENTER: Title */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn}
          className="absolute top-[10%] md:top-[12%] left-1/2 -translate-x-1/2 text-center pointer-events-auto w-full px-4"
        >
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/50 mb-2">
            Skill Matrix
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide drop-shadow-lg">
            {isEn ? 'AI-first Capabilities' : 'Capacità AI-first'}
          </h2>
        </motion.div>

        {/* MIDDLE LEFT: AI/ML */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn}
          className="absolute left-[4%] md:left-[8%] lg:left-[12%] top-[30%] md:top-[35%] max-w-[180px] md:max-w-[260px] pointer-events-auto text-left"
        >
          <h3 className="text-[0.7rem] md:text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2 drop-shadow-md">
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"></span>
            {aiTrack.title}
          </h3>
          <p className="text-[0.55rem] md:text-xs text-white/60 mb-3 leading-relaxed hidden sm:block">
            {isEn && typeof aiTrack.description !== 'string' ? aiTrack.description.en : (typeof aiTrack.description !== 'string' ? aiTrack.description.it : aiTrack.description)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {aiTrack.stack.slice(0, 5).map(tool => (
              <span key={tool} className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-white/50">{tool}</span>
            ))}
          </div>
        </motion.div>

        {/* MIDDLE RIGHT: Web Dev */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn}
          className="absolute right-[4%] md:right-[8%] lg:right-[12%] top-[25%] md:top-[28%] max-w-[180px] md:max-w-[260px] pointer-events-auto text-right flex flex-col items-end"
        >
          <h3 className="text-[0.7rem] md:text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2 justify-end drop-shadow-md">
            {webTrack.title}
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#60A5FA] shadow-[0_0_8px_#60A5FA]"></span>
          </h3>
          <p className="text-[0.55rem] md:text-xs text-white/60 mb-3 leading-relaxed hidden sm:block">
            {isEn ? webTrack.description.en : webTrack.description.it}
          </p>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {webTrack.stack.slice(0, 5).map(tool => (
              <span key={tool} className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-white/50">{tool}</span>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM LEFT: DevOps */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn}
          className="absolute left-[6%] md:left-[10%] lg:left-[16%] bottom-[25%] md:bottom-[20%] max-w-[180px] md:max-w-[260px] pointer-events-auto text-left"
        >
          <h3 className="text-[0.7rem] md:text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2 drop-shadow-md">
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
            {devopsTrack.title}
          </h3>
          <p className="text-[0.55rem] md:text-xs text-white/60 mb-3 leading-relaxed hidden sm:block">
            {isEn ? devopsTrack.description.en : devopsTrack.description.it}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {devopsTrack.stack.slice(0, 4).map(tool => (
              <span key={tool} className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-white/50">{tool}</span>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM RIGHT: Toolchain & Langs */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn}
          className="absolute right-[6%] md:right-[10%] lg:right-[16%] bottom-[20%] md:bottom-[15%] max-w-[180px] md:max-w-[260px] pointer-events-auto text-right flex flex-col items-end"
        >
          <h3 className="text-[0.7rem] md:text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2 justify-end drop-shadow-md">
            Ecosystem
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.4)]"></span>
          </h3>
          <p className="text-[0.55rem] md:text-xs text-white/60 mb-3 leading-relaxed hidden sm:block">
            {isEn ? 'Core tools and language mastery to operate in international teams.' : 'Strumenti core e padronanza linguistica per operare in team internazionali.'}
          </p>
          <div className="flex flex-wrap gap-1.5 justify-end">
             <span className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-white/50">Git/GitHub</span>
             <span className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-white/50">VS Code</span>
             <span className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-[#60A5FA]/60">English B1</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
