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

  it('abre y cierra el menú móvil al interactuar con el botón hamburguesa', async () => {
    const handleLogout = vi.fn();
    render(
      <AppLayout currentPath="panel-general" onNavigate={vi.fn()} onLogout={handleLogout}>
        <div>Contenido</div>
      </AppLayout>
    );

    const hamburgerButton = screen.getByRole('button', { name: /abrir menú de navegación/i });
    await userEvent.click(hamburgerButton);

    expect(screen.getByRole('dialog', { name: /menú de navegación móvil/i })).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /cerrar menú/i });
    await userEvent.click(closeButton);

    expect(screen.queryByRole('dialog', { name: /menú de navegación móvil/i })).not.toBeInTheDocument();
  });
});
