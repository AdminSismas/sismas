// Shared services barrel exports
// Export services from apps/services for backward compatibility

// BMP Core services
export { BmpCoreService } from '../../apps/services/bmp/bmp-core.service';
export { AlfaMainService } from '../../apps/services/bmp/core/alfa-main.service';
export { AttachmentService } from '../../apps/services/bmp/core/document/main/attachment.service';

// Alert services
export { AlertsService as AlertesService } from '../../apps/services/alerts/alertes.service';

// Re-export with common naming patterns for backward compatibility
export { AlertsService } from '../../apps/services/alerts/alertes.service';

// Placeholder exports for missing services - these need to be implemented or paths corrected
// export { ParticipantsService } from '../../apps/services/bmp/participants-service.service';
// export { CommentsService } from '../../apps/services/bmp/core/document/comments/comments.service';
// export { CollectionServices } from '../../apps/services/collections/collection.service';
// export { LoadingServiceService } from '../../apps/services/loading/loading-service.service';
// export { TitleService } from '../../apps/services/title/title.service';
// export { SplashScreenService } from '../../apps/services/splash-screen/splash-screen.service';