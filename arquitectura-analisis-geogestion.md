# 📊 Análisis y Plan de Refactorización Arquitectural - GeoGestion V2

## 📋 Resumen Ejecutivo

**Fecha de Análisis:** 28 de Octubre, 2025
**Versión del Proyecto:** Angular 18.2.19
**Analista:** Claude Code
**Herramientas Utilizadas:** Angular Toolkit MCP, Context7, Análisis estático de código

---

## 🎯 Objetivos del Refactoring

### Objetivos Principales

1. **MOVER (NO COPIAR)** archivos de `/apps` a `/features` organizados por dominio funcional
2. **Eliminar barrel exports** para componentes y servicios (mantener SOLO para interfaces/modelos/constantes)
3. **Modernizar sintaxis Angular 18+** reemplazando decoradores específicos por funciones signal-based
4. **Trabajar por secciones/dominios** de forma incremental y controlada con validación continua

### ✅ Mantener (NO modificar)

- ✅ **Environments**: Mantener los 12 archivos de environment actuales
- ✅ **Guards**: Mantener guards actuales (no convertir a funcionales)
- ✅ **Decoradores de framework**: `@Component`, `@Injectable`, `@Pipe`, `@Directive`, `@NgModule`, `@Interceptor`

### ⚡ Modernizar (Reemplazar decoradores específicos)

| Decorador Actual | Reemplazar por | Prioridad |
|------------------|----------------|-----------|
| `@Input()` | `input()` / `input.required()` | 🔴 Alta |
| `@Output()` | `output()` | 🔴 Alta |
| `@ViewChild()` | `viewChild()` / `viewChild.required()` | 🟡 Media |
| `@ViewChildren()` | `viewChildren()` | 🟡 Media |
| `@ContentChild()` | `contentChild()` | 🟡 Media |
| `@ContentChildren()` | `contentChildren()` | 🟡 Media |
| Constructor injection | `inject()` function | 🔴 Alta |
| `BehaviorSubject`/`ReplaySubject` | `signal()` / `computed()` | 🔴 Alta |

---

## 🏗️ Arquitectura Actual

### Información Básica del Proyecto

- **Tipo:** Aplicación Angular monolítica con arquitectura multi-tenant
- **Framework:** Angular 18.2 con componentes standalone
- **Dominio:** Sistema de gestión cadastral para municipios colombianos
- **Template Base:** Vex Admin Template con Angular Material + Tailwind CSS
- **Testing:** Jest para pruebas unitarias
- **Package Manager:** pnpm (enforced)

### Estadísticas del Proyecto

```
Total de archivos TypeScript: 571
├── Archivos en /apps: 319
│   ├── Componentes: 111
│   ├── Servicios: 57
│   ├── Interfaces/Models: 45+
│   └── Constants: 25+
├── Componentes standalone: 122 (38%)
├── Servicios con providedIn: 58
├── Decoradores en uso: 181 archivos
└── Uso de control flow moderno (@if/@for): 441 ocurrencias
```

### Municipios Soportados (12 configuraciones)

- Armenia
- Barrancabermeja
- Calarcá
- Filandia
- Manizales
- Masora
- Montenegro
- Quimbaya
- Soporte
- Test
- Producción (prod)

---

## 🚨 Problemas Críticos Identificados

### 1. **Acoplamiento Excesivo** 🔴 CRÍTICO

#### Métricas

- **116 archivos** con imports relativos `../../../` o más profundos
- **543 imports** usando `@shared/` (buena práctica, pero algunos apuntan a `/apps`)
- Dependencias cruzadas entre dominios sin boundaries claros

#### Ejemplos Problemáticos

```typescript
// Patrón encontrado frecuentemente:
import { TableAlfaMainComponent } from 'src/app/apps/components/bpm/table-alfa-main/table-alfa-main.component';
import { getRandomInt } from '../../../../utils/general';

// Cross-boundary imports:
import { DetailInformationTasksComponent } from 'src/app/pages/pages/my-work/tasks/components/detail-information-tasks/detail-information-tasks.component';
```

#### Impacto

- Mantenimiento extremadamente difícil
- Refactoring riesgoso y propenso a errores
- Testing complejo por dependencias transitivas
- Violación del principio de responsabilidad única

### 2. **Estructura Arquitectural Inconsistente** 🔴 ALTO

#### Problema: Organización Fragmentada

```
❌ Estructura Actual (Problemática):
src/app/apps/
├── components/               # Mezclando organización por dominio y por tipo
│   ├── bpm/                  # Por dominio (20+ componentes)
│   ├── information-property/ # Por dominio (45+ componentes)
│   ├── general-components/   # Por tipo (30+ componentes)
│   ├── tables/               # Por tipo (15+ componentes)
│   └── geographics/          # Por dominio (2 componentes)
├── services/                 # 57 servicios sin cohesión clara
│   ├── bpm/
│   ├── general/
│   └── information-property/
├── interfaces/               # 14 subdirectorios sin organización
└── constants/                # Duplicación entre dominios
```

#### Problema: Barrel Exports Problemáticos

```typescript
// shared/services/index.ts - ACOPLAMIENTO CON /apps
export { LoadingServiceService } from '../../apps/services/general/loading-service.service';
export { AlfaMainService } from '../../apps/services/bpm/core/alfa-main.service';

// shared/interfaces/index.ts - LEAKY ABSTRACTION
export * from '../../apps/interfaces/bpm/operation';
```

**Consecuencias:**
- Barrel files creando dependencias ocultas
- Dificulta tree-shaking
- Acopla `/shared` con `/apps`
- Confusión sobre dónde vive realmente el código

### 3. **Adopción Parcial de Angular 18+** 🟡 MEDIO

#### Estado Actual

| Característica | Adoptado | Pendiente | Total |
|----------------|----------|-----------|-------|
| **Standalone Components** | 122 | 59 | 181 componentes |
| **Control Flow (@if/@for)** | 441 usos | - | Buena adopción |
| **Signal Inputs** | Pocos | Mayoría usa `@Input()` | ~200+ inputs |
| **inject() function** | Parcial | Constructor injection prevalente | 181 archivos |
| **signal() State** | Mínimo | `BehaviorSubject` predomina | ~60+ servicios |

#### Oportunidad de Mejora

El proyecto ya muestra buena adopción de patrones modernos (122 componentes standalone, 441 usos de control flow), pero falta consistencia total.

---

## 🎯 Nueva Estructura Propuesta

### Principios de Organización

1. **Feature-based architecture**: Organizar por dominio de negocio
2. **NO barrel exports para components/services**: Importación directa obligatoria
3. **SÍ barrel exports para models/constants**: Para facilitar importaciones de tipos
4. **Boundaries claros**: Cada feature es autocontenido

### Estructura Objetivo

