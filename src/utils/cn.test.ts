import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('combina nombres de clases simples', () => {
    expect(cn('bg-primary', 'text-white')).toBe('bg-primary text-white');
  });

  it('resuelve condiciones booleanas', () => {
    const isPrimary = true;
    const isHidden = false;
    expect(cn('base', isPrimary && 'bg-primary', isHidden && 'hidden')).toBe('base bg-primary');
  });

  it('resuelve conflictos de Tailwind correctamente con prioridad del último valor', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

