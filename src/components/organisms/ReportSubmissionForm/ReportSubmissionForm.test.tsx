import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportSubmissionForm } from './ReportSubmissionForm';

describe('ReportSubmissionForm organism', () => {
  it('renderiza todos los campos del formulario', () => {
    render(<ReportSubmissionForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/participé en alguna forma/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/horas de servicio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cursos bíblicos conducidos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comentarios o aclaraciones/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar informe/i })).toBeInTheDocument();
  });

  it('valida campos requeridos y muestra errores cuando las horas son inválidas', async () => {
    render(<ReportSubmissionForm onSubmit={vi.fn()} />);

    const hoursInput = screen.getByLabelText(/horas de servicio/i);
    await userEvent.clear(hoursInput);
    await userEvent.type(hoursInput, '-10');

    await userEvent.click(screen.getByRole('button', { name: /enviar informe/i }));

    expect(screen.getByText(/las horas no pueden ser negativas/i)).toBeInTheDocument();
  });

  it('envía los datos cuando el formulario es válido', async () => {
    const handleSubmit = vi.fn();
    render(<ReportSubmissionForm onSubmit={handleSubmit} />);

    const hoursInput = screen.getByLabelText(/horas de servicio/i);
    await userEvent.clear(hoursInput);
    await userEvent.type(hoursInput, '35');

    const bibleStudiesInput = screen.getByLabelText(/cursos bíblicos conducidos/i);
    await userEvent.clear(bibleStudiesInput);
    await userEvent.type(bibleStudiesInput, '3');

    await userEvent.click(screen.getByRole('button', { name: /enviar informe/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      participated: true,
      hours: 35,
      bible_studies: 3,
      notes: '',
    });
  });

  it('notifica cambios en las horas vía onHoursChange para sincronizar el velocímetro', async () => {
    const handleHoursChange = vi.fn();
    render(<ReportSubmissionForm onSubmit={vi.fn()} onHoursChange={handleHoursChange} />);

    const hoursInput = screen.getByLabelText(/horas de servicio/i);
    await userEvent.clear(hoursInput);
    await userEvent.type(hoursInput, '42');

    expect(handleHoursChange).toHaveBeenCalledWith(42);
  });
});

