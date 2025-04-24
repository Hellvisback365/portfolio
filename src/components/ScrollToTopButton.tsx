'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Framer Motion variants for wow effect
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -45 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } },
    hover: { scale: 1.1, rotate: 10, transition: { yoyo: Infinity, duration: 0.4 } },
    tap: { scale: 0.9, rotate: -10, transition: { duration: 0.1 } },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          exit="exit"
          variants={buttonVariants}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 p-3 sm:p-4 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl backdrop-blur-lg text-white z-50"
          style={{
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 sm:h-6 sm:w-6"
            initial={{ y: 0 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <path d="M5 15l7-7 7 7" />
          </motion.svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
