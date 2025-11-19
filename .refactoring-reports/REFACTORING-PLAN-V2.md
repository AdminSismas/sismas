# 📋 Plan de Refactorización V2 - GeoGestion V2

**Fecha de creación**: 2025-11-06
**Versión**: 2.0
**Estado**: ACTIVO

---

## 🚨 REGLAS ARQUITECTÓNICAS OBLIGATORIAS

**⛔ LEER PRIMERO**: [ARCHITECTURAL-RULES.md](./ARCHITECTURAL-RULES.md)

### Reglas Críticas

1. **✅ PERMITIDO**: Archivos de barril (`index.ts`) SOLO para:
   - Models (`/models/index.ts`)
   - Interfaces (`/interfaces/index.ts`)
   - Types y Enums

2. **❌ PROHIBIDO**: Archivos de barril para:
   - Services (usar imports directos)
   - Components (usar imports directos)
   - Pipes, Directives, Guards, Interceptors
   - Constants (usar imports directos)

3. **Patrón de imports obligatorio**:
   ```typescript
   // ✅ CORRECTO - Models con barrel
   import { BaunitHead, InfoPerson } from '@features/property-management/models';

   // ✅ CORRECTO - Services con import directo
   import { InformationPropertyService } from '@features/property-management/services/property/information-property.service';

   // ❌ PROHIBIDO - Services con barrel
   import { InformationPropertyService } from '@features/property-management/services';
   ```

---

## 📊 Estado Actual del Proyecto

### ✅ Completado (Commits: 170ed9a6, c417fd22, 3c9258af)

- ✅ **Eliminación de barrels de servicios y constantes**: 100% completado
- ✅ **ARCHITECTURAL-RULES.md**: Documentación creada
- ✅ **BPM Workflows Feature**: Servicios y componentes migrados
- ✅ **Economic Zones Feature**: 100% completado
- ✅ **Property Management Feature**: Servicios y componentes principales migrados
- ✅ **Tenant Configuration**: Estructura básica creada

### 📈 Progreso General

- **Features completados**: 1/6 (Economic Zones al 100%)
- **Features en progreso**: 3/6 (BPM Workflows, Property Management, Tenant Configuration)
- **Componentes migrados**: ~67/~150 (45%)
- **Servicios migrados**: ~41/~80 (51%)
- **Models organizados**: ~61/~200 (31%)
- **Barrels eliminados**: 12/12 de servicios y constantes (100%)

---

## 🎯 Inventario de Pendientes

### 📂 Componentes en `/apps/components/` (23 archivos)

#### 1. Configuration Components (6 componentes)
**Ubicación**: `src/app/apps/components/configuration/`

**Firmas Digitalizadas** (2 componentes):
- `digitalized-signatures/create-signature/create-signature.component.ts`
- `digitalized-signatures/table-digitalized-signatures.component.ts`

**Economic Mod Land** (4 componentes):
- `economic-mod-land/cadastral-change-log/cadastral-change-log.component.ts`
- `economic-mod-land/create-zone/create-zone.component.ts`
- `economic-mod-land/economic-zone/economic-zone.component.ts`
- `economic-mod-land/zone-manager/zone-manager.component.ts`

**Destino sugerido**:
- Firmas → `features/tenant-configuration/components/digitalized-signatures/`
- Economic → `features/economic-zones/components/admin/` (ya tiene la feature)

---

#### 2. General Components (2 componentes)
**Ubicación**: `src/app/apps/components/general-components/`

- `document-viewer/document-viewer.component.ts`
- `payment-validation/payment-validation.component.ts`

**Destino sugerido**: `shared/components/` (componentes reutilizables)

---

#### 3. Geographic Components (2 componentes)
**Ubicación**: `src/app/apps/components/geographics/`

- `geographic-viewer/geographic-viewer.component.ts`
- `geographic-viewer-embedded/geographic-viewer-embedded.component.ts`

**Destino sugerido**: `features/geographics/components/` (nueva feature)

---

#### 4. Procedures Components (1 componente)
**Ubicación**: `src/app/apps/components/procedures/`

- `reassign-procedure/reassign-procedure.component.ts`

**Destino sugerido**: `features/bpm-workflows/components/procedures/`

---

#### 5. Table Components (12 componentes)
**Ubicación**: `src/app/apps/components/tables/`