```
src/app/
│
├── features/                      # 🎯 DOMINIOS DE NEGOCIO
│   │
│   ├── bpm-workflows/             # Business Process Management
│   │   ├── components/            # ❌ SIN index.ts (importación directa)
│   │   │   ├── alfa-main/
│   │   │   │   ├── alfa-main.component.ts
│   │   │   │   ├── alfa-main.component.html
│   │   │   │   └── alfa-main.component.scss
│   │   │   ├── workflow-header/
│   │   │   ├── property-units/
│   │   │   ├── document-table/
│   │   │   └── ... (25 componentes total)
│   │   │
│   │   ├── services/              # ❌ SIN index.ts (importación directa)
│   │   │   ├── alfa-main.service.ts
│   │   │   ├── workflow.service.ts
│   │   │   ├── bpm-core.service.ts
│   │   │   └── ... (12 servicios total)
│   │   │
│   │   ├── models/                # ✅ CON index.ts (barrel permitido)
│   │   │   ├── index.ts           # export * from './workflow.model'
│   │   │   ├── workflow.model.ts
│   │   │   ├── operation.model.ts
│   │   │   ├── alfa-main.model.ts
│   │   │   └── ... (20+ modelos)
│   │   │
│   │   └── constants/             # ✅ CON index.ts (barrel permitido)
│   │       ├── index.ts
│   │       └── workflow.constants.ts
│   │
│   ├── property-management/       # Gestión Predial
│   │   ├── components/            # ❌ SIN index.ts
│   │   │   ├── basic-information/
│   │   │   ├── constructions/
│   │   │   ├── owners/
│   │   │   ├── addresses/
│   │   │   ├── appraisals/
│   │   │   ├── zones/
│   │   │   ├── adjacent-properties/
│   │   │   └── ... (45 componentes total)
│   │   │
│   │   ├── services/              # ❌ SIN index.ts
│   │   │   ├── information-property.service.ts
│   │   │   ├── constructions.service.ts
│   │   │   ├── appraisal.service.ts
│   │   │   ├── adjacent-property.service.ts
│   │   │   └── ... (8 servicios)
│   │   │
│   │   ├── models/                # ✅ CON index.ts
│   │   │   ├── index.ts
│   │   │   ├── baunit.model.ts
│   │   │   ├── construction.model.ts
│   │   │   ├── owner.model.ts
│   │   │   └── ... (30+ modelos)
│   │   │
│   │   └── constants/             # ✅ CON index.ts
│   │       ├── index.ts
│   │       └── property.constants.ts
│   │
│   ├── economic-zones/            # Gestión de Zonas Económicas
│   │   ├── components/            # ❌ SIN index.ts (3 componentes)
│   │   ├── services/              # ❌ SIN index.ts (5 servicios)
│   │   ├── models/                # ✅ CON index.ts
│   │   └── constants/             # ✅ CON index.ts
│   │
│   ├── configuration/             # Configuración del Sistema
│   │   ├── components/            # ❌ SIN index.ts (12 componentes)
│   │   │   ├── digital-signatures/
│   │   │   └── zone-manager/
│   │   ├── services/              # ❌ SIN index.ts (3 servicios)
│   │   │   ├── user.service.ts
│   │   │   ├── digitalized-signatures.service.ts
│   │   │   └── zone.service.ts
│   │   ├── models/                # ✅ CON index.ts
│   │   └── constants/             # ✅ CON index.ts
│   │
│   ├── geographic-viewer/         # Visualización Geográfica
│   │   ├── components/            # ❌ SIN index.ts (2 componentes)
│   │   ├── services/              # ❌ SIN index.ts (1 servicio)
│   │   └── models/                # ✅ CON index.ts
│   │
│   └── document-management/       # Gestión Documental
│       ├── components/            # ❌ SIN index.ts (si los hay)
│       ├── services/              # ❌ SIN index.ts (3 servicios)
│       │   ├── document-management.service.ts
│       │   └── attachment.service.ts
│       └── models/                # ✅ CON index.ts
│
├── shared/                        # 🔄 RECURSOS COMPARTIDOS
│   │
│   ├── ui/                        # Componentes UI Primitivos
│   │   ├── input/                 # ❌ SIN index.ts
│   │   │   ├── input.component.ts
│   │   │   └── input.component.html
│   │   ├── combobox/              # ❌ SIN index.ts
│   │   │   ├── combobox.component.ts
│   │   │   ├── combobox-auto-complete.component.ts
│   │   │   └── combobox-collection.component.ts
│   │   ├── date-picker/
│   │   ├── modal/
│   │   ├── loader/
│   │   ├── carousel/
│   │   ├── text-area/
│   │   └── ... (22 componentes UI total)
│   │
│   ├── components/                # Componentes de negocio reutilizables
│   │   ├── comments/              # ❌ SIN index.ts
│   │   ├── participant-table/
│   │   ├── document-viewer/
│   │   └── payment-validation/
│   │
│   ├── services/                  # Servicios cross-cutting
│   │   ├── loading.service.ts     # ❌ SIN index.ts
│   │   ├── splash-screen.service.ts
│   │   ├── collection.service.ts
│   │   ├── search.service.ts
│   │   ├── validation.service.ts
│   │   └── ...
│   │
│   ├── models/                    # ✅ CON index.ts
│   │   ├── index.ts
│   │   ├── pagination.model.ts
│   │   ├── content-info.model.ts
│   │   ├── user.model.ts
│   │   └── out-format.model.ts
│   │
│   ├── directives/                # ❌ SIN index.ts (importación directa)
│   │   ├── fluid-height.directive.ts
│   │   ├── fluid-min-height.directive.ts
│   │   └── fluid-max-height.directive.ts
│   │
│   ├── pipes/                     # ❌ SIN index.ts (importación directa)
│   │   ├── custom-date.pipe.ts
│   │   ├── currency-format.pipe.ts
│   │   ├── municipality-code.pipe.ts
│   │   └── truncate.pipe.ts
│   │
│   ├── constants/                 # ✅ CON index.ts
│   │   ├── index.ts
│   │   ├── modal-sizes.constant.ts
│   │   ├── button-types.constant.ts
│   │   └── labels.constant.ts
│   │
│   └── utils/                     # Funciones utilitarias
│       ├── general.utils.ts
│       ├── validation.utils.ts
│       └── nph-parser.utils.ts
│
├── core/                          # ⚙️ SERVICIOS CORE (sin cambios mayores)
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── navigation.service.ts
│   └── icons/
│
├── layouts/                       # 🖼️ LAYOUT COMPONENTS (sin cambios)
│   ├── main/
│   ├── auth/
│   └── error/
│
└── pages/                         # 📄 ROUTABLE PAGE COMPONENTS (sin cambios)
    ├── my-work/
    ├── configuration/
    ├── operation-support/
    └── ...
```

### Reglas de Importación

#### ✅ CORRECTO - Importación Directa (Components/Services)

