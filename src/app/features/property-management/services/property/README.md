# Property Management - Property Services

Esta subcarpeta contendrá los servicios específicos de gestión de propiedades.

## 🎯 Servicios a migrar desde `/src/app/apps/services/information-property/`:

### Servicio principal:
- `administrative-sources.service.ts` → `/property-management/services/administrative-sources/administrative-sources.service.ts`

### Desde `/src/app/apps/services/territorial-organization/`:
- `information-property.service.ts` → `/property-management/services/property/information-property.service.ts` (evaluar ubicación)

## 📁 Estructura recomendada:
```
property-management/services/property/
├── information-property.service.ts    # Información general de propiedades
└── index.ts                          # Barrel exports
```

## 🔧 Acciones después de la migración:
1. Actualizar imports a usar alias `@features/property-management/services/property`
2. Verificar dependencias con otros servicios de property-management
3. Evaluar si `information-property.service.ts` debe estar aquí o en territorial-organization

## ⚠️ Nota importante:
Verificar las dependencias del servicio `information-property.service.ts` para determinar su ubicación óptima.