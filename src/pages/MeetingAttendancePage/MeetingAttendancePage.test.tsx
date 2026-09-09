import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MeetingAttendancePage } from './MeetingAttendancePage';
import { attendanceService } from '@/services/attendanceService';

describe('MeetingAttendancePage', () => {
  beforeEach(() => {
    attendanceService.resetLocal();
  });

  it('renderiza título, selector de mes, KPIs y tabla de reuniones', () => {
    render(<MeetingAttendancePage />);

    expect(screen.getByRole('heading', { name: /asistencia a las reuniones/i })).toBeInTheDocument();
    expect(screen.getByText(/promedio entre semana/i)).toBeInTheDocument();
    expect(screen.getByText(/promedio fin de semana/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar asistencia/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /exportar asistencia csv/i })).toBeInTheDocument();
  });

  it('abre el modal y permite registrar una nueva asistencia', async () => {
    render(<MeetingAttendancePage />);

    // Esperar a que concluya la carga inicial
    await screen.findByText('81.5');

    const openButton = screen.getByRole('button', { name: /registrar asistencia/i });
    await userEvent.click(openButton);

    expect(screen.getByRole('heading', { name: /registrar asistencia de reunión/i })).toBeInTheDocument();

    const countInput = screen.getByPlaceholderText('Ej. 85');
    await userEvent.clear(countInput);
    await userEvent.type(countInput, '95');

    const saveButton = screen.getByRole('button', { name: /guardar asistencia/i });
    await userEvent.click(saveButton);

    expect(await screen.findByText(/nueva asistencia registrada con éxito/i)).toBeInTheDocument();
  });
});
