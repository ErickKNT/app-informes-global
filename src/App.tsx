import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { BookOpen, CheckCircle, ShieldCheck } from 'lucide-react';

export function App() {
  const [reportCount, setReportCount] = useState(0);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-on-surface">
      <div className="max-w-xl w-full bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/40 shadow-sm flex flex-col gap-6 text-center items-center">
        <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
          <BookOpen className="w-7 h-7 text-primary-fixed" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Arquitectura Atomic Design Lista
          </span>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-primary">
            Servicio &amp; Registro
          </h1>
          <p className="text-sm text-on-surface-variant max-w-md mt-1">
            Portal congregacional para la gestión y consolidación mensual de actividad teocrática.
          </p>
        </div>

        <div className="w-full p-4 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs text-outline font-medium block">Estado de Base de Datos</span>
            <span className="text-sm font-semibold text-on-surface flex items-center gap-1.5 mt-0.5">
              <CheckCircle className="w-4 h-4 text-secondary" /> Supabase Configurado
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
            v1.0.0
          </span>
        </div>

        <div className="flex flex-wrap gap-3 justify-center w-full pt-2">
          <Button
            variant="primary"
            onClick={() => setReportCount((prev) => prev + 1)}
          >
            Probar Átomo Botón ({reportCount})
          </Button>
          <Button
            variant="outline"
            onClick={() => setReportCount(0)}
            disabled={reportCount === 0}
          >
            Reiniciar
          </Button>
        </div>
      </div>
    </main>
  );
}

export default App;

