'use client';

import { InView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaGraduationCap, FaBrain, FaLanguage, FaShieldAlt, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

// Define interfaces for our state
interface Star {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface CosmicParticle {
  id: number;
  size: number;
  speed: number;
  initialX: number;
  initialY: number;
  opacity: number;
  color: string;
}

export default function AboutSection() {
  // This will help us determine if dark mode is active
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [cosmicParticles, setCosmicParticles] = useState<CosmicParticle[]>([]);

  // Generate cosmic particles for stellar timeline
  const generateCosmicParticles = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 20 + 10,
      initialX: Math.random() * 60 - 30, // -30 to 30
      initialY: Math.random() * 100, // 0 to 100
      opacity: Math.random() * 0.7 + 0.3,
      color: [
        '#3B82F6', // primary (blue-500)
        '#60A5FA', // primary-dark (blue-400)
        '#1E40AF', // blue-800
        '#3730A3', // indigo-800
        '#6366F1', // indigo-500
        '#A5B4FC', // indigo-300
      ][Math.floor(Math.random() * 6)],
    }));
  };

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
    
    // Generate stars and particles only on the client side
    setStars(Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 3,
      x: Math.random() * 50 - 25,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    })));
    
    setCosmicParticles(generateCosmicParticles(25));
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const headingStyle = {
    color: isDarkMode ? '#ffffff' : '#000000',  // white in dark mode, black in light mode
  };
  
  // Unused variables commented out
  // const locationStyle = {
  //   color: isDarkMode ? '#9ca3af' : '#000000',  // dark:text-gray-400 in dark mode, black in light mode
  // };

  // Unused variables commented out
  // const whiteTextStyle = {
  //   color: '#ffffff',
  // };

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
      {/* Chi Sono Section */}
      <div className="mb-20">
        <div className="flex items-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#60A5FA' }}>
            Chi
          </h1>
          <h1 className="text-3xl md:text-4xl font-bold ml-3 text-white">
            Sono
          </h1>
        </div>
        
        <div className="w-20 h-1 bg-blue-400 mb-10"></div>
        
        {/* Card with profile image and info */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Image Card */}
          <div className="w-full lg:w-2/5">
            <motion.div 
              className="w-full h-[500px] relative rounded-lg overflow-hidden shadow-xl bg-gradient-to-b from-slate-800 to-slate-900"
              whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)' }}
              transition={{ duration: 0.3 }}
            >
              {/* Professional frame around image */}
              <div className="absolute inset-3 z-10 rounded border border-blue-400/30"></div>
              
              {/* Profile Image */}
              <div className="absolute inset-4 overflow-hidden">
                <Image 
                  src="/me.png" 
                  alt="Profile Image" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover scale-[1.02] filter saturate-[1.05] contrast-[1.02]"
                  style={{ 
                    objectPosition: "center 15%" 
                  }}
                  priority
                />
              </div>
              
              {/* Subtle overlay for professional look */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/20 z-20"></div>
              
              {/* Professional accent elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-bl-full z-10 backdrop-blur-sm"></div>
              <div className="absolute top-4 right-4 w-20 h-1 bg-blue-400/40 z-10"></div>
              <div className="absolute top-8 right-4 w-10 h-1 bg-blue-400/40 z-10"></div>
              
              {/* Name and Title with improved styling */}
              <div className="absolute bottom-0 left-0 p-8 w-full z-30">
                <div className="relative">
                  <h2 className="text-2xl font-bold text-white mb-1">Vito Piccolini</h2>
                  <p className="text-blue-400 font-medium tracking-wide mb-1">AI Developer</p>
                  <div className="w-12 h-0.5 bg-blue-400 mb-4"></div>
                  
                  {/* Social Icons with improved styling */}
                  <div className="flex space-x-4 mt-6">
                    <a href="https://github.com/Hellvisback365" target="_blank" rel="noopener noreferrer" 
                       className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800/80 hover:bg-blue-500 transition-colors duration-300 backdrop-blur-sm">
                      <FaGithub className="text-white" />
                    </a>
                    <a href="https://www.linkedin.com/in/vito-p-9120028a/" target="_blank" rel="noopener noreferrer" 
                       className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800/80 hover:bg-blue-500 transition-colors duration-300 backdrop-blur-sm">
                      <FaLinkedin className="text-white" />
                    </a>
                    <a href="mailto:vitopiccolini@live.it" 
                       className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800/80 hover:bg-blue-500 transition-colors duration-300 backdrop-blur-sm">
                      <FaEnvelope className="text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Info Card */}
          <div className="w-full lg:w-3/5 flex flex-col">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Sviluppatore IA con passione per l&apos;innovazione</h2>
              <div className="text-gray-300">
                <p className="mb-4">
                  Sviluppatore Al in formazione, con esperienza nella progettazione e prototipazione di applicazioni basate su modelli linguistici di ultima generazione.
                  Durante il mio tirocinio accademico ho integrato LLM locali (LLaMA, Mistral) in sistemi di raccomandazione conversazionale, migliorando le performance attraverso tecniche di caching, chaining e prompt tuning.
                </p>
                <p>
                  Solide competenze in Python, LangChain, NLP e architettura di backend (Node.js, MongoDB).
                  Cerco un&apos;opportunità per contribuire allo sviluppo di soluzioni Al orientate all&apos;utente, sfruttando l&apos;ecosistema open-source e le potenzialità dei modelli generativi.
                </p>
              </div>
            </div>
            
            {/* Formazione e Interessi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Formazione */}
              <div>
                <h3 className="text-xl font-medium mb-4 text-blue-400">Formazione</h3>
                <div className="flex items-start">
                  <FaGraduationCap className="text-blue-400 text-xl mt-1 mr-3" />
                  <div>
                    <h4 className="text-white font-medium">Università di Bari Aldo Moro</h4>
                    <p className="text-gray-400">Informatica</p>
                  </div>
                </div>
              </div>
              
              {/* Interessi */}
              <div>
                <h3 className="text-xl font-medium mb-4 text-blue-400">Interessi</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaBrain className="text-blue-400 text-xl mr-3" />
                    <span className="text-white">Intelligenza Artificiale</span>
                  </div>
                  <div className="flex items-center">
                    <FaLanguage className="text-blue-400 text-xl mr-3" />
                    <span className="text-white">Natural Language Processing</span>
                  </div>
                  <div className="flex items-center">
                    <FaShieldAlt className="text-blue-400 text-xl mr-3" />
                    <span className="text-white">Privacy e GDPR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={headingStyle}>
        Il Mio Percorso
      </h2>

      {/* Cosmic Timeline */}
      <div className="relative max-w-3xl mx-auto px-4 min-h-[500px]">
        {/* Cosmos background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-indigo-900/40 to-blue-950/40 backdrop-blur-sm"></div>
          
          {/* Glowing nebula effect */}
          <motion.div 
            className="absolute inset-0 opacity-40"
            initial={{ backgroundPosition: '0% 0%' }}
            animate={{ backgroundPosition: '100% 100%' }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            style={{
              background: 'radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.7) 0%, rgba(59, 130, 246, 0) 50%), radial-gradient(circle at 70% 60%, rgba(96, 165, 250, 0.7) 0%, rgba(96, 165, 250, 0) 40%)',
              filter: 'blur(40px)',
            }}
          />
          
          {/* Stars effect */}
          {stars.map(star => (
            <motion.div 
              key={`star-${star.id}`}
              className="absolute rounded-full"
              style={{
                width: star.size,
                height: star.size,
                left: `calc(50% + ${star.x}px)`,
                top: `${star.y}%`,
                background: 'white',
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
              }}
            />
          ))}
        </div>

        {/* Cosmic timeline core - shimmering light beam */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full overflow-hidden">
          {/* Core beam */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600"
            animate={{
              backgroundPosition: ['0% 0%', '0% 100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
          
          {/* Glow effect */}
          <div className="absolute inset-0 blur-sm bg-white opacity-70"></div>
          
          {/* Pulse overlay */}
          <motion.div 
            className="absolute inset-0 bg-white"
            animate={{
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </div>
        
        {/* Cosmic particles */}
        {cosmicParticles.map(particle => (
          <motion.div 
            key={`particle-${particle.id}`}
            className="absolute rounded-full z-10"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: `calc(50% + ${particle.initialX}px)`,
              boxShadow: `0 0 8px 1px ${particle.color}`,
            }}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ 
              y: `-10%`,
              opacity: [0, particle.opacity, 0],
              x: [
                `${particle.initialX}px`,
                `${particle.initialX + Math.sin(particle.id) * 20}px`,
                `${particle.initialX - Math.sin(particle.id) * 20}px`,
                `${particle.initialX}px`
              ]
            }}
            transition={{
              y: {
                duration: 100 / particle.speed,
                repeat: Infinity,
                ease: "linear",
                delay: particle.id * 0.2,
              },
              opacity: {
                duration: 100 / particle.speed,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.id * 0.2,
              },
              x: {
                duration: 100 / particle.speed,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.id * 0.2,
                times: [0, 0.33, 0.66, 1]
              }
            }}
          />
        ))}

        {/* Timeline events */}
        {timelineItems.map((item, index) => (
          <InView key={item.id} triggerOnce threshold={0.2}>
            {({ ref, inView }) => (
              <motion.div
                ref={ref}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`relative mb-24 ${index % 2 === 0 ? 'left-timeline' : 'right-timeline'}`}
              >
                <div
                  className={`flex items-center ${
                    index % 2 === 0
                      ? 'flex-row-reverse md:flex-row'
                      : 'flex-row-reverse'
                  }`}
                >
                  <div className="w-full md:w-1/2"></div>

                  {/* Cosmic event node */}
                  <motion.div 
                    className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 z-20"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {/* Outer ring */}
                    <motion.div 
                      className="w-10 h-10 rounded-full border-2 border-blue-300 flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      {/* Inner orb */}
                      <motion.div 
                        className="w-5 h-5 rounded-full bg-gradient-to-br from-white via-blue-300 to-blue-500"
                        animate={{ boxShadow: ['0 0 0px 0px rgba(255,255,255,0.8)', '0 0 15px 5px rgba(96, 165, 250, 0.8)', '0 0 5px 2px rgba(96, 165, 250, 0.8)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  </motion.div>
                  
                  {/* Connector beam */}
                  <motion.div 
                    className={`absolute left-1/2 h-[3px] z-10`}
                    style={{
                      background: index % 2 === 0 
                        ? 'linear-gradient(to left, rgba(59, 130, 246, 0), rgba(59, 130, 246, 1))' 
                        : 'linear-gradient(to right, rgba(59, 130, 246, 0), rgba(59, 130, 246, 1))',
                      width: 'calc(50% - 25px)',
                      left: index % 2 === 0 ? '0' : '50%',
                    }}
                    initial={{ width: 0, opacity: 0 }}
                    animate={inView ? { width: 'calc(50% - 25px)', opacity: 1 } : { width: 0, opacity: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />

                  {/* Event Card */}
                  <div className="w-full md:w-1/2 mt-1 md:mt-0 md:px-8">
                    <motion.div 
                      className="rounded-xl p-6 backdrop-blur-md"
                      style={{
                        background: 'rgba(15, 23, 42, 0.3)',
                        border: '1px solid rgba(96, 165, 250, 0.2)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(96, 165, 250, 0.1)',
                      }}
                      whileHover={{ 
                        y: -5, 
                        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(96, 165, 250, 0.2)',
                        background: 'rgba(15, 23, 42, 0.5)',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Color accent bar */}
                      <div className="w-full h-[3px] bg-gradient-to-r from-blue-400 to-blue-600 mb-4 rounded-full"></div>
                      
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-400 block mb-1">
                        {item.date}
                      </span>
                      <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                        {item.title}
                      </h3>
                      <p className="text-sm mb-3 text-indigo-200">
                        {item.location}
                      </p>
                      <p className="text-gray-300">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </InView>
        ))}
      </div>
    </div>
  );
} 