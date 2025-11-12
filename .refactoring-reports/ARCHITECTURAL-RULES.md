# 🚨 REGLAS ARQUITECTÓNICAS CRÍTICAS - GeoGestion V2

**Fecha de establecimiento**: 2025-11-05
**Estado**: ACTIVAS - OBLIGATORIAS

## ⛔ REGLA CRÍTICA #1: PROHIBIDO ARCHIVOS DE BARRIL PARA SERVICIOS

### 🔴 PROHIBIDO

**NUNCA crear o mantener archivos de barril (`index.ts`) para servicios, componentes, pipes, directives, o cualquier código ejecutable.**

### ❌ Ejemplos de lo que NO se debe hacer:

```typescript
// ❌ PROHIBIDO: src/app/features/property-management/services/index.ts
export * from './property/information-property.service';
export * from './snr/snr.service';
export * from './photos/photos.service';
```

```typescript
// ❌ PROHIBIDO: src/app/features/bpm-workflows/components/index.ts
export * from './alfa-main/alfa-main.component';
export * from './geo-main/geo-main.component';
```

### ⚠️ Problema: Referencias Circulares

Los archivos de barril para servicios crean **referencias circulares** que:
- Causan errores de compilación difíciles de detectar
- Rompen el árbol de dependencias
- Generan conflictos en el renderizado
- Dificultan el tree-shaking
- Hacen el debugging imposible

**Ejemplo de referencia circular**:
```
ServiceA → index.ts → ServiceB → index.ts → ServiceA
```

## ✅ REGLA #2: SOLO PERMITIDOS ARCHIVOS DE BARRIL PARA MODELS E INTERFACES

### ✅ PERMITIDO (SOLO PARA TYPES)

**ÚNICAMENTE se permiten archivos de barril para:**
- Models (clases de datos sin lógica)
- Interfaces (definiciones de tipos)
- Types (alias de tipos TypeScript)
- Enums (enumeraciones)

### ✅ Ejemplos correctos:

```typescript
// ✅ CORRECTO: src/app/features/property-management/models/index.ts
export * from './basic-information-property';
export * from './baunit-head.model';
export * from './info-person';
export * from './snr-folio-info';
```

```typescript
// ✅ CORRECTO: src/app/shared/interfaces/index.ts
export * from './general/simple-response';
export * from './general/information-pageable';
export * from './general/type-information';
```

```typescript
// ✅ CORRECTO: Importando desde barrel de models
import {
  BasicInformationProperty,
  BaunitHead,
  InfoPerson
} from '@features/property-management/models';
```

## ✅ REGLA #3: IMPORTS DIRECTOS PARA SERVICIOS

### Patrón correcto para importar servicios:

```typescript
// ✅ CORRECTO: Import directo al archivo del servicio
import { InformationPropertyService } from '@features/property-management/services/property/information-property.service';
import { SnrService } from '@features/property-management/services/snr/snr.service';
import { PhotosService } from '@features/property-management/services/photos/photos.service';
```

```typescript
// ✅ CORRECTO: Import directo en componentes
import { DynamicComponentsService } from '@features/bpm-workflows/services/core/dynamic-components.service';
import { WorkflowService } from '@features/bpm-workflows/services/core/workflow.service';
```

### ❌ NUNCA hacer esto:

```typescript
// ❌ PROHIBIDO: Import desde barrel
import { InformationPropertyService, SnrService } from '@features/property-management/services';
```

## ✅ REGLA #4: IMPORTS DIRECTOS PARA COMPONENTES

### Patrón correcto para importar componentes:

```typescript
// ✅ CORRECTO: Import directo al componente
import { AlfaMainComponent } from '@features/bpm-workflows/components/alfa-main/alfa-main.component';
import { GeoMainComponent } from '@features/bpm-workflows/components/geo-main/geo-main.component';
```

```typescript
// ✅ CORRECTO: Import en lazy loading
loadChildren: () =>
  import('./features/property-management/property-management.routes')
    .then(m => m.PROPERTY_MANAGEMENT_ROUTES)
```

## 📋 VERIFICACIÓN DE CUMPLIMIENTO

### Archivos de barril permitidos (SOLO models/interfaces):

```bash
✅ src/app/features/*/models/index.ts
✅ src/app/shared/interfaces/index.ts
✅ src/app/shared/models/index.ts
```

### Archivos de barril PROHIBIDOS (debe eliminarse):

