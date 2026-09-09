import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge atom', () => {
  it('renderiza texto por defecto como publicador', () => {
    render(<Badge>Publicador</Badge>);
    const badge = screen.getByText('Publicador');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-surface-container-high');
  });

  it('aplica estilos para Precursor Regular', () => {
    render(<Badge variant="regular">Precursor Regular</Badge>);
    const badge = screen.getByText('Precursor Regular');
    expect(badge).toHaveClass('bg-secondary-container');
  });

  it('aplica estilos para Precursor Auxiliar', () => {
    render(<Badge variant="auxiliar">Precursor Auxiliar</Badge>);
    const badge = screen.getByText('Precursor Auxiliar');
    expect(badge).toHaveClass('bg-tertiary-fixed');
  });

  it('aplica estilos para estado Pendiente', () => {
    render(<Badge variant="pendiente">Pendiente</Badge>);
    const badge = screen.getByText('Pendiente');
    expect(badge).toHaveClass('text-tertiary-container');
  });
});
