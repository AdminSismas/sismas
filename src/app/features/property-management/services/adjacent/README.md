# Property Management - Adjacent Properties Services

Esta subcarpeta contendrá los servicios específicos de gestión de propiedades adyacentes.

## 🎯 Servicios a migrar desde `/src/app/apps/services/information-property/information-adjacent-property/`:

### Servicios principales:
- `information-adjacent-property.service.ts` → `/property-management/services/adjacent/information-adjacent-property.service.ts`
- `information-adjacent-property.service.spec.ts` → `/property-management/services/adjacent/information-adjacent-property.service.spec.ts`

## 📁 Estructura recomendada:
```
property-management/services/adjacent/
├── information-adjacent-property.service.ts      # Gestión de propiedades adyacentes
├── information-adjacent-property.service.spec.ts # Tests del servicio
└── index.ts                                     # Barrel exports
```

## 🔧 Acciones después de la migración:
1. Actualizar imports a usar alias `@features/property-management/services/adjacent`
2. Verificar integración con componentes de propiedades adyacentes
3. Mantener los tests asociados
4. Actualizar providers en módulos correspondientes

## 🏘️ Funcionalidades:
- Gestión de información de propiedades adyacentes
- CRUD de relaciones entre propiedades
- Validaciones de adyacencia