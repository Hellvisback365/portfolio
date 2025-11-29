import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

type CTAButtonProps = {
  href?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  children?: ReactNode;
} & (
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
);

const variantMap: Record<NonNullable<CTAButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-neural-cyan to-neural-magenta text-white shadow-neural-glow ring-1 ring-white/20 drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] hover:from-neural-magenta hover:to-neural-cyan',
  secondary:
    'border border-white/35 bg-white/5 text-white/85 backdrop-blur-sm hover:border-neural-cyan/70 hover:bg-white/10 hover:text-white',
  ghost: 'text-white/75 hover:text-white',
};

export default function CTAButton({ href, icon, variant = 'primary', className, children, ...props }: CTAButtonProps) {
  const isAnchor = typeof href === 'string';
  
  const commonProps = {
    className: clsx(
      'relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neural-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black',
      variantMap[variant],
      className,
    )
  };

  if (isAnchor) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <a href={href} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} {...commonProps}>
          {icon && <span className="text-base">{icon}</span>}
          {children}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <button type={(props as ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button'} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} {...commonProps}>
        {icon && <span className="text-base">{icon}</span>}
        {children}
      </button>
    </motion.div>
  );
}
