import { Injectable } from '@angular/core';
import {
  TenantConfig,
  TenantType,
  TenantFeatures,
  TenantApiConfig,
} from '@features/tenant-configuration';

@Injectable({
  providedIn: 'root'
})
export class TenantConfigFactory {

  /**
   * Create tenant configuration based on tenant type
   */
  createConfig(tenantId: TenantType): TenantConfig {
    const strategy = this.configStrategies[tenantId];
    if (!strategy) {
      throw new Error(`Configuration strategy not found for tenant: ${tenantId}`);
    }

    return strategy();
  }

  /**
   * Get base configuration shared by all tenants
   */
  private getBaseConfig(): Partial<TenantConfig> {
    return {
      features: this.getDefaultFeatures(),
      apiConfig: this.getBaseApiConfig(),
    };
  }

  /**
   * Default features enabled for all tenants
   */
  private getDefaultFeatures(): TenantFeatures {
    return {
      bpmWorkflows: true,
      geographicViewer: true,
      propertyManagement: true,
      documentManagement: true,
      economicZones: true,
      administrativeSources: true,
      customFeatures: []
    };
  }

  /**
   * Base API configuration
   */
  private getBaseApiConfig(): TenantApiConfig {
    return {
      baseUrl: 'https://api.example.com',
      port: 8080,
      endpoints: {
        auth: {
          value: '/auth',
          login: '/login',
          logout: '/logout',
          refresh: '/refresh'
        },
        bpm: {
          value: '/bpm',
          tasks: '/tasks',
          workflows: '/workflows'
        },
        geo: {
          value: '/geo',
          maps: '/maps',
          data: '/data'
        },
        property: {
          value: '/property',
          search: '/search',
          details: '/details'
        }
      }
    };
  }

  /**
   * Configuration strategies for each tenant
   */
  private configStrategies: Record<TenantType, () => TenantConfig> = {
    armenia: () => this.createArmeniaConfig(),
    barrancabermeja: () => this.createBarrancabermejaConfig(),
    calarca: () => this.createCalarcaConfig(),
    filandia: () => this.createFilandiaConfig(),
    manizales: () => this.createManizalesConfig(),
    masora: () => this.createMasoraConfig(),
    montenegro: () => this.createMontenegroConfig(),
    quimbaya: () => this.createQuimbayaConfig(),
    test: () => this.createTestConfig()
  };

  private createArmeniaConfig(): TenantConfig {
    return {
      ...this.getBaseConfig(),
      tenantId: 'armenia',
      municipalityName: 'Armenia',
      theme: {
        primaryColor: '#1976d2',
        secondaryColor: '#ff5722',
        logoPath: 'assets/logo/armenia.png',
        faviconPath: 'assets/favicon/armenia.ico'
      },
      apiConfig: {
        ...this.getBaseApiConfig(),
        baseUrl: 'https://armenia-api.geogestion.com',
        port: 8080
      },
      awsConfig: {
        accessKeyId: 'AKIAW5WU5HQB6DQ52QVS',
        bucketName: 'geo-armenia-bucket',
        region: 'us-east-1'
      },
      assets: {
        logoPath: 'assets/logo/armenia.png',
        loadingLogo: 'assets/logo/armenia-loading.png',
        faviconPath: 'assets/favicon/armenia.ico'
      }
    } as TenantConfig;
  }

  private createManizalesConfig(): TenantConfig {
    return {
      ...this.getBaseConfig(),
      tenantId: 'manizales',
      municipalityName: 'Manizales',
      theme: {
        primaryColor: '#4caf50',
        secondaryColor: '#ff9800',
        logoPath: 'assets/logo/manizales.png',
        faviconPath: 'assets/favicon/manizales.ico'
      },
      apiConfig: {
        ...this.getBaseApiConfig(),
        baseUrl: 'https://manizales-api.geogestion.com',
        port: 8080
      },
      awsConfig: {
        accessKeyId: 'AKIAW5WU5HQB6DQ52QVS',
        bucketName: 'geo-manizales-bucket',
        region: 'us-east-1'
      },
      assets: {
        logoPath: 'assets/logo/manizales.png',
        loadingLogo: 'assets/logo/manizales-loading.png',
        faviconPath: 'assets/favicon/manizales.ico'
      }
    } as TenantConfig;
  }

  private createBarrancabermejaConfig(): TenantConfig {
    return {
      ...this.getBaseConfig(),
      tenantId: 'barrancabermeja',
      municipalityName: 'Barrancabermeja',
      theme: {
        primaryColor: '#f44336',
        secondaryColor: '#2196f3',
        logoPath: 'assets/logo/barrancabermeja.png'
      },
      apiConfig: {
        ...this.getBaseApiConfig(),
        baseUrl: 'https://barrancabermeja-api.geogestion.com'
      },
      awsConfig: {
        accessKeyId: 'AKIAW5WU5HQB6DQ52QVS',
        bucketName: 'geo-barrancabermeja-bucket',
        region: 'us-east-1'
      },
      assets: {
        logoPath: 'assets/logo/barrancabermeja.png',
        loadingLogo: 'assets/logo/barrancabermeja-loading.png'
      }
    } as TenantConfig;
  }

