import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Avatar } from '@/components/atoms/Avatar';
import { Select } from '@/components/atoms/Select';
import { PublisherCardS21View } from '@/components/organisms/PublisherCardS21View';
import {
  PublisherFormModal,
  type PublisherFormData,
} from '@/components/organisms/PublisherFormModal';
import { PublisherTransferModal } from '@/components/organisms/PublisherTransferModal';
import {
  PublisherImportModal,
} from '@/components/organisms/PublisherImportModal';
import type { ParsedPublisherRow } from '@/services/csvImportService';
import {
  usePublisherManagement,
  type UsePublisherManagementOptions,
} from '@/hooks/usePublisherManagement';
import type { Profile, ServiceGroup } from '@/types/database.types';
import { cn } from '@/utils/cn';

export interface PublisherCardsPageProps extends UsePublisherManagementOptions {
  availableGroups?: ServiceGroup[];
  availableElders?: Profile[];
}

const DEFAULT_GROUPS: ServiceGroup[] = [
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

export const PublisherCardsPage: React.FC<PublisherCardsPageProps> = ({
  initialPublishers,
  initialGroups = DEFAULT_GROUPS,
  availableGroups = DEFAULT_GROUPS,
}) => {
  const {
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
  } = usePublisherManagement({
    initialPublishers,
    initialGroups,
  });

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [confirmDeactivateId, setConfirmDeactivateId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleImportPublishers = (imported: ParsedPublisherRow[]) => {
    let count = 0;
    imported.forEach((row) => {
      const matchedGroup = availableGroups.find((g) => g.group_number === row.groupNumber);
      createPublisher({
        full_name: row.full_name,
        phone: row.phone,
        role: row.role,
        privilege: row.privilege,
        service_group_id: matchedGroup ? matchedGroup.id : (availableGroups[0]?.id || null),
      });
      count++;
    });
    showFeedback(`Se importaron ${count} publicadores exitosamente desde el archivo CSV.`);
  };

  const handleSaveNewPublisher = (data: PublisherFormData) => {
    createPublisher(data);
    showFeedback(`Publicador "${data.full_name}" registrado correctamente.`);
  };

  const handleSaveEditedPublisher = (data: PublisherFormData) => {
    if (activePublisher) {
      updatePublisher(activePublisher.id, data);
      showFeedback(`Datos de "${data.full_name}" actualizados.`);
    }
  };

  const handleTransfer = (publisherId: string, newGroupId: string) => {
    transferPublisher(publisherId, newGroupId);
    const targetGroup = availableGroups.find((g) => g.id === newGroupId);
    showFeedback(
      `Publicador reasignado exitosamente al ${targetGroup ? targetGroup.name : 'nuevo grupo'}.`
    );
  };

  const handleConfirmDeactivate = () => {
    if (confirmDeactivateId) {
      const pub = filteredPublishers.find((p) => p.id === confirmDeactivateId);
      deactivatePublisher(confirmDeactivateId);
      setConfirmDeactivateId(null);
      showFeedback(`Publicador "${pub?.full_name || ''}" dado de baja.`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header & Actions */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high/60 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-secondary text-xs font-semibold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-secondary" />
              <span>Secretaría Teocrática · Archivo S-21 Individual</span>
            </div>
            <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
              Tarjetas de Publicador
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Historial de 12 meses, administración de nombramientos, rol y cambios de grupo de predicación.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportOpen(true)}
              className="text-xs flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4 text-primary" />
              <span>Importar CSV</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="text-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Publicador</span>
            </Button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-surface-container-high/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
              <input
                type="text"
                aria-label="Buscar publicador por nombre"
                placeholder="Buscar por nombre o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-lowest text-xs text-on-surface rounded-xl pl-9 pr-3 py-2 border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Filter by Group */}
            <Select
              aria-label="Filtrar por grupo"
              value={selectedGroupId}
              onChange={(val) => setSelectedGroupId(val)}
              icon={<Users className="w-3.5 h-3.5 text-outline" />}
              options={[
                { value: 'all', label: 'Todos los Grupos' },
                ...availableGroups.map((grp) => ({
                  value: grp.id,
                  label: grp.name,
                })),
              ]}
            />

            {/* Filter by Role / Privilege */}
            <Select
              aria-label="Filtrar por rol o nombramiento"
              value={selectedRole}
              onChange={(val) => setSelectedRole(val as Parameters<typeof setSelectedRole>[0])}
              icon={<Filter className="w-3.5 h-3.5 text-outline" />}
              options={[
                { value: 'all', label: 'Todos los Nombramientos' },
                { value: 'precursor_regular', label: 'Precursores Regulares' },
                { value: 'precursor_auxiliar', label: 'Precursores Auxiliares' },
                { value: 'anciano', label: 'Ancianos' },
                { value: 'siervo_ministerial', label: 'Siervos Ministeriales' },
                { value: 'publicador', label: 'Solo Publicadores' },
              ]}
            />
          </div>

          <span className="text-xs text-outline font-medium self-center">
            {filteredPublishers.length} publicador(es)
          </span>
        </div>
      </div>

      {/* Feedback Toast */}
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

      {/* Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Publishers */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-high/60 shadow-sm flex flex-col gap-2 max-h-[780px] overflow-y-auto">
          <div className="px-2 py-1 flex items-center justify-between">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
              Congregación ({filteredPublishers.length})
            </span>
          </div>

          {filteredPublishers.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-2 text-outline">
              <AlertCircle className="w-8 h-8 opacity-40" />
              <p className="text-xs">No se encontraron publicadores con los filtros seleccionados.</p>
            </div>
          ) : (
            filteredPublishers.map((pub) => {
              const isSelected = activePublisher?.id === pub.id;
              const group = availableGroups.find((g) => g.id === pub.service_group_id);

              return (
                <button
                  key={pub.id}
                  type="button"
                  onClick={() => selectPublisher(pub.id)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl text-left transition-all duration-150 border',
                    isSelected
                      ? 'bg-primary-container/10 border-primary shadow-xs'
                      : 'bg-surface-container-low/40 border-transparent hover:bg-surface-container-low hover:border-surface-container-high'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={pub.full_name} size="md" />
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-on-surface">
                        {pub.full_name}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {group ? group.name : 'Sin grupo'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={pub.privilege}>
                      {pub.privilege === 'precursor_regular'
                        ? 'Regular'
                        : pub.privilege === 'precursor_auxiliar'
                        ? 'Auxiliar'
                        : 'Pub'}
                    </Badge>
                    {pub.role !== 'publicador' && (
                      <span className="text-[10px] text-outline font-semibold capitalize">
                        {pub.role.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Active Publisher S-21 View */}
        <div className="lg:col-span-8">
          {activeCard ? (
            <PublisherCardS21View
              card={activeCard}
              onEditPublisher={() => setIsEditOpen(true)}
              onTransferGroup={() => setIsTransferOpen(true)}
              onDeactivatePublisher={() => setConfirmDeactivateId(activeCard.publisher.id)}
            />
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl p-12 border border-surface-container-high/60 shadow-sm text-center flex flex-col items-center gap-3 text-outline">
              <Users className="w-12 h-12 opacity-30" />
              <p className="text-xs">Selecciona un publicador para ver su tarjeta de registro S-21.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {/* 1. Modal Registrar Nuevo Publicador */}
      <PublisherFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveNewPublisher}
        availableGroups={availableGroups}
      />

      {/* 2. Modal Editar Publicador Activo */}
      <PublisherFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEditedPublisher}
        publisher={activePublisher}
        availableGroups={availableGroups}
      />

      {/* 3. Modal Transferir Publicador a Otro Grupo */}
      <PublisherTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onTransfer={handleTransfer}
        publisher={activePublisher}
        availableGroups={availableGroups}
      />

      {/* 4. Modal Importación Masiva CSV */}
      <PublisherImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onConfirmImport={handleImportPublishers}
      />

      {/* 4. Modal Confirmación de Baja */}
      {confirmDeactivateId && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmDeactivateId(null);
          }}
          className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="flex min-h-full items-center justify-center py-2 sm:py-6 pointer-events-none">
            <div className="bg-surface-container-lowest rounded-2xl w-full max-w-sm border border-surface-container-high shadow-xl p-6 flex flex-col gap-4 pointer-events-auto">
              <h3 className="font-headline text-base font-bold text-on-surface">
                Dar de baja a publicador
              </h3>
              <p className="text-xs text-on-surface-variant">
                ¿Deseas dar de baja a este publicador? El historial de sus informes previos se
                conservará en el archivo anual S-21 por motivos de auditoría teocrática.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDeactivateId(null)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleConfirmDeactivate}
                  className="text-xs"
                >
                  Confirmar Baja
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

PublisherCardsPage.displayName = 'PublisherCardsPage';

