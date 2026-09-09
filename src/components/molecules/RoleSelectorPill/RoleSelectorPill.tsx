import React from 'react';
import { cn } from '@/utils/cn';
import type { ServicePrivilege } from '@/types/database.types';
import { Award } from 'lucide-react';

export interface RoleSelectorPillProps {
  selectedRole: ServicePrivilege;
  onChange: (role: ServicePrivilege) => void;
  className?: string;
  disabled?: boolean;
}

export const RoleSelectorPill: React.FC<RoleSelectorPillProps> = ({
  selectedRole,
  onChange,
  className,
  disabled = false,
}) => {
  const options: Array<{ id: ServicePrivilege; label: string; hasIcon?: boolean }> = [
    { id: 'publicador', label: 'Publicador' },
    { id: 'precursor_auxiliar', label: 'P. Auxiliar' },
    { id: 'precursor_regular', label: 'Precursor Regular', hasIcon: true },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Selección de nombramiento o servicio"
      className={cn(
        'inline-flex items-center p-1 bg-surface-container-low rounded-full border border-surface-container-high/60 shadow-inner',
        disabled && 'opacity-60 pointer-events-none',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = selectedRole === option.id;

        const getSelectedStyles = () => {
          if (option.id === 'publicador') {
            return 'bg-surface-container-highest text-primary shadow-sm font-semibold';
          }
          if (option.id === 'precursor_auxiliar') {
            return 'bg-tertiary-fixed text-on-tertiary-fixed shadow-sm font-semibold';
          }
          return 'bg-secondary text-on-secondary shadow-sm font-semibold';
        };

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(option.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs transition-all duration-150 flex items-center gap-1.5 select-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              isSelected
                ? getSelectedStyles()
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50'
            )}
          >
            {option.hasIcon && <Award className="w-3.5 h-3.5" />}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

RoleSelectorPill.displayName = 'RoleSelectorPill';

