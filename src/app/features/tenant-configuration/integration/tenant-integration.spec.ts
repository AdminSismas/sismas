import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TenantConfigService } from '../services/tenant-config.service';
import { TenantType } from '../models/tenant-config.interface';

@Component({
  template: '<div>Test Component</div>'
})
class TestComponent {}

describe('Tenant Integration Tests', () => {
  let tenantService: TenantConfigService;
  let location: Location;
  let router: Router;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      providers: [TenantConfigService]
    }).compileComponents();

    tenantService = TestBed.inject(TenantConfigService);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TestComponent);
  });

  describe('Escenarios de Detección de Tenant', () => {
    it('Escenario 1: Usuario accede a manizales.geogestion.com', () => {
      // Simular hostname de Manizales
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'manizales.geogestion.com',
          search: ''
        },
        writable: true
      });

      tenantService.initializeTenant();

      expect(tenantService.getCurrentTenantId()).toBe('manizales');
      
      const config = tenantService.getCurrentTenantConfig();
      expect(config.municipalityName).toBe('Manizales');
      expect(config.apiConfig.baseUrl).toContain('manizales');
      expect(config.theme.primaryColor).toBe('#2E7D32');
    });

    it('Escenario 2: Usuario accede con parámetro ?tenant=armenia', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'localhost',
          search: '?tenant=armenia&debug=true'
        },
        writable: true
      });

      tenantService.initializeTenant();

      expect(tenantService.getCurrentTenantId()).toBe('armenia');
      
      const config = tenantService.getCurrentTenantConfig();
      expect(config.municipalityName).toBe('Armenia');
      expect(config.apiConfig.baseUrl).toContain('armenia');
    });

    it('Escenario 3: Usuario con localStorage configurado', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'localhost',
          search: ''
        },
        writable: true
      });

      // Simular localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn().mockReturnValue('barrancabermeja'),
          setItem: jest.fn()
        },
        writable: true
      });

      tenantService.initializeTenant();

      expect(tenantService.getCurrentTenantId()).toBe('barrancabermeja');
    });

    it('Escenario 4: Prioridad URL sobre hostname', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'manizales.geogestion.com',
          search: '?tenant=armenia'
        },
        writable: true
      });

      tenantService.initializeTenant();

      // URL debe tener prioridad sobre hostname
      expect(tenantService.getCurrentTenantId()).toBe('armenia');
    });
  });

  describe('Escenarios de Switching de Tenant', () => {
    it('Escenario 5: Cambio dinámico de tenant en runtime', (done) => {
      tenantService.setCurrentTenant('armenia');

      tenantService.tenantChanged$.subscribe(newTenant => {
        expect(newTenant).toBe('manizales');
        
        const config = tenantService.getCurrentTenantConfig();
        expect(config.tenantId).toBe('manizales');
        expect(config.municipalityName).toBe('Manizales');
        
        done();
      });

      tenantService.switchTenant('manizales');
    });

    it('Escenario 6: Configuración persiste entre recargas', () => {
      const mockLocalStorage = {
        getItem: jest.fn(),
        setItem: jest.fn()
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true
      });

      tenantService.switchTenant('calarca');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('selectedTenant', 'calarca');
    });
  });

  describe('Escenarios de API Configuration', () => {
    it('Escenario 7: URLs de API se configuran correctamente por tenant', () => {
      const testCases: Array<{ tenant: TenantType; expectedUrl: string }> = [
        { tenant: 'armenia', expectedUrl: 'https://armenia-api.geogestion.com' },
        { tenant: 'manizales', expectedUrl: 'https://manizales-api.geogestion.com' },
        { tenant: 'barrancabermeja', expectedUrl: 'https://barrancabermeja-api.geogestion.com' }
      ];

      testCases.forEach(({ tenant, expectedUrl }) => {
        tenantService.setCurrentTenant(tenant);
        const config = tenantService.getCurrentTenantConfig();
        
        expect(config.apiConfig.baseUrl).toBe(expectedUrl);
      });
    });

    it('Escenario 8: Features específicas por tenant', () => {
      // Manizales tiene GIS avanzado
      tenantService.setCurrentTenant('manizales');
      let config = tenantService.getCurrentTenantConfig();
      expect(config.features.gisIntegration).toBe(true);
      expect(config.features.advancedReports).toBe(true);

      // Armenia tiene configuración básica
      tenantService.setCurrentTenant('armenia');
      config = tenantService.getCurrentTenantConfig();
      expect(config.features.basicWorkflow).toBe(true);
    });
  });

  describe('Escenarios de Error Handling', () => {
    it('Escenario 9: Tenant inválido usa fallback', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'localhost',
          search: '?tenant=invalid-tenant'
        },
        writable: true
      });

      tenantService.initializeTenant();

      // Debe usar tenant por defecto
      expect(tenantService.getCurrentTenantId()).toBe('armenia');
    });

    it('Escenario 10: Sin configuración usa fallback', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'unknown.domain.com',
          search: ''
        },
        writable: true
      });

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn().mockReturnValue(null),
          setItem: jest.fn()
        },
        writable: true
      });

      tenantService.initializeTenant();

      expect(tenantService.getCurrentTenantId()).toBe('armenia'); // default
    });
  });
});