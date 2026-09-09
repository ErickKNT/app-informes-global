import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('App root with complete navigation and Atomic Design pages', () => {
  it('inicia por defecto en el Panel General', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /bienvenido, david morales/i })).toBeInTheDocument();
    expect(screen.getByText('Cierre oficial de ciclo mensual')).toBeInTheDocument();
  });

  it('permite navegar hacia Mi Informe Mensual y Grupos de Servicio', async () => {
    render(<App />);

    const reportNavButton = screen.getByRole('button', { name: /mi informe mensual/i });
    await userEvent.click(reportNavButton);

    expect(screen.getByRole('heading', { name: /mi registro de servicio/i })).toBeInTheDocument();

    const groupsNavButton = screen.getByRole('button', { name: /grupos de servicio/i });
    await userEvent.click(groupsNavButton);

    expect(screen.getByRole('heading', { name: /grupos de predicación y servicio/i })).toBeInTheDocument();
  });
});
