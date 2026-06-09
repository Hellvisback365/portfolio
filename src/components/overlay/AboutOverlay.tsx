'use client';

import { motion } from 'framer-motion';
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

const focusPills = ['Assistenti enterprise', 'Multi-agent Recsys', 'Workflow automation', 'AI compliance'];

const formationItems = [
  {
    label: 'LM-18 · Computer Science – AI',
    detail: 'Università degli Studi di Bari Aldo Moro · Da Ottobre 2025',
  },
  {
    label: 'Laurea L-31 · 107/110',
    detail: 'Informatica e Tecnologia per la Produzione del Software · UniBa (2022-2025)',
  },
  {
    label: 'Diploma · Amministrazione, Finanza e Marketing',
    detail: 'I.I.S.S Alpi-Montale, Rutigliano (BA) · 2011-2016',
  },
];

const interestItems = [
  { label: 'Recommender Systems & Multi-Agent LLM', icon: <FaBrain className="text-[#5DE0E6]" /> },
  { label: 'NLP, Transformer & Explainability', icon: <FaLanguage className="text-[#5DE0E6]" /> },
  { label: 'Workflow Automation (n8n · API Integration)', icon: <FaShieldAlt className="text-[#5DE0E6]" /> },
];

const socialLinks = [
  { icon: <FaGithub />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/vito-p-9120028a/', label: 'LinkedIn' },
  { icon: <FaEnvelope />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
];

const timelineMilestones = [
  {
    id: 1,
    date: 'Giugno 2026',
    title: 'Talent Program "Next Pulse"',
    location: 'Chieti',
    description: 'Sviluppo backend in team per EnLexi: un AI Sales Assistant multi-sorgente.',
    highlights: [
      'Bootcamp selettivo intensivo su scala nazionale (320 candidati).',
      'Implementazione pipeline di retrieval ibrida (BM25 + ChromaDB/FAISS) con FastAPI.',
    ],
  },
  {
    id: 2,
    date: 'Maggio 2026',
    title: 'PugliaHack 2026',
    location: 'Bari',
    description: 'Sviluppo in autonomia di TerraNode, piattaforma per lo smart agri-tourism.',
    highlights: [
      'Stack React 19, TailwindCSS, Supabase (PostgreSQL).',
      'Sviluppato in sole 2 ore. Gamification, tracciamento CO2 e dashboard KPI in tempo reale.',
    ],
  },
  {
    id: 3,
    date: 'Maggio 2026',
    title: 'Hackathon "Space Edition"',
    location: 'Milano · Talent Garden x Leonardo',
    description: '2° Classificato all\'hackathon nazionale per l\'ideazione di The Pulse.',
    highlights: [
      'Progetto per una costellazione di piccoli satelliti dedicati al monitoraggio agricolo globale.',
      'Integrazione di logiche di telerilevamento e Artificial Intelligence.',
    ],
  },
  {
    id: 4,
    date: 'Settembre–Novembre 2025',
    title: 'B.Future Challenge 2025 · VAR Group x CRIF',
    location: 'Bologna · Remote',
    description: 'Partecipante alla challenge aziendale: sviluppo in team di Zenith, assistente AI per consulenza.',
    highlights: [
      'Workflow automatizzato con n8n, Gemini e Google Drive API.',
      'Riduzione stimata dei tempi di reportistica da 7 giorni a 1.',
    ],
  },
  {
    id: 5,
    date: 'Marzo–Giugno 2025',
    title: 'Tirocinio Curriculare · LACAM-SWAP',
    location: 'Università di Bari',
    description: 'Progetto di tesi: Orchestrazione di Agenti LLM per l\'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione.',
    highlights: [
      'Architettura multi-agente LangGraph + RAG Ibrido (BM25 e FAISS).',
      '+12% novelty mantenendo inalterata la precisione media del baseline con Llama 3.2 3B.',
    ],
  },
  {
    id: 6,
    date: 'Settembre 2022–Luglio 2025',
    title: 'Laurea Triennale L-31 · 107/110',
    location: 'Università degli Studi di Bari Aldo Moro',
    description: 'Informatica e Tecnologia per la Produzione del Software.',
    highlights: [
      'Tesi su orchestrazione multi-agente LLM applicata ai sistemi di raccomandazione.',
      'Prosecuzione in LM-18 Computer Science – Artificial Intelligence.',
    ],
  },
  {
    id: 7,
    date: '2016–2022',
    title: 'Operaio Generico e Retail',
    location: 'Bari',
    description: 'Esperienza lavorativa in settori trasversali (edilizia, agricoltura, reception, gestione negozio).',
    highlights: [
      '6 anni di esperienza prima di intraprendere il percorso in Informatica.',
      'Forte focus su resilienza, problem-solving, e capacità di adattamento in team.',
    ],
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function AboutOverlay() {
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
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#5DE0E6]/70">Chi sono</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Studente in Computer Science – AI
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            Laureando magistrale appassionato di IA e Machine Learning, con esperienza in sistemi di
            raccomandazione LLM-driven e automazione workflow.
          </p>
        </motion.div>

        {/* Main grid: portrait + bio */}
        <div className="grid gap-6 lg:grid-cols-[0.8fr,1.2fr]">
          {/* Portrait card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeIn}
            className="glass-holographic overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/6]">
              <Image
                src="/me.jpg"
                alt="Vito Piccolini"
                fill
                priority
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-cover"
                style={{ objectPosition: 'center 18%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5DE0E6]" />
                Ritratto · Bari 2025
              </div>
            </div>
            <div className="border-t border-white/10 bg-black/40 px-5 py-5 backdrop-blur">
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">AI Developer</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Vito Piccolini</h3>
              <p className="mt-1 text-xs text-white/60">
                Sviluppo sistemi di raccomandazione LLM-driven, architetture multi-agente e automazioni
                workflow con Python e LangGraph.
              </p>
              <div className="mt-3 flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-[#5DE0E6]/50 hover:text-[#5DE0E6]"
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
                <p>
                  Dopo la laurea triennale in Informatica (107/110) sto proseguendo con la LM-18 in
                  Computer Science – Artificial Intelligence presso l&apos;Università di Bari.
                </p>
                <p>
                  Durante il tirocinio nel laboratorio LACAM-SWAP ho sviluppato un&apos;architettura
                  multi-agente basata su LLM, orchestrata con LangGraph, ottenendo +12% di diversità e
                  +53% precision@1.
                </p>
                <p>
                  Competenze in Python, LangChain, LangGraph, React, Node.js e n8n per prototipazione
                  rapida in team multidisciplinari.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {focusPills.map((pill) => (
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
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">Formazione</p>
                <div className="mt-3 space-y-3">
                  {formationItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-2 rounded-xl border border-white/8 bg-white/5 p-3"
                    >
                      <FaGraduationCap className="mt-0.5 shrink-0 text-[#5DE0E6] text-sm" />
                      <div>
                        <p className="text-xs font-semibold text-white">{item.label}</p>
                        <p className="text-[0.65rem] text-white/60">{item.detail}</p>
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
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">Interessi</p>
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
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#5DE0E6]/70">Percorso</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Ricerca, challenge e delivery</h3>
        </motion.div>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#5DE0E6]/30 via-white/10 to-[#C084FC]/20" />
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
                      {item.date}
                    </Badge>
                    <span className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40">
                      {item.location}
                    </span>
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-white">{item.title}</h4>
                  <p className="mt-1 text-xs text-white/70">{item.description}</p>
                  <ul className="mt-3 space-y-1.5">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-white/60">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#5DE0E6]" />
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
