'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useResponsive from '@/hooks/useResponsive';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactSection() {
  const { isMobile } = useResponsive();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
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

  // Force white color style for input fields
  const inputStyle = {
    color: '#ffffff !important',
    backgroundColor: isDarkMode ? '#374151' : '#4B5563', // gray-700 or gray-600
  };

  // Force white color for form labels
  const labelStyle = {
    color: '#ffffff',
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è richiesto';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è richiesta';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato email non valido';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Il messaggio è richiesto';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Il messaggio deve contenere almeno 10 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      console.log('Invio form di contatto...');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      // Log della risposta completa
      console.log('Risposta del server:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const data = await response.json();
      console.log('Dati risposta:', data);
      
      if (!response.ok) {
        const errorMsg = data.error || 'Errore invio del messaggio';
        console.error('Errore dal server:', errorMsg);
        throw new Error(errorMsg);
      }
      
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Errore completo:', err);
      setSubmitError(err instanceof Error ? err.message : 'Si è verificato un errore');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="container mx-auto px-4 py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12 text-center"
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6" style={headingStyle}>
          Contattami
        </h1>
        <p className="text-base md:text-lg max-w-3xl mx-auto" style={textStyle}>
          Hai un progetto AI in mente o vuoi semplicemente dirmi ciao? Compila il form sottostante e ti risponderò al più presto.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8 p-3 md:p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-sm md:text-base"
          >
            Grazie per il tuo messaggio! Ti risponderò al più presto.
          </motion.div>
        )}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8 p-3 md:p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm md:text-base"
          >
            {submitError}
          </motion.div>
        )}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-lg shadow-md"
        >
          <div className="mb-4 md:mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-white" style={labelStyle}>
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              placeholder="Il tuo nome"
              style={inputStyle}
            />
            {errors.name && <p className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>
          <div className="mb-4 md:mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white" style={labelStyle}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              placeholder="La tua email"
              style={inputStyle}
            />
            {errors.email && <p className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
          <div className="mb-4 md:mb-6">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-white" style={labelStyle}>
              Messaggio
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={isMobile ? 4 : 5}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              placeholder="Il tuo messaggio"
              style={inputStyle}
            />
            {errors.message && <p className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 md:py-3 px-4 rounded-md bg-primary-light dark:bg-primary-dark text-white font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
          </button>
        </motion.form>
      </div>
    </section>
  );
} 