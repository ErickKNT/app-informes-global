import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import type {
  Profile,
  PublisherRole,
  ServicePrivilege,
  ServiceGroup,
} from '@/types/database.types';
import { X, User, ShieldCheck, Award, Users } from 'lucide-react';

export interface PublisherFormData {
  full_name: string;
  phone: string | null;
  role: PublisherRole;
  privilege: ServicePrivilege;
  service_group_id: string | null;
}

export interface PublisherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PublisherFormData) => Promise<void> | void;
  publisher?: Profile | null;
  availableGroups?: ServiceGroup[];
  isLoading?: boolean;
}

export const PublisherFormModal: React.FC<PublisherFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  publisher,
  availableGroups = [],
  isLoading = false,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<PublisherRole>('publicador');
  const [privilege, setPrivilege] = useState<ServicePrivilege>('publicador');
  const [groupId, setGroupId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publisher) {
      setFullName(publisher.full_name);
      setPhone(publisher.phone || '');
      setRole(publisher.role);
      setPrivilege(publisher.privilege);
      setGroupId(publisher.service_group_id || '');
    } else {
      setFullName('');
      setPhone('');
      setRole('publicador');
      setPrivilege('publicador');
      setGroupId(availableGroups[0]?.id || '');
    }
    setError(null);
  }, [publisher, isOpen, availableGroups]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('El nombre completo es requerido.');
      return;
    }

    try {
      await onSave({
        full_name: fullName.trim(),
        phone: phone.trim() ? phone.trim() : null,
        role,
        privilege,
        service_group_id: groupId ? groupId : null,
      });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar publicador';
      setError(msg);
    }
  };

  const isEditing = Boolean(publisher);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="publisher-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg border border-surface-container-high shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h2
              id="publisher-modal-title"
              className="font-headline text-base font-bold text-on-surface"
            >
              {isEditing ? 'Editar Publicador / Rol' : 'Registrar Nuevo Publicador'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-lg text-outline hover:bg-surface-container-high transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Full Name */}
          <FormField id="publisher-name" label="Nombre Completo" required>
            <Input
              id="publisher-name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setError(null);
              }}
              placeholder="Ej. Juan Pérez"
              disabled={isLoading}
              required
            />
          </FormField>

          {/* Phone */}
          <FormField id="publisher-phone" label="Teléfono / WhatsApp (opcional)">
            <Input
              id="publisher-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+52 55 1234 5678"
              disabled={isLoading}
            />
          </FormField>

          {/* Row: Role & Privilege */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rol Eclesiástico */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="role-select"
                className="text-xs font-semibold text-on-surface flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Nombramiento / Rol</span>
              </label>
              <Select<PublisherRole>
                id="role-select"
                ariaLabel="Nombramiento o rol"
                value={role}
                onChange={(val) => setRole(val as PublisherRole)}
                disabled={isLoading}
                options={[
                  { value: 'publicador', label: 'Publicador' },
                  { value: 'siervo_ministerial', label: 'Siervo Ministerial' },
                  { value: 'anciano', label: 'Anciano' },
                  { value: 'secretario', label: 'Secretario' },
                ]}
              />
            </div>

            {/* Privilegio de Servicio */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="privilege-select"
                className="text-xs font-semibold text-on-surface flex items-center gap-1"
              >
                <Award className="w-3.5 h-3.5 text-secondary" />
                <span>Privilegio de Servicio</span>
              </label>
              <Select<ServicePrivilege>
                id="privilege-select"
                ariaLabel="Privilegio de servicio"
                value={privilege}
                onChange={(val) => setPrivilege(val as ServicePrivilege)}
                disabled={isLoading}
                options={[
                  { value: 'publicador', label: 'Publicador (Requisito no horario)' },
                  { value: 'precursor_auxiliar', label: 'Precursor Auxiliar (30h)' },
                  { value: 'precursor_regular', label: 'Precursor Regular (50h / 600h anual)' },
                ]}
              />
            </div>
          </div>

          {/* Assigned Group */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="group-select"
              className="text-xs font-semibold text-on-surface flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>Grupo de Servicio Asignado</span>
            </label>
            <Select
              id="group-select"
              ariaLabel="Grupo de servicio asignado"
              value={groupId}
              onChange={(val) => setGroupId(val)}
              disabled={isLoading}
              placeholder="-- Sin Grupo Asignado --"
              options={[
                { value: '', label: '-- Sin Grupo Asignado --' },
                ...availableGroups.map((grp) => ({
                  value: grp.id,
                  label: grp.name,
                })),
              ]}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-surface-container-high/60 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              className="text-xs"
            >
              {isEditing ? 'Guardar Cambios' : 'Registrar Publicador'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

PublisherFormModal.displayName = 'PublisherFormModal';
