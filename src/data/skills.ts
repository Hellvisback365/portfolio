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
  description: string;
  focusAreas: string[];
  stack: string[];
}

export interface ExperienceMetric {
  label: string;
  value: string;
  caption: string;
}

export interface ToolHighlight {
  area: string;
  category: string;
  description: string;
  tools: string[];
}

export interface Language {
  name: string;
  level: string;
  description: string;
}

export const capabilityTracks: CapabilityTrack[] = [
  {
    title: 'AI/ML & Data Science',
    icon: 'brain',
    description:
      'Sviluppo di sistemi di raccomandazione LLM-driven, architetture multi-agente e soluzioni NLP con focus su explainability.',
    focusAreas: ['Recommender Systems', 'Multi-agent orchestration', 'NLP & Transformer', 'Explainability'],
    stack: ['LangGraph', 'LangChain', 'LLMs (Gemini · Ollama)', 'Python'],
  },
  {
    title: 'Web Development',
    icon: 'web',
    description:
      'Sviluppo full-stack con React e Next.js, API backend con Node.js/Express e integrazione con servizi AI.',
    focusAreas: ['Frontend React/Next.js', 'Backend Node.js', 'API Integration', 'Responsive Design'],
    stack: ['React', 'Next.js 15', 'Node.js', 'Express', 'Vite', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    title: 'DevOps & Integration',
    icon: 'code',
    description:
      'Automazione workflow, gestione database relazionali e NoSQL, metodologie Agile e version control.',
    focusAreas: ['Workflow Automation', 'Database Management', 'Agile/Scrum', 'CI/CD'],
    stack: ['n8n', 'GitHub', 'MySQL', 'MongoDB', 'Docker', 'npm/yarn'],
  },
];

export const experienceMetrics: ExperienceMetric[] = [
  {
    label: 'Briefing time',
    value: 'ore → secondi',
    caption: 'Riduzione tempi report con AI generativa (B.Future Challenge).',
  },
  {
    label: 'Recsys diversity',
    value: '+12%',
    caption: 'Miglioramento diversità con Coverage-Agent (LACAM-SWAP).',
  },
  {
    label: 'Precision@1',
    value: '+53%',
    caption: 'Incremento precisione prima raccomandazione con architettura multi-agente.',
  },
  {
    label: 'Laurea triennale',
    value: '107/110',
    caption: 'Informatica e Tecnologie per la Produzione del Software (UniBa).',
  },
];

export const toolHighlights: ToolHighlight[] = [
  {
    area: 'Programming Languages',
    category: 'Core',
    description: 'Linguaggi di programmazione per sviluppo AI, web e sistemi enterprise.',
    tools: ['Python', 'Java', 'C#', 'JavaScript', 'SQL', 'HTML/CSS'],
  },
  {
    area: 'AI/ML Stack',
    category: 'AI-first',
    description: 'Framework e librerie per machine learning, LLM e sistemi di raccomandazione.',
    tools: ['LangGraph', 'LangChain', 'Gemini', 'Ollama', 'Transformer'],
  },
  {
    area: 'Web & Database',
    category: 'Full-stack',
    description: 'Tecnologie per sviluppo web moderno e gestione dati.',
    tools: ['React', 'Next.js', 'Node.js', 'Express', 'MySQL', 'MongoDB'],
  },
  {
    area: 'DevOps & Automation',
    category: 'Platform',
    description: 'Strumenti per automazione, version control e metodologie di sviluppo.',
    tools: ['n8n', 'GitHub', 'npm/yarn', 'VS Code', 'Eclipse', 'Agile/Scrum'],
  },
];

export const languages: Language[] = [
  {
    name: 'Italiano',
    level: 'Madrelingua',
    description: 'Lingua madre, comunicazione professionale e tecnica.',
  },
  {
    name: 'Inglese',
    level: 'B1 - Base',
    description: 'Lettura documentazione tecnica, comunicazione scritta e meeting internazionali.',
  },
];
