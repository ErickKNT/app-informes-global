import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Input } from '@/components/atoms/Input';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import {
  monthlyReportFormSchema,
  type MonthlyReportFormData,
} from '@/schemas/monthlyReportSchema';
import type { ServicePrivilege } from '@/types/database.types';
import { Send, CheckCircle2, Info } from 'lucide-react';

export interface ReportSubmissionFormProps {
  initialValues?: Partial<MonthlyReportFormData>;
  onSubmit: (data: MonthlyReportFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  className?: string;
  onHoursChange?: (hours: number) => void;
  role?: ServicePrivilege;
}

export const ReportSubmissionForm: React.FC<ReportSubmissionFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  className,
  onHoursChange,
  role = 'publicador',
}) => {
  const isPioneer = role === 'precursor_auxiliar' || role === 'precursor_regular';
  const [participated, setParticipated] = useState<boolean>(
    initialValues?.participated ?? true
  );
  const [hours, setHours] = useState<string>(
    initialValues?.hours !== undefined ? String(initialValues.hours) : ''
  );
  const [bibleStudies, setBibleStudies] = useState<string>(
    initialValues?.bible_studies !== undefined ? String(initialValues.bible_studies) : '0'
  );
  const [notes, setNotes] = useState<string>(initialValues?.notes ?? '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHours(val);
    if (errors.hours) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.hours;
        return next;
      });
    }
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && onHoursChange) {
      onHoursChange(parsed);
    }
  };

  const handleBibleStudiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBibleStudies(e.target.value);
    if (errors.bible_studies) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.bible_studies;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSuccess(false);

    const rawData = {
      participated,
      hours: isPioneer ? (hours === '' ? 0 : Number(hours)) : 0,
      bible_studies: bibleStudies === '' ? 0 : Number(bibleStudies),
      notes,
    };

    const validation = monthlyReportFormSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const fieldName = String(issue.path[0] || 'form');
        fieldErrors[fieldName] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit(validation.data);
      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error al enviar el informe.';
      setErrors({ form: message });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        'bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-container-high shadow-sm flex flex-col gap-6',
        className
      )}
    >
      <div className="flex flex-col gap-1 border-b border-surface-container-high pb-4">
        <h2 className="font-headline text-lg md:text-xl font-bold text-primary">
          Detalle de Actividad en el Ministerio
        </h2>
        <p className="text-xs text-on-surface-variant">
          Ingresa tus datos de servicio del mes para ser consolidados por la congregación.
        </p>
      </div>

      {errors.form && (
        <div role="alert" className="p-3.5 rounded-xl bg-error-container text-on-error-container text-xs font-medium">
          {errors.form}
        </div>
      )}

      {isSuccess && (
        <div role="status" className="p-3.5 rounded-xl bg-secondary-container/60 text-on-secondary-container text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
          <span>¡Informe registrado exitosamente!</span>
        </div>
      )}

      {/* Pauta Teocrática / Instrucción según Privilegio */}
      {!isPioneer ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary-container/20 border border-secondary/30 text-xs">
          <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-secondary">
              Pauta Teocrática (Publicadores de Congregación)
            </span>
            <p className="text-on-surface-variant leading-relaxed">
              Los publicadores no tienen requisito de horas. Únicamente confirma si tuviste participación en el ministerio durante el mes y registra cuántos cursos bíblicos diferentes dirigiste.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-primary-container/20 border border-primary/30 text-xs">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-primary">
              Servicio de {role === 'precursor_regular' ? 'Precursor Regular (Meta: 50 hrs)' : 'Precursor Auxiliar (Meta: 30 hrs)'}
            </span>
            <p className="text-on-surface-variant">
              Registra el total de horas de ministerio cumplidas durante el mes calendario.
            </p>
          </div>
        </div>
      )}

      {/* Participación Activa Checkbox */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/60">
        <Checkbox
          id="participated"
          label="Participé en alguna forma del ministerio del campo durante este mes."
          checked={participated}
          onChange={(e) => {
            setParticipated(e.target.checked);
            if (errors.participated) {
              setErrors((prev) => {
                const next = { ...prev };
                delete next.participated;
                return next;
              });
            }
          }}
        />
        {errors.participated && (
          <span role="alert" className="text-xs text-error font-medium mt-1.5 block">
            {errors.participated}
          </span>
        )}
      </div>

      <div className={cn('grid gap-5', isPioneer ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1')}>
        {/* Horas: Solo para precursores */}
        {isPioneer && (
          <FormField
            id="report-hours"
            label="Horas de Servicio"
            required
            error={errors.hours}
            hint={role === 'precursor_regular' ? 'Meta mensual: 50 horas' : 'Meta mensual: 30 horas'}
          >
            <Input
              id="report-hours"
              type="number"
              min={0}
              max={300}
              step={1}
              suffix="hrs"
              placeholder="0"
              value={hours}
              hasError={Boolean(errors.hours)}
              onChange={handleHoursChange}
              disabled={isSubmitting}
            />
          </FormField>
        )}

        {/* Cursos Bíblicos */}
        <FormField
          id="report-bible-studies"
          label="Cursos Bíblicos Conducidos"
          required
          error={errors.bible_studies}
          hint="Diferentes estudiantes atendidos durante el mes"
        >
          <Input
            id="report-bible-studies"
            type="number"
            min={0}
            max={50}
            step={1}
            placeholder="0"
            value={bibleStudies}
            hasError={Boolean(errors.bible_studies)}
            onChange={handleBibleStudiesChange}
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      {/* Notas / Comentarios */}
      <FormField
        id="report-notes"
        label="Comentarios o Aclaraciones (Opcional)"
        error={errors.notes}
        hint="Máximo 500 caracteres"
      >
        <textarea
          id="report-notes"
          rows={3}
          maxLength={500}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isSubmitting}
          placeholder="Si fuiste precursor auxiliar o tuviste circunstancias especiales, anótalo aquí..."
          className={cn(
            'w-full px-3.5 py-2.5 text-sm bg-surface-container-lowest border rounded-xl text-on-surface ' +
            'placeholder:text-outline/70 transition-all duration-150 ' +
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ' +
            'disabled:bg-surface-container-low disabled:text-outline',
            errors.notes ? 'border-error text-error' : 'border-outline-variant/80 hover:border-outline'
          )}
        />
      </FormField>

      {/* Acciones */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
        >
          <Send className="w-4 h-4" />
          <span>Enviar Informe</span>
        </Button>
      </div>
    </form>
  );
};

ReportSubmissionForm.displayName = 'ReportSubmissionForm';

