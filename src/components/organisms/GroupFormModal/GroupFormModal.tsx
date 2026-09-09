import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import type { ServiceGroup, Profile, ServiceGroupInsert } from '@/types/database.types';
import { Users, X, ShieldCheck } from 'lucide-react';

export interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceGroupInsert) => Promise<void> | void;
  group?: ServiceGroup | null;
  availableElders?: Profile[];
  isLoading?: boolean;
}

export const GroupFormModal: React.FC<GroupFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  group,
  availableElders = [],
  isLoading = false,
}) => {
  const [groupNumber, setGroupNumber] = useState<number>(1);
  const [name, setName] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [meetingSchedule, setMeetingSchedule] = useState('');
  const [overseerId, setOverseerId] = useState('');
  const [assistantId, setAssistantId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (group) {
      setGroupNumber(group.group_number);
      setName(group.name);
      setMeetingLocation(group.meeting_location || '');
      setMeetingSchedule(group.meeting_schedule || '');
      setOverseerId(group.overseer_id || '');
      setAssistantId(group.assistant_id || '');
    } else {
      setGroupNumber(1);
      setName('');
      setMeetingLocation('');
      setMeetingSchedule('Sábados 9:00 AM');
      setOverseerId('');
      setAssistantId('');
    }
    setError(null);
  }, [group, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre del grupo es requerido.');
      return;
    }
    if (groupNumber < 1) {
      setError('El número de grupo debe ser mayor a 0.');
      return;
    }

    try {
      await onSave({
        group_number: groupNumber,
        name: name.trim(),
        meeting_location: meetingLocation.trim() || null,
        meeting_schedule: meetingSchedule.trim() || null,
        overseer_id: overseerId || null,
        assistant_id: assistantId || null,
      });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el grupo';
      setError(msg);
    }
  };

  const isEditing = Boolean(group);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-200"
    >
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg max-h-[calc(100dvh-2rem)] border border-surface-container-high shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 bg-surface-container-low border-b border-surface-container-high/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <h2
              id="group-modal-title"
              className="font-headline text-base font-bold text-on-surface"
            >
              {isEditing ? 'Modificar Grupo de Servicio' : 'Crear Nuevo Grupo de Servicio'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-lg text-outline hover:bg-surface-container-high transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body con Scroll */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 overscroll-contain">
          {error && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField id="group-number" label="Número" required>
              <Input
                id="group-number"
                type="number"
                min={1}
                max={50}
                value={groupNumber}
                onChange={(e) => setGroupNumber(parseInt(e.target.value, 10) || 1)}
                disabled={isLoading}
                required
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField id="group-name" label="Nombre del Grupo" required>
                <Input
                  id="group-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  placeholder="Ej. Grupo 6 - Valle Dorado"
                  disabled={isLoading}
                  required
                />
              </FormField>
            </div>
          </div>

          <FormField id="group-location" label="Lugar de Reunión para la Salida">
            <Input
              id="group-location"
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
              placeholder="Ej. Casa Hno. Méndez / Salón Auxiliar"
              disabled={isLoading}
            />
          </FormField>

          <FormField id="group-schedule" label="Horario de Salida a Predicar">
            <Input
              id="group-schedule"
              value={meetingSchedule}
              onChange={(e) => setMeetingSchedule(e.target.value)}
              placeholder="Ej. Sábados y Domingos 9:00 AM"
              disabled={isLoading}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Encargado */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="overseer-select"
                className="text-xs font-semibold text-on-surface flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Superintendente / Encargado</span>
              </label>
              <Select
                id="overseer-select"
                ariaLabel="Superintendente de grupo"
                value={overseerId}
                onChange={(val) => setOverseerId(val)}
                disabled={isLoading}
                placeholder="-- Sin Asignar --"
                options={[
                  { value: '', label: '-- Sin Asignar --' },
                  ...availableElders.map((elder) => ({
                    value: elder.id,
                    label: `${elder.full_name} (${elder.role})`,
                  })),
                ]}
              />
            </div>

            {/* Auxiliar */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="assistant-select"
                className="text-xs font-semibold text-on-surface flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                <span>Auxiliar de Grupo</span>
              </label>
              <Select
                id="assistant-select"
                ariaLabel="Auxiliar de grupo"
                value={assistantId}
                onChange={(val) => setAssistantId(val)}
                disabled={isLoading}
                placeholder="-- Sin Asignar --"
                options={[
                  { value: '', label: '-- Sin Asignar --' },
                  ...availableElders.map((elder) => ({
                    value: elder.id,
                    label: `${elder.full_name} (${elder.role})`,
                  })),
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-surface-container-high/60 mt-auto">
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
              {isEditing ? 'Guardar Cambios' : 'Crear Grupo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

GroupFormModal.displayName = 'GroupFormModal';
