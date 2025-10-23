/**
 * Script para corregir imports relativos y aplicar barrel exports
 * Uso: node scripts/fix-imports.js
 */

const fs = require('fs');
const path = require('path');

class ImportFixer {
  constructor() {
    this.srcPath = path.join(__dirname, '..', 'src');
    this.fixCount = 0;
    this.errorsCount = 0;
    
    // Mapeo de rutas para barrel exports
    this.barrelMappings = {
      // Features
      'src/app/features/bmp-workflows': '@features/bmp-workflows',
      'src/app/features/tenant-configuration': '@features/tenant-configuration',
      'src/app/features/tenant-specific': '@features/tenant-specific',
      
      // Shared
      'src/app/shared/ui': '@shared/ui',
      'src/app/shared/pipes': '@shared/pipes',
      'src/app/shared/models': '@shared/models',
      
      // Core
      'src/app/core/auth': '@core/auth',
      'src/app/core/guards': '@core/guards',
      'src/app/core/interceptors': '@core/interceptors',
      
      // Apps (legacy paths that need migration)
      'src/app/apps/services': '@shared/services',
      'src/app/apps/components': '@shared/components',
      'src/app/apps/interfaces': '@shared/interfaces'
    };
  }

  async fix() {
    console.log('🔧 Iniciando corrección de imports relativos...\n');
    
    // Primero crear los barrel exports necesarios
    await this.createBarrelExports();
    
    // Luego corregir los imports
    await this.fixImportsInFiles();
    
    // Configurar path mapping en tsconfig
    await this.updateTsConfig();
    
    this.generateReport();
  }

  async createBarrelExports() {
    console.log('📦 Creando barrel exports...');
    
    // Features barrel exports
    await this.createFeatureBarrels();
    
    // Shared barrel exports
    await this.createSharedBarrels();
    
    // Core barrel exports
    await this.createCoreBarrels();
    
    console.log('✅ Barrel exports creados');
  }

  async createFeatureBarrels() {
    // BMP Workflows feature
    const bmpWorkflowsPath = path.join(this.srcPath, 'app', 'features', 'bmp-workflows');
    if (fs.existsSync(bmpWorkflowsPath)) {
      const indexContent = `// BMP Workflows barrel exports
export * from './interfaces';
export * from './services';
export * from './models';
`;
      fs.writeFileSync(path.join(bmpWorkflowsPath, 'index.ts'), indexContent);
    }

    // Tenant Configuration feature
    const tenantConfigPath = path.join(this.srcPath, 'app', 'features', 'tenant-configuration');
    if (fs.existsSync(tenantConfigPath)) {
      const indexContent = `// Tenant Configuration barrel exports
export * from './models';
export * from './factories';
export * from './services';
`;
      fs.writeFileSync(path.join(tenantConfigPath, 'index.ts'), indexContent);
    }
  }

