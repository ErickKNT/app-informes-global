import { useState, useMemo, useCallback } from 'react';
import type {
  Profile,
  PublisherS21Card,
  PublisherRole,
  ServicePrivilege,
  ServiceGroup,
  PublisherMonthRecord,
} from '@/types/database.types';
import { publishersService } from '@/services/publishersService';

export interface UsePublisherManagementOptions {
  initialPublishers?: Profile[];
  initialGroups?: ServiceGroup[];
}

export interface UsePublisherManagementReturn {
  publishers: Profile[];
  filteredPublishers: Profile[];
  activePublisher: Profile | null;
  activeCard: PublisherS21Card | null;
  searchQuery: string;
  selectedGroupId: string;
  selectedRole: string;
  setSearchQuery: (query: string) => void;
  setSelectedGroupId: (groupId: string) => void;
  setSelectedRole: (role: string) => void;
  selectPublisher: (id: string) => void;
  createPublisher: (data: {
    full_name: string;
    phone: string | null;
    role: PublisherRole;
    privilege: ServicePrivilege;
    service_group_id: string | null;
  }) => void;
  updatePublisher: (
    id: string,
    updates: Partial<Profile>
  ) => void;
  transferPublisher: (publisherId: string, newGroupId: string) => void;
  deactivatePublisher: (publisherId: string) => void;
}

const DEFAULT_INITIAL_GROUPS: ServiceGroup[] = [
  {
    id: 'grp-1',
    group_number: 1,
    name: 'Grupo 1 - Los Olivos',
    meeting_location: 'Calle Olivos 12',
    meeting_schedule: 'Sábados 9:00 AM',
    overseer_id: 'pub-1',
    assistant_id: 'pub-2',
    created_at: '2024-01-01',
  },
  {
    id: 'grp-2',
    group_number: 2,
    name: 'Grupo 2 - Betel',
    meeting_location: 'Av. Primavera 405',
    meeting_schedule: 'Sábados 9:30 AM',
    overseer_id: 'pub-3',
    assistant_id: null,
    created_at: '2024-01-01',
  },
  {
    id: 'grp-3',
    group_number: 3,
    name: 'Grupo 3 - Sinaí',
    meeting_location: 'Calle Sinaí 8',
    meeting_schedule: 'Domingos 9:00 AM',
    overseer_id: null,
    assistant_id: null,
    created_at: '2024-01-01',
  },
];

