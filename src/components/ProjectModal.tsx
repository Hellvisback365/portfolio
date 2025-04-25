'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

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
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1 + (i * 0.1),
        duration: 0.4
      }
    })
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backdropVariants}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-40 md:h-64 bg-gradient-to-r from-primary-light to-blue-600 dark:from-primary-dark dark:to-blue-500 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: imageLoaded ? 1 : 1.1, 
              opacity: imageLoaded ? 1 : 0 
            }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-contain p-3"
              priority
              onLoadingComplete={() => setImageLoaded(true)}
            />
          </motion.div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-primary-light/30 to-blue-600/30 dark:from-primary-dark/30 dark:to-blue-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          ></motion.div>
        </div>
        
        <div className="p-4 md:p-6">
          <motion.h2 
            custom={0}
            variants={contentVariants}
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            {project.title}
          </motion.h2>

          <motion.div 
            custom={1}
            variants={contentVariants}
            className="flex flex-wrap gap-2 mb-4"
          >
            {project.tags.map((tag, i) => (
              <motion.span 
                key={i} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.3 + (i * 0.05),
                  type: "spring",
                  stiffness: 300
                }}
                className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.p 
            custom={2}
            variants={contentVariants}
            className="text-gray-700 dark:text-gray-300 mb-6 text-base md:text-lg"
          >
            {project.longDescription}
          </motion.p>
          
          <motion.div 
            custom={3}
            variants={contentVariants}
            className="flex flex-col sm:flex-row justify-between gap-3"
          >
            {project.link && (
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white font-medium rounded hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors text-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Visita Progetto
              </motion.a>
            )}
            
            <motion.button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Chiudi
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
} 