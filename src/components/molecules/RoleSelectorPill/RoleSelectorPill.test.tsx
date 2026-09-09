import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleSelectorPill } from './RoleSelectorPill';

describe('RoleSelectorPill molecule', () => {
  it('renderiza las 3 opciones de servicio', () => {
    render(<RoleSelectorPill selectedRole="publicador" onChange={vi.fn()} />);

    expect(screen.getByRole('radio', { name: /publicador/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /p\. auxiliar/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /precursor regular/i })).toBeInTheDocument();
  });

  it('marca la opción seleccionada con aria-checked=true', () => {
    render(<RoleSelectorPill selectedRole="precursor_regular" onChange={vi.fn()} />);

    const regularOption = screen.getByRole('radio', { name: /precursor regular/i });
    const publicadorOption = screen.getByRole('radio', { name: /publicador/i });

    expect(regularOption).toHaveAttribute('aria-checked', 'true');
    expect(publicadorOption).toHaveAttribute('aria-checked', 'false');
  });

  it('llama a onChange con el rol correspondiente al hacer click', async () => {
    const handleChange = vi.fn();
    render(<RoleSelectorPill selectedRole="publicador" onChange={handleChange} />);

    await userEvent.click(screen.getByRole('radio', { name: /p\. auxiliar/i }));
    expect(handleChange).toHaveBeenCalledWith('precursor_auxiliar');
  });
});
