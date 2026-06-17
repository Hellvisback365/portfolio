'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt,
  FaGithub, FaLinkedin, FaTimes, FaCheck,
  FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaCloudUploadAlt,
} from 'react-icons/fa';
import useResponsive from '@/hooks/useResponsive';

/* ───────────────────── Types ───────────────────── */
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface AttachedFile {
  file: File;
  id: string;
}

/* ───────────────────── Constants ───────────────────── */
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/vitopiccolini@live.it';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB (FormSubmit limit)
const MAX_FILES = 3;
const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.txt', '.csv',
  '.png', '.jpg', '.jpeg', '.webp',
  '.zip', '.rar',
];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'text/csv',
  'image/png', 'image/jpeg', 'image/webp',
  'application/zip', 'application/x-rar-compressed',
];
const MAX_MESSAGE_LENGTH = 2000;

const categories = [
  { id: 'job',       label: 'Proposta lavorativa', emoji: '💼' },
  { id: 'collab',    label: 'Collaborazione',      emoji: '🤝' },
  { id: 'freelance', label: 'Freelance',           emoji: '🚀' },
  { id: 'info',      label: 'Informazioni',        emoji: '💡' },
  { id: 'other',     label: 'Altro',               emoji: '💬' },
];

const contactDetails = [
  {
    label: 'Email',
    value: 'vitopiccolini@live.it',
    helper: 'Preferita per brief strutturati (risposta entro 24h).',
    icon: <FaEnvelope className="text-white" />,
    href: 'mailto:vitopiccolini@live.it',
  },
  {
    label: 'Telefono',
    value: '+39 3937382774',
    helper: 'Disponibile 9:00–18:00, anche WhatsApp.',
    icon: <FaPhoneAlt className="text-white" />,
    href: 'tel:+393937382774',
  },
  {
    label: 'Base operativa',
    value: 'Bari · Remote EU',
    helper: 'Patente B, trasferte in giornata su richiesta.',
    icon: <FaMapMarkerAlt className="text-white" />,
  },
  {
    label: 'Disponibilità',
    value: 'Novembre 2025',
    helper: 'Stage curriculare LM-18 o collaborazione AI-first.',
    icon: <FaCalendarAlt className="text-white" />,
  },
];