**Cadastral Search** (2 componentes):
- `table-cadastral-search/filter-cadastral-search/filter-cadastral-search.component.ts`
- `table-cadastral-search/table-cadastral-search.component.ts`

**Certificate Search** (2 componentes):
- `table-certificate-search/filter-certificate-search/filter-certificate-search.component.ts`
- `table-certificate-search/table-certificate-search.component.ts`

**Certificate Search Appraisals** (2 componentes):
- `table-certificate-search-appraisals/filter-certificate-search-appraisals/filter-certificate-search-appraisals.component.ts`
- `table-certificate-search-appraisals/table-certificate-search-appraisals.component.ts`

**Procedures** (2 componentes):
- `table-procedures/table-procedures.component.ts`
- `table-procedures/table-work-execution/table-work-execution.component.ts`

**Workflow** (4 componentes):
- `table-workflow/components/create-workflow/create-workflow.component.ts`
- `table-workflow/components/edit-task/edit-task.component.ts`
- `table-workflow/components/task-list/task-list.component.ts`
- `table-workflow/table-workflow.component.ts`

**Destino sugerido**:
- Cadastral/Certificate → `features/property-management/components/search/`
- Procedures → `features/bpm-workflows/components/procedures/`
- Workflow → `features/bpm-workflows/components/workflow/`

---

### 🔧 Servicios en `/apps/services/` (10 archivos)

#### 1. Operation Support Services (3 servicios)
**Ubicación**: `src/app/apps/services/operation-support/reports/`

- `download-reports.service.ts`
- `report-manager.service.ts`
- `report.service.ts`

**Destino sugerido**: `features/operation-support/services/reports/`

---

#### 2. Register Procedure Service (1 servicio)
**Ubicación**: `src/app/apps/services/register-procedure/`

- `send-information-register.service.ts`

**Destino sugerido**: `features/bpm-workflows/services/registration/`

---

#### 3. Territorial Organization Service (1 servicio)
**Ubicación**: `src/app/apps/services/territorial-organization/`

- `territorial-organization.service.ts`

**Destino sugerido**: `features/territorial-organization/services/` (nueva feature) o `shared/services/`

---

#### 4. Users Services (4 servicios)
**Ubicación**: `src/app/apps/services/users/`

- `digitalized-signatures.service.ts`
- `password.service.ts`
- `people.service.ts`
- `user.service.ts`

**Destino sugerido**: `features/tenant-configuration/services/users/`

---

#### 5. Validations Service (1 servicio)
**Ubicación**: `src/app/apps/services/validations/`

- `general-validations.service.ts`

**Destino sugerido**: `shared/services/validations/`

---

### 📝 Interfaces en `/apps/interfaces/` (42 archivos)

#### Directorios pendientes:
- `comments/` → `features/bpm-workflows/models/comments/`
- `document-management/` → `features/bpm-workflows/models/documents/`
- `forms/` → `shared/models/forms/`
- `general/` → `shared/interfaces/general/` (algunos ya migrados)
- `geographics/` → `features/geographics/models/`
- `operation-support/` → `features/operation-support/models/`
- `paginator/` → `shared/interfaces/pagination/`
- `tables/` → `shared/interfaces/tables/`
- `territorial-organization/` → `features/territorial-organization/models/` o `shared/models/`
- `user-details/` → `features/tenant-configuration/models/users/`
- `users/` → `features/tenant-configuration/models/users/`

**Acción**: Crear barrels `index.ts` en `/models/` de cada feature (✅ PERMITIDO por reglas)

---

## 🎯 Plan de Migración por Fases

### Fase 1: Completar Economic Zones ✅ (COMPLETADO)
**Estado**: 100% completado
**Commit**: 9f46d0c7

---

### Fase 2: Completar Tenant Configuration 🔄
**Prioridad**: ALTA
**Duración estimada**: 2-3 horas
**Estado**: Feature creada, pendiente migración

#### Componentes a migrar (8 total):
1. **Digitalized Signatures** (2 componentes):
   - De: `apps/components/configuration/digitalized-signatures/`
   - A: `features/tenant-configuration/components/digitalized-signatures/`

#### Servicios a migrar (4 servicios):
1. **Users Services**:
   - `digitalized-signatures.service.ts`
   - `password.service.ts`
   - `people.service.ts`
   - `user.service.ts`
   - De: `apps/services/users/`
   - A: `features/tenant-configuration/services/users/`

