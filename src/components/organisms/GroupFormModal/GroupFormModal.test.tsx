import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupFormModal } from './GroupFormModal';
import type { Profile } from '@/types/database.types';

const MOCK_ELDERS: Profile[] = [
  {
    id: 'e-1',
    service_group_id: null,
    full_name: 'Carlos Méndez',
    phone: null,
    role: 'anciano',
    privilege: 'publicador',
    is_active: true,
    avatar_url: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 'e-2',
    service_group_id: null,
    full_name: 'Roberto Gómez',
    phone: null,
    role: 'siervo_ministerial',
    privilege: 'precursor_auxiliar',
    is_active: true,
    avatar_url: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

describe('GroupFormModal organism', () => {
  it('renderiza modo creación con campos por defecto', () => {
    render(
      <GroupFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        availableElders={MOCK_ELDERS}
      />
    );

    expect(
      screen.getByRole('heading', { name: /crear nuevo grupo de servicio/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/número/i)).toHaveValue(1);
    expect(screen.getByLabelText(/nombre del grupo/i)).toHaveValue('');
  });

  it('permite llenar datos y guardar un nuevo grupo', async () => {
    const handleSave = vi.fn();
    render(
      <GroupFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={handleSave}
        availableElders={MOCK_ELDERS}
      />
    );

    const nameInput = screen.getByLabelText(/nombre del grupo/i);
    await userEvent.type(nameInput, 'Grupo 6 - Valle');

    const overseerSelect = screen.getByLabelText(/superintendente de grupo/i);
    await userEvent.selectOptions(overseerSelect, 'e-1');

    const saveButton = screen.getByRole('button', { name: /crear grupo/i });
    await userEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledWith({
      group_number: 1,
      name: 'Grupo 6 - Valle',
      meeting_location: null,
      meeting_schedule: 'Sábados 9:00 AM',
      overseer_id: 'e-1',
      assistant_id: null,
    });
  });
});

