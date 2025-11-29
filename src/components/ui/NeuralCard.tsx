import { forwardRef, type HTMLAttributes } from 'react';
import clsx from 'clsx';

interface NeuralCardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'default' | 'primary' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap: Record<NonNullable<NeuralCardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const toneMap: Record<NonNullable<NeuralCardProps['tone']>, string> = {
  default:
    'glass-panel border border-white/10 bg-white/5 text-white shadow-neural-card',
  primary:
    'glass-panel border border-neural-cyan/30 bg-gradient-to-br from-neural-blue/80 to-neural-indigo/60 text-white shadow-neural-glow',
  accent:
    'glass-panel border border-neural-magenta/25 bg-gradient-to-br from-neural-magenta/30 to-neural-cyan/30 text-white shadow-neural-glow',
};

export const NeuralCard = forwardRef<HTMLDivElement, NeuralCardProps>(
  (
    {
      className,
      tone = 'default',
      padding = 'md',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'relative overflow-hidden rounded-3xl backdrop-blur-lg transition-all duration-300',
          toneMap[tone],
          paddingMap[padding],
          className,
        )}
        {...props}
      >
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(93,224,230,0.25),_transparent_50%)]" />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);

NeuralCard.displayName = 'NeuralCard';

export default NeuralCard;
