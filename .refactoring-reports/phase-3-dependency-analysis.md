# Fase 3: Análisis de Dependencias - Property Management

**Fecha**: 29 de Octubre, 2025
**Estado**: 📊 ANÁLISIS

## 🔍 Problema Identificado

Durante la migración inicial del Lote 3.1, descubrimos que el componente `cadastral-information-property` actúa como un **contenedor principal** que importa 14 componentes hijos, causando dependencias circulares si se migra primero.

## 📊 Grafo de Dependencias

### Nivel 1: Contenedores Principales (Migrar AL FINAL)

#### A. `cadastral-information-property.component`
**Rol**: Contenedor principal con tabs para toda la información predial

**Importa 14 componentes**:
1. ✅ `BasicPropertyInformationComponent`
2. ✅ `InformationAddressesPropertyComponent`
3. ✅ `InformationPropertyOwnersComponent`
4. ✅ `InformationConstructionsPropertyComponent`
5. ✅ `InformationZonesPropertyComponent`
6. ✅ `InformationAdjacentPropertyComponent`
7. ✅ `PropertyAppraisalInformationComponent`
8. ✅ `AdministrativeSourcesComponent`
9. ✅ `AlertsComponent`
10. ✅ `PhotosComponent`
11. ✅ `InformationUnitPropertyComponent`
12. ✅ `BaunitIcaComponent`
13. ✅ `SuperNotariadoPropertyComponent`
14. ✅ `HistoricalActiveProceduresPropertyComponent`

#### B. `layout-card-cadastral-information-property-component.component`
**Rol**: Modal/Dialog wrapper para `cadastral-information-property`

**Importa**:
- `CadastralInformationPropertyComponent`

### Nivel 2: Componentes con Dependencias Internas

#### `information-property-owners.component`
**Importa**:
- `header-cadastral-information-property` (ya migrado en intento anterior)

#### `information-unit-property.component`
**Importa**:
- `header-cadastral-information-property`

#### `administrative-sources.component`
**Importa**:
- `header-cadastral-information-property`

### Nivel 3: Componentes Hoja (Sin dependencias de otros componentes de property)

Los siguientes componentes NO importan otros componentes de `information-property`:
- ✅ `alerts`
- ✅ `baunit-ica`
- ✅ `information-addresses-property`
- ✅ `information-adjacent-property`
- ✅ `information-constructions-property`
- ✅ `information-person-property`
- ✅ `information-source-property`
- ✅ `information-zones-property`
- ✅ `photos`
- ✅ `property-appraisal-information`
- ✅ `super-notariado-property`

### Componentes Especiales

#### `header-cadastral-information-property`
**Rol**: Componente compartido/header usado por múltiples componentes
**Usado por**:
- `information-property-owners`
- `information-unit-property`
- `administrative-sources`
- Y posiblemente otros

#### `basic-property-information`
**Tiene subcomponente**:
- `edit-basic-property-information` (modal de edición)

## 🎯 Nuevo Plan de Migración

### Estrategia: Bottom-Up (De hojas a raíz)

#### **Grupo 1: Componentes Compartidos** (Migrar PRIMERO)
```
src/app/features/property-management/components/shared/
├── header-cadastral-information/
```

**Componentes**:
- `header-cadastral-information-property` (1 componente)

**Razón**: Es usado por múltiples componentes, debe migrarse primero.

---

#### **Grupo 2: Componentes Hoja - Basic Info** (Sin dependencias)
```
src/app/features/property-management/components/basic-information/
├── basic-property-information/
│   ├── basic-property-information.component.ts
│   └── edit-basic-property-information/
```

**Componentes**: 2
**Dependencias**: Ninguna (solo shared)

---

#### **Grupo 3: Componentes Hoja - Addresses**
```
src/app/features/property-management/components/addresses/
└── information-addresses-property/
    ├── information-addresses-property.component.ts
    ├── add-edit-information-address/
    └── detail-information-address/
```

**Componentes**: 3
**Dependencias**: `header-cadastral-information-property` (ya migrado en Grupo 1)

---

