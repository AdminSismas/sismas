# Property Management - Constructions Services

Esta subcarpeta contendrá los servicios específicos de gestión de construcciones en propiedades.

## 🎯 Servicios a migrar desde `/src/app/apps/services/information-property/information-constructions-property/`:

### Servicio principal:
- `information-constructions.service.ts` → `/property-management/services/constructions/information-constructions.service.ts`

## 📁 Estructura recomendada:
```
property-management/services/constructions/
├── information-constructions.service.ts    # Gestión de construcciones
└── index.ts                               # Barrel exports
```

## 🔧 Acciones después de la migración:
1. Actualizar imports a usar alias `@features/property-management/services/constructions`
2. Verificar integración con componentes de construcciones
3. Actualizar providers en módulos correspondientes

## 🏗️ Funcionalidades:
- Gestión de información de construcciones
- CRUD de datos de construcción
- Integración con componentes de construcciones