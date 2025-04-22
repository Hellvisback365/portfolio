'use client';

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const timelineItems = [
    {
      id: 1,
      date: '2022–2025',
      title: 'Laurea Triennale Informatica',
      location: 'Università di Bari',
      description: 'Corso di laurea incentrato su fondamenti di programmazione, algoritmi, e intelligenza artificiale.',
    },
    {
      id: 2,
      date: 'Marzo–Giugno 2025',
      title: 'Tirocinio LACAM-SWAP',
      location: 'Università di Bari',
      description: 'Sviluppo di un sistema di raccomandazione conversazionale, con focus su integrazione di LLM, prompt tuning e ottimizzazione dei tempi di inferenza.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Chi Sono
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Sviluppatore con focus sull'integrazione di modelli linguistici avanzati e ottimizzazione delle performance.
          La mia passione è creare applicazioni AI intuitive che risolvono problemi reali.
        </p>
      </motion.div>

      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Il Mio Percorso
      </h2>

      {/* Timeline */}
      <div className="relative max-w-3xl mx-auto px-4">
        {/* Timeline vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-light dark:bg-primary-dark"></div>

        {/* Timeline items */}
        {timelineItems.map((item, index) => {
          const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.2,
          });

          return (
            <motion.div
              key={item.id}
              ref={ref}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`relative mb-12 ${index % 2 === 0 ? 'left-timeline' : 'right-timeline'}`}
            >
              <div
                className={`flex items-center ${
                  index % 2 === 0
                    ? 'flex-row-reverse md:flex-row'
                    : 'flex-row-reverse'
                }`}
              >
                <div className="w-full md:w-1/2"></div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 w-4 h-4 rounded-full bg-primary-light dark:bg-primary-dark border-4 border-white dark:border-gray-900"></div>

                {/* Content */}
                <div className="w-full md:w-1/2 mt-1 md:mt-0 md:px-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <span className="text-sm font-medium text-primary-light dark:text-primary-dark">
                      {item.date}
                    </span>
                    <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.location}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 