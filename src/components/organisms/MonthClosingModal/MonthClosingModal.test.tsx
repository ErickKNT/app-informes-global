import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MonthClosingModal } from './MonthClosingModal';

describe('MonthClosingModal organism', () => {
  it('no renderiza nada si isOpen es false', () => {
    const { container } = render(
      <MonthClosingModal
        isOpen={false}
        onClose={vi.fn()}
        currentMonthName="Octubre"
        nextMonthName="Noviembre"
        currentYear={2024}
        reportedCount={84}
        totalPublishers={98}
        onConfirmCloseMonth={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('mantiene deshabilitado el botón de confirmar hasta que se marquen los 3 puntos de verificación', async () => {
    const confirmSpy = vi.fn();

    render(
      <MonthClosingModal
        isOpen={true}
        onClose={vi.fn()}
        currentMonthName="Octubre"
        nextMonthName="Noviembre"
        currentYear={2024}
        reportedCount={84}
        totalPublishers={98}
        onConfirmCloseMonth={confirmSpy}
      />
    );

    const confirmBtn = screen.getByRole('button', { name: /confirmar cierre de mes/i });
    expect(confirmBtn).toBeDisabled();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);

    // Marcar 1
    await userEvent.click(checkboxes[0]!);
    expect(confirmBtn).toBeDisabled();

    // Marcar 2
    await userEvent.click(checkboxes[1]!);
    expect(confirmBtn).toBeDisabled();

    // Marcar 3
    await userEvent.click(checkboxes[2]!);
    expect(confirmBtn).not.toBeDisabled();

    // Confirmar
    await userEvent.click(confirmBtn);

    // Esperar timeout de procesamiento
    await screen.findByRole('button', { name: /cerrando mes/i });
  });
});

