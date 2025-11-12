/**
 * Interface for tenant-specific configuration
 */
export interface TenantConfig {
  tenantId: string;
  municipalityName: string;
  theme: TenantTheme;
  features: TenantFeatures;
  apiConfig: TenantApiConfig;
  awsConfig: TenantAwsConfig;
  assets: TenantAssets;
}

/**
 * Theme configuration for tenant
 */
export interface TenantTheme {
  primaryColor?: string;
  secondaryColor?: string;
  logoPath: string;
  faviconPath?: string;
  customCss?: string;
}

/**
 * Feature flags and capabilities per tenant
 */
export interface TenantFeatures {
  bpmWorkflows: boolean;
  geographicViewer: boolean;
  propertyManagement: boolean;
  documentManagement: boolean;
  economicZones: boolean;
  administrativeSources: boolean;
  customFeatures?: string[];
}

/**
 * API endpoints and configuration per tenant
 */
export interface TenantApiConfig {
  baseUrl: string;
  port: number;
  endpoints: {
    auth: ApiEndpoints;
    bpm: ApiEndpoints;
    geo: ApiEndpoints;
    property: ApiEndpoints;
    [key: string]: ApiEndpoints;
  };
}

/**
 * API endpoints structure
 */
export interface ApiEndpoints {
  value: string;
  login?: string;
  logout?: string;
  refresh?: string;
  [key: string]: string | undefined;
}

/**
 * AWS configuration for tenant
 */
export interface TenantAwsConfig {
  accessKeyId: string;
  bucketName: string;
  region: string;
  secretAccessKey?: string;
}

/**
 * Asset paths for tenant
 */
export interface TenantAssets {
  logoPath: string;
  loadingLogo: string;
  faviconPath?: string;
  documentsPath?: string;
}

/**
 * Supported tenant types
 */
export type TenantType = 
  | 'armenia' 
  | 'barrancabermeja' 
  | 'calarca' 
  | 'filandia' 
  | 'manizales' 
  | 'masora' 
  | 'montenegro' 
  | 'quimbaya' 
  | 'test';

/**
 * Environment detection result
 */
export interface TenantDetectionResult {
  tenantId: TenantType;
  isProduction: boolean;
  configSource: 'environment' | 'runtime' | 'default';
}