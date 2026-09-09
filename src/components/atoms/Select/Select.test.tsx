import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select atom', () => {
  const options = [
    { value: 'all', label: 'Todos los Grupos' },
    { value: 'grp-1', label: 'Grupo 1 - Los Olivos' },
    { value: 'grp-2', label: 'Grupo 2 - Betel' },
  ];

  it('renderiza el valor seleccionado en el trigger', () => {
    render(
      <Select
        value="all"
        onChange={vi.fn()}
        options={options}
        aria-label="Filtrar por grupo"
      />
    );

    expect(screen.getByRole('button', { name: /todos los grupos/i })).toHaveTextContent(
      'Todos los Grupos'
    );
  });

  it('abre el menú desplegable al hacer click en el trigger y muestra las opciones', async () => {
    render(
      <Select
        value="all"
        onChange={vi.fn()}
        options={options}
        aria-label="Filtrar por grupo"
      />
    );

    const trigger = screen.getByRole('button', { name: /todos los grupos/i });
    await userEvent.click(trigger);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: 'Grupo 1 - Los Olivos' })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: 'Grupo 2 - Betel' })).toBeInTheDocument();
  });

  it('llama a onChange al seleccionar una opción y cierra el menú', async () => {
    const handleChange = vi.fn();
    render(
      <Select
        value="all"
        onChange={handleChange}
        options={options}
        aria-label="Filtrar por grupo"
      />
    );

    const trigger = screen.getByRole('button', { name: /todos los grupos/i });
    await userEvent.click(trigger);

    const listbox = screen.getByRole('listbox');
    const option2 = within(listbox).getByRole('option', { name: 'Grupo 2 - Betel' });
    await userEvent.click(option2);

    expect(handleChange).toHaveBeenCalledWith('grp-2');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('cierra el menú al hacer click fuera', async () => {
    render(
      <div>
        <span data-testid="outside">Afuera</span>
        <Select
          value="all"
          onChange={vi.fn()}
          options={options}
          aria-label="Filtrar por grupo"
        />
      </div>
    );

    const trigger = screen.getByRole('button', { name: /todos los grupos/i });
    await userEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('permite cambiar opciones mediante userEvent.selectOptions en el select subyacente', async () => {
    const handleChange = vi.fn();
    render(
      <Select
        value="all"
        onChange={handleChange}
        options={options}
        aria-label="Filtrar por grupo"
      />
    );

    const nativeSelect = screen.getByLabelText(/filtrar por grupo/i, { selector: 'select' });
    await userEvent.selectOptions(nativeSelect, 'grp-1');

    expect(handleChange).toHaveBeenCalledWith('grp-1');
  });
});
