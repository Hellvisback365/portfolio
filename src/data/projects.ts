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
    title: 'B.Future Challenge 2025 · BOOM (CRIF)',
    subtitle: 'Assistente AI per consulenza enterprise',
    description:
      'Partecipante alla challenge con VAR Group: sviluppo in team di un assistente AI con workflow automatizzato per ricerca pre-incontro, supporto live e reportistica istantanea.',
    image: '/b-future-challenge-2025.png',
    longDescription:
      'Da settembre a novembre 2025 ho partecipato alla B.Future Challenge promossa da CRIF, collaborando con il team VAR Group (Bologna). '
      + 'Abbiamo sviluppato un assistente AI per consulenza enterprise, implementando un workflow automatizzato con n8n, Gemini e Ollama. '
      + 'Il sistema integra ricerca pre-incontro per raccogliere intelligence sui prospect, supporto live durante le call e generazione di report istantanei. '
      + 'Particolare attenzione è stata posta alla privacy dei dati (compliance GDPR) e alle demo interattive per stakeholder aziendali.',
    tags: ['n8n', 'Gemini', 'Ollama', 'GDPR', 'Workflow Automation'],
    timeline: 'Settembre–Novembre 2025 · 2 mesi',
    role: 'AI Developer · VAR Group',
    stack: ['n8n', 'Gemini', 'Ollama', 'Node.js', 'API Integration'],
    pillars: ['Ricerca pre-incontro', 'Supporto live', 'Reportistica automatica', 'Privacy GDPR'],
    metrics: [
      { label: 'Tempo report', value: 'ore → secondi', caption: 'Riduzione drastica tramite AI generativa.' },
      { label: 'Durata progetto', value: '2 mesi', caption: 'Da settembre a novembre 2025.' },
      { label: 'Focus', value: 'GDPR compliant', caption: 'Privacy dati e demo interattive aziendali.' },
    ],
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vito-p-9120028a/details/projects/', type: 'case-study' },
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/ChallengeBoomVarGroup2025.git', type: 'github' },
    ],
  },
  {
    id: 2,
    title: 'LACAM-SWAP · Orchestratore Multi-Agente',
    subtitle: 'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione',
    description:
      'Tirocinio curriculare e tesi di laurea: architettura multi-agente LLM per superare il trade-off precisione/diversità nei recommender systems.',
    image: '/SWAP.jpg',
    longDescription:
      'Progetto di tesi sviluppato durante il tirocinio curriculare (marzo–giugno 2025) presso il laboratorio LACAM-SWAP dell\'Università di Bari. '
      + 'Ho affrontato il limite dei sistemi di raccomandazione tradizionali, spesso bloccati nel compromesso tra precisione e diversità ("filter bubble"). '
      + 'Ho implementato un\'architettura multi-agente basata su LLM, orchestrata con LangGraph, composta da tre agenti specializzati: '
      + 'Precision-Agent (massimizza accuratezza), Coverage-Agent (aumenta diversità e scoperta contenuti di nicchia), e Aggregated-Agent '
      + '(analizza le proposte degli altri due per generare una lista finale bilanciata, giustificando ogni scelta).',
    tags: ['LangGraph', 'Multi-Agent', 'Recommender Systems', 'Explainability', 'Thesis'],
    timeline: 'Marzo–Giugno 2025 · 3 mesi',
    role: 'AI Research Intern',
    stack: ['LangGraph', 'Python', 'LLMs', 'NLP'],
    pillars: ['Precision-Agent', 'Coverage-Agent', 'Aggregated-Agent', 'Explainable recommendations'],
    metrics: [
      { label: 'Diversity uplift', value: '+12%', caption: 'Miglioramento copertura categorie rispetto al baseline.' },
      { label: 'Precision@1', value: '+53%', caption: 'Incremento precisione sulla prima raccomandazione (K=1).' },
      { label: 'Precisione media', value: 'Mantenuta', caption: 'Stessa precisione dell\'agente specializzato.' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/LLM.git', type: 'github' },
    ],
  },
  {
    id: 3,
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
    id: 4,
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
