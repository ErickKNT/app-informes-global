import React, { useState } from 'react';
import { AlertBanner } from '@/components/molecules/AlertBanner';
import {
  CongregationKPIs,
  type CongregationKPIsData,
} from '@/components/organisms/CongregationKPIs';
import {
  GroupsOverviewTable,
  type GroupOverviewItem,
} from '@/components/organisms/GroupsOverviewTable';
import { PastoralAlertsCard } from '@/components/organisms/PastoralAlertsCard';
import {
  WhatsAppReminderModal,
  type GroupReminderData,
} from '@/components/organisms/WhatsAppReminderModal';
import { Button } from '@/components/atoms/Button';
import { Calendar, Download } from 'lucide-react';

export interface DashboardPageProps {
  onNavigateToGroup?: (groupId: string) => void;
  onExportS21?: () => void;
}

const DEFAULT_KPIS: CongregationKPIsData = {
  totalHours: 1428,
  previousMonthHours: 1342,
  hoursHistory: [1150, 1220, 1342, 1428],
  reportedPublishers: 84,
  totalPublishers: 98,
  activeStudies: 42,
  newStudiesThisMonth: 3,
  pioneersOnTrack: 14,
  totalPioneers: 16,
};

const DEFAULT_GROUPS: GroupOverviewItem[] = [
  {
    id: 'group-1',
    groupNumber: 1,
    name: 'Grupo 1 - Los Olivos',
    overseerName: 'Carlos Méndez',
    publishersCount: 19,
    reportedCount: 16,
    totalHours: 184,
    bibleStudies: 6,
  },
  {
    id: 'group-2',
    groupNumber: 2,
    name: 'Grupo 2 - Betel',
    overseerName: 'Fernando Ruiz',
    publishersCount: 18,
    reportedCount: 18,
    totalHours: 195,
    bibleStudies: 8,
  },
  {
    id: 'group-3',
    groupNumber: 3,
    name: 'Grupo 3 - Sinaí',
    overseerName: 'Mateo Ramos',
    publishersCount: 21,
    reportedCount: 19,
    totalHours: 210,
    bibleStudies: 10,
  },
  {
    id: 'group-4',
    groupNumber: 4,
    name: 'Grupo 4 - Hermón',
    overseerName: 'Julián Castro',
    publishersCount: 22,
    reportedCount: 17,
    totalHours: 178,
    bibleStudies: 9,
  },
  {
    id: 'group-5',
    groupNumber: 5,
    name: 'Grupo 5 - Galilea',
    overseerName: 'Andrés Vega',
    publishersCount: 18,
    reportedCount: 14,
    totalHours: 161,
    bibleStudies: 9,
  },
];

const DEFAULT_REMINDER_GROUPS: GroupReminderData[] = [
  {
    id: 'group-1',
    groupNumber: 1,
    name: 'Grupo 1 - Los Olivos',
    overseerName: 'Carlos Méndez',
    overseerPhone: '+34 612 889 012',
    publishersCount: 19,
    reportedCount: 16,
  },
  {
    id: 'group-2',
    groupNumber: 2,
    name: 'Grupo 2 - Betel',
    overseerName: 'Fernando Ruiz',
    overseerPhone: '+34 600 111 222',
    publishersCount: 18,
    reportedCount: 18,
  },
  {
    id: 'group-3',
    groupNumber: 3,
    name: 'Grupo 3 - Sinaí',
    overseerName: 'Mateo Ramos',
    overseerPhone: '+34 601 222 333',
    publishersCount: 21,
    reportedCount: 19,
  },
  {
    id: 'group-4',
    groupNumber: 4,
    name: 'Grupo 4 - Hermón',
    overseerName: 'Julián Castro',
    overseerPhone: '+34 602 333 444',
    publishersCount: 22,
    reportedCount: 17,
  },
  {
    id: 'group-5',
    groupNumber: 5,
    name: 'Grupo 5 - Galilea',
    overseerName: 'Andrés Vega',
    overseerPhone: '+34 603 444 555',
    publishersCount: 18,
    reportedCount: 14,
  },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToGroup,
  onExportS21,
}) => {
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Welcome & Administrative Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-outline uppercase tracking-wider">
              Supervisión Mensual
            </span>
            <span className="text-outline-variant">·</span>
            <span className="text-secondary font-semibold">Corte de Informes en Proceso</span>
          </div>
          <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            Bienvenido, David Morales
          </h1>
          <p className="text-xs text-on-surface-variant">
            Congregación El Olivar · Registro Oficial de Actividad Teocrática
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Indicator */}
          <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-surface-container-high shadow-sm text-xs">
            <Calendar className="w-4 h-4 text-primary" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-outline font-semibold uppercase">Período</span>
              <span className="font-bold text-on-surface">Octubre 2024</span>
            </div>
          </div>

          {/* Export Action */}
          <Button
            size="sm"
            variant="outline"
            onClick={onExportS21}
            className="text-xs px-3.5 py-2"
          >
            <Download className="w-3.5 h-3.5 text-outline" />
            <span>Exportar S-21</span>
          </Button>
        </div>
      </div>

      {/* Alerta de Cierre Mensual */}
      <AlertBanner
        daysRemaining={4}
        pendingCount={14}
        isNotifying={false}
        onNotifyOverseers={() => setIsReminderModalOpen(true)}
      />

      {/* KPIs Maestros Congregacionales */}
      <CongregationKPIs data={DEFAULT_KPIS} />

      {/* Grid: 8 columnas Tabla de Grupos + 4 columnas Panel Lateral */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8">
          <GroupsOverviewTable
            groups={DEFAULT_GROUPS}
            onViewGroup={onNavigateToGroup}
          />
        </div>

        <div className="xl:col-span-4">
          <PastoralAlertsCard />
        </div>
      </div>

      {/* Modal de Recordatorios por WhatsApp */}
      <WhatsAppReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        groups={DEFAULT_REMINDER_GROUPS}
        monthName="Octubre 2024"
        deadlineDay={6}
      />
    </div>
  );
};

DashboardPage.displayName = 'DashboardPage';

