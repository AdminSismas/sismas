# Componentes Específicos por Tenant

Este directorio contiene componentes específicos para cada tenant (municipio).

## Estructura

```
tenant-specific/
├── armenia/
│   └── components/
├── manizales/
│   └── components/
├── barrancabermeja/
│   └── components/
├── calarca/
│   └── components/
├── filandia/
│   └── components/
├── masora/
│   └── components/
├── montenegro/
│   └── components/
├── quimbaya/
│   └── components/
└── test/
    └── components/
```

## Uso

Los componentes en este directorio son cargados dinámicamente por el `TenantLazyLoadingService` basándose en la configuración actual del tenant.

### Ejemplo de Implementación

```typescript
// En tu componente
constructor(
  private tenantLazyLoading: TenantLazyLoadingService,
  private viewContainer: ViewContainerRef
) {}

loadCustomComponent() {
  this.tenantLazyLoading.loadTenantComponent('custom-header', this.viewContainer)
    .subscribe(componentRef => {
      // Componente cargado exitosamente
      console.log('Componente específico del tenant cargado:', componentRef);
    });
}
```

### Agregar Nuevos Componentes de Tenant

1. Crear el componente en el directorio del tenant correspondiente
2. Registrarlo en el `TenantLazyLoadingService.tenantComponentsMap`
3. El componente estará disponible automáticamente para carga lazy

## Beneficios

- **Tamaño de Bundle Reducido**: Solo cargar componentes necesarios para el tenant actual
- **Personalización por Tenant**: Cada municipio puede tener componentes UI únicos
- **Flexibilidad en Runtime**: Cambiar entre configuraciones de tenant sin recompilar
- **Mantenibilidad**: Separación clara del código específico por tenant
