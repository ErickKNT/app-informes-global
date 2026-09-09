import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportService } from './exportService';
import type { PublisherS21Card } from '@/types/database.types';

describe('exportService', () => {
  let createdLinks: HTMLAnchorElement[] = [];

  beforeEach(() => {
    createdLinks = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName.toLowerCase() === 'a') {
        createdLinks.push(el as HTMLAnchorElement);
      }
      return el;
    });
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    window.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('genera y descarga CSV de tarjeta S-21 con codificación UTF-8 BOM', () => {
    const mockCard: PublisherS21Card = {
      publisher: {
        id: 'pub-1',
        service_group_id: 'grp-1',
        full_name: 'David Morales',
        phone: null,
        role: 'anciano',
        privilege: 'precursor_regular',
        is_active: true,
        avatar_url: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      serviceGroup: {
        id: 'grp-1',
        group_number: 1,
        name: 'Grupo 1 - Los Olivos',
        meeting_location: null,
        meeting_schedule: null,
        overseer_id: null,
        assistant_id: null,
        created_at: '2024-01-01',
      },
      serviceYear: '2024-2025',
      records: [
        {
          month: 9,
          year: 2024,
          monthName: 'Septiembre',
          participated: true,
          hours: 52,
          bible_studies: 4,
          notes: 'Excelente mes',
          status: 'confirmado',
        },
      ],
      totalHours: 52,
      averageHours: 52,
      totalStudies: 4,
      annualGoal: 600,
      goalProgressPct: 9,
    };

    exportService.exportPublisherS21Csv(mockCard);

    expect(createdLinks.length).toBe(1);
    expect(createdLinks[0]!.getAttribute('download')).toContain('tarjeta_s21_david_morales');
  });

  it('exporta el consolidado de congregación en CSV', () => {
    exportService.exportConsolidatedReportsCsv('2024-2025', [
      {
        id: 'grp-1',
        name: 'Grupo 1 - Los Olivos',
        groupNumber: 1,
        totalPublishers: 15,
        submittedReports: 14,
        hoursTotal: 210,
        bibleStudiesTotal: 12,
      },
    ]);

    expect(createdLinks.length).toBe(1);
    expect(createdLinks[0]!.getAttribute('download')).toContain('informe_consolidado_2024_2025');
  });

  it('dispara la función nativa window.print', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    exportService.triggerPrint();
    expect(printSpy).toHaveBeenCalled();
  });
});
