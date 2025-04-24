import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  text: string;
  /** index from which to apply highlightClass */
  highlightFrom?: number;
  /** Tailwind classes to apply for highlighted chars */
  highlightClass?: string;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text, highlightFrom = 0, highlightClass = '' }) => {
  const letters = React.useMemo(() => Array.from(text), [text]);
  const [displayed, setDisplayed] = useState<string[]>([]);

  useEffect(() => {
    setDisplayed([]); // reset before starting
    const timeoutIds: NodeJS.Timeout[] = [];
    letters.forEach((_, index) => {
      const timeoutId = setTimeout(() => {
        setDisplayed((prev) => [...prev, letters[index]]);
      }, index * 100);
      timeoutIds.push(timeoutId);
    });
    return () => timeoutIds.forEach(clearTimeout);
  }, [text, letters]);

  return (
    <h1 className="text-4xl md:text-6xl font-bold text-white whitespace-pre-wrap">
      {displayed.map((char, idx) =>
        char === '\n' ? (
          <br key={idx} />
        ) : (
          <motion.span
            key={idx}
            className={idx >= highlightFrom ? highlightClass : ''}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'tween', duration: 0.1, ease: 'easeOut' }}
          >
            {char}
          </motion.span>
        )
      )}
      <motion.span
        className="ml-1 w-1 bg-gray-800 dark:bg-gray-200 animate-blink"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
      >
        &nbsp;
      </motion.span>
    </h1>
  );
};

export default AnimatedTitle; 