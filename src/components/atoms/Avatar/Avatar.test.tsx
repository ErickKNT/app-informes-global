import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar atom', () => {
  it('renderiza iniciales correctamente cuando no hay src', () => {
    render(<Avatar name="Carlos Méndez" />);
    expect(screen.getByText('CM')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /avatar de carlos méndez/i })).toBeInTheDocument();
  });

  it('renderiza imagen cuando src es válido', () => {
    render(<Avatar name="David Morales" src="https://example.com/avatar.jpg" />);
    const img = screen.getByRole('img', { name: /avatar de david morales/i }).querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('maneja nombres de una sola palabra', () => {
    render(<Avatar name="Samuel" />);
    expect(screen.getByText('SA')).toBeInTheDocument();
  });
});
