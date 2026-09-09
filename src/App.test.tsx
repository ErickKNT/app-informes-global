import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('App root with navigation and Atomic Design pages', () => {
  it('inicia por defecto en la página Mi Informe Mensual', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /mi registro de servicio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar informe/i })).toBeInTheDocument();
  });

  it('permite navegar hacia Grupos de Servicio y Panel General', async () => {
    render(<App />);

    const groupsNavButton = screen.getByRole('button', { name: /grupos de servicio/i });
    await userEvent.click(groupsNavButton);

    expect(screen.getByRole('heading', { name: /grupos de servicio/i })).toBeInTheDocument();

    const reportNavButton = screen.getByRole('button', { name: /mi informe mensual/i });
    await userEvent.click(reportNavButton);

    expect(screen.getByRole('heading', { name: /mi registro de servicio/i })).toBeInTheDocument();
  });
});
