import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { 
  TenantConfig, 
  TenantType, 
  TenantDetectionResult,
  TenantFeatures 
} from '@features/tenant-configuration';
import { TenantConfigFactory } from '@features/tenant-configuration';

@Injectable({
  providedIn: 'root'
})
export class TenantConfigService {
  private currentTenantSubject = new BehaviorSubject<TenantConfig | null>(null);
  private detectedTenant: TenantType | null = null;

  currentTenant$ = this.currentTenantSubject.asObservable();

  constructor(private configFactory: TenantConfigFactory) {
    this.initializeTenant();
  }

  /**
   * Initialize tenant configuration based on current environment
   */
  private async initializeTenant(): Promise<void> {
    try {
      const detection = this.detectTenant();
      const config = this.configFactory.createConfig(detection.tenantId);
      
      this.detectedTenant = detection.tenantId;
      this.currentTenantSubject.next(config);
      
      console.log(`Tenant initialized: ${detection.tenantId}`, {
        municipality: config.municipalityName,
        source: detection.configSource,
        isProduction: detection.isProduction
      });
    } catch (error) {
      console.error('Error initializing tenant:', error);
      // Fallback to test configuration
      this.setTenant('test');
    }
  }

  /**
   * Detect current tenant from various sources
   */
  private detectTenant(): TenantDetectionResult {
    // Priority 1: URL hostname detection
    const hostnameDetection = this.detectFromHostname();
    if (hostnameDetection) {
      return {
        tenantId: hostnameDetection,
        isProduction: this.isProductionEnvironment(),
        configSource: 'runtime'
      };
    }

    // Priority 2: Environment variable
    const envDetection = this.detectFromEnvironment();
    if (envDetection) {
      return {
        tenantId: envDetection,
        isProduction: this.isProductionEnvironment(),
        configSource: 'environment'
      };
    }

    // Priority 3: Local storage
    const storageDetection = this.detectFromStorage();
    if (storageDetection) {
      return {
        tenantId: storageDetection,
        isProduction: false,
        configSource: 'runtime'
      };
    }

    // Fallback
    return {
      tenantId: 'test',
      isProduction: false,
      configSource: 'default'
    };
  }

  /**
   * Detect tenant from hostname
   */
  private detectFromHostname(): TenantType | null {
    if (typeof window === 'undefined') return null;
    
    const hostname = window.location.hostname.toLowerCase();
    
    const hostnameMap: Record<string, TenantType> = {
      'armenia.geogestion.com': 'armenia',
      'armenia-api.geogestion.com': 'armenia',
      'manizales.geogestion.com': 'manizales',
      'manizales-api.geogestion.com': 'manizales',
      'barrancabermeja.geogestion.com': 'barrancabermeja',
      'calarca.geogestion.com': 'calarca',
      'filandia.geogestion.com': 'filandia',
      'masora.geogestion.com': 'masora',
      'montenegro.geogestion.com': 'montenegro',
      'quimbaya.geogestion.com': 'quimbaya',
      'test.geogestion.com': 'test'
    };

    return hostnameMap[hostname] || null;
  }

  /**
   * Detect tenant from environment variables or URL params
   */
  private detectFromEnvironment(): TenantType | null {
    if (typeof window === 'undefined') return null;
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tenantParam = urlParams.get('tenant') as TenantType;
    
    if (tenantParam && this.isValidTenant(tenantParam)) {
      return tenantParam;
    }

    return null;
  }

  /**
   * Detect tenant from local storage
   */
  private detectFromStorage(): TenantType | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const storedTenant = localStorage.getItem('selectedTenant') as TenantType;
      return this.isValidTenant(storedTenant) ? storedTenant : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if production environment
   */
  private isProductionEnvironment(): boolean {
    if (typeof window === 'undefined') return false;
    
    const hostname = window.location.hostname;
    return !hostname.includes('localhost') && 
           !hostname.includes('127.0.0.1') && 
           !hostname.includes('test');
  }

  /**
   * Validate tenant type
   */
  private isValidTenant(tenant: string): tenant is TenantType {
    const validTenants: TenantType[] = [
      'armenia', 'barrancabermeja', 'calarca', 'filandia', 
      'manizales', 'masora', 'montenegro', 'quimbaya', 'test'
    ];
    return validTenants.includes(tenant as TenantType);
  }

  /**
   * Manually set tenant (for development/testing)
   */
  setTenant(tenantId: TenantType): void {
    try {
      const config = this.configFactory.createConfig(tenantId);
      this.detectedTenant = tenantId;
      this.currentTenantSubject.next(config);
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedTenant', tenantId);
      }
    } catch (error) {
      console.error('Error setting tenant:', error);
    }
  }

  /**
   * Get current tenant configuration
   */
  getCurrentTenant(): TenantConfig | null {
    return this.currentTenantSubject.value;
  }

  /**
   * Get current tenant ID
   */
  getCurrentTenantId(): TenantType | null {
    return this.detectedTenant;
  }

  /**
   * Check if a feature is enabled for current tenant
   */
  isFeatureEnabled(feature: keyof TenantFeatures): boolean {
    const tenant = this.getCurrentTenant();
    const featureValue = tenant?.features[feature];
    
    // Handle boolean features
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    
    // Handle array features (customFeatures)
    if (Array.isArray(featureValue)) {
      return featureValue.length > 0;
    }
    
    return false;
  }

  /**
   * Get API endpoint for current tenant
   */
  getApiEndpoint(service: string, endpoint?: string): string {
    const tenant = this.getCurrentTenant();
    if (!tenant) return '';

    const baseUrl = `${tenant.apiConfig.baseUrl}:${tenant.apiConfig.port}`;
    const serviceConfig = tenant.apiConfig.endpoints[service];
    
    if (!serviceConfig) return baseUrl;
    
    if (endpoint && serviceConfig[endpoint]) {
      return `${baseUrl}${serviceConfig[endpoint]}`;
    }
    
    return `${baseUrl}${serviceConfig.value}`;
  }

  /**
   * Get asset path for current tenant
   */
  getAssetPath(assetType: keyof TenantConfig['assets']): string {
    const tenant = this.getCurrentTenant();
    return tenant?.assets[assetType] ?? '';
  }

  /**
   * Get theme configuration for current tenant
   */
  getThemeConfig(): TenantConfig['theme'] | null {
    const tenant = this.getCurrentTenant();
    return tenant?.theme ?? null;
  }

  /**
   * Get AWS configuration for current tenant
   */
  getAwsConfig(): TenantConfig['awsConfig'] | null {
    const tenant = this.getCurrentTenant();
    return tenant?.awsConfig ?? null;
  }

  /**
   * Switch tenant at runtime (for multi-tenant admin interfaces)
   */
  switchTenant(tenantId: TenantType): Observable<boolean> {
    try {
      this.setTenant(tenantId);
      return of(true);
    } catch (error) {
      console.error('Error switching tenant:', error);
      return of(false);
    }
  }

  /**
   * Get list of available tenants
   */
  getAvailableTenants(): TenantType[] {
    return [
      'armenia', 'barrancabermeja', 'calarca', 'filandia',
      'manizales', 'masora', 'montenegro', 'quimbaya', 'test'
    ];
  }
}