import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GroupMetricsCards } from './GroupMetricsCards';

describe('GroupMetricsCards organism', () => {
  const mockMetrics = {
    totalPublishers: 19,
    reportedPublishers: 16,
    totalHours: 184,
    totalBibleStudies: 6,
  };

  it('renderiza las 4 métricas del grupo', () => {
    render(<GroupMetricsCards metrics={mockMetrics} />);

    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText('84%')).toBeInTheDocument();
    expect(screen.getByText('184')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('3 pendientes')).toBeInTheDocument();
  });
});

