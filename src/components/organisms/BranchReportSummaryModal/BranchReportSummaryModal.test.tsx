import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BranchReportSummaryModal, type BranchReportData } from './BranchReportSummaryModal';

const MOCK_DATA: BranchReportData = {
  congregationName: 'Congregación El Olivar',
  monthName: 'Octubre',
  year: 2024,
  totalPublishers: 98,
  reportedPublishers: 84,
  totalBibleStudies: 42,
  regularPioneersCount: 16,
  regularPioneersHours: 820,
  auxiliaryPioneersCount: 12,
  auxiliaryPioneersHours: 374,
  midweekMeetingAverage: 88,
  weekendMeetingAverage: 104,
};

describe('BranchReportSummaryModal organism', () => {
  it('renderiza todos los bloques canónicos del informe para la sucursal', () => {
    render(<BranchReportSummaryModal isOpen={true} onClose={vi.fn()} data={MOCK_DATA} />);

    expect(
      screen.getByRole('heading', { name: /informe mensual para la sucursal/i })
    ).toBeInTheDocument();
    expect(screen.getByText('84 / 98')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('820 hrs')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
    expect(screen.getByText('104')).toBeInTheDocument();
  });

  it('permite copiar el resumen formateado al portapapeles', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<BranchReportSummaryModal isOpen={true} onClose={vi.fn()} data={MOCK_DATA} />);

    const copyBtn = screen.getByRole('button', { name: /copiar resumen para sucursal/i });
    await userEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    const textCopied = writeTextMock.mock.calls[0]?.[0] || '';
    expect(textCopied).toContain('INFORME MENSUAL DE LA CONGREGACIÓN - SUCURSAL');
    expect(textCopied).toContain('Congregación El Olivar');
    expect(textCopied).toContain('Publicadores que informaron actividad: 84 (86%)');
  });

  it('llama a window.print al hacer click en Imprimir Formato', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(<BranchReportSummaryModal isOpen={true} onClose={vi.fn()} data={MOCK_DATA} />);

    const printBtn = screen.getByRole('button', { name: /imprimir formato/i });
    await userEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
  });
});
