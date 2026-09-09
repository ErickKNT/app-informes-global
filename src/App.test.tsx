import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('App root component', () => {
  it('renderiza el título y la insignia de arquitectura', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /servicio & registro/i })).toBeInTheDocument();
    expect(screen.getByText(/arquitectura atomic design lista/i)).toBeInTheDocument();
  });

  it('incrementa el contador del botón al hacer click', async () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /probar átomo botón \(0\)/i });
    await userEvent.click(button);
    expect(screen.getByRole('button', { name: /probar átomo botón \(1\)/i })).toBeInTheDocument();
  });
});

