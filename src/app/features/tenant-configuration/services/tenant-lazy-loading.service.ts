import { Injectable, Injector, ComponentRef, ViewContainerRef } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { TenantConfigService } from '@features/tenant-configuration';
import { TenantType } from '@features/tenant-configuration';

interface LazyComponentConfig {
  componentPath: string;
  modulePath?: string;
  exportName: string;
}

interface TenantLazyMap {
  [key: string]: LazyComponentConfig;
}

@Injectable({
  providedIn: 'root'
})
export class TenantLazyLoadingService {
  private tenantComponentsMap: Record<TenantType, TenantLazyMap> = {
    armenia: {
      'custom-header': {
        componentPath: './tenant-specific/armenia/components/custom-header.component',
        exportName: 'ArmeniaCustomHeaderComponent'
      },
      'custom-footer': {
        componentPath: './tenant-specific/armenia/components/custom-footer.component',
        exportName: 'ArmeniaCustomFooterComponent'
      }
    },
    manizales: {
      'custom-header': {
        componentPath: './tenant-specific/manizales/components/custom-header.component',
        exportName: 'ManizalesCustomHeaderComponent'
      },
      'custom-report': {
        componentPath: './tenant-specific/manizales/components/custom-report.component',
        exportName: 'ManizalesCustomReportComponent'
      }
    },
    barrancabermeja: {
      'custom-workflow': {
        componentPath: './tenant-specific/barrancabermeja/components/custom-workflow.component',
        exportName: 'BarrancabermejaCustomWorkflowComponent'
      }
    },
    calarca: {
      'custom-map': {
        componentPath: './tenant-specific/calarca/components/custom-map.component',
        exportName: 'CalarcaCustomMapComponent'
      }
    },
    filandia: {
      'custom-dashboard': {
        componentPath: './tenant-specific/filandia/components/custom-dashboard.component',
        exportName: 'FilandiaCustomDashboardComponent'
      }
    },
    masora: {
      'custom-analytics': {
        componentPath: './tenant-specific/masora/components/custom-analytics.component',
        exportName: 'MasoraCustomAnalyticsComponent'
      }
    },
    montenegro: {
      'custom-forms': {
        componentPath: './tenant-specific/montenegro/components/custom-forms.component',
        exportName: 'MontenegroCustomFormsComponent'
      }
    },
    quimbaya: {
      'custom-reports': {
        componentPath: './tenant-specific/quimbaya/components/custom-reports.component',
        exportName: 'QuimbayaCustomReportsComponent'
      }
    },
    test: {
      'test-component': {
        componentPath: './tenant-specific/test/components/test.component',
        exportName: 'TestComponent'
      }
    }
  };

  private fallbackComponentsMap: TenantLazyMap = {
    'default-header': {
      componentPath: './shared/ui/components/default-header.component',
      exportName: 'DefaultHeaderComponent'
    },
    'default-footer': {
      componentPath: './shared/ui/components/default-footer.component',
      exportName: 'DefaultFooterComponent'
    }
  };

  constructor(
    private tenantConfigService: TenantConfigService,
    private injector: Injector
  ) {}

  /**
   * Load a component dynamically based on current tenant configuration
   */
  loadTenantComponent<T>(
    componentKey: string,
    viewContainer: ViewContainerRef
  ): Observable<ComponentRef<T>> {
    const currentTenant = this.tenantConfigService.getCurrentTenantId();
    
    if (!currentTenant) {
      return throwError(() => new Error('No tenant configured'));
    }

    const componentConfig = this.getTenantComponentConfig(currentTenant, componentKey);
    
    if (!componentConfig) {
      console.warn(`Component '${componentKey}' not found for tenant '${currentTenant}', using fallback`);
      return this.loadFallbackComponent<T>(componentKey, viewContainer);
    }

    return this.dynamicImportComponent<T>(componentConfig, viewContainer);
  }

  /**
   * Load a fallback component when tenant-specific component is not available
   */
  loadFallbackComponent<T>(
    componentKey: string,
    viewContainer: ViewContainerRef
  ): Observable<ComponentRef<T>> {
    const fallbackConfig = this.fallbackComponentsMap[componentKey] || 
                          this.fallbackComponentsMap['default-header'];

    return this.dynamicImportComponent<T>(fallbackConfig, viewContainer);
  }

  /**
   * Check if a tenant has a specific component available
   */
  hasTenantComponent(componentKey: string, tenantId?: TenantType): boolean {
    const tenant = tenantId || this.tenantConfigService.getCurrentTenantId();
    
    if (!tenant) return false;

    return !!(this.tenantComponentsMap[tenant]?.[componentKey]);
  }

  /**
   * Get all available components for current tenant
   */
  getTenantAvailableComponents(): string[] {
    const currentTenant = this.tenantConfigService.getCurrentTenantId();
    
    if (!currentTenant) return [];

    return Object.keys(this.tenantComponentsMap[currentTenant] || {});
  }

  /**
   * Preload tenant-specific components for better performance
   */
  preloadTenantComponents(tenantId?: TenantType): Observable<void[]> {
    const tenant = tenantId || this.tenantConfigService.getCurrentTenantId();
    
    if (!tenant) return throwError(() => new Error('No tenant specified'));

    const componentConfigs = Object.values(this.tenantComponentsMap[tenant] || {});
    const preloadPromises = componentConfigs.map(config => 
      import(config.componentPath).catch(error => {
        console.warn(`Failed to preload component: ${config.componentPath}`, error);
        return null;
      })
    );

    return from(Promise.all(preloadPromises));
  }

  /**
   * Register a new tenant component at runtime
   */
  registerTenantComponent(
    tenantId: TenantType,
    componentKey: string,
    config: LazyComponentConfig
  ): void {
    if (!this.tenantComponentsMap[tenantId]) {
      this.tenantComponentsMap[tenantId] = {};
    }

    this.tenantComponentsMap[tenantId][componentKey] = config;
  }

  /**
   * Get component configuration for specific tenant
   */
  private getTenantComponentConfig(
    tenantId: TenantType,
    componentKey: string
  ): LazyComponentConfig | null {
    return this.tenantComponentsMap[tenantId]?.[componentKey] || null;
  }

  /**
   * Dynamically import and create component
   */
  private dynamicImportComponent<T>(
    config: LazyComponentConfig,
    viewContainer: ViewContainerRef
  ): Observable<ComponentRef<T>> {
    return from(
      import(config.componentPath)
        .then(module => {
          const componentClass = module[config.exportName];
          
          if (!componentClass) {
            throw new Error(`Component '${config.exportName}' not found in module '${config.componentPath}'`);
          }

          viewContainer.clear();
          const componentRef = viewContainer.createComponent<T>(
            componentClass,
            { injector: this.injector }
          );

          return componentRef;
        })
        .catch(error => {
          console.error(`Failed to load component '${config.exportName}':`, error);
          throw error;
        })
    );
  }

  /**
   * Clean up all loaded components in container
   */
  clearTenantComponents(viewContainer: ViewContainerRef): void {
    viewContainer.clear();
  }

  /**
   * Switch tenant and reload components if needed
   */
  switchTenantComponents(
    newTenantId: TenantType,
    componentsToReload: Array<{
      key: string;
      viewContainer: ViewContainerRef;
    }>
  ): Observable<ComponentRef<any>[]> {
    const reloadPromises = componentsToReload.map(({ key, viewContainer }) =>
      this.loadTenantComponent(key, viewContainer).toPromise()
    );

    return from(Promise.all(reloadPromises));
  }
}