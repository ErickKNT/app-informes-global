import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button component', () => {
  it('renderiza el contenido correctamente', () => {
    render(<Button>Guardar Informe</Button>);
    expect(screen.getByRole('button', { name: /guardar informe/i })).toBeInTheDocument();
  });

  it('ejecuta onClick al hacer click', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Enviar</Button>);
    await userEvent.click(screen.getByRole('button', { name: /enviar/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('se deshabilita y previene clicks cuando disabled es true', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Deshabilitado</Button>);
    const button = screen.getByRole('button', { name: /deshabilitado/i });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('muestra estado de carga y aria-busy cuando isLoading es true', () => {
    render(<Button isLoading>Cargando</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.getByRole('status', { name: /cargando/i })).toBeInTheDocument();
  });
});

