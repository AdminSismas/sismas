/**
 * Script para migrar imports relativos de constants a barrel exports
 * Este script mantiene la funcionalidad mientras migra a la nueva arquitectura
 */

const fs = require('fs');
const path = require('path');

// Patrones de imports relativos a migrar
const MIGRATION_PATTERNS = [
  {
    // imports de constants generales
    search: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/constants\/general\/constants['"];?/g,
    replace: "from '@shared/constants';"
  },
  {
    // imports de constantLabels
    search: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/constants\/general\/constantLabels['"];?/g,
    replace: "from '@shared/constants';"
  },
  {
    // imports de attachment constants
    search: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/constants\/general\/attachment\.constant['"];?/g,
    replace: "from '@shared/constants';"
  },
  {
    // imports de src/app/apps/constants
    search: /from\s+['"]src\/app\/apps\/constants\/general\/constants['"];?/g,
    replace: "from '@shared/constants';"
  },
  {
    // imports relativos de 3 niveles
    search: /from\s+['"]\.\.\/\.\.\/\.\.\/constants\/general\/constants['"];?/g,
    replace: "from '@shared/constants';"
  },
  {
    // imports relativos de 4 niveles
    search: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/constants\/general\/constantLabels['"];?/g,
    replace: "from '@shared/constants';"
  }
];

function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    for (const pattern of MIGRATION_PATTERNS) {
      if (pattern.search.test(content)) {
        content = content.replace(pattern.search, pattern.replace);
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Migrado: ${filePath}`);
      return 1;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error migrando ${filePath}:`, error.message);
    return 0;
  }
}

function getAllTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllTsFiles(fullPath, files);
    } else if (item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function migrateConstants() {
  console.log('🚀 Iniciando migración de imports de constants...\n');
  
  // Buscar todos los archivos TypeScript
  const srcDir = path.join(__dirname, '..', 'src', 'app');
  const files = getAllTsFiles(srcDir);
  
  let migratedCount = 0;
  
  for (const file of files) {
    migratedCount += migrateFile(file);
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`- Archivos procesados: ${files.length}`);
  console.log(`- Archivos migrados: ${migratedCount}`);
  console.log(`- Constants imports migrados a @shared/constants`);
}

// Ejecutar migración
migrateConstants();