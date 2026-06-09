export interface ProjectMetric {
  label: string;
  value: string;
  caption: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  type?: 'github' | 'live' | 'case-study';
}

export interface ProjectData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  longDescription: string;
  tags: string[];
  timeline: string;
  role: string;
  stack: string[];
  pillars: string[];
  metrics: ProjectMetric[];
  links?: ProjectLink[];
}

export const projects: ProjectData[] = [
  {
    id: 1,
    title: 'Talent Program "Next Pulse"',
    subtitle: 'EnLexi: AI Sales Assistant multi-sorgente per Engine S.p.A.',
    description:
      'Sviluppo backend in team per un AI Sales Assistant nel settore Traffic Enforcement e Smart City (Hackathon nazionale).',
    image: '/EnLexi.png',
    longDescription:
      'Durante il bootcamp selettivo intensivo (48h) su scala nazionale (320 candidati), ho contribuito allo sviluppo di EnLexi in un team di 5 persone. '
      + 'EnLexi è un AI Sales Assistant multi-sorgente per Engine S.p.A. Mi sono occupato del backend con focus sulla pipeline di retrieval e '
      + 'sull\'implementazione della ricerca ibrida (BM25 + ChromaDB/FAISS), gestendo anche l\'organizzazione del team e collaborando alla presentazione finale.',
    tags: ['Hackathon', 'Python', 'FastAPI', 'RAG', 'ChromaDB', 'FAISS'],
    timeline: 'Giugno 2026',
    role: 'Backend Developer / Team Organizer',
    stack: ['Python', 'FastAPI', 'BM25', 'ChromaDB', 'FAISS'],
    pillars: ['Hybrid RAG', 'AI Sales Assistant', 'Team Management', 'Backend'],
    metrics: [
      { label: 'Candidati', value: '320', caption: 'Bootcamp selettivo nazionale.' },
      { label: 'Durata', value: '48h', caption: 'Hackathon intensivo.' },
      { label: 'Retrieval', value: 'Ibrido', caption: 'Integrazione BM25 + FAISS/ChromaDB.' },
    ],
  },
  {
    id: 2,
    title: 'PugliaHack 2026',
    subtitle: 'TerraNode: Piattaforma per smart agri-tourism',
    description:
      'Sviluppo in autonomia di TerraNode, piattaforma con prenotazioni, gamification, tracciamento CO2 e dashboard real-time.',
    image: '/TerraNode.png',
    longDescription:
      'Nell\'ambito dell\'hackathon PugliaHack 2026 (finestra di sviluppo: 2 ore, piattaforma Lovable), ho sviluppato in autonomia TerraNode, '
      + 'una piattaforma per lo smart agri-tourism pugliese. La soluzione prevede ruoli distinti per turisti, agricoltori e Pubblica Amministrazione, '
      + 'includendo prenotazione di esperienze, gamification con crediti, tracciamento della CO2 e dashboard con KPI in tempo reale.',
    tags: ['Hackathon', 'React 19', 'TailwindCSS', 'Supabase', 'Agri-tourism'],
    timeline: 'Maggio 2026',
    role: 'Solo Developer',
    stack: ['React 19', 'TanStack Query', 'TailwindCSS', 'Supabase (PostgreSQL)'],
    pillars: ['Smart Tourism', 'Gamification', 'CO2 Tracking', 'Real-time Dashboards'],
    metrics: [
      { label: 'Tempo dev.', value: '2 ore', caption: 'Finestra di sviluppo estremamente ridotta.' },
      { label: 'Ruoli', value: '3', caption: 'Turisti, Agricoltori, PA.' },
      { label: 'Stack', value: 'Modern Web', caption: 'React 19 + Supabase.' },
    ],
  },
  {
    id: 3,
    title: 'Hackathon "Space Edition"',
    subtitle: 'The Pulse: Monitoraggio agricolo globale satellitare',
    description:
      '2° Classificato. Collaborazione all\'ideazione di un progetto per una costellazione di piccoli satelliti dedicati all\'agricoltura.',
    image: '/ThePulse.png',
    longDescription:
      'Hackathon organizzato da Talent Garden e Leonardo a Milano. Mi sono classificato al 2° posto collaborando all\'ideazione di "The Pulse", '
      + 'un progetto per una costellazione di piccoli satelliti dedicata al monitoraggio agricolo globale, integrando logiche di telerilevamento e AI.',
    tags: ['Hackathon', 'Space Tech', 'Agri-Tech', 'Innovation'],
    timeline: 'Maggio 2026',
    role: 'Team Member',
    stack: ['Ideation', 'Team Collaboration', 'Space/Agri Tech'],
    pillars: ['Space Technology', 'Agriculture', 'Teamwork', 'Innovation'],
    metrics: [
      { label: 'Piazzamento', value: '2° Posto', caption: 'Hackathon nazionale Talent Garden x Leonardo.' },
      { label: 'Focus', value: 'Satelliti', caption: 'Monitoraggio agricolo globale.' },
    ],
  },
  {
    id: 4,
    title: 'LACAM-SWAP · Orchestratore Multi-Agente',
    subtitle: 'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione',
    description:
      'Progetto di tesi: architettura multi-agente LLM orchestrata con LangGraph per raccomandazioni. Include RAG ibrido (BM25 + FAISS).',
    image: '/SWAP.jpg',
    longDescription:
      'Progetto di tesi sviluppato durante il tirocinio curriculare (marzo–giugno 2025) presso il laboratorio LACAM-SWAP dell\'Università di Bari. '
      + 'Ho implementato un\'architettura multi-agente basata su LLM (Llama 3.2 3B Instruct), orchestrata con LangGraph, che coordina agenti specializzati '
      + 'su precisione e copertura del catalogo tramite un agente aggregatore. L\'architettura include anche un sistema RAG ibrido (BM25 + FAISS).',
    tags: ['LangGraph', 'Multi-Agent', 'Recommender Systems', 'RAG', 'Thesis'],
    timeline: 'Marzo–Giugno 2025 · 3 mesi',
    role: 'AI Research Intern',
    stack: ['LangGraph', 'Python', 'Llama 3.2', 'FAISS', 'BM25'],
    pillars: ['Precision & Coverage Agents', 'Hybrid RAG', 'Aggregated-Agent', 'Llama 3.2'],
    metrics: [
      { label: 'Novelty', value: '+12%', caption: 'Miglioramento novità del catalogo raccomandato.' },
      { label: 'Precisione', value: '-0.5%', caption: 'Delta minimo rispetto al baseline massimizzato.' },
      { label: 'Dataset', value: 'MovieLens 1M', caption: 'Testato su benchmark standard.' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/LLM.git', type: 'github' },
    ],
  },
  {
    id: 5,
    title: 'B.Future Challenge 2025 · BOOM (CRIF)',
    subtitle: 'Zenith: Assistente AI per digitalizzare la consulenza',
    description:
      'Sviluppo backend in team di Zenith, assistente AI con workflow automatizzato per la digitalizzazione della consulenza aziendale.',
    image: '/b-future-challenge-2025.png',
    longDescription:
      'Hackathon multidisciplinare in team di 6 persone per VAR Group. Abbiamo sviluppato Zenith, assistente AI per automatizzare '
      + 'il processo di consulenza aziendale. Mi sono occupato della pipeline backend: orchestrazione tramite n8n, integrazione con Google Gemini '
      + 'e archiviazione su Google Drive. Il prototipo stimava un abbattimento drastico dei tempi di lavorazione.',
    tags: ['n8n', 'Gemini', 'API', 'Workflow Automation'],
    timeline: 'Settembre–Novembre 2025',
    role: 'Backend AI Developer',
    stack: ['n8n', 'Google Gemini', 'Google Drive API'],
    pillars: ['Orchestrazione workflow', 'Automazione API', 'Digitalizzazione', 'Riduzione tempi'],
    metrics: [
      { label: 'Tempo report', value: '7gg → 1gg', caption: 'Riduzione drastica stimata dei tempi di produzione.' },
      { label: 'Team', value: '6 persone', caption: 'Collaborazione multidisciplinare.' },
      { label: 'Stack', value: 'n8n + Gemini', caption: 'Pipeline backend automatizzata.' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/ChallengeBoomVarGroup2025.git', type: 'github' },
    ],
  },
  {
    id: 6,
    title: 'BeFluent',
    subtitle: 'Web app per supporto alla dislessia',
    description:
      'Applicazione web React+Node.js progettata per aiutare bambini con dislessia attraverso un\'interfaccia intuitiva e accessibile.',
    image: '/BeFluent_logo.png',
    longDescription:
      'BeFluent è un\'applicazione web progettata per aiutare bambini con dislessia attraverso un\'interfaccia intuitiva e accessibile. '
      + 'L\'app utilizza tecnologie React per il frontend e Node.js per il backend, offrendo esercizi personalizzati e feedback adattivi. '
      + 'La soluzione è stata progettata con un focus sull\'accessibilità e sulla facilità d\'uso, '
      + 'permettendo un\'esperienza di apprendimento inclusiva e coinvolgente.',
    tags: ['React', 'Node.js', 'Accessibilità', 'JavaScript', 'UX Design'],
    timeline: 'Progetto Universitario',
    role: 'Developer',
    stack: ['React', 'Node.js', 'JavaScript', 'CSS', 'Express'],
    pillars: ['Accessibilità', 'UX per bambini', 'Supporto dislessia', 'Design inclusivo'],
    metrics: [
      { label: 'Target', value: 'Bambini', caption: 'Interfaccia pensata per utenti con dislessia.' },
      { label: 'Stack', value: 'React + Node.js', caption: 'Frontend moderno e backend robusto.' },
      { label: 'Focus', value: 'Accessibilità', caption: 'Design inclusivo e facilità d\'uso.' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/BeFluentVITO.git', type: 'github' },
    ],
  },
  {
    id: 7,
    title: 'POSD System',
    subtitle: 'Privacy-Oriented System Design conforme GDPR',
    description:
      'Soluzione software privacy-oriented con architettura MVC, progettata per garantire conformità GDPR e sicurezza dei dati.',
    image: '/POSD.png',
    longDescription:
      'POSD System (Privacy-Oriented System Design) è una soluzione software che implementa un\'architettura MVC con focus sulla conformità GDPR. '
      + 'Il sistema è progettato per garantire la sicurezza dei dati utente end-to-end, con crittografia avanzata e controlli di accesso granulari. '
      + 'La piattaforma include funzionalità per la gestione del consenso degli utenti e strumenti per l\'analisi dell\'impatto sulla privacy.',
    tags: ['Privacy', 'GDPR', 'MVC', 'Sicurezza', 'Python'],
    timeline: 'Progetto Universitario',
    role: 'Developer',
    stack: ['Python', 'MVC Architecture', 'Crittografia', 'GDPR Compliance'],
    pillars: ['Privacy by Design', 'GDPR Compliance', 'Crittografia E2E', 'Gestione consenso'],
    metrics: [
      { label: 'Standard', value: 'GDPR', caption: 'Piena conformità alle normative europee.' },
      { label: 'Sicurezza', value: 'End-to-End', caption: 'Crittografia avanzata dei dati.' },
      { label: 'Architettura', value: 'MVC', caption: 'Design modulare e manutenibile.' },
    ],
  },
];
