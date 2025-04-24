/* eslint-disable react/no-unescaped-entities */
'use client';

import { InView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  SiPython, 
  SiJavascript, 
  SiTypescript, 
  SiTensorflow, 
  SiPytorch, 
  SiScikitlearn, 
  SiReact, 
  SiNodedotjs, 
  SiMongodb, 
  SiTailwindcss, 
  SiFramer 
} from 'react-icons/si';
import { BsRobot, BsTranslate } from 'react-icons/bs';
import { HiCode } from 'react-icons/hi';
import { FaBrain } from 'react-icons/fa';
import { TbWorldWww } from 'react-icons/tb';

export default function SkillsSection() {
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
  
  const textStyle = {
    color: isDarkMode ? '#d1d5db' : '#000000',  // gray-300 in dark mode, black in light mode
  };

  // Unused variables commented out
  // const skillNameStyle = {
  //   color: isDarkMode ? '#e5e7eb' : '#000000',  // gray-200 in dark mode, black in light mode
  // };

  // const percentStyle = {
  //   color: isDarkMode ? '#9ca3af' : '#000000',  // gray-400 in dark mode, black in light mode
  // };

  // Force white color for category titles and skill names
  const whiteTextStyle = {
    color: '#ffffff',
  };

  const skills = [
    {
      category: 'Linguaggi di Programmazione',
      icon: <HiCode className="text-2xl mb-2" />,
      items: [
        { name: 'Python', level: 90, icon: <SiPython className="text-lg mr-2" /> },
        { name: 'JavaScript', level: 85, icon: <SiJavascript className="text-lg mr-2" /> },
        { name: 'TypeScript', level: 80, icon: <SiTypescript className="text-lg mr-2" /> },
      ]
    },
    {
      category: 'AI & Machine Learning',
      icon: <FaBrain className="text-2xl mb-2" />,
      items: [
        { name: 'TensorFlow', level: 80, icon: <SiTensorflow className="text-lg mr-2" /> },
        { name: 'PyTorch', level: 75, icon: <SiPytorch className="text-lg mr-2" /> },
        { name: 'Scikit-learn', level: 85, icon: <SiScikitlearn className="text-lg mr-2" /> },
        { name: 'LLMs', level: 90, icon: <BsRobot className="text-lg mr-2" /> },
        { name: 'NLP', level: 85, icon: <BsTranslate className="text-lg mr-2" /> },
      ]
    },
    {
      category: 'Web Development',
      icon: <TbWorldWww className="text-2xl mb-2" />,
      items: [
        { name: 'React', level: 85, icon: <SiReact className="text-lg mr-2" /> },
        { name: 'Node.js', level: 80, icon: <SiNodedotjs className="text-lg mr-2" /> },
        { name: 'MongoDB', level: 75, icon: <SiMongodb className="text-lg mr-2" /> },
        { name: 'Tailwind CSS', level: 90, icon: <SiTailwindcss className="text-lg mr-2" /> },
        { name: 'Framer Motion', level: 85, icon: <SiFramer className="text-lg mr-2" /> },
      ]
    }
  ];

  return (
    <section id="skills" className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6" style={headingStyle}>
          Competenze Tecniche
        </h1>
        <p className="text-lg max-w-3xl mx-auto" style={textStyle}>
          Le mie competenze spaziano dall'integrazione di LLM locali al frontend development, 
          con un focus particolare sull'ottimizzazione delle performance.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {skills.map((skillGroup, groupIndex) => (
          <InView key={groupIndex} triggerOnce threshold={0.1}>
            {({ ref, inView }) => (
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-bold mb-6 text-center text-white flex flex-col items-center" style={whiteTextStyle}>
                  {skillGroup.icon}
                  {skillGroup.category}
                </h2>

                <div className="space-y-6">
                  {skillGroup.items.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white flex items-center" style={whiteTextStyle}>
                          {skill.icon}
                          {skill.name}
                        </span>
                        <span className="text-sm text-white" style={whiteTextStyle}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          className="h-2.5 rounded-full bg-blue-500 dark:bg-blue-600"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </InView>
        ))}
      </div>
    </section>
  );
} 