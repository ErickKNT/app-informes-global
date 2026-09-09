import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CongregationKPIs, type CongregationKPIsData } from './CongregationKPIs';

describe('CongregationKPIs organism', () => {
  const mockData: CongregationKPIsData = {
    totalHours: 1428,
    previousMonthHours: 1342,
    hoursHistory: [1100, 1250, 1342, 1428],
    reportedPublishers: 84,
    totalPublishers: 98,
    activeStudies: 42,
    newStudiesThisMonth: 3,
    pioneersOnTrack: 14,
    totalPioneers: 16,
  };

  it('renderiza las 4 métricas con cálculos porcentuales correctos', () => {
    render(<CongregationKPIs data={mockData} />);

    expect(screen.getByText('1,428')).toBeInTheDocument();
    expect(screen.getByText('+6.4% vs. mes anterior')).toBeInTheDocument();
    expect(screen.getByText('85.7%')).toBeInTheDocument();
    expect(screen.getByText('14 publicadores restantes')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('0.43 / pub')).toBeInTheDocument();
    expect(screen.getByText('87.5%')).toBeInTheDocument();
    expect(screen.getByText('2 en seguimiento')).toBeInTheDocument();
  });
});

