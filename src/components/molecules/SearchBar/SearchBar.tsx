import React from 'react';
import { cn } from '@/utils/cn';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  className,
  id = 'search-input',
}) => {
  return (
    <div className={cn('relative flex items-center w-full max-w-xs', className)}>
      <Search className="absolute left-3 w-4 h-4 text-outline pointer-events-none" />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          'w-full pl-9 pr-8 py-1.5 text-xs bg-surface-container-lowest border border-surface-container-high rounded-xl text-on-surface',
          'placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'transition-all duration-150'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-2.5 p-0.5 text-outline hover:text-on-surface rounded-full transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

SearchBar.displayName = 'SearchBar';
