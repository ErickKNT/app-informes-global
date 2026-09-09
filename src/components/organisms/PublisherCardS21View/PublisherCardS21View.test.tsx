import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublisherCardS21View } from './PublisherCardS21View';
import type { PublisherS21Card } from '@/types/database.types';

const MOCK_CARD: PublisherS21Card = {
  publisher: {
    id: 'pub-1',
    service_group_id: 'grp-1',
    full_name: 'Mateo González',
    phone: '+52 55 1234 5678',
    role: 'publicador',
    privilege: 'precursor_regular',
    is_active: true,
    avatar_url: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  serviceGroup: {
    id: 'grp-1',
    group_number: 1,
    name: 'Grupo 1 - Los Olivos',
    meeting_location: 'Calle Olivos 12',
    meeting_schedule: 'Sábados 9:00 AM',
    overseer_id: null,
    assistant_id: null,
    created_at: '2024-01-01',
  },
  serviceYear: '2024-2025',
  records: [
    {
      month: 9,
      year: 2024,
      monthName: 'Septiembre',
      participated: true,
      hours: 54,
      bible_studies: 6,
      notes: 'Muy buen mes',
      status: 'confirmado',
    },
    {
      month: 10,
      year: 2024,
      monthName: 'Octubre',
      participated: true,
      hours: 50,
      bible_studies: 5,
      notes: null,
      status: 'entregado',
    },
  ],
  totalHours: 104,
  averageHours: 52.0,
  totalStudies: 11,
  annualGoal: 600,
  goalProgressPct: 17,
};

describe('PublisherCardS21View organism', () => {
  it('renderiza encabezado con datos del publicador, grupo y métricas anuales', () => {
    render(<PublisherCardS21View card={MOCK_CARD} />);

    expect(screen.getByRole('heading', { name: /mateo gonzález/i })).toBeInTheDocument();
    expect(screen.getByText('Precursor Regular')).toBeInTheDocument();
    expect(screen.getByText('Grupo 1 - Los Olivos')).toBeInTheDocument();
    expect(screen.getByText('+52 55 1234 5678')).toBeInTheDocument();

    // KPIs
    expect(screen.getByText('104')).toBeInTheDocument();
    expect(screen.getByText('52')).toBeInTheDocument();
    expect(screen.getByText('17%')).toBeInTheDocument();
  });

  it('ejecuta callbacks al hacer click en los botones administrativos', async () => {
    const handleEdit = vi.fn();
    const handleTransfer = vi.fn();
    const handleDeactivate = vi.fn();

    render(
      <PublisherCardS21View
        card={MOCK_CARD}
        onEditPublisher={handleEdit}
        onTransferGroup={handleTransfer}
        onDeactivatePublisher={handleDeactivate}
      />
    );

    const editButton = screen.getByRole('button', { name: /editar datos \/ rol/i });
    await userEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledTimes(1);

    const transferButton = screen.getByRole('button', { name: /cambiar grupo/i });
    await userEvent.click(transferButton);
    expect(handleTransfer).toHaveBeenCalledTimes(1);

    const deactivateButton = screen.getByRole('button', { name: /dar de baja/i });
    await userEvent.click(deactivateButton);
    expect(handleDeactivate).toHaveBeenCalledTimes(1);
  });
});

