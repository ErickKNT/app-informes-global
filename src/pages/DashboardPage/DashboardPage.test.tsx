import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('permite enviar aviso a encargados y muestra confirmación', async () => {
    render(<DashboardPage />);

    const notifyButton = screen.getByRole('button', { name: /aviso a encargados/i });
    await userEvent.click(notifyButton);

    const feedback = await screen.findByText(
      /aviso recordatorio enviado a los 5 encargados de grupo/i,
      {},
      { timeout: 2000 }
    );
    expect(feedback).toBeInTheDocument();
  });

  it('ejecuta onExportS21 al hacer click en Exportar S-21', async () => {
    const handleExport = vi.fn();
    render(<DashboardPage onExportS21={handleExport} />);

    const exportButton = screen.getByRole('button', { name: /exportar s-21/i });
    await userEvent.click(exportButton);

    expect(handleExport).toHaveBeenCalledTimes(1);
  });
});
