# 17. Guía de Resolución de Problemas (Troubleshooting) y Glosario

## 17.1 Guía de Resolución de Problemas Frecuentes

### Problema 1: Error en Git `fatal: .git/index: index file smaller than expected`
- **Síntoma:** Los comandos de Git fallan indicando que el índice está corrupto o truncado en 0 bytes.
- **Causa:** En entornos Windows NTFS, observadores de archivos en segundo plano (como Chokidar en Vite sin exclusión) interceptan el archivo temporal `.git/index.lock` durante operaciones atómicas de renombrado.
- **Solución Definitiva:**
  1. Ejecutar en PowerShell:
     ```powershell
     powershell -Command "Remove-Item -Path .git/index -Force; git reset HEAD; git status"
     ```
  2. Verificar que en `vite.config.ts` se mantenga la exclusión:
     ```ts
     server: { watch: { ignored: ['**/.git/**', '**/dist/**', '**/node_modules/**'] } }
     ```

### Problema 2: Subrayado rojo o error residual en `tsconfig.json` en VS Code
- **Síntoma:** El editor muestra un error en la línea de alias o rutas a pesar de que `npx tsc --noEmit` pasa con 0 errores.
- **Causa:** Memoria caché desincronizada en el servidor de lenguaje interno de TypeScript de VS Code.
- **Solución:**
  1. Presionar `Ctrl + Shift + P` en VS Code.
  2. Ejecutar el comando: **`TypeScript: Restart TS Server`**.

### Problema 3: Error de autenticación o bloqueo por RLS en Supabase
- **Síntoma:** Las consultas retornan un arreglo vacío `[]` o error `403 Forbidden` al consultar informes.
- **Causa:** El usuario autenticado no tiene un perfil asociado en `public.profiles` o no cumple la condición de la política RLS.
- **Solución:**
  1. Verificar en el Table Editor de Supabase que exista el registro correspondiente en la tabla `profiles` con el mismo `id` de `auth.users`.
  2. Comprobar que el rol (`publicador`, `anciano`, etc.) esté asignado correctamente.

---

## 17.2 Glosario de Términos Teocráticos y Técnicos

- **Publicador:** Miembro de la congregación que participa activamente en el ministerio del campo.
- **Precursor Regular:** Evangelizador de tiempo completo con una meta canónica de horas anuales (600 horas en el año de servicio).
- **Precursor Auxiliar:** Publicador que asume temporalmente una meta mensual especial de horas (generalmente 30 o 15 horas).
- **Año de Servicio:** Ciclo administrativo oficial que comprende 12 meses consecutivos desde el 1 de Septiembre hasta el 31 de Agosto.
- **Tarjeta S-21:** *Registro de publicador de la congregación*, expediente oficial individual donde se asienta la actividad de cada mes.
- **Informe S-1:** *Informe mensual de la congregación*, documento oficial que el secretario remite a la Sucursal con las cifras consolidadas.
- **RLS (Row-Level Security):** Mecanismo de seguridad a nivel de motor de base de datos en PostgreSQL que filtra el acceso a filas según la identidad del usuario autenticado.
- **PWA (Progressive Web App):** Aplicación web que aprovecha capacidades modernas de navegadores para ofrecer instalación local y funcionamiento offline.
