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
import { GroupFormModal } from '@/components/organisms/GroupFormModal';
import { DeleteGroupModal } from '@/components/organisms/DeleteGroupModal';
import { Button } from '@/components/atoms/Button';
import type { MonthlyReportFormData } from '@/schemas/monthlyReportSchema';
import type { ServiceGroupInsert, ServiceGroup, Profile } from '@/types/database.types';
import { Users2, PlusCircle, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

interface GroupData {
  id: string;
  group_number: number;
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
    group_number: 1,
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
    group_number: 2,
    name: 'Grupo 2 - Betel',
    overseer: {
      name: 'Fernando Ruiz',
      role: 'Encargado de Grupo · Anciano',
    },
    assistant: {
      name: 'Héctor Soto',
      role: 'Auxiliar de Grupo · Siervo Min.',
    },
    location: 'Av. Primavera 405 (Salón Auxiliar B)',
    schedule: 'Sábados 09:30 AM',
    publishers: [
      {
        id: 'pub-201',
        name: 'Fernando Ruiz',
        phone: '+34 600 111 222',
        role: 'anciano',
        privilege: 'publicador',
        hasReported: true,
        hours: 18,
        bibleStudies: 2,
      },
      {
        id: 'pub-202',
        name: 'Héctor Soto',
        phone: '+34 600 333 444',
        role: 'siervo_ministerial',
        privilege: 'precursor_auxiliar',
        hasReported: true,
        hours: 30,
        bibleStudies: 3,
      },
      {
        id: 'pub-203',
        name: 'Lucas Silva',
        phone: '+34 600 555 666',
        role: 'publicador',
        privilege: 'precursor_regular',
        hasReported: true,
        hours: 45,
        bibleStudies: 4,
      },
      {
        id: 'pub-204',
        name: 'Rebeca Flores',
        phone: '+34 600 777 888',
        role: 'publicador',
        privilege: 'precursor_regular',
        hasReported: true,
        hours: 50,
        bibleStudies: 4,
      },
    ],
  },
  {
    id: 'group-3',
    group_number: 3,
    name: 'Grupo 3 - Sinaí',
    overseer: {
      name: 'Mateo Ramos',
      role: 'Encargado de Grupo · Anciano',
    },
    assistant: {
      name: 'Daniel Ortiz',
      role: 'Auxiliar de Grupo · Siervo Min.',
    },
    location: 'Calle Sinaí 8',
    schedule: 'Domingos 09:00 AM',
    publishers: [
      {
        id: 'pub-301',
        name: 'Mateo Ramos',
        phone: '+34 601 222 333',
        role: 'anciano',
        privilege: 'publicador',
        hasReported: true,
        hours: 20,
        bibleStudies: 3,
      },
      {
        id: 'pub-302',
        name: 'Carmen Ramírez',
        phone: '+34 601 444 555',
        role: 'publicador',
        privilege: 'precursor_regular',
        hasReported: true,
        hours: 50,
        bibleStudies: 5,
      },
    ],
  },
  {
    id: 'group-4',
    group_number: 4,
    name: 'Grupo 4 - Hermón',
    overseer: {
      name: 'Julián Castro',
      role: 'Encargado de Grupo · Anciano',
    },
    assistant: {
      name: 'Esteban Vega',
      role: 'Auxiliar de Grupo · Siervo Min.',
    },
    location: 'Av. Las Torres 112',
    schedule: 'Sábados 09:00 AM',
    publishers: [
      {
        id: 'pub-401',
        name: 'Elena Torres',
        phone: '+34 602 666 777',
        role: 'publicador',
        privilege: 'precursor_auxiliar',
        hasReported: true,
        hours: 35,
        bibleStudies: 3,
      },
    ],
  },
  {
    id: 'group-5',
    group_number: 5,
    name: 'Grupo 5 - Galilea',
    overseer: {
      name: 'Andrés Vega',
      role: 'Encargado de Grupo · Anciano',
    },
    assistant: {
      name: 'Samuel Cruz',
      role: 'Auxiliar de Grupo · Siervo Min.',
    },
    location: 'Calle Galilea 4',
    schedule: 'Sábados 09:30 AM',
    publishers: [
      {
        id: 'pub-501',
        name: 'Andrés Vega',
        phone: '+34 603 888 999',
        role: 'anciano',
        privilege: 'publicador',
        hasReported: true,
        hours: 15,
        bibleStudies: 2,
      },
    ],
  },
];

