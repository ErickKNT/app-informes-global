import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupsOverviewTable, type GroupOverviewItem } from './GroupsOverviewTable';

describe('GroupsOverviewTable organism', () => {
  const mockGroups: GroupOverviewItem[] = [
    {
      id: 'g1',
      groupNumber: 1,
      name: 'Grupo 1 - Los Olivos',
      overseerName: 'Carlos Méndez',
      publishersCount: 19,
      reportedCount: 16,
      totalHours: 184,
      bibleStudies: 6,
    },
    {
      id: 'g2',
      groupNumber: 2,
      name: 'Grupo 2 - Betel',
      overseerName: 'Fernando Ruiz',
      publishersCount: 18,
      reportedCount: 18,
      totalHours: 195,
      bibleStudies: 8,
    },
  ];

  it('renderiza nombres de grupos y encargados', () => {
    render(<GroupsOverviewTable groups={mockGroups} />);

    expect(screen.getByText('Grupo 1 - Los Olivos')).toBeInTheDocument();
    expect(screen.getByText('Carlos Méndez')).toBeInTheDocument();
    expect(screen.getByText('Grupo 2 - Betel')).toBeInTheDocument();
    expect(screen.getByText('Fernando Ruiz')).toBeInTheDocument();
    expect(screen.getByText('184 hrs')).toBeInTheDocument();
    expect(screen.getByText('195 hrs')).toBeInTheDocument();
  });

  it('muestra estado "Al día" cuando todos entregaron y "Faltantes" cuando hay pendientes', () => {
    render(<GroupsOverviewTable groups={mockGroups} />);

    expect(screen.getByText('Al día')).toBeInTheDocument();
    expect(screen.getByText('Faltantes')).toBeInTheDocument();
  });

  it('ejecuta onViewGroup al hacer click en la acción del grupo', async () => {
    const handleView = vi.fn();
    render(<GroupsOverviewTable groups={mockGroups} onViewGroup={handleView} />);

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]!);

    expect(handleView).toHaveBeenCalledWith('g1');
  });
});

