# Fase 3: Property Management - Plan de Migración

**Fecha**: 29 de Octubre, 2025
**Estado**: 📋 EN PLANIFICACIÓN

## 📊 Análisis Inicial

### Componentes a Migrar: 47 total

| Subdominio | Componentes | Prioridad |
|------------|-------------|-----------|
| **1. Basic Information** | 2 componentes | 🔴 Alta |
| - basic-property-information | | |
| **2. Constructions** | 8+ componentes | 🔴 Alta |
| - information-constructions-property | | |
| **3. Addresses** | 3 componentes | 🟡 Media |
| - information-addresses-property | | |
| **4. Owners** | Varios componentes | 🟡 Media |
| - information-property-owners | | |
| - information-person-property | | |
| **5. Adjacent Properties** | 3+ componentes | 🟡 Media |
| - information-adjacent-property | | |
| **6. Zones** | Varios componentes | 🟡 Media |
| - information-zones-property | | |
| **7. Appraisals** | Varios componentes | 🟢 Baja |
| - property-appraisal-information | | |
| **8. Administrative** | 6+ componentes | 🟢 Baja |
| - administrative-sources | | |
| - alerts | | |
| **9. Others** | Resto | 🟢 Baja |
| - baunit-ica | | |
| - cadastral-information-property | | |
| - header-cadastral-information-property | | |
| - historical-active-procedures | | |
| - information-source-property | | |
| - information-unit-property | | |
| - layout-card-cadastral | | |
| - photos | | |
| - super-notariado-property | | |

### Servicios a Migrar: 4 total

1. `administrative-sources.service.ts`
2. `information-adjacent-property.service.ts`
3. `information-constructions.service.ts`
4. `information-zones.service.ts`

## 🎯 Estrategia de Migración

### Opción A: Migración Incremental por Subdominios (RECOMENDADA)

**Ventajas:**
- Menor riesgo por lote
- Validación continua
- Commits más pequeños y manejables
- Fácil rollback si hay problemas

**Desventajas:**
- Más tiempo total
- Múltiples commits

**Lotes propuestos:**

#### Lote 3.1: Basic Information & Core (5-8 componentes)
- basic-property-information (2)
- cadastral-information-property (1)
- header-cadastral-information-property (1)
- layout-card-cadastral (1)
- historical-active-procedures (1)

#### Lote 3.2: Constructions (8+ componentes)
- information-constructions-property (todos)
- information-constructions.service.ts

#### Lote 3.3: Addresses & Zones (6+ componentes)
- information-addresses-property (3)
- information-zones-property (varios)
- information-zones.service.ts

#### Lote 3.4: Owners & Persons (varios componentes)
- information-property-owners
- information-person-property

#### Lote 3.5: Adjacent Properties (3+ componentes)
- information-adjacent-property
- information-adjacent-property.service.ts

#### Lote 3.6: Administrative & Alerts (6+ componentes)
- administrative-sources (2)
- alerts (4)
- administrative-sources.service.ts

#### Lote 3.7: Remaining Components
- baunit-ica
- property-appraisal-information
- information-source-property
- information-unit-property
- photos
- super-notariado-property

### Opción B: Migración Completa de una vez

**Ventajas:**
- Una sola fase
- Un solo commit

**Desventajas:**
- Alto riesgo
- Difícil debugging
- Commit muy grande
- Rollback difícil

## 📁 Estructura de Destino

```
src/app/features/property-management/
├── components/
│   ├── basic-information/
│   ├── constructions/
│   ├── addresses/
│   ├── owners/
│   ├── adjacent-properties/
│   ├── zones/
│   ├── appraisals/
│   ├── administrative/
│   ├── core/
│   └── shared/
├── services/
│   ├── administrative-sources.service.ts
│   ├── adjacent-property.service.ts
│   ├── constructions.service.ts
│   └── zones.service.ts
├── models/
│   └── (interfaces a mover)
└── constants/
    └── (constantes a mover)
```

## 🔄 Proceso para Cada Lote

1. **Análisis** - Identificar dependencias del lote
2. **Estructura** - Crear carpetas necesarias
3. **Migración** - Mover archivos con `git mv`
4. **Modernización** - Aplicar patterns Angular 18+
5. **Imports** - Actualizar todos los imports
6. **Validación** - Build + test
7. **Commit** - Con mensaje descriptivo
8. **Documentación** - Actualizar informe

## ⚡ Modernización a Aplicar

### Decoradores → Funciones

```typescript
// ANTES
@Input() propertyId!: string;
@Output() saved = new EventEmitter<void>();

// DESPUÉS
readonly propertyId = input.required<string>();
readonly saved = output<void>();
```

### Constructor Injection → inject()

```typescript
// ANTES
constructor(
  private propertyService: PropertyService
) {}

// DESPUÉS
private readonly propertyService = inject(PropertyService);
```

## 📋 Criterios de Éxito

- [ ] 47 componentes migrados a `/features/property-management`
- [ ] 4 servicios migrados y modernizados
- [ ] Modelos e interfaces organizados
- [ ] Todos los imports actualizados
- [ ] Build exitoso sin errores
- [ ] Tests pasando
- [ ] Carpetas `/apps/components/information-property` eliminadas
- [ ] Documentación completa

## 🎯 Decisión: ¿Cuál Opción?

**Recomendación**: Opción A (Migración Incremental)

**Razón**: Dada la cantidad de componentes (47) y la complejidad de las interdependencias, es más seguro migrar por lotes pequeños con validación continua.

**Tiempo estimado**:
- Opción A: 3-4 horas (distribuidas en múltiples sesiones)
- Opción B: 5-6 horas (riesgo de errores alto)

---

**Próximo paso**: Usuario decide qué enfoque seguir