#### Interfaces a migrar (~10 archivos):
- De: `apps/interfaces/user-details/` y `apps/interfaces/users/`
- A: `features/tenant-configuration/models/users/`
- **Crear**: `models/index.ts` con barrel export (✅ permitido)

#### Pasos:
1. Migrar servicios con `git mv` (imports directos, NO barrel)
2. Modernizar servicios con `inject()` pattern
3. Migrar modelos/interfaces con `git mv`
4. Crear barrel `models/index.ts` (✅ ÚNICO barrel permitido)
5. Migrar componentes con `git mv`
6. Actualizar imports en componentes (directos para servicios)
7. Validar build
8. Crear commit

---

### Fase 3: Completar BPM Workflows 🔄
**Prioridad**: ALTA
**Duración estimada**: 3-4 horas
**Estado**: Servicios migrados, pendiente componentes adicionales

#### Componentes a migrar (5 componentes):
1. **Procedures**:
   - `reassign-procedure.component.ts`
   - `table-procedures.component.ts`
   - `table-work-execution.component.ts`
   - De: `apps/components/`
   - A: `features/bpm-workflows/components/procedures/`

2. **Workflow**:
   - `create-workflow.component.ts`
   - `edit-task.component.ts`
   - `task-list.component.ts`
   - `table-workflow.component.ts`
   - De: `apps/components/tables/table-workflow/`
   - A: `features/bpm-workflows/components/workflow/`

#### Servicios a migrar (1 servicio):
- `send-information-register.service.ts`
- De: `apps/services/register-procedure/`
- A: `features/bpm-workflows/services/registration/`

#### Interfaces a migrar (~8 archivos):
- De: `apps/interfaces/comments/` y `apps/interfaces/document-management/`
- A: `features/bpm-workflows/models/`
- **Actualizar**: `models/index.ts` existente (barrel ya existe)

#### Pasos:
1. Migrar servicio con `git mv` (import directo)
2. Modernizar servicio con `inject()`
3. Migrar modelos/interfaces con `git mv`
4. Actualizar barrel `models/index.ts` existente
5. Migrar componentes con `git mv`
6. Actualizar imports (directos para servicios)
7. Validar build
8. Crear commit

---

### Fase 4: Completar Property Management 🔄
**Prioridad**: ALTA
**Duración estimada**: 2-3 horas
**Estado**: Core completado, pendiente componentes de búsqueda

#### Componentes a migrar (6 componentes):
1. **Search/Certificate Tables**:
   - `table-cadastral-search.component.ts` + filter
   - `table-certificate-search.component.ts` + filter
   - `table-certificate-search-appraisals.component.ts` + filter
   - De: `apps/components/tables/`
   - A: `features/property-management/components/search/`

#### Servicios: ✅ Todos migrados

#### Modelos: ✅ Mayoría migrados

#### Pasos:
1. Migrar componentes con `git mv`
2. Actualizar imports de servicios (ya están como imports directos)
3. Validar build
4. Crear commit

---

### Fase 5: Crear Feature "Operation Support" 🆕
**Prioridad**: MEDIA
**Duración estimada**: 2-3 horas
**Estado**: Nuevo feature a crear

#### Estructura a crear:
```
features/operation-support/
├── components/
│   └── reports/
├── services/
│   └── reports/
│       ├── download-reports.service.ts
│       ├── report-manager.service.ts
│       └── report.service.ts
└── models/
    └── index.ts (barrel permitido)
```

#### Servicios a migrar (3 servicios):
- De: `apps/services/operation-support/reports/`
- A: `features/operation-support/services/reports/`

#### Interfaces a migrar (~5 archivos):
- De: `apps/interfaces/operation-support/`
- A: `features/operation-support/models/`
- **Crear**: `models/index.ts`

#### Pasos:
1. Crear estructura de directorios
2. Migrar servicios con `git mv` (NO crear barrel)
3. Modernizar servicios con `inject()`
4. Migrar interfaces con `git mv`
5. Crear barrel `models/index.ts`
6. Actualizar imports en componentes que usan estos servicios
7. Validar build
8. Crear commit

---

### Fase 6: Crear Feature "Geographics" 🆕
**Prioridad**: MEDIA
**Duración estimada**: 1-2 horas
**Estado**: Nuevo feature a crear

