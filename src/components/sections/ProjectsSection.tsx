'use client';

import { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkDarkMode();

    // Set up a mutation observer to detect dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const projects: Project[] = [
    {
      id: 1,
      title: 'BeFluent',
      description: 'Web app React+Node.js per bambini dislessici con supporto conversazionale AI.',
      image: '/befluent_logo.png',
      longDescription:
        "BeFluent è un'applicazione web progettata per aiutare bambini con dislessia attraverso un'interfaccia conversazionale basata su AI. " +
        "L'app utilizza tecnologie React per il frontend e Node.js per il backend, con supporto di modelli linguistici avanzati per fornire feedback " +
        "personalizzati e adattivi. La soluzione è stata progettata con un focus sull'accessibilità e sulla facilità d'uso.",
      tags: ['React', 'Node.js', 'AI', 'Accessibilità', 'LangChain'],
      link: 'https://github.com/Hellvisback365/BeFluentVITO.git',
    },
    {
      id: 2,
      title: 'POSD System',
      description: 'Soluzione privacy-oriented conforme GDPR, architettura MVC.',
      image: '/posd.png',
      longDescription:
        "POSD System (Privacy-Oriented System Design) è una soluzione software che implementa un'architettura MVC con focus sulla conformità GDPR. " +
        "Il sistema è progettato per garantire la sicurezza dei dati utente end-to-end, con crittografia avanzata e controlli di accesso granulari. " +
        "La piattaforma include funzionalità per la gestione del consenso degli utenti e strumenti per l'analisi dell'impatto sulla privacy.",
      tags: ['Privacy', 'GDPR', 'MVC', 'Sicurezza', 'Python'],

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
          <h1 
            className="text-3xl md:text-4xl font-bold mb-6" 
            style={{ color: isDarkMode ? 'white' : 'black' }}
          >
            I Miei Progetti
          </h1>
          <p 
            className="text-lg max-w-3xl mx-auto"
            style={{ color: isDarkMode ? 'white' : 'black' }}
          >
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
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform"
            >
              <div className="h-48 bg-gray-300 dark:bg-gray-700 relative overflow-hidden">
                <motion.div 
                  className="h-full w-full flex items-center justify-center relative"
                  animate={{ 
                    scale: hoveredProject === project.id ? 1.05 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary-light/40 to-blue-600/40 dark:from-primary-dark/40 dark:to-blue-500/40"
                    animate={{ 
                      opacity: hoveredProject === project.id ? 0.2 : 0.4
                    }}
                    transition={{ duration: 0.3 }}
                  >
                  </motion.div>
                </motion.div>
              </div>

              <div className="p-6">
                <motion.h3 
                  className="text-xl font-bold mb-2 text-gray-900 dark:text-white"
                  animate={{ 
                    y: hoveredProject === project.id ? -2 : 0,
                    color: hoveredProject === project.id ? 
                      (isDarkMode ? '#60a5fa' : '#3b82f6') : 
                      (isDarkMode ? '#ffffff' : '#111827')
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {project.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 mb-4"
                  animate={{ opacity: hoveredProject === project.id ? 0.9 : 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  {project.description}
                </motion.p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        y: hoveredProject === project.id ? -2 : 0 
                      }}
                      transition={{ 
                        duration: 0.2, 
                        delay: i * 0.05,
                        type: 'spring'
                      }}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </motion.span>
                  ))}
                  {project.tags.length > 3 && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        y: hoveredProject === project.id ? -2 : 0 
                      }}
                      transition={{ 
                        duration: 0.2, 
                        delay: 0.15 
                      }}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      +{project.tags.length - 3}
                    </motion.span>
                  )}
                </div>

                <motion.button
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white font-medium rounded hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
                >
                  Dettagli
                </motion.button>
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