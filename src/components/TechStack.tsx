'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function TechStack() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const technologies = [
    { name: 'Python', icon: '🐍' },
    { name: 'LLaMA', icon: '🦙' },
    { name: 'Mistral', icon: '🌪️' },
    { name: 'TensorFlow', icon: '📊' },
    { name: 'PyTorch', icon: '🔥' },
    { name: 'React', icon: '⚛️' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'LangChain', icon: '🔗' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 bg-transparent dark:bg-transparent transition-colors duration-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
          Stack Tecnologico
        </h2>
        
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="flex flex-wrap justify-center gap-6"
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow w-28"
            >
              <span className="text-3xl mb-2" role="img" aria-label={tech.name}>
                {tech.icon}
              </span>
              <span className="text-gray-800 dark:text-gray-200 font-medium text-sm text-center">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 