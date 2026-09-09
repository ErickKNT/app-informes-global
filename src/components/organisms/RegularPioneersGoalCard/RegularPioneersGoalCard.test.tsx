import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegularPioneersGoalCard } from './RegularPioneersGoalCard';

describe('RegularPioneersGoalCard organism', () => {
  it('renderiza título, meta canónica y los precursores regulares', () => {
    render(<RegularPioneersGoalCard />);

    expect(
      screen.getByText('Análisis de Metas de Precursores Regulares')
    ).toBeInTheDocument();
    expect(screen.getByText(/Meta canónica anual: 600 horas/i)).toBeInTheDocument();
    expect(screen.getByText('Mateo González')).toBeInTheDocument();
    expect(screen.getByText('Carmen Ramírez')).toBeInTheDocument();
    expect(screen.getByText('Lucas Silva')).toBeInTheDocument();
    expect(screen.getByText('Elena Torres')).toBeInTheDocument();
  });

  it('permite alternar para ver el resto de los precursores', async () => {
    render(<RegularPioneersGoalCard />);

    // Por defecto muestra 4
    expect(screen.queryByText('Daniel Ortiz')).not.toBeInTheDocument();

    const expandButton = screen.getByRole('button', {
      name: /ver 4 precursores restantes/i,
    });
    await userEvent.click(expandButton);

    expect(screen.getByText('Daniel Ortiz')).toBeInTheDocument();
    expect(screen.getByText('Sara Medina')).toBeInTheDocument();
    expect(screen.getByText('Gabriel Vargas')).toBeInTheDocument();
    expect(screen.getByText('Rebeca Flores')).toBeInTheDocument();

    const collapseButton = screen.getByRole('button', {
      name: /mostrar menos/i,
    });
    await userEvent.click(collapseButton);

    expect(screen.queryByText('Daniel Ortiz')).not.toBeInTheDocument();
  });

  it('permite enviar aviso a precursores y ejecuta callback', async () => {
    const handleNotify = vi.fn();
    render(<RegularPioneersGoalCard onNotifyPioneers={handleNotify} />);

    const notifyButton = screen.getByRole('button', {
      name: /notificar a precursores/i,
    });
    await userEvent.click(notifyButton);

    expect(handleNotify).toHaveBeenCalledTimes(1);

    const feedback = await screen.findByText(
      /notificación de avance anual enviada a los precursores regulares/i
    );
    expect(feedback).toBeInTheDocument();
  });
});
