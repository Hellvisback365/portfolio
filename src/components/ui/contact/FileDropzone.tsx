import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaTimes, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt } from 'react-icons/fa';
import { MAX_FILES, ALLOWED_EXTENSIONS } from '@/constants/contactConfig';
import type { AttachedFile } from '@/hooks/useContactForm';
import { useAppStore } from '@/store/useAppStore';

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

interface FileDropzoneProps {
  files: AttachedFile[];
  fileError: string;
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
}

export default function FileDropzone({ files, fileError, addFiles, removeFile }: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isEn = useAppStore((s) => s.language === 'en');

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const totalFileSize = files.reduce((sum, f) => sum + f.file.size, 0);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-white/60">
          📎 {isEn ? 'Attachments' : 'Allegati'}
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
            + {isEn ? 'Browse' : 'Sfoglia'}
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

      {files.length < MAX_FILES && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-5 transition-all duration-200 ${isDragging
              ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5'
              : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            }`}
        >
          <FaCloudUploadAlt className={`mb-2 text-xl ${isDragging ? 'text-[var(--color-accent-soft)]' : 'text-white/20'}`} />
          <p className="text-xs text-white/40">
            {isDragging ? (isEn ? 'Drop here' : 'Rilascia qui') : (isEn ? 'Drag files or click to browse' : 'Trascina file o clicca per sfogliare')}
          </p>
          <p className="mt-1 text-[0.6rem] text-white/20">
            {isEn ? 'PDF, Office, Markdown, Media, JSON, Archives — max 10 MB' : 'PDF, Office, Markdown, Media, JSON, Archivi — max 10 MB'}
          </p>
        </div>
      )}

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

      {files.length > 0 && (
        <p className="mt-1.5 text-[0.6rem] text-white/25">
          {isEn ? 'Total:' : 'Totale:'} {formatFileSize(totalFileSize)}
        </p>
      )}
    </div>
  );
}
