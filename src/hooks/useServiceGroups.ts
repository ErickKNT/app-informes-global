import { useState, useCallback } from 'react';
import type { PublisherListItem } from '@/components/organisms/PublishersTable';
import type { SupervisorInfo } from '@/components/organisms/GroupSupervisorsCard';
import type { GroupMetrics } from '@/components/organisms/GroupMetricsCards';
import type { ServiceGroupInsert } from '@/types/database.types';

export interface ServiceGroupSupervisors {
  overseer: SupervisorInfo;
  assistant: SupervisorInfo;
  schedule: string;
  location: string;
}

export interface ServiceGroupTabItem {
  id: string;
  groupNumber: number;
  name: string;
  publishersCount: number;
  reportedCount: number;
  supervisors: ServiceGroupSupervisors;
  metrics: GroupMetrics;
  publishers: PublisherListItem[];
}

const DEFAULT_GROUPS_STATE: ServiceGroupTabItem[] = [
  {
    id: 'group-1',
    groupNumber: 1,
    name: 'Grupo 1 - Los Olivos',
    publishersCount: 19,
    reportedCount: 16,
    supervisors: {
      overseer: { name: 'Carlos Méndez', role: 'Anciano / Sup. de Grupo' },
      assistant: { name: 'Roberto Gómez', role: 'Siervo Ministerial / Auxiliar' },
      schedule: 'Sábados 9:00 AM',
      location: 'Calle Olivos 12 (Casa Hno. Méndez)',
    },
    metrics: {
      totalPublishers: 19,
      reportedPublishers: 16,
      totalHours: 184,
      totalBibleStudies: 6,
    },
    publishers: [
      {
        id: 'pub-1',
        name: 'Mateo González',
        phone: '+52 55 1234 5678',
        role: 'publicador',
        privilege: 'precursor_regular',
        hasReported: true,
        hours: 54,
        bibleStudies: 6,
      },
      {
        id: 'pub-2',
        name: 'Lucas Peña',
        phone: '+52 55 2345 6789',
        role: 'publicador',
        privilege: 'publicador',
        hasReported: true,
        hours: 14,
        bibleStudies: 1,
      },
      {
        id: 'pub-3',
        name: 'Marcos Silva',
        phone: '+52 55 3456 7890',
        role: 'siervo_ministerial',
        privilege: 'precursor_auxiliar',
        hasReported: false,
        hours: null,
        bibleStudies: null,
      },
      {
        id: 'pub-4',
        name: 'Juan Salcedo',
        phone: '+52 55 4567 8901',
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
    groupNumber: 2,
    name: 'Grupo 2 - Betel',
    publishersCount: 18,
    reportedCount: 18,
    supervisors: {
      overseer: { name: 'Fernando Ruiz', role: 'Anciano / Sup. de Grupo' },
      assistant: { name: 'Héctor Soto', role: 'Siervo Ministerial / Auxiliar' },
      schedule: 'Sábados 9:30 AM',
      location: 'Av. Primavera 405 (Salón Auxiliar B)',
    },
    metrics: {
      totalPublishers: 18,
      reportedPublishers: 18,
      totalHours: 195,
      totalBibleStudies: 8,
    },
    publishers: [
      {
        id: 'pub-201',
        name: 'Lucas Silva',
        phone: '+52 55 5678 9012',
        role: 'publicador',
        privilege: 'precursor_regular',
        hasReported: true,
        hours: 45,
        bibleStudies: 4,
      },
      {
        id: 'pub-202',
        name: 'Rebeca Flores',
        phone: '+52 55 6789 0123',
        role: 'publicador',
        privilege: 'precursor_regular',
        hasReported: true,
        hours: 50,
        bibleStudies: 4,
      },
    ],
  },
];

export interface UseServiceGroupsReturn {
  groups: ServiceGroupTabItem[];
  activeGroupId: string;
  activeGroup: ServiceGroupTabItem;
  setActiveGroupId: (id: string) => void;
  recordAssistedReport: (
    publisherId: string,
    data: { hours: number; bibleStudies: number; notes?: string }
  ) => void;
  createGroup: (data: ServiceGroupInsert, overseerName?: string, assistantName?: string) => void;
  updateGroup: (
    id: string,
    updates: Partial<ServiceGroupTabItem['supervisors']> & { name?: string; groupNumber?: number }
  ) => void;
  deleteGroup: (id: string, fallbackGroupId?: string) => void;
}

export function useServiceGroups(
  initialGroups: ServiceGroupTabItem[] = DEFAULT_GROUPS_STATE
): UseServiceGroupsReturn {
  const [groups, setGroups] = useState<ServiceGroupTabItem[]>(initialGroups);
  const [activeGroupId, setActiveGroupId] = useState<string>(
    initialGroups[0]?.id || 'group-1'
  );

  const activeGroup =
    groups.find((g) => g.id === activeGroupId) ?? groups[0] ?? initialGroups[0]!;

  const recordAssistedReport = useCallback(
    (
      publisherId: string,
      data: { hours: number; bibleStudies: number; notes?: string }
    ) => {
      setGroups((prevGroups) =>
        prevGroups.map((group) => {
          const pubIndex = group.publishers.findIndex((p) => p.id === publisherId);
          if (pubIndex === -1) return group;

          const updatedPublishers = [...group.publishers];
          const targetPub = updatedPublishers[pubIndex];
          if (!targetPub) return group;

          updatedPublishers[pubIndex] = {
            ...targetPub,
            hasReported: true,
            hours: data.hours,
            bibleStudies: data.bibleStudies,
          };

          const newReportedCount = updatedPublishers.filter((p) => p.hasReported).length;
          const newTotalHours = updatedPublishers.reduce(
            (sum, p) => sum + (p.hours || 0),
            0
          );
          const newStudies = updatedPublishers.reduce(
            (sum, p) => sum + (p.bibleStudies || 0),
            0
          );

          return {
            ...group,
            reportedCount: newReportedCount,
            publishers: updatedPublishers,
            metrics: {
              ...group.metrics,
              reportedPublishers: newReportedCount,
              totalHours: newTotalHours,
              totalBibleStudies: newStudies,
            },
          };
        })
      );
    },
    []
  );

  const createGroup = useCallback(
    (data: ServiceGroupInsert, overseerName = 'Por designar', assistantName = 'Por designar') => {
      const newGroupItem: ServiceGroupTabItem = {
        id: `group-${Date.now()}`,
        groupNumber: data.group_number,
        name: data.name,
        publishersCount: 0,
        reportedCount: 0,
        supervisors: {
          overseer: { name: overseerName, role: 'Anciano / Sup. de Grupo' },
          assistant: { name: assistantName, role: 'Siervo Ministerial / Auxiliar' },
          schedule: data.meeting_schedule || 'Sábados 9:00 AM',
          location: data.meeting_location || 'Por definir',
        },
        metrics: {
          totalPublishers: 0,
          reportedPublishers: 0,
          totalHours: 0,
          totalBibleStudies: 0,
        },
        publishers: [],
      };

      setGroups((prev) => [...prev, newGroupItem]);
      setActiveGroupId(newGroupItem.id);
    },
    []
  );

  const updateGroup = useCallback(
    (
      id: string,
      updates: Partial<ServiceGroupTabItem['supervisors']> & { name?: string; groupNumber?: number }
    ) => {
      setGroups((prev) =>
        prev.map((g) => {
          if (g.id !== id) return g;
          return {
            ...g,
            name: updates.name ?? g.name,
            groupNumber: updates.groupNumber ?? g.groupNumber,
            supervisors: {
              ...g.supervisors,
              ...updates,
            },
          };
        })
      );
    },
    []
  );

  const deleteGroup = useCallback(
    (id: string, fallbackGroupId?: string) => {
      setGroups((prev) => {
        const groupToDelete = prev.find((g) => g.id === id);
        if (!groupToDelete) return prev;

        const remainingGroups = prev.filter((g) => g.id !== id);

        // Si hay grupo de respaldo y el grupo a eliminar tenía publicadores, transferirlos
        if (fallbackGroupId && groupToDelete.publishers.length > 0) {
          return remainingGroups.map((g) => {
            if (g.id !== fallbackGroupId) return g;

            const combinedPublishers = [...g.publishers, ...groupToDelete.publishers];
            const newTotalPublishers = combinedPublishers.length;
            const newReportedCount = combinedPublishers.filter((p) => p.hasReported).length;
            const newTotalHours = combinedPublishers.reduce(
              (sum, p) => sum + (p.hours || 0),
              0
            );
            const newStudies = combinedPublishers.reduce(
              (sum, p) => sum + (p.bibleStudies || 0),
              0
            );

            return {
              ...g,
              publishersCount: newTotalPublishers,
              reportedCount: newReportedCount,
              publishers: combinedPublishers,
              metrics: {
                ...g.metrics,
                totalPublishers: newTotalPublishers,
                reportedPublishers: newReportedCount,
                totalHours: newTotalHours,
                totalBibleStudies: newStudies,
              },
            };
          });
        }

        return remainingGroups;
      });

      // Si el grupo activo era el eliminado, cambiar al fallback
      setActiveGroupId((currentActive) => {
        if (currentActive === id) {
          return fallbackGroupId || 'group-1';
        }
        return currentActive;
      });
    },
    []
  );

  return {
    groups,
    activeGroupId,
    activeGroup,
    setActiveGroupId,
    recordAssistedReport,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}
