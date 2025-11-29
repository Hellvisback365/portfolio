'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
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

const contactDetails = [
  {
    label: 'Email',
    value: 'vitopiccolini@live.it',
    helper: 'Preferita per brief strutturati (risposta entro 24h).',
    icon: <FaEnvelope className='text-neural-cyan' />,
    href: 'mailto:vitopiccolini@live.it',
  },
  {
    label: 'Telefono',
    value: '+39 3937382774',
    helper: 'Disponibile 9:00–18:00, anche WhatsApp.',
    icon: <FaPhoneAlt className='text-neural-cyan' />,
    href: 'tel:+393937382774',
  },
  {
    label: 'Base operativa',
    value: 'Bari · Remote EU',
    helper: 'Patente B, trasferte in giornata su richiesta.',
    icon: <FaMapMarkerAlt className='text-neural-cyan' />,
  },
  {
    label: 'Disponibilità',
    value: 'Novembre 2025',
    helper: 'Stage curriculare LM-18 o collaborazione AI-first.',
    icon: <FaCalendarAlt className='text-neural-cyan' />,
  },
];

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
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
          Contattami
        </h2>
        <p className="text-base md:text-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
          Sto entrando nella Laurea Magistrale in Computer Science – AI (UniBa) e da novembre 2025 sono disponibile per stage, R&D o progetti che coinvolgono assistenti enterprise e workflow automation.
        </p>
      </motion.div>

      <div className="mb-10 grid gap-4 md:grid-cols-2">
        {contactDetails.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-neural-card">
            <div className="flex items-center gap-3 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40">
                {item.icon}
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-lg font-semibold text-neural-cyan transition-colors hover:text-white"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-lg font-semibold">{item.value}</p>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-white/70">{item.helper}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-300 md:p-4"
            role="status"
            aria-live="polite"
          >
            Grazie per il tuo messaggio! Ti risponderò al più presto.
          </motion.div>
        )}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200 md:p-4"
            role="alert"
            aria-live="assertive"
          >
            {submitError}
          </motion.div>
        )}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-panel rounded-2xl p-4 shadow-neural-card md:p-8"
        >
          <div className="mb-4 md:mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-primary-dark"
              placeholder="Il tuo nome"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400" role="alert">
                {errors.name}
              </p>
            )}
          </div>
          <div className="mb-4 md:mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-primary-dark"
              placeholder="La tua email"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div className="mb-4 md:mb-6">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Messaggio
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={isMobile ? 4 : 5}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-primary-dark"
              placeholder="Il tuo messaggio"
              aria-required="true"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400" role="alert">
                {errors.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 md:py-3 px-4 rounded-md bg-primary-light dark:bg-primary-dark text-white font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-primary-dark ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
          </button>
        </motion.form>
      </div>
    </section>
  );
} 