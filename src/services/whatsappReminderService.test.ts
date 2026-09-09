import { describe, it, expect } from 'vitest';
import { whatsappReminderService } from './whatsappReminderService';

describe('whatsappReminderService', () => {
  it('normaliza números de teléfono eliminando caracteres especiales', () => {
    expect(whatsappReminderService.cleanPhoneNumber('+52 55 1234-5678')).toBe('525512345678');
    expect(whatsappReminderService.cleanPhoneNumber('+34 (612) 889 012')).toBe('34612889012');
    expect(whatsappReminderService.cleanPhoneNumber('55-9876.5432')).toBe('5598765432');
  });

  it('genera el mensaje adecuado cuando hay publicadores pendientes', () => {
    const msg = whatsappReminderService.generateReminderMessage({
      overseerName: 'Carlos Méndez',
      groupName: 'Grupo 1 - Los Olivos',
      pendingCount: 3,
      totalPublishers: 19,
      monthName: 'Octubre 2024',
      deadlineDay: 6,
    });

    expect(msg).toContain('Carlos Méndez');
    expect(msg).toContain('Grupo 1 - Los Olivos');
    expect(msg).toContain('3 de 19');
    expect(msg).toContain('día 6');
    expect(msg).toContain('Octubre 2024');
  });

  it('genera mensaje de felicitación cuando el grupo está al 100%', () => {
    const msg = whatsappReminderService.generateReminderMessage({
      overseerName: 'Fernando Ruiz',
      groupName: 'Grupo 2 - Betel',
      pendingCount: 0,
      totalPublishers: 18,
      monthName: 'Octubre 2024',
    });

    expect(msg).toContain('Fernando Ruiz');
    expect(msg).toContain('Grupo 2 - Betel');
    expect(msg).toContain('100% de los informes recopilados');
    expect(msg).toContain('18 de 18 publicadores');
  });

  it('construye la URL de wa.me correctamente codificada', () => {
    const url = whatsappReminderService.generateWhatsAppUrl(
      '+52 55 1234 5678',
      'Hola hermano Carlos'
    );

    expect(url).toBe('https://wa.me/525512345678?text=Hola%20hermano%20Carlos');
  });
});

