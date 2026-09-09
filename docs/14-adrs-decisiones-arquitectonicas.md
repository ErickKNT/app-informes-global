# 14. Architecture Decision Records (ADRs)

A continuación se documentan formalmente las decisiones arquitectónicas fundamentales adoptadas en el proyecto:

---

### ADR-001: Adopción de Atomic Design para la Arquitectura de Componentes
- **Fecha:** 2024-09-01 | **Estado:** ACEPTADO
- **Contexto:** La interfaz requería escalar desde elementos atómicos (botones, badges, inputs) hasta formularios complejos con lógica teocrática (tarjeta S-21, cierre de mes).
- **Decisión:** Organizar los componentes en 5 capas: `atoms/`, `molecules/`, `organisms/`, `templates/` y `pages/`.
- **Consecuencias:** Máxima reusabilidad, pruebas unitarias aisladas y consistencia visual garantizada en todo el sistema.

---

### ADR-002: Modelo de Control de Acceso por Roles en 3 Niveles Teocráticos
- **Fecha:** 2024-09-05 | **Estado:** ACEPTADO
- **Contexto:** Los publicadores solo deben ver su informe; los encargados deben supervisar únicamente a su grupo; los ancianos y el secretario deben auditar toda la congregación.
- **Decisión:** Implementar 3 niveles de autorización reflejados tanto en la UI (guards reactivos) como en la base de datos (políticas RLS con funciones `is_admin_or_elder` e `is_group_overseer`).
- **Consecuencias:** Cumplimiento estricto de la privacidad congregacional y principio de menor privilegio (Least Privilege).

---

### ADR-003: Persistencia Híbrida (Supabase PostgreSQL + Modo Offline / PWA)
- **Fecha:** 2024-09-06 | **Estado:** ACEPTADO
- **Contexto:** En muchas áreas y Salones del Reino la conectividad celular es inestable o nula.
- **Decisión:** Utilizar Supabase como backend principal en la nube, pero dotar a la aplicación de un Service Worker con estrategia *stale-while-revalidate* y estado local en memoria para funcionamiento sin conexión.
- **Consecuencias:** La app nunca queda bloqueada por caídas de red y permite consultar datos en cualquier circunstancia.

---

### ADR-004: Integración de WhatsApp mediante Protocolo Universal URI (`wa.me`)
- **Fecha:** 2024-09-07 | **Estado:** ACEPTADO
- **Contexto:** Se requería notificar a los encargados sobre la fecha límite de entrega de informes.
- **Decisión:** Descartar servicios de mensajería de terceros o bots de pago que violarían términos de servicio o requerirían credenciales costosas, optando por enlaces profundos universales `https://wa.me/{phone}?text={mensaje}` con personalización teocrática automática y modo de prueba.
- **Consecuencias:** Cero costo de infraestructura, compatibilidad universal con WhatsApp Web y aplicaciones móviles en Android/iOS, y respeto absoluto a la privacidad.

---

### ADR-005: Formato Canónico y Flujo de Cierre de Mes (S-1 y S-21)
- **Fecha:** 2024-09-08 | **Estado:** ACEPTADO
- **Contexto:** La congregación debe enviar cifras oficiales a la Sucursal y archivar las tarjetas de registro de 12 meses.
- **Decisión:** Construir el modal oficial S-1 con copia al portapapeles en 1 clic y el modal de cierre mensual con lista de comprobación de 3 puntos obligatorios.
- **Consecuencias:** Se elimina el error humano en el traspaso de información a la Sucursal y se garantiza que ningún mes se cierre sin verificar a todos los grupos.

---

### ADR-006: Validación en Runtime con Zod Desacoplada de la UI
- **Fecha:** 2024-09-08 | **Estado:** ACEPTADO
- **Contexto:** La lógica de validación de horas y estudios según el privilegio del publicador era propensa a inconsistencias si se programaba dentro de los componentes JSX.
- **Decisión:** Aislar las reglas de validación en esquemas puros Zod (`src/schemas/monthlyReportSchema.ts`) con mensajes en español y pruebas unitarias independientes.
- **Consecuencias:** Código de componentes más limpio y pruebas unitarias exhaustivas sin necesidad de renderizar el DOM.

---

### ADR-007: Eliminación de Project References en `tsconfig.json` para Vite
- **Fecha:** 2024-09-09 | **Estado:** ACEPTADO
- **Contexto:** El uso de `references` hacia `tsconfig.node.json` causaba errores de compilación TS6310 (*Referenced project may not disable emit*) en editores y CI.
- **Decisión:** Unificar la configuración en un solo `tsconfig.json` con `"include": ["src", "vite.config.ts"]`, eliminar `baseUrl` obsoleto y utilizar alias relativos directos `"@/*": ["./src/*"]`.
- **Consecuencias:** Compilación limpia con 0 errores, compatibilidad nativa con TypeScript 5.7+ y eliminación de archivos de configuración redundantes.

---

### ADR-008: Progressive Web App con Manifiesto Standalone e Iconografía Teocrática
- **Fecha:** 2024-09-09 | **Estado:** ACEPTADO
- **Contexto:** Los hermanos necesitaban instalar la aplicación en sus teléfonos como si fuera una app nativa, pero sin iconografía religiosa inapropiada (cruces).
- **Decisión:** Diseñar `manifest.webmanifest` con color temático institucional `#1E3A8A`, modo `standalone` e ícono vectorial del Salón del Reino (`Building2`).
- **Consecuencias:** Experiencia de usuario nativa e instalable en iOS y Android respetando los principios teocráticos de la congregación.
