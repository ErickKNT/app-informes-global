import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublisherFormModal } from './PublisherFormModal';
import type { Profile } from '@/types/database.types';

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

describe('PublisherFormModal organism', () => {
  it('renderiza modo creación con campos limpios y opciones de rol/privilegio', () => {
    render(
      <PublisherFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        availableGroups={MOCK_GROUPS}
      />
    );

    expect(screen.getByRole('heading', { name: /registrar nuevo publicador/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('');
    expect(screen.getByLabelText(/nombramiento o rol/i)).toHaveValue('publicador');
    expect(screen.getByLabelText(/privilegio de servicio/i)).toHaveValue('publicador');
  });

  it('prellena los campos en modo edición', () => {
    const existingPub: Profile = {
      id: 'pub-1',
      service_group_id: 'grp-2',
      full_name: 'Mateo González',
      phone: '+52 55 1234 5678',
      role: 'siervo_ministerial',
      privilege: 'precursor_regular',
      is_active: true,
      avatar_url: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    render(
      <PublisherFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        publisher={existingPub}
        availableGroups={MOCK_GROUPS}
      />
    );

    expect(screen.getByRole('heading', { name: /editar publicador \/ rol/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('Mateo González');
    expect(screen.getByLabelText(/nombramiento o rol/i)).toHaveValue('siervo_ministerial');
    expect(screen.getByLabelText(/privilegio de servicio/i)).toHaveValue('precursor_regular');
    expect(screen.getByLabelText(/grupo de servicio asignado/i)).toHaveValue('grp-2');
  });

  it('envía los datos actualizados al hacer submit', async () => {
    const handleSave = vi.fn();
    render(
      <PublisherFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={handleSave}
        availableGroups={MOCK_GROUPS}
      />
    );

    const nameInput = screen.getByLabelText(/nombre completo/i);
    await userEvent.type(nameInput, 'Raquel Rivera');

    const roleSelect = screen.getByLabelText(/nombramiento o rol/i);
    await userEvent.selectOptions(roleSelect, 'anciano');

    const privilegeSelect = screen.getByLabelText(/privilegio de servicio/i);
    await userEvent.selectOptions(privilegeSelect, 'precursor_regular');

    const submitButton = screen.getByRole('button', { name: /registrar publicador/i });
    await userEvent.click(submitButton);

    expect(handleSave).toHaveBeenCalledWith({
      full_name: 'Raquel Rivera',
      phone: null,
      role: 'anciano',
      privilege: 'precursor_regular',
      service_group_id: 'grp-1',
    });
  });
});

