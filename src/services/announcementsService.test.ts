import { describe, it, expect, beforeEach } from 'vitest';
import { announcementsService } from './announcementsService';

describe('announcementsService', () => {
  beforeEach(() => {
    announcementsService.resetDefaults();
  });

  it('obtiene los anuncios por defecto ordenados con prioridad alta primero', () => {
    const list = announcementsService.getAnnouncements();
    expect(list.length).toBeGreaterThanOrEqual(3);
    expect(list[0]?.priority).toBe('alta');
    expect(list[0]?.title).toContain('Superintendente de Circuito');
  });

  it('agrega un nuevo anuncio correctamente', () => {
    const created = announcementsService.addAnnouncement({
      title: 'Reunión de Ancianos y Siervos',
      content: 'Reunión trimestral a las 7:00 PM.',
      priority: 'alta',
      location_note: 'Biblioteca B',
      date_note: 'Viernes 19:00',
      created_by: 'Coordinador',
    });

    expect(created.id).toBeDefined();
    expect(created.created_at).toBeDefined();

    const list = announcementsService.getAnnouncements();
    expect(list.some((a) => a.id === created.id)).toBe(true);
  });

  it('elimina un anuncio por su ID', () => {
    const initialList = announcementsService.getAnnouncements();
    const firstId = initialList[0]?.id as string;

    announcementsService.deleteAnnouncement(firstId);

    const updatedList = announcementsService.getAnnouncements();
    expect(updatedList.some((a) => a.id === firstId)).toBe(false);
  });
});
