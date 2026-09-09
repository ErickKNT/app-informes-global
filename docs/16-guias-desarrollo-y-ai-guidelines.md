# 16. Guía de Desarrollo, Estándares de Código y AI Guidelines

## 16.1 AI DEVELOPMENT GUIDELINES (Instrucciones Mandatorias para Agentes de IA)
Cualquier modelo o agente de IA que trabaje sobre este repositorio en el futuro debe acatar de forma estricta las siguientes reglas operativas:

> [!IMPORTANT]
> **REGLA FUNDAMENTAL PARA AGENTES DE IA:**
> Queda terminantemente prohibido modificar código fuente sin comprender previamente la arquitectura existente, verificar las pruebas existentes y evaluar el impacto lateral del cambio.

### Reglas Específicas para Agentes:
1. **No alucinaciones de dependencias ni tablas:** No asumas que existen tablas o librerías adicionales que no figuren en [`supabase_schema.sql`](file:///c:/Desarrollo/Desarrollo/Desarrollo%20web/App_informes/supabase_schema.sql) o [`package.json`](file:///c:/Desarrollo/Desarrollo/Desarrollo%20web/App_informes/package.json).
2. **Respeto al Atomic Design:** Al crear nuevos componentes, ubícalos en su carpeta correspondiente (`atoms/`, `molecules/`, `organisms/`) e incluye siempre su archivo de exportación `index.ts` y su suite de pruebas `<Nombre>.test.tsx`.
3. **Mantenimiento del 100% de Pruebas:** Antes de dar por concluida una tarea, es obligatorio ejecutar:
   ```bash
   npx tsc --noEmit
   npm test -- --run
   npm run build
   ```
   Cualquier regresión o prueba rota debe resolverse inmediatamente.
4. **Respeto a las Convenciones Teocráticas:**
   - Jamás utilizar íconos de cruces; utilizar `Building2` de Lucide React.
   - El año de servicio teocrático abarca de Septiembre a Agosto.
   - Los publicadores generales solo reportan participación y estudios; las horas corresponden exclusivamente a precursores.
5. **No exponer claves secretas:** Jamás incluir `service_role` ni contraseñas en archivos accesibles por el frontend.

---

## 16.2 Estándares y Convenciones de Codificación
- **Nombres de Archivos:**
  - Componentes React: PascalCase (ej. `MonthlyReportPage.tsx`, `BranchReportSummaryModal.tsx`).
  - Servicios, hooks y utilidades: camelCase (ej. `publishersService.ts`, `useMonthlyReport.ts`, `cn.ts`).
- **Exportaciones:** Siempre utilizar exportaciones nombradas acompañadas de un archivo barril `index.ts` por componente.
- **Tipado Estricto:** Evitar el uso de `any`. Definir tipos explícitos para todas las funciones, props y retornos.
- **Comentarios en el Código:** Los comentarios deben explicar el **POR QUÉ** de una decisión de negocio o técnica, no repetir lo evidente que el código ya expresa.
