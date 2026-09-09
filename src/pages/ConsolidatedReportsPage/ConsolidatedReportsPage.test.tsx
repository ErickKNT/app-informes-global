import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsolidatedReportsPage } from './ConsolidatedReportsPage';

describe('ConsolidatedReportsPage', () => {
  it('renderiza título, filtros, métricas consolidadas, gráfica histórica, tabla S-21 y precursores', () => {
    render(<ConsolidatedReportsPage />);

    expect(screen.getByRole('heading', { name: /reportes y análisis de servicio/i })).toBeInTheDocument();
    expect(screen.getByText(/Secretaría Teocrática · Archivo S-21/i)).toBeInTheDocument();

    // Filtros
    expect(screen.getByLabelText(/seleccionar período/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/seleccionar categoría/i)).toBeInTheDocument();

    // Organismos hijos
    expect(screen.getByText('Promedio Publicadores')).toBeInTheDocument();
    expect(screen.getByText('Evolución Mensual de Horas y Participación')).toBeInTheDocument();
    expect(screen.getByText(/Tabla Consolidada por Meses/i)).toBeInTheDocument();
    expect(screen.getByText('Análisis de Metas de Precursores Regulares')).toBeInTheDocument();
  });

  it('permite cambiar los filtros de período y categoría', async () => {
    render(<ConsolidatedReportsPage />);

    const periodSelect = screen.getByLabelText(/seleccionar período/i);
    await userEvent.selectOptions(periodSelect, '2024-10');
    expect(periodSelect).toHaveValue('2024-10');

    const categorySelect = screen.getByLabelText(/seleccionar categoría/i);
    await userEvent.selectOptions(categorySelect, 'regular_pioneers');
    expect(categorySelect).toHaveValue('regular_pioneers');
  });

  it('ejecuta la acción de exportar informe S-21 y muestra mensaje de éxito', async () => {
    const handleExportS21 = vi.fn();
    render(<ConsolidatedReportsPage onExportS21={handleExportS21} />);

    const exportBtn = screen.getByRole('button', { name: /exportar registro s-21/i });
    await userEvent.click(exportBtn);

    expect(handleExportS21).toHaveBeenCalledTimes(1);

    const confirmation = await screen.findByText(
      /registro canónico s-21-s exportado exitosamente/i
    );
    expect(confirmation).toBeInTheDocument();
  });

  it('ejecuta la acción de resumen mensual (PDF/Excel)', async () => {
    const handleExportPdf = vi.fn();
    render(<ConsolidatedReportsPage onExportPdf={handleExportPdf} />);

    const summaryBtn = screen.getByRole('button', { name: /resumen mensual \(pdf\/excel\)/i });
    await userEvent.click(summaryBtn);

    expect(handleExportPdf).toHaveBeenCalledTimes(1);

    const confirmation = await screen.findByText(
      /resumen mensual generado con éxito en formato pdf\/excel/i
    );
    expect(confirmation).toBeInTheDocument();
  });
});
