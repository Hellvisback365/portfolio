'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazily load the project modal component
const ProjectModal = dynamic(() => import('@/components/ProjectModal'), {
  loading: () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
  ssr: false,
});

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  longDescription: string;
  tags: string[];
  link?: string;
}

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 1,
      title: 'BeFluent',
      description: 'Web app React+Node.js per bambini dislessici con supporto conversazionale AI.',
      image: '/placeholder-project.jpg',
      longDescription:
        "BeFluent è un'applicazione web progettata per aiutare bambini con dislessia attraverso un'interfaccia conversazionale basata su AI. " +
        "L'app utilizza tecnologie React per il frontend e Node.js per il backend, con supporto di modelli linguistici avanzati per fornire feedback " +
        "personalizzati e adattivi. La soluzione è stata progettata con un focus sull'accessibilità e sulla facilità d'uso.",
      tags: ['React', 'Node.js', 'AI', 'Accessibilità', 'LangChain'],
      link: 'https://github.com',
    },
    {
      id: 2,
      title: 'POSD System',
      description: 'Soluzione privacy-oriented conforme GDPR, architettura MVC.',
      image: '/placeholder-project.jpg',
      longDescription:
        "POSD System (Privacy-Oriented System Design) è una soluzione software che implementa un'architettura MVC con focus sulla conformità GDPR. " +
        "Il sistema è progettato per garantire la sicurezza dei dati utente end-to-end, con crittografia avanzata e controlli di accesso granulari. " +
        "La piattaforma include funzionalità per la gestione del consenso degli utenti e strumenti per l'analisi dell'impatto sulla privacy.",
      tags: ['Privacy', 'GDPR', 'MVC', 'Sicurezza', 'Python'],
      link: 'https://github.com',
    },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            I Miei Progetti
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Una selezione dei progetti su cui ho lavorato, focalizzati su integrazione AI, privacy e user experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gray-300 dark:bg-gray-700">
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-primary-light/80 to-blue-600/80 dark:from-primary-dark/80 dark:to-blue-500/80">
                  <h3 className="text-white text-2xl font-bold">{project.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white font-medium rounded hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
                >
                  Dettagli
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
} 