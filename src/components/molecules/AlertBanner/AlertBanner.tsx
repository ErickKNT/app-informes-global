import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';
import { Timer, Send } from 'lucide-react';

export interface AlertBannerProps {
  daysRemaining: number;
  pendingCount: number;
  onNotifyOverseers?: () => void;
  isNotifying?: boolean;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  daysRemaining,
  pendingCount,
  onNotifyOverseers,
  isNotifying = false,
  className,
}) => {
  return (
    <section
      aria-label="Aviso de cierre de ciclo mensual"
      className={cn(
        'relative overflow-hidden bg-surface-container-low rounded-2xl p-5 border border-surface-container-high shadow-sm',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
            <Timer className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline text-sm font-bold text-on-surface">
                Cierre oficial de ciclo mensual
              </span>
              <span className="px-2 py-0.5 bg-error-container text-on-error-container rounded-full text-[10px] font-bold uppercase tracking-wider">
                Prioritario
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Faltan <strong className="text-primary font-bold">{daysRemaining} días</strong> para el cierre mensual. Hay{' '}
              <strong className="text-error font-bold">{pendingCount} publicadores</strong> que aún no han entregado su informe.
            </p>
          </div>
        </div>

        {onNotifyOverseers && (
          <div className="flex items-center shrink-0">
            <Button
              size="sm"
              variant="primary"
              isLoading={isNotifying}
              onClick={onNotifyOverseers}
              className="text-xs px-3.5 py-2 shadow-sm w-full sm:w-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Aviso a Encargados</span>
            </Button>
          </div>
        )}
      </div>

      {/* Acento gráfico de fondo sutil */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-surface-container-highest/50 rounded-full blur-2xl pointer-events-none" />
    </section>
  );
};

AlertBanner.displayName = 'AlertBanner';

