#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Auto-fixing barrel exports - Version 2.0...');

// Función para ejecutar pnpm build y capturar errores
function getBuildErrors() {
  console.log('📊 Analizando errores de compilación...');
  try {
    execSync('pnpm build', { cwd: process.cwd(), stdio: 'pipe' });
    return [];
  } catch (error) {
    return error.stdout.toString() + error.stderr.toString();
  }
}

// Extraer imports faltantes de los errores
function extractMissingImports(buildOutput) {
  const missingImports = {
    services: new Set(),
    components: new Set(),
    interfaces: new Set(),
    pipes: new Set()
  };

  // Patrones para extraer imports faltantes
  const patterns = {
    services: /Module '"@shared\/services"' has no exported member '([^']+)'/g,
    components: /Module '"@shared\/components"' has no exported member '([^']+)'/g,
    interfaces: /Module '"@shared\/interfaces"' has no exported member '([^']+)'/g
  };

  // Extraer todos los imports faltantes
  Object.keys(patterns).forEach(type => {
    let match;
    while ((match = patterns[type].exec(buildOutput)) !== null) {
      missingImports[type].add(match[1]);
    }
  });

  // Detectar pipes y componentes especiales
  const pipePattern = /AppraisalLabelPipe|ProcedureStatusPipe/g;
  let pipeMatch;
  while ((pipeMatch = pipePattern.exec(buildOutput)) !== null) {
    missingImports.pipes.add(pipeMatch[0]);
  }

  return missingImports;
}

// Función mejorada para buscar archivos
function findMatchingFiles(name, searchDir = 'src/app/apps') {
  const possibilities = [];
  
  // Múltiples estrategias de búsqueda
  const searchStrategies = [
    // 1. Búsqueda directa por nombre
    () => searchByDirectName(name, searchDir),
    // 2. Búsqueda por kebab-case
    () => searchByKebabCase(name, searchDir),
    // 3. Búsqueda por contenido (más lenta pero más precisa)
    () => searchByContent(name, searchDir),
    // 4. Búsqueda fuzzy para casos especiales
    () => searchByFuzzyMatch(name, searchDir)
  ];

  for (const strategy of searchStrategies) {
    try {
      const results = strategy();
      if (results.length > 0) {
        possibilities.push(...results);
        break; // Usar la primera estrategia que encuentre resultados
      }
    } catch (error) {
      console.log(`⚠️  Strategy failed for ${name}: ${error.message}`);
    }
  }

  return possibilities;
}

// Búsqueda directa por nombre de archivo
function searchByDirectName(name, searchDir) {
  const possibilities = [];
  const kebabName = pascalToKebab(name);
  
  // Patrones comunes de archivos
  const patterns = [
    `**/${kebabName}.ts`,
    `**/${kebabName}.service.ts`,
    `**/${kebabName}.component.ts`,
    `**/${kebabName}.interface.ts`,
    `**/${kebabName}.model.ts`,
    `**/${kebabName}.pipe.ts`
  ];

  patterns.forEach(pattern => {
    try {
      const command = process.platform === 'win32' 
        ? `dir "${searchDir}" /s /b | findstr /i "${kebabName}.ts"`
        : `find "${searchDir}" -name "*${kebabName}*.ts" -type f`;
      
      const files = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
        .trim().split('\n').filter(f => f && f !== '');
      
      files.forEach(file => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          if (isValidExport(content, name)) {
            possibilities.push(createFileEntry(name, file));
          }
        }
      });
    } catch (error) {
      // Fallar silenciosamente y continuar con el siguiente patrón
    }
  });

  return possibilities;
}

// Búsqueda por kebab-case
function searchByKebabCase(name, searchDir) {
  const possibilities = [];
  const kebabName = pascalToKebab(name);
  
  try {
    const command = process.platform === 'win32'
      ? `dir "${searchDir}" /s /b *.ts | findstr /i "${kebabName}"`
      : `find "${searchDir}" -name "*.ts" -type f | grep -i "${kebabName}"`;
    
    const files = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
      .trim().split('\n').filter(f => f);
    
    files.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        if (isValidExport(content, name)) {
          possibilities.push(createFileEntry(name, file));
        }
      }
    });
  } catch (error) {
    // Fallar silenciosamente
  }
  
  return possibilities;
}

