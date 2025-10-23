import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TenantConfigService } from '@features/tenant-configuration';
import { TenantType, TenantConfig } from '@features/tenant-configuration';

@Component({
  selector: 'vex-tenant-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-card class="tenant-switcher-card">
      <mat-card-header>
        <mat-icon mat-card-avatar>settings</mat-icon>
        <mat-card-title>Selector de Tenant (Desarrollo)</mat-card-title>
        <mat-card-subtitle>
          Actual: {{ currentConfig?.municipalityName || 'No detectado' }}
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="current-tenant-info" *ngIf="currentConfig">
          <h4>Configuración Actual:</h4>
          <ul>
            <li><strong>ID:</strong> {{ currentConfig.tenantId }}</li>
            <li><strong>Municipio:</strong> {{ currentConfig.municipalityName }}</li>
            <li><strong>API:</strong> {{ currentConfig.apiConfig.baseUrl }}</li>
            <li><strong>Tema:</strong> {{ currentConfig.theme.primaryColor }}</li>
            <li><strong>Features:</strong> 
              <span *ngFor="let feature of getEnabledFeatures(); let last = last">
                {{ feature }}<span *ngIf="!last">, </span>
              </span>
            </li>
          </ul>
        </div>

        <mat-form-field appearance="outline" class="tenant-selector">
          <mat-label>Cambiar Tenant</mat-label>
          <mat-select [formControl]="tenantControl" (selectionChange)="onTenantChange($event.value)">
            <mat-option *ngFor="let tenant of availableTenants" [value]="tenant.id">
              {{ tenant.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="detection-info">
          <h4>Información de Detección:</h4>
          <ul>
            <li><strong>Hostname:</strong> {{ detectionInfo.hostname }}</li>
            <li><strong>URL Param:</strong> {{ detectionInfo.urlParam || 'No detectado' }}</li>
            <li><strong>LocalStorage:</strong> {{ detectionInfo.localStorage || 'No encontrado' }}</li>
            <li><strong>Método usado:</strong> {{ detectionInfo.detectionMethod }}</li>
          </ul>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="reloadWithTenant()">
          <mat-icon>refresh</mat-icon>
          Recargar con Tenant Seleccionado
        </button>
        <button mat-stroked-button (click)="clearCache()">
          <mat-icon>clear</mat-icon>
          Limpiar Cache
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .tenant-switcher-card {
      max-width: 600px;
      margin: 20px;
    }

    .current-tenant-info,
    .detection-info {
      margin: 16px 0;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .current-tenant-info ul,
    .detection-info ul {
      margin: 8px 0;
      padding-left: 20px;
    }

    .tenant-selector {
      width: 100%;
      margin: 16px 0;
    }

    mat-card-actions {
      display: flex;
      gap: 12px;
    }

    h4 {
      margin: 0 0 8px 0;
      color: #333;
    }
  `]
})
export class TenantSwitcherComponent implements OnInit {
  tenantControl = new FormControl();
  currentConfig: TenantConfig | null = null;
  
  availableTenants = [
    { id: 'armenia' as TenantType, name: 'Armenia' },
    { id: 'manizales' as TenantType, name: 'Manizales' },
    { id: 'barrancabermeja' as TenantType, name: 'Barrancabermeja' },
    { id: 'calarca' as TenantType, name: 'Calarca' },
    { id: 'filandia' as TenantType, name: 'Filandia' },
    { id: 'masora' as TenantType, name: 'Masora' },
    { id: 'montenegro' as TenantType, name: 'Montenegro' },
    { id: 'quimbaya' as TenantType, name: 'Quimbaya' },
    { id: 'test' as TenantType, name: 'Test Environment' }
  ];

  detectionInfo = {
    hostname: '',
    urlParam: '',
    localStorage: '',
    detectionMethod: ''
  };

  constructor(private tenantConfigService: TenantConfigService) {}

  ngOnInit() {
    this.loadCurrentConfig();
    this.loadDetectionInfo();
    
    // Suscribirse a cambios de tenant
    this.tenantConfigService.tenantChanged$.subscribe(() => {
      this.loadCurrentConfig();
    });
  }

  private loadCurrentConfig() {
    this.currentConfig = this.tenantConfigService.getCurrentTenantConfig();
    if (this.currentConfig) {
      this.tenantControl.setValue(this.currentConfig.tenantId, { emitEvent: false });
    }
  }

  private loadDetectionInfo() {
    this.detectionInfo = {
      hostname: window.location.hostname,
      urlParam: this.getUrlParam('tenant'),
      localStorage: localStorage.getItem('selectedTenant') || '',
      detectionMethod: this.getDetectionMethod()
    };
  }

  private getUrlParam(param: string): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
  }

  private getDetectionMethod(): string {
    if (this.getUrlParam('tenant')) return 'URL Parameter';
    if (this.tenantConfigService.detectTenantFromHostname()) return 'Hostname';
    if (localStorage.getItem('selectedTenant')) return 'LocalStorage';
    return 'Default Fallback';
  }

  getEnabledFeatures(): string[] {
    if (!this.currentConfig) return [];
    
    return Object.entries(this.currentConfig.features)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature);
  }

  onTenantChange(tenantId: TenantType) {
    this.tenantConfigService.switchTenant(tenantId);
    this.loadDetectionInfo();
  }

  reloadWithTenant() {
    const currentTenant = this.tenantControl.value;
    if (currentTenant) {
      // Agregar parámetro tenant a la URL y recargar
      const url = new URL(window.location.href);
      url.searchParams.set('tenant', currentTenant);
      window.location.href = url.toString();
    }
  }

  clearCache() {
    localStorage.removeItem('selectedTenant');
    // Recargar sin parámetros
    const url = new URL(window.location.href);
    url.searchParams.delete('tenant');
    window.location.href = url.toString();
  }
}