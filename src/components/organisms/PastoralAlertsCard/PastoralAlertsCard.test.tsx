import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PastoralAlertsCard } from './PastoralAlertsCard';

describe('PastoralAlertsCard organism', () => {
  it('renderiza solicitudes pendientes y avisos de servicio', () => {
    render(<PastoralAlertsCard />);

    expect(screen.getByText('Atención y Solicitudes')).toBeInTheDocument();
    expect(screen.getByText(/elena valdés/i)).toBeInTheDocument();
    expect(screen.getByText('Avisos de Servicio')).toBeInTheDocument();
    expect(screen.getByText(/informe mensual de congregación \(s-1\)/i)).toBeInTheDocument();
  });

  it('llama a onReviewRequest al hacer click en revisar solicitud', async () => {
    const handleReview = vi.fn();
    render(<PastoralAlertsCard onReviewRequest={handleReview} />);

    const reviewButton = screen.getByRole('button', { name: /revisar solicitud/i });
    await userEvent.click(reviewButton);

    expect(handleReview).toHaveBeenCalledWith('req-1');
  });
});

