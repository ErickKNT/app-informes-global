import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteGroupModal } from './DeleteGroupModal';

const MOCK_GROUP = {
  id: 'grp-old',
  group_number: 5,
  name: 'Grupo 5 - Galilea',
  meeting_location: null,
  meeting_schedule: null,
  overseer_id: null,
  assistant_id: null,
  created_at: '2024-01-01',
};

const MOCK_OTHER_GROUPS = [
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
];

describe('DeleteGroupModal organism', () => {
  it('exige seleccionar grupo de respaldo cuando hay publicadores asignados', async () => {
    const handleDelete = vi.fn();

    render(
      <DeleteGroupModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirmDelete={handleDelete}
        group={MOCK_GROUP}
        publishersCount={14}
        otherGroups={MOCK_OTHER_GROUPS}
      />
    );

    expect(screen.getByRole('heading', { name: /eliminar grupo de servicio/i })).toBeInTheDocument();
    expect(screen.getByText(/este grupo tiene 14 publicador\(es\) asignado\(s\)/i)).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: /eliminar grupo/i });
    await userEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledWith('grp-old', 'grp-1');
  });
});

