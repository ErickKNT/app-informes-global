import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublisherTransferModal } from './PublisherTransferModal';
import type { Profile } from '@/types/database.types';

const MOCK_PUB: Profile = {
  id: 'pub-1',
  service_group_id: 'grp-1',
  full_name: 'Mateo González',
  phone: null,
  role: 'publicador',
  privilege: 'precursor_regular',
  is_active: true,
  avatar_url: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

const MOCK_GROUPS = [
  {
    id: 'grp-1',
    group_number: 1,
    name: 'Grupo 1 - Los Olivos',
    meeting_location: null,
    meeting_schedule: null,
    overseer_id: null,
    assistant_id: null,
    created_at: '2024-01-01',
  },
  {
    id: 'grp-2',
    group_number: 2,
    name: 'Grupo 2 - Betel',
    meeting_location: null,
    meeting_schedule: null,
    overseer_id: null,
    assistant_id: null,
    created_at: '2024-01-01',
  },
];

describe('PublisherTransferModal organism', () => {
  it('muestra datos del publicador y permite seleccionar grupo de destino', async () => {
    const handleTransfer = vi.fn();

    render(
      <PublisherTransferModal
        isOpen={true}
        onClose={vi.fn()}
        onTransfer={handleTransfer}
        publisher={MOCK_PUB}
        availableGroups={MOCK_GROUPS}
      />
    );

    expect(screen.getByRole('heading', { name: /transferir a otro grupo/i })).toBeInTheDocument();
    expect(screen.getByText('Mateo González')).toBeInTheDocument();
    expect(screen.getByText('Grupo 1 - Los Olivos')).toBeInTheDocument();

    const groupSelect = screen.getByLabelText(/seleccionar grupo destino/i);
    await userEvent.selectOptions(groupSelect, 'grp-2');

    const confirmButton = screen.getByRole('button', { name: /confirmar transferencia/i });
    await userEvent.click(confirmButton);

    expect(handleTransfer).toHaveBeenCalledWith('pub-1', 'grp-2');
  });
});

