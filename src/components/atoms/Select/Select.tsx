import React, { useState, useRef, useEffect, useId } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  label?: string;
  id?: string;
  name?: string;
  'aria-label'?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md';
}

export const Select = <T extends string = string>({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  label,
  id,
  name,
  'aria-label': ariaLabelProp,
  ariaLabel,
  icon,
  className,
  triggerClassName,
  menuClassName,
  disabled = false,
  required = false,
  size = 'sm',
}: SelectProps<T>): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const selectId = id || generatedId;

  const selectedOption = options.find((opt) => opt.value === value);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Manejar Escape y navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleSelectOption = (optValue: T) => {
    onChange(optValue);
    setIsOpen(false);
  };

  const effectiveAriaLabel = ariaLabel || ariaLabelProp || label || placeholder;

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex flex-col', className)}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs text-on-surface-variant font-medium mb-1 flex items-center gap-1.5"
        >
          {icon}
          <span>{label}</span>
        </label>
      )}

      {/* Trigger visual personalizado */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={effectiveAriaLabel}
        className={cn(
          'inline-flex items-center justify-between gap-2.5 bg-surface-container-lowest text-on-surface font-semibold border border-surface-container-high rounded-xl shadow-2xs transition-all select-none',
          'hover:bg-surface-container-low/70 hover:border-outline/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm',
          isOpen && 'border-primary ring-2 ring-primary/20',
          triggerClassName
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {!label && icon}
          {selectedOption?.icon}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-outline transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180 text-primary'
          )}
        />
      </button>

      {/* Menú flotante personalizado */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={effectiveAriaLabel}
          className={cn(
            'absolute top-full left-0 mt-1.5 z-50 min-w-full w-max max-w-xs',
            'bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-xl p-1.5',
            'flex flex-col gap-0.5 max-h-60 overflow-y-auto',
            'animate-in fade-in zoom-in-95 duration-150',
            menuClassName
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectOption(option.value)}
                className={cn(
                  'w-full flex items-center justify-between gap-3 px-3 py-2 text-xs font-semibold rounded-xl text-left transition-colors cursor-pointer select-none',
                  isSelected
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-on-surface hover:bg-surface-container-low hover:text-on-surface'
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  {option.icon}
                  <span className="truncate">{option.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Elemento select nativo accesible */}
      <select
        id={selectId}
        name={name}
        aria-label={effectiveAriaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        required={required}
        className="sr-only"
        tabIndex={-1}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

Select.displayName = 'Select';
