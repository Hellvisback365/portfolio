'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt, FaGithub, FaLinkedin } from 'react-icons/fa';
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
    icon: <FaEnvelope className="text-[white]" />,
    href: 'mailto:vitopiccolini@live.it',
  },
  {
    label: 'Telefono',
    value: '+39 3937382774',
    helper: 'Disponibile 9:00–18:00, anche WhatsApp.',
    icon: <FaPhoneAlt className="text-[white]" />,
    href: 'tel:+393937382774',
  },
  {
    label: 'Base operativa',
    value: 'Bari · Remote EU',
    helper: 'Patente B, trasferte in giornata su richiesta.',
    icon: <FaMapMarkerAlt className="text-[white]" />,
  },
  {
    label: 'Disponibilità',
    value: 'Novembre 2025',
    helper: 'Stage curriculare LM-18 o collaborazione AI-first.',
    icon: <FaCalendarAlt className="text-[white]" />,
  },
];

const socialLinks = [
  { icon: <FaGithub className="h-4 w-4" />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  { icon: <FaLinkedin className="h-4 w-4" />, href: 'https://www.linkedin.com/in/vitopiccolini/', label: 'LinkedIn' },
  { icon: <FaEnvelope className="h-4 w-4" />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
];

export default function ContactOverlay() {
  const { isMobile } = useResponsive();
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Il nome è richiesto';
    if (!formData.email.trim()) {
      newErrors.email = "L'email è richiesta";
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Errore invio del messaggio');
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Si è verificato un errore');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">Contatto</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Contattami</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            Sto entrando nella Laurea Magistrale in Computer Science – AI (UniBa) e sono disponibile
            per stage, R&D o progetti AI-first.
          </p>
        </motion.div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-3 sm:grid-cols-2"
        >
          {contactDetails.map((item) => (
            <div
              key={item.label}
              className="glass-holographic rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40">
                  {item.icon}
                </span>
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.3em] text-white/50">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-semibold text-[white] transition-colors hover:text-white"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  )}
                </div>
              </div>
              <p className="mt-2 text-[0.65rem] text-white/50">{item.helper}</p>
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-lg"
        >
          {submitSuccess && (
            <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-300">
              Grazie per il tuo messaggio! Ti risponderò al più presto.
            </div>
          )}
          {submitError && (
            <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-300">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="glass-holographic rounded-2xl p-5 space-y-4">
            <div>
              <label htmlFor="contact-name" className="mb-1 block text-xs font-medium text-white/60">
                Nome
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[white]/40"
                placeholder="Il tuo nome"
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <p className="mt-1 text-[0.65rem] text-red-400">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1 block text-xs font-medium text-white/60">
                Email
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[white]/40"
                placeholder="La tua email"
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p className="mt-1 text-[0.65rem] text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1 block text-xs font-medium text-white/60">
                Messaggio
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={isMobile ? 3 : 4}
                className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[white]/40"
                placeholder="Il tuo messaggio"
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && (
                <p className="mt-1 text-[0.65rem] text-red-400">{errors.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-[white]/30 bg-[white]/10 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-[white] transition-all hover:bg-[white]/20 hover:shadow-[0_0_20px_rgba(93,224,230,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
            </button>
          </form>
        </motion.div>

        {/* Mini footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-4 pt-8 text-center"
        >
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/50 transition-all hover:border-[white]/40 hover:text-[white]"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-[0.6rem] text-white/30">
            © {currentYear} Vito Piccolini. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
