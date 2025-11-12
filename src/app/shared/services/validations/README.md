# Shared Validations Services

Esta carpeta contendrá servicios de validación que son utilizados por múltiples features.

## 🎯 Servicios a migrar desde `/src/app/apps/services/validations/`:

### Servicio principal:
- `general-validations.service.ts` → `/shared/services/validations/general-validations.service.ts`

## 📁 Estructura recomendada:
```
shared/services/validations/
├── general-validations.service.ts    # Validaciones generales
└── index.ts                         # Barrel exports
```

## 🔧 Acciones después de la migración:
1. Actualizar imports a usar alias `@shared/services/validations`
2. Verificar que el servicio no tenga dependencias específicas de features
3. Actualizar el archivo `@shared/services/index.ts` para incluir validaciones
4. Actualizar providers en módulos correspondientes

## ✅ Consideraciones:
- Este servicio debe ser agnóstico de features específicas
- Contiene validaciones reutilizables en toda la aplicación
- Ideal para validaciones de formularios, datos y reglas de negocio generales