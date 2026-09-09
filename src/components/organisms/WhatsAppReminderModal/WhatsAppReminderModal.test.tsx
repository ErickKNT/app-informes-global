import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WhatsAppReminderModal, type GroupReminderData } from './WhatsAppReminderModal';

const MOCK_GROUPS: GroupReminderData[] = [
  {
    id: 'group-1',
    groupNumber: 1,
    name: 'Grupo 1 - Los Olivos',
    overseerName: 'Carlos Méndez',
    overseerPhone: '+34 612 889 012',
    publishersCount: 19,
    reportedCount: 16,
  },
  {
    id: 'group-2',
    groupNumber: 2,
    name: 'Grupo 2 - Betel',
    overseerName: 'Fernando Ruiz',
    overseerPhone: '+34 600 111 222',
    publishersCount: 18,
    reportedCount: 18,
  },
];

describe('WhatsAppReminderModal organism', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('no renderiza nada si isOpen es false', () => {
    const { container } = render(
      <WhatsAppReminderModal isOpen={false} onClose={vi.fn()} groups={MOCK_GROUPS} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza la lista de encargados, pendientes y modo de prueba cuando está abierto', () => {
    render(
      <WhatsAppReminderModal isOpen={true} onClose={vi.fn()} groups={MOCK_GROUPS} />
    );

    expect(
      screen.getByRole('heading', { name: /centro de recordatorios por whatsapp/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Carlos Méndez')).toBeInTheDocument();
    expect(screen.getByText('Fernando Ruiz')).toBeInTheDocument();
    expect(screen.getByText(/3 pendientes de 19/i)).toBeInTheDocument();
    expect(screen.getByText(/100% entregados/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número de whatsapp de prueba/i)).toBeInTheDocument();
  });

  it('permite abrir whatsapp con window.open al presionar el botón', async () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <WhatsAppReminderModal
        isOpen={true}
        onClose={vi.fn()}
        groups={MOCK_GROUPS}
        defaultTestPhone="+52 55 9999 8888"
      />
    );

    const openButtons = screen.getAllByRole('button', { name: /abrir whatsapp/i });
    expect(openButtons[0]).toBeDefined();
    await userEvent.click(openButtons[0]!);

    expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    const calledUrl = (windowOpenSpy.mock.calls[0]?.[0] as string) || '';
    expect(calledUrl).toContain('https://wa.me/525599998888');
    expect(calledUrl).toContain('Carlos%20M%C3%A9ndez');

    // Debe mostrar indicador de contactado
    expect(screen.getByText(/^contactado$/i)).toBeInTheDocument();
  });

  it('permite expandir y ver la vista previa del mensaje teocrático', async () => {
    render(
      <WhatsAppReminderModal isOpen={true} onClose={vi.fn()} groups={MOCK_GROUPS} />
    );

    const togglePreviewBtns = screen.getAllByRole('button', {
      name: /ver mensaje que se enviará/i,
    });
    expect(togglePreviewBtns[0]).toBeDefined();
    await userEvent.click(togglePreviewBtns[0]!);

    expect(screen.getByText(/te saludamos cariñosamente de la secretaría/i)).toBeInTheDocument();
  });
});
