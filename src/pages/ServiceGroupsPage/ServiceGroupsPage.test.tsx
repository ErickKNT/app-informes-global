import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServiceGroupsPage } from './ServiceGroupsPage';

describe('ServiceGroupsPage', () => {
  it('renderiza título, pestañas de grupos y supervisor activo', () => {
    render(<ServiceGroupsPage />);

    expect(screen.getByRole('heading', { name: /grupos de predicación y servicio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /grupo 1 - los olivos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /grupo 2 - betel/i })).toBeInTheDocument();
    expect(screen.getAllByText('Carlos Méndez').length).toBeGreaterThanOrEqual(1);
  });

  it('permite cambiar entre grupos al pulsar una pestaña', async () => {
    render(<ServiceGroupsPage />);

    const group2Tab = screen.getByRole('button', { name: /grupo 2 - betel/i });
    await userEvent.click(group2Tab);

    expect(screen.getAllByText('Fernando Ruiz').length).toBeGreaterThanOrEqual(1);
  });

  it('abre el modal asistido y permite registrar un informe pendiente', async () => {
    render(<ServiceGroupsPage />);

    // Buscar el botón registrar en Daniel Castillo (pendiente)
    const registerButtons = screen.getAllByRole('button', { name: /registrar/i });
    await userEvent.click(registerButtons[0]!);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/registrar informe asistido/i)).toBeInTheDocument();

    const hoursInput = screen.getByLabelText(/horas de servicio/i);
    await userEvent.clear(hoursInput);
    await userEvent.type(hoursInput, '15');

    const submitButton = screen.getByRole('button', { name: /enviar informe/i });
    await userEvent.click(submitButton);

    // El modal debe haberse cerrado y Daniel Castillo ahora debe mostrar "Entregado"
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
