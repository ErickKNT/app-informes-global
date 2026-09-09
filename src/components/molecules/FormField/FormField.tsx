import React from 'react';
import { cn } from '@/utils/cn';

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  error,
  hint,
  className,
  children,
}) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-on-surface uppercase tracking-wider">
          {label}
          {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
        </label>
        {hint && !error && (
          <span id={hintId} className="text-[11px] text-outline">
            {hint}
          </span>
        )}
      </div>

      <div>{children}</div>

      {error && (
        <span id={errorId} role="alert" className="text-xs font-medium text-error flex items-center gap-1 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';
