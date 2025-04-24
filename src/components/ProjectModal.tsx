'use client';

import { motion } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  longDescription: string;
  tags: string[];
  link?: string;
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-40 md:h-56 bg-gradient-to-r from-primary-light to-blue-600 dark:from-primary-dark dark:to-blue-500 flex items-center justify-center p-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">{project.title}</h2>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, i) => (
              <span 
                key={i} 
                className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-base md:text-lg">
            {project.longDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white font-medium rounded hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors text-center"
              >
                Visita Progetto
              </a>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 