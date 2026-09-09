import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { whatsappReminderService } from '@/services/whatsappReminderService';
import {
  X,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  FlaskConical,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface GroupReminderData {
  id: string;
  groupNumber: number;
  name: string;
  overseerName: string;
  overseerPhone: string;
  publishersCount: number;
  reportedCount: number;
}

export interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: GroupReminderData[];
  monthName?: string;
  deadlineDay?: number;
  defaultTestPhone?: string;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  isOpen,
  onClose,
  groups,
  monthName = 'Octubre 2024',
  deadlineDay = 6,
  defaultTestPhone = '+52 ',
}) => {
  const [isTestMode, setIsTestMode] = useState(true);
  const [testPhoneNumber, setTestPhoneNumber] = useState(defaultTestPhone);
  const [contactedGroupIds, setContactedGroupIds] = useState<Set<string>>(new Set());
  const [copiedGroupId, setCopiedGroupId] = useState<string | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyMessage = async (group: GroupReminderData) => {
    const pendingCount = Math.max(0, group.publishersCount - group.reportedCount);
    const text = whatsappReminderService.generateReminderMessage({
      overseerName: group.overseerName,
      groupName: group.name,
      pendingCount,
      totalPublishers: group.publishersCount,
      monthName,
      deadlineDay,
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopiedGroupId(group.id);
      setTimeout(() => setCopiedGroupId(null), 2500);
    } catch {
      // Fallback si no hay permisos de portapapeles
    }
  };

  const handleSendWhatsApp = (group: GroupReminderData) => {
    const pendingCount = Math.max(0, group.publishersCount - group.reportedCount);
    const message = whatsappReminderService.generateReminderMessage({
      overseerName: group.overseerName,
      groupName: group.name,
      pendingCount,
      totalPublishers: group.publishersCount,
      monthName,
      deadlineDay,
    });

    const targetPhone = isTestMode && testPhoneNumber.trim()
      ? testPhoneNumber
      : group.overseerPhone;

    const url = whatsappReminderService.generateWhatsAppUrl(targetPhone, message);
    window.open(url, '_blank', 'noopener,noreferrer');

    setContactedGroupIds((prev) => new Set([...prev, group.id]));
  };

  const handleSendQuickTest = () => {
    if (!testPhoneNumber.trim()) return;
    const testMessage =
      `*Mensaje de Prueba - Sistema Congregacional*\n\n` +
      `¡Hola! Esta es una prueba exitosa de envío de recordatorios de informes por WhatsApp para el mes de *${monthName}*.\n\n` +
      `El sistema está listo para enviar avisos teocráticos a los encargados de grupo.`;

    const url = whatsappReminderService.generateWhatsAppUrl(testPhoneNumber, testMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-200"
    >
      <div
        className={cn(
          'bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-2xl',
          'w-full max-w-2xl max-h-[calc(100dvh-2rem)] overflow-hidden flex flex-col my-auto'
        )}
      >
        {/* Header del Modal */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 bg-surface-container-low border-b border-surface-container-high/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-xs shrink-0">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <h2 id="reminder-modal-title" className="font-headline text-base font-bold text-on-surface">
                Centro de Recordatorios por WhatsApp
              </h2>
              <span className="text-xs text-on-surface-variant font-medium">
                Supervisión del mes: <strong className="text-primary">{monthName}</strong> · Cierre límite día {deadlineDay}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-5 overscroll-contain">
          {/* Card de Configuración de Modo de Prueba */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Modo de Prueba con mi WhatsApp
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-on-surface select-none">
                <input
                  type="checkbox"
                  checked={isTestMode}
                  onChange={(e) => setIsTestMode(e.target.checked)}
                  className="rounded border-outline text-emerald-600 focus:ring-emerald-500/40 w-4 h-4"
                />
                <span>Redirigir envíos a mi número de prueba</span>
              </label>
            </div>

            {isTestMode && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                <div className="relative flex-1">
                  <Input
                    type="tel"
                    placeholder="+52 55 1234 5678 (con código de país)"
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                    className="pl-9 text-xs"
                    aria-label="Número de WhatsApp de prueba"
                  />
                  <Smartphone className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSendQuickTest}
                  disabled={!testPhoneNumber.trim()}
                  className="text-xs shrink-0 flex items-center justify-center gap-1.5 border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Probar mi número</span>
                </Button>
              </div>
            )}
            <p className="text-[11px] text-on-surface-variant">
              {isTestMode
                ? 'Los botones de abajo abrirán WhatsApp con tu número de prueba para que verifiques el mensaje en tu teléfono.'
                : 'Modo real activo: Los mensajes se enviarán al número asignado a cada encargado.'}
            </p>
          </div>

          {/* Listado de Encargados de Grupo */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-outline uppercase tracking-wider px-1">
              Encargados de Grupo ({groups.length})
            </span>

            {groups.map((group) => {
              const pendingCount = Math.max(0, group.publishersCount - group.reportedCount);
              const isComplete = pendingCount === 0;
              const isContacted = contactedGroupIds.has(group.id);
              const isExpanded = expandedGroupId === group.id;
              const isCopied = copiedGroupId === group.id;

              const previewText = whatsappReminderService.generateReminderMessage({
                overseerName: group.overseerName,
                groupName: group.name,
                pendingCount,
                totalPublishers: group.publishersCount,
                monthName,
                deadlineDay,
              });

              return (
                <div
                  key={group.id}
                  className={cn(
                    'p-4 rounded-2xl border transition-all flex flex-col gap-3',
                    isComplete
                      ? 'bg-surface-container-low/40 border-surface-container-high/60'
                      : 'bg-surface-container-lowest border-surface-container-high shadow-xs'
                  )}
                >
                  {/* Encabezado de la Fila del Encargado */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0',
                          isComplete
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-primary-container text-on-primary'
                        )}
                      >
                        {group.groupNumber}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-on-surface truncate">
                            {group.overseerName}
                          </span>
                          <span className="text-[11px] text-outline">· {group.name}</span>
                          {isContacted && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Contactado
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-on-surface-variant font-mono">
                            {isTestMode ? `Prueba → ${testPhoneNumber}` : group.overseerPhone}
                          </span>
                          <span className="text-outline-variant">·</span>
                          <span
                            className={cn(
                              'text-[11px] font-semibold',
                              isComplete ? 'text-emerald-600' : 'text-error'
                            )}
                          >
                            {isComplete
                              ? '100% Entregados'
                              : `${pendingCount} pendientes de ${group.publishersCount}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(group)}
                        className={cn(
                          'p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors',
                          isCopied
                            ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                            : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                        )}
                        title="Copiar texto del mensaje"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{isCopied ? 'Copiado' : 'Copiar'}</span>
                      </button>

                      <Button
                        size="sm"
                        variant={isComplete ? 'outline' : 'primary'}
                        onClick={() => handleSendWhatsApp(group)}
                        className={cn(
                          'text-xs flex items-center gap-1.5 px-3 py-2',
                          !isComplete && 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
                        )}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir WhatsApp</span>
                      </Button>
                    </div>
                  </div>

                  {/* Vista Previa Expandible */}
                  <div className="border-t border-surface-container-high/40 pt-2">
                    <button
                      type="button"
                      onClick={() => setExpandedGroupId(isExpanded ? null : group.id)}
                      className="text-[11px] text-outline hover:text-primary flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>{isExpanded ? 'Ocultar vista previa del mensaje' : 'Ver mensaje que se enviará'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3 rounded-xl bg-surface-container-low/80 border border-surface-container-high/60 text-xs text-on-surface font-sans whitespace-pre-line leading-relaxed animate-in fade-in">
                        {previewText}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="flex-shrink-0 p-4 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between">
          <span className="text-[11px] text-outline">
            {contactedGroupIds.size} de {groups.length} encargados contactados
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

WhatsAppReminderModal.displayName = 'WhatsAppReminderModal';
