'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import portraitImg from '@/../public/me.jpg';
import {
  FaGraduationCap,
  FaBrain,
  FaLanguage,
  FaShieldAlt,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from 'react-icons/fa';
import SectionHeader from '@/components/ui/SectionHeader';
import NeuralCard from '@/components/ui/NeuralCard';
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
  { label: 'Recommender Systems & Multi-Agent LLM', icon: <FaBrain className="text-neural-cyan" /> },
  { label: 'NLP, Transformer & Explainability', icon: <FaLanguage className="text-neural-cyan" /> },
  { label: 'Workflow Automation (n8n · API Integration)', icon: <FaShieldAlt className="text-neural-cyan" /> },
];

const socialLinks = [
  { icon: <FaGithub className="text-white" />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  {
    icon: <FaLinkedin className="text-white" />,
    href: 'https://www.linkedin.com/in/vito-p-9120028a/',
    label: 'LinkedIn',
  },
  { icon: <FaEnvelope className="text-white" />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
];

const timelineMilestones = [
  {
    id: 1,
    date: 'Settembre–Novembre 2025',
    title: 'B.Future Challenge 2025 · VAR Group x CRIF',
    location: 'Bologna · Remote',
    description:
      'Partecipante alla challenge aziendale: sviluppo in team di un assistente AI per consulenza enterprise.',
    highlights: [
      'Workflow automatizzato con n8n, Gemini e Ollama per ricerca pre-incontro e supporto live.',
      'Focus su privacy dati (GDPR) e demo interattive. Riduzione tempi report da ore a secondi.',
    ],
  },
  {
    id: 2,
    date: 'Marzo–Giugno 2025',
    title: 'Tirocinio Curriculare · LACAM-SWAP',
    location: 'Università di Bari',
    description:
      'Progetto di tesi: Orchestrazione di Agenti LLM per l\'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione.',
    highlights: [
      'Architettura multi-agente con Precision-Agent, Coverage-Agent e Aggregated-Agent.',
      '+12% diversità e +53% precision@1, mantenendo la stessa precisione media.',
    ],
  },
  {
    id: 3,
    date: 'Settembre 2022–Luglio 2025',
    title: 'Laurea Triennale L-31 · 107/110',
    location: 'Università degli Studi di Bari Aldo Moro',
    description:
      'Informatica e Tecnologia per la Produzione del Software, con focus su AI, sistemi e sviluppo software.',
    highlights: [
      'Tesi su orchestrazione multi-agente e explainability per sistemi di raccomandazione.',
      'Da Ottobre 2025 proseguo con la LM-18 in Computer Science – Artificial Intelligence.',
    ],
  },
  {
    id: 4,
    date: '2016–2022',
    title: 'Operaio Generico',
    location: 'Bari',
    description:
      'Esperienza lavorativa che ha sviluppato resilienza, capacità di problem-solving e lavoro in team.',
    highlights: [
      '6 anni di esperienza nel mondo del lavoro prima del percorso universitario.',
      'Soft skills fondamentali: gestione del tempo, collaborazione e determinazione.',
    ],
  },
];

export default function AboutSection() {
  return (
    <section id='about' className='container mx-auto px-4 py-16' aria-labelledby='about-title'>
      <span id='about-title' className='sr-only'>
        Chi sono
      </span>

      <div className='space-y-12'>
        <SectionHeader
          eyebrow='Chi sono'
          title='Studente in Computer Science – Artificial Intelligence'
          description='Laureando magistrale appassionato di IA e Machine Learning, con esperienza in sistemi di raccomandazione LLM-driven e automazione workflow.'
          align='left'
        />

        <div className='grid gap-10 lg:grid-cols-[0.9fr,1.1fr]'>
          <NeuralCard tone='primary' padding='none' className='overflow-hidden'>
            <div className='group relative isolate mx-auto w-full max-w-[360px] overflow-hidden sm:max-w-[420px] lg:max-w-[440px]'>
              <div className='relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/6]'>
                <Image
                  src={portraitImg}
                  alt='Vito Piccolini'
                  fill
                  priority
                  quality={90}
                  placeholder='blur'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw'
                  className='object-cover transition duration-700 ease-out group-hover:scale-[1.04]'
                  style={{ objectPosition: 'center 18%' }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent' />
                <div className='absolute inset-0 border border-white/15 mix-blend-screen opacity-70' />
                <div className='absolute bottom-4 left-4 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.45em] text-white/70 sm:text-xs'>
                  <span className='h-2 w-2 rounded-full bg-neural-cyan' />
                  Ritratto · Bari 2025
                </div>
              </div>
              <div className='pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(93,224,230,0.18),_transparent_60%)]' />
              </div>
            </div>
            <div className='border-t border-white/10 bg-black/40 px-6 py-6 backdrop-blur'>
              <p className='text-xs uppercase tracking-[0.35em] text-white/60'>AI Developer</p>
              <h3 className='mt-2 text-2xl font-semibold text-white'>Vito Piccolini</h3>
              <p className='mt-1 text-sm text-white/70'>
                Sviluppo sistemi di raccomandazione LLM-driven, architetture multi-agente e automazioni workflow con Python e LangGraph.
              </p>
              <div className='mt-4 flex gap-3'>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target='_blank'
                    rel='noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors hover:border-neural-cyan/70'
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </NeuralCard>

          <NeuralCard padding='lg'>
            <div className='space-y-5 text-sm text-white/80'>
              <p>
                Dopo la laurea triennale in Informatica (107/110) sto proseguendo con la LM-18 in Computer Science – Artificial Intelligence 
                presso l&apos;Università degli Studi di Bari Aldo Moro. Ho partecipato alla B.Future Challenge 2025 con il team VAR Group.
              </p>
              <p>
                Durante il tirocinio nel laboratorio LACAM-SWAP ho sviluppato un&apos;architettura multi-agente basata su LLM, orchestrata con 
                LangGraph, ottenendo +12% di diversità e +53% precision@1 nei sistemi di raccomandazione.
              </p>
              <p>
                Sono appassionato di AI, Machine Learning e automazione workflow. Competenze in Python, LangChain, LangGraph, React, Node.js 
                e n8n per prototipazione rapida in team multidisciplinari.
              </p>
              <div className='flex flex-wrap gap-2 pt-1'>
                {focusPills.map((pill) => (
                  <Badge key={pill} variant='outline' className='text-[0.6rem]'>
                    {pill}
                  </Badge>
                ))}
              </div>
            </div>
          </NeuralCard>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <NeuralCard padding='lg'>
            <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Formazione</p>
            <div className='mt-4 space-y-4'>
              {formationItems.map((item) => (
                <div key={item.label} className='flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4'>
                  <FaGraduationCap className='mt-1 text-neural-cyan' />
                  <div>
                    <p className='text-sm font-semibold text-white'>{item.label}</p>
                    <p className='text-xs text-white/70'>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </NeuralCard>

          <NeuralCard padding='lg'>
            <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Interessi</p>
            <div className='mt-4 space-y-3'>
              {interestItems.map((interest) => (
                <div
                  key={interest.label}
                  className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3'
                >
                  {interest.icon}
                  <span className='text-sm text-white'>{interest.label}</span>
                </div>
              ))}
            </div>
          </NeuralCard>
        </div>
      </div>

      <div className='mt-20'>
        <SectionHeader
          eyebrow='Percorso'
          title='Ricerca, challenge e delivery'
          description='Esperienze che raccontano come unisco studio accademico, competizioni AI e implementazione di sistemi pronti alla produzione.'
          align='center'
        />

        <div className='relative mt-12'>
          <div className='absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-neural-cyan/40 via-white/15 to-neural-magenta/30' />
          <div className='space-y-10'>
            {timelineMilestones.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className='relative pl-16'
              >
                <div className='absolute left-0 top-4 flex flex-col items-center'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/60 text-sm font-semibold text-white shadow-neural-card'>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <NeuralCard padding='lg' className='w-full'>
                  <div className='flex flex-wrap items-center gap-3'>
                    <Badge variant='outline' className='text-[0.65rem]'>
                      {item.date}
                    </Badge>
                    <p className='text-xs uppercase tracking-[0.3em] text-white/50'>{item.location}</p>
                  </div>
                  <h4 className='mt-4 text-2xl font-semibold text-white'>{item.title}</h4>
                  <p className='mt-2 text-sm text-white/80'>{item.description}</p>
                  <ul className='mt-4 space-y-2 text-sm text-white/70'>
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className='flex items-start gap-2'>
                        <span className='mt-1 h-1.5 w-1.5 rounded-full bg-neural-cyan' />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </NeuralCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
