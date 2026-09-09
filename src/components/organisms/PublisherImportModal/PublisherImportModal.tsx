import React, { useState, useRef } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';
import {
  csvImportService,
  type ParsedPublisherRow,
} from '@/services/csvImportService';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';

export interface PublisherImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (publishers: ParsedPublisherRow[]) => void;
}

export const PublisherImportModal: React.FC<PublisherImportModalProps> = ({
  isOpen,
  onClose,
  onConfirmImport,
}) => {
  const [parsedRows, setParsedRows] = useState<ParsedPublisherRow[]>([]);
  const [parseErrors, setParseErrors] = useState<{ line: number; message: string }[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const result = csvImportService.parseCsv(text);
        setParsedRows(result.validRows);
        setParseErrors(result.errors);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirm = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsProcessing(false);
    onConfirmImport(parsedRows);
    onClose();
  };

  const handleDownloadTemplate = () => {
    csvImportService.downloadTemplateCsv();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={cn(
          'bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-2xl',
          'w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-surface-container-low border-b border-surface-container-high/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
              <UploadCloud className="w-5 h-5 text-primary-fixed" />
            </div>
            <div className="flex flex-col">
              <h2 id="import-modal-title" className="font-headline text-base font-bold text-on-surface">
                Importación Masiva de Publicadores
              </h2>
              <span className="text-xs text-on-surface-variant font-medium">
                Carga de congregación desde archivo CSV o Excel
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-5">
          {/* Zona de Carga de Archivo */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all',
              fileName
                ? 'border-primary bg-primary/5'
                : 'border-surface-container-high hover:border-primary/50 hover:bg-surface-container-low'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv,text/plain"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Seleccionar archivo CSV"
            />
            <FileSpreadsheet className="w-10 h-10 text-primary mb-2" />
            <span className="text-sm font-bold text-on-surface">
              {fileName ? fileName : 'Selecciona o arrastra tu archivo CSV'}
            </span>
            <span className="text-xs text-on-surface-variant mt-1">
              Archivos delimitados por comas (.csv) con columnas teocráticas
            </span>
          </div>

          {/* Botón Descargar Plantilla */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs">
            <span className="text-on-surface-variant">¿No tienes el formato correcto?</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadTemplate}
              className="text-xs flex items-center gap-1.5 py-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Plantilla CSV</span>
            </Button>
          </div>

          {/* Errores si los hay */}
          {parseErrors.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-error-container/40 border border-error-container text-xs text-error flex flex-col gap-1">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Advertencias encontradas ({parseErrors.length})</span>
              </div>
              <ul className="list-disc list-inside text-[11px] pl-1">
                {parseErrors.slice(0, 3).map((err, idx) => (
                  <li key={idx}>Línea {err.line}: {err.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Previsualización de Registros Válidos */}
          {parsedRows.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>Registros Listos ({parsedRows.length})</span>
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Todo validado
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto rounded-2xl border border-surface-container-high">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-low text-outline font-semibold border-b border-surface-container-high sticky top-0">
                    <tr>
                      <th className="p-2.5">Nombre Completo</th>
                      <th className="p-2.5">Teléfono</th>
                      <th className="p-2.5">Rol</th>
                      <th className="p-2.5">Privilegio</th>
                      <th className="p-2.5 text-center">Grupo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/40 bg-surface-container-lowest">
                    {parsedRows.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low/50">
                        <td className="p-2.5 font-bold text-on-surface">{row.full_name}</td>
                        <td className="p-2.5 text-on-surface-variant font-mono">{row.phone || '—'}</td>
                        <td className="p-2.5 capitalize">{row.role.replace('_', ' ')}</td>
                        <td className="p-2.5 capitalize">{row.privilege.replace('_', ' ')}</td>
                        <td className="p-2.5 text-center font-bold text-primary">{row.groupNumber || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 10 && (
                <span className="text-[11px] text-outline text-center">
                  ... y {parsedRows.length - 10} publicadores más.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancelar
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={parsedRows.length === 0 || isProcessing}
            onClick={handleConfirm}
            className="text-xs flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>
              {isProcessing
                ? 'Importando...'
                : `Importar ${parsedRows.length > 0 ? `${parsedRows.length} Publicadores` : ''}`}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

PublisherImportModal.displayName = 'PublisherImportModal';

