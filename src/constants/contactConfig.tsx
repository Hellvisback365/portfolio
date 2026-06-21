import {
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt,
  FaGithub, FaLinkedin
} from 'react-icons/fa';

export const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/vitopiccolini@live.it';
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_FILES = 3;
export const MAX_MESSAGE_LENGTH = 2000;

export const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.txt', '.csv', '.md',
  '.xls', '.xlsx', '.ppt', '.pptx', '.key',
  '.json', '.xml', '.yaml', '.yml',
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4',
  '.zip', '.rar',
];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'text/csv', 'text/markdown',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/x-iwork-keynote-sffkey',
  'application/json', 'application/xml', 'text/xml', 'application/x-yaml', 'text/yaml',
  'image/png', 'image/jpeg', 'image/webp', 'image/gif',
  'video/mp4',
  'application/zip', 'application/x-rar-compressed',
];

export const categories = [
  { id: 'job', label: { it: 'Proposta lavorativa', en: 'Job proposal' }, emoji: '💼' },
  { id: 'collab', label: { it: 'Collaborazione', en: 'Collaboration' }, emoji: '🤝' },
  { id: 'freelance', label: { it: 'Freelance', en: 'Freelance' }, emoji: '🚀' },
  { id: 'info', label: { it: 'Informazioni', en: 'Information' }, emoji: '💡' },
  { id: 'other', label: { it: 'Altro', en: 'Other' }, emoji: '💬' },
];

export const getContactDetails = (isEn: boolean) => [
  {
    label: 'Email',
    value: 'vitopiccolini@live.it',
    helper: isEn ? 'Preferred for structured briefs (response within 24h).' : 'Preferita per brief strutturati (risposta entro 24h).',
    icon: <FaEnvelope className="text-white" />,
    href: 'mailto:vitopiccolini@live.it',
  },
  {
    label: isEn ? 'Phone' : 'Telefono',
    value: '+39 3937382774',
    helper: isEn ? 'Available 9:00–18:00, WhatsApp too.' : 'Disponibile 9:00–18:00, anche WhatsApp.',
    icon: <FaPhoneAlt className="text-white" />,
    href: 'tel:+393937382774',
  },
  {
    label: isEn ? 'Location' : 'Base operativa',
    value: 'Bari · Remote EU',
    helper: isEn ? 'Driving license B, day trips on request.' : 'Patente B, trasferte in giornata su richiesta.',
    icon: <FaMapMarkerAlt className="text-white" />,
  },
  {
    label: isEn ? 'Availability' : 'Disponibilità',
    value: isEn ? 'Immediate - June 2026' : 'Immediata - Giugno 2026',
    helper: isEn ? 'LM-18 curricular internship or AI-first collaboration.' : 'Stage curriculare LM-18 o collaborazione AI-first.',
    icon: <FaCalendarAlt className="text-white" />,
  },
];

export const socialLinks = [
  { icon: <FaGithub className="h-4 w-4" />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  { icon: <FaLinkedin className="h-4 w-4" />, href: 'https://www.linkedin.com/in/vitopiccolini/', label: 'LinkedIn' },
  { icon: <FaEnvelope className="h-4 w-4" />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
];