const DEFAULT_INITIAL_PUBLISHERS: Profile[] = [
  {
    id: 'pub-1',
    service_group_id: 'grp-1',
    full_name: 'Mateo González',
    phone: '+52 55 1234 5678',
    role: 'anciano',
    privilege: 'precursor_regular',
    is_active: true,
    avatar_url: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 'pub-2',
    service_group_id: 'grp-1',
    full_name: 'Lucas Peña',
    phone: '+52 55 2345 6789',
    role: 'siervo_ministerial',
    privilege: 'publicador',
    is_active: true,
    avatar_url: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 'pub-3',
    service_group_id: 'grp-2',
    full_name: 'Fernando Ruiz',
    phone: '+52 55 3456 7890',
    role: 'anciano',
    privilege: 'publicador',
    is_active: true,
    avatar_url: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 'pub-4',
    service_group_id: 'grp-2',
    full_name: 'Carmen Ramírez',
    phone: '+52 55 4567 8901',
    role: 'publicador',
    privilege: 'precursor_regular',
    is_active: true,
    avatar_url: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 'pub-5',
    service_group_id: 'grp-3',
    full_name: 'Elena Torres',
    phone: '+52 55 5678 9012',
    role: 'publicador',
    privilege: 'precursor_auxiliar',
    is_active: true,
    avatar_url: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

const MONTH_NAMES = [
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
];

function generateMockCard(
  publisher: Profile,
  groups: ServiceGroup[],
  serviceYear = '2024-2025'
): PublisherS21Card {
  const serviceGroup =
    groups.find((g) => g.id === publisher.service_group_id) || null;

  // Generar meses teocráticos con datos simulados coherentes
  const records: PublisherMonthRecord[] = MONTH_NAMES.map((name, index) => {
    // Los primeros 2 meses tienen informe entregado
    if (index === 0) {
      const hours = publisher.privilege === 'precursor_regular' ? 54 : 14;
      return {
        month: 9,
        year: 2024,
        monthName: name,
        participated: true,
        hours,
        bible_studies: publisher.privilege === 'precursor_regular' ? 6 : 1,
        notes: 'Buen inicio de año teocrático',
        status: 'confirmado',
      };
    }
    if (index === 1) {
      const hours = publisher.privilege === 'precursor_regular' ? 50 : 12;
      return {
        month: 10,
        year: 2024,
        monthName: name,
        participated: true,
        hours,
        bible_studies: publisher.privilege === 'precursor_regular' ? 5 : 1,
        notes: null,
        status: 'entregado',
      };
    }
    return {
      month: index < 4 ? index + 9 : index - 3,
      year: index < 4 ? 2024 : 2025,
      monthName: name,
      participated: false,
      hours: 0,
      bible_studies: 0,
      notes: null,
      status: 'no_entregado',
    };
  });

  const totalHours = records.reduce((sum, r) => sum + r.hours, 0);
  const activeMonths = records.filter((r) => r.status !== 'no_entregado').length;
  const averageHours = activeMonths > 0 ? Math.round((totalHours / activeMonths) * 10) / 10 : 0;
  const totalStudies = records.reduce((sum, r) => sum + r.bible_studies, 0);

  let annualGoal = 0;
  if (publisher.privilege === 'precursor_regular') {
    annualGoal = 600;
  } else if (publisher.privilege === 'precursor_auxiliar') {
    annualGoal = 360;
  }
  const goalProgressPct =
    annualGoal > 0 ? Math.min(100, Math.round((totalHours / annualGoal) * 100)) : 100;

  return {
    publisher,
    serviceGroup,
    serviceYear,
    records,
    totalHours,
    averageHours,
    totalStudies,
    annualGoal,
    goalProgressPct,
  };
}

export function usePublisherManagement(
  options: UsePublisherManagementOptions = {}
): UsePublisherManagementReturn {
  const [publishers, setPublishers] = useState<Profile[]>(
    options.initialPublishers || DEFAULT_INITIAL_PUBLISHERS
  );
  const groups = options.initialGroups || DEFAULT_INITIAL_GROUPS;

  const [activePublisherId, setActivePublisherId] = useState<string>(
    options.initialPublishers?.[0]?.id || DEFAULT_INITIAL_PUBLISHERS[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  const activePublisher =
    publishers.find((p) => p.id === activePublisherId) || publishers[0] || null;

  const activeCard = useMemo(() => {
    if (!activePublisher) return null;
    return generateMockCard(activePublisher, groups);
  }, [activePublisher, groups]);

  const filteredPublishers = useMemo(() => {
    return publishers.filter((pub) => {
      if (!pub.is_active) return false;

      // Filtro de texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pub.full_name.toLowerCase().includes(q);
        const matchesPhone = pub.phone ? pub.phone.includes(q) : false;
        if (!matchesName && !matchesPhone) return false;
      }

      // Filtro de grupo
      if (selectedGroupId !== 'all' && pub.service_group_id !== selectedGroupId) {
        return false;
      }

      // Filtro de rol
      if (selectedRole !== 'all') {
        if (selectedRole === 'precursor_regular' || selectedRole === 'precursor_auxiliar') {
          if (pub.privilege !== selectedRole) return false;
        } else if (pub.role !== selectedRole) {
          return false;
        }
      }

      return true;
    });
  }, [publishers, searchQuery, selectedGroupId, selectedRole]);

  const selectPublisher = useCallback((id: string) => {
    setActivePublisherId(id);
  }, []);

  const createPublisher = useCallback(
    (data: {
      full_name: string;
      phone: string | null;
      role: PublisherRole;
      privilege: ServicePrivilege;
      service_group_id: string | null;
    }) => {
      const newPub: Profile = {
        id: `pub-${Date.now()}`,
        service_group_id: data.service_group_id,
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
        privilege: data.privilege,
        is_active: true,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPublishers((prev) => [newPub, ...prev]);
      setActivePublisherId(newPub.id);
      publishersService.createPublisher({
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
        privilege: data.privilege,
        service_group_id: data.service_group_id,
        is_active: true,
        avatar_url: null,
      }).catch(() => {});
    },
    []
  );

  const updatePublisher = useCallback(
    (id: string, updates: Partial<Profile>) => {
      setPublishers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
      );
      publishersService.updatePublisher(id, updates).catch(() => {});
    },
    []
  );

  const transferPublisher = useCallback(
    (publisherId: string, newGroupId: string) => {
      updatePublisher(publisherId, { service_group_id: newGroupId });
    },
    [updatePublisher]
  );

  const deactivatePublisher = useCallback(
    (publisherId: string) => {
      updatePublisher(publisherId, { is_active: false });
    },
    [updatePublisher]
  );

  return {
    publishers,
    filteredPublishers,
    activePublisher,
    activeCard,
    searchQuery,
    selectedGroupId,
    selectedRole,
    setSearchQuery,
    setSelectedGroupId,
    setSelectedRole,
    selectPublisher,
    createPublisher,
    updatePublisher,
    transferPublisher,
    deactivatePublisher,
  };
}

