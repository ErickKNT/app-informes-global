import React from 'react';
import { cn } from '@/utils/cn';

export type BadgeVariant =
  | 'publicador'
  | 'auxiliar'
  | 'regular'
  | 'entregado'
  | 'pendiente'
  | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'publicador',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide select-none transition-colors';

  const variantStyles: Record<BadgeVariant, string> = {
    publicador: 'bg-surface-container-high text-on-surface-variant border border-outline-variant/60',
    auxiliar: 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim/70',
    regular: 'bg-secondary-container text-on-secondary-container border border-secondary-container',
    entregado: 'bg-secondary-container/60 text-on-secondary-container',
    pendiente: 'bg-tertiary-fixed text-tertiary-container',
    info: 'bg-primary-container text-on-primary',
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
