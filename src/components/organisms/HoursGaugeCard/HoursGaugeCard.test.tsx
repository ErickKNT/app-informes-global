import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HoursGaugeCard } from './HoursGaugeCard';

describe('HoursGaugeCard organism', () => {
  it('renderiza horas actuales y meta correctamente', () => {
    render(<HoursGaugeCard hours={42} targetHours={50} monthName="Octubre" />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('de 50 Horas')).toBeInTheDocument();
    expect(screen.getByText('84%')).toBeInTheDocument();
    expect(screen.getByText(/te faltan/i)).toBeInTheDocument();
    expect(screen.getByText('8 horas')).toBeInTheDocument();
  });

  it('muestra mensaje de meta alcanzada cuando horas >= targetHours', () => {
    render(<HoursGaugeCard hours={52} targetHours={50} monthName="Octubre" />);

    expect(screen.getByText('52')).toBeInTheDocument();
    expect(screen.getByText('104%')).toBeInTheDocument();
    expect(screen.getByText(/¡excelente! has alcanzado la meta esperada/i)).toBeInTheDocument();
  });

  it('maneja valores extremos como 0 horas defensivamente sin división por cero', () => {
    render(<HoursGaugeCard hours={0} targetHours={30} monthName="Octubre" />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('30 horas')).toBeInTheDocument();
  });
});

