import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertBanner } from './AlertBanner';

describe('AlertBanner molecule', () => {
  it('muestra días restantes y cantidad de publicadores pendientes', () => {
    render(<AlertBanner daysRemaining={4} pendingCount={14} />);

    expect(screen.getByText('Cierre oficial de ciclo mensual')).toBeInTheDocument();
    expect(screen.getByText('4 días')).toBeInTheDocument();
    expect(screen.getByText('14 publicadores')).toBeInTheDocument();
    expect(screen.getByText('Prioritario')).toBeInTheDocument();
  });

  it('llama a onNotifyOverseers al presionar el botón de aviso', async () => {
    const handleNotify = vi.fn();
    render(
      <AlertBanner
        daysRemaining={3}
        pendingCount={10}
        onNotifyOverseers={handleNotify}
      />
    );

    const button = screen.getByRole('button', { name: /aviso a encargados/i });
    await userEvent.click(button);

    expect(handleNotify).toHaveBeenCalledTimes(1);
  });
});

