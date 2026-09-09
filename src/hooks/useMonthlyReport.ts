import { useState, useCallback } from 'react';
import { reportsService } from '@/services/reportsService';
import type { MonthlyReport } from '@/types/database.types';
import type { MonthlyReportFormData } from '@/schemas/monthlyReportSchema';

export interface UseMonthlyReportReturn {
  isSubmitting: boolean;
  submitSuccess: boolean;
  error: string | null;
  savedReport: MonthlyReport | null;
  submitReport: (
    formData: MonthlyReportFormData,
    context: {
      profileId: string;
      serviceGroupId: string;
      month: number;
      year: number;
    }
  ) => Promise<boolean>;
  resetStatus: () => void;
}

export function useMonthlyReport(): UseMonthlyReportReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedReport, setSavedReport] = useState<MonthlyReport | null>(null);

  const submitReport = useCallback(
    async (
      formData: MonthlyReportFormData,
      context: {
        profileId: string;
        serviceGroupId: string;
        month: number;
        year: number;
      }
    ): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);
      setSubmitSuccess(false);

      try {
        const result = await reportsService.submitReport({
          profile_id: context.profileId,
          service_group_id: context.serviceGroupId,
          month: context.month,
          year: context.year,
          participated: formData.participated,
          hours: formData.hours ?? 0,
          bible_studies: formData.bible_studies,
          notes: formData.notes || null,
          status: 'entregado',
          submitted_by: context.profileId,
          confirmed_at: null,
        });

        if (result.error) {
          setError(result.error);
          return false;
        }

        setSavedReport(result.data);
        setSubmitSuccess(true);
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error inesperado al guardar el informe';
        setError(message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const resetStatus = useCallback(() => {
    setIsSubmitting(false);
    setSubmitSuccess(false);
    setError(null);
  }, []);

  return {
    isSubmitting,
    submitSuccess,
    error,
    savedReport,
    submitReport,
    resetStatus,
  };
}
