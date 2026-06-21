export interface ProjectMetric {
  label: { it: string; en: string } | string;
  value: { it: string; en: string } | string;
  caption: { it: string; en: string };
}

export interface ProjectLink {
  label: string;
  href: string;
  type?: 'github' | 'live' | 'case-study';
}

export interface ProjectData {
  id: number;
  title: string;
  subtitle: { it: string; en: string };
  description: { it: string; en: string };
  image: string;
  longDescription: { it: string; en: string };
  tags: ({ it: string; en: string } | string)[];
  timeline: { it: string; en: string } | string;
  role: { it: string; en: string } | string;
  stack: ({ it: string; en: string } | string)[];
  pillars: ({ it: string; en: string } | string)[];
  metrics: ProjectMetric[];
  links?: ProjectLink[];
}

export const projects: ProjectData[] = [
  {
    id: 1,
    title: 'Talent Program "Next Pulse"',
    subtitle: {
      it: 'EnLexi: AI Sales Assistant multi-sorgente per Engine S.p.A.',
      en: 'EnLexi: Multi-source AI Sales Assistant for Engine S.p.A.',
    },
    description: {
      it: 'Sviluppo backend in team per un AI Sales Assistant nel settore Traffic Enforcement e Smart City (Hackathon nazionale).',
      en: 'Team backend development for an AI Sales Assistant in the Traffic Enforcement and Smart City sector (National Hackathon).',
    },
    image: '/next-pulse-polaroid.jpg',
    longDescription: {
      it: 'Durante il bootcamp selettivo intensivo (48h) su scala nazionale (320 candidati), ho contribuito allo sviluppo di EnLexi in un team di 5 persone. '
        + 'EnLexi è un AI Sales Assistant multi-sorgente per Engine S.p.A. Mi sono occupato del backend con focus sulla pipeline di retrieval e '
        + 'sull\'implementazione della ricerca ibrida (BM25 + ChromaDB/FAISS), gestendo anche l\'organizzazione del team e collaborando alla presentazione finale.',
      en: 'During the intensive selective bootcamp (48h) on a national scale (320 candidates), I contributed to the development of EnLexi in a 5-person team. '
        + 'EnLexi is a multi-source AI Sales Assistant for Engine S.p.A. I worked on the backend focusing on the retrieval pipeline and '
        + 'implementing hybrid search (BM25 + ChromaDB/FAISS), while also managing team organization and collaborating on the final presentation.',
    },
    tags: ['Hackathon', 'Python', 'FastAPI', 'RAG', 'ChromaDB', 'FAISS'],
    timeline: { it: 'Giugno 2026', en: 'June 2026' },
    role: { it: 'Backend Developer / Team Organizer', en: 'Backend Developer / Team Organizer' },
    stack: ['Python', 'FastAPI', 'BM25', 'ChromaDB', 'FAISS'],
    pillars: ['Hybrid RAG', 'AI Sales Assistant', 'Team Management', 'Backend'],
    metrics: [
      { label: { it: 'Candidati', en: 'Candidates' }, value: '320', caption: { it: 'Bootcamp selettivo nazionale.', en: 'National selective bootcamp.' } },
      { label: { it: 'Durata', en: 'Duration' }, value: '48h', caption: { it: 'Hackathon intensivo.', en: 'Intensive hackathon.' } },
      { label: 'Retrieval', value: { it: 'Ibrido', en: 'Hybrid' }, caption: { it: 'Integrazione BM25 + FAISS/ChromaDB.', en: 'BM25 + FAISS/ChromaDB integration.' } },
    ],
  },
  {
    id: 2,
    title: 'PugliaHack 2026',
    subtitle: {
      it: 'TerraNode: Piattaforma per smart agri-tourism',
      en: 'TerraNode: Smart agri-tourism platform',
    },
    description: {
      it: 'Sviluppo in autonomia di TerraNode, piattaforma con prenotazioni, gamification, tracciamento CO2 e dashboard real-time.',
      en: 'Solo development of TerraNode, a platform with bookings, gamification, CO2 tracking, and a real-time dashboard.',
    },
    image: '/pugliahack-2026.png',
    longDescription: {
      it: 'Nell\'ambito dell\'hackathon PugliaHack 2026 (finestra di sviluppo: 2 ore, piattaforma Lovable), ho sviluppato in autonomia TerraNode, '
        + 'una piattaforma per lo smart agri-tourism pugliese. La soluzione prevede ruoli distinti per turisti, agricoltori e Pubblica Amministrazione, '
        + 'includendo prenotazione di esperienze, gamification con crediti, tracciamento della CO2 e dashboard con KPI in tempo reale.',
      en: 'During the PugliaHack 2026 hackathon (development window: 2 hours, Lovable platform), I independently developed TerraNode, '
        + 'a platform for smart agri-tourism in Puglia. The solution features distinct roles for tourists, farmers, and Public Administration, '
        + 'including experience booking, credit-based gamification, CO2 tracking, and real-time KPI dashboards.',
    },
    tags: ['Hackathon', 'React 19', 'TailwindCSS', 'Supabase', 'Agri-tourism'],
    timeline: { it: 'Maggio 2026', en: 'May 2026' },
    role: { it: 'Solo Developer', en: 'Solo Developer' },
    stack: ['React 19', 'TanStack Query', 'TailwindCSS', 'Supabase (PostgreSQL)'],
    pillars: ['Smart Tourism', 'Gamification', 'CO2 Tracking', 'Real-time Dashboards'],
    metrics: [
      { label: { it: 'Tempo dev.', en: 'Dev time' }, value: { it: '2 ore', en: '2 hours' }, caption: { it: 'Finestra di sviluppo estremamente ridotta.', en: 'Extremely short development window.' } },
      { label: { it: 'Ruoli', en: 'Roles' }, value: '3', caption: { it: 'Turisti, Agricoltori, PA.', en: 'Tourists, Farmers, PA.' } },
      { label: 'Stack', value: 'Modern Web', caption: { it: 'React 19 + Supabase.', en: 'React 19 + Supabase.' } },
    ],
  },
  {
    id: 3,
    title: 'Hackathon "Space Edition"',
    subtitle: {
      it: 'The Pulse: Monitoraggio agricolo globale satellitare',
      en: 'The Pulse: Global satellite agricultural monitoring',
    },
    description: {
      it: '2° Classificato. Collaborazione all\'ideazione di un progetto per una costellazione di piccoli satelliti dedicati all\'agricoltura.',
      en: '2nd Place. Collaboration on the design of a small satellite constellation project dedicated to agriculture.',
    },
    image: '/leonardo-hackathon.jpg',
    longDescription: {
      it: 'Hackathon organizzato da Talent Garden e Leonardo a Milano. Mi sono classificato al 2° posto collaborando all\'ideazione di "The Pulse", '
        + 'un progetto per una costellazione di piccoli satelliti dedicata al monitoraggio agricolo globale, integrando logiche di telerilevamento e AI.',
      en: 'Hackathon organized by Talent Garden and Leonardo in Milan. I placed 2nd collaborating on the conception of "The Pulse", '
        + 'a small satellite constellation project dedicated to global agricultural monitoring, integrating remote sensing and AI logic.',
    },
    tags: ['Hackathon', 'Space Tech', 'Agri-Tech', 'Innovation'],
    timeline: { it: 'Maggio 2026', en: 'May 2026' },
    role: { it: 'Team Member', en: 'Team Member' },
    stack: ['Ideation', 'Team Collaboration', 'Space/Agri Tech'],
    pillars: ['Space Technology', 'Agriculture', 'Teamwork', 'Innovation'],
    metrics: [
      { label: { it: 'Piazzamento', en: 'Placement' }, value: { it: '2° Posto', en: '2nd Place' }, caption: { it: 'Hackathon nazionale Talent Garden x Leonardo.', en: 'National Hackathon Talent Garden x Leonardo.' } },
      { label: 'Focus', value: { it: 'Satelliti', en: 'Satellites' }, caption: { it: 'Monitoraggio agricolo globale.', en: 'Global agricultural monitoring.' } },
    ],
  },
  {
    id: 4,
    title: 'LACAM-SWAP · Orchestratore Multi-Agente',
    subtitle: {
      it: 'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione',
      en: 'Multi-Metric Optimization in Recommendation Systems',
    },
    description: {
      it: 'Progetto di tesi: architettura multi-agente LLM orchestrata con LangGraph per raccomandazioni. Include RAG ibrido (BM25 + FAISS).',
      en: 'Thesis project: LLM multi-agent architecture orchestrated with LangGraph for recommendations. Includes hybrid RAG (BM25 + FAISS).',
    },
    image: '/SWAP.jpg',
    longDescription: {
      it: 'Progetto di tesi in Linguaggi di Programmazione sviluppato durante il tirocinio curriculare (marzo–giugno 2025) presso il laboratorio LACAM-SWAP dell\'Università di Bari (Relatore: Prof. Cataldo Musto | Correlatore: Dott. Alessandro Petruzzelli). '
        + 'Ho implementato un\'architettura multi-agente basata su LLM (Llama 3.2 3B Instruct via OpenRouter, temperatura 0.2), orchestrata con LangGraph. L\'architettura '
        + 'coordina agenti specializzati (Precision-Agent, Coverage-Agent) tramite un Aggregated-Agent. È incluso un sistema RAG ibrido (BM25 + FAISS) valutato su '
        + 'metriche multiple: Precision@K, Recall@K, Coverage e AvgPopularity@K.',
      en: 'Thesis project in Programming Languages developed during the curricular internship (March–June 2025) at the LACAM-SWAP lab, University of Bari (Advisor: Prof. Cataldo Musto | Co-advisor: Dott. Alessandro Petruzzelli). '
        + 'I implemented an LLM-based multi-agent architecture (Llama 3.2 3B Instruct via OpenRouter, temperature 0.2), orchestrated with LangGraph. The architecture '
        + 'coordinates specialized agents (Precision-Agent, Coverage-Agent) via an Aggregated-Agent. It includes a hybrid RAG system (BM25 + FAISS) evaluated on '
        + 'multiple metrics: Precision@K, Recall@K, Coverage and AvgPopularity@K.',
    },
    tags: ['LangGraph', 'Multi-Agent', 'Recommender Systems', 'RAG', 'Thesis'],
    timeline: { it: 'Marzo–Giugno 2025 · 3 mesi', en: 'March–June 2025 · 3 months' },
    role: { it: 'AI Research Intern', en: 'AI Research Intern' },
    stack: ['LangGraph', 'Python', 'Llama 3.2', 'FAISS', 'BM25'],
    pillars: ['Precision & Coverage Agents', 'Hybrid RAG', 'Aggregated-Agent', 'Llama 3.2'],
    metrics: [
      { label: { it: 'Novità (AvgPop)', en: 'Novelty (AvgPop)' }, value: '+12%', caption: { it: 'Miglioramento novità del catalogo raccomandato.', en: 'Improvement in recommended catalog novelty.' } },
      { label: { it: 'Precisione', en: 'Precision' }, value: '-0.5%', caption: { it: 'Delta minimo rispetto al baseline massimizzato.', en: 'Minimal delta compared to maximized baseline.' } },
      { label: 'Dataset', value: 'MovieLens 1M', caption: { it: '1.000.209 valutazioni, 6040 utenti, 3883 film, 18 generi.', en: '1,000,209 ratings, 6040 users, 3883 movies, 18 genres.' } },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/LLM.git', type: 'github' },
    ],
  },
  {
    id: 5,
    title: 'B.Future Challenge 2025 · BOOM (CRIF)',
    subtitle: {
      it: 'Zenith: Assistente AI per digitalizzare la consulenza',
      en: 'Zenith: AI Assistant for digitalizing consulting',
    },
    description: {
      it: 'Sviluppo backend in team di Zenith, assistente AI con workflow automatizzato per la digitalizzazione della consulenza aziendale.',
      en: 'Team backend development of Zenith, an AI assistant with automated workflow for the digitalization of corporate consulting.',
    },
    image: '/b-future-challenge-2025.png',
    longDescription: {
      it: 'Hackathon multidisciplinare in team di 6 persone per VAR Group. Abbiamo sviluppato Zenith, assistente AI per automatizzare '
        + 'il processo di consulenza aziendale. Mi sono occupato della pipeline backend: orchestrazione tramite n8n, integrazione con Google Gemini '
        + 'e archiviazione su Google Drive. Il prototipo stimava un abbattimento drastico dei tempi di lavorazione.',
      en: 'Multidisciplinary hackathon in a 6-person team for VAR Group. We developed Zenith, an AI assistant to automate '
        + 'the corporate consulting process. I handled the backend pipeline: orchestration via n8n, integration with Google Gemini '
        + 'and storage on Google Drive. The prototype estimated a drastic reduction in processing times.',
    },
    tags: ['n8n', 'Gemini', 'API', 'Workflow Automation'],
    timeline: { it: 'Settembre–Novembre 2025', en: 'September–November 2025' },
    role: { it: 'Backend AI Developer', en: 'Backend AI Developer' },
    stack: ['n8n', 'Google Gemini', 'Google Drive API'],
    pillars: [{ it: 'Orchestrazione workflow', en: 'Workflow orchestration' }, { it: 'Automazione API', en: 'API automation' }, { it: 'Digitalizzazione', en: 'Digitalization' }, { it: 'Riduzione tempi', en: 'Time reduction' }],
    metrics: [
      { label: { it: 'Tempo report', en: 'Report time' }, value: '7gg → 1gg', caption: { it: 'Riduzione drastica stimata dei tempi di produzione.', en: 'Estimated drastic reduction in production times.' } },
      { label: 'Team', value: { it: '6 persone', en: '6 people' }, caption: { it: 'Collaborazione multidisciplinare.', en: 'Multidisciplinary collaboration.' } },
      { label: 'Stack', value: 'n8n + Gemini', caption: { it: 'Pipeline backend automatizzata.', en: 'Automated backend pipeline.' } },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/ChallengeBoomVarGroup2025.git', type: 'github' },
    ],
  },
  {
    id: 6,
    title: 'BeFluent',
    subtitle: {
      it: 'Web app per supporto alla dislessia',
      en: 'Web app for dyslexia support',
    },
    description: {
      it: 'Applicazione web React+Node.js progettata per aiutare bambini con dislessia attraverso un\'interfaccia intuitiva e accessibile.',
      en: 'React+Node.js web application designed to help children with dyslexia through an intuitive and accessible interface.',
    },
    image: '/BeFluent_logo.png',
    longDescription: {
      it: 'BeFluent è un\'applicazione web progettata per aiutare bambini con dislessia attraverso un\'interfaccia intuitiva e accessibile. '
        + 'L\'app utilizza tecnologie React per il frontend e Node.js per il backend, offrendo esercizi personalizzati e feedback adattivi. '
        + 'La soluzione è stata progettata con un focus sull\'accessibilità e sulla facilità d\'uso, '
        + 'permettendo un\'esperienza di apprendimento inclusiva e coinvolgente.',
      en: 'BeFluent is a web application designed to help children with dyslexia through an intuitive and accessible interface. '
        + 'The app uses React for the frontend and Node.js for the backend, offering personalized exercises and adaptive feedback. '
        + 'The solution was designed with a focus on accessibility and ease of use, '
        + 'allowing for an inclusive and engaging learning experience.',
    },
    tags: ['React', 'Node.js', { it: 'Accessibilità', en: 'Accessibility' }, 'JavaScript', 'UX Design'],
    timeline: { it: 'Progetto Universitario', en: 'University Project' },
    role: { it: 'Developer', en: 'Developer' },
    stack: ['React', 'Node.js', 'JavaScript', 'CSS', 'Express'],
    pillars: [{ it: 'Accessibilità', en: 'Accessibility' }, { it: 'UX per bambini', en: 'UX for children' }, { it: 'Supporto dislessia', en: 'Dyslexia support' }, { it: 'Design inclusivo', en: 'Inclusive design' }],
    metrics: [
      { label: 'Target', value: { it: 'Bambini', en: 'Children' }, caption: { it: 'Interfaccia pensata per utenti con dislessia.', en: 'Interface designed for users with dyslexia.' } },
      { label: 'Stack', value: 'React + Node.js', caption: { it: 'Frontend moderno e backend robusto.', en: 'Modern frontend and robust backend.' } },
      { label: 'Focus', value: { it: 'Accessibilità', en: 'Accessibility' }, caption: { it: 'Design inclusivo e facilità d\'uso.', en: 'Inclusive design and ease of use.' } },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/BeFluentVITO.git', type: 'github' },
    ],
  },
  {
    id: 7,
    title: 'POSD System',
    subtitle: {
      it: 'Privacy-Oriented System Design conforme GDPR',
      en: 'GDPR compliant Privacy-Oriented System Design',
    },
    description: {
      it: 'Soluzione software privacy-oriented con architettura MVC, progettata per garantire conformità GDPR e sicurezza dei dati.',
      en: 'Privacy-oriented software solution with MVC architecture, designed to ensure GDPR compliance and data security.',
    },
    image: '/POSD.png',
    longDescription: {
      it: 'POSD System (Privacy-Oriented System Design) è una soluzione software che implementa un\'architettura MVC con focus sulla conformità GDPR. '
        + 'Il sistema è progettato per garantire la sicurezza dei dati utente end-to-end, con crittografia avanzata e controlli di accesso granulari. '
        + 'La piattaforma include funzionalità per la gestione del consenso degli utenti e strumenti per l\'analisi dell\'impatto sulla privacy.',
      en: 'POSD System (Privacy-Oriented System Design) is a software solution that implements an MVC architecture focusing on GDPR compliance. '
        + 'The system is designed to ensure end-to-end user data security, with advanced encryption and granular access controls. '
        + 'The platform includes features for managing user consent and tools for analyzing privacy impact.',
    },
    tags: ['Privacy', 'GDPR', 'MVC', { it: 'Sicurezza', en: 'Security' }, 'Python'],
    timeline: { it: 'Progetto Universitario', en: 'University Project' },
    role: { it: 'Developer', en: 'Developer' },
    stack: ['Python', 'MVC Architecture', { it: 'Crittografia', en: 'Cryptography' }, 'GDPR Compliance'],
    pillars: ['Privacy by Design', 'GDPR Compliance', { it: 'Crittografia E2E', en: 'E2E Cryptography' }, { it: 'Gestione consenso', en: 'Consent Management' }],
    metrics: [
      { label: { it: 'Standard', en: 'Standard' }, value: 'GDPR', caption: { it: 'Piena conformità alle normative europee.', en: 'Full compliance with European regulations.' } },
      { label: { it: 'Sicurezza', en: 'Security' }, value: 'End-to-End', caption: { it: 'Crittografia avanzata dei dati.', en: 'Advanced data encryption.' } },
      { label: { it: 'Architettura', en: 'Architecture' }, value: 'MVC', caption: { it: 'Design modulare e manutenibile.', en: 'Modular and maintainable design.' } },
    ],
  },
];
