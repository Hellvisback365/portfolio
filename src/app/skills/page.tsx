'use client';

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

export default function Skills() {
  // Skills data
  const skills = [
    {
      category: 'Linguaggi di Programmazione',
      items: [
        { name: 'Python', level: 90 },
        { name: 'JavaScript', level: 85 },
        { name: 'TypeScript', level: 80 },
      ]
    },
    {
      category: 'AI & Machine Learning',
      items: [
        { name: 'TensorFlow', level: 80 },
        { name: 'PyTorch', level: 75 },
        { name: 'Scikit-learn', level: 85 },
        { name: 'LLMs', level: 90 },
        { name: 'NLP', level: 85 },
      ]
    },
    {
      category: 'Web Development',
      items: [
        { name: 'React', level: 85 },
        { name: 'Node.js', level: 80 },
        { name: 'MongoDB', level: 75 },
        { name: 'Tailwind CSS', level: 90 },
        { name: 'Framer Motion', level: 85 },
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Competenze Tecniche
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Le mie competenze spaziano dall'integrazione di LLM locali al frontend development, 
            con un focus particolare sull'ottimizzazione delle performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {skills.map((skillGroup, groupIndex) => {
            const [ref, inView] = useInView({
              triggerOnce: true,
              threshold: 0.1,
            });

            return (
              <motion.div
                key={groupIndex}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                  {skillGroup.category}
                </h2>

                <div className="space-y-6">
                  {skillGroup.items.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          className="h-2.5 rounded-full bg-primary-light dark:bg-primary-dark"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
} 