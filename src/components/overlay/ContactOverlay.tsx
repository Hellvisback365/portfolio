'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';
import useResponsive from '@/hooks/useResponsive';
import { useAppStore } from '@/store/useAppStore';
import { categories, getContactDetails, socialLinks, MAX_MESSAGE_LENGTH } from '@/constants/contactConfig';
import { useContactForm } from '@/hooks/useContactForm';
import FileDropzone from '@/components/ui/contact/FileDropzone';

/* ───────────────────── Shared styles ───────────────────── */
const inputClasses =
  'w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white ' +
  'placeholder-white/25 outline-none transition-all duration-200 ' +
  'focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/20 ' +
  'hover:border-white/20';

const errorInputClasses =
  'border-red-400/40 focus:border-red-400/60 focus:ring-red-400/20';

/* ═══════════════════════════════════════════════════════ */
export default function ContactOverlay() {
  const { isMobile } = useResponsive();
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';
  
  const contactDetails = getContactDetails(isEn);

  const {
    formData,
    errors,
    files,
    isSubmitting,
    submitSuccess,
    submitError,
    setSubmitError,
    fileError,
    handleChange,
    selectCategory,
    addFiles,
    removeFile,
    handleSubmit
  } = useContactForm();

  const currentYear = new Date().getFullYear();
  const charsLeft = MAX_MESSAGE_LENGTH - formData.message.length;

  /* ═══════════════════════════ Render ═══════════════════════════ */
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-5xl space-y-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-white/70">{isEn ? 'Contact' : 'Contatto'}</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{isEn ? 'Contact Me' : 'Contattami'}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            {isEn ? 'I am entering my Master\'s degree in Computer Science – AI (UniBa) and I am available for internships, R&D or AI-first projects.' : 'Sto entrando nella Laurea Magistrale in Computer Science – AI (UniBa) e sono disponibile per stage, R&D o progetti AI-first.'}
          </p>
        </motion.div>

        {/* ── Contact cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {contactDetails.map((item) => (
            <div key={item.label} className="glass-holographic rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40">
                  {item.icon}
                </span>
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.3em] text-white/50">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-semibold text-white transition-colors hover:text-[var(--color-accent-soft)]">
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

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Success banner */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                  <FaCheck className="text-emerald-400 text-sm" />
                </span>
                <div>
                  <p className="text-sm font-medium text-emerald-300">{isEn ? 'Message sent!' : 'Messaggio inviato!'}</p>
                  <p className="text-xs text-emerald-300/60">{isEn ? 'I will reply as soon as possible.' : 'Ti risponderò al più presto.'}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error banner */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 flex items-center justify-between rounded-xl border border-red-400/20 bg-red-500/10 p-4"
              >
                <p className="text-xs text-red-300">{submitError}</p>
                <button onClick={() => setSubmitError('')} className="ml-3 shrink-0 text-red-300/50 hover:text-red-300">
                  <FaTimes className="text-xs" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="glass-holographic rounded-2xl p-5 sm:p-7 space-y-5">

            {/* Honeypot anti-spam (hidden from users, catches bots) */}
            <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Category chips */}
            <div>
              <p className="mb-2.5 text-xs font-medium text-white/60">{isEn ? 'Reason for contact' : 'Motivo del contatto'}</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${formData.category === cat.id
                        ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 text-[var(--color-accent-soft)]'
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                      }`}
                  >
                    <span className="mr-1.5">{cat.emoji}</span>{isEn ? cat.label.en : cat.label.it}
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Email row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-white/60">
                  {isEn ? 'Name *' : 'Nome *'}
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${inputClasses} ${errors.name ? errorInputClasses : ''}`}
                  placeholder={isEn ? 'Your name' : 'Il tuo nome'}
                  aria-required="true"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="mt-1 text-[0.65rem] text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-white/60">
                  Email *
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClasses} ${errors.email ? errorInputClasses : ''}`}
                  placeholder={isEn ? 'Your email' : 'La tua email'}
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <p className="mt-1 text-[0.65rem] text-red-400">{errors.email}</p>}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium text-white/60">
                {isEn ? 'Subject *' : 'Oggetto *'}
              </label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`${inputClasses} ${errors.subject ? errorInputClasses : ''}`}
                placeholder={isEn ? 'e.g. Collaboration proposal on AI project' : 'es. Proposta di collaborazione su progetto AI'}
                aria-required="true"
                aria-invalid={Boolean(errors.subject)}
              />
              {errors.subject && <p className="mt-1 text-[0.65rem] text-red-400">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="contact-message" className="text-xs font-medium text-white/60">
                  {isEn ? 'Message *' : 'Messaggio *'}
                </label>
                <span className={`text-[0.6rem] tabular-nums ${charsLeft < 100 ? 'text-amber-400' : 'text-white/30'}`}>
                  {formData.message.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={isMobile ? 4 : 6}
                className={`${inputClasses} resize-none ${errors.message ? errorInputClasses : ''}`}
                placeholder={isEn ? 'Describe the project, role, timelines…' : 'Descrivi il progetto, il ruolo, le tempistiche…'}
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && <p className="mt-1 text-[0.65rem] text-red-400">{errors.message}</p>}
            </div>

            {/* ── File attachments ── */}
            <FileDropzone
              files={files}
              fileError={fileError}
              addFiles={addFiles}
              removeFile={removeFile}
            />

            {/* Divider */}
            <div className="border-t border-white/[0.06]" />

            {/* Submit */}
            <div className="flex items-center justify-between gap-4">
              <p className="hidden text-[0.6rem] text-white/25 sm:block">
                {isEn ? 'Your data will not be shared with third parties.' : 'I tuoi dati non saranno condivisi con terzi.'}
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative ml-auto flex items-center gap-2.5 rounded-lg border px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 ${isSubmitting
                    ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/30'
                    : 'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent-soft)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/20 hover:shadow-[0_0_24px_rgba(10,132,255,0.15)]'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
                    {isEn ? 'Sending...' : 'Invio in corso…'}
                  </>
                ) : (
                  <>
                    <FaEnvelope className="text-[0.65rem] transition-transform duration-300 group-hover:-translate-y-0.5" />
                    {isEn ? 'Send Message' : 'Invia Messaggio'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* ── Mini footer ── */}
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/50 transition-all hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent-soft)]"
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
