import { useState } from 'react';
import { AppLayout, type NavigationPath } from '@/components/templates/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { MonthlyReportPage } from '@/pages/MonthlyReportPage';
import { ServiceGroupsPage } from '@/pages/ServiceGroupsPage';
import { BarChart3 } from 'lucide-react';

export function App() {
  const [currentPath, setCurrentPath] = useState<NavigationPath>('panel-general');

  const renderContent = () => {
    switch (currentPath) {
      case 'panel-general':
        return (
          <DashboardPage
            onNavigateToGroup={() => setCurrentPath('grupos-de-servicio')}
            onExportS21={() => setCurrentPath('reportes-consolidados')}
          />
        );

      case 'mi-informe-mensual':
        return <MonthlyReportPage />;

      case 'grupos-de-servicio':
        return <ServiceGroupsPage />;

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
        return <DashboardPage />;
    }
  };

  return (
    <AppLayout currentPath={currentPath} onNavigate={setCurrentPath}>
      {renderContent()}
    </AppLayout>
  );
}

export default App;
