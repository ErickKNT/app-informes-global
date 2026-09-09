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

  // 3-Tier Role-Based Access Control:
  // 1. Secretario / Anciano General: Acceso completo a las 6 áreas
  // 2. Encargado de Grupo: Acceso a su informe personal y a la gestión de su grupo asignado
  // 3. Publicador: Acceso exclusivo a "Mi Informe Mensual"
  const isSecretario = user.role === 'secretario';
  const isEncargado =
    !isSecretario &&
    (user.role === 'anciano' ||
      user.role === 'siervo_ministerial' ||
      user.id === 'usr-encargado-1' ||
      user.full_name.toLowerCase().includes('carlos'));

  const allowedPaths: NavigationPath[] = isSecretario
    ? [
        'panel-general',
        'mi-informe-mensual',
        'grupos-de-servicio',
        'asistencia-reuniones',
        'reportes-consolidados',
        'tarjetas-publicador',
      ]
    : isEncargado
    ? ['mi-informe-mensual', 'grupos-de-servicio']
    : ['mi-informe-mensual'];

  // Route Guard: garantizar que la ruta actual esté autorizada para el rol activo
  const activePath: NavigationPath = allowedPaths.includes(currentPath)
    ? currentPath
    : allowedPaths[0] ?? 'mi-informe-mensual';

  const roleFormatted = isSecretario
    ? 'Secretario / Anciano General'
    : isEncargado
    ? 'Encargado de Grupo · Anciano'
    : 'Publicador de Congregación';

  const renderContent = () => {
    switch (activePath) {
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
        return <ServiceGroupsPage currentUser={user} />;

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
      currentPath={activePath}
      allowedPaths={allowedPaths}
      onNavigate={(path) => {
        if (allowedPaths.includes(path)) {
          setCurrentPath(path);
        }
      }}
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
