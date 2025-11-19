/**
 * Script de análisis de performance del sistema refactorizado
 * Uso: node scripts/analyze-performance.js
 */

const fs = require('fs');
const path = require('path');

// Simple color functions
const chalk = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`
};

class PerformanceAnalyzer {
  constructor() {
    this.results = {
      bundleAnalysis: {},
      importAnalysis: {},
      dependencyAnalysis: {},
      lazyLoadingAnalysis: {},
      recommendations: []
    };
    this.srcPath = path.join(__dirname, '..', 'src');
  }

  async analyze() {
    console.log(chalk.blue('🔍 Iniciando análisis de performance del sistema refactorizado...\n'));
    
    await this.analyzeBundleStructure();
    await this.analyzeImportPatterns();
    await this.analyzeDependencies();
    await this.analyzeLazyLoading();
    await this.generateRecommendations();
    
    this.generateReport();
  }

  async analyzeBundleStructure() {
    console.log(chalk.yellow('📦 Analizando estructura de bundles...'));
    
    const features = this.getDirectoryStructure(path.join(this.srcPath, 'app', 'features'));
    const shared = this.getDirectoryStructure(path.join(this.srcPath, 'app', 'shared'));
    const core = this.getDirectoryStructure(path.join(this.srcPath, 'app', 'core'));
    
    this.results.bundleAnalysis = {
      features: {
        count: features.length,
        structure: features,
        avgSize: this.calculateAverageSize(features)
      },
      shared: {
        count: shared.length,
        structure: shared,
        avgSize: this.calculateAverageSize(shared)
      },
      core: {
        count: core.length,
        structure: core,
        avgSize: this.calculateAverageSize(core)
      }
    };
    
    console.log(`✅ Features encontradas: ${features.length}`);
    console.log(`✅ Componentes shared: ${shared.length}`);
    console.log(`✅ Servicios core: ${core.length}`);
  }

  async analyzeImportPatterns() {
    console.log(chalk.yellow('🔗 Analizando patrones de importación...'));
    
    const tsFiles = this.findTypeScriptFiles(this.srcPath);
    let relativeImports = 0;
    let barrelImports = 0;
    let externalImports = 0;
    let circularDependencies = [];
    
    for (const filePath of tsFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const imports = this.extractImports(content);
        
        imports.forEach(importPath => {
          if (importPath.startsWith('./') || importPath.startsWith('../')) {
            relativeImports++;
          } else if (importPath.startsWith('@features') || importPath.startsWith('@shared') || importPath.startsWith('@core')) {
            barrelImports++;
          } else if (!importPath.startsWith('@angular') && !importPath.startsWith('rxjs') && !importPath.startsWith('@material')) {
            externalImports++;
          }
        });
      } catch (error) {
        // Ignorar errores de lectura
      }
    }
    
    this.results.importAnalysis = {
      totalFiles: tsFiles.length,
      relativeImports,
      barrelImports,
      externalImports,
      relativeImportPercentage: ((relativeImports / (relativeImports + barrelImports)) * 100).toFixed(2),
      circularDependencies
    };
    
    console.log(`✅ Archivos TypeScript analizados: ${tsFiles.length}`);
    console.log(`✅ Imports relativos: ${relativeImports}`);
    console.log(`✅ Barrel imports: ${barrelImports}`);
  }

  async analyzeDependencies() {
    console.log(chalk.yellow('📋 Analizando dependencias...'));
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
      
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      
      // Analizar dependencias Angular
      const angularDeps = dependencies.filter(dep => dep.startsWith('@angular'));
      const materialDeps = dependencies.filter(dep => dep.includes('material'));
      const rxjsDeps = dependencies.filter(dep => dep.includes('rxjs'));
      
      this.results.dependencyAnalysis = {
        total: dependencies.length + devDependencies.length,
        production: dependencies.length,
        development: devDependencies.length,
        angular: angularDeps.length,
        material: materialDeps.length,
        rxjs: rxjsDeps.length,
        unusedDependencies: this.findUnusedDependencies(dependencies)
      };
      
      console.log(`✅ Dependencias de producción: ${dependencies.length}`);
      console.log(`✅ Dependencias de desarrollo: ${devDependencies.length}`);
      console.log(`✅ Dependencias Angular: ${angularDeps.length}`);
      
    } catch (error) {
      console.log(`❌ Error analizando package.json: ${error.message}`);
    }
  }

  async analyzeLazyLoading() {
    console.log(chalk.yellow('⚡ Analizando lazy loading...'));
    
    const routingFiles = this.findRoutingFiles(this.srcPath);
    let lazyRoutes = 0;
    let eagerRoutes = 0;
    let dynamicImports = 0;
    
    for (const filePath of routingFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Buscar lazy routes
        const lazyMatches = content.match(/loadChildren:\s*\(\)\s*=>\s*import\(/g);
        if (lazyMatches) {
          lazyRoutes += lazyMatches.length;
        }
        
        // Buscar dynamic imports
        const dynamicMatches = content.match(/import\(/g);
        if (dynamicMatches) {
          dynamicImports += dynamicMatches.length;
        }
        
        // Buscar eager routes
        const componentMatches = content.match(/component:\s*\w+Component/g);
        if (componentMatches) {
          eagerRoutes += componentMatches.length;
        }
        
      } catch (error) {
        // Ignorar errores de lectura
      }
    }
    
    this.results.lazyLoadingAnalysis = {
      routingFiles: routingFiles.length,
      lazyRoutes,
      eagerRoutes,
      dynamicImports,
      lazyLoadingPercentage: ((lazyRoutes / (lazyRoutes + eagerRoutes)) * 100).toFixed(2)
    };
    
    console.log(`✅ Archivos de routing: ${routingFiles.length}`);
    console.log(`✅ Rutas lazy: ${lazyRoutes}`);
    console.log(`✅ Rutas eager: ${eagerRoutes}`);
    console.log(`✅ Porcentaje lazy loading: ${this.results.lazyLoadingAnalysis.lazyLoadingPercentage}%`);
  }

  async generateRecommendations() {
    console.log(chalk.yellow('💡 Generando recomendaciones...'));
    
    const recommendations = [];
    
    // Análisis de imports
    if (this.results.importAnalysis.relativeImportPercentage > 10) {
      recommendations.push({
        category: 'Imports',
        priority: 'HIGH',
        issue: `${this.results.importAnalysis.relativeImportPercentage}% de imports son relativos`,
        solution: 'Convertir imports relativos a barrel exports',
        impact: 'Mejora mantenibilidad y tree shaking'
      });
    }
    
    // Análisis de lazy loading
    if (parseFloat(this.results.lazyLoadingAnalysis.lazyLoadingPercentage) < 70) {
      recommendations.push({
        category: 'Lazy Loading',
        priority: 'MEDIUM',
        issue: `Solo ${this.results.lazyLoadingAnalysis.lazyLoadingPercentage}% de rutas son lazy`,
        solution: 'Convertir más rutas a lazy loading',
        impact: 'Reduce bundle inicial y mejora tiempo de carga'
      });
    }
    
    // Análisis de dependencias
    if (this.results.dependencyAnalysis.unusedDependencies.length > 0) {
      recommendations.push({
        category: 'Dependencies',
        priority: 'MEDIUM',
        issue: `${this.results.dependencyAnalysis.unusedDependencies.length} dependencias no utilizadas`,
        solution: 'Remover dependencias no utilizadas',
        impact: 'Reduce bundle size'
      });
    }
    
    // Recomendaciones específicas del refactoring
    recommendations.push({
      category: 'Multi-Tenant',
      priority: 'LOW',
      issue: 'Implementar preload de configuraciones de tenant',
      solution: 'Crear service worker para cache de configuraciones',
      impact: 'Mejora UX en switching de tenants'
    });
    
    recommendations.push({
      category: 'Tree Shaking',
      priority: 'MEDIUM',
      issue: 'Optimizar tree shaking de barrel exports',
      solution: 'Verificar que todos los exports son utilizados',
      impact: 'Reduce bundle size final'
    });
    
    this.results.recommendations = recommendations;
    console.log(`✅ ${recommendations.length} recomendaciones generadas`);
  }

  // Métodos auxiliares
  getDirectoryStructure(dirPath) {
    if (!fs.existsSync(dirPath)) return [];
    
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ({
        name: dirent.name,
        path: path.join(dirPath, dirent.name),
        files: this.countFiles(path.join(dirPath, dirent.name))
      }));
  }

  countFiles(dirPath) {
    if (!fs.existsSync(dirPath)) return 0;
    
    let count = 0;
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isFile() && item.name.endsWith('.ts')) {
        count++;
      } else if (item.isDirectory()) {
        count += this.countFiles(path.join(dirPath, item.name));
      }
    }
    
    return count;
  }

  calculateAverageSize(directories) {
    if (directories.length === 0) return 0;
    const totalFiles = directories.reduce((sum, dir) => sum + dir.files, 0);
    return (totalFiles / directories.length).toFixed(1);
  }

  findTypeScriptFiles(dirPath) {
    const files = [];
    
    if (!fs.existsSync(dirPath)) return files;
    
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isFile() && (item.name.endsWith('.ts') && !item.name.endsWith('.spec.ts'))) {
        files.push(fullPath);
      } else if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        files.push(...this.findTypeScriptFiles(fullPath));
      }
    }
    
    return files;
  }

  findRoutingFiles(dirPath) {
    const files = [];
    
    if (!fs.existsSync(dirPath)) return files;
    
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isFile() && (item.name.includes('routing') || item.name.includes('routes'))) {
        files.push(fullPath);
      } else if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        files.push(...this.findRoutingFiles(fullPath));
      }
    }
    
    return files;
  }

  extractImports(content) {
    const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  findUnusedDependencies(dependencies) {
    // Implementación básica - en producción se usaría una herramienta más sofisticada
    const commonUnused = ['lodash', 'moment', 'jquery'];
    return dependencies.filter(dep => commonUnused.includes(dep));
  }

  generateReport() {
    console.log(chalk.blue('\n📊 REPORTE DE PERFORMANCE DEL SISTEMA REFACTORIZADO\n'));
    
    // Bundle Analysis
    console.log(chalk.green('📦 ANÁLISIS DE BUNDLES:'));
    console.log(`   Features: ${this.results.bundleAnalysis.features.count} (${this.results.bundleAnalysis.features.avgSize} archivos promedio)`);
    console.log(`   Shared: ${this.results.bundleAnalysis.shared.count} componentes`);
    console.log(`   Core: ${this.results.bundleAnalysis.core.count} servicios`);
    
    // Import Analysis
    console.log(chalk.green('\n🔗 ANÁLISIS DE IMPORTS:'));
    console.log(`   Total archivos: ${this.results.importAnalysis.totalFiles}`);
    console.log(`   Imports relativos: ${this.results.importAnalysis.relativeImports} (${this.results.importAnalysis.relativeImportPercentage}%)`);
    console.log(`   Barrel imports: ${this.results.importAnalysis.barrelImports}`);
    
    // Dependency Analysis
    console.log(chalk.green('\n📋 ANÁLISIS DE DEPENDENCIAS:'));
    console.log(`   Total: ${this.results.dependencyAnalysis.total}`);
    console.log(`   Producción: ${this.results.dependencyAnalysis.production}`);
    console.log(`   Desarrollo: ${this.results.dependencyAnalysis.development}`);
    console.log(`   Angular: ${this.results.dependencyAnalysis.angular}`);
    
    // Lazy Loading Analysis
    console.log(chalk.green('\n⚡ ANÁLISIS DE LAZY LOADING:'));
    console.log(`   Archivos de routing: ${this.results.lazyLoadingAnalysis.routingFiles}`);
    console.log(`   Rutas lazy: ${this.results.lazyLoadingAnalysis.lazyRoutes}`);
    console.log(`   Rutas eager: ${this.results.lazyLoadingAnalysis.eagerRoutes}`);
    console.log(`   Porcentaje lazy: ${this.results.lazyLoadingAnalysis.lazyLoadingPercentage}%`);
    
    // Recommendations
    console.log(chalk.green('\n💡 RECOMENDACIONES:'));
    this.results.recommendations.forEach((rec, index) => {
      const priorityColor = rec.priority === 'HIGH' ? chalk.red : rec.priority === 'MEDIUM' ? chalk.yellow : chalk.green;
      console.log(`   ${index + 1}. [${priorityColor(rec.priority)}] ${rec.category}: ${rec.issue}`);
      console.log(`      📋 Solución: ${rec.solution}`);
      console.log(`      🎯 Impacto: ${rec.impact}\n`);
    });
    
    // Summary
    const score = this.calculatePerformanceScore();
    const scoreColor = score >= 80 ? chalk.green : score >= 60 ? chalk.yellow : chalk.red;
    console.log(chalk.blue(`🏆 SCORE DE PERFORMANCE: ${scoreColor(score + '/100')}\n`));
    
    // Save detailed report
    this.saveDetailedReport();
  }

  calculatePerformanceScore() {
    let score = 100;
    
    // Penalizar imports relativos
    if (this.results.importAnalysis.relativeImportPercentage > 10) {
      score -= 20;
    } else if (this.results.importAnalysis.relativeImportPercentage > 5) {
      score -= 10;
    }
    
    // Penalizar bajo lazy loading
    const lazyPercentage = parseFloat(this.results.lazyLoadingAnalysis.lazyLoadingPercentage);
    if (lazyPercentage < 50) {
      score -= 30;
    } else if (lazyPercentage < 70) {
      score -= 15;
    }
    
    // Penalizar dependencias no utilizadas
    if (this.results.dependencyAnalysis.unusedDependencies.length > 5) {
      score -= 15;
    } else if (this.results.dependencyAnalysis.unusedDependencies.length > 0) {
      score -= 5;
    }
    
    return Math.max(0, score);
  }

  saveDetailedReport() {
    const reportPath = path.join(__dirname, '..', 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(chalk.blue(`📄 Reporte detallado guardado en: ${reportPath}`));
  }
}

// Ejecutar análisis si el script se ejecuta directamente
if (require.main === module) {
  const analyzer = new PerformanceAnalyzer();
  analyzer.analyze().then(() => {
    console.log(chalk.blue('\n✨ Análisis de performance completado!'));
    process.exit(0);
  }).catch(error => {
    console.error(chalk.red(`❌ Error durante análisis: ${error.message}`));
    process.exit(1);
  });
}

module.exports = PerformanceAnalyzer;