#!/usr/bin/env node

/**
 * Script para migrar servicios de SendGeneralRequestsService a HttpClient directo
 * Elimina el antipatrón de SendGeneralRequestsService y usa Angular HttpClient
 * 
 * Uso: node scripts/migrate-http-client.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración de rutas
const SERVICES_DIR = 'src/app/apps/services';
const FEATURES_DIR = 'src/app/features';

// Patrones de búsqueda y reemplazo
const PATTERNS = {
  // Import de SendGeneralRequestsService
  importSendGeneral: /import\s*{\s*SendGeneralRequestsService\s*}\s*from\s*['"][^'"]*['"];?\s*\n?/g,
  
  // Inyección en constructor
  constructorInjection: /,?\s*private\s+requestsService:\s*SendGeneralRequestsService,?/g,
  
  // Uso de métodos específicos del SendGeneralRequestsService
  sendRequestsGetOption: /this\.requestsService\.sendRequestsGetOption\(([^,)]+),\s*{\s*params:\s*([^}]+)\s*}\)/g,
  sendRequestsFetchPostBody: /this\.requestsService\.sendRequestsFetchPostBody\(([^,)]+),\s*([^)]+)\)/g,
  sendDeleteFetch: /this\.requestsService\.sendDeleteFetch\(([^)]+)\)/g,
  sendRequestsFetchGet: /this\.requestsService\.sendRequestsFetchGet\(([^)]+)\)/g,
  sendRequestsUpdatePutBody: /this\.requestsService\.sendRequestsUpdatePutBody\(([^,)]+),\s*([^)]+)\)/g,
  
  // Error handling
  errorNotFound: /this\.requestsService\.errorNotFound\(([^)]+)\)/g,
  errorBadRequest: /this\.requestsService\.errorBadRequest\(([^)]+)\)/g,
};

// Reemplazos
const REPLACEMENTS = {
  // HttpClient direct calls
  sendRequestsGetOption: 'this.http.get<any>($1, { params: $2 })',
  sendRequestsFetchPostBody: 'this.http.post<any>($1, $2)',
  sendDeleteFetch: 'this.http.delete<any>($1)',
  sendRequestsFetchGet: 'this.http.get<any>($1)',
  sendRequestsUpdatePutBody: 'this.http.put<any>($1, $2)',
  
  // Error handling simplified
  errorNotFound: '($1.status === 404 ? EMPTY : throwError(() => $1))',
  errorBadRequest: 'throwError(() => $1)',
};

// Imports necesarios para reemplazar
const REQUIRED_IMPORTS = {
  httpClient: "import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';",
  rxjsOperators: "import { catchError, Observable, EMPTY, throwError } from 'rxjs';",
};

/**
 * Obtiene todos los archivos TypeScript de servicios
 */
function getServiceFiles() {
  const files = [];
  
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.service.ts') && !item.includes('.spec.')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(SERVICES_DIR);
  scanDirectory(FEATURES_DIR);
  
  return files;
}

/**
 * Verifica si un archivo usa SendGeneralRequestsService
 */
function usesSendGeneralRequestsService(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes('SendGeneralRequestsService');
}

/**
 * Migra un archivo individual
 */
