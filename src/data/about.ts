export const personalInfo = {
  name: 'Vito Piccolini',
  role: 'AI Developer / Studente in Computer Science – AI',
  location: 'Noicattaro, Provincia di Bari (Italia)',
  birthDate: '12/06/1997',
  birthPlace: 'Mola di Bari',
  jobStatus: {
    it: 'Disponibilità immediata (nessun tempo di preavviso richiesto) e per stage curriculare LM-18 (da Giugno 2026) o per collaborazione AI-first come AI Developer / Software Engineer.',
    en: 'Immediate availability (no notice period required) and for LM-18 curricular internship (from June 2026) or AI-first collaboration as an AI Developer / Software Engineer.'
  },
  shortBio: {
    it: 'Sviluppo sistemi di raccomandazione LLM-driven, architetture multi-agente e automazioni workflow con Python e LangGraph.',
    en: 'I develop LLM-driven recommendation systems, multi-agent architectures, and workflow automations with Python and LangGraph.'
  },
  longBio: {
    it: 'Dopo la laurea triennale in Informatica (107/110) sto proseguendo con la LM-18 in Computer Science – Artificial Intelligence presso l\'Università di Bari. Durante il tirocinio nel laboratorio LACAM-SWAP ho sviluppato un\'architettura multi-agente basata su LLM, orchestrata con LangGraph, ottenendo +12% di diversità e +53% precision@1. Competenze in Python, LangChain, LangGraph, React, Node.js e n8n per prototipazione rapida in team multidisciplinari.',
    en: 'After my Bachelor\'s degree in Computer Science (107/110), I am pursuing a Master\'s degree in Computer Science – Artificial Intelligence at the University of Bari. During my internship at the LACAM-SWAP lab, I developed an LLM-based multi-agent architecture, orchestrated with LangGraph, achieving +12% diversity and +53% precision@1. Skills in Python, LangChain, LangGraph, React, Node.js, and n8n for rapid prototyping in multidisciplinary teams.'
  },
  focusPills: {
    it: ['Assistenti enterprise', 'Multi-agent Recsys', 'Workflow automation', 'AI compliance'],
    en: ['Enterprise assistants', 'Multi-agent Recsys', 'Workflow automation', 'AI compliance']
  },
};

export const formationItems = [
  {
    label: { it: 'LM-18 · Computer Science – AI', en: 'Master\'s · Computer Science – AI' },
    detail: { it: 'Università degli Studi di Bari Aldo Moro · Da Ottobre 2025', en: 'University of Bari Aldo Moro · From October 2025' },
  },
  {
    label: { it: 'Laurea L-31 · 107/110', en: 'Bachelor\'s L-31 · 107/110' },
    detail: { it: 'Informatica e Tecnologia per la Produzione del Software · UniBa (2022-2025)', en: 'Computer Science and Software Production Technology · UniBa (2022-2025)' },
  },
  {
    label: { it: 'Diploma · Amministrazione, Finanza e Marketing · 75/100', en: 'High School Diploma · Administration, Finance and Marketing · 75/100' },
    detail: { it: 'I.I.S.S Alpi-Montale, Rutigliano (BA) · 2011-2016', en: 'I.I.S.S Alpi-Montale, Rutigliano (BA) · 2011-2016' },
  },
];

