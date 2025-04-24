'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

export default function TechStack() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Dark mode detection
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is active on initial load
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Set up a MutationObserver to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const headingStyle = {
    color: isDarkMode ? '#ffffff' : '#000000',  // white in dark mode, black in light mode
  };
  
  // Force white color for tech stack items
  const whiteTextStyle = {
    color: '#ffffff',
  };

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
    <section className="py-10 md:py-16 bg-transparent dark:bg-transparent transition-colors duration-200">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-3xl font-bold mb-8 md:mb-12 text-center" style={headingStyle}>
          Stack Tecnologico
        </h2>
        
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 justify-items-center"
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex flex-col items-center p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow w-[90%] sm:w-28"
            >
              <span className="text-2xl md:text-3xl mb-1 md:mb-2 text-white" style={whiteTextStyle} role="img" aria-label={tech.name}>
                {tech.icon}
              </span>
              <span className="font-medium text-xs md:text-sm text-center text-white" style={whiteTextStyle}>
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 