#### **Grupo 4: Componentes Hoja - Constructions**
```
src/app/features/property-management/components/constructions/
└── information-constructions-property/
    ├── information-constructions-property.component.ts
    ├── calification-constructions-property/
    ├── construction-add-edit/
    ├── construction-detail/
    ├── construction-exterior-add-edit/
    └── construction-exterior-detail/
```

**Componentes**: ~8
**Dependencias**: `header-cadastral-information-property`

---

#### **Grupo 5: Componentes Hoja - Zones**
```
src/app/features/property-management/components/zones/
└── information-zones-property/
```

**Componentes**: Varios
**Dependencias**: `header-cadastral-information-property`

---

#### **Grupo 6: Componentes Hoja - Adjacent Properties**
```
src/app/features/property-management/components/adjacent-properties/
└── information-adjacent-property/
    ├── information-adjacent-property.component.ts
    ├── crud-information-adjacent-property/
    └── masive-delete-adjacent/
```

**Componentes**: 3+
**Dependencias**: `header-cadastral-information-property`

---

#### **Grupo 7: Componentes Hoja - Owners**
```
src/app/features/property-management/components/owners/
├── information-property-owners/
└── information-person-property/
```

**Componentes**: Varios
**Dependencias**: `header-cadastral-information-property`

---

#### **Grupo 8: Componentes Hoja - Administrative**
```
src/app/features/property-management/components/administrative/
├── administrative-sources/
│   ├── administrative-sources.component.ts
│   └── create-administrative-source/
└── alerts/
    ├── alerts.component.ts
    ├── create-alert/
    ├── detail-alerts/
    └── update-alert/
```

**Componentes**: ~6
**Dependencias**: `header-cadastral-information-property`

---

#### **Grupo 9: Componentes Hoja - Otros**
```
src/app/features/property-management/components/other/
├── baunit-ica/
├── information-source-property/
├── information-unit-property/
├── photos/
├── property-appraisal-information/
└── super-notariado-property/
```

**Componentes**: ~6
**Dependencias**: `header-cadastral-information-property`

---

#### **Grupo 10: Componente Especial - Historical**
```
src/app/features/property-management/components/core/
└── historical-active-procedures/
```

**Componentes**: 1
**Dependencias**: `header-cadastral-information-property`, `layout-card-cadastral`

---

#### **Grupo 11: Contenedor Principal** (Migrar AL FINAL)
```
src/app/features/property-management/components/core/
├── cadastral-information/
│   └── cadastral-information-property.component.ts
└── layout-card-cadastral/
    └── layout-card-cadastral-information-property-component.component.ts
```

**Componentes**: 2
**Dependencias**: TODOS los componentes anteriores (14 componentes)

---

## 📋 Nueva Estrategia de Commits

### Opción A: Commits por Grupo (RECOMENDADA)
- **11 commits** (uno por grupo)
- ✅ Cambios pequeños y manejables
- ✅ Fácil rollback
- ✅ Validación continua
- ✅ Mejor trazabilidad

**Estimado**: 3-4 horas

### Opción B: Commits por Tipo
- **3 commits**: Shared → Hojas → Contenedores
- ⚠️ Commits medianos
- ✅ Menos commits totales

**Estimado**: 2-3 horas

## ✅ Criterios de Éxito por Grupo

Cada grupo debe cumplir:
- [ ] Componentes migrados con `git mv`
- [ ] Imports actualizados (tanto en componentes migrados como en los que los usan)
- [ ] Build exitoso sin errores
- [ ] Commit con mensaje descriptivo

## 🎯 Lecciones Aprendidas

1. **Analizar dependencias ANTES de migrar**: No asumir que componentes relacionados son independientes
2. **Identificar contenedores principales**: Los componentes que importan muchos otros deben migrarse al final
3. **Migración Bottom-Up**: Empezar por componentes sin dependencias (hojas del árbol)
4. **Componentes compartidos primero**: Headers, layouts y componentes reutilizables deben ir primero

## 📊 Progreso Estimado

- **Total componentes**: ~47
- **Grupos de migración**: 11
- **Promedio componentes/grupo**: 4-5
- **Tiempo estimado total**: 3-4 horas
- **Commits estimados**: 11

---

**Próximo paso**: Usuario aprueba el nuevo plan y comenzamos con Grupo 1