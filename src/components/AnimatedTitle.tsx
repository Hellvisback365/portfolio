import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  text: string;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text }) => {
  const letters = React.useMemo(() => Array.from(text), [text]);
  const [displayed, setDisplayed] = useState<string[]>([]);

  useEffect(() => {
    setDisplayed([]); // reset before starting
    let timeoutIds: NodeJS.Timeout[] = [];
    letters.forEach((_, index) => {
      const timeoutId = setTimeout(() => {
        setDisplayed((prev) => [...prev, letters[index]]);
      }, index * 100);
      timeoutIds.push(timeoutId);
    });
    return () => timeoutIds.forEach(clearTimeout);
  }, [text]);

  return (
    <h1 className="text-4xl md:text-6xl font-bold text-white whitespace-pre-wrap">
      {displayed.map((char, idx) => 
        char === '\n' ? (
          <br key={idx} />
        ) : (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, delay: idx * 0.05 }}
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