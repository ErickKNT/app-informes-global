import type { Announcement } from '@/types/database.types';

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Visita del Superintendente de Circuito',
    content: 'La visita se llevará a cabo del 12 al 17 de Noviembre. El martes y domingo las reuniones serán en los horarios regulares.',
    priority: 'alta',
    location_note: 'Salón del Reino Principal',
    date_note: '12 al 17 de Noviembre, 2024',
    created_by: 'Cuerpo de Ancianos',
    created_at: '2024-10-01T10:00:00Z',
  },
  {
    id: 'ann-2',
    title: 'Aseo y Mantenimiento del Salón',
    content: 'Esta semana corresponde al Grupo 2 realizar el aseo general posterior a las reuniones de entre semana y fin de semana.',
    priority: 'normal',
    location_note: 'Salón del Reino',
    date_note: 'Semana del 21 de Octubre',
    created_by: 'Secretaría',
    created_at: '2024-10-05T14:30:00Z',
  },
  {
    id: 'ann-3',
    title: 'Campaña de Predicación de Fin de Semana',
    content: 'Salida de predicación matutina en el territorio asignado. Punto de reunión con el superintendente de grupo.',
    priority: 'normal',
    location_note: 'Calle Olivos 12',
    date_note: 'Sábado 9:00 AM',
    created_by: 'Superintendente de Servicio',
    created_at: '2024-10-10T09:00:00Z',
  },
];

let memoryAnnouncements: Announcement[] = [...DEFAULT_ANNOUNCEMENTS];

export const announcementsService = {
  getAnnouncements: (): Announcement[] => {
    // Retorna ordenados: 'alta' primero, luego por fecha de creación descendente
    return [...memoryAnnouncements].sort((a, b) => {
      if (a.priority === 'alta' && b.priority !== 'alta') return -1;
      if (a.priority !== 'alta' && b.priority === 'alta') return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  },

  addAnnouncement: (
    data: Omit<Announcement, 'id' | 'created_at'>
  ): Announcement => {
    const newAnnouncement: Announcement = {
      ...data,
      id: 'ann-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    memoryAnnouncements = [newAnnouncement, ...memoryAnnouncements];
    return newAnnouncement;
  },

  deleteAnnouncement: (id: string): void => {
    memoryAnnouncements = memoryAnnouncements.filter((a) => a.id !== id);
  },

  resetDefaults: (): void => {
    memoryAnnouncements = [...DEFAULT_ANNOUNCEMENTS];
  },
};