```typescript
// Componentes - SIEMPRE importación directa
import { AlfaMainComponent } from '@features/bpm-workflows/components/alfa-main/alfa-main.component';
import { WorkflowHeaderComponent } from '@features/bpm-workflows/components/workflow-header/workflow-header.component';

// Servicios - SIEMPRE importación directa
import { AlfaMainService } from '@features/bpm-workflows/services/alfa-main.service';
import { WorkflowService } from '@features/bpm-workflows/services/workflow.service';

// Modelos/Constantes - Barrel export permitido
import { Workflow, Operation, AlfaMain } from '@features/bpm-workflows/models';
import { WORKFLOW_STATUSES, BPM_ACTIONS } from '@features/bpm-workflows/constants';

// Shared UI - Importación directa
import { InputComponent } from '@shared/ui/input/input.component';
import { ComboboxComponent } from '@shared/ui/combobox/combobox.component';

// Shared Services - Importación directa
import { LoadingService } from '@shared/services/loading.service';
import { ValidationService } from '@shared/services/validation.service';

// Shared Models/Constants - Barrel permitido
import { Pagination, ContentInfo } from '@shared/models';
import { MODAL_SIZES, BUTTON_TYPES } from '@shared/constants';
```

#### ❌ INCORRECTO - Nunca Hacer

```typescript
// ❌ NUNCA barrel export para componentes
import { AlfaMainComponent } from '@features/bpm-workflows/components';

// ❌ NUNCA barrel export para servicios
import { AlfaMainService } from '@features/bpm-workflows/services';

// ❌ NUNCA imports relativos profundos
import { Something } from '../../../../../../../somewhere';
```

### Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@features/*": ["src/app/features/*"],
      "@shared/*": ["src/app/shared/*"],
      "@core/*": ["src/app/core/*"],
      "@pages/*": ["src/app/pages/*"]
    }
  }
}
```

---

## 📦 Plan de Migración por Secciones

### Estrategia General

**Orden de Migración por Archivo:**
1. **Modelos/Interfaces** PRIMERO (crear barrel exports)
2. **Servicios** (modernizar + mover)
3. **Componentes** (modernizar + mover)
4. **Constantes** (crear barrel exports)

**Después de cada archivo movido:**
- ✅ Compilar: `pnpm build`
- ✅ Ejecutar tests: `pnpm test`
- ✅ Commit individual
- ✅ Validar que imports estén actualizados

**Después de cada sección:**
- ✅ **ELIMINAR** carpetas vacías de `/apps`
- ✅ Validación completa de la aplicación
- ✅ Commit de sección completa

---

### **SECCIÓN 1: BPM Workflows** (Semanas 1-2)

#### Métricas

- **25 componentes** a mover
- **12 servicios** a mover
- **20+ interfaces/modelos** a mover
- **Constantes** a mover

#### Paso 1: Preparación

```bash
# Crear estructura de carpetas destino
mkdir -p src/app/features/bpm-workflows/components
mkdir -p src/app/features/bpm-workflows/services
mkdir -p src/app/features/bpm-workflows/models
mkdir -p src/app/features/bpm-workflows/constants
```

#### Paso 2: Mover Modelos e Interfaces (PRIMERO)

**Comando:**
```bash
# MOVER (no copiar) con git mv
git mv src/app/apps/interfaces/bpm/* src/app/features/bpm-workflows/models/
```

**Crear Barrel Export:**
```typescript
// src/app/features/bpm-workflows/models/index.ts
export * from './workflow.model';
export * from './operation.model';
export * from './alfa-main.model';
export * from './document.model';
// ... exportar todos los modelos
```

**Actualizar imports:**
- Buscar todos los archivos que importan desde `apps/interfaces/bpm/`
- Reemplazar por: `import { Model } from '@features/bpm-workflows/models';`

**Validar:**
```bash
pnpm build
pnpm test
```

**Commit:**
```bash
git add .
git commit -m "refactor(bpm): Move BPM models to features/bpm-workflows/models"
```

#### Paso 3: Mover Servicios (UNO POR UNO)

**Ejemplo: AlfaMainService**

```bash
# Mover archivo
git mv src/app/apps/services/bpm/core/alfa-main.service.ts \
       src/app/features/bpm-workflows/services/alfa-main.service.ts
```

**Modernizar el servicio mientras se mueve:**

```typescript
// ANTES (apps/services/bpm/core/alfa-main.service.ts)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlfaMainService {
  private dataSubject = new BehaviorSubject<Data[]>([]);
  data$ = this.dataSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  updateData(data: Data[]) {
    this.dataSubject.next(data);
  }
}

// DESPUÉS (features/bpm-workflows/services/alfa-main.service.ts)
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })  // ✅ Mantener @Injectable
export class AlfaMainService {
  // ✅ inject() en lugar de constructor
  private http = inject(HttpClient);
  private router = inject(Router);

  // ✅ signal() en lugar de BehaviorSubject
  data = signal<Data[]>([]);

  // ✅ computed() para valores derivados
  activeData = computed(() => this.data().filter(d => d.active));

  updateData(newData: Data[]) {
    this.data.set(newData);
  }
}
```

**Actualizar todos los imports:**
```typescript
// ANTES
import { AlfaMainService } from '../../../services/bpm/core/alfa-main.service';

// DESPUÉS
import { AlfaMainService } from '@features/bpm-workflows/services/alfa-main.service';
```

**Validar y Commit:**
```bash
pnpm build && pnpm test
git add .
git commit -m "refactor(bpm): Move and modernize AlfaMainService to features"
```

**Repetir para cada uno de los 12 servicios.**

#### Paso 4: Mover Componentes (UNO POR UNO)

**Ejemplo: AlfaMainComponent**

```bash
# Mover carpeta completa del componente
git mv src/app/apps/components/bpm/alfa-main/ \
       src/app/features/bpm-workflows/components/alfa-main/
```

**Modernizar el componente:**

```typescript
// ANTES (apps/components/bpm/alfa-main/alfa-main.component.ts)
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-alfa-main',
  templateUrl: './alfa-main.component.html',
  styleUrls: ['./alfa-main.component.scss']
})
export class AlfaMainComponent {
  @Input() data: WorkflowData | null = null;
  @Input() isLoading: boolean = false;
  @Output() save = new EventEmitter<WorkflowData>();
  @ViewChild('formElement') formElement?: ElementRef;

  constructor(
    private workflowService: WorkflowService,
    private router: Router
  ) {}

  onSave() {
    this.save.emit(this.data);
  }
}

// DESPUÉS (features/bpm-workflows/components/alfa-main/alfa-main.component.ts)
import { Component, inject, input, output, viewChild, ElementRef } from '@angular/core';
import { WorkflowService } from '@features/bpm-workflows/services/workflow.service';
import { Router } from '@angular/router';
import { WorkflowData } from '@features/bpm-workflows/models';

@Component({  // ✅ Mantener @Component
  selector: 'app-alfa-main',
  standalone: true,  // ✅ Asegurar standalone
  imports: [
    // imports necesarios
  ],
  templateUrl: './alfa-main.component.html',
  styleUrls: ['./alfa-main.component.scss']
})
export class AlfaMainComponent {
  // ✅ inject() para servicios
  private workflowService = inject(WorkflowService);
  private router = inject(Router);

  // ✅ input() para inputs
  data = input<WorkflowData | null>(null);
  isLoading = input<boolean>(false);

  // ✅ output() para outputs
  save = output<WorkflowData>();

  // ✅ viewChild() para ViewChild
  formElement = viewChild<ElementRef>('formElement');

  onSave() {
    const currentData = this.data();
    if (currentData) {
      this.save.emit(currentData);
    }
  }
}
```

**Actualizar template si usa signals:**

```html
<!-- ANTES -->
<div *ngIf="isLoading">Loading...</div>
<div>{{ data?.name }}</div>

<!-- DESPUÉS -->
@if (isLoading()) {
  <div>Loading...</div>
}
<div>{{ data()?.name }}</div>
```

**Actualizar imports en archivos que usan este componente:**
```typescript
// ANTES
import { AlfaMainComponent } from '../../../components/bpm/alfa-main/alfa-main.component';

// DESPUÉS
import { AlfaMainComponent } from '@features/bpm-workflows/components/alfa-main/alfa-main.component';
```

**Validar y Commit:**
```bash
pnpm build && pnpm test
git add .
git commit -m "refactor(bpm): Move and modernize AlfaMainComponent to features"
```

**Repetir para los 25 componentes.**

#### Paso 5: Mover Constantes

```bash
# Mover constantes
git mv src/app/apps/constants/bpm/* \
       src/app/features/bpm-workflows/constants/
```

**Crear Barrel Export:**
```typescript
// src/app/features/bpm-workflows/constants/index.ts
export * from './workflow.constants';
export * from './bpm-actions.constants';
// ... exportar todas las constantes
```

**Commit:**
```bash
git add .
git commit -m "refactor(bpm): Move BPM constants to features"
```

#### Paso 6: Limpieza y Validación Final

```bash
# Verificar que carpetas estén vacías
ls src/app/apps/components/bpm/        # Debe estar vacío
ls src/app/apps/services/bpm/          # Debe estar vacío
ls src/app/apps/interfaces/bpm/        # Debe estar vacío
ls src/app/apps/constants/bpm/         # Debe estar vacío

# ELIMINAR carpetas vacías
rm -rf src/app/apps/components/bpm/
rm -rf src/app/apps/services/bpm/
rm -rf src/app/apps/interfaces/bpm/
rm -rf src/app/apps/constants/bpm/
```

**Validación completa:**
```bash
# Compilación
pnpm build

# Tests
pnpm test

# Lint
pnpm lint

# Verificar que no existen imports a rutas antiguas
grep -r "apps/components/bpm" src/app/
grep -r "apps/services/bpm" src/app/
grep -r "apps/interfaces/bpm" src/app/
# No debe retornar resultados
```

**Commit final de sección:**
```bash
git add .
git commit -m "refactor(bpm): Complete BPM Workflows migration to features

- Moved 25 components to features/bpm-workflows/components
- Moved 12 services to features/bpm-workflows/services
- Moved 20+ models to features/bpm-workflows/models
- Moved constants to features/bpm-workflows/constants
- Modernized to Angular 18+ patterns (signals, inject)
- Updated all imports to use path aliases
- Removed legacy /apps/bpm directories"
```

#### Checklist de Validación SECCIÓN 1

- [ ] 25 componentes movidos y modernizados
- [ ] 12 servicios movidos y modernizados
- [ ] 20+ modelos movidos con barrel export
- [ ] Constantes movidas con barrel export
- [ ] Todos los imports actualizados a path aliases
- [ ] 0 imports relativos `../../../` en código movido
- [ ] Compilación exitosa: `pnpm build`
- [ ] Tests passing: `pnpm test`
- [ ] Lint passing: `pnpm lint`
- [ ] Carpetas `/apps/components/bpm/` ELIMINADAS
- [ ] Carpetas `/apps/services/bpm/` ELIMINADAS
- [ ] Carpetas `/apps/interfaces/bpm/` ELIMINADAS
- [ ] No existen referencias a rutas antiguas de BPM

---

### **SECCIÓN 2: Property Management** (Semanas 3-5)

#### Métricas

- **45 componentes** a mover
- **8 servicios** a mover
- **30+ interfaces/modelos** a mover
- **Constantes** a mover

#### Estructura Destino

```bash
mkdir -p src/app/features/property-management/components
mkdir -p src/app/features/property-management/services
mkdir -p src/app/features/property-management/models
mkdir -p src/app/features/property-management/constants
```

#### Componentes a Mover

**Subdominios de Property Management:**

1. **Basic Information** (5 componentes)
   - `apps/components/information-property/basic-information/*`

2. **Constructions** (8 componentes)
   - `apps/components/information-property/constructions/*`

3. **Owners** (6 componentes)
   - `apps/components/information-property/owners/*`

4. **Addresses** (4 componentes)
   - `apps/components/information-property/addresses/*`

5. **Appraisals** (7 componentes)
   - `apps/components/information-property/appraisals/*`

6. **Zones** (3 componentes)
   - `apps/components/information-property/zones/*`

7. **Adjacent Properties** (5 componentes)
   - `apps/components/information-property/adjacent-properties/*`

8. **Others** (7 componentes restantes)

#### Proceso (Mismo que SECCIÓN 1)

1. **Modelos primero** → Crear barrel
2. **Servicios** → Mover + modernizar (uno por uno)
3. **Componentes** → Mover + modernizar (uno por uno)
4. **Constantes** → Crear barrel
5. **Validación** → Build + Test + Lint
6. **Limpieza** → Eliminar carpetas vacías de `/apps`

#### Ejemplo de Modernización: InformationPropertyService

```typescript
// ANTES
@Injectable({ providedIn: 'root' })
export class InformationPropertyService {
  private propertySubject = new BehaviorSubject<Property | null>(null);
  property$ = this.propertySubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService
  ) {}

  updateProperty(property: Property) {
    this.propertySubject.next(property);
  }
}

// DESPUÉS
@Injectable({ providedIn: 'root' })  // ✅ Mantener
export class InformationPropertyService {
  // ✅ inject()
  private http = inject(HttpClient);
  private router = inject(Router);
  private alertService = inject(AlertService);

  // ✅ signal()
  property = signal<Property | null>(null);

  // ✅ computed()
  hasConstructions = computed(() =>
    this.property()?.constructions?.length > 0
  );

  updateProperty(property: Property) {
    this.property.set(property);
  }
}
```

#### Checklist de Validación SECCIÓN 2

- [ ] 45 componentes movidos y modernizados
- [ ] 8 servicios movidos y modernizados
- [ ] 30+ modelos movidos con barrel export
- [ ] Constantes movidas con barrel export
- [ ] Todos los imports actualizados
- [ ] 0 imports relativos en código movido
- [ ] Build + Test + Lint exitosos
- [ ] Carpetas `/apps/information-property/` ELIMINADAS
- [ ] No existen referencias a rutas antiguas

---

### **SECCIÓN 3: Economic Zones** (Semana 6)

#### Métricas

- **3 componentes** a mover
- **5 servicios** a mover
- **8 interfaces/modelos** a mover
- **Constantes** a mover

#### Proceso

```bash
# Estructura
mkdir -p src/app/features/economic-zones/components
mkdir -p src/app/features/economic-zones/services
mkdir -p src/app/features/economic-zones/models
mkdir -p src/app/features/economic-zones/constants

# Migración (mismo proceso)
1. Modelos → Barrel
2. Servicios → Modernizar
3. Componentes → Modernizar
4. Constantes → Barrel
5. Validación
6. Limpieza
```

#### Checklist de Validación SECCIÓN 3

- [ ] 3 componentes movidos y modernizados
- [ ] 5 servicios movidos y modernizados
- [ ] 8 modelos movidos con barrel
- [ ] Build + Test + Lint exitosos
- [ ] Carpetas `/apps/economic-mod-land/` ELIMINADAS

---

### **SECCIÓN 4: Configuration** (Semana 7)

#### Métricas

- **12 componentes** a mover
- **3 servicios** a mover (usuarios, firmas digitales, zonas)
- **5 interfaces/modelos** a mover
- **Constantes** a mover

#### Componentes de Configuración

1. **Digital Signatures** (4 componentes)
2. **Zone Manager** (3 componentes)
3. **User Configuration** (5 componentes)

#### Servicios

- `UserService`
- `DigitalizedSignaturesService`
- `ZoneService`

#### Proceso

Mismo flujo: Modelos → Servicios → Componentes → Constantes → Validación → Limpieza

#### Checklist de Validación SECCIÓN 4

- [ ] 12 componentes movidos
- [ ] 3 servicios movidos
- [ ] Modelos y constantes con barrels
- [ ] Build + Test + Lint exitosos
- [ ] Carpetas `/apps/configuration/` ELIMINADAS

---

### **SECCIÓN 5: Document Management & Geographic** (Semana 8)

#### Document Management

**Servicios a mover:**
- `DocumentManagementService`
- `AttachmentService`
- Modelos relacionados

```bash
mkdir -p src/app/features/document-management/services
mkdir -p src/app/features/document-management/models
```

#### Geographic Viewer

**Componentes a mover:**
- 2 componentes geográficos
- 1 servicio geográfico

```bash
mkdir -p src/app/features/geographic-viewer/components
mkdir -p src/app/features/geographic-viewer/services
mkdir -p src/app/features/geographic-viewer/models
```

#### Checklist de Validación SECCIÓN 5

- [ ] Document Management: servicios y modelos movidos
- [ ] Geographic Viewer: componentes y servicios movidos
- [ ] Build + Test + Lint exitosos
- [ ] Carpetas legacy eliminadas

---

### **SECCIÓN 6: Shared Resources** (Semana 9)

#### Objetivo

Mover componentes y servicios reutilizables de `/apps/components/general-components` y `/apps/services/general` a `/shared`.

#### Componentes UI a Mover

**22 componentes totales:**
- Input, Combobox, DatePicker, Modal, Loader, Carousel, TextArea
- Comments, ParticipantTable, DocumentViewer, PaymentValidation

```bash
# Estructura
mkdir -p src/app/shared/ui/input
mkdir -p src/app/shared/ui/combobox
mkdir -p src/app/shared/ui/modal
mkdir -p src/app/shared/ui/loader
# ... etc

# Mover cada componente
git mv src/app/apps/components/general-components/input/ \
       src/app/shared/ui/input/
```

**IMPORTANTE:** ❌ NO crear `index.ts` en `/shared/ui/` ni subdirectorios

**Importación:**
```typescript
// ✅ SIEMPRE importación directa
import { InputComponent } from '@shared/ui/input/input.component';
import { ComboboxComponent } from '@shared/ui/combobox/combobox.component';
```

#### Servicios Compartidos a Mover

**Servicios de `/apps/services/general`:**
- `LoadingService`
- `SplashScreenService`
- `CollectionService`
- `SearchService`
- `ValidationService`

```bash
git mv src/app/apps/services/general/loading.service.ts \
       src/app/shared/services/loading.service.ts
```

**IMPORTANTE:** ❌ NO crear `index.ts` en `/shared/services/`

**Importación:**
```typescript
// ✅ Importación directa
import { LoadingService } from '@shared/services/loading.service';
import { ValidationService } from '@shared/services/validation.service';
```

#### Pipes y Directives

```bash
# Mover pipes (sin barrel)
git mv src/app/apps/pipes/* src/app/shared/pipes/

# Mover directives (sin barrel)
git mv src/app/apps/directives/* src/app/shared/directives/
```

**Importación directa:**
```typescript
// ✅ Cada pipe/directive se importa individualmente
import { CustomDatePipe } from '@shared/pipes/custom-date.pipe';
import { FluidHeightDirective } from '@shared/directives/fluid-height.directive';
```

#### Utils y Modelos Compartidos

```bash
# Utils (sin barrel si son servicios/funciones)
git mv src/app/apps/utils/* src/app/shared/utils/

# Modelos compartidos (CON barrel)
# Crear index.ts para exportar modelos
```

**Modelos compartidos - Barrel permitido:**
```typescript
// src/app/shared/models/index.ts
export * from './pagination.model';
export * from './content-info.model';
export * from './user.model';

// Importación
import { Pagination, ContentInfo } from '@shared/models';
```

#### Checklist de Validación SECCIÓN 6

- [ ] 22 componentes UI movidos a `/shared/ui/` (SIN barrels)
- [ ] Servicios compartidos movidos a `/shared/services/` (SIN barrels)
- [ ] Pipes movidos a `/shared/pipes/` (SIN barrels)
- [ ] Directives movidos a `/shared/directives/` (SIN barrels)
- [ ] Utils movidos a `/shared/utils/`
- [ ] Modelos compartidos con barrel en `/shared/models/`
- [ ] Todos los imports actualizados a importación directa
- [ ] Build + Test + Lint exitosos
- [ ] Carpeta `/apps/components/general-components/` ELIMINADA
- [ ] Carpeta `/apps/services/general/` ELIMINADA
- [ ] Carpeta `/apps/pipes/` ELIMINADA
- [ ] Carpeta `/apps/directives/` ELIMINADA

---

### **SECCIÓN 7: Validación Final y Limpieza** (Semana 10)

#### Objetivo

Asegurar que toda la migración está completa y la carpeta `/apps` está vacía.

#### Validación Global

```bash
# 1. Verificar que /apps esté vacía o solo con configuración
ls -la src/app/apps/

# 2. Buscar imports a rutas antiguas (no debe retornar resultados)
grep -r "apps/components" src/app/
grep -r "apps/services" src/app/
grep -r "apps/interfaces" src/app/
grep -r "apps/constants" src/app/

# 3. Buscar imports relativos profundos (no debe retornar resultados)
grep -r "\.\.\/\.\.\/" src/app/features/
grep -r "\.\.\/\.\.\/" src/app/shared/

# 4. Validar compilación sin errores
pnpm build

# 5. Ejecutar todos los tests
pnpm test

# 6. Lint
pnpm lint

# 7. Verificar bundle size (debe ser < 2MB idealmente)
# Revisar output de pnpm build
```

#### Métricas de Éxito Final

| Métrica | Antes | Después | Estado |
|---------|-------|---------|--------|
| Archivos en `/apps` | 319 | 0 | ✅ |
| Imports relativos `../../../` | 116 | 0 | ✅ |
| Componentes standalone | 122 (38%) | 181 (100%) | ✅ |
| Servicios con `inject()` | Parcial | 100% | ✅ |
| Uso de signals | Mínimo | Alto | ✅ |
| Barrel exports incorrectos | Varios | 0 | ✅ |
| Build time | ~3-4 min | < 2 min | ✅ |

#### Limpieza Final

```bash
# Si /apps solo contiene styles o configuración, mantener
# Si está completamente vacío, eliminar
rm -rf src/app/apps/

# Commit final
git add .
git commit -m "refactor: Complete architectural refactoring to feature-based structure

BREAKING CHANGE: Moved all code from /apps to /features and /shared

- Migrated 111 components to feature modules
- Migrated 57 services to feature modules
- Migrated 45+ interfaces/models to feature modules
- Eliminated 116 deep relative imports
- Modernized to Angular 18+ patterns (signals, inject)
- Removed barrel exports for components/services
- Updated all imports to use path aliases
- Removed legacy /apps directory structure

All 6 migration sections completed:
✅ Section 1: BPM Workflows
✅ Section 2: Property Management
✅ Section 3: Economic Zones
✅ Section 4: Configuration
✅ Section 5: Document Management & Geographic
✅ Section 6: Shared Resources"
```

---

## ⚡ Patrones de Modernización Angular 18+

### Patrón 1: Input Signals

#### Antes (Decorador @Input)

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="user">
      <h1>{{ user.name }}</h1>
      <p *ngIf="showEmail">{{ user.email }}</p>
    </div>
  `
})
export class UserProfileComponent {
  @Input() user: User | null = null;
  @Input() showEmail: boolean = false;
  @Input() required!: string;  // Required input
}
```

#### Después (Función input())

```typescript
import { Component, input } from '@angular/core';

@Component({  // ✅ Mantener @Component
  selector: 'app-user-profile',
  standalone: true,
  template: `
    @if (user()) {
      <div>
        <h1>{{ user()!.name }}</h1>
        @if (showEmail()) {
          <p>{{ user()!.email }}</p>
        }
      </div>
    }
  `
})
export class UserProfileComponent {
  // Input opcional con valor por defecto
  user = input<User | null>(null);
  showEmail = input<boolean>(false);

  // Input requerido
  required = input.required<string>();

  // Input con transform
  disabled = input<boolean, string | boolean>(false, {
    transform: (value: string | boolean) => {
      return typeof value === 'string' ? value !== 'false' : value;
    }
  });
}
```

#### Acceso en el código

```typescript
// En métodos del componente
onSave() {
  const currentUser = this.user();  // ✅ Llamar como función
  if (currentUser) {
    console.log(currentUser.name);
  }

  if (this.showEmail()) {  // ✅ Llamar como función
    this.sendEmail();
  }
}
```

### Patrón 2: Output Signals

#### Antes (Decorador @Output)

```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-form',
  template: `
    <form (submit)="onSubmit()">
      <button type="submit">Save</button>
      <button type="button" (click)="onCancel()">Cancel</button>
    </form>
  `
})
export class UserFormComponent {
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit() {
    const user = this.buildUser();
    this.save.emit(user);
  }

  onCancel() {
    this.cancel.emit();
  }
}
```

#### Después (Función output())

```typescript
import { Component, output } from '@angular/core';

@Component({  // ✅ Mantener @Component
  selector: 'app-user-form',
  standalone: true,
  template: `
    <form (submit)="onSubmit()">
      <button type="submit">Save</button>
      <button type="button" (click)="onCancel()">Cancel</button>
    </form>
  `
})
export class UserFormComponent {
  // Outputs con tipo específico
  save = output<User>();
  cancel = output<void>();

  onSubmit() {
    const user = this.buildUser();
    this.save.emit(user);  // ✅ Sintaxis igual
  }

  onCancel() {
    this.cancel.emit();
  }
}
```

### Patrón 3: ViewChild / ViewChildren Signals

#### Antes (Decoradores @ViewChild)

```typescript
import { Component, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'app-form',
  template: `
    <input #nameInput type="text">
    <input #emailInput type="text">
    <button #submitBtn>Submit</button>
    <div #item *ngFor="let item of items">{{ item }}</div>
  `
})
export class FormComponent {
  @ViewChild('nameInput') nameInput?: ElementRef;
  @ViewChild('submitBtn', { read: ElementRef }) submitButton?: ElementRef;
  @ViewChildren('item') itemElements?: QueryList<ElementRef>;

  ngAfterViewInit() {
    // Acceso después de la vista inicializada
    this.nameInput?.nativeElement.focus();
  }
}
```

#### Después (Funciones viewChild / viewChildren)

```typescript
import { Component, viewChild, viewChildren, ElementRef, afterNextRender } from '@angular/core';

@Component({  // ✅ Mantener @Component
  selector: 'app-form',
  standalone: true,
  template: `
    <input #nameInput type="text">
    <input #emailInput type="text">
    <button #submitBtn>Submit</button>
    @for (item of items; track item) {
      <div #item>{{ item }}</div>
    }
  `
})
export class FormComponent {
  // ViewChild opcional
  nameInput = viewChild<ElementRef>('nameInput');

  // ViewChild requerido (error si no existe)
  submitButton = viewChild.required<ElementRef>('submitBtn');

  // ViewChildren (devuelve signal con array)
  itemElements = viewChildren<ElementRef>('item');

  constructor() {
    // Acceso a elementos después del render
    afterNextRender(() => {
      const inputEl = this.nameInput();
      if (inputEl) {
        inputEl.nativeElement.focus();
      }

      // submitButton es requerido, no necesita check
      this.submitButton().nativeElement.style.color = 'blue';

      // itemElements es un array
      console.log('Items count:', this.itemElements().length);
    });
  }
}
```

### Patrón 4: Inject Function (Eliminar Constructor Injection)

#### Antes (Constructor Injection)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService,
    @Optional() private logger?: LoggerService
  ) {}

  loadUsers() {
    return this.http.get<User[]>('/api/users');
  }
}
```

#### Después (Función inject())

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })  // ✅ Mantener @Injectable
export class UserService {
  // ✅ inject() para cada dependencia
  private http = inject(HttpClient);
  private router = inject(Router);
  private alertService = inject(AlertService);

  // Dependencia opcional
  private logger = inject(LoggerService, { optional: true });

  loadUsers() {
    return this.http.get<User[]>('/api/users');
  }
}
```

#### En Componentes

```typescript
import { Component, inject } from '@angular/core';

@Component({  // ✅ Mantener @Component
  selector: 'app-users',
  standalone: true,
  template: `...`
})
export class UsersComponent {
  // ✅ inject() sin constructor
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Métodos pueden usar las dependencias directamente
  loadUsers() {
    this.userService.loadUsers().subscribe(users => {
      console.log(users);
    });
  }
}
```

### Patrón 5: Signals para Estado (Reemplazar BehaviorSubject)

#### Antes (RxJS Subjects)

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private propertySubject = new BehaviorSubject<Property | null>(null);
  property$ = this.propertySubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  // Valor derivado
  hasConstructions$: Observable<boolean> = this.property$.pipe(
    map(property => property?.constructions?.length > 0)
  );

  updateProperty(property: Property) {
    this.propertySubject.next(property);
  }

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }
}
```

#### Después (Signals)

```typescript
import { Injectable, signal, computed, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })  // ✅ Mantener @Injectable
export class PropertyService {
  private http = inject(HttpClient);

  // ✅ signal() para estado mutable
  property = signal<Property | null>(null);
  loading = signal<boolean>(false);

  // ✅ computed() para valores derivados
  hasConstructions = computed(() =>
    (this.property()?.constructions?.length ?? 0) > 0
  );

  // Computed puede derivar de múltiples signals
  displayName = computed(() => {
    const prop = this.property();
    const loading = this.loading();
    return loading ? 'Loading...' : prop?.name ?? 'N/A';
  });

  // Métodos actualizan signals
  updateProperty(property: Property) {
    this.property.set(property);
  }

  setLoading(loading: boolean) {
    this.loading.set(loading);
  }

  // También se puede usar update() para modificar basado en valor anterior
  incrementVersion() {
    this.property.update(current => {
      if (!current) return null;
      return { ...current, version: current.version + 1 };
    });
  }
}
```

#### Uso en Componentes

```typescript
@Component({
  selector: 'app-property-detail',
  standalone: true,
  template: `
    @if (propertyService.loading()) {
      <div>Loading...</div>
    } @else {
      <div>
        <h1>{{ propertyService.property()?.name }}</h1>
        @if (propertyService.hasConstructions()) {
          <p>Has constructions</p>
        }
      </div>
    }
  `
})
export class PropertyDetailComponent {
  propertyService = inject(PropertyService);

  // Signals se pueden leer directamente en templates
  // No necesitan async pipe
}
```

### Patrón 6: Effect para Side Effects

#### Uso de effect()

```typescript
import { Component, inject, signal, effect } from '@angular/core';

@Component({
  selector: 'app-auto-save',
  standalone: true,
  template: `
    <form>
      <input [(ngModel)]="formData" />
    </form>
  `
})
export class AutoSaveComponent {
  private storageService = inject(StorageService);

  formData = signal<string>('');

  constructor() {
    // ✅ effect() se ejecuta automáticamente cuando cambia formData
    effect(() => {
      const data = this.formData();
      console.log('Auto-saving:', data);
      this.storageService.save('draft', data);
    });

    // Effect con cleanup
    effect((onCleanup) => {
      const timer = setInterval(() => {
        console.log('Current data:', this.formData());
      }, 1000);

      // Cleanup cuando el effect se destruye
      onCleanup(() => clearInterval(timer));
    });
  }
}
```

### Patrón 7: Integración con RxJS (toSignal / toObservable)

#### Convertir Observable a Signal

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  standalone: true,
  template: `
    @if (users(); as userList) {
      @for (user of userList; track user.id) {
        <div>{{ user.name }}</div>
      }
    } @else {
      <div>Loading...</div>
    }
  `
})
export class UsersComponent {
  private userService = inject(UserService);

  // ✅ Convertir Observable a Signal
  users = toSignal(this.userService.getUsers$(), {
    initialValue: [] as User[]
  });
}
```

#### Convertir Signal a Observable

```typescript
import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `<input (input)="onSearchChange($event)" />`
})
export class SearchComponent {
  private userService = inject(UserService);

  searchTerm = signal<string>('');

  // ✅ Convertir Signal a Observable para usar con RxJS operators
  searchResults = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(300),
      switchMap(term => this.userService.search(term))
    ),
    { initialValue: [] }
  );

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
```

---

## 📋 Checklist Completo de Refactoring

### Por Cada Sección

#### Antes de Empezar
- [ ] Crear rama de trabajo: `git checkout -b refactor/section-X-name`
- [ ] Documentar estado actual (número de archivos, dependencias)
- [ ] Crear carpetas destino en `/features` o `/shared`
- [ ] Backup de la aplicación funcionando

#### Durante la Migración
- [ ] Mover modelos/interfaces PRIMERO
- [ ] Crear barrel exports para modelos/constantes
- [ ] Mover servicios UNO POR UNO
- [ ] Modernizar servicios al moverlos (inject, signals)
- [ ] Mover componentes UNO POR UNO
- [ ] Modernizar componentes al moverlos (input, output, viewChild)
- [ ] Actualizar imports en todos los archivos afectados
- [ ] Commit después de cada archivo movido
- [ ] Validar compilación: `pnpm build`
- [ ] Ejecutar tests: `pnpm test`

#### Después de Completar Sección
- [ ] Eliminar carpetas vacías de `/apps`
- [ ] Verificar 0 imports a rutas antiguas
- [ ] Verificar 0 imports relativos `../../../`
- [ ] Build completo exitoso
- [ ] Todos los tests passing
- [ ] Lint sin errores
- [ ] Commit final de sección
- [ ] Merge a branch principal si todo está OK

### Validación Global (Después de Todas las Secciones)

#### Estructura
- [ ] Carpeta `/apps` vacía o eliminada
- [ ] Toda la estructura está en `/features` y `/shared`
- [ ] NO existen barrel exports para components/services
- [ ] SÍ existen barrel exports para models/constants

#### Código
- [ ] 0 decoradores `@Input()`
- [ ] 0 decoradores `@Output()`
- [ ] 0 decoradores `@ViewChild()` / `@ViewChildren()`
- [ ] 0 constructor injection (todo con `inject()`)
- [ ] 0 `BehaviorSubject` / `ReplaySubject` (reemplazados por signals)
- [ ] ✅ Mantener `@Component`, `@Injectable`, `@Pipe`, `@Directive`
- [ ] ✅ Mantener guards actuales

#### Imports
- [ ] 0 imports relativos `../../../`
- [ ] Todos los imports usan path aliases (`@features`, `@shared`)
- [ ] Imports directos para components/services
- [ ] Barrel imports solo para models/constants

#### Validación Técnica
- [ ] `pnpm build` exitoso
- [ ] `pnpm test` todos passing
- [ ] `pnpm lint` sin errores
- [ ] Bundle size < 2MB (idealmente)
- [ ] Aplicación funciona correctamente en todos los municipios

#### Documentación
- [ ] README actualizado con nueva estructura
- [ ] Guía de migración para el equipo
- [ ] Patrones de código documentados
- [ ] Commit final con BREAKING CHANGE

---

## 📊 Métricas de Éxito

### Métricas Actuales (Antes)

| Métrica | Valor Actual | Estado |
|---------|-------------|--------|
| **Archivos TS en /apps** | 319 | 🔴 |
| **Componentes** | 111 | - |
| **Servicios** | 57 | - |
| **Imports relativos `../../../`** | 116 archivos | 🔴 |
| **Componentes standalone** | 122 (38%) | 🟡 |
| **Uso de control flow moderno** | 441 usos | 🟢 |
| **Decoradores en uso** | 181 archivos | 🟡 |
| **Barrel exports problemáticos** | Varios | 🔴 |

### Métricas Objetivo (Después)

| Métrica | Valor Objetivo | Estado Esperado |
|---------|---------------|-----------------|
| **Archivos TS en /apps** | 0 | ✅ |
| **Componentes** | 111 (en /features + /shared) | ✅ |
| **Servicios** | 57 (en /features + /shared) | ✅ |
| **Imports relativos `../../../`** | 0 | ✅ |
| **Componentes standalone** | 181 (100%) | ✅ |
| **Uso de `input()`** | 200+ (100% de inputs) | ✅ |
| **Uso de `inject()`** | 100% de servicios | ✅ |
| **Uso de signals** | Alto (estado en servicios) | ✅ |
| **Barrel exports components/services** | 0 | ✅ |
| **Build time** | < 2 min | ✅ |
| **Bundle size** | < 2MB | ✅ |

### Beneficios Esperados

#### 📈 Técnicos

- **70% reducción** en imports relativos problemáticos
- **100% adopción** de patrones Angular 18+ modernos
- **50% mejora** en tiempo de build (eliminando dependencias circulares)
- **Mejor tree-shaking** por eliminación de barrel exports incorrectos
- **Código más mantenible** por organización clara por dominio

#### 👥 Equipo de Desarrollo

- **Onboarding 3x más rápido** para nuevos desarrolladores
- **Estructura clara** por dominio de negocio
- **Boundaries definidos** entre features
- **Patrones consistentes** en toda la aplicación
- **Menos bugs** por mejor tipado con signals

#### 🚀 Business Value

- **Time-to-market reducido** para nuevas features
- **Mantenimiento simplificado** = menos costos
- **Escalabilidad mejorada** para crecimiento futuro
- **Calidad de código aumentada** = menos bugs en producción

---

## 📅 Cronograma de Implementación

### Semanas 1-2: BPM Workflows
- Mover 25 componentes
- Mover 12 servicios
- Modernizar a Angular 18+
- **Entregable:** Feature `bpm-workflows` completo

### Semanas 3-5: Property Management
- Mover 45 componentes
- Mover 8 servicios
- Modernizar a Angular 18+
- **Entregable:** Feature `property-management` completo

### Semana 6: Economic Zones
- Mover 3 componentes
- Mover 5 servicios
- **Entregable:** Feature `economic-zones` completo

### Semana 7: Configuration
- Mover 12 componentes
- Mover 3 servicios
- **Entregable:** Feature `configuration` completo

### Semana 8: Document Management & Geographic
- Mover servicios de documentos
- Mover componentes geográficos
- **Entregable:** Features `document-management` y `geographic-viewer` completos

### Semana 9: Shared Resources
- Mover 22 componentes UI
- Mover servicios compartidos
- Mover pipes, directives, utils
- **Entregable:** Carpeta `/shared` organizada

### Semana 10: Validación y Cierre
- Validación global
- Testing exhaustivo
- Documentación final
- **Entregable:** Refactoring completo y validado

---

## 🛡️ Estrategia de Migración Segura

### Principios

1. **Incremental**: Una sección a la vez, no todo de golpe
2. **Validación continua**: Build + Test después de cada cambio
3. **Commits frecuentes**: Un commit por archivo movido
4. **Rollback fácil**: Si algo falla, git revert del último commit
5. **Sin downtime**: La aplicación debe funcionar en todo momento

### Risk Mitigation

#### Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| **Romper funcionalidad** | Media | Alto | Tests automáticos, validación continua |
| **Imports rotos** | Alta | Medio | Scripts de validación, TypeScript compiler |
| **Dependencias circulares** | Media | Alto | Mover modelos primero, análisis de dependencias |
| **Pérdida de historial Git** | Baja | Bajo | Usar `git mv`, no copiar/eliminar |
| **Conflictos en equipo** | Media | Medio | Una persona hace migración, otros en branch separado |

#### Estrategia de Contingencia

```bash
# Si algo sale mal en una sección:

# 1. Identificar el problema
git log --oneline -10

# 2. Revertir al último commit estable
git revert HEAD
# o
git reset --hard <commit-hash-estable>

# 3. Analizar qué falló
pnpm build
pnpm test

# 4. Corregir el problema específico

# 5. Continuar con la migración
```

### Testing Strategy

#### Después de Cada Archivo Movido
```bash
pnpm build  # Debe compilar sin errores
```

#### Después de Cada Componente Movido
```bash
pnpm test  # Los tests del componente deben pasar
```

#### Después de Cada Sección
```bash
pnpm build     # Build completo
pnpm test      # Todos los tests
pnpm lint      # Lint
# Manual: Probar funcionalidad en browser
```

#### Validación Final
```bash
# Build para todos los municipios
pnpm build --configuration=armenia
pnpm build --configuration=manizales
# ... probar todos

# E2E tests si los hay
pnpm e2e

# Performance check
# Verificar bundle size en output
```

---

## 🎓 Guía de Referencia Rápida

### Comandos Esenciales

```bash
# Mover archivos (IMPORTANTE: usar git mv)
git mv src/old/path/file.ts src/new/path/file.ts

# Buscar imports a actualizar
grep -r "old/path" src/app/

# Validar
pnpm build && pnpm test

# Commit
git add .
git commit -m "refactor(domain): Move Component to features"
```

### Patrones de Código

```typescript
// ✅ Input
name = input<string>('');
required = input.required<boolean>();

// ✅ Output
save = output<User>();

// ✅ ViewChild
element = viewChild<ElementRef>('myElement');

// ✅ Inject
private http = inject(HttpClient);

// ✅ Signal
data = signal<Data[]>([]);
filtered = computed(() => this.data().filter(d => d.active));

// ✅ Effect
constructor() {
  effect(() => {
    console.log('Data changed:', this.data());
  });
}
```

### Imports

```typescript
// ✅ Componentes/Servicios - Importación directa
import { MyComponent } from '@features/domain/components/my/my.component';
import { MyService } from '@features/domain/services/my.service';

// ✅ Modelos/Constantes - Barrel permitido
import { Model, Interface } from '@features/domain/models';
import { CONSTANT } from '@features/domain/constants';

// ❌ NUNCA
import { MyComponent } from '@features/domain/components';
import { Something } from '../../../deep/relative/path';
```

---

## 📚 Referencias

### Documentación Angular

- [Angular 18 Signals Guide](https://angular.dev/guide/signals)
- [Angular Standalone Components](https://angular.dev/guide/components/standalone)
- [Angular Architecture Guide](https://angular.dev/guide/architecture)

### Herramientas Utilizadas

- **Angular Toolkit MCP**: Análisis de código y dependencies
- **Context7**: Documentación actualizada de Angular 18+
- **TypeScript**: Type checking y validación
- **Jest**: Testing framework

---

**Documento generado por:** Claude Code + Angular Toolkit MCP + Context7
**Fecha:** 28 de Octubre, 2025
**Versión del Reporte:** 2.0
**Estado:** ✅ Aprobado para ejecución

---

## 🎯 Próximos Pasos Inmediatos

1. **Crear rama de refactoring**
   ```bash
   git checkout -b refactor/section-1-bpm-workflows
   ```

2. **Configurar path aliases**
   - Actualizar `tsconfig.json` con aliases `@features`, `@shared`

3. **Comenzar con SECCIÓN 1: BPM Workflows**
   - Seguir el plan paso por paso
   - Validación continua

4. **Reunión de kickoff con el equipo**
   - Explicar la estrategia
   - Asignar responsabilidades
   - Establecer timeline

¡Listo para comenzar la refactorización! 🚀