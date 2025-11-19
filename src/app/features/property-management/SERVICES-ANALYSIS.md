# Property Management - Services Analysis

**Fecha:** 2025-11-02
**Análisis completo de servicios utilizados en property-management**

## 🔍 Servicios Identificados por Ubicación

### 1. Servicios en `apps/services/information-property/`
**Estado: ✅ Listos para migrar**

| Servicio | Archivo | Uso | Destino |
|----------|---------|-----|---------|
| `AdministrativeSourcesService` | `administrative-sources.service.ts` | Fuentes administrativas de propiedades | `services/administrative-sources/` |
| `InformationAdjacentPropertyService` | `information-adjacent-property/...` | Propiedades colindantes | `services/adjacent/` |
| `InformationConstructionsService` | `information-constructions-property/...` | Construcciones | `services/constructions/` |
| `InformationZonesService` | `information-zones-property/...` | Zonas (físicas, económicas) | `services/zones/` |

### 2. Servicios en `features/property-management/services/`
**Estado: ✅ Ya en ubicación correcta**

| Servicio | Archivo | Uso |
|----------|---------|-----|
| `BaunitIcaService` | `baunit-ica.service.ts` | ICA (Industria y Comercio) |

### 3. Servicios de Otros Dominios (Usados por property-management)

#### 3.1 Services de BPM Workflows
| Servicio | Ubicación | Componente que lo usa |
|----------|-----------|----------------------|
| `AlfaMainService` | `@features/bpm-workflows/services` | `basic-information`, `historical`, `auto-appraisal` |
| `BpmCoreService` | `@features/bpm-workflows/services` | `historical` |
| `RrrightService` | `@features/bpm-workflows/services/core/` | `owners` (3 componentes) |

#### 3.2 Services de Shared
| Servicio | Ubicación | Componentes que lo usan |
|----------|-----------|------------------------|
| `InformationPropertyService` | `@shared/services` | 10+ componentes (básico, zonas, direcciones, avalúos) |
| `GeneralValidationsService` | `@shared/services` | `addresses`, `constructions`, `adjacent` |
| `CollectionServices` | `@shared/services` | `constructions` |
| `CommonGeneralValidationsService` | `@shared/services` | `constructions` |
| `PeopleService` | `@shared/services` | `owners` (2 componentes) |
| `AlertsService` | `@shared/services` | `alerts` |
| `ProceduresService` | `@shared/services` | `historical` |

#### 3.3 Services de Otros Módulos
| Servicio | Ubicación | Componente |
|----------|-----------|-----------|
| `PhotosService` | `src/app/apps/services/photos/` | `photos` |
| `SnrService` | `src/app/apps/services/snr/` | `super-notariado-property` (2 componentes) |
| `TerritorialOrganizationService` | `src/app/apps/services/territorial-organization/` | `administrative-sources/create` |

## 📊 Mapa de Uso por Componente

### 📁 components/addresses/ (3 componentes)
**Servicios:**
- ✅ `InformationPropertyService` (shared) - Mantener
- ✅ `GeneralValidationsService` (shared) - Mantener

