import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssistedReportModal } from './AssistedReportModal';
import type { PublisherListItem } from '@/components/organisms/PublishersTable';

describe('AssistedReportModal organism', () => {
  const mockPublisher: PublisherListItem = {
    id: 'pub-1',
    name: 'Daniel Castillo',
    phone: '+34 602 441 876',
    role: 'publicador',
    privilege: 'publicador',
    hasReported: false,
    hours: null,
    bibleStudies: null,
  };

  it('no renderiza nada cuando isOpen es false', () => {
    const { container } = render(
      <AssistedReportModal
        publisher={mockPublisher}
        isOpen={false}
        onClose={vi.fn()}
        onSubmitReport={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renderiza título, nombre del publicador y formulario cuando isOpen es true', () => {
    render(
      <AssistedReportModal
        publisher={mockPublisher}
        isOpen={true}
        onClose={vi.fn()}
        onSubmitReport={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Registrar Informe Asistido')).toBeInTheDocument();
    expect(screen.getByText('Daniel Castillo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar informe/i })).toBeInTheDocument();
  });

  it('llama a onClose al presionar el botón de cerrar', async () => {
    const handleClose = vi.fn();
    render(
      <AssistedReportModal
        publisher={mockPublisher}
        isOpen={true}
        onClose={handleClose}
        onSubmitReport={vi.fn()}
      />
    );

    const closeButton = screen.getByRole('button', { name: /cerrar ventana/i });
    await userEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