  async createSharedBarrels() {
    // Shared UI
    const sharedUIPath = path.join(this.srcPath, 'app', 'shared', 'ui');
    if (fs.existsSync(sharedUIPath)) {
      const componentsPath = path.join(sharedUIPath, 'components');
      if (fs.existsSync(componentsPath)) {
        const components = fs.readdirSync(componentsPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
        
        const indexContent = `// Shared UI barrel exports
${components.map(comp => `export * from './components/${comp}';`).join('\n')}
`;
        fs.writeFileSync(path.join(sharedUIPath, 'index.ts'), indexContent);
      }
    }

    // Shared pipes
    const sharedPipesPath = path.join(this.srcPath, 'app', 'shared', 'pipes');
    if (fs.existsSync(sharedPipesPath)) {
      const indexContent = `// Shared pipes barrel exports
export * from './index';
`;
      fs.writeFileSync(path.join(sharedPipesPath, 'index.ts'), indexContent);
    }

    // Shared models
    const sharedModelsPath = path.join(this.srcPath, 'app', 'shared', 'models');
    if (fs.existsSync(sharedModelsPath)) {
      const models = fs.readdirSync(sharedModelsPath)
        .filter(file => file.endsWith('.ts') && file !== 'index.ts')
        .map(file => file.replace('.ts', ''));
      
      const indexContent = `// Shared models barrel exports
${models.map(model => `export * from './${model}';`).join('\n')}
`;
      fs.writeFileSync(path.join(sharedModelsPath, 'index.ts'), indexContent);
    }
  }

  async createCoreBarrels() {
    // Core auth
    const coreAuthPath = path.join(this.srcPath, 'app', 'core', 'auth');
    if (fs.existsSync(coreAuthPath)) {
      const services = fs.readdirSync(coreAuthPath)
        .filter(file => file.endsWith('.service.ts'))
        .map(file => file.replace('.ts', ''));
      
      const indexContent = `// Core auth barrel exports
${services.map(service => `export * from './${service}';`).join('\n')}
`;
      fs.writeFileSync(path.join(coreAuthPath, 'index.ts'), indexContent);
    }

    // Core guards
    const coreGuardsPath = path.join(this.srcPath, 'app', 'core', 'guards');
    if (fs.existsSync(coreGuardsPath)) {
      const guards = fs.readdirSync(coreGuardsPath)
        .filter(file => file.endsWith('.guard.ts'))
        .map(file => file.replace('.ts', ''));
      
      const indexContent = `// Core guards barrel exports
${guards.map(guard => `export * from './${guard}';`).join('\n')}
`;
      fs.writeFileSync(path.join(coreGuardsPath, 'index.ts'), indexContent);
    }

    // Core interceptors
    const coreInterceptorsPath = path.join(this.srcPath, 'app', 'core', 'interceptors');
    if (fs.existsSync(coreInterceptorsPath)) {
      const interceptors = fs.readdirSync(coreInterceptorsPath)
        .filter(file => file.endsWith('.interceptor.ts'))
        .map(file => file.replace('.ts', ''));
      
      const indexContent = `// Core interceptors barrel exports
${interceptors.map(interceptor => `export * from './${interceptor}';`).join('\n')}
`;
      fs.writeFileSync(path.join(coreInterceptorsPath, 'index.ts'), indexContent);
    }
  }

  async fixImportsInFiles() {
    console.log('🔗 Corrigiendo imports en archivos...');
    
    const tsFiles = this.findTypeScriptFiles(this.srcPath);
    
    for (const filePath of tsFiles) {
      try {
        await this.fixFileImports(filePath);
      } catch (error) {
        console.log(`❌ Error procesando ${filePath}: ${error.message}`);
        this.errorsCount++;
      }
    }
  }

  async fixFileImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;

    // Buscar imports relativos
    const importRegex = /import\s+({[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"`]([^'"`]+)['"`];?/g;
    
    newContent = newContent.replace(importRegex, (match, importPart, importPath) => {
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const resolvedPath = this.resolveRelativePath(filePath, importPath);
        const barrelPath = this.findBarrelPath(resolvedPath);
        
        if (barrelPath) {
          hasChanges = true;
          this.fixCount++;
          return `import ${importPart} from '${barrelPath}';`;
        }
      }
      return match;
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, newContent);
    }
  }

  resolveRelativePath(currentFile, relativePath) {
    const currentDir = path.dirname(currentFile);
    const resolvedPath = path.resolve(currentDir, relativePath);
    return resolvedPath.replace(/\\/g, '/'); // Normalize path separators
  }

  findBarrelPath(resolvedPath) {
    // Convertir path absoluto a relativo desde src
    const srcIndex = resolvedPath.indexOf('src/');
    if (srcIndex === -1) return null;
    
    const relativePath = resolvedPath.substring(srcIndex);
    
    // Buscar en mappings
    for (const [pathPattern, barrelPath] of Object.entries(this.barrelMappings)) {
      if (relativePath.startsWith(pathPattern)) {
        return barrelPath;
      }
    }

    return null;
  }

  async updateTsConfig() {
    console.log('⚙️ Actualizando tsconfig.json...');
    
    const tsConfigPath = path.join(__dirname, '..', 'tsconfig.json');
    
    try {
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
      
      // Agregar path mappings si no existen
      if (!tsConfig.compilerOptions.paths) {
        tsConfig.compilerOptions.paths = {};
      }

      // Agregar mappings para barrel exports
      tsConfig.compilerOptions.paths = {
        ...tsConfig.compilerOptions.paths,
        '@features/*': ['src/app/features/*'],
        '@shared/*': ['src/app/shared/*'],
        '@core/*': ['src/app/core/*'],
        '@components/*': ['src/app/shared/ui/components/*'],
        '@services/*': ['src/app/shared/services/*'],
        '@models/*': ['src/app/shared/models/*'],
        '@pipes/*': ['src/app/shared/pipes/*']
      };

      fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      console.log('✅ tsconfig.json actualizado');
      
    } catch (error) {
      console.log(`❌ Error actualizando tsconfig.json: ${error.message}`);
      this.errorsCount++;
    }
  }

  findTypeScriptFiles(dirPath) {
    const files = [];
    
    if (!fs.existsSync(dirPath)) return files;
    
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isFile() && item.name.endsWith('.ts') && !item.name.endsWith('.spec.ts')) {
        files.push(fullPath);
      } else if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        files.push(...this.findTypeScriptFiles(fullPath));
      }
    }
    
    return files;
  }

  generateReport() {
    console.log('\n📊 REPORTE DE CORRECCIÓN DE IMPORTS\n');
    console.log(`✅ Imports corregidos: ${this.fixCount}`);
    console.log(`❌ Errores encontrados: ${this.errorsCount}`);
    
    if (this.errorsCount === 0) {
      console.log('\n🎉 Todos los imports fueron corregidos exitosamente!');
      console.log('🔧 Recuerda ejecutar "pnpm start" para verificar que no hay errores de compilación.');
    } else {
      console.log('\n⚠️ Se encontraron algunos errores. Revisa los archivos manualmente.');
    }
    
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ejecutar "pnpm start" para verificar compilación');
    console.log('2. Ejecutar tests para verificar funcionalidad');
    console.log('3. Ejecutar análisis de performance nuevamente');
  }
}

// Ejecutar si el script se ejecuta directamente
if (require.main === module) {
  const fixer = new ImportFixer();
  fixer.fix().then(() => {
    console.log('\n✨ Corrección de imports completada!');
    process.exit(0);
  }).catch(error => {
    console.error(`❌ Error durante corrección: ${error.message}`);
    process.exit(1);
  });
}

module.exports = ImportFixer;