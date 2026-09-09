import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BarChart3,
  Building2,
  ShieldCheck,
  User,
  Contact,
  ClipboardList,
  Menu,
  X,
  LogOut,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export type NavigationPath =
  | 'panel-general'
  | 'mi-informe-mensual'
  | 'grupos-de-servicio'
  | 'reportes-consolidados'
  | 'tarjetas-publicador'
  | 'asistencia-reuniones';

export interface AppLayoutProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  congregationName?: string;
  activeServiceYear?: string;
  activeMonthName?: string;
  userName?: string;
  userRole?: string;
  isLiveSync?: boolean;
  onLogout?: () => void;
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
  isLiveSync = true,
  onLogout,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: Array<{ path: NavigationPath; label: string; icon: React.ElementType }> = [
    { path: 'panel-general', label: 'Panel General', icon: LayoutDashboard },
    { path: 'mi-informe-mensual', label: 'Mi Informe Mensual', icon: CalendarCheck },
    { path: 'grupos-de-servicio', label: 'Grupos de Servicio', icon: Users },
    { path: 'asistencia-reuniones', label: 'Asistencia a Reuniones', icon: ClipboardList },
    { path: 'reportes-consolidados', label: 'Reportes Consolidados', icon: BarChart3 },
    { path: 'tarjetas-publicador', label: 'Tarjetas de Publicador', icon: Contact },
  ];

  const handleNavClick = (path: NavigationPath) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Sidebar fijo para escritorio (oculto en impresión) */}
      <aside className="no-print fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-surface-container-high z-40 hidden md:flex flex-col justify-between shadow-[1px_0_8px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3 px-5 py-6 bg-surface-container-low/70 border-b border-surface-container-high/60">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-primary-fixed" />
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
                    onClick={() => handleNavClick(item.path)}
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

        {/* Footer del Sidebar Escritorio */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex flex-col gap-3">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-outline flex items-center gap-1">
                {isLiveSync ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    <span>En línea</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                    <span>Modo local</span>
                  </>
                )}
              </span>
              <span className="text-xs text-primary font-bold">v1.0.0 Estable</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-secondary" />
          </div>

          {onLogout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 text-xs py-2 hover:bg-error-container/20 hover:text-error hover:border-error/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </Button>
          )}
        </div>
      </aside>

      {/* Drawer Móvil Deslizante (oculto en impresión) */}
      {isMobileMenuOpen && (
        <div
          className="no-print fixed inset-0 z-50 md:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación móvil"
        >
          {/* Backdrop difuminado */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Panel lateral móvil */}
          <div className="relative w-4/5 max-w-xs bg-surface-container-lowest h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="flex flex-col">
              {/* Header del Drawer Móvil */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-surface-container-high/70 bg-surface-container-low/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
                    <Building2 className="w-5 h-5 text-primary-fixed" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline text-xs font-bold text-primary tracking-tight">
                      Servicio &amp; Registro
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      Portal Teocrático
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Perfil en Drawer */}
              <div className="px-5 py-4 border-b border-surface-container-high/40 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-primary/20">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface leading-tight">{userName}</span>
                  <span className="text-[10px] text-secondary font-semibold">{userRole}</span>
                </div>
              </div>

              {/* Menú de enlaces móvil */}
              <div className="px-3 py-4">
                <span className="px-3 text-[10px] font-semibold text-outline uppercase tracking-wider block mb-2">
                  Navegación
                </span>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;

                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => handleNavClick(item.path)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all text-left w-full select-none',
                          isActive
                            ? 'bg-primary-container text-on-primary shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
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

            {/* Footer Móvil */}
            <div className="p-4 border-t border-surface-container-high bg-surface-container-low/50 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
                <span>{congregationName}</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <Radio className="w-3 h-3" /> En línea
                </span>
              </div>
              {onLogout && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs py-2 hover:bg-error-container/20 hover:text-error hover:border-error/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Área del Viewport Principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Header Superior Fijo (oculto en impresión) */}
        <header className="no-print sticky top-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container-high z-30 flex items-center justify-between px-3 sm:px-4 md:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón hamburguesa móvil */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 bg-surface-container-low px-2.5 sm:px-3 py-1.5 rounded-xl border border-surface-container-high text-xs">
              <Building2 className="w-4 h-4 text-primary shrink-0" />
              <span className="font-semibold text-on-surface truncate max-w-[130px] sm:max-w-none">
                {congregationName}
              </span>
              <span className="text-outline-variant hidden xs:inline">·</span>
              <span className="text-on-surface-variant hidden sm:inline">{activeServiceYear}</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-secondary-container/40 text-on-secondary-container px-3 py-1.5 rounded-full border border-secondary-container text-xs">
              <CalendarCheck className="w-3.5 h-3.5 text-secondary" />
              <span className="font-semibold">Mes Activo: {activeMonthName}</span>
            </div>
          </div>

          {/* Perfil del Usuario Escritorio */}
          <div className="flex items-center gap-2 sm:gap-3">
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
        <main className="flex-1 p-3 sm:p-4 md:p-8 bg-background max-w-7xl w-full mx-auto print:p-0 print:m-0 print:max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
};

AppLayout.displayName = 'AppLayout';