### 📁 components/adjacent-properties/ (3 componentes)
**Servicios:**
- 🔄 `InformationAdjacentPropertyService` → **MIGRAR a services/adjacent/**
- ✅ `GeneralValidationsService` (shared) - Mantener

### 📁 components/administrative-sources/ (2 componentes)
**Servicios:**
- 🔄 `AdministrativeSourcesService` → **MIGRAR a services/administrative-sources/**
- ✅ `TerritorialOrganizationService` (shared) - Mantener

### 📁 components/alerts/ (1 componente)
**Servicios:**
- ✅ `AlertsService` (shared) - Mantener
- ⚠️ **POSIBLE:** Migrar a property-management si es específico

### 📁 components/appraisal/ (3 componentes)
**Servicios:**
- ✅ `InformationPropertyService` (shared) - Mantener
- ✅ `AlfaMainService` (bpm-workflows) - Mantener
- ⚠️ **FALTA:** Servicio específico de appraisal (si existe)

### 📁 components/basic-information/ (2 componentes)
**Servicios:**
- ✅ `InformationPropertyService` (shared) - Mantener
- ✅ `AlfaMainService` (bpm-workflows) - Mantener

### 📁 components/constructions/ (5 componentes)
**Servicios:**
- 🔄 `InformationConstructionsService` → **MIGRAR a services/constructions/**
- ✅ `CollectionServices` (shared) - Mantener
- ✅ `GeneralValidationsService` (shared) - Mantener
- ✅ `CommonGeneralValidationsService` (shared) - Mantener

### 📁 components/historical/ (1 componente)
**Servicios:**
- ✅ `ProceduresService` (shared) - Mantener
- ✅ `AlfaMainService` (bpm-workflows) - Mantener
- ✅ `BpmCoreService` (bpm-workflows) - Mantener

### 📁 components/ica/ (2 componentes)
**Servicios:**
- ✅ `BaunitIcaService` - **YA EN property-management/services/**

### 📁 components/owners/ (3 componentes)
**Servicios:**
- ✅ `InformationPropertyService` (shared) - Mantener
- ✅ `RrrightService` (bpm-workflows/core) - Mantener
- ✅ `PeopleService` (shared) - Mantener
- ⚠️ **FALTA:** Servicio específico de owners (si existe)

### 📁 components/photos/ (1 componente)
**Servicios:**
- 🔄 `PhotosService` → **CONSIDERAR migración a services/photos/**

### 📁 components/super-notariado-property/ (2 componentes)
**Servicios:**
- 🔄 `SnrService` → **MANTENER EN apps/services/snr/** (dominio externo)

### 📁 components/zones/ (4 componentes)
**Servicios:**
- 🔄 `InformationZonesService` → **MIGRAR a services/zones/**
- ✅ `InformationPropertyService` (shared) - Mantener

## 🎯 Servicios a Migrar - Resumen

### Prioridad ALTA - Migración Inmediata
Estos servicios son específicos de property-management:

1. ✅ **AdministrativeSourcesService**
   - Origen: `apps/services/information-property/administrative-sources.service.ts`
   - Destino: `features/property-management/services/administrative-sources/`
   - Componentes afectados: 2

2. ✅ **InformationAdjacentPropertyService**
   - Origen: `apps/services/information-property/information-adjacent-property/`
   - Destino: `features/property-management/services/adjacent/`
   - Componentes afectados: 2

3. ✅ **InformationConstructionsService**
   - Origen: `apps/services/information-property/information-constructions-property/`
   - Destino: `features/property-management/services/constructions/`
   - Componentes afectados: 5

4. ✅ **InformationZonesService**
   - Origen: `apps/services/information-property/information-zones-property/`
   - Destino: `features/property-management/services/zones/`
   - Componentes afectados: 4

### Prioridad MEDIA - Evaluar Migración

5. ⚠️ **PhotosService**
   - Origen: `apps/services/photos/photos.service.ts`
   - Destino potencial: `features/property-management/services/photos/`
   - Componentes afectados: 1
   - **Decisión:** Verificar si es específico de property o compartido

6. ⚠️ **AlertsService**
   - Origen: `apps/services/alerts/alertes.service.ts`
   - Destino potencial: `features/property-management/services/alerts/`
   - Componentes afectados: 1
   - **Decisión:** Verificar si es específico de property o compartido

### Prioridad BAJA - No Migrar (Servicios Compartidos)

❌ **Mantener en shared services:**
- `InformationPropertyService` - Usado por 10+ componentes en múltiples features
- `GeneralValidationsService` - Servicio transversal de validaciones
- `CollectionServices` - Servicio transversal de colecciones
- `CommonGeneralValidationsService` - Validaciones comunes
- `PeopleService` - Gestión de personas (transversal)
- `ProceduresService` - Procedimientos (transversal)

❌ **Mantener en BPM workflows:**
- `AlfaMainService` - Específico de BPM
- `BpmCoreService` - Core de BPM
- `RrrightService` - Derechos (usado en múltiples features)

❌ **Mantener en ubicación actual:**
- `SnrService` - Integración con sistema externo (Super Notariado)
- `TerritorialOrganizationService` - Organización territorial (transversal)

## 📝 Servicios Faltantes (Posibles)

Componentes que podrían necesitar servicios propios:

- ❓ `AppraisalService` - Para gestión de avalúos
- ❓ `PropertyOwnerService` - Para gestión específica de propietarios
- ❓ `PropertyHistoricalService` - Para históricos de propiedades

## 🔄 Plan de Migración Actualizado

### Fase 1: Migrar 4 Servicios Core (Prioridad ALTA)
```bash
1. AdministrativeSourcesService → services/administrative-sources/
2. InformationAdjacentPropertyService → services/adjacent/
3. InformationConstructionsService → services/constructions/
4. InformationZonesService → services/zones/
```

### Fase 2: Evaluar y Decidir (Prioridad MEDIA)
```bash
5. PhotosService - ¿Migrar o mantener?
6. AlertsService - ¿Migrar o mantener?
```

### Fase 3: Crear Barrel Exports
```bash
- Crear index.ts en cada carpeta de services/
- Actualizar services/index.ts principal
```

### Fase 4: Actualizar Imports
```bash
- 2 componentes: administrative-sources
- 2 componentes: adjacent-properties
- 5 componentes: constructions
- 4 componentes: zones
- 1 componente: photos (si se migra)
- 1 componente: alerts (si se migra)
```

### Fase 5: Actualizar Shared Services Barrel
```bash
- Actualizar exports en src/app/shared/services/index.ts
```

## 📊 Métricas de Migración

- **Total servicios a migrar (Fase 1):** 4
- **Total servicios a evaluar (Fase 2):** 2
- **Total servicios que permanecen shared:** 8
- **Total servicios que permanecen en BPM:** 3
- **Total componentes afectados:** ~15

## ✅ Checklist de Validación

- [ ] Todos los servicios migrados
- [ ] Barrel exports creados
- [ ] Imports actualizados en componentes
- [ ] Imports actualizados en shared services
- [ ] Tests actualizados (si existen)
- [ ] Compilación exitosa
- [ ] Documentación actualizada

---

**Siguiente paso:** ¿Proceder con Fase 1 de migración?