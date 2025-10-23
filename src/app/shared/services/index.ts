// Shared services barrel exports
// Export services that exist with correct paths

// Loading service
export { LoadingServiceService } from '../../apps/services/general/loading-service.service';

// Title service
export { TitleService } from '../../apps/services/general/tittle.service';

// Comments service
export { CommentsService } from '../../apps/services/comments/comments.service';

// Alert services
export { AlertsService as AlertesService } from '../../apps/services/alerts/alertes.service';

// Re-export with common naming patterns for backward compatibility
export { AlertsService } from '../../apps/services/alerts/alertes.service';

// Splash screen service
export { SplashScreenService } from '../../apps/services/core/splash-screen.service';

// TODO: BMP Core services - verificar rutas exactas
// export { AlfaMainService } from '../../apps/services/bmp/core/alfa-main.service';
// export { AttachmentService } from '../../apps/services/bmp/core/document/main/attachment.service';

// Collection service
export { CollectionServices } from '../../apps/services/general/collection.service';

// BMP services - comentado temporalmente por problemas de acceso al archivo
// export { ParticipantsService } from '../../apps/services/bmp/participants-service.service';

// Territorial organization service
export { TerritorialOrganizationService } from '../../apps/services/territorial-organization/territorial-organization.service';

// Document management service
export { AttachmentService } from '../../apps/services/document-management/document-management.service';

// Geographic service
export { InformationGeographicService } from '../../apps/services/geographics/information-geographic.service';
// export { TitleService } from '../../apps/services/title/title.service';