// Búsqueda por contenido (más lenta pero más precisa)
function searchByContent(name, searchDir) {
  const possibilities = [];
  
  try {
    // Buscar en el contenido de los archivos
    const command = process.platform === 'win32'
      ? `findstr /s /m /c:"export.*${name}" "${searchDir}\\*.ts"`
      : `grep -r "export.*${name}" "${searchDir}" --include="*.ts" -l`;
    
    const files = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
      .trim().split('\n').filter(f => f);
    
    files.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        if (isValidExport(content, name)) {
          possibilities.push(createFileEntry(name, file));
        }
      }
    });
  } catch (error) {
    // Fallar silenciosamente
  }
  
  return possibilities;
}

// Búsqueda fuzzy para casos especiales
function searchByFuzzyMatch(name, searchDir) {
  const possibilities = [];
  
  // Casos especiales conocidos
  const specialCases = {
    'WorkflowService': ['workflow.service.ts', 'workflow-management.service.ts'],
    'TaskListComponent': ['task-list.component.ts', 'tasks-list.component.ts'],
    'HeaderBpmCoreComponent': ['header-bpm-core.component.ts', 'bpm-header.component.ts'],
    'WorkflowCollection': ['workflow.model.ts', 'workflow-collection.interface.ts']
  };

  if (specialCases[name]) {
    specialCases[name].forEach(fileName => {
      try {
        const command = process.platform === 'win32'
          ? `dir "${searchDir}" /s /b | findstr /i "${fileName}"`
          : `find "${searchDir}" -name "*${fileName}*" -type f`;
        
        const files = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
          .trim().split('\n').filter(f => f);
        
        files.forEach(file => {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            if (isValidExport(content, name)) {
              possibilities.push(createFileEntry(name, file));
            }
          }
        });
      } catch (error) {
        // Fallar silenciosamente
      }
    });
  }
  
  return possibilities;
}

// Verificar si es una exportación válida
function isValidExport(content, name) {
  const exportPatterns = [
    `export class ${name}`,
    `export interface ${name}`,
    `export { ${name}`,
    `export const ${name}`,
    `export enum ${name}`,
    `export type ${name}`,
    `export default class ${name}`,
    `export abstract class ${name}`
  ];
  
  return exportPatterns.some(pattern => content.includes(pattern));
}

// Convertir PascalCase a kebab-case
function pascalToKebab(str) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

// Crear entrada de archivo
function createFileEntry(name, file) {
  const relativePath = path.relative('src/app/shared', file).replace(/\\/g, '/');
  const correctPath = relativePath.startsWith('../') ? relativePath : `../../${relativePath}`;
  
  return {
    name,
    path: correctPath.replace('.ts', ''),
    file
  };
}

// Generar exports para cada categoría
function generateExports(missingImports) {
  const results = {
    services: [],
    components: [],
    interfaces: []
  };

  console.log('🔍 Buscando archivos para imports faltantes...');

  // Procesar servicios
  missingImports.services.forEach(serviceName => {
    const matches = findMatchingFiles(serviceName, 'src/app/apps/services');
    if (matches.length > 0) {
      const match = matches[0]; // Tomar el primer match
      results.services.push(`export { ${serviceName} } from '${match.path.replace('.ts', '')}';`);
      console.log(`✅ Servicio encontrado: ${serviceName} -> ${match.path}`);
    } else {
      console.log(`❌ Servicio NO encontrado: ${serviceName}`);
    }
  });

  // Procesar componentes y pipes
  [...missingImports.components, ...missingImports.pipes].forEach(componentName => {
    const matches = findMatchingFiles(componentName, 'src/app/apps/components');
    if (matches.length > 0) {
      const match = matches[0];
      results.components.push(`export { ${componentName} } from '${match.path.replace('.ts', '')}';`);
      console.log(`✅ Componente encontrado: ${componentName} -> ${match.path}`);
    } else {
      console.log(`❌ Componente NO encontrado: ${componentName}`);
    }
  });

  // Procesar interfaces
  missingImports.interfaces.forEach(interfaceName => {
    const matches = findMatchingFiles(interfaceName, 'src/app/apps/interfaces');
    if (matches.length > 0) {
      const match = matches[0];
      results.interfaces.push(`export * from '${match.path.replace('.ts', '')}';`);
      console.log(`✅ Interface encontrada: ${interfaceName} -> ${match.path}`);
    } else {
      console.log(`❌ Interface NO encontrada: ${interfaceName}`);
    }
  });

  return results;
}

