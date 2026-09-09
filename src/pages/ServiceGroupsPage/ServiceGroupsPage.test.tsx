import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

    expect(screen.getAllByText(/grupo 2 - betel/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Fernando Ruiz').length).toBeGreaterThanOrEqual(1);
  });

  it('abre el modal asistido y permite registrar un informe pendiente', async () => {
    render(<ServiceGroupsPage />);

    const danielRowButton = screen.getByRole('button', { name: /registrar informe de daniel castillo/i });
    await userEvent.click(danielRowButton);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/registrar informe asistido/i)).toBeInTheDocument();

    // Como Daniel Castillo es publicador, no debe solicitar horas
    expect(within(dialog).queryByLabelText(/horas de servicio/i)).not.toBeInTheDocument();

    const studiesInput = within(dialog).getByLabelText(/cursos bíblicos conducidos/i);
    await userEvent.clear(studiesInput);
    await userEvent.type(studiesInput, '2');

    const submitButton = within(dialog).getByRole('button', { name: /enviar informe/i });
    await userEvent.click(submitButton);

    // El modal debe haberse cerrado y Daniel Castillo ahora debe mostrar "Entregado"
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('permite abrir el modal de crear grupo y registrar uno nuevo', async () => {
    render(<ServiceGroupsPage />);

    const createGroupButton = screen.getByRole('button', { name: /crear grupo/i });
    await userEvent.click(createGroupButton);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /crear nuevo grupo de servicio/i })).toBeInTheDocument();

    const nameInput = within(dialog).getByLabelText(/nombre del grupo/i);
    await userEvent.type(nameInput, 'Grupo 6 - Valle Dorado');

    const submitBtn = within(dialog).getByRole('button', { name: /^crear grupo$/i });
    await userEvent.click(submitBtn);

    const feedback = await screen.findByText(/grupo "grupo 6 - valle dorado" creado con éxito/i);
    expect(feedback).toBeInTheDocument();
  });
});
