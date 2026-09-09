import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage (Panel General)', () => {
  it('renderiza saludo, banner de cierre mensual y tabla de grupos', () => {
    render(<DashboardPage />);

    expect(screen.getByRole('heading', { name: /bienvenido, david morales/i })).toBeInTheDocument();
    expect(screen.getByText('Cierre oficial de ciclo mensual')).toBeInTheDocument();
    expect(screen.getByText('Total Horas Congregación')).toBeInTheDocument();
    expect(screen.getByText('1,428')).toBeInTheDocument();
    expect(screen.getByText('Estado de Entrega por Grupos')).toBeInTheDocument();
  });

  it('abre el modal de recordatorios por WhatsApp al pulsar Aviso a Encargados', async () => {
    render(<DashboardPage />);

    const notifyButton = screen.getByRole('button', { name: /aviso a encargados/i });
    await userEvent.click(notifyButton);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole('heading', { name: /centro de recordatorios por whatsapp/i })
    ).toBeInTheDocument();
    expect(within(dialog).getByText('Carlos Méndez')).toBeInTheDocument();
  });

  it('ejecuta onExportS21 al hacer click en Exportar S-21', async () => {
    const handleExport = vi.fn();
    render(<DashboardPage onExportS21={handleExport} />);

    const exportButton = screen.getByRole('button', { name: /exportar s-21/i });
    await userEvent.click(exportButton);

    expect(handleExport).toHaveBeenCalledTimes(1);
  });
});
