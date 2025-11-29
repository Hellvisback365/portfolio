import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'glow';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-neural-accent text-black shadow-neural-glow border border-transparent',
    outline: 'border border-white/30 text-white/80',
    glow: 'bg-white/5 text-neural-cyan border border-neural-cyan/40 shadow-neural-glow',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em]',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
