import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConsolidatedMetricsSummary } from './ConsolidatedMetricsSummary';

describe('ConsolidatedMetricsSummary organism', () => {
  it('renderiza los 3 bloques principales de métricas de servicio', () => {
    render(<ConsolidatedMetricsSummary />);

    expect(screen.getByText('Promedio Publicadores')).toBeInTheDocument();
    expect(screen.getByText('94.2')).toBeInTheDocument();
    expect(screen.getByText('Total publicadores: 98')).toBeInTheDocument();

    expect(screen.getByText('Horas Totales Acumuladas')).toBeInTheDocument();
    expect(screen.getByText('14,890')).toBeInTheDocument();
    expect(screen.getByText(/Promedio: 11.2 hrs\/pub/i)).toBeInTheDocument();

    expect(screen.getByText('Cursos Bíblicos Promedio')).toBeInTheDocument();
    expect(screen.getByText('44')).toBeInTheDocument();
    expect(screen.getByText(/\+3 estudios vs Sep/i)).toBeInTheDocument();
  });

  it('permite pasar datos personalizados', () => {
    render(
      <ConsolidatedMetricsSummary
        data={{
          averagePublishers: 88.5,
          publishersTrendPct: 2.1,
          totalPublishers: 92,
          totalHours: 12400,
          averageHoursPerPublisher: 10.5,
          projectedAnnualHours: 16000,
          averageBibleStudies: 38,
          studiesDiffFromLastMonth: 1,
          studiesRatio: 0.43,
        }}
      />
    );

    expect(screen.getByText('88.5')).toBeInTheDocument();
    expect(screen.getByText('12,400')).toBeInTheDocument();
    expect(screen.getByText('38')).toBeInTheDocument();
    expect(screen.getByText('Total publicadores: 92')).toBeInTheDocument();
  });
});
