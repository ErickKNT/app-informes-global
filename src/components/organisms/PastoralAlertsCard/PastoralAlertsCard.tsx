import React from 'react';
import { cn } from '@/utils/cn';
import {
  BellRing,
  Megaphone,
  FileText,
  Download,
  Calendar,
  Flag,
} from 'lucide-react';

export interface PendingRequest {
  id: string;
  publisherName: string;
  groupLabel: string;
  type: string;
  description: string;
}

export interface ServiceNotice {
  id: string;
  title: string;
  description: string;
  dateInfo?: string;
  location?: string;
}

export interface PastoralAlertsCardProps {
  requests?: PendingRequest[];
  notices?: ServiceNotice[];
  onReviewRequest?: (requestId: string) => void;
  className?: string;
}

export const PastoralAlertsCard: React.FC<PastoralAlertsCardProps> = ({
  requests = [
    {
      id: 'req-1',
      publisherName: 'Elena Valdés',
      groupLabel: 'Grupo 4',
      type: 'Solicitud P. Aux.',
      description: 'Solicitud de 30 horas para el próximo mes pendiente de revisión por el comité.',
    },
  ],
  notices = [
    {
      id: 'notice-1',
      title: 'Reunión de Predicación de Fin de Semana',
      description: 'Reunión centralizada en el Salón del Reino a las 09:30 AM. Se cubrirán manzanas periféricas.',
      dateInfo: 'Sábado · 09:30 AM',
      location: 'Salón Principal',
    },
  ],
  onReviewRequest,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-5 w-full', className)}>
      {/* Sección 1: Alertas y Solicitudes */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-secondary" />
          <h3 className="font-headline text-sm font-bold text-on-surface">
            Atención y Solicitudes
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">
                  {req.publisherName} ({req.groupLabel})
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">
                  {req.type}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                {req.description}
              </p>
              {onReviewRequest && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => onReviewRequest(req.id)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Revisar solicitud
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sección 2: Avisos Teocráticos */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-primary" />
          <h3 className="font-headline text-sm font-bold text-on-surface">
            Avisos de Servicio
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-1.5"
            >
              <span className="text-xs font-bold text-primary">
                {notice.title}
              </span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                {notice.description}
              </p>
              {(notice.dateInfo || notice.location) && (
                <div className="flex items-center justify-between pt-2 border-t border-surface-container-high text-[11px] text-on-surface-variant">
                  {notice.dateInfo && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-outline" />
                      {notice.dateInfo}
                    </span>
                  )}
                  {notice.location && (
                    <span className="font-semibold text-secondary">{notice.location}</span>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Meta del Año de Servicio */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-tertiary-container text-xs font-bold">
              <Flag className="w-3.5 h-3.5" />
              <span>Año de Servicio 2024-2025</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Meta congregacional: Aumentar un 15% los cursos bíblicos conducidos sistemáticamente.
            </p>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: '84%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Sección 3: Formatos Oficiales */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-sm flex flex-col gap-3">
        <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
          Formatos y Formularios Oficiales
        </span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-surface-container-high">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-on-surface">
                Informe Mensual de Congregación (S-1)
              </span>
            </div>
            <Download className="w-4 h-4 text-outline" />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-surface-container-high">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-on-surface">
                Registro de Asistencia a Reuniones (S-88)
              </span>
            </div>
            <Download className="w-4 h-4 text-outline" />
          </div>
        </div>
      </div>
    </div>
  );
};

PastoralAlertsCard.displayName = 'PastoralAlertsCard';
