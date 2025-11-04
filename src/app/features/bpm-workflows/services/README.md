# BPM Workflows Services

Esta carpeta contiene todos los servicios relacionados con los workflows de BPM organizados por dominio funcional.

## Estructura de Carpetas

### 📁 `core/`
Servicios centrales y compartidos utilizados por múltiples componentes y páginas del sistema BPM.

**Servicios incluidos:**
- `bpm-core.service.ts` - Servicio principal de BPM con operaciones core
- `bpm-process.service.ts` - Gestión de procesos BPM
- `bpm-task.service.ts` - Gestión de tareas BPM
- `dynamic-components.service.ts` - Carga dinámica de componentes
- `information-person.service.ts` - Información de personas
- `participants-process.service.ts` - Gestión de participantes en procesos
- `participants-service.service.ts` - Servicio de participantes
- `recognition-property.service.ts` - Reconocimiento de propiedades
- `res.service.ts` - Servicios de recursos
- `rrright.service.ts` - Gestión de derechos
- `sync-main.service.ts` - Sincronización principal
- `workflow.service.ts` - Gestión de workflows

**Usado en:** Múltiples componentes y páginas (tasks-panel, bpm-core, initiate-filing, etc.)

### 📁 `alfa-main/`
Servicios específicos para los componentes relacionados con alfa-main.

**Servicios incluidos:**
- `alfa-main.service.ts` - Operaciones principales de alfa-main
- `information-geographic.service.ts` - Información geográfica

**Usado en:**
- `components/alfa-main/crud-alfa-main/`
- `components/table-alfa-main/`
- `components/header-bpm-core/`

### 📁 `comments/`
Servicios para la gestión de comentarios en procesos BPM.

**Servicios incluidos:**
- `comments.service.ts` - CRUD de comentarios

**Usado en:**
- `components/comments/`

### 📁 `header-bpm-core/`
Servicios utilizados por el componente header de BPM core.

**Servicios incluidos:**
- `tasks-panel.service.ts` - Gestión del panel de tareas

**Usado en:**
- `components/header-bpm-core/`

### 📁 `modification-property-units/`
Servicios para la modificación de unidades prediales.

**Servicios incluidos:**
- `procedures/baunit-children-information.service.ts` - Información de unidades hijo

**Usado en:**
- `components/modification-property-units/`

### 📁 Carpetas de componentes (vacías por ahora)
Estas carpetas están preparadas para recibir servicios específicos cuando sea necesario:
- `clear-information-data/`
- `document-table/`
- `participant-table-dialog/`
- `show-error-validate-alfa-main/`
- `table-alfa-main/`
- `view-change-alpha-main-record/`
- `view-changes-bpm-operation/`

## Convenciones de Importación

### Desde componentes dentro de bpm-workflows:
```typescript
// Importar desde el barrel principal
import { AlfaMainService, BpmCoreService, CommentsService } from '@features/bpm-workflows/services';
```

### Desde otros módulos (shared, pages, etc.):
```typescript
// Los servicios core de BPM también están disponibles desde shared services
import { BpmCoreService, BpmProcessService } from '@shared/services';
```

## Barrel Exports

El archivo `index.ts` en la raíz de services exporta todos los servicios organizados:

```typescript
// Servicios de alfa-main
export * from './alfa-main/alfa-main.service';
export * from './alfa-main/information-geographic.service';

// Servicios core
export * from './core/bpm-core.service';
export * from './core/bpm-process.service';
// ... etc

// Servicios por componente
export * from './comments/comments.service';
export * from './header-bpm-core/tasks-panel.service';
```

## Principios de Organización

1. **Servicios compartidos** → Carpeta `core/`
2. **Servicios específicos de componente** → Carpeta con el mismo nombre que el componente
3. **Un servicio por archivo** → Facilita el mantenimiento
4. **Exports centralizados** → Usar barrel exports (index.ts)

## Migración y Refactorización

Esta estructura fue establecida durante la refactorización del proyecto GeoGestionV2 con el objetivo de:
- Mejorar la organización y mantenibilidad
- Facilitar la búsqueda de servicios
- Mantener consistencia entre componentes y servicios
- Reducir acoplamiento innecesario

---

**Última actualización:** 2025-11-02
**Autor:** Refactorización GeoGestionV2