const socialLinks = [
  { icon: <FaGithub className="h-4 w-4" />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  { icon: <FaLinkedin className="h-4 w-4" />, href: 'https://www.linkedin.com/in/vitopiccolini/', label: 'LinkedIn' },
  { icon: <FaEnvelope className="h-4 w-4" />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
];

/* ───────────────────── Helpers ───────────────────── */
function getFileIcon(type: string) {
  if (type.includes('pdf')) return <FaFilePdf className="text-red-400" />;
  if (type.includes('word') || type.includes('document')) return <FaFileWord className="text-blue-400" />;
  if (type.startsWith('image/')) return <FaFileImage className="text-emerald-400" />;
  return <FaFileAlt className="text-white/50" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAllowedFile(file: File): boolean {
  if (ALLOWED_MIME_TYPES.includes(file.type)) return true;
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

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

  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', subject: '', category: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Validation ── */
  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = 'Il nome è richiesto';
    if (!formData.email.trim()) {
      e.email = "L'email è richiesta";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Formato email non valido';
    }
    if (!formData.subject.trim()) e.subject = "L'oggetto è richiesto";
    if (!formData.message.trim()) {
      e.message = 'Il messaggio è richiesto';
    } else if (formData.message.trim().length < 10) {
      e.message = 'Almeno 10 caratteri';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Input handlers ── */
  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = ev.target;
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((p) => ({ ...p, [name]: undefined }));
    }
  };

  const selectCategory = (id: string) => {
    setFormData((p) => ({ ...p, category: p.category === id ? '' : id }));
  };

  /* ── File handlers ── */
  const addFiles = useCallback((incoming: FileList | File[]) => {
    setFileError('');
    const newFiles: AttachedFile[] = [];
    const list = Array.from(incoming);

    for (const file of list) {
      if (files.length + newFiles.length >= MAX_FILES) {
        setFileError(`Massimo ${MAX_FILES} allegati.`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`"${file.name}" supera il limite di 10 MB.`);
        continue;
      }
      if (!isAllowedFile(file)) {
        setFileError(`"${file.name}": tipo non supportato.`);
        continue;
      }
      newFiles.push({ file, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` });
    }
    if (newFiles.length) setFiles((p) => [...p, ...newFiles]);
  }, [files.length]);

  const removeFile = (id: string) => {
    setFiles((p) => p.filter((f) => f.id !== id));
    setFileError('');
  };

  /* ── Drag & Drop ── */
  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  /* ── Submit via FormSubmit.co (native form + hidden iframe) ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const categoryLabel = categories.find((c) => c.id === formData.category)?.label || '—';
      const categoryEmoji = categories.find((c) => c.id === formData.category)?.emoji || '';

      // Create a unique iframe name to avoid caching issues
      const iframeName = `formsubmit-frame-${Date.now()}`;

      // Create hidden iframe
      const iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Create a real HTML form — FormSubmit handles files reliably
      // only via native form submission with enctype="multipart/form-data"
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://formsubmit.co/vitopiccolini@live.it';
      form.enctype = 'multipart/form-data';
      form.target = iframeName; // Submit into the hidden iframe (no page redirect)
      form.style.display = 'none';

      // Helper to add hidden fields
      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      // FormSubmit configuration fields
      addField('_subject', `📩 ${formData.subject}`);
      addField('_replyto', formData.email);
      addField('_template', 'table');
      addField('_captcha', 'false');
      addField('_honey', ''); // Honeypot anti-spam

      // Form data fields
      addField('Nome', formData.name);
      addField('Email', formData.email);
      addField('Categoria', `${categoryEmoji} ${categoryLabel}`);
      addField('Oggetto', formData.subject);
      addField('Messaggio', formData.message);

      // Attach files using DataTransfer API (enables setting files on a real file input)
      if (files.length > 0) {
        const dt = new DataTransfer();
        files.forEach((af) => dt.items.add(af.file));
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.name = 'attachment';
        fileInput.multiple = true;
        fileInput.files = dt.files;
        form.appendChild(fileInput);
      }

      document.body.appendChild(form);

      // Wait for iframe to finish loading (= FormSubmit processed the submission)
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error('Timeout: il servizio non ha risposto in tempo.'));
        }, 15000);

        const cleanup = () => {
          clearTimeout(timeout);
          iframe.removeEventListener('load', onLoad);
          // Delay cleanup to ensure FormSubmit finished processing
          setTimeout(() => {
            document.body.removeChild(form);
            document.body.removeChild(iframe);
          }, 500);
        };

        const onLoad = () => {
          cleanup();
          resolve();
        };

        iframe.addEventListener('load', onLoad);
        form.submit();
      });

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
      setFiles([]);
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Si è verificato un errore');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const charsLeft = MAX_MESSAGE_LENGTH - formData.message.length;
  const totalFileSize = files.reduce((sum, f) => sum + f.file.size, 0);

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
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-white/70">Contatto</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Contattami</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            Sto entrando nella Laurea Magistrale in Computer Science – AI (UniBa) e sono disponibile
            per stage, R&D o progetti AI-first.
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
                  <p className="text-sm font-medium text-emerald-300">Messaggio inviato!</p>
                  <p className="text-xs text-emerald-300/60">Ti risponderò al più presto.</p>
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
              <p className="mb-2.5 text-xs font-medium text-white/60">Motivo del contatto</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                      formData.category === cat.id
                        ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 text-[var(--color-accent-soft)]'
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    <span className="mr-1.5">{cat.emoji}</span>{cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Email row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-white/60">
                  Nome *
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${inputClasses} ${errors.name ? errorInputClasses : ''}`}
                  placeholder="Il tuo nome"
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
                  placeholder="La tua email"
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <p className="mt-1 text-[0.65rem] text-red-400">{errors.email}</p>}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium text-white/60">
                Oggetto *
              </label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`${inputClasses} ${errors.subject ? errorInputClasses : ''}`}
                placeholder="es. Proposta di collaborazione su progetto AI"
                aria-required="true"
                aria-invalid={Boolean(errors.subject)}
              />
              {errors.subject && <p className="mt-1 text-[0.65rem] text-red-400">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="contact-message" className="text-xs font-medium text-white/60">
                  Messaggio *
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
                placeholder="Descrivi il progetto, il ruolo, le tempistiche…"
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && <p className="mt-1 text-[0.65rem] text-red-400">{errors.message}</p>}
            </div>

            {/* ── File attachments ── */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-white/60">
                  📎 Allegati
                  <span className="ml-1.5 text-[0.6rem] text-white/30">
                    ({files.length}/{MAX_FILES} · max 10 MB)
                  </span>
                </p>
                {files.length < MAX_FILES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[0.65rem] font-medium text-[var(--color-accent-soft)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    + Sfoglia
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_EXTENSIONS.join(',')}
                className="hidden"
                onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }}
              />

              {/* Drop zone */}
              {files.length < MAX_FILES && (
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-5 transition-all duration-200 ${
                    isDragging
                      ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <FaCloudUploadAlt className={`mb-2 text-xl ${isDragging ? 'text-[var(--color-accent-soft)]' : 'text-white/20'}`} />
                  <p className="text-xs text-white/40">
                    {isDragging ? 'Rilascia qui' : 'Trascina file o clicca per sfogliare'}
                  </p>
                  <p className="mt-1 text-[0.6rem] text-white/20">
                    PDF, Word, immagini, archivi — max 10 MB
                  </p>
                </div>
              )}

              {/* File error */}
              <AnimatePresence>
                {fileError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-[0.65rem] text-amber-400"
                  >
                    {fileError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Attached files list */}
              <AnimatePresence>
                {files.map((af) => (
                  <motion.div
                    key={af.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5">
                      <span className="text-sm">{getFileIcon(af.file.type)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white/80">{af.file.name}</p>
                        <p className="text-[0.6rem] text-white/30">{formatFileSize(af.file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(af.id)}
                        className="rounded p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-red-400"
                      >
                        <FaTimes className="text-[0.6rem]" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Total file size indicator */}
              {files.length > 0 && (
                <p className="mt-1.5 text-[0.6rem] text-white/25">
                  Totale: {formatFileSize(totalFileSize)}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.06]" />

            {/* Submit */}
            <div className="flex items-center justify-between gap-4">
              <p className="hidden text-[0.6rem] text-white/25 sm:block">
                I tuoi dati non saranno condivisi con terzi.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative ml-auto flex items-center gap-2.5 rounded-lg border px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 ${
                  isSubmitting
                    ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/30'
                    : 'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent-soft)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/20 hover:shadow-[0_0_24px_rgba(10,132,255,0.15)]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
                    Invio in corso…
                  </>
                ) : (
                  <>
                    <FaEnvelope className="text-[0.65rem] transition-transform duration-300 group-hover:-translate-y-0.5" />
                    Invia Messaggio
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
