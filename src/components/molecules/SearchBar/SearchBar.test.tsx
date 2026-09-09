import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar molecule', () => {
  it('renderiza con placeholder y valor inicial', () => {
    render(<SearchBar value="Carlos" onChange={vi.fn()} placeholder="Buscar publicador..." />);
    expect(screen.getByPlaceholderText('Buscar publicador...')).toHaveValue('Carlos');
  });

  it('llama a onChange cuando se escribe', async () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} placeholder="Buscar..." />);
    const input = screen.getByPlaceholderText('Buscar...');
    await userEvent.type(input, 'M');
    expect(handleChange).toHaveBeenCalledWith('M');
  });

  it('limpia el texto al pulsar el botón de borrar', async () => {
    const handleChange = vi.fn();
    render(<SearchBar value="Daniel" onChange={handleChange} placeholder="Buscar..." />);
    const clearButton = screen.getByRole('button', { name: /limpiar búsqueda/i });
    await userEvent.click(clearButton);
    expect(handleChange).toHaveBeenCalledWith('');
  });
});
