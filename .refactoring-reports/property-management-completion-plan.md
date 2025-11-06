# Plan de Completación: Property Management Feature

**Fecha**: 2025-11-02
**Estado Actual**: 60% completado
**Objetivo**: Llevar Property Management al 100%

---

## 📊 Estado Actual

### ✅ Ya Migrado

**Componentes** (47+):
- `/features/property-management/components/` - Todos los componentes principales
- Adjacent properties, constructions, zones, owners, appraisals, etc.

**Servicios** (4):
- AdministrativeSourcesService
- InformationAdjacentPropertyService
- InformationConstructionsService
- InformationZonesService

### ⏳ Pendiente de Migración

**Componentes** (2):
1. `information-person-property` - Dialog para mostrar información de personas
2. `layout-card-cadastral-information-property-component` - Layout modal para información catastral

**Servicios** (3 específicos de Property Management):
1. `territorial-organization/information-property.service.ts` - Servicio de información de predios
2. `snr/snr.service.ts` - Integración con Sistema Nacional de Registro
3. `photos/photos.service.ts` - Gestión de fotos de propiedades

**Interfaces/Modelos** (27 archivos):
- Todo el directorio `apps/interfaces/information-property/`

---

## 📋 Inventario Detallado

### 1. Componentes Pendientes

#### information-person-property
```
Ubicación: apps/components/information-property/information-person-property/
Archivos:
  - information-person-property.component.ts
  - information-person-property.component.html
  - information-person-property.component.scss

Dependencias:
  - snr-person-info interface
  - SnrService
  - Shared constants (TABLE_COLUMN_PROPERTIES_PERSON)

Uso: Dialog para mostrar información de personas del SNR
Tipo: Modal/Dialog component
```

#### layout-card-cadastral-information-property-component
```
Ubicación: apps/components/information-property/layout-card-cadastral-information-property-component/
Archivos:
  - layout-card-cadastral-information-property-component.component.ts
  - layout-card-cadastral-information-property-component.component.html
  - layout-card-cadastral-information-property-component.component.scss

Dependencias:
  - CadastralInformationPropertyComponent (ya migrado)
  - InformationPropertyService
  - BaunitHead interface
  - ContentInfoSchema model
  - Various shared constants

Uso: Layout modal para mostrar información catastral completa
Tipo: Modal/Dialog layout wrapper
```

### 2. Servicios Pendientes

#### InformationPropertyService
```
Ubicación: apps/services/territorial-organization/information-property.service.ts

Funcionalidad:
  - CRUD de información de predios
  - Consultas de propiedades por NPH, NPNL
  - Actualización de información catastral

Destino: features/property-management/services/property/
Prioridad: ALTA (usado por layout-card-cadastral)
```

#### SnrService
```
Ubicación: apps/services/snr/snr.service.ts

Funcionalidad:
  - Integración con Sistema Nacional de Registro
  - Consulta de folios de matrícula
  - Consulta de personas registradas
  - Consulta de fuentes administrativas SNR

Destino: features/property-management/services/snr/
Prioridad: ALTA (usado por information-person-property)
```

#### PhotosService
```
Ubicación: apps/services/photos/photos.service.ts

Funcionalidad:
  - Upload de fotos de propiedades
  - Gestión de galería de imágenes
  - Descarga de fotos

Destino: features/property-management/services/photos/
Prioridad: MEDIA
```

### 3. Interfaces/Modelos Pendientes (27 archivos)

#### Grupo 1: Información Básica (7 archivos)
```
- basic-information-property.ts
- basic-information-address.ts
- basic-information-construction.ts
- basic-detail-group.ts
- basic-master-group.ts
- national-predial-number.ts
- baunit-head.model.ts
```

#### Grupo 2: Zonas (4 archivos)
```
- info-zones.ts
- zone-baunit.ts
- rural-physical-zone.ts
- urban-physical-zone.ts
- geo-economic-zone.ts (mantener referencia en shared)
```

#### Grupo 3: Personas y Contacto (3 archivos)
```
- info-person.ts
- info-contact.ts
- snr-person-info.ts
```

#### Grupo 4: SNR (3 archivos)
```
- snr-folio-info.ts
- snr-source-info.ts
- administrative-source.ts (ya puede estar migrado)
```

#### Grupo 5: Construcciones (3 archivos)
```
- content-information-construction.ts
- cc-calificacion-ub.ts
- types-qualification-ub.ts
```

#### Grupo 6: Otros (7 archivos)
```
- info-appraisal.ts
- information-adjacent.ts
- baunit-npnlike.ts
- baunit-head-percentage.model.ts
- photos.ts
- alerts.interface.ts
- detail-basic-information-address.ts
```

---

## 🎯 Plan de Ejecución

### Fase 1: Migrar Modelos (Prioridad ALTA)
**Duración estimada**: 30-45 minutos

```bash
# Paso 1: Mover todos los archivos de interfaces
git mv src/app/apps/interfaces/information-property/* \
       src/app/features/property-management/models/

# Paso 2: Crear barrel export
# Crear models/index.ts con exports de todos los archivos

# Paso 3: Verificar compilación
pnpm build
```

**Archivos a mover**: 27 interfaces
**Destino**: `/features/property-management/models/`

### Fase 2: Migrar Servicios (Prioridad ALTA)
**Duración estimada**: 45-60 minutos

#### 2.1 InformationPropertyService
```bash
# Mover servicio
git mv src/app/apps/services/territorial-organization/information-property.service.ts \
       src/app/features/property-management/services/property/

# Modernizar con inject()
# Actualizar imports a usar @features/property-management/models
```

