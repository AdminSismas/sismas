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
// export { AlfaMainService } from '../../apps/services/bpmcore/alfa-main.service';
// export { AttachmentService } from '../../apps/services/bpmcore/document/main/attachment.service';

// Collection service
export { CollectionServices } from '../../apps/services/general/collection.service';

// BMP services - temporarily commented due to path issues
// export { ParticipantsService } from '../../apps/services/bpmparticipants-service.service';

// Territorial organization service
export { TerritorialOrganizationService } from '../../apps/services/territorial-organization/territorial-organization.service';
export { InformationPropertyService } from '../../apps/services/territorial-organization/information-property.service';

// Document management service
export { AttachmentService } from '../../apps/services/document-management/document-management.service';

// Geographic service
export { InformationGeographicService } from '../../apps/services/geographics/information-geographic.service';

// BMP Core services
export { AlfaMainService } from '../../apps/services/bpm/core/alfa-main.service';
export { ParticipantsService } from '../../apps/services/bpm/participants-service.service';
export { InformationPersonService } from '../../apps/services/bpm/information-person.service';

// Operation support services  
export { DownloadReportsService } from '../../apps/services/operation-support/reports/download-reports.service';

// Information property services
export { BaunitIcaService } from '../../apps/components/information-property/baunit-ica/services/baunit-ica.service';

// export { TitleService } from '../../apps/services/title/title.service';
