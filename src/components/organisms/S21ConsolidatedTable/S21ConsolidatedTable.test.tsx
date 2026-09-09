import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { S21ConsolidatedTable } from './S21ConsolidatedTable';

describe('S21ConsolidatedTable organism', () => {
  it('renderiza título canónico, formato S-21-S y columnas de la tabla', () => {
    render(<S21ConsolidatedTable />);

    expect(
      screen.getByText(/Tabla Consolidada por Meses \(Año de Servicio 2024-2025\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Formato S-21-S')).toBeInTheDocument();

    expect(screen.getByText('Mes de Servicio')).toBeInTheDocument();
    expect(screen.getByText('Pubs. Informaron')).toBeInTheDocument();
    expect(screen.getByText('Prec. Regulares')).toBeInTheDocument();
    expect(screen.getByText('Prec. Auxiliares')).toBeInTheDocument();
    expect(screen.getByText('Horas Totales')).toBeInTheDocument();
    expect(screen.getByText('Cursos Bíblicos')).toBeInTheDocument();
    expect(screen.getByText('Prom. Horas')).toBeInTheDocument();
    expect(screen.getByText('Estado Registro')).toBeInTheDocument();
  });

  it('calcula y muestra el total acumulado correctamente', () => {
    render(<S21ConsolidatedTable />);

    expect(screen.getByText('Septiembre 2024')).toBeInTheDocument();
    expect(screen.getByText('Octubre 2024')).toBeInTheDocument();
    expect(screen.getByText('Cerrado / Auditado')).toBeInTheDocument();
    expect(screen.getByText(/En Proceso \(94%\)/i)).toBeInTheDocument();

    expect(screen.getByText(/Total Acumulado \(2 Meses\)/i)).toBeInTheDocument();
    expect(screen.getByText('3,020 hrs')).toBeInTheDocument();
    expect(screen.getByText('2 / 12 Meses Registrados')).toBeInTheDocument();
  });
});

