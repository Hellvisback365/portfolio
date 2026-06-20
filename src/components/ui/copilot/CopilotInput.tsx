import { useRef, useEffect } from 'react';
import { FiMic, FiArrowUp } from 'react-icons/fi';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface CopilotInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  busy: boolean;
  copilotOpen: boolean;
}

export default function CopilotInput({
  input,
  setInput,
  onSubmit,
  busy,
  copilotOpen
}: CopilotInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isListening, toggleListening, hasSupport } = useSpeechRecognition({
    onTranscript: (transcript) => setInput(input + (input ? ' ' : '') + transcript)
  });

  useEffect(() => {
    if (copilotOpen) textareaRef.current?.focus();
  }, [copilotOpen]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="border-t border-white/10 p-3"
    >
      <div className="flex items-end gap-2 rounded-xl bg-white/5 px-3 py-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onWheel={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          rows={2}
          placeholder="Scrivi una domanda…"
          aria-label="Messaggio per il copilot"
          className="max-h-32 flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/35 overscroll-contain"
        />
        {hasSupport && (
          <button
            type="button"
            onClick={toggleListening}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
              isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-white/50 hover:bg-white/10 hover:text-white'
            }`}
            aria-label="Microfono"
          >
            <FiMic className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={busy || (!input.trim() && !isListening)}
          aria-label="Invia"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-opacity disabled:opacity-30"
        >
          <FiArrowUp className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
