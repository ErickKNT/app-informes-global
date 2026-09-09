# Documentación Técnica Maestra — Gestión de Informes Teocráticos

Bienvenido al repositorio oficial de documentación técnica de ingeniería para el proyecto **Gestión de Informes Teocráticos (Portal Congregacional de Servicio & Registro)**.

Este conjunto documental ha sido concebido para proporcionar a cualquier ingeniero senior, arquitecto de software o agente de IA la totalidad del contexto, decisiones de diseño, contratos de datos, políticas de seguridad y procedimientos operativos necesarios para operar, mantener y evolucionar la plataforma sin requerir asistencia verbal del autor original.

---

## Mapa de Navegación Documental

| Sección / Archivo | Título del Módulo | Contenido Principal |
|---|---|---|
| [`01-identidad-y-alcance.md`](./01-identidad-y-alcance.md) | **Identidad del Proyecto y Alcance Técnico** | Ficha técnica, justificación del sistema, módulos cubiertos, límites, usuarios objetivo y supuestos. |
| [`02-arquitectura-general.md`](./02-arquitectura-general.md) | **Arquitectura General del Sistema** | Diagrama global de alto nivel, diagramas de secuencia (autenticación, informes, registro asistido, cierre) y despliegue. |
| [`03-stack-tecnologico.md`](./03-stack-tecnologico.md) | **Stack Tecnológico Exhaustivo** | Tabla detallada con versiones exactas, motivos de selección, riesgos técnicos y alternativas evaluadas. |
| [`04-estructura-del-proyecto.md`](./04-estructura-del-proyecto.md) | **Estructura del Proyecto y Reglas** | Árbol completo de directorios, responsabilidades por capa y reglas de importación entre módulos. |
| [`05-arquitectura-frontend-y-componentes.md`](./05-arquitectura-frontend-y-componentes.md) | **Arquitectura Frontend y Componentes** | Atomic Design (catálogo de átomos, moléculas, organismos, plantillas y páginas) con props y tests asociados. |
| [`06-typescript-y-calidad.md`](./06-typescript-y-calidad.md) | **Estrategia de TypeScript y Tipado** | Configuración estricta de compilación, tipado compile-time vs runtime con Zod y auditoría estática. |
| [`07-base-de-datos-y-rls.md`](./07-base-de-datos-y-rls.md) | **Base de Datos y Seguridad (RLS)** | Esquema relacional PostgreSQL, diagrama ERD, diccionario completo de tablas y políticas RLS analizadas. |
| [`08-autenticacion-roles-y-permisos.md`](./08-autenticacion-roles-y-permisos.md) | **Autenticación y Matriz de Control de Acceso**| Modelo RBAC en 3 niveles, matriz de permisos explícita por recurso y protección reactiva de rutas. |
| [`09-reglas-de-negocio-e-informes.md`](./09-reglas-de-negocio-e-informes.md) | **Reglas de Negocio y Ciclo del Informe** | Ciclo de vida del informe ministerial y catálogo formal de reglas BR-001 a BR-020 con trazabilidad. |
| [`10-api-servicios-y-comunicacion.md`](./10-api-servicios-y-comunicacion.md) | **Catálogo de Servicios y Comunicación** | Especificación técnica de cada servicio en `src/services/`, contratos de entrada/salida y manejo de red. |
| [`11-seguridad-y-variables-de-entorno.md`](./11-seguridad-y-variables-de-entorno.md) | **Auditoría de Seguridad y Secretos** | Matriz de hallazgos de seguridad (OWASP Top 10), mitigaciones y gestión estricta de variables de entorno. |
| [`12-testing-qa-y-metricas.md`](./12-testing-qa-y-metricas.md) | **Estrategia de Pruebas, QA y Métricas** | Desglose de las 182 pruebas en 58 suites, checklist formal de QA de 14 puntos y métricas de calidad. |
| [`13-devops-despliegue-y-ambientes.md`](./13-devops-despliegue-y-ambientes.md) | **DevOps, Ambientes y Despliegue** | Definición de ambientes (Local/Staging/Prod), guía de despliegue paso a paso, rollback y backups. |
| [`14-adrs-decisiones-arquitectonicas.md`](./14-adrs-decisiones-arquitectonicas.md) | **Architecture Decision Records (ADRs)** | Registros formales de decisiones de diseño (ADR-001 a ADR-008) con justificación y consecuencias. |
| [`15-trazabilidad-y-riesgos.md`](./15-trazabilidad-y-riesgos.md) | **Trazabilidad y Matriz de Riesgos** | Matriz integral REQ a Test, evaluación de riesgos con niveles de severidad y mitigaciones. |
| [`16-guias-desarrollo-y-ai-guidelines.md`](./16-guias-desarrollo-y-ai-guidelines.md) | **Guía de Desarrollo y AI Guidelines** | Convenciones de código, procedimiento de cambios y directrices mandatorias para agentes de IA. |
| [`17-troubleshooting-y-anexos.md`](./17-troubleshooting-y-anexos.md) | **Troubleshooting y Glosario** | Solución paso a paso a problemas frecuentes y glosario exhaustivo teocrático y técnico. |

---

## Documento Maestro y Versión en PDF
- **Documento Markdown Consolidado:** [`DOCUMENTACION_TECNICA_MAESTRA.md`](./DOCUMENTACION_TECNICA_MAESTRA.md)
- **Documento en PDF Profesional:** [`Servicio-Registro-Technical-Documentation.pdf`](./Servicio-Registro-Technical-Documentation.pdf)