export const ServiceGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<GroupData[]>(INITIAL_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(INITIAL_GROUPS[0]?.id || 'group-1');
  const [selectedPublisherForModal, setSelectedPublisherForModal] =
    useState<PublisherListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Administrative Modals
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const activeGroup: GroupData = useMemo(() => {
    return groups.find((g) => g.id === selectedGroupId) ?? groups[0] ?? INITIAL_GROUPS[0]!;
  }, [groups, selectedGroupId]);

  const activeMetrics = useMemo(() => {
    const totalPublishers = activeGroup.publishers.length;
    const reportedPublishers = activeGroup.publishers.filter((p) => p.hasReported).length;
    const totalHours = activeGroup.publishers.reduce(
      (acc, p) => acc + (p.hours !== null ? p.hours : 0),
      0
    );
    const totalBibleStudies = activeGroup.publishers.reduce(
      (acc, p) => acc + (p.bibleStudies !== null ? p.bibleStudies : 0),
      0
    );

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
    showFeedback('Informe asistido registrado correctamente.');
  };

  const handleCreateGroup = (data: ServiceGroupInsert) => {
    const newGroup: GroupData = {
      id: `group-${Date.now()}`,
      group_number: data.group_number,
      name: data.name,
      overseer: {
        name: 'Por asignar',
        role: 'Encargado de Grupo · Anciano',
      },
      assistant: {
        name: 'Por asignar',
        role: 'Auxiliar de Grupo · Siervo Min.',
      },
      location: data.meeting_location || 'Por definir',
      schedule: data.meeting_schedule || 'Sábados 9:00 AM',
      publishers: [],
    };

    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroupId(newGroup.id);
    showFeedback(`Grupo "${data.name}" creado con éxito.`);
  };

  const handleEditGroup = (data: ServiceGroupInsert) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== activeGroup.id) return g;
        return {
          ...g,
          name: data.name,
          group_number: data.group_number,
          location: data.meeting_location || g.location,
          schedule: data.meeting_schedule || g.schedule,
        };
      })
    );
    showFeedback(`Datos de "${data.name}" actualizados.`);
  };

  const handleDeleteGroup = (groupId: string, fallbackGroupId?: string) => {
    const groupToDelete = groups.find((g) => g.id === groupId);
    if (!groupToDelete) return;

    const remainingGroups = groups.filter((g) => g.id !== groupId);

    if (fallbackGroupId && groupToDelete.publishers.length > 0) {
      setGroups(
        remainingGroups.map((g) => {
          if (g.id !== fallbackGroupId) return g;
          return {
            ...g,
            publishers: [...g.publishers, ...groupToDelete.publishers],
          };
        })
      );
    } else {
      setGroups(remainingGroups);
    }

    const nextActiveId = fallbackGroupId || remainingGroups[0]?.id || 'group-1';
    setSelectedGroupId(nextActiveId);
    showFeedback(`Grupo "${groupToDelete.name}" eliminado correctamente.`);
  };

  const serviceGroupsForModal: ServiceGroup[] = groups.map((g) => ({
    id: g.id,
    group_number: g.group_number,
    name: g.name,
    meeting_location: g.location,
    meeting_schedule: g.schedule,
    overseer_id: null,
    assistant_id: null,
    created_at: '2024-01-01',
  }));

  const otherGroupsForDelete = serviceGroupsForModal.filter((g) => g.id !== activeGroup.id);

  // Extraer ancianos y siervos para el selector de supervisores
  const availableElders: Profile[] = useMemo(() => {
    const allPubs: Profile[] = [];
    groups.forEach((g) => {
      g.publishers.forEach((p) => {
        if (p.role === 'anciano' || p.role === 'siervo_ministerial' || p.role === 'secretario') {
          allPubs.push({
            id: p.id,
            service_group_id: g.id,
            full_name: p.name,
            phone: p.phone,
            role: p.role,
            privilege: p.privilege,
            is_active: true,
            avatar_url: p.avatarUrl || null,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          });
        }
      });
    });
    return allPubs;
  }, [groups]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner Contextual & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
            <Users2 className="w-4 h-4" />
            <span>Organización Territorial y Supervisión</span>
          </div>
          <h1 className="font-headline text-2xl md:text-3xl text-primary font-extrabold tracking-tight">
            Grupos de Predicación y Servicio
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl">
            Seguimiento teocrático, administración de grupos y reporte de actividad mensual.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateGroupOpen(true)}
          className="text-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Grupo</span>
        </Button>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 rounded-xl bg-secondary-container/60 text-on-secondary-container text-xs font-semibold flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Selector Horizontal de Grupos + Acciones del Grupo Activo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">
        <div className="overflow-x-auto pb-1 flex-1">
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

        {/* Botones administrativos del grupo activo */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditGroupOpen(true)}
            className="text-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-outline" />
            <span>Editar Grupo</span>
          </Button>

          {groups.length > 1 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDeleteGroupOpen(true)}
              className="text-xs text-error hover:bg-error/10 hover:text-error"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Grupo</span>
            </Button>
          )}
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

      {/* Modal Crear Nuevo Grupo */}
      <GroupFormModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onSave={handleCreateGroup}
        availableElders={availableElders}
      />

      {/* Modal Editar Grupo Activo */}
      <GroupFormModal
        isOpen={isEditGroupOpen}
        onClose={() => setIsEditGroupOpen(false)}
        onSave={handleEditGroup}
        group={{
          id: activeGroup.id,
          group_number: activeGroup.group_number,
          name: activeGroup.name,
          meeting_location: activeGroup.location,
          meeting_schedule: activeGroup.schedule,
          overseer_id: null,
          assistant_id: null,
          created_at: '2024-01-01',
        }}
        availableElders={availableElders}
      />

      {/* Modal Eliminar Grupo Activo */}
      <DeleteGroupModal
        isOpen={isDeleteGroupOpen}
        onClose={() => setIsDeleteGroupOpen(false)}
        onConfirmDelete={handleDeleteGroup}
        group={{
          id: activeGroup.id,
          group_number: activeGroup.group_number,
          name: activeGroup.name,
          meeting_location: activeGroup.location,
          meeting_schedule: activeGroup.schedule,
          overseer_id: null,
          assistant_id: null,
          created_at: '2024-01-01',
        }}
        publishersCount={activeGroup.publishers.length}
        otherGroups={otherGroupsForDelete}
      />
    </div>
  );
};

ServiceGroupsPage.displayName = 'ServiceGroupsPage';