// Actualizar archivos de barrel exports (mejorado)
function updateBarrelExports(exports) {
  const files = {
    services: 'src/app/shared/services/index.ts',
    components: 'src/app/shared/components/index.ts',
    interfaces: 'src/app/shared/interfaces/index.ts'
  };

  Object.keys(exports).forEach(type => {
    if (exports[type].length > 0) {
      const filePath = files[type];
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Filtrar exports que ya existen
      const newExports = exports[type].filter(exportLine => {
        const exportName = extractExportName(exportLine);
        return !content.includes(exportName) && !isDuplicateExport(content, exportLine);
      });
      
      if (newExports.length > 0) {
        // Limpiar sección auto-generated anterior si existe
        content = removeOldAutoGenerated(content);
        
        // Agregar nuevos exports al final del archivo
        const exportsSection = newExports.join('\n');
        content += '\n\n// Auto-generated exports - V2\n' + exportsSection + '\n';
        
        fs.writeFileSync(filePath, content);
        console.log(`📝 Actualizado ${filePath} con ${newExports.length} nuevos exports (${exports[type].length - newExports.length} ya existían)`);
      } else {
        console.log(`ℹ️  ${filePath}: Todos los exports ya existen`);
      }
    }
  });
}

// Extraer nombre del export de una línea
function extractExportName(exportLine) {
  const match = exportLine.match(/export\s+(?:\{([^}]+)\}|(?:class|interface|const|enum|type)\s+(\w+))/);
  return match ? (match[1] || match[2]).trim() : '';
}

// Verificar si es un export duplicado
function isDuplicateExport(content, exportLine) {
  const exportName = extractExportName(exportLine);
  if (!exportName) return false;
  
  // Buscar patrones similares ya existentes
  const patterns = [
    `export { ${exportName} }`,
    `export class ${exportName}`,
    `export interface ${exportName}`,
    `export const ${exportName}`,
    `export enum ${exportName}`,
    `export type ${exportName}`
  ];
  
  return patterns.some(pattern => content.includes(pattern));
}

// Remover sección auto-generated anterior
function removeOldAutoGenerated(content) {
  // Remover secciones auto-generated anteriores
  const patterns = [
    /\/\/ Auto-generated exports[\s\S]*?(?=\n\/\/|\n$|$)/g,
    /\/\/ Auto-generated exports - V2[\s\S]*?(?=\n\/\/|\n$|$)/g
  ];
  
  patterns.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  return content.trim();
}

// Función para limpiar exportaciones duplicadas
function cleanupDuplicateExports() {
  const files = [
    'src/app/shared/services/index.ts',
    'src/app/shared/components/index.ts',
    'src/app/shared/interfaces/index.ts'
  ];

  files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalLength = content.length;
      
      // Remover secciones auto-generated duplicadas
      content = removeOldAutoGenerated(content);
      
      // Remover exportaciones duplicadas del user.model
      content = content.replace(/export \* from '\.\.\/\.\.\/apps\/interfaces\/user-details\/user\.model';\s*\n/g, '');
      
      if (content.length !== originalLength) {
        fs.writeFileSync(filePath, content + '\n');
        console.log(`🧹 Limpiado ${filePath}`);
      }
    }
  });
}

// Función principal
function main() {
  console.log('🔧 Iniciando auto-fix de barrel exports...\n');
  
  // Paso 0: Limpiar exportaciones duplicadas existentes
  console.log('🧹 Limpiando exportaciones duplicadas...');
  cleanupDuplicateExports();
  
  // Paso 1: Obtener errores de build
  const buildOutput = getBuildErrors();
  if (!buildOutput) {
    console.log('✅ ¡No hay errores de compilación!');
    return;
  }

  // Paso 2: Extraer imports faltantes
  const missingImports = extractMissingImports(buildOutput);
  
  console.log('\n📋 Resumen de imports faltantes:');
  console.log(`   Servicios: ${missingImports.services.size}`);
  console.log(`   Componentes: ${missingImports.components.size}`);
  console.log(`   Interfaces: ${missingImports.interfaces.size}`);
  console.log(`   Pipes: ${missingImports.pipes.size}\n`);

  if (missingImports.services.size === 0 && 
      missingImports.components.size === 0 && 
      missingImports.interfaces.size === 0 &&
      missingImports.pipes.size === 0) {
    console.log('ℹ️  No se encontraron imports faltantes para @shared/*');
    return;
  }

  // Paso 3: Buscar archivos y generar exports
  const exports = generateExports(missingImports);
  
  // Paso 4: Actualizar archivos barrel
  updateBarrelExports(exports);
  
  console.log('\n🎉 Auto-fix completado! Ejecuta "pnpm build" para verificar los resultados.');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { main, extractMissingImports, findMatchingFiles };