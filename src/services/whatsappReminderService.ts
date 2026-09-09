export interface ReminderMessageParams {
  overseerName: string;
  groupName: string;
  pendingCount: number;
  totalPublishers: number;
  monthName?: string;
  deadlineDay?: number;
}

export const whatsappReminderService = {
  /**
   * Normaliza un número telefónico para su uso en URLs de wa.me.
   * Elimina cualquier carácter no numérico conservando solo dígitos (ej. +52 55 1234 -> 52551234).
   */
  cleanPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
  },

  /**
   * Genera el texto formal y cálido del recordatorio teocrático.
   */
  generateReminderMessage({
    overseerName,
    groupName,
    pendingCount,
    totalPublishers,
    monthName = 'Octubre 2024',
    deadlineDay = 6,
  }: ReminderMessageParams): string {
    if (pendingCount <= 0) {
      return (
        `Estimado hermano ${overseerName}, te saludamos cariñosamente de la secretaría de la congregación.\n\n` +
        `¡Muchas felicidades y gracias por tu excelente labor! Nos alegra informarte que el *${groupName}* ya tiene el 100% de los informes recopilados para el mes de *${monthName}* (${totalPublishers} de ${totalPublishers} publicadores).\n\n` +
        `Agradecemos profundamente tu dedicación y amoroso pastoreo.`
      );
    }

    return (
      `Estimado hermano ${overseerName}, te saludamos cariñosamente de la secretaría de la congregación.\n\n` +
      `Te compartimos el recordatorio del informe de servicio de *${monthName}*:\n` +
      `• *Grupo:* ${groupName}\n` +
      `• *Publicadores pendientes:* ${pendingCount} de ${totalPublishers}\n\n` +
      `Agradecemos mucho tu valioso apoyo para recopilar los informes pendientes antes del *día ${deadlineDay}* para poder cerrar el informe congregacional a tiempo.\n\n` +
      `¡Muchas gracias por tu amor y continuo servicio!`
    );
  },

  /**
   * Construye la URL universal de WhatsApp (wa.me) con el número y el mensaje codificado en URI.
   */
  generateWhatsAppUrl(phone: string, message: string): string {
    const cleanedPhone = this.cleanPhoneNumber(phone);
    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${cleanedPhone}?text=${encodedText}`;
  },
};
