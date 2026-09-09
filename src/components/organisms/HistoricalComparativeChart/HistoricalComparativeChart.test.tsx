import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HistoricalComparativeChart } from './HistoricalComparativeChart';

describe('HistoricalComparativeChart organism', () => {
  it('renderiza título, leyenda, gráfica SVG y tarjetas de metadata', () => {
    render(<HistoricalComparativeChart />);

    expect(screen.getByText('Evolución Mensual de Horas y Participación')).toBeInTheDocument();
    expect(screen.getByText('Publicadores')).toBeInTheDocument();
    expect(screen.getByText('Precursores')).toBeInTheDocument();
    expect(screen.getByText('Total Acumulado')).toBeInTheDocument();

    expect(screen.getByRole('img', { name: /gráfica de evolución mensual de horas/i })).toBeInTheDocument();
    expect(screen.getByText(/Mes con mayor volumen/i)).toBeInTheDocument();
    expect(screen.getByText(/Agosto 2024 \(2,680 hrs\)/i)).toBeInTheDocument();
    expect(screen.getByText(/54.8% del total congregacional/i)).toBeInTheDocument();
    expect(screen.getByText(/96.3% entregados a tiempo/i)).toBeInTheDocument();
  });

  it('renderiza meses personalizados y calcula totales', () => {
    const customData = [
      { month: 'Enero', publishersHours: 800, pioneersHours: 1200 },
      { month: 'Febrero', publishersHours: 900, pioneersHours: 1300 },
    ];

    render(
      <HistoricalComparativeChart
        data={customData}
        highestVolumeMonth="Febrero 2025 (2,200 hrs)"
        pioneersSharePct={59.1}
        punctualityRatePct={98.0}
      />
    );

    expect(screen.getByText('Enero')).toBeInTheDocument();
    expect(screen.getByText('Febrero')).toBeInTheDocument();
    expect(screen.getByText(/Febrero 2025 \(2,200 hrs\)/i)).toBeInTheDocument();
    expect(screen.getByText(/59.1% del total congregacional/i)).toBeInTheDocument();
    expect(screen.getByText(/98% entregados a tiempo/i)).toBeInTheDocument();
  });
});
