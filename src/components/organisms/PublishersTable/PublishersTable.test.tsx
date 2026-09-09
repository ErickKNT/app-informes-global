import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublishersTable, type PublisherListItem } from './PublishersTable';

describe('PublishersTable organism', () => {
  const mockPublishers: PublisherListItem[] = [
    {
      id: '1',
      name: 'Carlos Méndez',
      phone: '+34 612 889 012',
      role: 'anciano',
      privilege: 'precursor_regular',
      hasReported: true,
      hours: 54,
      bibleStudies: 4,
    },
    {
      id: '2',
      name: 'Daniel Castillo',
      phone: '+34 602 441 876',
      role: 'publicador',
      privilege: 'publicador',
      hasReported: false,
      hours: null,
      bibleStudies: null,
    },
    {
      id: '3',
      name: 'Sofía Navarro',
      phone: '+34 670 123 456',
      role: 'publicador',
      privilege: 'precursor_auxiliar',
      hasReported: true,
      hours: 32,
      bibleStudies: 2,
    },
  ];

  it('renderiza todos los publicadores inicialmente', () => {
    render(<PublishersTable publishers={mockPublishers} />);

    expect(screen.getByText('Carlos Méndez')).toBeInTheDocument();
    expect(screen.getByText('Daniel Castillo')).toBeInTheDocument();
    expect(screen.getByText('Sofía Navarro')).toBeInTheDocument();
  });

  it('filtra por estado pendiente al hacer click en la píldora Pendientes', async () => {
    render(<PublishersTable publishers={mockPublishers} />);

    const pendingFilterButton = screen.getByRole('button', { name: /pendientes \(1\)/i });
    await userEvent.click(pendingFilterButton);

    expect(screen.getByText('Daniel Castillo')).toBeInTheDocument();
    expect(screen.queryByText('Carlos Méndez')).not.toBeInTheDocument();
    expect(screen.queryByText('Sofía Navarro')).not.toBeInTheDocument();
  });

  it('filtra mediante el buscador de texto', async () => {
    render(<PublishersTable publishers={mockPublishers} />);

    const searchInput = screen.getByPlaceholderText(/buscar en el grupo/i);
    await userEvent.type(searchInput, 'Sofía');

    expect(screen.getByText('Sofía Navarro')).toBeInTheDocument();
    expect(screen.queryByText('Carlos Méndez')).not.toBeInTheDocument();
  });

  it('llama a onRegisterReport al pulsar Registrar en un publicador pendiente', async () => {
    const handleRegister = vi.fn();
    render(<PublishersTable publishers={mockPublishers} onRegisterReport={handleRegister} />);

    const registerButton = screen.getByRole('button', { name: /registrar/i });
    await userEvent.click(registerButton);

    expect(handleRegister).toHaveBeenCalledWith(mockPublishers[1]);
  });

  it('muestra "Participó" para publicadores que entregaron informe y horas numéricas para precursores', () => {
    const pubsWithReported: PublisherListItem[] = [
      ...mockPublishers,
      {
        id: '4',
        name: 'Mateo González',
        phone: null,
        role: 'publicador',
        privilege: 'publicador',
        hasReported: true,
        hours: 0,
        bibleStudies: 1,
      },
    ];
    render(<PublishersTable publishers={pubsWithReported} />);

    expect(screen.getByText('Participó')).toBeInTheDocument();
    expect(screen.getByText('54 hrs')).toBeInTheDocument();
  });
});