function migrateFile(filePath) {
  console.log(`🔄 Migrando: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // 1. Eliminar import de SendGeneralRequestsService
  content = content.replace(PATTERNS.importSendGeneral, '');
  
  // 2. Agregar imports necesarios si no existen
  if (!content.includes('HttpClient')) {
    // Buscar línea de imports de Angular
    const angularImportMatch = content.match(/import\s*{[^}]*}\s*from\s*['"]@angular\/common\/http['"];?\s*\n?/);
    if (angularImportMatch) {
      // Ya existe import de @angular/common/http, solo agregar HttpClient si no está
      const existingImport = angularImportMatch[0];
      if (!existingImport.includes('HttpClient')) {
        const newImport = existingImport.replace(/}\s*from/, ', HttpClient, HttpParams, HttpErrorResponse } from');
        content = content.replace(angularImportMatch[0], newImport);
      }
    } else {
      // Agregar nuevo import después de la línea de Injectable
      const injectableMatch = content.match(/import\s*{\s*[^}]*Injectable[^}]*}\s*from\s*['"]@angular\/core['"];?\s*\n/);
      if (injectableMatch) {
        content = content.replace(injectableMatch[0], injectableMatch[0] + REQUIRED_IMPORTS.httpClient + '\n');
      }
    }
  }
  
  // 3. Agregar imports de RxJS si no existen
  if (!content.includes('EMPTY') && content.includes('errorNotFound')) {
    const rxjsMatch = content.match(/import\s*{[^}]*}\s*from\s*['"]rxjs['"];?\s*\n?/);
    if (rxjsMatch) {
      const existingImport = rxjsMatch[0];
      if (!existingImport.includes('EMPTY')) {
        const newImport = existingImport.replace(/}\s*from/, ', EMPTY, throwError } from');
        content = content.replace(rxjsMatch[0], newImport);
      }
    } else {
      const injectableMatch = content.match(/import\s*{\s*[^}]*Injectable[^}]*}\s*from\s*['"]@angular\/core['"];?\s*\n/);
      if (injectableMatch) {
        content = content.replace(injectableMatch[0], injectableMatch[0] + REQUIRED_IMPORTS.rxjsOperators + '\n');
      }
    }
  }
  
  // 4. Eliminar inyección del constructor
  content = content.replace(PATTERNS.constructorInjection, '');
  
  // 5. Limpiar constructor vacío o con comas extra
  content = content.replace(/constructor\s*\(\s*,/, 'constructor(');
  content = content.replace(/constructor\s*\(\s*private\s+[^:]+:\s*[^,)]+,\s*\)\s*{/, (match) => {
    return match.replace(',)', ')');
  });
  
  // 6. Reemplazar llamadas a métodos
  Object.keys(PATTERNS).forEach(patternKey => {
    if (REPLACEMENTS[patternKey]) {
      content = content.replace(PATTERNS[patternKey], REPLACEMENTS[patternKey]);
    }
  });
  
  // 7. Simplificar manejo de errores específico
  content = content.replace(
    /\.pipe\(catchError\(\(error[^)]*\)\s*=>\s*\(\$1\.status\s*===\s*404\s*\?\s*EMPTY\s*:\s*throwError\(\(\)\s*=>\s*\$1\)\)\)\)/g,
    '.pipe(catchError((error: HttpErrorResponse) => error.status === 404 ? EMPTY : throwError(() => error)))'
  );
  
  // 8. Escribir archivo solo si hubo cambios
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Migrado exitosamente: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  Sin cambios necesarios: ${filePath}`);
    return false;
  }
}

/**
 * Función principal
 */
function main() {
  console.log('🚀 Iniciando migración de SendGeneralRequestsService a HttpClient...\n');
  
  const serviceFiles = getServiceFiles();
  const filesToMigrate = serviceFiles.filter(usesSendGeneralRequestsService);
  
  console.log(`📊 Encontrados ${filesToMigrate.length} archivos que usan SendGeneralRequestsService:\n`);
  
  filesToMigrate.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  let migratedCount = 0;
  
  for (const file of filesToMigrate) {
    try {
      if (migrateFile(file)) {
        migratedCount++;
      }
    } catch (error) {
      console.error(`❌ Error migrando ${file}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Migración completada:`);
  console.log(`  - ${migratedCount} archivos migrados exitosamente`);
  console.log(`  - ${filesToMigrate.length - migratedCount} archivos sin cambios`);
  
  if (migratedCount > 0) {
    console.log('\n📝 Próximos pasos:');
    console.log('  1. Revisar los archivos migrados');
    console.log('  2. Ejecutar pruebas: pnpm test');
    console.log('  3. Compilar proyecto: pnpm build');
    console.log('  4. Eliminar SendGeneralRequestsService si ya no se usa');
  }
}

if (require.main === module) {
  main();
}

module.exports = { migrateFile, getServiceFiles };