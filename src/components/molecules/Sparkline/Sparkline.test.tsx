import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sparkline } from './Sparkline';

describe('Sparkline molecule', () => {
  it('renderiza el SVG correctamente con datos válidos', () => {
    render(<Sparkline data={[1200, 1342, 1428]} ariaLabel="Tendencia de horas" />);

    const sparkline = screen.getByRole('img', { name: /tendencia de horas/i });
    expect(sparkline).toBeInTheDocument();
    expect(sparkline.querySelector('svg')).toBeInTheDocument();
  });

  it('no renderiza nada cuando hay menos de 2 puntos de datos', () => {
    const { container } = render(<Sparkline data={[100]} />);
    expect(container.firstChild).toBeNull();
  });

  it('maneja valores iguales sin errores de división por cero', () => {
    render(<Sparkline data={[50, 50, 50]} ariaLabel="Estabilidad" />);
    expect(screen.getByRole('img', { name: /estabilidad/i })).toBeInTheDocument();
  });
});

