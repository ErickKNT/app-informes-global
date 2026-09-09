# 1. Identidad del Proyecto y Alcance Técnico

## 1.1 Ficha Técnica de Identidad
- **Nombre Oficial del Proyecto:** Gestión de Informes Teocráticos (Portal Congregacional de Servicio & Registro)
- **Repositorio Git:** `ErickKNT/app-informes-global`
- **Rama Principal:** `main`
- **Versión Actual:** `1.0.0` (Producción Estable)
- **Tipo de Aplicación:** Single Page Application (SPA) + Progressive Web App (PWA) con soporte Offline.
- **Licencia:** Privada / Uso exclusivo congregacional.

## 1.2 Propósito y Justificación del Sistema
La administración del ministerio del campo y la secretaría en las congregaciones de los Testigos de Jehová requiere una recopilación rigurosa y mensual de la actividad de evangelización de cada publicador, el seguimiento del progreso de los precursores (regulares y auxiliares), el control de la asistencia a las reuniones semanales y la remisión oportuna de las cifras a la Sucursal nacional dentro de los primeros días de cada mes calendario.

Históricamente, este proceso se gestionaba mediante tiras de papel físico o mensajes informales y fragmentados a través de mensajería instantánea. Dicho flujo tradicional presenta serias deficiencias:
1. **Pérdida de datos e informes extraviados:** Retrasos crónicos en la entrega de informes que dificultan el cierre antes del día 6 del mes.
2. **Sobrecarga administrativa del secretario:** Necesidad de transcribir manualmente cada informe en las tarjetas de registro S-21 individuales y tabular los totales para el informe S-1 de la Sucursal.
3. **Falta de visibilidad para los encargados de grupo:** Dificultad para saber en tiempo real qué publicadores de su grupo han entregado su informe y quiénes necesitan estímulo pastoral.
4. **Fallas de privacidad y seguridad:** Exposición de datos de contacto o registros ministeriales cuando se transmiten por canales no cifrados o grupos abiertos.

El sistema **Gestión de Informes Teocráticos** resuelve integralmente esta problemática mediante una plataforma web segura, reactiva, accesible desde cualquier dispositivo móvil o de escritorio, y protegida por un modelo de control de acceso teocrático basado en roles (3 niveles).

## 1.3 Alcance Funcional
### Módulos Implementados en el Alcance
- **Módulo de Autenticación y Perfil:** Inicio de sesión seguro con roles diferenciados (`publicador`, `anciano`, `siervo_ministerial`, `secretario`), demo de un clic para entornos de prueba y visualización del grupo asignado.
- **Módulo "Mi Informe Mensual":** Registro ágil del informe personal de predicación con validación en tiempo real:
  - Publicadores regulares: casilla de participación y conteo de estudios bíblicos.
  - Precursores regulares y auxiliares: registro obligatorio de horas ministeriales y estudios bíblicos.
  - Alerta de estado (`Borrador`, `Enviado`, `Confirmado`).
- **Módulo "Grupos de Servicio":**
  - Vista segregada por grupo de predicación.
  - Tabla de publicadores con estados de entrega (`Entregado` vs `Pendiente`).
  - Registro Asistido: Permite al encargado ingresar el informe a nombre de un publicador que lo proporcionó por vía telefónica o presencial.
  - Gestión de grupos (Crear, Editar y Eliminación asistida con reasignación de publicadores).
- **Módulo "Panel General (Dashboard)":**
  - Indicadores clave de rendimiento (KPIs): Total de horas, promedio histórico, porcentaje de cumplimiento, publicadores activos y precursores al día.
  - Tabla de estado de entrega por grupos con desglose de avance.
  - Tarjeta de alertas pastorales (publicadores irregulares, enfermos o con necesidad de apoyo).
  - Centro de recordatorios por WhatsApp con personalización automática y modo de prueba interactivo.
  - Cierre oficial del ciclo mensual con checklist de 3 puntos y transición automática de mes activo.
