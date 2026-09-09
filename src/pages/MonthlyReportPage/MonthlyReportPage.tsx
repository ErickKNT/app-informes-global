import React, { useState } from 'react';
import type { ServicePrivilege } from '@/types/database.types';
import { RoleSelectorPill } from '@/components/molecules/RoleSelectorPill';
import { HoursGaugeCard } from '@/components/organisms/HoursGaugeCard';
import {
  ReportSubmissionForm,
} from '@/components/organisms/ReportSubmissionForm';
import type { MonthlyReportFormData } from '@/schemas/monthlyReportSchema';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export interface MonthlyReportPageProps {
  onSaveReport?: (data: MonthlyReportFormData & { role: ServicePrivilege }) => Promise<void> | void;
}

export const MonthlyReportPage: React.FC<MonthlyReportPageProps> = ({ onSaveReport }) => {
  const [selectedRole, setSelectedRole] = useState<ServicePrivilege>('precursor_regular');
  const [currentHours, setCurrentHours] = useState<number>(42);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getTargetHours = (role: ServicePrivilege): number => {
    switch (role) {
      case 'publicador':
        return 10;
      case 'precursor_auxiliar':
        return 30;
      case 'precursor_regular':
        return 50;
      default:
        return 10;
    }
  };

  const targetHours = getTargetHours(selectedRole);

  const handleFormSubmit = async (formData: MonthlyReportFormData) => {
    setIsSubmitting(true);
    try {
      if (onSaveReport) {
        await onSaveReport({ ...formData, role: selectedRole });
      }
      setCurrentHours(formData.hours);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner / Editorial Identity Strip */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-high shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-outline uppercase tracking-wider">
              Actividad Personal
            </span>
            <span className="text-outline-variant">·</span>
            <span className="text-secondary font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              En plazo de recepción
            </span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-primary tracking-tight">
            Mi Registro de Servicio
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xl">
            Ingresa tu ministerio correspondiente al mes en curso para ser consolidado por el secretario de la congregación.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector Pill */}
          <div className="flex items-center bg-surface-container-low border border-surface-container-high rounded-xl px-2 py-1 shadow-inner text-xs">
            <button
              type="button"
              className="p-1 text-on-surface-variant hover:text-primary transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-on-surface">Octubre 2024</span>
            <button
              type="button"
              disabled
              className="p-1 text-outline-variant cursor-not-allowed"
              title="Mes siguiente no disponible"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Role Switcher Pill */}
          <RoleSelectorPill
            selectedRole={selectedRole}
            onChange={(role) => setSelectedRole(role)}
          />
        </div>
      </div>

      {/* Main Grid: Left Radial Gauge, Right Input Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Radial Chart & Goal highlights */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <HoursGaugeCard
            hours={currentHours}
            targetHours={targetHours}
            monthName="Octubre"
          />
        </div>

        {/* Right Column: Central Input Form */}
        <div className="lg:col-span-8">
          <ReportSubmissionForm
            initialValues={{
              participated: true,
              hours: currentHours,
              bible_studies: 2,
              notes: '',
            }}
            isSubmitting={isSubmitting}
            onHoursChange={(hours) => setCurrentHours(hours)}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};

MonthlyReportPage.displayName = 'MonthlyReportPage';

