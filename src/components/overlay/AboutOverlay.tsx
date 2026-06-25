'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  FaGraduationCap,
  FaBrain,
  FaLanguage,
  FaShieldAlt,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from 'react-icons/fa';
import Badge from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';

import { personalInfo, formationItems, timelineMilestones } from '@/data/about';
import { loc } from '@/lib/i18n';

const getInterestItems = (isEn: boolean) => [
  { label: isEn ? 'Recommender Systems & Multi-Agent LLM' : 'Recommender Systems & Multi-Agent LLM', icon: <FaBrain className="text-[white]" /> },
  { label: isEn ? 'NLP, Transformer & Explainability' : 'NLP, Transformer & Explainability', icon: <FaLanguage className="text-[white]" /> },
  { label: isEn ? 'Workflow Automation (n8n · API Integration)' : 'Workflow Automation (n8n · API Integration)', icon: <FaShieldAlt className="text-[white]" /> },
];

const socialLinks = [
  { icon: <FaGithub />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/vitopiccolini/', label: 'LinkedIn' },
  { icon: <FaEnvelope />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const getPortraitImages = (isEn: boolean) => [
  { id: 'me', src: '/me.jpg', label: isEn ? 'Bachelor\'s degree · Bari 2025' : 'Laurea triennale · Bari 2025', position: 'center 18%' },
  { id: 'next', src: '/next-pulse-polaroid.jpg', label: 'Next Pulse · Chieti 2026', position: 'center' },
  { id: 'leonardo', src: '/leonardo-hackathon.jpg', label: isEn ? 'Leonardo Hackathon · Milan' : 'Hackathon Leonardo · Milano', position: 'center' },
];

export default function AboutOverlay() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';

  const portraitImages = getPortraitImages(isEn);
  const interestItems = getInterestItems(isEn);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % portraitImages.length);
    }, 6000); // Cambia immagine ogni 6 secondi
    return () => clearInterval(interval);
  }, [portraitImages.length]);

  return (
    <div className="flex min-h-screen w-screen items-start justify-center px-4 py-20 sm:px-8">
      <div className="w-full max-w-5xl space-y-10">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeIn}
        >
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">{isEn ? 'About me' : 'Chi sono'}</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            {personalInfo.role}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            {isEn ? personalInfo.shortBio.en : personalInfo.shortBio.it}
          </p>
        </motion.div>

        {/* Main grid: portrait + bio */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr] lg:items-start">
          {/* Portrait card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeIn}
            whileHover={{ y: -4 }}
            className="w-full max-w-3xl mx-auto lg:max-w-none glass-holographic overflow-hidden rounded-2xl transition-all duration-500 hover:border-white/25 hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.05)]"
          >
            <div className="relative w-full overflow-hidden bg-[#05060d] aspect-video lg:aspect-[4/5] max-h-[500px]">
              {/* Cinematic Carousel */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={portraitImages[currentImgIndex].id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  {/* Sfondo sfocato per riempire gli spazi vuoti senza croppare */}
                  <Image
                    src={portraitImages[currentImgIndex].src}
                    alt="Background blur"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover blur-2xl opacity-40 scale-125"
                  />
                  {/* Immagine in primo piano contenuta perfettamente (non croppata) */}
                  <motion.div
                    initial={{ scale: 1.02 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: 'linear' }} // Leggero Ken Burns solo sul foreground
                    className="absolute inset-0 z-10"
                  >
                    <Image
                      src={portraitImages[currentImgIndex].src}
                      alt={portraitImages[currentImgIndex].label}
                      fill
                      priority={currentImgIndex === 0}
                      quality={95}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-2 pb-12 sm:pb-2" // Spazio in basso per le etichette su mobile
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Improved Gradient: dark only at the bottom, transparent top */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05060d] via-[#05060d]/80 to-transparent z-20 pointer-events-none" />

              {/* Labels & Pagination */}
              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-2 z-30">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={portraitImages[currentImgIndex].id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white drop-shadow-md font-semibold"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-soft)] animate-pulse shadow-[0_0_8px_var(--color-accent)]" />
                    {portraitImages[currentImgIndex].label}
                  </motion.div>
                </AnimatePresence>

                {/* Dots indicator */}
                <div className="flex gap-1.5">
                  {portraitImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImgIndex(idx)}
                      className={`h-1 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 bg-[#05060d]/90 px-5 py-5 backdrop-blur-md">
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">AI Developer</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{personalInfo.name}</h3>
              <p className="mt-1 text-xs text-white/60">
                {isEn ? personalInfo.shortBio.en : personalInfo.shortBio.it}
              </p>
              <div className="mt-3 flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-[white]/50 hover:text-[white]"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bio + Formation + Interests */}
          <div className="space-y-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              variants={fadeIn}
              className="glass-holographic rounded-2xl p-5"
            >
              <div className="space-y-3 text-sm text-white/70">
                <p>{isEn ? personalInfo.longBio.en : personalInfo.longBio.it}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(isEn ? personalInfo.focusPills.en : personalInfo.focusPills.it).map((pill) => (
                  <Badge key={pill} variant="outline" className="text-[0.6rem]">
                    {pill}
                  </Badge>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Formation */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={3}
                variants={fadeIn}
                className="glass-holographic rounded-2xl p-5"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">{isEn ? 'Education' : 'Formazione'}</p>
                <div className="mt-3 space-y-3">
                  {formationItems.map((item) => (
                    <div
                      key={isEn ? item.label.en : item.label.it}
                      className="flex items-start gap-2 rounded-xl border border-white/8 bg-white/5 p-3"
                    >
                      <FaGraduationCap className="mt-0.5 shrink-0 text-[white] text-sm" />
                      <div>
                        <p className="text-xs font-semibold text-white">{isEn ? item.label.en : item.label.it}</p>
                        <p className="text-[0.65rem] text-white/60">{isEn ? item.detail.en : item.detail.it}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Interests */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={4}
                variants={fadeIn}
                className="glass-holographic rounded-2xl p-5"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">{isEn ? 'Interests' : 'Interessi'}</p>
                <div className="mt-3 space-y-2">
                  {interestItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5"
                    >
                      {item.icon}
                      <span className="text-xs text-white/80">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={5}
          variants={fadeIn}
        >
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">{isEn ? 'Journey' : 'Percorso'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{isEn ? 'Research, challenges and delivery' : 'Ricerca, challenge e delivery'}</h3>
        </motion.div>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[white]/30 via-white/10 to-[white]/20" />
          <div className="space-y-6">
            {timelineMilestones.map((item, index) => (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={6 + index}
                variants={fadeIn}
                className="relative pl-14"
              >
                <div className="absolute left-0 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-xs font-semibold text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="glass-holographic rounded-2xl p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[0.6rem]">
                      {isEn && typeof item.date !== 'string' ? item.date.en : (typeof item.date !== 'string' ? item.date.it : item.date)}
                    </Badge>
                    <span className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40">
                      {loc(item.location, isEn)}
                    </span>
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-white">
                    {loc(item.title, isEn)}
                  </h4>
                  <p className="mt-1 text-xs text-white/70">
                    {isEn ? item.description.en : item.description.it}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {(isEn ? item.highlights.en : item.highlights.it).map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-white/60">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[white]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
