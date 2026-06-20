import { Fragment, type ReactNode } from 'react';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import ProjectCard from '@/components/ui/rag/ProjectCard';
import SkillsRadar from '@/components/ui/rag/SkillsRadar';
import type { UIMessage } from 'ai';

type AnyPart = { type: string } & Record<string, unknown>;

interface CopilotMessageProps {
  message: UIMessage;
  messages: UIMessage[];
  flyToSection: (section: string) => void;
  setCopilotOpen: (open: boolean) => void;
  feedbackGiven: Record<string, boolean>;
  onFeedback: (messageId: string, score: number, aiResponseText: string, userQuestionText: string) => void;
}

function renderMarkdownBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-white">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function CopilotMessage({
  message,
  messages,
  flyToSection,
  setCopilotOpen,
  feedbackGiven,
  onFeedback
}: CopilotMessageProps) {
  const renderPart = (part: AnyPart, index: number): ReactNode => {
    const key = `${message.id}-${index}`;
    switch (part.type) {
      case 'text': {
        const clean = (part.text as string).trim();
        return clean ? (
          <p key={key + '-text'} className="whitespace-pre-wrap break-words leading-relaxed">
            {renderMarkdownBold(clean)}
          </p>
        ) : null;
      }
      case 'data-uiAction': {
        const embeddedAction = part.data as any;
        if (!embeddedAction) return null;

        if (embeddedAction.action === 'showProject' && embeddedAction.target) {
          return (
            <ProjectCard
              key={key + '-widget'}
              projectName={embeddedAction.target}
              onExplore={() => {
                flyToSection('projects');
                setCopilotOpen(false);
              }}
            />
          );
        } else if (embeddedAction.action === 'showSkillsRadar') {
          return <SkillsRadar key={key + '-widget'} />;
        } else if (embeddedAction.action === 'navigateToSection' && embeddedAction.target) {
          return (
            <p key={key + '-widget'} className="font-mono text-[11px] text-accent-soft mt-2">
              → ti porto alla sezione {embeddedAction.target}
            </p>
          );
        }
        return null;
      }
      case 'data-sources': {
        const sources = part.data as any[];
        if (!sources || sources.length === 0) return null;
        return (
          <div key={key + '-sources'} className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-[10px] text-white/40 mr-1 self-center">Fonti:</span>
            {sources.map((s, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-[10px] border border-white/10 bg-white/5 text-white/60">
                {s.title || s.tag}
              </span>
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div
      className={
        message.role === 'user'
          ? 'ml-8 rounded-2xl rounded-br-sm bg-accent/15 px-3.5 py-2.5'
          : 'mr-4 space-y-2'
      }
    >
      {(message.parts as AnyPart[]).map((part, i) => renderPart(part, i))}
      {message.role === 'assistant' && (() => {
        const idx = messages.findIndex(m => m.id === message.id);
        const prevMsg: any = messages[idx - 1];
        const msg: any = message;
        const userQ = prevMsg?.role === 'user' ? prevMsg.content || (prevMsg.parts || []).map((p: any) => p.text || '').join('') : 'Unknown';
        const aiA = msg.content || (msg.parts || []).map((p: any) => p.text || '').join('');
        return (
          <div className="flex gap-2 pt-1 opacity-40 hover:opacity-100 transition-opacity">
            <button onClick={() => onFeedback(message.id, 1, aiA, userQ)} disabled={feedbackGiven[message.id]} className="hover:text-emerald-400 disabled:opacity-30"><FiThumbsUp className="w-3 h-3" /></button>
            <button onClick={() => onFeedback(message.id, 0, aiA, userQ)} disabled={feedbackGiven[message.id]} className="hover:text-red-400 disabled:opacity-30"><FiThumbsDown className="w-3 h-3" /></button>
          </div>
        );
      })()}
    </div>
  );
}