- **Módulo "Asistencia a Reuniones":**
  - Registro de asistencia semanal para la *Reunión de Entre Semana* (Vida y Ministerio) y *Reunión de Fin de Semana* (Discurso Público y Estudio de La Atalaya).
  - Cálculo automático de promedios mensuales requeridos por la secretaría.
- **Módulo "Reportes Consolidados":**
  - Tabla canónica S-21-S con historial mensual de toda la congregación.
  - Gráfica comparativa histórica interactiva.
  - Análisis de cumplimiento de la meta anual de 600 horas para precursores regulares.
  - Modal del **Informe Mensual para la Sucursal (Formato S-1)** con copia al portapapeles en 1 clic y soporte de impresión formal.
  - Exportación de resúmenes en formato PDF y hojas de cálculo Excel.
- **Módulo "Tarjetas de Publicador (S-21)":**
  - Expediente individual teocrático con cuadrícula de 12 meses (Año de Servicio de Septiembre a Agosto).
  - Edición de privilegios de servicio, transferencias entre grupos y baja de publicadores.
  - **Importador Masivo CSV:** Carga de nómina congregacional completa con auto-detección de delimitadores y previsualización.
- **Módulo "Tablón de Anuncios":**
  - Publicación de avisos oficiales con niveles de prioridad (`Importante` en ámbar vs `General`), fechas de evento y salón asignado.
- **Soporte PWA y Offline:**
  - Manifiesto web standalone, íconos institucionales (sin cruces) y Service Worker para uso sin conexión a internet.

### Límites del Sistema (Out of Scope)
- **No gestiona fondos ni cuentas congregacionales:** La administración de donaciones, cuentas bancarias y gastos de mantenimiento del Salón del Reino está excluida por diseño.
- **No se conecta directamente con los servidores de jw.org:** Por razones de seguridad teocrática y políticas de la organización, no existe una API pública hacia el portal mundial; el sistema genera el formato estructurado idéntico al S-1 para que el secretario ingrese las cifras consolidadas en menos de 2 minutos.

## 1.4 Usuarios Objetivo y Perfiles
1. **Publicador:** Cualquier miembro activo de la congregación (bautizado o publicador no bautizado). Su único objetivo es ingresar su informe de forma sencilla antes del día 5 del mes.
2. **Encargado de Grupo de Servicio:** Anciano o siervo ministerial asignado para supervisar espiritualmente un grupo de predicación. Requiere auditar las entregas de su grupo, registrar informes de hermanos mayores y enviar recordatorios amables.
3. **Secretario / Anciano General:** Miembro del cuerpo de ancianos responsable de los archivos congregacionales, tarjetas S-21, reportes a la Sucursal y mantenimiento de grupos.

## 1.5 Suposiciones y Restricciones
- **Año de Servicio Teocrático:** El ciclo anual corre canónicamente del 1 de Septiembre al 31 de Agosto del año siguiente.
- **Regla de Horas de Predicación:** Desde el ajuste teocrático global de 2023, los publicadores generales **no reportan horas**, únicamente marcan si participaron en la predicación y el número de estudios bíblicos. El registro de horas es de uso estricto para precursores regulares y auxiliares.
- **Simbología:** No deben utilizarse íconos de cruces ni elementos gráficos contrarios a las creencias de los Testigos de Jehová. Se utilizan edificios institucionales (`Building2`) y libros abiertos.
- **Disponibilidad Offline:** La aplicación debe ser capaz de abrirse y permitir la consulta en Salones del Reino con cobertura móvil deficiente.

## 1.6 Estado Actual y Hoja de Ruta
- **Estado Actual:** `IMPLEMENTADO Y VALIDADO EN PRODUCCIÓN (v1.0.0)`.
- **Suite de Pruebas:** 182 pruebas unitarias e integración pasando al 100% (58 suites).
- **Compilación:** Cero errores de TypeScript (`npx tsc --noEmit`), empaquetado Vite limpio en 3.84s.
