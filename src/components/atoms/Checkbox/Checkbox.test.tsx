import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox atom', () => {
  it('renderiza con label', () => {
    render(<Checkbox label="Participé en el ministerio" />);
    expect(screen.getByLabelText(/participé en el ministerio/i)).toBeInTheDocument();
  });

  it('cambia de estado al hacer click', async () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Participé" onChange={handleChange} />);
    const checkbox = screen.getByLabelText(/participé/i);
    await userEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('respeta estado deshabilitado', async () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Participé" disabled onChange={handleChange} />);
    const checkbox = screen.getByLabelText(/participé/i);
    expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
