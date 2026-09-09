import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input atom', () => {
  it('renderiza correctamente con placeholder', () => {
    render(<Input placeholder="Ingresa horas..." />);
    expect(screen.getByPlaceholderText('Ingresa horas...')).toBeInTheDocument();
  });

  it('permite ingresar texto y llama a onChange', async () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} aria-label="Horas" />);
    const input = screen.getByLabelText('Horas');
    await userEvent.type(input, '45');
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('45');
  });

  it('muestra sufijo de unidad cuando se proporciona', () => {
    render(<Input suffix="hrs" aria-label="Horas" />);
    expect(screen.getByText('hrs')).toBeInTheDocument();
  });

  it('aplica aria-invalid y estilos de error cuando hasError es true', () => {
    render(<Input hasError aria-label="Horas" />);
    const input = screen.getByLabelText('Horas');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('border-error');
  });

  it('se deshabilita correctamente', () => {
    render(<Input disabled aria-label="Horas" />);
    expect(screen.getByLabelText('Horas')).toBeDisabled();
  });
});
