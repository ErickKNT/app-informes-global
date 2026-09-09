# 13. DevOps, Ambientes, Despliegue y Recuperación ante Desastres

## 13.1 Definición de Ambientes

| Ambiente | Propósito | URL / Host | Base de Datos | Variables de Entorno | Estrategia de Datos |
|---|---|---|---|---|---|
| **Local (Development)** | Desarrollo diario de nuevas características y depuración | `http://localhost:5173` | Supabase Cloud (Proyecto de Desarrollo) o Mock Local | `.env.local` | Datos de prueba (*Seed data*) con hermanos simulados |
| **Staging (Pre-producción)** | Pruebas de aceptación con ancianos y verificación de migraciones | `https://staging-app-informes.vercel.app` | Supabase Staging Database | Vercel Environment Variables (Preview) | Réplica anonimizada de datos para auditoría previa |
| **Production** | Operación real y confidencial de la secretaría de la congregación | `https://informes.mi-congregacion.org` | Supabase Production Instance (PostgreSQL 15) | Hosting Production Variables (Protegidas) | Cifrado en reposo, backups continuos y RLS estricto |

> [!CAUTION]
> Queda terminantemente prohibido desarrollar o ejecutar pruebas manuales de migración directamente sobre el ambiente de Producción.

---

## 13.2 Guía de Despliegue Paso a Paso (Vercel / Netlify + Supabase)

### Paso 1: Configuración de la Base de Datos en Supabase
1. Iniciar sesión en el portal de [Supabase](https://supabase.com/dashboard) y seleccionar el proyecto destino.
2. Navegar a **SQL Editor**, crear una nueva consulta y pegar el contenido completo de [`supabase_schema.sql`](file:///c:/Desarrollo/Desarrollo/Desarrollo%20web/App_informes/supabase_schema.sql).
3. Ejecutar el script y confirmar que aparezca el mensaje de éxito (*Success. No rows returned*).
4. En **Project Settings -> API**, copiar los valores de:
   - `Project URL`
   - `anon public key`

### Paso 2: Configuración del Frontend en la Plataforma de Hosting
1. Vincular el repositorio de GitHub `ErickKNT/app-informes-global` al proyecto en Vercel, Netlify o Cloudflare Pages.
2. Definir los parámetros de compilación:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
3. Configurar las Variables de Entorno en el panel de hosting:
   - `VITE_SUPABASE_URL`: *URL copiada en el Paso 1*
   - `VITE_SUPABASE_ANON_KEY`: *anon public key copiada en el Paso 1*

### Paso 3: Despliegue y Verificación de Humo (Smoke Testing)
1. Iniciar el despliegue automático desde la rama `main`.
2. Una vez completado, acceder a la URL pública generada y validar:
   - Carga limpia de la pantalla de login con protocolo HTTPS activo.
   - Navegación hacia *"Mi Informe Mensual"*.
   - Comprobación del registro del Service Worker en la consola del navegador.

---

## 13.3 Procedimiento de Rollback (Reversión Inmediata)
En caso de detectarse un fallo crítico tras un despliegue:
1. **Reversión en Hosting:** En el panel de Vercel/Netlify, acceder a la pestaña **Deployments**, ubicar el despliegue estable anterior y pulsar **Instant Rollback / Promote to Production**. Esta acción toma menos de 10 segundos.
2. **Reversión en Git:**
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## 13.4 Estrategia de Backups y Recuperación ante Desastres (Disaster Recovery)
1. **Copias Automatizadas de PostgreSQL:** Supabase ejecuta respaldos diarios automáticos (Point-in-Time Recovery - PITR en planes Pro).
2. **Respaldo Teocrático en Texto Plano:** La secretaría debe exportar mensualmente los informes consolidados en formato S-21-S y S-1 tras el cierre oficial de ciclo, conservando copias en medios de almacenamiento seguro externos.
