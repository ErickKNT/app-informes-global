import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublisherImportModal } from './PublisherImportModal';
import { csvImportService } from '@/services/csvImportService';

describe('PublisherImportModal organism', () => {
  it('no renderiza nada si isOpen es false', () => {
    const { container } = render(
      <PublisherImportModal isOpen={false} onClose={vi.fn()} onConfirmImport={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza título, selector de archivo y botón de descarga de plantilla', () => {
    render(<PublisherImportModal isOpen={true} onClose={vi.fn()} onConfirmImport={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: /importación masiva de publicadores/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/descargar plantilla csv/i)).toBeInTheDocument();
    expect(screen.getByText(/selecciona o arrastra tu archivo csv/i)).toBeInTheDocument();
  });

  it('llama a downloadTemplateCsv al hacer clic en descargar plantilla', async () => {
    const downloadSpy = vi.spyOn(csvImportService, 'downloadTemplateCsv').mockImplementation(() => {});

    render(<PublisherImportModal isOpen={true} onClose={vi.fn()} onConfirmImport={vi.fn()} />);

    const downloadBtn = screen.getByRole('button', { name: /descargar plantilla csv/i });
    await userEvent.click(downloadBtn);

    expect(downloadSpy).toHaveBeenCalledTimes(1);
    downloadSpy.mockRestore();
  });

  it('procesa el archivo csv seleccionado y muestra la previsualización de publicadores', async () => {
    const onConfirmImport = vi.fn();
    const onClose = vi.fn();

    render(
      <PublisherImportModal
        isOpen={true}
        onClose={onClose}
        onConfirmImport={onConfirmImport}
      />
    );

    const validCsv = 'nombre_completo,telefono,rol,privilegio,grupo\nJuan Pérez,+525511112222,anciano,precursor_regular,1\nMaría Gómez,,publicador_bautizado,ninguno,2';

    const file = new File([validCsv], 'publicadores.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/seleccionar archivo csv/i);

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María Gómez')).toBeInTheDocument();
    });

    expect(screen.getByText('Registros Listos (2)')).toBeInTheDocument();

    const importBtn = screen.getByRole('button', { name: /importar 2 publicadores/i });
    await userEvent.click(importBtn);

    await waitFor(() => {
      expect(onConfirmImport).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ full_name: 'Juan Pérez' }),
          expect.objectContaining({ full_name: 'María Gómez' }),
        ])
      );
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('cierra el modal al pulsar Cancelar o el botón X', async () => {
    const onClose = vi.fn();
    render(<PublisherImportModal isOpen={true} onClose={onClose} onConfirmImport={vi.fn()} />);

    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
