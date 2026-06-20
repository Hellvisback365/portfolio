export type SkillIconKey =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'tensorflow'
  | 'scikitlearn'
  | 'llms'
  | 'nlp'
  | 'react'
  | 'node'
  | 'mongodb'
  | 'tailwind'
  | 'framer'
  | 'code'
  | 'brain'
  | 'web'
  | 'robot'
  | 'translate'
  | 'globe';

export interface CapabilityTrack {
  title: string;
  icon: SkillIconKey;
  description: { it: string; en: string };
  focusAreas: string[];
  stack: string[];
}

export interface ExperienceMetric {
  label: string;
  value: string;
  caption: { it: string; en: string };
}

export interface ToolHighlight {
  area: string;
  category: string;
  description: { it: string; en: string };
  tools: string[];
}

export interface Language {
  name: { it: string; en: string };
  level: { it: string; en: string };
  description: { it: string; en: string };
}

export const capabilityTracks: CapabilityTrack[] = [
  {
    title: 'AI/ML & Data Science',
    icon: 'brain',
    description: {
      it: 'Sviluppo di sistemi di raccomandazione LLM-driven, architetture multi-agente e soluzioni NLP con focus su explainability e RAG.',
      en: 'Development of LLM-driven recommendation systems, multi-agent architectures, and NLP solutions with a focus on explainability and RAG.',
    },
    focusAreas: ['Recommender Systems', 'Multi-agent orchestration', 'Hybrid RAG', 'Explainability'],
    stack: ['LangGraph', 'LangChain', 'LLMs', 'Python', 'FAISS', 'BM25'],
  },
  {
    title: 'Web Development',
    icon: 'web',
    description: {
      it: 'Sviluppo full-stack con React e Next.js, API backend con Node.js/Express e integrazione con servizi AI.',
      en: 'Full-stack development with React and Next.js, backend APIs with Node.js/Express, and integration with AI services.',
    },
    focusAreas: ['Frontend React/Next.js', 'Backend Node.js', 'API Integration', 'Responsive Design'],
    stack: ['React', 'Next.js 15', 'Node.js', 'Express', 'Vite', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    title: 'DevOps & Integration',
    icon: 'code',
    description: {
      it: 'Automazione workflow, gestione database relazionali e NoSQL, metodologie Agile e version control.',
      en: 'Workflow automation, relational and NoSQL database management, Agile methodologies, and version control.',
    },
    focusAreas: ['Workflow Automation', 'Database Management', 'Agile/Scrum', 'CI/CD'],
    stack: ['n8n', 'GitHub', 'MySQL', 'MongoDB', 'Docker', 'npm/yarn'],
  },
];

export const experienceMetrics: ExperienceMetric[] = [
  {
    label: 'Briefing time',
    value: 'ore → secondi',
    caption: {
      it: 'Riduzione tempi report con AI generativa (B.Future Challenge).',
      en: 'Reduction of report times with generative AI (B.Future Challenge).',
    },
  },
  {
    label: 'Recsys novelty',
    value: '+12%',
    caption: {
      it: 'Miglioramento diversità/novelty con Llama 3.2 e Multi-Agent.',
      en: 'Improvement in diversity/novelty with Llama 3.2 and Multi-Agent.',
    },
  },
  {
    label: 'Precision@1',
    value: '-0.5%',
    caption: {
      it: 'L\'agente aggregatore ha mantenuto quasi intatta la precisione del baseline.',
      en: 'The aggregator agent kept the baseline precision almost intact.',
    },
  },
  {
    label: 'Laurea triennale',
    value: '107/110',
    caption: {
      it: 'Informatica e Tecnologie per la Produzione del Software (UniBa).',
      en: 'Computer Science and Software Production Technologies (UniBa).',
    },
  },
];

export const toolHighlights: ToolHighlight[] = [
  {
    area: 'Programming Languages',
    category: 'Core',
    description: {
      it: 'Linguaggi di programmazione per sviluppo AI, web e sistemi enterprise.',
      en: 'Programming languages for AI, web, and enterprise systems development.',
    },
    tools: ['C', 'Python', 'Java', 'JavaScript', 'SQL', 'HTML/CSS'],
  },
  {
    area: 'AI/ML Stack',
    category: 'AI-first',
    description: {
      it: 'Framework e librerie per machine learning, LLM e sistemi di raccomandazione.',
      en: 'Frameworks and libraries for machine learning, LLMs, and recommendation systems.',
    },
    tools: ['LangGraph', 'LangChain', 'FAISS', 'BM25', 'Pandas', 'NumPy', 'Jupyter'],
  },
  {
    area: 'Web & Database',
    category: 'Full-stack',
    description: {
      it: 'Tecnologie per sviluppo web moderno e gestione dati.',
      en: 'Technologies for modern web development and data management.',
    },
    tools: ['React', 'Next.js', 'Node.js', 'Express', 'MySQL', 'MongoDB'],
  },
  {
    area: 'DevOps & Automation',
    category: 'Platform',
    description: {
      it: 'Strumenti per automazione, version control e metodologie di sviluppo.',
      en: 'Tools for automation, version control, and development methodologies.',
    },
    tools: ['n8n', 'GitHub', 'npm/yarn', 'VS Code', 'Eclipse', 'Agile/Scrum'],
  },
];

export const languages: Language[] = [
  {
    name: { it: 'Italiano', en: 'Italian' },
    level: { it: 'Madrelingua', en: 'Native' },
    description: {
      it: 'Lingua madre, comunicazione professionale e tecnica.',
      en: 'Native language, professional and technical communication.',
    },
  },
  {
    name: { it: 'Inglese', en: 'English' },
    level: { it: 'B1 - Base', en: 'B1 - Basic' },
    description: {
      it: 'Lettura documentazione tecnica, comunicazione scritta e meeting internazionali.',
      en: 'Reading technical documentation, written communication, and international meetings.',
    },
  },
];
