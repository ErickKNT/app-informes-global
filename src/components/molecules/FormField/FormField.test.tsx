import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';
import { Input } from '@/components/atoms/Input';

describe('FormField molecule', () => {
  it('renderiza etiqueta y control hijo', () => {
    render(
      <FormField id="hours" label="Horas del Mes" required>
        <Input id="hours" />
      </FormField>
    );

    expect(screen.getByLabelText(/horas del mes/i)).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando se provee', () => {
    render(
      <FormField id="hours" label="Horas" error="El valor debe ser mayor o igual a 0">
        <Input id="hours" hasError />
      </FormField>
    );

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(/el valor debe ser mayor o igual a 0/i);
  });

  it('muestra texto de ayuda cuando no hay error', () => {
    render(
      <FormField id="hours" label="Horas" hint="Máximo 3 dígitos">
        <Input id="hours" />
      </FormField>
    );

    expect(screen.getByText('Máximo 3 dígitos')).toBeInTheDocument();
  });
});
