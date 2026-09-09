import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublisherCardsPage } from './PublisherCardsPage';

describe('PublisherCardsPage', () => {
  it('renderiza título, filtros, lista de publicadores y la tarjeta S-21 activa', () => {
    render(<PublisherCardsPage />);

    expect(screen.getByRole('heading', { name: /tarjetas de publicador/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nuevo publicador/i })).toBeInTheDocument();

    // Filtros
    expect(screen.getByLabelText(/buscar publicador por nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filtrar por grupo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filtrar por rol o nombramiento/i)).toBeInTheDocument();

    // Lista y Tarjeta
    expect(screen.getAllByText(/Mateo González/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Registro de Actividad Ministerial (Formato Canónico S-21)')).toBeInTheDocument();
  });

  it('permite buscar y seleccionar un publicador diferente', async () => {
    render(<PublisherCardsPage />);

    const searchInput = screen.getByLabelText(/buscar publicador por nombre/i);
    await userEvent.type(searchInput, 'Lucas');

    expect(screen.getByText('Lucas Peña')).toBeInTheDocument();
    expect(screen.queryByText('Elena Torres')).not.toBeInTheDocument();
  });

  it('abre el modal de crear publicador y registra uno nuevo', async () => {
    render(<PublisherCardsPage />);

    const newPubButton = screen.getByRole('button', { name: /nuevo publicador/i });
    await userEvent.click(newPubButton);

    expect(screen.getByRole('heading', { name: /registrar nuevo publicador/i })).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/nombre completo/i);
    await userEvent.type(nameInput, 'Benjamín Castro');

    const submitBtn = screen.getByRole('button', { name: /registrar publicador/i });
    await userEvent.click(submitBtn);

    // Mensaje de éxito
    const feedback = await screen.findByText(/publicador "benjamín castro" registrado correctamente/i);
    expect(feedback).toBeInTheDocument();
  });

  it('abre el modal de importación CSV al hacer clic en Importar CSV', async () => {
    render(<PublisherCardsPage />);

    const importBtn = screen.getByRole('button', { name: /importar csv/i });
    await userEvent.click(importBtn);

    expect(
      screen.getByRole('heading', { name: /importación masiva de publicadores/i })
    ).toBeInTheDocument();
  });
});

