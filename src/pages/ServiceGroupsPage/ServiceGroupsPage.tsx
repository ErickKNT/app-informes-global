import React, { useState, useMemo } from 'react';
import { cn } from '@/utils/cn';
import {
  GroupSupervisorsCard,
  type SupervisorInfo,
} from '@/components/organisms/GroupSupervisorsCard';
import { GroupMetricsCards } from '@/components/organisms/GroupMetricsCards';
import {
  PublishersTable,
  type PublisherListItem,
} from '@/components/organisms/PublishersTable';
import { AssistedReportModal } from '@/components/organisms/AssistedReportModal';
import type { MonthlyReportFormData } from '@/schemas/monthlyReportSchema';
import { Users2 } from 'lucide-react';

interface GroupData {
  id: string;
  name: string;
  overseer: SupervisorInfo;
  assistant: SupervisorInfo;
  location: string;
  schedule: string;
  publishers: PublisherListItem[];
}

const INITIAL_GROUPS: GroupData[] = [
  {
    id: 'group-1',
    name: 'Grupo 1 - Los Olivos',
    overseer: {
      name: 'Carlos Méndez',
      role: 'Encargado de Grupo · Anciano',
    },
    assistant: {
      name: 'Roberto Silva',
      role: 'Auxiliar de Grupo · Siervo Min.',
    },
    location: 'Salón B · Zona Norte',
    schedule: 'Sábados 09:30 AM',
    publishers: [
      {
        id: 'pub-1',
        name: 'Carlos Méndez',
        phone: '+34 612 889 012',
        role: 'anciano',
        privilege: 'precursor_regular',
        hasReported: true,
        hours: 54,
        bibleStudies: 4,
      },
      {
        id: 'pub-2',
        name: 'Roberto Silva',
        phone: '+34 634 990 123',
        role: 'siervo_ministerial',
        privilege: 'publicador',
        hasReported: true,
        hours: 14,
        bibleStudies: 1,
      },
      {
        id: 'pub-3',
        name: 'Ana María Gómez',
        phone: '+34 655 432 109',
        role: 'publicador',
        privilege: 'precursor_regular',
        hasReported: true,
        hours: 50,
        bibleStudies: 3,
      },
      {
        id: 'pub-4',
        name: 'Mateo González',
        phone: '+34 622 114 556',
        role: 'publicador',
        privilege: 'precursor_auxiliar',
        hasReported: true,
        hours: 32,
        bibleStudies: 2,
      },
      {
        id: 'pub-5',
        name: 'Daniel Castillo',
        phone: '+34 602 441 876',
        role: 'publicador',
        privilege: 'publicador',
        hasReported: false,
        hours: null,
        bibleStudies: null,
      },
      {
        id: 'pub-6',
        name: 'Lucía Morales',
        phone: '+34 611 223 344',
        role: 'publicador',
        privilege: 'publicador',
        hasReported: false,
        hours: null,
        bibleStudies: null,
      },
    ],
  },
  {
    id: 'group-2',
    name: 'Grupo 2 - Betel',
    overseer: {
      name: 'Fernando Ruiz',
      role: 'Encargado de Grupo · Anciano',
    },
    assistant: {
      name: 'Jorge Delgado',
      role: 'Auxiliar de Grupo · Siervo Min.',
    },
    location: 'Salón Principal',
    schedule: 'Sábados 09:30 AM',
    publishers: [
      {
        id: 'pub-201',
        name: 'Fernando Ruiz',
        phone: '+34 677 889 900',
        role: 'anciano',
        privilege: 'publicador',
        hasReported: true,
        hours: 16,
        bibleStudies: 2,
      },
      {
        id: 'pub-202',
        name: 'Lucas Silva',
        phone: '+34 688 776 655',
        role: 'publicador',
        privilege: 'precursor_regular',
        hasReported: true,
        hours: 48,
        bibleStudies: 4,
      },
      {
        id: 'pub-203',
        name: 'Beatriz Peña',
        phone: '+34 699 001 122',
        role: 'publicador',
        privilege: 'publicador',
        hasReported: false,
        hours: null,
        bibleStudies: null,
      },
    ],
  },
];

export const ServiceGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<GroupData[]>(INITIAL_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(INITIAL_GROUPS[0]?.id ?? 'group-1');
  const [selectedPublisherForModal, setSelectedPublisherForModal] = useState<PublisherListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const activeGroup = useMemo(() => {
    return groups.find((g) => g.id === selectedGroupId) || groups[0]!;
  }, [groups, selectedGroupId]);

  const activeMetrics = useMemo(() => {
    const totalPublishers = activeGroup.publishers.length;
    const reported = activeGroup.publishers.filter((p) => p.hasReported);
    const reportedPublishers = reported.length;
    const totalHours = reported.reduce((acc, p) => acc + (p.hours || 0), 0);
    const totalBibleStudies = reported.reduce((acc, p) => acc + (p.bibleStudies || 0), 0);

    return {
      totalPublishers,
      reportedPublishers,
      totalHours,
      totalBibleStudies,
    };
  }, [activeGroup]);

  const handleOpenRegisterModal = (publisher: PublisherListItem) => {
    setSelectedPublisherForModal(publisher);
    setIsModalOpen(true);
  };

  const handleSaveAssistedReport = (publisherId: string, data: MonthlyReportFormData) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id !== activeGroup.id) return g;
        return {
          ...g,
          publishers: g.publishers.map((p) => {
            if (p.id !== publisherId) return p;
            return {
              ...p,
              hasReported: true,
              hours: data.hours,
              bibleStudies: data.bible_studies,
            };
          }),
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner Contextual */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
            <Users2 className="w-4 h-4" />
            <span>Organización Territorial y Supervisión</span>
          </div>
          <h1 className="font-headline text-2xl md:text-3xl text-primary font-extrabold tracking-tight">
            Grupos de Predicación y Servicio
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl">
            Seguimiento teocrático y reporte de actividad mensual por grupos congregacionales asignados.
          </p>
        </div>
      </div>

      {/* Selector Horizontal de Grupos */}
      <div className="w-full overflow-x-auto pb-1">
        <div className="inline-flex items-center gap-2 p-1.5 bg-surface-container-low border border-surface-container-high rounded-2xl">
          {groups.map((group) => {
            const isSelected = group.id === selectedGroupId;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroupId(group.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all select-none',
                  isSelected
                    ? 'bg-surface-container-lowest text-primary shadow-sm border border-surface-container-high'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50'
                )}
              >
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    isSelected ? 'bg-secondary' : 'bg-outline-variant'
                  )}
                />
                <span>{group.name}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-primary text-[10px]">
                  {group.publishers.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel Superior del Grupo: Supervisión Pastoral + Métricas */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-4">
          <GroupSupervisorsCard
            groupName={activeGroup.name}
            overseer={activeGroup.overseer}
            assistant={activeGroup.assistant}
            location={activeGroup.location}
            schedule={activeGroup.schedule}
          />
        </div>
        <div className="xl:col-span-8 flex items-center">
          <GroupMetricsCards metrics={activeMetrics} />
        </div>
      </div>

      {/* Tabla de Publicadores del Grupo */}
      <PublishersTable
        publishers={activeGroup.publishers}
        onRegisterReport={handleOpenRegisterModal}
      />

      {/* Modal de Registro Asistido */}
      <AssistedReportModal
        publisher={selectedPublisherForModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitReport={handleSaveAssistedReport}
      />
    </div>
  );
};

ServiceGroupsPage.displayName = 'ServiceGroupsPage';

