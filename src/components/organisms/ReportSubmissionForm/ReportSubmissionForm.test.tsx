import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportSubmissionForm } from './ReportSubmissionForm';

describe('ReportSubmissionForm organism', () => {
  it('para publicadores de congregación no muestra el campo de horas y muestra pauta teocrática', () => {
    render(<ReportSubmissionForm onSubmit={vi.fn()} role="publicador" />);

    expect(screen.getByLabelText(/participé en alguna forma/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cursos bíblicos conducidos/i)).toBeInTheDocument();
    expect(screen.getByText(/pauta teocrática \(publicadores de congregación\)/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/horas de servicio/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar informe/i })).toBeInTheDocument();
  });

  it('permite a un publicador enviar su informe con horas en 0 por defecto', async () => {
    const handleSubmit = vi.fn();
    render(<ReportSubmissionForm onSubmit={handleSubmit} role="publicador" />);

    const bibleStudiesInput = screen.getByLabelText(/cursos bíblicos conducidos/i);
    await userEvent.clear(bibleStudiesInput);
    await userEvent.type(bibleStudiesInput, '2');

    await userEvent.click(screen.getByRole('button', { name: /enviar informe/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      participated: true,
      hours: 0,
      bible_studies: 2,
      notes: '',
    });
  });

  it('para precursores regulares sí muestra campo de horas y valida horas inválidas', async () => {
    render(<ReportSubmissionForm onSubmit={vi.fn()} role="precursor_regular" />);

    const hoursInput = screen.getByLabelText(/horas de servicio/i);
    expect(hoursInput).toBeInTheDocument();

    await userEvent.clear(hoursInput);
    await userEvent.type(hoursInput, '-10');

    await userEvent.click(screen.getByRole('button', { name: /enviar informe/i }));

    expect(screen.getByText(/las horas no pueden ser negativas/i)).toBeInTheDocument();
  });

  it('para precursores regulares envía las horas ingresadas y notifica a onHoursChange', async () => {
    const handleSubmit = vi.fn();
    const handleHoursChange = vi.fn();
    render(
      <ReportSubmissionForm
        onSubmit={handleSubmit}
        onHoursChange={handleHoursChange}
        role="precursor_regular"
      />
    );

    const hoursInput = screen.getByLabelText(/horas de servicio/i);
    await userEvent.clear(hoursInput);
    await userEvent.type(hoursInput, '52');

    expect(handleHoursChange).toHaveBeenCalledWith(52);

    const bibleStudiesInput = screen.getByLabelText(/cursos bíblicos conducidos/i);
    await userEvent.clear(bibleStudiesInput);
    await userEvent.type(bibleStudiesInput, '4');

    await userEvent.click(screen.getByRole('button', { name: /enviar informe/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      participated: true,
      hours: 52,
      bible_studies: 4,
      notes: '',
    });
  });
});