#### 2.2 SnrService
```bash
# Mover servicio
git mv src/app/apps/services/snr/snr.service.ts \
       src/app/features/property-management/services/snr/

# Modernizar con inject()
# Actualizar imports
```

#### 2.3 PhotosService
```bash
# Mover servicio
git mv src/app/apps/services/photos/photos.service.ts \
       src/app/features/property-management/services/photos/

# Modernizar con inject()
# Actualizar imports
```

### Fase 3: Migrar Componentes (Prioridad MEDIA)
**Duración estimada**: 30-45 minutos

#### 3.1 information-person-property
```bash
# Mover componente
git mv src/app/apps/components/information-property/information-person-property \
       src/app/features/property-management/components/

# Modernizar con inject()
# Actualizar imports
```

#### 3.2 layout-card-cadastral-information-property-component
```bash
# Mover componente
git mv src/app/apps/components/information-property/layout-card-cadastral-information-property-component \
       src/app/features/property-management/components/

# Modernizar con inject()
# Actualizar imports
# Simplificar nombre si es posible
```

### Fase 4: Actualizar Referencias (Prioridad ALTA)
**Duración estimada**: 30-45 minutos

```bash
# Buscar archivos que importan desde apps/services/information-property
grep -r "apps/services/territorial-organization/information-property" src/

# Buscar archivos que importan desde apps/services/snr
grep -r "apps/services/snr" src/

# Buscar archivos que importan interfaces de information-property
grep -r "apps/interfaces/information-property" src/

# Actualizar shared/services/index.ts
# Actualizar shared/interfaces/index.ts
```

### Fase 5: Limpieza y Validación (Prioridad ALTA)
**Duración estimada**: 15-20 minutos

```bash
# Eliminar carpetas vacías
rmdir src/app/apps/components/information-property
rmdir src/app/apps/interfaces/information-property
rmdir src/app/apps/services/snr
rmdir src/app/apps/services/photos
rmdir src/app/apps/services/territorial-organization (si está vacía)

# Validar compilación final
pnpm build

# Validar que no hay imports rotos
pnpm lint
```

### Fase 6: Commit y Documentación (Prioridad MEDIA)
**Duración estimada**: 10-15 minutos

```bash
# Crear commit descriptivo
git add -A
git commit -m "refactor(property-management): complete feature migration to 100%"

# Actualizar documentación
# - README.md con progreso actualizado
# - Crear phase-5-property-management-completion.md
```

---

## ⏱️ Tiempo Total Estimado

| Fase | Duración | Prioridad |
|------|----------|-----------|
| Fase 1: Modelos | 30-45 min | ALTA |
| Fase 2: Servicios | 45-60 min | ALTA |
| Fase 3: Componentes | 30-45 min | MEDIA |
| Fase 4: Referencias | 30-45 min | ALTA |
| Fase 5: Limpieza | 15-20 min | ALTA |
| Fase 6: Commit | 10-15 min | MEDIA |
| **TOTAL** | **2.5-3.5 horas** | - |

---

## 🚨 Riesgos y Consideraciones

### Riesgos Identificados

1. **Alto uso de interfaces**
   - 27 archivos de interfaces que pueden estar importados en muchos lugares
   - Riesgo: Muchos archivos que actualizar
   - Mitigación: Usar búsqueda global para encontrar todos los imports

2. **Servicios críticos**
   - InformationPropertyService puede estar muy usado
   - SnrService es integración externa
   - Riesgo: Romper funcionalidad crítica
   - Mitigación: Validar compilación después de cada cambio

3. **Componentes modal**
   - Ambos componentes son modals/dialogs
   - Riesgo: Problemas con imports dinámicos en MatDialog
   - Mitigación: Verificar que los componentes se importan correctamente

### Dependencias Críticas

```
InformationPropertyService
  ├─> usado por layout-card-cadastral
  ├─> posiblemente usado en otros componentes de property-management
  └─> verificar con grep antes de mover

SnrService
  ├─> usado por information-person-property
  ├─> posiblemente usado en otros componentes
  └─> integración con API externa del SNR

PhotosService
  ├─> usado en componentes de property-management
  └─> gestión de assets/uploads
```

---

## ✅ Checklist de Validación

### Pre-migración
- [  ] Backup de la rama actual
- [  ] Build exitoso antes de empezar
- [  ] Git status limpio

### Durante Migración
- [  ] Cada fase compila exitosamente
- [  ] Imports actualizados correctamente
- [  ] Servicios modernizados con inject()
- [  ] Barrel exports creados

### Post-migración
- [  ] Build final exitoso
- [  ] No hay errores de TypeScript
- [  ] No hay warnings de linting
- [  ] Todas las carpetas vacías eliminadas
- [  ] Documentación actualizada
- [  ] Commit creado con mensaje descriptivo

---

## 📈 Resultado Esperado

Al completar esta migración, Property Management estará al **100%**:

- ✅ **49 componentes** migrados (47 actuales + 2 nuevos)
- ✅ **7 servicios** migrados (4 actuales + 3 nuevos)
- ✅ **27 modelos/interfaces** organizados
- ✅ Feature completamente autocontenido en `/features/property-management/`
- ✅ Eliminación completa de `/apps/components/information-property/`
- ✅ Eliminación completa de `/apps/interfaces/information-property/`

**Progreso del proyecto**: 78% → **85%**

---

## 🎯 Próximos Pasos Después

Una vez completado Property Management:

1. **Configuration Feature** - 4 servicios de usuarios + componentes
2. **Shared Resources** - Componentes UI reutilizables
3. **Operation Support** - Servicios de reportes
4. **Final Cleanup** - Eliminar carpeta apps/ completa

---

**Última actualización**: 2025-11-02
**Creado por**: Claude (AI Assistant)
**Usuario**: Refactorización GeoGestion V2
