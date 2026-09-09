# 6. Estrategia de TypeScript y Garantía de Tipado

## 6.1 Configuración de Compilación (`tsconfig.json`)
El proyecto opera con la configuración más estricta de TypeScript 5.7:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Strict Type-Checking Options */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    /* Additional Checks */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    /* Path Aliases */
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "vite.config.ts"]
}
```

### Justificación de Opciones Críticas:
- `"moduleResolution": "bundler"`: Alineado con el empaquetador de Vite para resolución nativa de módulos ESM.
- `"noEmit": true`: Delega la generación de código a Vite/esbuild, garantizando que el compilador se enfoque exclusivamente en la validación estática de tipos.
- `"noUncheckedIndexedAccess": true`: Obliga a verificar si el acceso a un índice de arreglo u objeto indexado puede retornar `undefined`, evitando errores de ejecución clásicos en tiempo de ejecución.
- `"paths": { "@/*": ["./src/*"] }`: Alias estandarizado y relativo directo a la raíz del código fuente, compatible con TypeScript 5.x sin dependencia en la directiva obsoleta `baseUrl`.

## 6.2 Tipos en Tiempo de Compilación vs Tiempo de Ejecución (Runtime Zod)
Una de las decisiones arquitectónicas fundamentales del sistema es la clara distinción entre el tipado estático (interfaces TypeScript) y la validación en tiempo de ejecución mediante esquemas **Zod**:

1. **Tipos Estáticos (`src/types/database.types.ts`):** Definen la estructura esperada por PostgreSQL y Supabase. Son descartados durante el proceso de transpilación.
2. **Esquemas Runtime (`src/schemas/monthlyReportSchema.ts`):** Se ejecutan en el navegador cuando el usuario interactúa con los formularios, asegurando que cadenas no numéricas, horas negativas o datos corruptos sean interceptados antes de alcanzar el servicio.

## 6.3 Auditoría de Calidad del Código TypeScript
Durante la auditoría estática realizada sobre la base de código completa:
- **Uso de `any`:** `0` instancias encontradas en el código de producción. Toda la manipulación de datos utiliza tipos explícitos o genéricos.
- **Uso de `@ts-ignore` o `@ts-expect-error`:** `0` directivas presentes.
- **Estado de compilación:** Código de salida `0` al ejecutar `npx tsc --noEmit`.
