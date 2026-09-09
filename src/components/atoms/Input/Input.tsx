import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  suffix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError = false, suffix, disabled, id, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          className={cn(
            'w-full px-3.5 py-2 text-sm bg-surface-container-lowest border rounded-xl text-on-surface ' +
            'placeholder:text-outline/70 transition-all duration-150 ' +
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ' +
            'disabled:bg-surface-container-low disabled:text-outline disabled:cursor-not-allowed',
            hasError
              ? 'border-error focus:ring-error/20 focus:border-error text-error'
              : 'border-outline-variant/80 hover:border-outline',
            suffix ? 'pr-12' : '',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 text-xs font-semibold text-outline pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
