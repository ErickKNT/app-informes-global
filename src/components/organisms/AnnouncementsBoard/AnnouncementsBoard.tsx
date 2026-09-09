import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';
import { announcementsService } from '@/services/announcementsService';
import type { Announcement } from '@/types/database.types';
import {
  Bell,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  AlertTriangle,
  Info,
  X,
  Megaphone,
} from 'lucide-react';

export interface AnnouncementsBoardProps {
  canManage?: boolean;
  className?: string;
}

export const AnnouncementsBoard: React.FC<AnnouncementsBoardProps> = ({
  canManage = false,
  className,
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'alta'>('normal');
  const [dateNote, setDateNote] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [authorName, setAuthorName] = useState('Cuerpo de Ancianos');

  const refreshAnnouncements = () => {
    setAnnouncements(announcementsService.getAnnouncements());
  };

  useEffect(() => {
    refreshAnnouncements();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCreateModalOpen(false);
      }
    };
    if (isCreateModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateModalOpen]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    announcementsService.addAnnouncement({
      title: title.trim(),
      content: content.trim(),
      priority,
      date_note: dateNote.trim() || null,
      location_note: locationNote.trim() || null,
      created_by: authorName.trim() || 'Cuerpo de Ancianos',
    });

    setTitle('');
    setContent('');
    setPriority('normal');
    setDateNote('');
    setLocationNote('');
    setIsCreateModalOpen(false);
    refreshAnnouncements();
  };

  const handleDelete = (id: string) => {
    announcementsService.deleteAnnouncement(id);
    refreshAnnouncements();
  };

  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-surface-container-high shadow-sm flex flex-col gap-4',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-surface-container-high pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-headline text-base md:text-lg font-bold text-on-surface flex items-center gap-2">
              Tablón de Anuncios
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                {announcements.length}
              </span>
            </h2>
            <p className="text-xs text-on-surface-variant">
              Comunicaciones oficiales y avisos importantes para la congregación
            </p>
          </div>
        </div>

        {canManage && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs flex items-center gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Anuncio</span>
          </Button>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="p-8 text-center text-on-surface-variant text-xs flex flex-col items-center gap-2">
          <Bell className="w-8 h-8 opacity-30 text-outline" />
          <p>No hay anuncios publicados en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((item) => {
            const isHighPriority = item.priority === 'alta';
            return (
              <div
                key={item.id}
                className={cn(
                  'rounded-xl p-4 border flex flex-col justify-between gap-3 transition-all',
                  isHighPriority
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-surface-container-low/40 border-surface-container-high/60'
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1',
                        isHighPriority
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                          : 'bg-surface-container text-on-surface-variant'
                      )}
                    >
                      {isHighPriority ? (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          <span>Importante</span>
                        </>
                      ) : (
                        <>
                          <Info className="w-3 h-3" />
                          <span>General</span>
                        </>
                      )}
                    </span>

                    {canManage && (
                      <button
                        type="button"
                        aria-label={`Eliminar anuncio ${item.title}`}
                        onClick={() => handleDelete(item.id)}
                        className="text-outline hover:text-error transition-colors p-1 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-on-surface tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-surface-container-high/60 flex flex-col gap-1 text-[11px] text-on-surface-variant">
                  {item.date_note && (
                    <div className="flex items-center gap-1.5 text-on-surface font-medium">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{item.date_note}</span>
                    </div>
                  )}
                  {item.location_note && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-outline shrink-0" />
                      <span>{item.location_note}</span>
                    </div>
                  )}
                  {item.created_by && (
                    <span className="text-[10px] text-outline mt-0.5">
                      Publicado por: {item.created_by}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-announcement-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCreateModalOpen(false);
          }}
          className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="flex min-h-full items-start sm:items-center justify-center py-2 sm:py-6 pointer-events-none">
            <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-2xl w-full max-w-lg max-h-[calc(100dvh-2.5rem)] flex flex-col overflow-hidden pointer-events-auto min-h-0">
              <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 bg-surface-container-low border-b border-surface-container-high">
                <h3 id="new-announcement-title" className="font-headline text-base font-bold text-on-surface">
                  Publicar Nuevo Anuncio
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-outline hover:text-on-surface p-1 rounded-lg shrink-0 transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 flex flex-col gap-3.5 overscroll-contain">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Título del Anuncio *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Visita del Superintendente de Circuito"
                      className="w-full text-xs bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Contenido / Mensaje *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Detalles sobre el anuncio..."
                      className="w-full text-xs bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Prioridad
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as 'normal' | 'alta')}
                        className="w-full text-xs bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 text-on-surface focus:outline-none"
                      >
                        <option value="normal">Normal / General</option>
                        <option value="alta">Alta / Importante</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Publicado Por
                      </label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Ej. Cuerpo de Ancianos"
                        className="w-full text-xs bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 text-on-surface focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Fecha / Horario (Opcional)
                      </label>
                      <input
                        type="text"
                        value={dateNote}
                        onChange={(e) => setDateNote(e.target.value)}
                        placeholder="Ej. Sábado 9:00 AM"
                        className="w-full text-xs bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 text-on-surface focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Lugar / Salón (Opcional)
                      </label>
                      <input
                        type="text"
                        value={locationNote}
                        onChange={(e) => setLocationNote(e.target.value)}
                        placeholder="Ej. Salón Principal"
                        className="w-full text-xs bg-surface-container-low border border-surface-container-high rounded-xl p-2.5 text-on-surface focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 p-4 bg-surface-container-low border-t border-surface-container-high flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="text-xs">
                    Publicar Anuncio
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AnnouncementsBoard.displayName = 'AnnouncementsBoard';
