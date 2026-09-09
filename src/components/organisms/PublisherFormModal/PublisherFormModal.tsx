import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
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
              <select
                id="role-select"
                aria-label="Nombramiento o rol"
                value={role}
                onChange={(e) => setRole(e.target.value as PublisherRole)}
                disabled={isLoading}
                className="bg-surface-container-lowest text-xs text-on-surface font-medium rounded-xl p-2.5 border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="publicador">Publicador</option>
                <option value="siervo_ministerial">Siervo Ministerial</option>
                <option value="anciano">Anciano</option>
                <option value="secretario">Secretario</option>
              </select>
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
              <select
                id="privilege-select"
                aria-label="Privilegio de servicio"
                value={privilege}
                onChange={(e) => setPrivilege(e.target.value as ServicePrivilege)}
                disabled={isLoading}
                className="bg-surface-container-lowest text-xs text-on-surface font-medium rounded-xl p-2.5 border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="publicador">Publicador (Requisito no horario)</option>
                <option value="precursor_auxiliar">Precursor Auxiliar (30h)</option>
                <option value="precursor_regular">Precursor Regular (50h / 600h anual)</option>
              </select>
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
            <select
              id="group-select"
              aria-label="Grupo de servicio asignado"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              disabled={isLoading}
              className="bg-surface-container-lowest text-xs text-on-surface font-medium rounded-xl p-2.5 border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">-- Sin Grupo Asignado --</option>
              {availableGroups.map((grp) => (
                <option key={grp.id} value={grp.id}>
                  {grp.name}
                </option>
              ))}
            </select>
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
