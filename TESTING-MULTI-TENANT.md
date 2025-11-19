# Guía de Testing Multi-Tenant

Esta guía explica cómo testear la configuración multi-tenant en diferentes escenarios.

## 🧪 Tests Automatizados

### 1. Ejecutar Tests Unitarios

```bash
# Tests del TenantConfigService
pnpm test tenant-config.service.spec.ts

# Tests de integración
pnpm test tenant-integration.spec.ts
```

### 2. Tests de Integración Completos

```bash
# Ejecutar todos los tests relacionados con tenant
pnpm test --testNamePattern="tenant|Tenant"
```

## 🚀 Testing Manual en Desarrollo

### 1. Usar el Tenant Switcher Component

Agregar el componente a su template para testing:

```html
<!-- En su app.component.html o página de desarrollo -->
<vex-tenant-switcher *ngIf="isDevelopment"></vex-tenant-switcher>
```

```typescript
// En su component
export class AppComponent {
  isDevelopment = !environment.production;
}
```

### 2. Testing por URL Parameters

```bash
# Iniciar servidor de desarrollo
pnpm start

# Probar diferentes tenants:
http://localhost:4200?tenant=manizales
http://localhost:4200?tenant=armenia
http://localhost:4200?tenant=barrancabermeja
```

**Verificaciones:**

- ✅ Logo cambia según municipio
- ✅ Colores de tema se aplican correctamente
- ✅ URLs de API se configuran para el tenant
- ✅ Features específicas se habilitan/deshabilitan

### 3. Testing por LocalStorage

```javascript
// En DevTools Console:

// Configurar tenant en localStorage
localStorage.setItem('selectedTenant', 'manizales');
location.reload();

// Verificar detección
console.log(window.angular?.tenantId);

// Limpiar y probar fallback
localStorage.removeItem('selectedTenant');
location.reload();
```

### 4. Testing de Switching Dinámico

```javascript
// En DevTools Console:

// Obtener servicio de tenant (si está disponible)
const tenantService = window.angular?.tenantService;

// Cambiar tenant dinámicamente
if (tenantService) {
  tenantService.switchTenant('armenia');
  
  // Verificar cambio
  console.log(tenantService.getCurrentTenantConfig());
}
```

## 🌐 Testing en Producción

### 1. Testing con Hostnames Simulados

Agregar entradas a `hosts` file para simular dominios:

```bash
# Windows: C:\\Windows\\System32\\drivers\\etc\\hosts
# Linux/Mac: /etc/hosts

127.0.0.1 manizales.geogestion.local
127.0.0.1 armenia.geogestion.local
127.0.0.1 barrancabermeja.geogestion.local
```

Luego probar:

```bash
http://manizales.geogestion.local:4200
http://armenia.geogestion.local:4200
```

### 2. Testing con Script Automatizado

```bash
# Instalar dependencias para testing
npm install puppeteer chalk

# Ejecutar script de testing
node scripts/test-tenant-config.js
```

El script probará automáticamente:

- ✅ Detección por URL parameter
- ✅ Detección por localStorage
- ✅ Switching dinámico
- ✅ Configuración de API
- ✅ Generará reporte de resultados

## 📊 Checklist de Verificación

### Para cada Tenant (ej: Manizales)

#### 🎨 UI/UX

- [ ] Logo correcto se muestra
- [ ] Colores de tema aplicados
- [ ] Nombre del municipio visible
- [ ] Favicon específico (si aplicable)

#### 🔧 Configuración Técnica

- [ ] URL de API correcta: `https://manizales-api.geogestion.com`
- [ ] Puerto configurado: `443`
- [ ] Timeout correcto: `30000ms`
- [ ] Headers de autenticación correctos

#### 🚀 Features Específicas

- [ ] Features habilitadas correctamente
- [ ] Workflow específico disponible
- [ ] Reportes específicos visibles
- [ ] Integraciones activadas según configuración

#### 💾 Persistencia

- [ ] Tenant se guarda en localStorage
- [ ] Configuración persiste entre recargas
- [ ] Cambio de tenant funciona correctamente

### Escenarios de Edge Cases

#### 🚫 Tenant Inválido

```bash
http://localhost:4200?tenant=invalid-tenant
```

- [ ] Usa tenant por defecto (armenia)
- [ ] No genera errores de consola
- [ ] Aplicación funciona normalmente

#### 🌐 Hostname Desconocido

```bash
http://unknown.domain.com:4200
```

- [ ] Usa tenant por defecto
- [ ] localStorage funciona como fallback
- [ ] No hay errores de configuración

#### 🔄 Switching Rápido

- [ ] Cambiar tenant múltiples veces rápidamente
- [ ] Verificar que no hay memory leaks
- [ ] Configuración se actualiza correctamente

## 🐛 Troubleshooting

### Problemas Comunes

**Tenant no se detecta:**

```javascript
// Verificar en console
console.log('Hostname:', window.location.hostname);
console.log('URL params:', window.location.search);
console.log('LocalStorage:', localStorage.getItem('selectedTenant'));
```

**Configuración no se aplica:**

```javascript
// Verificar servicio
const service = window.angular?.tenantService;
console.log('Current tenant:', service?.getCurrentTenantId());
console.log('Config:', service?.getCurrentTenantConfig());
```

**API URLs incorrectas:**

```javascript
// Verificar factory
const config = window.angular?.tenantConfig;
console.log('API Config:', config?.apiConfig);
```

### Logs de Debug

Habilitar logs detallados:

```typescript
// En tenant-config.service.ts
constructor() {
  this.debugMode = !environment.production;
}

private log(message: string, data?: any) {
  if (this.debugMode) {
    console.log(`[TenantConfig] ${message}`, data);
  }
}
```

## 📈 Métricas de Rendimiento

### Tests de Performance

```javascript
// Medir tiempo de detección
console.time('tenant-detection');
const tenant = tenantService.initializeTenant();
console.timeEnd('tenant-detection');

// Medir tiempo de switching
console.time('tenant-switching');
tenantService.switchTenant('manizales');
console.timeEnd('tenant-switching');
```

### Objetivos de Performance

- ⚡ Detección de tenant: < 50ms
- 🔄 Switching de tenant: < 100ms
- 📦 Carga de configuración: < 10ms

---

## ✅ Comando Rápido de Verificación

```bash
# Test completo en una línea
pnpm test tenant && node scripts/test-tenant-config.js
```

¡Esto ejecutará todos los tests automatizados y manuales! 🚀
