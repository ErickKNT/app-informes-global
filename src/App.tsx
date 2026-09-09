import { useState } from 'react';
import { AppLayout, type NavigationPath } from '@/components/templates/AppLayout';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MonthlyReportPage } from '@/pages/MonthlyReportPage';
import { ServiceGroupsPage } from '@/pages/ServiceGroupsPage';
import { ConsolidatedReportsPage } from '@/pages/ConsolidatedReportsPage';
import { PublisherCardsPage } from '@/pages/PublisherCardsPage';
import { MeetingAttendancePage } from '@/pages/MeetingAttendancePage';

function AuthenticatedApp() {
  const { user, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState<NavigationPath>('panel-general');

  if (!user) {
    return <LoginPage />;
  }

  const roleFormatted =
    user.role === 'secretario'
      ? 'Secretario / Anciano'
      : user.role === 'anciano'
      ? 'Anciano de Congregación'
      : user.role === 'siervo_ministerial'
      ? 'Siervo Ministerial'
      : 'Publicador de Congregación';

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

      case 'asistencia-reuniones':
        return <MeetingAttendancePage />;

      case 'reportes-consolidados':
        return <ConsolidatedReportsPage />;

      case 'tarjetas-publicador':
        return <PublisherCardsPage />;

      default:
        return (
          <DashboardPage
            onNavigateToGroup={() => setCurrentPath('grupos-de-servicio')}
            onExportS21={() => setCurrentPath('reportes-consolidados')}
          />
        );
    }
  };

  return (
    <AppLayout
      currentPath={currentPath}
      onNavigate={setCurrentPath}
      userName={user.full_name}
      userRole={roleFormatted}
      onLogout={logout}
      isLiveSync={true}
    >
      {renderContent()}
    </AppLayout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
