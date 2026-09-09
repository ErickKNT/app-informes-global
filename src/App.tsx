import { useState } from 'react';
import { AppLayout, type NavigationPath } from '@/components/templates/AppLayout';
import { MonthlyReportPage } from '@/pages/MonthlyReportPage';
import { Users, BarChart3, LayoutDashboard } from 'lucide-react';

export function App() {
  const [currentPath, setCurrentPath] = useState<NavigationPath>('mi-informe-mensual');

  const renderContent = () => {
    switch (currentPath) {
      case 'mi-informe-mensual':
        return <MonthlyReportPage />;

      case 'panel-general':
        return (
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-container-high text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h2 className="font-headline text-xl font-bold text-primary">Panel General</h2>
            <p className="text-xs text-on-surface-variant max-w-md">
              Módulo de métricas congregacionales, avisos y seguimiento mensual en construcción.
            </p>
          </div>
        );

      case 'grupos-de-servicio':
        return (
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-container-high text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="font-headline text-xl font-bold text-primary">Grupos de Servicio</h2>
            <p className="text-xs text-on-surface-variant max-w-md">
              Módulo de supervisión por grupos de predicación y publicadores en construcción.
            </p>
          </div>
        );

      case 'reportes-consolidados':
        return (
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-container-high text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary-container flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="font-headline text-xl font-bold text-primary">Reportes Consolidados (S-21)</h2>
            <p className="text-xs text-on-surface-variant max-w-md">
              Módulo de archivo canónico S-21 y análisis anual en construcción.
            </p>
          </div>
        );

      default:
        return <MonthlyReportPage />;
    }
  };

  return (
    <AppLayout currentPath={currentPath} onNavigate={setCurrentPath}>
      {renderContent()}
    </AppLayout>
  );
}

export default App;
