# Property Management - Administrative Sources Services

Esta subcarpeta contendrá los servicios específicos de gestión de fuentes administrativas.

## 🎯 Servicios a migrar desde `/src/app/apps/services/information-property/`:

### Servicio principal:
- `administrative-sources.service.ts` → `/property-management/services/administrative-sources/administrative-sources.service.ts`

## 📁 Estructura recomendada:
```
property-management/services/administrative-sources/
├── administrative-sources.service.ts    # Gestión de fuentes administrativas
└── index.ts                           # Barrel exports
```

## 🔧 Acciones después de la migración:
1. Actualizar imports a usar alias `@features/property-management/services/administrative-sources`
2. Verificar integración con componentes de fuentes administrativas
3. Actualizar providers en módulos correspondientes

## 📋 Funcionalidades:
- Gestión de fuentes administrativas de propiedades
- CRUD de documentos administrativos
- Integración con componentes de administrative-sources