  private createCalarcaConfig(): TenantConfig {
    return {
      ...this.getBaseConfig(),
      tenantId: 'calarca',
      municipalityName: 'Calarcá',
      theme: {
        primaryColor: '#9c27b0',
        logoPath: 'assets/logo/calarca.png'
      },
      apiConfig: {
        ...this.getBaseApiConfig(),
        baseUrl: 'https://calarca-api.geogestion.com'
      },
      awsConfig: {
        accessKeyId: 'AKIAW5WU5HQB6DQ52QVS',
        bucketName: 'geo-calarca-bucket',
        region: 'us-east-1'
      },
      assets: {
        logoPath: 'assets/logo/calarca.png',
        loadingLogo: 'assets/logo/calarca-loading.png'
      }
    } as TenantConfig;
  }

  private createFilandiaConfig(): TenantConfig {
    return {
      ...this.getBaseConfig(),
      tenantId: 'filandia',
      municipalityName: 'Filandia',
      theme: {
        primaryColor: '#607d8b',
        logoPath: 'assets/logo/filandia.png'
      },
      apiConfig: {
        ...this.getBaseApiConfig(),
        baseUrl: 'https://filandia-api.geogestion.com'
      },
      awsConfig: {
        accessKeyId: 'AKIAW5WU5HQB6DQ52QVS',
        bucketName: 'geo-filandia-bucket',
        region: 'us-east-1'
      },
      assets: {
        logoPath: 'assets/logo/filandia.png',
        loadingLogo: 'assets/logo/filandia-loading.png'
      }
    } as TenantConfig;
  }

  private createMasoraConfig(): TenantConfig {
    return {
      ...this.getBaseConfig(),
      tenantId: 'masora',
      municipalityName: 'Masora',
      theme: {
        primaryColor: '#ff5722',
        logoPath: 'assets/logo/masora.png'
      },
      apiConfig: {
        ...this.getBaseApiConfig(),
        baseUrl: 'https://masora-api.geogestion.com'
      },
      awsConfig: {
        accessKeyId: 'AKIAW5WU5HQB6DQ52QVS',
        bucketName: 'geo-masora-bucket',
        region: 'us-east-1'
      },
      assets: {
        logoPath: 'assets/logo/masora.png',
        loadingLogo: 'assets/logo/masora-loading.png'
      }
    } as TenantConfig;
  }

  private createMontenegroConfig(): TenantConfig {
    return {
      ...this.getBaseConfig(),
      tenantId: 'montenegro',
      municipalityName: 'Montenegro',
      theme: {
        primaryColor: '#795548',
        logoPath: 'assets/logo/montenegro.png'
      },
      apiConfig: {
        ...this.getBaseApiConfig(),
        baseUrl: 'https://montenegro-api.geogestion.com'
      },
      awsConfig: {
        accessKeyId: 'AKIAW5WU5HQB6DQ52QVS',
        bucketName: 'geo-montenegro-bucket',
        region: 'us-east-1'
      },
      assets: {
        logoPath: 'assets/logo/montenegro.png',
        loadingLogo: 'assets/logo/montenegro-loading.png'
      }
    } as TenantConfig;
  }

  private createQuimbayaConfig(): TenantConfig {
    return {
      ...this.getBaseConfig(),
      tenantId: 'quimbaya',
      municipalityName: 'Quimbaya',
      theme: {
        primaryColor: '#3f51b5',
        logoPath: 'assets/logo/quimbaya.png'
      },
      apiConfig: {
        ...this.getBaseApiConfig(),
        baseUrl: 'https://quimbaya-api.geogestion.com'
      },
      awsConfig: {
        accessKeyId: 'AKIAW5WU5HQB6DQ52QVS',
        bucketName: 'geo-quimbaya-bucket',
        region: 'us-east-1'
      },
      assets: {
        logoPath: 'assets/logo/quimbaya.png',
        loadingLogo: 'assets/logo/quimbaya-loading.png'
      }
    } as TenantConfig;
  }

  private createTestConfig(): TenantConfig {
    return {
      ...this.getBaseConfig(),
      tenantId: 'test',
      municipalityName: 'Test Environment',
      theme: {
        primaryColor: '#9e9e9e',
        logoPath: 'assets/logo/test.png'
      },
      apiConfig: {
        ...this.getBaseApiConfig(),
        baseUrl: 'https://test-api.geogestion.com'
      },
      awsConfig: {
        accessKeyId: 'AKIAW5WU5HQB6DQ52QVS',
        bucketName: 'geo-test-bucket',
        region: 'us-east-1'
      },
      assets: {
        logoPath: 'assets/logo/test.png',
        loadingLogo: 'assets/logo/test-loading.png'
      }
    } as TenantConfig;
  }
}
