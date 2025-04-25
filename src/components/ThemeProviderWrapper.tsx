'use client';
import React, { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Verifica se è il primo caricamento dopo il cambio di tema predefinito
    // Controlla se il valore memorizzato in localStorage non corrisponde al tema predefinito attuale
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      // Se c'è un tema memorizzato in localStorage, rimuovilo per utilizzare il tema predefinito
      if (storedTheme) {
        localStorage.removeItem('theme');
        console.log('Theme localStorage cleared to use default theme');
      }
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
} 