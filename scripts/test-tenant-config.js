/**
 * Script para testing manual de configuración multi-tenant
 * Uso: node scripts/test-tenant-config.js
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');

const TENANTS = [
  'armenia', 'manizales', 'barrancabermeja', 'calarca', 
  'filandia', 'masora', 'montenegro', 'quimbaya'
];

const TEST_SCENARIOS = [
  {
    name: 'Test con parámetro URL',
    url: 'http://localhost:4200?tenant=',
    description: 'Verifica detección por parámetro URL'
  },
  {
    name: 'Test con hostname simulado',
    url: 'http://localhost:4200',
    description: 'Verifica detección por hostname (requiere mock)'
  },
  {
    name: 'Test con localStorage',
    url: 'http://localhost:4200',
    description: 'Verifica detección por localStorage'
  }
];

class TenantTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
  }

  async init() {
    console.log(chalk.blue('🚀 Iniciando testing de configuración multi-tenant...\\n'));
    
    this.browser = await puppeteer.launch({ 
      headless: false, 
      defaultViewport: null 
    });
    this.page = await this.browser.newPage();
    
    // Configurar console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(chalk.red(`❌ Console Error: ${msg.text()}`));
      }
    });
  }

  async testUrlParameter() {
    console.log(chalk.yellow('📋 Testing detección por parámetro URL...'));
    
    for (const tenant of TENANTS) {
      try {
        const url = `http://localhost:4200?tenant=${tenant}`;
        await this.page.goto(url, { waitUntil: 'networkidle0' });
        
        // Esperar a que la aplicación cargue
        await this.page.waitForTimeout(2000);
        
        // Verificar que el tenant se detectó correctamente
        const detectedTenant = await this.page.evaluate(() => {
          // Acceder al servicio Angular (requiere que esté disponible en window)
          return window.angular?.tenantId || null;
        });
        
        const success = detectedTenant === tenant;
        this.logResult('URL Parameter', tenant, success, detectedTenant);
        
      } catch (error) {
        this.logResult('URL Parameter', tenant, false, `Error: ${error.message}`);
      }
    }
  }

  async testLocalStorage() {
    console.log(chalk.yellow('💾 Testing detección por localStorage...'));
    
    for (const tenant of TENANTS) {
      try {
        // Limpiar URL de parámetros
        await this.page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
        
        // Configurar localStorage
        await this.page.evaluate((tenant) => {
          localStorage.setItem('selectedTenant', tenant);
        }, tenant);
        
        // Recargar página
        await this.page.reload({ waitUntil: 'networkidle0' });
        await this.page.waitForTimeout(2000);
        
        const detectedTenant = await this.page.evaluate(() => {
          return window.angular?.tenantId || null;
        });
        
        const success = detectedTenant === tenant;
        this.logResult('LocalStorage', tenant, success, detectedTenant);
        
      } catch (error) {
        this.logResult('LocalStorage', tenant, false, `Error: ${error.message}`);
      }
    }
  }

  async testTenantSwitching() {
    console.log(chalk.yellow('🔄 Testing switching dinámico de tenants...'));
    
    try {
      await this.page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
      
      // Verificar que el componente tenant-switcher está disponible
      const hasSwitcher = await this.page.$('vex-tenant-switcher');
      
      if (!hasSwitcher) {
        console.log(chalk.orange('⚠️  Tenant switcher component no encontrado. Agregue <vex-tenant-switcher></vex-tenant-switcher> a su template para testing.'));
        return;
      }
      
      for (const tenant of TENANTS.slice(0, 3)) { // Test solo los primeros 3
        // Seleccionar tenant en el switcher
        await this.page.select('mat-select', tenant);
        await this.page.waitForTimeout(1000);
        
        // Verificar que cambió
        const currentTenant = await this.page.evaluate(() => {
          return window.angular?.tenantId || null;
        });
        
        const success = currentTenant === tenant;
        this.logResult('Dynamic Switch', tenant, success, currentTenant);
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ Error en testing de switching: ${error.message}`));
    }
  }

  async testApiConfiguration() {
    console.log(chalk.yellow('🌐 Testing configuración de API por tenant...'));
    
    for (const tenant of TENANTS.slice(0, 4)) { // Test primeros 4
      try {
        const url = `http://localhost:4200?tenant=${tenant}`;
        await this.page.goto(url, { waitUntil: 'networkidle0' });
        
        const apiConfig = await this.page.evaluate(() => {
          return window.angular?.apiConfig || null;
        });
        
        const expectedUrl = `https://${tenant}-api.geogestion.com`;
        const success = apiConfig?.baseUrl === expectedUrl;
        
        this.logResult('API Config', tenant, success, apiConfig?.baseUrl || 'No detectado');
        
      } catch (error) {
        this.logResult('API Config', tenant, false, `Error: ${error.message}`);
      }
    }
  }

  logResult(testType, tenant, success, actual) {
    const icon = success ? '✅' : '❌';
    const color = success ? chalk.green : chalk.red;
    
    console.log(`${icon} ${testType} - ${tenant}: ${color(actual)}`);
    
    this.results.push({
      testType,
      tenant,
      success,
      actual
    });
  }

  async generateReport() {
    console.log(chalk.blue('\\n📊 Resumen de Testing:\\n'));
    
    const summary = this.results.reduce((acc, result) => {
      const key = result.testType;
      if (!acc[key]) acc[key] = { total: 0, passed: 0 };
      acc[key].total++;
      if (result.success) acc[key].passed++;
      return acc;
    }, {});
    
    Object.entries(summary).forEach(([testType, stats]) => {
      const percentage = ((stats.passed / stats.total) * 100).toFixed(1);
      const color = percentage >= 80 ? chalk.green : percentage >= 60 ? chalk.yellow : chalk.red;
      
      console.log(`${testType}: ${color(`${stats.passed}/${stats.total} (${percentage}%)`)}`);
    });
    
    console.log(chalk.blue('\\n🔧 Recomendaciones:'));
    
    if (summary['URL Parameter']?.passed < summary['URL Parameter']?.total) {
      console.log('- Verificar TenantConfigService.detectTenantFromUrl()');
    }
    
    if (summary['LocalStorage']?.passed < summary['LocalStorage']?.total) {
      console.log('- Verificar TenantConfigService.detectTenantFromStorage()');
    }
    
    if (summary['API Config']?.passed < summary['API Config']?.total) {
      console.log('- Verificar TenantConfigFactory.createConfig()');
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runAllTests() {
    try {
      await this.init();
      
      await this.testUrlParameter();
      console.log('\\n');
      
      await this.testLocalStorage();
      console.log('\\n');
      
      await this.testTenantSwitching();
      console.log('\\n');
      
      await this.testApiConfiguration();
      
      await this.generateReport();
      
    } catch (error) {
      console.error(chalk.red(`❌ Error durante testing: ${error.message}`));
    } finally {
      await this.cleanup();
    }
  }
}

// Ejecutar tests si el script se ejecuta directamente
if (require.main === module) {
  const tester = new TenantTester();
  tester.runAllTests().then(() => {
    console.log(chalk.blue('\\n✨ Testing completado!'));
    process.exit(0);
  }).catch(error => {
    console.error(chalk.red(`❌ Error fatal: ${error.message}`));
    process.exit(1);
  });
}

module.exports = TenantTester;