#### Estructura a crear:
```
features/geographics/
├── components/
│   ├── geographic-viewer/
│   └── geographic-viewer-embedded/
├── services/
│   └── (si aplica)
└── models/
    └── index.ts
```

#### Componentes a migrar (2 componentes):
- `geographic-viewer.component.ts`
- `geographic-viewer-embedded.component.ts`
- De: `apps/components/geographics/`
- A: `features/geographics/components/`

#### Interfaces a migrar (~3 archivos):
- De: `apps/interfaces/geographics/`
- A: `features/geographics/models/`
- **Crear**: `models/index.ts`

#### Pasos:
1. Crear estructura de directorios
2. Migrar componentes con `git mv`
3. Migrar interfaces con `git mv`
4. Crear barrel `models/index.ts`
5. Actualizar imports
6. Validar build
7. Crear commit

---

### Fase 7: Completar Economic Zones Admin 🔄
**Prioridad**: MEDIA
**Duración estimada**: 1-2 horas
**Estado**: Feature existente, agregar componentes admin

#### Componentes a migrar (4 componentes):
- `cadastral-change-log.component.ts`
- `create-zone.component.ts`
- `economic-zone.component.ts`
- `zone-manager.component.ts`
- De: `apps/components/configuration/economic-mod-land/`
- A: `features/economic-zones/components/admin/`

#### Servicios: ✅ Ya migrados

#### Modelos: ✅ Ya migrados con barrel

#### Pasos:
1. Migrar componentes con `git mv`
2. Actualizar imports de servicios (usar imports directos)
3. Validar build
4. Crear commit

---

### Fase 8: Organizar Shared Resources 📦
**Prioridad**: MEDIA
**Duración estimada**: 3-4 horas
**Estado**: Pendiente

#### Componentes a migrar (2 componentes):
- `document-viewer.component.ts`
- `payment-validation.component.ts`
- De: `apps/components/general-components/`
- A: `shared/components/`

#### Servicios a migrar (2 servicios):
- `territorial-organization.service.ts` → `shared/services/territorial/`
- `general-validations.service.ts` → `shared/services/validations/`

#### Interfaces a migrar (~20 archivos):
- De: `apps/interfaces/general/`, `apps/interfaces/forms/`, `apps/interfaces/tables/`, `apps/interfaces/paginator/`
- A: `shared/interfaces/` (ya existe, agregar subdirectorios)
- **Actualizar**: `shared/interfaces/index.ts` existente

#### Pasos:
1. Migrar servicios con `git mv` (NO crear barrel)
2. Modernizar servicios con `inject()`
3. Migrar componentes con `git mv`
4. Migrar interfaces con `git mv`
5. Actualizar barrel `shared/interfaces/index.ts`
6. Actualizar todos los imports
7. Validar build
8. Crear commit

---

### Fase 9: Crear Feature "Territorial Organization" (Opcional) 🆕
**Prioridad**: BAJA
**Duración estimada**: 1-2 horas
**Estado**: Nuevo feature opcional

**Decisión pendiente**: ¿Merece su propia feature o va a shared?

Si se crea como feature:
```
features/territorial-organization/
├── services/
│   └── territorial-organization.service.ts
└── models/
    └── index.ts
```

Interfaces:
- De: `apps/interfaces/territorial-organization/`
- A: `features/territorial-organization/models/`

---

### Fase 10: Limpieza Final y Validación 🧹
**Prioridad**: ALTA (al final)
**Duración estimada**: 2-3 horas

#### Tareas:
1. ✅ **Eliminar barrels prohibidos restantes** (3 pequeños):
   - `apps/components/tables/table-workflow/constants/index.ts`
   - `pages/my-work/tasks/constants/index.ts`
   - `pages/operation-support/people/constants/index.ts`

2. **Limpiar directorios vacíos**:
   - Eliminar `/apps/components/` (si queda vacío)
   - Eliminar `/apps/services/` (si queda vacío)
   - Eliminar `/apps/interfaces/` (si queda vacío)

3. **Validar imports**:
   - Buscar cualquier import desde barrels prohibidos
   - Verificar que todos los servicios usen imports directos

4. **Build y tests**:
   - `pnpm build` → Debe pasar sin errores
   - `pnpm test` → Verificar tests críticos
   - `pnpm lint` → Corregir errores de linting

