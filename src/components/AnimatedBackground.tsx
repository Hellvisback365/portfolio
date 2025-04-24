'use client';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import AnimatedNebulaBackground from './AnimatedNebulaBackground';
import AnimatedDayBackground from './AnimatedDayBackground';

export default function AnimatedBackground() {
  const { resolvedTheme } = useTheme();
  // only show after mounted to avoid SSR/client mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  // dark: show neural nebula, light: show day canvas
  return resolvedTheme === 'dark'
    ? <AnimatedNebulaBackground />
    : <AnimatedDayBackground />;
} 