import React from 'react';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BarChart3,
  Church,
  ShieldCheck,
  User,
} from 'lucide-react';

export type NavigationPath =
  | 'panel-general'
  | 'mi-informe-mensual'
  | 'grupos-de-servicio'
  | 'reportes-consolidados';

export interface AppLayoutProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  congregationName?: string;
  activeServiceYear?: string;
  activeMonthName?: string;
  userName?: string;
  userRole?: string;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPath,
  onNavigate,
  congregationName = 'Congregación El Olivar',
  activeServiceYear = 'Año de Servicio 2024-2025',
  activeMonthName = 'Octubre 2024',
  userName = 'David Morales',
  userRole = 'Secretario / Anciano',
  children,
}) => {
  const navItems: Array<{ path: NavigationPath; label: string; icon: React.ElementType }> = [
    { path: 'panel-general', label: 'Panel General', icon: LayoutDashboard },
    { path: 'mi-informe-mensual', label: 'Mi Informe Mensual', icon: CalendarCheck },
    { path: 'grupos-de-servicio', label: 'Grupos de Servicio', icon: Users },
    { path: 'reportes-consolidados', label: 'Reportes Consolidados', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Sidebar fijo para escritorio */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-surface-container-high z-40 hidden md:flex flex-col justify-between shadow-[1px_0_8px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3 px-5 py-6 bg-surface-container-low/70 border-b border-surface-container-high/60">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
              <Church className="w-5 h-5 text-primary-fixed" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-sm font-bold text-primary tracking-tight leading-tight">
                Servicio &amp; Registro
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">
                Portal Congregacional
              </span>
            </div>
          </div>

          {/* Menú de navegación */}
          <div className="px-3 pt-5">
            <span className="px-3 text-[11px] font-semibold text-outline uppercase tracking-wider block mb-2">
              Supervisión Teocrática
            </span>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left w-full select-none',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                      isActive
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', isActive ? 'text-on-primary' : 'text-outline')} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container-high">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-outline">
                Versión del Sistema
              </span>
              <span className="text-xs text-primary font-bold">v1.0.0 Estable</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-secondary" />
          </div>
        </div>
      </aside>

      {/* Área del Viewport Principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Header Superior Fijo */}
        <header className="sticky top-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container-high z-30 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-container-high text-xs">
              <Church className="w-4 h-4 text-primary" />
              <span className="font-semibold text-on-surface">{congregationName}</span>
              <span className="text-outline-variant">·</span>
              <span className="text-on-surface-variant hidden sm:inline">{activeServiceYear}</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-secondary-container/40 text-on-secondary-container px-3 py-1.5 rounded-full border border-secondary-container text-xs">
              <CalendarCheck className="w-3.5 h-3.5 text-secondary" />
              <span className="font-semibold">Mes Activo: {activeMonthName}</span>
            </div>
          </div>

          {/* Perfil del Usuario */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-xs ring-2 ring-surface-container-high">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-on-surface leading-tight">{userName}</span>
              <span className="text-[11px] text-secondary font-semibold">{userRole}</span>
            </div>
          </div>
        </header>

        {/* Canvas Dinámico de Contenido */}
        <main className="flex-1 p-4 md:p-8 bg-background max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

AppLayout.displayName = 'AppLayout';
