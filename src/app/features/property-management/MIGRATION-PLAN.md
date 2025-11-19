# Property Management - Migration Plan

**Fecha:** 2025-11-02
**Estado:** Pendiente de migración

## 📋 Resumen Ejecutivo

La carpeta `property-management` tiene una estructura preparada pero los servicios aún no han sido migrados desde `src/app/apps/services/information-property/`. Este documento detalla el plan de migración completo.

## 🏗️ Estructura Actual

### Servicios Identificados para Migrar

Ubicación actual: `src/app/apps/services/information-property/`

```
apps/services/information-property/
├── administrative-sources.service.ts           → services/administrative-sources/
├── information-adjacent-property/
│   └── information-adjacent-property.service.ts → services/adjacent/
├── information-constructions-property/
│   └── information-constructions.service.ts     → services/constructions/
└── information-zones-property/
    └── information-zones.service.ts             → services/zones/
```

### Carpetas Destino Preparadas

```
features/property-management/services/
├── adjacent/                    # ✅ Preparada (README)
├── administrative-sources/      # ✅ Preparada (README)
├── constructions/               # ✅ Preparada (README)
├── property/                    # ✅ Preparada (README)
├── zones/                       # ✅ Preparada (README)
└── baunit-ica.service.ts        # ⚠️ Ya existe en raíz
```

## 📦 Plan de Migración

### Fase 1: Mover Servicios

#### 1.1 Administrative Sources
```bash
mv src/app/apps/services/information-property/administrative-sources.service.ts \
   src/app/features/property-management/services/administrative-sources/
```

#### 1.2 Adjacent Properties
```bash
mv src/app/apps/services/information-property/information-adjacent-property/information-adjacent-property.service.ts \
   src/app/features/property-management/services/adjacent/
```

#### 1.3 Constructions
```bash
mv src/app/apps/services/information-property/information-constructions-property/information-constructions.service.ts \
   src/app/features/property-management/services/constructions/
```

#### 1.4 Zones
```bash
mv src/app/apps/services/information-property/information-zones-property/information-zones.service.ts \
   src/app/features/property-management/services/zones/
```

### Fase 2: Crear Barrel Exports

#### 2.1 Crear index.ts en cada carpeta

**services/adjacent/index.ts**
```typescript
export * from './information-adjacent-property.service';
```

**services/administrative-sources/index.ts**
```typescript
export * from './administrative-sources.service';
```

**services/constructions/index.ts**
```typescript
export * from './information-constructions.service';
```

**services/zones/index.ts**
```typescript
export * from './information-zones.service';
```

#### 2.2 Crear barrel principal

**services/index.ts**
```typescript
// Adjacent properties
export * from './adjacent';

// Administrative sources
export * from './administrative-sources';

// Constructions
export * from './constructions';

// ICA
export * from './baunit-ica.service';

// Zones
export * from './zones';
```

### Fase 3: Actualizar Imports

#### 3.1 Ubicaciones a actualizar

**En componentes:**
```typescript
// ANTES
import { InformationAdjacentPropertyService } from 'src/app/apps/services/information-property/...';

// DESPUÉS
import { InformationAdjacentPropertyService } from '@features/property-management/services';
```

**En shared/services/index.ts:**
```typescript
// ANTES
export { InformationAdjacentPropertyService } from '../../apps/services/information-property/...';

// DESPUÉS
export { InformationAdjacentPropertyService } from '@features/property-management/services';
```

#### 3.2 Componentes afectados (estimado)

- `components/adjacent-properties/` (3-5 archivos)
- `components/administrative-sources/` (2-3 archivos)
- `components/constructions/` (5-7 archivos)
- `components/zones/` (4-6 archivos)
- Otros componentes que usen estos servicios

### Fase 4: Servicios Faltantes

Buscar si existen más servicios relacionados con property management:

```bash
# Buscar servicios relacionados con owners
grep -r "PropertyOwner" src/app/apps/services/

# Buscar servicios de appraisal
grep -r "Appraisal" src/app/apps/services/

# Buscar servicios de addresses
grep -r "Address" src/app/apps/services/
```

### Fase 5: Validación

#### 5.1 Compilación
```bash
pnpm build
```

#### 5.2 Tests (si existen)
```bash
pnpm test
```

#### 5.3 Checklist
- [ ] Todos los servicios movidos
- [ ] Barrel exports creados
- [ ] Imports actualizados en componentes
- [ ] Imports actualizados en shared services
- [ ] Compilación exitosa
- [ ] Tests pasando
- [ ] READMEs eliminados o actualizados

## 🎯 Estructura Final Esperada

```
features/property-management/
├── components/
│   ├── addresses/
│   ├── adjacent-properties/
│   ├── administrative-sources/
│   ├── alerts/
│   ├── appraisal/
│   ├── basic-information/
│   ├── constructions/
│   ├── historical/
│   ├── ica/
│   ├── information-unit-property/
│   ├── owners/
│   ├── photos/
│   ├── shared/
│   ├── super-notariado-property/
│   └── zones/
│
├── services/
│   ├── index.ts                                    # Barrel principal
│   ├── adjacent/
│   │   ├── index.ts
│   │   └── information-adjacent-property.service.ts
│   ├── administrative-sources/
│   │   ├── index.ts
│   │   └── administrative-sources.service.ts
│   ├── constructions/
│   │   ├── index.ts
│   │   └── information-constructions.service.ts
│   ├── property/                                   # Para futuros servicios
│   │   └── index.ts
│   ├── zones/
│   │   ├── index.ts
│   │   └── information-zones.service.ts
│   └── baunit-ica.service.ts
│
├── constants/
│   ├── index.ts
│   └── ica/
│       └── baunit-ica.constant.ts
│
└── models/
    └── (por explorar)
```

## 📝 Notas Importantes

1. **No modificar components/** - Solo actualizar imports
2. **Mantener tests** - Mover archivos .spec.ts junto con los servicios
3. **Actualizar tsconfig paths** - Si es necesario
4. **Documentar cambios** - Actualizar READMEs
5. **Git commits incrementales** - Un commit por fase

## 🚀 Próximos Pasos Sugeridos

1. ✅ Completar migración de servicios
2. ⏭️ Organizar carpeta `models/`
3. ⏭️ Revisar y organizar `constants/`
4. ⏭️ Crear documentación de arquitectura
5. ⏭️ Implementar tests unitarios

---

**¿Proceder con la migración?**
- Ejecutar comandos de Fase 1
- Crear barrel exports de Fase 2
- Actualizar imports de Fase 3
- Validar compilación de Fase 5