# Property Management - Zones Services

Esta subcarpeta contendrá los servicios específicos de gestión de zonas en propiedades.

## 🎯 Servicios a migrar desde `/src/app/apps/services/information-property/information-zones-property/`:

### Servicio principal:
- `information-zones.service.ts` → `/property-management/services/zones/information-zones.service.ts`

## 📁 Estructura recomendada:
```
property-management/services/zones/
├── information-zones.service.ts    # Gestión de zonas de propiedades
└── index.ts                       # Barrel exports
```

## 🔧 Acciones después de la migración:
1. Actualizar imports a usar alias `@features/property-management/services/zones`
2. Verificar integración con componentes de zonas
3. Actualizar providers en módulos correspondientes

## 🗺️ Funcionalidades:
- Gestión de zonas geoeconómicas y físicas
- Integración con servicios de economic-zones
- CRUD de información de zonas