export const timelineMilestones = [
  {
    id: 1,
    date: { it: 'Giugno 2026', en: 'June 2026' },
    title: 'Talent Program "Next Pulse"',
    location: 'Chieti',
    description: {
      it: 'Sviluppo backend in team per EnLexi: un AI Sales Assistant multi-sorgente.',
      en: 'Backend development in a team for EnLexi: a multi-source AI Sales Assistant.',
    },
    highlights: {
      it: [
        'Bootcamp selettivo intensivo su scala nazionale (320 candidati).',
        'Implementazione pipeline di retrieval ibrida (BM25 + ChromaDB/FAISS) con FastAPI.',
      ],
      en: [
        'Intensive selective bootcamp on a national scale (320 candidates).',
        'Implementation of a hybrid retrieval pipeline (BM25 + ChromaDB/FAISS) with FastAPI.',
      ],
    },
  },
  {
    id: 2,
    date: { it: 'Maggio 2026', en: 'May 2026' },
    title: 'PugliaHack 2026',
    location: 'Bari',
    description: {
      it: 'Sviluppo in autonomia di TerraNode, piattaforma per lo smart agri-tourism.',
      en: 'Solo development of TerraNode, a smart agri-tourism platform.',
    },
    highlights: {
      it: [
        'Stack React 19, TailwindCSS, Supabase (PostgreSQL).',
        'Sviluppato in sole 2 ore. Gamification, tracciamento CO2 e dashboard KPI in tempo reale.',
      ],
      en: [
        'React 19, TailwindCSS, Supabase (PostgreSQL) stack.',
        'Developed in just 2 hours. Gamification, CO2 tracking, and real-time KPI dashboard.',
      ],
    },
  },
  {
    id: 3,
    date: { it: 'Maggio 2026', en: 'May 2026' },
    title: 'Hackathon "Space Edition"',
    location: 'Milano · Talent Garden x Leonardo',
    description: {
      it: '2° Classificato all\'hackathon nazionale per l\'ideazione di The Pulse.',
      en: '2nd Place at the national hackathon for the conception of The Pulse.',
    },
    highlights: {
      it: [
        'Progetto per una costellazione di piccoli satelliti dedicati al monitoraggio agricolo globale.',
        'Integrazione di logiche di telerilevamento e Artificial Intelligence.',
      ],
      en: [
        'Project for a constellation of small satellites dedicated to global agricultural monitoring.',
        'Integration of remote sensing and Artificial Intelligence logic.',
      ],
    },
  },
  {
    id: 4,
    date: { it: 'Settembre–Novembre 2025', en: 'September–November 2025' },
    title: 'B.Future Challenge 2025 · VAR Group x CRIF',
    location: 'Bologna · Remote',
    description: {
      it: 'Partecipante alla challenge aziendale: sviluppo in team di Zenith, assistente AI per consulenza.',
      en: 'Participant in the corporate challenge: team development of Zenith, an AI consultant assistant.',
    },
    highlights: {
      it: [
        'Workflow automatizzato con n8n, Gemini e Google Drive API.',
        'Riduzione stimata dei tempi di reportistica da 7 giorni a 1.',
      ],
      en: [
        'Automated workflow with n8n, Gemini, and Google Drive API.',
        'Estimated reduction in reporting times from 7 days to 1.',
      ],
    },
  },
  {
    id: 5,
    date: { it: 'Marzo–Giugno 2025', en: 'March–June 2025' },
    title: { it: 'Tirocinio Curriculare · LACAM-SWAP', en: 'Curricular Internship · LACAM-SWAP' },
    location: { it: 'Università di Bari', en: 'University of Bari' },
    description: {
      it: 'Progetto di tesi: Orchestrazione di Agenti LLM per l\'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione.',
      en: 'Thesis project: Orchestration of LLM Agents for Multi-Metric Optimization in Recommendation Systems.',
    },
    highlights: {
      it: [
        'Architettura multi-agente LangGraph + RAG Ibrido (BM25 e FAISS).',
        '+12% novelty mantenendo inalterata la precisione media del baseline con Llama 3.2 3B.',
      ],
      en: [
        'Multi-agent architecture LangGraph + Hybrid RAG (BM25 and FAISS).',
        '+12% novelty while maintaining the average precision of the baseline with Llama 3.2 3B.',
      ],
    },
  },
  {
    id: 6,
    date: { it: 'Settembre 2022–Luglio 2025', en: 'September 2022–July 2025' },
    title: { it: 'Laurea Triennale L-31 · 107/110', en: 'Bachelor\'s Degree L-31 · 107/110' },
    location: { it: 'Università degli Studi di Bari Aldo Moro', en: 'University of Bari Aldo Moro' },
    description: {
      it: 'Informatica e Tecnologia per la Produzione del Software.',
      en: 'Computer Science and Software Production Technology.',
    },
    highlights: {
      it: [
        'Tesi su orchestrazione multi-agente LLM applicata ai sistemi di raccomandazione.',
        'Prosecuzione in LM-18 Computer Science – Artificial Intelligence.',
      ],
      en: [
        'Thesis on multi-agent LLM orchestration applied to recommendation systems.',
        'Continuation in LM-18 Computer Science – Artificial Intelligence.',
      ],
    },
  },
  {
    id: 7,
    date: '2016–2022',
    title: { it: 'Operaio Generico e Retail', en: 'General Worker and Retail' },
    location: 'Bari',
    description: {
      it: 'Esperienza lavorativa in settori trasversali (edilizia, agricoltura, reception, gestione negozio).',
      en: 'Work experience in transversal sectors (construction, agriculture, reception, shop management).',
    },
    highlights: {
      it: [
        '6 anni di esperienza prima di intraprendere il percorso in Informatica.',
        'Forte focus su resilienza, problem-solving, e capacità di adattamento in team.',
      ],
      en: [
        '6 years of experience before embarking on the Computer Science path.',
        'Strong focus on resilience, problem-solving, and adaptability in teams.',
      ],
    },
  },
];
