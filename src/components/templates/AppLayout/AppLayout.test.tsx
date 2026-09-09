import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppLayout } from './AppLayout';

describe('AppLayout template', () => {
  it('renderiza la barra lateral, header y contenido hijo', () => {
    render(
      <AppLayout currentPath="mi-informe-mensual" onNavigate={vi.fn()}>
        <div>Contenido Principal de Prueba</div>
      </AppLayout>
    );

    expect(screen.getByText('Contenido Principal de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Servicio & Registro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mi informe mensual/i })).toBeInTheDocument();
  });

  it('llama a onNavigate al hacer click en un elemento del menú', async () => {
    const handleNavigate = vi.fn();
    render(
      <AppLayout currentPath="mi-informe-mensual" onNavigate={handleNavigate}>
        <div>Contenido</div>
      </AppLayout>
    );

    const groupsButton = screen.getByRole('button', { name: /grupos de servicio/i });
    await userEvent.click(groupsButton);

    expect(handleNavigate).toHaveBeenCalledWith('grupos-de-servicio');
  });
});