```bash
❌ src/app/features/*/services/index.ts
❌ src/app/features/*/components/index.ts
❌ src/app/shared/services/index.ts
❌ src/app/apps/services/*/index.ts
❌ src/app/apps/components/*/index.ts
```

## 🔍 COMANDOS DE AUDITORÍA

### Buscar archivos de barril prohibidos:

```bash
# Buscar index.ts en directorios de servicios
find src/app -path "*/services/index.ts" -type f

# Buscar index.ts en directorios de componentes
find src/app -path "*/components/index.ts" -type f

# Verificar imports desde barrels de servicios
grep -r "from '@features/.*/services'" src/app/ --include="*.ts"
grep -r "from '@shared/services'" src/app/ --include="*.ts"
```

## 📝 PLAN DE LIMPIEZA

### Archivos identificados para eliminación:

1. **✅ Ya eliminado por usuario**:
   - `src/app/core/services/index.ts`
   - `src/app/core/index.ts`
   - `src/app/core/auth/index.ts`
   - Múltiples barrels en `apps/services/`

2. **⏳ Pendiente de eliminación**:
   - `src/app/features/property-management/services/index.ts`
   - `src/app/features/economic-zones/services/index.ts`
   - `src/app/features/tenant-configuration/services/index.ts`
   - `src/app/shared/services/index.ts` (si existe)

3. **✅ Mantener** (models/interfaces):
   - `src/app/features/property-management/models/index.ts`
   - `src/app/features/economic-zones/models/index.ts`
   - `src/app/shared/interfaces/index.ts`
   - `src/app/shared/models/index.ts`

## 🎯 PATRÓN DE MIGRACIÓN ACTUALIZADO

### Antes (INCORRECTO):

```
features/property-management/
├── models/
│   ├── index.ts ✅ (permitido)
│   ├── baunit-head.model.ts
│   └── info-person.ts
├── services/
│   ├── index.ts ❌ (PROHIBIDO)
│   ├── property/
│   │   └── information-property.service.ts
│   └── snr/
│       └── snr.service.ts
└── components/
    ├── index.ts ❌ (PROHIBIDO)
    └── alerts/
        └── alerts.component.ts
```

### Después (CORRECTO):

```
features/property-management/
├── models/
│   ├── index.ts ✅ (ÚNICO barrel permitido)
│   ├── baunit-head.model.ts
│   └── info-person.ts
├── services/
│   ├── property/
│   │   └── information-property.service.ts
│   └── snr/
│       └── snr.service.ts
└── components/
    └── alerts/
        └── alerts.component.ts

// Imports directos
import { BaunitHead, InfoPerson } from '@features/property-management/models';
import { InformationPropertyService } from '@features/property-management/services/property/information-property.service';
import { AlertsComponent } from '@features/property-management/components/alerts/alerts.component';
```

## 🚀 BENEFICIOS DE ESTA ARQUITECTURA

1. **Sin referencias circulares**: Dependencias claras y unidireccionales
2. **Tree-shaking efectivo**: Bundler puede eliminar código no usado
3. **Debugging sencillo**: Stack traces claros y precisos
4. **Build más rápido**: Menos re-compilaciones innecesarias
5. **Código mantenible**: Dependencias explícitas y trazables
6. **TypeScript feliz**: Sin errores de tipos misteriosos

## ⚠️ CONSECUENCIAS DE VIOLACIÓN

Violar estas reglas resultará en:
- ❌ Build failures
- ❌ Referencias circulares
- ❌ Conflictos de renderizado
- ❌ Errores de compilación difíciles de debugear
- ❌ Reversión de cambios en PR

## ✅ CHECKLIST PARA REFACTORING

Antes de migrar cualquier código, verificar:

- [ ] ¿Es un model o interface? → ✅ Puede usar barrel export
- [ ] ¿Es un service? → ❌ Import directo obligatorio
- [ ] ¿Es un component? → ❌ Import directo obligatorio
- [ ] ¿Es un pipe o directive? → ❌ Import directo obligatorio
- [ ] ¿Estoy eliminando barrels antiguos de servicios? → ✅ Correcto
- [ ] ¿Estoy actualizando imports a rutas directas? → ✅ Correcto

---

**Estas reglas son OBLIGATORIAS para todos los desarrolladores y asistentes de código trabajando en GeoGestion V2.**

**Última actualización**: 2025-11-05 por David Aristizabal