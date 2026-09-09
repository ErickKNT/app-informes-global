import { useState } from 'react';
import { AppLayout, type NavigationPath } from '@/components/templates/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { MonthlyReportPage } from '@/pages/MonthlyReportPage';
import { ServiceGroupsPage } from '@/pages/ServiceGroupsPage';
import { ConsolidatedReportsPage } from '@/pages/ConsolidatedReportsPage';

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
        return <ConsolidatedReportsPage />;

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
