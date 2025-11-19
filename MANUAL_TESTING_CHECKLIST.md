# Manual de Pruebas Manuales Pre-Producción

## GeoGestion - Sistema de Gestión Catastral

**Versión:** 1.0
**Última actualización:** 2025-11-13
**Propósito:** Validación completa del sistema antes de despliegue a producción

---

## Índice

1. [Pruebas de Carga Inicial](#1-pruebas-de-carga-inicial)
2. [Pruebas de Autenticación](#2-pruebas-de-autenticación)
3. [Pruebas de Navegación y Menú](#3-pruebas-de-navegación-y-menú)
4. [Pruebas por Rol de Usuario](#4-pruebas-por-rol-de-usuario)
5. [Pruebas de Funcionalidades Principales](#5-pruebas-de-funcionalidades-principales)
6. [Pruebas Multi-Tenant](#6-pruebas-multi-tenant)
7. [Pruebas de Responsive Design](#7-pruebas-de-responsive-design)
8. [Pruebas de Rendimiento y Consola](#8-pruebas-de-rendimiento-y-consola)
9. [Pruebas de Logout y Sesión](#9-pruebas-de-logout-y-sesión)

---

## 1. Pruebas de Carga Inicial

### 1.1 Primera Carga

- [ ] La aplicación carga correctamente en la URL configurada
- [ ] No se muestra página en blanco
- [ ] No hay errores en la consola del navegador (F12)
- [ ] El favicon se carga correctamente
- [ ] La página de login/inicio se muestra correctamente
- [ ] Los estilos CSS se aplican correctamente (no hay componentes sin estilo)
- [ ] El logo del municipio correspondiente se muestra correctamente

### 1.2 Recursos y Assets

- [ ] Todas las imágenes cargan correctamente
- [ ] Los iconos de Material Design se visualizan
- [ ] Las fuentes tipográficas cargan correctamente
- [ ] No hay errores 404 en la pestaña Network del navegador

---

## 2. Pruebas de Autenticación

### 2.1 Login Exitoso

- [ ] Ingresar credenciales válidas
- [ ] El botón de "Iniciar sesión" funciona correctamente
- [ ] Se muestra loading/spinner durante el proceso
- [ ] Redirección exitosa a la página principal/dashboard
- [ ] El token JWT se almacena correctamente (verificar en DevTools > Application > Storage)
- [ ] La sesión persiste al recargar la página (F5)

### 2.2 Login Fallido

- [ ] Ingresar credenciales incorrectas
- [ ] Se muestra mensaje de error apropiado
- [ ] No se permite acceso al sistema
- [ ] El formulario permanece disponible para reintentar
- [ ] No hay errores en consola

### 2.3 Validaciones de Formulario

- [ ] Campo de usuario: validación de campo requerido
- [ ] Campo de contraseña: validación de campo requerido
- [ ] Campo de usuario: no permite espacios en blanco
- [ ] Mensajes de validación se muestran correctamente
- [ ] Botón de submit se deshabilita mientras se procesa la petición

### 2.4 Seguridad

- [ ] La contraseña se muestra oculta (tipo password)
- [ ] Existe opción para mostrar/ocultar contraseña (si aplica)
- [ ] No se guarda la contraseña en texto plano en localStorage
- [ ] El sistema redirige al login si el token expira

---

## 3. Pruebas de Navegación y Menú

### 3.1 Menú Lateral (Sidebar)

- [ ] El menú lateral se muestra correctamente al iniciar sesión
- [ ] Todas las opciones del menú son visibles
- [ ] Los iconos de cada opción se visualizan correctamente
- [ ] El menú se puede expandir y contraer (si aplica)
- [ ] Los submenús se despliegan correctamente
- [ ] Las secciones del menú están agrupadas lógicamente

### 3.2 Navegación Entre Páginas

- [ ] Hacer clic en cada opción del menú lateral
- [ ] Verificar que cada opción abre la página correspondiente
- [ ] **CRÍTICO:** Ninguna opción muestra error 404
- [ ] **CRÍTICO:** Ninguna opción muestra página en blanco
- [ ] Las URLs cambian correctamente al navegar
- [ ] El título de la página se actualiza según la sección (si aplica)
- [ ] El breadcrumb se actualiza correctamente (si aplica)

### 3.3 Navegación del Navegador

- [ ] El botón "Atrás" del navegador funciona correctamente
- [ ] El botón "Adelante" del navegador funciona correctamente
- [ ] Recargar la página (F5) mantiene la ruta actual
- [ ] Copiar y pegar una URL directamente funciona correctamente

### 3.4 Toolbar/Barra Superior

- [ ] La barra superior se visualiza correctamente
- [ ] El nombre de usuario se muestra correctamente
- [ ] El rol de usuario se muestra correctamente (si aplica)
- [ ] Los iconos de notificaciones funcionan (si aplica)
- [ ] El menú de perfil de usuario se despliega correctamente
- [ ] La información del municipio se muestra correctamente

---

## 4. Pruebas por Rol de Usuario

### 4.1 Preparación

Documentar los usuarios de prueba con sus roles:

- [ ] Usuario ADMIN
- [ ] Usuario BASIC_USERS
- [ ] Usuario EXECUTIONERS
- [ ] Otros roles configurados: _______________

### 4.2 Pruebas de Rol ADMIN

- [ ] Iniciar sesión con usuario ADMIN
- [ ] Verificar opciones de menú disponibles
- [ ] Documentar opciones visibles:

  ``` markdown
  - [ ] Opción 1: _______________
  - [ ] Opción 2: _______________
  - [ ] Opción 3: _______________
  ```

- [ ] Verificar acceso a funcionalidades de administración
- [ ] Verificar que puede crear/editar/eliminar registros
- [ ] Verificar acceso a configuraciones del sistema

### 4.3 Pruebas de Rol BASIC_USERS

- [ ] Iniciar sesión con usuario BASIC_USERS
- [ ] Verificar que el menú muestra DIFERENTES opciones que ADMIN
- [ ] Documentar opciones visibles:

  ``` markdown
  - [ ] Opción 1: _______________
  - [ ] Opción 2: _______________
  - [ ] Opción 3: _______________
  ```

- [ ] Verificar que NO puede acceder a funciones de administración
- [ ] Verificar permisos de solo lectura (si aplica)

### 4.4 Pruebas de Rol EXECUTIONERS

- [ ] Iniciar sesión con usuario EXECUTIONERS
- [ ] Verificar opciones de menú disponibles
- [ ] Documentar opciones visibles:

  ``` markdown
  - [ ] Opción 1: _______________
  - [ ] Opción 2: _______________
  - [ ] Opción 3: _______________
  ```

- [ ] Verificar acceso a funcionalidades BPM/workflows
- [ ] Verificar gestión de tareas y procesos

### 4.5 Pruebas de Restricciones

- [ ] Intentar acceder a rutas protegidas sin permisos (escribir URL directamente)
- [ ] Verificar que se muestra mensaje de "No autorizado" o redirección apropiada
- [ ] Verificar que los guards de ruta funcionan correctamente

---

## 5. Pruebas de Funcionalidades Principales

### 5.1 Gestión de Información de Propiedad (Property Management)

- [ ] Acceder al módulo de información de propiedad
- [ ] La página carga correctamente
- [ ] El listado de propiedades se muestra correctamente
- [ ] Los filtros de búsqueda funcionan
- [ ] La paginación funciona correctamente
- [ ] Ver detalle de una propiedad
- [ ] Crear nueva propiedad (si aplica según rol)
- [ ] Editar propiedad existente (si aplica según rol)
- [ ] Eliminar propiedad (si aplica según rol)
- [ ] Los datos se guardan correctamente

### 5.2 BPM - Flujos de Trabajo (Workflows)

- [ ] Acceder al módulo de flujos de trabajo
- [ ] El listado de workflows se muestra correctamente
- [ ] Crear nuevo workflow (si aplica según rol)
- [ ] Ver detalle de workflow
- [ ] Editar workflow existente
- [ ] Asignar tareas a usuarios
- [ ] Cambiar estado de tareas
- [ ] Completar tareas
- [ ] Los cambios de estado se reflejan correctamente
- [ ] Las notificaciones funcionan (si aplica)

### 5.3 Componentes Geográficos (Geographic Data)

- [ ] Acceder al módulo de datos geográficos
- [ ] El visor de mapas carga correctamente
- [ ] Los marcadores se visualizan en el mapa
- [ ] Las capas del mapa se pueden activar/desactivar
- [ ] El zoom funciona correctamente
- [ ] La búsqueda por ubicación funciona
- [ ] Los datos geográficos se sincronizan con propiedades

### 5.4 Gestión de Documentos

- [ ] Acceder al módulo de documentos
- [ ] El listado de documentos se muestra correctamente
- [ ] Cargar/subir nuevo documento
- [ ] El upload funciona correctamente
- [ ] Validación de tipos de archivo permitidos
- [ ] Validación de tamaño máximo de archivo
- [ ] Descargar documento existente
- [ ] Eliminar documento (si aplica según rol)
- [ ] Vista previa de documentos funciona (si aplica)

### 5.5 Tablas y Listados

- [ ] Todas las tablas muestran datos correctamente
- [ ] Los headers de las tablas son legibles
- [ ] El ordenamiento por columnas funciona
- [ ] Los filtros de tabla funcionan
- [ ] La búsqueda en tabla funciona
- [ ] La paginación funciona correctamente
- [ ] Mostrar cantidad de registros por página funciona
- [ ] Las acciones por fila funcionan (editar, eliminar, ver detalle)
- [ ] La selección múltiple funciona (si aplica)
- [ ] Exportar datos funciona (si aplica)

### 5.6 Formularios

- [ ] Todos los campos de formulario se visualizan correctamente
- [ ] Los labels son descriptivos
- [ ] Las validaciones funcionan:
  - [ ] Campos requeridos
  - [ ] Formato de email
  - [ ] Formato de números
  - [ ] Formato de fechas
  - [ ] Longitud mínima/máxima
- [ ] Los mensajes de error son claros
- [ ] Los mensajes de error desaparecen al corregir
- [ ] El botón de submit se habilita/deshabilita correctamente
- [ ] El botón de cancelar funciona
- [ ] Los datos se guardan correctamente
- [ ] Mensaje de éxito al guardar
- [ ] Redirección apropiada después de guardar

### 5.7 Modales/Diálogos

- [ ] Los modales se abren correctamente
- [ ] El contenido del modal es visible y legible
- [ ] El botón de cerrar (X) funciona
- [ ] Cerrar haciendo clic fuera del modal funciona
- [ ] Cerrar con tecla ESC funciona
- [ ] Los botones de acción en el modal funcionan
- [ ] El modal se cierra después de completar la acción

---

## 6. Pruebas Multi-Tenant

### 6.1 Configuración Armenia

- [ ] Acceder con configuración de Armenia
- [ ] Verificar que el logo de Armenia se muestra
- [ ] Verificar colores de tema específicos de Armenia
- [ ] Verificar funcionalidades específicas de Armenia
- [ ] Verificar datos de prueba de Armenia

### 6.2 Configuración Barrancabermeja

- [ ] Acceder con configuración de Barrancabermeja
- [ ] Verificar que el logo de Barrancabermeja se muestra
- [ ] Verificar colores de tema específicos
- [ ] Verificar funcionalidades específicas

### 6.3 Configuración Manizales

- [ ] Acceder con configuración de Manizales
- [ ] Verificar que el logo de Manizales se muestra
- [ ] Verificar colores de tema específicos
- [ ] Verificar funcionalidades específicas

### 6.4 Otros Municipios

- [ ] Calarca
- [ ] Filandia
- [ ] Montenegro
- [ ] Quimbaya

**Nota:** Repetir las validaciones básicas para cada municipio configurado.

---

## 7. Pruebas de Responsive Design

### 7.1 Desktop (1920x1080)

- [ ] La aplicación se visualiza correctamente
- [ ] No hay elementos cortados o fuera de vista
- [ ] El menú lateral funciona correctamente
- [ ] Las tablas se muestran completas

### 7.2 Laptop (1366x768)

- [ ] La aplicación se ajusta correctamente
- [ ] Los elementos son legibles
- [ ] El menú funciona correctamente

### 7.3 Tablet (768px)

- [ ] El menú se convierte a versión móvil/hamburguesa
- [ ] Las tablas se adaptan o permiten scroll horizontal
- [ ] Los formularios se ajustan correctamente
- [ ] Los botones son fácilmente tocables

### 7.4 Mobile (375px)

- [ ] El menú hamburguesa funciona
- [ ] El contenido es legible sin zoom
- [ ] Los botones son fácilmente tocables
- [ ] Las tablas son navegables
- [ ] Los formularios son utilizables

### 7.5 Rotación de Pantalla

- [ ] La aplicación se adapta al cambiar de vertical a horizontal
- [ ] No hay pérdida de funcionalidad

---

## 8. Pruebas de Rendimiento y Consola

### 8.1 Consola del Navegador

- [ ] Abrir DevTools (F12) > Console
- [ ] **CRÍTICO:** No hay errores en rojo
- [ ] Verificar que no hay warnings críticos
- [ ] No hay recursos que fallen al cargar (404, 500)

### 8.2 Network

- [ ] Abrir DevTools > Network
- [ ] Recargar la aplicación
- [ ] Verificar que todas las peticiones HTTP tienen respuesta exitosa (200, 201)
- [ ] No hay peticiones fallidas (4xx, 5xx)
- [ ] Los tiempos de carga son razonables (<3s para carga inicial)

### 8.3 Performance

- [ ] La aplicación responde rápidamente a interacciones
- [ ] No hay lag al navegar entre páginas
- [ ] Las tablas con muchos datos cargan en tiempo razonable
- [ ] Los formularios responden inmediatamente

### 8.4 Métricas de Tiempos de Carga

**Instrucciones:** Utilizar DevTools > Network para medir tiempos. Documentar cualquier tiempo que exceda los límites esperados.

#### 8.4.1 Carga Inicial de la Aplicación

- [ ] **Primera carga (cache vacío):**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 3000 ms (3 segundos)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **Carga subsecuente (con cache):**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 1000 ms (1 segundo)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

#### 8.4.2 Tiempo de Login

- [ ] **Desde submit hasta redirección:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 2000 ms (2 segundos)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

#### 8.4.3 Navegación Entre Páginas

- [ ] **Cambio de ruta (lazy loading):**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 1500 ms (1.5 segundos)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

#### 8.4.4 Carga de Tablas/Listados

- [ ] **Tabla con < 50 registros:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 500 ms
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **Tabla con 50-100 registros:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 1000 ms (1 segundo)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **Tabla con > 100 registros:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 2000 ms (2 segundos)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

#### 8.4.5 Formularios

- [ ] **Apertura de modal/formulario:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 300 ms
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **Envío de formulario (submit):**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 1500 ms (1.5 segundos)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

#### 8.4.6 Módulos Específicos

**BPM/Workflows:**

- [ ] **Carga de listado de workflows:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 2000 ms
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **Detalle de workflow:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 1000 ms
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

**Información de Propiedad:**

- [ ] **Carga de listado de propiedades:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 2000 ms
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **Detalle de propiedad:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 1000 ms
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

**Módulos Geográficos:**

- [ ] **Carga del mapa:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 3000 ms (3 segundos)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **Renderizado de marcadores (< 50):**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 1000 ms
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

**Gestión de Documentos:**

- [ ] **Upload de documento (< 5MB):**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 5000 ms (5 segundos)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **Descarga de documento:**
  - Tiempo medido: _______ ms
  - Tiempo esperado: < 3000 ms (3 segundos)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

#### 8.4.7 Tamaño de Recursos (Bundle Size)

- [ ] **main.js:**
  - Tamaño: _______ KB
  - Tamaño esperado: < 2000 KB (2 MB)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **vendor.js:**
  - Tamaño: _______ KB
  - Tamaño esperado: < 3000 KB (3 MB)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **Total transferido (primera carga):**
  - Tamaño: _______ KB
  - Tamaño esperado: < 5000 KB (5 MB)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

#### 8.4.8 Formato de Reporte de Tiempos Excedidos

**Si alguna métrica excede el tiempo esperado, documentar así:**

``` markdown
⚠️ REPORTE DE RENDIMIENTO

Módulo: [Nombre del módulo]
Acción: [Descripción de la acción]
Tiempo medido: [X ms]
Tiempo esperado: [Y ms]
Diferencia: [+Z ms] ([%] más lento)

Condiciones:
- Navegador: [Chrome/Firefox/Edge + Versión]
- Conexión: [WiFi/Cable/4G/5G]
- Velocidad de red simulada: [Fast 3G/Slow 3G/None]
- CPU throttling: [None/4x/6x]
- Cantidad de datos: [ej. 250 registros en tabla]

Pasos para reproducir:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

Screenshot DevTools Network:
[Adjuntar captura]

Prioridad: [ ] Alta [ ] Media [ ] Baja

Notas adicionales:
[Cualquier observación relevante]
```

#### 8.4.9 Pruebas en Condiciones de Red Limitada

**Instrucciones:** DevTools > Network > Throttling

- [ ] **Con "Fast 3G":**
  - Carga inicial: _______ ms (esperado: < 8000 ms)
  - Navegación entre páginas: _______ ms (esperado: < 3000 ms)
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

- [ ] **Con "Slow 3G":**
  - Carga inicial: _______ ms (esperado: < 15000 ms)
  - La aplicación muestra indicadores de carga: [ ] Sí [ ] No
  - Estado: [ ] ✅ Aceptable [ ] ⚠️ Reportar

#### 8.4.10 Core Web Vitals (Opcional pero Recomendado)

**Instrucciones:** DevTools > Lighthouse > Performance

- [ ] **LCP (Largest Contentful Paint):**
  - Valor: _______ s
  - Esperado: < 2.5 s
  - Estado: [ ] ✅ Bueno [ ] ⚠️ Mejorable [ ] ❌ Pobre

- [ ] **FID (First Input Delay):**
  - Valor: _______ ms
  - Esperado: < 100 ms
  - Estado: [ ] ✅ Bueno [ ] ⚠️ Mejorable [ ] ❌ Pobre

- [ ] **CLS (Cumulative Layout Shift):**
  - Valor: _______
  - Esperado: < 0.1
  - Estado: [ ] ✅ Bueno [ ] ⚠️ Mejorable [ ] ❌ Pobre

- [ ] **Performance Score:**
  - Valor: _______ / 100
  - Esperado: > 80
  - Estado: [ ] ✅ Bueno [ ] ⚠️ Mejorable [ ] ❌ Pobre

### 8.5 Memory Leaks (Básico)

- [ ] Navegar entre varias páginas múltiples veces
- [ ] Verificar que la aplicación no se vuelve lenta progresivamente
- [ ] Verificar en DevTools > Performance/Memory que no hay crecimiento anormal

---

## 9. Pruebas de Logout y Sesión

### 9.1 Logout Normal

- [ ] Hacer clic en botón de "Cerrar sesión"
- [ ] Confirmar que redirige a página de login
- [ ] Verificar que el token se elimina (DevTools > Application > Storage)
- [ ] Intentar acceder a rutas protegidas después de logout (debe redirigir a login)

### 9.2 Sesión Expirada

- [ ] Dejar la sesión inactiva por el tiempo configurado
- [ ] Verificar que el sistema detecta la expiración
- [ ] Verificar que redirige automáticamente a login
- [ ] Verificar mensaje apropiado de sesión expirada

### 9.3 Múltiples Sesiones

- [ ] Abrir la aplicación en dos pestañas diferentes
- [ ] Cerrar sesión en una pestaña
- [ ] Verificar comportamiento en la otra pestaña

---

## 10. Pruebas de Integración de Datos

### 10.1 Operaciones CRUD Completas

Para cada módulo principal, realizar ciclo completo:

#### Propiedad/Catastro

- [ ] **Create:** Crear nueva propiedad → Verificar que aparece en listado
- [ ] **Read:** Ver detalle → Verificar que todos los datos se muestran
- [ ] **Update:** Editar propiedad → Verificar que cambios se guardan
- [ ] **Delete:** Eliminar propiedad → Verificar que desaparece del listado

#### BPM/Workflows

- [ ] **Create:** Crear nuevo workflow
- [ ] **Read:** Ver detalle de workflow
- [ ] **Update:** Modificar workflow
- [ ] **Delete:** Eliminar workflow (si aplica)

### 10.2 Integridad de Datos

- [ ] Los datos se mantienen consistentes entre vistas
- [ ] Los cambios en un módulo se reflejan en módulos relacionados
- [ ] No hay pérdida de datos al navegar entre páginas
- [ ] Los datos persisten después de recargar (F5)

---

## 11. Pruebas de Edge Cases

### 11.1 Datos Vacíos

- [ ] Verificar comportamiento cuando no hay datos en tablas
- [ ] Verificar mensaje apropiado de "No hay datos"
- [ ] Verificar que no hay errores en consola

### 11.2 Datos Extensos

- [ ] Probar con texto muy largo en campos de texto
- [ ] Probar con números muy grandes
- [ ] Verificar que no rompe la interfaz
- [ ] Verificar que hay scroll o truncado apropiado

### 11.3 Caracteres Especiales

- [ ] Probar con caracteres especiales: ñ, á, é, í, ó, ú
- [ ] Probar con símbolos: @, #, $, %, &
- [ ] Verificar que se guardan y muestran correctamente

### 11.4 Operaciones Simultáneas

- [ ] Intentar enviar formulario múltiples veces rápidamente
- [ ] Verificar que se previenen duplicados
- [ ] Verificar que hay feedback visual apropiado

---

## 12. Checklist de Regresión Crítica

**Realizar SIEMPRE antes de cada despliegue:**

- [ ] 1. Login con usuario ADMIN → éxito
- [ ] 2. Login con usuario BASIC → éxito
- [ ] 3. Todas las opciones del menú abren páginas (ADMIN)
- [ ] 4. Todas las opciones del menú abren páginas (BASIC)
- [ ] 5. Crear un registro en módulo principal → éxito
- [ ] 6. Editar el registro creado → éxito
- [ ] 7. Eliminar el registro → éxito (si aplica)
- [ ] 8. No hay errores en consola en ninguna página
- [ ] 9. Logout funciona correctamente
- [ ] 10. Responsive funciona en mobile (375px)

---

## Registro de Pruebas

### Información de la Sesión de Pruebas

- **Fecha:** _______________
- **Tester:** _______________
- **Rama:** _______________
- **Commit Hash:** _______________
- **Municipio/Tenant:** _______________
- **Navegador:** _______________ (Chrome/Firefox/Edge + Versión)
- **Sistema Operativo:** _______________

### Resultado General

- [ ] TODAS LAS PRUEBAS PASARON ✅
- [ ] HAY ERRORES MENORES (especificar abajo) ⚠️
- [ ] HAY ERRORES CRÍTICOS (NO DESPLEGAR) ❌

### Errores Encontrados

#### Error #1

- **Severidad:** [ ] Crítico [ ] Alto [ ] Medio [ ] Bajo
- **Módulo:** _______________
- **Descripción:** _______________
- **Pasos para reproducir:**
  1. _______________
  2. _______________
  3. _______________
- **Screenshot/Video:** _______________

#### Error #2

- **Severidad:** [ ] Crítico [ ] Alto [ ] Medio [ ] Bajo
- **Módulo:** _______________
- **Descripción:** _______________
- **Pasos para reproducir:**
  1. _______________
  2. _______________
  3. _______________

*(Agregar más según sea necesario)*

---

## Criterios de Aceptación para Despliegue

### ✅ PUEDE DESPLEGARSE SI

- Todas las pruebas críticas (sección 12) pasan
- No hay errores en consola
- Login/Logout funcionan correctamente
- Todas las páginas del menú cargan (no 404)
- Las funcionalidades principales CRUD funcionan
- Los errores encontrados son de severidad "Baja" y están documentados

### ❌ NO DEBE DESPLEGARSE SI

- Hay errores de severidad "Crítica"
- El login no funciona
- Hay páginas 404 en el menú
- Hay errores en consola en páginas principales
- Las funcionalidades CRUD no funcionan
- Hay más de 5 errores de severidad "Media"

---

## Notas Adicionales

### Ambiente de Pruebas

- **URL de prueba:** _______________
- **Base de datos:** _______________ (Test/Staging)
- **Usuarios de prueba:** _______________

### Observaciones Generales

```
(Espacio para comentarios adicionales, observaciones o consideraciones especiales)






```

---

## Anexos

### Usuarios de Prueba Sugeridos

```
ADMIN:
- Usuario: admin@test.com
- Password: [según configuración]

BASIC_USERS:
- Usuario: usuario@test.com
- Password: [según configuración]

EXECUTIONERS:
- Usuario: ejecutor@test.com
- Password: [según configuración]
```

### Enlaces Útiles

- Repositorio: <https://github.com/[tu-org]/GeoGestion>
- Documentación: [URL de documentación]
- Jira/Issues: [URL de sistema de tickets]

---

**Versión del documento:** 1.0
**Próxima revisión:** [Fecha]
