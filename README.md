# Servicio & Registro · Portal Congregacional

Sistema web para la administración teocrática, supervisión por grupos y consolidación mensual de informes de servicio del campo (Formatos S-21, S-1 y S-88).

---

## 🏛️ Arquitectura del Software

Este proyecto está construido con principios estrictos de **Clean Architecture** y **Atomic Design**:

- **Framework:** React 18 + Vite + TypeScript (Modo estricto `noImplicitAny`, `strictNullChecks`).
- **Diseño & UI:** Tailwind CSS con la paleta y tokens de diseño *"Serene Stewardship"*.
- **Metodología UI:** **Atomic Design** (`atoms`, `molecules`, `organisms`, `templates`, `pages`).
- **Backend & Base de Datos:** Supabase (PostgreSQL 15+, Row Level Security, Supabase Auth).
- **Validación:** Zod schemas defensivos.
- **Testing:** Vitest + React Testing Library + jest-dom.

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── atoms/          # Bloques indivisibles (Button, Input, Badge, Icon...)
│   ├── molecules/      # Combinaciones funcionales (FormField, SearchBar, MetricPill...)
│   ├── organisms/      # Módulos autónomos (PublishersTable, HoursGaugeCard, Sidebar...)
│   └── templates/      # Esqueletos estructurales (AppLayout, AuthLayout)
├── pages/              # Páginas de ruta (Dashboard, MonthlyReport, ServiceGroups, S21...)
├── services/           # Capa de acceso a datos (Supabase Client, ReportsService...)
├── hooks/              # Custom hooks con lógica de negocio desacoplada de la UI
├── schemas/            # Esquemas de validación Zod
├── types/              # Tipos TypeScript estrictos y Database Types
└── utils/              # Utilidades puras (cn, cálculos de horas, fechas)
```

---

## 🚀 Puesta en Marcha en Local

### 1. Requisitos Previos
- Node.js $\ge 18$
- Proyecto activo en [supabase.com](https://supabase.com) con el esquema SQL ejecutado.

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Copia el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```
Edita `.env.local` con la URL y clave pública de tu proyecto Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-public-key
```

### 4. Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local con Vite.
- `npm run build`: Valida tipos (`tsc --noEmit`) y compila para producción.
- `npm run test`: Ejecuta la suite de pruebas unitarias con Vitest.
- `npm run test:watch`: Ejecuta las pruebas en modo observador interactivo.
- `npm run typecheck`: Verifica el tipado TypeScript sin generar artefactos.

