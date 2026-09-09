import React, { useState } from 'react';
import { cn } from '@/utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    const first = parts[0][0] ?? '';
    const last = parts[parts.length - 1]?.[0] ?? '';
    return (first + last).toUpperCase();
  };

  const sizeStyles = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  };

  const hasValidImage = src && !imageError;

  return (
    <div
      role="img"
      aria-label={`Avatar de ${name}`}
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center font-bold select-none shrink-0 ring-1 ring-surface-container-high',
        'bg-primary-container text-on-primary',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {hasValidImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
