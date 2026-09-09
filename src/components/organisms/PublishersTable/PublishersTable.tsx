import React, { useState, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { SearchBar } from '@/components/molecules/SearchBar';
import type { PublisherRole, ServicePrivilege } from '@/types/database.types';
import { Phone, CheckCircle2, Clock, PlusCircle } from 'lucide-react';

export interface PublisherListItem {
  id: string;
  name: string;
  phone: string | null;
  role: PublisherRole;
  privilege: ServicePrivilege;
  hasReported: boolean;
  hours: number | null;
  bibleStudies: number | null;
  avatarUrl?: string | null;
}

export type TableFilter = 'all' | 'publicador' | 'regular' | 'auxiliar' | 'pendiente';

export interface PublishersTableProps {
  publishers: PublisherListItem[];
  onRegisterReport?: (publisher: PublisherListItem) => void;
  className?: string;
}

export const PublishersTable: React.FC<PublishersTableProps> = ({
  publishers,
  onRegisterReport,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TableFilter>('all');

  const filteredPublishers = useMemo(() => {
    return publishers.filter((pub) => {
      // Búsqueda por texto
      const matchesSearch =
        pub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pub.phone && pub.phone.includes(searchQuery));

      if (!matchesSearch) return false;

      // Filtro por categoría
      switch (activeFilter) {
        case 'publicador':
          return pub.privilege === 'publicador';
        case 'regular':
          return pub.privilege === 'precursor_regular';
        case 'auxiliar':
          return pub.privilege === 'precursor_auxiliar';
        case 'pendiente':
          return !pub.hasReported;
        default:
          return true;
      }
    });
  }, [publishers, searchQuery, activeFilter]);

  const counts = useMemo(() => {
    return {
      all: publishers.length,
      publicadores: publishers.filter((p) => p.privilege === 'publicador').length,
      regulares: publishers.filter((p) => p.privilege === 'precursor_regular').length,
      auxiliares: publishers.filter((p) => p.privilege === 'precursor_auxiliar').length,
      pendientes: publishers.filter((p) => !p.hasReported).length,
    };
  }, [publishers]);

  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm flex flex-col overflow-hidden',
        className
      )}
    >
      {/* Header con Filtros y Buscador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-3 bg-surface-container-low/70 border-b border-surface-container-high">
        {/* Píldoras de Filtro */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors',
              activeFilter === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container-high'
            )}
          >
            Todos ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('publicador')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors',
              activeFilter === 'publicador'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container-high'
            )}
          >
            Publicadores ({counts.publicadores})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('regular')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors',
              activeFilter === 'regular'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container-high'
            )}
          >
            Precursores Regulares ({counts.regulares})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('auxiliar')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors',
              activeFilter === 'auxiliar'
                ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container-high'
            )}
          >
            Auxiliares ({counts.auxiliares})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('pendiente')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors',
              activeFilter === 'pendiente'
                ? 'bg-tertiary-fixed text-tertiary-container shadow-sm border border-tertiary-fixed-dim'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container-high'
            )}
          >
            Pendientes ({counts.pendientes})
          </button>
        </div>

        {/* Buscador */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar en el grupo..."
        />
      </div>

      {/* Tabla Responsiva */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 text-outline uppercase font-semibold text-[11px] tracking-wider border-b border-surface-container-high">
              <th scope="col" className="py-3 px-4 md:px-5">Publicador</th>
              <th scope="col" className="py-3 px-4">Nombramiento</th>
              <th scope="col" className="py-3 px-4 text-right">Horas</th>
              <th scope="col" className="py-3 px-4 text-center">Cursos</th>
              <th scope="col" className="py-3 px-4">Estado</th>
              <th scope="col" className="py-3 px-4 md:px-5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low text-xs">
            {filteredPublishers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-outline">
                  No se encontraron publicadores con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredPublishers.map((pub) => {
                const getPrivilegeBadgeVariant = () => {
                  if (pub.privilege === 'precursor_regular') return 'regular';
                  if (pub.privilege === 'precursor_auxiliar') return 'auxiliar';
                  return 'publicador';
                };

                const getPrivilegeLabel = () => {
                  if (pub.privilege === 'precursor_regular') return 'Precursor Regular';
                  if (pub.privilege === 'precursor_auxiliar') return 'Precursor Auxiliar';
                  return 'Publicador';
                };

                return (
                  <tr
                    key={pub.id}
                    className={cn(
                      'transition-colors',
                      pub.hasReported
                        ? 'hover:bg-surface-container-low/40'
                        : 'bg-tertiary-fixed/10 hover:bg-tertiary-fixed/20'
                    )}
                  >
                    {/* Publicador */}
                    <td className="py-3 px-4 md:px-5">
                      <div className="flex items-center gap-3">
                        <Avatar name={pub.name} src={pub.avatarUrl} size="md" />
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface leading-tight">
                            {pub.name}
                          </span>
                          {pub.phone && (
                            <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-outline" /> {pub.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Nombramiento */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1">
                        <Badge variant={getPrivilegeBadgeVariant()}>
                          {getPrivilegeLabel()}
                        </Badge>
                        {pub.role === 'anciano' && (
                          <Badge variant="info">Anciano</Badge>
                        )}
                        {pub.role === 'siervo_ministerial' && (
                          <Badge variant="info">Siervo Min.</Badge>
                        )}
                      </div>
                    </td>

                    {/* Horas */}
                    <td className="py-3 px-4 text-right font-semibold">
                      {pub.hasReported ? (
                        pub.privilege === 'publicador' ? (
                          <span className="inline-flex items-center gap-1 text-secondary font-medium text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                            <span>Participó</span>
                          </span>
                        ) : (
                          <span className="text-on-surface">{pub.hours} hrs</span>
                        )
                      ) : (
                        <span className="text-outline italic">Pendiente</span>
                      )}
                    </td>

                    {/* Cursos Bíblicos */}
                    <td className="py-3 px-4 text-center font-medium">
                      {pub.hasReported ? (
                        <span>{pub.bibleStudies}</span>
                      ) : (
                        <span className="text-outline">—</span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4">
                      {pub.hasReported ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                          Entregado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-tertiary-container font-semibold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-tertiary-container" />
                          Pendiente
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 md:px-5 text-right">
                      {!pub.hasReported && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => onRegisterReport && onRegisterReport(pub)}
                          className="text-[11px] py-1 px-2.5"
                          aria-label={`Registrar informe de ${pub.name}`}
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Registrar
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer de Resumen */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-surface-container-low/70 border-t border-surface-container-high text-xs text-on-surface-variant">
        <span>
          Mostrando <strong className="text-on-surface">{filteredPublishers.length}</strong> de {publishers.length} publicadores
        </span>
        <div className="flex items-center gap-3">
          <span className="text-secondary font-semibold">
            {publishers.filter((p) => p.hasReported).length} entregados
          </span>
          <span className="text-outline-variant">·</span>
          <span className="text-tertiary-container font-semibold">
            {counts.pendientes} pendientes
          </span>
        </div>
      </div>
    </div>
  );
};

PublishersTable.displayName = 'PublishersTable';

