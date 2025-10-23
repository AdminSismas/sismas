# 🏗️ Nueva Arquitectura - Guía de Uso

## 📁 Estructura de Importaciones

### ✅ **Antes (Problemático):**

```typescript
// Imports con rutas relativas complejas
import { BpmCoreService } from '../../../services/bpm/bpm-core.service';
import { LoaderComponent } from '../../../../components/general-components/loader/loader.component';
import { AuthGuard } from '../../../guards/auth.guard';
```

### ✅ **Después (Limpio):**

```typescript
// Imports con barrel exports limpios
import { BmpCoreService } from '@features/bmp-workflows';
import { LoaderComponent } from '@shared/ui';
import { AuthGuard } from '@core/guards';
```

## 🎯 **Patrones de Uso por Feature**

### **1. Core (Servicios Singleton)**

```typescript
// Imports desde core
import { AuthGuard, RoleGuard } from '@core/guards';
import { AuthInterceptor } from '@core/interceptors';
import { SplashScreenService } from '@core/services';

// Uso en providers
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
]
```

### **2. Shared (Componentes Reutilizables)**

```typescript
// Imports desde shared
import { LoaderComponent, InputComponent, ModalComponent } from '@shared/ui';
import { CurrencyPipe, DatePipe } from '@shared/pipes';
import { FluidHeightDirective } from '@shared/directives';

// Uso en componentes
@Component({
  imports: [LoaderComponent, InputComponent],
  template: `
    <app-loader *ngIf="loading"></app-loader>
    <app-input [(value)]="searchTerm"></app-input>
  `
})
```

### **3. Features (Módulos por Dominio)**

```typescript
// BMP Workflows Feature
import { 
  BmpCoreService, 
  WorkflowService, 
  TasksPanelService 
} from '@features/bmp-workflows/services';

import { 
  ClearInformationDataComponent,
  DocumentTableComponent 
} from '@features/bmp-workflows/components';

import { ProFlow, ProTask } from '@features/bmp-workflows/models';

// Property Management Feature
import { 
  PropertyService,
  AppraisalService 
} from '@features/property-management/services';
```

## 🔧 **Path Mapping en tsconfig.json**

```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@layouts/*": ["src/app/layouts/*"]
    }
  }
}
```

## 📦 **Estructura de Feature Module**

```typescript
// src/app/features/property-management/property.module.ts
@NgModule({
  imports: [
    CommonModule,
    // Shared components
    LoaderComponent,
    InputComponent,
    // Core services se inyectan automáticamente
  ],
  declarations: [
    PropertyListComponent,
    PropertyDetailComponent,
    PropertyFormComponent
  ],
  providers: [
    PropertyService,
    AppraisalService,
    PropertyFacadeService
  ]
})
export class PropertyManagementModule { }
```

## 🎭 **Facade Pattern para Servicios**

```typescript
// src/app/features/property-management/services/property-facade.service.ts
@Injectable()
export class PropertyFacadeService {
  constructor(
    private propertyService: PropertyService,
    private bmpService: BmpCoreService,
    private validationService: ValidationService
  ) {}

  // Encapsula operaciones complejas
  async getPropertyWithWorkflow(id: string): Promise<PropertyWithWorkflow> {
    const property = await this.propertyService.getById(id);
    const workflow = await this.bmpService.getWorkflowForProperty(id);
    const validation = this.validationService.validateProperty(property);
    
    return { property, workflow, validation };
  }

  async savePropertyWithValidation(property: Property): Promise<void> {
    const validation = this.validationService.validateProperty(property);
    if (validation.isValid) {
      await this.propertyService.save(property);
      await this.bmpService.triggerWorkflow(property.id);
    } else {
      throw new ValidationError(validation.errors);
    }
  }
}
```

## 🏃‍♂️ **Migración Gradual**

### **Paso 1: Imports Actualizados**

```typescript
// Cambiar gradualmente los imports existentes
// De:
import { Service } from '../../../services/old/path';
// A:
import { Service } from '@features/domain/services';
```

### **Paso 2: Barrel Exports**

```typescript
// Crear index.ts en cada carpeta
export * from './component1';
export * from './component2';
export * from './service1';
```

### **Paso 3: Path Aliases**

```typescript
// Actualizar tsconfig.json con paths
"@domain/*": ["src/app/features/domain/*"]
```

## 📊 **Beneficios Inmediatos**

### **Antes:**

- ❌ 741 imports relativos `../../../`
- ❌ Acoplamiento alto entre módulos  
- ❌ Difícil de mantener y refactorizar
- ❌ Testing complejo por dependencias

### **Después:**

- ✅ Imports limpios con barrel exports
- ✅ Separación clara de responsabilidades
- ✅ Fácil mantenimiento y testing
- ✅ Escalabilidad mejorada

## 🔄 **Próximos Pasos**

1. **Actualizar imports** en archivos existentes
2. **Configurar path mapping** en tsconfig.json  
3. **Migrar módulos restantes** siguiendo este patrón
4. **Crear facades** para servicios complejos
5. **Implementar lazy loading** por features

---

**Esta nueva arquitectura reduce significativamente la complejidad y mejora la mantenibilidad del código.**