5. **Documentación**:
   - Actualizar README.md con progreso final
   - Crear documento de arquitectura final
   - Documentar patrones de imports establecidos

6. **Commit final**:
   - Crear commit de limpieza y cierre
   - Marcar refactoring como completado

---

## 📝 Checklist de Migración (Para cada fase)

### Pre-migración:
- [ ] Leer ARCHITECTURAL-RULES.md
- [ ] Identificar servicios, componentes y models a migrar
- [ ] Verificar destino correcto según feature
- [ ] Planificar estructura de directorios

### Durante migración:
- [ ] Usar `git mv` para TODOS los archivos (preserva historia)
- [ ] ❌ NO crear `index.ts` para servicios
- [ ] ❌ NO crear `index.ts` para componentes
- [ ] ✅ SI crear `index.ts` solo para models/interfaces
- [ ] Modernizar servicios con `inject()` pattern
- [ ] Actualizar imports a rutas directas para servicios
- [ ] Actualizar imports a barrels para models

### Post-migración:
- [ ] Verificar que NO existan barrels de servicios
- [ ] Ejecutar `pnpm build` y verificar éxito
- [ ] Buscar y eliminar directorios vacíos
- [ ] Crear commit descriptivo con patrón establecido
- [ ] Actualizar documentación de progreso

---

## 🎯 Priorización Recomendada

### Sprint 1 (1 semana):
1. **Fase 2**: Completar Tenant Configuration
2. **Fase 3**: Completar BPM Workflows
3. **Fase 4**: Completar Property Management

**Resultado**: 4 features al 100% (Economic Zones, Tenant Config, BPM, Property Management)

### Sprint 2 (1 semana):
4. **Fase 5**: Crear Operation Support
5. **Fase 6**: Crear Geographics
6. **Fase 7**: Completar Economic Zones Admin

**Resultado**: 6 features al 100%

### Sprint 3 (4-5 días):
7. **Fase 8**: Organizar Shared Resources
8. **Fase 9**: Territorial Organization (si aplica)
9. **Fase 10**: Limpieza final

**Resultado**: Refactoring 100% completado

---

## 📈 Métricas de Éxito

### Objetivos finales:
- ✅ 0 archivos de barril para servicios
- ✅ 0 archivos de barril para componentes
- ✅ 0 archivos de barril para constantes
- ✅ 100% de models/interfaces con barrels
- ✅ 100% de servicios con imports directos
- ✅ 6+ features completamente organizadas
- ✅ Build exitoso sin warnings de referencias circulares
- ✅ Todos los directorios `/apps/` migrados o eliminados

### KPIs:
- **Componentes migrados**: 90/90 (100%)
- **Servicios migrados**: 51/51 (100%)
- **Models organizados**: 200/200 (100%)
- **Features completadas**: 6/6 (100%)
- **Build time**: <15 segundos
- **Zero referencias circulares**: ✅

---

## 🔍 Comandos de Verificación

### Buscar barrels prohibidos:
```bash
# Buscar barrels de servicios (debe retornar 0)
find src/app -path "*/services/index.ts" -type f

# Buscar barrels de componentes (debe retornar 0)
find src/app -path "*/components/index.ts" -type f

# Buscar barrels de constantes en features (debe retornar 0)
find src/app/features -path "*/constants/index.ts" -type f
```

### Verificar imports directos:
```bash
# Buscar imports desde barrel de servicios (debe retornar 0)
grep -r "from '@features/.*/services'" src/app/ --include="*.ts" | grep -v ".spec.ts"

# Buscar imports desde barrel de components (debe retornar 0)
grep -r "from '@features/.*/components'" src/app/ --include="*.ts" | grep -v ".spec.ts"
```

### Verificar barrels permitidos:
```bash
# Barrels de models (debe retornar todos los de features)
find src/app/features -path "*/models/index.ts" -type f

# Barrels de interfaces (debe retornar el de shared)
find src/app/shared -path "*/interfaces/index.ts" -type f
```

---

## 📚 Referencias

- [ARCHITECTURAL-RULES.md](./ARCHITECTURAL-RULES.md) - Reglas obligatorias
- [README.md](./README.md) - Historial de fases
- [phase-4-economic-zones.md](./phase-4-economic-zones.md) - Ejemplo de feature completa

---

**Última actualización**: 2025-11-06
**Próxima revisión**: Después de completar Sprint 1
