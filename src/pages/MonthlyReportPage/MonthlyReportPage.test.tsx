import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MonthlyReportPage } from './MonthlyReportPage';

describe('MonthlyReportPage', () => {
  it('renderiza título, selector de rol y formulario', () => {
    render(<MonthlyReportPage />);

    expect(screen.getByRole('heading', { name: /mi registro de servicio/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /precursor regular/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar informe/i })).toBeInTheDocument();
  });

  it('actualiza la meta de horas cuando se cambia el rol a Precursor Auxiliar', async () => {
    render(<MonthlyReportPage />);

    const auxButton = screen.getByRole('radio', { name: /p\. auxiliar/i });
    await userEvent.click(auxButton);

    expect(screen.getByText('Meta: 30 hrs')).toBeInTheDocument();
    expect(screen.getByText('de 30 Horas')).toBeInTheDocument();
  });

  it('actualiza la meta de horas cuando se cambia el rol a Publicador', async () => {
    render(<MonthlyReportPage />);

    const pubButton = screen.getByRole('radio', { name: /publicador/i });
    await userEvent.click(pubButton);

    expect(screen.getByText('Meta: 10 hrs')).toBeInTheDocument();
    expect(screen.getByText('de 10 Horas')).toBeInTheDocument();
  });

  it('llama a onSaveReport con datos y rol seleccionado al enviar', async () => {
    const handleSave = vi.fn();
    render(<MonthlyReportPage onSaveReport={handleSave} />);

    // Cambiar a Precursor Auxiliar
    await userEvent.click(screen.getByRole('radio', { name: /p\. auxiliar/i }));

    const hoursInput = screen.getByLabelText(/horas de servicio/i);
    await userEvent.clear(hoursInput);
    await userEvent.type(hoursInput, '32');

    await userEvent.click(screen.getByRole('button', { name: /enviar informe/i }));

    expect(handleSave).toHaveBeenCalledWith({
      participated: true,
      hours: 32,
      bible_studies: 2,
      notes: '',
      role: 'precursor_auxiliar',
    });
  });
});
