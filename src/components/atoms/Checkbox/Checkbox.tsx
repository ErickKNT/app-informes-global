import React from 'react';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, checked, disabled, onChange, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-center gap-3 cursor-pointer select-none text-sm font-medium',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 rounded-md border transition-all duration-150 flex items-center justify-center',
              'border-outline-variant bg-surface-container-lowest',
              'peer-checked:bg-primary peer-checked:border-primary',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40',
              'peer-disabled:bg-surface-container-low peer-disabled:cursor-not-allowed'
            )}
          >
            <Check
              className={cn(
                'w-3.5 h-3.5 text-on-primary transition-transform duration-150',
                checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              )}
              strokeWidth={3}
            />
          </div>
        </div>
        {label && <span className="text-on-surface leading-tight">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

