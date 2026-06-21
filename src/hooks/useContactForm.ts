import { useState, useCallback } from 'react';
import {
  MAX_FILE_SIZE, MAX_FILES, MAX_MESSAGE_LENGTH,
  ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, categories, FORMSUBMIT_ENDPOINT
} from '@/constants/contactConfig';
import { useAppStore } from '@/store/useAppStore';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface AttachedFile {
  file: File;
  id: string;
}

function isAllowedFile(file: File): boolean {
  if (ALLOWED_MIME_TYPES.includes(file.type)) return true;
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

export function useContactForm() {
  const isEn = useAppStore(s => s.language === 'en');

  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', subject: '', category: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fileError, setFileError] = useState('');

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = isEn ? 'Name is required' : 'Il nome è richiesto';
    if (!formData.email.trim()) {
      e.email = isEn ? 'Email is required' : "L'email è richiesta";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = isEn ? 'Invalid email format' : 'Formato email non valido';
    }
    if (!formData.subject.trim()) e.subject = isEn ? 'Subject is required' : "L'oggetto è richiesto";
    if (!formData.message.trim()) {
      e.message = isEn ? 'Message is required' : 'Il messaggio è richiesto';
    } else if (formData.message.trim().length < 10) {
      e.message = isEn ? 'At least 10 characters' : 'Almeno 10 caratteri';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

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

  const addFiles = useCallback((incoming: FileList | File[]) => {
    setFileError('');
    const newFiles: AttachedFile[] = [];
    const list = Array.from(incoming);

    for (const file of list) {
      if (files.length + newFiles.length >= MAX_FILES) {
        setFileError(isEn ? `Max ${MAX_FILES} attachments.` : `Massimo ${MAX_FILES} allegati.`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(isEn ? `"${file.name}" exceeds the 10 MB limit.` : `"${file.name}" supera il limite di 10 MB.`);
        continue;
      }
      if (!isAllowedFile(file)) {
        setFileError(isEn ? `"${file.name}": unsupported type.` : `"${file.name}": tipo non supportato.`);
        continue;
      }
      newFiles.push({ file, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` });
    }
    if (newFiles.length) setFiles((p) => [...p, ...newFiles]);
  }, [files.length, isEn]);

  const removeFile = (id: string) => {
    setFiles((p) => p.filter((f) => f.id !== id));
    setFileError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const categoryObj = categories.find((c) => c.id === formData.category);
      const categoryLabel = categoryObj ? categoryObj.label.it : '—'; // Always send italian in email for internal consistency
      const categoryEmoji = categoryObj ? categoryObj.emoji : '';

      const formElement = e.currentTarget as HTMLFormElement;
      const honeyValue = new FormData(formElement).get('_honey') as string || '';

      const endpoint = FORMSUBMIT_ENDPOINT.replace('/ajax/', '/');

      const iframeName = `formsubmit-frame-${Date.now()}`;
      const iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = endpoint;
      form.enctype = 'multipart/form-data';
      form.target = iframeName;
      form.style.display = 'none';

      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addField('_subject', `📩 ${formData.subject}`);
      addField('_replyto', formData.email);
      addField('_template', 'table');
      addField('_captcha', 'false');
      addField('_honey', honeyValue);

      addField('Nome', formData.name);
      addField('Email', formData.email);
      addField('Categoria', `${categoryEmoji} ${categoryLabel}`);
      addField('Oggetto', formData.subject);
      addField('Messaggio', formData.message);

      if (files.length > 0) {
        files.forEach((af, index) => {
          const dt = new DataTransfer();
          dt.items.add(af.file);
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.name = `attachment_${index + 1}`;
          fileInput.files = dt.files;
          form.appendChild(fileInput);
        });
      }

      document.body.appendChild(form);

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error(isEn ? 'Timeout: service did not respond in time.' : 'Timeout: il servizio non ha risposto in tempo.'));
        }, 15000);

        const cleanup = () => {
          clearTimeout(timeout);
          iframe.removeEventListener('load', onLoad);
          setTimeout(() => {
            if (document.body.contains(form)) document.body.removeChild(form);
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
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
      setSubmitError(err instanceof Error ? err.message : (isEn ? 'An error occurred' : 'Si è verificato un errore'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
