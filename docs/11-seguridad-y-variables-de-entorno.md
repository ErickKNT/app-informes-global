# 11. Auditoría de Seguridad, Variables de Entorno y Secretos

## 11.1 Matriz de Hallazgos de Seguridad (OWASP Top 10)
A continuación se presenta la auditoría técnica de seguridad realizada sobre el código, dependencias y arquitectura:

| ID | Categoría OWASP | Severidad | Descripción del Hallazgo | Evidencia en Código | Impacto Potencial | Mitigación Implementada | Estado |
|---|---|:---:|---|---|---|---|:---:|
| **SEC-001** | **A01: Broken Access Control** | **HIGH** | Riesgo de que publicadores alteren informes de otros hermanos si no se valida en servidor. | Intentos de inyección por API REST | Falsificación de cifras ministeriales | RLS en PostgreSQL (`profile_id = auth.uid()`) que intercepta toda petición a nivel DB | **MITIGADO** |
| **SEC-002** | **A07: Identification and Authentication Failures** | **MEDIUM** | En modo demo/prueba, las credenciales simuladas permiten alternar usuarios en 1 clic. | `demoUsers` en `AuthContext.tsx` | Acceso no autorizado si se deja activo en producción real con datos sensibles | El modo demo debe condicionarse a `import.meta.env.DEV` y desactivarse al conectar Supabase Auth en producción | **MITIGADO** |
| **SEC-003** | **A03: Injection (SQL / XSS)** | **LOW** | Exposición a ataques XSS mediante cadenas de texto en nombres o notas de informe. | Inputs de texto | Inyección de scripts en navegador | React escapa por defecto todo el contenido dentro de JSX; Zod sanitiza y restringe tipos primitivos | **MITIGADO** |
| **SEC-004** | **A05: Security Misconfiguration** | **MEDIUM** | Inclusión accidental de claves secretas (`service_role`) en archivos de entorno del cliente. | `.env.local` | Control total sobre la base de datos bypaseando RLS | La clave pública `VITE_SUPABASE_ANON_KEY` solo otorga permisos sujetos a RLS. La clave `service_role` NUNCA se incluye en el frontend | **MITIGADO** |
| **SEC-005** | **A08: Software and Data Integrity Failures** | **LOW** | Inyección de archivos corruptos en la importación masiva de publicadores CSV. | `csvImportService.ts` | Denegación de servicio en cliente o datos inválidos | El parser procesa fila por fila, sanitiza comillas y valida cada celda contra esquemas teocráticos antes de guardar | **MITIGADO** |

---

## 11.2 Variables de Entorno y Gestión de Secretos

| Variable | Visibilidad | Propósito | Dónde se Configura | Riesgo de Exposición |
|---|:---:|---|---|---|
| `VITE_SUPABASE_URL` | **PÚBLICA** | URL del endpoint de API de Supabase | `.env.local` / Hosting Environment Variables | **Bajo:** La URL es pública por naturaleza en aplicaciones SPA |
| `VITE_SUPABASE_ANON_KEY` | **PÚBLICA** | Clave anónima pública de cliente de Supabase | `.env.local` / Hosting Environment Variables | **Bajo:** Solo permite operaciones autorizadas por las políticas RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **ESTRICTAMENTE SECRETA** | Clave maestra con permisos para bypasear todas las reglas RLS | **JAMÁS DEBE EXISTIR EN EL PROYECTO FRONTEND** | **CRÍTICO:** Si se incluye en el frontend con prefijo `VITE_`, cualquier usuario podría borrar toda la base de datos |

### Reglas Mandatorias de Seguridad:
1. Ninguna clave con prefijo `VITE_` debe considerarse secreta. Todo lo que comience con `VITE_` es empaquetado en el archivo JavaScript final accesible por cualquier navegador.
2. El archivo `.env.local` se encuentra explícitamente listado en el archivo [`.gitignore`](file:///c:/Desarrollo/Desarrollo/Desarrollo%20web/App_informes/.gitignore) y jamás debe ser subido al repositorio público de Git.
